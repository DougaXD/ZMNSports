import React, { useState } from 'react';
import { Competition, ActiveSection } from '../types/sports';
import { Trophy, MapPin, ChevronRight } from 'lucide-react';

interface CompetitionsViewProps {
  competitions: Competition[];
  onSelectCompetition: (comp: Competition) => void;
  onNavigate: (section: ActiveSection, meta?: any) => void;
}

export const CompetitionsView: React.FC<CompetitionsViewProps> = ({
  competitions,
  onSelectCompetition,
  onNavigate,
}) => {
  const [selectedRegion, setSelectedRegion] = useState<'all' | 'Brasil' | 'América do Sul' | 'Europa'>('all');

  const filtered = selectedRegion === 'all'
    ? competitions
    : competitions.filter((c) => c.region === selectedRegion);

  const regions = [
    { id: 'all', label: 'Todas as Competições' },
    { id: 'Brasil', label: 'Brasil' },
    { id: 'América do Sul', label: 'América do Sul' },
    { id: 'Europa', label: 'Europa' },
  ] as const;

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Banner */}
      <div className="bg-white rounded-2xl border border-slate-200/90 shadow-xs p-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100">
          <div>
            <h2 className="text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2" style={{ fontFamily: "'Freeman', sans-serif" }}>
              <Trophy className="w-6 h-6 text-cyan-600" /> Competições & Campeonatos
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Cobertura completa de torneios nacionais e internacionais do futebol mundial.
            </p>
          </div>

          {/* Region Tabs */}
          <div className="flex items-center gap-1.5 flex-wrap">
            {regions.map((r) => (
              <button
                key={r.id}
                onClick={() => setSelectedRegion(r.id)}
                className={`text-xs font-bold px-3 py-1.5 rounded-lg transition-colors cursor-pointer ${
                  selectedRegion === r.id
                    ? 'bg-[#007dfa] text-white shadow-xs'
                    : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                }`}
              >
                {r.label}
              </button>
            ))}
          </div>
        </div>

        {/* Competitions Grid */}
        <div className="pt-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map((comp) => (
            <div
              key={comp.id}
              onClick={() => {
                onSelectCompetition(comp);
                onNavigate('classificacoes', { competitionId: comp.id });
              }}
              className="bg-slate-50/70 hover:bg-cyan-50/50 rounded-xl border border-slate-200/80 hover:border-cyan-400 p-4 transition-all cursor-pointer shadow-xs hover:shadow-md flex flex-col justify-between group"
            >
              <div className="flex items-start gap-3">
                <img
                  src={comp.logo}
                  alt={comp.name}
                  className="w-12 h-12 object-contain bg-white p-1 rounded-lg border border-slate-200 shrink-0 group-hover:scale-105 transition-transform"
                />
                <div className="flex-1 min-w-0">
                  <span className="text-[10px] font-bold uppercase text-[#0066cc] bg-cyan-100/60 px-2 py-0.5 rounded-md inline-block mb-1">
                    {comp.region} • {comp.type === 'League' ? 'Pontos Corridos' : 'Mata-Mata'}
                  </span>
                  <h3 className="font-bold text-slate-900 group-hover:text-[#007dfa] text-sm sm:text-base leading-snug truncate">
                    {comp.name}
                  </h3>
                  <span className="text-xs text-slate-500 flex items-center gap-1 mt-0.5">
                    <MapPin className="w-3 h-3" /> {comp.country}
                  </span>
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-200/70 flex items-center justify-between text-xs">
                <span className="text-slate-500 font-medium">Temporada: {comp.currentSeason}</span>
                <span className="font-bold text-[#007dfa] group-hover:translate-x-0.5 transition-transform flex items-center gap-0.5">
                  Ver Tabela <ChevronRight className="w-3.5 h-3.5" />
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
