import React from 'react';
import { NewsArticle } from '../types';

interface NewsDetailModalProps {
  article: NewsArticle | null;
  onClose: () => void;
}

export const NewsDetailModal: React.FC<NewsDetailModalProps> = ({ article, onClose }) => {
  if (!article) return null;

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-3 bg-black/60 backdrop-blur-xs animate-fade-in"
      onClick={onClose}
    >
      <div 
        className="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto overflow-x-hidden border-2 border-cyan-400"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="relative">
          <img 
            src={article.image} 
            alt={article.title}
            className="w-full max-h-[320px] object-cover"
          />
          <button
            onClick={onClose}
            className="absolute top-3 right-3 bg-black/70 hover:bg-black text-white w-8 h-8 rounded-full flex items-center justify-center font-bold text-lg shadow-lg cursor-pointer transition-all"
            aria-label="Fechar"
          >
            ✕
          </button>
          <div className="absolute bottom-3 left-3 bg-[#007dfa] text-white text-xs px-3 py-1 rounded-full font-bold shadow-md">
            {article.category}
          </div>
        </div>

        <div className="p-5 sm:p-7">
          <div className="flex justify-between items-center text-xs text-gray-500 mb-2">
            <span>{article.date} • {article.readTime}</span>
            <span className="text-[rgb(0,125,250)] font-semibold">
              Artigo escrito por {article.author}
            </span>
          </div>

          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 leading-tight mb-4">
            {article.title}
          </h2>

          <div className="space-y-4 text-gray-700 text-sm sm:text-base leading-relaxed">
            {article.content.map((paragraph, idx) => (
              <p key={idx}>{paragraph}</p>
            ))}
          </div>

          <div className="mt-8 pt-4 border-t border-gray-200 flex justify-end">
            <button
              onClick={onClose}
              className="bg-[rgb(0,125,250)] hover:bg-[rgb(0,110,225)] text-white font-bold py-2 px-6 rounded-lg shadow-md cursor-pointer transition-all"
            >
              Fechar Artigo
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
