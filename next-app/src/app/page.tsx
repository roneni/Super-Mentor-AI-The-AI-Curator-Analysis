"use client";

import { useState, useEffect } from "react";
import { AnalysisResult, DiscoveredItem, RefinedItem } from "@/types";
import { IDEA_DESCRIPTION } from "@/lib/constants";
import { fetchMarketAnalysis } from "@/lib/api-client";
import { Navbar } from "@/components/Navbar";
import { ContactForm } from "@/components/ContactForm";
import { StrategyView } from "@/components/StrategyView";
import { MvpSpecView } from "@/components/MvpSpecView";
import { ProductionLineView } from "@/components/ProductionLineView";
import { PublicFeedView } from "@/components/PublicFeedView";

function loadFromStorage<T>(key: string, fallback: T): T {
  if (typeof window === "undefined") return fallback;
  try {
    const saved = localStorage.getItem(key);
    return saved && saved !== "undefined" ? JSON.parse(saved) : fallback;
  } catch {
    return fallback;
  }
}

export default function Home() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [data, setData] = useState<AnalysisResult | null>(null);
  const [view, setView] = useState<"analysis" | "spec" | "discovery" | "public">("analysis");
  const [isAntigravityActive, setIsAntigravityActive] = useState(false);
  const [isContactModalOpen, setIsContactModalOpen] = useState(false);

  const [githubUser, setGithubUser] = useState<{ name: string; avatar: string } | null>(() => loadFromStorage("curator_github_user", null));
  const [isGitHubModalOpen, setIsGitHubModalOpen] = useState(false);
  const [isSyncingToGitHub, setIsSyncingToGitHub] = useState(false);
  const [mascotUrl, setMascotUrl] = useState<string>(() => loadFromStorage("curator_mascot", ""));

  const [approvedTools, setApprovedTools] = useState<DiscoveredItem[]>(() => loadFromStorage("curator_approved_tools", []));
  const [refinedItems, setRefinedItems] = useState<RefinedItem[]>(() => loadFromStorage("curator_refined_items", []));

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);
        const analysis = await fetchMarketAnalysis(IDEA_DESCRIPTION);
        setData(analysis);
      } catch (err: unknown) {
        const e = err as { message?: string };
        console.error(err);
        setError(e?.message || "Failed to initialize. The AI models might be overloaded.");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    localStorage.setItem("curator_approved_tools", JSON.stringify(approvedTools));
    localStorage.setItem("curator_refined_items", JSON.stringify(refinedItems));
    localStorage.setItem("curator_mascot", mascotUrl);
    localStorage.setItem("curator_github_user", JSON.stringify(githubUser));
  }, [approvedTools, refinedItems, mascotUrl, githubUser]);

  const connectGitHub = () => {
    setIsSyncingToGitHub(true);
    setTimeout(() => {
      setGithubUser({ name: "AI_Curator_User", avatar: "https://github.com/identicons/curator.png" });
      setIsSyncingToGitHub(false);
      setIsGitHubModalOpen(false);
    }, 1500);
  };

  const pushToGitHub = () => {
    if (!githubUser) { setIsGitHubModalOpen(true); return; }
    setIsSyncingToGitHub(true);
    setTimeout(() => { setIsSyncingToGitHub(false); alert("Signals Pushed to curator-signals-repo successfully!"); }, 2000);
  };

  const handleGitHubAction = () => {
    if (githubUser) { pushToGitHub(); } else { setIsGitHubModalOpen(true); }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-black text-white p-6">
        <div className="w-20 h-20 bg-gradient-to-tr from-purple-500 to-teal-400 rounded-full animate-pulse mb-8 flex items-center justify-center shadow-[0_0_50px_rgba(168,85,247,0.4)]">
          <div className="w-12 h-12 border-4 border-white border-t-transparent rounded-full animate-spin" />
        </div>
        <h1 className="text-3xl font-black tracking-tighter uppercase italic bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-500">Initializing Cosmic Deep-Scan...</h1>
        <p className="text-gray-600 font-bold tracking-widest mt-2 uppercase text-[10px]">Syncing with April 2026 Ecosystem</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-black text-white p-6 text-center">
        <div className="w-20 h-20 bg-red-500/20 text-red-500 rounded-full mb-8 flex items-center justify-center shadow-[0_0_50px_rgba(239,68,68,0.4)]">
          <span className="text-4xl">&#9888;&#65039;</span>
        </div>
        <h1 className="text-3xl font-black tracking-tighter uppercase italic text-red-400 mb-4">System Overload</h1>
        <p className="text-gray-400 max-w-md mb-8">{error}</p>
        <button onClick={() => window.location.reload()} className="px-8 py-4 bg-white text-black font-black uppercase tracking-widest rounded-full hover:bg-gray-200 transition-all">
          Retry Connection
        </button>
      </div>
    );
  }

  return (
    <>
      <Navbar
        view={view}
        setView={setView}
        onContactOpen={() => setIsContactModalOpen(true)}
        githubUser={githubUser}
        onGitHubAction={handleGitHubAction}
        isSyncingToGitHub={isSyncingToGitHub}
        isAntigravityActive={isAntigravityActive}
        toggleAntigravity={() => setIsAntigravityActive(!isAntigravityActive)}
      />

      {view === "analysis" && data && <StrategyView data={data} />}
      {view === "spec" && data && <MvpSpecView data={data} />}
      {view === "discovery" && (
        <ProductionLineView
          approvedTools={approvedTools}
          setApprovedTools={setApprovedTools}
          refinedItems={refinedItems}
          setRefinedItems={setRefinedItems}
          mascotUrl={mascotUrl}
          setMascotUrl={setMascotUrl}
          githubUser={githubUser}
          onPushToGitHub={pushToGitHub}
          isSyncingToGitHub={isSyncingToGitHub}
        />
      )}
      {view === "public" && (
        <PublicFeedView
          refinedItems={refinedItems}
          mascotUrl={mascotUrl}
          isAntigravityActive={isAntigravityActive}
        />
      )}

      {/* GitHub Connect Modal */}
      {isGitHubModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="bg-[#0a0a0a] border border-white/10 rounded-3xl w-full max-w-sm p-8 space-y-6">
            <h2 className="text-xl font-black text-white uppercase tracking-widest">Connect GitHub</h2>
            <p className="text-gray-400 text-sm">Link your GitHub account to push curated intelligence to your repositories.</p>
            <button onClick={connectGitHub} disabled={isSyncingToGitHub} className="w-full py-4 bg-white text-black font-black uppercase tracking-widest rounded-xl hover:bg-gray-200 transition-all disabled:opacity-50">
              {isSyncingToGitHub ? "Connecting..." : "Authorize GitHub"}
            </button>
            <button onClick={() => setIsGitHubModalOpen(false)} className="w-full py-3 text-gray-500 text-sm hover:text-white transition-colors">Cancel</button>
          </div>
        </div>
      )}

      {/* Reset Button */}
      <div className="fixed bottom-12 left-12 no-print flex gap-6 z-[100]">
        <button onClick={() => { if (window.confirm("Wipe Ecosystem History?")) { setApprovedTools([]); setRefinedItems([]); setGithubUser(null); localStorage.clear(); window.location.reload(); } }} className="w-16 h-16 bg-red-950/20 text-red-500 rounded-full flex items-center justify-center hover:bg-red-600 hover:text-white transition-all border border-red-500/20 shadow-2xl group" title="Reset Ecosystem">
          <span className="text-2xl group-hover:rotate-12 transition-transform">&#x1F5D1;&#xFE0F;</span>
        </button>
      </div>

      <ContactForm isOpen={isContactModalOpen} onClose={() => setIsContactModalOpen(false)} />
    </>
  );
}
