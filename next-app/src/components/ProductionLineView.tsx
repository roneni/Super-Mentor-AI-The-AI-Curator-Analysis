"use client";

import { useState } from "react";
import { CurationFilters, DiscoveredItem, RefinedItem } from "@/types";
import { AI_DOMAINS, AI_ECOSYSTEM_TREE } from "@/lib/constants";
import { fetchDiscovery, fetchRefinement, fetchMascot } from "@/lib/api-client";

interface ProductionLineViewProps {
  approvedTools: DiscoveredItem[];
  setApprovedTools: React.Dispatch<React.SetStateAction<DiscoveredItem[]>>;
  refinedItems: RefinedItem[];
  setRefinedItems: React.Dispatch<React.SetStateAction<RefinedItem[]>>;
  mascotUrl: string;
  setMascotUrl: (url: string) => void;
  githubUser: { name: string; avatar: string } | null;
  onPushToGitHub: () => void;
  isSyncingToGitHub: boolean;
}

export function ProductionLineView({
  approvedTools, setApprovedTools, refinedItems, setRefinedItems,
  mascotUrl, setMascotUrl, githubUser, onPushToGitHub, isSyncingToGitHub
}: ProductionLineViewProps) {
  const [filters, setFilters] = useState<CurationFilters>({
    selectedDomains: [], selectedSubfields: [], selectedCompanies: [], selectedSubtopics: [],
    isTrending: false, isViral: false,
  });
  const [isSyncing, setIsSyncing] = useState(false);
  const [isGeneratingMascot, setIsGeneratingMascot] = useState(false);
  const [discoveredAlerts, setDiscoveredAlerts] = useState<DiscoveredItem[]>([]);
  const [refiningId, setRefiningId] = useState<string | null>(null);
  const [expandedCompanies, setExpandedCompanies] = useState<string[]>([]);

  const handleDiscovery = async () => {
    setIsSyncing(true);
    try {
      const news = await fetchDiscovery(filters);
      setDiscoveredAlerts(news);
    } catch (e) { console.error(e); } finally { setIsSyncing(false); }
  };

  const handleRefineItem = async (tool: DiscoveredItem) => {
    setRefiningId(tool.id);
    try {
      const refined = await fetchRefinement(tool as unknown as Record<string, unknown>);
      setRefinedItems(prev => [refined, ...prev.filter(item => item.id !== tool.id)]);
    } catch (e) { console.error(e); } finally { setRefiningId(null); }
  };

  const handleMascotGenerate = async () => {
    setIsGeneratingMascot(true);
    try { const url = await fetchMascot(); setMascotUrl(url); } catch (e) { console.error(e); } finally { setIsGeneratingMascot(false); }
  };

  const toggleDomain = (domainId: string) => {
    setFilters(prev => ({
      ...prev,
      selectedDomains: prev.selectedDomains.includes(domainId)
        ? prev.selectedDomains.filter(id => id !== domainId)
        : [...prev.selectedDomains, domainId]
    }));
  };

  const toggleSubfield = (sf: string) => {
    setFilters(prev => ({
      ...prev,
      selectedSubfields: prev.selectedSubfields.includes(sf)
        ? prev.selectedSubfields.filter(id => id !== sf)
        : [...prev.selectedSubfields, sf]
    }));
  };

  const toggleCompanyExpansion = (id: string) => {
    setExpandedCompanies(prev => prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]);
  };

  const toggleCompanySelection = (name: string) => {
    setFilters(prev => ({
      ...prev,
      selectedCompanies: prev.selectedCompanies.includes(name)
        ? prev.selectedCompanies.filter(n => n !== name)
        : [...prev.selectedCompanies, name]
    }));
  };

  const toggleSubtopic = (subtopic: string) => {
    setFilters(prev => ({
      ...prev,
      selectedSubtopics: prev.selectedSubtopics.includes(subtopic)
        ? prev.selectedSubtopics.filter(s => s !== subtopic)
        : [...prev.selectedSubtopics, subtopic]
    }));
  };

  return (
    <div className="max-w-7xl mx-auto px-10 pb-40 space-y-16">
      <header className="flex flex-col md:flex-row justify-between items-end gap-10 text-right border-b border-white/5 pb-16">
        <div className="space-y-6">
          <div className="flex items-center justify-end gap-3">
            <span className="px-3 py-1 bg-purple-500/10 border border-purple-500/20 text-purple-400 text-[9px] font-black uppercase tracking-widest rounded-full">Autonomous Engine</span>
            <h2 className="text-gray-600 text-sm font-black uppercase tracking-[0.4em]">Section 01</h2>
          </div>
          <h1 className="text-8xl font-black text-white tracking-tighter uppercase italic leading-[0.9]">
            Production <br /><span className="text-transparent bg-clip-text bg-gradient-to-l from-purple-400 to-teal-300">Line.</span>
          </h1>
          <p className="text-gray-500 text-xl font-medium max-w-xl mr-auto leading-relaxed">
            &#1502;&#1504;&#1493;&#1506; &#1492;&#1494;&#1497;&#1511;&#1493;&#1511; &#1500;&#1514;&#1493;&#1499;&#1503; &#1508;&#1512;&#1497;&#1502;&#1497;&#1493;&#1501;. &#1505;&#1497;&#1504;&#1493;&#1503; &#1512;&#1506;&#1513;&#1497;&#1501;, &#1494;&#1497;&#1492;&#1493;&#1497; &#1505;&#1497;&#1490;&#1504;&#1500;&#1497;&#1501; &#1493;&#1492;&#1495;&#1500;&#1514; &#1511;&#1493;&#1500; &#1492;&#1502;&#1493;&#1514;&#1490; &#1489;&#1494;&#1502;&#1503; &#1488;&#1502;&#1514;.
          </p>
        </div>
        <div className="flex flex-col items-end gap-6 p-10 bg-white/5 rounded-[40px] border border-white/5 backdrop-blur-3xl shadow-2xl">
          <div className="flex flex-col items-end">
            <span className="text-[10px] font-black text-gray-600 uppercase mb-2">Active Brand Persona</span>
            {mascotUrl ? (
              <div className="relative group">
                <img src={mascotUrl} className="w-24 h-24 rounded-3xl object-cover shadow-2xl border border-white/10 group-hover:scale-110 transition duration-700" alt="Mascot" />
              </div>
            ) : (
              <div className="w-24 h-24 bg-gray-900 rounded-3xl flex items-center justify-center text-gray-700 border border-dashed border-gray-800">EMPTY</div>
            )}
          </div>
          <button onClick={handleMascotGenerate} disabled={isGeneratingMascot} className={`px-10 py-5 ${mascotUrl ? 'bg-white/5 text-gray-400 border border-white/10' : 'bg-white text-black'} font-black rounded-full text-[10px] uppercase tracking-widest hover:bg-white hover:text-black transition shadow-xl`}>
            {isGeneratingMascot ? 'SCAFFOLDING...' : mascotUrl ? 'RE-GENERATE VOICE' : 'INITIALIZE MASCOT'}
          </button>
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-6 gap-12">
        {/* Filters Sidebar */}
        <div className="lg:col-span-2 space-y-10 bg-[#0a0a0a] p-10 rounded-[50px] border border-white/5 self-start shadow-2xl sticky top-10">
          <div className="space-y-6">
            <h3 className="text-[11px] font-black text-amber-400 uppercase tracking-widest flex items-center justify-end gap-3">Intelligence Mode <span className="w-2 h-2 rounded-full bg-amber-500 animate-ping" /></h3>
            <div className="grid grid-cols-2 gap-4">
              <button onClick={() => setFilters(f => ({ ...f, isTrending: !f.isTrending }))} className={`px-4 py-5 rounded-[24px] text-[10px] font-black transition-all flex flex-col items-center gap-2 border ${filters.isTrending ? 'bg-amber-600 text-white border-amber-400 shadow-[0_0_30px_rgba(217,119,6,0.4)]' : 'bg-white/5 text-gray-500 border-white/5 hover:bg-white/10'}`}>
                <span className="text-2xl">&#x1F525;</span>TRENDING
              </button>
              <button onClick={() => setFilters(f => ({ ...f, isViral: !f.isViral }))} className={`px-4 py-5 rounded-[24px] text-[10px] font-black transition-all flex flex-col items-center gap-2 border ${filters.isViral ? 'bg-pink-600 text-white border-pink-400 shadow-[0_0_30px_rgba(219,39,119,0.4)]' : 'bg-white/5 text-gray-500 border-white/5 hover:bg-white/10'}`}>
                <span className="text-2xl">&#x1F680;</span>VIRAL
              </button>
            </div>
            <div className="p-4 bg-black/40 rounded-2xl text-center border border-white/5">
              <p className="text-[9px] text-gray-500 uppercase font-black tracking-widest">Active Scan Date: <span className="text-white">APRIL 2026</span></p>
            </div>
          </div>

          <div className="space-y-6">
            <h3 className="text-[11px] font-black text-purple-400 uppercase tracking-widest border-b border-purple-500/10 pb-4">1. Market Domains</h3>
            <div className="flex flex-col gap-3 max-h-[350px] overflow-y-auto pr-3 custom-scrollbar">
              {AI_DOMAINS.map(d => (
                <button key={d.id} onClick={() => toggleDomain(d.id)} className={`w-full text-right px-6 py-4 rounded-2xl text-[11px] font-black transition-all border ${filters.selectedDomains.includes(d.id) ? 'bg-purple-600 text-white border-purple-400 shadow-xl scale-[1.02]' : 'bg-white/5 text-gray-500 border-white/5 hover:bg-white/10'}`}>{d.name}</button>
              ))}
            </div>
          </div>

          {filters.selectedDomains.length > 0 && (
            <div className="space-y-6">
              <h3 className="text-[11px] font-black text-blue-400 uppercase tracking-widest border-b border-blue-500/10 pb-4">2. Deep-Scan Subfields</h3>
              <div className="flex flex-wrap gap-2">
                {AI_DOMAINS.filter(d => filters.selectedDomains.includes(d.id)).map(d =>
                  d.subfields.map(sf => (
                    <button key={sf} onClick={() => toggleSubfield(sf)} className={`px-4 py-2.5 rounded-xl text-[10px] font-black transition-all border ${filters.selectedSubfields.includes(sf) ? 'bg-blue-600 text-white border-blue-400 shadow-lg' : 'bg-white/5 text-gray-600 border-white/5 hover:bg-white/10'}`}>{sf}</button>
                  ))
                )}
              </div>
            </div>
          )}

          <div className="space-y-6">
            <h3 className="text-[11px] font-black text-emerald-400 uppercase tracking-widest border-b border-emerald-500/10 pb-4">3. Entity Tracking</h3>
            <div className="space-y-4 max-h-[500px] overflow-y-auto pr-3 custom-scrollbar">
              {AI_ECOSYSTEM_TREE.map(company => (
                <div key={company.id} className="space-y-3">
                  <div className="flex items-center gap-3 group">
                    <button onClick={() => toggleCompanyExpansion(company.id)} className={`w-6 h-6 rounded-lg flex items-center justify-center transition-all border border-white/5 ${expandedCompanies.includes(company.id) ? 'rotate-90 bg-emerald-500 text-black border-emerald-400' : 'bg-white/5 text-gray-600'}`}>
                      <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={4} d="M9 5l7 7-7 7" /></svg>
                    </button>
                    <button onClick={() => toggleCompanySelection(company.name)} className={`flex-1 text-right px-6 py-3.5 rounded-2xl text-[11px] font-black transition-all border ${filters.selectedCompanies.includes(company.name) ? 'bg-emerald-600 text-white border-emerald-400' : 'bg-white/5 text-gray-500 border-white/5 hover:bg-white/10'}`}>
                      {company.name}
                    </button>
                  </div>
                  {expandedCompanies.includes(company.id) && company.subtopics && (
                    <div className="pr-6 border-r-2 border-emerald-500/20 mr-3 flex flex-col gap-2">
                      {company.subtopics.map(topic => (
                        <button key={topic} onClick={() => toggleSubtopic(topic)} className={`text-right px-5 py-2.5 rounded-xl text-[10px] font-black transition-all border ${filters.selectedSubtopics.includes(topic) ? 'text-emerald-300 bg-emerald-500/10 border-emerald-500/30' : 'text-gray-600 bg-white/5 border-transparent hover:text-gray-400'}`}>
                          &#8627; {topic}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          <button onClick={handleDiscovery} disabled={isSyncing} className="w-full py-7 bg-white text-black font-black rounded-3xl hover:bg-gray-200 transition-all shadow-[0_20px_60px_rgba(255,255,255,0.1)] text-[11px] tracking-[0.4em] uppercase active:scale-95">
            {isSyncing ? 'DEEP SCANNING...' : 'LAUNCH SCAN 2.0'}
          </button>
        </div>

        {/* Three-column pipeline */}
        <div className="lg:col-span-4 grid grid-cols-1 md:grid-cols-3 gap-10">
          {/* Inbox */}
          <div className="space-y-8 bg-white/[0.02] p-8 rounded-[50px] border border-white/5">
            <div className="flex justify-between items-center border-b border-white/5 pb-6">
              <h3 className="text-[11px] font-black text-gray-400 uppercase tracking-[0.4em]">01. Inbox</h3>
              <span className="text-[10px] bg-white/5 px-3 py-1 rounded-full text-gray-600 font-black">N={discoveredAlerts.length}</span>
            </div>
            <div className="space-y-6 max-h-[1000px] overflow-y-auto pr-4 custom-scrollbar">
              {discoveredAlerts.map(alert => (
                <div key={alert.id} className="bg-[#0f0f0f] border border-white/5 p-8 rounded-[45px] space-y-6 group hover:border-purple-500/40 transition-all duration-700 shadow-xl relative overflow-hidden">
                  <div className="absolute top-0 left-0 w-1 h-full bg-purple-500/20" />
                  <div className="flex justify-between items-start flex-row-reverse gap-4">
                    <h4 className="font-black text-white text-lg leading-tight flex-1">{alert.title}</h4>
                    <div className="flex flex-col items-center">
                      <span className="text-purple-400 font-black text-2xl">{alert.score}</span>
                      <span className="text-[8px] text-gray-600 font-black uppercase">Signal</span>
                    </div>
                  </div>
                  <p className="text-gray-500 text-[11px] italic font-medium leading-relaxed bg-black/40 p-5 rounded-2xl border border-white/5">&ldquo;{alert.summary}&rdquo;</p>
                  <div className="flex gap-4 pt-4 border-t border-white/5">
                    <button onClick={() => { setApprovedTools(prev => [alert, ...prev]); setDiscoveredAlerts(d => d.filter(i => i.id !== alert.id)); }} className="flex-1 py-4 bg-emerald-600/10 text-emerald-400 font-black rounded-2xl text-[10px] hover:bg-emerald-600 hover:text-white transition uppercase tracking-widest">Approve</button>
                    <button onClick={() => setDiscoveredAlerts(d => d.filter(i => i.id !== alert.id))} className="px-6 py-4 bg-white/5 text-gray-600 rounded-2xl text-[10px] uppercase font-black hover:text-red-500 transition">Discard</button>
                  </div>
                </div>
              ))}
              {discoveredAlerts.length === 0 && !isSyncing && (
                <div className="py-40 text-center space-y-4">
                  <div className="text-4xl">&#x1F4E1;</div>
                  <p className="text-gray-600 text-[10px] font-black uppercase tracking-widest">No Active Scans Found</p>
                </div>
              )}
            </div>
          </div>

          {/* Refinement */}
          <div className="space-y-8 bg-white/[0.02] p-8 rounded-[50px] border border-white/5">
            <div className="flex justify-between items-center border-b border-purple-500/10 pb-6">
              <h3 className="text-[11px] font-black text-purple-400 uppercase tracking-[0.4em]">02. Refinement</h3>
              <span className="text-[10px] bg-purple-500/10 px-3 py-1 rounded-full text-purple-900 font-black italic">SUPER-MENTOR</span>
            </div>
            <div className="space-y-6 max-h-[1000px] overflow-y-auto pr-4 custom-scrollbar">
              {approvedTools.map(tool => {
                const refined = refinedItems.find(ri => ri.id === tool.id);
                return (
                  <div key={tool.id} className={`bg-black/40 border ${refined ? 'border-purple-500/40 shadow-[0_0_30px_rgba(168,85,247,0.05)]' : 'border-white/5'} p-8 rounded-[45px] space-y-6 transition-all duration-700 relative overflow-hidden group`}>
                    <div className="flex justify-between items-center flex-row-reverse">
                      <h4 className="font-black text-white text-[13px] leading-snug flex-1">{tool.title}</h4>
                      {refined && <div className="w-3 h-3 bg-emerald-500 rounded-full animate-pulse mr-4" />}
                    </div>
                    <button onClick={() => handleRefineItem(tool)} disabled={refiningId === tool.id} className={`w-full py-5 ${refined ? 'bg-white/5 text-gray-600 cursor-default' : 'bg-gradient-to-tr from-purple-700 to-purple-500 text-white shadow-xl hover:scale-[1.02]'} font-black rounded-2xl text-[10px] transition-all uppercase tracking-widest`}>
                      {refiningId === tool.id ? 'SYNTHESIZING...' : refined ? 'VOICE SYNCED' : 'APPLY MENTOR VOICE'}
                    </button>
                    {refined && (
                      <div className="pt-6 border-t border-white/5 space-y-4">
                        <div className="space-y-1 text-right">
                          <p className="text-[9px] text-gray-600 uppercase font-black">Refined Premium Hook</p>
                          <p className="text-white text-xs font-black leading-tight italic">&ldquo;{refined.hook}&rdquo;</p>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Catalog */}
          <div className="space-y-8 bg-white/[0.02] p-8 rounded-[50px] border border-white/5 shadow-inner">
            <div className="flex justify-between items-center border-b border-blue-500/10 pb-6">
              <h3 className="text-[11px] font-black text-blue-400 uppercase tracking-[0.4em]">03. Catalog</h3>
              <div className="flex items-center gap-3">
                <span className="text-[10px] text-gray-700 font-black uppercase">Cloud Sync</span>
                <div className={`w-3 h-3 rounded-full ${githubUser ? 'bg-emerald-500' : 'bg-gray-800'}`} />
              </div>
            </div>
            <div className="space-y-6 max-h-[1000px] overflow-y-auto pr-4 custom-scrollbar">
              {refinedItems.map(item => (
                <div key={item.id} className="bg-gradient-to-b from-[#0f0f0f] to-black p-8 rounded-[45px] border border-white/5 space-y-6 text-right shadow-2xl relative group">
                  <div className="absolute top-4 left-4 text-[10px] text-gray-800 font-mono">#CAT_{item.id.slice(0, 4)}</div>
                  <div className="space-y-3">
                    <span className="text-[9px] font-black text-gray-600 uppercase tracking-widest border-b border-white/5 pb-2 inline-block">Premium Hook</span>
                    <h4 className="font-black text-white text-[15px] leading-tight group-hover:text-purple-400 transition-colors">{item.hook}</h4>
                  </div>
                  <div className="space-y-3 p-5 bg-white/[0.02] rounded-2xl">
                    <span className="text-[9px] font-black text-gray-600 uppercase tracking-widest">The 1% Case</span>
                    <p className="text-gray-400 text-[11px] leading-relaxed font-medium">{item.justification}</p>
                  </div>
                  <div className="pt-4 border-t border-white/5">
                    <p className="text-blue-400 text-xs font-black italic">&ldquo;{item.verdict}&rdquo;</p>
                  </div>
                </div>
              ))}
              {refinedItems.length > 0 && githubUser && (
                <button onClick={onPushToGitHub} className="w-full py-6 bg-gradient-to-tr from-emerald-700 to-emerald-500 text-white font-black rounded-[30px] text-[10px] uppercase tracking-[0.3em] shadow-[0_20px_40px_rgba(16,185,129,0.2)] hover:scale-[1.05] transition-all">
                  {isSyncingToGitHub ? 'PUSHING...' : 'SYNC CATALOG TO GITHUB'}
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
