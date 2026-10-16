import React, { useState } from 'react';
import { SystemStatus } from '../types/sports';
import { Info, CheckCircle2, AlertTriangle, Key } from 'lucide-react';

interface ApiStatusBannerProps {
  status: SystemStatus | null;
  lastUpdated?: string;
  sourceLabel?: string;
}

export const ApiStatusBanner: React.FC<ApiStatusBannerProps> = ({
  status,
  lastUpdated,
  sourceLabel,
}) => {
  const [modalOpen, setModalOpen] = useState(false);

  const footballConfigured = status?.footballConfigured ?? false;

  return (
    <>
      <div className="w-full bg-slate-800 text-slate-300 text-[11px] sm:text-xs py-1.5 px-4 flex flex-wrap justify-between items-center gap-2 border-b border-slate-700">
        <div className="flex items-center gap-2">
          {footballConfigured ? (
            <span className="flex items-center gap-1 text-emerald-400 font-semibold">
              <CheckCircle2 className="w-3.5 h-3.5" /> API-Sports Conectada
            </span>
          ) : (
            <span className="flex items-center gap-1 text-amber-300 font-medium">
              <AlertTriangle className="w-3.5 h-3.5" /> API-Football: Aguardando FOOTBALL_API_KEY
            </span>
          )}

          <button
            onClick={() => setModalOpen(true)}
            className="text-cyan-400 hover:text-cyan-300 underline font-medium ml-1 cursor-pointer flex items-center gap-0.5"
          >
            <Info className="w-3 h-3" /> Configuração
          </button>
        </div>

        <div className="flex items-center gap-3 text-slate-400">
          {sourceLabel && <span>Fonte: <strong className="text-slate-300">{sourceLabel}</strong></span>}
          {lastUpdated && <span>Atualizado: <strong className="text-slate-200">{lastUpdated}</strong></span>}
          <span className="hidden sm:inline text-slate-500">Fuso: Brasília (UTC-3)</span>
        </div>
      </div>

      {/* Info Modal */}
      {modalOpen && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs"
          onClick={() => setModalOpen(false)}
        >
          <div 
            className="bg-white rounded-2xl shadow-2xl max-w-lg w-full p-6 text-slate-800 border-2 border-cyan-500"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between pb-3 border-b border-slate-200">
              <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                <Key className="w-5 h-5 text-cyan-600" /> Integrações e Provedores
              </h3>
              <button
                onClick={() => setModalOpen(false)}
                className="text-slate-400 hover:text-slate-700 font-bold text-base"
              >
                ✕
              </button>
            </div>

            <div className="py-4 space-y-3 text-xs sm:text-sm text-slate-600 leading-relaxed">
              <div className="p-3 rounded-lg bg-cyan-50 border border-cyan-200">
                <p className="font-bold text-cyan-900 mb-1">Status da API-Football (Jogos e Tabelas):</p>
                <p>
                  {footballConfigured ? (
                    <span className="text-emerald-700 font-semibold">
                      Chave configurada e ativa no backend. Consultas respeitam os limites de requisições e cache inteligente.
                    </span>
                  ) : (
                    <span className="text-amber-800">
                      A variável <strong>FOOTBALL_API_KEY</strong> ainda não foi preenchida nas variáveis de ambiente do servidor.
                      Para ativar consultas ao vivo da API-Football (v3.football.api-sports.io), adicione a chave no ambiente.
                    </span>
                  )}
                </p>
              </div>

              <div className="p-3 rounded-lg bg-slate-50 border border-slate-200">
                <p className="font-bold text-slate-900 mb-1">Status de Notícias e Mercado da Bola:</p>
                <p>
                  Integração ativa via feeds oficiais de futebol brasileiro (ge.globo & UOL Esporte) com tratamento automático de categorias, mercado da bola e links para matérias originais.
                </p>
              </div>

              <div className="p-3 rounded-lg bg-blue-50 border border-blue-200">
                <p className="font-bold text-blue-950 mb-1">Política de Integridade:</p>
                <p>
                  O ZMN Sports não gera dados fictícios. Quando a API estiver sem chave ou fora do ar, exibimos estados informativos verdadeiros e orientações de ativação.
                </p>
              </div>
            </div>

            <div className="pt-2 flex justify-end">
              <button
                onClick={() => setModalOpen(false)}
                className="bg-[#007dfa] hover:bg-[#0066cc] text-white text-xs font-bold py-2 px-5 rounded-lg transition-colors"
              >
                Entendi
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
