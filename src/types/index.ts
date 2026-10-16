export interface Club {
  id: number;
  apiId?: number;
  name: string;
  shortName: string;
  badge: string;
  vitorias: number;
  empates: number;
  derrotas: number;
  golsMarcados: number;
  golsContra: number;
  // Computed fields
  partidasJogadas: number;
  pontos: number;
  saldoDeGols: number;
  posicao: number;
  zone: 'libertadores' | 'pre-libertadores' | 'sulamericana' | 'permanencia' | 'rebaixamento';
}

export type SortField = 'posicao' | 'name' | 'pontos' | 'partidasJogadas' | 'vitorias' | 'empates' | 'derrotas' | 'golsMarcados' | 'golsContra' | 'saldoDeGols';
export type SortDirection = 'asc' | 'desc';

export interface NewsArticle {
  id: string;
  title: string;
  summary: string;
  content: string[];
  image: string;
  author: string;
  date: string;
  category: string;
  readTime: string;
}

export type NavTab = 'inicio' | 'noticias' | 'sobre';
