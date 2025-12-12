import { GoogleGenAI, Type, type Schema } from "@google/genai";
import type { ParsedResponse } from "../hooks/types";

const apiKey = import.meta.env.VITE_API_KEY;

if (!apiKey) {
  throw new Error("Missing API key. Please set the API_KEY environment variable.");
}

// Initialize Gemini Client
const ai = new GoogleGenAI({ apiKey: apiKey });

/**
 * Extracts grading breakdown from a syllabus file (Image or PDF).
 * @param base64Data The base64 string of the file (header stripped).
 * @param mimeType The mime type of the file.
 * @returns A promise resolving to the parsed grading categories.
 */
export const parseSyllabus = async (
  base64Data: string,
  mimeType: string
): Promise<ParsedResponse> => {
  
  const systemInstruction = `
    You are a helpful assistant that extracts grading criteria from university syllabi.
    Your goal is to identify the categories and their percentage weights.
    
    Rules:
    1. Extract the weight as a number between 0 and 100.
    2. If a range is given (e.g., 10-15%), take the average.
    3. Ensure the weights ideally sum up to 100, but extract exactly what is stated.
    4. Ignore non-grading related text.
  `;

  // Define the output schema for strict JSON generation
  const responseSchema: Schema = {
    type: Type.OBJECT,
    properties: {
      breakdown: {
        type: Type.ARRAY,
        items: {
          type: Type.OBJECT,
          properties: {
            category: {
              type: Type.STRING,
              description: "The name of the grading category.",
            },
            weight: {
              type: Type.NUMBER,
              description: "The percentage weight of this category (0-100).",
            },
          },
          required: ["category", "weight"],
        },
      },
    },
    required: ["breakdown"],
  };

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: {
        parts: [
          {
            inlineData: {
              mimeType: mimeType,
              data: base64Data,
            },
          },
          {
            text: "Analyze this syllabus and extract the grading breakdown structure.",
          },
        ],
      },
      config: {
        systemInstruction: systemInstruction,
        responseMimeType: "application/json",
        responseSchema: responseSchema,
        temperature: 0.1, // Low temperature for factual extraction
      },
    });

    const text = response.text;
    if (!text) {
      throw new Error("No response text received from Gemini.");
    }

    return JSON.parse(text) as ParsedResponse;

  } catch (error) {
    console.error("Error parsing syllabus with Gemini:", error);
    throw error;
  }
};
