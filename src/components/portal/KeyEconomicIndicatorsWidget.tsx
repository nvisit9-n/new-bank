import React, { useState } from 'react';
import { 
  TrendingUp, 
  TrendingDown, 
  Minus, 
  DollarSign, 
  Percent, 
  Activity, 
  Landmark, 
  Globe, 
  ArrowUpRight, 
  ArrowDownRight,
  RefreshCw,
  Info,
  Calendar,
  CheckCircle2
} from 'lucide-react';
import { 
  KEY_ECONOMIC_INDICATORS, 
  DAILY_FOREX_RATES, 
  EconomicIndicator, 
  ForexRateItem 
} from '../../data/portalData';

export interface KeyEconomicIndicatorsWidgetProps {
  className?: string;
}

export const KeyEconomicIndicatorsWidget: React.FC<KeyEconomicIndicatorsWidgetProps> = ({ 
  className = '' 
}) => {
  const [activeTab, setActiveTab] = useState<'policy-rates' | 'forex-rates'>('policy-rates');
  const [lastRefreshed, setLastRefreshed] = useState<string>('आज (NRB अद्यावधिक)');
  const [isRefreshing, setIsRefreshing] = useState(false);

  const handleManualRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => {
      setIsRefreshing(false);
      setLastRefreshed('भर्खरै अद्यावधिक गरियो');
    }, 600);
  };

  return (
    <div 
      id="economic-indicators-hub" 
      className={`bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 sm:p-6 shadow-sm ${className}`}
    >
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100 dark:border-slate-800">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border border-emerald-200/60 dark:border-emerald-800/60">
              <Landmark className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
              नेपाल राष्ट्र बैंक आधिकारिक तथ्याङ्क हब
            </span>
            <span className="text-xs text-slate-500 dark:text-slate-400">
              Economic Indicators & Forex
            </span>
          </div>
          <h2 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <Activity className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
            <span>प्रमुख आर्थिक सूचक तथा विदेशी विनिमय दर</span>
          </h2>
        </div>

        {/* View Toggle Buttons */}
        <div className="flex items-center gap-2">
          <div className="bg-slate-100 dark:bg-slate-800 p-1 rounded-xl flex items-center border border-slate-200 dark:border-slate-700">
            <button
              onClick={() => setActiveTab('policy-rates')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                activeTab === 'policy-rates'
                  ? 'bg-emerald-600 text-white shadow-xs'
                  : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              नीतिगत दर तथा अनुपात
            </button>
            <button
              onClick={() => setActiveTab('forex-rates')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                activeTab === 'forex-rates'
                  ? 'bg-emerald-600 text-white shadow-xs'
                  : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              विदेशी मुद्रा विनिमय (Forex)
            </button>
          </div>

          <button
            onClick={handleManualRefresh}
            disabled={isRefreshing}
            className="p-2 text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-white bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-xl transition cursor-pointer"
            title="तथ्याङ्क पुनः लोड गर्नुहोस्"
          >
            <RefreshCw className={`w-4 h-4 ${isRefreshing ? 'animate-spin text-emerald-500' : ''}`} />
          </button>
        </div>
      </div>

      {/* Main Content Area */}
      {activeTab === 'policy-rates' ? (
        <div className="mt-5">
          {/* Key Policy Rates Bento Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
            {KEY_ECONOMIC_INDICATORS.map((indicator) => {
              const isUp = indicator.trend === 'up';
              const isDown = indicator.trend === 'down';

              return (
                <div 
                  key={indicator.id}
                  className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-850 border border-slate-200/80 dark:border-slate-800 hover:border-emerald-300 dark:hover:border-emerald-700 transition flex flex-col justify-between"
                >
                  <div>
                    <span className="text-[11px] font-bold text-slate-500 dark:text-slate-400 block line-clamp-1">
                      {indicator.labelNe}
                    </span>
                    <div className="flex items-baseline gap-1 mt-1">
                      <span className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight">
                        {indicator.currentValue}
                      </span>
                      <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400">
                        {indicator.unit}
                      </span>
                    </div>
                  </div>

                  <div className="mt-2.5 pt-2 border-t border-slate-200/60 dark:border-slate-800 flex items-center justify-between text-[11px]">
                    <span className="text-slate-500 dark:text-slate-400 font-medium truncate max-w-[130px]">
                      {indicator.changeText}
                    </span>
                    <span className="text-[10px] font-semibold text-slate-400 dark:text-slate-500 shrink-0">
                      {indicator.period}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Practical Exam Tip Box */}
          <div className="mt-4 p-3 rounded-xl bg-emerald-50/60 dark:bg-emerald-950/30 border border-emerald-200/80 dark:border-emerald-900/40 flex items-start gap-2.5 text-xs text-emerald-900 dark:text-emerald-200">
            <Info className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
            <p>
              <strong className="font-bold">बैंकिङ परीक्षा उपयोगी जानकारी:</strong> राष्ट्र बैंकका अनुसार अनिवार्य नगद अनुपात (CRR) ४.००% र वैधानिक तरलता अनुपात (SLR) क वर्गका लागि १२% तथा ख र ग वर्गका लागि १०% कायम छ। परीक्षामा यी दरहरू सिधै वस्तुगत प्रश्नमा सोधिन्छन्।
            </p>
          </div>
        </div>
      ) : (
        <div className="mt-5">
          {/* Forex Table */}
          <div className="overflow-x-auto rounded-xl border border-slate-200 dark:border-slate-800">
            <table className="w-full text-left text-xs text-slate-700 dark:text-slate-200">
              <thead className="bg-slate-100 dark:bg-slate-850 text-slate-900 dark:text-slate-100 font-bold uppercase tracking-wider text-[11px] border-b border-slate-200 dark:border-slate-800">
                <tr>
                  <th className="py-2.5 px-3">मुद्रा (Currency)</th>
                  <th className="py-2.5 px-3 text-center">एकाइ (Unit)</th>
                  <th className="py-2.5 px-3 text-right">खरिद दर (NPR Buying)</th>
                  <th className="py-2.5 px-3 text-right">बिक्री दर (NPR Selling)</th>
                  <th className="py-2.5 px-3 text-right">उतारचढाव</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {DAILY_FOREX_RATES.map((forex) => (
                  <tr 
                    key={forex.currencyCode}
                    className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors"
                  >
                    <td className="py-2.5 px-3 font-semibold text-slate-900 dark:text-white flex items-center gap-2">
                      <span className="text-base">{forex.flag}</span>
                      <div>
                        <div className="font-bold">{forex.currencyCode}</div>
                        <div className="text-[10px] text-slate-500 dark:text-slate-400 font-normal">
                          {forex.currencyNameNe}
                        </div>
                      </div>
                    </td>
                    <td className="py-2.5 px-3 text-center font-bold text-slate-600 dark:text-slate-300">
                      {forex.unit}
                    </td>
                    <td className="py-2.5 px-3 text-right font-black text-slate-900 dark:text-white">
                      रु. {forex.buyRate.toFixed(2)}
                    </td>
                    <td className="py-2.5 px-3 text-right font-black text-emerald-600 dark:text-emerald-400">
                      रु. {forex.sellRate.toFixed(2)}
                    </td>
                    <td className="py-2.5 px-3 text-right font-bold">
                      {forex.change > 0 ? (
                        <span className="text-emerald-600 dark:text-emerald-400 flex items-center justify-end gap-0.5">
                          <ArrowUpRight className="w-3.5 h-3.5" />
                          +{forex.change.toFixed(2)}%
                        </span>
                      ) : forex.change < 0 ? (
                        <span className="text-rose-600 dark:text-rose-400 flex items-center justify-end gap-0.5">
                          <ArrowDownRight className="w-3.5 h-3.5" />
                          {forex.change.toFixed(2)}%
                        </span>
                      ) : (
                        <span className="text-slate-400">स्थिर</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="mt-3 flex items-center justify-between text-[11px] text-slate-500 dark:text-slate-400 px-1">
            <span>स्रोत: नेपाल राष्ट्र बैंक विदेशी विनिमय व्यवस्थापन विभाग दैनिक दर</span>
            <span className="font-semibold text-slate-600 dark:text-slate-300">{lastRefreshed}</span>
          </div>
        </div>
      )}
    </div>
  );
};
