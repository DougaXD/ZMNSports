import React, { useState, useEffect } from 'react';
import { NewsItem } from '../types/sports';
import { api } from '../services/api';
import { NewsCard } from '../components/NewsCard';
import { Newspaper, RotateCcw, Search } from 'lucide-react';

export const NewsView: React.FC = () => {
  const [news, setNews] = useState<NewsItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [category, setCategory] = useState<string>('all');
  const [searchFilter, setSearchFilter] = useState<string>('');
  const [lastUpdated, setLastUpdated] = useState<string>('');
  const [source, setSource] = useState<string>('');

  const loadNews = async (cat: string) => {
    setLoading(true);
    try {
      const res = await api.getNews(cat, 30);
      setNews(res.articles || []);
      setLastUpdated(res.lastUpdated || '');
      setSource(res.source || '');
    } catch {
      setNews([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadNews(category);
  }, [category]);

  const categories = [
    { id: 'all', label: 'Todas as Notícias' },
    { id: 'geral', label: 'Futebol Brasileiro' },
    { id: 'transferencias', label: 'Mercado da Bola' },
  ];

  const filteredNews = news.filter((n) => {
    if (!searchFilter.trim()) return true;
    const q = searchFilter.toLowerCase().trim();
    return (
      n.title.toLowerCase().includes(q) ||
      n.description.toLowerCase().includes(q) ||
      n.source.toLowerCase().includes(q)
    );
  });

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Top Banner */}
      <div className="bg-white rounded-2xl border border-slate-200/90 shadow-xs p-5">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-100">
          <div>
            <h2 className="text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2" style={{ fontFamily: "'Freeman', sans-serif" }}>
              <Newspaper className="w-6 h-6 text-cyan-600" /> Notícias de Futebol
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Matérias recentes apuradas por fontes esportivas verificadas (ge, UOL Esporte).
            </p>
          </div>

          {/* Search in news */}
          <div className="relative w-full md:w-64">
            <input
              type="text"
              value={searchFilter}
              onChange={(e) => setSearchFilter(e.target.value)}
              placeholder="Filtrar matérias..."
              className="w-full text-xs py-2 pl-8 pr-3 border border-slate-200 rounded-lg bg-slate-50 focus:outline-none focus:ring-1 focus:ring-cyan-500 text-slate-800"
            />
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-3" />
            {searchFilter && (
              <button
                onClick={() => setSearchFilter('')}
                className="absolute right-2.5 top-2.5 text-xs text-slate-400 hover:text-slate-700"
              >
                ✕
              </button>
            )}
          </div>
        </div>

        {/* Category Tabs */}
        <div className="pt-3 flex items-center justify-between flex-wrap gap-2">
          <div className="flex items-center gap-1.5 flex-wrap">
            {categories.map((c) => (
              <button
                key={c.id}
                onClick={() => setCategory(c.id)}
                className={`text-xs font-bold px-3 py-1.5 rounded-lg transition-colors cursor-pointer ${
                  category === c.id
                    ? 'bg-[#007dfa] text-white shadow-xs'
                    : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                }`}
              >
                {c.label}
              </button>
            ))}
          </div>

          <div className="text-[11px] text-slate-500">
            Fonte: <strong>{source}</strong> {lastUpdated && `• Atualizado às ${lastUpdated}`}
          </div>
        </div>
      </div>

      {/* News Content */}
      {loading ? (
        <div className="bg-white p-12 rounded-2xl border border-slate-200 text-center text-slate-500 space-y-2">
          <RotateCcw className="w-8 h-8 text-cyan-600 animate-spin mx-auto" />
          <p className="text-sm font-semibold">Carregando notícias em tempo real...</p>
        </div>
      ) : filteredNews.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredNews.map((n, idx) => (
            <NewsCard key={n.id} news={n} featured={idx === 0 && !searchFilter} />
          ))}
        </div>
      ) : (
        <div className="bg-white p-10 rounded-2xl border border-slate-200 text-center text-slate-500 space-y-2">
          <Newspaper className="w-10 h-10 text-slate-300 mx-auto" />
          <h3 className="text-base font-bold text-slate-800">
            Nenhuma notícia encontrada
          </h3>
          <p className="text-xs text-slate-500">
            Tente alterar o filtro de categoria ou a busca por palavras-chave.
          </p>
        </div>
      )}
    </div>
  );
};
