import React, { useState, useEffect, useRef } from 'react';
import { ActiveSection, GlobalSearchResult } from '../types/sports';
import { api } from '../services/api';
import { Search, Menu, X, Trophy, Newspaper, ArrowRightLeft, Calendar, Info } from 'lucide-react';

interface HeaderProps {
  activeSection: ActiveSection;
  onNavigate: (section: ActiveSection, meta?: any) => void;
  liveCount: number;
}

interface NavItem {
  id: ActiveSection;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  badge?: string;
}

export const Header: React.FC<HeaderProps> = ({
  activeSection,
  onNavigate,
  liveCount,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<GlobalSearchResult | null>(null);
  const [isSearching, setIsSearching] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);

  // Debounced search
  useEffect(() => {
    if (!searchQuery.trim() || searchQuery.trim().length < 2) {
      setSearchResults(null);
      setIsSearching(false);
      return;
    }

    setIsSearching(true);
    const timeout = setTimeout(async () => {
      try {
        const results = await api.search(searchQuery.trim());
        setSearchResults(results);
      } catch {
        setSearchResults(null);
      } finally {
        setIsSearching(false);
      }
    }, 300);

    return () => clearTimeout(timeout);
  }, [searchQuery]);

  // Click outside to close search dropdown
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (searchRef.current && !searchRef.current.contains(e.target as Node)) {
        setSearchOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const navItems: NavItem[] = [
    { id: 'inicio', label: 'Início', icon: Trophy },
    { id: 'jogos', label: 'Jogos', icon: Calendar, badge: liveCount > 0 ? `${liveCount} AO VIVO` : undefined },
    { id: 'competicoes', label: 'Competições', icon: Trophy },
    { id: 'classificacoes', label: 'Classificações', icon: Trophy },
    { id: 'noticias', label: 'Notícias', icon: Newspaper },
    { id: 'transferencias', label: 'Transferências', icon: ArrowRightLeft },
    { id: 'sobre', label: 'Sobre Nós', icon: Info },
  ];

  return (
    <header className="w-full text-center select-none shadow-md" style={{ background: 'linear-gradient(180deg, #0066cc 0%, #0099ff 50%, #00d2ff 100%)' }}>
      {/* Top Banner with Brand and Global Search */}
      <div className="max-w-6xl mx-auto px-4 pt-3 pb-2 flex flex-col md:flex-row items-center justify-between gap-3">
        {/* Brand */}
        <div 
          onClick={() => onNavigate('inicio')}
          className="cursor-pointer group flex flex-col items-center md:items-start transition-transform active:scale-98"
        >
          <div className="flex items-center gap-2">
            <h1 
              className="text-3xl md:text-4xl font-extrabold tracking-tight text-white drop-shadow-md"
              style={{ 
                fontFamily: "'Freeman', cursive, sans-serif",
                textShadow: '0px 3px 6px rgba(0, 30, 80, 0.8)' 
              }}
            >
              ZMN Sports™
            </h1>
            {liveCount > 0 && (
              <span className="flex items-center gap-1 bg-red-600 text-white text-[11px] font-bold px-2 py-0.5 rounded-full shadow-sm animate-pulse">
                <span className="w-2 h-2 rounded-full bg-white animate-ping" />
                {liveCount} AO VIVO
              </span>
            )}
          </div>
          <p 
            className="text-xs md:text-sm text-cyan-50 font-medium tracking-wide mt-0.5"
            style={{ textShadow: '1px 1px 2px rgba(0, 20, 60, 0.7)' }}
          >
            Tudo sobre o mundo do futebol você encontra aqui!
          </p>
        </div>

        {/* Search Bar with Debounce & Dropdown */}
        <div ref={searchRef} className="relative w-full md:w-80">
          <div className="relative flex items-center">
            <input
              type="text"
              value={searchQuery}
              onFocus={() => setSearchOpen(true)}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setSearchOpen(true);
              }}
              placeholder="Pesquisar clubes, campeonatos, notícias..."
              className="w-full pl-9 pr-8 py-1.5 text-xs sm:text-sm rounded-full bg-white/95 text-slate-800 placeholder-slate-500 shadow-inner focus:outline-none focus:ring-2 focus:ring-cyan-300 focus:bg-white transition-all"
            />
            <Search className="absolute left-3 w-4 h-4 text-cyan-700 pointer-events-none" />
            {searchQuery && (
              <button
                onClick={() => {
                  setSearchQuery('');
                  setSearchResults(null);
                }}
                className="absolute right-3 text-slate-400 hover:text-slate-700 text-xs font-bold"
              >
                ✕
              </button>
            )}
          </div>

          {/* Search Dropdown Results */}
          {searchOpen && searchQuery.trim().length >= 2 && (
            <div className="absolute left-0 right-0 top-10 mt-1 bg-white rounded-xl shadow-2xl border border-cyan-100 z-50 max-h-96 overflow-y-auto text-left p-3 animate-fade-in">
              {isSearching ? (
                <div className="py-4 text-center text-xs text-slate-500">
                  Pesquisando no ZMN Sports...
                </div>
              ) : searchResults && (searchResults.competitions.length > 0 || searchResults.news.length > 0 || searchResults.clubs.length > 0) ? (
                <div className="space-y-3">
                  {/* Competitions */}
                  {searchResults.competitions.length > 0 && (
                    <div>
                      <h4 className="text-[11px] font-bold text-cyan-800 uppercase tracking-wider mb-1 flex items-center gap-1">
                        <Trophy className="w-3 h-3" /> Competições
                      </h4>
                      <div className="space-y-1">
                        {searchResults.competitions.map((comp) => (
                          <div
                            key={comp.id}
                            onClick={() => {
                              onNavigate('competicoes', { competitionId: comp.id });
                              setSearchOpen(false);
                            }}
                            className="p-1.5 hover:bg-cyan-50 rounded-lg cursor-pointer text-xs font-semibold text-slate-800 flex items-center justify-between transition-colors"
                          >
                            <span>{comp.name}</span>
                            <span className="text-[10px] text-cyan-600 bg-cyan-100/60 px-1.5 py-0.5 rounded">
                              {comp.country}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Clubs */}
                  {searchResults.clubs.length > 0 && (
                    <div>
                      <h4 className="text-[11px] font-bold text-cyan-800 uppercase tracking-wider mb-1">
                        Clubes
                      </h4>
                      <div className="flex flex-wrap gap-1">
                        {searchResults.clubs.map((c) => (
                          <button
                            key={c.name}
                            onClick={() => {
                              onNavigate('classificacoes', { clubName: c.name });
                              setSearchOpen(false);
                            }}
                            className="text-xs bg-slate-100 hover:bg-cyan-100 text-slate-800 px-2 py-1 rounded-md transition-colors"
                          >
                            {c.name} ({c.short})
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* News */}
                  {searchResults.news.length > 0 && (
                    <div>
                      <h4 className="text-[11px] font-bold text-cyan-800 uppercase tracking-wider mb-1 flex items-center gap-1">
                        <Newspaper className="w-3 h-3" /> Notícias Relacionadas
                      </h4>
                      <div className="space-y-1.5">
                        {searchResults.news.slice(0, 3).map((n) => (
                          <div
                            key={n.id}
                            onClick={() => {
                              onNavigate('noticias', { articleId: n.id });
                              setSearchOpen(false);
                            }}
                            className="p-1.5 hover:bg-cyan-50 rounded-lg cursor-pointer text-xs text-slate-700 transition-colors"
                          >
                            <p className="font-semibold text-slate-900 line-clamp-1">{n.title}</p>
                            <span className="text-[10px] text-slate-400">{n.source} • {n.publishedAt}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <div className="py-4 text-center text-xs text-slate-500">
                  Nenhum resultado encontrado para "{searchQuery}".
                </div>
              )}
            </div>
          )}
        </div>

        {/* Mobile menu trigger */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="md:hidden self-end -mt-8 text-white p-1 hover:bg-white/10 rounded-lg"
          aria-label="Abrir Menu"
        >
          {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Navigation Bar */}
      <nav 
        className="py-1 px-2 border-t border-cyan-400/40 shadow-inner"
        style={{ backgroundColor: 'rgb(0, 140, 240)' }}
      >
        <div className="max-w-6xl mx-auto flex justify-center items-center gap-1 sm:gap-2 flex-wrap">
          {navItems.map((item) => {
            const isActive = activeSection === item.id;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => {
                  onNavigate(item.id as ActiveSection);
                  setMobileMenuOpen(false);
                }}
                className={`relative cursor-pointer font-bold px-3 py-1.5 text-xs sm:text-sm rounded-lg transition-all duration-200 flex items-center gap-1.5 ${
                  isActive
                    ? 'bg-white text-[#0066cc] shadow-md scale-102'
                    : 'text-white hover:bg-cyan-400/30 hover:text-white'
                }`}
                style={{
                  fontFamily: "'Freeman', sans-serif",
                  textShadow: isActive ? 'none' : '0px 1px 2px rgba(0, 20, 60, 0.6)',
                }}
              >
                <span>{item.label}</span>
                {item.badge && (
                  <span className="bg-red-500 text-white text-[9px] font-black px-1.5 py-0.2 rounded-full uppercase tracking-tighter">
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </nav>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-slate-900/95 text-white p-4 space-y-2 border-t border-cyan-400/30 text-left animate-fade-in">
          {navItems.map((item) => {
            const isActive = activeSection === item.id;
            return (
              <button
                key={item.id}
                onClick={() => {
                  onNavigate(item.id as ActiveSection);
                  setMobileMenuOpen(false);
                }}
                className={`w-full flex items-center justify-between p-2.5 rounded-lg text-sm font-bold ${
                  isActive ? 'bg-[#007dfa] text-white' : 'text-slate-200 hover:bg-slate-800'
                }`}
              >
                <span>{item.label}</span>
                {item.badge && (
                  <span className="bg-red-500 text-white text-[10px] px-2 py-0.5 rounded-full font-black">
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      )}
    </header>
  );
};
