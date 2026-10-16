import express from 'express';
import { createServer as createViteServer } from 'vite';
import path from 'path';
import { fileURLToPath } from 'url';
import { CONFIG } from './server/config';
import { footballRouter } from './server/routes/footballRoutes';
import { newsRouter } from './server/routes/newsRoutes';
import { searchRouter } from './server/routes/searchRoutes';
import { serverCache } from './server/cache';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  app.use(express.json());

  // Status check endpoint
  app.get('/api/status', (_req, res) => {
    const footballConfigured = Boolean(
      CONFIG.FOOTBALL.API_KEY && CONFIG.FOOTBALL.API_KEY.trim() !== ''
    );
    const newsConfigured = Boolean(
      CONFIG.NEWS.API_KEY && CONFIG.NEWS.API_KEY.trim() !== ''
    );

    res.json({
      status: 'online',
      portal: 'ZMN Sports',
      footballConfigured,
      newsConfigured,
      timezone: CONFIG.TIMEZONE,
      cache: serverCache.getStats(),
      serverTime: new Date().toLocaleTimeString('pt-BR', { timeZone: CONFIG.TIMEZONE }),
    });
  });

  // Mount API routes
  app.use('/api/football', footballRouter);
  app.use('/api/news', newsRouter);
  app.use('/api/search', searchRouter);

  const isProduction = process.env.NODE_ENV === 'production';

  if (!isProduction) {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.resolve(__dirname, 'dist');
    app.use(express.static(distPath));
    app.get('*', (_req, res) => {
      res.sendFile(path.resolve(distPath, 'index.html'));
    });
  }

  const port = CONFIG.PORT || 3000;
  app.listen(port, '0.0.0.0', () => {
    console.log(`[ZMN Sports Server] Rodando em http://0.0.0.0:${port} (Modo: ${isProduction ? 'Produção' : 'Desenvolvimento'})`);
  });
}

startServer();
