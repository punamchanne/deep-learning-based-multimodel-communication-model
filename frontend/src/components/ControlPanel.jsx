import React from 'react';
import { Play, Square } from 'lucide-react';

const ControlPanel = ({ isDetecting, onStart, onStop, currentSelection }) => {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-3xl p-6 shadow-sm border border-gray-100 dark:border-gray-700 flex flex-col sm:flex-row items-center justify-between gap-6 transition-all duration-300 relative overflow-hidden">
      
      {/* Background ambient light based on current selection */}
      <div className={`absolute inset-0 pointer-events-none transition-opacity duration-500 opacity-10 ${currentSelection === 'Yes' ? 'bg-gradient-to-r from-brand-500 to-transparent' : currentSelection === 'No' ? 'bg-gradient-to-r from-red-500 to-transparent' : 'hidden'}`}></div>

      <div className="flex flex-col flex-1 relative z-10 w-full">
        <h3 className="text-sm font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-4 border-b border-slate-100 dark:border-slate-700 pb-2">Detection Guide</h3>
        
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          {[
            { act: 'Blink', msg: 'Emergency' },
            { act: 'Smile', msg: 'Happy' },
            { act: 'Open Mouth', msg: 'Water' },
            { act: 'Look Left', msg: 'Adjust Position' },
            { act: 'Look Right', msg: 'Rest' },
            { act: 'Look Down', msg: 'Uncomfortable' },
            { act: 'Eyebrows Up', msg: 'Yes' }
          ].map((item, idx) => (
            <div key={idx} className="flex flex-col p-3 rounded-xl bg-slate-50 dark:bg-slate-900/50 border border-slate-100 dark:border-slate-800">
              <span className="text-[10px] font-bold text-brand-500 uppercase">{item.act}</span>
              <span className="text-xs font-semibold text-slate-700 dark:text-slate-300 truncate">{item.msg}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="flex w-full sm:w-auto relative z-10 shrink-0">
        {isDetecting ? (
          <button 
            onClick={onStop}
            className="w-full flex items-center justify-center gap-3 bg-red-500 hover:bg-red-600 text-white px-8 py-5 rounded-2xl font-bold text-lg transition-all shadow-lg shadow-red-500/20"
          >
            <Square className="w-5 h-5 fill-current" />
            Stop
          </button>
        ) : (
          <button 
            onClick={onStart}
            className="w-full flex items-center justify-center gap-3 bg-emerald-500 hover:bg-emerald-600 text-white px-8 py-5 rounded-2xl font-bold text-lg transition-all shadow-lg shadow-emerald-500/20"
          >
            <Play className="w-5 h-5 fill-current" />
            Start
          </button>
        )}
      </div>

    </div>
  );
};

export default ControlPanel;
