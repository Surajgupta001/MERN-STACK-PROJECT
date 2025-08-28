import { GoogleGenAI } from "@google/genai";

// The client gets the API key from the environment variable `GEMINI_API_KEY`.
const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

async function main(prompt) {
    const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: [
            {
                role: "user",
                parts: [{ text: String(prompt) }],
            },
        ],
    });

    // Normalize potential response shapes
    if (response?.output_text) return response.output_text;
    if (response?.candidates?.length) {
        const parts = response.candidates[0]?.content?.parts || [];
        const text = parts
            .map((p) => p?.text || "")
            .join("")
            .trim();
        if (text) return text;
    }
    if (typeof response?.text === "function") {
        try {
            return response.text();
        } catch { }
    }
    if (typeof response?.response?.text === "function") {
        try {
            return response.response.text();
        } catch { }
    }
    return "";
}

export default main;
