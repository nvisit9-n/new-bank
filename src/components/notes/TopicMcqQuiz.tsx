import React, { useState, useMemo } from 'react';
import { 
  HelpCircle, 
  CheckCircle2, 
  XCircle, 
  RotateCcw, 
  Award, 
  ChevronRight, 
  Filter, 
  Check,
  BookOpen
} from 'lucide-react';
import { BANKING_SUITE_MCQS, BankingSuiteMcqQuestion } from '../../data/bankingSuiteMcqData';

interface TopicMcqQuizProps {
  initialTopicNumber?: number;
}

export const TopicMcqQuiz: React.FC<TopicMcqQuizProps> = ({ initialTopicNumber }) => {
  const [selectedTopicFilter, setSelectedTopicFilter] = useState<number | 'all'>(
    initialTopicNumber || 'all'
  );
  const [userAnswers, setUserAnswers] = useState<Record<string, number>>({});
  const [showExplanations, setShowExplanations] = useState<Record<string, boolean>>({});

  const filteredQuestions = useMemo(() => {
    if (selectedTopicFilter === 'all') {
      return BANKING_SUITE_MCQS;
    }
    return BANKING_SUITE_MCQS.filter(q => q.topicNumber === selectedTopicFilter);
  }, [selectedTopicFilter]);

  const handleSelectOption = (questionId: string, optionIdx: number) => {
    if (userAnswers[questionId] !== undefined) return; // Lock once answered
    setUserAnswers(prev => ({ ...prev, [questionId]: optionIdx }));
    setShowExplanations(prev => ({ ...prev, [questionId]: true }));
  };

  const handleResetQuiz = () => {
    setUserAnswers({});
    setShowExplanations({});
  };

  const stats = useMemo(() => {
    let attempted = 0;
    let correct = 0;
    filteredQuestions.forEach(q => {
      const ans = userAnswers[q.id];
      if (ans !== undefined) {
        attempted++;
        if (ans === q.correctOptionIndex) correct++;
      }
    });
    const percentage = attempted > 0 ? Math.round((correct / attempted) * 100) : 0;
    return { attempted, correct, total: filteredQuestions.length, percentage };
  }, [filteredQuestions, userAnswers]);

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5 sm:p-7 space-y-6 text-[#0F172A]">
      
      {/* Top Banner & Stats */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-lg sm:text-xl font-black text-[#0F172A]">
              अन्तरक्रियात्मक बैंकिङ वस्तुगत बहुउत्तर प्रश्नहरू (MCQs)
            </h2>
            <span className="px-2 py-0.5 rounded-full text-[10px] font-black bg-[#1E40AF] text-white">
              LOKSEWA
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-0.5 font-medium">
            नेपाल राष्ट्र बैंक, राष्ट्रिय वाणिज्य बैंक तथा कृषि विकास बैंक लिखित परीक्षाका उच्च सम्भावित प्रश्नहरू
          </p>
        </div>

        {/* Score Card */}
        <div className="flex items-center gap-3">
          <div className="px-3.5 py-1.5 rounded-xl bg-slate-50 border border-slate-200 flex items-center gap-2">
            <Award className="w-5 h-5 text-amber-500" />
            <div className="text-right">
              <div className="text-xs font-black text-[#0F172A]">
                अङ्क: <span className="text-[#1E40AF]">{stats.correct}</span> / {stats.total}
              </div>
              <div className="text-[10px] text-slate-500 font-bold">
                सफलता दर: {stats.percentage}%
              </div>
            </div>
          </div>

          <button
            type="button"
            onClick={handleResetQuiz}
            className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 transition cursor-pointer"
            title="पुनः प्रयास गर्नुहोस्"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Topic Filter Chips */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1">
        <span className="text-xs font-black text-slate-500 flex items-center gap-1 shrink-0">
          <Filter className="w-3.5 h-3.5" /> शीर्षक:
        </span>
        <button
          type="button"
          onClick={() => setSelectedTopicFilter('all')}
          className={`px-3 py-1 rounded-xl text-xs font-bold transition shrink-0 cursor-pointer ${
            selectedTopicFilter === 'all'
              ? 'bg-[#1E40AF] text-white shadow-xs'
              : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
          }`}
        >
          सबै ५ वटा विषयहरू ({BANKING_SUITE_MCQS.length})
        </button>
        {[1, 2, 3, 4, 5].map(tNum => (
          <button
            key={tNum}
            type="button"
            onClick={() => setSelectedTopicFilter(tNum)}
            className={`px-3 py-1 rounded-xl text-xs font-bold transition shrink-0 cursor-pointer ${
              selectedTopicFilter === tNum
                ? 'bg-[#1E40AF] text-white shadow-xs'
                : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }`}
          >
            Topic {tNum}
          </button>
        ))}
      </div>

      {/* Questions List */}
      <div className="space-y-5">
        {filteredQuestions.map((q, qIndex) => {
          const selectedAns = userAnswers[q.id];
          const isAnswered = selectedAns !== undefined;
          const isCorrect = isAnswered && selectedAns === q.correctOptionIndex;

          return (
            <div
              key={q.id}
              className={`p-4 sm:p-5 rounded-2xl border transition-all ${
                isAnswered
                  ? isCorrect
                    ? 'bg-emerald-50/40 border-emerald-300'
                    : 'bg-rose-50/40 border-rose-300'
                  : 'bg-white border-slate-200 hover:border-slate-300'
              }`}
            >
              {/* Question Header */}
              <div className="flex items-start justify-between gap-3 mb-3">
                <div className="flex items-start gap-2.5">
                  <span className="px-2 py-0.5 rounded-md text-[11px] font-black bg-blue-100 text-[#1E40AF] shrink-0 mt-0.5">
                    Q{qIndex + 1}
                  </span>
                  <div>
                    <h3 className="text-sm sm:text-base font-black text-[#0F172A] leading-snug">
                      {q.questionNe}
                    </h3>
                    <p className="text-xs text-slate-500 font-normal mt-0.5">
                      {q.questionEn}
                    </p>
                  </div>
                </div>

                <span className="px-2 py-0.5 rounded-full text-[10px] font-black bg-slate-100 text-slate-600 shrink-0">
                  {q.examTag}
                </span>
              </div>

              {/* Options Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 my-3">
                {q.optionsNe.map((optNe, optIdx) => {
                  let optStyle = 'bg-slate-50 border-slate-200 text-slate-800 hover:bg-slate-100';
                  
                  if (isAnswered) {
                    if (optIdx === q.correctOptionIndex) {
                      optStyle = 'bg-emerald-100 border-emerald-400 text-emerald-950 font-bold';
                    } else if (optIdx === selectedAns) {
                      optStyle = 'bg-rose-100 border-rose-400 text-rose-950 font-bold';
                    } else {
                      optStyle = 'bg-slate-50 border-slate-200 text-slate-400 opacity-60';
                    }
                  }

                  return (
                    <button
                      key={optIdx}
                      type="button"
                      disabled={isAnswered}
                      onClick={() => handleSelectOption(q.id, optIdx)}
                      className={`p-3 rounded-xl border text-left text-xs font-medium transition flex items-start gap-2 cursor-pointer ${optStyle}`}
                    >
                      <span className="w-5 h-5 rounded-full border border-slate-300 flex items-center justify-center shrink-0 text-[10px] font-bold mt-0.5">
                        {String.fromCharCode(65 + optIdx)}
                      </span>
                      <div className="flex-1">
                        <div>{optNe}</div>
                        <div className="text-[10px] opacity-75 font-normal">{q.optionsEn[optIdx]}</div>
                      </div>
                      {isAnswered && optIdx === q.correctOptionIndex && (
                        <Check className="w-4 h-4 text-emerald-700 shrink-0 mt-0.5" />
                      )}
                    </button>
                  );
                })}
              </div>

              {/* Explanation Box */}
              {isAnswered && (
                <div className="mt-3 p-3.5 rounded-xl bg-white/90 border border-slate-200 text-xs space-y-1">
                  <div className="flex items-center gap-1.5 font-black text-[#0F172A]">
                    {isCorrect ? (
                      <span className="text-emerald-700 flex items-center gap-1">
                        <CheckCircle2 className="w-3.5 h-3.5" /> सही उत्तर!
                      </span>
                    ) : (
                      <span className="text-rose-700 flex items-center gap-1">
                        <XCircle className="w-3.5 h-3.5" /> गलत उत्तर! सही विकल्प: ({String.fromCharCode(65 + q.correctOptionIndex)})
                      </span>
                    )}
                  </div>
                  <p className="text-slate-700 leading-relaxed font-medium">
                    <strong className="font-bold text-slate-900">विस्तृत व्याख्या:</strong> {q.explanationNe}
                  </p>
                </div>
              )}
            </div>
          );
        })}
      </div>

    </div>
  );
};
