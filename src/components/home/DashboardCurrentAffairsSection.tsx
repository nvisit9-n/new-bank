import React, { useState, useEffect, useCallback } from 'react';
import { 
  TrendingUp, 
  Newspaper, 
  RefreshCw, 
  ExternalLink, 
  Volume2, 
  VolumeX, 
  Bookmark, 
  Share2, 
  Check, 
  ArrowRight, 
  Sparkles, 
  ShieldCheck, 
  BarChart3, 
  Calendar, 
  Building2, 
  Award, 
  HelpCircle,
  X
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { nepaliTts } from '../../utils/nepaliTts';
import { safeCopyToClipboard } from '../../utils/safeHelpers';

export interface EconomicIndicator {
  label: string;
  value: string;
  status: string;
  trend: 'up' | 'down' | 'neutral';
  change?: string;
}

export interface EconomicNewsItem {
  id: string;
  title: string;
  category: string;
  categoryNepali: string;
  date: string;
  source: string;
  readTime: string;
  summary: string;
  keyStats?: { label: string; value: string }[];
  examPoint: string;
  detailedAnalysis?: string;
  examQuestions?: string[];
  tags?: string[];
}

export const DashboardCurrentAffairsSection: React.FC = () => {
  const { setActiveTab, addToast, toggleBookmark, isBookmarked } = useApp();

  const [news, setNews] = useState<EconomicNewsItem[]>([]);
  const [indicators, setIndicators] = useState<EconomicIndicator[]>([]);
  const [nepaliDate, setNepaliDate] = useState<string>('२०८३ असोज');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isRefreshing, setIsRefreshing] = useState<boolean>(false);
  const [selectedArticle, setSelectedArticle] = useState<EconomicNewsItem | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [playingId, setPlayingId] = useState<string | null>(null);

  // Subscribe to TTS state
  useEffect(() => {
    const unsubscribe = nepaliTts.subscribe((state) => {
      if (state.isPlaying) {
        setPlayingId(state.messageId);
      } else {
        setPlayingId(null);
      }
    });
    return () => {
      unsubscribe();
      nepaliTts.stop();
    };
  }, []);

  const fetchEconomicNews = useCallback(async (forceRefresh = false) => {
    if (forceRefresh) {
      setIsRefreshing(true);
    } else {
      setIsLoading(true);
    }

    try {
      const url = forceRefresh 
        ? '/api/current-affairs/economic-news?refresh=true' 
        : '/api/current-affairs/economic-news';
      const res = await fetch(url);
      const data = await res.json();

      if (data.news && Array.isArray(data.news)) {
        setNews(data.news);
      }
      if (data.economicIndicators && Array.isArray(data.economicIndicators)) {
        setIndicators(data.economicIndicators);
      }
      if (data.nepaliDate) {
        setNepaliDate(data.nepaliDate);
      }

      if (forceRefresh) {
        addToast('ताजा आर्थिक तथा बैंकिङ समसामयिक अपडेट भयो!', 'success');
      }
    } catch (err) {
      console.warn('Failed to load economic news from API:', err);
      // Fallback is already handled by server returning default JSON, but catch covers network disconnect
      if (forceRefresh) {
        addToast('इन्टरनेट जडान जाँच गर्नुहोस् वा केही समयपछि पुनः प्रयास गर्नुहोस्', 'warning');
      }
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  }, [addToast]);

  useEffect(() => {
    fetchEconomicNews();
  }, [fetchEconomicNews]);

  const handleToggleAudio = (item: EconomicNewsItem, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    if (playingId === item.id) {
      nepaliTts.stop();
      setPlayingId(null);
    } else {
      const textToRead = `${item.title}। ${item.summary}। ${item.examPoint}`;
      nepaliTts.speak(textToRead, item.id);
      setPlayingId(item.id);
    }
  };

  const handleShare = async (item: EconomicNewsItem, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    const shareText = `📌 [दैनिक आर्थिक तथा बैंकिङ समसामयिक - Banking Tayari Nepal]\n\n📰 ${item.title}\n\n📝 ${item.summary}\n\n${item.examPoint}\n\nस्रोत: ${item.source} (${item.date})`;
    const success = await safeCopyToClipboard(shareText);
    if (success) {
      setCopiedId(item.id);
      addToast('समाचार तथा परीक्षा बुँदा क्लिपबोर्डमा कपी भयो!', 'success');
      setTimeout(() => setCopiedId(null), 2500);
    } else {
      addToast('कपी गर्न सकिएन, कृपया म्यानुअल कपी गर्नुहोस्', 'error');
    }
  };

  const handleBookmark = (item: EconomicNewsItem, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    const isNowBookmarked = toggleBookmark('current-affair', item.id, item.title, item.categoryNepali);
    if (isNowBookmarked) {
      addToast('समसामयिक बुकमार्कमा सुरक्षित गरियो', 'success');
    } else {
      addToast('समसामयिक बुकमार्कबाट हटाइयो', 'info');
    }
  };

  const categories = [
    { key: 'All', label: 'सबै (All)' },
    { key: 'NRB', label: 'नेपाल राष्ट्र बैंक (NRB)' },
    { key: 'Banking', label: 'वाणिज्य बैंकिङ (Banking)' },
    { key: 'Economy', label: 'अर्थतन्त्र & विदेशी मुद्रा' },
    { key: 'Capital Markets', label: 'पुँजी बजार & NEPSE' }
  ];

  const filteredNews = selectedCategory === 'All' 
    ? news 
    : news.filter(item => 
        item.category.toLowerCase().includes(selectedCategory.toLowerCase()) ||
        item.categoryNepali.toLowerCase().includes(selectedCategory.toLowerCase())
      );

  return (
    <section id="dashboard-current-affairs-section" className="mb-10">
      {/* Section Header */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 sm:p-6 shadow-sm mb-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2.5 mb-1.5">
              <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                दैनिक अपडेट (Daily Live)
              </span>
              <span className="text-xs font-medium text-slate-500 dark:text-slate-400 flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5" />
                {nepaliDate}
              </span>
            </div>
            <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Newspaper className="w-6 h-6 text-blue-600 dark:text-blue-400" />
              दैनिक आर्थिक तथा बैंकिङ समसामयिक
            </h2>
            <p className="text-sm text-slate-600 dark:text-slate-400 mt-1 max-w-2xl">
              नेपाल राष्ट्र बैंकका सर्कुलर, मौद्रिक नीति, वाणिज्य बैंकहरू, विदेशी मुद्रा सञ्चिति तथा लोकसेवा र बैंकिङ परीक्षा लक्षित मुख्य तथ्यहरू
            </p>
          </div>

          <div className="flex items-center gap-2.5 self-start md:self-auto">
            <button
              id="refresh-current-affairs-btn"
              onClick={() => fetchEconomicNews(true)}
              disabled={isRefreshing}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors disabled:opacity-50"
              title="ताजा समाचार रिफ्रेस गर्नुहोस्"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isRefreshing ? 'animate-spin text-blue-600' : ''}`} />
              <span>{isRefreshing ? 'लोड हुँदैछ...' : 'रिफ्रेस (Fetch)'}</span>
            </button>

            <button
              id="view-all-current-affairs-btn"
              onClick={() => setActiveTab('current-affairs')}
              className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold rounded-xl bg-blue-600 hover:bg-blue-700 text-white shadow-sm transition-all hover:shadow"
            >
              <span>सबै समसामयिक हेर्नुहोस्</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Live Economic Indicators Ticker */}
        {indicators.length > 0 && (
          <div className="mt-5 pt-4 border-t border-slate-100 dark:border-slate-800/80">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
                <BarChart3 className="w-3.5 h-3.5 text-blue-500" />
                नेपाल वित्तीय प्रणालीका प्रमुख सूचकहरू (Key Financial Indicators)
              </span>
              <span className="text-[11px] text-slate-400">स्रोत: नेपाल राष्ट्र बैंक</span>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2.5">
              {indicators.slice(0, 6).map((ind, i) => (
                <div 
                  key={i} 
                  className="bg-slate-50 dark:bg-slate-800/50 border border-slate-200/80 dark:border-slate-700/60 rounded-xl p-2.5 transition-all hover:border-blue-300 dark:hover:border-blue-700"
                >
                  <div className="text-[11px] text-slate-600 dark:text-slate-400 truncate font-medium">
                    {ind.label.split('(')[0]}
                  </div>
                  <div className="flex items-baseline justify-between mt-0.5">
                    <span className="text-base font-bold text-slate-900 dark:text-white">
                      {ind.value}
                    </span>
                    {ind.change && (
                      <span className={`text-[10px] font-semibold px-1 rounded ${
                        ind.trend === 'up' 
                          ? 'text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40' 
                          : ind.trend === 'down' 
                          ? 'text-rose-700 dark:text-rose-400 bg-rose-50 dark:bg-rose-950/40' 
                          : 'text-slate-600 dark:text-slate-400 bg-slate-100 dark:bg-slate-700/50'
                      }`}>
                        {ind.change}
                      </span>
                    )}
                  </div>
                  <div className="text-[10px] text-slate-400 dark:text-slate-400 truncate mt-0.5">
                    {ind.status}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Category Filters */}
        <div className="flex items-center gap-1.5 mt-5 overflow-x-auto pb-1 no-scrollbar">
          {categories.map((cat) => (
            <button
              key={cat.key}
              onClick={() => setSelectedCategory(cat.key)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all ${
                selectedCategory === cat.key
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      {/* News Cards Grid */}
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[1, 2, 3].map((n) => (
            <div key={n} className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 animate-pulse">
              <div className="flex items-center justify-between mb-3">
                <div className="h-5 w-24 bg-slate-200 dark:bg-slate-800 rounded"></div>
                <div className="h-4 w-16 bg-slate-200 dark:bg-slate-800 rounded"></div>
              </div>
              <div className="h-6 w-5/6 bg-slate-200 dark:bg-slate-800 rounded mb-2"></div>
              <div className="h-4 w-full bg-slate-200 dark:bg-slate-800 rounded mb-4"></div>
              <div className="h-16 w-full bg-slate-100 dark:bg-slate-800 rounded mb-4"></div>
              <div className="h-8 w-full bg-slate-200 dark:bg-slate-800 rounded"></div>
            </div>
          ))}
        </div>
      ) : filteredNews.length === 0 ? (
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-8 text-center">
          <p className="text-slate-500 dark:text-slate-400 text-sm">यस वर्गमा हाल समाचार भेटिएन।</p>
          <button 
            onClick={() => setSelectedCategory('All')} 
            className="mt-3 px-4 py-1.5 text-xs font-semibold bg-blue-50 text-blue-600 dark:bg-blue-950 dark:text-blue-400 rounded-lg"
          >
            सबै समाचार देखाउनुहोस्
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredNews.map((item) => {
            const isItemBookmarked = isBookmarked('current-affair', item.id);
            const isItemPlaying = playingId === item.id;

            return (
              <div
                key={item.id}
                id={`economic-news-card-${item.id}`}
                className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-sm hover:shadow-md transition-all flex flex-col justify-between group"
              >
                <div>
                  {/* Top Metadata Row */}
                  <div className="flex items-center justify-between gap-2 mb-2.5">
                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md text-[11px] font-semibold bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 border border-blue-200/60 dark:border-blue-800/60 truncate">
                      <Building2 className="w-3 h-3" />
                      {item.source}
                    </span>
                    <span className="text-[11px] font-medium text-slate-500 dark:text-slate-400 whitespace-nowrap">
                      {item.date}
                    </span>
                  </div>

                  {/* Headline */}
                  <h3 
                    onClick={() => setSelectedArticle(item)}
                    className="text-base font-bold text-slate-900 dark:text-white leading-snug hover:text-blue-600 dark:hover:text-blue-400 transition-colors cursor-pointer line-clamp-2 mb-2"
                  >
                    {item.title}
                  </h3>

                  {/* Summary */}
                  <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed line-clamp-3 mb-3">
                    {item.summary}
                  </p>

                  {/* Key Stats Chips */}
                  {item.keyStats && item.keyStats.length > 0 && (
                    <div className="grid grid-cols-2 gap-1.5 mb-3">
                      {item.keyStats.slice(0, 2).map((stat, sIdx) => (
                        <div key={sIdx} className="bg-slate-50 dark:bg-slate-800/60 rounded-lg px-2 py-1 border border-slate-100 dark:border-slate-700/50">
                          <span className="text-[10px] text-slate-500 dark:text-slate-400 block truncate">{stat.label}</span>
                          <span className="text-xs font-bold text-slate-800 dark:text-slate-200 block truncate">{stat.value}</span>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Exam Point Box */}
                  <div className="bg-amber-50/80 dark:bg-amber-950/30 border border-amber-200/80 dark:border-amber-800/50 rounded-xl p-2.5 mb-4">
                    <p className="text-xs text-amber-900 dark:text-amber-300 font-medium leading-relaxed">
                      {item.examPoint}
                    </p>
                  </div>
                </div>

                {/* Card Action Footer */}
                <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between gap-2">
                  <div className="flex items-center gap-1">
                    {/* Audio Playback Button */}
                    <button
                      onClick={(e) => handleToggleAudio(item, e)}
                      className={`p-1.5 rounded-lg text-xs font-medium transition-colors ${
                        isItemPlaying 
                          ? 'bg-rose-100 dark:bg-rose-950/60 text-rose-600 dark:text-rose-400' 
                          : 'text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-800 dark:hover:text-slate-200'
                      }`}
                      title={isItemPlaying ? 'आवाज रोक्नुहोस्' : 'सुन्नुहोस् (Nepali Voice)'}
                    >
                      {isItemPlaying ? <VolumeX className="w-4 h-4 animate-pulse" /> : <Volume2 className="w-4 h-4" />}
                    </button>

                    {/* Bookmark Button */}
                    <button
                      onClick={(e) => handleBookmark(item, e)}
                      className={`p-1.5 rounded-lg text-xs font-medium transition-colors ${
                        isItemBookmarked 
                          ? 'text-amber-600 bg-amber-50 dark:bg-amber-950/60' 
                          : 'text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-800 dark:hover:text-slate-200'
                      }`}
                      title={isItemBookmarked ? 'सुरक्षित गरिएको' : 'बुकमार्क गर्नुहोस्'}
                    >
                      <Bookmark className={`w-4 h-4 ${isItemBookmarked ? 'fill-current' : ''}`} />
                    </button>

                    {/* Share / Copy Button */}
                    <button
                      onClick={(e) => handleShare(item, e)}
                      className="p-1.5 rounded-lg text-xs font-medium text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-800 dark:hover:text-slate-200 transition-colors"
                      title="कपी वा सेयर गर्नुहोस्"
                    >
                      {copiedId === item.id ? <Check className="w-4 h-4 text-emerald-600" /> : <Share2 className="w-4 h-4" />}
                    </button>
                  </div>

                  {/* Read Detailed Modal Trigger */}
                  <button
                    onClick={() => setSelectedArticle(item)}
                    className="inline-flex items-center gap-1 text-xs font-semibold text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 transition-colors"
                  >
                    <span>विस्तृत विवरण</span>
                    <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Detailed Full Article Modal */}
      {selectedArticle && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fadeIn">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl flex flex-col">
            {/* Modal Header */}
            <div className="p-5 border-b border-slate-100 dark:border-slate-800 flex items-start justify-between gap-4 sticky top-0 bg-white/95 dark:bg-slate-900/95 backdrop-blur z-10">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <span className="px-2.5 py-0.5 rounded-md text-xs font-semibold bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-400 border border-blue-200/50">
                    {selectedArticle.categoryNepali}
                  </span>
                  <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">
                    {selectedArticle.date}
                  </span>
                  <span className="text-xs text-slate-400">• {selectedArticle.readTime}</span>
                </div>
                <h3 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white leading-tight">
                  {selectedArticle.title}
                </h3>
                <p className="text-xs text-slate-500 mt-1">स्रोत: {selectedArticle.source}</p>
              </div>
              <button
                onClick={() => {
                  nepaliTts.stop();
                  setSelectedArticle(null);
                }}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-5 sm:p-6 space-y-5">
              {/* Audio Listen Bar */}
              <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/60 dark:border-slate-700/60">
                <span className="text-xs text-slate-600 dark:text-slate-300 font-medium flex items-center gap-1.5">
                  <Sparkles className="w-4 h-4 text-blue-500" />
                  नेपाली स्वरमा समाचार तथा परीक्षा तथ्य सुन्नुहोस्
                </span>
                <button
                  onClick={() => handleToggleAudio(selectedArticle)}
                  className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                    playingId === selectedArticle.id 
                      ? 'bg-rose-600 text-white' 
                      : 'bg-blue-600 hover:bg-blue-700 text-white'
                  }`}
                >
                  {playingId === selectedArticle.id ? (
                    <>
                      <VolumeX className="w-3.5 h-3.5" />
                      <span>आवाज बन्द गर्नुहोस्</span>
                    </>
                  ) : (
                    <>
                      <Volume2 className="w-3.5 h-3.5" />
                      <span>सुन्नुहोस् (Listen)</span>
                    </>
                  )}
                </button>
              </div>

              {/* Key Stats Cards */}
              {selectedArticle.keyStats && selectedArticle.keyStats.length > 0 && (
                <div>
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-2">
                    महत्वपूर्ण तथ्यांकहरू (Key Figures)
                  </h4>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                    {selectedArticle.keyStats.map((stat, idx) => (
                      <div key={idx} className="bg-slate-50 dark:bg-slate-800/60 p-3 rounded-xl border border-slate-200/50 dark:border-slate-700/50">
                        <span className="text-[11px] text-slate-500 dark:text-slate-400 block">{stat.label}</span>
                        <span className="text-sm font-bold text-slate-900 dark:text-white block mt-0.5">{stat.value}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Overview Summary */}
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-2">
                  घटनाको संक्षिप्त सार (Executive Summary)
                </h4>
                <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed bg-slate-50/50 dark:bg-slate-800/30 p-4 rounded-xl border border-slate-100 dark:border-slate-800">
                  {selectedArticle.summary}
                </p>
              </div>

              {/* Exam Point Highlight */}
              <div className="bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800/60 rounded-xl p-4">
                <div className="flex items-center gap-2 mb-1.5 text-amber-800 dark:text-amber-300 font-bold text-sm">
                  <Award className="w-4 h-4" />
                  <span>परीक्षा उपयोगी मुख्य बुँदा (High-Yield Exam Takeaway)</span>
                </div>
                <p className="text-sm text-amber-900 dark:text-amber-200 leading-relaxed">
                  {selectedArticle.examPoint}
                </p>
              </div>

              {/* Detailed Background Analysis */}
              {selectedArticle.detailedAnalysis && (
                <div>
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-2 flex items-center gap-1.5">
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
                    विस्तृत विश्लेषण र व्यावहारिक प्रभाव (In-Depth Analysis)
                  </h4>
                  <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
                    {selectedArticle.detailedAnalysis}
                  </p>
                </div>
              )}

              {/* Likely Exam Questions */}
              {selectedArticle.examQuestions && selectedArticle.examQuestions.length > 0 && (
                <div className="bg-blue-50/60 dark:bg-blue-950/30 border border-blue-200/60 dark:border-blue-800/40 rounded-xl p-4">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-blue-900 dark:text-blue-300 mb-2 flex items-center gap-1.5">
                    <HelpCircle className="w-4 h-4 text-blue-600" />
                    यस विषयबाट सोधिन सक्ने सम्भावित परीक्षा प्रश्नहरू
                  </h4>
                  <ul className="space-y-2">
                    {selectedArticle.examQuestions.map((q, qIdx) => (
                      <li key={qIdx} className="text-xs sm:text-sm text-slate-800 dark:text-slate-200 flex items-start gap-2">
                        <span className="text-blue-600 font-bold mt-0.5">•</span>
                        <span>{q}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>

            {/* Modal Footer Actions */}
            <div className="p-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between gap-3 bg-slate-50/50 dark:bg-slate-800/50 sticky bottom-0">
              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleBookmark(selectedArticle)}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                >
                  <Bookmark className={`w-3.5 h-3.5 ${isBookmarked('current-affair', selectedArticle.id) ? 'fill-amber-500 text-amber-500' : ''}`} />
                  <span>{isBookmarked('current-affair', selectedArticle.id) ? 'सुरक्षित गरियो' : 'बुकमार्क'}</span>
                </button>
                <button
                  onClick={() => handleShare(selectedArticle)}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                >
                  <Share2 className="w-3.5 h-3.5" />
                  <span>सेयर / कपी</span>
                </button>
              </div>

              <button
                onClick={() => {
                  setSelectedArticle(null);
                  nepaliTts.stop();
                  setActiveTab('current-affairs');
                }}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold bg-blue-600 hover:bg-blue-700 text-white shadow-sm transition-colors"
              >
                <span>समसामयिक भण्डारमा जानुहोस्</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};
