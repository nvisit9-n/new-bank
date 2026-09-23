import React, { useState, useEffect } from 'react';
import { FinancialRatioFormula } from '../../data/bankingExamNotesData';
import { 
  Calculator, 
  Sparkles, 
  ChevronDown, 
  ChevronUp, 
  ShieldCheck, 
  BookOpen, 
  TrendingUp, 
  AlertCircle, 
  Copy, 
  Check, 
  Filter, 
  Search,
  ArrowRight,
  RefreshCw,
  Activity,
  Building2,
  Percent,
  Landmark,
  ShieldAlert,
  Sliders,
  DollarSign
} from 'lucide-react';
import { renderLatexToHtml } from '../../utils/katexHelper';
import { 
  fetchLiveBankingData, 
  LiveBankingDataResponse, 
  OFFICIAL_LIVE_BANKING_DATA_FALLBACK 
} from '../../services/liveBankingDataService';

export interface LatexFormulaRendererProps {
  ratios?: FinancialRatioFormula[];
  latex?: string;
  onOpenCalculator?: () => void;
}

/**
 * Cleanly renders a LaTeX formula string visually with KaTeX fractions and math font.
 */
function renderSingleLatex(latexStr: string): React.ReactNode {
  if (!latexStr) return null;

  const html = renderLatexToHtml(latexStr, true);

  return (
    <div 
      className="katex-container py-5 px-6 my-3 overflow-x-auto text-[#0F172A] bg-white rounded-xl border border-slate-200 shadow-2xs text-center flex items-center justify-center min-h-[64px]"
      style={{ lineHeight: '2.2', padding: '20px 24px' }}
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}

export const LatexFormulaRenderer: React.FC<LatexFormulaRendererProps> = ({ 
  ratios, 
  latex, 
  onOpenCalculator 
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [expandedRatioIds, setExpandedRatioIds] = useState<Record<string, boolean>>({});
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // Live Banking Data Automation State
  const [liveData, setLiveData] = useState<LiveBankingDataResponse>(OFFICIAL_LIVE_BANKING_DATA_FALLBACK);
  const [isLoadingLive, setIsLoadingLive] = useState<boolean>(false);
  const [showNepseDrawer, setShowNepseDrawer] = useState<boolean>(false);
  const [lastUpdatedTime, setLastUpdatedTime] = useState<string>('भर्खरै');

  useEffect(() => {
    let isMounted = true;
    async function loadData() {
      setIsLoadingLive(true);
      try {
        const data = await fetchLiveBankingData(false);
        if (isMounted) {
          setLiveData(data);
          const date = new Date(data.timestampIso);
          setLastUpdatedTime(date.toLocaleTimeString('ne-NP', { hour: '2-digit', minute: '2-digit' }));
        }
      } catch (err) {
        console.error('Error fetching live data:', err);
      } finally {
        if (isMounted) setIsLoadingLive(false);
      }
    }
    loadData();
    return () => { isMounted = false; };
  }, []);

  const handleRefreshLive = async () => {
    setIsLoadingLive(true);
    try {
      const data = await fetchLiveBankingData(true);
      setLiveData(data);
      const date = new Date(data.timestampIso);
      setLastUpdatedTime(date.toLocaleTimeString('ne-NP', { hour: '2-digit', minute: '2-digit' }));
    } catch (err) {
      console.error('Error refreshing live data:', err);
    } finally {
      setIsLoadingLive(false);
    }
  };

  // If single latex prop passed
  if (latex) {
    return (
      <div className="inline-block py-1">
        {renderSingleLatex(latex)}
      </div>
    );
  }

  // If list of ratios passed
  if (!ratios || ratios.length === 0) return null;

  const toggleExpand = (id: string) => {
    setExpandedRatioIds(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  const expandAll = () => {
    const allExpanded: Record<string, boolean> = {};
    ratios.forEach(r => { allExpanded[r.id] = true; });
    setExpandedRatioIds(allExpanded);
  };

  const collapseAll = () => {
    setExpandedRatioIds({});
  };

  const handleCopyLatex = (id: string, formulaLatex: string) => {
    navigator.clipboard.writeText(formulaLatex);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const categories = ['All', 'Liquidity', 'Profitability', 'Regulatory', 'Solvency', 'Activity', 'MarketValue'];

  const categoryLabels: Record<string, string> = {
    All: 'सबै अनुपातहरू (All)',
    Liquidity: 'तरलता (Liquidity)',
    Profitability: 'नाफामूलकता (Profitability)',
    Regulatory: 'नियामकीय (Regulatory)',
    Solvency: 'शोधनक्षमता (Solvency)',
    Activity: 'कार्यकुशलता (Activity)',
    MarketValue: 'बजार मूल्य (Market Value)'
  };

  const filteredRatios = ratios.filter(r => {
    const matchesCategory = selectedCategory === 'All' || r.category === selectedCategory;
    const query = searchQuery.trim().toLowerCase();
    if (!query) return matchesCategory;

    const matchesSearch = 
      r.nameNe.toLowerCase().includes(query) ||
      r.nameEn.toLowerCase().includes(query) ||
      r.significanceNe.toLowerCase().includes(query) ||
      (r.category && r.category.toLowerCase().includes(query));

    return matchesCategory && matchesSearch;
  });

  return (
    <div className="space-y-6">

      {/* ========================================================================= */}
      {/* 1. DYNAMIC REAL-TIME DATA AUTOMATION DASHBOARD (NRB & NEPSE LIVE)         */}
      {/* ========================================================================= */}
      <div className="p-5 sm:p-6 rounded-2xl bg-white border border-slate-200 shadow-sm relative overflow-hidden space-y-4">
        
        {/* Top Header: Title + Dynamic Live Updated Today Status Badge + Refresh */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2 flex-wrap">
              {/* Dynamic Live Status Badge with Pulsing Dot */}
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-800 text-[11px] font-black uppercase tracking-wider shadow-2xs">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping inline-block" />
                <span>Live Data Synced</span>
                <span className="text-emerald-600 font-semibold lowercase">({lastUpdatedTime})</span>
              </span>

              <span className="px-2.5 py-0.5 rounded-full bg-blue-50 border border-blue-200 text-[#1E40AF] text-[11px] font-bold">
                {liveData.nrbIndicators.monetaryPolicyFiscalYearNe}
              </span>
            </div>

            <h3 className="text-base sm:text-lg font-black text-[#0F172A] flex items-center gap-2 pt-1">
              <Landmark className="w-5 h-5 text-[#1E40AF]" />
              <span>नेपाल राष्ट्र बैंक प्रत्यक्ष मौद्रिक सूचक तथा वित्तीय मानक (Live Regulatory Indicators)</span>
            </h3>
            <p className="text-xs text-slate-500 font-medium">
              स्रोत: {liveData.sourceAttributionNe}
            </p>
          </div>

          <div className="flex items-center gap-2 self-start sm:self-center">
            {/* Refresh Button */}
            <button
              type="button"
              onClick={handleRefreshLive}
              disabled={isLoadingLive}
              className="px-3 py-1.5 rounded-xl bg-[#F8FAFC] hover:bg-slate-100 border border-slate-200 text-slate-700 text-xs font-bold transition flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
              title="प्रत्यक्ष तथ्याङ्क पुनः लोड गर्नुहोस्"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isLoadingLive ? 'animate-spin text-[#1E40AF]' : ''}`} />
              <span>{isLoadingLive ? 'अपडेट हुँदै...' : 'रिफ्रेस'}</span>
            </button>

            {/* Toggle NEPSE Drawer */}
            <button
              type="button"
              onClick={() => setShowNepseDrawer(!showNepseDrawer)}
              className="px-3 py-1.5 rounded-xl bg-blue-50 hover:bg-blue-100 border border-blue-200 text-[#1E40AF] text-xs font-black transition flex items-center gap-1.5 cursor-pointer"
            >
              <TrendingUp className="w-3.5 h-3.5" />
              <span>{showNepseDrawer ? 'NEPSE लुकाउनुहोस्' : 'NEPSE बैंकिङ बजार'}</span>
            </button>
          </div>
        </div>

        {/* Live NRB Policy & Sector Indicator Metrics Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2.5">
          {/* CRR */}
          <div className="p-3 rounded-xl bg-[#F8FAFC] border border-slate-200 text-center space-y-1">
            <span className="text-[10.5px] font-black uppercase tracking-wider text-slate-500 block">
              CRR (नगद मौज्दात)
            </span>
            <div className="text-lg font-black text-[#1E40AF]">
              {liveData.nrbIndicators.crrPercent.toFixed(2)}%
            </div>
            <span className="text-[10px] text-slate-500 font-semibold block">
              अनिवार्य न्यूनतम
            </span>
          </div>

          {/* SLR */}
          <div className="p-3 rounded-xl bg-[#F8FAFC] border border-slate-200 text-center space-y-1">
            <span className="text-[10.5px] font-black uppercase tracking-wider text-slate-500 block">
              SLR ('क' वर्ग बैंक)
            </span>
            <div className="text-lg font-black text-emerald-700">
              {liveData.nrbIndicators.slrClassAPercent.toFixed(2)}%
            </div>
            <span className="text-[10px] text-slate-500 font-semibold block">
              वैधानिक तरलता
            </span>
          </div>

          {/* CD Ratio Ceiling */}
          <div className="p-3 rounded-xl bg-[#F8FAFC] border border-slate-200 text-center space-y-1">
            <span className="text-[10.5px] font-black uppercase tracking-wider text-slate-500 block">
              CD Ratio Ceiling
            </span>
            <div className="text-lg font-black text-[#DC2626]">
              {liveData.nrbIndicators.cdRatioCeilingPercent.toFixed(2)}%
            </div>
            <span className="text-[10px] text-slate-500 font-semibold block">
              अधिकतम सीमा
            </span>
          </div>

          {/* Policy Rate */}
          <div className="p-3 rounded-xl bg-[#F8FAFC] border border-slate-200 text-center space-y-1">
            <span className="text-[10.5px] font-black uppercase tracking-wider text-slate-500 block">
              नीतिगत दर (Policy Rate)
            </span>
            <div className="text-lg font-black text-amber-700">
              {liveData.nrbIndicators.policyRatePercent.toFixed(2)}%
            </div>
            <span className="text-[10px] text-slate-500 font-semibold block">
              बैंक दर: {liveData.nrbIndicators.bankRatePercent.toFixed(2)}%
            </span>
          </div>

          {/* Sector Average NPL */}
          <div className="p-3 rounded-xl bg-[#F8FAFC] border border-slate-200 text-center space-y-1">
            <span className="text-[10.5px] font-black uppercase tracking-wider text-slate-500 block">
              औसत खराब कर्जा (NPL)
            </span>
            <div className="text-lg font-black text-purple-700">
              {liveData.sectorAverages.averageGrossNplPercent.toFixed(2)}%
            </div>
            <span className="text-[10px] text-slate-500 font-semibold block">
              क्षेत्रीय औसत (Sector Avg)
            </span>
          </div>

          {/* Sector Average ROE */}
          <div className="p-3 rounded-xl bg-[#F8FAFC] border border-slate-200 text-center space-y-1">
            <span className="text-[10.5px] font-black uppercase tracking-wider text-slate-500 block">
              औसत प्रतिफल (ROE)
            </span>
            <div className="text-lg font-black text-teal-700">
              {liveData.sectorAverages.averageRoePercent.toFixed(2)}%
            </div>
            <span className="text-[10px] text-slate-500 font-semibold block">
              ROA: {liveData.sectorAverages.averageRoaPercent.toFixed(2)}%
            </span>
          </div>
        </div>

        {/* NEPSE Live Banking Market Price Drawer */}
        {showNepseDrawer && (
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-3 animate-fadeIn">
            <div className="flex items-center justify-between">
              <span className="text-xs font-black text-[#0F172A] flex items-center gap-1.5">
                <Building2 className="w-4 h-4 text-[#1E40AF]" />
                <span>वाणिज्य बैंकहरूको NEPSE लाइभ बजार मूल्य तथा अनुपातहरू (P/E, EPS, MPS)</span>
              </span>
              <span className="text-[11px] text-slate-500">
                P/E र EPS गणनाका लागि प्रत्यक्ष तथ्याङ्क
              </span>
            </div>

            <div className="overflow-x-auto rounded-lg border border-slate-200">
              <table className="w-full text-xs text-left bg-white">
                <thead className="bg-slate-100 text-slate-700 font-black border-b border-slate-200 text-[11px]">
                  <tr>
                    <th className="p-2.5">बैंक (Symbol)</th>
                    <th className="p-2.5 text-right">बजार मूल्य (MPS)</th>
                    <th className="p-2.5 text-right">प्रति शेयर आम्दानी (EPS)</th>
                    <th className="p-2.5 text-right">मूल्य आम्दानी अनुपात (P/E)</th>
                    <th className="p-2.5 text-right">किताबी मूल्य (BVPS)</th>
                    <th className="p-2.5 text-right">खराब कर्जा (NPL)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {liveData.nepseBanks.map((bank) => (
                    <tr key={bank.symbol} className="hover:bg-blue-50/30 transition">
                      <td className="p-2.5 font-bold text-[#0F172A]">
                        {bank.symbol}
                        <span className="block text-[10px] text-slate-500 font-normal">{bank.nameNe}</span>
                      </td>
                      <td className="p-2.5 text-right font-black text-[#1E40AF]">
                        रु. {bank.marketPriceNpr.toFixed(2)}
                      </td>
                      <td className="p-2.5 text-right font-bold text-slate-800">
                        रु. {bank.epsNpr.toFixed(2)}
                      </td>
                      <td className="p-2.5 text-right font-black text-purple-700">
                        {bank.peRatio.toFixed(2)}x
                      </td>
                      <td className="p-2.5 text-right font-medium text-slate-600">
                        रु. {bank.bookValueNpr.toFixed(2)}
                      </td>
                      <td className="p-2.5 text-right font-bold text-[#DC2626]">
                        {bank.grossNplPercent.toFixed(2)}%
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

      </div>

      {/* ========================================================================= */}
      {/* 2. FORMULAS CONTROLS: Category Tabs + Search + Expand/Collapse Buttons     */}
      {/* ========================================================================= */}
      <div className="p-5 sm:p-6 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-4">
        
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h3 className="text-base sm:text-lg font-black text-[#0F172A] flex items-center gap-2">
              <Calculator className="w-5 h-5 text-[#1E40AF]" />
              <span>वित्तीय अनुपात सूत्र तथा गहिरो विश्लेषण (Formula Hub & Deep Analysis)</span>
            </h3>
            <p className="text-xs text-slate-500 font-medium mt-0.5">
              लोकसेवा तथा बैंक परीक्षाका लागि आवश्यक सम्पूर्ण अनुपातहरू, NRB मापदण्ड, व्यावहारिक हिसाब र विन्डो ड्रेसिङ
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={expandAll}
              className="px-3 py-1.5 rounded-xl bg-[#F8FAFC] hover:bg-slate-100 border border-slate-200 text-xs font-bold text-slate-700 transition cursor-pointer"
            >
              सबै खोल्नुहोस्
            </button>
            <button
              type="button"
              onClick={collapseAll}
              className="px-3 py-1.5 rounded-xl bg-[#F8FAFC] hover:bg-slate-100 border border-slate-200 text-xs font-bold text-slate-700 transition cursor-pointer"
            >
              सबै बन्द गर्नुहोस्
            </button>
          </div>
        </div>

        {/* Category Filter Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs">
          {categories.map(cat => {
            const isSelected = selectedCategory === cat;
            return (
              <button
                key={cat}
                type="button"
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-1.5 rounded-xl font-bold whitespace-nowrap transition cursor-pointer ${
                  isSelected
                    ? 'bg-[#1E40AF] text-white shadow-xs'
                    : 'bg-[#F8FAFC] text-slate-600 hover:text-[#1E40AF] hover:bg-blue-50 border border-slate-200'
                }`}
              >
                {categoryLabels[cat] || cat}
              </button>
            );
          })}
        </div>

        {/* Search Input Box */}
        <div className="relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="अनुपातको नाम (नेपाली वा अंग्रेजी), वर्ग वा महत्व खोज्नुहोस्..."
            className="w-full pl-10 pr-4 py-2 text-xs rounded-xl bg-[#F8FAFC] border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#1E40AF] focus:border-transparent text-[#0F172A]"
          />
        </div>

      </div>

      {/* ========================================================================= */}
      {/* 3. RATIO FORMULA CARDS GRID WITH ULTRA-PREMIUM 6-PART BREAKDOWN           */}
      {/* ========================================================================= */}
      <div className="space-y-4">
        {filteredRatios.length === 0 && (
          <div className="p-8 rounded-2xl bg-white border border-slate-200 text-center space-y-2">
            <AlertCircle className="w-8 h-8 text-slate-400 mx-auto" />
            <p className="text-sm font-bold text-slate-700">कुनै अनुपात फेला परेन।</p>
            <p className="text-xs text-slate-500">कृपया खोज शब्द परिवर्तन गरी पुन: प्रयास गर्नुहोस्।</p>
          </div>
        )}

        {filteredRatios.map((ratio) => {
          const isExpanded = Boolean(expandedRatioIds[ratio.id]);
          const badgeColor = 
            ratio.category === 'Liquidity' 
              ? 'bg-blue-100 text-blue-800 border-blue-200'
              : ratio.category === 'Profitability'
              ? 'bg-emerald-100 text-emerald-800 border-emerald-200'
              : ratio.category === 'Regulatory'
              ? 'bg-red-100 text-red-800 border-red-200'
              : ratio.category === 'Solvency'
              ? 'bg-purple-100 text-purple-800 border-purple-200'
              : ratio.category === 'MarketValue'
              ? 'bg-indigo-100 text-indigo-800 border-indigo-200'
              : 'bg-amber-100 text-amber-800 border-amber-200';

          return (
            <div
              key={ratio.id}
              className="rounded-2xl bg-white border border-slate-200 overflow-hidden shadow-xs hover:border-[#1E40AF] transition-all"
            >
              {/* Card Header & Summary Bar */}
              <div className="p-4 sm:p-5 flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white">
                <div className="space-y-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className={`px-2 py-0.5 rounded-md text-[10px] font-black uppercase tracking-wider border ${badgeColor}`}>
                      {ratio.category} Ratio
                    </span>
                    <span className="text-xs font-bold text-slate-500">
                      मानक: <strong className="text-[#DC2626]">{ratio.standardBenchmark}</strong>
                    </span>
                  </div>
                  <h4 className="text-base font-black text-[#0F172A] flex items-center gap-2">
                    <span>{ratio.nameNe}</span>
                    <span className="text-sm font-semibold text-slate-500">({ratio.nameEn})</span>
                  </h4>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => handleCopyLatex(ratio.id, ratio.formulaLatex)}
                    className="p-2 rounded-xl bg-[#F8FAFC] hover:bg-slate-100 border border-slate-200 text-slate-600 hover:text-[#1E40AF] transition cursor-pointer text-xs flex items-center gap-1 font-bold"
                    title="LaTeX कोड कपी गर्नुहोस्"
                  >
                    {copiedId === ratio.id ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-emerald-600" />
                        <span className="text-[11px] text-emerald-700">कपी भयो!</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5" />
                        <span className="text-[11px]">LaTeX</span>
                      </>
                    )}
                  </button>

                  <button
                    type="button"
                    onClick={() => toggleExpand(ratio.id)}
                    className="px-3.5 py-2 rounded-xl bg-blue-50 hover:bg-blue-100 text-[#1E40AF] border border-blue-200 text-xs font-black transition cursor-pointer flex items-center gap-1.5"
                  >
                    <span>{isExpanded ? 'संक्षिप्त गर्नुहोस्' : 'विस्तृत विश्लेषण र हिसाब'}</span>
                    {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* Primary Mathematical Formula KaTeX Block */}
              <div className="px-4 sm:px-5 pb-4">
                <div className="p-4 rounded-xl bg-[#F8FAFC] border border-slate-200 flex flex-col items-center justify-center text-center">
                  <div className="w-full overflow-x-auto py-2">
                    {renderSingleLatex(ratio.formulaLatex)}
                  </div>
                  <div className="w-full flex flex-col sm:flex-row items-center justify-between text-[11px] text-slate-500 border-t border-slate-200/80 pt-2.5 mt-2 gap-2">
                    <div>
                      <strong className="text-[#0F172A]">अंश (Numerator):</strong> {ratio.numeratorNe}
                    </div>
                    <div>
                      <strong className="text-[#0F172A]">हर (Denominator):</strong> {ratio.denominatorNe}
                    </div>
                  </div>
                </div>
              </div>

              {/* EXPANDED SECTION: 6-Part Ultra-Premium Breakdown */}
              {isExpanded && (
                <div className="p-4 sm:p-6 bg-[#F8FAFC] border-t border-slate-200 space-y-5 animate-fadeIn">
                  
                  {/* Part 1: Deep Conceptual Rationale & Purpose */}
                  <div className="p-4 rounded-xl bg-white border border-slate-200 shadow-2xs space-y-2">
                    <div className="flex items-center gap-2 text-xs font-black text-[#1E40AF]">
                      <BookOpen className="w-4 h-4" />
                      <span>१. अवधारणा, औचित्य तथा वित्तीय उद्देश्य (Deep Conceptual Rationale)</span>
                    </div>
                    <p className="text-xs text-slate-700 leading-relaxed font-medium">
                      {ratio.deepConceptualRationaleNe || ratio.conceptAndPurposeNe || ratio.significanceNe}
                    </p>
                  </div>

                  {/* Part 2: Practical Applications across Supervision, Risk, and Investors */}
                  <div className="p-4 rounded-xl bg-white border border-slate-200 shadow-2xs space-y-3">
                    <div className="flex items-center gap-2 text-xs font-black text-emerald-700">
                      <TrendingUp className="w-4 h-4" />
                      <span>२. बैंकिङ क्षेत्रमा बहुआयामिक प्रयोग (Practical Banking Applications)</span>
                    </div>
                    
                    {ratio.practicalApplications ? (
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                        <div className="p-3 rounded-lg bg-emerald-50/50 border border-emerald-100 text-xs space-y-1">
                          <span className="font-black text-emerald-900 block">नियामक तथा CAMELS सुपरिवेक्षण:</span>
                          <p className="text-slate-700 leading-relaxed font-medium">
                            {ratio.practicalApplications.regulatorySupervisionNe}
                          </p>
                        </div>
                        <div className="p-3 rounded-lg bg-blue-50/50 border border-blue-100 text-xs space-y-1">
                          <span className="font-black text-[#1E40AF] block">कर्जा स्वीकृति तथा जोखिम मूल्याङ्कन:</span>
                          <p className="text-slate-700 leading-relaxed font-medium">
                            {ratio.practicalApplications.creditRiskApprovalNe}
                          </p>
                        </div>
                        <div className="p-3 rounded-lg bg-purple-50/50 border border-purple-100 text-xs space-y-1">
                          <span className="font-black text-purple-900 block">लगानीकर्ता तथा बजार धारणा:</span>
                          <p className="text-slate-700 leading-relaxed font-medium">
                            {ratio.practicalApplications.investorPerceptionNe}
                          </p>
                        </div>
                      </div>
                    ) : (
                      <p className="text-xs text-slate-700 leading-relaxed font-medium">
                        {ratio.bankingApplicationNe || 'नेपाल राष्ट्र बैंकका निरीक्षक तथा कर्जा जोखिम विश्लेषकहरूले बैंकको वित्तीय स्वास्थ्य र सुरक्षा सुनिश्चित गर्न यस अनुपातको सूक्ष्म मूल्याङ्कन गर्दछन्।'}
                      </p>
                    )}
                  </div>

                  {/* Part 3: Regulatory Framework & NRB Directives */}
                  <div className="p-4 rounded-xl bg-white border border-slate-200 shadow-2xs space-y-3">
                    <div className="flex items-center gap-2 text-xs font-black text-[#DC2626]">
                      <ShieldCheck className="w-4 h-4" />
                      <span>३. नेपाल राष्ट्र बैंकको कानुनी तथा नियामकीय ढाँचा (NRB Directives & Penalties)</span>
                    </div>

                    {ratio.regulatoryFramework ? (
                      <div className="p-3.5 rounded-lg bg-red-50/50 border border-red-100 space-y-2 text-xs">
                        <div className="flex flex-wrap items-center justify-between gap-2 border-b border-red-200/60 pb-2">
                          <span className="font-black text-[#DC2626]">
                            {ratio.regulatoryFramework.directiveNumberNe}
                          </span>
                          <span className="px-2.5 py-0.5 rounded bg-[#DC2626] text-white font-bold text-[11px]">
                            थ्रेसहोल्ड: {ratio.regulatoryFramework.mandatoryThresholdNe}
                          </span>
                        </div>
                        <div className="space-y-1">
                          <span className="font-bold text-slate-900 block">गैर-अनुपालनमा हुने कानुनी कारबाही:</span>
                          <p className="text-slate-700 leading-relaxed font-medium">
                            {ratio.regulatoryFramework.nonCompliancePenaltyNe}
                          </p>
                        </div>
                        {ratio.regulatoryFramework.baselFrameworkNe && (
                          <div className="text-[11px] text-slate-600 pt-1 border-t border-red-100 font-semibold">
                            <strong>बासेल ढाँचा:</strong> {ratio.regulatoryFramework.baselFrameworkNe}
                          </div>
                        )}
                      </div>
                    ) : (
                      <div className="text-xs text-slate-700 leading-relaxed font-medium bg-red-50/50 p-3 rounded-lg border border-red-100">
                        {ratio.nrbDirectiveNormsNe || `राष्ट्र बैंकको एकीकृत निर्देशन अनुसार यसको न्यूनतम/अधिकतम मापदण्ड ${ratio.standardBenchmark} कायम गर्नुपर्दछ।`}
                      </div>
                    )}
                  </div>

                  {/* Part 4: Practical Numerical Case Study */}
                  {ratio.numericalExample && (
                    <div className="p-4 sm:p-5 rounded-xl bg-white border border-blue-200 shadow-2xs space-y-3">
                      <div className="flex items-center justify-between border-b border-slate-100 pb-2.5">
                        <div className="flex items-center gap-2 text-xs sm:text-sm font-black text-[#0F172A]">
                          <Calculator className="w-4 h-4 text-[#1E40AF]" />
                          <span>४. व्यावहारिक हिसाबसहितको वास्तविक केस स्टडी (Practical Numerical Case Study)</span>
                        </div>
                        <span className="px-2.5 py-0.5 rounded text-[10px] font-black bg-blue-100 text-[#1E40AF]">
                          {ratio.numericalExample.fiscalYearNe || 'आव २०८०/८१'}
                        </span>
                      </div>

                      <div className="text-xs font-bold text-slate-800">
                        {ratio.numericalExample.scenarioTitleNe}
                      </div>

                      {/* Given Data Box */}
                      <div className="p-3 bg-[#F8FAFC] rounded-lg border border-slate-200 space-y-1.5">
                        <div className="text-[11px] font-black uppercase text-slate-500 tracking-wider">
                          दिएको वित्तीय विवरण (Given Financial Figures):
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
                          {ratio.numericalExample.givenData.map((data, idx) => (
                            <div key={idx} className="flex justify-between items-center text-xs p-1.5 bg-white rounded border border-slate-200">
                              <span className="text-slate-600 font-medium">{data.labelNe}:</span>
                              <span className="font-black text-[#0F172A]">{data.valueFormatted}</span>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Step-by-Step Calculation */}
                      <div className="space-y-2 pt-1">
                        <div className="text-[11px] font-black uppercase text-slate-500 tracking-wider">
                          गणना प्रक्रिया (Step-by-Step Calculation):
                        </div>
                        <div className="space-y-2">
                          {ratio.numericalExample.steps.map((st) => (
                            <div key={st.stepNumber} className="p-2.5 rounded-lg bg-[#F8FAFC] border border-slate-200 text-xs space-y-1">
                              <div className="font-bold text-[#0F172A] flex items-center gap-1.5">
                                <span className="w-5 h-5 rounded-full bg-[#1E40AF] text-white flex items-center justify-center text-[10px] font-black">
                                  {st.stepNumber}
                                </span>
                                <span>{st.stepTitleNe}</span>
                              </div>
                              {st.formulaOrWorkingLatex && (
                                <div className="py-2 px-3 bg-white rounded border border-slate-200 text-center my-1">
                                  <div dangerouslySetInnerHTML={{ __html: renderLatexToHtml(st.formulaOrWorkingLatex, true) }} />
                                </div>
                              )}
                              <p className="text-slate-600 text-[11px] font-medium pl-6">
                                {st.explanationNe}
                              </p>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Final Result and Interpretation */}
                      <div className="p-3.5 bg-blue-50/70 rounded-xl border border-blue-200 space-y-1.5">
                        <div className="flex items-center justify-between flex-wrap gap-2">
                          <span className="text-xs font-black text-[#1E40AF]">अन्तिम नतिजा (Final Result):</span>
                          <span className="text-xs font-black text-white bg-[#1E40AF] px-2.5 py-0.5 rounded">
                            {ratio.numericalExample.resultValueLatex}
                          </span>
                        </div>
                        <p className="text-xs text-slate-700 leading-relaxed font-medium">
                          <strong>विश्लेषण र निष्कर्ष:</strong> {ratio.numericalExample.interpretationNe}
                        </p>
                      </div>
                    </div>
                  )}

                  {/* Part 5: Window Dressing Manipulation Risks & Forensic Detection Guide */}
                  {ratio.windowDressingRisks && (
                    <div className="p-4 sm:p-5 rounded-xl bg-amber-50/50 border border-amber-200 shadow-2xs space-y-3">
                      <div className="flex items-center gap-2 text-xs font-black text-amber-900">
                        <ShieldAlert className="w-4 h-4 text-amber-700" />
                        <span>५. विन्डो ड्रेसिङका जोखिम तथा फरेन्सिक अडिट गाइड (Window Dressing & Forensic Detection)</span>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        <div className="p-3.5 bg-white rounded-xl border border-amber-200 text-xs space-y-2 shadow-2xs">
                          <span className="font-black text-amber-900 block">
                            अनुपात फुलाउन वा लुकाउन गरिने चलखेल (Manipulation Techniques):
                          </span>
                          {Array.isArray(ratio.windowDressingRisks.manipulationTechniquesNe) ? (
                            <ul className="list-disc pl-4 space-y-1.5 text-slate-700 leading-relaxed font-medium">
                              {ratio.windowDressingRisks.manipulationTechniquesNe.map((tech, idx) => (
                                <li key={idx}>{tech}</li>
                              ))}
                            </ul>
                          ) : (
                            <p className="text-slate-700 leading-relaxed font-medium">
                              {ratio.windowDressingRisks.manipulationTechniquesNe}
                            </p>
                          )}
                        </div>
                        <div className="p-3.5 bg-white rounded-xl border border-amber-200 text-xs space-y-2 shadow-2xs">
                          <span className="font-black text-slate-900 block">
                            अडिटरले समात्ने उपाय तथा फरेन्सिक चेकहरू (Auditor Detection Guide):
                          </span>
                          {Array.isArray(ratio.windowDressingRisks.auditorDetectionGuideNe) ? (
                            <ul className="list-disc pl-4 space-y-1.5 text-slate-700 leading-relaxed font-medium">
                              {ratio.windowDressingRisks.auditorDetectionGuideNe.map((guide, idx) => (
                                <li key={idx}>{guide}</li>
                              ))}
                            </ul>
                          ) : (
                            <p className="text-slate-700 leading-relaxed font-medium">
                              {ratio.windowDressingRisks.auditorDetectionGuideNe}
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Part 6: Strategic Limitations & Decision Impact */}
                  <div className="p-4 rounded-xl bg-white border border-slate-200 shadow-2xs space-y-2">
                    <div className="flex items-center gap-2 text-xs font-black text-slate-800">
                      <AlertCircle className="w-4 h-4 text-slate-600" />
                      <span>६. रणनीतिक निष्कर्ष तथा सीमाहरू (Strategic Interpretation & Limitations)</span>
                    </div>
                    <p className="text-xs text-slate-700 leading-relaxed font-medium">
                      {ratio.strategicLimitationsNe || 'यो अनुपात एक्लो आधारमा मात्र विश्लेषण नगरी उद्योगको औसत, विगतका वर्षहरूको प्रवृत्ति तथा गुणात्मक पक्षहरूसँग जोडेर हेर्नुपर्दछ।'}
                    </p>
                  </div>

                  {/* Action Link to Interactive Calculator */}
                  {onOpenCalculator && (
                    <div className="flex justify-end pt-2">
                      <button
                        type="button"
                        onClick={onOpenCalculator}
                        className="text-xs font-black text-[#1E40AF] hover:underline flex items-center gap-1 cursor-pointer"
                      >
                        <span>यस अनुपातको अन्तरक्रियात्मक क्याल्कुलेटर चलाउनुहोस्</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  )}

                </div>
              )}

            </div>
          );
        })}
      </div>

    </div>
  );
};
