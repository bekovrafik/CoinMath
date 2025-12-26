
import { GoogleGenAI, Type } from "@google/genai";

// Fix: Initializing GoogleGenAI inside the function ensures the latest environment configuration is used.
export const generateMathProblem = async (level: number) => {
  try {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    const response = await ai.models.generateContent({
      // Fix: Upgraded to 'gemini-3-pro-preview' as it is recommended for complex reasoning and math tasks.
      model: "gemini-3-pro-preview",
      contents: `Generate a math problem for a "mining" game. Level: ${level}. Return in JSON format.`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            question: { type: Type.STRING, description: "The math equation or logic puzzle" },
            answer: { type: Type.STRING, description: "The correct numerical or short text answer" },
            difficulty: { type: Type.STRING, enum: ["Easy", "Medium", "Hard"] },
            category: { type: Type.STRING, enum: ["Arithmetic", "Algebra", "Logic"] },
            hint: { type: Type.STRING }
          },
          required: ["question", "answer", "difficulty", "category"]
        }
      }
    });

    // Fix: Accessed .text as a property and added a check for undefined.
    const jsonStr = response.text?.trim();
    if (!jsonStr) {
      throw new Error("No text content returned from the model");
    }

    const data = JSON.parse(jsonStr);
    return {
      ...data,
      id: Math.random().toString(36).substr(2, 9),
      reward: (data.difficulty === 'Hard' ? 5 : data.difficulty === 'Medium' ? 2.5 : 1) * 0.05
    };
  } catch (error) {
    console.error("Gemini Error:", error);
    // Fallback logic for offline/error
    return {
      id: "fallback",
      question: "Solve for x: 2x + 10 = 24",
      answer: "7",
      difficulty: "Medium",
      category: "Algebra",
      reward: 0.125
    };
  }
};
