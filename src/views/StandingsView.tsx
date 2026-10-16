import React, { useState, useEffect } from 'react';
import { Competition, StandingTeamData } from '../types/sports';
import { api } from '../services/api';
import { StandingsTable } from '../components/StandingsTable';
import { Trophy, RotateCcw, AlertTriangle } from 'lucide-react';

interface StandingsViewProps {
  competitions: Competition[];
  initialCompetition?: Competition;
  footballConfigured: boolean;
}

export const StandingsView: React.FC<StandingsViewProps> = ({
  competitions,
  initialCompetition,
  footballConfigured,
}) => {
  const [selectedComp, setSelectedComp] = useState<Competition>(
    initialCompetition || competitions[0]
  );
  const [selectedSeason, setSelectedSeason] = useState<number>(selectedComp.currentSeason);
  const [standings, setStandings] = useState<StandingTeamData[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [lastUpdated, setLastUpdated] = useState<string>('');
  const [source, setSource] = useState<string>('');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const loadStandings = async (leagueId: number, season: number) => {
    setLoading(true);
    setErrorMessage(null);
    try {
      const res = await api.getStandings(leagueId, season);
      if (res.standings?.league?.standings?.[0]) {
        setStandings(res.standings.league.standings[0]);
      } else {
        setStandings([]);
      }
      setLastUpdated(res.lastUpdated || '');
      setSource(res.source || '');
      if (res.message && !res.configured) {
        setErrorMessage(res.message);
      }
    } catch (err: any) {
      setStandings([]);
      setErrorMessage(err.message || 'Erro ao carregar classificação');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadStandings(selectedComp.id, selectedSeason);
  }, [selectedComp.id, selectedSeason]);

  const handleCompChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const id = parseInt(e.target.value, 10);
    const found = competitions.find((c) => c.id === id);
    if (found) {
      setSelectedComp(found);
      setSelectedSeason(found.currentSeason);
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Controls Bar */}
      <div className="bg-white rounded-2xl border border-slate-200/90 shadow-xs p-5">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-100">
          <div>
            <h2 className="text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2" style={{ fontFamily: "'Freeman', sans-serif" }}>
              <Trophy className="w-6 h-6 text-cyan-600" /> Tabelas de Classificação
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Classificação oficial, critérios de desempate e zonas continentais.
            </p>
          </div>

          {/* Selectors */}
          <div className="flex items-center gap-2 flex-wrap">
            {/* Competition Select */}
            <div className="flex-1 sm:flex-none">
              <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">
                Competição
              </label>
              <select
                value={selectedComp.id}
                onChange={handleCompChange}
                className="w-full sm:w-64 text-xs font-bold py-2 px-3 border border-slate-200 rounded-lg bg-slate-50 text-slate-900 focus:outline-none focus:ring-1 focus:ring-cyan-500"
              >
                {competitions.map((comp) => (
                  <option key={comp.id} value={comp.id}>
                    {comp.name} ({comp.country})
                  </option>
                ))}
              </select>
            </div>

            {/* Season Select */}
            <div>
              <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">
                Temporada
              </label>
              <select
                value={selectedSeason}
                onChange={(e) => setSelectedSeason(parseInt(e.target.value, 10))}
                className="text-xs font-bold py-2 px-3 border border-slate-200 rounded-lg bg-slate-50 text-slate-900 focus:outline-none focus:ring-1 focus:ring-cyan-500"
              >
                <option value={2024}>2024</option>
                <option value={2023}>2023</option>
                <option value={2025}>2025</option>
              </select>
            </div>
          </div>
        </div>

        {/* Quick league buttons */}
        <div className="pt-3 flex items-center gap-1.5 overflow-x-auto pb-1">
          {competitions.map((comp) => (
            <button
              key={comp.id}
              onClick={() => {
                setSelectedComp(comp);
                setSelectedSeason(comp.currentSeason);
              }}
              className={`text-xs font-bold px-3 py-1.5 rounded-lg whitespace-nowrap transition-colors cursor-pointer ${
                selectedComp.id === comp.id
                  ? 'bg-[#007dfa] text-white shadow-xs'
                  : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
              }`}
            >
              {comp.shortName}
            </button>
          ))}
        </div>
      </div>

      {/* Standings Table Content */}
      {loading ? (
        <div className="bg-white p-12 rounded-2xl border border-slate-200 text-center text-slate-500 space-y-2">
          <RotateCcw className="w-8 h-8 text-cyan-600 animate-spin mx-auto" />
          <p className="text-sm font-semibold">Carregando classificação oficial...</p>
        </div>
      ) : standings.length > 0 ? (
        <StandingsTable
          competition={selectedComp}
          standings={standings}
          lastUpdated={lastUpdated}
          source={source}
          compact={false}
        />
      ) : (
        <div className="bg-white p-10 rounded-2xl border border-slate-200 text-center space-y-3">
          <AlertTriangle className="w-10 h-10 text-amber-500 mx-auto" />
          <h3 className="text-base font-bold text-slate-800">
            Classificação não disponível
          </h3>
          <p className="text-xs text-slate-600 max-w-md mx-auto leading-relaxed">
            {errorMessage || (footballConfigured
              ? 'Não há dados de classificação registrados para esta competição e temporada na API-Sports.'
              : 'A integração com API-Sports requer a configuração da variável FOOTBALL_API_KEY no backend para consultar as tabelas oficiais.')}
          </p>
          <div className="pt-2">
            <button
              onClick={() => loadStandings(selectedComp.id, selectedSeason)}
              className="text-xs font-bold bg-[#007dfa] hover:bg-[#0066cc] text-white px-4 py-2 rounded-lg transition-colors cursor-pointer"
            >
              Tentar Novamente
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
