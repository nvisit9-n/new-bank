import React, { useState, useMemo, useEffect } from 'react';
import { 
  X, 
  BookOpen, 
  FileText, 
  CheckCircle2, 
  Clock, 
  Award, 
  Sparkles, 
  HelpCircle, 
  ArrowRight, 
  Download, 
  Search, 
  ChevronRight, 
  ChevronDown, 
  Lock, 
  BarChart3, 
  Filter, 
  PlayCircle,
  Building2,
  Landmark,
  Scale,
  Percent,
  Layers,
  GraduationCap
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { 
  PRIMARY_CATEGORIES, 
  LEVEL_DEFINITIONS 
} from '../../utils/translations';
import { 
  LEVEL_SYLLABUS_DATABASE, 
  getSyllabusProgress, 
  toggleSyllabusTopicProgress, 
  getLevelQuestions, 
  generateLevelMockTestSet,
  LevelSyllabusTopic
} from '../../data/levelDashboardData';
import { ALL_QUIZ_QUESTIONS } from '../../data/mockData';

interface LevelDashboardModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialCategoryId?: string;
  initialLevel?: '4' | '5' | '6';
  initialTab?: number;
}

export const LevelDashboardModal: React.FC<LevelDashboardModalProps> = ({
  isOpen,
  onClose,
  initialCategoryId = 'banking',
  initialLevel = '4',
  initialTab = 0
}) => {
  const { 
    language, 
    t, 
    isCurrentUserAdmin, 
    startQuiz, 
    openNoteReader, 
    addToast 
  } = useApp();

  const [activeCategoryId, setActiveCategoryId] = useState<string>(initialCategoryId);
  const [selectedLevel, setSelectedLevel] = useState<'4' | '5' | '6'>(initialLevel);
  const [activeTab, setActiveTab] = useState<number>(initialTab);

  // Sync initial props if changed
  useEffect(() => {
    if (initialCategoryId) setActiveCategoryId(initialCategoryId);
    if (initialLevel) setSelectedLevel(initialLevel);
    if (typeof initialTab === 'number') setActiveTab(initialTab);
  }, [initialCategoryId, initialLevel, initialTab]);

  // Tab 2 Question Bank state
  const [searchQuery, setSearchQuery] = useState('');
  const [revealedQuestionIds, setRevealedQuestionIds] = useState<Record<string, boolean>>({});
  const [selectedPaperFilter, setSelectedPaperFilter] = useState<'all' | 'Paper I' | 'Paper II'>('all');

  // Tab 4 Progress Tracker state
  const [progressState, setProgressState] = useState(() => getSyllabusProgress(activeCategoryId, selectedLevel));

  // Reload progress when category or level switches
  useEffect(() => {
    setProgressState(getSyllabusProgress(activeCategoryId, selectedLevel));
  }, [activeCategoryId, selectedLevel]);

  const activeCategory = useMemo(() => {
    return PRIMARY_CATEGORIES.find(c => c.id === activeCategoryId) || PRIMARY_CATEGORIES[0];
  }, [activeCategoryId]);

  const categorySyllabus = useMemo(() => {
    return LEVEL_SYLLABUS_DATABASE[activeCategoryId] || LEVEL_SYLLABUS_DATABASE.banking;
  }, [activeCategoryId]);

  const currentLevelData = useMemo(() => {
    return categorySyllabus.levels.find(l => l.level === selectedLevel) || categorySyllabus.levels[0];
  }, [categorySyllabus, selectedLevel]);

  const levelMeta = useMemo(() => {
    return LEVEL_DEFINITIONS.find(d => d.level === selectedLevel) || LEVEL_DEFINITIONS[0];
  }, [selectedLevel]);

  // Flattened topics for calculation
  const allTopics = useMemo(() => {
    const list: LevelSyllabusTopic[] = [];
    currentLevelData.papers.forEach(paper => {
      paper.sections.forEach(sec => {
        sec.topics.forEach(top => {
          list.push(top);
        });
      });
    });
    return list;
  }, [currentLevelData]);

  // Overall completion percentage
  const completionStats = useMemo(() => {
    const total = allTopics.length;
    const completed = allTopics.filter(t => progressState.completedTopicIds.includes(t.id)).length;
    const percentage = total > 0 ? Math.round((completed / total) * 100) : 0;
    return { total, completed, percentage };
  }, [allTopics, progressState]);

  // Question pool for Tab 2
  const questionPool = useMemo(() => {
    return getLevelQuestions(activeCategoryId, selectedLevel);
  }, [activeCategoryId, selectedLevel]);

  const filteredQuestions = useMemo(() => {
    return questionPool.filter(q => {
      if (!searchQuery.trim()) return true;
      const qText = (q.question + ' ' + (q.explanation || '')).toLowerCase();
      return qText.includes(searchQuery.toLowerCase().trim());
    });
  }, [questionPool, searchQuery]);

  if (!isOpen) return null;

  const handleToggleTopic = (topicId: string) => {
    const updated = toggleSyllabusTopicProgress(activeCategoryId, selectedLevel, topicId);
    setProgressState(updated);
    addToast(
      updated.completedTopicIds.includes(topicId)
        ? (language === 'ne' ? 'शीर्षक अध्ययन पूरा भएको चिन्ह लगाइयो! (+१० XP)' : 'Marked as completed! (+10 XP)')
        : (language === 'ne' ? 'शीर्षक अपूर्ण सूचीमा सारियो' : 'Topic marked incomplete'),
      'info'
    );
  };

  const handleStartMockTest = () => {
    const mockSet = generateLevelMockTestSet(activeCategoryId, selectedLevel);
    onClose();
    startQuiz(mockSet);
  };

  const handlePdfExport = () => {
    if (!isCurrentUserAdmin) {
      addToast(
        language === 'ne' 
          ? 'सुरक्षा सूचना: आधिकारिक पाठ्यक्रम PDF डाउनलोड केवल एडमिनका लागि मात्र उपलब्ध छ। तपाईं यहाँ निःशुल्क अनलाइन अध्ययन गर्न सक्नुहुन्छ।' 
          : 'Notice: Official curriculum PDF download is reserved for Administrators. You have full free online access here.',
        'warning'
      );
      return;
    }
    // Admin trigger print preview
    window.print();
  };

  const toggleQuestionReveal = (id: string) => {
    setRevealedQuestionIds(prev => ({ ...prev, [id]: !prev[id] }));
  };

  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-slate-950/60 backdrop-blur-md overflow-hidden animate-fadeIn"
      role="dialog"
      aria-modal="true"
    >
      <div 
        className="w-full max-w-5xl max-h-[92vh] flex flex-col rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden animate-slideUp"
      >
        {/* ==================================================================== */}
        {/* MODAL HEADER: Bilingual Title, Category Switcher & Close Button     */}
        {/* ==================================================================== */}
        <div className="p-4 sm:p-5 border-b border-slate-200 dark:border-slate-800 bg-gradient-to-r from-slate-50 via-white to-blue-50/40 dark:from-slate-900 dark:via-slate-900 dark:to-blue-950/20 shrink-0">
          <div className="flex items-start justify-between gap-3">
            <div>
              <div className="flex items-center gap-2 flex-wrap mb-1">
                <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-blue-100 dark:bg-blue-950/80 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-800">
                  {language === 'ne' ? 'अन्तरक्रियात्मक ड्यासबोर्ड' : 'Interactive Dashboard'}
                </span>
                <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-emerald-100 dark:bg-emerald-950/80 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
                  {language === 'ne' ? 'आधिकारिक पाठ्यक्रम २०२६' : 'Official Syllabus 2026'}
                </span>
              </div>
              <h2 className="text-lg sm:text-xl font-black text-slate-900 dark:text-white tracking-tight">
                {language === 'ne' ? activeCategory.nameNe : activeCategory.nameEn}
                <span className="text-blue-600 dark:text-blue-400 ml-2">
                  {language === 'ne' ? levelMeta.shortLabelNe : levelMeta.shortLabelEn}
                </span>
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 max-w-2xl">
                {language === 'ne' ? activeCategory.descriptionNe : activeCategory.descriptionEn}
              </p>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              {/* Strict Admin-Only PDF Export Button */}
              <button
                type="button"
                onClick={handlePdfExport}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition border ${
                  isCurrentUserAdmin
                    ? 'bg-red-600 text-white border-red-700 hover:bg-red-700 cursor-pointer shadow-xs'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-400 border-slate-200 dark:border-slate-700 hover:bg-slate-200 dark:hover:bg-slate-700/60 cursor-pointer'
                }`}
                title={isCurrentUserAdmin ? 'Export Official PDF' : 'Admin Only PDF Export'}
              >
                {isCurrentUserAdmin ? (
                  <Download className="w-3.5 h-3.5" />
                ) : (
                  <Lock className="w-3.5 h-3.5" />
                )}
                <span className="hidden sm:inline">PDF</span>
              </button>

              <button
                type="button"
                onClick={onClose}
                className="p-2 rounded-xl text-slate-500 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition"
                aria-label="Close modal"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* ================================================================== */}
          {/* CATEGORY SELECTOR CHIPS (3 PRIMARY CATEGORIES)                     */}
          {/* ================================================================== */}
          <div className="flex items-center gap-2 mt-3 pt-3 border-t border-slate-200/80 dark:border-slate-800/80 overflow-x-auto custom-scrollbar pb-1">
            <span className="text-xs font-bold text-slate-400 dark:text-slate-500 shrink-0">
              {language === 'ne' ? 'क्षेत्र:' : 'Sector:'}
            </span>
            {PRIMARY_CATEGORIES.map(cat => {
              const isActive = cat.id === activeCategoryId;
              return (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => setActiveCategoryId(cat.id)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition whitespace-nowrap flex items-center gap-1.5 cursor-pointer shrink-0 ${
                    isActive
                      ? 'bg-[#0B2046] text-white shadow-xs'
                      : 'bg-slate-100 hover:bg-slate-200/70 dark:bg-slate-800 dark:hover:bg-slate-750 text-slate-700 dark:text-slate-300'
                  }`}
                >
                  {cat.id === 'banking' && <Landmark className="w-3.5 h-3.5" />}
                  {cat.id === 'enterprises' && <Building2 className="w-3.5 h-3.5" />}
                  {cat.id === 'loksewa' && <Scale className="w-3.5 h-3.5" />}
                  <span>{language === 'ne' ? cat.nameNe : cat.nameEn}</span>
                </button>
              );
            })}
          </div>

          {/* ================================================================== */}
          {/* DYNAMIC LEVEL SELECTOR BUTTONS: "तह ४ (सहायक)", "तह ५", "तह ६"     */}
          {/* ================================================================== */}
          <div className="flex items-center justify-between gap-2 mt-2 pt-2 border-t border-slate-100 dark:border-slate-800/60 flex-wrap">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-slate-500 dark:text-slate-400">
                {language === 'ne' ? 'तह (Level):' : 'Tier/Level:'}
              </span>
              <div className="inline-flex rounded-xl bg-slate-100 dark:bg-slate-800 p-1 border border-slate-200 dark:border-slate-700">
                {[
                  { level: '4' as const, labelNe: 'तह ४ (सहायक)', labelEn: 'Level 4 (Assistant)' },
                  { level: '5' as const, labelNe: 'तह ५ (वरिष्ठ सहायक)', labelEn: 'Level 5 (Sr. Assistant)' },
                  { level: '6' as const, labelNe: 'तह ६ (अधिकृत)', labelEn: 'Level 6 (Officer)' }
                ].map(def => {
                  const isSelected = def.level === selectedLevel;
                  return (
                    <button
                      key={def.level}
                      type="button"
                      onClick={() => setSelectedLevel(def.level)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-black transition cursor-pointer flex items-center gap-1.5 ${
                        isSelected
                          ? 'bg-blue-600 text-white shadow-xs scale-100 ring-1 ring-blue-400/40'
                          : 'text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
                      }`}
                    >
                      <span>{language === 'ne' ? def.labelNe : def.labelEn}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Progress Badge Indicator */}
            <div className="flex items-center gap-2">
              <span className="text-xs font-black text-slate-500 dark:text-slate-400">
                {language === 'ne' ? 'प्रगति:' : 'Progress:'}
              </span>
              <div className="w-24 sm:w-32 bg-slate-200 dark:bg-slate-700 rounded-full h-2.5 overflow-hidden">
                <div 
                  className="bg-emerald-500 h-2.5 rounded-full transition-all duration-500" 
                  style={{ width: `${completionStats.percentage}%` }}
                />
              </div>
              <span className="text-xs font-black text-emerald-600 dark:text-emerald-400">
                {completionStats.percentage}% पूर्ण
              </span>
            </div>
          </div>
        </div>

        {/* ==================================================================== */}
        {/* 4 INTERACTIVE TABS BAR WITH BOLD HIGH-CONTRAST TYPOGRAPHY            */}
        {/* ==================================================================== */}
        <div className="flex border-b border-slate-200 dark:border-slate-800 bg-slate-50/80 dark:bg-slate-900/80 overflow-x-auto custom-scrollbar shrink-0">
          {[
            { index: 0, tag: 'Tab 1', labelNe: 'पाठ्यक्रम विश्लेषण', labelEn: 'Syllabus Breakdown', icon: BookOpen },
            { index: 1, tag: 'Tab 2', labelNe: 'प्रश्न भण्डार MCQs', labelEn: 'Question Bank', icon: HelpCircle },
            { index: 2, tag: 'Tab 3', labelNe: 'अनलाइन परीक्षा', labelEn: 'Mock Test Engine', icon: PlayCircle },
            { index: 3, tag: 'Tab 4', labelNe: 'प्रगति ट्र्याकर', labelEn: 'Progress Tracker', icon: BarChart3 }
          ].map(tab => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.index;
            return (
              <button
                key={tab.index}
                type="button"
                onClick={() => setActiveTab(tab.index)}
                className={`flex-1 min-w-[160px] py-3.5 px-4 text-xs font-black flex items-center justify-center gap-2 border-b-2 transition cursor-pointer whitespace-nowrap ${
                  isActive
                    ? 'border-blue-600 text-blue-600 dark:text-blue-400 bg-white dark:bg-slate-900 shadow-2xs'
                    : 'border-transparent text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100/60 dark:hover:bg-slate-800/40'
                }`}
              >
                <span className={`text-[9px] font-black uppercase px-1.5 py-0.5 rounded ${
                  isActive ? 'bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300' : 'bg-slate-200 dark:bg-slate-800 text-slate-500'
                }`}>
                  {tab.tag}
                </span>
                <Icon className={`w-4 h-4 ${isActive ? 'text-blue-600 dark:text-blue-400' : 'text-slate-400'}`} />
                <span>{language === 'ne' ? tab.labelNe : tab.labelEn}</span>
              </button>
            );
          })}
        </div>

        {/* ==================================================================== */}
        {/* TAB CONTENTS                                                         */}
        {/* ==================================================================== */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 custom-scrollbar space-y-6">

          {/* ================================================================== */}
          {/* TAB 1: OFFICIAL SYLLABUS BREAKDOWN (Paper I & II with Marks)        */}
          {/* ================================================================== */}
          {activeTab === 0 && (
            <div className="space-y-6">
              {/* Tier Summary Card */}
              <div className="p-4 rounded-2xl bg-gradient-to-br from-blue-50/80 via-white to-indigo-50/40 dark:from-blue-950/20 dark:via-slate-900 dark:to-indigo-950/20 border border-blue-100 dark:border-blue-900/50 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h3 className="text-sm font-black text-[#0B2046] dark:text-blue-300">
                    {language === 'ne' ? levelMeta.labelNe : levelMeta.labelEn}
                  </h3>
                  <p className="text-xs text-slate-600 dark:text-slate-400 mt-1">
                    {language === 'ne' ? `न्यूनतम शैक्षिक योग्यता: ${levelMeta.minEduNe}` : `Minimum Education: ${levelMeta.minEduEn}`} • {language === 'ne' ? `कुल पूर्णाङ्क: ${levelMeta.totalMarks}` : `Total Marks: ${levelMeta.totalMarks}`}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setActiveTab(2)}
                  className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs flex items-center gap-2 cursor-pointer transition shadow-xs shrink-0 self-start sm:self-auto"
                >
                  <PlayCircle className="w-4 h-4" />
                  <span>{language === 'ne' ? 'यस तहको परीक्षा सुरु गर्नुहोस्' : 'Start Mock Test'}</span>
                </button>
              </div>

              {/* Papers Loop */}
              {currentLevelData.papers.map((paper, paperIdx) => (
                <div 
                  key={paperIdx}
                  className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/80 overflow-hidden shadow-2xs"
                >
                  {/* Paper Header */}
                  <div className="p-4 bg-slate-50 dark:bg-slate-800/60 border-b border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div>
                      <span className="px-2 py-0.5 rounded-md text-[10px] font-black uppercase tracking-wider bg-blue-600 text-white mr-2">
                        {paper.paperNumber}
                      </span>
                      <h4 className="text-sm sm:text-base font-bold text-slate-900 dark:text-white inline">
                        {language === 'ne' ? paper.titleNe : paper.titleEn}
                      </h4>
                    </div>
                    <div className="flex items-center gap-3 text-xs text-slate-500 dark:text-slate-400 shrink-0">
                      <span>{language === 'ne' ? `पूर्णाङ्क: ${paper.fullMarks}` : `Marks: ${paper.fullMarks}`}</span>
                      <span>•</span>
                      <span>{language === 'ne' ? `उत्तीर्णाङ्क: ${paper.passMarks}` : `Pass: ${paper.passMarks}`}</span>
                      <span>•</span>
                      <span className="flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5 text-blue-500" />
                        {language === 'ne' ? paper.timeLimitNe : paper.timeLimitEn}
                      </span>
                    </div>
                  </div>

                  <div className="p-3 bg-blue-50/40 dark:bg-blue-950/10 border-b border-slate-100 dark:border-slate-800/60 text-xs text-blue-800 dark:text-blue-300 font-medium">
                    {language === 'ne' ? paper.examTypeNe : paper.examTypeEn}
                  </div>

                  {/* Sections and Topics */}
                  <div className="divide-y divide-slate-100 dark:divide-slate-800">
                    {paper.sections.map(section => (
                      <div key={section.sectionId} className="p-4 space-y-3">
                        <div className="flex items-center justify-between">
                          <h5 className="text-xs font-black text-slate-700 dark:text-slate-300 uppercase tracking-wide">
                            {language === 'ne' ? section.sectionNameNe : section.sectionNameEn}
                          </h5>
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-50 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300 border border-amber-200 dark:border-amber-800">
                            {language === 'ne' ? `${section.weightageMarks} अंकभार` : `${section.weightageMarks} Marks`}
                          </span>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                          {section.topics.map(topic => {
                            const isCompleted = progressState.completedTopicIds.includes(topic.id);
                            return (
                              <div 
                                key={topic.id}
                                className="p-3.5 rounded-xl border border-slate-200/80 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/30 hover:bg-slate-100/50 dark:hover:bg-slate-800/60 transition flex flex-col justify-between gap-2.5"
                              >
                                <div>
                                  <div className="flex items-start justify-between gap-2">
                                    <span className="text-[11px] font-black text-blue-600 dark:text-blue-400">
                                      {topic.code}
                                    </span>
                                    <span className="text-[10px] font-semibold text-slate-500 dark:text-slate-400">
                                      {language === 'ne' ? topic.questionTypeNe : topic.questionTypeEn}
                                    </span>
                                  </div>
                                  <h6 className="text-xs font-bold text-slate-900 dark:text-white mt-1">
                                    {language === 'ne' ? topic.nameNe : topic.nameEn}
                                  </h6>

                                  <ul className="mt-2 space-y-1">
                                    {(language === 'ne' ? topic.detailsNe : topic.detailsEn).map((detail, dIdx) => (
                                      <li key={dIdx} className="text-[11px] text-slate-600 dark:text-slate-400 flex items-start gap-1.5">
                                        <span className="text-blue-500 font-bold">•</span>
                                        <span>{detail}</span>
                                      </li>
                                    ))}
                                  </ul>
                                </div>

                                <div className="flex items-center justify-between pt-2 border-t border-slate-200/60 dark:border-slate-800/60">
                                  {topic.noteRefId ? (
                                    <button
                                      type="button"
                                      onClick={() => {
                                        onClose();
                                        openNoteReader(topic.noteRefId!);
                                      }}
                                      className="text-[11px] font-bold text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1 cursor-pointer"
                                    >
                                      <FileText className="w-3 h-3" />
                                      <span>{language === 'ne' ? 'नोट पढ्नुहोस्' : 'Read Study Note'}</span>
                                    </button>
                                  ) : <span />}

                                  <button
                                    type="button"
                                    onClick={() => handleToggleTopic(topic.id)}
                                    className={`px-2 py-1 rounded-lg text-[10px] font-bold flex items-center gap-1 cursor-pointer transition ${
                                      isCompleted
                                        ? 'bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300'
                                        : 'bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-300'
                                    }`}
                                  >
                                    <CheckCircle2 className={`w-3 h-3 ${isCompleted ? 'text-emerald-600' : 'text-slate-400'}`} />
                                    <span>{isCompleted ? (language === 'ne' ? 'पूरा भयो' : 'Done') : (language === 'ne' ? 'पूरा गर्नुस्' : 'Mark Done')}</span>
                                  </button>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* ================================================================== */}
          {/* TAB 2: UNIQUE QUESTION BANK & MCQS (Clean View-Only Practice)       */}
          {/* ================================================================== */}
          {activeTab === 1 && (
            <div className="space-y-4">
              {/* Notice Banner */}
              <div className="p-3.5 rounded-xl bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800/60 flex items-center justify-between gap-3 flex-wrap">
                <div className="flex items-center gap-2">
                  <HelpCircle className="w-4 h-4 text-amber-600 shrink-0" />
                  <span className="text-xs font-bold text-amber-800 dark:text-amber-200">
                    {language === 'ne' ? t.viewOnlyNotice : t.viewOnlyNotice}
                  </span>
                </div>
                <span className="text-xs font-black text-amber-900 dark:text-amber-100">
                  {filteredQuestions.length} {language === 'ne' ? 'प्रश्नहरू उपलब्ध' : 'Questions Loaded'}
                </span>
              </div>

              {/* Search Bar */}
              <div className="relative">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder={language === 'ne' ? 'प्रश्न वा मुख्य शब्द खोज्नुहोस्...' : 'Search questions or keywords...'}
                  className="w-full pl-9 pr-4 py-2.5 rounded-xl text-xs bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              {/* Questions List */}
              <div className="space-y-3">
                {filteredQuestions.map((q, idx) => {
                  const isRevealed = Boolean(revealedQuestionIds[q.id]);
                  return (
                    <div 
                      key={q.id || idx}
                      className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-2xs hover:border-slate-300 dark:hover:border-slate-700 transition"
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex items-start gap-2">
                          <span className="px-2 py-0.5 rounded-md text-[11px] font-black bg-blue-100 dark:bg-blue-950/80 text-blue-700 dark:text-blue-300 shrink-0">
                            Q{idx + 1}
                          </span>
                          <p className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white leading-relaxed">
                            {q.question}
                          </p>
                        </div>
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 shrink-0">
                          {q.category || 'MCQ'}
                        </span>
                      </div>

                      {/* Options Grid */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-3 pl-7">
                        {q.options.map((opt, optIdx) => {
                          const isCorrect = isRevealed && optIdx === q.correctAnswer;
                          return (
                            <div
                              key={optIdx}
                              className={`p-2.5 rounded-lg text-xs font-medium border transition ${
                                isCorrect
                                  ? 'bg-emerald-50 dark:bg-emerald-950/50 border-emerald-500 text-emerald-800 dark:text-emerald-200 font-bold'
                                  : 'bg-slate-50 dark:bg-slate-800/50 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300'
                              }`}
                            >
                              <span className="font-black mr-2 opacity-70">
                                {['क', 'ख', 'ग', 'घ'][optIdx] || optIdx + 1}.
                              </span>
                              <span>{opt}</span>
                            </div>
                          );
                        })}
                      </div>

                      {/* Reveal Answer Button */}
                      <div className="mt-3 pl-7 flex items-center justify-between pt-2 border-t border-slate-100 dark:border-slate-800/60">
                        <button
                          type="button"
                          onClick={() => toggleQuestionReveal(q.id)}
                          className="text-xs font-bold text-blue-600 dark:text-blue-400 hover:text-blue-700 flex items-center gap-1 cursor-pointer"
                        >
                          <span>{isRevealed ? (language === 'ne' ? 'उत्तर लुकाउनुहोस्' : 'Hide Answer') : (language === 'ne' ? 'उत्तर र आधिकारिक व्याख्या हेर्नुहोस्' : 'Show Answer & Explanation')}</span>
                          <ChevronDown className={`w-3.5 h-3.5 transition-transform ${isRevealed ? 'rotate-180' : ''}`} />
                        </button>
                      </div>

                      {/* Detailed Explanation */}
                      {isRevealed && (
                        <div className="mt-3 pl-7">
                          <div className="p-3 rounded-xl bg-emerald-50/60 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800/60 text-xs text-emerald-900 dark:text-emerald-200 space-y-1">
                            <p className="font-bold flex items-center gap-1.5">
                              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                              <span>
                                {language === 'ne' ? 'सही उत्तर:' : 'Correct Answer:'} {['क', 'ख', 'ग', 'घ'][q.correctAnswer] || q.correctAnswer + 1}. {q.options[q.correctAnswer]}
                              </span>
                            </p>
                            {q.explanation && (
                              <p className="text-[11px] opacity-90 leading-relaxed pt-1">
                                <span className="font-semibold">{language === 'ne' ? 'व्याख्या:' : 'Explanation:'}</span> {q.explanation}
                              </p>
                            )}
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* ================================================================== */}
          {/* TAB 3: LIVE PRACTICE & MOCK TEST ENGINE                            */}
          {/* ================================================================== */}
          {activeTab === 2 && (
            <div className="space-y-6">
              {/* Simulation Banner */}
              <div className="p-6 rounded-2xl bg-gradient-to-br from-[#0B2046] via-blue-900 to-indigo-900 text-white shadow-xl relative overflow-hidden">
                <div className="absolute right-0 top-0 w-64 h-64 bg-white/5 rounded-full blur-3xl pointer-events-none" />
                <div className="relative z-10 max-w-xl space-y-3">
                  <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-white/15 text-xs font-bold text-blue-200">
                    <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                    <span>{language === 'ne' ? 'लोकसेवा / बैंकिङ परीक्षा सिमुलेसन' : 'PSC / Banking Exam Engine'}</span>
                  </div>
                  <h3 className="text-lg sm:text-2xl font-black tracking-tight">
                    {language === 'ne' ? `${activeCategory.nameNe} - ${levelMeta.labelNe} विशेष अनलाइन परीक्षा` : `${activeCategory.nameEn} - ${levelMeta.labelEn} Special Mock Test`}
                  </h3>
                  <p className="text-xs sm:text-sm text-blue-100/90 leading-relaxed">
                    {language === 'ne' ? t.testInstruction : t.testInstruction}
                  </p>

                  <div className="flex items-center gap-4 text-xs font-bold text-blue-200 pt-2">
                    <div className="flex items-center gap-1.5">
                      <Clock className="w-4 h-4 text-amber-300" />
                      <span>{language === 'ne' ? 'समय: ४५ मिनेट' : 'Time: 45 Mins'}</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <HelpCircle className="w-4 h-4 text-amber-300" />
                      <span>५० {language === 'ne' ? 'प्रश्नहरू' : 'Questions'}</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <Percent className="w-4 h-4 text-amber-300" />
                      <span>-०.२ {language === 'ne' ? 'नेगेटिभ मार्किङ' : 'Negative Mark'}</span>
                    </div>
                  </div>

                  <div className="pt-3">
                    <button
                      type="button"
                      onClick={handleStartMockTest}
                      className="px-6 py-3 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-900 font-black text-sm flex items-center gap-2 cursor-pointer transition shadow-lg active:scale-95"
                    >
                      <PlayCircle className="w-5 h-5 fill-slate-900 text-amber-400" />
                      <span>{language === 'ne' ? 'तत्काल परीक्षा सुरु गर्नुहोस्' : 'Launch Simulation Now'}</span>
                    </button>
                  </div>
                </div>
              </div>

              {/* Simulation Guidelines Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 space-y-1">
                  <div className="w-8 h-8 rounded-lg bg-blue-100 dark:bg-blue-950/80 text-blue-600 flex items-center justify-center font-black text-xs">
                    १
                  </div>
                  <h5 className="text-xs font-bold text-slate-900 dark:text-white pt-1">
                    {language === 'ne' ? 'स्वचालित घडी र टाइमिङ' : 'Real-time Timer'}
                  </h5>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400">
                    {language === 'ne' ? '४५ मिनेट सकिएपछि स्वतः सबमिट हुने वास्तविक वातावरण।' : 'Auto-submits when time expires.'}
                  </p>
                </div>

                <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 space-y-1">
                  <div className="w-8 h-8 rounded-lg bg-emerald-100 dark:bg-emerald-950/80 text-emerald-600 flex items-center justify-center font-black text-xs">
                    २
                  </div>
                  <h5 className="text-xs font-bold text-slate-900 dark:text-white pt-1">
                    {language === 'ne' ? 'तत्काल नतिजा र विश्लेषण' : 'Instant Score Card'}
                  </h5>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400">
                    {language === 'ne' ? 'प्राप्तांक, उत्तीर्णाङ्क र कमजोरी विश्लेषण तत्काल।' : 'Detailed breakdown with explanations.'}
                  </p>
                </div>

                <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 space-y-1">
                  <div className="w-8 h-8 rounded-lg bg-indigo-100 dark:bg-indigo-950/80 text-indigo-600 flex items-center justify-center font-black text-xs">
                    ३
                  </div>
                  <h5 className="text-xs font-bold text-slate-900 dark:text-white pt-1">
                    {language === 'ne' ? 'वरियता र XP संकलन' : 'Rankings & XP'}
                  </h5>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400">
                    {language === 'ne' ? 'राष्ट्रिय लिडरबोर्डमा स्थान र प्रोफाइल XP वृद्धि।' : 'Compete on the national leaderboard.'}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* ================================================================== */}
          {/* TAB 4: STUDENT SYLLABUS PROGRESS TRACKER                           */}
          {/* ================================================================== */}
          {activeTab === 3 && (
            <div className="space-y-6">
              {/* Progress Metric Card */}
              <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xs space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="text-sm font-black text-slate-900 dark:text-white">
                      {language === 'ne' ? t.syllabusProgressTitle : t.syllabusProgressTitle}
                    </h4>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                      {language === 'ne' ? `${levelMeta.labelNe} का कुल ${allTopics.length} शीर्षकहरू` : `All ${allTopics.length} topics for ${levelMeta.labelEn}`}
                    </p>
                  </div>
                  <div className="text-right">
                    <span className="text-2xl font-black text-emerald-600 dark:text-emerald-400">
                      {completionStats.percentage}%
                    </span>
                    <p className="text-[11px] font-bold text-slate-500">
                      {completionStats.completed} / {completionStats.total} {language === 'ne' ? 'शीर्षक पूरा' : 'Completed'}
                    </p>
                  </div>
                </div>

                <div className="w-full bg-slate-100 dark:bg-slate-800 h-3 rounded-full overflow-hidden p-0.5">
                  <div 
                    className="bg-gradient-to-r from-blue-600 via-indigo-600 to-emerald-500 h-full rounded-full transition-all duration-500"
                    style={{ width: `${completionStats.percentage}%` }}
                  />
                </div>
              </div>

              {/* Interactive Checklist */}
              <div className="space-y-3">
                <h5 className="text-xs font-black text-slate-600 dark:text-slate-400 uppercase tracking-wider">
                  {language === 'ne' ? 'अन्तरक्रियात्मक अध्ययन चेकलिस्ट (Click to Toggle)' : 'Interactive Study Checklist'}
                </h5>

                <div className="space-y-2">
                  {allTopics.map(topic => {
                    const isDone = progressState.completedTopicIds.includes(topic.id);
                    return (
                      <div
                        key={topic.id}
                        onClick={() => handleToggleTopic(topic.id)}
                        className={`p-3.5 rounded-xl border transition flex items-center justify-between gap-3 cursor-pointer ${
                          isDone
                            ? 'bg-emerald-50/70 dark:bg-emerald-950/30 border-emerald-300 dark:border-emerald-800/80 text-emerald-900 dark:text-emerald-100'
                            : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700'
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <div className={`w-6 h-6 rounded-lg flex items-center justify-center transition shrink-0 ${
                            isDone 
                              ? 'bg-emerald-600 text-white' 
                              : 'border-2 border-slate-300 dark:border-slate-600 text-transparent'
                          }`}>
                            <CheckCircle2 className="w-4 h-4" />
                          </div>
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="text-[10px] font-black uppercase text-blue-600 dark:text-blue-400">
                                {topic.paper} • {topic.code}
                              </span>
                              <span className="text-[10px] font-bold text-slate-500">
                                ({topic.marks} {language === 'ne' ? 'अंक' : 'Marks'})
                              </span>
                            </div>
                            <p className={`text-xs font-bold transition ${
                              isDone ? 'line-through opacity-75' : 'text-slate-900 dark:text-white'
                            }`}>
                              {language === 'ne' ? topic.nameNe : topic.nameEn}
                            </p>
                          </div>
                        </div>

                        <span className={`text-[11px] font-bold px-2.5 py-1 rounded-lg shrink-0 ${
                          isDone 
                            ? 'bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300' 
                            : 'bg-slate-100 dark:bg-slate-800 text-slate-500'
                        }`}>
                          {isDone ? (language === 'ne' ? 'अध्ययन सम्पन्न' : 'Completed') : (language === 'ne' ? 'बाँकी' : 'Pending')}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

        </div>

        {/* ==================================================================== */}
        {/* MODAL FOOTER                                                         */}
        {/* ==================================================================== */}
        <div className="p-3.5 border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/90 flex items-center justify-between gap-3 shrink-0">
          <div className="text-xs text-slate-500 dark:text-slate-400 hidden sm:block">
            {language === 'ne' ? 'बैंकिङ तयारी नेपाल • सबै सामग्री निःशुल्क अनलाइन पहुँच' : 'Banking Tayari Nepal • 100% Free Online Access'}
          </div>
          <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-xs font-bold text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-800 transition cursor-pointer"
            >
              {language === 'ne' ? 'बन्द गर्नुहोस्' : 'Close'}
            </button>
            <button
              type="button"
              onClick={handleStartMockTest}
              className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold flex items-center gap-1.5 cursor-pointer transition shadow-xs"
            >
              <PlayCircle className="w-3.5 h-3.5" />
              <span>{language === 'ne' ? 'परीक्षा सिमुलेसन' : 'Mock Test Engine'}</span>
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
