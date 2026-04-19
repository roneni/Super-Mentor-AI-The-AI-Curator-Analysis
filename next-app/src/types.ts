export interface Competitor {
  name: string;
  traffic: string;
  promise: string;
}

export interface AnalysisResult {
  snapshot: Competitor[];
  friction: string[];
  errc: {
    eliminate: string[];
    reduce: string[];
    raise: string[];
    create: string[];
  };
  features: {
    title: string;
    description: string;
  }[];
  groundingUrls: string[];
}

export interface AIDomain {
  id: string;
  name: string;
  subfields: string[];
}

export interface AICompany {
  id: string;
  name: string;
  type: 'giant' | 'promising';
  description: string;
  subtopics?: string[];
}

export interface CurationFilters {
  selectedDomains: string[];
  selectedSubfields: string[];
  selectedCompanies: string[];
  selectedSubtopics: string[];
  isTrending?: boolean;
  isViral?: boolean;
}

export interface RefinedItem {
  id: string;
  hook: string;
  justification: string;
  verdict: string;
  originalLink: string;
  originalTitle: string;
}

export interface DiscoveredItem {
  id: string;
  title: string;
  score: number;
  summary: string;
  link: string;
  timestamp: string;
}
