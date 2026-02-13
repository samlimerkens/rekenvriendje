
import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const getEncouragement = async (petName: string, level: number, performance: 'good' | 'great' | 'retry') => {
  try {
    let stage = 'Baby';
    if (level >= 30) stage = 'Volwassene';
    else if (level >= 25) stage = 'Jeugd';
    else if (level >= 20) stage = 'Tiener';
    else if (level >= 15) stage = 'Kind';
    else if (level >= 10) stage = 'Kleuter';
    else if (level >= 5) stage = 'Peuter';

    const prompt = `Je bent de stem van een schattig digitaal huisdier genaamd ${petName}. 
    Het huisdier is in de ${stage} fase en level ${level}.
    De speler is een kind in de lagere school die net rekenoefeningen heeft gedaan. 
    De prestatie was: ${performance}.
    
    Pas je toon aan op je fase (${stage}):
    - Baby/Peuter: Heel lief, woordjes als 'joepie' en 'hapje'.
    - Kleuter/Kind: Enthousiast en trots, moedig aan om door te gaan.
    - Tiener/Jeugd: Stoer, 'lekker bezig', 'reken-pro'.
    - Volwassene: Trots, wijs en noem het kind een 'rekenmeester'.

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
