import { supabase } from './supabaseClient'

export async function calculateWithAI(promptData: string) {
  // 1. Try to get user's key
  const userKey = localStorage.getItem("user_gemini_key")
  
  // 2. Prepare headers
  const headers: Record<string, string> = {
    "Content-Type": "application/json"
  }
  
  // 3. If user has a key, attach it. 
  // If not, you can decide to block them OR fallback to your key (if you want).
  if (userKey) {
    headers["x-gemini-api-key"] = userKey
  } else {
    throw new Error("Please add your Gemini API Key in settings to proceed.")
  }

  // 4. Call your Supabase Edge Function
  const { data, error } = await supabase.functions.invoke('ai-calculation', {
    body: { prompt: promptData },
    headers: headers // <--- Passing the key here
  })

  if (error) throw error
  return data
}