import { createContext, useContext } from 'react';

export interface GeminiContextType {
  apiKey: string | null;
  setApiKey: (key: string) => void;
  clearKey: () => void;
}

export const GeminiContext = createContext<GeminiContextType | undefined>(undefined);

export const useGemini = () => {
  const context = useContext(GeminiContext);
  if (!context) {
    throw new Error('useGemini must be used within a GeminiProvider');
  }
  return context;
};
