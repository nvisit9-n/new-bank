import React, { useState, useEffect } from 'react';
import { 
  Bell, 
  ChevronLeft, 
  ChevronRight, 
  ExternalLink, 
  Sparkles, 
  Flame, 
  ArrowRight,
  Pause,
  Play
} from 'lucide-react';
import { PORTAL_TICKER_ALERTS, TickerAlert } from '../../data/portalData';

export interface PortalTickerSliderProps {
  onActionClick?: (alert: TickerAlert) => void;
  className?: string;
}

export const PortalTickerSlider: React.FC<PortalTickerSliderProps> = ({ 
  onActionClick,
  className = '' 
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  const alerts = PORTAL_TICKER_ALERTS;

  useEffect(() => {
    if (isPaused || alerts.length <= 1) return;

    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % alerts.length);
    }, 5500);

    return () => clearInterval(timer);
  }, [isPaused, alerts.length]);

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev - 1 + alerts.length) % alerts.length);
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % alerts.length);
  };

  const currentAlert = alerts[currentIndex] || alerts[0];

  return (
    <div 
      className={`bg-slate-900 border border-slate-800 text-white rounded-xl shadow-md overflow-hidden transition-all duration-300 ${className}`}
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      id="portal-breaking-ticker"
    >
      <div className="flex flex-col sm:flex-row sm:items-center justify-between min-h-[46px]">
        {/* Urgent Badge / Header Label */}
        <div className="flex items-center gap-2 px-3 py-2 sm:py-2.5 bg-rose-600 font-bold text-xs uppercase tracking-wider text-white shrink-0 shadow-sm">
          <span className="relative flex h-2.5 w-2.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-white"></span>
          </span>
          <Flame className="w-3.5 h-3.5 fill-white" />
          <span className="font-extrabold whitespace-nowrap">ताजा अपडेट (Alerts)</span>
        </div>

        {/* Content Slider Area */}
        <div className="flex-1 px-3 py-2 min-w-0 flex items-center justify-between gap-3">
          <div className="flex items-center gap-2 min-w-0">
            {/* Category Pill */}
            <span className={`text-[11px] font-bold px-2 py-0.5 rounded shrink-0 ${currentAlert.badgeColor}`}>
              {currentAlert.categoryLabelNe}
            </span>

            {/* Headline Title */}
            <p 
              className="text-xs sm:text-sm font-semibold text-slate-100 truncate hover:text-white transition-colors cursor-pointer"
              onClick={() => onActionClick?.(currentAlert)}
              title={currentAlert.titleNe}
            >
              {currentAlert.titleNe}
            </p>
          </div>

          {/* Time & Source */}
          <div className="hidden md:flex items-center gap-2 shrink-0 text-slate-400 text-[11px]">
            <span className="bg-slate-800 px-2 py-0.5 rounded text-slate-300 border border-slate-700 font-medium">
              {currentAlert.source}
            </span>
            <span className="text-slate-400 font-semibold">{currentAlert.date}</span>
          </div>
        </div>

        {/* Action Controls & Navigation */}
        <div className="flex items-center justify-between sm:justify-end gap-1.5 px-3 py-1.5 sm:py-0 border-t sm:border-t-0 sm:border-l border-slate-800 bg-slate-900/90 shrink-0">
          {/* Action Link Button */}
          {onActionClick && (
            <button
              onClick={() => onActionClick(currentAlert)}
              className="text-xs font-bold text-sky-400 hover:text-sky-300 inline-flex items-center gap-1 px-2 py-1 rounded bg-slate-800 hover:bg-slate-700 transition cursor-pointer"
            >
              <span>विस्तृत हेर्नुहोस्</span>
              <ArrowRight className="w-3 h-3" />
            </button>
          )}

          {/* Play/Pause state indicator */}
          <button
            onClick={() => setIsPaused(!isPaused)}
            className="p-1 text-slate-400 hover:text-white rounded hover:bg-slate-800 transition"
            title={isPaused ? 'स्वतः चलाउनुहोस् (Resume)' : 'रोक्नुहोस् (Pause)'}
          >
            {isPaused ? <Play className="w-3.5 h-3.5" /> : <Pause className="w-3.5 h-3.5" />}
          </button>

          {/* Prev / Next buttons */}
          <div className="flex items-center">
            <button
              onClick={handlePrev}
              className="p-1 text-slate-400 hover:text-white rounded hover:bg-slate-800 transition"
              title="अघिल्लो सूचना"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <span className="text-[11px] font-bold text-slate-400 px-1">
              {currentIndex + 1}/{alerts.length}
            </span>
            <button
              onClick={handleNext}
              className="p-1 text-slate-400 hover:text-white rounded hover:bg-slate-800 transition"
              title="पछिल्लो सूचना"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
