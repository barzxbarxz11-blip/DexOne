import { GoogleGenAI } from '@google/genai';

const ai = new GoogleGenAI({ apiKey: "AIzaSyDwraKSpVwKFfTuZaTNlX8COYGYiAs7_tE" });

export default async function handler(req, res) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }

    if (req.method !== 'POST') {
        return res.status(405).json({ success: false, error: 'Metode tidak diizinkan' });
    }

    try {
        const { prompt } = req.body;

        const response = await ai.models.generateImages({
            model: 'imagen-3.0-generate-002',
            prompt: prompt,
            config: {
                numberOfImages: 1,
                outputMimeType: 'image/jpeg',
                aspectRatio: '1:1',
            },
        });

        const imageBase64 = response.generatedImages[0].image.imageBytes;
        return res.status(200).json({ success: true, imageUrl: `data:image/jpeg;base64,${imageBase64}` });
    } catch (error) {
        return res.status(500).json({ success: false, error: error.message });
    }
}
