import React from 'react';
import { ActiveSection } from '../types/sports';

interface FooterProps {
  onNavigate: (section: ActiveSection) => void;
  serverTime?: string;
}

export const Footer: React.FC<FooterProps> = ({ onNavigate, serverTime }) => {
  return (
    <footer 
      className="text-white w-full py-8 px-4 mt-auto border-t-4 border-cyan-400 select-none shadow-xl"
      style={{ backgroundColor: '#005bb5' }}
    >
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
        {/* Brand */}
        <div className="text-center md:text-left">
          <h3 
            className="text-2xl font-black tracking-tight"
            style={{ 
              fontFamily: "'Freeman', cursive, sans-serif",
              textShadow: '0px 2px 4px rgba(0, 20, 60, 0.7)' 
            }}
          >
            ZMN Sports™
          </h3>
          <p className="text-xs text-cyan-100 mt-1 max-w-sm">
            Portal brasileiro de futebol: resultados, tabelas, partidas ao vivo e notícias em tempo real.
          </p>
        </div>

        {/* Links */}
        <div className="flex flex-wrap justify-center gap-4 text-xs font-bold text-white/90">
          <button onClick={() => onNavigate('inicio')} className="hover:text-cyan-200 transition-colors">
            Início
          </button>
          <button onClick={() => onNavigate('jogos')} className="hover:text-cyan-200 transition-colors">
            Jogos
          </button>
          <button onClick={() => onNavigate('competicoes')} className="hover:text-cyan-200 transition-colors">
            Competições
          </button>
          <button onClick={() => onNavigate('classificacoes')} className="hover:text-cyan-200 transition-colors">
            Classificações
          </button>
          <button onClick={() => onNavigate('noticias')} className="hover:text-cyan-200 transition-colors">
            Notícias
          </button>
          <button onClick={() => onNavigate('transferencias')} className="hover:text-cyan-200 transition-colors">
            Transferências
          </button>
          <button onClick={() => onNavigate('sobre')} className="hover:text-cyan-200 transition-colors">
            Sobre Nós
          </button>
        </div>

        {/* Server Time & Copyright */}
        <div className="text-center md:text-right text-xs text-cyan-200 space-y-1">
          <p className="font-semibold text-white">Desenvolvido por ZMN Sports™</p>
          <p className="text-[11px] text-cyan-200/80">
            Fuso Horário: Horário de Brasília (UTC-3) {serverTime ? `• Servidor: ${serverTime}` : ''}
          </p>
        </div>
      </div>
    </footer>
  );
};
