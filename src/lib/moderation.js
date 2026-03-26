import { GoogleGenerativeAI } from "@google/generative-ai";

const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
const genAI = apiKey ? new GoogleGenerativeAI(apiKey) : null;

export async function moderateMessage(text) {
  // 1. Fast Regex Check (Basic Profanity & Hacks)
  const badWords = ['spam', 'hack', 'cheat', 'aimbot', 'wallhack', 'buy cp'];
  const lowerText = text.toLowerCase();
  
  for (const word of badWords) {
    if (lowerText.includes(word)) {
      return { isClean: false, reason: `AUTO-MOD: Blocked term detected -> "${word}"` };
    }
  }

  // 2. Gemini AI Contextual Check
  if (genAI) {
    try {
      const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });
      const prompt = `You are a strict auto-moderator for a Call of Duty Mobile world chat. 
      Analyze the following message. Is it highly toxic, severe spam, or trying to sell illegal game hacks? 
      Reply with exactly 'CLEAN' or 'TOXIC'. Message: "${text}"`;
      
      const result = await model.generateContent(prompt);
      const output = result.response.text().trim().toUpperCase();
      
      if (output.includes('TOXIC')) {
        return { isClean: false, reason: "AUTO-MOD: AI flagged message as toxic/spam." };
      }
    } catch (e) {
      console.warn("Gemini AI check failed, skipping strict validation.", e);
    }
  }

  return { isClean: true };
}
