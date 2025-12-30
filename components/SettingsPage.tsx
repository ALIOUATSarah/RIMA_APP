import React, { useState } from 'react';
import { Moon, Bell, Shield, CaretLeft, EyeClosed, Palette, SlidersHorizontal, ArrowRight, Check } from "@phosphor-icons/react";
import { ThemeColor } from '../types';

interface SettingsPageProps {
  onBack: () => void;
  darkMode: boolean;
  setDarkMode: (val: boolean) => void;
}

const SettingsPage: React.FC<SettingsPageProps> = ({ onBack, darkMode, setDarkMode }) => {
  const [motion, setMotion] = useState(true);
  const [accent, setAccent] = useState<ThemeColor>('teal');

  const themes: ThemeColor[] = ['teal', 'emerald', 'gold', 'rust', 'indigo', 'rose', 'sky', 'violet'];

  return (
    <div className="w-full max-w-2xl px-6 flex flex-col gap-8 pb-32 pt-8 overflow-y-auto scrollbar-hide animate-fade-in">
      <div className="space-y-8">
          <Section title="Interface">
              <ToggleItem 
                icon={<Moon size={20}/>} 
                label="Dark Mode" 
                active={darkMode} 
                onToggle={() => setDarkMode(!darkMode)} 
              />
              <ToggleItem 
                icon={<EyeClosed size={20}/>} 
                label="Reduced Motion" 
                active={motion} 
                onToggle={() => setMotion(!motion)} 
              />
          </Section>

          <Section title="Theme Accent">
            <div className="p-5 rounded-2xl bg-[#141416] border border-white/5">
                <div className="grid grid-cols-4 gap-4">
                    {themes.map(t => (
                        <button 
                            key={t}
                            onClick={() => setAccent(t)}
                            className={`h-12 rounded-xl flex items-center justify-center transition-all ${accent === t ? 'ring-2 ring-white ring-offset-4 ring-offset-[#141416] scale-95' : 'opacity-40 hover:opacity-100'}`}
                            style={{ backgroundColor: getHex(t) }}
                        >
                            {accent === t && <Check size={16} weight="bold" className="text-white" />}
                        </button>
                    ))}
                </div>
            </div>
          </Section>

          <Section title="Account & Security">
              <LinkItem icon={<Shield size={20}/>} label="Privacy & Data Management" />
              <LinkItem icon={<Bell size={20}/>} label="Notification Channels" />
          </Section>

          <Section title="System Status">
              <div className="p-5 rounded-2xl bg-[#141416]/50 border border-white/5 space-y-4">
                  <StatusLine label="Rima Neural Engine" status="Optimized" color="text-emerald-500" />
                  <StatusLine label="API Latency" status="12ms" color="text-zinc-600" />
                  <StatusLine label="Build Version" status="1.4.2" color="text-zinc-600" />
              </div>
          </Section>

          <div className="text-center opacity-20 mt-12 py-8 border-t border-white/5">
              <p className="text-[10px] uppercase tracking-[0.6em] mb-2 font-branding text-white">RIMA OS</p>
              <p className="text-[9px] font-black uppercase tracking-widest italic">Personal Productivity Universe</p>
          </div>
      </div>
    </div>
  );
};

const Section: React.FC<{ title: string; children: React.ReactNode }> = ({ title, children }) => (
    <div className="space-y-3">
        <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-zinc-600 ml-1">{title}</h3>
        <div className="space-y-2">
            {children}
        </div>
    </div>
);

const ToggleItem: React.FC<{ icon: React.ReactNode; label: string; active: boolean; onToggle: () => void }> = ({ icon, label, active, onToggle }) => (
    <div 
        className="flex items-center justify-between p-4 rounded-2xl bg-[#141416] border border-white/5 hover:border-white/10 transition-all cursor-pointer group"
        onClick={onToggle}
    >
        <div className="flex items-center gap-4">
            <div className={`p-2 rounded-lg transition-colors ${active ? 'bg-white/10 text-white' : 'bg-white/5 text-zinc-700'}`}>
                {icon}
            </div>
            <span className="text-sm font-bold text-zinc-300">{label}</span>
        </div>
        <div className={`w-12 h-6 rounded-full p-1 transition-colors duration-300 ${active ? 'bg-emerald-500' : 'bg-zinc-800'}`}>
            <div className={`w-4 h-4 bg-white rounded-full transition-transform duration-300 ${active ? 'translate-x-6' : 'translate-x-0'}`} />
        </div>
    </div>
);

const LinkItem: React.FC<{ icon: React.ReactNode; label: string }> = ({ icon, label }) => (
    <div className="flex items-center justify-between p-4 rounded-2xl bg-[#141416] border border-white/5 hover:bg-white/5 hover:translate-x-1 transition-all cursor-pointer group">
        <div className="flex items-center gap-4">
            <div className="p-2 rounded-lg bg-white/5 text-zinc-600 group-hover:text-white transition-colors">
                {icon}
            </div>
            <span className="text-sm font-bold text-zinc-400 group-hover:text-white transition-colors">{label}</span>
        </div>
        <ArrowRight size={16} className="text-zinc-800 group-hover:text-zinc-500" />
    </div>
);

const StatusLine: React.FC<{ label: string; status: string; color: string }> = ({ label, status, color }) => (
    <div className="flex items-center justify-between">
        <span className="text-xs text-zinc-500 font-bold uppercase tracking-tight">{label}</span>
        <span className={`text-xs font-black uppercase tracking-widest ${color}`}>{status}</span>
    </div>
);

function getHex(theme: ThemeColor): string {
    const map: Record<ThemeColor, string> = {
        teal: '#14b8a6', emerald: '#10b981', gold: '#f59e0b', rust: '#ea580c',
        indigo: '#6366f1', rose: '#f43f5e', sky: '#0ea5e9', violet: '#8b5cf6',
        obsidian: '#3f3f46', slate: '#64748b'
    };
    return map[theme];
}

export default SettingsPage;