"use client";

import { AnalysisResult } from "@/types";

interface MvpSpecViewProps {
  data: AnalysisResult;
}

export function MvpSpecView({ data }: MvpSpecViewProps) {
  return (
    <div className="max-w-7xl mx-auto px-10 py-32 space-y-20 text-right">
      <div className="flex items-center justify-end gap-3 mb-4">
        <span className="text-[12px] font-black text-teal-400 uppercase tracking-[0.5em]">Product Roadmap</span>
        <span className="w-20 h-[1px] bg-white/20" />
      </div>
      <h1 className="text-9xl font-black text-white tracking-tighter uppercase leading-[0.8] italic">
        MVP <br />
        <span className="text-transparent bg-clip-text bg-gradient-to-l from-teal-400 to-white">Spec.</span>
      </h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-10 pt-20">
        {data.features.map((f, i) => (
          <div key={i} className="bg-[#0a0a0a] p-16 rounded-[70px] border border-white/5 hover:border-teal-500/30 transition-all duration-700 group relative overflow-hidden shadow-2xl">
            <div className="absolute top-0 right-0 w-full h-1 bg-teal-500/10 group-hover:bg-teal-500/40 transition-all" />
            <div className="w-20 h-20 bg-teal-500/10 rounded-3xl mb-10 flex items-center justify-center text-4xl group-hover:bg-teal-500 group-hover:text-black transition-all duration-500 group-hover:scale-110">&#10024;</div>
            <h3 className="text-4xl font-black text-white mb-8 leading-tight group-hover:text-teal-400 transition-colors">{f.title}</h3>
            <p className="text-gray-400 text-xl leading-relaxed font-light group-hover:text-gray-200 transition-colors">{f.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
