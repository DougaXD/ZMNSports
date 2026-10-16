import React from 'react';
import { Match, Competition, StandingTeamData, NewsItem, TransferItem, ActiveSection } from '../types/sports';
import { MatchCard } from '../components/MatchCard';
import { StandingsTable } from '../components/StandingsTable';
import { NewsCard } from '../components/NewsCard';
import { TransferCard } from '../components/TransferCard';
import { Radio, ChevronRight, Newspaper, ArrowRightLeft, Trophy, Calendar, AlertCircle } from 'lucide-react';

interface HomeViewProps {
  liveMatches: Match[];
  todayMatches: Match[];
  featuredCompetitions: Competition[];
  currentCompetition: Competition;
  currentStandings: StandingTeamData[];
  latestNews: NewsItem[];
  latestTransfers: TransferItem[];
  onSelectMatch: (match: Match) => void;
  onNavigate: (section: ActiveSection, meta?: any) => void;
  onSelectCompetition: (comp: Competition) => void;
  footballConfigured: boolean;
  lastUpdated?: string;
  sourceLabel?: string;
}

export const HomeView: React.FC<HomeViewProps> = ({
  liveMatches,
  todayMatches,
  featuredCompetitions,
  currentCompetition,
  currentStandings,
  latestNews,
  latestTransfers,
  onSelectMatch,
  onNavigate,
  onSelectCompetition,
  footballConfigured,
  lastUpdated,
  sourceLabel,
}) => {
  return (
    <div className="space-y-8 animate-fade-in">
      {/* 1. SEÇÃO AO VIVO (Dedicated Live Scores) */}
      <section className="bg-white rounded-2xl border border-slate-200/90 shadow-xs p-4 sm:p-5">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
          <div className="flex items-center gap-2">
            <span className="relative flex h-3 w-3">
              <span className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${liveMatches.length > 0 ? 'bg-red-400' : 'bg-emerald-400'}`}></span>
              <span className={`relative inline-flex rounded-full h-3 w-3 ${liveMatches.length > 0 ? 'bg-red-500' : 'bg-emerald-500'}`}></span>
            </span>
            <h2 className="text-lg sm:text-xl font-black text-slate-900 tracking-tight" style={{ fontFamily: "'Freeman', sans-serif" }}>
              {liveMatches.length > 0 ? `Partidas Ao Vivo (${liveMatches.length})` : 'Placar Ao Vivo'}
            </h2>
          </div>

          <button
            onClick={() => onNavigate('jogos')}
            className="text-xs font-bold text-[#0066cc] hover:underline flex items-center gap-0.5"
          >
            Ver todos os jogos <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {liveMatches.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {liveMatches.map((m) => (
              <MatchCard key={m.id} match={m} onSelect={onSelectMatch} />
            ))}
          </div>
        ) : (
          <div className="p-6 text-center rounded-xl bg-slate-50 border border-slate-100 flex flex-col items-center justify-center">
            <Radio className="w-8 h-8 text-slate-400 mb-2 stroke-1" />
            <p className="text-sm font-semibold text-slate-700">
              Nenhuma partida em andamento neste momento.
            </p>
            <p className="text-xs text-slate-500 mt-1">
              Consulte a programação do dia para conferir os próximos confrontos e horários.
            </p>
          </div>
        )}
      </section>

      {/* 2. JOGOS DO DIA (Today's Matches) */}
      <section className="bg-white rounded-2xl border border-slate-200/90 shadow-xs p-4 sm:p-5">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
          <div className="flex items-center gap-2">
            <Calendar className="w-5 h-5 text-cyan-600" />
            <h2 className="text-lg sm:text-xl font-black text-slate-900 tracking-tight" style={{ fontFamily: "'Freeman', sans-serif" }}>
              Jogos de Hoje
            </h2>
          </div>

          <button
            onClick={() => onNavigate('jogos')}
            className="text-xs font-bold text-[#0066cc] hover:underline flex items-center gap-0.5"
          >
            Calendário completo <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {todayMatches.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {todayMatches.slice(0, 6).map((m) => (
              <MatchCard key={m.id} match={m} onSelect={onSelectMatch} />
            ))}
          </div>
        ) : (
          <div className="p-6 text-center rounded-xl bg-slate-50 border border-slate-100 text-xs sm:text-sm text-slate-500">
            {footballConfigured ? (
              'Não há partidas registradas na API para a data de hoje nas principais ligas.'
            ) : (
              <div className="max-w-md mx-auto text-center space-y-2">
                <AlertCircle className="w-8 h-8 text-amber-500 mx-auto" />
                <p className="font-semibold text-slate-800">
                  Integração da API-Football aguardando chave no servidor.
                </p>
                <p className="text-xs text-slate-500">
                  Para visualizar os jogos do dia em tempo real da API-Sports, defina <code>FOOTBALL_API_KEY</code> no ambiente.
                </p>
              </div>
            )}
          </div>
        )}
      </section>

      {/* 3. CLASSIFICAÇÃO EM DESTAQUE (Standings Switcher) */}
      <section className="space-y-3">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
          <div>
            <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2" style={{ fontFamily: "'Freeman', sans-serif" }}>
              <Trophy className="w-6 h-6 text-cyan-600" /> Classificação
            </h2>
            <p className="text-xs text-slate-600">
              Acompanhe a tabela e zonas de classificação das principais competições.
            </p>
          </div>

          {/* Quick tournament switcher */}
          <div className="flex items-center gap-1.5 flex-wrap">
            {featuredCompetitions.slice(0, 4).map((comp) => (
              <button
                key={comp.id}
                onClick={() => onSelectCompetition(comp)}
                className={`text-xs font-bold px-2.5 py-1 rounded-lg transition-colors cursor-pointer ${
                  currentCompetition.id === comp.id
                    ? 'bg-[#007dfa] text-white shadow-xs'
                    : 'bg-white hover:bg-cyan-50 text-slate-700 border border-cyan-200'
                }`}
              >
                {comp.shortName}
              </button>
            ))}
            <button
              onClick={() => onNavigate('classificacoes')}
              className="text-xs font-bold text-[#0066cc] hover:underline px-2"
            >
              Ver todas &rarr;
            </button>
          </div>
        </div>

        {/* Modular Table */}
        {currentStandings && currentStandings.length > 0 ? (
          <StandingsTable
            competition={currentCompetition}
            standings={currentStandings}
            lastUpdated={lastUpdated}
            source={sourceLabel}
            compact={false}
          />
        ) : (
          <div className="bg-white p-8 rounded-xl border border-cyan-200 text-center">
            <Trophy className="w-10 h-10 text-cyan-500 mx-auto mb-2 opacity-50" />
            <p className="text-sm font-bold text-slate-800">
              Tabela de {currentCompetition.name}
            </p>
            <p className="text-xs text-slate-500 mt-1 max-w-md mx-auto">
              {footballConfigured
                ? 'Carregando dados oficiais da tabela junto à API-Sports...'
                : 'A chave FOOTBALL_API_KEY não foi configurada. Para carregar a tabela oficial da API-Sports, insira sua chave nas variáveis de ambiente.'}
            </p>
          </div>
        )}
      </section>

      {/* 4. ÚLTIMAS NOTÍCIAS & MERCADO DA BOLA (Two columns layout) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Real News Feed */}
        <section className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between pb-2 border-b-2 border-cyan-300">
            <div className="flex items-center gap-2">
              <Newspaper className="w-5 h-5 text-cyan-600" />
              <h2 className="text-xl font-bold text-slate-900" style={{ fontFamily: "'Freeman', sans-serif" }}>
                Últimas Notícias
              </h2>
            </div>
            <button
              onClick={() => onNavigate('noticias')}
              className="text-xs font-bold text-[#0066cc] hover:underline flex items-center gap-0.5"
            >
              Ver todas as notícias <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {latestNews.slice(0, 4).map((n, idx) => (
              <NewsCard key={n.id} news={n} featured={idx === 0} />
            ))}
          </div>
        </section>

        {/* Right 1 Col: Mercado da Bola Radar */}
        <section className="space-y-4">
          <div className="flex items-center justify-between pb-2 border-b-2 border-amber-300">
            <div className="flex items-center gap-2">
              <ArrowRightLeft className="w-5 h-5 text-amber-600" />
              <h2 className="text-xl font-bold text-slate-900" style={{ fontFamily: "'Freeman', sans-serif" }}>
                Mercado da Bola
              </h2>
            </div>
            <button
              onClick={() => onNavigate('transferencias')}
              className="text-xs font-bold text-[#0066cc] hover:underline flex items-center gap-0.5"
            >
              Radar completo <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="space-y-3">
            {latestTransfers.slice(0, 3).map((t) => (
              <TransferCard key={t.id} transfer={t} />
            ))}
          </div>
        </section>
      </div>
    </div>
  );
};
