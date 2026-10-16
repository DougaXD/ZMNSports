import React, { useState } from 'react';
import { StandingTeamData, Competition } from '../types/sports';

interface StandingsTableProps {
  competition: Competition;
  standings: StandingTeamData[];
  lastUpdated?: string;
  source?: string;
  onSelectTeam?: (team: StandingTeamData) => void;
  compact?: boolean;
}

export const StandingsTable: React.FC<StandingsTableProps> = ({
  competition,
  standings,
  lastUpdated,
  source = 'Oficial',
  onSelectTeam,
  compact = false,
}) => {
  const [filterQuery, setFilterQuery] = useState('');

  const filtered = standings.filter((item) =>
    item.team.name.toLowerCase().includes(filterQuery.toLowerCase())
  );

  // Helper to determine border color for rank based on competition zones
  const getZoneBorder = (rank: number): string => {
    if (!competition.zones) return 'transparent';
    for (const key of Object.keys(competition.zones)) {
      const z = competition.zones[key];
      if (rank >= z.min && rank <= z.max) {
        return z.color;
      }
    }
    return 'transparent';
  };

  return (
    <div className="w-full flex flex-col bg-white rounded-xl shadow-xs border border-cyan-200/80 overflow-hidden">
      {/* Table Header / Caption */}
      <div 
        className="py-3 px-4 flex flex-col sm:flex-row items-center justify-between gap-2 border-b-2 border-white"
        style={{ backgroundColor: 'rgb(175, 245, 255)' }}
      >
        <div className="flex items-center gap-2">
          {competition.logo && (
            <img src={competition.logo} alt="" className="w-6 h-6 object-contain drop-shadow-xs" />
          )}
          <div>
            <h3 className="font-extrabold text-base sm:text-xl text-slate-900 tracking-tight" style={{ fontFamily: "'Freeman', sans-serif" }}>
              Tabela {competition.name}
            </h3>
            <span className="text-[11px] text-slate-600 block">
              Temporada {competition.currentSeason} • Fonte: {source}
            </span>
          </div>
        </div>

        {!compact && (
          <div className="w-full sm:w-56">
            <input
              type="text"
              value={filterQuery}
              onChange={(e) => setFilterQuery(e.target.value)}
              placeholder="Filtrar clube..."
              className="w-full text-xs px-2.5 py-1 bg-white border border-cyan-300 rounded-md focus:outline-none focus:ring-1 focus:ring-cyan-500"
            />
          </div>
        )}
      </div>

      {/* Responsive Table Wrapper */}
      <div className="overflow-x-auto w-full">
        <table className="w-full border-collapse text-xs sm:text-sm text-slate-800">
          <thead>
            <tr style={{ backgroundColor: 'rgb(210, 250, 255)' }} className="border-b border-cyan-200 text-slate-900">
              <th className="py-2 px-2 text-center font-bold w-10">Pos</th>
              <th className="py-2 px-2 text-left font-bold min-w-[140px]">Clube</th>
              <th className="py-2 px-1.5 text-center font-extrabold text-slate-950 w-9 bg-cyan-200/40">Pts</th>
              <th className="py-2 px-1 text-center font-bold w-8">PJ</th>
              <th className="py-2 px-1 text-center font-bold w-8">VIT</th>
              <th className="py-2 px-1 text-center font-bold w-8">E</th>
              <th className="py-2 px-1 text-center font-bold w-8">DER</th>
              {!compact && <th className="py-2 px-1 text-center font-bold w-8">GM</th>}
              {!compact && <th className="py-2 px-1 text-center font-bold w-8">GC</th>}
              <th className="py-2 px-1 text-center font-bold w-9">SG</th>
              {!compact && <th className="py-2 px-2 text-center font-bold w-20 hidden md:table-cell">Últimos</th>}
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 ? (
              <tr>
                <td colSpan={compact ? 8 : 11} className="py-8 text-center text-slate-500 bg-cyan-50/50">
                  Nenhum clube encontrado.
                </td>
              </tr>
            ) : (
              filtered.map((item, index) => {
                // Alternating rows matching original ZMN Sports style
                const bgColor = index % 2 === 0 ? 'rgb(175, 245, 255)' : 'rgb(210, 250, 255)';
                const borderColor = getZoneBorder(item.rank);

                return (
                  <tr
                    key={item.team.id}
                    onClick={() => onSelectTeam && onSelectTeam(item)}
                    style={{ backgroundColor: bgColor }}
                    className="hover:brightness-95 transition-all border-b border-white/50 cursor-pointer"
                  >
                    {/* Rank with left zone border */}
                    <td 
                      className="py-1.5 px-2 text-center font-black text-slate-900"
                      style={{
                        borderLeft: borderColor !== 'transparent' ? `5px solid ${borderColor}` : '5px solid transparent',
                      }}
                    >
                      {item.rank}º
                    </td>

                    {/* Club */}
                    <td className="py-1.5 px-2 font-semibold text-slate-900 whitespace-nowrap">
                      <div className="flex items-center gap-2">
                        <img
                          src={item.team.logo}
                          alt={item.team.name}
                          className="w-[22px] h-[22px] object-contain shrink-0 drop-shadow-xs"
                          onError={(e) => {
                            (e.target as HTMLImageElement).src = '/imagens/escudos-mini/mini-escudo-saopaulo.png';
                          }}
                        />
                        <span className="truncate hover:text-[#007dfa] transition-colors">
                          {item.team.name}
                        </span>
                      </div>
                    </td>

                    {/* Points */}
                    <td className="py-1.5 px-1.5 text-center font-black text-slate-950 bg-cyan-200/30">
                      {item.points}
                    </td>

                    {/* Played */}
                    <td className="py-1.5 px-1 text-center font-medium text-slate-800">
                      {item.all.played}
                    </td>

                    {/* Wins */}
                    <td className="py-1.5 px-1 text-center text-slate-800">
                      {item.all.win}
                    </td>

                    {/* Draws */}
                    <td className="py-1.5 px-1 text-center text-slate-800">
                      {item.all.draw}
                    </td>

                    {/* Losses */}
                    <td className="py-1.5 px-1 text-center text-slate-800">
                      {item.all.lose}
                    </td>

                    {/* Goals For */}
                    {!compact && (
                      <td className="py-1.5 px-1 text-center text-slate-800">
                        {item.all.goals.for}
                      </td>
                    )}

                    {/* Goals Against */}
                    {!compact && (
                      <td className="py-1.5 px-1 text-center text-slate-800">
                        {item.all.goals.against}
                      </td>
                    )}

                    {/* Goal Difference */}
                    <td className="py-1.5 px-1 text-center font-bold text-slate-900">
                      {item.goalsDiff > 0 ? `+${item.goalsDiff}` : item.goalsDiff}
                    </td>

                    {/* Recent Form */}
                    {!compact && (
                      <td className="py-1.5 px-2 text-center hidden md:table-cell">
                        <div className="flex items-center justify-center gap-1">
                          {item.form ? (
                            item.form.slice(-5).split('').map((char, cIdx) => (
                              <span
                                key={cIdx}
                                className={`w-3.5 h-3.5 rounded-full text-[9px] font-bold flex items-center justify-center text-white ${
                                  char === 'W' || char === 'V'
                                    ? 'bg-emerald-500'
                                    : char === 'D' || char === 'E'
                                    ? 'bg-amber-500'
                                    : 'bg-rose-500'
                                }`}
                                title={char === 'W' ? 'Vitória' : char === 'D' ? 'Empate' : 'Derrota'}
                              >
                                {char === 'W' ? 'V' : char === 'D' ? 'E' : 'D'}
                              </span>
                            ))
                          ) : (
                            <span className="text-slate-400 text-[10px]">-</span>
                          )}
                        </div>
                      </td>
                    )}
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Legend for configured zones */}
      {competition.zones && Object.keys(competition.zones).length > 0 && (
        <div className="p-3 border-t border-cyan-100 bg-cyan-50/40 text-[11px] text-slate-700">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div className="flex flex-wrap items-center gap-3">
              {Object.entries(competition.zones).map(([key, zone]) => (
                <div key={key} className="flex items-center gap-1.5">
                  <span
                    className="w-2.5 h-2.5 rounded-xs shrink-0"
                    style={{ backgroundColor: zone.color }}
                  />
                  <span>{zone.label} ({zone.min}º ao {zone.max}º)</span>
                </div>
              ))}
            </div>

            {lastUpdated && (
              <span className="text-[10px] text-slate-500 italic ml-auto">
                Atualizado às {lastUpdated}
              </span>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
