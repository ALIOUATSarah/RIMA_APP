import React, { useEffect, useRef } from 'react';
import { Project, User } from '../types';
import ChatInput from './ChatInput';
import { Checks } from "@phosphor-icons/react";

interface ProjectPageProps {
  project: Project;
  onVoiceToggle: () => void;
  onSendMessage: (content: string) => void;
}

const ProjectPage: React.FC<ProjectPageProps> = ({ project, onVoiceToggle, onSendMessage }) => {
  const scrollRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [project.messages]);

  return (
    <div className="w-full max-w-2xl h-full flex flex-col overflow-hidden">
      <div className="flex-1 overflow-y-auto px-4 py-6 space-y-2 scrollbar-hide">
        {project.messages.length === 0 && (
          <div className="h-full flex flex-col items-center justify-center opacity-30 text-center px-12">
            <h3 className="text-xl font-bold mb-2">Workspace Assistant</h3>
            <p className="text-sm font-light">Directly connected to RIMA Intelligence Engine.</p>
          </div>
        )}
        
        {project.messages.map((msg, idx) => {
            const isSelf = msg.sender !== 'Rima' && (msg.sender as User).id === 'u_sara';
            const isRima = msg.sender === 'Rima';
            const prevMsg = project.messages[idx - 1];
            const nextMsg = project.messages[idx + 1];
            const showAvatar = !isSelf && (!nextMsg || nextMsg.sender !== msg.sender);

            return (
              <div key={msg.id} className={`flex w-full mb-1 ${isSelf ? 'justify-end' : 'justify-start items-end gap-2'}`}>
                  {!isSelf && (
                    <div className="w-8 h-8 shrink-0">
                      {showAvatar && (
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-[10px] shadow-sm ${isRima ? 'bg-zinc-800 text-white border border-white/10' : (msg.sender as User).avatarColor}`}>
                          {isRima ? 'R' : (msg.sender as User).name[0]}
                        </div>
                      )}
                    </div>
                  )}

                  <div className={`flex flex-col max-w-[75%] ${isSelf ? 'items-end' : 'items-start'}`}>
                      {showAvatar && !isSelf && (
                         <div className="flex items-center gap-2 mb-1 px-1">
                            <span className="text-[10px] font-black uppercase tracking-widest text-zinc-600">
                                {isRima ? 'Rima AI' : (msg.sender as User).name}
                            </span>
                         </div>
                      )}
                      
                      <div className={`relative px-4 py-2.5 shadow-sm ${
                        isSelf 
                          ? 'bg-[#007AFF] text-white rounded-[20px] rounded-br-[4px]' 
                          : 'bg-[#262629] text-stone-200 rounded-[20px] rounded-bl-[4px]'
                      }`}>
                          <p className="text-[15px] leading-snug break-words">{msg.content}</p>
                          <div className={`flex items-center gap-1 mt-1 ${isSelf ? 'justify-end' : 'justify-start'}`}>
                             <span className={`text-[9px] font-bold uppercase ${isSelf ? 'text-blue-200/60' : 'text-zinc-600'}`}>{msg.timestamp}</span>
                             {isSelf && <Checks size={12} weight="bold" className="text-blue-300/80" />}
                          </div>
                      </div>
                  </div>
              </div>
            );
        })}
        <div ref={scrollRef} />
      </div>

      <div className="p-6">
        <ChatInput onVoiceToggle={onVoiceToggle} onSendMessage={onSendMessage} placeholder={`Ask Rima for project details...`} />
      </div>
    </div>
  );
};

export default ProjectPage;