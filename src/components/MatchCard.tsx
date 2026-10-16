import React from 'react';
import { Match } from '../types/sports';

interface MatchCardProps {
  match: Match;
  onSelect: (match: Match) => void;
  compact?: boolean;
}

export const MatchCard: React.FC<MatchCardProps> = ({ match, onSelect, compact = false }) => {
  const isLive = match.status.isLive;
  const isFinished = match.status.isFinished;

  return (
    <div
      onClick={() => onSelect(match)}
      className={`bg-white rounded-xl border border-slate-200 shadow-xs hover:shadow-md transition-all cursor-pointer p-3 flex flex-col justify-between group ${
        isLive ? 'border-red-400 ring-1 ring-red-400/50 bg-red-50/10' : ''
      }`}
    >
      {/* Header: Competition & Status */}
      <div className="flex items-center justify-between text-[11px] text-slate-500 pb-2 border-b border-slate-100">
        <div className="flex items-center gap-1.5 truncate max-w-[65%]">
          {match.league.logo && (
            <img src={match.league.logo} alt="" className="w-3.5 h-3.5 object-contain shrink-0" />
          )}
          <span className="font-semibold text-slate-700 truncate">{match.league.name}</span>
        </div>

        {isLive ? (
          <span className="flex items-center gap-1 bg-red-600 text-white text-[10px] font-black px-1.5 py-0.5 rounded-full animate-pulse">
            <span className="w-1.5 h-1.5 rounded-full bg-white animate-ping" />
            AO VIVO {match.status.elapsed ? `${match.status.elapsed}'` : ''}
          </span>
        ) : isFinished ? (
          <span className="text-slate-600 font-bold bg-slate-100 px-1.5 py-0.5 rounded text-[10px]">
            ENCERRADO
          </span>
        ) : (
          <span className="text-[#0066cc] font-bold bg-cyan-50 px-1.5 py-0.5 rounded text-[10px]">
            {match.time}
          </span>
        )}
      </div>

      {/* Teams & Score */}
      <div className={`py-2.5 space-y-2 ${compact ? 'py-1.5' : ''}`}>
        {/* Home Team */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 truncate pr-2">
            <img
              src={match.homeTeam.logo}
              alt={match.homeTeam.name}
              className="w-5 h-5 object-contain shrink-0"
              onError={(e) => {
                (e.target as HTMLImageElement).src = '/imagens/escudos-mini/mini-escudo-saopaulo.png';
              }}
            />
            <span className={`text-xs sm:text-sm truncate ${match.homeTeam.winner ? 'font-bold text-slate-900' : 'text-slate-800'}`}>
              {match.homeTeam.name}
            </span>
          </div>
          <span className="text-sm sm:text-base font-extrabold text-slate-900 w-6 text-right">
            {match.goals.home !== null ? match.goals.home : '-'}
          </span>
        </div>

        {/* Away Team */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 truncate pr-2">
            <img
              src={match.awayTeam.logo}
              alt={match.awayTeam.name}
              className="w-5 h-5 object-contain shrink-0"
              onError={(e) => {
                (e.target as HTMLImageElement).src = '/imagens/escudos-mini/mini-escudo-flamengo.png';
              }}
            />
            <span className={`text-xs sm:text-sm truncate ${match.awayTeam.winner ? 'font-bold text-slate-900' : 'text-slate-800'}`}>
              {match.awayTeam.name}
            </span>
          </div>
          <span className="text-sm sm:text-base font-extrabold text-slate-900 w-6 text-right">
            {match.goals.away !== null ? match.goals.away : '-'}
          </span>
        </div>
      </div>

      {/* Footer: Detail link */}
      <div className="pt-2 border-t border-slate-100 flex justify-between items-center text-[11px] text-slate-400 group-hover:text-[#007dfa]">
        <span>{match.date}</span>
        <span className="font-semibold text-[#0066cc] group-hover:underline">
          Ver detalhes &rarr;
        </span>
      </div>
    </div>
  );
};
