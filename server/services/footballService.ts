import { CONFIG, SUPPORTED_COMPETITIONS } from '../config';
import { serverCache } from '../cache';

export interface StandardMatch {
  id: number;
  date: string;
  time: string;
  timestamp: number;
  status: {
    long: string;
    short: string;
    elapsed: number | null;
    isLive: boolean;
    isFinished: boolean;
    isUpcoming: boolean;
  };
  league: {
    id: number;
    name: string;
    country: string;
    logo: string;
    round: string;
    season: number;
  };
  homeTeam: {
    id: number;
    name: string;
    logo: string;
    winner: boolean | null;
  };
  awayTeam: {
    id: number;
    name: string;
    logo: string;
    winner: boolean | null;
  };
  goals: {
    home: number | null;
    away: number | null;
  };
  score: {
    halftime: { home: number | null; away: number | null };
    fulltime: { home: number | null; away: number | null };
    extratime: { home: number | null; away: number | null };
    penalty: { home: number | null; away: number | null };
  };
}

export interface StandardStandingItem {
  rank: number;
  team: {
    id: number;
    name: string;
    logo: string;
  };
  points: number;
  goalsDiff: number;
  group: string;
  form: string;
  status: string;
  description: string | null;
  all: {
    played: number;
    win: number;
    draw: number;
    lose: number;
    goals: {
      for: number;
      against: number;
    };
  };
}

export interface StandardStandingsResponse {
  league: {
    id: number;
    name: string;
    country: string;
    logo: string;
    flag: string | null;
    season: number;
    standings: StandardStandingItem[][];
  };
  isReferenceData?: boolean;
  source: string;
  lastUpdated: string;
}

export class FootballService {
  private isConfigured(): boolean {
    return Boolean(CONFIG.FOOTBALL.API_KEY && CONFIG.FOOTBALL.API_KEY.trim() !== '');
  }

  private async fetchFromApiSports(endpoint: string, params: Record<string, string | number>): Promise<unknown> {
    if (!this.isConfigured()) {
      throw new Error('FOOTBALL_API_KEY_NOT_CONFIGURED');
    }

    const query = new URLSearchParams();
    Object.entries(params).forEach(([k, v]) => query.append(k, String(v)));
    if (!query.has('timezone')) {
      query.append('timezone', CONFIG.TIMEZONE);
    }

    const url = `${CONFIG.FOOTBALL.BASE_URL}/${endpoint}?${query.toString()}`;

    const headers: Record<string, string> = {
      'x-rapidapi-key': CONFIG.FOOTBALL.API_KEY,
      'x-rapidapi-host': CONFIG.FOOTBALL.API_HOST,
      'x-apisports-key': CONFIG.FOOTBALL.API_KEY,
    };

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), CONFIG.FOOTBALL.TIMEOUT_MS);

    try {
      const response = await fetch(url, {
        method: 'GET',
        headers,
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        if (response.status === 429) {
          throw new Error('API_RATE_LIMIT_EXCEEDED');
        }
        if (response.status === 401 || response.status === 403) {
          throw new Error('API_KEY_INVALID');
        }
        throw new Error(`API_ERROR_${response.status}`);
      }

      const json = await response.json();

      // Check API-Sports error structure
      if (json.errors && Object.keys(json.errors).length > 0) {
        const errorMsg = JSON.stringify(json.errors);
        if (errorMsg.includes('rate limit') || errorMsg.includes('Requests per day')) {
          throw new Error('API_RATE_LIMIT_EXCEEDED');
        }
        if (errorMsg.includes('token') || errorMsg.includes('key')) {
          throw new Error('API_KEY_INVALID');
        }
        throw new Error(`API_RESPONSE_ERROR: ${errorMsg}`);
      }

      return json;
    } catch (err: unknown) {
      clearTimeout(timeoutId);
      throw err;
    }
  }

  /**
   * Normalize an API-Football fixture object into our frontend standard model
   */
  private normalizeMatch(f: any): StandardMatch {
    const shortStatus = f.fixture?.status?.short || 'NS';
    const isLive = ['1H', 'HT', '2H', 'ET', 'BT', 'P', 'INT', 'LIVE'].includes(shortStatus);
    const isFinished = ['FT', 'AET', 'PEN'].includes(shortStatus);
    const isUpcoming = ['TBD', 'NS'].includes(shortStatus);

    const d = new Date(f.fixture?.date);
    const timeFormatted = d.toLocaleTimeString('pt-BR', {
      timeZone: CONFIG.TIMEZONE,
      hour: '2-digit',
      minute: '2-digit',
    });
    const dateFormatted = d.toLocaleDateString('pt-BR', {
      timeZone: CONFIG.TIMEZONE,
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    });

    return {
      id: f.fixture?.id,
      date: dateFormatted,
      time: timeFormatted,
      timestamp: f.fixture?.timestamp,
      status: {
        long: f.fixture?.status?.long || 'Não Iniciado',
        short: shortStatus,
        elapsed: f.fixture?.status?.elapsed ?? null,
        isLive,
        isFinished,
        isUpcoming,
      },
      league: {
        id: f.league?.id,
        name: f.league?.name,
        country: f.league?.country,
        logo: f.league?.logo,
        round: f.league?.round,
        season: f.league?.season,
      },
      homeTeam: {
        id: f.teams?.home?.id,
        name: f.teams?.home?.name,
        logo: f.teams?.home?.logo,
        winner: f.teams?.home?.winner,
      },
      awayTeam: {
        id: f.teams?.away?.id,
        name: f.teams?.away?.name,
        logo: f.teams?.away?.logo,
        winner: f.teams?.away?.winner,
      },
      goals: {
        home: f.goals?.home ?? null,
        away: f.goals?.away ?? null,
      },
      score: {
        halftime: {
          home: f.score?.halftime?.home ?? null,
          away: f.score?.halftime?.away ?? null,
        },
        fulltime: {
          home: f.score?.fulltime?.home ?? null,
          away: f.score?.fulltime?.away ?? null,
        },
        extratime: {
          home: f.score?.extratime?.home ?? null,
          away: f.score?.extratime?.away ?? null,
        },
        penalty: {
          home: f.score?.penalty?.home ?? null,
          away: f.score?.penalty?.away ?? null,
        },
      },
    };
  }

  /**
   * Get Live Matches
   */
  async getLiveMatches(): Promise<{
    configured: boolean;
    matches: StandardMatch[];
    lastUpdated: string;
    source: string;
    message?: string;
  }> {
    const cacheKey = 'football:live';
    const cached = serverCache.get<StandardMatch[]>(cacheKey);

    if (cached && !cached.isStale) {
      return {
        configured: this.isConfigured(),
        matches: cached.data,
        lastUpdated: cached.lastUpdated,
        source: 'API-Football (Cache)',
      };
    }

    if (!this.isConfigured()) {
      return {
        configured: false,
        matches: [],
        lastUpdated: new Date().toLocaleTimeString('pt-BR', { timeZone: CONFIG.TIMEZONE }),
        source: 'Status ZMN Sports',
        message: 'A chave FOOTBALL_API_KEY não está configurada no ambiente. Partidas ao vivo requerem integração com API-Sports.',
      };
    }

    try {
      const data: any = await this.fetchFromApiSports('fixtures', { live: 'all' });
      const rawMatches = data.response || [];
      const matches = rawMatches.map((m: any) => this.normalizeMatch(m));

      serverCache.set(cacheKey, matches, CONFIG.FOOTBALL.CACHE_TTL.LIVE_MATCHES);

      return {
        configured: true,
        matches,
        lastUpdated: new Date().toLocaleTimeString('pt-BR', { timeZone: CONFIG.TIMEZONE }),
        source: 'API-Football (Tempo Real)',
      };
    } catch (err: any) {
      if (cached) {
        return {
          configured: true,
          matches: cached.data,
          lastUpdated: cached.lastUpdated,
          source: 'API-Football (Último Cache)',
          message: 'Falha temporária ao consultar o provedor; exibindo último estado registrado.',
        };
      }
      return {
        configured: true,
        matches: [],
        lastUpdated: new Date().toLocaleTimeString('pt-BR', { timeZone: CONFIG.TIMEZONE }),
        source: 'API-Football',
        message: `Erro ao buscar partidas ao vivo: ${err.message}`,
      };
    }
  }

  /**
   * Get Matches by Date and Optional Competition
   */
  async getMatches(dateStr?: string, competitionId?: number): Promise<{
    configured: boolean;
    date: string;
    matches: StandardMatch[];
    lastUpdated: string;
    source: string;
    message?: string;
  }> {
    // Default to today in Brazil
    const targetDate = dateStr || new Date().toLocaleDateString('en-CA', { timeZone: CONFIG.TIMEZONE }); // YYYY-MM-DD
    const cacheKey = `football:matches:${targetDate}:${competitionId || 'all'}`;
    const cached = serverCache.get<StandardMatch[]>(cacheKey);

    if (cached && !cached.isStale) {
      return {
        configured: this.isConfigured(),
        date: targetDate,
        matches: cached.data,
        lastUpdated: cached.lastUpdated,
        source: 'API-Football (Cache)',
      };
    }

    if (!this.isConfigured()) {
      return {
        configured: false,
        date: targetDate,
        matches: [],
        lastUpdated: new Date().toLocaleTimeString('pt-BR', { timeZone: CONFIG.TIMEZONE }),
        source: 'Status ZMN Sports',
        message: 'A chave FOOTBALL_API_KEY não foi configurada. Insira a chave no servidor para carregar o calendário oficial de partidas.',
      };
    }

    try {
      const params: Record<string, string | number> = { date: targetDate };
      if (competitionId) {
        params.league = competitionId;
      }

      const data: any = await this.fetchFromApiSports('fixtures', params);
      const rawMatches = data.response || [];
      const matches = rawMatches.map((m: any) => this.normalizeMatch(m));

      serverCache.set(cacheKey, matches, CONFIG.FOOTBALL.CACHE_TTL.TODAY_MATCHES);

      return {
        configured: true,
        date: targetDate,
        matches,
        lastUpdated: new Date().toLocaleTimeString('pt-BR', { timeZone: CONFIG.TIMEZONE }),
        source: 'API-Football',
      };
    } catch (err: any) {
      if (cached) {
        return {
          configured: true,
          date: targetDate,
          matches: cached.data,
          lastUpdated: cached.lastUpdated,
          source: 'API-Football (Cache Anterior)',
          message: 'Falha temporária ao sincronizar com o provedor; exibindo dados em cache.',
        };
      }
      return {
        configured: true,
        date: targetDate,
        matches: [],
        lastUpdated: new Date().toLocaleTimeString('pt-BR', { timeZone: CONFIG.TIMEZONE }),
        source: 'API-Football',
        message: `Não foi possível obter os jogos para a data selecionada (${err.message}).`,
      };
    }
  }

  /**
   * Get Match Details (Events, Lineups, Statistics)
   */
  async getMatchDetail(fixtureId: number): Promise<{
    configured: boolean;
    fixture: StandardMatch | null;
    events: any[];
    lineups: any[];
    statistics: any[];
    lastUpdated: string;
    source: string;
    message?: string;
  }> {
    const cacheKey = `football:match_detail:${fixtureId}`;
    const cached = serverCache.get<any>(cacheKey);

    if (cached && !cached.isStale) {
      return {
        ...cached.data,
        lastUpdated: cached.lastUpdated,
        source: 'API-Football (Cache)',
      };
    }

    if (!this.isConfigured()) {
      return {
        configured: false,
        fixture: null,
        events: [],
        lineups: [],
        statistics: [],
        lastUpdated: new Date().toLocaleTimeString('pt-BR', { timeZone: CONFIG.TIMEZONE }),
        source: 'Status ZMN Sports',
        message: 'FOOTBALL_API_KEY necessária para acessar detalhes e estatísticas do confronto.',
      };
    }

    try {
      const [fixtureRes, statsRes, eventsRes, lineupsRes]: any = await Promise.all([
        this.fetchFromApiSports('fixtures', { id: fixtureId }),
        this.fetchFromApiSports('fixtures/statistics', { fixture: fixtureId }).catch(() => ({ response: [] })),
        this.fetchFromApiSports('fixtures/events', { fixture: fixtureId }).catch(() => ({ response: [] })),
        this.fetchFromApiSports('fixtures/lineups', { fixture: fixtureId }).catch(() => ({ response: [] })),
      ]);

      const rawFixture = fixtureRes.response?.[0];
      if (!rawFixture) {
        throw new Error('Partida não encontrada no provedor.');
      }

      const result = {
        configured: true,
        fixture: this.normalizeMatch(rawFixture),
        events: eventsRes.response || [],
        lineups: lineupsRes.response || [],
        statistics: statsRes.response || [],
        lastUpdated: new Date().toLocaleTimeString('pt-BR', { timeZone: CONFIG.TIMEZONE }),
        source: 'API-Football',
      };

      serverCache.set(cacheKey, result, CONFIG.FOOTBALL.CACHE_TTL.MATCH_DETAIL);
      return result;
    } catch (err: any) {
      if (cached) {
        return cached.data;
      }
      return {
        configured: true,
        fixture: null,
        events: [],
        lineups: [],
        statistics: [],
        lastUpdated: new Date().toLocaleTimeString('pt-BR', { timeZone: CONFIG.TIMEZONE }),
        source: 'API-Football',
        message: `Erro ao obter detalhes da partida: ${err.message}`,
      };
    }
  }

  /**
   * Get Standings for a competition
   */
  async getStandings(leagueId: number, season?: number): Promise<{
    configured: boolean;
    standings: StandardStandingsResponse | null;
    lastUpdated: string;
    source: string;
    message?: string;
  }> {
    const compConfig = SUPPORTED_COMPETITIONS.find((c) => c.id === leagueId);
    const targetSeason = season || compConfig?.currentSeason || 2024;
    const cacheKey = `football:standings:${leagueId}:${targetSeason}`;

    const cached = serverCache.get<StandardStandingsResponse>(cacheKey);
    if (cached && !cached.isStale) {
      return {
        configured: this.isConfigured(),
        standings: cached.data,
        lastUpdated: cached.lastUpdated,
        source: cached.data.source || 'API-Football (Cache)',
      };
    }

    if (!this.isConfigured()) {
      return {
        configured: false,
        standings: null,
        lastUpdated: new Date().toLocaleTimeString('pt-BR', { timeZone: CONFIG.TIMEZONE }),
        source: 'ZMN Sports',
        message: 'A chave FOOTBALL_API_KEY não está configurada no servidor. Insira sua chave para visualizar as classificações oficiais em tempo real.',
      };
    }

    try {
      const data: any = await this.fetchFromApiSports('standings', {
        league: leagueId,
        season: targetSeason,
      });

      const leagueData = data.response?.[0]?.league;
      if (!leagueData) {
        throw new Error('Classificação não disponível para esta competição/temporada.');
      }

      const formatted: StandardStandingsResponse = {
        league: {
          id: leagueData.id,
          name: leagueData.name,
          country: leagueData.country,
          logo: leagueData.logo,
          flag: leagueData.flag,
          season: leagueData.season,
          standings: leagueData.standings || [],
        },
        source: 'API-Football',
        lastUpdated: new Date().toLocaleTimeString('pt-BR', { timeZone: CONFIG.TIMEZONE }),
      };

      serverCache.set(cacheKey, formatted, CONFIG.FOOTBALL.CACHE_TTL.STANDINGS);

      return {
        configured: true,
        standings: formatted,
        lastUpdated: formatted.lastUpdated,
        source: 'API-Football',
      };
    } catch (err: any) {
      if (cached) {
        return {
          configured: true,
          standings: cached.data,
          lastUpdated: cached.lastUpdated,
          source: 'API-Football (Último Cache)',
          message: 'Falha temporária ao sincronizar com o provedor; exibindo classificação em cache.',
        };
      }
      return {
        configured: true,
        standings: null,
        lastUpdated: new Date().toLocaleTimeString('pt-BR', { timeZone: CONFIG.TIMEZONE }),
        source: 'API-Football',
        message: `Não foi possível obter a classificação: ${err.message}`,
      };
    }
  }

  /**
   * Get catalog of supported competitions
   */
  getCompetitions() {
    return {
      competitions: SUPPORTED_COMPETITIONS,
      lastUpdated: new Date().toLocaleTimeString('pt-BR', { timeZone: CONFIG.TIMEZONE }),
      configured: this.isConfigured(),
    };
  }
}

export const footballService = new FootballService();
