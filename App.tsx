
import React, { useState, useEffect, useRef } from 'react';
import { 
  getMarketAnalysis, 
  discoverTrendingAINews, 
  refineCuratedContent, 
  generateBrandMascot 
} from './services/geminiService';
import { AnalysisResult, AIDomain, AICompany, CurationFilters, RefinedItem } from './types';
import { ContactForm } from './src/components/ContactForm';

const AI_DOMAINS: AIDomain[] = [
  { id: 'experimental', name: 'Experimental Tools', subfields: ['Google Labs', 'Edge Cases', 'Creative Tech', 'Future UX', 'Unstable Releases', 'Alpha Prototypes', 'Quantum AI', 'Brain-Computer Interfaces'] },
  { id: 'health', name: 'Health & Biotech', subfields: ['Drug Discovery', 'Neural Prosthetics', 'Genomics AI', 'Synthetic Bio', 'Radiology Automation', 'Longevity Research', 'Virtual Nursing Agents', 'Precision Medicine', 'Medical Imaging AI', 'Epidemic Prediction'] },
  { id: 'finance', name: 'Finance & Fintech', subfields: ['Algorithmic Trading', 'Predictive Risk', 'Neo-banking Agents', 'Auto-Accounting', 'Fraud Detection', 'Real-time Quant', 'Credit Intelligence', 'DeFi Analytics', 'Robo-Advisors', 'Smart Contracts'] },
  { id: 'creative', name: 'Creative Arts', subfields: ['Generative Video', 'Neural Audio/Speech', '3D Scene Gen', 'Fashion Design AI', 'Architectural Gen', 'Dynamic UX Design', 'Virtual Production', 'AI Copywriting', 'Music Generation', 'Game Asset Gen'] },
  { id: 'dev', name: 'Dev & Software Engineering', subfields: ['Code Generation', 'Autonomous Agents', 'Legacy Migration', 'CI/CD Intelligence', 'Synthetic Data Gen', 'Unit Test Auto', 'DevOps Copilot', 'Security Vulnerability Scanning', 'API Generation', 'Database Optimization'] },
  { id: 'edu', name: 'Education', subfields: ['Adaptive Learning', 'Cognitive Skill Mapping', 'Language Immersion AI', 'Automated Assessment', 'Curriculum Synth', 'Personalized Tutors', 'Lecture Insights', 'VR Classrooms', 'Special Ed Assistants'] },
  { id: 'legal', name: 'Legal & Compliance', subfields: ['Contract Intelligence', 'E-Discovery', 'Regulatory Tracking', 'Case Outcome Pred', 'Patent Analysis', 'Privacy Compliance', 'Smart Legal Agents', 'IP Protection', 'Compliance Auditing'] },
  { id: 'robotics', name: 'Robotics & Hardware', subfields: ['Swarm Intelligence', 'SLAM / Vision', 'HRI (Human-Robot)', 'Warehouse Automation', 'Soft Robotics', 'Embedded Edge AI', 'Autonomous Logistics', 'Drone Navigation', 'Industrial IoT'] },
  { id: 'marketing', name: 'Marketing & Sales', subfields: ['Hyper-Personalization', 'Sentiment Analysis', 'Dynamic Pricing', 'Persona Simulation', 'Campaign Auto', 'Journey Mapping', 'Lead Prediction', 'Ad Creative Gen', 'SEO Automation'] }
];

const AI_ECOSYSTEM_TREE: AICompany[] = [
  { id: 'google', name: 'Google', type: 'giant', description: 'DeepMind & Labs', subtopics: ['Experiments', 'DeepMind', 'Gemini 3', 'Vertex AI'] },
  { id: 'openai', name: 'OpenAI', type: 'giant', description: 'Frontier Models', subtopics: ['Sora', 'GPT-5', 'Custom GPTs', 'Reasoning Models'] },
  { id: 'meta', name: 'Meta', type: 'giant', description: 'Open Source AI', subtopics: ['Llama 4', 'PyTorch', 'AI for WhatsApp', 'Meta AI'] },
  { id: 'anthropic', name: 'Anthropic', type: 'giant', description: 'Safety Focused', subtopics: ['Claude 5', 'Constitutional AI', 'Artifacts', 'API Integration'] },
  { id: 'microsoft', name: 'Microsoft', type: 'giant', description: 'Copilot Ecosystem', subtopics: ['Azure OpenAI', 'Copilot Studio', 'PC Agents', 'Phi Models'] },
  { id: 'nvidia', name: 'NVIDIA', type: 'giant', description: 'Infrastructure', subtopics: ['CUDA-X', 'NIM Microservices', 'DGX Cloud', 'Omniverse'] },
  { id: 'manus', name: 'Manus AI', type: 'promising', description: 'Agentic Workflows', subtopics: ['Agentic Workflows', 'Action Engines', 'Cross-App Automation'] },
  { id: 'groq', name: 'Groq', type: 'promising', description: 'LPU Inference', subtopics: ['LPU Inference', 'Low Latency', 'Cloud-native Hardware'] },
  { id: 'elevenlabs', name: 'ElevenLabs', type: 'promising', description: 'Voice Over', subtopics: ['Voice Over', 'Dubbing', 'Speech-to-Speech', 'Sound Effects'] },
  { id: 'perplexity', name: 'Perplexity', type: 'promising', description: 'AI Search', subtopics: ['AI Search', 'Perplexity Pages', 'Pro Discovery'] },
  { id: 'midjourney', name: 'Midjourney', type: 'promising', description: 'V7 Engine', subtopics: ['V7 Engine', '3D Generation', 'Web Interface'] },
  { id: 'pika', name: 'Pika Labs', type: 'promising', description: 'Text-to-Video', subtopics: ['Text-to-Video', 'Motion Control', 'Physics Engines'] },
  { id: 'mistral', name: 'Mistral AI', type: 'promising', description: 'European Models', subtopics: ['Mixtral', 'Mistral Large', 'Edge Deployment'] },
  { id: 'runway', name: 'Runway', type: 'promising', description: 'Creative Suite', subtopics: ['Gen-4', 'Motion Brush', 'Creative Suite'] },
  { id: 'cohere', name: 'Cohere', type: 'promising', description: 'Enterprise RAG', subtopics: ['Command R+', 'Embeddings', 'RAG-as-a-Service'] },
  { id: 'harvey', name: 'Harvey', type: 'promising', description: 'Legal Tech', subtopics: ['Legal Research', 'Contract Drafting', 'Regulatory Compliance'] },
  { id: 'xai', name: 'xAI', type: 'promising', description: 'Real-time AI', subtopics: ['Grok-3', 'Real-time Data', 'API Platform'] },
  { id: 'glean', name: 'Glean', type: 'promising', description: 'Enterprise Search', subtopics: ['Work Assistant', 'Knowledge Graph', 'Enterprise Search'] },
  { id: 'cognition', name: 'Cognition', type: 'promising', description: 'Software Agents', subtopics: ['Devin', 'Autonomous Coding', 'Software Agents'] },
  { id: 'suno', name: 'Suno', type: 'promising', description: 'Music Gen', subtopics: ['Text-to-Music', 'Audio Post-Production', 'Music Distribution'] }
];

const SOCIAL_PLATFORMS = [
  { id: 'x', name: 'X', color: '#fff', hoverBg: 'rgba(255,255,255,0.1)', glow: 'rgba(255,255,255,0.4)', icon: (<svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>), getUrl: (text: string, url: string) => `https://x.com/intent/post?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}` },
  { id: 'linkedin', name: 'LinkedIn', color: '#0077b5', hoverBg: 'rgba(0,119,181,0.2)', glow: 'rgba(0,119,181,0.5)', icon: (<svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>), getUrl: (_text: string, url: string) => `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}` },
  { id: 'whatsapp', name: 'WhatsApp', color: '#25D366', hoverBg: 'rgba(37,211,102,0.2)', glow: 'rgba(37,211,102,0.5)', icon: (<svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>), getUrl: (text: string, url: string) => `https://api.whatsapp.com/send?text=${encodeURIComponent(text + ' ' + url)}` }
];

interface PhysicsObject { id: string; x: number; y: number; vx: number; vy: number; w: number; h: number; }

const App: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [data, setData] = useState<AnalysisResult | null>(null);
  const [view, setView] = useState<'analysis' | 'spec' | 'discovery' | 'public'>('analysis');
  const [isAntigravityActive, setIsAntigravityActive] = useState(false);
  const physicsRefs = useRef<Record<string, PhysicsObject>>({});
  const animationFrameRef = useRef<number | null>(null);
  const [activeShareId, setActiveShareId] = useState<string | null>(null);
  const [githubUser, setGithubUser] = useState<{name: string, avatar: string} | null>(() => {
    const saved = localStorage.getItem('curator_github_user');
    try { return saved && saved !== 'undefined' ? JSON.parse(saved) : null; } catch (e) { return null; }
  });
  const [isGitHubModalOpen, setIsGitHubModalOpen] = useState(false);
  const [isSyncingToGitHub, setIsSyncingToGitHub] = useState(false);
  const [mascotUrl, setMascotUrl] = useState<string>(() => localStorage.getItem('curator_mascot') || '');
  const [isGeneratingMascot, setIsGeneratingMascot] = useState(false);
  const [filters, setFilters] = useState<CurationFilters>({
    selectedDomains: [],
    selectedSubfields: [],
    selectedCompanies: [],
    selectedSubtopics: [],
    isTrending: false,
    isViral: false
  });
  const [isSyncing, setIsSyncing] = useState(false);
  const [isContactModalOpen, setIsContactModalOpen] = useState(false);
  const [discoveredAlerts, setDiscoveredAlerts] = useState<any[]>([]);
  const [approvedTools, setApprovedTools] = useState<any[]>(() => {
    const saved = localStorage.getItem('curator_approved_tools');
    try { return saved && saved !== 'undefined' ? JSON.parse(saved) : []; } catch (e) { return []; }
  });
  const [refinedItems, setRefinedItems] = useState<RefinedItem[]>(() => {
    const saved = localStorage.getItem('curator_refined_items');
    try { return saved && saved !== 'undefined' ? JSON.parse(saved) : []; } catch (e) { return []; }
  });
  const [refiningId, setRefiningId] = useState<string | null>(null);
  const [selectedItem, setSelectedItem] = useState<RefinedItem | null>(null);
  const [expandedCompanies, setExpandedCompanies] = useState<string[]>([]);

  const ideaDescription = `The AI Curator: Curation superpower, human filter, 1% quality, Apple Cosmic aesthetic. Fusing Cagan, Kim, and Graham.`;

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);
        const analysis = await getMarketAnalysis(ideaDescription);
        setData(analysis);
      } catch (err: any) { 
        console.error(err);
        setError(err?.message || "Failed to initialize. The AI models might be overloaded.");
      } finally { 
        setLoading(false); 
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    localStorage.setItem('curator_approved_tools', JSON.stringify(approvedTools));
    localStorage.setItem('curator_refined_items', JSON.stringify(refinedItems));
    localStorage.setItem('curator_mascot', mascotUrl);
    localStorage.setItem('curator_github_user', JSON.stringify(githubUser));
  }, [approvedTools, refinedItems, mascotUrl, githubUser]);

  useEffect(() => {
    if (isAntigravityActive && view === 'public') {
      const gravity = 0.5; const friction = 0.98; const wallBounciness = 0.7;
      const runPhysics = () => {
        const winW = window.innerWidth; const winH = window.innerHeight;
        (Object.values(physicsRefs.current) as PhysicsObject[]).forEach(obj => {
          obj.vy += gravity; obj.vx *= friction; obj.vy *= friction;
          obj.x += obj.vx; obj.y += obj.vy;
          if (obj.y + obj.h > winH) { obj.y = winH - obj.h; obj.vy *= -wallBounciness; }
          if (obj.x < 0) { obj.x = 0; obj.vx *= -wallBounciness; }
          else if (obj.x + obj.w > winW) { obj.x = winW - obj.w; obj.vx *= -wallBounciness; }
          const el = document.getElementById(`card-${obj.id}`);
          if (el) el.style.transform = `translate(${obj.x}px, ${obj.y}px) rotate(${obj.vx * 2}deg)`;
        });
        animationFrameRef.current = requestAnimationFrame(runPhysics);
      };
      refinedItems.forEach((item) => {
        const el = document.getElementById(`card-${item.id}`);
        if (el && !physicsRefs.current[item.id]) {
          const rect = el.getBoundingClientRect();
          physicsRefs.current[item.id] = { id: item.id, x: rect.left, y: rect.top, vx: (Math.random() - 0.5) * 10, vy: (Math.random() - 0.5) * 5, w: rect.width, h: rect.height };
          el.style.position = 'fixed'; el.style.top = '0'; el.style.left = '0'; el.style.zIndex = '50'; el.style.width = `${rect.width}px`;
        }
      });
      animationFrameRef.current = requestAnimationFrame(runPhysics);
    } else {
      if (animationFrameRef.current) cancelAnimationFrame(animationFrameRef.current);
      Object.keys(physicsRefs.current).forEach(id => {
        const el = document.getElementById(`card-${id}`);
        if (el) { el.style.position = ''; el.style.top = ''; el.style.left = ''; el.style.transform = ''; el.style.zIndex = ''; el.style.width = ''; }
      });
      physicsRefs.current = {};
    }
    return () => { if (animationFrameRef.current) cancelAnimationFrame(animationFrameRef.current); };
  }, [isAntigravityActive, view, refinedItems]);

  const handleDiscovery = async () => {
    setIsSyncing(true);
    try {
      const news = await discoverTrendingAINews(filters);
      setDiscoveredAlerts(news);
    } catch (e) { console.error(e); } finally { setIsSyncing(false); }
  };

  const handleRefineItem = async (tool: any) => {
    setRefiningId(tool.id);
    try {
      const refined = await refineCuratedContent(tool);
      setRefinedItems(prev => [refined, ...prev.filter(item => item.id !== tool.id)]);
    } catch (e) { console.error(e); } finally { setRefiningId(null); }
  };

  const handleMascotGenerate = async () => {
    setIsGeneratingMascot(true);
    try { const url = await generateBrandMascot(); setMascotUrl(url); } catch (e) { console.error(e); } finally { setIsGeneratingMascot(false); }
  };

  const connectGitHub = () => {
    setIsSyncingToGitHub(true);
    setTimeout(() => {
      setGithubUser({ name: 'AI_Curator_User', avatar: 'https://github.com/identicons/curator.png' });
      setIsSyncingToGitHub(false); setIsGitHubModalOpen(false);
    }, 1500);
  };

  const pushToGitHub = () => {
    if (!githubUser) { setIsGitHubModalOpen(true); return; }
    setIsSyncingToGitHub(true);
    setTimeout(() => { setIsSyncingToGitHub(false); alert('Signals Pushed to curator-signals-repo successfully!'); }, 2000);
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

  const executeSocialShare = (e: React.MouseEvent, platform: any, item: RefinedItem) => {
    e.stopPropagation();
    const shareText = `[AI SIGNAL] ${item.hook} — Via AI Curator`;
    const shareUrl = platform.id === 'reddit' 
      ? platform.getUrl(shareText, item.originalLink, item.hook)
      : platform.getUrl(shareText, item.originalLink);
    window.open(shareUrl, '_blank', 'noopener,noreferrer');
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-[#000] text-white p-6">
        <div className="w-20 h-20 bg-gradient-to-tr from-purple-500 to-teal-400 rounded-full animate-pulse mb-8 flex items-center justify-center shadow-[0_0_50px_rgba(168,85,247,0.4)]">
           <div className="w-12 h-12 border-4 border-white border-t-transparent rounded-full animate-spin"></div>
        </div>
        <h1 className="text-3xl font-black tracking-tighter uppercase italic bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-500">Initializing Cosmic Deep-Scan...</h1>
        <p className="text-gray-600 font-bold tracking-widest mt-2 uppercase text-[10px]">Syncing with April 2026 Ecosystem</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-[#000] text-white p-6 text-center">
        <div className="w-20 h-20 bg-red-500/20 text-red-500 rounded-full mb-8 flex items-center justify-center shadow-[0_0_50px_rgba(239,68,68,0.4)]">
           <span className="text-4xl">⚠️</span>
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
    <div className={`min-h-screen bg-black text-white selection:bg-purple-500 overflow-x-hidden ${isAntigravityActive ? 'border-4 border-cyan-500/20' : ''}`} dir="rtl">
      {/* Decorative Background Elements */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-purple-600/10 blur-[120px] rounded-full"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-teal-600/5 blur-[150px] rounded-full"></div>
      </div>

      <nav className="max-w-7xl mx-auto px-10 py-10 flex justify-between items-center no-print relative z-[100]">
        <div className="flex items-center gap-10">
          <div className="flex flex-col">
            <div className="text-3xl font-black tracking-tighter uppercase italic bg-clip-text text-transparent bg-gradient-to-l from-white to-gray-600">AI CURATOR.</div>
            <span className="text-[8px] font-black text-purple-400 tracking-[0.5em] uppercase">Signal Intelligence v3.2</span>
          </div>
          <div className="h-10 w-[1px] bg-white/10"></div>
          <button onClick={() => setIsContactModalOpen(true)} className="flex items-center gap-3 px-6 py-3 rounded-full text-[10px] font-black uppercase tracking-widest transition-all bg-white text-black hover:bg-gray-200 shadow-[0_0_20px_rgba(255,255,255,0.1)]">
            CONTACT SALES
          </button>
          <button onClick={() => githubUser ? pushToGitHub() : setIsGitHubModalOpen(true)} className={`flex items-center gap-3 px-6 py-3 rounded-full text-[10px] font-black uppercase tracking-widest transition-all ${githubUser ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 shadow-[0_0_20px_rgba(16,185,129,0.1)]' : 'bg-white/5 text-gray-500 border border-white/5 hover:bg-white/10 hover:text-white'}`}>
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/></svg>
            {isSyncingToGitHub ? 'SYNCING...' : githubUser ? 'PUSH TO GITHUB' : 'CONNECT GITHUB'}
          </button>
          <button onClick={() => setIsAntigravityActive(!isAntigravityActive)} className={`w-12 h-12 rounded-full flex items-center justify-center transition-all ${isAntigravityActive ? 'bg-cyan-500 text-black shadow-[0_0_30px_rgba(6,182,212,0.6)]' : 'bg-white/5 text-white hover:bg-white/10 hover:border-white/20 border border-transparent'}`} title="Toggle Google Antigravity Mode"><svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M19 14l-7 7m0 0l-7-7m7 7V3" /></svg></button>
        </div>
        <div className="flex gap-10">
          {['analysis', 'spec', 'discovery', 'public'].map(v => (
            <button key={v} onClick={() => setView(v as any)} className={`text-[11px] font-black uppercase tracking-[0.3em] transition-all relative py-2 ${view === v ? 'text-purple-400' : 'text-gray-500 hover:text-white'}`}>
              {v === 'analysis' ? 'Strategy' : v === 'spec' ? 'MVP Spec' : v === 'discovery' ? 'Production Line' : 'Public Feed'}
              {view === v && <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-purple-500 to-teal-400 rounded-full"></div>}
            </button>
          ))}
        </div>
      </nav>

      {view === 'discovery' && (
        <div className="max-w-7xl mx-auto px-10 pb-40 space-y-16 animate-in slide-in-from-bottom-8 duration-1000">
          <header className="flex flex-col md:flex-row justify-between items-end gap-10 text-right border-b border-white/5 pb-16">
             <div className="space-y-6">
                <div className="flex items-center justify-end gap-3"><span className="px-3 py-1 bg-purple-500/10 border border-purple-500/20 text-purple-400 text-[9px] font-black uppercase tracking-widest rounded-full">Autonomous Engine</span><h2 className="text-gray-600 text-sm font-black uppercase tracking-[0.4em]">Section 01</h2></div>
                <h1 className="text-8xl font-black text-white tracking-tighter uppercase italic leading-[0.9]">Production <br/><span className="text-transparent bg-clip-text bg-gradient-to-l from-purple-400 to-teal-300">Line.</span></h1>
                <p className="text-gray-500 text-xl font-medium max-w-xl mr-auto leading-relaxed">מנוע הזיקוק לתוכן פרימיום. סינון רעשים, זיהוי סיגנלים והחלת קול המותג בזמן אמת.</p>
             </div>
             <div className="flex flex-col items-end gap-6 p-10 bg-white/5 rounded-[40px] border border-white/5 backdrop-blur-3xl shadow-2xl">
                <div className="flex flex-col items-end">
                  <span className="text-[10px] font-black text-gray-600 uppercase mb-2">Active Brand Persona</span>
                  {mascotUrl ? (
                    <div className="relative group">
                      <img src={mascotUrl} className="w-24 h-24 rounded-3xl object-cover shadow-2xl border border-white/10 group-hover:scale-110 transition duration-700" alt="Mascot" />
                      <div className="absolute inset-0 bg-purple-500/20 opacity-0 group-hover:opacity-100 transition rounded-3xl blur-xl"></div>
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
            <div className="lg:col-span-2 space-y-10 bg-[#0a0a0a] p-10 rounded-[50px] border border-white/5 self-start shadow-2xl sticky top-10">
              <div className="space-y-6">
                <h3 className="text-[11px] font-black text-amber-400 uppercase tracking-widest flex items-center justify-end gap-3">Intelligence Mode <span className="w-2 h-2 rounded-full bg-amber-500 animate-ping"></span></h3>
                <div className="grid grid-cols-2 gap-4">
                  <button onClick={() => setFilters(f => ({ ...f, isTrending: !f.isTrending }))} className={`px-4 py-5 rounded-[24px] text-[10px] font-black transition-all flex flex-col items-center gap-2 border ${filters.isTrending ? 'bg-amber-600 text-white border-amber-400 shadow-[0_0_30px_rgba(217,119,6,0.4)]' : 'bg-white/5 text-gray-500 border-white/5 hover:bg-white/10'}`}><span className="text-2xl">🔥</span>TRENDING</button>
                  <button onClick={() => setFilters(f => ({ ...f, isViral: !f.isViral }))} className={`px-4 py-5 rounded-[24px] text-[10px] font-black transition-all flex flex-col items-center gap-2 border ${filters.isViral ? 'bg-pink-600 text-white border-pink-400 shadow-[0_0_30px_rgba(219,39,119,0.4)]' : 'bg-white/5 text-gray-500 border-white/5 hover:bg-white/10'}`}><span className="text-2xl">🚀</span>VIRAL</button>
                </div>
                <div className="p-4 bg-black/40 rounded-2xl text-center border border-white/5"><p className="text-[9px] text-gray-500 uppercase font-black tracking-widest">Active Scan Date: <span className="text-white">APRIL 2026</span></p></div>
              </div>

              <div className="space-y-6">
                <h3 className="text-[11px] font-black text-purple-400 uppercase tracking-widest border-b border-purple-500/10 pb-4">1. Market Domains</h3>
                <div className="flex flex-col gap-3 max-h-[350px] overflow-y-auto custom-scrollbar pr-3">
                  {AI_DOMAINS.map(d => (
                    <button key={d.id} onClick={() => toggleDomain(d.id)} className={`w-full text-right px-6 py-4 rounded-2xl text-[11px] font-black transition-all border ${filters.selectedDomains.includes(d.id) ? 'bg-purple-600 text-white border-purple-400 shadow-xl scale-[1.02]' : 'bg-white/5 text-gray-500 border-white/5 hover:bg-white/10'}`}>{d.name}</button>
                  ))}
                </div>
              </div>

              {filters.selectedDomains.length > 0 && (
                <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-700">
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
                <div className="space-y-4 max-h-[500px] overflow-y-auto custom-scrollbar pr-3">
                  {AI_ECOSYSTEM_TREE.map(company => (
                    <div key={company.id} className="space-y-3">
                      <div className="flex items-center gap-3 group">
                        <button 
                          onClick={() => toggleCompanyExpansion(company.id)}
                          className={`w-6 h-6 rounded-lg flex items-center justify-center transition-all border border-white/5 ${expandedCompanies.includes(company.id) ? 'rotate-90 bg-emerald-500 text-black border-emerald-400' : 'bg-white/5 text-gray-600'}`}
                        >
                          <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={4} d="M9 5l7 7-7 7" /></svg>
                        </button>
                        <button 
                          onClick={() => toggleCompanySelection(company.name)}
                          className={`flex-1 text-right px-6 py-3.5 rounded-2xl text-[11px] font-black transition-all border ${filters.selectedCompanies.includes(company.name) ? 'bg-emerald-600 text-white border-emerald-400' : 'bg-white/5 text-gray-500 border-white/5 hover:bg-white/10'}`}
                        >
                          {company.name}
                        </button>
                      </div>
                      
                      {expandedCompanies.includes(company.id) && company.subtopics && (
                        <div className="pr-6 border-r-2 border-emerald-500/20 mr-3 flex flex-col gap-2 animate-in slide-in-from-right-4 duration-500">
                          {company.subtopics.map(topic => (
                            <button 
                              key={topic}
                              onClick={() => toggleSubtopic(topic)}
                              className={`text-right px-5 py-2.5 rounded-xl text-[10px] font-black transition-all border ${filters.selectedSubtopics.includes(topic) ? 'text-emerald-300 bg-emerald-500/10 border-emerald-500/30' : 'text-gray-600 bg-white/5 border-transparent hover:text-gray-400'}`}
                            >
                              ↳ {topic}
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

            <div className="lg:col-span-4 grid grid-cols-1 md:grid-cols-3 gap-10">
              <div className="space-y-8 bg-white/2 p-8 rounded-[50px] border border-white/5">
                <div className="flex justify-between items-center border-b border-white/5 pb-6"><h3 className="text-[11px] font-black text-gray-400 uppercase tracking-[0.4em]">01. Inbox</h3><span className="text-[10px] bg-white/5 px-3 py-1 rounded-full text-gray-600 font-black">N={discoveredAlerts.length}</span></div>
                <div className="space-y-6 max-h-[1000px] overflow-y-auto pr-4 custom-scrollbar">
                  {discoveredAlerts.map(alert => (
                    <div key={alert.id} className="bg-[#0f0f0f] border border-white/5 p-8 rounded-[45px] space-y-6 group hover:border-purple-500/40 transition-all duration-700 shadow-xl relative overflow-hidden">
                      <div className="absolute top-0 left-0 w-1 h-full bg-purple-500/20"></div>
                      <div className="flex justify-between items-start flex-row-reverse gap-4">
                        <h4 className="font-black text-white text-lg leading-tight flex-1">{alert.title}</h4>
                        <div className="flex flex-col items-center">
                          <span className="text-purple-400 font-black text-2xl">{alert.score}</span>
                          <span className="text-[8px] text-gray-600 font-black uppercase">Signal</span>
                        </div>
                      </div>
                      <p className="text-gray-500 text-[11px] italic font-medium leading-relaxed bg-black/40 p-5 rounded-2xl border border-white/5">"{alert.summary}"</p>
                      <div className="flex gap-4 pt-4 border-t border-white/5">
                        <button onClick={() => { setApprovedTools([alert, ...approvedTools]); setDiscoveredAlerts(d => d.filter(i=>i.id !== alert.id)); }} className="flex-1 py-4 bg-emerald-600/10 text-emerald-400 font-black rounded-2xl text-[10px] hover:bg-emerald-600 hover:text-white transition uppercase tracking-widest">Approve</button>
                        <button onClick={() => setDiscoveredAlerts(d => d.filter(i=>i.id !== alert.id))} className="px-6 py-4 bg-white/5 text-gray-600 rounded-2xl text-[10px] uppercase font-black hover:text-red-500 transition">Discard</button>
                      </div>
                    </div>
                  ))}
                  {discoveredAlerts.length === 0 && !isSyncing && (
                    <div className="py-40 text-center space-y-4">
                      <div className="text-4xl">📡</div>
                      <p className="text-gray-600 text-[10px] font-black uppercase tracking-widest">No Active Scans Found</p>
                    </div>
                  )}
                </div>
              </div>

              <div className="space-y-8 bg-white/2 p-8 rounded-[50px] border border-white/5">
                <div className="flex justify-between items-center border-b border-purple-500/10 pb-6"><h3 className="text-[11px] font-black text-purple-400 uppercase tracking-[0.4em]">02. Refinement</h3><span className="text-[10px] bg-purple-500/10 px-3 py-1 rounded-full text-purple-900 font-black italic">SUPER-MENTOR</span></div>
                <div className="space-y-6 max-h-[1000px] overflow-y-auto pr-4 custom-scrollbar">
                  {approvedTools.map(tool => {
                    const refined = refinedItems.find(ri => ri.id === tool.id);
                    return (
                      <div key={tool.id} className={`bg-black/40 border ${refined ? 'border-purple-500/40 shadow-[0_0_30px_rgba(168,85,247,0.05)]' : 'border-white/5'} p-8 rounded-[45px] space-y-6 transition-all duration-700 relative overflow-hidden group`}>
                        <div className="flex justify-between items-center flex-row-reverse">
                          <h4 className="font-black text-white text-[13px] leading-snug flex-1">{tool.title}</h4>
                          {refined && <div className="w-3 h-3 bg-emerald-500 rounded-full animate-pulse mr-4"></div>}
                        </div>
                        <button onClick={() => handleRefineItem(tool)} disabled={refiningId === tool.id} className={`w-full py-5 ${refined ? 'bg-white/5 text-gray-600 cursor-default' : 'bg-gradient-to-tr from-purple-700 to-purple-500 text-white shadow-xl hover:scale-[1.02]'} font-black rounded-2xl text-[10px] transition-all uppercase tracking-widest`}>
                          {refiningId === tool.id ? 'SYNTHESIZING...' : refined ? 'VOICE SYNCED' : 'APPLY MENTOR VOICE'}
                        </button>
                        {refined && (
                          <div className="pt-6 border-t border-white/5 space-y-4 animate-in fade-in duration-700">
                            <div className="space-y-1 text-right">
                              <p className="text-[9px] text-gray-600 uppercase font-black">Refined Premium Hook</p>
                              <p className="text-white text-xs font-black leading-tight italic">"{refined.hook}"</p>
                            </div>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>

              <div className="space-y-8 bg-white/2 p-8 rounded-[50px] border border-white/5 shadow-inner">
                <div className="flex justify-between items-center border-b border-blue-500/10 pb-6"><h3 className="text-[11px] font-black text-blue-400 uppercase tracking-[0.4em]">03. Catalog</h3><div className="flex items-center gap-3"><span className="text-[10px] text-gray-700 font-black uppercase">Cloud Sync</span><div className={`w-3 h-3 rounded-full ${githubUser ? 'bg-emerald-500' : 'bg-gray-800'}`}></div></div></div>
                <div className="space-y-6 max-h-[1000px] overflow-y-auto pr-4 custom-scrollbar">
                  {refinedItems.map(item => (
                    <div key={item.id} className="bg-gradient-to-b from-[#0f0f0f] to-black p-8 rounded-[45px] border border-white/5 space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700 text-right shadow-2xl relative group">
                       <div className="absolute top-4 left-4 text-[10px] text-gray-800 font-mono">#CAT_{item.id.slice(0,4)}</div>
                       <div className="space-y-3">
                         <span className="text-[9px] font-black text-gray-600 uppercase tracking-widest border-b border-white/5 pb-2 inline-block">Premium Hook</span>
                         <h4 className="font-black text-white text-[15px] leading-tight group-hover:text-purple-400 transition-colors">{item.hook}</h4>
                       </div>
                       <div className="space-y-3 p-5 bg-white/2 rounded-2xl">
                         <span className="text-[9px] font-black text-gray-600 uppercase tracking-widest">The 1% Case</span>
                         <p className="text-gray-400 text-[11px] leading-relaxed font-medium">{item.justification}</p>
                       </div>
                       <div className="pt-4 border-t border-white/5">
                         <p className="text-blue-400 text-xs font-black italic">"{item.verdict}"</p>
                       </div>
                    </div>
                  ))}
                  {refinedItems.length > 0 && githubUser && (
                    <button onClick={pushToGitHub} className="w-full py-6 bg-gradient-to-tr from-emerald-700 to-emerald-500 text-white font-black rounded-[30px] text-[10px] uppercase tracking-[0.3em] shadow-[0_20px_40px_rgba(16,185,129,0.2)] hover:scale-[1.05] transition-all">
                      {isSyncingToGitHub ? 'PUSHING...' : 'SYNC CATALOG TO GITHUB'}
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {view === 'public' && (
        <main className="max-w-7xl mx-auto px-10 pb-40 space-y-40 animate-in fade-in duration-1000">
           <section className="min-h-[85vh] flex flex-col lg:flex-row items-center justify-between gap-16 py-20 relative z-10">
              <div className="flex-1 text-right space-y-12">
                 <div className="space-y-4">
                    <div className="flex items-center justify-end gap-3 mb-8"><span className="w-12 h-[1px] bg-white/20"></span><span className="text-[11px] font-black text-purple-400 uppercase tracking-[0.5em]">Cosmic Curation</span></div>
                    <h1 className="text-8xl md:text-[12rem] font-black leading-[0.8] tracking-tighter uppercase italic">Filter <br/><span className="text-transparent bg-clip-text bg-gradient-to-l from-purple-500 via-teal-300 to-white">The Noise.</span></h1>
                    <div className="flex items-center justify-end gap-10 pt-10">
                      <p className="text-gray-400 text-2xl md:text-3xl font-light max-w-xl leading-relaxed">אוצרות אנושית קפדנית של כלי ה-AI המובילים בעולם. אנחנו מסננים (99% מהרעש) כדי שתקבלו רק את מה שמשנה באמת.</p>
                      <div className="h-40 w-[2px] bg-gradient-to-b from-purple-500/50 to-transparent"></div>
                    </div>
                 </div>
                 <div className="pt-10 flex items-center justify-end gap-8">
                    <button className="px-16 py-8 bg-white text-black font-black rounded-full text-2xl hover:scale-110 hover:shadow-[0_0_80px_rgba(255,255,255,0.2)] transition-all duration-500 group">JOIN THE 1% ELITE <span className="inline-block transition-transform group-hover:translate-x-[-10px]">←</span></button>
                 </div>
              </div>
              <div className="flex-1 relative flex justify-center">
                 <div className="absolute w-[140%] h-[140%] bg-purple-500/10 blur-[150px] animate-pulse rounded-full top-[-20%]"></div>
                 {mascotUrl ? (
                   <img src={mascotUrl} className="relative z-10 w-full max-w-xl rounded-[80px] shadow-[0_40px_100px_rgba(0,0,0,0.8)] animate-float border border-white/10 p-2 bg-black/40 backdrop-blur-xl" alt="Brand Mascot" />
                 ) : (
                   <div className="relative z-10 w-full max-w-xl h-[600px] bg-white/5 rounded-[80px] border border-white/5 animate-pulse"></div>
                 )}
              </div>
           </section>

           <div className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-16 ${isAntigravityActive ? 'h-[250vh]' : ''}`}>
              {refinedItems.map((item) => (
                <div key={item.id} id={`card-${item.id}`} onClick={() => !isAntigravityActive && setSelectedItem(item)} className={`bg-white/5 backdrop-blur-3xl border border-white/10 rounded-[60px] p-12 space-y-10 transition-all duration-700 relative group overflow-hidden ${isAntigravityActive ? 'hover:cursor-move' : 'hover:bg-white/10 hover:-translate-y-8 cursor-pointer shadow-2xl hover:shadow-purple-500/10'}`}>
                   <div className={`absolute inset-0 bg-black/98 backdrop-blur-2xl z-50 p-12 flex flex-col items-center justify-center transition-all duration-700 gap-10 ${activeShareId === item.id ? 'translate-y-0 opacity-100' : 'translate-y-full opacity-0 pointer-events-none'}`} onClick={(e) => { e.stopPropagation(); setActiveShareId(null); }}>
                      <h4 className="text-[12px] font-black text-purple-400 uppercase tracking-[0.5em]">Broadcast Signal</h4>
                      <div className="grid grid-cols-4 gap-8">
                        {SOCIAL_PLATFORMS.map(platform => (
                          <button key={platform.id} onClick={(e) => executeSocialShare(e, platform, item)} className="group/btn flex flex-col items-center gap-3" title={`Share on ${platform.name}`}>
                            <div className="w-16 h-16 rounded-3xl flex items-center justify-center transition-all duration-500 border border-white/10 group-hover/btn:scale-125 group-hover/btn:border-white/40" style={{ color: platform.color, backgroundColor: platform.hoverBg }}>{platform.icon}</div>
                            <span className="text-[10px] font-black text-gray-500 uppercase tracking-widest">{platform.name}</span>
                          </button>
                        ))}
                      </div>
                      <button onClick={(e) => { e.stopPropagation(); setActiveShareId(null); }} className="mt-8 px-10 py-4 bg-white/5 rounded-full text-[10px] font-black uppercase text-gray-500 hover:text-white transition-colors border border-white/5">Close Channel</button>
                   </div>
                   
                   <div className="space-y-6 text-right">
                      <div className="flex justify-between items-center flex-row-reverse border-b border-white/5 pb-6 mb-4">
                        <span className="text-[11px] font-black text-teal-400 uppercase tracking-[0.4em]">Premium Signal</span>
                        <div className="flex items-center gap-4"><span className="text-[10px] text-gray-700 font-black tracking-widest uppercase">ID_{item.id.slice(0,6)}</span></div>
                      </div>
                      <h3 className="text-4xl font-black text-white leading-[1.1] group-hover:text-purple-400 transition-colors duration-500 italic uppercase">{item.hook}</h3>
                   </div>
                   
                   <div className="space-y-4 text-right">
                      <h4 className="text-[11px] font-black text-gray-600 uppercase tracking-[0.3em]">The Cagan/Graham Signal:</h4>
                      <p className="text-gray-400 text-lg leading-relaxed font-medium line-clamp-3">{item.justification}</p>
                   </div>
                   
                   <div className="pt-10 border-t border-white/10 italic text-white font-black text-right text-2xl leading-snug">"{item.verdict}"</div>
                   
                   <div className="flex justify-between items-center pt-8 no-print border-t border-white/5 mt-4">
                      <button className="text-[11px] font-black text-purple-500 uppercase tracking-[0.3em] group-hover:underline transition-all">Deep Analysis</button>
                      <button onClick={(e) => { e.stopPropagation(); setActiveShareId(item.id); }} className="px-8 py-4 bg-white/5 rounded-full flex items-center gap-3 text-[10px] font-black uppercase tracking-widest hover:bg-white/10 transition-all border border-white/10">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z"/></svg>
                        Share
                      </button>
                   </div>
                </div>
              ))}
           </div>

           {selectedItem && (
             <div className="fixed inset-0 z-[200] flex items-center justify-center p-6 md:p-12 overflow-y-auto" dir="rtl">
                <div className="fixed inset-0 bg-black/90 backdrop-blur-2xl" onClick={() => setSelectedItem(null)} />
                <div className="relative bg-[#050505] border border-white/10 rounded-[80px] max-w-5xl w-full p-16 md:p-24 space-y-16 animate-in zoom-in-95 duration-700 shadow-[0_0_150px_rgba(168,85,247,0.15)] overflow-hidden">
                   <div className="absolute top-0 right-0 w-full h-1 bg-gradient-to-r from-purple-500 to-teal-400"></div>
                   <button onClick={() => setSelectedItem(null)} className="absolute top-12 left-12 w-16 h-16 bg-white/5 rounded-full flex items-center justify-center text-gray-400 hover:bg-white hover:text-black transition-all duration-500 text-2xl">✕</button>
                   
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
                            <div className="h-[2px] w-20 bg-purple-500/30 mr-0 ml-auto"></div>
                         </div>
                         <p className="text-2xl text-gray-300 leading-relaxed font-light">{selectedItem.justification}</p>
                      </div>
                      <div className="space-y-12">
                         <div className="bg-purple-500/5 border border-purple-500/20 p-12 rounded-[60px] text-right space-y-6 relative overflow-hidden group hover:bg-purple-500/10 transition-colors">
                            <div className="absolute top-[-50%] left-[-50%] w-[200%] h-[200%] bg-purple-500/5 rotate-45 pointer-events-none"></div>
                            <h4 className="text-[12px] font-black text-purple-400 uppercase tracking-[0.4em]">The Super-Mentor Verdict</h4>
                            <p className="text-3xl font-black text-white italic leading-snug relative z-10">"{selectedItem.verdict}"</p>
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
      )}

      {view === 'analysis' && data && (
        <div className="max-w-7xl mx-auto px-10 py-32 space-y-20 text-right animate-in fade-in duration-1000">
           <header className="space-y-8">
              <div className="flex items-center justify-end gap-3"><span className="text-[12px] font-black text-purple-400 uppercase tracking-[0.5em]">Executive Strategy</span><span className="w-20 h-[1px] bg-white/20"></span></div>
              <h1 className="text-9xl font-black uppercase italic tracking-tighter leading-[0.8]">Strategic <br/><span className="text-transparent bg-clip-text bg-gradient-to-l from-white to-gray-700">Blueprint.</span></h1>
              <p className="text-gray-500 text-4xl font-light max-w-3xl mr-auto leading-relaxed">The "Super-Mentor" Vision for AI Ecosystem Dominance in 2026.</p>
           </header>
           
           <div className="grid grid-cols-1 md:grid-cols-2 gap-16 mt-20">
              <div className="bg-[#0a0a0a] p-16 rounded-[70px] border border-white/5 space-y-12 shadow-2xl relative overflow-hidden">
                 <div className="absolute top-0 right-0 w-full h-1 bg-purple-500/20"></div>
                 <h3 className="text-4xl font-black text-purple-400 uppercase italic tracking-tight">Market Frictions</h3>
                 <div className="space-y-10">
                    {data.friction.map((f, i) => (
                      <div key={i} className="flex gap-8 items-start flex-row-reverse group">
                         <span className="text-purple-500 font-black text-5xl opacity-10 group-hover:opacity-100 transition-all duration-500 italic">0{i+1}</span>
                         <p className="text-gray-400 text-2xl font-medium leading-relaxed pt-3 group-hover:text-white transition-colors">{f}</p>
                      </div>
                    ))}
                 </div>
              </div>
              <div className="bg-[#0a0a0a] p-16 rounded-[70px] border border-white/5 space-y-12 shadow-2xl relative overflow-hidden">
                 <div className="absolute top-0 right-0 w-full h-1 bg-teal-500/20"></div>
                 <h3 className="text-4xl font-black text-emerald-400 uppercase italic tracking-tight">Competitive Landscape</h3>
                 <div className="space-y-6">
                    {data.snapshot.map((c, i) => (
                      <div key={i} className="bg-white/2 p-8 rounded-[40px] border border-white/5 flex justify-between items-center group flex-row-reverse hover:bg-white/5 transition-all duration-500">
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
             <div className="mt-32 p-16 bg-white/2 rounded-[70px] border border-white/5 backdrop-blur-3xl">
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
      )}

      {view === 'spec' && data && (
        <div className="max-w-7xl mx-auto px-10 py-32 space-y-20 text-right animate-in slide-in-from-right-8 duration-1000">
           <div className="flex items-center justify-end gap-3 mb-4"><span className="text-[12px] font-black text-teal-400 uppercase tracking-[0.5em]">Product Roadmap</span><span className="w-20 h-[1px] bg-white/20"></span></div>
           <h1 className="text-9xl font-black text-white tracking-tighter uppercase leading-[0.8] italic">MVP <br/><span className="text-transparent bg-clip-text bg-gradient-to-l from-teal-400 to-white">Spec.</span></h1>
           <div className="grid grid-cols-1 md:grid-cols-3 gap-10 pt-20">
              {data.features.map((f, i) => (
                <div key={i} className="bg-[#0a0a0a] p-16 rounded-[70px] border border-white/5 hover:border-teal-500/30 transition-all duration-700 group relative overflow-hidden shadow-2xl">
                   <div className="absolute top-0 right-0 w-full h-1 bg-teal-500/10 group-hover:bg-teal-500/40 transition-all"></div>
                   <div className="w-20 h-20 bg-teal-500/10 rounded-3xl mb-10 flex items-center justify-center text-4xl group-hover:bg-teal-500 group-hover:text-black transition-all duration-500 group-hover:scale-110">✨</div>
                   <h3 className="text-4xl font-black text-white mb-8 leading-tight group-hover:text-teal-400 transition-colors">{f.title}</h3>
                   <p className="text-gray-400 text-xl leading-relaxed font-light group-hover:text-gray-200 transition-colors">{f.description}</p>
                </div>
              ))}
           </div>
        </div>
      )}

      <div className="fixed bottom-12 left-12 no-print flex gap-6 z-[100]">
        <button onClick={() => { if(window.confirm('Wipe Ecosystem History?')) { setApprovedTools([]); setRefinedItems([]); setGithubUser(null); localStorage.clear(); window.location.reload(); } }} className="w-16 h-16 bg-red-950/20 text-red-500 rounded-full flex items-center justify-center hover:bg-red-600 hover:text-white transition-all border border-red-500/20 shadow-2xl group" title="Reset Ecosystem">
          <span className="text-2xl group-hover:rotate-12 transition-transform">🗑️</span>
        </button>
      </div>

      <ContactForm isOpen={isContactModalOpen} onClose={() => setIsContactModalOpen(false)} />
    </div>
  );
};

export default App;
