import React from 'react';
import { ZONE_COLORS } from '../data/tableData';

interface TableLegendProps {
  lastUpdated: string;
  activeFilter: string | null;
  onFilterChange: (zone: string | null) => void;
  onResetData: () => void;
}

export const TableLegend: React.FC<TableLegendProps> = ({
  lastUpdated,
  activeFilter,
  onFilterChange,
  onResetData,
}) => {
  return (
    <div className="w-full mt-2">
      <aside className="flex justify-between items-center text-xs text-gray-700 px-1 py-1">
        <small className="font-medium">
          Última vez atualizado em: {lastUpdated}
        </small>
        <button
          onClick={onResetData}
          title="Restaurar dados originais do campeonato"
          className="text-xs text-[#007dfa] hover:underline font-bold transition-colors cursor-pointer"
        >
          Restaurar Dados
        </button>
      </aside>

      <div className="flex justify-center items-center my-3">
        <div 
          className="p-3 sm:p-4 rounded-xl shadow-sm text-sm border border-cyan-100 w-full max-w-lg transition-all"
          style={{ backgroundColor: 'rgb(210, 250, 255)' }}
        >
          <div className="flex justify-between items-center pb-2 border-b border-cyan-200/50 mb-2">
            <h4 className="font-bold text-center flex-1 text-gray-800 text-base">
              Qualificação / Rebaixamento
            </h4>
            {activeFilter && (
              <button
                onClick={() => onFilterChange(null)}
                className="text-xs bg-cyan-600 text-white px-2 py-0.5 rounded cursor-pointer hover:bg-cyan-700"
              >
                Limpar filtro
              </button>
            )}
          </div>

          <div className="space-y-1.5">
            <button
              type="button"
              onClick={() => onFilterChange(activeFilter === 'libertadores' ? null : 'libertadores')}
              className={`w-full text-left flex items-center p-1 rounded transition-colors cursor-pointer ${
                activeFilter === 'libertadores' ? 'bg-blue-100 font-bold' : 'hover:bg-cyan-200/50'
              }`}
            >
              <div 
                className="inline-block w-2.5 h-2.5 mr-2 rounded-xs shrink-0"
                style={{ backgroundColor: ZONE_COLORS.libertadores }}
              />
              <small className="text-gray-800">Fase de grupos da Copa Conmebol Libertadores (1º ao 4º)</small>
            </button>

            <button
              type="button"
              onClick={() => onFilterChange(activeFilter === 'pre-libertadores' ? null : 'pre-libertadores')}
              className={`w-full text-left flex items-center p-1 rounded transition-colors cursor-pointer ${
                activeFilter === 'pre-libertadores' ? 'bg-orange-100 font-bold' : 'hover:bg-cyan-200/50'
              }`}
            >
              <div 
                className="inline-block w-2.5 h-2.5 mr-2 rounded-xs shrink-0"
                style={{ backgroundColor: ZONE_COLORS['pre-libertadores'] }}
              />
              <small className="text-gray-800">Qualificatórias da Copa Conmebol Libertadores (5º e 6º)</small>
            </button>

            <button
              type="button"
              onClick={() => onFilterChange(activeFilter === 'sulamericana' ? null : 'sulamericana')}
              className={`w-full text-left flex items-center p-1 rounded transition-colors cursor-pointer ${
                activeFilter === 'sulamericana' ? 'bg-green-100 font-bold' : 'hover:bg-cyan-200/50'
              }`}
            >
              <div 
                className="inline-block w-2.5 h-2.5 mr-2 rounded-xs shrink-0"
                style={{ backgroundColor: ZONE_COLORS.sulamericana }}
              />
              <small className="text-gray-800">Fase de grupos da Copa Conmebol Sul-Americana (7º ao 12º)</small>
            </button>

            <button
              type="button"
              onClick={() => onFilterChange(activeFilter === 'rebaixamento' ? null : 'rebaixamento')}
              className={`w-full text-left flex items-center p-1 rounded transition-colors cursor-pointer ${
                activeFilter === 'rebaixamento' ? 'bg-red-100 font-bold' : 'hover:bg-cyan-200/50'
              }`}
            >
              <div 
                className="inline-block w-2.5 h-2.5 mr-2 rounded-xs shrink-0"
                style={{ backgroundColor: ZONE_COLORS.rebaixamento }}
              />
              <small className="text-gray-800">Rebaixamento para a Série B (17º ao 20º)</small>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
