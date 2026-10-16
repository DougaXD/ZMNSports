import React, { useState, useEffect } from 'react';
import { Match } from '../types/sports';
import { api } from '../services/api';

interface MatchDetailModalProps {
  match: Match | null;
  onClose: () => void;
}

export const MatchDetailModal: React.FC<MatchDetailModalProps> = ({ match, onClose }) => {
  const [activeTab, setActiveTab] = useState<'info' | 'events' | 'lineups' | 'stats'>('info');
  const [details, setDetails] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!match) {
      setDetails(null);
      return;
    }

    setLoading(true);
    api.getMatchDetail(match.id)
      .then((res) => {
        setDetails(res);
      })
      .catch(() => {
        setDetails(null);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [match]);

  if (!match) return null;

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-xs animate-fade-in"
      onClick={onClose}
    >
      <div 
        className="bg-white rounded-2xl shadow-2xl max-w-xl w-full max-h-[90vh] overflow-y-auto border-2 border-cyan-400 flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div 
          className="p-5 text-white flex flex-col items-center relative"
          style={{ background: 'linear-gradient(135deg, #0055b3 0%, #0088ff 100%)' }}
        >
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-white/80 hover:text-white bg-black/20 hover:bg-black/40 w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm"
          >
            ✕
          </button>

          <span className="text-xs text-cyan-200 font-semibold uppercase tracking-wider mb-2">
            {match.league.name} • {match.league.round || 'Rodada'}
          </span>

          <div className="flex items-center justify-between w-full max-w-md my-2 px-4">
            {/* Home */}
            <div className="flex flex-col items-center text-center flex-1">
              <img
                src={match.homeTeam.logo}
                alt={match.homeTeam.name}
                className="w-14 h-14 object-contain mb-2 drop-shadow-md"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = '/imagens/escudos-mini/mini-escudo-saopaulo.png';
                }}
              />
              <span className="font-bold text-sm sm:text-base leading-tight">
                {match.homeTeam.name}
              </span>
            </div>

            {/* Score / Time */}
            <div className="flex flex-col items-center px-4">
              {match.status.isUpcoming ? (
                <div className="text-center">
                  <span className="text-2xl font-black">{match.time}</span>
                  <span className="block text-[11px] text-cyan-200 mt-1">{match.date}</span>
                </div>
              ) : (
                <div className="text-center">
                  <div className="text-3xl sm:text-4xl font-black tracking-tight">
                    {match.goals.home ?? 0} x {match.goals.away ?? 0}
                  </div>
                  {match.status.isLive && (
                    <span className="inline-block mt-1 bg-red-600 text-white text-[10px] font-black px-2 py-0.5 rounded-full animate-pulse">
                      AO VIVO {match.status.elapsed ? `${match.status.elapsed}'` : ''}
                    </span>
                  )}
                  {match.status.isFinished && (
                    <span className="inline-block mt-1 text-[11px] bg-white/20 text-white px-2 py-0.5 rounded font-bold">
                      Encerrado
                    </span>
                  )}
                </div>
              )}
            </div>

            {/* Away */}
            <div className="flex flex-col items-center text-center flex-1">
              <img
                src={match.awayTeam.logo}
                alt={match.awayTeam.name}
                className="w-14 h-14 object-contain mb-2 drop-shadow-md"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = '/imagens/escudos-mini/mini-escudo-flamengo.png';
                }}
              />
              <span className="font-bold text-sm sm:text-base leading-tight">
                {match.awayTeam.name}
              </span>
            </div>
          </div>

          {/* Subscore details */}
          {match.score.halftime.home !== null && (
            <span className="text-[11px] text-cyan-100 mt-1">
              Intervalo: {match.score.halftime.home} x {match.score.halftime.away}
            </span>
          )}
        </div>

        {/* Tab navigation */}
        <div className="flex border-b border-slate-200 bg-slate-50 text-xs font-bold text-slate-600">
          <button
            onClick={() => setActiveTab('info')}
            className={`flex-1 py-2.5 text-center transition-colors border-b-2 ${
              activeTab === 'info' ? 'border-[#007dfa] text-[#007dfa] bg-white' : 'border-transparent hover:text-slate-900'
            }`}
          >
            Informações
          </button>
          <button
            onClick={() => setActiveTab('events')}
            className={`flex-1 py-2.5 text-center transition-colors border-b-2 ${
              activeTab === 'events' ? 'border-[#007dfa] text-[#007dfa] bg-white' : 'border-transparent hover:text-slate-900'
            }`}
          >
            Lances
          </button>
          <button
            onClick={() => setActiveTab('lineups')}
            className={`flex-1 py-2.5 text-center transition-colors border-b-2 ${
              activeTab === 'lineups' ? 'border-[#007dfa] text-[#007dfa] bg-white' : 'border-transparent hover:text-slate-900'
            }`}
          >
            Escalações
          </button>
          <button
            onClick={() => setActiveTab('stats')}
            className={`flex-1 py-2.5 text-center transition-colors border-b-2 ${
              activeTab === 'stats' ? 'border-[#007dfa] text-[#007dfa] bg-white' : 'border-transparent hover:text-slate-900'
            }`}
          >
            Estatísticas
          </button>
        </div>

        {/* Tab Content */}
        <div className="p-5 flex-1 text-slate-700 text-xs sm:text-sm">
          {loading ? (
            <div className="py-12 text-center text-slate-400">
              Carregando dados detalhados da partida...
            </div>
          ) : activeTab === 'info' ? (
            <div className="space-y-3">
              <div className="p-3 rounded-lg bg-cyan-50/50 border border-cyan-100">
                <h4 className="font-bold text-slate-900 mb-1">Dados do Confronto:</h4>
                <ul className="space-y-1 text-slate-600">
                  <li><strong>Competição:</strong> {match.league.name} ({match.league.country})</li>
                  <li><strong>Data:</strong> {match.date} às {match.time}</li>
                  <li><strong>Status Oficial:</strong> {match.status.long} ({match.status.short})</li>
                  <li><strong>Temporada:</strong> {match.league.season}</li>
                </ul>
              </div>

              {!details?.configured && (
                <div className="p-3 rounded-lg bg-amber-50 border border-amber-200 text-amber-800 text-xs">
                  <strong>Nota:</strong> Estatísticas aprofundadas em tempo real (mapa de calor, posse, chutes no alvo) são alimentadas pela API-Sports via FOOTBALL_API_KEY.
                </div>
              )}
            </div>
          ) : activeTab === 'events' ? (
            <div>
              {details?.events && details.events.length > 0 ? (
                <div className="space-y-2">
                  {details.events.map((ev: any, idx: number) => (
                    <div key={idx} className="flex items-center gap-2 p-2 rounded bg-slate-50 border border-slate-100">
                      <span className="font-bold text-cyan-700">{ev.time.elapsed}'</span>
                      <span className="font-semibold text-slate-900">{ev.player?.name}</span>
                      <span className="text-slate-500 text-xs">({ev.detail || ev.type})</span>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="py-8 text-center text-slate-400">
                  Nenhum evento registrado ainda para esta partida.
                </div>
              )}
            </div>
          ) : activeTab === 'lineups' ? (
            <div>
              {details?.lineups && details.lineups.length > 0 ? (
                <div className="grid grid-cols-2 gap-4">
                  {details.lineups.map((lineup: any, idx: number) => (
                    <div key={idx} className="p-3 bg-slate-50 rounded-lg border border-slate-200">
                      <h4 className="font-bold text-slate-900 mb-1">{lineup.team?.name}</h4>
                      <p className="text-xs text-slate-500 mb-2">Formação: {lineup.formation || 'Não informada'}</p>
                      <ul className="space-y-1">
                        {lineup.startXI?.slice(0, 11).map((p: any, pIdx: number) => (
                          <li key={pIdx} className="text-xs truncate">
                            {p.player?.number ? `${p.player.number}. ` : ''}{p.player?.name}
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="py-8 text-center text-slate-400">
                  Escalações ainda não foram divulgadas oficialmente.
                </div>
              )}
            </div>
          ) : (
            <div>
              {details?.statistics && details.statistics.length > 0 ? (
                <div className="space-y-2">
                  {details.statistics[0]?.statistics?.map((stat: any, sIdx: number) => (
                    <div key={sIdx} className="flex justify-between py-1 border-b border-slate-100 text-xs">
                      <span className="font-semibold text-slate-800">{stat.type}</span>
                      <span className="text-slate-600">{stat.value ?? 0}</span>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="py-8 text-center text-slate-400">
                  Estatísticas detalhadas indisponíveis para esta partida.
                </div>
              )}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-200 bg-slate-50 flex justify-end">
          <button
            onClick={onClose}
            className="bg-[#007dfa] hover:bg-[#0066cc] text-white font-bold py-1.5 px-5 rounded-lg text-xs"
          >
            Fechar
          </button>
        </div>
      </div>
    </div>
  );
};
