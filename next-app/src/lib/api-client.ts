import { AnalysisResult, CurationFilters, RefinedItem, DiscoveredItem } from "../types";

export async function fetchMarketAnalysis(ideaDescription: string): Promise<AnalysisResult> {
  const res = await fetch("/api/analyze", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ ideaDescription }),
  });
  if (!res.ok) throw new Error("Analysis failed");
  return res.json();
}

export async function fetchDiscovery(filters: CurationFilters): Promise<DiscoveredItem[]> {
  const res = await fetch("/api/discover", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(filters),
  });
  if (!res.ok) throw new Error("Discovery failed");
  const data = await res.json();
  return data.items;
}

export async function fetchRefinement(rawItem: Record<string, unknown>): Promise<RefinedItem> {
  const res = await fetch("/api/refine", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(rawItem),
  });
  if (!res.ok) throw new Error("Refinement failed");
  return res.json();
}

export async function fetchMascot(): Promise<string> {
  const res = await fetch("/api/mascot", { method: "POST" });
  if (!res.ok) throw new Error("Mascot generation failed");
  const data = await res.json();
  return data.url;
}

export async function submitContact(data: { name: string; email: string; plan: string; message: string }): Promise<void> {
  const res = await fetch("/api/contact", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error("Submission failed");
}
