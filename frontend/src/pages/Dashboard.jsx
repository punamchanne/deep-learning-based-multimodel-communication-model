import React, { useState, useEffect, useRef } from 'react';
import Navbar from '../components/Navbar';
import WebcamFeed from '../components/WebcamFeed';
import OutputPanel from '../components/OutputPanel';
import ControlPanel from '../components/ControlPanel';
import { Volume2, VolumeX, FileDown } from 'lucide-react';

const Dashboard = () => {
  const [isDetecting, setIsDetecting] = useState(false);
  const [gaze, setGaze] = useState('CENTER');
  const [blink, setBlink] = useState(false);
  const [smile, setSmile] = useState(false);
  const [mouthOpen, setMouthOpen] = useState(false);
  const [eyebrowsUp, setEyebrowsUp] = useState(false);
  const [faceDetected, setFaceDetected] = useState(false);
  
  const [ttsEnabled, setTtsEnabled] = useState(true);
  const [messages, setMessages] = useState([]);
  const [currentSelection, setCurrentSelection] = useState('Initializing AI...');
  
  const ws = useRef(null);
  const lastSpokenRef = useRef('');
  const cooldownRef = useRef(false);
  
  // Stability Buffers
  const frameCounterRef = useRef({ type: '', count: 0 });
  const neutralCounterRef = useRef(0);
  const isLockedRef = useRef(false);


  const PHRASE_MAP = {
    'BLINK': "confirm action",
    'DOUBLE_BLINK': "alert / emergency",
    'LEFT': "navigation",
    'RIGHT': "navigation",
    'NOD': "yes",
    'SHAKE': "no",
    'MOUTH': "activate system",
    'SMILE': "positive feedback",
    'EYEBROWS': "attention reminder"
  };

  const speak = (text) => {
    if (ttsEnabled && 'speechSynthesis' in window && !cooldownRef.current) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      window.speechSynthesis.speak(utterance);
      cooldownRef.current = true;
      setTimeout(() => { cooldownRef.current = false; }, 2000);
    }
  };

  const handleTrigger = async (type) => {
    if (isLockedRef.current) return;
    
    const phrase = PHRASE_MAP[type];
    if (!phrase) return;

    if (frameCounterRef.current.type === type) {
      frameCounterRef.current.count += 1;
    } else {
      frameCounterRef.current = { type: type, count: 1 };
    }

    const requiredFrames = 2;

    if (frameCounterRef.current.count >= requiredFrames) {
      const timestamp = new Date().toISOString();
      const displayTime = new Date().toLocaleTimeString();
      
      setMessages(prev => [{ text: phrase, time: displayTime }, ...prev].slice(0, 50));
      speak(phrase);
      setCurrentSelection(phrase);

      // Save Log to Backend
      try {
        const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:8000';
        const token = localStorage.getItem('token');
        await fetch(`${apiUrl}/logs`, {
          method: 'POST',
          headers: { 
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify({ 
            expression_type: type,
            phrase: phrase,
            timestamp: timestamp
          })
        });
      } catch (err) {
        console.error("Failed to save log:", err);
      }

      isLockedRef.current = true;
      neutralCounterRef.current = 0;
      frameCounterRef.current = { type: '', count: 0 };
    }
  };

  const downloadPDF = async () => {
    try {
      const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:8000';
      const token = localStorage.getItem('token');
      const response = await fetch(`${apiUrl}/logs`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const logs = await response.json();

      const { jsPDF } = window.jspdf;
      const doc = new jsPDF();

      // Add Title
      doc.setFontSize(20);
      doc.text("GazeSense Communication Report", 14, 22);
      doc.setFontSize(11);
      doc.setTextColor(100);
      doc.text(`Generated on: ${new Date().toLocaleString()}`, 14, 30);

      // Add Table
      const tableColumn = ["Date", "Time", "Expression", "Action"];
      const tableRows = logs.map(log => {
        const d = new Date(log.timestamp);
        return [
          d.toLocaleDateString(),
          d.toLocaleTimeString(),
          log.expression_type,
          log.phrase
        ];
      });

      doc.autoTable({
        head: [tableColumn],
        body: tableRows,
        startY: 35,
        theme: 'grid',
        headStyles: { fillColor: [79, 70, 229] } // Brand color
      });

      doc.save(`GazeSense_Report_${new Date().toLocaleDateString()}.pdf`);
    } catch (err) {
      console.error(err);
      alert("Failed to download PDF report");
    }
  };

  const startDetection = () => {
    const wsUrl = import.meta.env.VITE_WS_URL || 'ws://localhost:8000';
    ws.current = new WebSocket(`${wsUrl}/ws/detect`);
    
    ws.current.onopen = () => {
      setIsDetecting(true);
      setCurrentSelection('Searching for expressions...');
    };

    ws.current.onmessage = (event) => {
      const data = JSON.parse(event.data);
      setGaze(data.gaze);
      setBlink(data.blink);
      setSmile(data.smile);
      setMouthOpen(data.mouth_open);
      setEyebrowsUp(data.eyebrows_up);
      setFaceDetected(data.face_detected);

      if (!data.face_detected) {
        lastSpokenRef.current = '';
        setCurrentSelection('Face Not Found');
        return;
      }

      let activeType = null;
      if (data.double_blink) activeType = 'DOUBLE_BLINK';
      else if (data.head_nod) activeType = 'NOD';
      else if (data.head_shake) activeType = 'SHAKE';
      else if (data.mouth_open) activeType = 'MOUTH';
      else if (data.gaze === 'LEFT') activeType = 'LEFT';
      else if (data.gaze === 'RIGHT') activeType = 'RIGHT';
      else if (data.blink) activeType = 'BLINK';
      else if (data.smile) activeType = 'SMILE';
      else if (data.eyebrows_up) activeType = 'EYEBROWS';

      if (activeType) {
        handleTrigger(activeType);
        neutralCounterRef.current = 0;
      } else {
        neutralCounterRef.current += 1;
        if (neutralCounterRef.current >= 10) {
          isLockedRef.current = false;
          setCurrentSelection('Searching for expressions...');
        }
      }
    };


    ws.current.onerror = (error) => {
      console.error("WebSocket Error: ", error);
      setIsDetecting(false);
    };

    ws.current.onclose = () => {
      setIsDetecting(false);
    };
  };

  const stopDetection = () => {
    if (ws.current) {
      ws.current.close();
      ws.current = null;
    }
    setIsDetecting(false);
    setGaze('CENTER');
    setCurrentSelection('System Inactive');
  };

  const sendFrame = (imageSrc) => {
    if (ws.current && ws.current.readyState === WebSocket.OPEN) {
      ws.current.send(imageSrc);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50 dark:bg-gray-900 transition-colors">
      <Navbar isAuth={true} />
      
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Expression Dashboard</h1>
            <p className="text-gray-600 dark:text-gray-400 mt-1">Directly communicate using facial expressions and gaze.</p>
          </div>

          <div className="flex gap-3">
            <button 
              onClick={downloadPDF}
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-200 border border-gray-200 dark:border-gray-700 hover:bg-gray-50 transition-all font-semibold shadow-sm"
            >
              <FileDown className="w-5 h-5" />
              <span className="hidden sm:inline">Download PDF Report</span>
            </button>

            <button 
              onClick={() => setTtsEnabled(!ttsEnabled)}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl transition-all font-semibold ${ttsEnabled ? 'bg-brand-100 text-brand-700 dark:bg-brand-900/40 dark:text-brand-400 border border-brand-200 dark:border-brand-800' : 'bg-gray-200 text-gray-600 dark:bg-gray-800 dark:text-gray-400 border border-gray-300 dark:border-gray-700'}`}
            >
              {ttsEnabled ? <Volume2 className="w-5 h-5" /> : <VolumeX className="w-5 h-5" />}
              <span className="hidden sm:inline">{ttsEnabled ? 'Speech Output On' : 'Speech Output Off'}</span>
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
          <div className="lg:col-span-2 space-y-6 lg:space-y-8">
            <WebcamFeed 
              isDetecting={isDetecting} 
              sendFrame={sendFrame} 
              gaze={gaze}
              blink={blink}
              smile={smile}
              mouthOpen={mouthOpen}
              eyebrowsUp={eyebrowsUp}
              currentSelection={currentSelection}
            />
            <ControlPanel 
              isDetecting={isDetecting} 
              onStart={startDetection} 
              onStop={stopDetection} 
              currentSelection={currentSelection}
            />
          </div>
          
          <div className="lg:col-span-1">
            <OutputPanel messages={messages} />
          </div>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
