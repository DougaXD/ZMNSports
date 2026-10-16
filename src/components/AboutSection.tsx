import React from 'react';

export const AboutSection: React.FC = () => {
  return (
    <section className="w-full py-4 text-gray-800 space-y-6">
      <div className="border-b-2 border-cyan-300 pb-3">
        <h2 className="text-3xl font-bold tracking-tight text-gray-900">
          Sobre o ZMN Sports™
        </h2>
        <p className="text-sm text-gray-600 mt-1">
          A sua central completa e interativa de classificação, estatísticas e notícias do futebol brasileiro.
        </p>
      </div>

      <div className="bg-cyan-50/70 p-5 rounded-xl border border-cyan-200 space-y-4 text-sm leading-relaxed">
        <h3 className="text-lg font-bold text-[rgb(0,125,250)]">
          Nossa Missão
        </h3>
        <p>
          O <strong>ZMN Sports™</strong> nasceu com o objetivo de entregar aos torcedores brasileiros uma experiência rápida, clara e visualmente vibrante para acompanhar a tabela do Campeonato Brasileiro Série A e as notícias mais quentes do futebol.
        </p>
        <p>
          Com cálculos automatizados de pontuação, saldo de gols, classificação dinâmica de acordo com os critérios oficiais da CBF (pontos, vitórias, saldo de gols e gols marcados) e zonas coloridas de qualificação para a Copa Libertadores, Sul-Americana e Rebaixamento.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white p-4 rounded-xl border border-cyan-100 shadow-sm">
          <div className="w-8 h-8 rounded-full bg-blue-500 text-white flex items-center justify-center font-bold mb-2">
            1
          </div>
          <h4 className="font-bold text-gray-900 mb-1">Tabela Atualizada</h4>
          <p className="text-xs text-gray-600">
            Acompanhe o desempenho de todos os 20 clubes da Série A com critérios de desempate e zonas continentais.
          </p>
        </div>

        <div className="bg-white p-4 rounded-xl border border-cyan-100 shadow-sm">
          <div className="w-8 h-8 rounded-full bg-orange-500 text-white flex items-center justify-center font-bold mb-2">
            2
          </div>
          <h4 className="font-bold text-gray-900 mb-1">Cobertura Editorial</h4>
          <p className="text-xs text-gray-600">
            Artigos e análises exclusivas escritas por Douga, cobrindo o dia a dia dos principais clubes e técnicos.
          </p>
        </div>

        <div className="bg-white p-4 rounded-xl border border-cyan-100 shadow-sm">
          <div className="w-8 h-8 rounded-full bg-green-500 text-white flex items-center justify-center font-bold mb-2">
            3
          </div>
          <h4 className="font-bold text-gray-900 mb-1">Simulador Interativo</h4>
          <p className="text-xs text-gray-600">
            Clique em qualquer clube para simular resultados e visualizar mudanças instantâneas na classificação geral.
          </p>
        </div>
      </div>

      <div className="p-4 rounded-xl border border-gray-200 text-xs text-gray-600 flex justify-between items-center bg-gray-50">
        <div>
          <span className="font-bold text-gray-800">Autor & Criador:</span> Douga
        </div>
        <div>
          <span className="font-bold text-gray-800">Plataforma:</span> ZMN Sports™ • Brasileirão Série A 2024
        </div>
      </div>
    </section>
  );
};
