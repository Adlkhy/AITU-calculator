
import { GoogleGenAI, Type } from "@google/genai";
import type { ParsedResponse } from "../hooks/types";

const defaultApiKey = import.meta.env.VITE_API_KEY;

export const parseSyllabus = async (
  base64Data: string,
  mimeType: string,
  userApiKey?: string | null
): Promise<ParsedResponse> => {
  const apiKey = userApiKey || defaultApiKey;
  
  if (!apiKey) {
    throw new Error("Gemini API Key is not provided.");
  }

  const ai = new GoogleGenAI({ apiKey });

  const systemInstruction = `
    You are a world-class academic assistant specializing in extracting grading structures from complex university syllabi.
    
    CRITICAL INSTRUCTION:
    Syllabi often use hierarchical tables. For example, a course might have "1st Attestation" worth 30%, which itself contains "Assignments" (60 points) and "Mid Term" (40 points).
    
    YOUR GOAL:
    1. Identify the top-level categories that sum to 100% of the final grade.
    2. If a category has sub-components (like specific assignments, quizzes, or attendance within an Attestation), extract them into the 'subItems' array.
    3. Look for mathematical formulas at the bottom of tables (e.g., "0.3 * Att1 + 0.3 * Att2 + 0.4 * Final"). Use these to determine 'overallWeight'.
    4. Normalize all 'overallWeight' values to sum to 100.
    
    RULES:
    - 'overallWeight' must be a number (0-100).
    - 'subItems' should capture the granular detail so students can track individual task progress.
    - If a category uses points (e.g., 60 points out of 100 for that section), represent it clearly.
  `;

  const responseSchema = {
    type: Type.OBJECT,
    properties: {
      syllabus: {
        type: Type.OBJECT,
        properties: {
          courseName: { type: Type.STRING, description: "The name of the course if found." },
          breakdown: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                name: { type: Type.STRING, description: "Category name (e.g., 1st Attestation, Final Exam)." },
                overallWeight: { type: Type.NUMBER, description: "The percentage this category contributes to the total 100% course grade." },
                maxPoints: { type: Type.NUMBER, description: "Total points available in this category if applicable." },
                subItems: {
                  type: Type.ARRAY,
                  items: {
                    type: Type.OBJECT,
                    properties: {
                      name: { type: Type.STRING, description: "Sub-assignment or task name." },
                      weight: { type: Type.NUMBER, description: "Weight or points of this sub-item within its category." },
                      description: { type: Type.STRING }
                    },
                    required: ["name", "weight"]
                  }
                }
              },
              required: ["name", "overallWeight"]
            }
          },
          totalWeightNote: { type: Type.STRING, description: "Any specific grading formula mentioned." }
        },
        required: ["breakdown"]
      }
    },
    required: ["syllabus"]
  };

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: {
        parts: [
          {
            inlineData: {
              mimeType: mimeType,
              data: base64Data,
            },
          },
          {
            text: "Analyze this syllabus image/document. Extract the full hierarchical grading breakdown. Pay attention to sub-assignments and the final weight formula.",
          },
        ],
      },
      config: {
        systemInstruction,
        responseMimeType: "application/json",
        responseSchema,
        temperature: 0.1,
      },
    });

    const text = response.text;
    if (!text) throw new Error("No response from Gemini.");
    
    return JSON.parse(text) as ParsedResponse;
  } catch (error) {
    console.error("Gemini Parsing Error:", error);
    throw error;
  }
};
