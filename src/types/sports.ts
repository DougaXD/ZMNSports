export type ActiveSection = 
  | 'inicio' 
  | 'jogos' 
  | 'competicoes' 
  | 'classificacoes' 
  | 'noticias' 
  | 'transferencias' 
  | 'sobre';

export interface MatchTeam {
  id: number;
  name: string;
  logo: string;
  winner: boolean | null;
}

export interface MatchScore {
  home: number | null;
  away: number | null;
}

export interface Match {
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
  homeTeam: MatchTeam;
  awayTeam: MatchTeam;
  goals: MatchScore;
  score: {
    halftime: MatchScore;
    fulltime: MatchScore;
    extratime: MatchScore;
    penalty: MatchScore;
  };
}

export interface StandingTeamData {
  rank: number;
  team: {
    id: number;
    name: string;
    logo: string;
  };
  points: number;
  goalsDiff: number;
  group?: string;
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

export interface Competition {
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

export interface NewsItem {
  id: string;
  title: string;
  description: string;
  contentSnippet?: string;
  url: string;
  imageUrl: string | null;
  source: string;
  publishedAt: string;
  category: string;
}

export type TransferStatus = 'Confirmado' | 'Em negociação' | 'Rumor' | 'Interesse reportado';

export interface TransferItem {
  id: string;
  title: string;
  summary: string;
  url: string;
  imageUrl: string | null;
  source: string;
  publishedAt: string;
  status: TransferStatus;
  clubFrom?: string;
  clubTo?: string;
  playerOrCoach?: string;
}

export interface SystemStatus {
  status: string;
  portal: string;
  footballConfigured: boolean;
  newsConfigured: boolean;
  timezone: string;
  serverTime: string;
}

export interface GlobalSearchResult {
  competitions: Competition[];
  news: NewsItem[];
  clubs: { name: string; short: string; state: string }[];
}
