import React from 'react';
import { WifiOff, ShieldCheck } from 'lucide-react';
import { useOnlineStatus } from '../../hooks/useOnlineStatus';

export const OfflineIndicator: React.FC = () => {
  const isOnline = useOnlineStatus();

  if (isOnline) return null;

  return (
    <div 
      role="status" 
      aria-live="polite"
      className="fixed bottom-4 left-4 z-50 flex items-center gap-2.5 rounded-2xl bg-slate-900/95 border border-amber-500/60 px-3.5 py-2 text-xs font-bold text-white shadow-2xl backdrop-blur-md animate-bounce"
    >
      <div className="relative flex items-center justify-center">
        <WifiOff className="w-4 h-4 text-amber-400" />
        <span className="absolute -top-0.5 -right-0.5 h-2 w-2 rounded-full bg-amber-400 animate-ping" />
      </div>

      <div className="flex flex-col">
        <div className="flex items-center gap-1.5">
          <span className="text-amber-300 font-black">अफलाइन मोड (Offline Mode)</span>
          <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30">
            PWA Cache Active
          </span>
        </div>
        <span className="text-[10px] text-slate-300 font-normal">
          इन्टरनेट बन्द हुँदा पनि सेभ गरिएका स्टडी नोट्स र PDF उपलब्ध छन्।
        </span>
      </div>

      <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0 ml-1" />
    </div>
  );
};
