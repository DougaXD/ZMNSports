import dotenv from 'dotenv';
dotenv.config();

export const CONFIG = {
  PORT: parseInt(process.env.PORT || '3000', 10),
  TIMEZONE: 'America/Sao_Paulo',
  
  // API Football (API-Sports / RapidAPI)
  FOOTBALL: {
    API_KEY: process.env.FOOTBALL_API_KEY || '',
    API_HOST: process.env.FOOTBALL_API_HOST || 'v3.football.api-sports.io',
    BASE_URL: 'https://v3.football.api-sports.io',
    // Polling intervals in seconds
    REFRESH_INTERVAL_LIVE_SECONDS: 45, // When live games exist
    REFRESH_INTERVAL_IDLE_SECONDS: 300, // When no live games
    // Cache TTLs in milliseconds
    CACHE_TTL: {
      LIVE_MATCHES: 30 * 1000, // 30s
      TODAY_MATCHES: 2 * 60 * 1000, // 2min
      MATCH_DETAIL: 5 * 60 * 1000, // 5min
      STANDINGS: 15 * 60 * 1000, // 15min
      COMPETITIONS: 24 * 60 * 60 * 1000, // 24h
    },
    TIMEOUT_MS: 8000,
  },

  // News API (GNews or verified public Brazilian RSS feeds)
  NEWS: {
    API_KEY: process.env.NEWS_API_KEY || '',
    CACHE_TTL: 10 * 60 * 1000, // 10 minutes
    TIMEOUT_MS: 7000,
    RSS_FEEDS: [
      {
        name: 'Futebol Brasileiro (ge, UOL, Lance)',
        url: 'https://news.google.com/rss/search?q=futebol+brasileiro+brasileirao&hl=pt-BR&gl=BR&ceid=BR:pt-419',
        category: 'geral',
      },
      {
        name: 'Mercado da Bola (Transferências)',
        url: 'https://news.google.com/rss/search?q=mercado+da+bola+futebol+contrata%C3%A7%C3%A3o&hl=pt-BR&gl=BR&ceid=BR:pt-419',
        category: 'transferencias',
      },
      {
        name: 'Libertadores & Champions',
        url: 'https://news.google.com/rss/search?q=futebol+libertadores+ou+champions&hl=pt-BR&gl=BR&ceid=BR:pt-419',
        category: 'internacional',
      },
    ],
  },
};

export interface CompetitionConfig {
  id: number;
  name: string;
  shortName: string;
  country: string;
  code: string;
  type: 'League' | 'Cup';
  currentSeason: number;
  logo: string;
  region: 'Brasil' | 'América do Sul' | 'Europa' | 'Mundo';
  priority: number;
  zones?: {
    [key: string]: { min: number; max: number; label: string; color: string };
  };
}

export const SUPPORTED_COMPETITIONS: CompetitionConfig[] = [
  // Brasil
  {
    id: 71,
    name: 'Brasileirão Série A',
    shortName: 'Série A',
    country: 'Brasil',
    code: 'BSA',
    type: 'League',
    currentSeason: 2024,
    logo: 'https://media.api-sports.io/football/leagues/71.png',
    region: 'Brasil',
    priority: 1,
    zones: {
      libertadores: { min: 1, max: 4, label: 'Fase de grupos da Libertadores', color: '#237AF5' },
      preLibertadores: { min: 5, max: 6, label: 'Pré-Libertadores', color: '#FF8400' },
      sulAmericana: { min: 7, max: 12, label: 'Fase de grupos da Sul-Americana', color: '#2FA13A' },
      rebaixamento: { min: 17, max: 20, label: 'Rebaixamento para a Série B', color: '#FF0000' },
    },
  },
  {
    id: 72,
    name: 'Brasileirão Série B',
    shortName: 'Série B',
    country: 'Brasil',
    code: 'BSB',
    type: 'League',
    currentSeason: 2024,
    logo: 'https://media.api-sports.io/football/leagues/72.png',
    region: 'Brasil',
    priority: 2,
    zones: {
      acesso: { min: 1, max: 4, label: 'Acesso à Série A', color: '#237AF5' },
      rebaixamento: { min: 17, max: 20, label: 'Rebaixamento para a Série C', color: '#FF0000' },
    },
  },
  {
    id: 73,
    name: 'Copa do Brasil',
    shortName: 'Copa do Brasil',
    country: 'Brasil',
    code: 'CDB',
    type: 'Cup',
    currentSeason: 2024,
    logo: 'https://media.api-sports.io/football/leagues/73.png',
    region: 'Brasil',
    priority: 3,
  },
  // América do Sul
  {
    id: 13,
    name: 'Copa Conmebol Libertadores',
    shortName: 'Libertadores',
    country: 'América do Sul',
    code: 'CLI',
    type: 'Cup',
    currentSeason: 2024,
    logo: 'https://media.api-sports.io/football/leagues/13.png',
    region: 'América do Sul',
    priority: 4,
  },
  {
    id: 11,
    name: 'Copa Conmebol Sul-Americana',
    shortName: 'Sul-Americana',
    country: 'América do Sul',
    code: 'CSU',
    type: 'Cup',
    currentSeason: 2024,
    logo: 'https://media.api-sports.io/football/leagues/11.png',
    region: 'América do Sul',
    priority: 5,
  },
  // Europa
  {
    id: 2,
    name: 'UEFA Champions League',
    shortName: 'Champions League',
    country: 'Europa',
    code: 'UCL',
    type: 'Cup',
    currentSeason: 2024,
    logo: 'https://media.api-sports.io/football/leagues/2.png',
    region: 'Europa',
    priority: 6,
  },
  {
    id: 39,
    name: 'Premier League',
    shortName: 'Premier League',
    country: 'Inglaterra',
    code: 'PL',
    type: 'League',
    currentSeason: 2024,
    logo: 'https://media.api-sports.io/football/leagues/39.png',
    region: 'Europa',
    priority: 7,
    zones: {
      champions: { min: 1, max: 4, label: 'UEFA Champions League', color: '#237AF5' },
      europa: { min: 5, max: 5, label: 'UEFA Europa League', color: '#FF8400' },
      conference: { min: 6, max: 6, label: 'UEFA Conference League', color: '#2FA13A' },
      rebaixamento: { min: 18, max: 20, label: 'Rebaixamento para a Championship', color: '#FF0000' },
    },
  },
  {
    id: 140,
    name: 'La Liga',
    shortName: 'La Liga',
    country: 'Espanha',
    code: 'PD',
    type: 'League',
    currentSeason: 2024,
    logo: 'https://media.api-sports.io/football/leagues/140.png',
    region: 'Europa',
    priority: 8,
    zones: {
      champions: { min: 1, max: 4, label: 'UEFA Champions League', color: '#237AF5' },
      europa: { min: 5, max: 6, label: 'UEFA Europa League', color: '#FF8400' },
      rebaixamento: { min: 18, max: 20, label: 'Rebaixamento para La Liga 2', color: '#FF0000' },
    },
  },
  {
    id: 135,
    name: 'Serie A Italiana',
    shortName: 'Serie A',
    country: 'Itália',
    code: 'SA',
    type: 'League',
    currentSeason: 2024,
    logo: 'https://media.api-sports.io/football/leagues/135.png',
    region: 'Europa',
    priority: 9,
    zones: {
      champions: { min: 1, max: 4, label: 'UEFA Champions League', color: '#237AF5' },
      europa: { min: 5, max: 6, label: 'UEFA Europa League', color: '#FF8400' },
      rebaixamento: { min: 18, max: 20, label: 'Rebaixamento para a Serie B', color: '#FF0000' },
    },
  },
  {
    id: 78,
    name: 'Bundesliga',
    shortName: 'Bundesliga',
    country: 'Alemanha',
    code: 'BL1',
    type: 'League',
    currentSeason: 2024,
    logo: 'https://media.api-sports.io/football/leagues/78.png',
    region: 'Europa',
    priority: 10,
    zones: {
      champions: { min: 1, max: 4, label: 'UEFA Champions League', color: '#237AF5' },
      europa: { min: 5, max: 6, label: 'UEFA Europa League', color: '#FF8400' },
      rebaixamento: { min: 17, max: 18, label: 'Rebaixamento direto', color: '#FF0000' },
    },
  },
];
