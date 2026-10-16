import React from 'react';
import { NewsItem } from '../types/sports';
import { ExternalLink, Calendar, Newspaper } from 'lucide-react';

interface NewsCardProps {
  news: NewsItem;
  featured?: boolean;
}

export const NewsCard: React.FC<NewsCardProps> = ({ news, featured = false }) => {
  return (
    <article
      className={`bg-white rounded-xl border border-slate-200/90 shadow-xs hover:shadow-md transition-all flex flex-col justify-between overflow-hidden group ${
        featured ? 'md:col-span-2 md:flex-row' : ''
      }`}
    >
      {/* Image if available */}
      {news.imageUrl ? (
        <div className={`overflow-hidden bg-slate-900 relative ${featured ? 'md:w-1/2 min-h-[220px]' : 'h-44 sm:h-48'}`}>
          <img
            src={news.imageUrl}
            alt={news.title}
            className="w-full h-full object-cover group-hover:scale-103 transition-transform duration-300"
            loading="lazy"
          />
          <span className="absolute top-2.5 left-2.5 bg-[#007dfa] text-white text-[10px] font-bold px-2 py-0.5 rounded shadow">
            {news.category.toUpperCase()}
          </span>
        </div>
      ) : (
        <div className="h-28 bg-gradient-to-r from-cyan-600 to-[#007dfa] flex items-center justify-center p-3 relative">
          <Newspaper className="w-8 h-8 text-white/50" />
          <span className="absolute top-2.5 left-2.5 bg-black/30 text-white text-[10px] font-bold px-2 py-0.5 rounded">
            {news.category.toUpperCase()}
          </span>
        </div>
      )}

      {/* Content */}
      <div className={`p-4 flex-1 flex flex-col justify-between ${featured ? 'md:w-1/2 p-5' : ''}`}>
        <div>
          <div className="flex items-center gap-2 text-[11px] text-slate-500 mb-1.5">
            <span className="font-bold text-[#0066cc]">{news.source}</span>
            <span>•</span>
            <span className="flex items-center gap-1">
              <Calendar className="w-3 h-3" /> {news.publishedAt}
            </span>
          </div>

          <a
            href={news.url}
            target="_blank"
            rel="noopener noreferrer"
            className="font-bold text-slate-900 group-hover:text-[#007dfa] transition-colors leading-snug line-clamp-2 text-sm sm:text-base mb-2 block"
          >
            {news.title}
          </a>

          {news.description && (
            <p className="text-slate-600 text-xs sm:text-sm line-clamp-2 leading-relaxed">
              {news.description}
            </p>
          )}
        </div>

        {/* Read external link */}
        <div className="pt-3 mt-2 border-t border-slate-100 flex items-center justify-between">
          <span className="text-[11px] text-slate-400">Notícia original</span>
          <a
            href={news.url}
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs font-bold text-[#007dfa] hover:underline flex items-center gap-1"
          >
            Ler na íntegra <ExternalLink className="w-3 h-3" />
          </a>
        </div>
      </div>
    </article>
  );
};
