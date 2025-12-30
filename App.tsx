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
import { List, CaretLeft, UsersThree, X, UserCircle, Lock, CaretDown, Sparkle, Clock, Target, Plus, Video, Hash, ArrowSquareOut, Checks, ChartBar, Info, PlusCircle, Eye, UserPlus, EnvelopeSimple, PaperPlaneTilt } from "@phosphor-icons/react";
import { GoogleGenAI } from "@google/genai";

const App: React.FC = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isVoiceModeOpen, setIsVoiceModeOpen] = useState(false);
  const [activeProfileId, setActiveProfileId] = useState<string>(PROFILES[0].id);
  const [projects, setProjects] = useState<Project[]>(INITIAL_PROJECTS);
  const [view, setView] = useState<ViewType>({ type: 'home' });
  const [isDarkMode, setIsDarkMode] = useState(true);
  
  const [showRightDropdown, setShowRightDropdown] = useState(false);
  const [showMembersDropdown, setShowMembersDropdown] = useState(false);
  const [isAddingInDropdown, setIsAddingInDropdown] = useState(false);
  const [inviteEmail, setInviteEmail] = useState('');
  
  const dropdownRef = useRef<HTMLDivElement>(null);
  const membersRef = useRef<HTMLDivElement>(null);

  const activeProject = view.projectId ? projects.find(p => p.id === view.projectId) : null;
  const activeChannel = activeProject && view.channelId ? activeProject.channels.find(s => s.id === view.channelId) : null;

  // Clear unread indicator when visiting a channel
  useEffect(() => {
    if (view.type === 'channel' && view.projectId && view.channelId) {
      setProjects(prev => prev.map(p => {
        if (p.id === view.projectId) {
          const hasUnread = p.channels.some(ch => ch.id === view.channelId && ch.unreadCount);
          if (hasUnread) {
            return {
              ...p,
              channels: p.channels.map(ch => 
                ch.id === view.channelId ? { ...ch, unreadCount: undefined } : ch
              )
            };
          }
        }
        return p;
      }));
    }
  }, [view.type, view.projectId, view.channelId]);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowRightDropdown(false);
      }
      if (membersRef.current && !membersRef.current.contains(event.target as Node)) {
        setShowMembersDropdown(false);
        setIsAddingInDropdown(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSendMessage = async (content: string) => {
    if (!content.trim()) return;

    const newMessage: Message = {
      id: Date.now().toString(),
      sender: SYSTEM_USERS[0], // Sara
      content,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    // Update UI immediately with user message
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

    // Generate AI Response if tagged or in private assistant context
    const isTaggingRima = content.toLowerCase().includes('@rima');
    const isAssistantContext = view.type === 'project_summary' || view.type === 'channel_summary' || (activeChannel && activeChannel.members.length === 1);
    
    if (isTaggingRima || isAssistantContext) {
      try {
        const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
        const modelName = 'gemini-3-flash-preview';
        
        // Construct context for the AI
        const contextStr = `
          Current System Context:
          Workspace: ${activeProject?.title || 'Unknown'}
          Workspace Description: ${activeProject?.description || 'No description'}
          Channel: ${activeChannel?.title || 'Main Lobby'}
          Channel Description: ${activeChannel?.description || 'General Chat'}
          Workspace Progress: ${activeProject?.progress || 0}%
          Active Phase: ${activeProject?.phase || 'Planning'}
          Project Budget: ${activeProject?.budget || 'Not specified'}
          Deadline: ${activeProject?.deadline || 'Ongoing'}
          
          User Identity: Sara (System Owner)
        `;

        const history = view.channelId 
          ? activeChannel?.messages.slice(-15) 
          : activeProject?.messages.slice(-15);

        const prompt = `
          ${contextStr}
          
          Conversation History (Last 15):
          ${history?.map(m => `${typeof m.sender === 'string' ? m.sender : m.sender.name}: ${m.content}`).join('\n')}
          
          Current input from Sara: "${content}"
          
          RIMA AGENT SYSTEM INSTRUCTION:
          You are Rima, the Conversational Intelligence layer. You turn messy chat into organized outcomes. 
          Your tone is calm, professional, and slightly futuristic. 
          
          CRITICAL CONSTRAINTS:
          1. ABSOLUTELY NO EMOJIS. No sparkles, no checkmarks, no icons.
          2. HIGH-CONTRAST PROFESSIONALISM. Be direct and analytical.
          3. ZERO ORGANIZATION: Do the sorting for the user. Identify tasks, risks, and deadlines automatically.
          4. Use bullet points for structured data.
          5. Keep it under 4 sentences unless providing a detailed list.
        `;

        const result = await ai.models.generateContent({
          model: modelName,
          contents: prompt,
        });

        const rimaMessage: Message = {
          id: `rima_${Date.now()}`,
          sender: 'Rima',
          content: result.text || "Synchronizing with workspace memory.",
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        };

        // Delay slightly for natural feel
        setTimeout(() => {
          setProjects(prev => prev.map(p => {
            if ((view.type === 'project' || view.type === 'project_summary') && p.id === view.projectId) {
              return { ...p, messages: [...p.messages, rimaMessage] };
            }
            if ((view.type === 'channel' || view.type === 'channel_summary') && p.id === view.projectId) {
              return {
                ...p,
                channels: p.channels.map(s => s.id === view.channelId ? { ...s, messages: [...s.messages, rimaMessage] } : s)
              };
            }
            return p;
          }));
        }, 1200);

      } catch (error) {
        console.error("Gemini Error:", error);
      }
    }
  };

  const handleAddMember = (userId: string) => {
    const userToAdd = SYSTEM_USERS.find(u => u.id === userId);
    if (!userToAdd || !view.projectId || !view.channelId) return;

    setProjects(prev => prev.map(p => {
      if (p.id === view.projectId) {
        return {
          ...p,
          channels: p.channels.map(ch => {
            if (ch.id === view.channelId) {
              if (ch.members.some(m => m.id === userId)) return ch;
              return { ...ch, members: [...ch.members, userToAdd] };
            }
            return ch;
          })
        };
      }
      return p;
    }));
  };

  const handleInviteByEmail = (email: string) => {
    if (!email.trim() || !view.projectId || !view.channelId) return;
    
    const nameFromEmail = email.split('@')[0];
    const newUser: User = {
      id: `u_${Date.now()}`,
      name: nameFromEmail.charAt(0).toUpperCase() + nameFromEmail.slice(1),
      avatarColor: 'bg-zinc-700 text-white',
      role: 'Guest'
    };

    setProjects(prev => prev.map(p => {
      if (p.id === view.projectId) {
        return {
          ...p,
          channels: p.channels.map(ch => {
            if (ch.id === view.channelId) {
              return { ...ch, members: [...ch.members, newUser] };
            }
            return ch;
          })
        };
      }
      return p;
    }));
  };

  const renderHeaderContent = () => {
    const isSummaryView = ['settings', 'new_workspace', 'new_channel', 'project_summary', 'channel_summary'].includes(view.type);

    if (isSummaryView) {
      const title = view.type === 'settings' ? 'Settings' : 
                    view.type === 'new_workspace' ? 'Initialize Workspace' : 
                    view.type === 'new_channel' ? 'New Channel' : 
                    view.type === 'project_summary' ? 'Overview' : 'Overview';
      return (
        <>
          <button onClick={() => setView({ type: view.type.includes('summary') ? (view.type.includes('project') ? 'project' : 'channel') : 'home', projectId: view.projectId, channelId: view.channelId })} className="p-2 text-stone-400 hover:text-white transition-colors">
            <CaretLeft size={24} weight="bold" />
          </button>
          <h1 className="text-xl font-bold tracking-tight text-white">{title}</h1>
          <div className="w-10" />
        </>
      );
    }

    return (
      <div className="flex-1 flex items-center justify-between w-full">
        <button onClick={() => setIsSidebarOpen(true)} className="p-2 text-stone-400 hover:text-white transition-colors">
          <List size={26} weight="light" />
        </button>

        {view.type === 'home' ? (
          <h1 className="text-xs font-branding tracking-[0.5em] uppercase text-zinc-300">RIMA</h1>
        ) : (
          <button 
            onClick={() => setView({ type: view.type === 'project' ? 'project_summary' : 'channel_summary', projectId: view.projectId, channelId: view.channelId })}
            className="flex-1 flex flex-col justify-center items-center group"
          >
             <h1 className="text-xl font-bold tracking-tight text-white px-2 group-hover:opacity-70 transition-opacity">
               {view.type === 'project' ? activeProject?.title : activeChannel?.title}
             </h1>
             {view.type === 'channel' && activeChannel && (
               <span className="text-[9px] font-black uppercase tracking-widest text-zinc-600 mt-0.5 group-hover:opacity-70 transition-opacity">
                 {activeChannel.members.length === 1 ? 'Private' : `${activeChannel.members.length} Members`}
               </span>
             )}
          </button>
        )}

        <div className="flex items-center justify-end w-12 relative min-w-[48px]" ref={view.type === 'project' ? dropdownRef : membersRef}>
          {view.type === 'home' ? (
            <div className="w-6" /> 
          ) : view.type === 'channel' ? (
            <>
              {activeChannel && activeChannel.members.length === 1 ? (
                <button 
                  onClick={() => setShowMembersDropdown(!showMembersDropdown)}
                  className="p-2 text-zinc-600 hover:text-white transition-colors"
                >
                  <Lock size={22} weight="bold" />
                </button>
              ) : (
                <button 
                  onClick={() => setShowMembersDropdown(!showMembersDropdown)}
                  className="flex -space-x-2 overflow-hidden hover:opacity-80 transition-opacity"
                >
                  {activeChannel?.members.slice(0, 3).map((member, i) => (
                    <div 
                      key={member.id} 
                      className={`w-7 h-7 rounded-full border-2 border-[#0a0a0b] flex items-center justify-center text-[10px] font-black uppercase ${member.avatarColor}`}
                    >
                      {member.name[0]}
                    </div>
                  ))}
                  {activeChannel && activeChannel.members.length > 3 && (
                    <div className="w-7 h-7 rounded-full border-2 border-[#0a0a0b] bg-zinc-800 text-zinc-400 flex items-center justify-center text-[8px] font-black uppercase">
                      +{activeChannel.members.length - 3}
                    </div>
                  )}
                </button>
              )}

              {showMembersDropdown && activeChannel && (
                <div className="absolute top-full right-0 mt-3 w-64 bg-[#141416]/95 backdrop-blur-xl border border-white/10 rounded-2xl shadow-2xl p-2 z-50 animate-slide-up">
                  {isAddingInDropdown ? (
                    <div className="space-y-4 p-2">
                      <div className="flex items-center justify-between px-2 mb-1">
                        <span className="text-[10px] font-black uppercase tracking-widest text-zinc-500">Invite Members</span>
                        <button onClick={() => setIsAddingInDropdown(false)} className="text-zinc-600 hover:text-white"><X size={14}/></button>
                      </div>
                      
                      <div className="space-y-2">
                        <div className="flex gap-1.5">
                          <input 
                            type="email" 
                            placeholder="Email address..." 
                            value={inviteEmail}
                            onChange={(e) => setInviteEmail(e.target.value)}
                            className="flex-1 bg-black/40 border border-white/5 rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-white/20 transition-all text-white"
                          />
                          <button 
                            disabled={!inviteEmail.includes('@')}
                            onClick={() => { handleInviteByEmail(inviteEmail); setInviteEmail(''); setIsAddingInDropdown(false); }}
                            className="p-2 bg-stone-200 hover:bg-white text-black rounded-xl disabled:opacity-20 transition-all"
                          >
                            <PaperPlaneTilt size={16} weight="fill" />
                          </button>
                        </div>
                      </div>

                      <div className="space-y-1 max-h-48 overflow-y-auto scrollbar-hide">
                        <span className="block px-2 py-1 text-[9px] font-black uppercase text-zinc-700">Suggestions</span>
                        {SYSTEM_USERS.filter(u => !activeChannel.members.some(m => m.id === u.id)).map(user => (
                          <button 
                            key={user.id}
                            onClick={() => { handleAddMember(user.id); setIsAddingInDropdown(false); }}
                            className="w-full flex items-center gap-3 p-2 rounded-xl hover:bg-white/5 transition-colors text-left"
                          >
                            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-[10px] font-black ${user.avatarColor}`}>{user.name[0]}</div>
                            <div className="min-w-0">
                              <p className="text-xs font-bold text-white truncate">{user.name}</p>
                              <p className="text-[8px] text-zinc-600 uppercase font-black">{user.role || 'Member'}</p>
                            </div>
                            <Plus size={14} className="ml-auto text-zinc-700" />
                          </button>
                        ))}
                      </div>
                    </div>
                  ) : (
                    <>
                      <div className="px-4 py-2 border-b border-white/5 text-[10px] font-black uppercase tracking-widest text-zinc-500">
                        Channel Members
                      </div>
                      <div className="max-h-64 overflow-y-auto scrollbar-hide py-1">
                        {activeChannel.members.map(member => (
                          <div key={member.id} className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-colors">
                            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-[10px] font-black uppercase ${member.avatarColor} border border-white/5`}>
                              {member.name[0]}
                            </div>
                            <div className="flex flex-col min-w-0">
                              <span className="text-sm font-bold text-stone-200 truncate">{member.name}</span>
                              <span className="text-[9px] font-black text-zinc-600 uppercase tracking-tight">{member.role || 'Member'}</span>
                            </div>
                          </div>
                        ))}
                      </div>
                      <div className="border-t border-white/5 mt-1 pt-1">
                        <button 
                          onClick={() => setIsAddingInDropdown(true)}
                          className="w-full flex items-center gap-3 px-4 py-3 hover:bg-white/5 text-left rounded-xl transition-colors text-zinc-400 hover:text-white group"
                        >
                          <UserPlus size={18} weight="bold" className="text-zinc-500 group-hover:text-stone-200 transition-colors" />
                          <span className="text-sm font-bold">Add Member</span>
                        </button>
                      </div>
                    </>
                  )}
                </div>
              )}
            </>
          ) : (
            <>
              <button 
                onClick={() => {
                  if (view.type === 'project') {
                    setShowRightDropdown(!showRightDropdown);
                  }
                }}
                className="p-1 rounded-full hover:bg-white/5 transition-colors"
              >
                <Hash size={24} weight="bold" className="text-zinc-400" />
              </button>

              {showRightDropdown && view.type === 'project' && (
                <div className="absolute top-full right-0 mt-3 w-64 bg-[#141416]/95 backdrop-blur-xl border border-white/10 rounded-2xl shadow-2xl p-2 z-50 animate-slide-up">
                  <div className="px-4 py-2 border-b border-white/5 text-[10px] font-black uppercase tracking-widest text-zinc-500">
                    Workspace Channels
                  </div>
                  <div className="max-h-60 overflow-y-auto scrollbar-hide py-1">
                    {activeProject?.channels.map(ch => (
                      <button 
                        key={ch.id}
                        onClick={() => { setView({ type: 'channel', projectId: activeProject.id, channelId: ch.id }); setShowRightDropdown(false); }}
                        className="w-full flex items-center gap-3 px-4 py-3 hover:bg-white/5 text-left rounded-xl transition-colors"
                      >
                        <Hash size={16} className="text-zinc-600" />
                        <span className="text-sm font-bold text-stone-200">{ch.title}</span>
                      </button>
                    ))}
                    <div className="border-t border-white/5 mt-1 pt-1">
                      <button 
                        onClick={() => { setView({ type: 'new_channel', projectId: activeProject?.id }); setShowRightDropdown(false); }}
                        className="w-full flex items-center gap-3 px-4 py-3 hover:bg-white/5 text-left rounded-xl transition-colors text-zinc-400 hover:text-white"
                      >
                        <PlusCircle size={18} weight="bold" />
                        <span className="text-sm font-bold">New Channel</span>
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    );
  };

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
                <div className="flex-1 w-full max-w-xl px-6 pb-48 flex flex-col gap-6 pt-4 overflow-y-auto scrollbar-hide">
                    <div className="grid grid-cols-1 gap-5">
                        {projects.filter(p => activeProfileId === 'all' || p.profileId === activeProfileId).map(p => (
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
                <WorkspaceSummary 
                  project={activeProject} 
                  onNavigateToChannel={(cid) => setView({ type: 'channel', projectId: activeProject.id, channelId: cid })} 
                  onVoiceToggle={() => setIsVoiceModeOpen(true)} 
                  onSendMessage={handleSendMessage}
                  onNewChannel={() => setView({ type: 'new_channel', projectId: activeProject.id })}
                />
            )}
            {view.type === 'channel_summary' && activeChannel && activeProject && (
                <ChannelSummary 
                  channel={activeChannel} 
                  project={activeProject} 
                  onVoiceToggle={() => setIsVoiceModeOpen(true)} 
                  onSendMessage={handleSendMessage}
                  onNewChannel={() => setView({ type: 'new_channel', projectId: activeProject.id })}
                  onAddMember={handleAddMember}
                  onInviteMember={handleInviteByEmail}
                />
            )}
            {view.type === 'settings' && <SettingsPage onBack={() => setView({ type: 'home' })} darkMode={isDarkMode} setDarkMode={setIsDarkMode} />}
            {view.type === 'new_workspace' && <NewWorkspacePage onCreate={(t, th) => {
                const id = `p_${Date.now()}`;
                const newProj: Project = { id, title: t, theme: th, description: '', profileId: 'p_work', members: [SYSTEM_USERS[0]], messages: [], channels: [], progress: 0 };
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
            <ChatInput onVoiceToggle={() => setIsVoiceModeOpen(true)} onSendMessage={handleSendMessage} placeholder="Talk to Rima..." />
          </div>
        </div>
      )}
    </div>
  );
};

export default App;