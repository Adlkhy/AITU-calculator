import { useState, useEffect, type ReactNode } from 'react';
import { GeminiContext } from '../hooks/useGemini';

export const GeminiProvider = ({ children }: { children: ReactNode }) => {
  const [apiKey, setApiKeyState] = useState<string | null>(null);

  // On load, check if the key is already in session storage (optional, for persistence across reloads)
  useEffect(() => {
    const storedKey = sessionStorage.getItem('gemini_api_key');
    if (storedKey) {
      setApiKeyState(storedKey);
    }
  }, []);

  const setApiKey = (key: string) => {
    // Save to state and session storage (clears when browser closes for security)
    setApiKeyState(key);
    sessionStorage.setItem('gemini_api_key', key);
  };

  const clearKey = () => {
    setApiKeyState(null);
    sessionStorage.removeItem('gemini_api_key');
  };

  return (
    <GeminiContext.Provider value={{ apiKey, setApiKey, clearKey }}>
      {children}
    </GeminiContext.Provider>
  );
};
