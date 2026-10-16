import React from 'react';
import { Club } from '../types';
import { ZONE_COLORS, ZONE_LABELS } from '../data/tableData';

interface ClubDetailModalProps {
  club: Club | null;
  onClose: () => void;
  onUpdateStats?: (clubId: number, v: number, e: number, d: number, gm: number, gc: number) => void;
}

export const ClubDetailModal: React.FC<ClubDetailModalProps> = ({
  club,
  onClose,
  onUpdateStats,
}) => {
  if (!club) return null;

  const zoneColor = ZONE_COLORS[club.zone];
  const zoneLabel = ZONE_LABELS[club.zone];

  const handleSimulateMatch = (outcome: 'win' | 'draw' | 'loss') => {
    if (!onUpdateStats) return;
    if (outcome === 'win') {
      onUpdateStats(club.id, club.vitorias + 1, club.empates, club.derrotas, club.golsMarcados + 2, club.golsContra + 1);
    } else if (outcome === 'draw') {
      onUpdateStats(club.id, club.vitorias, club.empates + 1, club.derrotas, club.golsMarcados + 1, club.golsContra + 1);
    } else {
      onUpdateStats(club.id, club.vitorias, club.empates, club.derrotas + 1, club.golsMarcados, club.golsContra + 2);
    }
  };

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-3 bg-black/60 backdrop-blur-xs"
      onClick={onClose}
    >
      <div 
        className="bg-white rounded-xl shadow-2xl max-w-lg w-full overflow-hidden border-2 border-cyan-400"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div 
          className="p-5 text-white flex items-center justify-between"
          style={{ background: 'linear-gradient(135deg, rgb(0,125,250), rgb(0, 200, 250))' }}
        >
          <div className="flex items-center gap-3">
            <img 
              src={club.badge} 
              alt={club.name} 
              className="w-12 h-12 object-contain bg-white/20 p-1 rounded-full shadow-inner"
              onError={(e) => {
                (e.target as HTMLImageElement).src = '/imagens/escudos-mini/mini-escudo-saopaulo.png';
              }}
            />
            <div>
              <h3 className="text-2xl font-bold tracking-tight">{club.name}</h3>
              <p className="text-xs text-white/90">
                {club.posicao}º colocado • {club.pontos} Pontos
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-white hover:bg-white/20 w-8 h-8 rounded-full flex items-center justify-center font-bold text-lg cursor-pointer"
          >
            ✕
          </button>
        </div>

        {/* Body */}
        <div className="p-5 space-y-4">
          {/* Status Badge */}
          <div className="flex items-center gap-2 p-2 rounded-lg bg-gray-50 border border-gray-100">
            <div 
              className="w-3.5 h-3.5 rounded-full shrink-0" 
              style={{ backgroundColor: zoneColor === 'transparent' ? '#cbd5e1' : zoneColor }} 
            />
            <span className="text-xs font-semibold text-gray-800">
              {zoneLabel}
            </span>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-4 gap-2 text-center text-xs">
            <div className="bg-cyan-50 p-2 rounded-lg border border-cyan-100">
              <span className="text-gray-500 block text-[10px]">JOGOS</span>
              <span className="text-base font-bold text-gray-900">{club.partidasJogadas}</span>
            </div>
            <div className="bg-green-50 p-2 rounded-lg border border-green-100">
              <span className="text-green-700 block text-[10px]">VITÓRIAS</span>
              <span className="text-base font-bold text-green-800">{club.vitorias}</span>
            </div>
            <div className="bg-amber-50 p-2 rounded-lg border border-amber-100">
              <span className="text-amber-700 block text-[10px]">EMPATES</span>
              <span className="text-base font-bold text-amber-800">{club.empates}</span>
            </div>
            <div className="bg-rose-50 p-2 rounded-lg border border-rose-100">
              <span className="text-rose-700 block text-[10px]">DERROTAS</span>
              <span className="text-base font-bold text-rose-800">{club.derrotas}</span>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-2 text-center text-xs">
            <div className="bg-cyan-50 p-2 rounded-lg border border-cyan-100">
              <span className="text-gray-500 block text-[10px]">GOLS PRÓ</span>
              <span className="text-base font-bold text-gray-900">{club.golsMarcados}</span>
            </div>
            <div className="bg-cyan-50 p-2 rounded-lg border border-cyan-100">
              <span className="text-gray-500 block text-[10px]">GOLS CONTRA</span>
              <span className="text-base font-bold text-gray-900">{club.golsContra}</span>
            </div>
            <div className="bg-cyan-50 p-2 rounded-lg border border-cyan-100">
              <span className="text-gray-500 block text-[10px]">SALDO DE GOLS</span>
              <span className="text-base font-bold text-cyan-900">
                {club.saldoDeGols > 0 ? `+${club.saldoDeGols}` : club.saldoDeGols}
              </span>
            </div>
          </div>

          {/* Aproveitamento calculation */}
          <div className="bg-gray-50 p-3 rounded-lg border border-gray-100 text-xs flex justify-between items-center">
            <span className="text-gray-600 font-medium">Aproveitamento estimado:</span>
            <span className="font-bold text-gray-900">
              {club.partidasJogadas > 0 
                ? `${((club.pontos / (club.partidasJogadas * 3)) * 100).toFixed(1)}%` 
                : '0%'}
            </span>
          </div>

          {/* Quick simulator */}
          {onUpdateStats && (
            <div className="pt-2 border-t border-gray-100">
              <p className="text-xs font-bold text-gray-700 mb-2">Simular Próxima Rodada para este clube:</p>
              <div className="grid grid-cols-3 gap-2">
                <button
                  type="button"
                  onClick={() => handleSimulateMatch('win')}
                  className="bg-green-600 hover:bg-green-700 text-white font-bold py-1.5 px-2 rounded text-xs transition-colors cursor-pointer"
                >
                  + Vitória (+3 pts)
                </button>
                <button
                  type="button"
                  onClick={() => handleSimulateMatch('draw')}
                  className="bg-amber-600 hover:bg-amber-700 text-white font-bold py-1.5 px-2 rounded text-xs transition-colors cursor-pointer"
                >
                  + Empate (+1 pt)
                </button>
                <button
                  type="button"
                  onClick={() => handleSimulateMatch('loss')}
                  className="bg-rose-600 hover:bg-rose-700 text-white font-bold py-1.5 px-2 rounded text-xs transition-colors cursor-pointer"
                >
                  + Derrota (+0 pt)
                </button>
              </div>
            </div>
          )}

          <div className="flex justify-end pt-2">
            <button
              onClick={onClose}
              className="bg-[rgb(0,125,250)] hover:bg-[rgb(0,110,225)] text-white text-xs font-bold py-1.5 px-4 rounded-md transition-colors cursor-pointer"
            >
              Fechar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
