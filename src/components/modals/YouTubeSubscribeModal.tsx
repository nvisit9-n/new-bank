import React, { useState, useEffect, useCallback, useRef } from 'react';
import { 
  Youtube, 
  CheckCircle2, 
  Lock, 
  Unlock, 
  ExternalLink, 
  X, 
  Sparkles, 
  FileDown, 
  ShieldCheck,
  BellRing
} from 'lucide-react';
import { OFFICIAL_CHANNEL, YouTubeSubscriptionGate } from '../../services/youtubeService';
import { ActivityTrackingService } from '../../services/activityTrackingService';
import { useApp } from '../../context/AppContext';

export interface YouTubeSubscribeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
  targetResourceName?: string;
}

export const YouTubeSubscribeModal: React.FC<YouTubeSubscribeModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
  targetResourceName = '१०,०००+ सम्पूर्ण प्रश्न भण्डार तथा ५० Pre-Test सेटहरू (अनलाइन अभ्यास मोड)'
}) => {
  const { user } = useApp();
  const [hasClickedLink, setHasClickedLink] = useState<boolean>(false);
  const [isUnlockedSuccess, setIsUnlockedSuccess] = useState<boolean>(false);
  const [isChecking, setIsChecking] = useState<boolean>(false);
  const clickTimestampRef = useRef<number | null>(null);

  const handleCompleteUnlock = useCallback(() => {
    setIsChecking(true);
    YouTubeSubscriptionGate.completeAndUnlock(user?.email || user?.id);

    // Track activity in user logs
    try {
      ActivityTrackingService.logActivity({
        user: user || undefined,
        activityType: 'channel_subscribe',
        targetTitle: OFFICIAL_CHANNEL.name,
        details: `युट्युब च्यानल सदस्यता अनलक: ${OFFICIAL_CHANNEL.name} (${OFFICIAL_CHANNEL.handle})`,
        metadata: {
          channelUrl: OFFICIAL_CHANNEL.channelUrl,
          unlockedResource: targetResourceName
        }
      }).catch(() => {});
    } catch {}

    setIsUnlockedSuccess(true);
    setIsChecking(false);

    // Auto-proceed after brief feedback
    setTimeout(() => {
      if (onSuccess) {
        onSuccess();
      }
      onClose();
    }, 1100);
  }, [user, targetResourceName, onSuccess, onClose]);

  // Listen to window focus and visibility change when user returns from YouTube
  useEffect(() => {
    if (!isOpen || !hasClickedLink || isUnlockedSuccess) return;

    const handleWindowFocus = () => {
      // User returned to window after clicking YouTube link
      if (clickTimestampRef.current && Date.now() - clickTimestampRef.current >= 800) {
        handleCompleteUnlock();
      }
    };

    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible' && clickTimestampRef.current && Date.now() - clickTimestampRef.current >= 800) {
        handleCompleteUnlock();
      }
    };

    window.addEventListener('focus', handleWindowFocus);
    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      window.removeEventListener('focus', handleWindowFocus);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [isOpen, hasClickedLink, isUnlockedSuccess, handleCompleteUnlock]);

  if (!isOpen) return null;

  const handleSubscribeClick = () => {
    clickTimestampRef.current = Date.now();
    setHasClickedLink(true);

    // Record PDF download attempt before unlocking
    try {
      ActivityTrackingService.logDownload({
        user: user || undefined,
        fileName: targetResourceName,
        fileType: 'PDF',
        resourceCategory: 'Question Bank & 50 Sets',
        details: `PDF डाउनलोड प्रयास (युट्युब गेटवे): ${targetResourceName}`
      }).catch(() => {});
    } catch {}

    // Open official YouTube subscribe confirmation link in new tab
    window.open(OFFICIAL_CHANNEL.subscribeUrl, '_blank', 'noopener,noreferrer');
  };

  return (
    <div 
      className="fixed inset-0 z-[99999] flex items-center justify-center p-3 sm:p-5 bg-slate-950/85 backdrop-blur-md animate-in fade-in duration-200"
      role="dialog"
      aria-modal="true"
      onClick={onClose}
    >
      <div 
        className="w-full max-w-lg bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-red-500/30 overflow-hidden flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header with YouTube Theme */}
        <div className="p-5 sm:p-6 bg-gradient-to-r from-[#FF0000] via-[#CC0000] to-[#990000] text-white flex items-start justify-between relative overflow-hidden shrink-0">
          <div className="absolute -right-6 -top-6 w-32 h-32 bg-white/10 rounded-full blur-2xl pointer-events-none" />
          
          <div className="flex items-center gap-3.5 z-10">
            <div className="p-3 rounded-2xl bg-white text-[#FF0000] shadow-lg shadow-black/20 flex items-center justify-center">
              <Youtube className="w-7 h-7 fill-current" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 rounded-full bg-white/20 text-white text-[10px] font-black tracking-wider uppercase flex items-center gap-1">
                  <Lock className="w-3 h-3" />
                  PDF सुरक्षा गेटवे
                </span>
                <span className="px-2 py-0.5 rounded-full bg-amber-400 text-slate-950 text-[10px] font-black">
                  निःशुल्क (FREE)
                </span>
              </div>
              <h3 className="text-base sm:text-lg font-black text-white mt-1 leading-snug">
                PDF डाउनलोड गर्न पहिले हाम्रो Official YouTube Channel Subscribe गर्नुहोस्
              </h3>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-xl bg-white/20 hover:bg-white/30 text-white transition cursor-pointer z-10 shrink-0 ml-2"
            title="बन्द गर्नुहोस्"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-5 sm:p-6 space-y-5 text-slate-800 dark:text-slate-200">
          
          {/* Target Resource Banner */}
          <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-800 flex items-center gap-3">
            <div className="p-2 rounded-xl bg-red-100 dark:bg-red-950/50 text-red-600 dark:text-red-400 shrink-0">
              <FileDown className="w-5 h-5" />
            </div>
            <div className="min-w-0 flex-1">
              <span className="text-[10px] font-black text-slate-400 uppercase tracking-wider block">
                अनलक हुने सामग्री (Locked Content)
              </span>
              <p className="text-xs font-bold text-slate-900 dark:text-white truncate">
                {targetResourceName}
              </p>
            </div>
            <span className="px-2 py-1 rounded-lg bg-red-600/10 text-red-600 dark:text-red-400 text-[11px] font-black shrink-0 border border-red-200 dark:border-red-900/50">
              LOCKED
            </span>
          </div>

          {/* Official Channel Card */}
          <div className="p-4 rounded-2xl bg-gradient-to-br from-red-50/70 via-slate-50 to-white dark:from-red-950/20 dark:via-slate-800/40 dark:to-slate-900 border border-red-200/80 dark:border-red-900/40 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-11 h-11 rounded-full bg-[#0B2046] text-white flex items-center justify-center font-black text-lg border-2 border-red-500 shadow-sm shrink-0">
                  BTN
                </div>
                <div>
                  <div className="flex items-center gap-1.5">
                    <h4 className="text-sm font-black text-slate-900 dark:text-white">
                      Banking Tayari Nepal
                    </h4>
                    <span className="w-4 h-4 rounded-full bg-blue-500 text-white flex items-center justify-center text-[9px] font-bold" title="आधिकारिक च्यानल">
                      ✓
                    </span>
                  </div>
                  <p className="text-xs text-red-600 dark:text-red-400 font-mono font-bold">
                    @bankingtayarinepal
                  </p>
                </div>
              </div>

              <span className="px-2.5 py-1 rounded-full bg-red-600 text-white font-black text-[11px] flex items-center gap-1 shadow-sm">
                <BellRing className="w-3.5 h-3.5" />
                <span>OFFICIAL</span>
              </span>
            </div>

            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              हाम्रो आधिकारिक च्यानलमा नेपाल राष्ट्र बैंक, वाणिज्य बैंकहरू, संगठित संस्था र लोकसेवा आयोगका दैनिक वस्तुगत भिडियो, समसामयिक छलफल तथा विशेष नमुना परीक्षा निःशुल्क उपलब्ध छन्।
            </p>

            <div className="pt-2 border-t border-slate-200 dark:border-slate-800/80 grid grid-cols-2 gap-2 text-[11px] text-slate-600 dark:text-slate-400">
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                <span>१०,०००+ प्रश्न भण्डार PDF</span>
              </div>
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                <span>५० Pre-Test सेटहरू A4 PDF</span>
              </div>
            </div>
          </div>

          {/* Verification Status Banner */}
          {isUnlockedSuccess ? (
            <div className="p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-300 dark:border-emerald-800 text-emerald-900 dark:text-emerald-200 flex items-center gap-3 animate-in zoom-in-95 duration-200">
              <div className="p-2 rounded-xl bg-emerald-500 text-white">
                <Unlock className="w-5 h-5" />
              </div>
              <div>
                <p className="font-extrabold text-xs">
                  सफलतापूर्वक अनलक भयो! (Unlocked Successfully)
                </p>
                <p className="text-[11px] text-emerald-700 dark:text-emerald-300">
                  PDF डाउनलोड सुरु हुँदैछ, कृपया प्रतीक्षा गर्नुहोस्...
                </p>
              </div>
            </div>
          ) : hasClickedLink ? (
            <div className="p-3.5 rounded-2xl bg-amber-50 dark:bg-amber-950/40 border border-amber-300 dark:border-amber-800 text-amber-900 dark:text-amber-200 space-y-2">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-amber-500 animate-ping inline-block" />
                <span className="text-xs font-bold">
                  युट्युब च्यानलमा Subscribe गरी यो विन्डोमा फर्कनुहोस्...
                </span>
              </div>
              <p className="text-[11px] text-slate-600 dark:text-slate-400">
                च्यानल Subscribe गरेपछि स्वतः अनलक हुनेछ, वा तलको बटनमा क्लिक गर्नुहोस्:
              </p>
              <button
                type="button"
                onClick={handleCompleteUnlock}
                disabled={isChecking}
                className="w-full py-2 px-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition flex items-center justify-center gap-1.5 cursor-pointer shadow-sm"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>मैले Subscribe गरेँ — PDF अनलक गर्नुहोस्</span>
              </button>
            </div>
          ) : null}

          {/* Primary Action Button */}
          {!isUnlockedSuccess && (
            <div className="space-y-2">
              <button
                type="button"
                onClick={handleSubscribeClick}
                className="w-full py-3.5 px-4 rounded-2xl bg-gradient-to-r from-[#FF0000] to-[#CC0000] hover:from-[#E60000] hover:to-[#B30000] text-white font-black text-sm flex items-center justify-center gap-2 shadow-lg shadow-red-600/30 transition cursor-pointer active:scale-98"
              >
                <Youtube className="w-5 h-5 fill-current" />
                <span>युट्युबमा Subscribe गर्नुहोस् (Subscribe to Unlock)</span>
                <ExternalLink className="w-4 h-4 opacity-80" />
              </button>

              <p className="text-center text-[10px] text-slate-400">
                युट्युब लिङ्क क्लिक गरी फर्किएपछि सबै ५० सेट तथा १०,०००+ प्रश्नहरूको PDF सधैँको लागि अनलक हुनेछ।
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
