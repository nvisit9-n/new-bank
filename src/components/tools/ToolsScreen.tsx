import React, { useState } from 'react';
import { 
  Timer, 
  Layers, 
  ChevronRight, 
  ArrowLeft, 
  Sparkles,
  BookOpen,
  Award
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { PomodoroTimer } from '../home/PomodoroTimer';
import { FlashcardEngine } from '../flashcards/FlashcardEngine';

export const ToolsScreen: React.FC = () => {
  const { setActiveTab } = useApp();
  const [activeTool, setActiveTool] = useState<'pomodoro' | 'flashcards'>('pomodoro');

  return (
    <div className="space-y-6 pb-12">
      {/* Top Breadcrumb & Back Navigation */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-200 dark:border-slate-800">
        <div className="flex items-center gap-2 text-xs font-bold text-slate-500 dark:text-slate-400 flex-wrap">
          <button
            type="button"
            onClick={() => setActiveTab('home')}
            className="hover:text-blue-600 dark:hover:text-blue-400 transition cursor-pointer"
          >
            गृहपृष्ठ (Home)
          </button>
          <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
          <span className="text-slate-900 dark:text-white font-extrabold">
            अध्ययन औजारहरू (Study Tools)
          </span>
          <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
          <span className="text-blue-600 dark:text-blue-400">
            {activeTool === 'pomodoro' ? 'पोमोडोरो टाइमर' : 'स्मार्ट फ्ल्यासकार्ड'}
          </span>
        </div>

        <button
          type="button"
          onClick={() => setActiveTab('home')}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs font-bold text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800 transition cursor-pointer self-start sm:self-auto shadow-2xs"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>&larr; पछाडि फर्कनुहोस् (Home)</span>
        </button>
      </div>

      {/* Screen Title & Tool Switcher Segment */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-2xs">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full bg-blue-50 dark:bg-blue-950/50 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-800 font-black text-[10px] uppercase tracking-wider flex items-center gap-1">
              <Sparkles className="w-3 h-3 text-amber-500 fill-current" />
              Focus & Memorization Engine
            </span>
          </div>
          <h1 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white mt-1">
            अध्ययन औजार तथा कण्ठस्थ केन्द्र (Study Tools)
          </h1>
          <p className="text-xs text-slate-600 dark:text-slate-400 mt-0.5">
            वैज्ञानिक पोमोडोरो चक्रद्वारा एकाग्रता बढाउनुहोस् र बैंकिङ तथा कानुनका कठिन परिभाषाहरू फ्ल्यासकार्डबाट कण्ठ गर्नुहोस्।
          </p>
        </div>

        {/* Segmented Controls */}
        <div className="flex items-center p-1 bg-slate-100 dark:bg-slate-800 rounded-xl shrink-0">
          <button
            type="button"
            onClick={() => setActiveTool('pomodoro')}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              activeTool === 'pomodoro'
                ? 'bg-white dark:bg-slate-900 text-blue-600 dark:text-blue-400 shadow-xs'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <Timer className="w-4 h-4" />
            <span>पोमोडोरो टाइमर</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTool('flashcards')}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              activeTool === 'flashcards'
                ? 'bg-white dark:bg-slate-900 text-blue-600 dark:text-blue-400 shadow-xs'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <Layers className="w-4 h-4" />
            <span>स्मार्ट फ्ल्यासकार्ड</span>
          </button>
        </div>
      </div>

      {/* Render Active Tool */}
      <div className="w-full">
        {activeTool === 'pomodoro' ? (
          <PomodoroTimer />
        ) : (
          <FlashcardEngine />
        )}
      </div>
    </div>
  );
};

export default ToolsScreen;
