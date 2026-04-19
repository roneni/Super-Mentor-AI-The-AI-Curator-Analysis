import { AIDomain, AICompany } from "../types";

export const AI_DOMAINS: AIDomain[] = [
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

export const AI_ECOSYSTEM_TREE: AICompany[] = [
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

export const SOCIAL_PLATFORMS = [
  { id: 'x', name: 'X', color: '#fff', hoverBg: 'rgba(255,255,255,0.1)', getUrl: (text: string, url: string) => `https://x.com/intent/post?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}` },
  { id: 'linkedin', name: 'LinkedIn', color: '#0077b5', hoverBg: 'rgba(0,119,181,0.2)', getUrl: (_text: string, url: string) => `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}` },
  { id: 'whatsapp', name: 'WhatsApp', color: '#25D366', hoverBg: 'rgba(37,211,102,0.2)', getUrl: (text: string, url: string) => `https://api.whatsapp.com/send?text=${encodeURIComponent(text + ' ' + url)}` }
];

export const IDEA_DESCRIPTION = `The AI Curator: Curation superpower, human filter, 1% quality, Apple Cosmic aesthetic. Fusing Cagan, Kim, and Graham.`;
