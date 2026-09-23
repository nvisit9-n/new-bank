import React, { useState } from 'react';
import { 
  ChevronRight, 
  ArrowLeft, 
  BookOpen, 
  Bookmark, 
  BookmarkCheck, 
  Clock, 
  Award, 
  Lightbulb, 
  CheckCircle2, 
  XCircle, 
  FileText, 
  Sparkles, 
  ExternalLink,
  HelpCircle,
  Calculator
} from 'lucide-react';
import { TargetExam, ExamPhase, ExamTopicDetail, ExamCategory } from '../../data/examDrillDownData';
import { useApp } from '../../context/AppContext';
import { renderLatexToHtml } from '../../utils/katexHelper';

interface LessonDetailPageProps {
  exam: TargetExam;
  phase: ExamPhase;
  topic: ExamTopicDetail;
  category?: ExamCategory;
  onBackToPhase: () => void;
  onBackToExam: () => void;
  onBackToCategory?: () => void;
  onBackToHome: () => void;
}

export const LessonDetailPage: React.FC<LessonDetailPageProps> = ({
  exam,
  phase,
  topic,
  category,
  onBackToPhase,
  onBackToExam,
  onBackToCategory,
  onBackToHome
}) => {
  const { openNoteReader, toggleBookmark, isBookmarked, setActiveTab, addToast } = useApp();

  // Practice MCQs interactive state
  const [selectedAnswers, setSelectedAnswers] = useState<Record<string, number>>({});
  const [revealedAnswers, setRevealedAnswers] = useState<Record<string, boolean>>({});

  const bookmarked = isBookmarked('note', topic.id);

  const handleSelectOption = (mcqId: string, optionIndex: number) => {
    setSelectedAnswers(prev => ({ ...prev, [mcqId]: optionIndex }));
    setRevealedAnswers(prev => ({ ...prev, [mcqId]: true }));
  };

  const handleToggleBookmark = () => {
    toggleBookmark('note', topic.id, topic.titleNe, exam.shortName);
    addToast(bookmarked ? 'बुकमार्कबाट हटाइयो।' : 'सफलतापूर्वक बुकमार्क गरियो।', 'info');
  };

  // Render KaTeX HTML if latexFormula is provided
  const renderedLatexHtml = topic.latexFormula ? renderLatexToHtml(topic.latexFormula, true) : null;

  return (
    <div className="space-y-6 pb-16 animate-fadeIn">
      {/* Top Breadcrumb & Back Navigation */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-200 dark:border-slate-800">
        <div className="flex items-center gap-2 text-xs font-bold text-slate-500 dark:text-slate-400 flex-wrap">
          <button
            type="button"
            onClick={onBackToHome}
            className="hover:text-blue-600 dark:hover:text-blue-400 transition cursor-pointer"
          >
            गृहपृष्ठ
          </button>
          {category && (
            <>
              <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
              <button
                type="button"
                onClick={onBackToCategory || onBackToHome}
                className="hover:text-blue-600 dark:hover:text-blue-400 transition cursor-pointer"
              >
                {category.titleNe}
              </button>
            </>
          )}
          <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
          <button
            type="button"
            onClick={onBackToExam}
            className="hover:text-blue-600 dark:hover:text-blue-400 transition cursor-pointer"
          >
            {exam.shortName}
          </button>
          <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
          <button
            type="button"
            onClick={onBackToPhase}
            className="hover:text-blue-600 dark:hover:text-blue-400 transition cursor-pointer truncate max-w-[120px] sm:max-w-none"
          >
            {phase.phaseTitleNe.split(':')[0]}
          </button>
          <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
          <span className="text-slate-900 dark:text-white font-extrabold truncate max-w-[180px] sm:max-w-none">
            {topic.titleNe}
          </span>
        </div>

        <button
          type="button"
          onClick={onBackToPhase}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs font-bold text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800 transition cursor-pointer self-start sm:self-auto shadow-2xs"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>&larr; पछाडि फर्कनुहोस् ({phase.phaseTitleNe.split(':')[0]})</span>
        </button>
      </div>

      {/* Lesson Header Card */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 sm:p-6 shadow-2xs">
        <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
          <div className="flex-1">
            <div className="flex items-center gap-2 flex-wrap mb-2">
              <span className="px-2.5 py-0.5 rounded-full bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 font-bold text-[10px] uppercase">
                {topic.sectionNe}
              </span>
              <span className="px-2 py-0.5 rounded-md bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 font-black text-[10px]">
                अङ्कभार: {topic.weightageMarks} अंक
              </span>
              <span className="text-xs text-slate-400 flex items-center gap-1 font-medium">
                <Clock className="w-3.5 h-3.5" />
                {topic.readTimeMin} मिनेट अध्ययन
              </span>
            </div>

            <h1 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white">
              {topic.titleNe}
            </h1>
            <p className="text-sm font-semibold text-slate-500 dark:text-slate-400 mt-1">
              {topic.titleEn}
            </p>
          </div>

          {/* Action Toolbar */}
          <div className="flex items-center gap-2 shrink-0 flex-wrap">
            <button
              type="button"
              onClick={handleToggleBookmark}
              className={`p-2.5 rounded-xl border text-xs font-bold transition flex items-center gap-1.5 cursor-pointer ${
                bookmarked
                  ? 'bg-amber-50 dark:bg-amber-950/50 border-amber-300 text-amber-700 dark:text-amber-300'
                  : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-50'
              }`}
            >
              {bookmarked ? <BookmarkCheck className="w-4 h-4 text-amber-600" /> : <Bookmark className="w-4 h-4" />}
              <span className="hidden sm:inline">{bookmarked ? 'बुकमार्क गरिएको' : 'बुकमार्क'}</span>
            </button>

            {topic.noteReaderId && (
              <button
                type="button"
                onClick={() => openNoteReader(topic.noteReaderId!)}
                className="px-3.5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold transition flex items-center gap-1.5 shadow-xs cursor-pointer"
              >
                <FileText className="w-4 h-4" />
                <span>पूर्ण नोट रिडरमा खोल्नुहोस्</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>
      </div>

      {/* KaTeX Math Formula Block (if available) */}
      {renderedLatexHtml && (
        <div className="bg-gradient-to-r from-blue-50/60 via-indigo-50/40 to-slate-50 dark:from-slate-800/80 dark:via-indigo-950/20 dark:to-slate-900 border border-blue-200/80 dark:border-blue-900/50 rounded-2xl p-5 shadow-2xs">
          <div className="flex items-center gap-2 text-blue-700 dark:text-blue-300 font-bold text-xs uppercase tracking-wider mb-2">
            <Calculator className="w-4 h-4" />
            <span>गणितीय सूत्र तथा वित्तीय मापदण्ड (KaTeX Formula)</span>
          </div>

          {topic.latexCaption && (
            <div className="text-sm font-bold text-slate-800 dark:text-slate-200 mb-2">
              {topic.latexCaption}:
            </div>
          )}

          <div 
            className="katex-rendered-block bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-4 my-2 text-center overflow-x-auto text-slate-900 dark:text-white"
            dangerouslySetInnerHTML={{ __html: renderedLatexHtml }}
          />
        </div>
      )}

      {/* Key Legal Clauses & Concept Bullets */}
      {topic.keyProvisionsNe && topic.keyProvisionsNe.length > 0 && (
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 sm:p-6 shadow-2xs">
          <h2 className="text-base sm:text-lg font-black text-slate-900 dark:text-white flex items-center gap-2 mb-3">
            <BookOpen className="w-5 h-5 text-blue-600 dark:text-blue-400" />
            <span>महत्त्वपूर्ण दफाहरू तथा मुख्य कानुनी व्यवस्थाहरू (Key Provisions)</span>
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {topic.keyProvisionsNe.map((clause, idx) => (
              <div 
                key={idx}
                className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/60 dark:border-slate-700/60 flex items-start gap-2.5"
              >
                <div className="w-5 h-5 rounded-full bg-blue-100 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 font-bold text-[10px] flex items-center justify-center shrink-0 mt-0.5">
                  {idx + 1}
                </div>
                <span className="text-xs sm:text-sm font-medium text-slate-800 dark:text-slate-200 leading-relaxed">
                  {clause}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* In-depth Conceptual Lesson Summary */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 sm:p-6 shadow-2xs">
        <h2 className="text-base sm:text-lg font-black text-slate-900 dark:text-white flex items-center gap-2 mb-3">
          <Sparkles className="w-5 h-5 text-amber-500 fill-amber-500" />
          <span>विषयगत व्याख्या तथा विश्लेषणात्मक सारांश (Conceptual Overview)</span>
        </h2>

        <div className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed space-y-3 font-normal">
          <p className="bg-blue-50/50 dark:bg-slate-800/40 p-4 rounded-xl border border-blue-100/50 dark:border-slate-700/50">
            {topic.lessonSummaryNe}
          </p>

          {topic.bulletPointsNe && topic.bulletPointsNe.length > 0 && (
            <div className="pt-2 space-y-2">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                परीक्षार्थीले सम्झनैपर्ने तथ्यहरू:
              </h3>
              <ul className="space-y-1.5">
                {topic.bulletPointsNe.map((point, idx) => (
                  <li key={idx} className="flex items-start gap-2 text-xs sm:text-sm text-slate-700 dark:text-slate-300">
                    <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                    <span>{point}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>

      {/* High-yield Exam Tips */}
      {topic.examTipsNe && topic.examTipsNe.length > 0 && (
        <div className="bg-gradient-to-r from-amber-50 to-orange-50 dark:from-amber-950/20 dark:to-orange-950/20 border border-amber-200 dark:border-amber-800/60 rounded-2xl p-5 shadow-2xs">
          <div className="flex items-center gap-2 text-amber-800 dark:text-amber-300 font-bold text-xs uppercase tracking-wider mb-2">
            <Lightbulb className="w-4 h-4 text-amber-600 fill-amber-500" />
            <span>परीक्षा दृष्टिकोण र लेखकका सुझावहरू (High-Yield Exam Tips)</span>
          </div>

          <div className="space-y-2">
            {topic.examTipsNe.map((tip, idx) => (
              <div key={idx} className="text-xs sm:text-sm text-amber-950 dark:text-amber-200 font-medium leading-relaxed flex items-start gap-2">
                <span className="text-amber-600 font-bold">•</span>
                <span>{tip}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Practice MCQs with Instant Answer & Explanation */}
      {topic.practiceMcqs && topic.practiceMcqs.length > 0 && (
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 sm:p-6 shadow-2xs space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
            <div>
              <h2 className="text-base sm:text-lg font-black text-slate-900 dark:text-white flex items-center gap-2">
                <HelpCircle className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                <span>यस पाठका नमूना वस्तुगत प्रश्नहरू (Practice MCQs)</span>
              </h2>
              <p className="text-xs text-slate-500">
                विकल्पमा क्लिक गरी तुरुन्त सही उत्तर र विस्तृत व्याख्या हेर्नुहोस्।
              </p>
            </div>
          </div>

          <div className="space-y-5">
            {topic.practiceMcqs.map((mcq, qIdx) => {
              const selectedOpt = selectedAnswers[mcq.id];
              const isRevealed = revealedAnswers[mcq.id];

              return (
                <div 
                  key={mcq.id}
                  className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/80 dark:border-slate-700/80 space-y-3"
                >
                  <div className="flex items-start gap-2.5">
                    <span className="w-6 h-6 rounded-full bg-blue-600 text-white font-bold text-xs flex items-center justify-center shrink-0">
                      {qIdx + 1}
                    </span>
                    <h3 className="text-sm font-bold text-slate-900 dark:text-white leading-relaxed">
                      {mcq.questionNe}
                    </h3>
                  </div>

                  {/* Options */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1 pl-8">
                    {mcq.optionsNe.map((opt, optIdx) => {
                      const isSelected = selectedOpt === optIdx;
                      const isCorrect = optIdx === mcq.correctIndex;

                      let btnStyle = 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200 hover:border-blue-400';
                      if (isRevealed) {
                        if (isCorrect) {
                          btnStyle = 'bg-emerald-50 dark:bg-emerald-950/60 border-emerald-500 text-emerald-800 dark:text-emerald-200 font-bold';
                        } else if (isSelected) {
                          btnStyle = 'bg-rose-50 dark:bg-rose-950/60 border-rose-500 text-rose-800 dark:text-rose-200 font-bold';
                        }
                      }

                      return (
                        <button
                          key={optIdx}
                          type="button"
                          onClick={() => handleSelectOption(mcq.id, optIdx)}
                          className={`p-3 rounded-xl border text-xs text-left transition flex items-center justify-between gap-2 cursor-pointer ${btnStyle}`}
                        >
                          <span>{opt}</span>
                          {isRevealed && isCorrect && <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />}
                          {isRevealed && isSelected && !isCorrect && <XCircle className="w-4 h-4 text-rose-600 shrink-0" />}
                        </button>
                      );
                    })}
                  </div>

                  {/* Explanation box on reveal */}
                  {isRevealed && (
                    <div className="mt-2 ml-8 p-3 rounded-xl bg-blue-50/70 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-900/60 text-xs text-slate-700 dark:text-slate-300 leading-relaxed animate-fadeIn">
                      <span className="font-bold text-blue-700 dark:text-blue-300">व्याख्या: </span>
                      {mcq.explanationNe}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Bottom Sticky-like Next Steps Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
        <button
          type="button"
          onClick={onBackToPhase}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 text-xs font-bold transition cursor-pointer"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>सबै विषयहरू हेर्नुहोस्</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('quiz')}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold transition shadow-xs cursor-pointer"
        >
          <Award className="w-4 h-4" />
          <span>५० सेट मोक टेस्ट दिनुहोस् &rarr;</span>
        </button>
      </div>
    </div>
  );
};
