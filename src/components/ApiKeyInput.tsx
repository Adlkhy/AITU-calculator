import { useState, useEffect } from "react"
import { Input } from "@/components/ui/input" 
import { Button } from "@/components/ui/button"
import { GoogleGenerativeAI } from '@google/generative-ai'
import { useGemini } from "@/hooks/useGemini"
import { toast, Toaster } from "sonner"
import { Card, CardContent, CardDescription, CardTitle } from "./ui/card"

export function ApiKeyInput() {
  const { setApiKey } = useGemini()
  const [inputValue, setInputValue] = useState('');
  const [status, setStatus] = useState<'idle' | 'checking' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    const storedKey = localStorage.getItem("user_gemini_key")
    if (storedKey) setInputValue(storedKey)
  }, [])

  const handleValidateAndSave = async () => {
    if (!inputValue.trim()) return;

    setStatus('checking');
    setErrorMessage('');

    try {
      // 1. Initialize the SDK with the user's input
      const genAI = new GoogleGenerativeAI(inputValue);
      
      // 2. We use 'gemini-2.5-flash' for a quick, cheap validation check
      const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });
      
      // 3. Attempt a minimal generation to test the key
      // If the key is invalid, this will throw an error
      await model.generateContent('Hello');

      // 4. If successful, save via Context
      setApiKey(inputValue);
      setStatus('idle');
      
    } catch (error: unknown) {
      console.error("Key Validation Failed:", error);
      setStatus('error');
      // Extract a readable error message if possible
      setErrorMessage(
        error instanceof Error && error.message?.includes('400')
          ? 'Invalid API Key. Please check and try again.' 
          : 'Connection failed. Please try again.'
      );
    }
  };

  const handleClear = () => {
    localStorage.removeItem("user_gemini_key")
    setInputValue("")
    toast.info("API Key removed.")
  }

  return (
    <>
    <Toaster position="top-center"/>
    <Card className="w-full max-w-2xl mx-auto mb-8 p-4">
      <CardContent className="space-y-2 p-0">
      <CardTitle>Bring Your Own Key (BYOK)</CardTitle>
      <CardDescription>
        Enter your Gemini API key to use your own quota. 
        It is stored locally in your browser and never saved to our database.
      </CardDescription>
        {status === 'error' && (
          <p className="text-sm text-destructive self-center">{errorMessage}</p>
        )}
      <div className="flex gap-2">
        <Input 
          type="password" 
          placeholder="AIza..." 
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
        />
        <Button onClick={handleValidateAndSave} disabled={status === 'checking' || !inputValue}>Save</Button>
        <Button variant="outline" onClick={handleClear}>Clear</Button>
      </div>
      <CardDescription>Don't have one? <a href="https://aistudio.google.com/app/apikey" target="_blank" rel="noopener noreferrer" className="text-primary">Create one here</a>
      </CardDescription>
      </CardContent>
    </Card>
    </>
  )
}