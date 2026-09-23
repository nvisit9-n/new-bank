import React, { useState } from 'react';
import { 
  Building2, 
  Landmark, 
  Scale, 
  Newspaper, 
  TrendingUp, 
  Activity, 
  Sparkles, 
  ExternalLink, 
  ShieldCheck, 
  Search, 
  ArrowRight,
  Flame,
  Globe,
  Compass,
  FileText
} from 'lucide-react';
import { KeyEconomicIndicatorsWidget } from './KeyEconomicIndicatorsWidget';
import { InstitutionHubSection } from './InstitutionHubSection';
import { LawsAndActsHubSection } from './LawsAndActsHubSection';
import { OnlinekhabarNewsGrid } from './OnlinekhabarNewsGrid';
import { useApp } from '../../context/AppContext';

export interface IntegratedHybridPortalProps {
  className?: string;
}

export const IntegratedHybridPortal: React.FC<IntegratedHybridPortalProps> = ({ 
  className = '' 
}) => {
  const { setActiveTab } = useApp();
  const [activePortalSection, setActivePortalSection] = useState<'all' | 'news' | 'indicators' | 'institutions' | 'laws'>('all');

  return (
    <div 
      id="integrated-hybrid-portal" 
      className={`space-y-6 ${className}`}
    >
      {/* 1. Portal Master Header Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-navy-900 to-slate-900 border border-slate-800 rounded-2xl p-5 sm:p-7 text-white shadow-lg relative overflow-hidden">
        {/* Subtle Background Glow Accents */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20"></div>
        <div className="absolute bottom-0 left-0 w-72 h-72 bg-emerald-600/10 rounded-full blur-3xl pointer-events-none -ml-20 -mb-20"></div>

        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="max-w-3xl">
            <div className="flex flex-wrap items-center gap-2 mb-2">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-black bg-blue-500/20 text-blue-300 border border-blue-400/30">
                <Globe className="w-3.5 h-3.5 text-blue-400" />
                ONLINEKHABAR + NRB + RBB + ADBL + NBL
              </span>
              <span className="text-xs font-bold text-emerald-400 flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                प्रत्यक्ष लाइभ हब
              </span>
            </div>

            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black text-white tracking-tight leading-tight">
              एकीकृत राष्ट्रिय बैंकिङ तथा लोकसेवा पोर्टल
            </h1>

            <p className="text-xs sm:text-sm text-slate-300 mt-2 leading-relaxed">
              दैनिक आर्थिक तथा बैंकिङ समाचार, नेपाल राष्ट्र बैंकका प्रमुख आर्थिक सूचक तथा विदेशी विनिमय दर, नेपालका चारै सरकारी/केन्द्रीय बैंक (NRB, RBB, ADBL, NBL) र लोकसेवा आयोगको समर्पित परीक्षा हब।
            </p>
          </div>

          {/* Quick Stats Badges */}
          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-2 gap-2.5 shrink-0">
            <div className="p-3 rounded-xl bg-slate-800/80 border border-slate-700/80 text-center">
              <span className="text-xs text-slate-400 font-bold block">मुद्रास्फीति (Inflation)</span>
              <span className="text-lg font-black text-emerald-400">४.१०%</span>
            </div>
            <div className="p-3 rounded-xl bg-slate-800/80 border border-slate-700/80 text-center">
              <span className="text-xs text-slate-400 font-bold block">नीतिगत दर (Policy Rate)</span>
              <span className="text-lg font-black text-blue-400">५.००%</span>
            </div>
            <div className="p-3 rounded-xl bg-slate-800/80 border border-slate-700/80 text-center">
              <span className="text-xs text-slate-400 font-bold block">USD / NPR बिक्री</span>
              <span className="text-lg font-black text-amber-400">१३६.०२</span>
            </div>
            <div className="p-3 rounded-xl bg-slate-800/80 border border-slate-700/80 text-center">
              <span className="text-xs text-slate-400 font-bold block">विदेशी सञ्चिति</span>
              <span className="text-lg font-black text-purple-400">$१५.४२ B</span>
            </div>
          </div>
        </div>

        {/* Quick Portal Anchor Navigation */}
        <div className="mt-6 pt-5 border-t border-slate-800 flex flex-wrap items-center gap-2">
          <span className="text-xs font-bold text-slate-400 mr-1">द्रुत सेक्सन:</span>
          <button
            onClick={() => setActivePortalSection('all')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              activePortalSection === 'all'
                ? 'bg-blue-600 text-white shadow-xs'
                : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
            }`}
          >
            सबै सेक्सनहरू (All)
          </button>
          <button
            onClick={() => setActivePortalSection('news')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              activePortalSection === 'news'
                ? 'bg-rose-600 text-white shadow-xs'
                : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
            }`}
          >
            समाचार ग्रिड (News)
          </button>
          <button
            onClick={() => setActivePortalSection('indicators')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              activePortalSection === 'indicators'
                ? 'bg-emerald-600 text-white shadow-xs'
                : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
            }`}
          >
            आर्थिक सूचक तथा Forex
          </button>
          <button
            onClick={() => setActivePortalSection('institutions')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              activePortalSection === 'institutions'
                ? 'bg-blue-600 text-white shadow-xs'
                : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
            }`}
          >
            चार बैंक तथा लोकसेवा हब
          </button>
          <button
            onClick={() => setActivePortalSection('laws')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              activePortalSection === 'laws'
                ? 'bg-amber-600 text-white shadow-xs'
                : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
            }`}
          >
            बैंकिङ ऐन नियम हब
          </button>
        </div>
      </div>

      {/* 3. Onlinekhabar-Style News & Updates Grid */}
      {(activePortalSection === 'all' || activePortalSection === 'news') && (
        <OnlinekhabarNewsGrid />
      )}

      {/* 4. Key Economic Indicators & Daily Forex Rates Widget */}
      {(activePortalSection === 'all' || activePortalSection === 'indicators') && (
        <KeyEconomicIndicatorsWidget />
      )}

      {/* 5. Dedicated Exam Modules for NRB, RBB, ADBL, NBL & Loksewa */}
      {(activePortalSection === 'all' || activePortalSection === 'institutions') && (
        <InstitutionHubSection />
      )}

      {/* 6. Direct Tab Navigation for Laws & Acts */}
      {(activePortalSection === 'all' || activePortalSection === 'laws') && (
        <LawsAndActsHubSection />
      )}
    </div>
  );
};
