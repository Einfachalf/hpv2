// pages/api/chat.ts

import { NextApiRequest, NextApiResponse } from 'next';
import { HfInference } from '@huggingface/inference';

// Erstellen Sie eine neue Instanz von HfInference
const hf = new HfInference(process.env.HUGGINGFACE_API_KEY);

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    try {
      // Extrahieren Sie die Nachrichten aus dem Request-Body
      const { messages } = req.body;

      // Rufen Sie das Hugging Face Modell auf
      const response = await hf.textGeneration({
        model: 'OpenAssistant/oasst-sft-4-pythia-12b-epoch-3.5',
        inputs: messages,
        parameters: {
          max_new_tokens: 200,
          typical_p: 0.2,
          repetition_penalty: 1,
          truncate: 1000,
          return_full_text: false,
        },
      });

      // Senden Sie die Antwort zurück an den Client
      res.status(200).json({ answer: response.data });
    } catch (error) {
      // Bei einem Fehler senden Sie eine entsprechende Antwort
      res.status(500).json({ error: 'Fehler bei der Verarbeitung der Anfrage' });
    }
  } else {
    // Wenn die Methode nicht POST ist, senden Sie eine 405-Methode nicht erlaubt Antwort
    res.setHeader('Allow', ['POST']);
    res.status(405).end(`Methode ${req.method} nicht erlaubt`);
  }
}
