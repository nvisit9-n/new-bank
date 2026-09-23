import React, { useState } from 'react';
import { 
  Newspaper, 
  Clock, 
  Eye, 
  Share2, 
  Bookmark, 
  ExternalLink, 
  ArrowRight, 
  ChevronRight, 
  Filter, 
  Sparkles,
  BookOpen,
  X
} from 'lucide-react';
import { ONLINEKHABAR_STYLE_NEWS, NewsPortalItem } from '../../data/portalData';
import { useApp } from '../../context/AppContext';

export interface OnlinekhabarNewsGridProps {
  className?: string;
}

export const OnlinekhabarNewsGrid: React.FC<OnlinekhabarNewsGridProps> = ({ 
  className = '' 
}) => {
  const { openNoteReader, startQuiz, addToast } = useApp();
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [activeArticleModal, setActiveArticleModal] = useState<NewsPortalItem | null>(null);

  const categories = [
    { id: 'all', label: 'सबै समाचार (All)' },
    { id: 'banking-news', label: 'बैंकिङ समाचार (Banking)' },
    { id: 'economic-affairs', label: 'आर्थिक समसामयिक (Economy)' },
    { id: 'vacancies', label: 'खुला पदपूर्ति (Vacancies)' },
    { id: 'loksewa-circulars', label: 'लोकसेवा सूचना (Loksewa)' }
  ];

  const filteredNews = selectedCategory === 'all' 
    ? ONLINEKHABAR_STYLE_NEWS 
    : ONLINEKHABAR_STYLE_NEWS.filter(n => n.category === selectedCategory);

  const headlineArticle = filteredNews.find(n => n.isHeadline) || filteredNews[0];
  const secondaryArticles = filteredNews.filter(n => n.id !== headlineArticle?.id);

  const handleShare = (article: NewsPortalItem, e: React.MouseEvent) => {
    e.stopPropagation();
    if (navigator.share) {
      navigator.share({
        title: article.titleNe,
        text: article.summaryNe,
        url: window.location.href
      }).catch(() => {});
    } else {
      navigator.clipboard?.writeText?.(article.titleNe + ' - ' + window.location.href);
      addToast('समाचारको शीर्षक र लिङ्क कपी गरियो!', 'info');
    }
  };

  return (
    <div 
      id="onlinekhabar-news-grid" 
      className={`bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 sm:p-6 shadow-sm ${className}`}
    >
      {/* Top Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 pb-5 border-b border-slate-100 dark:border-slate-800">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-bold bg-rose-50 dark:bg-rose-950/60 text-rose-700 dark:text-rose-300 border border-rose-200/60 dark:border-rose-800/60">
              <Newspaper className="w-3.5 h-3.5 text-rose-600 dark:text-rose-400" />
              अनलाइनखबर शैली प्रत्यक्ष समाचार तथा समसामयिक ग्रिड
            </span>
            <span className="text-xs text-slate-500 dark:text-slate-400">
              Daily Banking & Economic News Grid
            </span>
          </div>
          <h2 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <Newspaper className="w-5 h-5 text-rose-600 dark:text-rose-400" />
            <span>दैनिक आर्थिक, बैंकिङ तथा लोकसेवा समाचार ग्रिड</span>
          </h2>
        </div>

        {/* Category Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
                selectedCategory === cat.id
                  ? 'bg-rose-600 text-white shadow-xs'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      {/* Grid Content */}
      <div className="mt-5 space-y-6">
        {/* Top Prominent Lead Article */}
        {headlineArticle && (
          <div 
            onClick={() => setActiveArticleModal(headlineArticle)}
            className="p-5 sm:p-6 rounded-2xl bg-gradient-to-br from-slate-50 to-rose-50/30 dark:from-slate-850 dark:to-slate-800 border border-slate-200 dark:border-slate-700 hover:border-rose-400 dark:hover:border-rose-500 transition-all cursor-pointer shadow-xs group"
          >
            <div className="flex items-center justify-between gap-3 mb-2.5">
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-0.5 rounded-full text-[11px] font-black bg-rose-600 text-white uppercase tracking-wider">
                  ताजा मुख्य समाचार (Lead Story)
                </span>
                <span className="text-xs font-semibold text-rose-600 dark:text-rose-400">
                  {headlineArticle.categoryLabelNe}
                </span>
              </div>
              <div className="flex items-center gap-3 text-xs text-slate-500 dark:text-slate-400">
                <span className="flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5" />
                  {headlineArticle.publishedTime}
                </span>
                <span className="hidden sm:flex items-center gap-1">
                  <Eye className="w-3.5 h-3.5" />
                  {headlineArticle.viewsCount.toLocaleString('ne-NP')}
                </span>
              </div>
            </div>

            <h3 className="text-base sm:text-xl font-black text-slate-900 dark:text-white group-hover:text-rose-600 dark:group-hover:text-rose-400 transition-colors leading-snug">
              {headlineArticle.titleNe}
            </h3>

            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 mt-2 line-clamp-2 leading-relaxed">
              {headlineArticle.summaryNe}
            </p>

            {headlineArticle.detailedContentNe && (
              <div className="mt-3.5 p-3 rounded-xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 space-y-1 text-xs text-slate-700 dark:text-slate-300">
                {headlineArticle.detailedContentNe.map((bullet, idx) => (
                  <div key={idx} className="flex items-start gap-2">
                    <span className="text-rose-500 font-bold">•</span>
                    <span>{bullet}</span>
                  </div>
                ))}
              </div>
            )}

            <div className="mt-4 pt-3 border-t border-slate-200/60 dark:border-slate-800 flex items-center justify-between">
              <span className="text-xs font-medium text-slate-500 dark:text-slate-400">
                स्रोत: <strong>{headlineArticle.source}</strong>
              </span>

              <div className="flex items-center gap-2">
                <button
                  onClick={(e) => handleShare(headlineArticle, e)}
                  className="p-1.5 text-slate-500 hover:text-rose-600 dark:text-slate-400 dark:hover:text-white rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 transition"
                  title="समाचार सेयर गर्नुहोस्"
                >
                  <Share2 className="w-4 h-4" />
                </button>
                <span className="text-xs font-bold text-rose-600 dark:text-rose-400 group-hover:translate-x-1 transition-transform inline-flex items-center gap-1">
                  विस्तृत पढ्नुहोस् &rarr;
                </span>
              </div>
            </div>
          </div>
        )}

        {/* Secondary Articles Bento Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {secondaryArticles.map((article) => (
            <div 
              key={article.id}
              onClick={() => setActiveArticleModal(article)}
              className="p-4 rounded-xl bg-slate-50/70 dark:bg-slate-850 border border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 transition-all cursor-pointer flex flex-col justify-between group"
            >
              <div>
                <div className="flex items-center justify-between gap-2 mb-2">
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-200">
                    {article.categoryLabelNe}
                  </span>
                  <span className="text-[10px] text-slate-500 dark:text-slate-400">
                    {article.publishedTime}
                  </span>
                </div>

                <h4 className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors line-clamp-2 leading-snug">
                  {article.titleNe}
                </h4>

                <p className="text-xs text-slate-600 dark:text-slate-300 mt-1.5 line-clamp-2 leading-relaxed">
                  {article.summaryNe}
                </p>
              </div>

              <div className="mt-3 pt-2.5 border-t border-slate-200/60 dark:border-slate-800 flex items-center justify-between text-[11px] text-slate-500 dark:text-slate-400">
                <span className="truncate max-w-[140px] font-medium">{article.source}</span>
                <span className="text-blue-600 dark:text-blue-400 font-bold group-hover:translate-x-0.5 transition-transform">
                  पढ्नुहोस् &rarr;
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Article Detail Full Modal */}
      {activeArticleModal && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-4 animate-fadeIn">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl max-w-2xl w-full max-h-[85vh] overflow-y-auto p-6 shadow-2xl relative">
            {/* Close Button */}
            <button
              onClick={() => setActiveArticleModal(null)}
              className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-700 dark:hover:text-white rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Modal Content */}
            <div className="pr-8">
              <span className="px-2.5 py-0.5 rounded text-xs font-bold bg-rose-100 dark:bg-rose-950 text-rose-700 dark:text-rose-300 inline-block mb-2">
                {activeArticleModal.categoryLabelNe}
              </span>
              <h2 className="text-lg sm:text-xl font-black text-slate-900 dark:text-white leading-snug">
                {activeArticleModal.titleNe}
              </h2>

              <div className="flex items-center gap-3 text-xs text-slate-500 dark:text-slate-400 mt-2 pb-3 border-b border-slate-100 dark:border-slate-800">
                <span>स्रोत: <strong>{activeArticleModal.source}</strong></span>
                <span>•</span>
                <span>{activeArticleModal.publishedTime}</span>
                <span>•</span>
                <span>{activeArticleModal.readTimeMinutes} मिनेट अध्ययन</span>
              </div>

              <div className="mt-4 space-y-3 text-xs sm:text-sm text-slate-700 dark:text-slate-200 leading-relaxed">
                <p className="font-semibold text-slate-800 dark:text-slate-100">
                  {activeArticleModal.summaryNe}
                </p>

                {activeArticleModal.detailedContentNe && activeArticleModal.detailedContentNe.map((p, idx) => (
                  <p key={idx} className="p-3 rounded-xl bg-slate-50 dark:bg-slate-850 border border-slate-100 dark:border-slate-800">
                    {p}
                  </p>
                ))}
              </div>

              {/* Tags */}
              <div className="mt-4 flex flex-wrap gap-1.5 pt-3 border-t border-slate-100 dark:border-slate-800">
                {activeArticleModal.tags.map((tag, idx) => (
                  <span key={idx} className="px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-[11px] font-medium text-slate-600 dark:text-slate-300">
                    #{tag}
                  </span>
                ))}
              </div>

              {/* Action Buttons */}
              <div className="mt-6 flex flex-wrap items-center justify-end gap-2">
                <button
                  onClick={() => setActiveArticleModal(null)}
                  className="px-4 py-2 rounded-xl text-xs font-bold text-slate-600 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 transition"
                >
                  बन्द गर्नुहोस्
                </button>

                {activeArticleModal.actionType === 'quiz' && (
                  <button
                    onClick={() => {
                      const target = activeArticleModal;
                      setActiveArticleModal(null);
                      startQuiz({
                        id: `article-quiz-${target.id}-${Date.now()}`,
                        title: `${target.categoryLabelNe} अभ्यास सेट`,
                        description: target.titleNe,
                        category: 'Banking',
                        difficulty: 'Medium',
                        mode: 'daily',
                        timeLimitMinutes: 10,
                        questions: [],
                        badge: 'News'
                      });
                    }}
                    className="px-4 py-2 rounded-xl text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 transition"
                  >
                    सम्बन्धित क्विज सुरु गर्नुहोस्
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
