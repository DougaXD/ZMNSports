import React, { useState, useEffect } from 'react';
import { TransferItem, TransferStatus } from '../types/sports';
import { api } from '../services/api';
import { TransferCard } from '../components/TransferCard';
import { ArrowRightLeft, RotateCcw, AlertCircle, CheckCircle, Clock, Eye, HelpCircle } from 'lucide-react';

export const TransfersView: React.FC = () => {
  const [transfers, setTransfers] = useState<TransferItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [selectedStatus, setSelectedStatus] = useState<TransferStatus | 'all'>('all');
  const [lastUpdated, setLastUpdated] = useState<string>('');
  const [source, setSource] = useState<string>('');

  const loadTransfers = async (status?: TransferStatus) => {
    setLoading(true);
    try {
      const res = await api.getTransfers(status);
      setTransfers(res.transfers || []);
      setLastUpdated(res.lastUpdated || '');
      setSource(res.source || '');
    } catch {
      setTransfers([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadTransfers(selectedStatus === 'all' ? undefined : selectedStatus);
  }, [selectedStatus]);

  const statusFilters = [
    { id: 'all', label: 'Todos os Movimentos', count: transfers.length },
    { id: 'Confirmado', label: 'Confirmados', icon: CheckCircle, color: 'text-emerald-700' },
    { id: 'Em negociação', label: 'Em Negociação', icon: Clock, color: 'text-amber-700' },
    { id: 'Interesse reportado', label: 'Interesse Reportado', icon: Eye, color: 'text-blue-700' },
    { id: 'Rumor', label: 'Rumores', icon: HelpCircle, color: 'text-purple-700' },
  ] as const;

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Top Banner */}
      <div className="bg-white rounded-2xl border border-slate-200/90 shadow-xs p-5">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-100">
          <div>
            <h2 className="text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2" style={{ fontFamily: "'Freeman', sans-serif" }}>
              <ArrowRightLeft className="w-6 h-6 text-amber-600" /> Mercado da Bola & Transferências
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Acompanhe contratações oficiais, renovações, rescisões e negociações do futebol.
            </p>
          </div>

          <div className="p-2.5 rounded-xl bg-amber-50 border border-amber-200 text-[11px] text-amber-800 flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-amber-600 shrink-0" />
            <span>
              <strong>Critério Editorial:</strong> Distinguimos rigorosamente anúncios confirmados de rumores ou sondagens reportadas pela imprensa.
            </span>
          </div>
        </div>

        {/* Status Filters */}
        <div className="pt-3 flex items-center justify-between flex-wrap gap-2">
          <div className="flex items-center gap-1.5 flex-wrap">
            {statusFilters.map((st) => (
              <button
                key={st.id}
                onClick={() => setSelectedStatus(st.id as any)}
                className={`text-xs font-bold px-3 py-1.5 rounded-lg transition-colors cursor-pointer flex items-center gap-1.5 ${
                  selectedStatus === st.id
                    ? 'bg-[#007dfa] text-white shadow-xs'
                    : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                }`}
              >
                <span>{st.label}</span>
              </button>
            ))}
          </div>

          <div className="text-[11px] text-slate-500">
            Fonte: <strong>{source}</strong> {lastUpdated && `• Atualizado às ${lastUpdated}`}
          </div>
        </div>
      </div>

      {/* Transfers Grid */}
      {loading ? (
        <div className="bg-white p-12 rounded-2xl border border-slate-200 text-center text-slate-500 space-y-2">
          <RotateCcw className="w-8 h-8 text-cyan-600 animate-spin mx-auto" />
          <p className="text-sm font-semibold">Atualizando movimentações do mercado...</p>
        </div>
      ) : transfers.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {transfers.map((t) => (
            <TransferCard key={t.id} transfer={t} />
          ))}
        </div>
      ) : (
        <div className="bg-white p-10 rounded-2xl border border-slate-200 text-center text-slate-500 space-y-2">
          <ArrowRightLeft className="w-10 h-10 text-slate-300 mx-auto" />
          <h3 className="text-base font-bold text-slate-800">
            Nenhuma movimentação para o filtro selecionado
          </h3>
          <p className="text-xs text-slate-500">
            Experimente visualizar todos os status do mercado da bola.
          </p>
        </div>
      )}
    </div>
  );
};
