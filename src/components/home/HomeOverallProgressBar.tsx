import React from 'react';
import { 
  TrendingUp, 
  CheckCircle2, 
  BookOpen, 
  Award, 
  Target, 
  Zap, 
  Clock 
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const HomeOverallProgressBar: React.FC = () => {
  const { user } = useApp();

  // Progress metrics calculation
  const overallPercentage = 68; // 68% exam readiness benchmark
  const topicsCompleted = 34;
  const totalTopics = 50;
  const mockTestsAttempted = 18;
  const dailyTargetMinutes = 60;
  const dailyCompletedMinutes = 42;
  const dailyProgressPercent = Math.min(100, Math.round((dailyCompletedMinutes / dailyTargetMinutes) * 100));

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 sm:p-5 shadow-2xs">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-5">
        
        {/* Left: Overall Readiness with circular/radial gauge */}
        <div className="flex items-center gap-4">
          {/* Circular Progress Gauge */}
          <div className="relative w-16 h-16 sm:w-18 sm:h-18 shrink-0 flex items-center justify-center">
            <svg className="w-full h-full transform -rotate-90" viewBox="0 0 72 72">
              <circle
                cx="36"
                cy="36"
                r="30"
                className="text-slate-100 dark:text-slate-800"
                strokeWidth="6"
                stroke="currentColor"
                fill="transparent"
              />
              <circle
                cx="36"
                cy="36"
                r="30"
                className="text-emerald-500 transition-all duration-1000 ease-out"
                strokeWidth="6"
                strokeDasharray={188.4}
                strokeDashoffset={188.4 - (188.4 * overallPercentage) / 100}
                strokeLinecap="round"
                stroke="currentColor"
                fill="transparent"
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
              <span className="text-base sm:text-lg font-black text-slate-900 dark:text-white leading-none">
                {overallPercentage}%
              </span>
              <span className="text-[9px] text-slate-500 font-bold uppercase tracking-tight">
                तयारी
              </span>
            </div>
          </div>

          <div>
            <div className="flex items-center gap-1.5">
              <span className="px-2 py-0.5 rounded-full bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 font-bold text-[10px] uppercase tracking-wider flex items-center gap-1">
                <Target className="w-3 h-3 text-emerald-600" />
                Exam Readiness Benchmark
              </span>
            </div>
            <h3 className="text-sm sm:text-base font-black text-slate-900 dark:text-white mt-1">
              समग्र परीक्षा तयारी प्रगति (Overall Progress)
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              पाठ्यक्रमका ५० मुख्य विषयहरू र ५० सेट मोक टेस्टको आधारमा मापन गरिएको तयारी सूचक।
            </p>
          </div>
        </div>

        {/* Right: Key Stats Summary Pills & Daily Goal */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 sm:gap-3 lg:w-1/2">
          {/* Stat 1: Topics */}
          <div className="p-2.5 sm:p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-800">
            <div className="flex items-center gap-1.5 text-slate-500 dark:text-slate-400 text-[11px] font-semibold">
              <BookOpen className="w-3.5 h-3.5 text-blue-500" />
              <span>विषय अध्ययन</span>
            </div>
            <div className="text-sm sm:text-base font-black text-slate-900 dark:text-white mt-1">
              {topicsCompleted} <span className="text-xs font-normal text-slate-400">/ {totalTopics}</span>
            </div>
            <div className="w-full bg-slate-200 dark:bg-slate-700 h-1.5 rounded-full mt-1.5 overflow-hidden">
              <div 
                className="bg-blue-600 h-full rounded-full" 
                style={{ width: `${(topicsCompleted / totalTopics) * 100}%` }} 
              />
            </div>
          </div>

          {/* Stat 2: Mock Tests */}
          <div className="p-2.5 sm:p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-800">
            <div className="flex items-center gap-1.5 text-slate-500 dark:text-slate-400 text-[11px] font-semibold">
              <Award className="w-3.5 h-3.5 text-amber-500" />
              <span>मोक टेस्ट</span>
            </div>
            <div className="text-sm sm:text-base font-black text-slate-900 dark:text-white mt-1">
              {mockTestsAttempted} <span className="text-xs font-normal text-slate-400">/ ५० सेट</span>
            </div>
            <div className="w-full bg-slate-200 dark:bg-slate-700 h-1.5 rounded-full mt-1.5 overflow-hidden">
              <div 
                className="bg-amber-500 h-full rounded-full" 
                style={{ width: `${(mockTestsAttempted / 50) * 100}%` }} 
              />
            </div>
          </div>

          {/* Stat 3: Daily Goal */}
          <div className="col-span-2 sm:col-span-1 p-2.5 sm:p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-800">
            <div className="flex items-center gap-1.5 text-slate-500 dark:text-slate-400 text-[11px] font-semibold">
              <Clock className="w-3.5 h-3.5 text-emerald-500" />
              <span>दैनिक लक्ष्य</span>
            </div>
            <div className="text-sm sm:text-base font-black text-slate-900 dark:text-white mt-1">
              {dailyCompletedMinutes} <span className="text-xs font-normal text-slate-400">/ {dailyTargetMinutes} मिनेट</span>
            </div>
            <div className="w-full bg-slate-200 dark:bg-slate-700 h-1.5 rounded-full mt-1.5 overflow-hidden">
              <div 
                className="bg-emerald-500 h-full rounded-full" 
                style={{ width: `${dailyProgressPercent}%` }} 
              />
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};
