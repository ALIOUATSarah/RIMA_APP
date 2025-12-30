
import React, { useState, useRef, useEffect } from 'react';
import Background from './components/Background';
import WorkspaceCard from './components/WorkspaceCard';
import ChatInput from './components/ChatInput';
import Sidebar from './components/Sidebar';
import VoiceMode from './components/VoiceMode';
import ProjectPage from './components/ProjectPage';
import ChannelPage from './components/ChannelPage';
import SettingsPage from './components/SettingsPage';
import NewWorkspacePage from './components/NewWorkspacePage';
import NewChannelPage from './components/NewChannelPage';
import WorkspaceSummary from './components/WorkspaceSummary';
import ChannelSummary from './components/ChannelSummary';
import { INITIAL_PROJECTS, SYSTEM_USERS, PROFILES } from './constants';
import { ViewType, Project, Message, User, Channel, ThemeColor } from './types';
import { List, CaretLeft, UsersThree, X, UserCircle, Lock, CaretDown, Sparkle, Clock, Target, Plus, Video, Hash, ArrowSquareOut, Checks, MagnifyingGlass } from "@phosphor-icons/react";

const App: React.FC = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isVoiceModeOpen, setIsVoiceModeOpen] = useState(false);
  const [activeProfileId, setActiveProfileId] = useState<string>(PROFILES[0].id);
  const [projects, setProjects] = useState<Project[]>(INITIAL_PROJECTS);
  const [view, setView] = useState<ViewType>({ type: 'home' });
  const [isDarkMode, setIsDarkMode] = useState(true);
  
  const [showRightDropdown, setShowRightDropdown] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const activeProject = view.projectId ? projects.find(p => p.id === view.projectId) : null;
  const activeChannel = activeProject && view.channelId ? activeProject.channels.find(s => s.id === view.channelId) : null;

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowRightDropdown(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSendMessage = (content: string) => {
    if (!content.trim()) return;
    const newMessage: Message = {
      id: Date.now().toString(),
      sender: SYSTEM_USERS[0],
      content,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };
    setProjects(prev => prev.map(p => {
      if ((view.type === 'project' || view.type === 'project_summary') && p.id === view.projectId) {
        return { ...p, messages: [...p.messages, newMessage] };
      }
      if ((view.type === 'channel' || view.type === 'channel_summary') && p.id === view.projectId) {
        return {
          ...p,
          channels: p.channels.map(s => s.id === view.channelId ? { ...s, messages: [...s.messages, newMessage] } : s)
        };
      }
      return p;
    }));
  };

  const renderHeaderContent = () => {
    if (['settings', 'new_workspace', 'new_channel', 'project_summary', 'channel_summary'].includes(view.type)) {
      const title = view.type === 'settings' ? 'Settings' : 
                    view.type === 'new_workspace' ? 'Initialize Workspace' : 
                    view.type === 'new_channel' ? 'New Channel' : 
                    view.type === 'project_summary' ? 'Overview' : 'Overview';
      return (
        <>
          <button onClick={() => setView({ type: view.type.includes('summary') ? (view.type.includes('project') ? 'project' : 'channel') : 'home', projectId: view.projectId, channelId: view.channelId })} className="p-2 text-stone-400 hover:text-white transition-colors">
            <CaretLeft size={24} weight="bold" />
          </button>
          <h1 className="text-base font-bold tracking-tight text-white">{title}</h1>
          <div className="w-10" />
        </>
      );
    }

    return (
      <div className="flex-1 flex items-center justify-between w-full" ref={dropdownRef}>
        <button onClick={() => setIsSidebarOpen(true)} className="p-2 text-stone-400 hover:text-white transition-colors">
          <List size={26} weight="light" />
        </button>

        {view.type === 'home' ? (
          <div className="flex flex-col items-center">
             <span className="text-[10px] font-branding tracking-[0.4em] uppercase text-zinc-500 leading-none">Intelligence</span>
             <h1 className="text-sm font-branding tracking-[0.6em] uppercase text-white mt-1">RIMA</h1>
          </div>
        ) : (
          <button 
            onClick={() => setView({ type: view.type === 'project' ? 'project_summary' : 'channel_summary', projectId: view.projectId, channelId: view.channelId })}
            className="flex-1 flex justify-center items-center group cursor-pointer"
          >
             <h1 className="text-lg font-bold tracking-tight text-white px-2">
               {view.type === 'project' ? activeProject?.title : activeChannel?.title}
             </h1>
          </button>
        )}

        <div className="flex items-center justify-end w-12 relative">
          {view.type === 'home' ? (
            <button className="text-zinc-500 hover:text-white transition-all transform hover:scale-110 active:scale-90">
              <MagnifyingGlass size={24} weight="light" />
            </button>
          ) : (
            <button 
              onClick={() => setShowRightDropdown(!showRightDropdown)}
              className="p-1 rounded-full hover:bg-white/5 transition-colors"
            >
              {view.type === 'project' ? <Hash size={24} weight="bold" className="text-zinc-400" /> : <UsersThree size={24} weight="bold" className="text-zinc-400" />}
            </button>
          )}

          {/* Right Action Dropdown */}
          {showRightDropdown && (
            <div className="absolute top-full right-0 mt-3 w-64 bg-[#141416]/95 backdrop-blur-xl border border-white/10 rounded-2xl shadow-2xl p-2 z-50 animate-slide-up">
              <div className="px-4 py-2 border-b border-white/5 text-[10px] font-black uppercase tracking-widest text-zinc-500">
                {view.type === 'project' ? 'Workspace Channels' : 'Channel Members'}
              </div>
              <div className="max-h-60 overflow-y-auto scrollbar-hide py-1">
                {view.type === 'project' ? (
                  activeProject?.channels.map(ch => (
                    <button 
                      key={ch.id}
                      onClick={() => { setView({ type: 'channel', projectId: activeProject.id, channelId: ch.id }); setShowRightDropdown(false); }}
                      className="w-full flex items-center gap-3 px-4 py-3 hover:bg-white/5 text-left rounded-xl transition-colors"
                    >
                      <Hash size={16} className="text-zinc-600" />
                      <span className="text-sm font-bold text-stone-200">{ch.title}</span>
                    </button>
                  ))
                ) : (
                  activeChannel?.members.map(m => (
                    <div key={m.id} className="w-full flex items-center gap-3 px-4 py-3 rounded-xl">
                      <div className={`w-8 h-8 rounded-lg flex items-center justify-center text-[10px] font-bold ${m.avatarColor}`}>{m.name[0]}</div>
                      <div className="flex flex-col">
                        <span className="text-sm font-bold text-stone-200">{m.name}</span>
                        <span className="text-[9px] text-zinc-600 font-black uppercase tracking-tight">{m.role || 'Member'}</span>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    );
  };

  const filteredProjects = projects.filter(p => activeProfileId === 'all' || p.profileId === activeProfileId);

  return (
    <div className={`relative h-screen w-full font-sans text-stone-200 bg-[#0a0a0b] overflow-hidden ${!isDarkMode ? 'brightness-125 saturate-50' : ''}`}>
      <Background />
      <Sidebar 
        isOpen={isSidebarOpen} 
        onClose={() => setIsSidebarOpen(false)} 
        currentView={view}
        onNavigate={setView}
        projects={projects}
        activeProfileId={activeProfileId}
        onProfileChange={setActiveProfileId}
        onCreateProject={() => { setView({ type: 'new_workspace' }); setIsSidebarOpen(false); }}
        onCreateChannel={(pid) => { setView({ type: 'new_channel', projectId: pid }); setIsSidebarOpen(false); }}
      />
      <VoiceMode isOpen={isVoiceModeOpen} onClose={() => setIsVoiceModeOpen(false)} />

      <main className="relative z-10 flex flex-col items-center w-full h-full overflow-hidden">
        <header className="w-full h-16 px-4 flex justify-between items-center sticky top-0 z-40 bg-[#0a0a0b]/80 backdrop-blur-2xl border-b border-white/5 shrink-0">
          {renderHeaderContent()}
        </header>

        <div className="flex-1 w-full flex flex-col items-center overflow-hidden">
            {view.type === 'home' && (
                <div className="flex-1 w-full max-w-xl px-4 pb-48 flex flex-col gap-8 pt-10 overflow-y-auto scrollbar-hide">
                    {/* Greeting Section */}
                    <div className="px-2 space-y-1">
                        <span className="text-[10px] font-black uppercase tracking-[0.3em] text-zinc-600">Travel Synthesis</span>
                        <h2 className="text-3xl font-bold text-white tracking-tight">Welcome, Sara.</h2>
                        <p className="text-sm text-zinc-500 font-light">You have <span className="text-zinc-200 font-bold">{filteredProjects.length} active trip workspaces</span> synchronized.</p>
                    </div>

                    <div className="grid grid-cols-1 gap-6">
                        {filteredProjects.map(p => (
                            <WorkspaceCard 
                              key={p.id} 
                              workspace={p} 
                              onClick={() => setView({ type: 'project', projectId: p.id })}
                              onChannelClick={(cid) => setView({ type: 'channel', projectId: p.id, channelId: cid })}
                            />
                        ))}
                    </div>
                </div>
            )}
            {view.type === 'project' && activeProject && (
                <ProjectPage 
                    project={activeProject} 
                    onVoiceToggle={() => setIsVoiceModeOpen(true)} 
                    onSendMessage={handleSendMessage}
                />
            )}
            {view.type === 'channel' && activeChannel && (
                <ChannelPage channel={activeChannel} onVoiceToggle={() => setIsVoiceModeOpen(true)} onSendMessage={handleSendMessage} />
            )}
            {view.type === 'project_summary' && activeProject && (
                <WorkspaceSummary project={activeProject} onNavigateToChannel={(cid) => setView({ type: 'channel', projectId: activeProject.id, channelId: cid })} />
            )}
            {view.type === 'channel_summary' && activeChannel && activeProject && (
                <ChannelSummary channel={activeChannel} project={activeProject} onVoiceToggle={() => setIsVoiceModeOpen(true)} onSendMessage={handleSendMessage} />
            )}
            {view.type === 'settings' && <SettingsPage onBack={() => setView({ type: 'home' })} darkMode={isDarkMode} setDarkMode={setIsDarkMode} />}
            {view.type === 'new_workspace' && <NewWorkspacePage onCreate={(t, th) => {
                const id = `p_${Date.now()}`;
                const newProj: Project = { 
                  id, 
                  title: t, 
                  category: 'LIFE', 
                  categoryColor: '#22D1EE',
                  schedule: 'APR 2026',
                  tags: ['Trip'],
                  progressExplanation: 'Trip workspace initialized.',
                  description: '', 
                  profileId: 'p_life', 
                  members: [SYSTEM_USERS[0]], 
                  messages: [], 
                  channels: [], 
                  progress: 0 
                };
                setProjects([...projects, newProj]);
                setView({ type: 'project', projectId: id });
            }} />}
            {view.type === 'new_channel' && activeProject && <NewChannelPage project={activeProject} onCreate={(t) => {
                const cid = `c_${Date.now()}`;
                setProjects(prev => prev.map(p => p.id === activeProject.id ? { ...p, channels: [...p.channels, { id: cid, title: t, members: [SYSTEM_USERS[0]], messages: [] }] } : p));
                setView({ type: 'channel', projectId: activeProject.id, channelId: cid });
            }} />}
        </div>
      </main>

      {view.type === 'home' && (
        <div className="fixed bottom-8 left-0 right-0 px-6 z-50 flex justify-center pointer-events-none">
          <div className="w-full max-w-lg pointer-events-auto">
            <ChatInput onVoiceToggle={() => setIsVoiceModeOpen(true)} onSendMessage={handleSendMessage} placeholder="Ask Rima to summarize trip..." />
          </div>
        </div>
      )}
    </div>
  );
};

export default App;
