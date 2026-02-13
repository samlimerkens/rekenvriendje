
import { GoogleGenAI } from "@google/genai";

// Initialize the GoogleGenAI client with the API key from environment variables.
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const getEncouragement = async (petName: string, level: number, performance: 'good' | 'great' | 'retry') => {
  try {
    const stage = level >= 25 ? 'Master' : level >= 15 ? 'Volwassen' : level >= 5 ? 'Tiener' : 'Baby';
    const prompt = `Je bent de stem van een schattig digitaal huisdier genaamd ${petName}. 
    Het huisdier is in de ${stage} fase en level ${level}.
    De speler is een kind in de lagere school die net rekenoefeningen heeft gedaan. 
    De prestatie was: ${performance}.
    
    Als het huisdier een 'Baby' is, praat dan heel simpel en schattig.
    Als het huisdier 'Tiener' is, wees dan stoer en enthousiast.
    Als het huisdier 'Volwassen' is, wees dan trots en wijs.
    Als het huisdier 'Master' is, behandel het kind als een gelijke reken-genie.

    Geef een kort berichtje in het Nederlands (max 15 woorden). Gebruik emoticons.`;

    // Query the model for text content using the recommended model for basic text tasks.
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
    });

    // Access the .text property directly (not a method).
    return response.text || "Goed gedaan! Blijf oefenen!";
  } catch (error) {
    console.error("Gemini Error:", error);
    return "Je bent een rekenkampioen!";
  }
};

export const getMathFact = async () => {
  try {
    // Query the model for text content using the recommended model for basic text tasks.
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: "Geef een leuk, kort weetje over getallen of rekenen dat interessant is voor kinderen van 8 jaar. In het Nederlands.",
    });
    // Access the .text property directly (not a method).
    return response.text || "Wist je dat 0 het enige getal is dat niet als Romeins cijfer geschreven kan worden?";
  } catch (error) {
    return "Rekenen is overal om ons heen!";
  }
};
