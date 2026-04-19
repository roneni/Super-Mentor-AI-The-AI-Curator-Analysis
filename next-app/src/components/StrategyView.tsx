"use client";

import { AnalysisResult } from "@/types";

interface StrategyViewProps {
  data: AnalysisResult;
}

export function StrategyView({ data }: StrategyViewProps) {
  return (
    <div className="max-w-7xl mx-auto px-10 py-32 space-y-20 text-right">
      <header className="space-y-8">
        <div className="flex items-center justify-end gap-3">
          <span className="text-[12px] font-black text-purple-400 uppercase tracking-[0.5em]">Executive Strategy</span>
          <span className="w-20 h-[1px] bg-white/20" />
        </div>
        <h1 className="text-9xl font-black uppercase italic tracking-tighter leading-[0.8]">
          Strategic <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-l from-white to-gray-700">Blueprint.</span>
        </h1>
        <p className="text-gray-500 text-4xl font-light max-w-3xl mr-auto leading-relaxed">
          The &ldquo;Super-Mentor&rdquo; Vision for AI Ecosystem Dominance in 2026.
        </p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-16 mt-20">
        <div className="bg-[#0a0a0a] p-16 rounded-[70px] border border-white/5 space-y-12 shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-full h-1 bg-purple-500/20" />
          <h3 className="text-4xl font-black text-purple-400 uppercase italic tracking-tight">Market Frictions</h3>
          <div className="space-y-10">
            {data.friction.map((f, i) => (
              <div key={i} className="flex gap-8 items-start flex-row-reverse group">
                <span className="text-purple-500 font-black text-5xl opacity-10 group-hover:opacity-100 transition-all duration-500 italic">0{i + 1}</span>
                <p className="text-gray-400 text-2xl font-medium leading-relaxed pt-3 group-hover:text-white transition-colors">{f}</p>
              </div>
            ))}
          </div>
        </div>
        <div className="bg-[#0a0a0a] p-16 rounded-[70px] border border-white/5 space-y-12 shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-full h-1 bg-teal-500/20" />
          <h3 className="text-4xl font-black text-emerald-400 uppercase italic tracking-tight">Competitive Landscape</h3>
          <div className="space-y-6">
            {data.snapshot.map((c, i) => (
              <div key={i} className="bg-white/[0.02] p-8 rounded-[40px] border border-white/5 flex justify-between items-center group flex-row-reverse hover:bg-white/5 transition-all duration-500">
                <div className="text-right">
                  <h4 className="text-2xl font-black text-white group-hover:text-emerald-400 transition-colors">{c.name}</h4>
                  <p className="text-gray-500 text-lg mt-2 font-medium">{c.promise}</p>
                </div>
                <div className="text-[11px] font-black text-emerald-500 bg-emerald-500/10 px-5 py-2 rounded-full border border-emerald-500/20 uppercase tracking-widest">{c.traffic}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {data.groundingUrls && data.groundingUrls.length > 0 && (
        <div className="mt-32 p-16 bg-white/[0.02] rounded-[70px] border border-white/5 backdrop-blur-3xl">
          <h3 className="text-[12px] font-black text-gray-500 uppercase tracking-[0.5em] mb-10 border-b border-white/5 pb-6">Validated Intelligence Sources (April 2026 Grounding)</h3>
          <ul className="flex flex-wrap gap-6">
            {data.groundingUrls.map((url, i) => (
              <li key={i}>
                <a href={url} target="_blank" rel="noopener noreferrer" className="text-[11px] font-black text-blue-400 hover:text-white transition-all bg-blue-500/5 px-6 py-3 rounded-full border border-blue-500/10 hover:border-blue-400 flex items-center gap-3 uppercase tracking-widest">
                  <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" /></svg>
                  {new URL(url).hostname}
                </a>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
