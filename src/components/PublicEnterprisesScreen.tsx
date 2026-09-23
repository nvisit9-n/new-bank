import React, { useState, useMemo } from 'react';
import { 
  Building2, 
  Play, 
  Search, 
  Clock, 
  Award, 
  CheckCircle2, 
  Filter, 
  Layers, 
  BookOpen, 
  Sparkles, 
  Flame, 
  ShieldCheck, 
  FileText, 
  ChevronRight,
  TrendingUp,
  Landmark,
  Scale,
  Zap,
  RotateCcw,
  FileDown,
  Download,
  Printer
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { DifficultyLevel, QuizSet, SubjectCategory, QuizMode } from '../types';
import { 
  getAllSangathitSasthaSetMetas, 
  getSangathitSasthaSet, 
  getSangathitTotalQuestionCount,
  getSetCategoryMeta,
  SangathitSetMeta 
} from '../data/questionBank';
import { ActiveQuiz } from './quiz/ActiveQuiz';
import { QuizResult } from './quiz/QuizResult';
import { 
  getQuestionsByCategory, 
  convertQuizQuestionToQuestion 
} from '../data/quizData';
import { PdfExportDialog } from './modals/PdfExportDialog';
import { isOwnerAdmin, PRIMARY_OWNER_EMAIL } from '../utils/sanitizer';

export const PublicEnterprisesScreen: React.FC = () => {
  const { 
    activeQuiz, 
    startQuiz, 
    exitQuiz, 
    quizResult, 
    setQuizResult, 
    setActiveTab, 
    addToast,
    quizSubCategory,
    selectQuizSubCategory,
    requireAuth,
    user
  } = useApp();

  const isAdmin = isOwnerAdmin(user?.email);

  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedDifficulty, setSelectedDifficulty] = useState<'All' | DifficultyLevel>('All');
  const [activeSetRange, setActiveSetRange] = useState<'all' | '1-10' | '11-20' | '21-30' | '31-40' | '41-50'>('all');
  const [activeView, setActiveView] = useState<'sets' | 'syllabus' | 'custom'>('sets');

  // Sub-category specific institute / tier filters
  const [bankingInstituteFilter, setBankingInstituteFilter] = useState<'ALL' | 'NRB' | 'RBB' | 'NBL' | 'ADBL'>('ALL');
  const [loksewaTierFilter, setLoksewaTierFilter] = useState<'ALL' | 'OFFICER' | 'NASU' | 'KHARIDAR'>('ALL');

  // Custom quiz generator state (optional secondary tab)
  const [customCategory, setCustomCategory] = useState<SubjectCategory | 'All'>('All');
  const [customCount, setCustomCount] = useState<10 | 20 | 50>(50);
  const [customDifficulty, setCustomDifficulty] = useState<DifficultyLevel | 'All'>('Medium');

  // PDF Export Engine State
  const [isPdfDialogOpen, setIsPdfDialogOpen] = useState<boolean>(false);
  const [pdfScope, setPdfScope] = useState<'all-50-sets' | 'single-set' | 'all-10k'>('all-50-sets');
  const [pdfSetNum, setPdfSetNum] = useState<number>(1);

  const allSetMetas = useMemo(() => getAllSangathitSasthaSetMetas(), []);
  const totalQuestionsCount = useMemo(() => getSangathitTotalQuestionCount(), []);

  // Dynamic configuration for active quizSubCategory (Hook must run unconditionally)
  const subCategoryConfig = useMemo(() => {
    if (quizSubCategory === 'banking') {
      return {
        title: 'बैंकिङ्ग परीक्षा तयारी (Banking Exam Preparation)',
        englishTitle: 'Banking Institutes Pre-Test & Model Sets',
        badge: '४ प्रमुख बैंकहरू: NRB • RBB • NBL • ADBL',
        badgeBg: 'bg-emerald-600',
        gradient: 'from-emerald-800 via-teal-900 to-slate-900 border-emerald-500/30 shadow-emerald-950/20',
        icon: Landmark,
        description: 'नेपाल राष्ट्र बैंक (NRB), नेपाल बैंक लिमिटेड (NBL), राष्ट्रिय वाणिज्य बैंक (RBB) र कृषि विकास बैंक (ADBL) का तह ३, ४ र ५ सहायक तथा अधिकृत पदका लागि पूर्ण वस्तुगत ५० प्रश्न अभ्यास सेटहरू। नेगेटिभ मार्किङ (-०.४) सहित वास्तविक परीक्षा ढाँचा।',
        targetPill: 'NRB • NBL • RBB • ADBL',
        activeColor: 'emerald'
      };
    }
    if (quizSubCategory === 'loksewa') {
      return {
        title: 'निजामती / लोकसेवा तयारी (Loksewa Exam Preparation)',
        englishTitle: 'PSC Civil Service Pre-Test & General Knowledge',
        badge: 'लोक सेवा आयोग (PSC) प्रथम पत्र',
        badgeBg: 'bg-amber-600',
        gradient: 'from-amber-700 via-orange-900 to-slate-900 border-amber-500/30 shadow-amber-950/20',
        icon: Scale,
        description: 'नेपाल सरकार निजामती सेवाका शाखा अधिकृत (Section Officer), नायब सुब्बा (Nayab Subba), खरिदार र स्थानीय तहका लागि सामान्य ज्ञान, ऐन-कानुन, नेपालको संविधान, सुशासन र आइक्यु/गणितका ५० वस्तुगत प्रश्न सेटहरू।',
        targetPill: 'शाखा अधिकृत • नायब सुब्बा • खरिदार',
        activeColor: 'amber'
      };
    }
    return {
      title: 'संगठित संस्था (Public Enterprises & PPP)',
      englishTitle: 'Public Enterprises & PPP Competitive Exam Pre-Test',
      badge: 'आधिकारिक ५० पूर्ण सेट इन्जिन',
      badgeBg: 'bg-[#DC2626]',
      gradient: 'from-blue-700 via-blue-800 to-indigo-900 border-blue-500/30 shadow-blue-950/20',
      icon: Building2,
      description: 'नेपाल राष्ट्र बैंक, कर्मचारी सञ्चय कोष, नागरिक लगानी कोष, नेपाल टेलिकम, नेपाल विद्युत प्राधिकरण लगायत सबै सार्वजनिक संस्थानहरूका लागि अनिवार्य Pre-Test (प्रथम पत्र) का पूर्ण ५० नमुना सेटहरू। प्रति सेट ४५ द्विभाषी (Bilingual), ३ अङ्ग्रेजी र २ नेपाली प्रश्नहरू सहित आधिकारिक परीक्षा नियम अनुसार स्वचालित काउन्टडाउन र नेगेटिभ मार्किङ (-०.४)।',
      targetPill: 'तह ४ (२० अङ्क) • तह ५ (१० अङ्क)',
      activeColor: 'blue'
    };
  }, [quizSubCategory]);

  const HeaderIcon = subCategoryConfig.icon;

  // Filter sets by subcategory, institute/tier, search, difficulty, and range
  const filteredSets = useMemo(() => {
    return allSetMetas.filter((set) => {
      // 1. Subcategory filter
      if (quizSubCategory === 'banking') {
        if (bankingInstituteFilter !== 'ALL' && set.instituteTag !== bankingInstituteFilter) {
          return false;
        }
      } else if (quizSubCategory === 'loksewa') {
        if (loksewaTierFilter === 'OFFICER' && set.setNumber % 3 !== 1) return false;
        if (loksewaTierFilter === 'NASU' && set.setNumber % 3 !== 2) return false;
        if (loksewaTierFilter === 'KHARIDAR' && set.setNumber % 3 !== 0) return false;
      }

      // 2. Search query filter
      const q = searchQuery.trim().toLowerCase();
      const matchesSearch = 
        q === '' || 
        set.title.toLowerCase().includes(q) ||
        set.nepaliTitle.toLowerCase().includes(q) ||
        (set.bankingExamName && set.bankingExamName.toLowerCase().includes(q)) ||
        (set.loksewaExamName && set.loksewaExamName.toLowerCase().includes(q)) ||
        (set.instituteTag && set.instituteTag.toLowerCase().includes(q)) ||
        `set ${set.setNumber}`.includes(q) ||
        `सेट ${set.setNumber}`.includes(q) ||
        String(set.setNumber) === q;

      if (!matchesSearch) return false;

      // 3. Difficulty filter
      const matchesDifficulty = selectedDifficulty === 'All' || set.difficulty === selectedDifficulty;
      if (!matchesDifficulty) return false;

      // 4. Range filter
      let matchesRange = true;
      if (activeSetRange === '1-10') matchesRange = set.setNumber >= 1 && set.setNumber <= 10;
      else if (activeSetRange === '11-20') matchesRange = set.setNumber >= 11 && set.setNumber <= 20;
      else if (activeSetRange === '21-30') matchesRange = set.setNumber >= 21 && set.setNumber <= 30;
      else if (activeSetRange === '31-40') matchesRange = set.setNumber >= 31 && set.setNumber <= 40;
      else if (activeSetRange === '41-50') matchesRange = set.setNumber >= 41 && set.setNumber <= 50;

      return matchesRange;
    });
  }, [allSetMetas, quizSubCategory, bankingInstituteFilter, loksewaTierFilter, searchQuery, selectedDifficulty, activeSetRange]);

  /**
   * Launch a specific 50-question set with strict auth protection
   */
  const handleLaunchSet = (setNumber: number) => {
    if (!requireAuth(() => handleLaunchSet(setNumber), 'परीक्षा अभ्यास सेट सुरु गर्न कृपया पहिले लगइन गर्नुहोस्।')) {
      return;
    }
    try {
      const quizSet = getSangathitSasthaSet(setNumber);
      startQuiz(quizSet);
      if (quizSubCategory === 'banking') {
        const meta = getSetCategoryMeta(setNumber);
        addToast(`${meta.bankingExamName} (सेट ${setNumber}) सुरु भयो! ५० प्रश्नहरू, ४५ मिनेट।`, 'info');
      } else if (quizSubCategory === 'loksewa') {
        const meta = getSetCategoryMeta(setNumber);
        addToast(`${meta.loksewaExamName} (सेट ${setNumber}) सुरु भयो! ५० प्रश्नहरू, ४५ मिनेट।`, 'info');
      } else {
        addToast(`सङ्गठित संस्था सेट ${setNumber} सुरु भयो! ५० प्रश्नहरू, ४५ मिनेट।`, 'info');
      }
    } catch (err) {
      console.error('Failed to launch set', err);
      addToast('क्विज लोड गर्न सकिएन, कृपया पुन: प्रयास गर्नुहोस्।', 'error');
    }
  };

  /**
   * Launch custom randomized quiz with strict auth protection
   */
  const handleLaunchCustomQuiz = () => {
    if (!requireAuth(() => handleLaunchCustomQuiz(), 'अनुकूलित परीक्षा अभ्यास सुरु गर्न कृपया पहिले लगइन गर्नुहोस्।')) {
      return;
    }
    try {
      const quizQuestions = getQuestionsByCategory(customCategory, customCount, customDifficulty);
      const questions = quizQuestions.map(convertQuizQuestionToQuestion);
      const customSet: QuizSet = {
        id: `custom-sanstha-${Date.now()}`,
        title: `सङ्गठित संस्था अभ्यास: ${customCategory === 'All' ? 'एकीकृत' : customCategory} (${questions.length} प्रश्नहरू)`,
        description: `लोक सेवा आयोग संगठित संस्था पाठ्यक्रम ढाँचा - ${questions.length} प्रश्नहरू`,
        category: customCategory === 'All' ? 'Banking' : customCategory,
        difficulty: customDifficulty === 'All' ? 'Medium' : customDifficulty,
        mode: 'exam',
        timeLimitMinutes: customCount === 50 ? 45 : customCount === 20 ? 18 : 10,
        questions,
        badge: `${customCount}Q`
      };
      startQuiz(customSet);
    } catch (err) {
      console.error('Failed to launch custom quiz', err);
      addToast('अभ्यास क्विज लोड गर्न सकिएन।', 'error');
    }
  };

  // If a quiz is active, show ActiveQuiz engine
  if (activeQuiz) {
    return <ActiveQuiz key={activeQuiz.id} quiz={activeQuiz} onExit={exitQuiz} />;
  }

  // If a quiz result is ready, show QuizResult
  if (quizResult) {
    return (
      <QuizResult
        result={quizResult}
        onRetry={() => {
          // If result came from a numbered set, retry that set
          const match = quizResult.quizId?.match(/set-(\d+)/);
          if (match && match[1]) {
            handleLaunchSet(parseInt(match[1], 10));
          } else {
            handleLaunchSet(1);
          }
        }}
        onHome={() => {
          setQuizResult(null);
          setActiveTab('home');
        }}
      />
    );
  }

  const syllabusModules = [
    { num: '१', title: 'नेपालको भूगोल (Geography)', count: '५ प्रश्न', marks: '१० अङ्क' },
    { num: '२', title: 'इतिहास, संस्कृति र सामाजिक व्यवस्था (History & Culture)', count: '५ प्रश्न', marks: '१० अङ्क' },
    { num: '३', title: 'नेपाली अर्थतन्त्र, बैंकिङ र मौद्रिक नीति (Economy & Banking)', count: '५ प्रश्न', marks: '१० अङ्क' },
    { num: '४', title: 'नेपालको संविधान र शासन प्रणाली (Constitution & Governance)', count: '५ प्रश्न', marks: '१० अङ्क' },
    { num: '५', title: 'सार्क, विमस्टेक, संयुक्त राष्ट्रसङ्घ र समसामयिक (SAARC/UN)', count: '५ प्रश्न', marks: '१० अङ्क' },
    { num: '६', title: 'सूचना प्रविधि, कम्प्युटर र एआई (IT, AI & Cyber)', count: '५ प्रश्न', marks: '१० अङ्क' },
    { num: '७', title: 'कार्यालय सञ्चालन, व्यवस्थापन र नेतृत्व (Office Mgmt)', count: '५ प्रश्न', marks: '१० अङ्क' },
    { num: '८', title: 'सार्वजनिक संस्थान व्यवस्थापन (Public Enterprises & PPP)', count: '५ प्रश्न', marks: '१० अङ्क' },
    { num: '९', title: 'सामान्य गणित तथा ऐकिक नियम (General Math)', count: '५ प्रश्न', marks: '१० अङ्क' },
    { num: '१०', title: 'भाषा परीक्षण (English Grammar 3 + Nepali व्याकरण 2)', count: '५ प्रश्न', marks: '१० अङ्क' }
  ];

  return (
    <div className="space-y-6 pb-12 animate-fadeIn">

      {/* STANDARDIZED BREADCRUMBS (13px Muted Slate #64748B) */}
      <nav aria-label="Breadcrumbs" className="flex items-center gap-2 text-[13px] text-[#64748B] dark:text-slate-400">
        <span>गृहपृष्ठ</span>
        <ChevronRight className="w-3.5 h-3.5 text-slate-400 shrink-0" />
        <span>वस्तुगत परीक्षा (MCQ)</span>
        <ChevronRight className="w-3.5 h-3.5 text-slate-400 shrink-0" />
        <span className="font-semibold text-[#0F172A] dark:text-white">५० Pre-Test सेटहरू</span>
      </nav>

      {/* PRIMARY HEADER: 28px Bold, High-Contrast Navy/Slate (#0F172A) */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-[#E2E8F0] dark:border-slate-800">
        <div>
          <h1 className="text-[24px] sm:text-[28px] font-bold text-[#0F172A] dark:text-white leading-tight tracking-tight">
            संगठित संस्था Pre-Test ५० पूर्ण सेटहरू
          </h1>
          <p className="text-[13px] text-[#64748B] dark:text-slate-400 mt-1 leading-relaxed">
            लोक सेवा आयोग आधिकारिक पाठ्यक्रम ढाँचा: ५० वटै पूर्ण परीक्षा सेटहरू, द्विभाषी प्रश्नोत्तर र नेगेटिभ मार्किङ सहित।
          </p>
        </div>
      </div>

      {/* TOP SUB-CATEGORY SWITCHER: संगठित संस्था, बैंकिङ्ग, लोकसेवा */}
      <div 
        id="screen-subcategory-nav"
        className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 p-1.5 bg-slate-100/90 dark:bg-slate-800/80 rounded-2xl border border-[#E2E8F0] dark:border-slate-700 shadow-2xs"
      >
        {/* 1. संगठित संस्था Pre-Test */}
        <button
          type="button"
          id="screen-cat-btn-sangathit"
          onClick={() => selectQuizSubCategory('sangathit')}
          className={`p-3 rounded-xl flex items-center justify-between text-xs sm:text-sm font-bold transition-all cursor-pointer ${
            quizSubCategory === 'sangathit'
              ? 'bg-[#0F172A] text-white shadow-md'
              : 'text-slate-600 dark:text-slate-400 hover:bg-white dark:hover:bg-slate-700/60'
          }`}
        >
          <div className="flex items-center gap-2.5 min-w-0">
            <Building2 className={`w-4 h-4 shrink-0 ${quizSubCategory === 'sangathit' ? 'text-sky-400' : 'text-slate-600 dark:text-slate-400'}`} />
            <div className="text-left truncate">
              <p className="truncate font-bold text-sm">१. संगठित संस्था Pre-Test</p>
              <p className="text-[13px] opacity-80 font-normal text-slate-300 dark:text-slate-400">Public Enterprises Pre-Test</p>
            </div>
          </div>
          <span className="text-[13px] font-mono font-medium px-2 py-0.5 rounded-full bg-slate-800 text-sky-300 border border-slate-700 shrink-0">५० सेट</span>
        </button>

        {/* 2. बैंकिङ्ग परीक्षा तयारी */}
        <button
          type="button"
          id="screen-cat-btn-banking"
          onClick={() => selectQuizSubCategory('banking')}
          className={`p-3 rounded-xl flex items-center justify-between text-xs sm:text-sm font-bold transition-all cursor-pointer ${
            quizSubCategory === 'banking'
              ? 'bg-[#0F172A] text-white shadow-md'
              : 'text-slate-600 dark:text-slate-400 hover:bg-white dark:hover:bg-slate-700/60'
          }`}
        >
          <div className="flex items-center gap-2.5 min-w-0">
            <Landmark className={`w-4 h-4 shrink-0 ${quizSubCategory === 'banking' ? 'text-emerald-400' : 'text-slate-600 dark:text-slate-400'}`} />
            <div className="text-left truncate">
              <p className="truncate font-bold text-sm">२. बैंकिङ्ग परीक्षा तयारी</p>
              <p className="text-[13px] opacity-80 font-normal text-slate-300 dark:text-slate-400">NRB • NBL • RBB • ADBL</p>
            </div>
          </div>
          <span className="text-[13px] font-mono font-medium px-2 py-0.5 rounded-full bg-slate-800 text-emerald-300 border border-slate-700 shrink-0">४ बैंक</span>
        </button>

        {/* 3. निजामती/लोकसेवा तयारी */}
        <button
          type="button"
          id="screen-cat-btn-loksewa"
          onClick={() => selectQuizSubCategory('loksewa')}
          className={`p-3 rounded-xl flex items-center justify-between text-xs sm:text-sm font-bold transition-all cursor-pointer ${
            quizSubCategory === 'loksewa'
              ? 'bg-[#0F172A] text-white shadow-md'
              : 'text-slate-600 dark:text-slate-400 hover:bg-white dark:hover:bg-slate-700/60'
          }`}
        >
          <div className="flex items-center gap-2.5 min-w-0">
            <Scale className={`w-4 h-4 shrink-0 ${quizSubCategory === 'loksewa' ? 'text-amber-400' : 'text-slate-600 dark:text-slate-400'}`} />
            <div className="text-left truncate">
              <p className="truncate font-bold text-sm">३. निजामती/लोकसेवा तयारी</p>
              <p className="text-[13px] opacity-80 font-normal text-slate-300 dark:text-slate-400">अधिकृत • नासु • खरिदार</p>
            </div>
          </div>
          <span className="text-[13px] font-mono font-medium px-2 py-0.5 rounded-full bg-slate-800 text-amber-300 border border-slate-700 shrink-0">PSC</span>
        </button>
      </div>
      
      {/* COMPACT HERO BANNER & SINGLE HIGH-CONTRAST CTA FOCAL POINT (Max 120px-140px, Zero Clutter Tags) */}
      <div className="relative overflow-hidden rounded-2xl bg-[#0F172A] text-white p-4 sm:px-6 sm:py-5 min-h-[120px] max-h-[140px] flex items-center justify-between border border-slate-800 shadow-sm">
        {/* Visual Flow: Title -> Description */}
        <div className="relative z-10 space-y-1 max-w-2xl">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-slate-800 text-sky-400 border border-slate-700 shrink-0 hidden sm:flex">
              <HeaderIcon className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg sm:text-xl font-bold tracking-tight text-white leading-tight">
                {subCategoryConfig.title}
              </h2>
              <p className="text-[13px] font-medium text-sky-300/90 truncate">
                {subCategoryConfig.englishTitle}
              </p>
            </div>
          </div>
          <p className="text-[13px] text-slate-300 leading-snug line-clamp-1 sm:line-clamp-2 max-w-xl">
            {subCategoryConfig.description}
          </p>
        </div>

        {/* Single High-Contrast Focal Action Button */}
        <div className="relative z-10 shrink-0 pl-4">
          <button
            type="button"
            id="hero-btn-start-set-1"
            onClick={() => handleLaunchSet(1)}
            className="px-5 py-2.5 sm:px-6 sm:py-3 rounded-xl bg-[#DC2626] hover:bg-[#B91C1C] active:scale-95 text-white font-bold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-md transition cursor-pointer whitespace-nowrap"
          >
            <Play className="w-4 h-4 fill-white" />
            <span>सेट १ सुरु गर्नुहोस् (Start Set 1)</span>
          </button>
        </div>
      </div>

      {/* Main View Switcher Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200 dark:border-slate-800 pb-3 overflow-x-auto no-scrollbar scroll-smooth">
        <button
          type="button"
          onClick={() => setActiveView('sets')}
          className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold flex items-center gap-2 transition-all cursor-pointer whitespace-nowrap shrink-0 ${
            activeView === 'sets'
              ? 'bg-slate-900 dark:bg-white text-white dark:text-slate-900 shadow-sm'
              : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-800'
          }`}
        >
          <Building2 className="w-4 h-4" />
          <span>५० Pre-Test सेटहरू (50 Sets)</span>
          <span className="px-1.5 py-0.2 rounded bg-red-600 text-white text-[10px] font-mono">50</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveView('syllabus')}
          className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold flex items-center gap-2 transition-all cursor-pointer whitespace-nowrap shrink-0 ${
            activeView === 'syllabus'
              ? 'bg-slate-900 dark:bg-white text-white dark:text-slate-900 shadow-sm'
              : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-800'
          }`}
        >
          <BookOpen className="w-4 h-4" />
          <span>१० खण्ड पाठ्यक्रम ढाँचा (Syllabus)</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveView('custom')}
          className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold flex items-center gap-2 transition-all cursor-pointer whitespace-nowrap shrink-0 ${
            activeView === 'custom'
              ? 'bg-slate-900 dark:bg-white text-white dark:text-slate-900 shadow-sm'
              : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-800'
          }`}
        >
          <Zap className="w-4 h-4" />
          <span>स्वनिर्धारित क्विज (Custom Generator)</span>
        </button>
      </div>

      {/* VIEW 1: 50 PRE-TEST SETS (DEFAULT) */}
      {activeView === 'sets' && (
        <div className="space-y-6">
          
          {/* Master Banner: View-Only Online Practice for Students, Admin PDF Export for Owner */}
          <div className="p-4 sm:p-5 rounded-2xl bg-[#0F172A] text-white border border-slate-800 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div className="flex items-center gap-3.5">
              <div className="p-2.5 rounded-xl bg-slate-800 text-sky-400 border border-slate-700 shrink-0">
                <Building2 className="w-5 h-5" />
              </div>
              <div>
                <div className="flex flex-wrap items-center gap-2">
                  <h3 className="text-[18px] font-semibold text-white leading-tight">
                    {isAdmin ? '५० Pre-Test सेटहरू • व्यवस्थापक PDF एक्सपोर्ट' : '५० Pre-Test सेटहरू • अनलाइन इन्टरएक्टिभ अभ्यास मोड'}
                  </h3>
                  <span className="px-2.5 py-0.5 rounded-full bg-slate-800 border border-slate-700 text-sky-300 text-[11px] font-mono">
                    {isAdmin ? 'Admin Mode (nvisit9@gmail.com)' : '५० सेट • २,५०० MCQs'}
                  </span>
                </div>
                <p className="text-[13px] text-slate-300 mt-1 max-w-xl leading-relaxed">
                  {isAdmin 
                    ? '१० पाठ्यक्रम मोड्युल, द्विभाषी प्रश्नोत्तर, वाटरमार्क, आधिकारिक हेडर र पूर्ण उत्तरकुञ्जी सहित A4 ढाँचामा तत्काल प्रिन्ट वा सेभ गर्नुहोस्।'
                    : '१० पाठ्यक्रम मोड्युल, द्विभाषी प्रश्नोत्तर, नेगेटिभ मार्किङ (-०.४ अङ्क) र तत्काल नतिजा विश्लेषण सहित पूर्ण अनलाइन अभ्यास गर्नुहोस्।'}
                </p>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-2.5 w-full md:w-auto shrink-0">
              {isAdmin ? (
                <>
                  <button
                    type="button"
                    id="btn-export-50-sets-pdf-banner"
                    onClick={() => {
                      setPdfScope('all-50-sets');
                      setIsPdfDialogOpen(true);
                    }}
                    className="w-full sm:w-auto px-4 py-2.5 rounded-xl bg-[#DC2626] hover:bg-[#B91C1C] text-white font-bold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-sm transition cursor-pointer active:scale-95 whitespace-nowrap"
                  >
                    <FileDown className="w-4 h-4" />
                    <span>५० Pre-Test सेटहरू PDF</span>
                  </button>

                  <button
                    type="button"
                    id="btn-export-10k-pdf-banner"
                    onClick={() => {
                      setPdfScope('all-10k');
                      setIsPdfDialogOpen(true);
                    }}
                    className="w-full sm:w-auto px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold text-xs flex items-center justify-center gap-2 border border-slate-700 transition cursor-pointer whitespace-nowrap"
                    title="१०,०००+ प्रश्न भण्डार PDF डाउनलोड गर्नुहोस्"
                  >
                    <Printer className="w-4 h-4 text-amber-400" />
                    <span>१०,०००+ प्रश्न भण्डार PDF</span>
                  </button>
                </>
              ) : (
                <button
                  type="button"
                  id="btn-start-online-practice-banner"
                  onClick={() => handleLaunchSet(1)}
                  className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-sky-600 hover:bg-sky-500 text-white font-bold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-sm transition cursor-pointer active:scale-95 whitespace-nowrap"
                >
                  <Play className="w-4 h-4 fill-white" />
                  <span>अनलाइन अभ्यास सुरु गर्नुहोस् (सेट १)</span>
                </button>
              )}
            </div>
          </div>

          {/* Quick Filter & Search Bar */}
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-4 sm:p-5 border border-slate-200 dark:border-slate-800 shadow-xs space-y-4">
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
              {/* Search input */}
              <div className="relative flex-1">
                <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="सेट नम्बर वा शीर्षक खोज्नुहोस् (उदा. सेट ५, Set 25, L4)..."
                  className="w-full pl-10 pr-4 py-2.5 rounded-2xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-xs sm:text-sm text-slate-800 dark:text-slate-100 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery('')}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-400 hover:text-slate-600"
                  >
                    हटाउनुहोस्
                  </button>
                )}
              </div>

              {/* Difficulty selector */}
              <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
                {(['All', 'Easy', 'Medium', 'Hard'] as const).map((diff) => (
                  <button
                    key={diff}
                    type="button"
                    onClick={() => setSelectedDifficulty(diff)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition whitespace-nowrap cursor-pointer ${
                      selectedDifficulty === diff
                        ? 'bg-blue-600 text-white shadow-xs'
                        : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700'
                    }`}
                  >
                    {diff === 'All' ? 'सबै स्तर (All)' : diff === 'Easy' ? 'सरल (सेट १-१५)' : diff === 'Medium' ? 'मध्यम (सेट १६-३५)' : 'कठिन (सेट ३६-५०)'}
                  </button>
                ))}
              </div>
            </div>

            {/* Sub-Category Specific Filter Chips (Banking Institutes or Loksewa Levels) */}
            {quizSubCategory === 'banking' && (
              <div className="flex items-center gap-2 overflow-x-auto pt-2 border-t border-slate-100 dark:border-slate-800 text-xs">
                <span className="font-bold text-slate-500 dark:text-slate-400 shrink-0 flex items-center gap-1.5">
                  <Landmark className="w-3.5 h-3.5 text-emerald-600" />
                  <span>बैंक छनोट:</span>
                </span>
                {[
                  { id: 'ALL', label: 'सबै बैंकिङ्ग (All Banks)' },
                  { id: 'NRB', label: 'नेपाल राष्ट्र बैंक (NRB)' },
                  { id: 'RBB', label: 'राष्ट्रिय वाणिज्य बैंक (RBB)' },
                  { id: 'NBL', label: 'नेपाल बैंक लिमिटेड (NBL)' },
                  { id: 'ADBL', label: 'कृषि विकास बैंक (ADBL)' }
                ].map((bank) => (
                  <button
                    key={bank.id}
                    type="button"
                    onClick={() => setBankingInstituteFilter(bank.id as any)}
                    className={`px-3 py-1.5 rounded-xl font-bold transition cursor-pointer whitespace-nowrap ${
                      bankingInstituteFilter === bank.id
                        ? 'bg-emerald-600 text-white shadow-xs'
                        : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-emerald-50 dark:hover:bg-slate-700'
                    }`}
                  >
                    {bank.label}
                  </button>
                ))}
              </div>
            )}

            {quizSubCategory === 'loksewa' && (
              <div className="flex items-center gap-2 overflow-x-auto pt-2 border-t border-slate-100 dark:border-slate-800 text-xs">
                <span className="font-bold text-slate-500 dark:text-slate-400 shrink-0 flex items-center gap-1.5">
                  <Scale className="w-3.5 h-3.5 text-amber-600" />
                  <span>तह छनोट:</span>
                </span>
                {[
                  { id: 'ALL', label: 'सबै लोकसेवा (All PSC)' },
                  { id: 'OFFICER', label: 'शाखा अधिकृत (Section Officer)' },
                  { id: 'NASU', label: 'नायब सुब्बा (Nayab Subba)' },
                  { id: 'KHARIDAR', label: 'खरिदार (Kharidar)' }
                ].map((tier) => (
                  <button
                    key={tier.id}
                    type="button"
                    onClick={() => setLoksewaTierFilter(tier.id as any)}
                    className={`px-3 py-1.5 rounded-xl font-bold transition cursor-pointer whitespace-nowrap ${
                      loksewaTierFilter === tier.id
                        ? 'bg-amber-600 text-white shadow-xs'
                        : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-amber-50 dark:hover:bg-slate-700'
                    }`}
                  >
                    {tier.label}
                  </button>
                ))}
              </div>
            )}

            {/* Quick Set Range Pills */}
            <div className="flex items-center gap-2 overflow-x-auto pt-2 border-t border-slate-100 dark:border-slate-800 text-xs">
              <span className="font-bold text-slate-400 shrink-0">द्रुत छनोट:</span>
              {[
                { id: 'all', label: 'सबै ५० सेट' },
                { id: '1-10', label: 'सेट १ - १०' },
                { id: '11-20', label: 'सेट ११ - २०' },
                { id: '21-30', label: 'सेट २१ - ३०' },
                { id: '31-40', label: 'सेट ३१ - ४०' },
                { id: '41-50', label: 'सेट ४१ - ५०' }
              ].map((range) => (
                <button
                  key={range.id}
                  type="button"
                  onClick={() => setActiveSetRange(range.id as any)}
                  className={`px-3 py-1 rounded-lg font-bold transition cursor-pointer whitespace-nowrap ${
                    activeSetRange === range.id
                      ? 'bg-slate-900 dark:bg-white text-white dark:text-slate-900'
                      : 'bg-slate-100 dark:bg-slate-800/80 text-slate-600 dark:text-slate-400 hover:bg-slate-200'
                  }`}
                >
                  {range.label}
                </button>
              ))}

              <span className="ml-auto text-[11px] text-slate-400 font-semibold shrink-0">
                जम्मा: <span className="text-blue-600 dark:text-blue-400 font-bold">{filteredSets.length}</span> सेटहरू उपलब्ध
              </span>
            </div>
          </div>

          {/* 50 SETS RESPONSIVE GRID (Standard 24px Gap, Consistent 1px #E2E8F0 Borders) */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredSets.map((set) => {
              const isEasy = set.setNumber <= 15;
              const isMedium = set.setNumber > 15 && set.setNumber <= 35;
              const isHard = set.setNumber > 35;

              const isBanking = quizSubCategory === 'banking';
              const isLoksewa = quizSubCategory === 'loksewa';

              const cardTitle = isBanking && set.bankingExamName 
                ? set.bankingExamName 
                : isLoksewa && set.loksewaExamName 
                  ? set.loksewaExamName 
                  : set.nepaliTitle;

              return (
                <div
                  key={set.id}
                  className="bg-white dark:bg-[#0F172A] rounded-2xl p-5 sm:p-6 border border-[#E2E8F0] dark:border-slate-800 hover:border-sky-400/80 dark:hover:border-sky-500/80 shadow-2xs hover:shadow-xs transition-all flex flex-col justify-between h-full group"
                >
                  <div className="space-y-3">
                    {/* Header line with Set Number Badge, Category/Institute Badge and Difficulty */}
                    <div className="flex items-center justify-between gap-1.5 flex-wrap">
                      <div className="flex items-center gap-1.5 flex-wrap">
                        <span className="px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 font-mono font-bold text-[13px]">
                          सेट {set.setNumber}
                        </span>

                        {isBanking ? (
                          <span className="px-2.5 py-0.5 rounded-lg bg-slate-100 dark:bg-slate-800 text-[#64748B] dark:text-slate-400 text-[13px] font-medium">
                            {set.instituteTag === 'NRB' ? 'राष्ट्र बैंक (NRB)' : set.instituteTag === 'RBB' ? 'रा.वा. बैंक (RBB)' : set.instituteTag === 'NBL' ? 'नेपाल बैंक (NBL)' : 'कृषि बैंक (ADBL)'}
                          </span>
                        ) : isLoksewa ? (
                          <span className="px-2.5 py-0.5 rounded-lg bg-slate-100 dark:bg-slate-800 text-[#64748B] dark:text-slate-400 text-[13px] font-medium">
                            {set.setNumber % 3 === 1 ? 'शाखा अधिकृत' : set.setNumber % 3 === 2 ? 'नायब सुब्बा' : 'खरिदार'}
                          </span>
                        ) : (
                          <span className="px-2.5 py-0.5 rounded-lg bg-slate-100 dark:bg-slate-800 text-[13px] font-medium text-[#64748B] dark:text-slate-400">
                            {set.targetLevel}
                          </span>
                        )}
                      </div>

                      <span className="text-[13px] font-medium text-[#64748B] dark:text-slate-400">
                        {set.difficulty}
                      </span>
                    </div>

                    {/* Title: 18px Semi-Bold (#1E293B) */}
                    <div>
                      <h3 className="text-[18px] font-semibold text-[#1E293B] dark:text-slate-100 group-hover:text-sky-600 dark:group-hover:text-sky-400 transition-colors line-clamp-1">
                        {cardTitle}
                      </h3>
                      <p className="text-[13px] text-[#64748B] dark:text-slate-400 line-clamp-2 mt-1.5 leading-relaxed">
                        {set.description}
                      </p>
                    </div>

                    {/* Set Specifications */}
                    <div className="grid grid-cols-3 gap-2 pt-3 border-t border-[#E2E8F0] dark:border-slate-800 text-[13px]">
                      <div className="bg-slate-50 dark:bg-slate-800/50 p-2 rounded-xl text-center">
                        <span className="block text-[#64748B] text-[11px]">प्रश्न संख्या</span>
                        <span className="text-[13px] font-medium text-[#1E293B] dark:text-slate-200">५० MCQs</span>
                      </div>
                      <div className="bg-slate-50 dark:bg-slate-800/50 p-2 rounded-xl text-center">
                        <span className="block text-[#64748B] text-[11px]">समय सीमा</span>
                        <span className="text-[13px] font-medium text-[#1E293B] dark:text-slate-200">४५ मिनेट</span>
                      </div>
                      <div className="bg-slate-50 dark:bg-slate-800/50 p-2 rounded-xl text-center">
                        <span className="block text-[#64748B] text-[11px]">पूर्णाङ्क</span>
                        <span className="text-[13px] font-medium text-[#1E293B] dark:text-slate-200">१०० अङ्क</span>
                      </div>
                    </div>

                    {/* Question breakdown pill */}
                    <div className="px-3 py-1.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-[#E2E8F0] dark:border-slate-800 text-[13px] text-[#64748B] dark:text-slate-400 flex items-center justify-between">
                      <span>ढाँचा: ४५ Bilingual + ३ Eng + २ Nep</span>
                      <span className="text-[13px] text-red-600 dark:text-red-400 font-medium">-०.४ अङ्क/गलत</span>
                    </div>
                  </div>

                  {/* Matching Action Buttons Anchored to Bottom Across All Cards */}
                  <div className="mt-auto pt-4 border-t border-[#E2E8F0] dark:border-slate-800/80 flex items-center gap-2.5">
                    {isAdmin && (
                      <button
                        type="button"
                        id={`btn-card-pdf-${set.setNumber}`}
                        onClick={() => {
                          setPdfScope('single-set');
                          setPdfSetNum(set.setNumber);
                          setIsPdfDialogOpen(true);
                        }}
                        className="py-2.5 px-3 rounded-xl border border-[#E2E8F0] dark:border-slate-700 bg-slate-50 dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 text-[#1E293B] dark:text-slate-200 text-xs font-semibold flex items-center justify-center gap-1.5 transition cursor-pointer"
                        title={`सेट ${set.setNumber} A4 PDF डाउनलोड (व्यवस्थापक)`}
                      >
                        <Download className="w-4 h-4 text-red-500" />
                        <span>PDF</span>
                      </button>
                    )}

                    <button
                      type="button"
                      onClick={() => handleLaunchSet(set.setNumber)}
                      className="flex-1 py-2.5 px-4 rounded-xl text-white font-semibold text-xs sm:text-sm flex items-center justify-center gap-2 bg-[#0F172A] dark:bg-slate-800 hover:bg-sky-600 dark:hover:bg-sky-600 active:scale-98 transition-all cursor-pointer shadow-2xs"
                    >
                      <Play className="w-4 h-4 fill-white" />
                      <span>सेट सुरु गर्नुहोस्</span>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

          {filteredSets.length === 0 && (
            <div className="py-16 text-center bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-slate-100 dark:bg-slate-800 text-slate-400 flex items-center justify-center mx-auto">
                <Search className="w-6 h-6" />
              </div>
              <h3 className="font-black text-base text-slate-800 dark:text-slate-200">कुनै सेट फेला परेन</h3>
              <p className="text-xs text-slate-400 max-w-sm mx-auto">
                तपाईंको खोजी अनुसार कुनै सेट भेटिएन। कृपया सेट नम्बर वा शब्द परिवर्तन गर्नुहोस्।
              </p>
              <button
                onClick={() => {
                  setSearchQuery('');
                  setSelectedDifficulty('All');
                  setActiveSetRange('all');
                }}
                className="px-4 py-2 rounded-xl bg-blue-600 text-white font-bold text-xs"
              >
                सबै ५० सेटहरू देखाउनुहोस्
              </button>
            </div>
          )}

        </div>
      )}

      {/* VIEW 2: 10 SYLLABUS MODULES BREAKDOWN */}
      {activeView === 'syllabus' && (
        <div className="space-y-6">
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200 dark:border-slate-800 shadow-xs space-y-4">
            <div className="flex items-center gap-3">
              <div className="p-3 rounded-2xl bg-blue-100 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400">
                <Layers className="w-6 h-6" />
              </div>
              <div>
                <h2 className="text-lg font-black text-slate-900 dark:text-white">
                  संगठित संस्था Pre-Test १० खण्ड आधिकारिक पाठ्यक्रम ढाँचा
                </h2>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  तह ४ (सहायक) र तह ५ (वरिष्ठ सहायक) को प्रथम पत्र वस्तुगत परीक्षा (MCQ) अङ्कभार विभाजन
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-2">
              {syllabusModules.map((mod) => (
                <div 
                  key={mod.num}
                  className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/80 dark:border-slate-700/60 flex items-center justify-between gap-3"
                >
                  <div className="flex items-center gap-3">
                    <span className="w-8 h-8 rounded-xl bg-blue-600 text-white font-black text-xs flex items-center justify-center shrink-0">
                      {mod.num}
                    </span>
                    <div>
                      <h4 className="font-bold text-xs sm:text-sm text-slate-800 dark:text-slate-200">
                        {mod.title}
                      </h4>
                      <span className="text-[11px] text-slate-400">
                        ५ वस्तुगत प्रश्नहरू प्रति सेट
                      </span>
                    </div>
                  </div>

                  <div className="text-right shrink-0">
                    <span className="block font-black text-xs text-emerald-600 dark:text-emerald-400">
                      {mod.marks}
                    </span>
                    <span className="text-[10px] text-slate-400 font-mono">
                      (२ अङ्क/प्रश्न)
                    </span>
                  </div>
                </div>
              ))}
            </div>

            <div className="p-4 rounded-2xl bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800/40 text-xs text-amber-900 dark:text-amber-200 space-y-1">
              <h5 className="font-black flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-amber-600" />
                <span>परीक्षा नियम तथा नेगेटिभ मार्किङ मापदण्ड:</span>
              </h5>
              <p>• पूर्णाङ्क: १०० | उत्तीर्णाङ्क: ४० अङ्क | समय: ४५ मिनेट | प्रश्न संख्या: ५०</p>
              <p>• प्रत्येक सही उत्तरका लागि २ अङ्क प्राप्त हुनेछ।</p>
              <p>• प्रत्येक गलत उत्तरका लागि २०% अर्थात् ०.४ अङ्क कट्टा (Negative Marking) गरिनेछ। उत्तर नदिएमा कुनै अङ्क कट्टा हुने छैन।</p>
            </div>
          </div>
        </div>
      )}

      {/* VIEW 3: CUSTOM QUIZ GENERATOR */}
      {activeView === 'custom' && (
        <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200 dark:border-slate-800 shadow-xs space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-black text-slate-900 dark:text-white">
                स्वनिर्धारित विषयगत अभ्यास (Custom Topic Generator)
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                कुनै खास विषय वा अङ्कभारमा छुट्टै अभ्यास गर्न तलका विकल्पहरू छान्नुहोस्
              </p>
            </div>
            <span className="px-3 py-1 rounded-full bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300 text-xs font-bold">
              १०,०००+ प्रश्न भण्डार
            </span>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">
                विषय छान्नुहोस् (Category):
              </label>
              <div className="flex flex-wrap gap-2">
                {([
                  'All', 
                  'Banking', 
                  'NRB', 
                  'PublicEnterprises',
                  'Economics', 
                  'Management', 
                  'Accounting', 
                  'Law', 
                  'Computer', 
                  'Mathematics', 
                  'English', 
                  'Nepali', 
                  'Current Affairs'
                ] as const).map((cat) => (
                  <button
                    key={cat}
                    type="button"
                    onClick={() => setCustomCategory(cat as any)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer ${
                      customCategory === cat
                        ? 'bg-blue-600 text-white shadow-xs'
                        : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">
                प्रश्न संख्या (Question Count):
              </label>
              <div className="flex gap-3">
                {([10, 20, 50] as const).map((c) => (
                  <button
                    key={c}
                    type="button"
                    onClick={() => setCustomCount(c)}
                    className={`px-5 py-2.5 rounded-xl text-xs font-black transition cursor-pointer ${
                      customCount === c
                        ? 'bg-slate-900 dark:bg-white text-white dark:text-slate-900 shadow-sm'
                        : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
                    }`}
                  >
                    {c} प्रश्नहरू ({c === 50 ? '४५ मिनेट' : c === 20 ? '१८ मिनेट' : '१० मिनेट'})
                  </button>
                ))}
              </div>
            </div>

            <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex justify-end">
              <button
                type="button"
                onClick={handleLaunchCustomQuiz}
                className="px-6 py-3 rounded-2xl bg-[#DC2626] hover:bg-[#B91C1C] text-white font-black text-sm flex items-center gap-2 shadow-md cursor-pointer active:scale-95"
              >
                <Play className="w-4 h-4 fill-white" />
                <span>अभ्यास सुरु गर्नुहोस् ({customCount} प्रश्न)</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* PDF Generation Engine Dialog */}
      {isPdfDialogOpen && (
        <PdfExportDialog
          isOpen={isPdfDialogOpen}
          onClose={() => setIsPdfDialogOpen(false)}
          defaultScope={pdfScope}
          defaultSetNumber={pdfSetNum}
        />
      )}
    </div>
  );
};
