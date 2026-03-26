import React, { useState, useEffect, useRef } from 'react';
import Navbar from '../components/Navbar';
import WebcamFeed from '../components/WebcamFeed';
import OutputPanel from '../components/OutputPanel';
import ControlPanel from '../components/ControlPanel';
import { Volume2, VolumeX } from 'lucide-react';

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
    'BLINK': "I am experiencing an emergency and need immediate assistance.",
    'SMILE': "I am feeling comfortable and happy right now, thank you.",
    'MOUTH': "I am feeling thirsty and would like to have some water.",
    'LEFT': "Please adjust my position, I am feeling stiff.",
    'RIGHT': "I am feeling tired and would like to take some rest now.",
    'EYEBROWS': "Yes, I agree with what you are saying.",
    'DOWN': "I am feeling uncomfortable right now, please help me."
  };

  const speak = (text) => {
    if (ttsEnabled && 'speechSynthesis' in window && !cooldownRef.current) {
      window.speechSynthesis.cancel(); // Stop current speech
      const utterance = new SpeechSynthesisUtterance(text);
      window.speechSynthesis.speak(utterance);
      
      // Prevent rapid fire
      cooldownRef.current = true;
      setTimeout(() => { cooldownRef.current = false; }, 2000);
    }
  };

  const handleTrigger = (type) => {
    if (isLockedRef.current) return;
    
    const phrase = PHRASE_MAP[type];
    if (!phrase) return;

    // Stability check: must see the same expression for 8 frames (~1s)
    if (frameCounterRef.current.type === type) {
      frameCounterRef.current.count += 1;
    } else {
      frameCounterRef.current = { type: type, count: 1 };
    }

    if (frameCounterRef.current.count >= 8) {
      setMessages(prev => [{ text: phrase, time: new Date().toLocaleTimeString() }, ...prev].slice(0, 50));
      speak(phrase);
      setCurrentSelection(phrase);
      
      // Lock system until neutral state is returned
      isLockedRef.current = true;
      neutralCounterRef.current = 0;
      frameCounterRef.current = { type: '', count: 0 };
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
      console.log("AI Data Received:", data);
      
      setGaze(data.gaze);
      setBlink(data.blink);
      setSmile(data.smile);
      setMouthOpen(data.mouth_open);
      setEyebrowsUp(data.eyebrows_up);

      setFaceDetected(data.face_detected);

      if (!data.face_detected) {
        lastSpokenRef.current = '';
        setCurrentSelection('Face Not Found - Please Move Closer');
        return;
      }

      // Determine the active expression with priority for Communication
      let activeType = null;
      if (data.mouth_open) activeType = 'MOUTH';
      else if (data.gaze === 'DOWN') activeType = 'DOWN';
      else if (data.gaze === 'LEFT') activeType = 'LEFT';
      else if (data.gaze === 'RIGHT') activeType = 'RIGHT';
      else if (data.blink) activeType = 'BLINK';
      else if (data.smile) activeType = 'SMILE';
      else if (data.eyebrows_up) activeType = 'EYEBROWS';

      if (activeType) {
        handleTrigger(activeType);
        neutralCounterRef.current = 0;
      } else {
        // Handle Neutral State
        neutralCounterRef.current += 1;
        frameCounterRef.current = { type: '', count: 0 };
        
        // Unlock after 10 frames of neutral state
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

          <button 
            onClick={() => setTtsEnabled(!ttsEnabled)}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl transition-all font-semibold ${ttsEnabled ? 'bg-brand-100 text-brand-700 dark:bg-brand-900/40 dark:text-brand-400 border border-brand-200 dark:border-brand-800' : 'bg-gray-200 text-gray-600 dark:bg-gray-800 dark:text-gray-400 border border-gray-300 dark:border-gray-700'}`}
          >
            {ttsEnabled ? <Volume2 className="w-5 h-5" /> : <VolumeX className="w-5 h-5" />}
            <span className="hidden sm:inline">{ttsEnabled ? 'Speech Output On' : 'Speech Output Off'}</span>
          </button>
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
