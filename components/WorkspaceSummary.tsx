import React, { useEffect, useRef } from 'react';
import { Project, User } from '../types';
import { Wallet, HourglassMedium, ChartPieSlice, Hash, CaretRight, Info, Sparkle, PlusCircle } from "@phosphor-icons/react";
import ChatInput from './ChatInput';

interface WorkspaceSummaryProps {
  project: Project;
  onNavigateToChannel: (channelId: string) => void;
  onVoiceToggle: () => void;
  onSendMessage: (content: string) => void;
  onNewChannel: () => void;
}

const WorkspaceSummary: React.FC<WorkspaceSummaryProps> = ({ project, onNavigateToChannel, onVoiceToggle, onSendMessage, onNewChannel }) => {
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [project.messages]);

  return (
    <div className="w-full max-w-2xl flex flex-col h-full animate-fade-in overflow-hidden">
      <div className="flex-1 overflow-y-auto px-6 pt-10 pb-32 space-y-8 scrollbar-hide">
        <div className="text-center space-y-3">
          <p className="text-zinc-500 font-light text-lg leading-relaxed">{project.description}</p>
        </div>

        <div className="grid grid-cols-3 gap-3">
            <StatCard icon={<Wallet size={16}/>} title="Budget" value={project.budget || "N/A"} />
            <StatCard icon={<HourglassMedium size={16}/>} title="Deadline" value={project.deadline || "TBD"} />
            <StatCard icon={<ChartPieSlice size={16}/>} title="Phase" value={project.phase || "Active"} />
        </div>

        <div className="p-6 rounded-3xl bg-white/[0.03] border border-white/5 space-y-4">
            <div className="flex justify-between items-end">
                <div className="space-y-1">
                    <span className="text-[10px] font-black uppercase tracking-widest text-zinc-600">Overall Progress</span>
                    <div className="text-3xl font-bold text-white">{project.progress || 0}%</div>
                </div>
            </div>
            <div className="w-full h-2 bg-white/5 rounded-full overflow-hidden">
                <div className="h-full bg-stone-200" style={{ width: `${project.progress || 0}%` }} />
            </div>
        </div>

        {/* AI Insight Chatbot for Workspace */}
        <div className="space-y-4">
            <div className="flex items-center gap-2 px-1">
                <Sparkle size={16} weight="fill" className="text-amber-500" />
                <h3 className="text-[10px] font-black uppercase tracking-widest text-zinc-600">Workspace Intelligence Assistant</h3>
            </div>
            
            <div className="space-y-3 p-2 bg-white/[0.02] border border-white/5 rounded-3xl min-h-[250px] flex flex-col">
              {project.messages.length === 0 ? (
                <div className="flex-1 flex flex-col items-center justify-center opacity-30 text-center px-8">
                  <p className="text-xs font-bold uppercase tracking-widest">Awaiting Analysis</p>
                  <p className="text-[10px] font-light mt-1">Ask for a status report or budget audit.</p>
                </div>
              ) : (
                <div className="space-y-2 p-2">
                  {project.messages.slice(-5).map((msg, idx) => {
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
            <div className="flex items-center justify-between px-1">
                <h3 className="text-[10px] font-black uppercase tracking-widest text-zinc-600">Workspace Channels</h3>
                <button 
                  onClick={onNewChannel}
                  className="flex items-center gap-1.5 text-[10px] font-black uppercase tracking-widest text-stone-200 hover:text-white transition-colors"
                >
                  <PlusCircle size={14} weight="bold" />
                  New Channel
                </button>
            </div>
            <div className="grid grid-cols-1 gap-2.5">
                {project.channels.map(channel => (
                    <button 
                      key={channel.id}
                      onClick={() => onNavigateToChannel(channel.id)}
                      className="flex items-center justify-between p-5 rounded-2xl bg-[#141416]/50 border border-white/5 hover:bg-[#1c1c1e] hover:border-white/10 transition-all group"
                    >
                        <div className="flex items-center gap-4">
                            <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center text-zinc-500 group-hover:text-zinc-300">
                               <Hash size={20} />
                            </div>
                            <div className="text-left">
                                <p className="text-sm font-bold text-white">{channel.title}</p>
                                <div className="flex items-center gap-2">
                                  <p className="text-[10px] text-zinc-600 uppercase font-black tracking-tight">
                                    {channel.members.length === 1 ? 'Private' : `${channel.members.length} Members`}
                                  </p>
                                </div>
                            </div>
                        </div>
                        <CaretRight size={16} className="text-zinc-800 group-hover:text-zinc-500" />
                    </button>
                ))}
                
                <button 
                  onClick={onNewChannel}
                  className="flex items-center justify-center gap-3 p-5 rounded-2xl bg-white/[0.02] border border-dashed border-white/10 text-zinc-500 hover:bg-white/[0.04] hover:border-white/20 transition-all group"
                >
                  <PlusCircle size={20} weight="bold" className="group-hover:scale-110 transition-transform" />
                  <span className="text-xs font-bold uppercase tracking-widest">Add Channel</span>
                </button>
            </div>
        </div>
      </div>

      <div className="p-6 fixed bottom-0 left-0 right-0 max-w-2xl mx-auto z-40 bg-gradient-to-t from-[#0a0a0b] via-[#0a0a0b] to-transparent">
        <ChatInput onVoiceToggle={onVoiceToggle} onSendMessage={onSendMessage} placeholder={`Ask for workspace status...`} />
      </div>
    </div>
  );
};

const StatCard: React.FC<{ icon: React.ReactNode, title: string; value: string }> = ({ icon, title, value }) => (
  <div className="p-4 rounded-2xl bg-[#141416] border border-white/5 flex flex-col items-center justify-center text-center">
    <div className="text-zinc-600 mb-1.5">{icon}</div>
    <div className="text-lg font-bold text-white tracking-tight">{value}</div>
    <div className="text-[8px] uppercase tracking-widest font-black text-zinc-600 mt-1">{title}</div>
  </div>
);

export default WorkspaceSummary;