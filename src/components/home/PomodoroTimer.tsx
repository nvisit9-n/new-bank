import React, { useState, useEffect, useRef } from 'react';
import { 
  Play, 
  Pause, 
  RotateCcw, 
  SkipForward, 
  Coffee, 
  Brain, 
  Award, 
  Volume2, 
  VolumeX, 
  ChevronDown, 
  ChevronUp, 
  Sparkles, 
  Flame, 
  BookOpen, 
  Plus, 
  Minus,
  CheckCircle2
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

export type PomodoroMode = 'focus' | 'shortBreak' | 'longBreak';

const SUBJECT_OPTIONS = [
  'बैंकिङ सिद्धान्त तथा अभ्यास (Banking Concepts)',
  'ऐन, कानुन तथा निर्देशिकाहरू (Acts & Laws / BAFIA)',
  'व्यवस्थापन, मानव संशाधन & IT (Management)',
  'अर्थशास्त्र तथा मौद्रिक नीति (Economics & Monetary Policy)',
  'लेखा तथा वित्तीय विश्लेषण (Accounting & Auditing)',
  'समसामयिक & सामान्य ज्ञान (Current Affairs / GK)',
  'लिखित परीक्षा उत्तरपुस्तिका लेखन (Written Answer Writing)'
];

const PRESET_DURATIONS: Record<PomodoroMode, number[]> = {
  focus: [25, 45, 50, 60],
  shortBreak: [5, 10],
  longBreak: [15, 20, 30]
};

// Play a pleasant Web Audio synthesizer chime when interval finishes
function playChimeAlert(enabled: boolean, isBreak: boolean) {
  if (!enabled || typeof window === 'undefined') return;
  try {
    const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
    if (!AudioContextClass) return;
    const ctx = new AudioContextClass();

    const notes = isBreak ? [440, 554.37, 659.25] : [587.33, 739.99, 880]; // A major or D major chord
    notes.forEach((freq, idx) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, ctx.currentTime + idx * 0.12);

      gain.gain.setValueAtTime(0, ctx.currentTime + idx * 0.12);
      gain.gain.linearRampToValueAtTime(0.18, ctx.currentTime + idx * 0.12 + 0.04);
      gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + idx * 0.12 + 0.8);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(ctx.currentTime + idx * 0.12);
      osc.stop(ctx.currentTime + idx * 0.12 + 0.85);
    });
  } catch (err) {
    // Audio context fallback
  }
}

export const PomodoroTimer: React.FC = () => {
  const { addToast } = useApp();

  const [mode, setMode] = useState<PomodoroMode>('focus');
  const [selectedDurationMinutes, setSelectedDurationMinutes] = useState<number>(25);
  const [timeLeftSeconds, setTimeLeftSeconds] = useState<number>(25 * 60);
  const [isRunning, setIsRunning] = useState<boolean>(false);
  const [cyclesCompleted, setCyclesCompleted] = useState<number>(0);
  const [selectedSubject, setSelectedSubject] = useState<string>(SUBJECT_OPTIONS[0]);
  const [soundEnabled, setSoundEnabled] = useState<boolean>(true);
  const [isExpanded, setIsExpanded] = useState<boolean>(true);

  // Today's Focus Stats from localStorage
  const [todayFocusMinutes, setTodayFocusMinutes] = useState<number>(() => {
    try {
      const todayStr = new Date().toISOString().slice(0, 10);
      const saved = localStorage.getItem(`pomodoro_focus_${todayStr}`);
      return saved ? parseInt(saved, 10) : 0;
    } catch {
      return 0;
    }
  });

  const [todaySessionsCount, setTodaySessionsCount] = useState<number>(() => {
    try {
      const todayStr = new Date().toISOString().slice(0, 10);
      const saved = localStorage.getItem(`pomodoro_sessions_${todayStr}`);
      return saved ? parseInt(saved, 10) : 0;
    } catch {
      return 0;
    }
  });

  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Synchronize initial duration when mode changes
  const switchMode = (newMode: PomodoroMode, customMinutes?: number) => {
    setIsRunning(false);
    if (timerRef.current) clearInterval(timerRef.current);

    const minutes = customMinutes || (newMode === 'focus' ? 25 : newMode === 'shortBreak' ? 5 : 15);
    setMode(newMode);
    setSelectedDurationMinutes(minutes);
    setTimeLeftSeconds(minutes * 60);
  };

  // Timer Tick Engine
  useEffect(() => {
    if (isRunning) {
      timerRef.current = setInterval(() => {
        setTimeLeftSeconds(prev => {
          if (prev <= 1) {
            clearInterval(timerRef.current!);
            handleIntervalComplete();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } else {
      if (timerRef.current) clearInterval(timerRef.current);
    }

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isRunning, mode, selectedDurationMinutes]);

  // When interval hits 00:00
  const handleIntervalComplete = () => {
    setIsRunning(false);

    if (mode === 'focus') {
      const newCycles = cyclesCompleted + 1;
      setCyclesCompleted(newCycles);

      // Save focus minutes to daily storage
      const addedMinutes = selectedDurationMinutes;
      const todayStr = new Date().toISOString().slice(0, 10);
      const nextTotalMinutes = todayFocusMinutes + addedMinutes;
      const nextTotalSessions = todaySessionsCount + 1;

      setTodayFocusMinutes(nextTotalMinutes);
      setTodaySessionsCount(nextTotalSessions);

      try {
        localStorage.setItem(`pomodoro_focus_${todayStr}`, String(nextTotalMinutes));
        localStorage.setItem(`pomodoro_sessions_${todayStr}`, String(nextTotalSessions));
      } catch {
        // Fallback
      }

      playChimeAlert(soundEnabled, false);
      addToast(`🎉 बधाई छ! ${addedMinutes} मिनेट एकाग्र अध्ययन पूरा भयो (+१५ XP)`, 'success');

      // Auto propose next break
      if (newCycles % 4 === 0) {
        switchMode('longBreak', 15);
        addToast('४ वटा सत्र सम्पन्न भयो! १५ मिनेट लामो विश्राम लिनुहोस्।', 'info');
      } else {
        switchMode('shortBreak', 5);
        addToast('५ मिनेट छोटो विश्राम लिनुहोस् र पानी पिउनुहोस्।', 'info');
      }
    } else {
      // Break completed
      playChimeAlert(soundEnabled, true);
      addToast('विश्राम समाप्त भयो! पुनः एकाग्र भई अध्ययन सुरु गर्नुहोस्।', 'info');
      switchMode('focus', 25);
    }
  };

  const toggleStartPause = () => {
    setIsRunning(prev => !prev);
  };

  const handleReset = () => {
    setIsRunning(false);
    setTimeLeftSeconds(selectedDurationMinutes * 60);
  };

  const handleSkip = () => {
    if (mode === 'focus') {
      switchMode('shortBreak', 5);
    } else {
      switchMode('focus', 25);
    }
  };

  const handleAdjustMinutes = (delta: number) => {
    if (isRunning) return;
    const newMin = Math.max(1, Math.min(120, selectedDurationMinutes + delta));
    setSelectedDurationMinutes(newMin);
    setTimeLeftSeconds(newMin * 60);
  };

  const minutes = Math.floor(timeLeftSeconds / 60);
  const seconds = timeLeftSeconds % 60;
  const formattedTime = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;

  const totalDurationSeconds = selectedDurationMinutes * 60;
  const progressPercent = Math.min(100, Math.max(0, ((totalDurationSeconds - timeLeftSeconds) / totalDurationSeconds) * 100));

  return (
    <div 
      id="pomodoro-study-timer"
      className="p-5 sm:p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs transition-all text-slate-900 dark:text-[#FFFFFF]"
    >
      {/* Header bar */}
      <div className="flex items-center justify-between gap-3 pb-3 border-b border-slate-100 dark:border-slate-800">
        <div className="flex items-center gap-3">
          <div className={`w-10 h-10 rounded-2xl flex items-center justify-center shrink-0 shadow-xs font-bold ${
            mode === 'focus' 
              ? 'bg-gradient-to-tr from-amber-500 to-orange-500 text-slate-950 shadow-amber-500/20'
              : 'bg-gradient-to-tr from-emerald-500 to-teal-500 text-slate-950 shadow-emerald-500/20'
          }`}>
            {mode === 'focus' ? <Brain className="w-5 h-5 text-slate-950" /> : <Coffee className="w-5 h-5 text-slate-950" />}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-base font-black text-slate-900 dark:text-[#FFFFFF]">
                पोमोडोरो अध्ययन टाइमर (Pomodoro Study Timer)
              </h3>
              <span className={`px-2 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider ${
                mode === 'focus'
                  ? 'bg-amber-100 dark:bg-amber-950/80 text-amber-800 dark:text-[#FBBF24] border border-amber-300 dark:border-amber-700/60'
                  : 'bg-emerald-100 dark:bg-emerald-950/80 text-emerald-800 dark:text-[#4ADE80] border border-emerald-300 dark:border-emerald-700/60'
              }`}>
                {mode === 'focus' ? 'एकाग्र सत्र (Focus)' : mode === 'shortBreak' ? 'छोटो विश्राम' : 'लामो विश्राम'}
              </span>
            </div>
            <p className="text-xs text-slate-500 dark:text-[#FFFFFF] mt-0.5">
              लोकसेवा तथा बैंकिङ परीक्षा तयारीका लागि वैज्ञानिक एकाग्रता प्रणाली • २५/५ मिनेट चक्र
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* Audio toggle */}
          <button
            type="button"
            id="pomodoro-sound-toggle-btn"
            onClick={() => setSoundEnabled(prev => !prev)}
            className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-[#FFFFFF] transition cursor-pointer"
            title={soundEnabled ? 'ध्वनि सूचना चालु छ' : 'ध्वनि सूचना बन्द छ'}
          >
            {soundEnabled ? <Volume2 className="w-4 h-4 text-[#38BDF8]" /> : <VolumeX className="w-4 h-4 text-slate-400" />}
          </button>

          {/* Expand/Collapse Toggle */}
          <button
            type="button"
            id="pomodoro-expand-toggle-btn"
            onClick={() => setIsExpanded(prev => !prev)}
            className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-[#FFFFFF] transition cursor-pointer"
            title={isExpanded ? 'संक्षिप्त गर्नुहोस्' : 'विस्तृत गर्नुहोस्'}
          >
            {isExpanded ? <ChevronUp className="w-4 h-4 text-slate-500 dark:text-[#FFFFFF]" /> : <ChevronDown className="w-4 h-4 text-slate-500 dark:text-[#FFFFFF]" />}
          </button>
        </div>
      </div>

      {isExpanded && (
        <div className="mt-4 space-y-5">
          {/* Mode Selector Tabs (Focus, Short Break, Long Break) */}
          <div className="grid grid-cols-3 gap-2 p-1 rounded-2xl bg-slate-100 dark:bg-slate-800/90 border border-slate-200 dark:border-slate-700">
            <button
              type="button"
              id="pomodoro-mode-focus-btn"
              onClick={() => switchMode('focus', 25)}
              className={`py-2 px-3 rounded-xl text-xs font-black flex items-center justify-center gap-1.5 transition cursor-pointer ${
                mode === 'focus'
                  ? 'bg-white dark:bg-slate-900 text-amber-600 dark:text-[#FBBF24] shadow-xs'
                  : 'text-slate-600 dark:text-[#FFFFFF] hover:text-slate-900'
              }`}
            >
              <Brain className="w-3.5 h-3.5" />
              <span>अध्ययन (Focus)</span>
            </button>

            <button
              type="button"
              id="pomodoro-mode-short-break-btn"
              onClick={() => switchMode('shortBreak', 5)}
              className={`py-2 px-3 rounded-xl text-xs font-black flex items-center justify-center gap-1.5 transition cursor-pointer ${
                mode === 'shortBreak'
                  ? 'bg-white dark:bg-slate-900 text-emerald-600 dark:text-[#4ADE80] shadow-xs'
                  : 'text-slate-600 dark:text-[#FFFFFF] hover:text-slate-900'
              }`}
            >
              <Coffee className="w-3.5 h-3.5" />
              <span>छोटो विश्राम (5m)</span>
            </button>

            <button
              type="button"
              id="pomodoro-mode-long-break-btn"
              onClick={() => switchMode('longBreak', 15)}
              className={`py-2 px-3 rounded-xl text-xs font-black flex items-center justify-center gap-1.5 transition cursor-pointer ${
                mode === 'longBreak'
                  ? 'bg-white dark:bg-slate-900 text-sky-600 dark:text-[#38BDF8] shadow-xs'
                  : 'text-slate-600 dark:text-[#FFFFFF] hover:text-slate-900'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>लामो विश्राम (15m)</span>
            </button>
          </div>

          {/* Subject Focus Selector */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 bg-slate-50 dark:bg-slate-800/60 p-3 rounded-2xl border border-slate-200/80 dark:border-slate-800">
            <div className="flex items-center gap-2 text-xs font-bold text-slate-700 dark:text-[#FFFFFF]">
              <BookOpen className="w-4 h-4 text-[#38BDF8]" />
              <span>अहिले पढ्ने विषय (Study Subject):</span>
            </div>
            <select
              id="pomodoro-subject-select"
              value={selectedSubject}
              onChange={(e) => setSelectedSubject(e.target.value)}
              className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-[#FFFFFF] text-xs rounded-xl px-3 py-1.5 font-bold focus:ring-2 focus:ring-amber-500 outline-none max-w-full sm:max-w-xs cursor-pointer shadow-xs"
            >
              {SUBJECT_OPTIONS.map((subj, idx) => (
                <option key={idx} value={subj} className="bg-white dark:bg-slate-900 text-slate-900 dark:text-[#FFFFFF]">
                  {subj}
                </option>
              ))}
            </select>
          </div>

          {/* Core Timer Countdown Display & Progress Ring/Bar */}
          <div className="py-6 px-4 rounded-3xl bg-slate-50 dark:bg-slate-850/60 border border-slate-200/80 dark:border-slate-800 flex flex-col items-center justify-center relative overflow-hidden">
            
            {/* Visual Progress Bar */}
            <div className="w-full max-w-md h-2 bg-slate-200 dark:bg-slate-800 rounded-full overflow-hidden mb-6">
              <div 
                className={`h-full rounded-full transition-all duration-1000 ${
                  mode === 'focus'
                    ? 'bg-gradient-to-r from-amber-500 to-orange-500'
                    : 'bg-gradient-to-r from-emerald-500 to-teal-400'
                }`}
                style={{ width: `${progressPercent}%` }}
              />
            </div>

            {/* Time Digits with Ultra-high contrast */}
            <div className="text-6xl sm:text-7xl font-mono font-black tracking-tight text-slate-950 dark:text-[#FFFFFF] drop-shadow-sm select-none">
              {formattedTime}
            </div>

            {/* Subtitle: subject & cycle */}
            <div className="mt-3 flex items-center gap-3 text-xs font-bold text-slate-600 dark:text-[#FFFFFF] flex-wrap justify-center">
              <span className="flex items-center gap-1 text-amber-600 dark:text-[#FBBF24]">
                <Flame className="w-3.5 h-3.5 fill-current" />
                <span>चक्र {(cyclesCompleted % 4) + 1} / ४</span>
              </span>
              <span>•</span>
              <span className="truncate max-w-xs">{selectedSubject}</span>
            </div>

            {/* Duration Adjustment Buttons when paused */}
            {!isRunning && (
              <div className="mt-4 flex items-center gap-2">
                <span className="text-xs text-slate-500 dark:text-[#FFFFFF] font-bold">समय अवधि:</span>
                <button
                  type="button"
                  id="pomodoro-minus-5-btn"
                  onClick={() => handleAdjustMinutes(-5)}
                  disabled={selectedDurationMinutes <= 5}
                  className="p-1.5 rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-[#FFFFFF] hover:bg-slate-100 dark:hover:bg-slate-700 disabled:opacity-40 transition cursor-pointer"
                  title="५ मिनेट घटाउनुहोस्"
                >
                  <Minus className="w-3.5 h-3.5" />
                </button>

                {PRESET_DURATIONS[mode].map((mins) => (
                  <button
                    key={mins}
                    type="button"
                    onClick={() => switchMode(mode, mins)}
                    className={`px-2.5 py-1 rounded-lg text-xs font-bold border transition cursor-pointer ${
                      selectedDurationMinutes === mins
                        ? 'bg-slate-900 dark:bg-white text-white dark:text-slate-950 border-transparent shadow-xs'
                        : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-[#FFFFFF] border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-700'
                    }`}
                  >
                    {mins}m
                  </button>
                ))}

                <button
                  type="button"
                  id="pomodoro-plus-5-btn"
                  onClick={() => handleAdjustMinutes(5)}
                  disabled={selectedDurationMinutes >= 90}
                  className="p-1.5 rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-[#FFFFFF] hover:bg-slate-100 dark:hover:bg-slate-700 disabled:opacity-40 transition cursor-pointer"
                  title="५ मिनेट थप्नुहोस्"
                >
                  <Plus className="w-3.5 h-3.5" />
                </button>
              </div>
            )}

            {/* Play / Pause / Reset / Skip Controls */}
            <div className="mt-6 flex items-center gap-3">
              <button
                type="button"
                id="pomodoro-reset-btn"
                onClick={handleReset}
                className="p-3.5 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-[#FFFFFF] hover:bg-slate-100 dark:hover:bg-slate-700 transition cursor-pointer shadow-xs"
                title="रिसेट गर्नुहोस् (Reset)"
              >
                <RotateCcw className="w-5 h-5" />
              </button>

              <button
                type="button"
                id="pomodoro-start-pause-btn"
                onClick={toggleStartPause}
                className={`min-w-[150px] min-h-[48px] px-8 py-3.5 rounded-2xl font-black text-sm flex items-center justify-center gap-2.5 transition cursor-pointer shadow-md active:scale-95 ${
                  isRunning
                    ? 'bg-rose-600 hover:bg-rose-500 text-white shadow-rose-600/30'
                    : mode === 'focus'
                    ? 'bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-slate-950 shadow-amber-500/30'
                    : 'bg-gradient-to-r from-emerald-500 to-teal-400 hover:from-emerald-400 hover:to-teal-300 text-slate-950 shadow-emerald-500/30'
                }`}
              >
                {isRunning ? (
                  <>
                    <Pause className="w-5 h-5 fill-current" />
                    <span>रोक्नुहोस् (Pause)</span>
                  </>
                ) : (
                  <>
                    <Play className="w-5 h-5 fill-current" />
                    <span>सुरु गर्नुहोस् (Start)</span>
                  </>
                )}
              </button>

              <button
                type="button"
                id="pomodoro-skip-btn"
                onClick={handleSkip}
                className="p-3.5 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-[#FFFFFF] hover:bg-slate-100 dark:hover:bg-slate-700 transition cursor-pointer shadow-xs"
                title="अघिल्लो सत्रमा जानुहोस् (Skip)"
              >
                <SkipForward className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Today's Focus Stats Banner */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 text-xs">
            <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-800">
              <span className="text-[10px] font-bold text-slate-500 dark:text-[#FFFFFF] uppercase tracking-wider block">आजको कुल एकाग्रता</span>
              <p className="text-lg font-black text-slate-900 dark:text-[#FFFFFF] mt-0.5">
                {todayFocusMinutes} <span className="text-xs font-semibold text-slate-400">मिनेट</span>
              </p>
            </div>

            <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-800">
              <span className="text-[10px] font-bold text-slate-500 dark:text-[#FFFFFF] uppercase tracking-wider block">सम्पन्न सत्रहरू</span>
              <p className="text-lg font-black text-slate-900 dark:text-[#FFFFFF] mt-0.5">
                {todaySessionsCount} <span className="text-xs font-semibold text-slate-400">सत्र</span>
              </p>
            </div>

            <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-800">
              <span className="text-[10px] font-bold text-slate-500 dark:text-[#FFFFFF] uppercase tracking-wider block">अध्ययन चक्र</span>
              <p className="text-lg font-black text-amber-600 dark:text-[#FBBF24] mt-0.5">
                चक्र {(cyclesCompleted % 4) + 1} <span className="text-xs font-semibold text-slate-400">/ ४</span>
              </p>
            </div>

            <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-800">
              <span className="text-[10px] font-bold text-slate-500 dark:text-[#FFFFFF] uppercase tracking-wider block">XP उपलब्धि</span>
              <p className="text-lg font-black text-emerald-600 dark:text-[#4ADE80] mt-0.5 flex items-center gap-1">
                <Award className="w-4 h-4 text-[#4ADE80]" />
                +{todaySessionsCount * 15} XP
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PomodoroTimer;
