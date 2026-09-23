import React, { useState, useMemo } from 'react';
import { 
  Newspaper, 
  Calendar, 
  Bookmark, 
  Share2, 
  Search, 
  Sparkles, 
  ChevronRight, 
  ChevronDown,
  X, 
  Check, 
  Award,
  Globe2,
  TrendingUp,
  Building2,
  Trophy,
  Target,
  FileCheck2,
  HelpCircle,
  Clock,
  Layers,
  Cpu,
  BookOpen,
  Filter,
  Shield,
  RefreshCw,
  ExternalLink,
  Zap,
  CheckCircle2,
  ListOrdered
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { CurrentAffair } from '../../types';
import { MOCK_CURRENT_AFFAIRS } from '../../data/mockData';
import { safeCopyToClipboard } from '../../utils/safeHelpers';
import { 
  currentAffairsScraperService, 
  ScrapedNewsItem, 
  GorkhapatraWeeklyIssue 
} from '../../services/currentAffairsScraperService';

interface CategoryTab {
  id: string;
  nameEnglish: string;
  nameNepali: string;
  icon: React.ComponentType<{ className?: string }>;
}

const CATEGORY_TABS: CategoryTab[] = [
  {
    id: 'All',
    nameEnglish: 'All',
    nameNepali: 'सबै घटनाक्रम',
    icon: Layers
  },
  {
    id: 'Banking & Monetary',
    nameEnglish: 'Banking & Monetary',
    nameNepali: 'बैंकिङ तथा मौद्रिक नीति',
    icon: TrendingUp
  },
  {
    id: 'Economy & Budget',
    nameEnglish: 'Economy & Budget',
    nameNepali: 'अर्थतन्त्र र बजेट',
    icon: Building2
  },
  {
    id: 'National & Disaster',
    nameEnglish: 'National & Disaster',
    nameNepali: 'राष्ट्रिय, विपद् र सुशासन',
    icon: Shield
  },
  {
    id: 'Sports & International',
    nameEnglish: 'Sports & International',
    nameNepali: 'खेलकुद र अन्तर्राष्ट्रिय',
    icon: Trophy
  }
];

const NEWS_CATEGORIES = [
  'सबै',
  'नेपाल राष्ट्र बैंक',
  'मौद्रिक नीति',
  'जिडिपि',
  'बजेट',
  'नतिजा',
  'लोकसेवा',
  'समसामयिक',
  'विकास निर्माण'
];

// Helper to render bold markdown (**text**)
const renderFormattedText = (text: string) => {
  const parts = text.split(/(\*\*.*?\*\*)/g);
  return parts.map((part, i) => {
    if (part.startsWith('**') && part.endsWith('**')) {
      return (
        <strong key={i} className="font-extrabold text-[#0F172A]">
          {part.slice(2, -2)}
        </strong>
      );
    }
    return <span key={i}>{part}</span>;
  });
};

export const CurrentAffairsScreen: React.FC = () => {
  const { toggleBookmark, isBookmarked, addToast } = useApp();
  
  // View mode tab
  const [viewMode, setViewMode] = useState<'daily-scraper' | 'gorkhapatra' | 'timeline-archive'>('daily-scraper');
  
  // Timeline Archive States
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [onlyBookmarked, setOnlyBookmarked] = useState<boolean>(false);
  const [activeArticle, setActiveArticle] = useState<CurrentAffair | null>(null);
  const [copiedShare, setCopiedShare] = useState<boolean>(false);
  const [expandedCardIds, setExpandedCardIds] = useState<Record<string, boolean>>({});
  const [selectedYear, setSelectedYear] = useState<'All' | '2083' | '2082'>('All');

  // Scraper States
  const [scraperCategory, setScraperCategory] = useState<string>('सबै');
  const [scraperSearch, setScraperSearch] = useState<string>('');
  const [isSyncingNews, setIsSyncingNews] = useState<boolean>(false);
  const [syncTimestamp, setSyncTimestamp] = useState<string>(currentAffairsScraperService.getLastSyncTimeFormatted());
  const [scrapedNewsList, setScrapedNewsList] = useState<ScrapedNewsItem[]>(
    currentAffairsScraperService.getScrapedNews()
  );

  // Gorkhapatra States
  const [activeGorkhapatraTab, setActiveGorkhapatraTab] = useState<'objective' | 'subjective'>('objective');
  const [selectedGorkhapatraAnswers, setSelectedGorkhapatraAnswers] = useState<Record<number, number>>({});
  const [revealedGorkhapatraAnswers, setRevealedGorkhapatraAnswers] = useState<Record<number, boolean>>({});

  const weeklyIssues = useMemo(() => {
    return currentAffairsScraperService.getWeeklyGorkhapatraIssues();
  }, []);
  const [selectedIssueId, setSelectedIssueId] = useState<string>(weeklyIssues[0]?.issueId || '');

  const activeWeeklyIssue = useMemo(() => {
    return weeklyIssues.find(i => i.issueId === selectedIssueId) || weeklyIssues[0];
  }, [weeklyIssues, selectedIssueId]);

  // Sync latest news
  const handleSyncNews = async () => {
    setIsSyncingNews(true);
    try {
      const result = await currentAffairsScraperService.syncWithNationalPortals();
      setSyncTimestamp(result.syncTimestamp);
      setScrapedNewsList(currentAffairsScraperService.getScrapedNews(scraperCategory, scraperSearch));
      addToast(`ताजा समाचार सफलतापूर्वक अद्यावधिक गरियो (${result.syncedSources.length} स्रोतहरूबाट स्क्यान सम्पन्न)`, 'success');
    } catch {
      addToast('समाचार अद्यावधिक गर्दा प्राविधिक समस्या आयो।', 'error');
    } finally {
      setIsSyncingNews(false);
    }
  };

  // Filtered scraped news
  const filteredScrapedNews = useMemo(() => {
    return currentAffairsScraperService.getScrapedNews(scraperCategory, scraperSearch);
  }, [scraperCategory, scraperSearch, scrapedNewsList]);

  // Toggle in-card collapsible detail
  const toggleCardExpand = (id: string) => {
    setExpandedCardIds(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  // Filter logic for 16-month timeline
  const filteredAffairs = useMemo(() => {
    return MOCK_CURRENT_AFFAIRS.filter(item => {
      const matchesCategory = selectedCategory === 'All' || 
        item.category === selectedCategory ||
        (selectedCategory === 'Banking & Monetary' && (item.category === 'Banking & Monetary' || item.category === 'Economy & Banking')) ||
        (selectedCategory === 'Economy & Budget' && (item.category === 'Economy & Budget' || item.category === 'Economy & Banking')) ||
        (selectedCategory === 'National & Disaster' && (item.category === 'National & Disaster' || item.category === 'National & Governance' || item.category === 'Science, Tech & Environment')) ||
        (selectedCategory === 'Sports & International' && (item.category === 'Sports & International' || item.category === 'Sports & Awards' || item.category === 'International & Affairs'));

      const matchesYear = selectedYear === 'All' || (
        selectedYear === '2083' ? item.date.includes('२०८३') : item.date.includes('२०८२')
      );

      const matchesBookmark = !onlyBookmarked || isBookmarked('current-affair', item.id);

      const query = searchQuery.trim().toLowerCase();
      if (!query) {
        return matchesCategory && matchesYear && matchesBookmark;
      }

      const inTitle = item.title.toLowerCase().includes(query);
      const inSummary = item.summary.toLowerCase().includes(query);
      const inFacts = item.importantFacts ? item.importantFacts.some(f => f.toLowerCase().includes(query)) : false;
      const inPoints = item.points ? item.points.some(p => p.toLowerCase().includes(query)) : false;
      const inTags = item.tags ? item.tags.some(t => t.toLowerCase().includes(query)) : false;
      const inPoint = item.examPoint ? item.examPoint.toLowerCase().includes(query) : false;
      const inQuickFact = item.quickExamFact ? item.quickExamFact.toLowerCase().includes(query) : false;
      const inDate = item.date.toLowerCase().includes(query);

      return matchesCategory && matchesYear && matchesBookmark && (inTitle || inSummary || inFacts || inPoints || inTags || inPoint || inQuickFact || inDate);
    });
  }, [selectedCategory, selectedYear, searchQuery, onlyBookmarked, isBookmarked]);

  const categoryCounts = useMemo(() => {
    const counts: Record<string, number> = {
      All: MOCK_CURRENT_AFFAIRS.length,
      'Banking & Monetary': 0,
      'Economy & Budget': 0,
      'National & Disaster': 0,
      'Sports & International': 0
    };
    MOCK_CURRENT_AFFAIRS.forEach(item => {
      if (item.category === 'Banking & Monetary' || item.category === 'Economy & Banking') {
        counts['Banking & Monetary'] = (counts['Banking & Monetary'] || 0) + 1;
      }
      if (item.category === 'Economy & Budget') {
        counts['Economy & Budget'] = (counts['Economy & Budget'] || 0) + 1;
      }
      if (item.category === 'National & Disaster' || item.category === 'National & Governance' || item.category === 'Science, Tech & Environment') {
        counts['National & Disaster'] = (counts['National & Disaster'] || 0) + 1;
      }
      if (item.category === 'Sports & International' || item.category === 'Sports & Awards' || item.category === 'International & Affairs') {
        counts['Sports & International'] = (counts['Sports & International'] || 0) + 1;
      }
    });
    return counts;
  }, []);

  const handleShare = async (article?: CurrentAffair) => {
    const title = article ? article.title : 'Banking Tayari Nepal Current Affairs';
    const url = typeof window !== 'undefined' ? window.location.href : '';
    const textToShare = `${title} | Banking Tayari Nepal\n${url}`;
    const success = await safeCopyToClipboard(textToShare);
    if (success) {
      setCopiedShare(true);
      setTimeout(() => setCopiedShare(false), 2000);
    }
  };

  return (
    <div className="space-y-6 pb-16 text-[#0F172A] font-sans">
      
      {/* ========================================================================= */}
      {/* 1. TOP HERO HEADER (Clean Light Theme #F8FAFC / #FFFFFF)                   */}
      {/* ========================================================================= */}
      <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 relative overflow-hidden shadow-sm">
        <div className="absolute -right-10 -bottom-10 w-64 h-64 bg-blue-50/70 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 max-w-3xl space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 text-[#1E40AF] text-xs font-black border border-blue-200">
            <Sparkles className="w-3.5 h-3.5 text-[#1E40AF]" />
            <span>राष्ट्रिय समसामयिक तथा लोकसेवा विशेष अनुसन्धान हब</span>
          </div>
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black text-[#0F172A] tracking-tight">
            बैंकिङ तथा लोकसेवा समसामयिक तथ्य भण्डार
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
            नेपाल राष्ट्र बैंक, वाणिज्य बैंकहरू तथा लोकसेवा आयोगका परीक्षाका लागि दैनिक राष्ट्रिय पत्रपत्रिकाको स्वचालित स्क्रेपर (Scraper), साप्ताहिक बुधबारको गोरखापत्र विशेषाङ्क र १६ महिनाको बृहत् समसामयिक समयरेखा।
          </p>

          <div className="flex flex-wrap items-center gap-3 pt-2">
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-50 border border-slate-200 text-xs font-bold text-slate-800">
              <Zap className="w-3.5 h-3.5 text-amber-500" />
              <span>स्वचालित न्युज स्क्रेपर सक्रिय</span>
            </div>
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-50 border border-slate-200 text-xs font-bold text-slate-800">
              <Calendar className="w-3.5 h-3.5 text-[#1E40AF]" />
              <span>साप्ताहिक गोरखापत्र विशेषाङ्क</span>
            </div>
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-50 border border-slate-200 text-xs font-bold text-slate-800">
              <Target className="w-3.5 h-3.5 text-emerald-600" />
              <span>१६ महिनाको पूर्ण आर्काइभ</span>
            </div>
          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 2. PRIMARY VIEW MODE SELECTOR TABS                                         */}
      {/* ========================================================================= */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 p-1.5 bg-slate-100 rounded-2xl border border-slate-200">
        <button
          type="button"
          onClick={() => setViewMode('daily-scraper')}
          className={`py-3 px-4 rounded-xl text-xs sm:text-sm font-black flex items-center justify-center gap-2 transition cursor-pointer ${
            viewMode === 'daily-scraper'
              ? 'bg-[#1E40AF] text-white shadow-sm'
              : 'text-slate-600 hover:text-[#0F172A] hover:bg-white/60'
          }`}
        >
          <Zap className="w-4 h-4 text-amber-300" />
          <span>दैनिक समसामयिक क्याप्सूल (Daily News Scraper)</span>
        </button>

        <button
          type="button"
          onClick={() => setViewMode('gorkhapatra')}
          className={`py-3 px-4 rounded-xl text-xs sm:text-sm font-black flex items-center justify-center gap-2 transition cursor-pointer ${
            viewMode === 'gorkhapatra'
              ? 'bg-[#1E40AF] text-white shadow-sm'
              : 'text-slate-600 hover:text-[#0F172A] hover:bg-white/60'
          }`}
        >
          <BookOpen className="w-4 h-4 text-emerald-300" />
          <span>साप्ताहिक गोरखापत्र विशेषाङ्क (Wednesday Capsule)</span>
        </button>

        <button
          type="button"
          onClick={() => setViewMode('timeline-archive')}
          className={`py-3 px-4 rounded-xl text-xs sm:text-sm font-black flex items-center justify-center gap-2 transition cursor-pointer ${
            viewMode === 'timeline-archive'
              ? 'bg-[#1E40AF] text-white shadow-sm'
              : 'text-slate-600 hover:text-[#0F172A] hover:bg-white/60'
          }`}
        >
          <Layers className="w-4 h-4 text-blue-300" />
          <span>१६ महिनाको समसामयिक आर्काइभ (Master Timeline)</span>
        </button>
      </div>

      {/* ========================================================================= */}
      {/* MODE 1: DAILY NEWS SCRAPER CAPSULE                                        */}
      {/* ========================================================================= */}
      {viewMode === 'daily-scraper' && (
        <div className="space-y-6">
          
          {/* Controls Bar: Search, Category Filter, and Live Refresh Trigger */}
          <div className="p-4 sm:p-5 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-4">
            <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <span className="p-2 rounded-xl bg-blue-50 text-[#1E40AF]">
                  <Newspaper className="w-5 h-5" />
                </span>
                <div>
                  <h3 className="text-sm font-black text-[#0F172A]">
                    राष्ट्रिय दैनिक तथा आर्थिक पोर्टलहरूबाट स्वचालित संकलन
                  </h3>
                  <p className="text-xs text-slate-500">
                    नयाँ पत्रिका, राजधानी, अनलाइनखबर, कान्तिपुर र बिजमाण्डूबाट बैंकिङ/अर्थतन्त्र समसामयिक फिल्टर
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <span className="text-[11px] font-mono text-slate-500 hidden sm:inline">
                  अन्तिम सिङ्क: <strong>{syncTimestamp}</strong>
                </span>
                <button
                  type="button"
                  onClick={handleSyncNews}
                  disabled={isSyncingNews}
                  className="px-3.5 py-2 rounded-xl bg-[#1E40AF] hover:bg-[#1E3A8A] text-white font-bold text-xs flex items-center gap-2 transition shadow-xs cursor-pointer disabled:opacity-70"
                >
                  <RefreshCw className={`w-3.5 h-3.5 ${isSyncingNews ? 'animate-spin' : ''}`} />
                  <span>{isSyncingNews ? 'स्क्यान हुँदैछ...' : 'ताजा समाचार स्क्यान गर्नुहोस्'}</span>
                </button>
              </div>
            </div>

            {/* Filter Category Chips */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
              {NEWS_CATEGORIES.map(cat => {
                const isActive = scraperCategory === cat;
                return (
                  <button
                    key={cat}
                    type="button"
                    onClick={() => setScraperCategory(cat)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition whitespace-nowrap cursor-pointer ${
                      isActive
                        ? 'bg-[#0F172A] text-white shadow-xs'
                        : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                    }`}
                  >
                    {cat}
                  </button>
                );
              })}
            </div>

            {/* Keyword Search */}
            <div className="relative">
              <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                value={scraperSearch}
                onChange={e => setScraperSearch(e.target.value)}
                placeholder="समाचार शीर्षक, संस्था वा शब्दावली खोज्नुहोस् (उदा: मौद्रिक नीति, विदेशी मुद्रा, जीडीपी, नतिजा)..."
                className="w-full pl-10 pr-4 py-2 text-xs sm:text-sm rounded-xl bg-slate-50 border border-slate-200 text-[#0F172A] placeholder-slate-400 focus:outline-none focus:border-[#1E40AF]"
              />
            </div>
          </div>

          {/* Scraped News Feed */}
          <div className="space-y-4">
            {filteredScrapedNews.length === 0 ? (
              <div className="text-center py-12 bg-white rounded-2xl border border-slate-200 p-6">
                <HelpCircle className="w-8 h-8 text-slate-400 mx-auto mb-2" />
                <p className="text-sm font-bold text-slate-700">कुनै समाचार भेटिएन।</p>
                <p className="text-xs text-slate-500 mt-1">खोज शब्द वा विधा परिवर्तन गरी पुनः प्रयास गर्नुहोस्।</p>
              </div>
            ) : (
              filteredScrapedNews.map(item => (
                <article
                  key={item.id}
                  className="p-5 sm:p-6 rounded-2xl bg-white border border-slate-200 shadow-sm hover:border-blue-300 transition space-y-3 relative overflow-hidden"
                >
                  {item.isBreaking && (
                    <div className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md bg-red-100 text-red-700 text-[10px] font-black uppercase tracking-wider">
                      <Zap className="w-3 h-3 fill-current" />
                      <span>ताजा अद्यावधिक / Breaking</span>
                    </div>
                  )}

                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <span className="px-2.5 py-1 rounded-lg bg-blue-50 border border-blue-200 text-[#1E40AF] text-xs font-black">
                        {item.source}
                      </span>
                      <span className="px-2.5 py-1 rounded-lg bg-slate-100 text-slate-700 text-xs font-bold">
                        {item.category}
                      </span>
                    </div>

                    <div className="flex items-center gap-3 text-xs text-slate-500 font-medium">
                      <span>{item.dateNe}</span>
                      <span>•</span>
                      <span className="font-mono text-slate-400">{item.timestamp}</span>
                    </div>
                  </div>

                  <h3 className="text-base sm:text-lg font-black text-[#0F172A] leading-snug">
                    {item.title}
                  </h3>

                  <p className="text-xs sm:text-sm text-slate-700 leading-relaxed font-normal">
                    {item.summary}
                  </p>

                  {/* High Yield Exam Takeaway Box */}
                  <div className="p-3.5 rounded-xl bg-amber-50/80 border border-amber-200/80 text-xs space-y-1">
                    <div className="flex items-center gap-1.5 font-black text-amber-900">
                      <Target className="w-3.5 h-3.5 text-amber-700" />
                      <span>परीक्षाको दृष्टिकोणबाट महत्त्वपूर्ण बिन्दु (Exam Utility):</span>
                    </div>
                    <p className="text-slate-800 leading-relaxed font-medium">
                      {item.examTakeaway}
                    </p>
                  </div>

                  {/* Keywords Tag List */}
                  <div className="flex flex-wrap items-center gap-1.5 pt-1">
                    {item.keywords.map(kw => (
                      <span
                        key={kw}
                        className="px-2 py-0.5 rounded-md bg-slate-100 text-slate-600 text-[11px] font-semibold"
                      >
                        #{kw}
                      </span>
                    ))}
                  </div>
                </article>
              ))
            )}
          </div>

        </div>
      )}

      {/* ========================================================================= */}
      {/* MODE 2: WEDNESDAY GORKHAPATRA LOKSEWA SPECIAL CAPSULE                     */}
      {/* ========================================================================= */}
      {viewMode === 'gorkhapatra' && (
        <div className="space-y-6">
          
          {/* Issue Selector Header */}
          <div className="p-5 sm:p-6 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="space-y-1">
                <span className="px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200 text-xs font-black">
                  {activeWeeklyIssue.dayNe}
                </span>
                <h2 className="text-lg sm:text-xl font-black text-[#0F172A]">
                  {activeWeeklyIssue.issueTitleNe}
                </h2>
                <p className="text-xs text-slate-500 font-medium">
                  {activeWeeklyIssue.publishDateNe} • {activeWeeklyIssue.coordinatorNe}
                </p>
              </div>

              {/* Weekly Archive Dropdown */}
              <div className="flex items-center gap-2">
                <label className="text-xs font-bold text-slate-500">अङ्क छनोट:</label>
                <select
                  value={selectedIssueId}
                  onChange={e => setSelectedIssueId(e.target.value)}
                  className="px-3 py-1.5 text-xs rounded-xl bg-slate-50 border border-slate-300 font-bold text-[#0F172A] focus:outline-none"
                >
                  {weeklyIssues.map(issue => (
                    <option key={issue.issueId} value={issue.issueId}>
                      {issue.publishDateNe}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Objective vs Subjective Switcher */}
            <div className="flex items-center gap-2 pt-2 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setActiveGorkhapatraTab('objective')}
                className={`px-4 py-2 rounded-xl text-xs font-black flex items-center gap-1.5 transition cursor-pointer ${
                  activeGorkhapatraTab === 'objective'
                    ? 'bg-[#1E40AF] text-white shadow-xs'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
              >
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>वस्तुगत बहुवैकल्पिक प्रश्नोत्तर (Objective MCQs - {activeWeeklyIssue.objectiveQuestions.length})</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveGorkhapatraTab('subjective')}
                className={`px-4 py-2 rounded-xl text-xs font-black flex items-center gap-1.5 transition cursor-pointer ${
                  activeGorkhapatraTab === 'subjective'
                    ? 'bg-[#1E40AF] text-white shadow-xs'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
              >
                <ListOrdered className="w-3.5 h-3.5" />
                <span>विषयगत नमुना उत्तर (Subjective Framework - {activeWeeklyIssue.subjectiveQuestions.length})</span>
              </button>
            </div>
          </div>

          {/* Gorkhapatra Objective Tab */}
          {activeGorkhapatraTab === 'objective' && (
            <div className="space-y-4">
              {activeWeeklyIssue.objectiveQuestions.map((mcq, idx) => {
                const userSelected = selectedGorkhapatraAnswers[mcq.id];
                const isRevealed = revealedGorkhapatraAnswers[mcq.id];

                return (
                  <div
                    key={mcq.id}
                    className="p-5 sm:p-6 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-4"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-start gap-2.5">
                        <span className="w-6 h-6 rounded-full bg-blue-100 text-[#1E40AF] font-black text-xs flex items-center justify-center shrink-0 mt-0.5">
                          {idx + 1}
                        </span>
                        <h4 className="text-sm sm:text-base font-bold text-[#0F172A] leading-relaxed">
                          {mcq.questionNe}
                        </h4>
                      </div>
                    </div>

                    {/* Options Grid */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pl-8">
                      {mcq.optionsNe.map((opt, optIdx) => {
                        const isChosen = userSelected === optIdx;
                        const isCorrect = mcq.correctIndex === optIdx;

                        let btnStyle = 'bg-slate-50 border-slate-200 text-slate-800 hover:bg-slate-100';
                        if (isRevealed) {
                          if (isCorrect) {
                            btnStyle = 'bg-emerald-50 border-emerald-400 text-emerald-900 font-bold';
                          } else if (isChosen && !isCorrect) {
                            btnStyle = 'bg-red-50 border-red-300 text-red-800 line-through';
                          }
                        } else if (isChosen) {
                          btnStyle = 'bg-blue-50 border-blue-400 text-[#1E40AF] font-bold';
                        }

                        return (
                          <button
                            key={optIdx}
                            type="button"
                            onClick={() => {
                              setSelectedGorkhapatraAnswers(prev => ({ ...prev, [mcq.id]: optIdx }));
                              setRevealedGorkhapatraAnswers(prev => ({ ...prev, [mcq.id]: true }));
                            }}
                            className={`p-3 rounded-xl border text-left text-xs sm:text-sm transition flex items-center justify-between cursor-pointer ${btnStyle}`}
                          >
                            <span>
                              <strong className="mr-2">{String.fromCharCode(65 + optIdx)}.</strong>
                              {opt}
                            </span>
                            {isRevealed && isCorrect && (
                              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                            )}
                          </button>
                        );
                      })}
                    </div>

                    {/* Reveal and Explanation */}
                    {isRevealed && (
                      <div className="p-3.5 rounded-xl bg-blue-50/70 border border-blue-200 text-xs text-blue-950 space-y-1 ml-8">
                        <span className="font-black text-[#1E40AF]">व्याख्या तथा स्पष्टीकरण:</span>
                        <p className="leading-relaxed font-medium">{mcq.explanationNe}</p>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}

          {/* Gorkhapatra Subjective Tab */}
          {activeGorkhapatraTab === 'subjective' && (
            <div className="space-y-4">
              {activeWeeklyIssue.subjectiveQuestions.map((subj, idx) => (
                <div
                  key={subj.id}
                  className="p-5 sm:p-6 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-4"
                >
                  <div className="flex flex-wrap items-center justify-between gap-2 pb-2 border-b border-slate-100">
                    <span className="px-2.5 py-1 rounded-lg bg-blue-50 border border-blue-200 text-[#1E40AF] text-xs font-black">
                      प्रश्न {idx + 1} • {subj.level}
                    </span>
                    <span className="px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-900 text-xs font-black">
                      पूर्णाङ्क: {subj.marks} अङ्क
                    </span>
                  </div>

                  <h3 className="text-base sm:text-lg font-black text-[#0F172A] leading-snug">
                    {subj.questionNe}
                  </h3>

                  {/* Model Answer Breakdown Framework */}
                  <div className="space-y-2.5 pt-1">
                    <h4 className="text-xs font-black uppercase tracking-wider text-slate-500">
                      गोरखापत्र नमुना उत्तर लेखन संरचना (Model Framework):
                    </h4>
                    <div className="space-y-2">
                      {subj.modelAnswerFrameworkNe.map((point, pIdx) => (
                        <div
                          key={pIdx}
                          className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs sm:text-sm text-slate-800 leading-relaxed font-medium"
                        >
                          {point}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

        </div>
      )}

      {/* ========================================================================= */}
      {/* MODE 3: 16-MONTH MASTER TIMELINE ARCHIVE (2082 - 2083)                    */}
      {/* ========================================================================= */}
      {viewMode === 'timeline-archive' && (
        <div className="space-y-6">
          
          {/* Sector Filter Tabs */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5 text-xs font-extrabold text-slate-500 uppercase tracking-wider">
                <Filter className="w-3.5 h-3.5" />
                <span>क्षेत्रगत विधा छनोट (Sector Filters):</span>
              </div>

              {/* Timeline Quick Year Switch */}
              <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl text-xs font-bold">
                <button
                  type="button"
                  onClick={() => setSelectedYear('All')}
                  className={`px-2.5 py-1 rounded-lg transition cursor-pointer ${
                    selectedYear === 'All'
                      ? 'bg-white text-[#1E40AF] shadow-xs font-black'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  सबै (All)
                </button>
                <button
                  type="button"
                  onClick={() => setSelectedYear('2083')}
                  className={`px-2.5 py-1 rounded-lg transition cursor-pointer ${
                    selectedYear === '2083'
                      ? 'bg-white text-[#1E40AF] shadow-xs font-black'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  २०८३ साल
                </button>
                <button
                  type="button"
                  onClick={() => setSelectedYear('2082')}
                  className={`px-2.5 py-1 rounded-lg transition cursor-pointer ${
                    selectedYear === '2082'
                      ? 'bg-white text-[#1E40AF] shadow-xs font-black'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  २०८२ साल
                </button>
              </div>
            </div>

            {/* Category Tabs Strip */}
            <div className="flex items-center gap-2 overflow-x-auto pb-2 pt-1 scrollbar-none">
              {CATEGORY_TABS.map((tab) => {
                const Icon = tab.icon;
                const isSelected = selectedCategory === tab.id;
                const count = categoryCounts[tab.id] || 0;

                return (
                  <button
                    key={tab.id}
                    onClick={() => setSelectedCategory(tab.id)}
                    className={`px-3.5 py-2.5 rounded-2xl text-xs font-bold whitespace-nowrap transition-all duration-200 flex items-center gap-2.5 border cursor-pointer ${
                      isSelected
                        ? 'bg-[#1E40AF] text-white border-[#1E40AF] shadow-sm'
                        : 'bg-white text-slate-700 border-slate-200 hover:border-slate-300 hover:bg-slate-50 shadow-xs'
                    }`}
                  >
                    <Icon className={`w-4 h-4 shrink-0 ${isSelected ? 'text-white' : 'text-slate-400'}`} />
                    <div className="flex flex-col items-start text-left leading-tight">
                      <span className="font-extrabold">{tab.nameEnglish}</span>
                      <span className={`text-[10px] font-normal ${isSelected ? 'text-blue-100' : 'text-slate-500'}`}>
                        {tab.nameNepali}
                      </span>
                    </div>
                    <span className={`ml-1 px-1.5 py-0.5 rounded-full text-[10px] font-bold ${
                      isSelected 
                        ? 'bg-white/20 text-white' 
                        : 'bg-slate-100 text-slate-600'
                    }`}>
                      {count}
                    </span>
                  </button>
                );
              })}
            </div>

            {/* Search & Bookmark Bar */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 pt-1">
              <div className="relative flex-1">
                <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="शीर्षक, महिना, ऐन, तथ्याङ्क खोज्नुहोस् (उदा: मौद्रिक नीति, बजेट, २०८३ भदौ, २०८२ बैशाख, ५जी)..."
                  className="w-full pl-10 pr-10 py-2.5 text-xs sm:text-sm rounded-2xl bg-white border border-slate-200 text-[#0F172A] placeholder-slate-400 focus:outline-none focus:border-[#1E40AF] shadow-xs"
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery('')}
                    className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-slate-400 hover:text-slate-600"
                    title="हटाउनुहोस्"
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <button
                  onClick={() => setOnlyBookmarked(!onlyBookmarked)}
                  className={`px-4 py-2.5 rounded-2xl text-xs font-bold flex items-center gap-2 border transition shadow-xs cursor-pointer ${
                    onlyBookmarked
                      ? 'bg-amber-500 text-white border-amber-500'
                      : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
                  }`}
                >
                  <Bookmark className={`w-3.5 h-3.5 ${onlyBookmarked ? 'fill-current' : ''}`} />
                  <span>सुरक्षित गरिएका मात्र</span>
                </button>

                <button
                  onClick={() => handleShare()}
                  className="p-2.5 rounded-2xl bg-white border border-slate-200 text-slate-600 hover:text-[#1E40AF] hover:border-slate-300 transition shadow-xs cursor-pointer"
                  title="शेयर गर्नुहोस्"
                >
                  {copiedShare ? <Check className="w-4 h-4 text-emerald-600" /> : <Share2 className="w-4 h-4" />}
                </button>
              </div>
            </div>
          </div>

          {/* Timeline Cards Grid */}
          <div className="space-y-4">
            {filteredAffairs.length === 0 ? (
              <div className="p-12 text-center bg-white rounded-3xl border border-slate-200 shadow-sm space-y-3">
                <div className="w-12 h-12 rounded-2xl bg-slate-100 flex items-center justify-center mx-auto text-slate-400">
                  <Search className="w-6 h-6" />
                </div>
                <h3 className="text-base font-bold text-slate-800">
                  कुनै पनि घटनाक्रम भेटिएन
                </h3>
                <p className="text-xs text-slate-500 max-w-sm mx-auto">
                  तपाईंले खोज्नुभएको शब्द वा फिल्टर अनुसार कुनै नतिजा आएन। कृपया अन्य शब्द वा 'All' श्रेणी छानेर हेर्नुहोस्।
                </p>
                <button
                  onClick={() => {
                    setSelectedCategory('All');
                    setSelectedYear('All');
                    setSearchQuery('');
                    setOnlyBookmarked(false);
                  }}
                  className="px-4 py-2 rounded-xl bg-slate-900 text-white text-xs font-bold hover:bg-slate-800 transition"
                >
                  सबै फिल्टर रिसेट गर्नुहोस्
                </button>
              </div>
            ) : (
              filteredAffairs.map((item) => {
                const isExpanded = !!expandedCardIds[item.id];
                const bookmarked = isBookmarked('current-affair', item.id);

                return (
                  <article
                    key={item.id}
                    id={`affair-card-${item.id}`}
                    className="p-5 sm:p-6 rounded-3xl bg-white border border-slate-200 shadow-sm hover:border-blue-300 transition space-y-4"
                  >
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <span className="px-3 py-1 rounded-xl bg-blue-50 border border-blue-200 text-[#1E40AF] text-xs font-black">
                          {item.category}
                        </span>
                        <span className="text-xs font-bold text-slate-500 flex items-center gap-1">
                          <Calendar className="w-3.5 h-3.5" />
                          {item.date}
                        </span>
                      </div>

                      <div className="flex items-center gap-1">
                        <button
                          type="button"
                          onClick={() => toggleBookmark('current-affair', item.id, item.title, item.category)}
                          className={`p-2 rounded-xl border transition cursor-pointer ${
                            bookmarked
                              ? 'bg-amber-50 border-amber-300 text-amber-600'
                              : 'bg-slate-50 border-slate-200 text-slate-400 hover:text-slate-600'
                          }`}
                          title="बुकमार्क गर्नुहोस्"
                        >
                          <Bookmark className={`w-4 h-4 ${bookmarked ? 'fill-current' : ''}`} />
                        </button>

                        <button
                          type="button"
                          onClick={() => setActiveArticle(item)}
                          className="px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-[#0F172A] text-xs font-bold flex items-center gap-1 transition cursor-pointer"
                        >
                          <span>विस्तारमा</span>
                          <ChevronRight className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>

                    <h3 className="text-base sm:text-lg font-black text-[#0F172A] leading-snug">
                      {item.title}
                    </h3>

                    <p className="text-xs sm:text-sm text-slate-700 leading-relaxed font-normal">
                      {renderFormattedText(item.summary)}
                    </p>

                    {/* Quick Exam Fact Highlight */}
                    {item.quickExamFact && (
                      <div className="p-3 rounded-xl bg-amber-50/70 border border-amber-200 text-xs text-amber-950 font-medium">
                        <strong className="text-amber-900 mr-1.5 font-black">🎯 परीक्षाको तथ्य:</strong>
                        {item.quickExamFact}
                      </div>
                    )}

                    {/* Collapsible Deep Details */}
                    <div className="pt-1">
                      <button
                        type="button"
                        onClick={() => toggleCardExpand(item.id)}
                        className="text-xs font-bold text-[#1E40AF] hover:text-[#1E3A8A] flex items-center gap-1 transition cursor-pointer"
                      >
                        <span>{isExpanded ? 'कम विवरण हेर्नुहोस्' : 'मुख्य बुँदा तथा तथ्यहरू हेर्नुहोस्'}</span>
                        <ChevronDown className={`w-3.5 h-3.5 transition-transform ${isExpanded ? 'rotate-180' : ''}`} />
                      </button>

                      {isExpanded && (
                        <div className="mt-3 p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-3 text-xs text-slate-800">
                          {item.importantFacts && item.importantFacts.length > 0 && (
                            <div className="space-y-1.5">
                              <span className="font-black text-[#0F172A]">महत्त्वपूर्ण तथ्यहरू:</span>
                              <ul className="list-disc list-inside space-y-1 pl-1">
                                {item.importantFacts.map((fact, fIdx) => (
                                  <li key={fIdx} className="leading-relaxed font-medium">{fact}</li>
                                ))}
                              </ul>
                            </div>
                          )}

                          {item.points && item.points.length > 0 && (
                            <div className="space-y-1.5 pt-1">
                              <span className="font-black text-[#0F172A]">प्रमुख बुँदाहरू:</span>
                              <ul className="list-disc list-inside space-y-1 pl-1">
                                {item.points.map((pt, pIdx) => (
                                  <li key={pIdx} className="leading-relaxed font-medium">{pt}</li>
                                ))}
                              </ul>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  </article>
                );
              })
            )}
          </div>

        </div>
      )}

      {/* ========================================================================= */}
      {/* 3. MODAL FOR ARTICLE DETAIL VIEW                                          */}
      {/* ========================================================================= */}
      {activeArticle && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-2xl w-full max-h-[85vh] overflow-y-auto p-6 sm:p-8 space-y-5 border border-slate-200 shadow-2xl relative">
            <button
              type="button"
              onClick={() => setActiveArticle(null)}
              className="absolute top-5 right-5 p-2 rounded-full bg-slate-100 text-slate-500 hover:text-slate-800 hover:bg-slate-200 transition"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="space-y-2">
              <span className="px-3 py-1 rounded-xl bg-blue-50 text-[#1E40AF] text-xs font-black border border-blue-200">
                {activeArticle.category} • {activeArticle.date}
              </span>
              <h2 className="text-xl sm:text-2xl font-black text-[#0F172A] leading-snug">
                {activeArticle.title}
              </h2>
            </div>

            <p className="text-xs sm:text-sm text-slate-700 leading-relaxed">
              {renderFormattedText(activeArticle.summary)}
            </p>

            {activeArticle.quickExamFact && (
              <div className="p-3.5 rounded-2xl bg-amber-50 border border-amber-200 text-xs text-amber-950 font-medium">
                <strong className="text-amber-900 block font-black mb-1">🎯 परीक्षा विशेष तथ्य:</strong>
                {activeArticle.quickExamFact}
              </div>
            )}

            {activeArticle.importantFacts && activeArticle.importantFacts.length > 0 && (
              <div className="space-y-2">
                <h4 className="text-xs font-black uppercase tracking-wider text-slate-500">
                  विस्तृत तथ्याङ्क तथा विवरण:
                </h4>
                <div className="space-y-1.5">
                  {activeArticle.importantFacts.map((fact, idx) => (
                    <div key={idx} className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-800 leading-relaxed font-medium">
                      {fact}
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
              <button
                type="button"
                onClick={() => handleShare(activeArticle)}
                className="text-xs font-bold text-[#1E40AF] flex items-center gap-1.5"
              >
                {copiedShare ? <Check className="w-4 h-4 text-emerald-600" /> : <Share2 className="w-4 h-4" />}
                <span>{copiedShare ? 'लिङ्क कपी भयो' : 'शेयर गर्नुहोस्'}</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveArticle(null)}
                className="px-5 py-2.5 rounded-xl bg-[#0F172A] text-white text-xs font-bold hover:bg-slate-800 transition"
              >
                बन्द गर्नुहोस्
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
