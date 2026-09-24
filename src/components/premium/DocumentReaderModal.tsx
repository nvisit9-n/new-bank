import React, { useState, useMemo, useRef } from 'react';
import { 
  X, 
  ChevronLeft, 
  ChevronRight, 
  ZoomIn, 
  ZoomOut, 
  Lock, 
  Sparkles, 
  Bookmark, 
  Share2, 
  FileText, 
  Check, 
  Layers,
  ArrowLeft,
  Search,
  BookOpen,
  Scale,
  Calculator,
  HelpCircle,
  FileCheck2,
  Clock,
  Menu,
  CheckCircle2,
  ExternalLink
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { PremiumNote } from '../../types';
import { MarkdownRenderer } from '../common/MarkdownRenderer';
import { BANKING_REVISION_NOTES_SPECIAL_EDITION, RevisionChapter } from '../../data/bankingRevisionNotesData';

interface DocumentReaderModalProps {
  note: PremiumNote;
  onClose: () => void;
  onOpenPurchase: () => void;
}

export const DocumentReaderModal: React.FC<DocumentReaderModalProps> = ({
  note,
  onClose,
  onOpenPurchase
}) => {
  const { user, hasPurchased, toggleBookmark, isBookmarked, requireAuth } = useApp();
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [zoomLevel, setZoomLevel] = useState<number>(100);
  const [copied, setCopied] = useState<boolean>(false);
  const [showToc, setShowToc] = useState<boolean>(false);
  const [searchTopic, setSearchTopic] = useState<string>('');
  const contentContainerRef = useRef<HTMLDivElement>(null);

  const isUserAuthenticated = !!user && !user.isGuest && !!user.email;

  React.useEffect(() => {
    if (!isUserAuthenticated) {
      requireAuth(() => {}, 'सामग्री पढ्न, पीडीएफ डाउनलोड गर्न र परीक्षा दिन लगइन गर्नुहोस्।');
    }
  }, [isUserAuthenticated, requireAuth]);

  if (!note) return null;

  if (!isUserAuthenticated) {
    return (
      <div className="fixed inset-0 z-50 bg-slate-950/90 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in duration-200">
        <div className="bg-white dark:bg-slate-900 p-6 sm:p-8 rounded-3xl text-center space-y-5 max-w-md w-full border border-slate-200 dark:border-slate-800 shadow-2xl">
          <div className="w-16 h-16 rounded-2xl bg-amber-50 dark:bg-amber-950/60 border border-amber-200 dark:border-amber-800/80 flex items-center justify-center mx-auto text-amber-600 dark:text-amber-400">
            <Sparkles className="w-8 h-8" />
          </div>
          <div>
            <h3 className="text-lg sm:text-xl font-black text-slate-900 dark:text-white">
              प्रिमियम अध्ययन सामग्री लक गरिएको छ
            </h3>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 mt-1.5 leading-relaxed">
              विस्तृत परीक्षा तयारी नोट्स, आधिकारिक अध्ययन सामग्री तथा पीडीएफ पहुँचका लागि कृपया आफ्नो खातामा लगइन गर्नुहोस्।
            </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-3 pt-2">
            <button
              onClick={() => requireAuth(() => {}, 'सामग्री पढ्न, पीडीएफ डाउनलोड गर्न र परीक्षा दिन लगइन गर्नुहोस्।')}
              className="flex-1 py-3 px-4 rounded-xl bg-[#0B2046] hover:bg-[#153366] text-white font-bold text-sm shadow-md transition flex items-center justify-center gap-2"
            >
              <Sparkles className="w-4 h-4 text-amber-400" />
              <span>लगइन गर्नुहोस्</span>
            </button>
            <button
              onClick={onClose}
              className="py-3 px-4 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 font-bold text-sm transition"
            >
              बन्द गर्नुहोस्
            </button>
          </div>
        </div>
      </div>
    );
  }

  const isPurchased = hasPurchased(note.id);

  // If this is the special edition note or has full chapters, resolve to comprehensive chapters
  const isSpecialEdition = note.id === 'prem-01' || note.title.includes('Banking Complete Revision');

  // Derive chapter list
  const chaptersList: Array<{
    pageNumber: number;
    title: string;
    subtitle?: string;
    syllabusTags?: string[];
    estimatedReadingTime?: string;
    content: string;
    isLocked: boolean;
  }> = useMemo(() => {
    if (isSpecialEdition) {
      return BANKING_REVISION_NOTES_SPECIAL_EDITION.map(ch => ({
        pageNumber: ch.pageNumber,
        title: ch.title,
        subtitle: ch.subtitle,
        syllabusTags: ch.syllabusTags,
        estimatedReadingTime: ch.estimatedReadingTime,
        content: ch.content,
        // Free preview unlocks chapter 1 and 2
        isLocked: !isPurchased && !ch.isFreePreview
      }));
    }

    if (note.fullDocumentPages && note.fullDocumentPages.length > 0) {
      return note.fullDocumentPages.map((p, idx) => ({
        pageNumber: p.pageNumber || idx + 1,
        title: p.title,
        content: p.content,
        isLocked: !isPurchased && idx >= 2
      }));
    }

    if (note.previewPages && note.previewPages.length > 0) {
      return note.previewPages.map((p, idx) => ({
        pageNumber: p.pageNumber || idx + 1,
        title: p.title,
        content: p.content,
        isLocked: !isPurchased && idx >= 2
      }));
    }

    return [
      {
        pageNumber: 1,
        title: note.title,
        content: note.fullDescription || note.shortDescription || note.description || 'विस्तृत बैंकिङ तथा लोकसेवा अध्ययन सामग्री।',
        isLocked: false
      }
    ];
  }, [isSpecialEdition, isPurchased, note]);

  // Filtered chapters for table of contents search
  const filteredChapters = useMemo(() => {
    if (!searchTopic.trim()) return chaptersList;
    const q = searchTopic.toLowerCase();
    return chaptersList.filter(ch => 
      ch.title.toLowerCase().includes(q) ||
      (ch.subtitle && ch.subtitle.toLowerCase().includes(q)) ||
      (ch.syllabusTags && ch.syllabusTags.some(t => t.toLowerCase().includes(q))) ||
      ch.content.toLowerCase().includes(q)
    );
  }, [chaptersList, searchTopic]);

  const totalPages = Math.max(1, chaptersList.length);
  const activePageData = chaptersList[currentPage - 1] || chaptersList[0];
  const isPageLocked = activePageData?.isLocked;
  const bookmarked = isBookmarked('note', note.id);

  const authorDisplayName = typeof note.author === 'string' 
    ? note.author 
    : (note.author?.name || 'सुभाष शर्मा (उप-निर्देशक, वाणिज्य बैंक)');

  const pageCountDisplay = note.pageCount || note.pages || 148;

  const handleShare = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const jumpToPage = (pageNum: number) => {
    setCurrentPage(pageNum);
    setShowToc(false);
    if (contentContainerRef.current) {
      contentContainerRef.current.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  // Jump to specific in-chapter section
  const jumpToSection = (sectionPrefix: string) => {
    if (!contentContainerRef.current) return;
    const elements = contentContainerRef.current.querySelectorAll('h2, h3');
    for (let i = 0; i < elements.length; i++) {
      const el = elements[i];
      if (el.textContent && el.textContent.includes(sectionPrefix)) {
        el.scrollIntoView({ behavior: 'smooth', block: 'start' });
        break;
      }
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/90 backdrop-blur-md flex flex-col justify-between overflow-hidden animate-fadeIn">
      
      {/* Top Document Toolbar */}
      <header className="h-16 px-3 sm:px-6 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between text-slate-900 dark:text-white shrink-0 shadow-sm z-20">
        
        <div className="flex items-center gap-2 sm:gap-3 min-w-0">
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-500 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition"
            title="पछाडि फर्कनुहोस्"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>

          <button
            onClick={() => setShowToc(!showToc)}
            className={`px-3 py-1.5 rounded-xl border text-xs font-bold transition flex items-center gap-1.5 ${
              showToc
                ? 'bg-emerald-600 text-white border-emerald-600 shadow-sm'
                : 'border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300'
            }`}
            title="अध्याय तथा पाठ्यक्रम सूची"
          >
            <Layers className="w-4 h-4" />
            <span className="hidden sm:inline">अध्याय सूची (Index)</span>
            <span className="sm:hidden">अध्याय</span>
          </button>

          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <span className="font-extrabold text-xs sm:text-base truncate max-w-[180px] sm:max-w-md">
                {note.title}
              </span>
              {isPurchased ? (
                <span className="hidden sm:inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 text-[10px] font-bold">
                  <CheckCircle2 className="w-3 h-3" /> Full Unlocked
                </span>
              ) : (
                <span className="hidden sm:inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-300 text-[10px] font-bold">
                  <Sparkles className="w-3 h-3" /> Free Preview Mode
                </span>
              )}
            </div>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 hidden sm:block truncate">
              {authorDisplayName} • NRB, RBB, ADBL, NBL तह ४ र ५ विशेष रिभिजन
            </p>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-1.5 sm:gap-2">
          
          {/* Zoom Controls (Desktop) */}
          <div className="hidden lg:flex items-center gap-1 bg-slate-100 dark:bg-slate-800 px-2 py-1 rounded-xl text-xs text-slate-600 dark:text-slate-300">
            <button 
              onClick={() => setZoomLevel(prev => Math.max(85, prev - 10))} 
              className="p-1 hover:text-emerald-600"
              title="Zoom out"
            >
              <ZoomOut className="w-3.5 h-3.5" />
            </button>
            <span className="w-10 text-center font-mono font-bold">{zoomLevel}%</span>
            <button 
              onClick={() => setZoomLevel(prev => Math.min(125, prev + 10))} 
              className="p-1 hover:text-emerald-600"
              title="Zoom in"
            >
              <ZoomIn className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Bookmark Button */}
          <button
            onClick={() => toggleBookmark('note', note.id, note.title, note.category)}
            className={`p-2 rounded-xl border transition ${
              bookmarked
                ? 'bg-amber-500 text-white border-amber-500'
                : 'border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
            title="बुकमार्क गर्नुहोस्"
          >
            <Bookmark className={`w-4 h-4 ${bookmarked ? 'fill-white' : ''}`} />
          </button>

          {/* Share */}
          <button
            onClick={handleShare}
            className="p-2 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
            title="लिङ्क सेयर गर्नुहोस्"
          >
            {copied ? <Check className="w-4 h-4 text-emerald-500" /> : <Share2 className="w-4 h-4" />}
          </button>

          {/* Unlock Button if not purchased */}
          {!isPurchased && (
            <button
              onClick={onOpenPurchase}
              className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 text-slate-950 text-xs font-black shadow-sm transition hover:scale-105 active:scale-95"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>अनलाक (रु. {note.discountPrice || note.price || 149})</span>
            </button>
          )}

          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-slate-800 dark:hover:text-white"
            title="बन्द गर्नुहोस्"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

      </header>

      {/* Main Workspace with Table of Contents Drawer */}
      <div className="flex-1 flex overflow-hidden relative">
        
        {/* TOC Sidebar / Drawer */}
        {showToc && (
          <aside className="absolute inset-y-0 left-0 z-30 w-80 sm:w-96 bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 flex flex-col shadow-2xl animate-in slide-in-from-left duration-200">
            {/* TOC Header */}
            <div className="p-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between bg-slate-50 dark:bg-slate-800/50">
              <div>
                <h3 className="font-extrabold text-sm text-slate-900 dark:text-white flex items-center gap-1.5">
                  <Layers className="w-4 h-4 text-emerald-600" />
                  <span>पाठ्यक्रम अध्याय सूची (Chapters)</span>
                </h3>
                <p className="text-[11px] text-slate-500 dark:text-slate-400">
                  कुल {chaptersList.length} वटा विस्तृत विश्लेषणात्मक मोड्युलहरू
                </p>
              </div>
              <button 
                onClick={() => setShowToc(false)}
                className="p-1 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-500"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Syllabus Topic Search Filter */}
            <div className="p-3 border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
              <div className="relative">
                <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  value={searchTopic}
                  onChange={(e) => setSearchTopic(e.target.value)}
                  placeholder="शीर्षक खोज्नुहोस् (उदा: BAFIA, CRR, NPL, CAR, Repo)..."
                  className="w-full pl-9 pr-3 py-2 text-xs rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:border-emerald-500"
                />
              </div>
              {searchTopic && (
                <div className="flex items-center justify-between mt-1.5 px-1 text-[11px] text-slate-500">
                  <span>फेला परेका: {filteredChapters.length} अध्याय</span>
                  <button 
                    onClick={() => setSearchTopic('')}
                    className="text-emerald-600 dark:text-emerald-400 font-semibold hover:underline"
                  >
                    खाली गर्नुहोस्
                  </button>
                </div>
              )}
            </div>

            {/* Chapters List */}
            <div className="flex-1 overflow-y-auto p-3 space-y-2">
              {filteredChapters.map((ch) => {
                const isActive = currentPage === ch.pageNumber;
                return (
                  <button
                    key={ch.pageNumber}
                    onClick={() => jumpToPage(ch.pageNumber)}
                    className={`w-full text-left p-3 rounded-2xl transition-all border ${
                      isActive
                        ? 'bg-emerald-50 dark:bg-emerald-950/60 border-emerald-500 text-emerald-900 dark:text-emerald-200 shadow-sm'
                        : 'border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/60 text-slate-700 dark:text-slate-300'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <span className={`w-6 h-6 rounded-lg text-xs font-black flex items-center justify-center ${
                          isActive 
                            ? 'bg-emerald-600 text-white' 
                            : 'bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300'
                        }`}>
                          {ch.pageNumber}
                        </span>
                        <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                          अध्याय {ch.pageNumber}
                        </span>
                      </div>

                      {ch.isLocked ? (
                        <span className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-300 text-[10px] font-bold">
                          <Lock className="w-2.5 h-2.5" /> Locked
                        </span>
                      ) : (
                        <span className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 text-[10px] font-bold">
                          <CheckCircle2 className="w-2.5 h-2.5" /> Ready
                        </span>
                      )}
                    </div>

                    <h4 className="font-extrabold text-xs sm:text-sm mt-1.5 leading-snug line-clamp-2">
                      {ch.title.replace(/^अध्याय \d+:\s*/, '')}
                    </h4>

                    {ch.subtitle && (
                      <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1 line-clamp-1">
                        {ch.subtitle}
                      </p>
                    )}

                    {ch.syllabusTags && ch.syllabusTags.length > 0 && (
                      <div className="flex flex-wrap gap-1 mt-2">
                        {ch.syllabusTags.map((tag, tIdx) => (
                          <span 
                            key={tIdx}
                            className="px-1.5 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-[10px] font-semibold text-slate-600 dark:text-slate-400"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    )}
                  </button>
                );
              })}
            </div>

            {/* TOC Footer Note */}
            {!isPurchased && (
              <div className="p-3 bg-amber-50 dark:bg-amber-950/40 border-t border-amber-200 dark:border-amber-800/50 text-center space-y-1">
                <span className="text-[11px] font-bold text-amber-900 dark:text-amber-200 block">
                  अध्याय १ र २ पूर्ण निःशुल्क प्रिभ्यूमा उपलब्ध छन्।
                </span>
                <button
                  onClick={onOpenPurchase}
                  className="w-full py-2 px-3 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 text-slate-950 font-black text-xs shadow-sm hover:scale-102 transition"
                >
                  सबै ६ अध्याय अनलक गर्नुहोस् (रु. {note.discountPrice || 149})
                </button>
              </div>
            )}
          </aside>
        )}

        {/* Document View Canvas */}
        <div 
          ref={contentContainerRef}
          className="flex-1 overflow-y-auto p-3 sm:p-6 lg:p-8 flex justify-center bg-slate-900/60 relative scroll-smooth"
        >
          {/* Document Page Canvas */}
          <div 
            className="w-full max-w-4xl bg-white text-slate-900 rounded-3xl shadow-2xl p-5 sm:p-10 relative flex flex-col justify-between transition-all select-text my-auto"
            style={{ 
              transform: `scale(${zoomLevel / 100})`, 
              transformOrigin: 'top center',
              minHeight: '850px' 
            }}
          >
            {/* Official Security Watermark */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-[0.03] rotate-[-25deg]">
              <div className="text-center font-black text-4xl sm:text-7xl text-slate-900 leading-tight">
                Banking Tayari Nepal<br />
                {user.name} • {user.email}
              </div>
            </div>

            {/* Header of Document Paper */}
            <div className="border-b-2 border-emerald-600/30 pb-4 mb-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-black uppercase tracking-wider">
                      NRB • RBB • ADBL • NBL Level 4 & 5
                    </span>
                    <span className="text-xs font-semibold text-slate-500">
                      Special Edition Revision Manual
                    </span>
                  </div>
                  <h1 className="text-lg sm:text-2xl font-black text-slate-900 mt-1">
                    {activePageData?.title || note.title}
                  </h1>
                  {activePageData?.subtitle && (
                    <p className="text-xs sm:text-sm text-slate-600 font-medium mt-0.5">
                      {activePageData.subtitle}
                    </p>
                  )}
                </div>

                <div className="flex items-center sm:flex-col items-end justify-between sm:justify-center border-t sm:border-t-0 pt-2 sm:pt-0 border-slate-100">
                  <span className="text-xs font-extrabold text-emerald-800 bg-emerald-50 px-3 py-1 rounded-xl border border-emerald-200">
                    अध्याय {currentPage} / {totalPages}
                  </span>
                  {activePageData?.estimatedReadingTime && (
                    <span className="text-[11px] text-slate-500 flex items-center gap-1 mt-1">
                      <Clock className="w-3 h-3 text-slate-400" />
                      {activePageData.estimatedReadingTime}
                    </span>
                  )}
                </div>
              </div>

              {/* In-Chapter Section Jump Nav Pills (Only if unlocked) */}
              {!isPageLocked && isSpecialEdition && (
                <div className="flex items-center gap-1.5 overflow-x-auto pt-3 pb-1 scrollbar-none text-[11px]">
                  <span className="font-bold text-slate-500 shrink-0">द्रुत नेभिगेसन:</span>
                  <button 
                    onClick={() => jumpToSection('खण्ड (क)')}
                    className="px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-emerald-100 hover:text-emerald-900 text-slate-700 font-semibold transition shrink-0"
                  >
                    📋 सारांश (Syllabus)
                  </button>
                  <button 
                    onClick={() => jumpToSection('खण्ड (ख)')}
                    className="px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-emerald-100 hover:text-emerald-900 text-slate-700 font-semibold transition shrink-0"
                  >
                    📖 सिद्धान्त (5/10 Marks)
                  </button>
                  <button 
                    onClick={() => jumpToSection('खण्ड (ग)')}
                    className="px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-emerald-100 hover:text-emerald-900 text-slate-700 font-semibold transition shrink-0"
                  >
                    ⚖️ तुलनात्मक तालिका
                  </button>
                  <button 
                    onClick={() => jumpToSection('खण्ड (घ)')}
                    className="px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-emerald-100 hover:text-emerald-900 text-slate-700 font-semibold transition shrink-0"
                  >
                    📜 ऐन तथा दफाहरू
                  </button>
                  <button 
                    onClick={() => jumpToSection('खण्ड (ङ)')}
                    className="px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-emerald-100 hover:text-emerald-900 text-slate-700 font-semibold transition shrink-0"
                  >
                    ✍️ विगत ५ वर्षका प्रश्नोत्तर
                  </button>
                  <button 
                    onClick={() => jumpToSection('खण्ड (च)')}
                    className="px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-emerald-100 hover:text-emerald-900 text-slate-700 font-semibold transition shrink-0"
                  >
                    🧮 सुत्र तथा हिसाबहरू
                  </button>
                </div>
              )}
            </div>

            {/* Page Body Content */}
            <div className="py-2 flex-1 relative">
              {isPageLocked ? (
                /* Locked Page Overlay for Preview Mode */
                <div className="my-10 p-6 sm:p-10 rounded-3xl bg-slate-50 border-2 border-dashed border-amber-300 text-center space-y-5">
                  <div className="w-16 h-16 rounded-3xl bg-amber-500/20 text-amber-600 flex items-center justify-center mx-auto shadow-inner">
                    <Lock className="w-8 h-8" />
                  </div>

                  <div className="max-w-lg mx-auto space-y-2">
                    <span className="px-3 py-1 rounded-full bg-amber-100 text-amber-900 text-xs font-bold">
                      प्रिमियम अध्ययन सामग्री (अध्याय {currentPage})
                    </span>
                    <h3 className="text-xl sm:text-2xl font-black text-slate-900">
                      {activePageData?.title || 'यो अध्याय प्रिमियम प्रयोगकर्ताका लागि मात्र उपलब्ध छ'}
                    </h3>
                    <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                      यस अध्यायमा परीक्षा-तयारी ५ र १० अंकका विस्तृत परिभाषाहरू, तुलनात्मक तालिकाहरू, BAFIA तथा NRB ऐनका सटीक दफाहरू, विगत ५ वर्षका प्रश्नोत्तर र गणितीय हिसाबहरू समावेश छन्।
                    </p>
                  </div>

                  {/* Highlights of this locked chapter */}
                  {activePageData?.subtitle && (
                    <div className="p-4 rounded-2xl bg-white border border-slate-200 max-w-md mx-auto text-left text-xs space-y-1 text-slate-700">
                      <span className="font-bold text-emerald-800 flex items-center gap-1.5">
                        <CheckCircle2 className="w-4 h-4 text-emerald-600" /> यस अध्यायमा के-के पढ्न पाइन्छ:
                      </span>
                      <p className="text-slate-600 pl-5">
                        {activePageData.subtitle}
                      </p>
                      <div className="flex flex-wrap gap-1 pt-1 pl-5">
                        {(activePageData.syllabusTags || []).map((t, idx) => (
                          <span key={idx} className="px-2 py-0.5 rounded bg-slate-100 text-[10px] font-semibold text-slate-600">
                            {t}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  <div className="pt-2">
                    <button
                      onClick={onOpenPurchase}
                      className="px-8 py-3.5 rounded-2xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-slate-950 font-black text-sm shadow-xl shadow-amber-500/25 transition transform hover:scale-105 active:scale-95 inline-flex items-center gap-2"
                    >
                      <Sparkles className="w-4 h-4" />
                      <span>रु. {note.discountPrice || note.price || 149} मा पूर्ण प्याक अनलक गर्नुहोस् (Lifetime Access)</span>
                    </button>
                  </div>
                </div>
              ) : (
                /* Full Unlocked Content Rendering */
                <div className="space-y-6">
                  {/* Free preview notification pill */}
                  {!isPurchased && (
                    <div className="p-3 rounded-2xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-900 flex items-center justify-between gap-3">
                      <div className="flex items-center gap-2 font-medium">
                        <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                        <span>तपाईं अहिले निःशुल्क नमुना पृष्ठ (Free Sample Chapter) अध्ययन गर्दै हुनुहुन्छ।</span>
                      </div>
                      <button
                        onClick={onOpenPurchase}
                        className="px-3 py-1 rounded-xl bg-emerald-600 text-white font-bold text-[11px] hover:bg-emerald-700 transition shrink-0"
                      >
                        पूर्ण ६ अध्याय किन्नुहोस् (रु. १४९)
                      </button>
                    </div>
                  )}

                  <div className="prose prose-slate max-w-none text-slate-800 text-sm sm:text-base leading-relaxed select-text">
                    <MarkdownRenderer content={activePageData?.content || ''} />
                  </div>

                  {/* Loksewa & Banking Exam Tip Box */}
                  <div className="p-4 sm:p-5 rounded-2xl bg-amber-50/80 border border-amber-200 text-xs sm:text-sm text-amber-950 space-y-1.5 shadow-sm mt-8">
                    <span className="font-black flex items-center gap-1.5 text-amber-900">
                      📌 लोकसेवा तथा बैंकिङ परीक्षा मुख्य सुझाव (Expert Exam Strategy):
                    </span>
                    <p className="leading-relaxed">
                      उत्तर लेख्दा अनिवार्य रूपमा कानुनी दफा (जस्तै: BAFIA २०७३ को दफा ४९ वा NRB ऐनको दफा ४), तुलनात्मक तालिका र अनुपातहरू (CRR: ४%, SLR: १२%, CAR: ११%) समावेश गर्नाले परीक्षकबाट उच्च प्राप्ताङ्क सुनिश्चित हुन्छ।
                    </p>
                  </div>
                </div>
              )}
            </div>

            {/* Footer of Document Paper */}
            <div className="border-t border-slate-200 pt-4 mt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-2">
              <span className="font-semibold">Banking Tayari Nepal Official Publication</span>
              <div className="flex items-center gap-3">
                <span className="font-mono font-bold text-slate-700">
                  पृष्ठ {currentPage} / {totalPages}
                </span>
                <span>•</span>
                <span>All Rights Reserved</span>
              </div>
            </div>

          </div>

        </div>

      </div>

      {/* Bottom Paging Controller */}
      <footer className="h-16 px-4 sm:px-8 bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between shrink-0 z-20 shadow-md">
        
        <button
          onClick={() => jumpToPage(Math.max(1, currentPage - 1))}
          disabled={currentPage === 1}
          className="px-3 sm:px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 font-bold text-xs disabled:opacity-30 hover:bg-slate-100 dark:hover:bg-slate-800 transition flex items-center gap-1.5 active:scale-95"
        >
          <ChevronLeft className="w-4 h-4" />
          <span className="hidden sm:inline">अघिल्लो अध्याय (Previous)</span>
          <span className="sm:hidden">अघिल्लो</span>
        </button>

        <div className="flex items-center gap-2">
          <button 
            onClick={() => setShowToc(!showToc)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-xs font-bold text-slate-800 dark:text-slate-200 transition"
          >
            <Layers className="w-3.5 h-3.5 text-emerald-600" />
            <span>अध्याय {currentPage} / {totalPages}</span>
          </button>
          {!isPurchased && (
            <span className="text-[11px] text-amber-600 dark:text-amber-400 font-bold hidden md:inline">
              (निःशुल्क नमुना पृष्ठहरू)
            </span>
          )}
        </div>

        <button
          onClick={() => jumpToPage(Math.min(totalPages, currentPage + 1))}
          disabled={currentPage === totalPages}
          className="px-3 sm:px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 font-bold text-xs disabled:opacity-30 hover:bg-slate-100 dark:hover:bg-slate-800 transition flex items-center gap-1.5 active:scale-95"
        >
          <span className="hidden sm:inline">अर्को अध्याय (Next)</span>
          <span className="sm:hidden">अर्को</span>
          <ChevronRight className="w-4 h-4" />
        </button>

      </footer>

    </div>
  );
};
