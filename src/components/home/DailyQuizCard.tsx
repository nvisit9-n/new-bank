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
  AlertCircle
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { getQuestionsByCategory, convertQuizQuestionToQuestion } from '../../data/quizData';
import { QuizSet, QuizResultData } from '../../types';
import { StorageService } from '../../services/storageService';

export const DailyQuizCard: React.FC = () => {
  const { startQuiz, setActiveTab, setQuizResult, user } = useApp();
  const [completedTodayResult, setCompletedTodayResult] = useState<QuizResultData | null>(null);

  const todayDateStr = new Date().toISOString().slice(0, 10);

  // Check if user has already taken today's 25-MCQ daily quiz
  useEffect(() => {
    try {
      const history = StorageService.getQuizHistory();
      const todayDaily = history.find(h => {
        const isDailyMode = h.mode === 'daily';
        const is25Questions = h.totalQuestions === 25;
        const isToday = h.completedAt && h.completedAt.startsWith(todayDateStr);
        return (isDailyMode && is25Questions) || (isDailyMode && isToday);
      });

      if (todayDaily) {
        setCompletedTodayResult(todayDaily);
      }
    } catch {
      // Storage error fallback
    }
  }, [todayDateStr]);

  // Construct and launch the 25-question Daily Quiz
  const handleLaunchDailyQuiz = () => {
    // Select 25 randomized, unique questions across all syllabus modules
    const rawQuestions = getQuestionsByCategory('All', 25, 'All');
    const questions = rawQuestions.map(convertQuizQuestionToQuestion);

    const dailyQuizSet: QuizSet = {
      id: `daily-quiz-25-${todayDateStr}-${Date.now()}`,
      title: 'दैनिक २५ प्रश्न विशेष नमुना परीक्षा (Daily 25 MCQ Quiz)',
      description: 'बैंकिङ, ऐन कानुन, व्यवस्थापन, अर्थशास्त्र, र समसामयिक विषयहरूबाट २५ वटा मिश्रित वस्तुगत प्रश्नहरू (२५ अङ्क, २०% नेगेटिभ मार्किङ)।',
      category: 'All' as any,
      difficulty: 'Medium',
      mode: 'daily',
      timeLimitMinutes: 15,
      questions: questions,
      badge: 'Daily 25 MCQ'
    };

    startQuiz(dailyQuizSet);
  };

  const formatSeconds = (sec: number) => {
    const m = Math.floor(sec / 60);
    const s = sec % 60;
    return `${m}m ${s}s`;
  };

  return (
    <div 
      id="daily-quiz-section"
      className="p-5 sm:p-6 rounded-3xl bg-gradient-to-br from-white via-white to-sky-50/50 dark:from-slate-900 dark:via-slate-900 dark:to-slate-800/80 border border-slate-200 dark:border-slate-800 shadow-sm transition-all"
    >
      {/* Header bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100 dark:border-slate-800">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-sky-600 to-indigo-600 text-white flex items-center justify-center shrink-0 shadow-md shadow-sky-500/20">
            <Award className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h2 className="text-base sm:text-lg font-black text-slate-900 dark:text-white">
                दैनिक २५ प्रश्न विशेष नमुना परीक्षा (Daily 25 MCQ Quiz)
              </h2>
              <span className="px-2.5 py-0.5 rounded-full bg-sky-100 dark:bg-sky-950 text-sky-700 dark:text-[#38BDF8] text-[11px] font-extrabold border border-sky-200 dark:border-sky-800">
                Today's Daily Set
              </span>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              लोक सेवा आयोग र बैंकिङ मानक अनुसार २५ मिश्रित वस्तुगत प्रश्नहरू • १५ मिनेट • २०% नेगेटिभ मार्किङ
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl bg-amber-50 dark:bg-amber-950/50 text-amber-700 dark:text-amber-300 text-xs font-bold border border-amber-200 dark:border-amber-800">
            <Zap className="w-3.5 h-3.5 fill-amber-500 text-amber-500" />
            <span>+७५ Bonus XP</span>
          </span>
        </div>
      </div>

      {/* Main Body: Completed Summary or Start Card */}
      {completedTodayResult ? (
        /* Instant Score Summary Banner if taken today */
        <div className="mt-4 p-4 sm:p-5 rounded-2xl bg-emerald-50/70 dark:bg-emerald-950/20 border border-emerald-200 dark:border-emerald-800/60 space-y-4">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-emerald-600 text-white flex items-center justify-center shrink-0 shadow-xs">
                <CheckCircle2 className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-sm font-black text-slate-900 dark:text-white">
                  आजको दैनिक २५ प्रश्न परीक्षा सम्पन्न भयो!
                </h4>
                <p className="text-xs text-slate-600 dark:text-slate-300">
                  तपाईंको स्कोर रेकर्ड गरिएको छ। नतिजा विश्लेषण हेर्नुहोस् वा पुनः नयाँ सेट अभ्यास गर्नुहोस्।
                </p>
              </div>
            </div>

            <span className="px-3 py-1 rounded-xl bg-white dark:bg-slate-800 border border-emerald-300 dark:border-emerald-700 text-xs font-black text-emerald-700 dark:text-[#4ADE80]">
              शुद्धता: {completedTodayResult.accuracy}%
            </span>
          </div>

          {/* Quick Metrics Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
            <div className="p-3 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
              <span className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">प्राप्ताङ्क (Net Score)</span>
              <p className="text-xl font-black text-emerald-600 dark:text-[#4ADE80] mt-0.5">
                {completedTodayResult.score} <span className="text-xs text-slate-400 font-semibold">/ 25</span>
              </p>
            </div>

            <div className="p-3 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
              <span className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">सही / गलत उत्तर</span>
              <p className="text-xl font-black text-slate-900 dark:text-white mt-0.5">
                <span className="text-emerald-600 dark:text-[#4ADE80]">{completedTodayResult.correctAnswers}</span>
                <span className="text-slate-400 text-xs mx-1">/</span>
                <span className="text-rose-500">{completedTodayResult.incorrectAnswers}</span>
              </p>
            </div>

            <div className="p-3 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
              <span className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">लागेको समय</span>
              <p className="text-xl font-black text-slate-900 dark:text-white mt-0.5 font-mono flex items-center gap-1">
                <Clock className="w-3.5 h-3.5 text-slate-400" />
                {formatSeconds(completedTodayResult.timeSpentSeconds)}
              </p>
            </div>

            <div className="p-3 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
              <span className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">XP बोनस</span>
              <p className="text-xl font-black text-amber-500 mt-0.5 flex items-center gap-1">
                <Zap className="w-4 h-4 fill-amber-500" />
                +{completedTodayResult.xpEarned || 75} XP
              </p>
            </div>
          </div>

          {/* Action CTA Buttons */}
          <div className="flex flex-col sm:flex-row items-center gap-3 pt-1">
            <button
              type="button"
              id="view-daily-quiz-result-btn"
              onClick={() => {
                setQuizResult(completedTodayResult);
                setActiveTab('quiz');
              }}
              className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 active:scale-[0.99] text-white font-bold text-xs flex items-center justify-center gap-2 transition cursor-pointer shadow-xs"
            >
              <FileText className="w-4 h-4" />
              <span>विस्तृत नतिजा तथा प्रश्न समीक्षा (Review Solutions)</span>
            </button>

            <button
              type="button"
              id="retake-daily-quiz-btn"
              onClick={handleLaunchDailyQuiz}
              className="w-full sm:w-auto px-4 py-2.5 rounded-xl bg-white dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 font-bold text-xs flex items-center justify-center gap-1.5 transition border border-slate-300 dark:border-slate-700 cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5 text-sky-500" />
              <span>नयाँ २५ प्रश्न सेट सुरु गर्नुहोस् (Practice Fresh Set)</span>
            </button>
          </div>
        </div>
      ) : (
        /* Ready to start today's quiz */
        <div className="mt-4 space-y-4">
          {/* Syllabus weightage highlight chips */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 text-xs">
            <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-800 flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-sky-100 dark:bg-sky-950 text-sky-600 dark:text-[#38BDF8] flex items-center justify-center shrink-0 font-black text-xs">
                25Q
              </div>
              <div>
                <span className="font-extrabold text-slate-900 dark:text-white block">२५ प्रश्नहरू</span>
                <span className="text-[11px] text-slate-500 dark:text-slate-400">पूर्णाङ्क: २५ अङ्क</span>
              </div>
            </div>

            <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-800 flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-amber-100 dark:bg-amber-950 text-amber-600 dark:text-amber-400 flex items-center justify-center shrink-0">
                <Clock className="w-4 h-4" />
              </div>
              <div>
                <span className="font-extrabold text-slate-900 dark:text-white block">१५ मिनेट</span>
                <span className="text-[11px] text-slate-500 dark:text-slate-400">प्रत्येक प्रश्न: ३६ सेकेन्ड</span>
              </div>
            </div>

            <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-800 flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-rose-100 dark:bg-rose-950 text-rose-600 dark:text-rose-400 flex items-center justify-center shrink-0 font-bold text-xs">
                -20%
              </div>
              <div>
                <span className="font-extrabold text-slate-900 dark:text-white block">नेगेटिभ मार्किङ</span>
                <span className="text-[11px] text-slate-500 dark:text-slate-400">गलत उत्तरमा ०.२ कटौति</span>
              </div>
            </div>

            <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-800 flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-purple-100 dark:bg-purple-950 text-purple-600 dark:text-purple-400 flex items-center justify-center shrink-0">
                <Sparkles className="w-4 h-4" />
              </div>
              <div>
                <span className="font-extrabold text-slate-900 dark:text-white block">तत्काल नतिजा</span>
                <span className="text-[11px] text-slate-500 dark:text-slate-400">सविस्तार उत्तर र व्याख्या</span>
              </div>
            </div>
          </div>

          {/* Primary CTA Launch Button */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2">
            <div className="text-xs text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
              <HelpCircle className="w-4 h-4 text-sky-500 shrink-0" />
              <span>बैंकिङ, ऐन कानुन, व्यवस्थापन, अर्थशास्त्र, र समसामयिक विषयबाट मिश्रित प्रश्नहरू</span>
            </div>

            <button
              type="button"
              id="start-daily-quiz-btn"
              onClick={handleLaunchDailyQuiz}
              className="w-full sm:w-auto min-h-[44px] px-6 py-3 rounded-2xl bg-gradient-to-r from-sky-600 to-indigo-600 hover:from-sky-500 hover:to-indigo-500 active:scale-[0.99] text-white font-extrabold text-sm flex items-center justify-center gap-2.5 transition cursor-pointer shadow-md shadow-sky-600/25"
            >
              <Play className="w-4 h-4 fill-white" />
              <span>दैनिक २५ प्रश्न परीक्षा सुरु गर्नुहोस्</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default DailyQuizCard;
