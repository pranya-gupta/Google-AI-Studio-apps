import { GoogleGenAI, Type } from "@google/genai";
import { RecommendationRequest, Look } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || "" });

export async function generateFashionRecommendations(request: RecommendationRequest): Promise<Look[]> {
  const prompt = `Generate 3 fashion looks for a ${request.age}-year-old ${request.gender} for the occasion: "${request.occasion}". 
  The style should be inspired by the "The Vampire Diaries/The Originals" universe, specifically the character ${request.character} in their ${request.era} era. 
  The atmosphere/season is ${request.atmosphere}.
  
  Each look must include:
  - A name for the look
  - Topwear (name and price)
  - Bottomwear (name and price)
  - Layering (name and price)
  - Accessories (name and price)
  - Shoes (name and price)
  - A brief description of why this look fits the character and era.
  
  Return the data as a JSON array of 3 objects.`;

  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: prompt,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.ARRAY,
        items: {
          type: Type.OBJECT,
          properties: {
            name: { type: Type.STRING },
            topwear: {
              type: Type.OBJECT,
              properties: {
                name: { type: Type.STRING },
                price: { type: Type.STRING }
              },
              required: ["name", "price"]
            },
            bottomwear: {
              type: Type.OBJECT,
              properties: {
                name: { type: Type.STRING },
                price: { type: Type.STRING }
              },
              required: ["name", "price"]
            },
            layering: {
              type: Type.OBJECT,
              properties: {
                name: { type: Type.STRING },
                price: { type: Type.STRING }
              },
              required: ["name", "price"]
            },
            accessories: {
              type: Type.OBJECT,
              properties: {
                name: { type: Type.STRING },
                price: { type: Type.STRING }
              },
              required: ["name", "price"]
            },
            shoes: {
              type: Type.OBJECT,
              properties: {
                name: { type: Type.STRING },
                price: { type: Type.STRING }
              },
              required: ["name", "price"]
            },
            description: { type: Type.STRING }
          },
          required: ["name", "topwear", "bottomwear", "layering", "accessories", "shoes", "description"]
        }
      }
    }
  });

  const looks: Look[] = JSON.parse(response.text || "[]").map((look: any, index: number) => ({
    ...look,
    id: `look-${index}-${Date.now()}`
  }));

  return looks;
}

export async function generateLookImage(look: Look, request: RecommendationRequest): Promise<string | undefined> {
  const prompt = `A high-quality fashion editorial photography of the person in the provided image wearing: ${look.topwear.name}, ${look.bottomwear.name}, ${look.layering.name}, ${look.accessories.name}, and ${look.shoes.name}. 
  The style is inspired by ${request.character} from The Vampire Diaries as a ${request.era}. 
  The setting is a ${request.atmosphere} day in Mystic Falls. 
  Maintain the person's identity from the image but change their outfit to the described one.
  Soft lighting, cinematic composition, light aesthetic.`;

  try {
    const parts: any[] = [{ text: prompt }];
    
    if (request.userImage) {
      // Extract base64 data and mime type
      const match = request.userImage.match(/^data:(image\/\w+);base64,(.+)$/);
      if (match) {
        parts.unshift({
          inlineData: {
            mimeType: match[1],
            data: match[2]
          }
        });
      }
    }

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash-image",
      contents: { parts },
      config: {
        imageConfig: {
          aspectRatio: "3:4"
        }
      }
    });

    for (const part of response.candidates?.[0]?.content?.parts || []) {
      if (part.inlineData) {
        return `data:image/png;base64,${part.inlineData.data}`;
      }
    }
  } catch (error) {
    console.error("Image generation failed:", error);
  }
  return undefined;
}
