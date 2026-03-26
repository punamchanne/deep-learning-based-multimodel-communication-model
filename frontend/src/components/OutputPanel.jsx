import React, { useEffect, useRef } from 'react';
import { MessageSquare, Clock } from 'lucide-react';

const OutputPanel = ({ messages }) => {
  const scrollRef = useRef(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  return (
    <div className="bg-white dark:bg-gray-800 rounded-3xl p-6 shadow-sm border border-gray-100 dark:border-gray-700 h-full flex flex-col transition-all duration-300">
      <div className="flex items-center gap-2 mb-6 pb-4 border-b border-gray-100 dark:border-gray-700">
        <MessageSquare className="w-6 h-6 text-brand-500" />
        <h2 className="text-xl font-bold dark:text-white">Recent Communication</h2>
      </div>
      
      <div className="flex-1 overflow-y-auto pr-2 space-y-4" ref={scrollRef}>
        {messages.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-gray-400 dark:text-gray-500 space-y-3 opacity-60 min-h-[300px]">
            <MessageSquare className="w-12 h-12" />
            <p className="text-sm font-medium text-center">No messages yet.<br/>Start gazing to communicate.</p>
          </div>
        ) : (
          messages.map((msg, index) => (
            <div 
              key={index} 
              className="bg-gray-50 dark:bg-gray-700/50 p-4 rounded-2xl flex flex-col gap-2 transform transition-all hover:scale-[1.02] border border-gray-100 dark:border-gray-600 shadow-sm"
            >
              <div className="flex items-center justify-between">
                <span className={`text-xl font-extrabold ${msg.text === 'Yes' ? 'text-brand-600 dark:text-brand-400' : 'text-red-500 dark:text-red-400'}`}>
                  {msg.text}
                </span>
                <span className="flex items-center gap-1 text-xs font-semibold text-gray-500 dark:text-gray-400">
                  <Clock className="w-3 h-3" />
                  {msg.time}
                </span>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default OutputPanel;
