"use client";

interface NavbarProps {
  view: string;
  setView: (v: "analysis" | "spec" | "discovery" | "public") => void;
  onContactOpen: () => void;
  githubUser: { name: string; avatar: string } | null;
  onGitHubAction: () => void;
  isSyncingToGitHub: boolean;
  isAntigravityActive: boolean;
  toggleAntigravity: () => void;
}

export function Navbar({ view, setView, onContactOpen, githubUser, onGitHubAction, isSyncingToGitHub, isAntigravityActive, toggleAntigravity }: NavbarProps) {
  return (
    <nav className="max-w-7xl mx-auto px-10 py-10 flex justify-between items-center relative z-[100]">
      <div className="flex items-center gap-10">
        <div className="flex flex-col">
          <div className="text-3xl font-black tracking-tighter uppercase italic bg-clip-text text-transparent bg-gradient-to-l from-white to-gray-600">AI CURATOR.</div>
          <span className="text-[8px] font-black text-purple-400 tracking-[0.5em] uppercase">Signal Intelligence v3.2</span>
        </div>
        <div className="h-10 w-[1px] bg-white/10" />
        <button onClick={onContactOpen} className="flex items-center gap-3 px-6 py-3 rounded-full text-[10px] font-black uppercase tracking-widest transition-all bg-white text-black hover:bg-gray-200 shadow-[0_0_20px_rgba(255,255,255,0.1)]">
          CONTACT SALES
        </button>
        <button onClick={onGitHubAction} className={`flex items-center gap-3 px-6 py-3 rounded-full text-[10px] font-black uppercase tracking-widest transition-all ${githubUser ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 shadow-[0_0_20px_rgba(16,185,129,0.1)]' : 'bg-white/5 text-gray-500 border border-white/5 hover:bg-white/10 hover:text-white'}`}>
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" /></svg>
          {isSyncingToGitHub ? 'SYNCING...' : githubUser ? 'PUSH TO GITHUB' : 'CONNECT GITHUB'}
        </button>
        <button onClick={toggleAntigravity} className={`w-12 h-12 rounded-full flex items-center justify-center transition-all ${isAntigravityActive ? 'bg-cyan-500 text-black shadow-[0_0_30px_rgba(6,182,212,0.6)]' : 'bg-white/5 text-white hover:bg-white/10 hover:border-white/20 border border-transparent'}`} title="Toggle Antigravity Mode">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M19 14l-7 7m0 0l-7-7m7 7V3" /></svg>
        </button>
      </div>
      <div className="flex gap-10">
        {(["analysis", "spec", "discovery", "public"] as const).map(v => (
          <button key={v} onClick={() => setView(v)} className={`text-[11px] font-black uppercase tracking-[0.3em] transition-all relative py-2 ${view === v ? 'text-purple-400' : 'text-gray-500 hover:text-white'}`}>
            {v === 'analysis' ? 'Strategy' : v === 'spec' ? 'MVP Spec' : v === 'discovery' ? 'Production Line' : 'Public Feed'}
            {view === v && <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-purple-500 to-teal-400 rounded-full" />}
          </button>
        ))}
      </div>
    </nav>
  );
}
