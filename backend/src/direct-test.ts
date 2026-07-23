import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

async function main() {
  const ai = new GoogleGenAI({
    apiKey: process.env.GEMINI_API_KEY!,
  });

  const response = await ai.models.generateContent({
    model: "models/gemini-flash-latest",
    contents: "Write exactly one sentence saying hello.",
  });

  console.log(response.text);
}

main().catch(console.error);