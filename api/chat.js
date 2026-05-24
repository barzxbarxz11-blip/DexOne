import { GoogleGenAI } from '@google/genai';

const ai = new GoogleGenAI({ apiKey: "AIzaSyMasingMasingApiKeyAndaDiSini" });

export default async function handler(req, res) {
    // Mengatur CORS agar aman diakses
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
        const { message, history, fileData } = req.body;
        let contents = [];

        if (history && history.length > 0) {
            contents = [...history];
        }

        if (fileData) {
            contents.push({
                inlineData: {
                    data: fileData.base64,
                    mimeType: fileData.mimeType
                }
            });
        }

        contents.push({ role: 'user', parts: [{ text: message }] });

        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: contents,
        });

        return res.status(200).json({ success: true, text: response.text });
    } catch (error) {
        return res.status(500).json({ success: false, error: error.message });
    }
}
