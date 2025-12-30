
import React from 'react';
import { Project } from '../types';
import { Hash, CaretRight, Clock, Target, Info } from "@phosphor-icons/react";

interface WorkspaceCardProps {
  workspace: Project;
  onClick: () => void;
  onChannelClick: (channelId: string) => void;
}

const WorkspaceCard: React.FC<WorkspaceCardProps> = ({ workspace, onClick, onChannelClick }) => {
  return (
    <div 
      className="group relative flex flex-col bg-[#141416] border border-white/5 rounded-[28px] overflow-hidden transition-all duration-300 hover:border-white/20 hover:shadow-[0_20px_40px_-15px_rgba(0,0,0,0.8)] cursor-pointer"
      onClick={onClick}
    >
      <div className="p-6 space-y-4">
        {/* Header with Category Badge */}
        <div className="flex justify-between items-start">
          <div 
            className="px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest flex items-center gap-1.5"
            style={{ 
              backgroundColor: `${workspace.categoryColor}15`, 
              color: workspace.categoryColor,
              border: `1px solid ${workspace.categoryColor}30`
            }}
          >
            <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: workspace.categoryColor }} />
            {workspace.category}
          </div>
          <div className="flex items-center gap-1.5 text-zinc-500 font-black text-[10px] tracking-widest uppercase">
            <Clock size={14} weight="bold" />
            {workspace.schedule}
          </div>
        </div>

        {/* Title and Description */}
        <div className="space-y-1.5">
          <h3 className="text-2xl font-bold text-white tracking-tight group-hover:text-zinc-100 transition-colors">
            {workspace.title}
          </h3>
          <p className="text-[13px] text-zinc-500 line-clamp-2 leading-relaxed font-normal">
            {workspace.description}
          </p>
        </div>

        {/* Tags */}
        <div className="flex flex-wrap gap-2 pt-1">
          {workspace.tags.map((tag) => (
            <span 
              key={tag}
              className="px-3 py-1.5 rounded-xl bg-white/[0.03] border border-white/5 text-[11px] font-bold text-zinc-400"
            >
              {tag}
            </span>
          ))}
        </div>

        {/* Progress Section */}
        <div className="pt-4 space-y-3">
          <div className="flex justify-between items-end">
            <div className="flex flex-col gap-1">
              <span className="text-[9px] font-black uppercase tracking-widest text-zinc-600">Current Progress</span>
              <span className="text-sm font-bold text-white">{workspace.progress}%</span>
            </div>
            <span className="text-[10px] text-zinc-500 font-medium italic mb-1">{workspace.progressExplanation}</span>
          </div>
          <div className="w-full h-[6px] bg-white/5 rounded-full overflow-hidden">
            <div 
              className="h-full transition-all duration-1000 ease-out" 
              style={{ 
                width: `${workspace.progress}%`,
                backgroundColor: workspace.categoryColor
              }} 
            />
          </div>
        </div>
      </div>

      {/* Hover Overlay Arrow */}
      <div className="absolute right-6 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 translate-x-4 group-hover:translate-x-0 transition-all duration-300">
        <CaretRight size={20} className="text-white" weight="bold" />
      </div>
    </div>
  );
};

export default WorkspaceCard;
