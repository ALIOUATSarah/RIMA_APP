import React, { useState } from 'react';
import { ThemeColor } from '../types';
import { Palette, Shield, ListChecks, CheckCircle, Rocket } from "@phosphor-icons/react";

interface NewWorkspacePageProps {
  onCreate: (title: string, theme: ThemeColor) => void;
}

const NewWorkspacePage: React.FC<NewWorkspacePageProps> = ({ onCreate }) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [theme, setTheme] = useState<ThemeColor>('teal');
  const [priority, setPriority] = useState('Medium');
  const [visibility, setVisibility] = useState('Private');

  const themes: {id: ThemeColor, color: string}[] = [
    { id: 'teal', color: 'bg-teal-500' },
    { id: 'emerald', color: 'bg-emerald-500' },
    { id: 'rust', color: 'bg-orange-600' },
    { id: 'gold', color: 'bg-amber-500' },
    { id: 'obsidian', color: 'bg-zinc-500' },
    { id: 'indigo', color: 'bg-indigo-500' },
    { id: 'rose', color: 'bg-rose-500' },
    { id: 'sky', color: 'bg-sky-400' },
    { id: 'violet', color: 'bg-violet-500' },
    { id: 'slate', color: 'bg-slate-400' },
  ];

  return (
    <div className="w-full max-w-lg px-6 flex flex-col gap-10 py-10 animate-fade-in overflow-y-auto scrollbar-hide">
      <div className="space-y-2 text-center">
        <p className="text-zinc-500 font-light text-lg">Define a new environment for your goals</p>
      </div>

      <div className="space-y-8">
        <div className="space-y-3">
          <label className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-600">Workspace Title</label>
          <input 
            type="text" 
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="e.g. Dubai Marina Project"
            className="w-full bg-[#141416] border border-white/5 rounded-2xl px-6 py-4 text-white focus:outline-none focus:border-white/20 transition-all placeholder:text-zinc-800"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
            <div className="space-y-3">
                <label className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-600">Priority Level</label>
                <select 
                    value={priority}
                    onChange={(e) => setPriority(e.target.value)}
                    className="w-full bg-[#141416] border border-white/5 rounded-2xl px-4 py-4 text-white focus:outline-none appearance-none cursor-pointer"
                >
                    <option>Low</option>
                    <option>Medium</option>
                    <option>High</option>
                </select>
            </div>
            <div className="space-y-3">
                <label className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-600">Visibility</label>
                <select 
                    value={visibility}
                    onChange={(e) => setVisibility(e.target.value)}
                    className="w-full bg-[#141416] border border-white/5 rounded-2xl px-4 py-4 text-white focus:outline-none appearance-none cursor-pointer"
                >
                    <option>Private</option>
                    <option>Team Shared</option>
                    <option>Public</option>
                </select>
            </div>
        </div>

        <div className="space-y-4">
          <label className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-600">Visual ID Accent</label>
          <div className="flex flex-wrap gap-3">
            {themes.map((t) => (
              <button
                key={t.id}
                onClick={() => setTheme(t.id)}
                className={`w-8 h-8 rounded-xl ${t.color} transition-all duration-300 relative ${theme === t.id ? 'scale-110 ring-2 ring-white/20 ring-offset-4 ring-offset-[#0a0a0b]' : 'opacity-20 hover:opacity-100'}`}
              >
                {theme === t.id && <div className="absolute inset-0 flex items-center justify-center text-white"><CheckCircle weight="fill" size={14} /></div>}
              </button>
            ))}
          </div>
        </div>

        <button 
          disabled={!title.trim()}
          onClick={() => onCreate(title, theme)}
          className="w-full h-16 bg-stone-200 text-black rounded-3xl font-black text-xs tracking-[0.2em] uppercase flex items-center justify-center gap-3 disabled:opacity-20 transition-all hover:bg-white active:scale-95 shadow-2xl shadow-black mt-6"
        >
          <Rocket size={20} weight="fill" />
          Initialize Space
        </button>
      </div>
    </div>
  );
};

export default NewWorkspacePage;