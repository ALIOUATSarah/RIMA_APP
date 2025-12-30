import React from 'react';

const Background: React.FC = () => {
  return (
    <div className="fixed inset-0 z-0 pointer-events-none bg-[#0a0a0b]">
      {/* Subtle depth gradients */}
      <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_20%_20%,_rgba(40,40,50,0.15),_transparent_40%)]" />
      <div className="absolute bottom-0 right-0 w-full h-full bg-[radial-gradient(circle_at_80%_80%,_rgba(30,30,40,0.1),_transparent_50%)]" />
      
      {/* Texture Layer */}
      <div className="absolute inset-0 opacity-[0.02]" style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")` }}></div>

      {/* Grid Overlay */}
      <div className="absolute inset-0 opacity-[0.03]" style={{ 
        backgroundImage: 'linear-gradient(to right, #ffffff 1px, transparent 1px), linear-gradient(to bottom, #ffffff 1px, transparent 1px)',
        backgroundSize: '80px 80px'
      }}></div>

      {/* Modern Accents */}
      <div className="absolute top-[10%] right-[5%] w-[40%] h-[40%] bg-zinc-400/5 blur-[120px] rounded-full animate-pulse-glow" />
    </div>
  );
};

export default Background;