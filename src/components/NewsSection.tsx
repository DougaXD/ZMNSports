import React from 'react';
import { NewsArticle } from '../types';

interface NewsSectionProps {
  articles: NewsArticle[];
  onSelectArticle: (article: NewsArticle) => void;
  title?: string;
}

export const NewsSection: React.FC<NewsSectionProps> = ({
  articles,
  onSelectArticle,
  title = 'Principais Notícias',
}) => {
  return (
    <section className="w-full mt-6" id="mainnews">
      <div className="border-b-2 border-cyan-300 pb-2 mb-6 flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-800 tracking-tight">
          {title}
        </h2>
        <span className="text-xs text-gray-500 font-medium">
          {articles.length} notícias disponíveis
        </span>
      </div>

      <div className="flex flex-col items-center gap-8 w-full">
        {articles.map((article) => (
          <article 
            key={article.id} 
            className="w-full max-w-[700px] group cursor-pointer transition-transform hover:-translate-y-0.5 duration-200"
            onClick={() => onSelectArticle(article)}
          >
            <div className="overflow-hidden rounded-md shadow-[1px_1px_5px_rgba(51,51,51,0.75)] bg-slate-900 relative">
              <img 
                src={article.image} 
                alt={article.title}
                className="w-full max-h-[380px] object-cover group-hover:scale-102 transition-transform duration-300"
              />
              <div className="absolute top-3 left-3 bg-[#007dfa] text-white text-xs px-2.5 py-1 rounded font-bold shadow-md">
                {article.category}
              </div>
            </div>

            <div className="pt-4">
              <h3 
                className="text-xl sm:text-2xl font-bold text-gray-900 group-hover:text-[rgb(0,125,245)] group-hover:underline transition-colors leading-snug"
              >
                {article.title}
              </h3>
              <p className="text-gray-600 text-sm sm:text-base mt-2 line-clamp-2">
                {article.summary}
              </p>
            </div>

            <aside className="w-full mt-2 flex justify-between items-center text-xs text-gray-500 pt-1">
              <span>{article.date} • {article.readTime}</span>
              <p className="text-[rgb(0,125,250)] font-medium text-right">
                Artigo escrito por {article.author}
              </p>
            </aside>
          </article>
        ))}
      </div>
    </section>
  );
};
