import React from 'react';
import { ShieldCheck, Database, Radio, Mail } from 'lucide-react';

export const AboutView: React.FC = () => {
  return (
    <div className="space-y-6 animate-fade-in max-w-4xl mx-auto">
      {/* Main card */}
      <div className="bg-white rounded-2xl border border-slate-200/90 shadow-xs p-6 sm:p-8 space-y-6">
        <div className="border-b-2 border-cyan-300 pb-4">
          <h2 className="text-3xl font-black text-slate-900 tracking-tight" style={{ fontFamily: "'Freeman', sans-serif" }}>
            Sobre a ZMN Sports™
          </h2>
          <p className="text-sm text-cyan-800 font-semibold mt-1">
            Portal esportivo independente para acompanhamento do futebol brasileiro e internacional.
          </p>
        </div>

        {/* Official base text */}
        <div className="p-5 rounded-xl bg-cyan-50/70 border border-cyan-200 text-slate-800 text-sm sm:text-base leading-relaxed">
          <p className="font-medium">
            “A ZMN Sports é um projeto dedicado a aproximar os torcedores do mundo do futebol. Nosso objetivo é reunir resultados, classificações, partidas e notícias em um só lugar, facilitando o acompanhamento das principais competições do Brasil e do mundo.”
          </p>
        </div>

        {/* Principles & Pillars */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
          <div className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 space-y-2">
            <div className="w-8 h-8 rounded-lg bg-[#007dfa] text-white flex items-center justify-center font-bold">
              <Database className="w-4 h-4" />
            </div>
            <h3 className="font-bold text-slate-900 text-sm">Dados Reais e Confiáveis</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Integração com a API-Sports / API-Football e feeds oficiais. Nunca inventamos resultados, tabelas ou placares.
            </p>
          </div>

          <div className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 space-y-2">
            <div className="w-8 h-8 rounded-lg bg-emerald-600 text-white flex items-center justify-center font-bold">
              <ShieldCheck className="w-4 h-4" />
            </div>
            <h3 className="font-bold text-slate-900 text-sm">Rigor Editorial</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Transparência na apuração do Mercado da Bola, distinguindo transferências confirmadas de rumores da imprensa.
            </p>
          </div>

          <div className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 space-y-2">
            <div className="w-8 h-8 rounded-lg bg-cyan-600 text-white flex items-center justify-center font-bold">
              <Radio className="w-4 h-4" />
            </div>
            <h3 className="font-bold text-slate-900 text-sm">Placar e Zonas Oficiais</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Critérios oficiais de classificação da CBF, Conmebol e UEFA, com indicação exata de zonas continentais e rebaixamento.
            </p>
          </div>
        </div>

        {/* Sources & Methodology */}
        <div className="p-4 rounded-xl border border-slate-200 bg-slate-50 space-y-2">
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700">
            Fontes & Metodologia
          </h4>
          <ul className="text-xs text-slate-600 space-y-1 list-disc list-inside">
            <li><strong>Partidas e Classificações:</strong> API-Sports / API-Football (v3.football.api-sports.io).</li>
            <li><strong>Notícias e Mercado da Bola:</strong> Feeds esportivos de imprensa brasileira (ge.globo, UOL Esporte, GNews).</li>
            <li><strong>Fuso Horário Padrão:</strong> Horário Oficial de Brasília (UTC-3).</li>
          </ul>
        </div>

        {/* Contact info (clean, non-invented, configured) */}
        <div className="pt-4 border-t border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs text-slate-500">
          <div className="flex items-center gap-2">
            <Mail className="w-4 h-4 text-cyan-600" />
            <span>Contato Editorial: <strong>contato@zmnsports.com</strong> (Configurável)</span>
          </div>
          <div>
            <span>ZMN Sports™ • Versão 2.0 • Todos os direitos reservados</span>
          </div>
        </div>
      </div>
    </div>
  );
};
