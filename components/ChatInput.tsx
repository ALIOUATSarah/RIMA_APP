import React, { useState, useRef, useEffect } from 'react';
import { PaperPlaneRight, Waveform, At } from "@phosphor-icons/react";

interface ChatInputProps {
  onVoiceToggle: () => void;
  onSendMessage: (content: string) => void;
  placeholder?: string;
  enableTagging?: boolean;
}

const ChatInput: React.FC<ChatInputProps> = ({ onVoiceToggle, onSendMessage, placeholder = "Ask Rima...", enableTagging }) => {
  const [inputValue, setInputValue] = useState('');
  const [showTagSuggestions, setShowTagSuggestions] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const isInputEmpty = inputValue.trim() === '';

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setInputValue(val);
    if (enableTagging) {
      const lastWord = val.split(' ').pop();
      if (lastWord?.startsWith('@')) {
        setShowTagSuggestions(true);
      } else {
        setShowTagSuggestions(false);
      }
    }
  };

  const handleAction = () => {
    if (isInputEmpty) {
      onVoiceToggle();
    } else {
      onSendMessage(inputValue);
      setInputValue('');
      setShowTagSuggestions(false);
    }
  };

  const selectTag = (tag: string) => {
    const words = inputValue.split(' ');
    words[words.length - 1] = '@' + tag + ' ';
    setInputValue(words.join(' '));
    setShowTagSuggestions(false);
    inputRef.current?.focus();
  };

  const containsTag = inputValue.includes('@Rima');

  return (
    <div className="w-full relative group pointer-events-auto">
      {/* Tag Suggestions Overlay */}
      {showTagSuggestions && (
        <div className="absolute bottom-full left-0 mb-3 w-56 bg-[#1a1b1e] border border-white/10 rounded-2xl shadow-2xl overflow-hidden animate-slide-up z-[60]">
            <div className="px-4 py-2 border-b border-white/5 text-[9px] font-black uppercase tracking-widest text-zinc-600">Suggestions</div>
            <button 
              onClick={() => selectTag('Rima')}
              className="w-full flex items-center gap-3 px-4 py-3 hover:bg-white/5 text-left transition-colors"
            >
                <div className="w-8 h-8 rounded-full bg-stone-200 flex items-center justify-center text-black font-bold text-xs shadow-md shadow-white/5">R</div>
                <div className="flex flex-col">
                  <span className="text-sm font-bold text-stone-200">Rima</span>
                  <span className="text-[10px] text-zinc-500">System AI Assistant</span>
                </div>
            </button>
        </div>
      )}

      <div className={`absolute inset-0 bg-zinc-900/80 backdrop-blur-xl rounded-full border transition-all duration-300 shadow-2xl ${containsTag ? 'border-stone-400 bg-zinc-800/90' : 'border-zinc-700 group-hover:border-zinc-500'}`}></div>
      
      <div className="relative flex items-center p-2 pl-6 h-14">
        <input 
          ref={inputRef}
          type="text" 
          value={inputValue}
          onChange={handleInputChange}
          placeholder={placeholder} 
          className={`flex-1 bg-transparent text-stone-200 placeholder-zinc-600 text-base focus:outline-none font-light tracking-wide ${containsTag ? 'font-medium' : ''}`}
          onKeyDown={(e) => {
            if (e.key === 'Enter') handleAction();
            if (e.key === 'Escape') setShowTagSuggestions(false);
          }}
        />
        
        <div className="flex items-center gap-1 pr-1">
          <button 
            onClick={handleAction}
            className={`p-2.5 rounded-full transition-all duration-300 shadow-lg flex items-center justify-center ${
              isInputEmpty 
                ? 'bg-zinc-800 text-stone-400 hover:bg-zinc-700' 
                : 'bg-stone-200 text-black hover:bg-white scale-105'
            }`}
          >
            {isInputEmpty ? (
              <Waveform size={22} weight="light" className="animate-pulse" />
            ) : (
              <PaperPlaneRight size={22} weight="fill" />
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChatInput;