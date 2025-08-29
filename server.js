import express from 'express';
import fetch from 'node-fetch';
import cors from 'cors';
import dotenv from 'dotenv';

// Load environment variables from .env file
dotenv.config();

const app = express();
const port = process.env.PORT || 3001;

app.use(express.json());
app.use(cors({ origin: true }));

// API namespace base path
const apiBase = '/api';

// Simple in-memory list of available voices
// You can replace this with a dynamic fetch to your own service
const availableVoices = [
  {
    id: 'breeze',
    name: 'Breeze',
    description: 'Animated and earnest',
    realtimeVoice: 'verse',
  },
  {
    id: 'maple',
    name: 'Maple',
    description: 'Cheerful and candid',
    realtimeVoice: 'alloy',
  },
  {
    id: 'vale',
    name: 'Vale',
    description: 'Bright and inquisitive',
    realtimeVoice: 'verse',
  },
];

// List available voices
app.get(`${apiBase}/voices`, async (_req, res) => {
  try {
    return res.json({ success: true, data: availableVoices });
  } catch (err) {
    console.error('Failed to fetch voices', err);
    return res.status(500).json({ success: false, error: 'Failed to fetch voices' });
  }
});

// Create ephemeral token for client WebRTC to OpenAI Realtime
app.post('/session', async (req, res) => {
  try {
    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) {
      return res.status(500).json({ error: 'Missing OPENAI_API_KEY on server' });
    }

    // Optional: accept model/voice from client
    const { model = 'gpt-4o-realtime-preview-2024-12-17', voice = 'verse' } = req.body || {};

    const r = await fetch('https://api.openai.com/v1/realtime/sessions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model,
        voice,
      }),
    });

    if (!r.ok) {
      const text = await r.text();
      return res.status(r.status).json({ error: text });
    }

    const data = await r.json();
    return res.json(data);
  } catch (err) {
    console.error('Failed to create ephemeral session', err);
    return res.status(500).json({ error: 'Failed to create session' });
  }
});

app.listen(port, () => {
  console.log(`Ephemeral session server listening on http://localhost:${port}`);
});

