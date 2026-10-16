import { Router, Request, Response } from 'express';
import { newsService, TransferStatus } from '../services/newsService';

export const newsRouter = Router();

// GET /api/news - Notícias reais de futebol
newsRouter.get('/', async (req: Request, res: Response) => {
  try {
    const category = typeof req.query.category === 'string' ? req.query.category : 'all';
    const limit = req.query.limit ? parseInt(String(req.query.limit), 10) : 25;

    const data = await newsService.getNews(category, isNaN(limit) ? 25 : limit);
    res.json(data);
  } catch (error: any) {
    res.status(500).json({
      articles: [],
      error: 'Falha ao buscar notícias',
      message: error.message,
    });
  }
});

// GET /api/transfers - Mercado da Bola
newsRouter.get('/transfers', async (req: Request, res: Response) => {
  try {
    const status = typeof req.query.status === 'string' ? (req.query.status as TransferStatus) : undefined;
    const data = await newsService.getTransfers(status);
    res.json(data);
  } catch (error: any) {
    res.status(500).json({
      transfers: [],
      error: 'Falha ao carregar mercado da bola',
      message: error.message,
    });
  }
});
