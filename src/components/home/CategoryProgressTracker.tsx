import React, { useState, useEffect } from 'react';
import { 
  Building2, 
  Landmark, 
  Scale, 
  CheckCircle2, 
  Circle, 
  ChevronDown, 
  ChevronUp, 
  TrendingUp, 
  Sparkles, 
  ArrowRight, 
  Award, 
  BookOpen, 
  Zap, 
  HelpCircle,
  FileCheck2,
  Trophy,
  Check,
  RotateCcw
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { 
  ExamProgressService, 
  ExamCategoryKey, 
  CategoryProgressData,
  CategoryTopicItem
} from '../../services/examProgressService';
import { getQuestionsByCategory, convertQuizQuestionToQuestion } from '../../data/quizData';
import { QuizSet } from '../../types';

interface CategoryProgressTrackerProps {
  className?: string;
  defaultExpandedCategory?: ExamCategoryKey | null;
}

export const CategoryProgressTracker: React.FC<CategoryProgressTrackerProps> = ({ 
  className = '',
  defaultExpandedCategory = null
}) => {
  const { user, setActiveTab, openNoteReader, startQuiz, addToast } = useApp();

  const [progressData, setProgressData] = useState<Record<ExamCategoryKey, CategoryProgressData>>(() => 
    ExamProgressService.getAllCategoryProgress(user)
  );
  const [overallReadiness, setOverallReadiness] = useState(() => 
    ExamProgressService.getOverallReadiness(user)
  );
  const [activeFilter, setActiveFilter] = useState<'all' | ExamCategoryKey>('all');
  const [expandedCategory, setExpandedCategory] = useState<ExamCategoryKey | null>(defaultExpandedCategory);

  // Sync state whenever external progress update event fires
  const refreshProgress = () => {
    setProgressData(ExamProgressService.getAllCategoryProgress(user));
    setOverallReadiness(ExamProgressService.getOverallReadiness(user));
  };

  useEffect(() => {
    refreshProgress();
    const handleProgressChange = () => {
      refreshProgress();
    };

    window.addEventListener('btn:category-progress-updated', handleProgressChange);
    return () => {
      window.removeEventListener('btn:category-progress-updated', handleProgressChange);
    };
  }, [user]);

  // Handle toggling topic completion status
  const handleToggleTopic = (category: ExamCategoryKey, topic: CategoryTopicItem) => {
    const isNowDone = ExamProgressService.toggleTopic(category, topic.id);
    refreshProgress();

    if (isNowDone) {
      addToast(
        `✓ ${category === 'Banking' ? 'बैंकिङ' : category === 'Loksewa' ? 'लोकसेवा' : 'NRB'}: "${topic.titleNe.substring(0, 32)}..." पूरा भएको चिन्ह लगाइयो! (+२५ XP)`,
        'success'
      );
    } else {
      addToast(`"${topic.titleNe.substring(0, 32)}..." लाई पुनः अध्ययन सूचीमा राखियो।`, 'info');
    }
  };

  // Launch category practice quiz
  const handleLaunchCategoryQuiz = (category: ExamCategoryKey) => {
    const catSearch = category === 'Banking' ? 'Banking' : category === 'NRB' ? 'NRB' : 'Loksewa';
    const pulled = getQuestionsByCategory(catSearch as any, 10, 'Medium');
    const questions = pulled.map(convertQuizQuestionToQuestion);

    const quizSet: QuizSet = {
      id: `progress-quiz-${category.toLowerCase()}-${Date.now()}`,
      title: `${category === 'Banking' ? 'बैंकिङ' : category === 'Loksewa' ? 'लोकसेवा' : 'नेपाल राष्ट्र बैंक'} विशेष प्रगति क्विज`,
      description: `तपाईंको ${category} पाठ्यक्रम प्रगति दर वृद्धि गर्न १० महत्त्वपूर्ण अभ्यास प्रश्नहरू।`,
      category: category === 'Banking' ? 'Banking' : category === 'NRB' ? 'NRB' : 'Loksewa',
      difficulty: 'Medium',
      mode: 'practice',
      timeLimitMinutes: 6,
      questions: questions,
      badge: `${category} Progress`
    };

    startQuiz(quizSet);
  };

  // Open related study note
  const handleStudyTopic = (topic: CategoryTopicItem) => {
    if (topic.actsOrSyllabusRef.includes('BAFIA')) {
      openNoteReader('note-bafia-2073');
    } else if (topic.actsOrSyllabusRef.includes('NRB Act') || topic.actsOrSyllabusRef.includes('राष्ट्र बैंक ऐन')) {
      openNoteReader('note-nrb-act-2058');
    } else if (topic.actsOrSyllabusRef.includes('संविधान')) {
      openNoteReader('note-nepal-constitution-2072');
    } else {
      setActiveTab('free-notes');
    }
  };

  const categoriesToDisplay: ExamCategoryKey[] = activeFilter === 'all' 
    ? ['Banking', 'Loksewa', 'NRB']
    : [activeFilter];

  return (
    <section 
      id="category-progress-tracker"
      className={`space-y-6 ${className}`}
      aria-label="Exam Categories Progress Tracker"
    >
      {/* Tracker Section Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-3 border-b border-slate-200 dark:border-slate-800">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full bg-blue-100 dark:bg-blue-950/80 text-blue-700 dark:text-blue-300 text-[11px] font-black uppercase tracking-wider border border-blue-200 dark:border-blue-800">
              Exam Syllabus Readiness
            </span>
            <span className="text-xs font-bold text-slate-500 dark:text-slate-400">
              लाइभ पाठ्यक्रम ट्रयाकर
            </span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white tracking-tight flex items-center gap-2">
            <span>परीक्षागत पाठ्यक्रम प्रगति (Category Progress)</span>
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 max-w-2xl leading-relaxed">
            बैंकिङ, लोकसेवा र नेपाल राष्ट्र बैंक (NRB) पाठ्यक्रम अनुसार पूरा भएका शीर्षकहरू, क्विज र तयारी प्रतिशत।
          </p>
        </div>

        {/* Category Filter Tabs */}
        <div className="flex items-center gap-1.5 p-1 bg-slate-200/80 dark:bg-slate-800/80 rounded-xl shrink-0 self-start md:self-center">
          <button
            id="filter-all-categories"
            type="button"
            onClick={() => setActiveFilter('all')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              activeFilter === 'all'
                ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-xs'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            सबै विषय ({overallReadiness.overallPercentage}%)
          </button>
          <button
            id="filter-banking-category"
            type="button"
            onClick={() => setActiveFilter('Banking')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              activeFilter === 'Banking'
                ? 'bg-blue-600 text-white shadow-xs'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            Banking ({progressData.Banking.completionPercentage}%)
          </button>
          <button
            id="filter-loksewa-category"
            type="button"
            onClick={() => setActiveFilter('Loksewa')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              activeFilter === 'Loksewa'
                ? 'bg-amber-600 text-white shadow-xs'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            Loksewa ({progressData.Loksewa.completionPercentage}%)
          </button>
          <button
            id="filter-nrb-category"
            type="button"
            onClick={() => setActiveFilter('NRB')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              activeFilter === 'NRB'
                ? 'bg-emerald-600 text-white shadow-xs'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            NRB ({progressData.NRB.completionPercentage}%)
          </button>
        </div>
      </div>

      {/* Aggregate Overview Banner: Clean High-Contrast Card */}
      <div 
        id="overall-readiness-banner"
        className="p-5 sm:p-6 rounded-2xl bg-gradient-to-br from-slate-900 via-[#0B2046] to-slate-900 text-white border border-slate-700/80 shadow-md relative overflow-hidden"
      >
        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          
          {/* Left Stats & Gauge */}
          <div className="flex items-center gap-5 sm:gap-6 min-w-0">
            
            {/* Circular Progress Gauge */}
            <div className="relative w-20 h-20 sm:w-24 sm:h-24 shrink-0 flex items-center justify-center">
              <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
                {/* Background Ring */}
                <circle
                  cx="50"
                  cy="50"
                  r="40"
                  fill="transparent"
                  stroke="rgba(255,255,255,0.12)"
                  strokeWidth="8"
                />
                {/* Dynamic Stroke Fill */}
                <circle
                  cx="50"
                  cy="50"
                  r="40"
                  fill="transparent"
                  stroke="#38BDF8"
                  strokeWidth="8"
                  strokeDasharray={251.2}
                  strokeDashoffset={251.2 - (251.2 * overallReadiness.overallPercentage) / 100}
                  strokeLinecap="round"
                  className="transition-all duration-700 ease-out"
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                <span className="text-xl sm:text-2xl font-black text-white leading-none">
                  {overallReadiness.overallPercentage}%
                </span>
                <span className="text-[10px] text-sky-300 font-semibold mt-0.5">
                  समग्र तयारी
                </span>
              </div>
            </div>

            {/* Title & Detailed Breakdown */}
            <div className="space-y-1.5 min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="px-2.5 py-0.5 rounded-full bg-sky-500/20 text-[#38BDF8] border border-sky-400/30 text-[10px] sm:text-xs font-bold">
                  {overallReadiness.readinessGrade}
                </span>
                <span className="text-xs text-slate-300 font-medium">
                  ३ मुख्य संकायहरूको विश्लेषण
                </span>
              </div>
              <h3 className="text-base sm:text-lg font-black text-white truncate">
                एकीकृत परीक्षा पाठ्यक्रम तयारी सूचक
              </h3>
              <p className="text-xs text-slate-300 line-clamp-2">
                तपाईंले ३० मध्ये <strong className="text-sky-300 font-bold">{overallReadiness.totalCompletedTopics} मुख्य शीर्षकहरू</strong> र कुल <strong className="text-sky-300 font-bold">{overallReadiness.totalQuizzesTaken} क्विज सेटहरू</strong> सम्पन्न गर्नुभएको छ।
              </p>
            </div>
          </div>

          {/* Right Action Buttons */}
          <div className="flex items-center gap-3 shrink-0 self-stretch sm:self-auto justify-end">
            <button
              id="continue-learning-btn"
              type="button"
              onClick={() => setActiveTab('courses')}
              className="px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold text-xs transition border border-white/20 flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <BookOpen className="w-3.5 h-3.5 text-sky-400" />
              <span>सम्पूर्ण पाठ्यक्रम</span>
            </button>
            <button
              id="quick-start-practice-btn"
              type="button"
              onClick={() => handleLaunchCategoryQuiz('Banking')}
              className="px-5 py-2.5 rounded-xl bg-[#2563EB] hover:bg-blue-600 text-white font-black text-xs transition shadow-md flex items-center justify-center gap-1.5 cursor-pointer active:scale-95"
            >
              <Zap className="w-3.5 h-3.5 text-amber-300 fill-current" />
              <span>दैनिक अभ्यास सुरु</span>
            </button>
          </div>

        </div>
      </div>

      {/* 3 Visual Progress Cards: Banking, Loksewa, NRB */}
      <div className={`grid gap-6 ${activeFilter === 'all' ? 'grid-cols-1 md:grid-cols-3' : 'grid-cols-1'}`}>
        {categoriesToDisplay.map((catKey) => {
          const cat = progressData[catKey];
          const isExpanded = expandedCategory === catKey;

          const IconComponent = catKey === 'Banking' 
            ? Building2 
            : catKey === 'Loksewa' 
            ? Scale 
            : Landmark;

          const accentBg = catKey === 'Banking'
            ? 'bg-blue-600 text-white'
            : catKey === 'Loksewa'
            ? 'bg-amber-600 text-white'
            : 'bg-emerald-600 text-white';

          const accentRingColor = catKey === 'Banking'
            ? '#2563EB'
            : catKey === 'Loksewa'
            ? '#D97706'
            : '#059669';

          const cardBorder = catKey === 'Banking'
            ? 'border-blue-200 dark:border-blue-800/80 hover:border-blue-400'
            : catKey === 'Loksewa'
            ? 'border-amber-200 dark:border-amber-800/80 hover:border-amber-400'
            : 'border-emerald-200 dark:border-emerald-800/80 hover:border-emerald-400';

          return (
            <div
              key={catKey}
              id={`progress-card-${catKey.toLowerCase()}`}
              className={`rounded-2xl bg-white dark:bg-slate-900 border ${cardBorder} p-5 sm:p-6 shadow-sm transition-all duration-200 flex flex-col justify-between`}
            >
              {/* Card Header */}
              <div className="space-y-4">
                
                {/* Top Badge & Icon */}
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3 min-w-0">
                    <div className={`p-2.5 rounded-xl ${accentBg} shadow-sm shrink-0`}>
                      <IconComponent className="w-5 h-5" />
                    </div>
                    <div className="min-w-0">
                      <span className="text-[10px] font-black uppercase tracking-wider text-slate-500 dark:text-slate-400 block truncate">
                        {cat.badge} • {cat.targetExamLabel}
                      </span>
                      <h3 className="text-base sm:text-lg font-black text-slate-900 dark:text-white truncate">
                        {catKey === 'Banking' ? 'बैंकिङ तयारी (Banking)' : catKey === 'Loksewa' ? 'लोकसेवा आयोग (Loksewa)' : 'नेपाल राष्ट्र बैंक (NRB)'}
                      </h3>
                    </div>
                  </div>

                  <span className={`px-2.5 py-1 rounded-full text-xs font-black shrink-0 ${
                    cat.completionPercentage >= 70
                      ? 'bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800'
                      : cat.completionPercentage >= 40
                      ? 'bg-sky-100 dark:bg-sky-950/60 text-sky-800 dark:text-sky-300 border border-sky-300 dark:border-sky-800'
                      : 'bg-amber-100 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300 border border-amber-300 dark:border-amber-800'
                  }`}>
                    {cat.completionPercentage}% पूरा
                  </span>
                </div>

                {/* Progress Bar & Sub-stats */}
                <div className="space-y-2 pt-1">
                  <div className="flex items-center justify-between text-xs font-bold text-slate-600 dark:text-slate-300">
                    <span>पाठ्यक्रम पूर्णता दर</span>
                    <span className="text-slate-900 dark:text-white font-black">{cat.completionPercentage}%</span>
                  </div>

                  {/* High contrast visual progress track */}
                  <div className="w-full h-2.5 bg-slate-200 dark:bg-slate-700/80 rounded-full overflow-hidden p-0.5">
                    <div
                      className="h-full rounded-full transition-all duration-500 ease-out"
                      style={{ 
                        width: `${cat.completionPercentage}%`,
                        backgroundColor: accentRingColor
                      }}
                    />
                  </div>

                  <p className="text-[11px] text-slate-500 dark:text-slate-400 font-medium">
                    स्थिति: <strong className="text-slate-800 dark:text-slate-200">{cat.statusLabel}</strong>
                  </p>
                </div>

                {/* 3-Column Key Metric Boxes */}
                <div className="grid grid-cols-3 gap-2 pt-2 border-t border-slate-100 dark:border-slate-800/80 text-center">
                  <div className="p-2 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800">
                    <span className="text-[10px] text-slate-500 dark:text-slate-400 block font-medium">शीर्षकहरू</span>
                    <span className="text-xs sm:text-sm font-black text-slate-900 dark:text-white">
                      {cat.completedTopicsCount}/{cat.totalTopics}
                    </span>
                  </div>
                  <div className="p-2 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800">
                    <span className="text-[10px] text-slate-500 dark:text-slate-400 block font-medium">अभ्यास क्विज</span>
                    <span className="text-xs sm:text-sm font-black text-slate-900 dark:text-white">
                      {cat.quizzesAttempted} सेट
                    </span>
                  </div>
                  <div className="p-2 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800">
                    <span className="text-[10px] text-slate-500 dark:text-slate-400 block font-medium">औसत शुद्धता</span>
                    <span className="text-xs sm:text-sm font-black text-slate-900 dark:text-white">
                      {cat.accuracy}%
                    </span>
                  </div>
                </div>

                {/* Next Milestone Tip */}
                <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/60 text-xs flex items-start gap-2">
                  <Sparkles className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
                  <div className="min-w-0">
                    <span className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-tight block">
                      अर्को प्राथमिकता शीर्षक
                    </span>
                    <p className="text-slate-800 dark:text-slate-200 font-bold truncate">
                      {cat.nextMilestone}
                    </p>
                  </div>
                </div>

              </div>

              {/* Card Footer Actions & Expandable Topic Checklist */}
              <div className="mt-5 pt-3 border-t border-slate-100 dark:border-slate-800 space-y-3">
                
                {/* Main Action Buttons */}
                <div className="flex items-center gap-2">
                  <button
                    id={`toggle-topics-${catKey.toLowerCase()}`}
                    type="button"
                    onClick={() => setExpandedCategory(isExpanded ? null : catKey)}
                    className="flex-1 py-2 px-3 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 text-xs font-bold transition flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    <span>{isExpanded ? 'शीर्षक सूची लुकाउनुहोस्' : `पाठ्यक्रम सूची (${cat.completedTopicsCount}/${cat.totalTopics})`}</span>
                    {isExpanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                  </button>

                  <button
                    id={`practice-btn-${catKey.toLowerCase()}`}
                    type="button"
                    onClick={() => handleLaunchCategoryQuiz(catKey)}
                    className={`py-2 px-3.5 rounded-xl ${accentBg} hover:opacity-90 font-bold text-xs transition flex items-center justify-center gap-1 cursor-pointer shrink-0 shadow-xs active:scale-95`}
                    title={`${catKey} विशेष क्विज सुरु गर्नुहोस्`}
                  >
                    <Zap className="w-3.5 h-3.5 fill-current" />
                    <span>क्विज अभ्यास</span>
                  </button>
                </div>

                {/* Expanded In-Card Syllabus Topic Checklist */}
                {isExpanded && (
                  <div 
                    id={`syllabus-checklist-${catKey.toLowerCase()}`}
                    className="space-y-2 pt-2 animate-in fade-in slide-in-from-top-2 duration-200"
                  >
                    <div className="flex items-center justify-between text-[11px] font-bold text-slate-500 dark:text-slate-400 px-1">
                      <span>१० मूल पाठ्यक्रम शीर्षकहरू (क्लिक गरी मार्क गर्नुहोस्)</span>
                      <span>{cat.completedTopicsCount} सम्पन्न</span>
                    </div>

                    <div className="max-h-80 overflow-y-auto pr-1 space-y-1.5 divide-y divide-slate-100 dark:divide-slate-800/80">
                      {cat.topics.map((topic, idx) => {
                        const isCompleted = cat.completedTopicIds.includes(topic.id);
                        return (
                          <div
                            key={topic.id}
                            className={`p-2.5 rounded-xl transition-all flex items-start justify-between gap-3 ${
                              isCompleted 
                                ? 'bg-emerald-50/50 dark:bg-emerald-950/20 border border-emerald-200/60 dark:border-emerald-800/40' 
                                : 'bg-slate-50/70 dark:bg-slate-800/40 border border-slate-200/60 dark:border-slate-800/60 hover:border-slate-300 dark:hover:border-slate-700'
                            }`}
                          >
                            {/* Checkbox & Topic Info */}
                            <div 
                              onClick={() => handleToggleTopic(catKey, topic)}
                              className="flex items-start gap-2.5 flex-1 min-w-0 cursor-pointer select-none"
                            >
                              <div className="pt-0.5 shrink-0">
                                {isCompleted ? (
                                  <div className="w-4 h-4 rounded-md bg-emerald-600 text-white flex items-center justify-center shadow-xs">
                                    <Check className="w-3 h-3 stroke-[3]" />
                                  </div>
                                ) : (
                                  <div className="w-4 h-4 rounded-md border-2 border-slate-400 dark:border-slate-600 hover:border-blue-500 transition-colors" />
                                )}
                              </div>
                              <div className="min-w-0">
                                <div className="flex items-center gap-1.5 flex-wrap">
                                  <span className={`text-[10px] font-black px-1.5 py-0.2 rounded ${
                                    isCompleted 
                                      ? 'bg-emerald-200/80 dark:bg-emerald-900/60 text-emerald-900 dark:text-emerald-200' 
                                      : 'bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300'
                                  }`}>
                                    #{idx + 1}
                                  </span>
                                  {topic.importance === 'Critical' && (
                                    <span className="text-[9px] font-black px-1.5 py-0.2 rounded bg-red-100 dark:bg-red-950/60 text-red-700 dark:text-red-300">
                                      अति महत्त्वपूर्ण
                                    </span>
                                  )}
                                  <span className="text-[10px] text-slate-500 dark:text-slate-400">
                                    {topic.actsOrSyllabusRef}
                                  </span>
                                </div>
                                <h4 className={`text-xs font-bold mt-0.5 leading-snug ${
                                  isCompleted 
                                    ? 'text-emerald-900 dark:text-emerald-200 line-through opacity-80' 
                                    : 'text-slate-900 dark:text-slate-100'
                                }`}>
                                  {topic.titleNe}
                                </h4>
                              </div>
                            </div>

                            {/* Quick Read / Practice Button */}
                            <button
                              type="button"
                              onClick={() => handleStudyTopic(topic)}
                              className="px-2 py-1 rounded-lg bg-white dark:bg-slate-700 text-slate-700 dark:text-slate-200 hover:text-blue-600 dark:hover:text-blue-400 border border-slate-200 dark:border-slate-600 text-[10px] font-bold shrink-0 transition cursor-pointer"
                              title="यो शीर्षकको नोट पढ्नुहोस्"
                            >
                              नोट पढ्नुहोस्
                            </button>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}

              </div>

            </div>
          );
        })}
      </div>

    </section>
  );
};
