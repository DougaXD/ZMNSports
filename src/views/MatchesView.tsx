import React, { useState, useEffect } from 'react';
import { Match, Competition } from '../types/sports';
import { api } from '../services/api';
import { MatchCard } from '../components/MatchCard';
import { Calendar, Search, RotateCcw } from 'lucide-react';

interface MatchesViewProps {
  competitions: Competition[];
  onSelectMatch: (match: Match) => void;
  footballConfigured: boolean;
}

export const MatchesView: React.FC<MatchesViewProps> = ({
  competitions,
  onSelectMatch,
  footballConfigured,
}) => {
  const getTodayStr = () => new Date().toLocaleDateString('en-CA', { timeZone: 'America/Sao_Paulo' });

  const [selectedDate, setSelectedDate] = useState<string>(getTodayStr());
  const [selectedCompetition, setSelectedCompetition] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<'all' | 'live' | 'upcoming' | 'finished'>('all');
  const [clubSearch, setClubSearch] = useState<string>('');

  const [matches, setMatches] = useState<Match[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [lastUpdated, setLastUpdated] = useState<string>('');
  const [source, setSource] = useState<string>('');

  const loadMatches = async (date: string, compId?: number) => {
    setLoading(true);
    try {
      const res = await api.getMatches(date, compId);
      setMatches(res.matches || []);
      setLastUpdated(res.lastUpdated || '');
      setSource(res.source || '');
    } catch {
      setMatches([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const compId = selectedCompetition !== 'all' ? parseInt(selectedCompetition, 10) : undefined;
    loadMatches(selectedDate, compId);
  }, [selectedDate, selectedCompetition]);

  // Quick date change helpers
  const shiftDate = (days: number) => {
    const [y, m, d] = selectedDate.split('-').map(Number);
    const date = new Date(y, m - 1, d);
    date.setDate(date.getDate() + days);
    const nextStr = date.toLocaleDateString('en-CA');
    setSelectedDate(nextStr);
  };

  // Filter matches
  const filteredMatches = matches.filter((m) => {
    // Status filter
    if (statusFilter === 'live' && !m.status.isLive) return false;
    if (statusFilter === 'upcoming' && !m.status.isUpcoming) return false;
    if (statusFilter === 'finished' && !m.status.isFinished) return false;

    // Club search
    if (clubSearch.trim()) {
      const q = clubSearch.toLowerCase().trim();
      const matchHome = m.homeTeam.name.toLowerCase().includes(q);
      const matchAway = m.awayTeam.name.toLowerCase().includes(q);
      if (!matchHome && !matchAway) return false;
    }

    return true;
  });

  // Group by competition
  const matchesByCompetition = filteredMatches.reduce((acc, m) => {
    const leagueName = m.league.name;
    if (!acc[leagueName]) {
      acc[leagueName] = {
        league: m.league,
        matches: [],
      };
    }
    acc[leagueName].matches.push(m);
    return acc;
  }, {} as Record<string, { league: any; matches: Match[] }>);

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Top Banner & Date Controls */}
      <div className="bg-white rounded-2xl border border-slate-200/90 shadow-xs p-4 sm:p-5">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-100">
          <div>
            <h2 className="text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2" style={{ fontFamily: "'Freeman', sans-serif" }}>
              <Calendar className="w-6 h-6 text-cyan-600" /> Calendário de Partidas
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Resultados, jogos em andamento e confrontos programados. {source && `• Fonte: ${source}`} {lastUpdated && `• Atualizado às ${lastUpdated}`}
            </p>
          </div>

          {/* Quick Date Switcher */}
          <div className="flex items-center gap-1.5 flex-wrap">
            <button
              onClick={() => shiftDate(-1)}
              className="text-xs font-bold px-3 py-1.5 rounded-lg border border-slate-200 hover:bg-slate-100 text-slate-700 transition-colors"
            >
              &larr; Ontem
            </button>
            <button
              onClick={() => setSelectedDate(getTodayStr())}
              className={`text-xs font-bold px-3 py-1.5 rounded-lg transition-colors ${
                selectedDate === getTodayStr()
                  ? 'bg-[#007dfa] text-white shadow-xs'
                  : 'border border-slate-200 hover:bg-slate-100 text-slate-700'
              }`}
            >
              Hoje
            </button>
            <button
              onClick={() => shiftDate(1)}
              className="text-xs font-bold px-3 py-1.5 rounded-lg border border-slate-200 hover:bg-slate-100 text-slate-700 transition-colors"
            >
              Amanhã &rarr;
            </button>
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="text-xs font-bold py-1 px-2 border border-cyan-300 rounded-lg bg-cyan-50/50 text-slate-800 focus:outline-none"
            />
          </div>
        </div>

        {/* Filters: Status, Competition, Search */}
        <div className="pt-4 grid grid-cols-1 sm:grid-cols-3 gap-3">
          {/* Status Tabs */}
          <div className="flex items-center gap-1 p-1 bg-slate-100 rounded-lg text-xs font-bold">
            <button
              onClick={() => setStatusFilter('all')}
              className={`flex-1 py-1 rounded-md transition-colors ${
                statusFilter === 'all' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Todos
            </button>
            <button
              onClick={() => setStatusFilter('live')}
              className={`flex-1 py-1 rounded-md transition-colors ${
                statusFilter === 'live' ? 'bg-red-600 text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Ao Vivo
            </button>
            <button
              onClick={() => setStatusFilter('upcoming')}
              className={`flex-1 py-1 rounded-md transition-colors ${
                statusFilter === 'upcoming' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Próximos
            </button>
            <button
              onClick={() => setStatusFilter('finished')}
              className={`flex-1 py-1 rounded-md transition-colors ${
                statusFilter === 'finished' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Encerrados
            </button>
          </div>

          {/* Competition select */}
          <div>
            <select
              value={selectedCompetition}
              onChange={(e) => setSelectedCompetition(e.target.value)}
              className="w-full text-xs font-semibold py-2 px-3 border border-slate-200 rounded-lg bg-slate-50 focus:outline-none focus:ring-1 focus:ring-cyan-500 text-slate-800"
            >
              <option value="all">Todas as Competições</option>
              {competitions.map((comp) => (
                <option key={comp.id} value={comp.id}>
                  {comp.name} ({comp.country})
                </option>
              ))}
            </select>
          </div>

          {/* Club search */}
          <div className="relative">
            <input
              type="text"
              value={clubSearch}
              onChange={(e) => setClubSearch(e.target.value)}
              placeholder="Buscar por clube (ex: Palmeiras)..."
              className="w-full text-xs py-2 pl-8 pr-3 border border-slate-200 rounded-lg bg-slate-50 focus:outline-none focus:ring-1 focus:ring-cyan-500 text-slate-800"
            />
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-3" />
            {clubSearch && (
              <button
                onClick={() => setClubSearch('')}
                className="absolute right-2.5 top-2.5 text-xs text-slate-400 hover:text-slate-700"
              >
                ✕
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Matches Content */}
      {loading ? (
        <div className="bg-white p-12 rounded-2xl border border-slate-200 text-center text-slate-500 space-y-2">
          <RotateCcw className="w-8 h-8 text-cyan-600 animate-spin mx-auto" />
          <p className="text-sm font-semibold">Consultando partidas na data selecionada...</p>
        </div>
      ) : Object.keys(matchesByCompetition).length > 0 ? (
        <div className="space-y-6">
          {Object.entries(matchesByCompetition).map(([leagueName, group]) => (
            <div key={leagueName} className="bg-white rounded-2xl border border-slate-200/90 shadow-xs p-4 sm:p-5">
              <div className="flex items-center gap-2 pb-3 mb-4 border-b border-slate-100">
                {group.league.logo && (
                  <img src={group.league.logo} alt="" className="w-5 h-5 object-contain" />
                )}
                <h3 className="font-extrabold text-slate-900 text-base sm:text-lg">
                  {leagueName}
                </h3>
                <span className="text-xs text-slate-500 bg-slate-100 px-2 py-0.5 rounded-full font-medium ml-auto">
                  {group.matches.length} {group.matches.length === 1 ? 'partida' : 'partidas'}
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {group.matches.map((match) => (
                  <MatchCard key={match.id} match={match} onSelect={onSelectMatch} />
                ))}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-white p-10 rounded-2xl border border-slate-200 text-center text-slate-500 space-y-3">
          <Calendar className="w-12 h-12 text-slate-300 mx-auto" />
          <h3 className="text-base font-bold text-slate-800">
            Nenhuma partida encontrada
          </h3>
          <p className="text-xs text-slate-500 max-w-md mx-auto">
            {footballConfigured
              ? 'Não encontramos partidas com os filtros aplicados para a data selecionada.'
              : 'A chave FOOTBALL_API_KEY não foi configurada. Conecte sua chave no ambiente para visualizar a grade completa de jogos da API-Football.'}
          </p>
          <button
            onClick={() => {
              setSelectedDate(getTodayStr());
              setSelectedCompetition('all');
              setStatusFilter('all');
              setClubSearch('');
            }}
            className="text-xs font-bold text-[#007dfa] hover:underline"
          >
            Limpar todos os filtros
          </button>
        </div>
      )}
    </div>
  );
};
