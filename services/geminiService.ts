import { GoogleGenAI } from "@google/genai";

const apiKey = process.env.API_KEY || '';
const ai = new GoogleGenAI({ apiKey });

export const calculateWithAI = async (prompt: string): Promise<string> => {
  if (!apiKey) {
    return "API ключ не настроен.";
  }

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        systemInstruction: "You are a precise medical calculator and mathematician for a healthcare quality control center. Your goal is to solve the user's math problem or medical formula. If the input is a simple math expression, return just the number. If it is a medical query (like BMI, dosage), return the result and a very brief 1-sentence explanation in Russian. Keep it concise.",
        temperature: 0.1, // Low temperature for math precision
      }
    });

    return response.text?.trim() || "Ошибка вычисления";
  } catch (error) {
    console.error("Gemini Error:", error);
    return "Ошибка соединения";
  }
};

export interface CurrencySource {
  title: string;
  uri: string;
}

export interface CurrencyResult {
  value: string;
  sources: CurrencySource[];
  error?: string;
}

export const convertCurrency = async (amount: string, from: string, to: string): Promise<CurrencyResult> => {
  if (!apiKey) {
    return { value: "", sources: [], error: "API ключ не настроен." };
  }

  try {
    const prompt = `Convert ${amount} ${from} to ${to}. Return ONLY the resulting number followed by the currency code. Example: '123.45 ${to}'. Use the latest available exchange rate.`;
    
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        tools: [{ googleSearch: {} }],
        systemInstruction: "You are a currency converter. You must use Google Search to find the latest exchange rate. Return ONLY the converted amount and currency code. Do not include markdown formatting or extra text.",
      }
    });

    const text = response.text?.trim();
    
    // Extract grounding sources
    const sources: CurrencySource[] = [];
    const chunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks;
    
    if (chunks) {
      chunks.forEach((chunk: any) => {
        if (chunk.web?.uri && chunk.web?.title) {
          sources.push({
            title: chunk.web.title,
            uri: chunk.web.uri
          });
        }
      });
    }

    if (!text) {
      return { value: "", sources: [], error: "Не удалось получить данные" };
    }

    return { value: text, sources };
  } catch (error) {
    console.error("Gemini Currency Error:", error);
    return { value: "", sources: [], error: "Ошибка соединения" };
  }
};