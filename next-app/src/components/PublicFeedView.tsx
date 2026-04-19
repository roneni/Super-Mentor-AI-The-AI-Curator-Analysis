"use client";

import { useState } from "react";
import { RefinedItem } from "@/types";
import { SOCIAL_PLATFORMS } from "@/lib/constants";

interface PublicFeedViewProps {
  refinedItems: RefinedItem[];
  mascotUrl: string;
  isAntigravityActive: boolean;
}

export function PublicFeedView({ refinedItems, mascotUrl, isAntigravityActive }: PublicFeedViewProps) {
  const [activeShareId, setActiveShareId] = useState<string | null>(null);
  const [selectedItem, setSelectedItem] = useState<RefinedItem | null>(null);

  const executeSocialShare = (e: React.MouseEvent, platform: typeof SOCIAL_PLATFORMS[0], item: RefinedItem) => {
    e.stopPropagation();
    const shareText = `[AI SIGNAL] ${item.hook} — Via AI Curator`;
    const shareUrl = platform.getUrl(shareText, item.originalLink);
    window.open(shareUrl, '_blank', 'noopener,noreferrer');
  };

  return (
    <main className="max-w-7xl mx-auto px-10 pb-40 space-y-40">
      {/* Hero */}
      <section className="min-h-[85vh] flex flex-col lg:flex-row items-center justify-between gap-16 py-20 relative z-10">
        <div className="flex-1 text-right space-y-12">
          <div className="space-y-4">
            <div className="flex items-center justify-end gap-3 mb-8">
              <span className="w-12 h-[1px] bg-white/20" />
              <span className="text-[11px] font-black text-purple-400 uppercase tracking-[0.5em]">Cosmic Curation</span>
            </div>
            <h1 className="text-8xl md:text-[12rem] font-black leading-[0.8] tracking-tighter uppercase italic">
              Filter <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-l from-purple-500 via-teal-300 to-white">The Noise.</span>
            </h1>
            <div className="flex items-center justify-end gap-10 pt-10">
              <p className="text-gray-400 text-2xl md:text-3xl font-light max-w-xl leading-relaxed">
                &#1488;&#1493;&#1510;&#1512;&#1493;&#1514; &#1488;&#1504;&#1493;&#1513;&#1497;&#1514; &#1511;&#1508;&#1491;&#1504;&#1497;&#1514; &#1513;&#1500; &#1499;&#1500;&#1497; &#1492;-AI &#1492;&#1502;&#1493;&#1489;&#1497;&#1500;&#1497;&#1501; &#1489;&#1506;&#1493;&#1500;&#1501;. &#1488;&#1504;&#1495;&#1504;&#1493; &#1502;&#1505;&#1504;&#1504;&#1497;&#1501; (99% &#1502;&#1492;&#1512;&#1506;&#1513;) &#1499;&#1491;&#1497; &#1513;&#1514;&#1511;&#1489;&#1500;&#1493; &#1512;&#1511; &#1488;&#1514; &#1502;&#1492; &#1513;&#1502;&#1513;&#1504;&#1492; &#1489;&#1488;&#1502;&#1514;.
              </p>
              <div className="h-40 w-[2px] bg-gradient-to-b from-purple-500/50 to-transparent" />
            </div>
          </div>
          <div className="pt-10 flex items-center justify-end gap-8">
            <button className="px-16 py-8 bg-white text-black font-black rounded-full text-2xl hover:scale-110 hover:shadow-[0_0_80px_rgba(255,255,255,0.2)] transition-all duration-500 group">
              JOIN THE 1% ELITE <span className="inline-block transition-transform group-hover:translate-x-[-10px]">&#8592;</span>
            </button>
          </div>
        </div>
        <div className="flex-1 relative flex justify-center">
          <div className="absolute w-[140%] h-[140%] bg-purple-500/10 blur-[150px] animate-pulse rounded-full top-[-20%]" />
          {mascotUrl ? (
            <img src={mascotUrl} className="relative z-10 w-full max-w-xl rounded-[80px] shadow-[0_40px_100px_rgba(0,0,0,0.8)] border border-white/10 p-2 bg-black/40 backdrop-blur-xl" alt="Brand Mascot" style={{ animation: "float 8s ease-in-out infinite" }} />
          ) : (
            <div className="relative z-10 w-full max-w-xl h-[600px] bg-white/5 rounded-[80px] border border-white/5 animate-pulse" />
          )}
        </div>
      </section>

      {/* Cards Grid */}
      <div className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-16 ${isAntigravityActive ? 'h-[250vh]' : ''}`}>
        {refinedItems.map((item) => (
          <div key={item.id} id={`card-${item.id}`} onClick={() => !isAntigravityActive && setSelectedItem(item)} className={`bg-white/5 backdrop-blur-3xl border border-white/10 rounded-[60px] p-12 space-y-10 transition-all duration-700 relative group overflow-hidden ${isAntigravityActive ? 'hover:cursor-move' : 'hover:bg-white/10 hover:-translate-y-8 cursor-pointer shadow-2xl hover:shadow-purple-500/10'}`}>
            {/* Share overlay */}
            <div className={`absolute inset-0 bg-black/[0.98] backdrop-blur-2xl z-50 p-12 flex flex-col items-center justify-center transition-all duration-700 gap-10 ${activeShareId === item.id ? 'translate-y-0 opacity-100' : 'translate-y-full opacity-0 pointer-events-none'}`} onClick={(e) => { e.stopPropagation(); setActiveShareId(null); }}>
              <h4 className="text-[12px] font-black text-purple-400 uppercase tracking-[0.5em]">Broadcast Signal</h4>
              <div className="grid grid-cols-3 gap-8">
                {SOCIAL_PLATFORMS.map(platform => (
                  <button key={platform.id} onClick={(e) => executeSocialShare(e, platform, item)} className="group/btn flex flex-col items-center gap-3" title={`Share on ${platform.name}`}>
                    <div className="w-16 h-16 rounded-3xl flex items-center justify-center transition-all duration-500 border border-white/10 group-hover/btn:scale-125 group-hover/btn:border-white/40" style={{ color: platform.color, backgroundColor: platform.hoverBg }}>
                      <span className="text-2xl font-black">{platform.name[0]}</span>
                    </div>
                    <span className="text-[10px] font-black text-gray-500 uppercase tracking-widest">{platform.name}</span>
                  </button>
                ))}
              </div>
              <button onClick={(e) => { e.stopPropagation(); setActiveShareId(null); }} className="mt-8 px-10 py-4 bg-white/5 rounded-full text-[10px] font-black uppercase text-gray-500 hover:text-white transition-colors border border-white/5">Close Channel</button>
            </div>

            <div className="space-y-6 text-right">
              <div className="flex justify-between items-center flex-row-reverse border-b border-white/5 pb-6 mb-4">
                <span className="text-[11px] font-black text-teal-400 uppercase tracking-[0.4em]">Premium Signal</span>
                <span className="text-[10px] text-gray-700 font-black tracking-widest uppercase">ID_{item.id.slice(0, 6)}</span>
              </div>
              <h3 className="text-4xl font-black text-white leading-[1.1] group-hover:text-purple-400 transition-colors duration-500 italic uppercase">{item.hook}</h3>
            </div>

            <div className="space-y-4 text-right">
              <h4 className="text-[11px] font-black text-gray-600 uppercase tracking-[0.3em]">The Cagan/Graham Signal:</h4>
              <p className="text-gray-400 text-lg leading-relaxed font-medium line-clamp-3">{item.justification}</p>
            </div>

            <div className="pt-10 border-t border-white/10 italic text-white font-black text-right text-2xl leading-snug">&ldquo;{item.verdict}&rdquo;</div>

            <div className="flex justify-between items-center pt-8 border-t border-white/5 mt-4">
              <button className="text-[11px] font-black text-purple-500 uppercase tracking-[0.3em] group-hover:underline transition-all">Deep Analysis</button>
              <button onClick={(e) => { e.stopPropagation(); setActiveShareId(item.id); }} className="px-8 py-4 bg-white/5 rounded-full flex items-center gap-3 text-[10px] font-black uppercase tracking-widest hover:bg-white/10 transition-all border border-white/10">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" /></svg>
                Share
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Detail Modal */}
      {selectedItem && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-6 md:p-12 overflow-y-auto" dir="rtl">
          <div className="fixed inset-0 bg-black/90 backdrop-blur-2xl" onClick={() => setSelectedItem(null)} />
          <div className="relative bg-[#050505] border border-white/10 rounded-[80px] max-w-5xl w-full p-16 md:p-24 space-y-16 shadow-[0_0_150px_rgba(168,85,247,0.15)] overflow-hidden">
            <div className="absolute top-0 right-0 w-full h-1 bg-gradient-to-r from-purple-500 to-teal-400" />
            <button onClick={() => setSelectedItem(null)} className="absolute top-12 left-12 w-16 h-16 bg-white/5 rounded-full flex items-center justify-center text-gray-400 hover:bg-white hover:text-black transition-all duration-500 text-2xl">&#10005;</button>

            <header className="space-y-6 text-right">
              <div className="flex justify-between items-center flex-row-reverse mb-4">
                <div className="flex items-center gap-4">
                  <span className="w-10 h-10 bg-purple-500/10 rounded-2xl flex items-center justify-center text-purple-400 font-black">S</span>
                  <span className="text-sm font-black text-purple-400 uppercase tracking-[0.4em]">Cosmic Insight Signal</span>
                </div>
                <button onClick={(e) => { e.stopPropagation(); setActiveShareId(selectedItem.id); }} className="px-10 py-4 bg-purple-600/10 text-purple-400 rounded-full text-[11px] font-black uppercase tracking-[0.3em] hover:bg-purple-600 hover:text-white transition-all">Distribute Signal</button>
              </div>
              <h2 className="text-6xl md:text-8xl font-black text-white leading-tight italic uppercase">{selectedItem.hook}</h2>
            </header>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-20">
              <div className="space-y-10 text-right">
                <div className="space-y-4">
                  <h4 className="text-[12px] font-black text-gray-600 uppercase tracking-[0.4em]">Deep Analysis: The 1% Case</h4>
                  <div className="h-[2px] w-20 bg-purple-500/30 mr-0 ml-auto" />
                </div>
                <p className="text-2xl text-gray-300 leading-relaxed font-light">{selectedItem.justification}</p>
              </div>
              <div className="space-y-12">
                <div className="bg-purple-500/5 border border-purple-500/20 p-12 rounded-[60px] text-right space-y-6 relative overflow-hidden group hover:bg-purple-500/10 transition-colors">
                  <div className="absolute top-[-50%] left-[-50%] w-[200%] h-[200%] bg-purple-500/5 rotate-45 pointer-events-none" />
                  <h4 className="text-[12px] font-black text-purple-400 uppercase tracking-[0.4em]">The Super-Mentor Verdict</h4>
                  <p className="text-3xl font-black text-white italic leading-snug relative z-10">&ldquo;{selectedItem.verdict}&rdquo;</p>
                </div>
                <div className="bg-white/5 p-12 rounded-[60px] text-right space-y-8 border border-white/5">
                  <h4 className="text-[12px] font-black text-gray-600 uppercase tracking-[0.4em]">Verified Source Data</h4>
                  <div className="space-y-4">
                    <p className="text-white font-black text-lg leading-snug">{selectedItem.originalTitle}</p>
                    <div className="pt-4">
                      <a href={selectedItem.originalLink} target="_blank" rel="noopener noreferrer" className="inline-block px-12 py-5 bg-white text-black font-black rounded-full text-[11px] uppercase tracking-[0.3em] hover:scale-105 transition-all shadow-xl">Launch Research Channel</a>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
