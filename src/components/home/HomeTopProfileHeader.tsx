import React from 'react';
import { 
  Flame, 
  Award, 
  Sparkles, 
  Compass, 
  ChevronRight,
  TrendingUp,
  User,
  ShieldCheck
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const HomeTopProfileHeader: React.FC = () => {
  const { user, setIsProfileModalOpen, setIsLoginModalOpen } = useApp();

  const isGuest = !user || user.isGuest || !user.email;
  const displayName = user?.displayName || user?.name || (isGuest ? 'अतिथि परीक्षार्थी' : 'विद्यार्थी');
  const emailPrefix = user?.email ? user.email.split('@')[0] : '';
  const photoURL = user?.photoURL || user?.avatarUrl || `https://ui-avatars.com/api/?name=${encodeURIComponent(displayName)}&background=0B2046&color=fff&size=128`;
  const streak = user?.streak || 3;
  const xp = user?.xp || 2450;
  const level = user?.level || Math.floor(xp / 1000) + 1;
  const targetExam = user?.targetExam || 'नेपाल राष्ट्र बैंक (NRB)';

  return (
    <div className="bg-gradient-to-r from-slate-900 via-[#0B2046] to-slate-950 text-white rounded-2xl p-4 sm:p-5 shadow-md border border-slate-800 relative overflow-hidden">
      {/* Subtle background glow */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-1/3 w-48 h-48 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
        {/* Left: Avatar & Greeting */}
        <div className="flex items-center gap-3.5">
          <div className="relative shrink-0">
            <img
              src={photoURL}
              alt={displayName}
              referrerPolicy="no-referrer"
              className="w-12 h-12 sm:w-14 sm:h-14 rounded-full object-cover ring-2 ring-blue-400/50 shadow-inner bg-slate-800"
            />
            <div className="absolute -bottom-1 -right-1 px-1.5 py-0.5 rounded-full bg-amber-500 text-slate-950 font-black text-[9px] flex items-center gap-0.5 shadow-xs">
              <Award className="w-2.5 h-2.5" />
              L{level}
            </div>
          </div>

          <div className="min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <h2 className="text-base sm:text-lg font-black text-white truncate">
                नमस्ते, {displayName}
              </h2>
              {user?.isPro ? (
                <span className="px-2 py-0.5 rounded-md bg-amber-400 text-slate-950 text-[10px] font-black uppercase tracking-wider">
                  PRO
                </span>
              ) : isGuest ? (
                <button
                  type="button"
                  onClick={() => setIsLoginModalOpen(true)}
                  className="px-2 py-0.5 rounded-md bg-blue-500/30 text-blue-300 hover:bg-blue-500/50 text-[10px] font-bold transition cursor-pointer"
                >
                  लगइन गर्नुहोस्
                </button>
              ) : null}
            </div>

            <div className="flex items-center gap-2 text-xs text-slate-300 mt-0.5 flex-wrap">
              <span className="inline-flex items-center gap-1 text-slate-400">
                <Compass className="w-3.5 h-3.5 text-blue-400" />
                लक्षित:
              </span>
              <span className="font-semibold text-blue-300">
                {targetExam}
              </span>
            </div>
          </div>
        </div>

        {/* Right: XP & Streak Summary Badges + Profile Trigger */}
        <div className="flex items-center gap-2 sm:gap-3 flex-wrap md:flex-nowrap">
          {/* Daily Streak */}
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/10 backdrop-blur-md border border-white/10 text-xs font-bold text-white shadow-2xs">
            <Flame className="w-4 h-4 text-orange-400 fill-orange-400 animate-pulse" />
            <div className="leading-tight">
              <div className="text-[10px] text-slate-400 font-medium">दैनिक स्ट्रिक</div>
              <div className="text-xs font-black text-orange-300">{streak} दिन लगातार</div>
            </div>
          </div>

          {/* XP Score */}
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/10 backdrop-blur-md border border-white/10 text-xs font-bold text-white shadow-2xs">
            <Sparkles className="w-4 h-4 text-amber-400 fill-amber-400" />
            <div className="leading-tight">
              <div className="text-[10px] text-slate-400 font-medium">कुल अध्ययन XP</div>
              <div className="text-xs font-black text-amber-300">{xp.toLocaleString()} XP</div>
            </div>
          </div>

          {/* Edit / View Profile Button */}
          <button
            type="button"
            onClick={() => {
              if (isGuest) {
                setIsLoginModalOpen(true);
              } else {
                setIsProfileModalOpen(true);
              }
            }}
            className="inline-flex items-center gap-1 px-3 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold transition shadow-xs cursor-pointer ml-auto md:ml-0"
          >
            <User className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">प्रोफाइल</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};
