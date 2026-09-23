import React, { useState, useEffect } from 'react';
import { 
  Home, 
  BookOpen, 
  Newspaper, 
  User, 
  Sparkles, 
  ShoppingBag, 
  Bookmark, 
  ShieldCheck, 
  FileText, 
  Youtube,
  ChevronDown,
  Building2,
  Scale,
  Landmark,
  LogOut,
  Trophy,
  Info,
  Crown,
  ChevronRight,
  GraduationCap,
  Layers,
  Flame,
  CheckCircle2,
  PlayCircle,
  Bot,
  Timer
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { NavigationTab, QuizSubCategory } from '../../types';
import { SocialLinksBar } from '../common/SocialIcons';
import { StorageService } from '../../services/storageService';
import { isOwnerAdmin } from '../../utils/sanitizer';

export const Sidebar: React.FC = () => {
  const { 
    activeTab, 
    setActiveTab, 
    user, 
    purchases, 
    bookmarks, 
    logout, 
    quizSubCategory, 
    selectQuizSubCategory,
    openLevelDashboard
  } = useApp();

  // Force immediate re-render when auth changes
  const [, setForceUpdate] = useState(0);
  useEffect(() => {
    const handleAuthEvent = () => setForceUpdate(n => n + 1);
    window.addEventListener('btn:profile-updated', handleAuthEvent);
    window.addEventListener('btn:user-login', handleAuthEvent);
    window.addEventListener('btn:logout', handleAuthEvent);
    return () => {
      window.removeEventListener('btn:profile-updated', handleAuthEvent);
      window.removeEventListener('btn:user-login', handleAuthEvent);
      window.removeEventListener('btn:logout', handleAuthEvent);
    };
  }, []);

  // Check if current user is an owner admin (strictly nvisit9@gmail.com & ketohero412@gmail.com)
  const isOwner = Boolean(
    (user?.email && isOwnerAdmin(user.email)) || 
    (typeof window !== 'undefined' && isOwnerAdmin(StorageService.getUserProfile()?.email))
  );

  // Expand state for the strict 4-item sequence: ALL categories COLLAPSED (closed) by default
  const [expandedSeq, setExpandedSeq] = useState<Record<string, boolean>>({
    'seq-1': false,
    'seq-2': false,
    'seq-3': false,
    'seq-4': false
  });

  const toggleSeq = (key: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setExpandedSeq(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const handleLogout = () => {
    if (window.confirm('के तपाईं लगआउट गर्न चाहनुहुन्छ? लगआउट गरेपछि नयाँ प्रोफाइल खोल्न सकिनेछ।')) {
      logout();
    }
  };

  const handleSelectCourseSection = (
    courseId: string, 
    options?: { paperId?: string; sectionId?: string; levelId?: string; subjectId?: string }
  ) => {
    setActiveTab('courses');
    window.dispatchEvent(
      new CustomEvent('btn:select-syllabus-section', {
        detail: { courseId, ...options }
      })
    );
  };

  const handleFilterSets = (range: 'all' | '1-10' | '11-20' | '21-30' | '31-40' | '41-50') => {
    selectQuizSubCategory('sangathit');
    setActiveTab('quiz');
    window.dispatchEvent(
      new CustomEvent('btn:filter-sets', {
        detail: { range }
      })
    );
  };

  // =========================================================================
  // STRICT 4-ITEM NUMBERED SEQUENCE AS MANDATED BY USER SPECIFICATION:
  // 1. संगठित संस्था एकीकृत प्रिटेस्ट (Integrated Pre-Test 50 Sets - HIGHEST PRIORITY)
  // 2. बैंकिङ्ग सेवा (Banking Sector Written & Syllabus: NRB, RBB, NBL, ADBL)
  // 3. संगठित संस्था (Public Enterprises Written & Syllabus: NTC, NEA, EPF, CIT)
  // 4. निजामती / लोकसेवा (PSC Civil Service Written & Syllabus: Section Officer, NaSu, Kharidar)
  // =========================================================================
  const sequenceConfig = [
    {
      id: 'seq-1',
      num: '१',
      titleNe: 'संगठित संस्था एकीकृत प्रिटेस्ट',
      titleEn: 'Integrated Pre-Test 50 Sets Engine',
      priorityBadge: 'सर्वोच्च प्राथमिकता (HIGHEST PRIORITY)',
      badgeNe: '५० सेट इन्जिन',
      badgeEn: '50 Sets',
      isPreTestEngine: true,
      icon: Layers,
      accentColor: 'text-sky-600 dark:text-sky-400',
      activeContainer: 'bg-sky-50/80 dark:bg-sky-950/30 border-sky-400 dark:border-sky-700',
      headerBg: 'bg-white text-slate-900 border-slate-200',
      badgeClass: 'bg-sky-500 text-white font-black',
      onHeaderClick: () => {
        selectQuizSubCategory('sangathit');
        setActiveTab('quiz');
      },
      subLinks: [
        { 
          label: 'सबै ५० सेटहरू (All 50 Sets Master)', 
          onClick: () => handleFilterSets('all'), 
          badge: '५० सेट' 
        },
        { 
          label: 'सेट १-१० (आधारभूत ५० MCQs अभ्यास)', 
          onClick: () => handleFilterSets('1-10'), 
          badge: '१-१०' 
        },
        { 
          label: 'सेट ११-३० (मध्यम ५० MCQs अभ्यास)', 
          onClick: () => handleFilterSets('11-20'), 
          badge: '११-३०' 
        },
        { 
          label: 'सेट ३१-५० (उन्नत ५० MCQs सिमुलेसन)', 
          onClick: () => handleFilterSets('31-40'), 
          badge: '३१-५०' 
        },
        { 
          label: '४५ मिनेट लाइभ परीक्षा सिमुलेसन', 
          onClick: () => openLevelDashboard('enterprises', '4', 2), 
          badge: 'Live' 
        },
        { 
          label: 'नेगेटिभ मार्किङ (-०.२ / -०.४) नियम', 
          onClick: () => openLevelDashboard('enterprises', '4', 0), 
          badge: 'Rules' 
        }
      ]
    },
    {
      id: 'seq-2',
      num: '२',
      titleNe: 'बैंकिङ्ग सेवा',
      titleEn: 'Banking Sector Written & Syllabus',
      subtextNe: 'लिखित परीक्षा & विस्तृत पाठ्यक्रम (NRB, RBB, NBL, ADBL)',
      badgeNe: 'लिखित & पाठ्यक्रम',
      badgeEn: 'Written',
      icon: Landmark,
      accentColor: 'text-emerald-600 dark:text-emerald-400',
      activeContainer: 'bg-slate-50 dark:bg-slate-800/40 border-slate-300 dark:border-slate-700',
      headerBg: 'bg-white text-slate-900 border-slate-200',
      badgeClass: 'bg-emerald-600 text-white font-black',
      onHeaderClick: () => {
        selectQuizSubCategory('banking');
        handleSelectCourseSection('NRB');
      },
      subLinks: [
        { 
          label: 'नेपाल राष्ट्र बैंक (NRB) - तह ४ सहायक', 
          onClick: () => handleSelectCourseSection('NRB', { levelId: 'level-4-5', paperId: 'paper-1' }), 
          badge: 'NRB ४' 
        },
        { 
          label: 'नेपाल राष्ट्र बैंक (NRB) - तह ५ र ६ अधिकृत', 
          onClick: () => handleSelectCourseSection('NRB', { levelId: 'level-6', paperId: 'paper-1' }), 
          badge: 'NRB ५/६' 
        },
        { 
          label: 'राष्ट्रिय वाणिज्य बैंक (RBB) लिखित तयारी', 
          onClick: () => handleSelectCourseSection('Commercial', { levelId: 'level-4-5' }), 
          badge: 'RBB' 
        },
        { 
          label: 'नेपाल बैंक लिमिटेड (NBL) लिखित तयारी', 
          onClick: () => handleSelectCourseSection('Commercial', { levelId: 'level-4-5' }), 
          badge: 'NBL' 
        },
        { 
          label: 'कृषि विकास बैंक (ADBL) लिखित तयारी', 
          onClick: () => handleSelectCourseSection('Commercial', { levelId: 'level-4-5' }), 
          badge: 'ADBL' 
        },
        { 
          label: 'तह ४ (सहायक) लिखित Paper I & II विश्लेषण', 
          onClick: () => openLevelDashboard('banking', '4', 0), 
          badge: 'तह ४' 
        },
        { 
          label: 'तह ५ (वरिष्ठ सहायक) लिखित Paper I & II', 
          onClick: () => openLevelDashboard('banking', '5', 0), 
          badge: 'तह ५' 
        },
        { 
          label: 'तह ६ (अधिकृत) लिखित Paper I & II', 
          onClick: () => openLevelDashboard('banking', '6', 0), 
          badge: 'तह ६' 
        }
      ]
    },
    {
      id: 'seq-3',
      num: '३',
      titleNe: 'संगठित संस्था',
      titleEn: 'Public Enterprises Written & Syllabus',
      subtextNe: 'सार्वजनिक संस्थान लिखित परीक्षा (NTC, NEA, EPF, CIT)',
      badgeNe: 'लिखित & पाठ्यक्रम',
      badgeEn: 'Written',
      icon: Building2,
      accentColor: 'text-sky-600 dark:text-sky-400',
      activeContainer: 'bg-slate-50 dark:bg-slate-800/40 border-slate-300 dark:border-slate-700',
      headerBg: 'bg-white text-slate-900 border-slate-200',
      badgeClass: 'bg-blue-600 text-white font-black',
      onHeaderClick: () => {
        selectQuizSubCategory('sangathit');
        handleSelectCourseSection('EPF');
      },
      subLinks: [
        { 
          label: 'कर्मचारी सञ्चय कोष (EPF) लिखित पाठ्यक्रम', 
          onClick: () => handleSelectCourseSection('EPF', { levelId: 'epf-level-4-5-6' }), 
          badge: 'EPF' 
        },
        { 
          label: 'नागरिक लगानी कोष (CIT) लिखित पाठ्यक्रम', 
          onClick: () => openLevelDashboard('enterprises', '4', 0), 
          badge: 'CIT' 
        },
        { 
          label: 'नेपाल टेलिकम (NTC) लिखित पाठ्यक्रम', 
          onClick: () => openLevelDashboard('enterprises', '4', 0), 
          badge: 'NTC' 
        },
        { 
          label: 'नेपाल विद्युत प्राधिकरण (NEA) लिखित पाठ्यक्रम', 
          onClick: () => openLevelDashboard('enterprises', '5', 0), 
          badge: 'NEA' 
        },
        { 
          label: 'तह ४ (सहायक स्तर) लिखित पाठ्यक्रम', 
          onClick: () => openLevelDashboard('enterprises', '4', 0), 
          badge: 'तह ४' 
        },
        { 
          label: 'तह ५ (वरिष्ठ सहायक) लिखित पाठ्यक्रम', 
          onClick: () => openLevelDashboard('enterprises', '5', 0), 
          badge: 'तह ५' 
        },
        { 
          label: 'तह ६ (अधिकृत स्तर) लिखित पाठ्यक्रम', 
          onClick: () => openLevelDashboard('enterprises', '6', 0), 
          badge: 'तह ६' 
        }
      ]
    },
    {
      id: 'seq-4',
      num: '४',
      titleNe: 'निजामती / लोकसेवा',
      titleEn: 'PSC Civil Service Written & Syllabus',
      subtextNe: 'लोक सेवा आयोग लिखित परीक्षा (अधिकृत, नासु, खरिदार)',
      badgeNe: 'लिखित & पाठ्यक्रम',
      badgeEn: 'Written',
      icon: Scale,
      accentColor: 'text-amber-600 dark:text-amber-400',
      activeContainer: 'bg-slate-50 dark:bg-slate-800/40 border-slate-300 dark:border-slate-700',
      headerBg: 'bg-white text-slate-900 border-slate-200',
      badgeClass: 'bg-amber-600 text-white font-black',
      onHeaderClick: () => {
        selectQuizSubCategory('loksewa');
        handleSelectCourseSection('Loksewa');
      },
      subLinks: [
        { 
          label: 'शाखा अधिकृत (Section Officer) Paper I-IV', 
          onClick: () => openLevelDashboard('loksewa', '6', 0), 
          badge: 'अधिकृत' 
        },
        { 
          label: 'नायब सुब्बा (NaSu) लिखित Paper I & II', 
          onClick: () => openLevelDashboard('loksewa', '5', 0), 
          badge: 'नासु' 
        },
        { 
          label: 'खरिदार (Kharidar) लिखित Paper I & II', 
          onClick: () => openLevelDashboard('loksewa', '4', 0), 
          badge: 'खरिदार' 
        },
        { 
          label: 'तह ४ (खरिदार) लिखित पाठ्यक्रम', 
          onClick: () => openLevelDashboard('loksewa', '4', 0), 
          badge: 'तह ४' 
        },
        { 
          label: 'तह ५ (नायब सुब्बा) लिखित पाठ्यक्रम', 
          onClick: () => openLevelDashboard('loksewa', '5', 0), 
          badge: 'तह ५' 
        },
        { 
          label: 'तह ६ (शाखा अधिकृत) लिखित पाठ्यक्रम', 
          onClick: () => openLevelDashboard('loksewa', '6', 0), 
          badge: 'तह ६' 
        }
      ]
    }
  ];

  const resourceNavItems: { tab: NavigationTab; label: string; icon: React.ComponentType<{ className?: string }>; badge?: string | number; badgeColor?: string }[] = [
    { tab: 'portal', label: 'एकीकृत पोर्टल (NRB/RBB/NBL)', icon: Landmark, badge: 'LIVE', badgeColor: 'bg-rose-600 text-white' },
    { tab: 'notes-hub', label: 'बैंकिङ्ग नोट्स हब (Notes Hub)', icon: BookOpen, badge: 'NEW', badgeColor: 'bg-amber-500 text-white' },
    { tab: 'tools', label: 'अध्ययन औजारहरू (Tools)', icon: Timer, badge: 'FOCUS', badgeColor: 'bg-purple-600 text-white' },
    { tab: 'flashcards', label: 'स्मार्ट फ्ल्यासकार्ड (Flashcards)', icon: Layers, badge: 'NEW', badgeColor: 'bg-emerald-600 text-white' },
    { tab: 'deep-research', label: 'Deep Research AI (रिसर्च)', icon: Bot, badge: 'PRO', badgeColor: 'bg-indigo-600 text-white' },
    { tab: 'leaderboard', label: 'वरियता (Leaderboard)', icon: Trophy, badge: 'Ranking', badgeColor: 'bg-amber-500 text-white' },
    { tab: 'video-lectures', label: 'भिडियो कक्षाहरू (Videos)', icon: Youtube, badge: 'HD', badgeColor: 'bg-red-600 text-white' },
    { tab: 'free-notes', label: 'अध्ययन / AI नोट्स (Notes)', icon: FileText, badge: 'AI', badgeColor: 'bg-blue-600 text-white' },
    { tab: 'current-affairs', label: 'समसामयिक (Current Affairs)', icon: Newspaper, badge: 'HOT', badgeColor: 'bg-orange-600 text-white' },
    { tab: 'premium', label: 'प्रिमियम नोट्स (Premium)', icon: Sparkles, badge: 'PRO', badgeColor: 'bg-amber-500 text-white' },
    { tab: 'purchases', label: 'मेरो खरिद (My Purchases)', icon: ShoppingBag, badge: (purchases || []).length },
    { tab: 'bookmarks', label: 'बुकमार्क (Bookmarks)', icon: Bookmark, badge: (bookmarks || []).length },
    { tab: 'profile', label: 'मेरो प्रोफाइल (Profile)', icon: User },
    { tab: 'about', label: 'हाम्रो बारेमा (About Us)', icon: Info, badge: 'EdTech', badgeColor: 'bg-blue-600 text-white' }
  ];

  return (
    <aside className="hidden md:flex flex-col w-72 shrink-0 bg-white text-slate-800 border-r border-slate-200 h-screen sticky top-0 transition-colors z-20 shadow-xs">
      
      {/* Sidebar Header / Brand Logo */}
      <div 
        id="sidebar-brand-logo"
        onClick={() => setActiveTab('home')}
        className="p-3.5 border-b border-slate-200 cursor-pointer group hover:bg-slate-50 transition-all bg-white"
        title="Banking Tayari Nepal - Home"
      >
        <div className="w-full bg-[#0B2046]/5 px-3 py-2 rounded-2xl border border-slate-200 shadow-2xs group-hover:border-blue-400 transition-all flex items-center justify-center">
          <img 
            src="/logo.svg" 
            alt="Banking Tayari Nepal Logo" 
            className="h-9 w-auto object-contain select-none"
          />
        </div>
      </div>

      {/* Navigation List with Generous Spacing & Clean Hierarchy */}
      <div className="flex-1 overflow-y-auto p-3 space-y-4 custom-scrollbar">
        
        {/* Core Nav Group: Home, Notes Hub, Portal with High Visibility & Bold Contrast */}
        <div className="space-y-1.5">
          <button
            type="button"
            id="sidebar-nav-home"
            onClick={() => setActiveTab('home')}
            className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl transition-all text-[13px] cursor-pointer group ${
              activeTab === 'home' 
                ? 'bg-blue-50 text-[#1E40AF] border-l-4 border-[#1E40AF] font-black shadow-xs' 
                : 'text-slate-900 font-bold hover:text-[#1E40AF] hover:bg-slate-100'
            }`}
          >
            <div className="flex items-center space-x-3 min-w-0 pr-1">
              <Home className={`w-5 h-5 shrink-0 transition-colors ${activeTab === 'home' ? 'text-[#1E40AF]' : 'text-slate-600 group-hover:text-[#1E40AF]'}`} />
              <span className="truncate">गृहपृष्ठ (Home Dashboard)</span>
            </div>
            <span className="text-[10px] font-black px-2 py-0.5 rounded-full bg-blue-100 text-[#1E40AF] border border-blue-200">
              Live
            </span>
          </button>

          {/* Quick Hub Access */}
          <button
            type="button"
            id="sidebar-nav-notes-hub"
            onClick={() => setActiveTab('notes-hub')}
            className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl transition-all text-[13px] cursor-pointer group ${
              activeTab === 'notes-hub' 
                ? 'bg-blue-50 text-[#1E40AF] border-l-4 border-[#1E40AF] font-black shadow-xs' 
                : 'text-slate-900 font-bold hover:text-[#1E40AF] hover:bg-slate-100'
            }`}
          >
            <div className="flex items-center space-x-3 min-w-0 pr-1">
              <BookOpen className={`w-5 h-5 shrink-0 transition-colors ${activeTab === 'notes-hub' ? 'text-[#1E40AF]' : 'text-slate-600 group-hover:text-[#1E40AF]'}`} />
              <span className="truncate">बैंकिङ्ग नोट्स हब (LaTeX + PDF)</span>
            </div>
            <span className="text-[10px] font-black px-2 py-0.5 rounded-full bg-amber-500 text-white shadow-2xs">
              NEW
            </span>
          </button>

          {/* Integrated Hybrid Portal */}
          <button
            type="button"
            id="sidebar-nav-portal"
            onClick={() => setActiveTab('portal')}
            className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl transition-all text-[13px] cursor-pointer group ${
              activeTab === 'portal' 
                ? 'bg-blue-50 text-[#1E40AF] border-l-4 border-[#1E40AF] font-black shadow-xs' 
                : 'text-slate-900 font-bold hover:text-[#1E40AF] hover:bg-slate-100'
            }`}
          >
            <div className="flex items-center space-x-3 min-w-0 pr-1">
              <Landmark className={`w-5 h-5 shrink-0 transition-colors ${activeTab === 'portal' ? 'text-[#1E40AF]' : 'text-slate-600 group-hover:text-[#1E40AF]'}`} />
              <span className="truncate">एकीकृत बैंकिङ पोर्टल</span>
            </div>
            <span className="text-[10px] font-black px-2 py-0.5 rounded-full bg-rose-600 text-white shadow-2xs">
              LIVE
            </span>
          </button>
        </div>

        {/* ================================================================= */}
        {/* STRICT 4-ITEM NUMBERED SEQUENCE SECTION                           */}
        {/* ================================================================= */}
        <div className="pt-3 border-t border-slate-200">
          <div className="px-2 py-1.5 flex items-center justify-between mb-2">
            <span className="text-[11px] font-black uppercase tracking-wider text-slate-800 flex items-center gap-1.5">
              <BookOpen className="w-4 h-4 text-[#1E40AF]" />
              <span>तयारी क्रम (१ देखि ४)</span>
            </span>
            <span className="text-[10px] font-black px-2 py-0.5 rounded-full bg-blue-100 text-[#1E40AF] border border-blue-200">
              ४ चरण
            </span>
          </div>

          <div className="space-y-2.5">
            {sequenceConfig.map(seq => {
              const Icon = seq.icon;
              const isExpanded = expandedSeq[seq.id] ?? false;
              const isSeqActive = seq.isPreTestEngine 
                ? activeTab === 'quiz'
                : activeTab === 'courses';

              return (
                <div 
                  key={seq.id}
                  className={`rounded-2xl border transition-all duration-200 overflow-hidden ${
                    seq.isPreTestEngine
                      ? 'border-blue-300 bg-blue-50/40 shadow-xs'
                      : isSeqActive
                        ? 'border-blue-400 bg-blue-50/50 shadow-xs ring-1 ring-blue-400/30'
                        : 'border-slate-200 bg-white hover:border-blue-300 hover:bg-slate-50/80 shadow-2xs'
                  }`}
                >
                  {/* Priority Tag for Item 1 */}
                  {seq.priorityBadge && (
                    <div className="bg-amber-100/90 px-3 py-1.5 flex items-center justify-between text-amber-950 border-b border-amber-200">
                      <span className="text-[10px] font-black tracking-wide uppercase flex items-center gap-1.5">
                        <Flame className="w-3.5 h-3.5 text-amber-600 fill-amber-600" />
                        {seq.priorityBadge}
                      </span>
                      <span className="text-[9.5px] font-black bg-blue-600 text-white px-2 py-0.5 rounded-full shadow-2xs">
                        SET 1-50
                      </span>
                    </div>
                  )}

                  {/* Numbered Category Header Card - Expands/Collapses on title click */}
                  <div
                    onClick={() => toggleSeq(seq.id)}
                    className="p-3 flex items-center justify-between cursor-pointer select-none group hover:bg-slate-100/70 transition"
                    title={`${seq.num}. ${seq.titleNe} - ${seq.titleEn}`}
                  >
                    <div className="flex items-center space-x-3 min-w-0 pr-1">
                      <div className="w-7 h-7 rounded-lg flex items-center justify-center font-black text-xs shrink-0 bg-blue-50 border border-blue-200 text-[#1E40AF]">
                        {seq.num}
                      </div>

                      <div className="min-w-0 truncate">
                        <h4 className="font-black text-[13px] text-[#0F172A] group-hover:text-[#1E40AF] truncate leading-tight tracking-tight">
                          {seq.titleNe}
                        </h4>
                        <p className="text-[11px] text-slate-600 truncate font-semibold mt-0.5">
                          {seq.titleEn}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-1 shrink-0">
                      <button
                        type="button"
                        onClick={(e) => toggleSeq(seq.id, e)}
                        className="p-1 rounded-md text-slate-500 hover:text-slate-900 hover:bg-slate-200 transition cursor-pointer"
                        title={isExpanded ? 'बन्द गर्नुहोस् (Collapse)' : 'हेर्नुहोस् (Expand)'}
                      >
                        <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${isExpanded ? 'rotate-180 text-[#1E40AF]' : 'text-slate-500 group-hover:text-slate-900'}`} />
                      </button>
                    </div>
                  </div>

                  {/* Indented Sub-Links with High-Contrast Readable Typography */}
                  {isExpanded && (
                    <div className="px-3 pb-3 pt-1 border-t border-slate-200 bg-slate-50/90">
                      <div className="ml-1 pl-2.5 border-l-2 border-[#1E40AF] space-y-1.5 mt-1.5">
                        {seq.subLinks.map((sub, sIdx) => (
                          <button
                            key={sIdx}
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              sub.onClick();
                            }}
                            className="w-full text-left py-2 px-2.5 rounded-lg text-xs font-bold text-slate-800 hover:text-[#1E40AF] hover:bg-white border border-transparent hover:border-slate-200 transition flex items-center justify-between group cursor-pointer"
                          >
                            <div className="flex items-center gap-2 min-w-0 pr-1 truncate">
                              <span className="w-1.5 h-1.5 rounded-full bg-[#1E40AF] shrink-0 group-hover:scale-125 transition-transform" />
                              <span className="truncate text-xs font-bold text-slate-900 group-hover:text-[#1E40AF]">{sub.label}</span>
                            </div>

                            {sub.badge && (
                              <span className="text-[9px] font-black px-1.5 py-0.5 rounded-full bg-white text-slate-800 group-hover:bg-blue-100 group-hover:text-[#1E40AF] shrink-0 border border-slate-300 shadow-2xs">
                                {sub.badge}
                              </span>
                            )}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* ================================================================= */}
        {/* RESOURCES & SECONDARY SUITE SECTION                               */}
        {/* ================================================================= */}
        <div className="pt-3 border-t border-slate-200">
          <div className="px-2 py-1.5 mb-1.5 flex items-center justify-between">
            <span className="text-[11px] font-black uppercase tracking-wider text-slate-800 flex items-center gap-1.5">
              <Layers className="w-4 h-4 text-[#1E40AF]" />
              <span>अध्ययन स्रोत तथा सुविधाहरू</span>
            </span>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-100 text-slate-700 border border-slate-200">
              १३ मोड्युल
            </span>
          </div>

          <nav className="space-y-1">
            {resourceNavItems.map(item => {
              const Icon = item.icon;
              const isActive = activeTab === item.tab;

              return (
                <button
                  key={item.tab}
                  id={`sidebar-resource-${item.tab}`}
                  onClick={() => setActiveTab(item.tab)}
                  className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl transition-all text-[13px] cursor-pointer group ${
                    isActive 
                      ? 'bg-blue-50 text-[#1E40AF] border-l-4 border-[#1E40AF] font-black shadow-xs' 
                      : 'text-slate-900 font-bold hover:bg-slate-100 hover:text-[#1E40AF]'
                  }`}
                >
                  <div className="flex items-center space-x-3 min-w-0 pr-1">
                    <Icon className={`w-5 h-5 shrink-0 transition-colors ${
                      isActive ? 'text-[#1E40AF]' : 'text-slate-600 group-hover:text-[#1E40AF]'
                    }`} />
                    <span className="truncate" title={item.label}>{item.label}</span>
                  </div>

                  {item.badge !== undefined && (
                    <span className={`text-[10px] font-black px-2 py-0.5 rounded-full shadow-2xs tracking-wider uppercase ${
                      item.badgeColor 
                        ? item.badgeColor 
                        : 'bg-slate-100 text-slate-800 border border-slate-300'
                    }`}>
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>

          {/* Owner Exclusive Admin Panel Tab */}
          {isOwner && (
            <div className="mt-4 pt-3 border-t border-slate-200">
              <div className="px-2 py-1.5 flex items-center justify-between mb-1.5">
                <span className="text-[11px] font-black uppercase tracking-wider text-amber-900 flex items-center gap-1.5">
                  <Crown className="w-4 h-4 text-amber-600" />
                  <span>प्रशासक प्यानल (OWNER ADMIN)</span>
                </span>
                <span className="text-[10px] font-black px-2 py-0.5 rounded-full bg-amber-100 text-amber-900 border border-amber-300">
                  MASTER
                </span>
              </div>
              <button
                type="button"
                id="sidebar-admin-panel-btn"
                onClick={() => {
                  setActiveTab('admin');
                  if (typeof window !== 'undefined') {
                    window.history.pushState({ tab: 'admin' }, '', '/admin');
                  }
                }}
                className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl transition-all text-[13px] font-black cursor-pointer group ${
                  activeTab === 'admin'
                    ? 'bg-blue-50 text-[#1E40AF] border-l-4 border-[#1E40AF] shadow-xs'
                    : 'bg-amber-50/50 text-slate-900 hover:text-[#1E40AF] hover:bg-slate-100 border border-amber-200/80'
                }`}
                title="Admin Analytics Dashboard"
              >
                <div className="flex items-center space-x-3 min-w-0 pr-1">
                  <ShieldCheck className={`w-5 h-5 shrink-0 ${activeTab === 'admin' ? 'text-[#1E40AF]' : 'text-amber-600'}`} />
                  <span className="truncate">Admin Panel (एनालिटिक्स)</span>
                </div>
                <span className="text-[10px] font-black px-2 py-0.5 rounded-full bg-emerald-600 text-white shadow-2xs">
                  Live
                </span>
              </button>
            </div>
          )}
        </div>

      </div>

      {/* User Session Footer Card */}
      <div className="p-3 border-t border-slate-200 bg-slate-50">
        <SocialLinksBar />

        {user ? (
          <div className="mt-2 pt-2 border-t border-slate-200 flex items-center justify-between">
            <div 
              onClick={() => setActiveTab('profile')}
              className="flex items-center space-x-2 min-w-0 cursor-pointer group"
            >
              <div className="w-8 h-8 rounded-full bg-white border border-slate-300 text-blue-700 flex items-center justify-center font-black text-xs shrink-0 shadow-2xs">
                {user.displayName ? user.displayName.charAt(0).toUpperCase() : (user.email ? user.email.charAt(0).toUpperCase() : 'U')}
              </div>
              <div className="min-w-0 truncate">
                <p className="text-xs font-bold text-slate-900 truncate group-hover:text-blue-700 transition">
                  {user.displayName || user.email?.split('@')[0] || 'विद्यार्थी'}
                </p>
                <p className="text-[10px] text-slate-500 truncate font-mono">
                  {user.targetExam?.split('-')[0] || 'NRB / Banking'}
                </p>
              </div>
            </div>

            <button
              onClick={handleLogout}
              className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition cursor-pointer"
              title="लगआउट गर्नुहोस्"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        ) : (
          <div className="mt-2 text-center">
            <button
              onClick={() => setActiveTab('profile')}
              className="w-full py-2 px-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs transition shadow-xs cursor-pointer flex items-center justify-center gap-1.5"
            >
              <User className="w-3.5 h-3.5 text-white" />
              <span>लगइन / नयाँ खाता</span>
            </button>
          </div>
        )}
      </div>
    </aside>
  );
};
