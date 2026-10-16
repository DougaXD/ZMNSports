import { Club } from '../types';

export interface RawClubData {
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
  founded?: number;
  stadium?: string;
  state?: string;
}

export const INITIAL_CLUBS_RAW: RawClubData[] = [
  {
    id: 1,
    apiId: 134,
    name: 'Athletico-PR',
    shortName: 'CAP',
    badge: '/imagens/escudos-mini/mini-escudo-athleticoparanaense.png',
    vitorias: 8,
    empates: 4,
    derrotas: 6,
    golsMarcados: 22,
    golsContra: 18,
    founded: 1924,
    stadium: 'Ligga Arena (Curitiba)',
    state: 'PR',
  },
  {
    id: 2,
    apiId: 144,
    name: 'Atlético-GO',
    shortName: 'ACG',
    badge: '/imagens/escudos-mini/mini-escudo-atleticogoianiense.png',
    vitorias: 2,
    empates: 6,
    derrotas: 12,
    golsMarcados: 16,
    golsContra: 31,
    founded: 1937,
    stadium: 'Antônio Accioly (Goiânia)',
    state: 'GO',
  },
  {
    id: 3,
    apiId: 1062,
    name: 'Atlético-MG',
    shortName: 'CAM',
    badge: '/imagens/escudos-mini/mini-escudo-atleticomineiro.png',
    vitorias: 7,
    empates: 7,
    derrotas: 4,
    golsMarcados: 27,
    golsContra: 26,
    founded: 1908,
    stadium: 'Arena MRV (Belo Horizonte)',
    state: 'MG',
  },
  {
    id: 4,
    apiId: 118,
    name: 'Bahia',
    shortName: 'BAH',
    badge: '/imagens/escudos-mini/mini-escudo-bahia.png',
    vitorias: 9,
    empates: 5,
    derrotas: 6,
    golsMarcados: 29,
    golsContra: 24,
    founded: 1931,
    stadium: 'Casa de Apostas Arena Fonte Nova (Salvador)',
    state: 'BA',
  },
  {
    id: 5,
    apiId: 120,
    name: 'Botafogo',
    shortName: 'BOT',
    badge: '/imagens/escudos-mini/mini-escudo-botafogo.png',
    vitorias: 12,
    empates: 4,
    derrotas: 4,
    golsMarcados: 31,
    golsContra: 19,
    founded: 1904,
    stadium: 'Nilton Santos (Rio de Janeiro)',
    state: 'RJ',
  },
  {
    id: 6,
    apiId: 794,
    name: 'Bragantino',
    shortName: 'RBB',
    badge: '/imagens/escudos-mini/mini-escudo-bragantino.png',
    vitorias: 7,
    empates: 4,
    derrotas: 7,
    golsMarcados: 22,
    golsContra: 21,
    founded: 1928,
    stadium: 'Nabi Abi Chedid (Bragança Paulista)',
    state: 'SP',
  },
  {
    id: 7,
    apiId: 131,
    name: 'Corinthians',
    shortName: 'COR',
    badge: '/imagens/escudos-mini/mini-escudo-corinthians.png',
    vitorias: 4,
    empates: 7,
    derrotas: 9,
    golsMarcados: 18,
    golsContra: 27,
    founded: 1910,
    stadium: 'Neo Química Arena (São Paulo)',
    state: 'SP',
  },
  {
    id: 8,
    apiId: 140,
    name: 'Criciúma',
    shortName: 'CRI',
    badge: '/imagens/escudos-mini/mini-escudo-criciuma.png',
    vitorias: 5,
    empates: 6,
    derrotas: 7,
    golsMarcados: 26,
    golsContra: 28,
    founded: 1947,
    stadium: 'Heriberto Hülse (Criciúma)',
    state: 'SC',
  },
  {
    id: 9,
    apiId: 135,
    name: 'Cruzeiro',
    shortName: 'CRU',
    badge: '/imagens/escudos-mini/mini-escudo-cruzeiro.png',
    vitorias: 11,
    empates: 2,
    derrotas: 6,
    golsMarcados: 28,
    golsContra: 20,
    founded: 1921,
    stadium: 'Mineirão (Belo Horizonte)',
    state: 'MG',
  },
  {
    id: 10,
    apiId: 1193,
    name: 'Cuiabá',
    shortName: 'CUI',
    badge: '/imagens/escudos-mini/mini-escudo-cuiaba.png',
    vitorias: 4,
    empates: 5,
    derrotas: 9,
    golsMarcados: 19,
    golsContra: 24,
    founded: 2001,
    stadium: 'Arena Pantanal (Cuiabá)',
    state: 'MT',
  },
  {
    id: 11,
    apiId: 136,
    name: 'EC Vitória',
    shortName: 'VIT',
    badge: '/imagens/escudos-mini/mini-escudo-vitoria.png',
    vitorias: 5,
    empates: 3,
    derrotas: 12,
    golsMarcados: 22,
    golsContra: 32,
    founded: 1899,
    stadium: 'Barradão (Salvador)',
    state: 'BA',
  },
  {
    id: 12,
    apiId: 127,
    name: 'Flamengo',
    shortName: 'FLA',
    badge: '/imagens/escudos-mini/mini-escudo-flamengo.png',
    vitorias: 12,
    empates: 4,
    derrotas: 3,
    golsMarcados: 34,
    golsContra: 19,
    founded: 1895,
    stadium: 'Maracanã (Rio de Janeiro)',
    state: 'RJ',
  },
  {
    id: 13,
    apiId: 124,
    name: 'Fluminense',
    shortName: 'FLU',
    badge: '/imagens/escudos-mini/mini-escudo-fluminense.png',
    vitorias: 4,
    empates: 5,
    derrotas: 10,
    golsMarcados: 15,
    golsContra: 24,
    founded: 1902,
    stadium: 'Maracanã (Rio de Janeiro)',
    state: 'RJ',
  },
  {
    id: 14,
    apiId: 154,
    name: 'Fortaleza',
    shortName: 'FOR',
    badge: '/imagens/escudos-mini/mini-escudo-fortaleza.png',
    vitorias: 10,
    empates: 6,
    derrotas: 3,
    golsMarcados: 24,
    golsContra: 18,
    founded: 1918,
    stadium: 'Arena Castelão (Fortaleza)',
    state: 'CE',
  },
  {
    id: 15,
    apiId: 130,
    name: 'Grêmio',
    shortName: 'GRE',
    badge: '/imagens/escudos-mini/mini-escudo-gremio.png',
    vitorias: 5,
    empates: 3,
    derrotas: 10,
    golsMarcados: 15,
    golsContra: 22,
    founded: 1903,
    stadium: 'Arena do Grêmio (Porto Alegre)',
    state: 'RS',
  },
  {
    id: 16,
    apiId: 119,
    name: 'Internacional',
    shortName: 'INT',
    badge: '/imagens/escudos-mini/mini-escudo-internacional.png',
    vitorias: 5,
    empates: 5,
    derrotas: 5,
    golsMarcados: 13,
    golsContra: 13,
    founded: 1909,
    stadium: 'Beira-Rio (Porto Alegre)',
    state: 'RS',
  },
  {
    id: 17,
    apiId: 152,
    name: 'Juventude',
    shortName: 'JUV',
    badge: '/imagens/escudos-mini/mini-escudo-juventude.png',
    vitorias: 5,
    empates: 6,
    derrotas: 7,
    golsMarcados: 20,
    golsContra: 24,
    founded: 1913,
    stadium: 'Alfredo Jaconi (Caxias do Sul)',
    state: 'RS',
  },
  {
    id: 18,
    apiId: 121,
    name: 'Palmeiras',
    shortName: 'PAL',
    badge: '/imagens/escudos-mini/mini-escudo-palmeiras.png',
    vitorias: 11,
    empates: 3,
    derrotas: 6,
    golsMarcados: 27,
    golsContra: 16,
    founded: 1914,
    stadium: 'Allianz Parque (São Paulo)',
    state: 'SP',
  },
  {
    id: 19,
    apiId: 126,
    name: 'São Paulo',
    shortName: 'SAO',
    badge: '/imagens/escudos-mini/mini-escudo-saopaulo.png',
    vitorias: 9,
    empates: 5,
    derrotas: 6,
    golsMarcados: 28,
    golsContra: 21,
    founded: 1930,
    stadium: 'MorumBIS (São Paulo)',
    state: 'SP',
  },
  {
    id: 20,
    apiId: 133,
    name: 'Vasco',
    shortName: 'VAS',
    badge: '/imagens/escudos-mini/mini-escudo-vasco.png',
    vitorias: 7,
    empates: 2,
    derrotas: 10,
    golsMarcados: 20,
    golsContra: 29,
    founded: 1898,
    stadium: 'São Januário (Rio de Janeiro)',
    state: 'RJ',
  },
];

/**
 * Computes points, games played, goal difference, and sorts by original Brasileirão rules:
 * 1. Pontos (desc)
 * 2. Vitórias (desc)
 * 3. Saldo de Gols (desc)
 * 4. Gols Marcados (desc)
 */
export function computeStandings(rawClubs: RawClubData[]): Club[] {
  // First compute numerical stats for each club
  const processed = rawClubs.map((club) => {
    const partidasJogadas = club.vitorias + club.empates + club.derrotas;
    const pontos = club.vitorias * 3 + club.empates;
    const saldoDeGols = club.golsMarcados - club.golsContra;

    return {
      ...club,
      partidasJogadas,
      pontos,
      saldoDeGols,
      posicao: 0,
      zone: 'permanencia' as const,
    };
  });

  // Sort according to Brazilian Serie A tiebreakers from script.js
  processed.sort((a, b) => {
    if (a.pontos !== b.pontos) {
      return b.pontos - a.pontos;
    }
    if (a.vitorias !== b.vitorias) {
      return b.vitorias - a.vitorias;
    }
    if (a.saldoDeGols !== b.saldoDeGols) {
      return b.saldoDeGols - a.saldoDeGols;
    }
    return b.golsMarcados - a.golsMarcados;
  });

  // Assign positions and zones
  return processed.map((club, index) => {
    const posicao = index + 1;
    let zone: Club['zone'] = 'permanencia';

    if (posicao >= 1 && posicao <= 4) {
      zone = 'libertadores';
    } else if (posicao >= 5 && posicao <= 6) {
      zone = 'pre-libertadores';
    } else if (posicao >= 7 && posicao <= 12) {
      zone = 'sulamericana';
    } else if (posicao >= 17 && posicao <= 20) {
      zone = 'rebaixamento';
    }

    return {
      ...club,
      posicao,
      zone,
    };
  });
}

export const ZONE_COLORS = {
  libertadores: '#237AF5',
  'pre-libertadores': '#FF8400',
  sulamericana: '#2FA13A',
  permanencia: 'transparent',
  rebaixamento: '#FF0000',
};

export const ZONE_LABELS = {
  libertadores: 'Fase de grupos da Copa Conmebol Libertadores',
  'pre-libertadores': 'Qualificatórias da Copa Conmebol Libertadores',
  sulamericana: 'Fase de grupos da Copa Conmebol Sul-Americana',
  permanencia: 'Permanência na Série A',
  rebaixamento: 'Rebaixamento para a Série B',
};
