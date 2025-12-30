import React, { useEffect, useRef, useState } from 'react';
import { Channel, Project, User } from '../types';
import { Users, Info, Hash, Clock, ShieldCheck, Sparkle, Checks, ChartLine, PlusCircle, UserPlus, X, Plus, EnvelopeSimple, PaperPlaneTilt } from "@phosphor-icons/react";
import ChatInput from './ChatInput';
import { SYSTEM_USERS } from '../constants';

interface ChannelSummaryProps {
  channel: Channel;
  project: Project;
  onVoiceToggle: () => void;
  onSendMessage: (content: string) => void;
  onNewChannel: () => void;
  onAddMember: (userId: string) => void;
  onInviteMember: (email: string) => void;
}

const ChannelSummary: React.FC<ChannelSummaryProps> = ({ 
  channel, 
  project, 
  onVoiceToggle, 
  onSendMessage, 
  onNewChannel, 
  onAddMember, 
  onInviteMember 
}) => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [showInviteMenu, setShowInviteMenu] = useState(false);
  const [inviteEmail, setInviteEmail] = useState('');
  
  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [channel.messages]);

  const potentialMembers = SYSTEM_USERS.filter(u => !channel.members.some(m => m.id === u.id));

  const handleEmailInvite = () => {
    if (inviteEmail.includes('@')) {
      onInviteMember(inviteEmail);
      setInviteEmail('');
      setShowInviteMenu(false);
    }
  };

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
              <div className="text-xl font-bold text-white">
                {channel.members.length === 1 ? 'Private' : `${channel.members.length} Members`}
              </div>
          </div>
        </div>

        {/* Member Management */}
        <div className="space-y-4">
            <div className="flex items-center justify-between px-1">
                <h3 className="text-[10px] font-black uppercase tracking-widest text-zinc-600">Team Members</h3>
                <button 
                  onClick={() => setShowInviteMenu(!showInviteMenu)}
                  className="flex items-center gap-1.5 text-[10px] font-black uppercase tracking-widest text-stone-200 hover:text-white transition-colors"
                >
                  <UserPlus size={14} weight="bold" />
                  Add Member
                </button>
            </div>

            {showInviteMenu && (
              <div className="p-5 bg-white/[0.03] border border-white/10 rounded-2xl space-y-5 animate-slide-up shadow-2xl">
                <div className="flex justify-between items-center">
                  <span className="text-[10px] font-black uppercase tracking-widest text-zinc-400">Add to Channel</span>
                  <button onClick={() => setShowInviteMenu(false)} className="text-zinc-600 hover:text-white transition-colors">
                    <X size={16}/>
                  </button>
                </div>

                {/* Email Invite Section */}
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <EnvelopeSimple size={14} className="text-zinc-500" />
                    <span className="text-[9px] font-black uppercase tracking-widest text-zinc-500">Invite via Email</span>
                  </div>
                  <div className="flex gap-2">
                    <input 
                      type="email" 
                      value={inviteEmail}
                      onChange={(e) => setInviteEmail(e.target.value)}
                      placeholder="teammate@example.com"
                      className="flex-1 bg-black/40 border border-white/5 rounded-xl px-4 py-3 text-xs focus:outline-none focus:border-white/20 transition-all text-white placeholder:text-zinc-700"
                    />
                    <button 
                      onClick={handleEmailInvite}
                      disabled={!inviteEmail.includes('@')}
                      className="px-4 bg-stone-200 hover:bg-white disabled:opacity-20 text-black rounded-xl transition-all flex items-center justify-center"
                    >
                      <PaperPlaneTilt size={18} weight="fill" />
                    </button>
                  </div>
                </div>

                <div className="h-[1px] bg-white/5 w-full" />

                {/* System Users Section */}
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <Users size={14} className="text-zinc-500" />
                    <span className="text-[9px] font-black uppercase tracking-widest text-zinc-500">Suggested Contacts</span>
                  </div>
                  {potentialMembers.length === 0 ? (
                    <p className="text-[10px] text-zinc-600 italic px-1">No more contacts to add.</p>
                  ) : (
                    <div className="grid grid-cols-1 gap-2 max-h-48 overflow-y-auto scrollbar-hide">
                      {potentialMembers.map(user => (
                        <button 
                          key={user.id}
                          onClick={() => { onAddMember(user.id); setShowInviteMenu(false); }}
                          className="flex items-center justify-between p-3 rounded-xl bg-white/5 hover:bg-white/10 transition-colors text-left group"
                        >
                          <div className="flex items-center gap-3">
                            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-[10px] font-black ${user.avatarColor}`}>
                              {user.name[0]}
                            </div>
                            <div>
                              <p className="text-xs font-bold text-white">{user.name}</p>
                              <p className="text-[8px] text-zinc-600 font-black uppercase tracking-tight">{user.role || 'Member'}</p>
                            </div>
                          </div>
                          <Plus size={14} className="text-zinc-700 group-hover:text-white transition-colors" />
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )}

            <div className="flex flex-wrap gap-2">
                {channel.members.map(member => (
                    <div 
                      key={member.id}
                      className="flex items-center gap-2 p-2 pr-4 rounded-xl bg-[#141416] border border-white/5"
                    >
                        <div className={`w-7 h-7 rounded-lg flex items-center justify-center text-[9px] font-black ${member.avatarColor}`}>
                            {member.name[0]}
                        </div>
                        <div className="text-left min-w-0">
                            <p className="text-[11px] font-bold text-white leading-tight truncate">{member.name}</p>
                            <p className="text-[7px] text-zinc-600 uppercase font-black tracking-widest leading-tight">{member.role || 'Member'}</p>
                        </div>
                    </div>
                ))}
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