import express from 'express';
import { createServer as createViteServer } from 'vite';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = Number(process.env.PORT) || 3000;
const GAS_URL =
  'https://script.google.com/macros/s/AKfycbw5Rk6O-yjjn8Dy5Vejgo15-KM8XhHM7k7gC57c_GxB_pzRiljkl3nTir1vHxxVLzD6rw/exec';

app.use(express.json());
app.use(express.text({ type: '*/*' }));

// Server-side proxy for Google Apps Script to bypass browser CORS and origin restrictions
app.all('/api/database', async (req, res) => {
  try {
    const targetUrl = req.query.url ? String(req.query.url) : GAS_URL;

    if (req.method === 'GET') {
      const response = await fetch(targetUrl, { redirect: 'follow' });
      const text = await response.text();
      if (!text) {
        return res.status(502).json({ status: 'error', message: 'Empty response from Google Sheets.' });
      }
      try {
        const json = JSON.parse(text);
        return res.json(json);
      } catch {
        return res.status(response.status).send(text);
      }
    } else {
      const bodyContent =
        typeof req.body === 'string'
          ? req.body
          : JSON.stringify(req.body || {});

      const response = await fetch(targetUrl, {
        method: 'POST',
        redirect: 'follow',
        headers: {
          'Content-Type': 'text/plain;charset=utf-8',
        },
        body: bodyContent,
      });

      const text = await response.text();
      if (!text) {
        return res.status(502).json({ status: 'error', message: 'Empty response from Google Sheets.' });
      }
      try {
        const json = JSON.parse(text);
        return res.json(json);
      } catch {
        return res.status(response.status).send(text);
      }
    }
  } catch (error: any) {
    console.error('[API Proxy Error]:', error);
    return res.status(500).json({ status: 'error', message: error.message });
  }
});

async function startServer() {
  if (process.env.NODE_ENV === 'production') {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (_req, res) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  } else {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
