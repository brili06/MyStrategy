import type { NextApiRequest, NextApiResponse } from 'next';
import { GoogleGenerativeAI } from '@google/generative-ai';

// Inisialisasi Google AI dengan Kunci API dari Environment Variable
// process.env.GOOGLE_API_KEY diambil dari Vercel saat di-deploy
const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY || '');

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  // Hanya izinkan metode POST untuk keamanan
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  try {
    // Ambil prompt dan model dari data yang dikirim oleh frontend
    const { prompt, model } = req.body;

    if (!prompt || !model) {
      return res.status(400).json({ error: 'Prompt and model are required' });
    }

    // Pilih model Gemini yang akan digunakan
    const geminiModel = genAI.getGenerativeModel({ model: model });

    // Panggil AI dengan prompt yang diberikan
    const result = await geminiModel.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    // Kirim kembali hasilnya sebagai JSON ke frontend
    res.status(200).json({ text: text });

  } catch (error) {
    console.error('Error calling Google AI:', error);
    res.status(500).json({ error: 'Failed to generate text from AI' });
  }
}