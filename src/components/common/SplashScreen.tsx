import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { BrandEmblemSvg } from './BrandLogo';
import { Sparkles, ShieldCheck } from 'lucide-react';

interface SplashScreenProps {
  onComplete: () => void;
  durationMs?: number;
}

export const SplashScreen: React.FC<SplashScreenProps> = ({
  onComplete,
  durationMs = 2100
}) => {
  const [isExiting, setIsExiting] = useState(false);

  useEffect(() => {
    // Initiate exit transition slightly before completion to give a silky fade-out
    const exitTimer = setTimeout(() => {
      setIsExiting(true);
    }, durationMs - 400);

    const completeTimer = setTimeout(() => {
      onComplete();
    }, durationMs);

    return () => {
      clearTimeout(exitTimer);
      clearTimeout(completeTimer);
    };
  }, [onComplete, durationMs]);

  const handleSkip = () => {
    setIsExiting(true);
    setTimeout(onComplete, 150);
  };

  return (
    <AnimatePresence>
      {!isExiting && (
        <motion.div
          id="btn-app-splash-screen"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0, scale: 1.02 }}
          transition={{ duration: 0.35, ease: 'easeOut' }}
          className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-[#0B1329] text-white overflow-hidden select-none px-4"
        >
          {/* Subtle Ambient Radial Backlight Glow */}
          <div className="absolute w-[500px] h-[500px] rounded-full bg-radial from-sky-500/20 via-blue-900/10 to-transparent blur-3xl pointer-events-none -translate-y-8" />
          <div className="absolute w-72 h-72 rounded-full bg-radial from-red-600/15 via-transparent to-transparent blur-2xl pointer-events-none translate-y-24" />

          {/* Quick Skip Button */}
          <button
            type="button"
            onClick={handleSkip}
            className="absolute top-6 right-6 text-xs text-slate-400 hover:text-white px-3 py-1.5 rounded-full bg-slate-800/60 border border-slate-700/60 backdrop-blur-xs transition cursor-pointer z-10"
          >
            छोड्नुहोस् (Skip)
          </button>

          <div className="relative z-10 flex flex-col items-center max-w-md w-full text-center">
            
            {/* Animated Logo Container with Scale + Fade-In */}
            <motion.div
              initial={{ scale: 0.8, opacity: 0, y: 15 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              transition={{ duration: 0.65, ease: [0.16, 1, 0.3, 1] }}
              className="relative mb-5"
            >
              {/* Outer pulsing emblem ring */}
              <div className="p-4 rounded-3xl bg-gradient-to-b from-slate-800/80 to-[#0F1E38]/90 border border-sky-500/30 shadow-[0_0_35px_rgba(14,165,233,0.25)] backdrop-blur-md">
                <BrandEmblemSvg className="w-18 h-18 sm:w-22 sm:h-22 drop-shadow-xl" />
              </div>

              {/* Sparkle decorative badge */}
              <motion.div
                initial={{ scale: 0, rotate: -20 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ delay: 0.4, type: 'spring', stiffness: 200 }}
                className="absolute -top-1.5 -right-1.5 bg-amber-500 text-slate-950 p-1.5 rounded-full shadow-md"
              >
                <Sparkles className="w-3.5 h-3.5 fill-slate-950" />
              </motion.div>
            </motion.div>

            {/* Brand Title: BANKING TAYARI NEPAL */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.25, duration: 0.5 }}
              className="space-y-1"
            >
              <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-white font-mono flex items-center justify-center gap-2">
                <span>BANKING</span>
                <span className="text-red-500">TAYARI</span>
                <span className="text-sky-400">NEPAL</span>
              </h1>
              <p className="text-[12px] uppercase font-bold tracking-widest text-slate-400">
                Prepare • Practice • Succeed
              </p>
            </motion.div>

            {/* Animated Tagline with Soft Sky-Blue Glow */}
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.45, duration: 0.6 }}
              className="mt-4 px-3"
            >
              <p className="text-base sm:text-lg font-bold text-sky-300 drop-shadow-[0_0_15px_rgba(56,189,248,0.55)] leading-relaxed">
                बैंकिङ्ग तथा लोकसेवा तयारी नेपालमा स्वागत छ!
              </p>
              <p className="text-xs text-slate-300 mt-1 flex items-center justify-center gap-1.5 font-medium">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400 inline" />
                <span>नेपाल राष्ट्र बैंक, वाणिज्य बैंक, कृषि विकास बैंक र लोकसेवा तयारी</span>
              </p>
            </motion.div>

            {/* Premium 2-Second Smooth Loading Progress Bar */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5, duration: 0.3 }}
              className="mt-8 w-48 sm:w-56"
            >
              <div className="h-1.5 w-full bg-slate-800 rounded-full overflow-hidden border border-slate-700/60 p-0.5">
                <motion.div
                  initial={{ width: '0%' }}
                  animate={{ width: '100%' }}
                  transition={{ duration: 1.6, ease: 'easeInOut' }}
                  className="h-full bg-gradient-to-r from-sky-400 via-blue-500 to-emerald-400 rounded-full shadow-[0_0_10px_rgba(56,189,248,0.8)]"
                />
              </div>
              <p className="text-[11px] text-slate-400 mt-2 font-mono">
                प्रणाली लोड हुँदैछ...
              </p>
            </motion.div>

          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
