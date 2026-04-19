import { GoogleGenAI, Type } from "@google/genai";
import { AnalysisResult, CurationFilters, RefinedItem } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY! });

const withRetry = async <T>(fn: () => Promise<T>, maxRetries = 5, initialDelayMs = 2000): Promise<T> => {
  let attempt = 0;
  while (attempt < maxRetries) {
    try {
      return await fn();
    } catch (error: unknown) {
      attempt++;
      const err = error as { message?: string; status?: number; code?: number };
      const errorMessage = err?.message || String(error);
      const errorString = JSON.stringify(error, Object.getOwnPropertyNames(error as object));
      const isOverloaded =
        errorMessage.includes('503') ||
        errorMessage.includes('UNAVAILABLE') ||
        errorMessage.includes('high demand') ||
        errorString.includes('503') ||
        errorString.includes('UNAVAILABLE') ||
        errorString.includes('high demand') ||
        err?.status === 503 ||
        err?.code === 503;

      if (attempt >= maxRetries || !isOverloaded) {
        throw error;
      }
      const delay = initialDelayMs * Math.pow(2, attempt - 1);
      console.warn(`Gemini API overloaded. Retrying in ${delay}ms... (Attempt ${attempt} of ${maxRetries})`);
      await new Promise(resolve => setTimeout(resolve, delay));
    }
  }
  throw new Error("Max retries reached");
};

const getTodayDate = () => new Date().toLocaleDateString('en-US', {
  month: 'long',
  day: 'numeric',
  year: 'numeric'
});

export async function discoverTrendingAINews(filters: CurationFilters) {
  const model = "gemini-3-flash-preview";
  const today = getTodayDate();

  const systemInstruction = `
    You are 'The AI Curator'.
    CURRENT DATE: ${today}.

    STRICT FRESHNESS POLICY:
    - You MUST use the googleSearch tool for every request.
    - Ignore your internal training data for news; ONLY use results from the last 48 hours (relative to ${today}).
    - If you see results from March 2026 or earlier, DISCARD THEM. We are in April 2026. Everything before April is legacy.
    - Focus on "April Forward" momentum.

    CRITERIA FOR SELECTION:
    1. Technical Breakthroughs: New model architectures, closed-beta leaks, non-public benchmarks.
    2. Agentic Shifts: Real-world action engines, cross-app autonomous orchestration, OS-level agents.
    3. Hardware/Inference: LPU updates, dedicated NPU silicon, edge deployment shifts, custom chips.

    AUTO-REJECT (HARD FILTER):
    - Generic tutorials or "Top 5" listicles.
    - Financial news/stock price movements.
    - Basic corporate PR ("Company X integrates Gemini").

    SCORING LOGIC (0-100):
    - 95-100: Paradigm shift (e.g., GPT-5, Llama 4, V7 engines).
    - 85-94: High-impact technical updates.
    - <85: Do not return.

    Language: Hebrew.
  `;

  const userPrompt = `
    SCAN TARGETS FOR TODAY (${today}):
    - Domains: ${filters.selectedDomains.join(", ")}
    - Subfields: ${filters.selectedSubfields.join(", ")}
    - Entities: ${filters.selectedCompanies.join(", ")}
    - Specific Topics: ${filters.selectedSubtopics.join(", ")}

    ${filters.isTrending ? "PRIORITY: Focus on rapid adoption and developer velocity." : ""}
    ${filters.isViral ? "PRIORITY: Focus on social hype and non-obvious breakthroughs." : ""}

    Provide 5-8 high-signal items in Hebrew. Output JSON ONLY.
  `;

  const response = await withRetry(() => ai.models.generateContent({
    model: model,
    contents: userPrompt,
    config: {
      systemInstruction: systemInstruction,
      tools: [{ googleSearch: {} }],
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          items: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                id: { type: Type.STRING },
                title: { type: Type.STRING },
                score: { type: Type.NUMBER },
                summary: { type: Type.STRING },
                link: { type: Type.STRING }
              },
              required: ["title", "score", "summary", "link"]
            }
          }
        },
        required: ["items"]
      }
    }
  }));

  const data = JSON.parse(response.text!);
  return (data.items || []).map((item: Record<string, unknown>, idx: number) => ({
    ...item,
    id: (item.id as string) || `news-${Date.now()}-${idx}`,
    timestamp: today
  }));
}

export async function refineCuratedContent(rawItem: Record<string, unknown>): Promise<RefinedItem> {
  const model = "gemini-3-pro-preview";
  const today = getTodayDate();

  const systemInstruction = `
    You are the 'Super-Mentor Curator'.
    Act as a fusion of Marty Cagan (Product Strategy), W. Chan Kim (Blue Ocean), and Paul Graham (Startup Value).

    MENTAL MODELS:
    1. Marty Cagan (Product): Value Test - will users choose this? PMF focus.
    2. W. Chan Kim (Blue Ocean): Eliminate/Create - does this bypass competition?
    3. Paul Graham (YC): The Secret - what is the non-obvious unfair advantage?

    WRITING STYLE (HEBREW):
    - Tone: Minimalist, elite, visionary.
    - Headers: 'PREMIUM HOOK', 'THE 1% CASE', 'CURATOR VERDICT'.
    - Language: High-Tech Hebrew with English terms (Inference, RAG, Latency, etc.).

    FEW-SHOT EXAMPLES:
    ITEM: Groq LPU v2
    {
      "hook": "עידן ה-Zero Latency: התשתית של Groq הופכת את ה-Real-time לסטנדרט.",
      "justification": "המעבר ל-LPU Inference מאפשר מהירויות שמשנות את ה-UX מן היסוד. פול גרהם היה מזהה כאן 'Secret' טכנולוגי שיוצר יתרון לא הוגן.",
      "verdict": "מי שלא בונה על Latency נמוך ב-2026, בונה מוצר מת."
    }
  `;

  const userPrompt = `Refine this signal (Context: ${today}): ${JSON.stringify(rawItem)}`;

  const response = await withRetry(() => ai.models.generateContent({
    model: model,
    contents: userPrompt,
    config: {
      systemInstruction: systemInstruction,
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          hook: { type: Type.STRING },
          justification: { type: Type.STRING },
          verdict: { type: Type.STRING }
        },
        required: ["hook", "justification", "verdict"]
      }
    }
  }));

  const refined = JSON.parse(response.text!);
  return {
    ...refined,
    id: rawItem.id as string,
    originalLink: rawItem.link as string,
    originalTitle: rawItem.title as string
  };
}

export async function getMarketAnalysis(ideaDescription: string): Promise<AnalysisResult> {
  const today = getTodayDate();
  const prompt = `
    CURRENT DATE: ${today}.
    Analyze this product idea: "${ideaDescription}"
    Fusing Cagan, Kim, and Graham mental models.
    Identify competitors and frictions in Hebrew based on current market data from ${today}.
  `;
  const response = await withRetry(() => ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: prompt,
    config: {
      tools: [{ googleSearch: {} }],
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          snapshot: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                name: { type: Type.STRING },
                traffic: { type: Type.STRING },
                promise: { type: Type.STRING }
              }
            }
          },
          friction: { type: Type.ARRAY, items: { type: Type.STRING } },
          errc: {
            type: Type.OBJECT,
            properties: {
              eliminate: { type: Type.ARRAY, items: { type: Type.STRING } },
              reduce: { type: Type.ARRAY, items: { type: Type.STRING } },
              raise: { type: Type.ARRAY, items: { type: Type.STRING } },
              create: { type: Type.ARRAY, items: { type: Type.STRING } }
            }
          },
          features: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                title: { type: Type.STRING },
                description: { type: Type.STRING }
              }
            }
          }
        },
        required: ["snapshot", "friction", "errc", "features"]
      }
    }
  }));

  const parsedData = JSON.parse(response.text!);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const responseAny = response as any;
  const groundingChunks = responseAny?.candidates?.[0]?.groundingMetadata?.groundingChunks || [];
  const urls = groundingChunks
    .map((chunk: { web?: { uri?: string }; maps?: { uri?: string } }) => chunk.web?.uri || chunk.maps?.uri)
    .filter((uri: string | undefined): uri is string => !!uri);

  return { ...parsedData, groundingUrls: Array.from(new Set(urls)) };
}

export async function generateBrandMascot(): Promise<string> {
  const response = await withRetry(() => ai.models.generateContent({
    model: 'gemini-2.5-flash-image',
    contents: { parts: [{ text: 'Ultra-premium 8k portrait of an AI curator mascot, translucent glass and liquid chrome textures, soft purple and teal neon lighting, Apple aesthetic.' }] }
  }));
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const responseAny = response as any;
  for (const part of responseAny.candidates[0].content.parts) {
    if (part.inlineData) return `data:image/png;base64,${part.inlineData.data}`;
  }
  return '';
}
