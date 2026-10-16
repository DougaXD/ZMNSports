import { Router, Request, Response } from 'express';
import { footballService } from '../services/footballService';

export const footballRouter = Router();

// GET /api/football/live - Partidas ao vivo
footballRouter.get('/live', async (_req: Request, res: Response) => {
  try {
    const data = await footballService.getLiveMatches();
    res.json(data);
  } catch (error: any) {
    res.status(500).json({
      configured: false,
      matches: [],
      error: 'Falha ao buscar partidas ao vivo',
      message: error.message,
    });
  }
});

// GET /api/football/matches - Partidas por data e competição
footballRouter.get('/matches', async (req: Request, res: Response) => {
  try {
    const date = typeof req.query.date === 'string' ? req.query.date : undefined;
    const competitionId = req.query.competition ? parseInt(String(req.query.competition), 10) : undefined;

    const data = await footballService.getMatches(date, competitionId);
    res.json(data);
  } catch (error: any) {
    res.status(500).json({
      configured: false,
      matches: [],
      error: 'Falha ao buscar calendário de jogos',
      message: error.message,
    });
  }
});

// GET /api/football/match/:id - Detalhes do jogo
footballRouter.get('/match/:id', async (req: Request, res: Response) => {
  try {
    const fixtureId = parseInt(req.params.id, 10);
    if (isNaN(fixtureId)) {
      return res.status(400).json({ error: 'ID de partida inválido' });
    }

    const data = await footballService.getMatchDetail(fixtureId);
    res.json(data);
  } catch (error: any) {
    res.status(500).json({
      configured: false,
      fixture: null,
      error: 'Falha ao buscar detalhes do jogo',
      message: error.message,
    });
  }
});

// GET /api/football/standings - Classificação da liga
footballRouter.get('/standings', async (req: Request, res: Response) => {
  try {
    const leagueId = req.query.league ? parseInt(String(req.query.league), 10) : 71; // Default Brasileirão Série A
    const season = req.query.season ? parseInt(String(req.query.season), 10) : undefined;

    if (isNaN(leagueId)) {
      return res.status(400).json({ error: 'ID de liga inválido' });
    }

    const data = await footballService.getStandings(leagueId, season);
    res.json(data);
  } catch (error: any) {
    res.status(500).json({
      configured: false,
      standings: null,
      error: 'Falha ao carregar classificação',
      message: error.message,
    });
  }
});

// GET /api/football/competitions - Lista de campeonatos suportados
footballRouter.get('/competitions', (_req: Request, res: Response) => {
  const data = footballService.getCompetitions();
  res.json(data);
});
