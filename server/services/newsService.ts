import { XMLParser } from 'fast-xml-parser';
import { CONFIG } from '../config';
import { serverCache } from '../cache';

export interface StandardNewsItem {
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

export interface StandardTransferItem {
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

export class NewsService {
  private xmlParser: XMLParser;

  constructor() {
    this.xmlParser = new XMLParser({
      ignoreAttributes: false,
      attributeNamePrefix: '@_',
      textNodeName: '#text',
    });
  }

  private isGNewsConfigured(): boolean {
    return Boolean(CONFIG.NEWS.API_KEY && CONFIG.NEWS.API_KEY.trim() !== '');
  }

  /**
   * Fetch and parse an RSS feed
   */
  private async fetchRssFeed(feedUrl: string, sourceName: string, defaultCategory: string): Promise<StandardNewsItem[]> {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), CONFIG.NEWS.TIMEOUT_MS);

    try {
      const res = await fetch(feedUrl, {
        headers: {
          'User-Agent': 'ZMNSports/2.0 (Sports News Reader)',
          Accept: 'application/rss+xml, application/xml, text/xml',
        },
        signal: controller.signal,
      });

      clearTimeout(timeout);

      if (!res.ok) {
        return [];
      }

      const text = await res.text();
      const parsed = this.xmlParser.parse(text);
      const items = parsed?.rss?.channel?.item || [];
      const itemArray = Array.isArray(items) ? items : [items];

      return itemArray.map((it: any) => {
        let imageUrl: string | null = null;
        if (it['media:content']?.['@_url']) {
          imageUrl = it['media:content']['@_url'];
        } else if (it.enclosure?.['@_url']) {
          imageUrl = it.enclosure['@_url'];
        }

        const pubDateRaw = it.pubDate || it['dc:date'] || new Date().toISOString();
        const dateObj = new Date(pubDateRaw);
        const formattedDate = !isNaN(dateObj.getTime())
          ? dateObj.toLocaleString('pt-BR', {
              timeZone: CONFIG.TIMEZONE,
              day: '2-digit',
              month: '2-digit',
              year: 'numeric',
              hour: '2-digit',
              minute: '2-digit',
            })
          : 'Data recente';

        // Clean description
        const rawDesc = String(it.description || '').replace(/<[^>]*>?/gm, '').trim();

        return {
          id: it.guid?.['#text'] || it.guid || it.link || Math.random().toString(),
          title: String(it.title || '').trim(),
          description: rawDesc,
          url: it.link || '#',
          imageUrl,
          source: sourceName,
          publishedAt: formattedDate,
          category: defaultCategory,
        };
      });
    } catch {
      clearTimeout(timeout);
      return [];
    }
  }

  /**
   * Determine transfer status conservatively based on journalistic keywords
   */
  private determineTransferStatus(title: string, description: string): TransferStatus {
    const text = `${title} ${description}`.toLowerCase();

    // 1. Confirmado
    if (
      text.includes('assina') ||
      text.includes('assinado') ||
      text.includes('anunciado') ||
      text.includes('oficializado') ||
      text.includes('fechou contrato') ||
      text.includes('apresentado no') ||
      text.includes('é anunciado') ||
      text.includes('reforço confirmado') ||
      text.includes('rescisão confirmada')
    ) {
      return 'Confirmado';
    }

    // 2. Em negociação
    if (
      text.includes('negocia') ||
      text.includes('negociação avançada') ||
      text.includes('faz proposta') ||
      text.includes('envia oferta') ||
      text.includes('acerta detalhes') ||
      text.includes('próximo de fechar') ||
      text.includes('reunião define') ||
      text.includes('encaminha acerto')
    ) {
      return 'Em negociação';
    }

    // 3. Interesse reportado
    if (
      text.includes('tem interesse') ||
      text.includes('demonstra interesse') ||
      text.includes('abre conversas') ||
      text.includes('avalia contratação') ||
      text.includes('entra na briga')
    ) {
      return 'Interesse reportado';
    }

    // 4. Default: Rumor
    return 'Rumor';
  }

  /**
   * Get News Articles
   */
  async getNews(category = 'all', limit = 20): Promise<{
    articles: StandardNewsItem[];
    source: string;
    lastUpdated: string;
  }> {
    const cacheKey = `news:${category}:${limit}`;
    const cached = serverCache.get<StandardNewsItem[]>(cacheKey);

    if (cached && !cached.isStale) {
      return {
        articles: cached.data,
        source: 'Feeds Esportivos (Cache)',
        lastUpdated: cached.lastUpdated,
      };
    }

    const allArticles: StandardNewsItem[] = [];

    // Fetch from Brazilian sports RSS feeds
    const feedPromises = CONFIG.NEWS.RSS_FEEDS.map((f) =>
      this.fetchRssFeed(f.url, f.name, f.category)
    );

    const feedResults = await Promise.allSettled(feedPromises);
    feedResults.forEach((res) => {
      if (res.status === 'fulfilled') {
        allArticles.push(...res.value);
      }
    });

    // Deduplicate by URL or normalized Title
    const seen = new Set<string>();
    const deduplicated: StandardNewsItem[] = [];

    for (const item of allArticles) {
      const normTitle = item.title.toLowerCase().replace(/[^a-z0-9]/g, '');
      if (!seen.has(item.url) && !seen.has(normTitle) && item.title) {
        seen.add(item.url);
        seen.add(normTitle);
        deduplicated.push(item);
      }
    }

    // Filter by category if not 'all'
    let filtered = deduplicated;
    if (category !== 'all') {
      filtered = deduplicated.filter((a) => a.category === category);
    }

    const limited = filtered.slice(0, limit);
    serverCache.set(cacheKey, limited, CONFIG.NEWS.CACHE_TTL);

    return {
      articles: limited,
      source: 'Feeds Oficiais (ge.globo & UOL)',
      lastUpdated: new Date().toLocaleTimeString('pt-BR', { timeZone: CONFIG.TIMEZONE }),
    };
  }

  /**
   * Get Transfers (Mercado da Bola)
   */
  async getTransfers(statusFilter?: TransferStatus): Promise<{
    transfers: StandardTransferItem[];
    source: string;
    lastUpdated: string;
  }> {
    const cacheKey = `news:transfers:${statusFilter || 'all'}`;
    const cached = serverCache.get<StandardTransferItem[]>(cacheKey);

    if (cached && !cached.isStale) {
      return {
        transfers: cached.data,
        source: 'Mercado da Bola (Cache)',
        lastUpdated: cached.lastUpdated,
      };
    }

    // Fetch dedicated transfer feed
    const rawItems = await this.fetchRssFeed(
      'https://ge.globo.com/dynamo/futebol/mercado-da-bola/rss2.xml',
      'ge - Mercado da Bola',
      'transferencias'
    );

    // If dedicated feed empty, fallback to football feed looking for transfer keywords
    let itemsToProcess = rawItems;
    if (itemsToProcess.length === 0) {
      const general = await this.getNews('all', 30);
      itemsToProcess = general.articles.filter((a) => {
        const text = `${a.title} ${a.description}`.toLowerCase();
        return (
          text.includes('reforço') ||
          text.includes('contrat') ||
          text.includes('proposta') ||
          text.includes('técnico') ||
          text.includes('mercado') ||
          text.includes('acerto')
        );
      });
    }

    const transfers: StandardTransferItem[] = itemsToProcess.map((item) => {
      const status = this.determineTransferStatus(item.title, item.description);
      return {
        id: item.id,
        title: item.title,
        summary: item.description,
        url: item.url,
        imageUrl: item.imageUrl,
        source: item.source,
        publishedAt: item.publishedAt,
        status,
      };
    });

    const filtered = statusFilter
      ? transfers.filter((t) => t.status === statusFilter)
      : transfers;

    serverCache.set(cacheKey, filtered, CONFIG.NEWS.CACHE_TTL);

    return {
      transfers: filtered,
      source: 'ge - Mercado da Bola',
      lastUpdated: new Date().toLocaleTimeString('pt-BR', { timeZone: CONFIG.TIMEZONE }),
    };
  }
}

export const newsService = new NewsService();
