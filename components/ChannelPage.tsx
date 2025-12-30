import React, { useEffect, useRef } from 'react';
import { Channel, User } from '../types';
import ChatInput from './ChatInput';
import { Checks, Sparkle } from "@phosphor-icons/react";

interface ChannelPageProps {
  channel: Channel;
  onVoiceToggle: () => void;
  onSendMessage: (content: string) => void;
}

const ChannelPage: React.FC<ChannelPageProps> = ({ channel, onVoiceToggle, onSendMessage }) => {
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [channel.messages]);

  const formatMessage = (content: string, isTagged: boolean) => {
    const parts = content.split(/(@Rima)/gi);
    return parts.map((part, i) => 
      part.toLowerCase() === '@rima' 
        ? <span key={i} className={`font-black ${isTagged ? 'text-zinc-500' : 'text-zinc-600'}`}>@Rima</span> 
        : part
    );
  };

  return (
    <div className="flex flex-col w-full max-w-2xl h-full overflow-hidden">
      <div className="flex-1 overflow-y-auto px-4 py-6 space-y-4 scrollbar-hide">
        {channel.messages.length === 0 && (
          <div className="h-full flex flex-col items-center justify-center opacity-30 text-center px-12">
            <h3 className="text-xl font-bold mb-2 font-branding tracking-widest uppercase text-white/50">Channel Synchronized</h3>
            <p className="text-sm font-light">Rima is indexing this conversation in real-time.</p>
          </div>
        )}
        
        {channel.messages.map((msg, idx) => {
            const isSelf = msg.sender !== 'Rima' && (msg.sender as User).id === 'u_sara';
            const isRima = msg.sender === 'Rima';
            const hasTag = typeof msg.content === 'string' && msg.content.toLowerCase().includes('@rima');
            const nextMsg = channel.messages[idx + 1];
            const showAvatar = !isSelf && (!nextMsg || nextMsg.sender !== msg.sender);

            return (
              <div key={msg.id} className={`flex w-full mb-1 animate-fade-in ${isSelf ? 'justify-end' : 'justify-start items-end gap-2'}`}>
                  {!isSelf && (
                    <div className="w-8 h-8 shrink-0">
                      {showAvatar && (
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-[10px] shadow-lg transition-transform hover:scale-110 ${isRima ? 'bg-violet-600 text-white ring-2 ring-violet-400/40 shadow-violet-500/50' : (msg.sender as User).avatarColor}`}>
                          {isRima ? <Sparkle size={14} weight="fill" /> : (msg.sender as User).name[0]}
                        </div>
                      )}
                    </div>
                  )}

                  <div className={`flex flex-col max-w-[85%] ${isSelf ? 'items-end' : 'items-start'}`}>
                      {showAvatar && !isSelf && (
                         <div className="flex items-center gap-2 mb-1.5 px-1">
                            <span className={`text-[10px] font-black uppercase tracking-widest ${isRima ? 'text-violet-400' : 'text-zinc-600'}`}>
                                {isRima ? 'Rima ˙✦' : (msg.sender as User).name}
                            </span>
                            {isRima && <div className="w-1.5 h-1.5 bg-violet-500 rounded-full animate-pulse shadow-[0_0_8px_rgba(139,92,246,0.8)]" />}
                         </div>
                      )}
                      
                      <div className={`relative px-4 py-3 shadow-2xl transition-all ${
                        isRima 
                          ? 'bg-[#1a1a2e]/90 backdrop-blur-xl border border-violet-500/30 text-stone-100 rounded-[22px] rounded-bl-[4px] shadow-violet-500/10' 
                          : isSelf 
                            ? `rounded-[22px] rounded-br-[4px] text-white ${hasTag ? 'bg-[#1c1c30] border border-white/5' : 'bg-[#007AFF]'}`
                            : 'bg-[#262629] text-stone-200 rounded-[22px] rounded-bl-[4px]'
                      }`}>
                          <div className={`text-[15px] leading-relaxed whitespace-pre-wrap ${isRima ? 'font-medium tracking-tight text-violet-50' : ''}`}>
                            {formatMessage(msg.content, hasTag && isSelf)}
                          </div>
                          <div className={`flex items-center gap-1 mt-2 ${isSelf ? 'justify-end' : 'justify-start'}`}>
                             <span className={`text-[9px] font-black uppercase tracking-tighter ${isSelf ? (hasTag ? 'text-zinc-500' : 'text-blue-200/60') : 'text-zinc-600'}`}>{msg.timestamp}</span>
                             {isSelf && <Checks size={12} weight="bold" className={hasTag ? "text-zinc-500" : "text-blue-300/80"} />}
                          </div>
                      </div>
                  </div>
              </div>
            );
        })}
        <div ref={scrollRef} />
      </div>

      <div className="p-6">
          <ChatInput 
            onVoiceToggle={onVoiceToggle} 
            onSendMessage={onSendMessage}
            placeholder={`Message #${channel.title.toLowerCase()}...`} 
          />
      </div>
    </div>
  );
};

export default ChannelPage;