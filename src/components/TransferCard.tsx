import React from 'react';
import { TransferItem, TransferStatus } from '../types/sports';
import { ExternalLink, CheckCircle, Clock, HelpCircle, Eye } from 'lucide-react';

interface TransferCardProps {
  transfer: TransferItem;
}

export const TransferCard: React.FC<TransferCardProps> = ({ transfer }) => {
  const getStatusBadge = (status: TransferStatus) => {
    switch (status) {
      case 'Confirmado':
        return {
          bg: 'bg-emerald-100 text-emerald-800 border-emerald-300',
          icon: CheckCircle,
          label: 'Confirmado',
        };
      case 'Em negociação':
        return {
          bg: 'bg-amber-100 text-amber-800 border-amber-300',
          icon: Clock,
          label: 'Em negociação',
        };
      case 'Interesse reportado':
        return {
          bg: 'bg-blue-100 text-blue-800 border-blue-300',
          icon: Eye,
          label: 'Interesse reportado',
        };
      case 'Rumor':
      default:
        return {
          bg: 'bg-purple-100 text-purple-800 border-purple-300',
          icon: HelpCircle,
          label: 'Rumor de Mercado',
        };
    }
  };

  const badge = getStatusBadge(transfer.status);
  const BadgeIcon = badge.icon;

  return (
    <div className="bg-white rounded-xl border border-slate-200/90 shadow-xs hover:shadow-md transition-all p-4 flex flex-col justify-between group">
      <div>
        {/* Status Tag */}
        <div className="flex items-center justify-between mb-2.5">
          <span className={`inline-flex items-center gap-1 text-[11px] font-bold px-2.5 py-0.5 rounded-full border ${badge.bg}`}>
            <BadgeIcon className="w-3 h-3" />
            {badge.label}
          </span>
          <span className="text-[10px] text-slate-400">
            {transfer.publishedAt}
          </span>
        </div>

        {/* Title */}
        <a
          href={transfer.url}
          target="_blank"
          rel="noopener noreferrer"
          className="font-bold text-slate-900 group-hover:text-[#007dfa] transition-colors leading-snug text-sm sm:text-base line-clamp-2 block mb-2"
        >
          {transfer.title}
        </a>

        {/* Summary */}
        {transfer.summary && (
          <p className="text-slate-600 text-xs line-clamp-2 leading-relaxed">
            {transfer.summary}
          </p>
        )}
      </div>

      {/* Footer */}
      <div className="pt-3 mt-3 border-t border-slate-100 flex items-center justify-between text-xs">
        <span className="text-[11px] text-slate-500 font-medium">{transfer.source}</span>
        <a
          href={transfer.url}
          target="_blank"
          rel="noopener noreferrer"
          className="font-semibold text-[#007dfa] hover:underline flex items-center gap-1"
        >
          Acessar notícia <ExternalLink className="w-3 h-3" />
        </a>
      </div>
    </div>
  );
};
