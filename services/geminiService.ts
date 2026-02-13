
import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const getEncouragement = async (petName: string, level: number, performance: 'good' | 'great' | 'retry') => {
  try {
    let stage = 'Baby';
    if (level >= 10) stage = 'Kind';
    else if (level >= 5) stage = 'Kleuter';

    const prompt = `Je bent de stem van een schattige panda genaamd ${petName}. 
    De panda is in de ${stage} fase en level ${level}.
    De speler is een kind in de lagere school die net rekenoefeningen heeft gedaan. 
    De prestatie was: ${performance}.
    
    Pas je toon aan op je fase (${stage}):
    - Baby: Heel lief, brabbelt een beetje met woordjes als 'joepie' en 'bamboe'.
    - Kleuter: Enthousiast en trots, moedig aan om meer te oefenen.
    - Kind: Slim en vrolijk, 'lekker bezig', 'reken-kampioen'.

    Geef een kort berichtje in het Nederlands (max 12 woorden). Gebruik emoticons.`;

    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
    });

    return response.text || "Goed gedaan! Blijf oefenen! 🌟";
  } catch (error) {
    console.error("Gemini Error:", error);
    return "Je bent een rekenkampioen! 🏆";
  }
};

export const getMathFact = async () => {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: "Geef een leuk, kort weetje over getallen of rekenen dat interessant is voor kinderen van 8 jaar. In het Nederlands. Max 15 woorden.",
    });
    return response.text || "Wist je dat 0 pas later is uitgevonden? 🔢";
  } catch (error) {
    return "Rekenen is overal om ons heen! ✨";
  }
};
