import React, { useState, useMemo } from 'react';
import { 
  BookOpen, 
  Layers, 
  PlayCircle, 
  ChevronRight, 
  Sparkles, 
  CheckCircle2, 
  GraduationCap, 
  BarChart3, 
  Building2, 
  Landmark, 
  Scale,
  Clock,
  Award,
  ArrowRight
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { PRIMARY_CATEGORIES, LEVEL_DEFINITIONS } from '../../utils/translations';
import { 
  LEVEL_SYLLABUS_DATABASE, 
  getSyllabusProgress,
  generateLevelMockTestSet
} from '../../data/levelDashboardData';

interface LevelSelectorCardProps {
  className?: string;
}

export const LevelSelectorCard: React.FC<LevelSelectorCardProps> = ({ className = '' }) => {
  const { language, openLevelDashboard, startQuiz } = useApp();

  const [selectedCatId, setSelectedCatId] = useState<string>('banking');
  const [selectedLevel, setSelectedLevel] = useState<'4' | '5' | '6'>('4');

  const currentCategory = useMemo(() => {
    return PRIMARY_CATEGORIES.find(c => c.id === selectedCatId) || PRIMARY_CATEGORIES[0];
  }, [selectedCatId]);

  const categorySyllabus = useMemo(() => {
    return LEVEL_SYLLABUS_DATABASE[selectedCatId] || LEVEL_SYLLABUS_DATABASE.banking;
  }, [selectedCatId]);

  const levelData = useMemo(() => {
    return categorySyllabus.levels.find(l => l.level === selectedLevel) || categorySyllabus.levels[0];
  }, [categorySyllabus, selectedLevel]);

  const levelMeta = useMemo(() => {
    return LEVEL_DEFINITIONS.find(d => d.level === selectedLevel) || LEVEL_DEFINITIONS[0];
  }, [selectedLevel]);

  const progress = useMemo(() => {
    return getSyllabusProgress(selectedCatId, selectedLevel);
  }, [selectedCatId, selectedLevel]);

  const progressPercentage = useMemo(() => {
    const total = levelData.totalTopics || 10;
    const completed = progress.completedTopicIds.length;
    return Math.min(100, Math.round((completed / total) * 100));
  }, [levelData, progress]);

  const handleLaunchMock = (e: React.MouseEvent) => {
    e.stopPropagation();
    const mockSet = generateLevelMockTestSet(selectedCatId, selectedLevel);
    startQuiz(mockSet);
  };

  // Level configuration with explicit user requested badges
  const levelCards = [
    {
      level: '4' as const,
      badgeNe: 'तह ४ (सहायक)',
      badgeEn: 'Level 4 (Assistant)',
      titleNe: selectedCatId === 'loksewa' ? 'खरिदार (Kharidar)' : 'सहायक / क्यासियर / प्रशासन',
      titleEn: 'Assistant / Cashier / Admin',
      rolesNe: selectedCatId === 'banking' 
        ? 'NRB, RBB, NBL, ADBL सहायक' 
        : selectedCatId === 'enterprises' 
          ? 'NTC, NEA, EPF, CIT सहायक' 
          : 'प्रशासन, न्याय तथा लेखा खरिदार',
      educationNe: '+२ (१०+२ उत्तीर्ण)',
      marks: '२०० पूर्णाङ्क',
      modeNe: 'MCQs + विषयगत'
    },
    {
      level: '5' as const,
      badgeNe: 'तह ५ (वरिष्ठ सहायक)',
      badgeEn: 'Level 5 (Sr. Assistant)',
      titleNe: selectedCatId === 'loksewa' ? 'नायब सुब्बा (NaSu)' : 'वरिष्ठ सहायक / सुपरभाइजर',
      titleEn: 'Sr. Assistant / Supervisor',
      rolesNe: selectedCatId === 'banking' 
        ? 'वाणिज्य बैंक तथा NRB सिनियर सहायक' 
        : selectedCatId === 'enterprises' 
          ? 'लेखा, प्रशासन तथा प्राविधिक सुपरभाइजर' 
          : 'नायब सुब्बा (सामान्य प्रशासन, लेखा, न्याय)',
      educationNe: 'प्रवीणता वा स्नातक',
      marks: '२०० पूर्णाङ्क',
      modeNe: 'विस्तृत पाठ्यक्रम र विश्लेषण'
    },
    {
      level: '6' as const,
      badgeNe: 'तह ६ (अधिकृत)',
      badgeEn: 'Level 6 (Officer)',
      titleNe: selectedCatId === 'loksewa' ? 'शाखा अधिकृत (Section Officer)' : 'सहायक निर्देशक / अधिकृत',
      titleEn: 'Asst. Director / Officer',
      rolesNe: selectedCatId === 'banking' 
        ? 'NRB सहायक निर्देशक तथा बैंक अधिकृत' 
        : selectedCatId === 'enterprises' 
          ? 'संस्थान अधिकृत (प्रशासन / लेखा / IT)' 
          : 'शाखा अधिकृत (परराष्ट्र, प्रशासन, लेखा परीक्षण)',
      educationNe: 'मान्यता प्राप्त स्नातक',
      marks: '३०० पूर्णाङ्क',
      modeNe: 'उच्चस्तरीय नीति र ऐन कानुन'
    }
  ];

  return (
    <div 
      className={`rounded-3xl p-5 sm:p-6 sm:pb-7 bg-white dark:bg-[#0F172A] border border-slate-200 dark:border-slate-800 shadow-sm relative overflow-hidden ${className}`}
    >
      {/* Header section with High-Contrast Bold Typography */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 relative z-10">
        <div>
          <div className="flex items-center gap-2 mb-2 flex-wrap">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-[#1E293B] text-sky-300 border border-sky-500/30">
              <Sparkles className="w-3.5 h-3.5 text-sky-400" />
              <span>{language === 'ne' ? 'अन्तरक्रियात्मक तह छनोट' : 'Interactive Level Hub'}</span>
            </span>
            <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-slate-100 dark:bg-[#1E293B] text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700">
              {language === 'ne' ? 'नयाँ पाठ्यक्रम २०८२/८३' : 'New Syllabus 2026'}
            </span>
            <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-slate-100 dark:bg-[#1E293B] text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700">
              {language === 'ne' ? 'नेपाली / English' : 'Bilingual'}
            </span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white tracking-tight leading-tight">
            {language === 'ne' ? 'तहगत पाठ्यक्रम, प्रश्न भण्डार र अनलाइन परीक्षा' : 'Level-wise Syllabus, Question Bank & Mock Test'}
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 mt-1 font-medium">
            {language === 'ne' 
              ? 'आफ्नो तयारीको क्षेत्र र तह छान्नुहोस् र ४-ट्याब विस्तृत गाइड तुरुन्त हेर्नुहोस्' 
              : 'Select your target sector and tier to explore official syllabus, MCQs and test engine'}
          </p>
        </div>
      </div>

      {/* 1. PRIMARY CATEGORY TABS (Sector Selection) */}
      <div className="mt-5 pt-4 border-t border-slate-200 dark:border-slate-800 relative z-10">
        <div className="flex items-center justify-between mb-2">
          <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
            {language === 'ne' ? '१. लक्षित क्षेत्र चयन गर्नुहोस् (Select Sector)' : '1. Select Target Sector'}
          </span>
          <span className="text-[11px] font-bold text-sky-600 dark:text-sky-400">
            {PRIMARY_CATEGORIES.length} प्रमुख क्षेत्रहरू
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
          {PRIMARY_CATEGORIES.map((cat) => {
            const isActive = cat.id === selectedCatId;
            
            return (
              <button
                key={cat.id}
                type="button"
                id={`level-selector-cat-${cat.id}`}
                onClick={() => setSelectedCatId(cat.id)}
                className={`p-3 rounded-2xl text-left transition-all duration-200 cursor-pointer flex items-center justify-between border-2 ${
                  isActive
                    ? 'bg-[#0F172A] dark:bg-[#1E293B] text-white border-sky-500 shadow-md ring-2 ring-sky-400/20'
                    : 'bg-slate-50 dark:bg-[#1E293B]/60 hover:bg-slate-100 dark:hover:bg-[#1E293B] text-slate-800 dark:text-slate-200 border-slate-200 dark:border-slate-800'
                }`}
              >
                <div className="flex items-center gap-2.5 min-w-0 pr-1">
                  <div className={`p-2 rounded-xl shrink-0 ${
                    isActive 
                      ? 'bg-sky-600 text-white shadow-xs' 
                      : 'bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-300'
                  }`}>
                    {cat.id === 'banking' && <Landmark className="w-4 h-4" />}
                    {cat.id === 'enterprises' && <Building2 className="w-4 h-4" />}
                    {cat.id === 'loksewa' && <Scale className="w-4 h-4" />}
                  </div>
                  <div className="truncate">
                    <h4 className="text-xs sm:text-sm font-black truncate leading-tight">
                      {language === 'ne' ? cat.nameNe : cat.nameEn}
                    </h4>
                    <p className={`text-[10.5px] truncate font-medium ${isActive ? 'text-sky-300' : 'text-slate-500 dark:text-slate-400'}`}>
                      {cat.badgeNe}
                    </p>
                  </div>
                </div>

                {isActive && (
                  <span className="w-2 h-2 rounded-full bg-sky-400 animate-pulse shrink-0 ml-1" />
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* 2. HIGH-CONTRAST BOLD LEVEL SELECTOR CARDS (Positioned directly under Category Tabs) */}
      <div className="mt-5 pt-4 border-t border-slate-200 dark:border-slate-800 relative z-10">
        <div className="flex items-center justify-between mb-2.5">
          <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
            <Award className="w-3.5 h-3.5 text-sky-500" />
            <span>{language === 'ne' ? '२. पद तथा तह चयन गर्नुहोस् (Select Level Card)' : '2. Select Target Level'}</span>
          </span>
          <span className="text-xs font-bold text-slate-600 dark:text-slate-300">
            {language === 'ne' ? `हाल छानिएको: तह ${selectedLevel}` : `Active: Level ${selectedLevel}`}
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5 sm:gap-4">
          {levelCards.map((card) => {
            const isSelected = card.level === selectedLevel;

            return (
              <div
                key={card.level}
                id={`level-card-${card.level}`}
                onClick={() => setSelectedLevel(card.level)}
                className={`relative rounded-2xl p-4 sm:p-5 transition-all duration-200 cursor-pointer flex flex-col justify-between select-none ${
                  isSelected
                    ? 'bg-[#0F172A] text-white border-2 border-sky-500 shadow-md ring-2 ring-sky-400/25 scale-[1.01]'
                    : 'bg-slate-50 dark:bg-[#1E293B]/60 border-2 border-slate-200 dark:border-slate-800 hover:border-sky-400/50 hover:bg-slate-100 dark:hover:bg-[#1E293B] text-slate-800 dark:text-slate-100 shadow-xs'
                }`}
              >
                <div>
                  {/* Top Badge & Active Indicator Row */}
                  <div className="flex items-center justify-between gap-2 mb-2.5">
                    <span 
                      className={`font-bold text-xs px-2.5 py-1 rounded-xl tracking-wide ${
                        isSelected 
                          ? 'bg-sky-950 text-sky-300 border border-sky-800' 
                          : 'bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-300 dark:border-slate-700'
                      }`}
                    >
                      {language === 'ne' ? card.badgeNe : card.badgeEn}
                    </span>

                    {isSelected ? (
                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-sky-500 text-white shadow-2xs">
                        <CheckCircle2 className="w-3.5 h-3.5 fill-white text-sky-500" />
                        <span>सक्रिय (ACTIVE)</span>
                      </span>
                    ) : (
                      <span className="text-[10px] font-bold text-slate-400 group-hover:text-sky-500">
                        क्लिक गर्नुहोस् &rarr;
                      </span>
                    )}
                  </div>

                  {/* Level Post Title */}
                  <h3 className={`text-base sm:text-lg font-black leading-snug tracking-tight ${
                    isSelected ? 'text-white' : 'text-slate-900 dark:text-white'
                  }`}>
                    {language === 'ne' ? card.titleNe : card.titleEn}
                  </h3>

                  {/* Target Post Roles in Nepali */}
                  <p className={`text-xs mt-1 font-medium ${
                    isSelected ? 'text-sky-200' : 'text-slate-600 dark:text-slate-400'
                  }`}>
                    {card.rolesNe}
                  </p>
                </div>

                {/* Bottom Meta & Qualification Badges */}
                <div className={`mt-4 pt-3 border-t flex flex-col gap-1.5 text-xs ${
                  isSelected 
                    ? 'border-slate-800 text-sky-200' 
                    : 'border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400'
                }`}>
                  <div className="flex items-center justify-between font-bold">
                    <span className="flex items-center gap-1">
                      <GraduationCap className={`w-3.5 h-3.5 ${isSelected ? 'text-amber-300' : 'text-sky-600'}`} />
                      <span>{card.educationNe}</span>
                    </span>
                    <span className={`px-2 py-0.5 rounded-md text-[10.5px] font-bold ${
                      isSelected ? 'bg-[#1E293B] text-sky-300 border border-slate-700' : 'bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300'
                    }`}>
                      {card.marks}
                    </span>
                  </div>

                  <div className="text-[11px] font-semibold opacity-90">
                    • {card.modeNe}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 3. ACTIVE LEVEL 4-TAB BREAKDOWN & INTERACTIVE LAUNCHER BOX */}
      <div className="mt-5 p-4 sm:p-5 rounded-2xl bg-slate-50 dark:bg-[#1E293B]/70 border border-slate-200 dark:border-slate-800 relative z-10 shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="px-2.5 py-0.5 rounded-md bg-sky-600 text-white text-[11px] font-bold">
                {currentCategory.nameNe}
              </span>
              <h4 className="text-base sm:text-lg font-black text-slate-900 dark:text-white">
                {levelMeta.labelNe} • विस्तृत तयारी गाइड
              </h4>
            </div>

            <div className="flex items-center gap-3 text-xs text-slate-700 dark:text-slate-300 font-bold flex-wrap pt-0.5">
              <span className="flex items-center gap-1">
                <BookOpen className="w-3.5 h-3.5 text-sky-500" />
                {levelData.papers.length} {language === 'ne' ? 'पत्रहरू (Paper I & II)' : 'Papers (Paper I & II)'}
              </span>
              <span>•</span>
              <span className="flex items-center gap-1">
                <Layers className="w-3.5 h-3.5 text-sky-500" />
                {levelData.totalTopics} {language === 'ne' ? 'पाठ्यक्रम शीर्षकहरू' : 'Topics'}
              </span>
              <span>•</span>
              <span className="flex items-center gap-1">
                <Award className="w-3.5 h-3.5 text-amber-500" />
                {levelMeta.totalMarks} {language === 'ne' ? 'पूर्णाङ्क' : 'Total Marks'}
              </span>
              <span>•</span>
              <span className="text-[11.5px] text-slate-600 dark:text-slate-400 font-medium">
                {language === 'ne' ? `योग्यता: ${levelMeta.minEduNe}` : `Edu: ${levelMeta.minEduEn}`}
              </span>
            </div>
          </div>

          {/* Real-time syllabus completion status */}
          <div className="flex items-center gap-3 shrink-0 self-start md:self-auto bg-white dark:bg-[#0F172A] p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 shadow-2xs">
            <div className="text-right">
              <div className="text-[11px] font-bold text-slate-600 dark:text-slate-400">
                {language === 'ne' ? 'अध्ययन प्रगति' : 'Syllabus Progress'}
              </div>
              <div className="text-base font-black text-emerald-600 dark:text-emerald-400">
                {progressPercentage}% पूर्ण
              </div>
            </div>
            <div className="w-16 bg-slate-200 dark:bg-slate-700 h-2.5 rounded-full overflow-hidden">
              <div 
                className="bg-emerald-500 h-full rounded-full transition-all duration-500"
                style={{ width: `${progressPercentage}%` }}
              />
            </div>
          </div>
        </div>

        {/* 4-Tab Quick Links & Launchers */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 mt-4 pt-3.5 border-t border-slate-200 dark:border-slate-800">
          <button
            type="button"
            onClick={() => openLevelDashboard(selectedCatId, selectedLevel, 0)}
            className="p-3 rounded-xl bg-white dark:bg-[#0F172A] hover:border-sky-400 text-slate-800 dark:text-slate-200 border border-slate-200 dark:border-slate-800 text-left transition flex items-center justify-between group cursor-pointer shadow-2xs hover:shadow-xs"
          >
            <div>
              <div className="text-[10px] font-bold uppercase text-sky-600 dark:text-sky-400 tracking-wider">Tab 1</div>
              <div className="text-xs font-bold group-hover:text-sky-500 transition">
                {language === 'ne' ? 'पाठ्यक्रम विश्लेषण' : 'Syllabus Breakdown'}
              </div>
              <div className="text-[10px] text-slate-500 mt-0.5">प्रथम तथा द्वितीय पत्र</div>
            </div>
            <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-sky-500 group-hover:translate-x-0.5 transition shrink-0" />
          </button>

          <button
            type="button"
            onClick={() => openLevelDashboard(selectedCatId, selectedLevel, 1)}
            className="p-3 rounded-xl bg-white dark:bg-[#0F172A] hover:border-sky-400 text-slate-800 dark:text-slate-200 border border-slate-200 dark:border-slate-800 text-left transition flex items-center justify-between group cursor-pointer shadow-2xs hover:shadow-xs"
          >
            <div>
              <div className="text-[10px] font-bold uppercase text-sky-600 dark:text-sky-400 tracking-wider">Tab 2</div>
              <div className="text-xs font-bold group-hover:text-sky-500 transition">
                {language === 'ne' ? 'प्रश्न भण्डार MCQs' : 'Question Bank'}
              </div>
              <div className="text-[10px] text-slate-500 mt-0.5">व्याख्या सहित उत्तर</div>
            </div>
            <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-sky-500 group-hover:translate-x-0.5 transition shrink-0" />
          </button>

          <button
            type="button"
            onClick={() => openLevelDashboard(selectedCatId, selectedLevel, 2)}
            className="p-3 rounded-xl bg-white dark:bg-[#0F172A] hover:border-sky-400 text-slate-800 dark:text-slate-200 border border-slate-200 dark:border-slate-800 text-left transition flex items-center justify-between group cursor-pointer shadow-2xs hover:shadow-xs"
          >
            <div>
              <div className="text-[10px] font-bold uppercase text-amber-600 dark:text-amber-400 tracking-wider">Tab 3</div>
              <div className="text-xs font-bold group-hover:text-amber-500 transition">
                {language === 'ne' ? 'अनलाइन परीक्षा' : 'Mock Test Engine'}
              </div>
              <div className="text-[10px] text-slate-500 mt-0.5">५० प्रश्न ४५ मिनेट</div>
            </div>
            <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-amber-500 group-hover:translate-x-0.5 transition shrink-0" />
          </button>

          <button
            type="button"
            onClick={() => openLevelDashboard(selectedCatId, selectedLevel, 3)}
            className="p-3 rounded-xl bg-white dark:bg-[#0F172A] hover:border-sky-400 text-slate-800 dark:text-slate-200 border border-slate-200 dark:border-slate-800 text-left transition flex items-center justify-between group cursor-pointer shadow-2xs hover:shadow-xs"
          >
            <div>
              <div className="text-[10px] font-bold uppercase text-emerald-600 dark:text-emerald-400 tracking-wider">Tab 4</div>
              <div className="text-xs font-bold group-hover:text-emerald-500 transition">
                {language === 'ne' ? 'प्रगति ट्र्याकर' : 'Syllabus Tracker'}
              </div>
              <div className="text-[10px] text-slate-500 mt-0.5">चेकलिस्ट र स्कोर</div>
            </div>
            <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-emerald-500 group-hover:translate-x-0.5 transition shrink-0" />
          </button>
        </div>
      </div>

      {/* 4. ACTION CTA BUTTONS */}
      <div className="mt-5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-3 border-t border-slate-200 dark:border-slate-800 relative z-10">
        <button
          type="button"
          onClick={() => openLevelDashboard(selectedCatId, selectedLevel, 0)}
          className="text-xs sm:text-sm font-bold text-sky-600 dark:text-sky-400 hover:text-sky-500 flex items-center gap-1.5 cursor-pointer py-1"
        >
          <span>{language === 'ne' ? 'पूरा ४-ट्याब अन्तरक्रियात्मक ड्यासबोर्ड खोल्नुहोस्' : 'Expand 4-Tab Interactive Dashboard'}</span>
          <ArrowRight className="w-4 h-4" />
        </button>

        <button
          type="button"
          onClick={handleLaunchMock}
          className="min-h-[44px] px-6 py-2.5 rounded-xl bg-sky-600 hover:bg-sky-500 active:scale-98 text-white font-bold text-xs sm:text-sm flex items-center justify-center gap-2 cursor-pointer transition shadow-xs border border-sky-400/30"
        >
          <PlayCircle className="w-4 h-4 shrink-0" />
          <span>{language === 'ne' ? `तह ${selectedLevel} को ५० प्रश्न अनलाइन परीक्षा दिनुहोस्` : `Start Level ${selectedLevel} 50-MCQ Exam`}</span>
        </button>
      </div>
    </div>
  );
};
