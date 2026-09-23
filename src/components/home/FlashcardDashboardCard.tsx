import React, { useState, useEffect } from 'react';
import { 
  Layers, 
  RotateCw, 
  CheckCircle2, 
  Sparkles, 
  ArrowRight, 
  Flame, 
  BookOpen, 
  Check, 
  Volume2 
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { FLASHCARD_ITEMS } from '../../data/flashcardData';
import confetti from 'canvas-confetti';

const STORAGE_KEY = 'btn_flashcard_progress_v1';

export const FlashcardDashboardCard: React.FC = () => {
  const { setActiveTab, addToast } = useApp();

  const [progress, setProgress] = useState<{ knownIds: string[]; dontKnowIds: string[] }>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) return JSON.parse(saved);
    } catch {}
    return { knownIds: [], dontKnowIds: [] };
  });

  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);

  // Sync progress
  useEffect(() => {
    const handleStorageChange = () => {
      try {
        const saved = localStorage.getItem(STORAGE_KEY);
        if (saved) setProgress(JSON.parse(saved));
      } catch {}
    };
    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  const totalCards = FLASHCARD_ITEMS.length;
  const knownCount = progress.knownIds.length;
  const dontKnowCount = progress.dontKnowIds.length;
  const masteryPercentage = totalCards > 0 ? Math.round((knownCount / totalCards) * 100) : 0;

  const currentCard = FLASHCARD_ITEMS[currentIndex % totalCards];

  const isKnown = progress.knownIds.includes(currentCard.id);
  const isDontKnow = progress.dontKnowIds.includes(currentCard.id);

  const saveProgress = (updated: { knownIds: string[]; dontKnowIds: string[] }) => {
    setProgress(updated);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify({ ...updated, lastPracticed: new Date().toISOString() }));
    } catch {}
  };

  const handleKnow = (e: React.MouseEvent) => {
    e.stopPropagation();
    const nextKnown = Array.from(new Set([...progress.knownIds, currentCard.id]));
    const nextDontKnow = progress.dontKnowIds.filter(id => id !== currentCard.id);
    saveProgress({ knownIds: nextKnown, dontKnowIds: nextDontKnow });
    try {
      confetti({ particleCount: 18, spread: 40, origin: { y: 0.7 } });
    } catch {}
    addToast(`✓ "${currentCard.termNe.split(' ')[0]}" कण्ठ भएको सूचीमा थपियो!`, 'success');
    setIsFlipped(false);
    setCurrentIndex(prev => (prev + 1) % totalCards);
  };

  const handleDontKnow = (e: React.MouseEvent) => {
    e.stopPropagation();
    const nextDontKnow = Array.from(new Set([...progress.dontKnowIds, currentCard.id]));
    const nextKnown = progress.knownIds.filter(id => id !== currentCard.id);
    saveProgress({ knownIds: nextKnown, dontKnowIds: nextDontKnow });
    addToast('पुनरावलोकन सूचीमा थपियो: फेरि दोहोर्याउनुहोस्', 'info');
    setIsFlipped(false);
    setCurrentIndex(prev => (prev + 1) % totalCards);
  };

  return (
    <div 
      id="dashboard-flashcard-preview-card"
      className="p-5 sm:p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm relative overflow-hidden transition-all hover:border-sky-400 dark:hover:border-sky-600"
    >
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-slate-100 dark:border-slate-800">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-sky-600 to-indigo-600 text-white flex items-center justify-center shadow-md shadow-sky-600/20 shrink-0">
            <Layers className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-base sm:text-lg font-black text-slate-900 dark:text-[#FFFFFF] tracking-tight">
                दैनिक कानुनी तथा बैंकिङ फ्ल्यासकार्ड
              </h3>
              <span className="px-2 py-0.5 rounded-full bg-sky-100 dark:bg-sky-950 text-sky-700 dark:text-[#38BDF8] text-[10px] font-black border border-sky-300 dark:border-sky-800">
                NEW
              </span>
            </div>
            <p className="text-xs text-slate-500 dark:text-[#FFFFFF] font-medium">
              कार्ड पल्टाएर मुख्य परिभाषा र दफाहरू कण्ठ गर्नुहोस् (कार्ड {currentIndex + 1} / {totalCards})
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={() => setActiveTab('flashcards')}
          className="px-3.5 py-1.5 rounded-xl bg-sky-50 dark:bg-sky-950/60 text-sky-700 dark:text-[#38BDF8] hover:bg-sky-100 dark:hover:bg-sky-900/60 text-xs font-black border border-sky-200 dark:border-sky-800 transition flex items-center gap-1.5 cursor-pointer shrink-0"
        >
          <span>सबै कार्डहरू (Full Deck)</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Mini Progress Status Bar */}
      <div className="my-3 flex items-center justify-between text-xs font-bold text-slate-500 dark:text-[#FFFFFF]">
        <div className="flex items-center gap-3">
          <span className="text-[#4ADE80] flex items-center gap-1">
            <CheckCircle2 className="w-3.5 h-3.5" /> {knownCount} कण्ठ
          </span>
          <span className="text-amber-500 flex items-center gap-1">
            <RotateCw className="w-3.5 h-3.5" /> {dontKnowCount} दोहोर्याउने
          </span>
        </div>
        <span className="text-sky-600 dark:text-[#38BDF8]">
          {masteryPercentage}% कण्ठ प्रगति
        </span>
      </div>

      {/* Interactive Quick Flip Box */}
      <div
        onClick={() => setIsFlipped(prev => !prev)}
        className="w-full min-h-[190px] rounded-2xl bg-slate-50 dark:bg-slate-950/80 border border-slate-200 dark:border-slate-800 p-5 cursor-pointer select-none transition-all hover:border-sky-400 dark:hover:border-sky-500 flex flex-col justify-between group relative"
      >
        <div>
          <div className="flex items-center justify-between gap-2 pb-2 border-b border-slate-200/60 dark:border-slate-800">
            <span className="text-[11px] font-bold text-sky-600 dark:text-[#38BDF8] uppercase tracking-wide">
              {currentCard.categoryLabelNe}
            </span>
            <div className="flex items-center gap-2">
              {currentCard.actRef && (
                <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-white dark:bg-slate-800 text-slate-600 dark:text-[#FFFFFF] border border-slate-200 dark:border-slate-700">
                  {currentCard.actRef}
                </span>
              )}
              {isKnown && (
                <span className="text-[10px] font-bold text-emerald-500 flex items-center gap-0.5">
                  <Check className="w-3 h-3" /> आउँछ
                </span>
              )}
            </div>
          </div>

          {!isFlipped ? (
            <div className="py-4 text-center space-y-1.5">
              <span className="text-[11px] font-bold text-slate-400">
                {currentCard.sectionRef || 'प्रमुख परिभाषा'}
              </span>
              <h4 className="text-lg sm:text-xl font-black text-slate-900 dark:text-[#FFFFFF]">
                {currentCard.termNe}
              </h4>
              <p className="text-xs text-slate-500 dark:text-[#FFFFFF] font-medium">
                {currentCard.termEn}
              </p>
            </div>
          ) : (
            <div className="py-2 space-y-2 text-left">
              <span className="text-[10px] font-black uppercase text-[#38BDF8] block">
                आधिकारिक कानुनी परिभाषा:
              </span>
              <p className="text-xs sm:text-sm font-medium text-slate-800 dark:text-[#FFFFFF] leading-relaxed">
                {currentCard.definitionNe}
              </p>
              {currentCard.memoryMnemonicNe && (
                <p className="text-[11px] font-bold text-amber-500 flex items-center gap-1">
                  <Flame className="w-3 h-3 shrink-0" /> {currentCard.memoryMnemonicNe}
                </p>
              )}
            </div>
          )}
        </div>

        <div className="pt-2 flex items-center justify-between text-[11px] font-bold text-slate-400 dark:text-slate-500">
          <span className="group-hover:text-sky-500 transition-colors flex items-center gap-1">
            <RotateCw className="w-3 h-3" />
            {isFlipped ? 'अगाडि फर्किन थिच्नुहोस्' : 'उत्तर / परिभाषा हेर्न थिच्नुहोस्'}
          </span>
          <span>क्लिक गरेर पल्टाउनुहोस्</span>
        </div>
      </div>

      {/* Quick Know / Don't Know Buttons */}
      <div className="grid grid-cols-2 gap-3 mt-3">
        <button
          type="button"
          onClick={handleDontKnow}
          className="py-2.5 px-4 rounded-xl bg-amber-500/15 hover:bg-amber-500 text-amber-700 dark:text-amber-300 hover:text-slate-950 font-bold text-xs flex items-center justify-center gap-1.5 transition cursor-pointer border border-amber-500/30"
        >
          <RotateCw className="w-3.5 h-3.5" />
          <span>फेरि दोहोर्याउने (Don't Know)</span>
        </button>

        <button
          type="button"
          onClick={handleKnow}
          className="py-2.5 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center justify-center gap-1.5 transition cursor-pointer shadow-xs"
        >
          <CheckCircle2 className="w-3.5 h-3.5" />
          <span>मलाई आउँछ (Know)</span>
        </button>
      </div>

    </div>
  );
};

export default FlashcardDashboardCard;
