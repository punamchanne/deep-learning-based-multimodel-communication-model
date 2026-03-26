import React, { useRef, useEffect, useCallback } from 'react';
import Webcam from 'react-webcam';
import { Camera, CameraOff } from 'lucide-react';

const WebcamFeed = ({ isDetecting, sendFrame, gaze, blink, smile, mouthOpen, eyebrowsUp, currentSelection }) => {
  const webcamRef = useRef(null);

  const capture = useCallback(() => {
    if (webcamRef.current) {
      const imageSrc = webcamRef.current.getScreenshot();
      if (imageSrc) {
        sendFrame(imageSrc);
      }
    }
  }, [webcamRef, sendFrame]);

  useEffect(() => {
    let interval;
    if (isDetecting) {
      interval = setInterval(capture, 150); // ~6-7 fps to balance resources
    } else {
      clearInterval(interval);
    }
    return () => clearInterval(interval);
  }, [isDetecting, capture]);

  return (
    <div className="bg-white dark:bg-gray-800 rounded-3xl p-6 shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden relative transition-all duration-300">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold flex items-center gap-2 dark:text-white">
          <Camera className="w-6 h-6 text-brand-500" />
          Camera Feed
        </h2>
        
        {isDetecting && (
          <div className="flex items-center gap-2">
            <span className="relative flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500"></span>
            </span>
            <span className="text-sm font-medium text-red-500 tracking-wide uppercase">Live API</span>
          </div>
        )}
      </div>

      <div className="aspect-video bg-gray-900 rounded-2xl overflow-hidden relative border-4 border-gray-800 shadow-inner flex items-center justify-center isolate">
        {isDetecting ? (
          <Webcam
            audio={false}
            ref={webcamRef}
            screenshotFormat="image/jpeg"
            screenshotQuality={0.7}
            className="w-full h-full object-cover -scale-x-100" // Mirror for better UX
            videoConstraints={{ width: 640, height: 480, facingMode: "user" }}
          />
        ) : (
          <div className="text-gray-500 flex flex-col items-center gap-4">
            <CameraOff className="w-16 h-16 opacity-50" />
            <p className="font-medium text-lg">Camera is inactive</p>
          </div>
        )}
        
        {isDetecting && (
          <div className="absolute inset-0 pointer-events-none z-30 p-4 sm:p-6">
            {/* High-Visibility Top-Left Phrase Overlay */}
            <div className="flex flex-col gap-3 items-start">
              {/* Status Badge */}
              <div className="bg-emerald-500 text-white text-[10px] font-black px-2 py-0.5 rounded uppercase tracking-tighter shadow-lg shadow-emerald-500/40 animate-pulse">
                System Active
              </div>
              
              {currentSelection && (
                <div className="bg-slate-900/90 backdrop-blur-md px-4 py-3 rounded-2xl border-2 border-emerald-500/50 shadow-2xl shadow-emerald-500/20 max-w-[80%] animate-in fade-in zoom-in-95 duration-300">
                  <span className="text-lg sm:text-2xl font-black text-emerald-400 leading-tight block">
                    {currentSelection}
                  </span>
                </div>
              )}
            </div>
            
            {/* Minimalist Gaze Indicators */}
            <div className="absolute bottom-4 right-4 sm:bottom-6 sm:right-6 flex gap-3 opacity-80 scale-75 sm:scale-100">
               <div className={`w-3 h-3 rounded-full transition-all duration-300 ${gaze === 'LEFT' ? 'bg-emerald-400 shadow-[0_0_12px_#34d399] scale-125' : 'bg-slate-700/50'}`}></div>
               <div className={`w-3 h-3 rounded-full transition-all duration-300 ${gaze === 'CENTER' ? 'bg-emerald-400 shadow-[0_0_12px_#34d399] scale-125' : 'bg-slate-700/50'}`}></div>
               <div className={`w-3 h-3 rounded-full transition-all duration-300 ${gaze === 'RIGHT' ? 'bg-emerald-400 shadow-[0_0_12px_#34d399] scale-125' : 'bg-slate-700/50'}`}></div>
            </div>
          </div>
        )}

        {isDetecting && (blink || smile || mouthOpen || eyebrowsUp) && (
          <div className="absolute inset-0 border-[6px] border-emerald-500/40 pointer-events-none z-40 animate-ping duration-1000"></div>
        )}


      </div>
    </div>
  );
};

export default WebcamFeed;
