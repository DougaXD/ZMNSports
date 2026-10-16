import { 
  Match, 
  Competition, 
  StandingTeamData, 
  NewsItem, 
  TransferItem, 
  TransferStatus, 
  SystemStatus, 
  GlobalSearchResult 
} from '../types/sports';

export interface StandingsApiResponse {
  configured: boolean;
  standings: {
    league: {
      id: number;
      name: string;
      country: string;
      logo: string;
      flag: string | null;
      season: number;
      standings: StandingTeamData[][];
    };
    source: string;
    lastUpdated: string;
  } | null;
  lastUpdated: string;
  source: string;
  message?: string;
}

export interface MatchesApiResponse {
  configured: boolean;
  date?: string;
  matches: Match[];
  lastUpdated: string;
  source: string;
  message?: string;
}

export const api = {
  async getStatus(): Promise<SystemStatus> {
    try {
      const res = await fetch('/api/status');
      if (!res.ok) throw new Error('Status offline');
      return await res.json();
    } catch {
      return {
        status: 'error',
        portal: 'ZMN Sports',
        footballConfigured: false,
        newsConfigured: false,
        timezone: 'America/Sao_Paulo',
        serverTime: new Date().toLocaleTimeString('pt-BR'),
      };
    }
  },

  async getLiveMatches(): Promise<MatchesApiResponse> {
    const res = await fetch('/api/football/live');
    if (!res.ok) throw new Error('Falha ao carregar partidas ao vivo');
    return await res.json();
  },

  async getMatches(date?: string, competitionId?: number): Promise<MatchesApiResponse> {
    const params = new URLSearchParams();
    if (date) params.append('date', date);
    if (competitionId) params.append('competition', String(competitionId));

    const url = `/api/football/matches?${params.toString()}`;
    const res = await fetch(url);
    if (!res.ok) throw new Error('Falha ao carregar jogos');
    return await res.json();
  },

  async getMatchDetail(fixtureId: number) {
    const res = await fetch(`/api/football/match/${fixtureId}`);
    if (!res.ok) throw new Error('Falha ao carregar detalhes da partida');
    return await res.json();
  },

  async getCompetitions(): Promise<{ competitions: Competition[]; lastUpdated: string; configured: boolean }> {
    const res = await fetch('/api/football/competitions');
    if (!res.ok) throw new Error('Falha ao carregar competições');
    return await res.json();
  },

  async getStandings(leagueId: number, season?: number): Promise<StandingsApiResponse> {
    const params = new URLSearchParams({ league: String(leagueId) });
    if (season) params.append('season', String(season));

    const res = await fetch(`/api/football/standings?${params.toString()}`);
    if (!res.ok) throw new Error('Falha ao carregar classificação');
    return await res.json();
  },

  async getNews(category = 'all', limit = 25): Promise<{ articles: NewsItem[]; source: string; lastUpdated: string }> {
    const params = new URLSearchParams({ category, limit: String(limit) });
    const res = await fetch(`/api/news?${params.toString()}`);
    if (!res.ok) throw new Error('Falha ao carregar notícias');
    return await res.json();
  },

  async getTransfers(status?: TransferStatus): Promise<{ transfers: TransferItem[]; source: string; lastUpdated: string }> {
    const params = new URLSearchParams();
    if (status) params.append('status', status);

    const res = await fetch(`/api/news/transfers?${params.toString()}`);
    if (!res.ok) throw new Error('Falha ao carregar transferências');
    return await res.json();
  },

  async search(query: string): Promise<GlobalSearchResult> {
    if (!query || query.length < 2) {
      return { competitions: [], news: [], clubs: [] };
    }
    const res = await fetch(`/api/search?q=${encodeURIComponent(query)}`);
    if (!res.ok) throw new Error('Falha na busca');
    return await res.json();
  },
};
