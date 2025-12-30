import React from 'react';
import { Project, ThemeColor } from '../types';
import { Hash, CaretRight, Users, Clock, Target, Lightning } from "@phosphor-icons/react";

interface WorkspaceCardProps {
  workspace: Project;
  onClick: () => void;
  onChannelClick: (channelId: string) => void;
}

const themeStyles: Record<ThemeColor, {
  accent: string;
  light: string;
}> = {
  teal: { accent: 'bg-teal-500', light: 'text-teal-400' },
  emerald: { accent: 'bg-emerald-500', light: 'text-emerald-400' },
  rust: { accent: 'bg-orange-600', light: 'text-orange-400' },
  gold: { accent: 'bg-amber-500', light: 'text-amber-400' },
  obsidian: { accent: 'bg-zinc-500', light: 'text-zinc-400' },
  indigo: { accent: 'bg-indigo-500', light: 'text-indigo-400' },
  rose: { accent: 'bg-rose-500', light: 'text-rose-400' },
  sky: { accent: 'bg-sky-400', light: 'text-sky-300' },
  violet: { accent: 'bg-violet-500', light: 'text-violet-400' },
  slate: { accent: 'bg-slate-400', light: 'text-slate-300' },
};

const WorkspaceCard: React.FC<WorkspaceCardProps> = ({ workspace, onClick, onChannelClick }) => {
  const styles = themeStyles[workspace.theme] || themeStyles.obsidian;

  return (
    <div 
      className="group relative flex flex-col bg-[#141416]/80 backdrop-blur-md border border-white/5 rounded-3xl overflow-hidden transition-all duration-300 hover:border-white/10 hover:translate-y-[-2px] hover:shadow-2xl shadow-black/40"
      onClick={onClick}
    >
      <div className={`absolute top-0 left-0 right-0 h-[2px] ${styles.accent} opacity-50`} />

      <div className="p-6 space-y-4">
        <div className="flex justify-between items-start">
          <div className="space-y-1">
            <h3 className="text-xl font-bold text-white tracking-tight">{workspace.title}</h3>
            <p className="text-sm text-zinc-500 line-clamp-1 font-light">{workspace.description}</p>
          </div>
          <div className={`px-2 py-1 rounded-full bg-white/5 border border-white/5 text-[8px] font-black uppercase tracking-[0.2em] ${styles.light}`}>
            {workspace.profileId.replace('p_', '')}
          </div>
        </div>

        <div className="flex flex-wrap gap-2 pt-1">
          {workspace.channels.slice(0, 3).map((channel) => (
            <button
              key={channel.id}
              onClick={(e) => {
                e.stopPropagation();
                onChannelClick(channel.id);
              }}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/5 border border-white/5 hover:bg-white/10 transition-colors group/channel"
            >
              <Hash size={12} className="text-zinc-600 group-hover/channel:text-zinc-400" />
              <span className="text-xs font-medium text-zinc-300">{channel.title}</span>
            </button>
          ))}
          {workspace.channels.length > 3 && (
            <div className="flex items-center px-2 py-1.5 text-[10px] text-zinc-600 font-bold uppercase">
              +{workspace.channels.length - 3}
            </div>
          )}
        </div>

        <div className="flex items-center justify-between pt-4 border-t border-white/5 mt-auto">
          <div className="flex items-center gap-4 text-zinc-500 font-bold uppercase tracking-tighter text-[10px]">
            <Clock size={16} />
            {workspace.deadline || 'Ongoing'}
          </div>
          
          <div className="flex items-center gap-3">
             <div className="flex flex-col items-end">
                <div className="w-20 h-1 bg-white/5 rounded-full overflow-hidden">
                    <div className={`h-full ${styles.accent}`} style={{ width: `${workspace.progress || 0}%` }} />
                </div>
                <span className="text-[9px] text-zinc-600 font-black uppercase tracking-widest mt-1.5">{workspace.progress}%</span>
             </div>
             <CaretRight size={16} className="text-zinc-800 group-hover:text-zinc-400" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default WorkspaceCard;