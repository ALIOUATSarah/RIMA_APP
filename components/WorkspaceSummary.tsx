import React from 'react';
import { Project } from '../types';
import { Wallet, HourglassMedium, ChartPieSlice, Hash, CaretRight, Info } from "@phosphor-icons/react";

interface WorkspaceSummaryProps {
  project: Project;
  onNavigateToChannel: (channelId: string) => void;
}

const WorkspaceSummary: React.FC<WorkspaceSummaryProps> = ({ project, onNavigateToChannel }) => {
  return (
    <div className="w-full max-w-2xl px-6 flex flex-col gap-8 pb-40 pt-10 overflow-y-auto scrollbar-hide animate-fade-in">
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

      <div className="space-y-4">
          <div className="flex items-center gap-2 px-1">
              <h3 className="text-[10px] font-black uppercase tracking-widest text-zinc-600">Workspace Channels</h3>
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
                                <p className="text-[10px] text-zinc-600 uppercase font-black tracking-tight">{channel.members.length} Members</p>
                              </div>
                          </div>
                      </div>
                      <CaretRight size={16} className="text-zinc-800 group-hover:text-zinc-500" />
                  </button>
              ))}
          </div>
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