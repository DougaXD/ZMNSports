interface CacheItem<T> {
  data: T;
  timestamp: number;
  expiresAt: number;
}

class SimpleCache {
  private store = new Map<string, CacheItem<unknown>>();
  private hits = 0;
  private misses = 0;

  get<T>(key: string): { data: T; isStale: boolean; lastUpdated: string } | null {
    const item = this.store.get(key) as CacheItem<T> | undefined;
    if (!item) {
      this.misses++;
      return null;
    }

    const now = Date.now();
    const isStale = now > item.expiresAt;
    this.hits++;

    return {
      data: item.data,
      isStale,
      lastUpdated: new Date(item.timestamp).toLocaleTimeString('pt-BR', {
        timeZone: 'America/Sao_Paulo',
        hour: '2-digit',
        minute: '2-digit',
      }),
    };
  }

  set<T>(key: string, data: T, ttlMs: number): void {
    const now = Date.now();
    this.store.set(key, {
      data,
      timestamp: now,
      expiresAt: now + ttlMs,
    });
  }

  delete(key: string): void {
    this.store.delete(key);
  }

  clear(): void {
    this.store.clear();
  }

  getStats() {
    return {
      size: this.store.size,
      hits: this.hits,
      misses: this.misses,
    };
  }
}

export const serverCache = new SimpleCache();
