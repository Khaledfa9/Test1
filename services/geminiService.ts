import { GoogleGenAI, Type, Modality, GenerateContentResponse } from "@google/genai";
import { ExtractedMealForReview, MealCategory } from '../types';

let ai: GoogleGenAI | null = null;

// Lazy initialization of the GoogleGenAI instance to prevent crash on load if API key is missing.
const getAi = () => {
    if (!ai) {
        const apiKey = process.env.API_KEY;
        if (!apiKey) {
            // This state is handled by the UI in App.tsx, but this is a safeguard.
            throw new Error("Gemini API key not found. Please set VITE_GEMINI_API_KEY in your environment.");
        }
        ai = new GoogleGenAI({ apiKey });
    }
    return ai;
};


const fileToGenerativePart = async (file: File) => {
    const base64EncodedData = await new Promise<string>((resolve, reject) => {
        const reader = new FileReader();
        reader.onloadend = () => resolve((reader.result as string).split(',')[1]);
        reader.onerror = reject;
        reader.readAsDataURL(file);
    });

    return {
        inlineData: {
            data: base64EncodedData,
            mimeType: file.type
        }
    };
};

export const compressImage = (base64Str: string, maxWidth: number = 256, quality: number = 0.7): Promise<string> => {
    return new Promise((resolve, reject) => {
        const img = new Image();
        img.src = base64Str;
        img.onload = () => {
            const canvas = document.createElement('canvas');
            const scale = maxWidth / img.width;
            canvas.width = maxWidth;
            canvas.height = img.height * scale;

            const ctx = canvas.getContext('2d');
            if (!ctx) {
                return reject(new Error('Could not get canvas context'));
            }

            ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

            const compressedBase64 = canvas.toDataURL('image/jpeg', quality);
            resolve(compressedBase64);
        };
        img.onerror = (error) => {
            console.error("Image load error for compression:", error);
            reject(error);
        };
    });
};

export const generateMealImage = async (mealName: string): Promise<string> => {
    try {
        const ai = getAi();
        const response: GenerateContentResponse = await ai.models.generateContent({
            model: 'gemini-2.5-flash-image',
            contents: {
                parts: [{ text: `A delicious, high-quality photo of ${mealName}, realistic food photography` }]
            },
            config: {
                responseModalities: [Modality.IMAGE],
            },
        });

        for (const part of response.candidates?.[0]?.content?.parts || []) {
            if (part.inlineData) {
                const base64ImageBytes: string = part.inlineData.data;
                return `data:${part.inlineData.mimeType};base64,${base64ImageBytes}`;
            }
        }
        throw new Error("No image generated");
    } catch (error) {
        console.error("Error generating meal image:", error);
        throw error;
    }
};

export const extractMealsFromFile = async (file: File): Promise<Omit<ExtractedMealForReview, 'id' | 'imageUrl'>[]> => {
    const mealListSchema = {
        type: Type.ARRAY,
        items: {
            type: Type.OBJECT,
            properties: {
                mealName: { type: Type.STRING, description: 'The English name of the meal. If the meal name is in Arabic or another language in the source, translate it to English.' },
                weightGrams: { type: Type.NUMBER, description: 'The estimated weight of the meal in grams. Provide a reasonable estimate if not specified.' },
                calories: { type: Type.NUMBER, description: 'The estimated total calories for the meal.' },
                protein: { type: Type.NUMBER, description: 'The estimated total protein in grams for the meal.' },
                carbs: { type: Type.NUMBER, description: 'The estimated total carbohydrates in grams for the meal.' },
                fat: { type: Type.NUMBER, description: 'The estimated total fat in grams for the meal.' },
                category: { type: Type.STRING, description: "Categorize as 'Breakfast', 'Lunch', 'Dinner', or 'Snacks', in English." }
            },
            required: ['mealName', 'weightGrams', 'calories', 'protein', 'carbs', 'fat', 'category']
        }
    };

    const prompt = "You are an expert nutrition assistant. Analyze the attached image or PDF of a diet plan, which could be in English or Arabic. Extract every meal listed. For each meal, identify its name (translating to English if necessary), category (Breakfast, Lunch, Dinner, or Snacks), total calories, protein (g), carbs (g), and fat (g). If a value is missing, estimate it based on the meal's components. Provide the output as a JSON array of objects.";

    try {
        const ai = getAi();
        const imagePart = await fileToGenerativePart(file);

        const response: GenerateContentResponse = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: { parts: [imagePart, { text: prompt }] },
            config: {
                responseMimeType: "application/json",
                responseSchema: mealListSchema
            }
        });

        const jsonString = response.text.trim();
        const extractedData = JSON.parse(jsonString);

        // Validate and format data
        return extractedData.map((item: any) => ({
            ...item,
            category: Object.values(MealCategory).includes(item.category) ? item.category : MealCategory.Snacks,
        }));

    } catch (error) {
        console.error("Error extracting meals from file:", error);
        throw error;
    }
};
