import React, { useState, useEffect } from 'react';
import { 
  Play, 
  Award, 
  Clock, 
  CheckCircle2, 
  RotateCcw, 
  Zap, 
  Sparkles, 
  HelpCircle, 
  ArrowRight, 
  FileText,
  Flame,
  Building2,
  Globe,
  Layers,
  ChevronRight,
  ShieldAlert
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { StorageService } from '../../services/storageService';
import { QuizResultData } from '../../types';
import { 
  DailyChallengeType, 
  DAILY_CHALLENGE_OPTIONS, 
  generateDailyChallengeQuiz,
  getTodayNepaliDisplayDate
} from '../../services/dailyChallengeGenerator';

export const DailyChallengeSection: React.FC = () => {
  const { startQuiz, setActiveTab, setQuizResult, user } = useApp();
  const [selectedType, setSelectedType] = useState<DailyChallengeType>('banking');
  const [completedTodayResult, setCompletedTodayResult] = useState<QuizResultData | null>(null);
  const [shuffleKey, setShuffleKey] = useState<number>(0);

  const todayDateStr = new Date().toISOString().slice(0, 10);
  const displayDateNep = getTodayNepaliDisplayDate();

  // Check if user has already taken today's 25-question daily challenge
  useEffect(() => {
    try {
      const history = StorageService.getQuizHistory();
      const todayDaily = history.find(h => {
        const isDailyMode = h.mode === 'daily';
        const is25Questions = h.totalQuestions === 25;
        const isToday = h.completedAt && h.completedAt.startsWith(todayDateStr);
        return isDailyMode && (is25Questions || isToday);
      });

      if (todayDaily) {
        setCompletedTodayResult(todayDaily);
      }
    } catch {
      // Storage safe fallback
    }
  }, [todayDateStr, shuffleKey]);

  // Launch the 25-question quiz based on the selected focus
  const handleLaunchQuiz = (typeToLaunch?: DailyChallengeType) => {
    const type = typeToLaunch || selectedType;
    const dailyQuizSet = generateDailyChallengeQuiz(type, 25);
    startQuiz(dailyQuizSet);
  };

  const handleShuffleNewSet = () => {
    setShuffleKey(prev => prev + 1);
  };

  const formatSeconds = (sec: number) => {
    const m = Math.floor(sec / 60);
    const s = sec % 60;
    return `${m}m ${s}s`;
  };

  const activeOption = DAILY_CHALLENGE_OPTIONS.find(o => o.id === selectedType) || DAILY_CHALLENGE_OPTIONS[0];

  return (
    <section 
      id="daily-challenge-section" 
      aria-label="Daily Challenge Section"
      className="relative overflow-hidden rounded-3xl bg-[#0B192C] text-white border border-slate-700/80 shadow-xl transition-all duration-300"
    >
      {/* Decorative ambient background accents */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-sky-500/10 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20" />
      <div className="absolute bottom-0 left-0 w-80 h-80 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none -ml-20 -mb-20" />

      <div className="relative p-5 sm:p-7 space-y-6">
        {/* Top Header Row */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-slate-800">
          <div className="flex items-start sm:items-center gap-3.5">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-amber-500 to-orange-600 text-white flex items-center justify-center shrink-0 shadow-lg shadow-orange-500/20 ring-2 ring-orange-400/30">
              <Flame className="w-6 h-6 fill-amber-200" />
            </div>
            <div>
              <div className="flex items-center gap-2.5 flex-wrap">
                <h2 className="text-lg sm:text-xl font-black text-[#FFFFFF] tracking-tight">
                  दैनिक २५ प्रश्न चुनौती (Daily Challenge)
                </h2>
                <span className="px-2.5 py-0.5 rounded-full bg-emerald-900/60 text-emerald-300 text-[11px] font-black border border-emerald-500/50">
                  २५ MCQs • नयाँ सेट
                </span>
                <span className="px-2.5 py-0.5 rounded-full bg-sky-900/60 text-sky-300 text-[11px] font-bold border border-sky-500/50">
                  {displayDateNep}
                </span>
              </div>
              <p className="text-xs sm:text-sm text-[#CBD5E1] mt-1 font-medium leading-relaxed">
                बैंकिङ आधारभूत (Banking Fundamentals) वा समसामयिक घटनाक्रम (Current Events) बाट २५ वटा वस्तुगत प्रश्नहरूको दैनिक परीक्षा।
              </p>
            </div>
          </div>

          {/* XP & Streak Pills */}
          <div className="flex items-center gap-2 self-start sm:self-auto shrink-0">
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-orange-950/60 text-orange-300 text-xs font-black border border-orange-500/50">
              <Flame className="w-4 h-4 fill-orange-400 text-orange-400" />
              <span>{user?.streak || 3} दिने Streak</span>
            </div>
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-950/60 text-amber-300 text-xs font-black border border-amber-500/50">
              <Zap className="w-4 h-4 fill-amber-400 text-amber-400" />
              <span>+७५ Bonus XP</span>
            </div>
          </div>
        </div>

        {/* Completed Today Banner OR Quiz Launch Workspace */}
        {completedTodayResult ? (
          /* Instant Scorecard Summary Banner */
          <div className="p-5 sm:p-6 rounded-2xl bg-slate-900/90 border border-emerald-500/40 space-y-5">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-emerald-600 text-white flex items-center justify-center shrink-0 shadow-md">
                  <CheckCircle2 className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-base font-black text-[#FFFFFF]">
                    आजको दैनिक २५ प्रश्न परीक्षा सफलतापूर्वक सम्पन्न भयो!
                  </h3>
                  <p className="text-xs text-[#CBD5E1] mt-0.5">
                    स्कोर सुरक्षित गरिएको छ। नतिजाको सविस्तार व्याख्या हेर्नुहोस् वा पुनः नयाँ २५ प्रश्न सेट अभ्यास गर्नुहोस्।
                  </p>
                </div>
              </div>

              <span className="px-3.5 py-1.5 rounded-xl bg-emerald-950/80 text-emerald-300 border border-emerald-500/60 text-xs font-black">
                शुद्धता: {completedTodayResult.accuracy}%
              </span>
            </div>

            {/* Metrics Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div className="p-3.5 rounded-xl bg-[#0F172A] border border-slate-700">
                <span className="text-[11px] font-bold text-[#94A3B8] uppercase tracking-wider block">प्राप्ताङ्क (Net Score)</span>
                <p className="text-2xl font-black text-emerald-400 mt-1">
                  {completedTodayResult.score} <span className="text-xs text-slate-400 font-semibold">/ 25</span>
                </p>
              </div>

              <div className="p-3.5 rounded-xl bg-[#0F172A] border border-slate-700">
                <span className="text-[11px] font-bold text-[#94A3B8] uppercase tracking-wider block">सही / गलत उत्तर</span>
                <p className="text-2xl font-black text-white mt-1">
                  <span className="text-emerald-400">{completedTodayResult.correctAnswers}</span>
                  <span className="text-slate-500 text-sm mx-1">/</span>
                  <span className="text-rose-400">{completedTodayResult.incorrectAnswers}</span>
                </p>
              </div>

              <div className="p-3.5 rounded-xl bg-[#0F172A] border border-slate-700">
                <span className="text-[11px] font-bold text-[#94A3B8] uppercase tracking-wider block">लागेको समय</span>
                <p className="text-2xl font-black text-white mt-1 font-mono flex items-center gap-1.5">
                  <Clock className="w-4 h-4 text-sky-400" />
                  {formatSeconds(completedTodayResult.timeSpentSeconds)}
                </p>
              </div>

              <div className="p-3.5 rounded-xl bg-[#0F172A] border border-slate-700">
                <span className="text-[11px] font-bold text-[#94A3B8] uppercase tracking-wider block">XP बोनस</span>
                <p className="text-2xl font-black text-amber-400 mt-1 flex items-center gap-1.5">
                  <Zap className="w-5 h-5 fill-amber-400 text-amber-400" />
                  +{completedTodayResult.xpEarned || 75} XP
                </p>
              </div>
            </div>

            {/* Action CTA Buttons */}
            <div className="flex flex-col sm:flex-row items-center gap-3 pt-2">
              <button
                type="button"
                id="view-daily-challenge-result-btn"
                onClick={() => {
                  setQuizResult(completedTodayResult);
                  setActiveTab('quiz');
                }}
                className="w-full sm:w-auto px-5 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 active:scale-[0.99] text-white font-bold text-xs flex items-center justify-center gap-2 transition cursor-pointer shadow-md shadow-emerald-700/30"
              >
                <FileText className="w-4 h-4" />
                <span>विस्तृत उत्तर कुञ्जिका र समाधान समीक्षा (Review Solutions)</span>
              </button>

              <button
                type="button"
                id="retake-daily-challenge-btn"
                onClick={() => handleLaunchQuiz(selectedType)}
                className="w-full sm:w-auto px-5 py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs flex items-center justify-center gap-2 transition border border-slate-600 cursor-pointer"
              >
                <RotateCcw className="w-4 h-4 text-sky-400" />
                <span>नयाँ २५ प्रश्न सेट पुनः दिनुहोस् (Practice Fresh 25Q Set)</span>
              </button>
            </div>
          </div>
        ) : (
          /* Active Daily Challenge Workspace */
          <div className="space-y-5">
            {/* Category Selector Tabs: Banking Fundamentals vs Current Events vs Mixed */}
            <div>
              <div className="flex items-center justify-between gap-2 mb-2.5">
                <span className="text-xs font-bold text-[#94A3B8] uppercase tracking-wider">
                  परीक्षा विधा रोज्नुहोस् (Select Challenge Subject Focus)
                </span>
                <button
                  type="button"
                  onClick={handleShuffleNewSet}
                  className="text-xs text-sky-300 hover:text-sky-200 flex items-center gap-1 cursor-pointer transition font-medium"
                  title="नयाँ २५ प्रश्न सेट उत्पन्न गर्नुहोस्"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>नयाँ २५ प्रश्न उत्पन्न गर्नुहोस्</span>
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {DAILY_CHALLENGE_OPTIONS.map(opt => {
                  const isSelected = selectedType === opt.id;
                  return (
                    <button
                      key={opt.id}
                      type="button"
                      onClick={() => setSelectedType(opt.id)}
                      className={`relative p-3.5 sm:p-4 rounded-2xl text-left transition-all duration-200 cursor-pointer border ${
                        isSelected 
                          ? 'bg-gradient-to-br from-slate-800 to-slate-900 border-sky-400 text-white shadow-lg ring-1 ring-sky-400/50' 
                          : 'bg-[#0F172A]/70 hover:bg-[#0F172A] border-slate-700/80 text-slate-300 hover:text-white'
                      }`}
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex items-center gap-2.5">
                          <div className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 ${
                            isSelected 
                              ? 'bg-sky-500 text-white shadow-md' 
                              : 'bg-slate-800 text-slate-400'
                          }`}>
                            {opt.id === 'banking' && <Building2 className="w-4 h-4" />}
                            {opt.id === 'current_events' && <Globe className="w-4 h-4" />}
                            {opt.id === 'mixed' && <Layers className="w-4 h-4" />}
                          </div>
                          <div>
                            <h4 className="text-xs sm:text-sm font-black text-white">
                              {opt.labelNepali}
                            </h4>
                            <span className="text-[11px] text-[#94A3B8] block">
                              {opt.labelEnglish}
                            </span>
                          </div>
                        </div>

                        <span className={`px-2 py-0.5 rounded-md text-[10px] font-black shrink-0 ${
                          isSelected 
                            ? 'bg-sky-900/60 text-sky-200 border border-sky-400/60' 
                            : 'bg-slate-800 text-slate-400 border border-slate-700'
                        }`}>
                          २५ Qs
                        </span>
                      </div>

                      {/* Topic Tags Preview */}
                      <div className="mt-3 flex items-center gap-1.5 flex-wrap">
                        {opt.topics.slice(0, 3).map((t, idx) => (
                          <span 
                            key={idx} 
                            className="px-2 py-0.5 rounded-md bg-slate-800/80 text-[10px] text-[#CBD5E1] border border-slate-700/60 font-medium"
                          >
                            {t}
                          </span>
                        ))}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Exam Standards Specification Row */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 text-xs">
              <div className="p-3 rounded-2xl bg-[#0F172A] border border-slate-700/80 flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-sky-950 text-sky-300 border border-sky-600/40 flex items-center justify-center shrink-0 font-black text-xs">
                  25Q
                </div>
                <div>
                  <span className="font-black text-white block">२५ प्रश्नहरू</span>
                  <span className="text-[11px] text-[#94A3B8]">पूर्णाङ्क: २५ अङ्क</span>
                </div>
              </div>

              <div className="p-3 rounded-2xl bg-[#0F172A] border border-slate-700/80 flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-amber-950 text-amber-300 border border-amber-600/40 flex items-center justify-center shrink-0">
                  <Clock className="w-4 h-4" />
                </div>
                <div>
                  <span className="font-black text-white block">१५ मिनेट</span>
                  <span className="text-[11px] text-[#94A3B8]">३६ सेकेन्ड प्रति प्रश्न</span>
                </div>
              </div>

              <div className="p-3 rounded-2xl bg-[#0F172A] border border-slate-700/80 flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-rose-950 text-rose-300 border border-rose-600/40 flex items-center justify-center shrink-0 font-bold text-xs">
                  -20%
                </div>
                <div>
                  <span className="font-black text-white block">नेगेटिभ मार्किङ</span>
                  <span className="text-[11px] text-[#94A3B8]">गलतमा ०.२ कटौति</span>
                </div>
              </div>

              <div className="p-3 rounded-2xl bg-[#0F172A] border border-slate-700/80 flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-purple-950 text-purple-300 border border-purple-600/40 flex items-center justify-center shrink-0">
                  <Sparkles className="w-4 h-4" />
                </div>
                <div>
                  <span className="font-black text-white block">सविस्तार उत्तर</span>
                  <span className="text-[11px] text-[#94A3B8]">ऐन तथा तथ्य स्रोत</span>
                </div>
              </div>
            </div>

            {/* Launch CTA Bar */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-2">
              <div className="text-xs text-[#CBD5E1] flex items-center gap-2">
                <HelpCircle className="w-4 h-4 text-sky-400 shrink-0" />
                <span>
                  चयन गरिएको: <strong className="text-white font-bold">{activeOption.labelNepali}</strong> ({activeOption.descriptionNepali.slice(0, 50)}...)
                </span>
              </div>

              <div className="flex items-center gap-3 w-full sm:w-auto">
                <button
                  type="button"
                  id="start-daily-challenge-btn"
                  onClick={() => handleLaunchQuiz(selectedType)}
                  className="flex-1 sm:flex-none min-h-[46px] px-6 py-3 rounded-2xl bg-gradient-to-r from-sky-600 to-indigo-600 hover:from-sky-500 hover:to-indigo-500 active:scale-[0.99] text-white font-black text-sm flex items-center justify-center gap-2.5 transition cursor-pointer shadow-lg shadow-sky-600/30 ring-1 ring-sky-400/50"
                >
                  <Play className="w-4 h-4 fill-white" />
                  <span>दैनिक २५ प्रश्न सुरु गर्नुहोस्</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

export default DailyChallengeSection;
