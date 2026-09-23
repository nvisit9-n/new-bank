import React, { useState } from 'react';
import { Mic, MicOff, Volume2, Globe, X } from 'lucide-react';
import { useVoiceSearch } from '../../hooks/useVoiceSearch';
import { useApp } from '../../context/AppContext';

export interface VoiceSearchButtonProps {
  onTranscript: (transcript: string) => void;
  onInterim?: (interim: string) => void;
  className?: string;
  size?: 'sm' | 'md' | 'lg';
  darkBackground?: boolean;
  showInlineStatus?: boolean;
  disabled?: boolean;
  tooltipText?: string;
}

export const VoiceSearchButton: React.FC<VoiceSearchButtonProps> = ({
  onTranscript,
  onInterim,
  className = '',
  size = 'md',
  darkBackground = false,
  showInlineStatus = true,
  disabled = false,
  tooltipText = 'आवाजद्वारा खोज्नुहोस् (Voice Search)'
}) => {
  const { addToast } = useApp();
  const [showLangMenu, setShowLangMenu] = useState(false);

  const {
    isListening,
    interimTranscript,
    isSupported,
    language,
    setLanguage,
    toggleListening,
    stopListening
  } = useVoiceSearch({
    defaultLanguage: 'ne-NP',
    onResult: (text) => {
      onTranscript(text);
      addToast(`🎤 आवाजबाट खोजियो: "${text}"`, 'info');
    },
    onInterim: (text) => {
      if (onInterim) onInterim(text);
    },
    onError: (err) => {
      addToast(err, 'error');
    }
  });

  const handleToggle = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (!isSupported) {
      addToast('तपाईँको ब्राउजरमा Web Speech API उपलब्ध छैन। कृपया Chrome वा Edge प्रयोग गर्नुहोस्।', 'error');
      return;
    }

    toggleListening();
  };

  const handleLanguageSwitch = (e: React.MouseEvent, newLang: 'ne-NP' | 'en-US') => {
    e.preventDefault();
    e.stopPropagation();
    setLanguage(newLang);
    setShowLangMenu(false);
    addToast(newLang === 'ne-NP' ? 'भाषा: नेपाली' : 'Language: English', 'info');
  };

  // Sizing definitions
  const sizeClasses = {
    sm: 'w-7 h-7 text-xs',
    md: 'w-8 h-8 text-sm',
    lg: 'w-10 h-10 text-base'
  }[size];

  const iconSizes = {
    sm: 'w-3.5 h-3.5',
    md: 'w-4 h-4',
    lg: 'w-5 h-5'
  }[size];

  return (
    <div className={`relative inline-flex items-center ${className}`}>
      {/* Microphone Trigger Button */}
      <button
        type="button"
        onClick={handleToggle}
        disabled={disabled}
        aria-label={tooltipText}
        title={isListening ? 'रोक्न थिच्नुहोस् (Click to stop)' : tooltipText}
        className={`relative flex items-center justify-center rounded-xl transition-all cursor-pointer select-none ${sizeClasses} ${
          isListening
            ? 'bg-rose-500 text-white shadow-lg shadow-rose-500/30 ring-2 ring-rose-400 ring-offset-1 dark:ring-offset-slate-900 animate-pulse'
            : darkBackground
            ? 'bg-slate-800/90 text-slate-300 hover:text-sky-300 hover:bg-slate-700/90 border border-slate-700/80'
            : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:text-sky-600 dark:hover:text-sky-400 hover:bg-slate-200 dark:hover:bg-slate-700 border border-slate-200/80 dark:border-slate-700/80'
        } ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
      >
        {isListening ? (
          <>
            <Mic className={`${iconSizes} animate-bounce`} />
            <span className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-rose-400 animate-ping" />
          </>
        ) : (
          <Mic className={iconSizes} />
        )}
      </button>

      {/* Floating Active Speech Banner / Status Toast */}
      {isListening && showInlineStatus && (
        <div 
          className="fixed bottom-20 left-1/2 -translate-x-1/2 sm:absolute sm:bottom-auto sm:top-full sm:left-auto sm:right-0 sm:translate-x-0 mt-3 z-50 min-w-[280px] max-w-[90vw] sm:max-w-md p-3 rounded-2xl bg-[#0F172A] border border-sky-500/50 shadow-2xl text-white animate-fadeIn flex flex-col gap-2 backdrop-blur-md"
        >
          {/* Header Bar */}
          <div className="flex items-center justify-between gap-2 border-b border-slate-800 pb-2">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-rose-500 animate-ping" />
              <span className="text-xs font-black text-white flex items-center gap-1.5">
                <Volume2 className="w-3.5 h-3.5 text-sky-400" />
                सुन्दैछ... प्रस्ट बोल्नुहोस्
              </span>
            </div>

            {/* Language & Stop controls */}
            <div className="flex items-center gap-1.5">
              <button
                type="button"
                onClick={(e) => handleLanguageSwitch(e, language === 'ne-NP' ? 'en-US' : 'ne-NP')}
                className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-slate-800 hover:bg-slate-700 text-sky-300 border border-slate-700 transition flex items-center gap-1 cursor-pointer"
                title="भाषा परिवर्तन गर्नुहोस् (Switch language)"
              >
                <Globe className="w-2.5 h-2.5" />
                <span>{language === 'ne-NP' ? 'नेपाली' : 'English'}</span>
              </button>

              <button
                type="button"
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  stopListening();
                }}
                className="p-1 rounded-md text-slate-400 hover:text-white hover:bg-slate-800 transition cursor-pointer"
                title="बन्द गर्नुहोस् (Cancel)"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Real-time Spoken Transcript or Prompt */}
          <div className="text-xs text-slate-200 py-1 min-h-[32px] flex items-center">
            {interimTranscript ? (
              <span className="font-medium text-sky-200 bg-sky-950/40 px-2 py-1 rounded-lg border border-sky-800/40 w-full truncate">
                "{interimTranscript}"
              </span>
            ) : (
              <span className="text-slate-400 italic text-[11px] flex items-center gap-1.5">
                <span>नोट्स वा परीक्षा विषयको नाम बोल्नुहोस्...</span>
              </span>
            )}
          </div>

          {/* Quick Voice Prompt Examples */}
          <div className="text-[10px] text-slate-400 flex items-center justify-between pt-1 border-t border-slate-800/60">
            <span>उदाहरण: "BAFIA", "राष्ट्र बैंक ऐन", "मौद्रिक नीति"</span>
            <button
              type="button"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                stopListening();
              }}
              className="text-rose-400 font-bold hover:underline cursor-pointer"
            >
              समाप्त (Done)
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
