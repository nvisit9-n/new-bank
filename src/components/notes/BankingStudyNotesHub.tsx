import React, { useState, useMemo, useEffect } from 'react';
import { 
  FileText, 
  Download, 
  Printer, 
  Bookmark, 
  Sparkles, 
  Search, 
  BookOpen, 
  CheckCircle2, 
  ChevronRight, 
  Layers, 
  Share2, 
  Eye, 
  ExternalLink, 
  Columns, 
  Maximize2, 
  Wifi, 
  WifiOff, 
  CloudCheck, 
  HardDriveDownload, 
  RefreshCw, 
  ShieldCheck, 
  Calculator, 
  Bot, 
  HelpCircle, 
  Check, 
  AlertCircle,
  Clock,
  Award,
  ChevronDown,
  ChevronUp,
  QrCode
} from 'lucide-react';
import { BANKING_EXAM_TOPICS_DATA, BankingExamTopicNote } from '../../data/bankingExamNotesData';
import { MarkdownRenderer } from '../common/MarkdownRenderer';
import { LatexFormulaRenderer } from './LatexFormulaRenderer';
import { PdfEmbedderViewer } from './PdfEmbedderViewer';
import { FinancialRatioCalculator } from './FinancialRatioCalculator';
import { TopicMcqQuiz } from './TopicMcqQuiz';
import { AiBankingStudyCompanion } from './AiBankingStudyCompanion';
import { downloadPdfNote, printPdfNote } from '../../utils/pdfDownloadEngine';
import { useApp } from '../../context/AppContext';
import { VoiceSearchButton } from '../common/VoiceSearchButton';
import { useOnlineStatus } from '../../hooks/useOnlineStatus';
import { 
  cacheAllStudyNotesOffline, 
  getOfflineStorageStats, 
  clearOfflineNotesCache, 
  OfflineCacheProgress, 
  OfflineStorageStats 
} from '../../services/offlineNotesCacheService';
import { PaywallService } from '../../services/paywallService';
import { PaywallModal } from '../paywall/PaywallModal';
import { AdminManualPaymentsDrawer } from '../paywall/AdminManualPaymentsDrawer';
import { SyllabusQuickDrawer } from './SyllabusQuickDrawer';
import { isUserAdmin, isOwnerAdmin } from '../../utils/sanitizer';

export type SuiteActiveTab = 'notes' | 'calculator' | 'mcq' | 'pdf' | 'ai';
export type NotesViewMode = 'text' | 'pdf' | 'split';

export const BankingStudyNotesHub: React.FC = () => {
  const { bookmarks, toggleBookmark, isBookmarked, addToast, user } = useApp();
  const isOnline = useOnlineStatus();

  // Suite Workspace State
  const [suiteTab, setSuiteTab] = useState<SuiteActiveTab>('notes');
  const [activeTopicId, setActiveTopicId] = useState<string>('financial-statement-ratio-analysis');
  const [viewMode, setViewMode] = useState<NotesViewMode>('text');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [isStatutoryExpanded, setIsStatutoryExpanded] = useState<boolean>(true);

  // Paywall & Access Control State
  const [isPaywallOpen, setIsPaywallOpen] = useState<boolean>(false);
  const [paywallAction, setPaywallAction] = useState<'download' | 'print'>('download');
  const [isAdminDrawerOpen, setIsAdminDrawerOpen] = useState<boolean>(false);
  const [isSyllabusDrawerOpen, setIsSyllabusDrawerOpen] = useState<boolean>(false);

  // Offline Caching State
  const [offlineStats, setOfflineStats] = useState<OfflineStorageStats>({
    totalTopics: BANKING_EXAM_TOPICS_DATA.length,
    cachedCount: 0,
    cachedTopicIds: [],
    isFullyCached: false,
    estimatedBytes: 0
  });
  const [isCachingAll, setIsCachingAll] = useState<boolean>(false);
  const [cacheProgress, setCacheProgress] = useState<OfflineCacheProgress | null>(null);

  const refreshCacheStats = async () => {
    try {
      const stats = await getOfflineStorageStats();
      setOfflineStats(stats);
    } catch {
      // ignore
    }
  };

  useEffect(() => {
    refreshCacheStats();
  }, []);

  const handleCacheAllOffline = async () => {
    if (isCachingAll) return;
    setIsCachingAll(true);
    setCacheProgress({
      total: BANKING_EXAM_TOPICS_DATA.length,
      completed: 0,
      currentTitle: 'सुरु गरिँदैछ...',
      isFinished: false
    });

    try {
      const success = await cacheAllStudyNotesOffline((progress) => {
        setCacheProgress(progress);
      });

      await refreshCacheStats();

      if (success) {
        addToast('सबै ५ वटा विषय र PDF फाइलहरू सफलतापूर्वक अफलाइन सेभ गरियो!', 'success');
      } else {
        addToast('केही फाइलहरू सेभ गर्न सकिएन। पुनः प्रयास गर्नुहोस्।', 'error');
      }
    } catch (err: any) {
      addToast(err?.message || 'अफलाइन क्यास गर्न सकिएन', 'error');
    } finally {
      setIsCachingAll(false);
      setTimeout(() => setCacheProgress(null), 4000);
    }
  };

  const handleClearCache = async () => {
    const ok = await clearOfflineNotesCache();
    if (ok) {
      await refreshCacheStats();
      addToast('अफलाइन क्यास खाली गरियो।', 'info');
    }
  };

  const activeTopic = useMemo(() => {
    return BANKING_EXAM_TOPICS_DATA.find(t => t.id === activeTopicId) || BANKING_EXAM_TOPICS_DATA[0];
  }, [activeTopicId]);

  // Search filter across topics
  const filteredTopics = useMemo(() => {
    if (!searchQuery.trim()) return BANKING_EXAM_TOPICS_DATA;
    const q = searchQuery.toLowerCase();
    return BANKING_EXAM_TOPICS_DATA.filter(
      t =>
        t.titleNe.toLowerCase().includes(q) ||
        t.titleEn.toLowerCase().includes(q) ||
        t.subtitleNe.toLowerCase().includes(q) ||
        t.categoryTag.toLowerCase().includes(q)
    );
  }, [searchQuery]);

  const isCurrentTopicBookmarked = isBookmarked('note', activeTopic.id);

  const handleToggleBookmark = () => {
    toggleBookmark(
      'note',
      activeTopic.id,
      `${activeTopic.titleNe} (${activeTopic.titleEn})`,
      activeTopic.categoryTag
    );
    addToast(
      isCurrentTopicBookmarked
        ? 'नोट्स बुकमार्कबाट हटाइयो'
        : 'नोट्स सफलतापूर्वक बुकमार्क गरियो!',
      'info'
    );
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: `${activeTopic.titleNe} - Banking Tayari Nepal`,
        text: activeTopic.summaryNe,
        url: window.location.href
      }).catch(() => {});
    } else {
      navigator.clipboard.writeText(window.location.href);
      addToast('नोट्स लिङ्क क्लिपबोर्डमा कपी गरियो!', 'info');
    }
  };

  const isAdmin = Boolean(
    user?.role === 'admin' ||
    (user?.email && (isUserAdmin(user.email) || isOwnerAdmin(user.email)))
  );

  const [isWindowBlurred, setIsWindowBlurred] = useState<boolean>(false);

  // Security & Anti-Screenshot / Anti-Copy protection for regular users
  useEffect(() => {
    if (isAdmin) return;

    const handleBlur = () => setIsWindowBlurred(true);
    const handleFocus = () => setIsWindowBlurred(false);
    const handleVisibilityChange = () => {
      if (document.hidden) {
        setIsWindowBlurred(true);
      } else {
        setIsWindowBlurred(false);
      }
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      // Block Ctrl+P / Cmd+P (Print)
      if ((e.ctrlKey || e.metaKey) && (e.key === 'p' || e.key === 'P')) {
        e.preventDefault();
        e.stopPropagation();
        addToast('सुरक्षा नीति: अनलाइन परीक्षा सामग्री प्रिन्ट गर्न निषेध गरिएको छ।', 'error');
        return false;
      }

      // Block Ctrl+S / Cmd+S (Save)
      if ((e.ctrlKey || e.metaKey) && (e.key === 's' || e.key === 'S')) {
        e.preventDefault();
        e.stopPropagation();
        addToast('सुरक्षा नीति: अनलाइन सामग्री सेभ गर्न प्रतिबन्धित छ।', 'error');
        return false;
      }

      // Block PrintScreen / Snipping Tool
      if (e.key === 'PrintScreen' || e.keyCode === 44) {
        e.preventDefault();
        setIsWindowBlurred(true);
        try {
          navigator.clipboard?.writeText?.('');
        } catch {
          // ignore
        }
        addToast('सुरक्षा नीति: स्क्रिनसट लिन निषेध गरिएको छ।', 'error');
        setTimeout(() => setIsWindowBlurred(false), 2500);
        return false;
      }

      // Block Ctrl+Shift+S (Snipping tool)
      if ((e.ctrlKey || e.metaKey) && e.shiftKey && (e.key === 's' || e.key === 'S')) {
        e.preventDefault();
        setIsWindowBlurred(true);
        addToast('सुरक्षा नीति: स्क्रिन क्याप्चर प्रतिबन्धित छ।', 'error');
        setTimeout(() => setIsWindowBlurred(false), 2500);
        return false;
      }

      // Block Ctrl+C / Cmd+C (Copy)
      if ((e.ctrlKey || e.metaKey) && (e.key === 'c' || e.key === 'C')) {
        e.preventDefault();
        addToast('सुरक्षा नीति: सामग्री प्रतिलिपि (Copy) गर्न प्रतिबन्धित छ।', 'info');
        return false;
      }
    };

    const handleContextMenu = (e: MouseEvent) => {
      e.preventDefault();
      addToast('सुरक्षा नीति: राइट-क्लिक मेनु निषेध गरिएको छ।', 'info');
      return false;
    };

    const handleCopy = (e: ClipboardEvent) => {
      e.preventDefault();
      addToast('प्रतिलिपि (Copy) निषेध गरिएको छ।', 'info');
      return false;
    };

    window.addEventListener('blur', handleBlur);
    window.addEventListener('focus', handleFocus);
    document.addEventListener('visibilitychange', handleVisibilityChange);
    window.addEventListener('keydown', handleKeyDown, true);
    document.addEventListener('contextmenu', handleContextMenu);
    document.addEventListener('copy', handleCopy);

    return () => {
      window.removeEventListener('blur', handleBlur);
      window.removeEventListener('focus', handleFocus);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('keydown', handleKeyDown, true);
      document.removeEventListener('contextmenu', handleContextMenu);
      document.removeEventListener('copy', handleCopy);
    };
  }, [isAdmin, addToast]);

  const handlePrintAction = () => {
    if (isAdmin) {
      printPdfNote(activeTopic);
    } else {
      addToast('डाउनलोड तथा प्रिन्ट सुविधा व्यवस्थापक (Admin) का लागि मात्र उपलब्ध छ।', 'warning');
    }
  };

  const handleDownloadAction = () => {
    if (isAdmin) {
      downloadPdfNote(activeTopic);
    } else {
      addToast('डाउनलोड तथा प्रिन्ट सुविधा व्यवस्थापक (Admin) का लागि मात्र उपलब्ध छ।', 'warning');
    }
  };

  return (
    <div className="space-y-6 pb-20 text-[#0F172A] font-sans">
      
      {/* ========================================================================= */}
      {/* 1. TOP SUITE WORKSPACE HEADER (Clean Light Theme #F8FAFC / #FFFFFF)        */}
      {/* ========================================================================= */}
      <div className="p-6 sm:p-8 rounded-3xl bg-white border border-slate-200 shadow-sm relative overflow-hidden">
        {/* Subtle decorative brand accents */}
        <div className="absolute top-0 right-0 w-72 h-72 bg-blue-50/80 rounded-full blur-3xl pointer-events-none -mr-16 -mt-16" />
        <div className="absolute bottom-0 left-1/4 w-60 h-60 bg-red-50/50 rounded-full blur-2xl pointer-events-none" />

        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-3 max-w-3xl">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="px-2.5 py-0.5 rounded-full bg-[#1E40AF] text-white font-black text-[11px] tracking-wider uppercase shadow-xs">
                BANKING TAYARI NEPAL
              </span>
              <span className="px-2.5 py-0.5 rounded-full bg-[#DC2626] text-white font-black text-[10px] tracking-wider uppercase flex items-center gap-1 shadow-xs">
                <Sparkles className="w-3 h-3 fill-current" />
                LIVE WORKSPACE
              </span>
              <span className="px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-700 border border-slate-200 font-bold text-[11px]">
                ५ मुख्य परीक्षा विषयहरू (Complete Syllabus)
              </span>

              {/* Quick Syllabus & Formula Drawer Toggle */}
              <button
                type="button"
                onClick={() => setIsSyllabusDrawerOpen(true)}
                className="px-2.5 py-0.5 rounded-full bg-blue-50 hover:bg-blue-100 text-[#1E40AF] border border-blue-200 font-bold text-[11px] flex items-center gap-1 transition cursor-pointer"
              >
                <Layers className="w-3 h-3" />
                <span>पाठ्यक्रम र सूत्र गाइड</span>
              </button>

              {/* Manual QR Payment Fallback Button */}
              <button
                type="button"
                onClick={() => {
                  setPaywallAction('download');
                  setIsPaywallOpen(true);
                }}
                className="px-2.5 py-0.5 rounded-full bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-300 font-bold text-[11px] flex items-center gap-1 transition cursor-pointer"
                title="eSewa / Khalti QR मार्फत भुक्तानी तथा VIP पहुँच"
              >
                <QrCode className="w-3 h-3 text-emerald-600" />
                <span>eSewa / Khalti QR भुक्तानी</span>
              </button>

              {/* Admin Manual Payment Review button */}
              {isAdmin && (
                <button
                  type="button"
                  onClick={() => setIsAdminDrawerOpen(true)}
                  className="px-2.5 py-0.5 rounded-full bg-amber-100 hover:bg-amber-200 text-amber-900 border border-amber-300 font-black text-[10.5px] flex items-center gap-1 transition cursor-pointer"
                >
                  <ShieldCheck className="w-3 h-3 text-amber-700" />
                  <span>म्यानुअल भुक्तानीहरू (Review Payments)</span>
                </button>
              )}
            </div>

            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black tracking-tight text-[#0F172A]">
              एकीकृत बैंकिङ परीक्षा अध्ययन सुइट (Integrated Banking Suite)
            </h1>
            <p className="text-sm text-slate-600 leading-relaxed font-medium">
              नेपाल राष्ट्र बैंक (NRB), राष्ट्रिय वाणिज्य बैंक (RBB), कृषि विकास बैंक (ADBL) तथा नेपाल बैंक (NBL) का लागि 
              विस्तृत नोट्स, अनुपात क्याल्कुलेटर, वस्तुगत MCQs, PDF इन्जिन र AI अध्ययन साथीको एकीकृत कार्यथलो।
            </p>
          </div>

          {/* Quick Search inside Workspace */}
          <div className="w-full lg:w-80 shrink-0 space-y-2">
            <div className="relative flex items-center">
              <Search className="absolute left-3.5 w-4 h-4 text-slate-400 pointer-events-none" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="विषय, अनुपात वा दफा खोज्नुहोस्..."
                className="w-full pl-10 pr-14 py-2.5 text-xs bg-[#F8FAFC] text-[#0F172A] placeholder-slate-400 rounded-xl border border-slate-300 focus:border-[#1E40AF] focus:ring-2 focus:ring-blue-100 focus:outline-none transition shadow-xs"
              />
              <div className="absolute right-1.5 flex items-center">
                <VoiceSearchButton
                  onTranscript={(text) => setSearchQuery(text)}
                  size="sm"
                  tooltipText="विषयको नाम बोल्नुहोस्"
                />
              </div>
            </div>
            <div className="text-[11px] text-slate-500 font-semibold flex items-center justify-between px-1">
              <span>५ वटा सम्पूर्ण विषयहरू उपलब्ध</span>
              <span className="text-[#1E40AF] font-bold">१००% पाठ्यक्रम कभरेज</span>
            </div>
          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 2. PWA OFFLINE CACHE MANAGEMENT BANNER (Clean Light Styling)              */}
      {/* ========================================================================= */}
      <div className={`p-4 rounded-2xl border transition-all shadow-xs ${
        !isOnline
          ? 'bg-amber-50/80 border-amber-300 text-amber-950'
          : offlineStats.isFullyCached
            ? 'bg-emerald-50/80 border-emerald-300 text-emerald-950'
            : 'bg-[#F8FAFC] border-slate-200 text-slate-800'
      }`}>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-start sm:items-center gap-3">
            <div className={`p-2.5 rounded-xl shrink-0 ${
              !isOnline 
                ? 'bg-amber-100 text-amber-800 border border-amber-300' 
                : offlineStats.isFullyCached 
                  ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                  : 'bg-blue-100 text-[#1E40AF] border border-blue-200'
            }`}>
              {!isOnline ? (
                <WifiOff className="w-5 h-5 text-amber-700" />
              ) : offlineStats.isFullyCached ? (
                <CloudCheck className="w-5 h-5 text-emerald-700" />
              ) : (
                <HardDriveDownload className="w-5 h-5 text-[#1E40AF]" />
              )}
            </div>

            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h3 className="text-xs sm:text-sm font-black text-[#0F172A]">
                  {!isOnline ? (
                    'अफलाइन अध्ययन मोड सक्रिय (Offline Mode Active)'
                  ) : offlineStats.isFullyCached ? (
                    'PWA Service Worker: १००% अफलाइन सुरक्षित (All 5 Notes & PDFs Cached)'
                  ) : (
                    'PWA अफलाइन क्यास व्यवस्थापन (Offline Notes & PDF Cache)'
                  )}
                </h3>
                <span className={`px-2 py-0.5 rounded text-[10px] font-black ${
                  offlineStats.isFullyCached 
                    ? 'bg-emerald-200 text-emerald-900' 
                    : 'bg-slate-200 text-slate-800'
                }`}>
                  {offlineStats.cachedCount} / {offlineStats.totalTopics} विषय सेभ
                </span>
              </div>
              <p className="text-xs text-slate-600 mt-0.5 font-medium">
                {!isOnline ? (
                  'तपाईँ इन्टरनेट बिना अध्ययन गर्दै हुनुहुन्छ। सबै ५ विषयका नोटहरू र क्यास गरिएका PDF फाइलहरू पूर्ण रूपमा खुल्नेछन्।'
                ) : offlineStats.isFullyCached ? (
                  'सबै ५ विषयका आधिकारिक परीक्षा नोट्स र PDF हरू स्थानीय ब्राउजर क्यासमा सुरक्षित छन्। इन्टरनेट विच्छेदन हुँदा पनि पढ्न सकिन्छ।'
                ) : (
                  'इन्टरनेट नहुँदा पनि पढ्नका लागि सबै ५ वटा विषयका नोट्स र PDF फाइलहरू एकै क्लिकमा अफलाइन सेभ गर्नुहोस्।'
                )}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 flex-wrap shrink-0">
            <button
              type="button"
              onClick={handleCacheAllOffline}
              disabled={isCachingAll}
              className={`px-3.5 py-2 rounded-xl text-xs font-black flex items-center gap-1.5 transition cursor-pointer shadow-xs ${
                offlineStats.isFullyCached
                  ? 'bg-emerald-600 hover:bg-emerald-700 text-white'
                  : 'bg-[#1E40AF] hover:bg-blue-800 text-white'
              }`}
            >
              {isCachingAll ? (
                <>
                  <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                  <span>क्यास गरिँदैछ...</span>
                </>
              ) : offlineStats.isFullyCached ? (
                <>
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>पुनः अपडेट गर्नुहोस्</span>
                </>
              ) : (
                <>
                  <HardDriveDownload className="w-3.5 h-3.5" />
                  <span>सबै अफलाइन सेभ गर्नुहोस्</span>
                </>
              )}
            </button>

            {offlineStats.cachedCount > 0 && (
              <button
                type="button"
                onClick={handleClearCache}
                className="px-2.5 py-2 rounded-xl text-xs font-bold bg-white hover:bg-slate-100 text-slate-700 border border-slate-200 transition cursor-pointer"
                title="अफलाइन क्यास खाली गर्नुहोस्"
              >
                क्यास खाली
              </button>
            )}
          </div>
        </div>

        {/* Cache Progress Bar if active */}
        {cacheProgress && (
          <div className="mt-3 pt-3 border-t border-slate-200/80 space-y-1.5">
            <div className="flex justify-between text-[11px] text-slate-700 font-bold">
              <span>{cacheProgress.currentTitle}</span>
              <span>{cacheProgress.completed} / {cacheProgress.total}</span>
            </div>
            <div className="w-full bg-slate-200 h-1.5 rounded-full overflow-hidden">
              <div 
                className="bg-[#1E40AF] h-full transition-all duration-300"
                style={{ width: `${(cacheProgress.completed / cacheProgress.total) * 100}%` }}
              />
            </div>
          </div>
        )}
      </div>

      {/* ========================================================================= */}
      {/* 3. CONSOLIDATED 5-IN-1 SUITE TOOLBAR (Tab Switching)                      */}
      {/* ========================================================================= */}
      <div className="bg-white p-2 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between gap-2 overflow-x-auto">
        <div className="flex items-center gap-1.5 min-w-max">
          <button
            type="button"
            onClick={() => setSuiteTab('notes')}
            className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm font-black flex items-center gap-2 transition cursor-pointer ${
              suiteTab === 'notes'
                ? 'bg-[#1E40AF] text-white shadow-xs'
                : 'bg-transparent text-slate-700 hover:bg-slate-100 hover:text-[#1E40AF]'
            }`}
          >
            <BookOpen className="w-4 h-4" />
            <span>विस्तृत नोट्स (Notes Hub)</span>
          </button>

          <button
            type="button"
            onClick={() => setSuiteTab('calculator')}
            className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm font-black flex items-center gap-2 transition cursor-pointer ${
              suiteTab === 'calculator'
                ? 'bg-[#1E40AF] text-white shadow-xs'
                : 'bg-transparent text-slate-700 hover:bg-slate-100 hover:text-[#1E40AF]'
            }`}
          >
            <Calculator className="w-4 h-4" />
            <span>अनुपात क्याल्कुलेटर (Calculator)</span>
            <span className="px-1.5 py-0.2 rounded text-[9px] font-black bg-[#DC2626] text-white">
              LIVE
            </span>
          </button>

          <button
            type="button"
            onClick={() => setSuiteTab('mcq')}
            className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm font-black flex items-center gap-2 transition cursor-pointer ${
              suiteTab === 'mcq'
                ? 'bg-[#1E40AF] text-white shadow-xs'
                : 'bg-transparent text-slate-700 hover:bg-slate-100 hover:text-[#1E40AF]'
            }`}
          >
            <Award className="w-4 h-4" />
            <span>अन्तरक्रियात्मक MCQs (Quiz)</span>
          </button>

          <button
            type="button"
            onClick={() => setSuiteTab('pdf')}
            className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm font-black flex items-center gap-2 transition cursor-pointer ${
              suiteTab === 'pdf'
                ? 'bg-[#1E40AF] text-white shadow-xs'
                : 'bg-transparent text-slate-700 hover:bg-slate-100 hover:text-[#1E40AF]'
            }`}
          >
            <FileText className="w-4 h-4" />
            <span>PDF एम्बेडेड भ्युअर (PDF Viewer)</span>
          </button>

          <button
            type="button"
            onClick={() => setSuiteTab('ai')}
            className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm font-black flex items-center gap-2 transition cursor-pointer ${
              suiteTab === 'ai'
                ? 'bg-[#1E40AF] text-white shadow-xs'
                : 'bg-transparent text-slate-700 hover:bg-slate-100 hover:text-[#1E40AF]'
            }`}
          >
            <Bot className="w-4 h-4" />
            <span>AI अध्ययन साथी (AI Companion)</span>
            <span className="px-1.5 py-0.2 rounded text-[9px] font-black bg-blue-100 text-[#1E40AF]">
              NEW
            </span>
          </button>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 4. DYNAMIC TOPIC SELECTOR CHIPS (TOPIC 1 TO TOPIC 5)                      */}
      {/* ========================================================================= */}
      <div className="space-y-2">
        <div className="flex items-center justify-between text-xs font-black text-slate-500 uppercase tracking-wider px-1">
          <span>५ मुख्य परीक्षा विषयहरू (Select Topic):</span>
          <span className="text-[#1E40AF] font-bold">
            हाल सक्रिय: विषय {activeTopic.topicNumber}
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-2.5">
          {filteredTopics.map((topic) => {
            const isSelected = topic.id === activeTopic.id;
            return (
              <button
                key={topic.id}
                type="button"
                onClick={() => setActiveTopicId(topic.id)}
                className={`p-3.5 rounded-2xl text-left transition-all border cursor-pointer relative ${
                  isSelected
                    ? 'bg-[#1E40AF] text-white border-[#1E40AF] shadow-md ring-2 ring-blue-300'
                    : 'bg-white text-slate-800 border-slate-200 hover:border-blue-300 hover:bg-blue-50/30'
                }`}
              >
                <div className="flex items-center justify-between gap-1 mb-1.5">
                  <span className={`px-2 py-0.5 rounded-md text-[10px] font-black tracking-wider uppercase ${
                    isSelected ? 'bg-white/20 text-white' : 'bg-slate-100 text-slate-700'
                  }`}>
                    TOPIC {topic.topicNumber}
                  </span>
                  <span className={`text-[10px] font-bold ${
                    isSelected ? 'text-blue-100' : 'text-[#DC2626]'
                  }`}>
                    {topic.examWeightage.split(' ')[0]}
                  </span>
                </div>

                <h3 className={`text-xs sm:text-sm font-black line-clamp-1 leading-snug ${
                  isSelected ? 'text-white' : 'text-[#0F172A]'
                }`}>
                  {topic.titleNe}
                </h3>
                <p className={`text-[11px] truncate mt-0.5 font-medium ${
                  isSelected ? 'text-blue-100' : 'text-slate-500'
                }`}>
                  {topic.titleEn}
                </p>

                <div className="flex items-center justify-between mt-2 pt-2 border-t border-white/20 text-[10px]">
                  <span className={`flex items-center gap-1 ${isSelected ? 'text-blue-100' : 'text-slate-500'}`}>
                    <Clock className="w-3 h-3" />
                    {topic.readTime}
                  </span>
                  {isSelected && (
                    <span className="font-bold flex items-center gap-0.5">
                      पढ्दै <ChevronRight className="w-3 h-3" />
                    </span>
                  )}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 5. ACTIVE TAB VIEWPORT ROUTING                                            */}
      {/* ========================================================================= */}
      
      {/* A. RATIO CALCULATOR TAB */}
      {suiteTab === 'calculator' && (
        <FinancialRatioCalculator />
      )}

      {/* B. INTERACTIVE MCQS TAB */}
      {suiteTab === 'mcq' && (
        <TopicMcqQuiz initialTopicNumber={activeTopic.topicNumber} />
      )}

      {/* C. PDF EMBEDDER VIEWER TAB */}
      {suiteTab === 'pdf' && (
        <PdfEmbedderViewer 
          note={activeTopic}
          isBookmarked={isCurrentTopicBookmarked}
          onBookmark={handleToggleBookmark}
          onTriggerPaywall={(act) => {
            setPaywallAction(act);
            setIsPaywallOpen(true);
          }}
        />
      )}

      {/* D. AI COMPANION TAB */}
      {suiteTab === 'ai' && (
        <AiBankingStudyCompanion currentTopic={activeTopic} />
      )}

      {/* E. STUDY NOTES HUB TAB (Notes View with Text/PDF/Split Toggles) */}
      {suiteTab === 'notes' && (
        <div className="space-y-6">
          
          {/* Notes Top Sub-bar: View Modes + Action Controls */}
          <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black bg-blue-100 text-[#1E40AF]">
                  {activeTopic.categoryTag}
                </span>
                <span className="text-xs font-bold text-slate-500">
                  {activeTopic.paperReference}
                </span>
                <span className="px-2 py-0.5 rounded text-[10px] font-black bg-[#DC2626] text-white">
                  {activeTopic.examWeightage}
                </span>
              </div>
              <h2 className="text-lg sm:text-xl font-black text-[#0F172A] mt-1">
                {activeTopic.titleNe} ({activeTopic.titleEn})
              </h2>
            </div>

            {/* View Mode Switcher + Action Buttons */}
            <div className="flex items-center gap-2 flex-wrap">
              {/* View Mode Toggle: [Text View] | [PDF Embedder] | [Hybrid Split] */}
              <div className="flex items-center bg-[#F8FAFC] rounded-xl p-1 border border-slate-200 text-xs">
                <button
                  type="button"
                  onClick={() => setViewMode('text')}
                  className={`px-3 py-1.5 rounded-lg font-black transition cursor-pointer flex items-center gap-1.5 ${
                    viewMode === 'text'
                      ? 'bg-[#1E40AF] text-white shadow-xs'
                      : 'text-slate-600 hover:text-[#1E40AF]'
                  }`}
                >
                  <Eye className="w-3.5 h-3.5" />
                  <span>Text View</span>
                </button>

                <button
                  type="button"
                  onClick={() => setViewMode('pdf')}
                  className={`px-3 py-1.5 rounded-lg font-black transition cursor-pointer flex items-center gap-1.5 ${
                    viewMode === 'pdf'
                      ? 'bg-[#1E40AF] text-white shadow-xs'
                      : 'text-slate-600 hover:text-[#1E40AF]'
                  }`}
                >
                  <FileText className="w-3.5 h-3.5" />
                  <span>PDF Embedder</span>
                </button>

                <button
                  type="button"
                  onClick={() => setViewMode('split')}
                  className={`px-3 py-1.5 rounded-lg font-black transition cursor-pointer flex items-center gap-1.5 ${
                    viewMode === 'split'
                      ? 'bg-[#1E40AF] text-white shadow-xs'
                      : 'text-slate-600 hover:text-[#1E40AF]'
                  }`}
                >
                  <Columns className="w-3.5 h-3.5" />
                  <span>Hybrid Split</span>
                </button>
              </div>

              {/* Bookmark Button */}
              <button
                type="button"
                onClick={handleToggleBookmark}
                className={`p-2 rounded-xl border text-xs font-bold flex items-center gap-1 transition cursor-pointer ${
                  isCurrentTopicBookmarked
                    ? 'bg-amber-100 text-amber-900 border-amber-300'
                    : 'bg-white text-slate-700 hover:bg-slate-100 border-slate-200'
                }`}
                title="बुकमार्क"
              >
                <Bookmark className={`w-4 h-4 ${isCurrentTopicBookmarked ? 'fill-current text-amber-600' : ''}`} />
              </button>

              {/* Direct Print & Download Buttons (Admin RBAC Only) */}
              {isAdmin ? (
                <>
                  <button
                    type="button"
                    onClick={handlePrintAction}
                    className="px-3 py-1.5 rounded-xl bg-white hover:bg-slate-100 text-slate-700 border border-slate-200 text-xs font-bold flex items-center gap-1.5 transition cursor-pointer"
                    title="नोट्स प्रिन्ट गर्नुहोस् (Admin)"
                  >
                    <Printer className="w-3.5 h-3.5 text-slate-700" />
                    <span className="hidden sm:inline">प्रिन्ट</span>
                  </button>

                  <button
                    type="button"
                    onClick={handleDownloadAction}
                    className="px-3.5 py-1.5 rounded-xl bg-[#1E40AF] hover:bg-blue-800 text-white text-xs font-black flex items-center gap-1.5 transition cursor-pointer shadow-xs"
                    title="PDF डाउनलोड (Admin)"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>PDF डाउनलोड</span>
                  </button>
                </>
              ) : (
                <div className="flex items-center gap-2">
                  <div 
                    className="px-3 py-1.5 rounded-xl bg-slate-100 text-slate-700 border border-slate-200 text-xs font-bold flex items-center gap-1.5 select-none cursor-default"
                    title="विद्यार्थी अध्ययन मोड: सम्पूर्ण नोट्स पढ्न निःशुल्क उपलब्ध (PDF डाउनलोड र प्रिन्ट एडमिनका लागि मात्र)"
                  >
                    <Eye className="w-3.5 h-3.5 text-[#1E40AF]" />
                    <span>View-Only Mode</span>
                  </div>

                  <button
                    type="button"
                    onClick={() => {
                      setPaywallAction('download');
                      setIsPaywallOpen(true);
                    }}
                    className="px-3 py-1.5 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-300 text-xs font-bold flex items-center gap-1.5 transition cursor-pointer"
                    title="PDF डाउनलोडका लागि QR स्क्यान गर्नुहोस्"
                  >
                    <QrCode className="w-3.5 h-3.5 text-emerald-600" />
                    <span>QR भुक्तानी</span>
                  </button>
                </div>
              )}

              {/* Share Button */}
              <button
                type="button"
                onClick={handleShare}
                className="p-2 rounded-xl bg-white hover:bg-slate-100 text-slate-700 border border-slate-200 transition cursor-pointer"
                title="साझा गर्नुहोस्"
              >
                <Share2 className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Clean White Rounded Card 1: DEFINITIONS ("परिभाषा:") */}
          {activeTopic.definitionCard && (
            <div className="p-5 sm:p-6 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-2 relative overflow-hidden">
              <div className="flex items-center justify-between gap-2 border-b border-slate-100 pb-2">
                <span className="px-2.5 py-0.5 rounded-md text-[11px] font-black bg-blue-100 text-[#1E40AF] uppercase tracking-wider flex items-center gap-1">
                  <BookOpen className="w-3.5 h-3.5" />
                  परिभाषा (Official Definition)
                </span>
                <span className="text-[11px] font-bold text-slate-500">
                  {activeTopic.definitionCard.source}
                </span>
              </div>
              <h3 className="text-base font-black text-[#0F172A]">
                {activeTopic.definitionCard.termNe} ({activeTopic.definitionCard.termEn})
              </h3>
              <p className="text-xs sm:text-sm text-slate-700 leading-relaxed font-medium">
                {activeTopic.definitionCard.definitionNe}
              </p>
            </div>
          )}

          {/* Clean White Rounded Card 2: STATUTORY PROVISIONS ("ऐन, कानूनी व्यवस्था") - Fixed Overlap Bug */}
          {activeTopic.statutoryCard && (
            <div className="rounded-2xl bg-white border border-slate-200 shadow-sm overflow-hidden my-4 relative z-0">
              <button
                type="button"
                onClick={() => setIsStatutoryExpanded(prev => !prev)}
                className={`w-full p-4 sm:p-5 flex items-center justify-between text-left hover:bg-slate-50 transition cursor-pointer ${
                  isStatutoryExpanded ? 'border-b border-slate-200' : ''
                }`}
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div className="p-2.5 rounded-xl bg-blue-50 text-[#1E40AF] border border-blue-200 shrink-0">
                    <ShieldCheck className="w-4 h-4" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <h3 className="text-sm sm:text-base font-black text-[#0F172A] leading-normal break-words">
                      ऐन, कानूनी व्यवस्था तथा नियामकीय प्रावधानहरू
                    </h3>
                    <p className="text-xs text-slate-500 font-medium break-words mt-1 leading-normal">
                      {activeTopic.statutoryCard.actTitleNe} ({activeTopic.statutoryCard.clauses.length} वटा प्रमुख कानूनी दफाहरू)
                    </p>
                  </div>
                </div>
                <div className="shrink-0 ml-3">
                  {isStatutoryExpanded ? (
                    <ChevronUp className="w-5 h-5 text-slate-500" />
                  ) : (
                    <ChevronDown className="w-5 h-5 text-slate-500" />
                  )}
                </div>
              </button>

              {isStatutoryExpanded && (
                <div className="p-4 sm:p-5 bg-slate-50/50 grid grid-cols-1 md:grid-cols-2 gap-3.5">
                  {activeTopic.statutoryCard.clauses.map((clause, idx) => (
                    <div key={idx} className="p-3.5 rounded-xl bg-white border border-slate-200 text-xs space-y-1.5 shadow-xs">
                      <div className="flex items-center justify-between gap-2 flex-wrap">
                        <span className="font-black text-[#1E40AF] bg-blue-50 px-2 py-0.5 rounded border border-blue-100">{clause.clause}</span>
                        <span className="font-bold text-slate-900">{clause.title}</span>
                      </div>
                      <p className="text-slate-600 leading-relaxed font-medium pt-1">
                        {clause.description}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Security Window Blur Shield Overlay (Non-Admin Viewers) */}
          {isWindowBlurred && !isAdmin && (
            <div 
              onClick={() => setIsWindowBlurred(false)}
              className="fixed inset-0 z-50 bg-slate-900/75 backdrop-blur-md flex flex-col items-center justify-center p-6 text-center animate-fadeIn select-none cursor-pointer"
            >
              <div className="max-w-md p-6 sm:p-8 rounded-3xl bg-white border border-slate-200 shadow-2xl space-y-4">
                <div className="w-14 h-14 rounded-2xl bg-blue-50 text-[#1E40AF] border border-blue-200 flex items-center justify-center mx-auto">
                  <ShieldCheck className="w-7 h-7" />
                </div>
                <div className="space-y-2">
                  <h4 className="text-lg font-black text-[#0F172A]">सुरक्षा नीति सक्रिय (Protection Active)</h4>
                  <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-medium">
                    अनधिकृत स्क्रिन क्याप्चर तथा प्रतिलिपि रोक्न विन्डो निष्क्रिय हुँदा सामग्री धमिलो गरिएको छ। अध्ययन जारी राख्न यहाँ क्लिक गर्नुहोस्।
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setIsWindowBlurred(false)}
                  className="px-6 py-2.5 rounded-xl bg-[#1E40AF] text-white text-xs font-black hover:bg-blue-800 transition shadow-xs"
                >
                  अध्ययन जारी राख्नुहोस् (Continue Reading)
                </button>
              </div>
            </div>
          )}

          {/* Hybrid Split or Text View Mode Execution - Wrapped in Protected Container */}
          <div className={`${!isAdmin ? 'protected-notes-container select-none' : ''}`}>
            <div className={`${viewMode === 'split' ? 'grid grid-cols-1 lg:grid-cols-2 gap-6 items-start' : 'space-y-6'}`}>
            
            {/* Left Column (or full width): Markdown Text + Ratios + Comparisons + Exam Questions */}
            {(viewMode === 'text' || viewMode === 'split') && (
              <div className="space-y-6">
                
                {/* Formulas Grid if any */}
                {activeTopic.ratios && activeTopic.ratios.length > 0 && (
                  <LatexFormulaRenderer 
                    ratios={activeTopic.ratios} 
                    onOpenCalculator={() => setSuiteTab('calculator')} 
                  />
                )}

                {/* Comparison Matrix Table if any */}
                {activeTopic.comparisonTable && (
                  <div className="p-5 sm:p-6 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-3">
                    <h3 className="text-base font-black text-[#0F172A] flex items-center gap-2">
                      <Layers className="w-4 h-4 text-[#1E40AF]" />
                      {activeTopic.comparisonTable.titleNe}
                    </h3>
                    <div className="overflow-x-auto rounded-xl border border-slate-200">
                      <table className="w-full text-xs text-left border-collapse">
                        <thead>
                          <tr className="bg-slate-100 text-[#0F172A] font-black border-b border-slate-200">
                            <th className="p-3 border-r border-slate-200">{activeTopic.comparisonTable.column1Header}</th>
                            <th className="p-3 border-r border-slate-200">{activeTopic.comparisonTable.column2Header}</th>
                            <th className="p-3">{activeTopic.comparisonTable.column3Header || 'विवरण'}</th>
                          </tr>
                        </thead>
                        <tbody>
                          {activeTopic.comparisonTable.rows.map((row, idx) => (
                            <tr key={idx} className={idx % 2 === 0 ? 'bg-white' : 'bg-slate-50'}>
                              <td className="p-3 border-r border-slate-200 font-bold text-[#0F172A]">
                                {row.parameterNe}
                                <span className="block text-[10px] text-slate-400 font-normal">{row.parameterEn}</span>
                              </td>
                              <td className="p-3 border-r border-slate-200 text-slate-700 leading-relaxed font-medium">
                                {row.column1Value}
                              </td>
                              <td className="p-3 text-slate-700 leading-relaxed font-medium">
                                {row.column2Value}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}

                {/* Comprehensive High-Yield Markdown Body Content */}
                <div className="p-5 sm:p-8 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-4 text-slate-900 leading-relaxed">
                  <MarkdownRenderer content={activeTopic.markdownContent} />
                </div>

                {/* Probable Exam Questions & Model Answers */}
                {activeTopic.probableExamQuestions && (
                  <div className="p-5 sm:p-6 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-4">
                    <div className="flex items-center justify-between pb-3 border-b border-slate-200">
                      <div>
                        <h3 className="text-base font-black text-[#0F172A] flex items-center gap-2">
                          <Award className="w-4 h-4 text-[#1E40AF]" />
                          सम्भावित परीक्षा प्रश्न तथा उत्तर संरचना (Model Exam Framework)
                        </h3>
                        <p className="text-xs text-slate-500 font-medium mt-0.5">
                          लोकसेवा आयोग र बैंक अधिकृत परीक्षामा सोधिने ५ र १० अङ्कका नमुना प्रश्नहरू
                        </p>
                      </div>
                      <button
                        type="button"
                        onClick={() => setSuiteTab('ai')}
                        className="px-3 py-1 rounded-xl bg-blue-50 hover:bg-blue-100 text-[#1E40AF] text-xs font-black border border-blue-200 transition cursor-pointer flex items-center gap-1"
                      >
                        AI सँग उत्तर छलफल <ChevronRight className="w-3 h-3" />
                      </button>
                    </div>

                    <div className="space-y-4">
                      {activeTopic.probableExamQuestions.map((q, idx) => (
                        <div key={idx} className="p-4 rounded-xl bg-[#F8FAFC] border border-slate-200 text-xs space-y-2.5">
                          <div className="flex items-start justify-between gap-3">
                            <div>
                              <span className="font-black text-xs sm:text-sm text-[#0F172A] leading-snug">
                                प्रश्न {idx + 1}: {q.questionNe}
                              </span>
                              <p className="text-[11px] text-slate-500 font-medium mt-0.5">
                                {q.questionEn}
                              </p>
                            </div>
                            <span className="px-2.5 py-1 rounded-lg text-xs font-black bg-[#1E40AF] text-white shrink-0">
                              {q.marks} अङ्क
                            </span>
                          </div>

                          <div className="p-3 bg-white rounded-xl border border-slate-200 space-y-1.5">
                            <span className="text-[11px] font-black text-amber-700 uppercase tracking-wider block">
                              उत्तर संरचना रूपरेखा (Model Answer Framework):
                            </span>
                            <div className="space-y-1">
                              {q.modelAnswerFramework.map((point, pIdx) => (
                                <div key={pIdx} className="text-slate-700 flex items-start gap-1.5 font-medium">
                                  <span className="text-[#1E40AF] font-bold">•</span>
                                  <span>{point}</span>
                                </div>
                              ))}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

              </div>
            )}

            {/* Right Column (in Split Mode) or Full Screen (in PDF Mode): Embedded PDF Engine */}
            {(viewMode === 'pdf' || viewMode === 'split') && (
              <div className={`${viewMode === 'split' ? 'sticky top-4' : ''}`}>
                <PdfEmbedderViewer
                  note={activeTopic}
                  isBookmarked={isCurrentTopicBookmarked}
                  onBookmark={handleToggleBookmark}
                  onTriggerPaywall={(act) => {
                    setPaywallAction(act);
                    setIsPaywallOpen(true);
                  }}
                />
              </div>
            )}

          </div>
        </div>

        </div>
      )}

      {/* ========================================================================= */}
      {/* 6. MODALS & COLLAPSIBLE DRAWERS                                           */}
      {/* ========================================================================= */}

      {/* Paywall Access Control Modal */}
      <PaywallModal
        isOpen={isPaywallOpen}
        onClose={() => setIsPaywallOpen(false)}
        targetTopic={activeTopic}
        actionType={paywallAction}
        onSuccessUnlock={() => {
          if (paywallAction === 'download') {
            downloadPdfNote(activeTopic);
          } else {
            printPdfNote(activeTopic);
          }
        }}
      />

      {/* Admin Manual Payment Review Drawer */}
      <AdminManualPaymentsDrawer
        isOpen={isAdminDrawerOpen}
        onClose={() => setIsAdminDrawerOpen(false)}
      />

      {/* Quick Syllabus & Formula Drawer */}
      <SyllabusQuickDrawer
        isOpen={isSyllabusDrawerOpen}
        onClose={() => setIsSyllabusDrawerOpen(false)}
        activeTopicId={activeTopicId}
        onSelectTopic={(topicId) => setActiveTopicId(topicId)}
        onOpenCalculator={() => setSuiteTab('calculator')}
      />

    </div>
  );
};
