import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { 
  RotateCw, 
  CheckCircle2, 
  XCircle, 
  HelpCircle, 
  Sparkles, 
  Volume2, 
  VolumeX, 
  Shuffle, 
  RotateCcw, 
  BookOpen, 
  Scale, 
  Landmark, 
  ShieldAlert, 
  Award, 
  ArrowLeft, 
  ArrowRight,
  Eye,
  Filter,
  Check,
  Flame,
  Info,
  Bookmark
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { FLASHCARD_ITEMS, FLASHCARD_CATEGORIES } from '../../data/flashcardData';
import { FlashcardItem } from '../../types';
import { useApp } from '../../context/AppContext';

export type FlashcardStatus = 'know' | 'dont_know' | 'unseen';

interface FlashcardProgress {
  knownIds: string[];
  dontKnowIds: string[];
  lastPracticed: string;
}

const STORAGE_KEY = 'btn_flashcard_progress_v1';

export const FlashcardEngine: React.FC = () => {
  const { addToast, toggleBookmark, isBookmarked } = useApp();

  // Load persistent progress from localStorage
  const [progress, setProgress] = useState<FlashcardProgress>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        return JSON.parse(saved);
      }
    } catch {}
    return {
      knownIds: [],
      dontKnowIds: [],
      lastPracticed: new Date().toISOString()
    };
  });

  // Save progress changes to localStorage
  const saveProgress = (updated: FlashcardProgress) => {
    setProgress(updated);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    } catch {}
  };

  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<'all' | 'unseen' | 'know' | 'dont_know'>('all');
  const [isFlipped, setIsFlipped] = useState<boolean>(false);
  const [soundEnabled, setSoundEnabled] = useState<boolean>(true);
  const [isPlayingTts, setIsPlayingTts] = useState<boolean>(false);

  // Filter cards based on Category and Status
  const filteredCards = useMemo(() => {
    return FLASHCARD_ITEMS.filter(card => {
      // Category filter
      if (activeCategory !== 'all' && card.category !== activeCategory) {
        return false;
      }

      // Status filter
      const isKnown = progress.knownIds.includes(card.id);
      const isDontKnow = progress.dontKnowIds.includes(card.id);

      if (statusFilter === 'know') return isKnown;
      if (statusFilter === 'dont_know') return isDontKnow;
      if (statusFilter === 'unseen') return !isKnown && !isDontKnow;

      return true;
    });
  }, [activeCategory, statusFilter, progress]);

  // Card deck for current session
  const [deck, setDeck] = useState<FlashcardItem[]>(filteredCards);
  const [currentIndex, setCurrentIndex] = useState<number>(0);

  // Synchronize deck when filter changes
  useEffect(() => {
    setDeck(filteredCards);
    setCurrentIndex(0);
    setIsFlipped(false);
  }, [filteredCards]);

  const currentCard: FlashcardItem | undefined = deck[currentIndex];

  const currentStatus: FlashcardStatus = useMemo(() => {
    if (!currentCard) return 'unseen';
    if (progress.knownIds.includes(currentCard.id)) return 'know';
    if (progress.dontKnowIds.includes(currentCard.id)) return 'dont_know';
    return 'unseen';
  }, [currentCard, progress]);

  // Stats calculation
  const totalCardsCount = FLASHCARD_ITEMS.length;
  const knownCount = progress.knownIds.length;
  const dontKnowCount = progress.dontKnowIds.length;
  const masteryPercentage = totalCardsCount > 0 ? Math.round((knownCount / totalCardsCount) * 100) : 0;

  // Handle Flip
  const handleFlip = useCallback(() => {
    setIsFlipped(prev => !prev);
  }, []);

  // Next / Previous
  const handleNext = useCallback(() => {
    if (deck.length === 0) return;
    setIsFlipped(false);
    setCurrentIndex(prev => (prev + 1) % deck.length);
  }, [deck.length]);

  const handlePrev = useCallback(() => {
    if (deck.length === 0) return;
    setIsFlipped(false);
    setCurrentIndex(prev => (prev - 1 + deck.length) % deck.length);
  }, [deck.length]);

  // Mark as Know
  const handleMarkKnow = useCallback(() => {
    if (!currentCard) return;

    const nextKnown = Array.from(new Set([...progress.knownIds, currentCard.id]));
    const nextDontKnow = progress.dontKnowIds.filter(id => id !== currentCard.id);

    saveProgress({
      knownIds: nextKnown,
      dontKnowIds: nextDontKnow,
      lastPracticed: new Date().toISOString()
    });

    try {
      confetti({
        particleCount: 22,
        spread: 45,
        origin: { y: 0.7 }
      });
    } catch {}

    addToast(`✓ "${currentCard.termNe.split(' ')[0]}" कण्ठ भएको सूचीमा सुरक्षित भयो!`, 'success');
    handleNext();
  }, [currentCard, progress, handleNext, addToast]);

  // Mark as Don't Know (Needs Review)
  const handleMarkDontKnow = useCallback(() => {
    if (!currentCard) return;

    const nextDontKnow = Array.from(new Set([...progress.dontKnowIds, currentCard.id]));
    const nextKnown = progress.knownIds.filter(id => id !== currentCard.id);

    saveProgress({
      knownIds: nextKnown,
      dontKnowIds: nextDontKnow,
      lastPracticed: new Date().toISOString()
    });

    addToast(`पुनरावलोकन सूचीमा थपियो: फेरि दोहोर्याउनुहोस्`, 'info');
    handleNext();
  }, [currentCard, progress, handleNext, addToast]);

  // Shuffle Deck
  const handleShuffle = () => {
    setIsFlipped(false);
    setDeck(prev => [...prev].sort(() => Math.random() - 0.5));
    setCurrentIndex(0);
    addToast('🔀 फ्ल्यासकार्डहरू नयाँ क्रममा मिलाइयो!', 'info');
  };

  // Reset Progress
  const handleResetProgress = () => {
    if (window.confirm('के तपाईं सबै फ्ल्यासकार्डको "कण्ठ भएको / दोहोर्याउने" रेकर्ड रिसेट गर्न चाहनुहुन्छ?')) {
      const reset = {
        knownIds: [],
        dontKnowIds: [],
        lastPracticed: new Date().toISOString()
      };
      saveProgress(reset);
      addToast('सबै फ्ल्यासकार्ड प्रगति रिसेट गरियो। नयाँ अभ्यास सुरु गर्नुहोस्!', 'info');
    }
  };

  // Keyboard navigation support
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Ignore if typing in input/textarea
      if (['INPUT', 'TEXTAREA', 'SELECT'].includes((e.target as HTMLElement).tagName)) {
        return;
      }

      if (e.code === 'Space' || e.key === ' ' || e.key === 'ArrowUp' || e.key === 'ArrowDown') {
        e.preventDefault();
        handleFlip();
      } else if (e.key === 'ArrowRight') {
        e.preventDefault();
        handleMarkKnow();
      } else if (e.key === 'ArrowLeft') {
        e.preventDefault();
        handleMarkDontKnow();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleFlip, handleMarkKnow, handleMarkDontKnow]);

  // Web Speech Synthesis (TTS in Nepali/English)
  const speakText = (text: string) => {
    if (!soundEnabled || typeof window === 'undefined' || !('speechSynthesis' in window)) return;

    try {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 0.95;
      utterance.pitch = 1.0;

      // Select Nepali or Hindi voice if available, else system default
      const voices = window.speechSynthesis.getVoices();
      const devanagariVoice = voices.find(v => v.lang.includes('ne') || v.lang.includes('hi'));
      if (devanagariVoice) {
        utterance.voice = devanagariVoice;
      }

      utterance.onstart = () => setIsPlayingTts(true);
      utterance.onend = () => setIsPlayingTts(false);
      utterance.onerror = () => setIsPlayingTts(false);

      window.speechSynthesis.speak(utterance);
    } catch {
      setIsPlayingTts(false);
    }
  };

  return (
    <div id="flashcards-container" className="space-y-6 max-w-4xl mx-auto pb-12">
      
      {/* Header & Overview Stats */}
      <div className="p-6 rounded-3xl bg-gradient-to-r from-slate-900 via-sky-950 to-slate-900 text-white border border-sky-800/40 shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-sky-500/10 rounded-full blur-3xl pointer-events-none" />
        
        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="px-3 py-1 rounded-full bg-sky-500/20 text-[#38BDF8] border border-sky-400/30 text-xs font-black uppercase tracking-wider flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5" />
                स्मार्ट कण्ठ प्रणाली (Smart Memorizer)
              </span>
              <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-[#4ADE80] border border-emerald-400/30 text-xs font-bold">
                {totalCardsCount} मुख्य परिभाषाहरू
              </span>
            </div>
            
            <h1 className="text-2xl sm:text-3xl font-black text-[#FFFFFF] tracking-tight">
              कानुनी तथा बैंकिङ शब्दावली फ्ल्यासकार्ड
            </h1>
            <p className="text-sm text-slate-200 dark:text-[#FFFFFF] max-w-xl leading-relaxed">
              BAFIA, राष्ट्र बैंक ऐन, बैंकिङ कसूर, AML, र वित्तीय शब्दावलीहरू पल्टाएर कण्ठ गर्नुहोस्। "मलाई आउँछ" र "दोहोर्याउने" प्रणालीमार्फत कमजोर विषयहरू दोहोर्याउनुहोस्।
            </p>
          </div>

          {/* Quick Mastery Circle / Gauge */}
          <div className="flex items-center gap-4 bg-slate-800/80 backdrop-blur-md p-4 rounded-2xl border border-slate-700/80 shrink-0">
            <div className="w-16 h-16 rounded-full border-4 border-emerald-500/30 flex items-center justify-center relative">
              <div 
                className="absolute inset-0 rounded-full border-4 border-emerald-400 border-t-transparent"
                style={{ transform: `rotate(${(masteryPercentage / 100) * 360}deg)` }}
              />
              <span className="text-base font-black text-[#FFFFFF]">
                {masteryPercentage}%
              </span>
            </div>
            <div>
              <span className="text-xs text-slate-300 block font-bold">कुल कण्ठ प्रगति</span>
              <div className="flex items-center gap-2 text-xs font-bold mt-1">
                <span className="text-[#4ADE80] flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" /> {knownCount} आउँछ
                </span>
                <span className="text-slate-500">•</span>
                <span className="text-amber-400 flex items-center gap-1">
                  <RotateCw className="w-3.5 h-3.5" /> {dontKnowCount} दोहोर्याउने
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Global Progress Bar */}
        <div className="mt-6 pt-4 border-t border-slate-800/80 flex items-center gap-4">
          <div className="flex-1 h-2.5 bg-slate-800 rounded-full overflow-hidden flex">
            <div 
              className="bg-gradient-to-r from-emerald-500 to-teal-400 h-full transition-all duration-500"
              style={{ width: `${(knownCount / totalCardsCount) * 100}%` }}
              title={`कण्ठ भएको: ${knownCount}`}
            />
            <div 
              className="bg-amber-500 h-full transition-all duration-500"
              style={{ width: `${(dontKnowCount / totalCardsCount) * 100}%` }}
              title={`दोहोर्याउनु पर्ने: ${dontKnowCount}`}
            />
          </div>
          <span className="text-xs font-bold text-slate-300 shrink-0">
            {knownCount}/{totalCardsCount} पूरा
          </span>
        </div>
      </div>

      {/* Category Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-thin">
        {FLASHCARD_CATEGORIES.map(cat => (
          <button
            key={cat.id}
            type="button"
            onClick={() => setActiveCategory(cat.id)}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold shrink-0 transition-all cursor-pointer flex items-center gap-1.5 ${
              activeCategory === cat.id
                ? 'bg-sky-600 text-white shadow-md shadow-sky-600/20'
                : 'bg-white dark:bg-slate-900 text-slate-700 dark:text-[#FFFFFF] border border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
          >
            <span>{cat.labelNe}</span>
            <span className={`px-1.5 py-0.2 rounded-full text-[10px] ${
              activeCategory === cat.id ? 'bg-sky-700 text-white' : 'bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-300'
            }`}>
              {cat.count}
            </span>
          </button>
        ))}
      </div>

      {/* Sub-Filters: Learning Status + Controls */}
      <div className="flex flex-wrap items-center justify-between gap-3 p-3 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs">
        <div className="flex items-center gap-1.5 flex-wrap">
          <span className="text-slate-500 dark:text-[#FFFFFF] font-bold mr-1 flex items-center gap-1">
            <Filter className="w-3.5 h-3.5 text-[#38BDF8]" />
            अवस्था:
          </span>

          <button
            type="button"
            onClick={() => setStatusFilter('all')}
            className={`px-2.5 py-1 rounded-lg font-bold transition cursor-pointer ${
              statusFilter === 'all'
                ? 'bg-slate-900 dark:bg-white text-white dark:text-slate-950'
                : 'text-slate-600 dark:text-[#FFFFFF] hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
          >
            सबै ({filteredCards.length})
          </button>

          <button
            type="button"
            onClick={() => setStatusFilter('dont_know')}
            className={`px-2.5 py-1 rounded-lg font-bold transition cursor-pointer flex items-center gap-1 ${
              statusFilter === 'dont_know'
                ? 'bg-amber-500 text-slate-950 font-black'
                : 'text-amber-600 dark:text-amber-400 hover:bg-amber-50 dark:hover:bg-amber-950/40'
            }`}
          >
            <RotateCw className="w-3 h-3" />
            दोहोर्याउने ({dontKnowCount})
          </button>

          <button
            type="button"
            onClick={() => setStatusFilter('know')}
            className={`px-2.5 py-1 rounded-lg font-bold transition cursor-pointer flex items-center gap-1 ${
              statusFilter === 'know'
                ? 'bg-emerald-600 text-white font-black'
                : 'text-emerald-600 dark:text-emerald-400 hover:bg-emerald-50 dark:hover:bg-emerald-950/40'
            }`}
          >
            <CheckCircle2 className="w-3 h-3" />
            आउँछ ({knownCount})
          </button>

          <button
            type="button"
            onClick={() => setStatusFilter('unseen')}
            className={`px-2.5 py-1 rounded-lg font-bold transition cursor-pointer ${
              statusFilter === 'unseen'
                ? 'bg-sky-600 text-white font-black'
                : 'text-slate-600 dark:text-[#FFFFFF] hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
          >
            नयाँ ({totalCardsCount - knownCount - dontKnowCount})
          </button>
        </div>

        {/* Action Controls: Shuffle, Sound, Reset */}
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setSoundEnabled(prev => !prev)}
            className="p-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-[#FFFFFF] hover:bg-slate-200 transition cursor-pointer"
            title={soundEnabled ? 'आवाज चालु छ' : 'आवाज बन्द छ'}
          >
            {soundEnabled ? <Volume2 className="w-4 h-4 text-[#38BDF8]" /> : <VolumeX className="w-4 h-4 text-slate-400" />}
          </button>

          <button
            type="button"
            onClick={handleShuffle}
            className="p-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-[#FFFFFF] hover:bg-slate-200 transition cursor-pointer flex items-center gap-1 font-bold"
            title="कार्डहरू नयाँ क्रममा मिलाउनुहोस् (Shuffle)"
          >
            <Shuffle className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">फेर्नुहोस्</span>
          </button>

          <button
            type="button"
            onClick={handleResetProgress}
            className="p-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-[#FFFFFF] hover:bg-rose-100 dark:hover:bg-rose-950/50 hover:text-rose-600 transition cursor-pointer"
            title="सबै प्रगति रिसेट गर्नुहोस्"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Main Flashcard Card Stage */}
      {deck.length === 0 ? (
        <div className="p-12 text-center rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-4">
          <div className="w-16 h-16 rounded-2xl bg-amber-100 dark:bg-amber-950/50 text-amber-600 dark:text-amber-400 mx-auto flex items-center justify-center">
            <CheckCircle2 className="w-8 h-8" />
          </div>
          <h3 className="text-lg font-black text-slate-900 dark:text-[#FFFFFF]">
            यस फिल्टरमा कुनै पनि कार्ड बाँकी छैन!
          </h3>
          <p className="text-xs text-slate-500 dark:text-[#FFFFFF] max-w-md mx-auto">
            तपाईंले छान्नुभएको समूह वा अवस्थाका सबै कार्डहरू अभ्यास गरिसक्नुभयो। अन्य वर्ग छान्नुहोस् वा सबै कार्डहरू हेर्नुहोस्।
          </p>
          <button
            type="button"
            onClick={() => { setActiveCategory('all'); setStatusFilter('all'); }}
            className="px-6 py-2.5 rounded-xl bg-sky-600 text-white font-black text-xs hover:bg-sky-500 transition cursor-pointer"
          >
            सबै फ्ल्यासकार्डहरू हेर्नुहोस्
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          
          {/* Card Position Tracker */}
          <div className="flex items-center justify-between px-2 text-xs font-bold text-slate-500 dark:text-[#FFFFFF]">
            <span>
              कार्ड {currentIndex + 1} / {deck.length}
            </span>
            <div className="flex items-center gap-2">
              <span className="text-[11px] text-slate-400 hidden sm:inline">
                Space = Flip • ← = फेरि दोहोर्याउने • → = मलाई आउँछ
              </span>
            </div>
          </div>

          {/* Interactive Card with 3D Flip Transform */}
          <div 
            id="active-flashcard"
            onClick={handleFlip}
            className="w-full min-h-[380px] sm:min-h-[420px] rounded-3xl cursor-pointer select-none transition-all duration-300 relative group"
            style={{ perspective: '1200px' }}
          >
            <div 
              className={`w-full h-full rounded-3xl p-6 sm:p-8 flex flex-col justify-between transition-all duration-500 shadow-xl border ${
                isFlipped
                  ? 'bg-slate-900 border-sky-500/50 shadow-sky-500/10'
                  : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 hover:border-sky-400 dark:hover:border-sky-600'
              }`}
            >
              
              {/* Card Top: Badges & Act Citations */}
              <div>
                <div className="flex items-center justify-between gap-2 flex-wrap pb-4 border-b border-slate-100 dark:border-slate-800">
                  <div className="flex items-center gap-2">
                    <span className="px-3 py-1 rounded-full bg-sky-100 dark:bg-sky-950/80 text-sky-800 dark:text-[#38BDF8] border border-sky-300 dark:border-sky-700/60 text-xs font-black">
                      {currentCard?.categoryLabelNe}
                    </span>
                    {currentCard?.actRef && (
                      <span className="px-2.5 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-[#FFFFFF] text-[11px] font-bold border border-slate-200 dark:border-slate-700 truncate max-w-xs">
                        {currentCard.actRef}
                      </span>
                    )}
                  </div>

                  <div className="flex items-center gap-2">
                    {/* Status Badge */}
                    {currentStatus === 'know' && (
                      <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-[#4ADE80] border border-emerald-500/40 text-xs font-black flex items-center gap-1">
                        <Check className="w-3 h-3" /> मलाई आउँछ
                      </span>
                    )}
                    {currentStatus === 'dont_know' && (
                      <span className="px-2.5 py-0.5 rounded-full bg-amber-500/20 text-[#FBBF24] border border-amber-500/40 text-xs font-black flex items-center gap-1">
                        <RotateCw className="w-3 h-3" /> दोहोर्याउने
                      </span>
                    )}

                    {/* Audio TTS Speak */}
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        if (currentCard) {
                          const textToRead = isFlipped
                            ? `${currentCard.termNe}। ${currentCard.definitionNe}`
                            : currentCard.termNe;
                          speakText(textToRead);
                        }
                      }}
                      className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-[#FFFFFF] transition cursor-pointer"
                      title="उच्चारण र परिभाषा सुन्नुहोस्"
                    >
                      <Volume2 className={`w-4 h-4 ${isPlayingTts ? 'text-[#38BDF8] animate-pulse' : 'text-slate-400 dark:text-[#FFFFFF]'}`} />
                    </button>

                    {/* Bookmark Law Article / Note */}
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        if (currentCard) {
                          const isLaw = Boolean(currentCard.actRef || currentCard.category === 'legal' || currentCard.categoryLabelNe?.includes('ऐन'));
                          const type = isLaw ? 'law-article' : 'note';
                          const title = `${currentCard.termNe} - ${currentCard.termEn || currentCard.actRef || ''}`;
                          const added = toggleBookmark(type, currentCard.id, title, currentCard.categoryLabelNe || 'कानुन र ऐन');
                          addToast(
                            added ? 'सामग्री सुरक्षित गरियो (Bookmarked)' : 'बुकमार्कबाट हटाइयो',
                            added ? 'success' : 'info'
                          );
                        }
                      }}
                      className={`p-2 rounded-xl transition cursor-pointer ${
                        currentCard && (isBookmarked('law-article', currentCard.id) || isBookmarked('law', currentCard.id) || isBookmarked('note', currentCard.id))
                          ? 'bg-amber-500/20 text-amber-400 border border-amber-500/40'
                          : 'bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-500 dark:text-[#FFFFFF]'
                      }`}
                      title="सुरक्षित संग्रहमा राख्नुहोस् (Bookmark Article)"
                    >
                      <Bookmark className={`w-4 h-4 ${
                        currentCard && (isBookmarked('law-article', currentCard.id) || isBookmarked('law', currentCard.id) || isBookmarked('note', currentCard.id))
                          ? 'fill-amber-400 text-amber-400'
                          : 'text-slate-400 dark:text-[#FFFFFF]'
                      }`} />
                    </button>
                  </div>
                </div>

                {/* Card Body Front vs Back */}
                {!isFlipped ? (
                  /* FRONT: TERM & CONCEPT */
                  <div className="py-12 sm:py-16 text-center space-y-4">
                    <span className="text-xs font-black uppercase tracking-widest text-sky-600 dark:text-[#38BDF8] block">
                      {currentCard?.sectionRef || 'प्रमुख अवधारणा'}
                    </span>
                    <h2 className="text-2xl sm:text-4xl font-black text-slate-900 dark:text-[#FFFFFF] tracking-tight leading-snug">
                      {currentCard?.termNe}
                    </h2>
                    <p className="text-sm sm:text-base font-semibold text-slate-500 dark:text-[#FFFFFF]">
                      {currentCard?.termEn}
                    </p>
                    
                    <div className="pt-6">
                      <span className="inline-flex items-center gap-2 px-4 py-2 rounded-2xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-[#FFFFFF] text-xs font-bold group-hover:scale-105 transition-transform shadow-xs">
                        <RotateCw className="w-3.5 h-3.5 text-[#38BDF8]" />
                        <span>अर्थ र कानुनी परिभाषा हेर्न थिच्नुहोस् (Click to Flip)</span>
                      </span>
                    </div>
                  </div>
                ) : (
                  /* BACK: COMPLETE DEFINITION, KEY POINTS & MNEMONIC */
                  <div className="py-4 space-y-4 text-left">
                    <div>
                      <div className="flex items-center justify-between">
                        <h3 className="text-lg sm:text-xl font-black text-[#FFFFFF] flex items-center gap-2">
                          <BookOpen className="w-5 h-5 text-[#38BDF8]" />
                          <span>{currentCard?.termNe}</span>
                        </h3>
                        <span className="text-xs font-bold text-[#FBBF24]">
                          {currentCard?.sectionRef}
                        </span>
                      </div>
                      <p className="text-xs text-slate-400 font-medium">
                        {currentCard?.termEn}
                      </p>
                    </div>

                    {/* Definition in Pure High Contrast */}
                    <div className="p-4 rounded-2xl bg-slate-800/80 border border-slate-700/80">
                      <span className="text-[11px] font-black uppercase tracking-wider text-[#38BDF8] block mb-1">
                        आधिकारिक कानुनी परिभाषा (Official Definition):
                      </span>
                      <p className="text-sm sm:text-base font-medium text-[#FFFFFF] leading-relaxed">
                        {currentCard?.definitionNe}
                      </p>
                      {currentCard?.definitionEn && (
                        <p className="text-xs text-slate-300 dark:text-[#FFFFFF] mt-2 italic leading-relaxed border-t border-slate-700/60 pt-2">
                          {currentCard.definitionEn}
                        </p>
                      )}
                    </div>

                    {/* Key Elements / Exam Points */}
                    {currentCard?.keyPointsNe && currentCard.keyPointsNe.length > 0 && (
                      <div className="space-y-1.5">
                        <span className="text-[11px] font-bold text-slate-300 block">
                          महत्वपूर्ण बुँदाहरू (Key Highlights):
                        </span>
                        <div className="grid grid-cols-1 gap-1.5">
                          {currentCard.keyPointsNe.map((point, pIdx) => (
                            <div key={pIdx} className="flex items-start gap-2 text-xs text-[#FFFFFF]">
                              <CheckCircle2 className="w-3.5 h-3.5 text-[#4ADE80] shrink-0 mt-0.5" />
                              <span>{point}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Memory Mnemonic / सूत्र */}
                    {currentCard?.memoryMnemonicNe && (
                      <div className="p-2.5 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-200 text-xs font-bold flex items-center gap-2">
                        <Flame className="w-4 h-4 text-amber-400 shrink-0" />
                        <span>{currentCard.memoryMnemonicNe}</span>
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Card Footer: Flip Instruction */}
              <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs text-slate-500 dark:text-[#FFFFFF]">
                <span className="flex items-center gap-1 font-semibold">
                  <Info className="w-3.5 h-3.5 text-[#38BDF8]" />
                  <span>{isFlipped ? 'अगाडि फर्किन थिच्नुहोस्' : 'पछाडि पल्टाउन थिच्नुहोस्'}</span>
                </span>
                <span className="font-bold text-slate-400">
                  {currentCard?.difficulty || 'Medium'} Level
                </span>
              </div>

            </div>
          </div>

          {/* Action Decision Toolbar: Don't Know vs Know */}
          <div className="grid grid-cols-2 gap-4 pt-2">
            <button
              type="button"
              id="flashcard-btn-dont-know"
              onClick={(e) => {
                e.stopPropagation();
                handleMarkDontKnow();
              }}
              className="py-4 px-6 rounded-2xl bg-amber-500 hover:bg-amber-400 active:scale-95 text-slate-950 font-black text-sm sm:text-base flex items-center justify-center gap-2.5 transition-all shadow-lg shadow-amber-500/20 cursor-pointer"
            >
              <RotateCw className="w-5 h-5 text-slate-950" />
              <span>फेरि दोहोर्याउने (Don't Know)</span>
            </button>

            <button
              type="button"
              id="flashcard-btn-know"
              onClick={(e) => {
                e.stopPropagation();
                handleMarkKnow();
              }}
              className="py-4 px-6 rounded-2xl bg-emerald-600 hover:bg-emerald-500 active:scale-95 text-white font-black text-sm sm:text-base flex items-center justify-center gap-2.5 transition-all shadow-lg shadow-emerald-600/20 cursor-pointer"
            >
              <CheckCircle2 className="w-5 h-5 text-white" />
              <span>मलाई आउँछ (Know)</span>
            </button>
          </div>

          {/* Navigation Prev / Next controls */}
          <div className="flex items-center justify-between pt-2">
            <button
              type="button"
              id="flashcard-prev-btn"
              onClick={handlePrev}
              className="px-4 py-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-[#FFFFFF] text-xs font-bold hover:bg-slate-100 dark:hover:bg-slate-800 transition cursor-pointer flex items-center gap-1.5"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>अघिल्लो (Previous)</span>
            </button>

            <button
              type="button"
              onClick={handleFlip}
              className="px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-[#FFFFFF] text-xs font-bold hover:bg-slate-200 dark:hover:bg-slate-700 transition cursor-pointer flex items-center gap-1.5"
            >
              <RotateCw className="w-3.5 h-3.5 text-[#38BDF8]" />
              <span>पल्टाउनुहोस् (Flip)</span>
            </button>

            <button
              type="button"
              id="flashcard-next-btn"
              onClick={handleNext}
              className="px-4 py-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-[#FFFFFF] text-xs font-bold hover:bg-slate-100 dark:hover:bg-slate-800 transition cursor-pointer flex items-center gap-1.5"
            >
              <span>पछिल्लो (Next)</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

        </div>
      )}

      {/* Spaced Repetition Practice Recommendations Banner */}
      <div className="p-4 sm:p-5 rounded-2xl bg-sky-50/80 dark:bg-sky-950/30 border border-sky-200 dark:border-sky-800/60 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="px-2 py-0.5 rounded-full bg-sky-500 text-white font-black text-[10px]">
              वैज्ञानिक सुझाव
            </span>
            <h4 className="text-xs sm:text-sm font-black text-slate-900 dark:text-white">
              स्पेसड रिपिटिसन (Spaced Repetition) पद्धतिबाट स्मरण शक्ति बढाउनुहोस्
            </h4>
          </div>
          <p className="text-xs text-slate-600 dark:text-[#FFFFFF] leading-relaxed">
            जुन कार्डहरूमा तपाईंले <strong>"फेरि दोहोर्याउने"</strong> थिच्नुभएको छ, तिनलाई हरेक दिन बिहान एकपटक समीक्षा गर्दा परीक्षासम्म ९५% भन्दा बढी कण्ठ रहन्छ।
          </p>
        </div>

        {dontKnowCount > 0 && (
          <button
            type="button"
            onClick={() => setStatusFilter('dont_know')}
            className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs shrink-0 transition cursor-pointer shadow-xs"
          >
            दोहोर्याउने {dontKnowCount} कार्डहरू मात्र पढ्नुहोस्
          </button>
        )}
      </div>

    </div>
  );
};

export default FlashcardEngine;
