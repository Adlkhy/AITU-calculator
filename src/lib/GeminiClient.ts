import { GoogleGenerativeAI } from '@google/generative-ai';
import { useGemini } from '../hooks/useGemini';
import { useMemo } from 'react';

export const useGeminiClient = () => {
  const { apiKey, clearKey } = useGemini();

  // useMemo prevents re-initializing the SDK on every component re-render
  const genAI = useMemo(() => {
    if (!apiKey) return null;
    return new GoogleGenerativeAI(apiKey);
  }, [apiKey]);

  const getModel = (modelName: string = 'gemini-2.5-flash') => {
    if (!genAI) {
      throw new Error("Gemini API Key is not set.");
    }
    
    // We can inject generation configs here globally for your BYOK users
    return genAI.getGenerativeModel({ 
      model: modelName,
      generationConfig: {
        responseMimeType: "application/json", // Since you mentioned you handle JSON
      }
    });
  };

  return { getModel, hasKey: !!apiKey, clearKey };
};