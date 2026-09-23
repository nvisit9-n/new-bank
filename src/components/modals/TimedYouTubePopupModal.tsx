import React, { useState, useEffect, useCallback, useRef } from 'react';
import { 
  Youtube, 
  CheckCircle2, 
  Sparkles, 
  FileDown, 
  X, 
  Clock, 
  ShieldCheck, 
  Award, 
  ArrowRight,
  BookOpenCheck
} from 'lucide-react';
import { 
  OFFICIAL_CHANNEL, 
  YouTubeSubscriptionGate 
} from '../../services/youtubeService';
import { ActivityTrackingService } from '../../services/activityTrackingService';
import { useApp } from '../../context/AppContext';
import { PdfExportDialog } from './PdfExportDialog';
import { isOwnerAdmin } from '../../utils/sanitizer';

export const TimedYouTubePopupModal: React.FC = () => {
  const { user } = useApp();
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [isUnlockedSuccess, setIsUnlockedSuccess] = useState<boolean>(false);
  const [timeRemaining, setTimeRemaining] = useState<{ hours: number; minutes: number; expired: boolean }>({
    hours: 48,
    minutes: 0,
    expired: false
  });
  const [isPdfExportOpen, setIsPdfExportOpen] = useState<boolean>(false);
  const clickTimestampRef = useRef<number | null>(null);

  // Auto-trigger evaluation when user visits the website
  useEffect(() => {
    // Check if eligible
    const checkEligibility = () => {
      const eligible = YouTubeSubscriptionGate.isTimedPopupEligible();
      if (eligible) {
        const remaining = YouTubeSubscriptionGate.getTimeRemaining();
        setTimeRemaining(remaining);
        if (!remaining.expired) {
          // Add a gentle delay (1.5 seconds) so user gets oriented on the site first
          const timer = setTimeout(() => {
            setIsOpen(true);
          }, 1500);
          return () => clearTimeout(timer);
        }
      }
    };

    const cleanup = checkEligibility();
    return () => {
      if (cleanup) cleanup();
    };
  }, []);

  // Update countdown every minute while open
  useEffect(() => {
    if (!isOpen) return;

    const interval = setInterval(() => {
      const remaining = YouTubeSubscriptionGate.getTimeRemaining();
      setTimeRemaining(remaining);
      if (remaining.expired) {
        setIsOpen(false);
      }
    }, 60000);

    return () => clearInterval(interval);
  }, [isOpen]);

  const handleCompleteUnlock = useCallback(() => {
    YouTubeSubscriptionGate.completeAndUnlock(user?.email || user?.id);

    // Track in live user activity log
    try {
      ActivityTrackingService.logActivity({
        user: user || undefined,
        activityType: 'channel_subscribe',
        targetTitle: OFFICIAL_CHANNEL.name,
        details: `२-दिने अफर: युट्युब च्यानल सदस्यताद्वारा १०,०००+ PDF अनलक (${OFFICIAL_CHANNEL.handle})`,
        metadata: {
          channelUrl: OFFICIAL_CHANNEL.channelUrl,
          source: 'timed_2day_popup'
        }
      }).catch(() => {});
    } catch {}

    setIsUnlockedSuccess(true);
  }, [user]);

  // If user clicks YouTube link and returns back to the tab
  useEffect(() => {
    if (!isOpen || !clickTimestampRef.current || isUnlockedSuccess) return;

    const handleWindowFocus = () => {
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
  }, [isOpen, isUnlockedSuccess, handleCompleteUnlock]);

  const handleDismiss = () => {
    YouTubeSubscriptionGate.dismissForSession();
    setIsOpen(false);
  };

  const handleOneClickSubscribeAndUnlock = () => {
    clickTimestampRef.current = Date.now();

    // Log PDF download attempt
    try {
      ActivityTrackingService.logDownload({
        user: user || undefined,
        fileName: '१०,०००+ प्रश्न भण्डार तथा ५० सेटहरू PDF (२-दिने अफर)',
        fileType: 'PDF',
        resourceCategory: 'Question Bank & 50 Sets',
        details: 'युट्युब सब्सक्राइब गरी १०,०००+ PDF अनलक'
      }).catch(() => {});
    } catch {}

    // Open official YouTube subscribe link in new window
    window.open(OFFICIAL_CHANNEL.subscribeUrl, '_blank', 'noopener,noreferrer');

    // Instant unlock for supreme UX
    handleCompleteUnlock();
  };

  if (!isOpen) return null;

  return (
    <>
      <div 
        className="fixed inset-0 z-[99998] flex items-center justify-center p-3 sm:p-5 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-200"
        role="dialog"
        aria-modal="true"
        onClick={handleDismiss}
      >
        <div 
          className="w-full max-w-lg bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-red-500/30 overflow-hidden flex flex-col relative animate-in zoom-in-95 duration-200"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Top Banner with Countdown Badge */}
          <div className="bg-gradient-to-r from-[#FF0000] via-[#D32F2F] to-[#0B2046] p-5 sm:p-6 text-white relative overflow-hidden shrink-0">
            <div className="absolute -right-8 -top-8 w-36 h-36 bg-white/10 rounded-full blur-2xl pointer-events-none" />
            
            <div className="flex items-center justify-between gap-3 mb-2">
              <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-black/30 backdrop-blur-sm text-amber-300 text-[11px] font-black tracking-wide border border-amber-400/30">
                <Clock className="w-3.5 h-3.5 text-amber-300 animate-pulse" />
                <span>विशेष अफर: २ दिन मात्र सक्रिय ({timeRemaining.hours}h {timeRemaining.minutes}m बाँकी)</span>
              </div>

              <button
                type="button"
                onClick={handleDismiss}
                className="p-1.5 rounded-full bg-white/20 hover:bg-white/30 text-white transition cursor-pointer"
                title="पछि हेर्छु"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="flex items-center gap-3.5 mt-1">
              <div className="w-12 h-12 rounded-2xl bg-white text-[#FF0000] shadow-lg shadow-black/20 flex items-center justify-center shrink-0">
                <Youtube className="w-7 h-7 fill-current" />
              </div>
              <div>
                <h3 className="text-lg sm:text-xl font-black text-white leading-tight">
                  १०,०००+ प्रश्न भण्डार PDF निःशुल्क अनलक!
                </h3>
                <p className="text-xs text-red-100 font-medium mt-0.5">
                  Banking Tayari Nepal Official YouTube सँग जोडिनुहोस्
                </p>
              </div>
            </div>
          </div>

          {/* Modal Content */}
          <div className="p-5 sm:p-6 space-y-4 text-slate-800 dark:text-slate-200">
            {isUnlockedSuccess ? (
              <div className="text-center py-4 space-y-3 animate-in zoom-in-95 duration-200">
                <div className="w-16 h-16 rounded-full bg-emerald-100 dark:bg-emerald-950/60 border border-emerald-300 dark:border-emerald-700 flex items-center justify-center mx-auto text-emerald-600 dark:text-emerald-400">
                  <CheckCircle2 className="w-10 h-10" />
                </div>
                <h4 className="text-lg font-black text-emerald-600 dark:text-emerald-400">
                  बधाई छ! ५० Pre-Test सेटहरू अनलाइन अभ्यास अनलक भयो
                </h4>
                <p className="text-xs text-slate-600 dark:text-slate-300 max-w-sm mx-auto leading-relaxed">
                  अब तपाईं सम्पूर्ण ५० Pre-Test सेटहरू तथा १०,०००+ प्रश्नहरू अनलाइन इन्टरएक्टिभ अभ्यास मोडमा कुनै पनि समय निःशुल्क अभ्यास गर्न सक्नुहुन्छ।
                </p>
                
                <div className="pt-2 flex flex-col sm:flex-row gap-2.5 justify-center">
                  {isOwnerAdmin(user?.email) ? (
                    <button
                      type="button"
                      onClick={() => {
                        setIsOpen(false);
                        setIsPdfExportOpen(true);
                      }}
                      className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-700 text-white font-bold text-xs shadow-md hover:brightness-110 transition cursor-pointer"
                    >
                      <FileDown className="w-4 h-4" />
                      व्यवस्थापक PDF डाउनलोड खोल्नुहोस्
                    </button>
                  ) : (
                    <button
                      type="button"
                      onClick={() => {
                        setIsOpen(false);
                        window.dispatchEvent(new CustomEvent('btn:open-set-selection'));
                      }}
                      className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-700 text-white font-bold text-xs shadow-md hover:brightness-110 transition cursor-pointer"
                    >
                      <Sparkles className="w-4 h-4" />
                      अनलाइन अभ्यास सुरु गर्नुहोस्
                    </button>
                  )}
                  <button
                    type="button"
                    onClick={() => setIsOpen(false)}
                    className="inline-flex items-center justify-center px-4 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold text-xs hover:bg-slate-200 dark:hover:bg-slate-700 transition cursor-pointer"
                  >
                    धन्यवाद (बन्द गर्नुहोस्)
                  </button>
                </div>
              </div>
            ) : (
              <>
                <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                  हाम्रो आधिकारिक च्यानल <strong className="text-red-600 dark:text-red-400 font-bold">{OFFICIAL_CHANNEL.name} ({OFFICIAL_CHANNEL.handle})</strong> लाई १-क्लिकमा Subscribe गरी <strong>१०,०००+ प्रश्न भण्डार</strong> तथा <strong>५० Pre-Test सेटहरू</strong> को अनलाइन इन्टरएक्टिभ अभ्यास मोड निःशुल्क अनलक गर्नुहोस्।
                </p>

                {/* Feature highlights */}
                <div className="bg-slate-50 dark:bg-slate-800/60 rounded-2xl p-3.5 border border-slate-200 dark:border-slate-800 space-y-2">
                  <div className="flex items-center gap-2 text-xs font-bold text-slate-800 dark:text-slate-100">
                    <Sparkles className="w-4 h-4 text-amber-500 shrink-0" />
                    <span>अनलक हुने विशेष सुविधाहरू:</span>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px] text-slate-600 dark:text-slate-300">
                    <div className="flex items-center gap-1.5">
                      <ShieldCheck className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                      <span>१०,०००+ प्रश्न भण्डार (अनलाइन प्राक्टिस)</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <BookOpenCheck className="w-3.5 h-3.5 text-blue-500 shrink-0" />
                      <span>५० Pre-Test सेटहरू (सबै संस्थान तथा बैंक)</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <Award className="w-3.5 h-3.5 text-purple-500 shrink-0" />
                      <span>वास्तविक परीक्षा सिमुलेसन र टाइमर</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                      <span>आजीवन निःशुल्क अनलाइन पहुँच</span>
                    </div>
                  </div>
                </div>

                {/* Direct Action Button */}
                <div className="pt-2 space-y-2.5">
                  <button
                    type="button"
                    onClick={handleOneClickSubscribeAndUnlock}
                    className="w-full flex items-center justify-center gap-2 px-5 py-3.5 rounded-2xl bg-gradient-to-r from-[#FF0000] via-[#E50914] to-[#C2185B] text-white font-black text-sm shadow-xl shadow-red-500/25 hover:shadow-red-500/40 hover:brightness-105 active:scale-[0.99] transition cursor-pointer"
                  >
                    <Youtube className="w-5 h-5 fill-current" />
                    <span>Subscribe YouTube & Unlock Practice Sets</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>

                  <div className="flex items-center justify-between text-[11px] text-slate-400 px-1">
                    <span>यो पप-अप २ दिन पछि आफैँ बन्द हुनेछ</span>
                    <button
                      type="button"
                      onClick={handleDismiss}
                      className="hover:text-slate-600 dark:hover:text-slate-200 underline cursor-pointer"
                    >
                      पछि हेर्छु (Dismiss)
                    </button>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      {/* PDF Export Dialog triggerable right after unlocking */}
      {isPdfExportOpen && (
        <PdfExportDialog
          isOpen={isPdfExportOpen}
          onClose={() => setIsPdfExportOpen(false)}
          defaultScope="all-10k"
        />
      )}
    </>
  );
};
