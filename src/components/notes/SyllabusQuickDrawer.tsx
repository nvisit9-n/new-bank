import React from 'react';
import { X, BookOpen, Layers, CheckCircle2, ChevronRight, Calculator, FileText, ArrowRight } from 'lucide-react';
import { BANKING_EXAM_TOPICS_DATA, BankingExamTopicNote } from '../../data/bankingExamNotesData';
import { LatexFormulaRenderer } from './LatexFormulaRenderer';

export interface SyllabusQuickDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  activeTopicId: string;
  onSelectTopic: (topicId: string) => void;
  onOpenCalculator: () => void;
}

export const SyllabusQuickDrawer: React.FC<SyllabusQuickDrawerProps> = ({
  isOpen,
  onClose,
  activeTopicId,
  onSelectTopic,
  onOpenCalculator
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-slate-950/60 backdrop-blur-xs animate-fadeIn">
      <div 
        className="w-full max-w-md bg-white h-full shadow-2xl flex flex-col border-l border-slate-200 animate-slideLeft text-[#0F172A]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-5 bg-[#0F172A] text-white flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-[#1E40AF] text-white">
              <Layers className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-black">पाठ्यक्रम तथा द्रुत सूत्र गाइड</h3>
              <p className="text-xs text-slate-300">Syllabus Index & Formulas Quick View</p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content list */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-[#F8FAFC]">
          
          {/* Syllabus Quick Jump Card */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs font-black uppercase tracking-wider text-slate-500 px-1">
              <span>५ वटा मुख्य परीक्षा विषयहरू:</span>
              <span className="text-[#1E40AF]">१००% कभरेज</span>
            </div>

            <div className="space-y-2">
              {BANKING_EXAM_TOPICS_DATA.map((topic) => {
                const isActive = topic.id === activeTopicId;
                return (
                  <button
                    key={topic.id}
                    type="button"
                    onClick={() => {
                      onSelectTopic(topic.id);
                      onClose();
                    }}
                    className={`w-full text-left p-3 rounded-2xl border transition flex items-center justify-between gap-3 cursor-pointer ${
                      isActive
                        ? 'bg-[#1E40AF] text-white border-[#1E40AF] shadow-md ring-2 ring-blue-300'
                        : 'bg-white hover:bg-slate-50 text-slate-800 border-slate-200 shadow-2xs'
                    }`}
                  >
                    <div className="min-w-0">
                      <div className="flex items-center gap-1.5 mb-1">
                        <span className={`px-2 py-0.5 rounded text-[9.5px] font-black uppercase ${
                          isActive ? 'bg-white/20 text-white' : 'bg-blue-50 text-[#1E40AF]'
                        }`}>
                          विषय {topic.topicNumber}
                        </span>
                        <span className={`text-[10px] font-bold ${
                          isActive ? 'text-blue-100' : 'text-slate-500'
                        }`}>
                          {topic.examWeightage}
                        </span>
                      </div>
                      <div className="font-black text-xs sm:text-sm truncate">
                        {topic.titleNe}
                      </div>
                      <div className={`text-[11px] truncate mt-0.5 ${
                        isActive ? 'text-blue-100' : 'text-slate-500'
                      }`}>
                        {topic.titleEn}
                      </div>
                    </div>
                    <ChevronRight className={`w-4 h-4 shrink-0 ${isActive ? 'text-white' : 'text-slate-400'}`} />
                  </button>
                );
              })}
            </div>
          </div>

          {/* Quick Core Ratios & Formulas Preview */}
          <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-2xs space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5 text-xs font-black text-[#0F172A]">
                <Calculator className="w-4 h-4 text-[#1E40AF]" />
                <span>प्रमुख सूत्रहरू (Key Banking Formulas)</span>
              </div>
              <button
                type="button"
                onClick={() => {
                  onClose();
                  onOpenCalculator();
                }}
                className="text-[11px] font-black text-[#1E40AF] hover:underline flex items-center gap-0.5"
              >
                क्याल्कुलेटर खोल्नुहोस् <ChevronRight className="w-3 h-3" />
              </button>
            </div>

            <div className="space-y-2.5">
              <div className="p-2.5 rounded-xl bg-[#F8FAFC] border border-slate-200 text-xs">
                <div className="font-black text-[#0F172A] mb-1">Capital Adequacy Ratio (CAR)</div>
                <div className="py-1 px-2 bg-white rounded border border-slate-200 text-center">
                  <LatexFormulaRenderer latex="\text{CAR} = \frac{\text{Total Capital (Tier 1 + Tier 2)}}{\text{Risk-Weighted Assets (RWA)}} \times 100\%" />
                </div>
                <div className="text-[10.5px] text-slate-500 mt-1">NRB मापदण्ड: न्यूनतम ११.०%</div>
              </div>

              <div className="p-2.5 rounded-xl bg-[#F8FAFC] border border-slate-200 text-xs">
                <div className="font-black text-[#0F172A] mb-1">Credit to Deposit Ratio (CD Ratio)</div>
                <div className="py-1 px-2 bg-white rounded border border-slate-200 text-center">
                  <LatexFormulaRenderer latex="\text{CD Ratio} = \frac{\text{Total Loans and Advances}}{\text{Total Local Deposits}} \times 100\%" />
                </div>
                <div className="text-[10.5px] text-slate-500 mt-1">NRB सीमा: अधिकतम ९०%</div>
              </div>

              <div className="p-2.5 rounded-xl bg-[#F8FAFC] border border-slate-200 text-xs">
                <div className="font-black text-[#0F172A] mb-1">Cash Reserve Ratio (CRR)</div>
                <div className="py-1 px-2 bg-white rounded border border-slate-200 text-center">
                  <LatexFormulaRenderer latex="\text{CRR} = \frac{\text{Cash Balance with NRB}}{\text{Total Domestic Deposits}} \times 100\%" />
                </div>
                <div className="text-[10.5px] text-slate-500 mt-1">NRB मापदण्ड: ४.०% अनिवार्य</div>
              </div>
            </div>
          </div>

        </div>

        {/* Footer */}
        <div className="p-4 bg-white border-t border-slate-200 flex justify-between items-center text-xs">
          <span className="text-slate-500 font-medium">Banking Tayari Nepal Suite</span>
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-slate-900 text-white font-bold hover:bg-slate-800 cursor-pointer"
          >
            बन्द गर्नुहोस्
          </button>
        </div>
      </div>
    </div>
  );
};
