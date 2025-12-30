import React, { useEffect, useRef } from 'react';
import { Channel, Project, User } from '../types';
import { Users, Info, Hash, Clock, ShieldCheck, Sparkle, Checks, ChartLine } from "@phosphor-icons/react";
import ChatInput from './ChatInput';

interface ChannelSummaryProps {
  channel: Channel;
  project: Project;
  onVoiceToggle: () => void;
  onSendMessage: (content: string) => void;
}

const ChannelSummary: React.FC<ChannelSummaryProps> = ({ channel, project, onVoiceToggle, onSendMessage }) => {
  const scrollRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [channel.messages]);

  return (
    <div className="w-full max-w-2xl flex flex-col h-full animate-fade-in overflow-hidden">
      <div className="flex-1 overflow-y-auto px-6 pt-10 pb-32 space-y-8 scrollbar-hide">
        <div className="text-center space-y-3">
          <p className="text-zinc-500 font-light text-lg leading-relaxed">{channel.description || 'Channel context and intelligence hub.'}</p>
        </div>

        {/* Insight Metrics */}
        <div className="grid grid-cols-2 gap-3">
          <div className="p-5 rounded-3xl bg-[#141416] border border-white/5 space-y-3">
              <div className="flex items-center gap-2">
                <ChartLine size={16} className="text-teal-500" />
                <span className="text-[9px] font-black uppercase tracking-widest text-zinc-600">Activity Velocity</span>
              </div>
              <div className="text-xl font-bold text-white">Moderate</div>
          </div>
          <div className="p-5 rounded-3xl bg-[#141416] border border-white/5 space-y-3">
              <div className="flex items-center gap-2">
                <Users size={16} className="text-indigo-500" />
                <span className="text-[9px] font-black uppercase tracking-widest text-zinc-600">Active Members</span>
              </div>
              <div className="text-xl font-bold text-white">{channel.members.length} Users</div>
          </div>
        </div>

        {/* AI Insight Chat */}
        <div className="space-y-4">
            <div className="flex items-center gap-2 px-1">
                <Sparkle size={16} weight="fill" className="text-amber-500" />
                <h3 className="text-[10px] font-black uppercase tracking-widest text-zinc-600">Channel Intelligence Assistant</h3>
            </div>
            
            <div className="space-y-3 p-2 bg-white/[0.02] border border-white/5 rounded-3xl min-h-[300px] flex flex-col">
              {channel.messages.length === 0 ? (
                <div className="flex-1 flex flex-col items-center justify-center opacity-30 text-center px-8">
                  <p className="text-xs font-bold uppercase tracking-widest">Awaiting Input</p>
                  <p className="text-[10px] font-light mt-1">Ask Rima for a summary of today's progress.</p>
                </div>
              ) : (
                <div className="space-y-2 p-2">
                  {channel.messages.slice(-5).map((msg, idx) => {
                    const isSelf = msg.sender !== 'Rima' && (msg.sender as User).id === 'u_sara';
                    return (
                      <div key={msg.id} className={`flex w-full ${isSelf ? 'justify-end' : 'justify-start'}`}>
                        <div className={`max-w-[85%] px-4 py-2.5 rounded-2xl text-[14px] ${
                          isSelf ? 'bg-[#007AFF] text-white' : 'bg-[#262629] text-stone-300'
                        }`}>
                          {msg.content}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
              <div ref={scrollRef} />
            </div>
        </div>

        <div className="space-y-4">
            <div className="flex items-center gap-2 px-1">
                <Info size={16} className="text-zinc-600" />
                <h3 className="text-[10px] font-black uppercase tracking-widest text-zinc-600">Key Insights</h3>
            </div>
            <div className="p-5 rounded-3xl bg-[#141416]/50 border border-white/5 space-y-3">
                <div className="text-sm font-light text-zinc-400">
                    • Most discussion is centered around <span className="text-white font-bold">Logistics</span>.
                </div>
                <div className="text-sm font-light text-zinc-400">
                    • Average response time: <span className="text-white font-bold">14 mins</span>.
                </div>
            </div>
        </div>
      </div>

      <div className="p-6 fixed bottom-0 left-0 right-0 max-w-2xl mx-auto z-40 bg-gradient-to-t from-[#0a0a0b] via-[#0a0a0b] to-transparent">
        <ChatInput onVoiceToggle={onVoiceToggle} onSendMessage={onSendMessage} placeholder={`Ask for channel summary...`} />
      </div>
    </div>
  );
};

export default ChannelSummary;