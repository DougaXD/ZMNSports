import { Router, Request, Response } from 'express';
import { SUPPORTED_COMPETITIONS, CONFIG } from '../config';
import { newsService } from '../services/newsService';
import { serverCache } from '../cache';

export const searchRouter = Router();

// GET /api/search?q=...
searchRouter.get('/', async (req: Request, res: Response) => {
  const query = typeof req.query.q === 'string' ? req.query.q.trim().toLowerCase() : '';

  if (!query || query.length < 2) {
    return res.json({
      competitions: [],
      news: [],
      clubs: [],
    });
  }

  try {
    // 1. Search competitions
    const matchedCompetitions = SUPPORTED_COMPETITIONS.filter(
      (c) =>
        c.name.toLowerCase().includes(query) ||
        c.shortName.toLowerCase().includes(query) ||
        c.country.toLowerCase().includes(query)
    );

    // 2. Search news
    const newsData = await newsService.getNews('all', 50);
    const matchedNews = newsData.articles.filter(
      (a) =>
        a.title.toLowerCase().includes(query) ||
        a.description.toLowerCase().includes(query)
    ).slice(0, 10);

    // 3. Known popular Brazilian & International clubs
    const popularClubs = [
      { name: 'Flamengo', short: 'FLA', state: 'RJ' },
      { name: 'Palmeiras', short: 'PAL', state: 'SP' },
      { name: 'Botafogo', short: 'BOT', state: 'RJ' },
      { name: 'São Paulo', short: 'SAO', state: 'SP' },
      { name: 'Corinthians', short: 'COR', state: 'SP' },
      { name: 'Santos', short: 'SAN', state: 'SP' },
      { name: 'Vasco da Gama', short: 'VAS', state: 'RJ' },
      { name: 'Fluminense', short: 'FLU', state: 'RJ' },
      { name: 'Grêmio', short: 'GRE', state: 'RS' },
      { name: 'Internacional', short: 'INT', state: 'RS' },
      { name: 'Atlético-MG', short: 'CAM', state: 'MG' },
      { name: 'Cruzeiro', short: 'CRU', state: 'MG' },
      { name: 'Bahia', short: 'BAH', state: 'BA' },
      { name: 'Fortaleza', short: 'FOR', state: 'CE' },
      { name: 'Athletico-PR', short: 'CAP', state: 'PR' },
      { name: 'Real Madrid', short: 'RMA', state: 'ESP' },
      { name: 'Barcelona', short: 'BAR', state: 'ESP' },
      { name: 'Manchester City', short: 'MCI', state: 'ENG' },
      { name: 'Liverpool', short: 'LIV', state: 'ENG' },
    ];

    const matchedClubs = popularClubs.filter(
      (c) =>
        c.name.toLowerCase().includes(query) ||
        c.short.toLowerCase().includes(query)
    );

    res.json({
      competitions: matchedCompetitions,
      news: matchedNews,
      clubs: matchedClubs,
    });
  } catch (error: any) {
    res.status(500).json({
      error: 'Erro na busca',
      message: error.message,
    });
  }
});
