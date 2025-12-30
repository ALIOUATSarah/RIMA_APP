import React, { useState } from 'react';
import { X, Hash, House, Plus, PlusCircle, Gear, UserCircle, CaretUp, Check, Lock, Briefcase, CaretDown, SignOut, User, Eye, Info } from "@phosphor-icons/react";
import { ViewType, Project, Profile, ThemeColor } from '../types';
import { PROFILES } from '../constants';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
  currentView: ViewType;
  onNavigate: (view: ViewType) => void;
  projects: Project[];
  activeProfileId: string;
  onProfileChange: (id: string) => void;
  onCreateProject: () => void;
  onCreateChannel: (projectId: string) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ 
  isOpen, onClose, currentView, onNavigate, projects, activeProfileId, onProfileChange, onCreateProject, onCreateChannel 
}) => {
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  if (!isOpen) return null;

  const activeProfile = PROFILES.find(p => p.id === activeProfileId) || PROFILES[0];
  const filteredProjects = activeProfileId === 'all' 
    ? projects 
    : projects.filter(p => p.profileId === activeProfileId);

  return (
    <>
      <div className="fixed inset-0 bg-black/80 backdrop-blur-md z-[60] transition-opacity duration-300" onClick={onClose} />
      
      <div className="fixed top-0 left-0 h-full w-72 bg-[#0a0a0b] z-[70] shadow-2xl animate-slide-in flex flex-col font-sans border-r border-white/5">
        <div 
          className="h-16 border-b border-white/5 flex items-center justify-between px-6 hover:bg-white/[0.02] transition-colors cursor-pointer"
          onClick={() => { onNavigate({ type: 'home' }); onClose(); }}
        >
          <div className="flex items-center gap-3">
             <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center">
                <House weight="bold" className="text-stone-300" size={16} />
             </div>
             <span className="tracking-[0.4em] text-[11px] uppercase font-branding text-zinc-300">RIMA</span>
          </div>
          <button onClick={onClose} className="text-zinc-600 hover:text-white transition-colors">
            <X size={20} weight="bold" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-4 py-4 space-y-6 scrollbar-hide">
          <button 
            className="w-full flex items-center gap-3 px-4 py-3.5 text-xs font-bold text-zinc-400 uppercase tracking-widest hover:text-white transition-all border border-white/5 rounded-2xl bg-white/[0.03] hover:bg-white/[0.06] group"
            onClick={onCreateProject}
          >
            <PlusCircle size={18} weight="bold" className="group-hover:scale-110 transition-transform" />
            New Workspace
          </button>

          <div className="space-y-4">
            <div className="flex items-center justify-between px-3">
                <span className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-600">Workspaces</span>
            </div>
            {filteredProjects.map((project) => (
                <div key={project.id} className="space-y-0.5">
                <div 
                    className={`flex items-center justify-between px-3 py-2 group cursor-pointer rounded-xl transition-all ${currentView.projectId === project.id && currentView.type === 'project' ? 'bg-white/10 text-white ring-1 ring-white/10' : 'text-zinc-400 hover:text-zinc-200 hover:bg-white/5'}`}
                    onClick={() => { onNavigate({ type: 'project', projectId: project.id }); onClose(); }}
                >
                    <h3 className="text-[13px] font-bold truncate max-w-[140px]">
                    {project.title}
                    </h3>
                    <div className="flex items-center gap-1">
                        <button 
                          onClick={(e) => { e.stopPropagation(); onNavigate({ type: 'project_summary', projectId: project.id }); onClose(); }}
                          className="opacity-0 group-hover:opacity-100 p-1 hover:text-white transition-all"
                        >
                          <Info size={14} weight="bold" />
                        </button>
                        <button 
                          onClick={(e) => { e.stopPropagation(); onCreateChannel(project.id); }}
                          className="opacity-0 group-hover:opacity-100 p-1 hover:text-white transition-all"
                        >
                          <Plus size={14} weight="bold" />
                        </button>
                    </div>
                </div>

                <div className="space-y-[1px] pl-4">
                    {project.channels.map((ch) => (
                    <div 
                        key={ch.id}
                        onClick={() => { onNavigate({ type: 'channel', projectId: project.id, channelId: ch.id }); onClose(); }}
                        className={`group flex items-center justify-between px-3 py-1.5 rounded-xl cursor-pointer transition-all ${currentView.channelId === ch.id ? 'bg-white/10 text-white shadow-sm ring-1 ring-white/10' : 'hover:bg-white/5 text-zinc-500 hover:text-zinc-300'}`}
                    >
                        <div className="flex items-center gap-3 min-w-0 flex-1">
                          <div className="relative">
                            {ch.members.length === 1 ? (
                                <Lock size={14} className={ch.unreadCount ? "text-white" : "text-zinc-700"} weight="fill" />
                            ) : (
                                <Hash size={14} className={ch.unreadCount ? "text-white" : "text-zinc-700"} weight={ch.unreadCount ? "bold" : "regular"} />
                            )}
                            {ch.unreadCount && (
                              <div className="absolute -top-1 -right-1 w-2 h-2 bg-blue-500 rounded-full border-2 border-[#0a0a0b]" />
                            )}
                          </div>
                          <span className={`text-[12px] truncate ${ch.unreadCount ? "font-bold text-white" : "font-medium"}`}>
                              {ch.title.toLowerCase()}
                          </span>
                        </div>
                        <button 
                          onClick={(e) => { e.stopPropagation(); onNavigate({ type: 'channel_summary', projectId: project.id, channelId: ch.id }); onClose(); }}
                          className="opacity-0 group-hover:opacity-100 p-1 hover:text-white transition-all"
                        >
                          <Info size={14} />
                        </button>
                    </div>
                    ))}
                </div>
                </div>
            ))}
          </div>
        </div>

        <div className="bg-[#0e0e0f] p-5 border-t border-white/5 relative">
            {isProfileMenuOpen && (
                <div className="absolute bottom-[calc(100%+12px)] left-4 right-4 bg-[#141416] border border-white/10 rounded-2xl shadow-2xl p-2 animate-slide-up overflow-hidden z-[80]">
                    {PROFILES.map(p => (
                        <button 
                            key={p.id}
                            onClick={() => { onProfileChange(p.id); setIsProfileMenuOpen(false); }}
                            className={`w-full flex items-center justify-between px-4 py-3 rounded-xl transition-all ${activeProfileId === p.id ? 'bg-white/10 text-white' : 'hover:bg-white/5 text-zinc-500'}`}
                        >
                            <div className="flex items-center gap-3">
                                <span className="text-lg">{p.icon}</span>
                                <span className="text-sm font-bold">{p.name}</span>
                            </div>
                            {activeProfileId === p.id && <Check size={16} weight="bold" className="text-emerald-500" />}
                        </button>
                    ))}
                </div>
            )}

            <div className="flex items-center justify-between">
                <div 
                    className="flex items-center gap-4 group cursor-pointer flex-1 min-w-0" 
                    onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)}
                >
                    <div className="relative shrink-0">
                        <div className="w-11 h-11 rounded-2xl bg-[#1c1c1e] flex items-center justify-center overflow-hidden border border-white/10 shadow-lg">
                            <span className="text-sm font-black text-white">S</span>
                        </div>
                        <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-emerald-500 border-2 border-[#0e0e0f] rounded-full"></div>
                    </div>
                    <div className="flex flex-col min-w-0 overflow-hidden">
                        <div className="flex items-center gap-1">
                            <span className="text-[13px] font-bold text-white truncate leading-none font-sans tracking-tight">Sara</span>
                            <CaretDown size={10} className="text-zinc-600" />
                        </div>
                        <span className="text-[8px] text-zinc-600 leading-none uppercase tracking-[0.1em] font-black mt-1.5 opacity-80">ALL WORKSPACES</span>
                    </div>
                </div>
                <button 
                  onClick={() => { onNavigate({ type: 'settings' }); onClose(); }} 
                  className="p-2 text-zinc-600 hover:text-zinc-300 transition-all"
                >
                    <Gear size={22} weight="light" />
                </button>
            </div>
        </div>
      </div>
    </>
  );
};

export default Sidebar;