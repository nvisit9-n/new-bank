import React from 'react';
import { 
  ChevronRight, 
  ArrowLeft, 
  Layers, 
  BookOpen, 
  CheckCircle2, 
  Award, 
  Clock, 
  AlertCircle, 
  Download, 
  FileText,
  Landmark,
  Sparkles
} from 'lucide-react';
import { TargetExam, ExamCategory } from '../../data/examDrillDownData';
import { useApp } from '../../context/AppContext';

interface ExamOverviewPageProps {
  exam: TargetExam;
  category?: ExamCategory;
  onBackToHome: () => void;
  onBackToCategory?: () => void;
  onSelectPhase: (phaseId: string) => void;
}

export const ExamOverviewPage: React.FC<ExamOverviewPageProps> = ({
  exam,
  category,
  onBackToHome,
  onBackToCategory,
  onSelectPhase
}) => {
  const { setActiveTab } = useApp();

  const handleBack = onBackToCategory || onBackToHome;

  return (
    <div className="space-y-6 pb-12 animate-fadeIn">
      {/* Top Breadcrumb & Back Navigation */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-200 dark:border-slate-800">
        <div className="flex items-center gap-2 text-xs font-bold text-slate-500 dark:text-slate-400 flex-wrap">
          <button
            type="button"
            onClick={onBackToHome}
            className="hover:text-blue-600 dark:hover:text-blue-400 transition cursor-pointer"
          >
            गृहपृष्ठ (Home)
          </button>
          {category && (
            <>
              <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
              <button
                type="button"
                onClick={handleBack}
                className="hover:text-blue-600 dark:hover:text-blue-400 transition cursor-pointer"
              >
                {category.titleNe}
              </button>
            </>
          )}
          <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
          <span className="text-slate-900 dark:text-white font-extrabold">
            {exam.nameNe} ({exam.shortName})
          </span>
        </div>

        <button
          type="button"
          onClick={handleBack}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs font-bold text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800 transition cursor-pointer self-start sm:self-auto shadow-2xs"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>&larr; पछाडि फर्कनुहोस् ({category?.titleNe || 'Home'})</span>
        </button>
      </div>

      {/* Exam Header Hero Card */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 sm:p-6 shadow-2xs">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-5">
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <span className="px-2.5 py-0.5 rounded-full bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 font-black text-[10px] uppercase tracking-wider">
                {exam.badgeNe}
              </span>
              <span className="px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 font-bold text-[10px]">
                {exam.totalPhasesCount} चरण परीक्षा
              </span>
            </div>

            <h1 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white mt-1.5">
              {exam.nameNe}
            </h1>
            <p className="text-sm font-semibold text-slate-600 dark:text-slate-400 mt-0.5">
              {exam.nameEn}
            </p>

            <div className="mt-3 text-xs text-slate-600 dark:text-slate-400 leading-relaxed max-w-3xl">
              {exam.descriptionNe}
            </div>

            <div className="mt-3 flex items-center gap-2 text-xs font-medium text-slate-500 dark:text-slate-400 bg-slate-50 dark:bg-slate-800/60 p-2.5 rounded-xl border border-slate-200/60 dark:border-slate-700/60">
              <span className="font-bold text-slate-800 dark:text-slate-200 shrink-0">शैक्षिक योग्यता:</span>
              <span>{exam.eligibilityNe}</span>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="flex sm:flex-col gap-2 shrink-0">
            <button
              type="button"
              onClick={() => setActiveTab('quiz')}
              className="flex-1 sm:flex-none inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold transition shadow-xs cursor-pointer"
            >
              <Award className="w-4 h-4" />
              <span>५० सेट मोक टेस्ट दिनुहोस्</span>
            </button>

            {exam.syllabusPdfUrl && (
              <a
                href={exam.syllabusPdfUrl}
                download
                className="flex-1 sm:flex-none inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 text-xs font-bold transition cursor-pointer"
              >
                <Download className="w-4 h-4" />
                <span>पाठ्यक्रम PDF डाउनलोड</span>
              </a>
            )}
          </div>
        </div>
      </div>

      {/* Exam Stages / Phases Section */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-base sm:text-lg font-black text-slate-900 dark:text-white">
              परीक्षा चरणहरू तथा पाठ्यक्रम (Selection Stages)
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              चरण १ मा क्लिक गरी सम्बन्धित विषयहरू, विस्तृत अध्ययन नोटहरू र वस्तुगत प्रश्नहरू हेर्नुहोस्।
            </p>
          </div>
        </div>

        {/* Phase Cards */}
        <div className="grid grid-cols-1 gap-4">
          {exam.phases.map((phase) => (
            <div
              key={phase.id}
              onClick={() => onSelectPhase(phase.id)}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  onSelectPhase(phase.id);
                }
              }}
              className="group bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-blue-500 dark:hover:border-blue-500 rounded-2xl p-5 shadow-2xs hover:shadow-md transition-all duration-200 cursor-pointer"
            >
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-2 flex-wrap mb-1">
                    <span className="px-2 py-0.5 rounded-md bg-blue-100 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 font-black text-[11px]">
                      {phase.badgeNe}
                    </span>
                    <span className="text-xs font-bold text-slate-500">
                      {phase.formatNe}
                    </span>
                  </div>

                  <h3 className="text-base sm:text-lg font-black text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                    {phase.phaseTitleNe}
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                    {phase.descriptionNe}
                  </p>

                  {/* Metadata Chips */}
                  <div className="flex items-center gap-3 text-xs text-slate-600 dark:text-slate-400 mt-3 flex-wrap">
                    <div className="flex items-center gap-1 font-semibold">
                      <Clock className="w-3.5 h-3.5 text-slate-400" />
                      <span>समय: {phase.timeLimitNe}</span>
                    </div>
                    <span>•</span>
                    <div className="flex items-center gap-1 font-semibold">
                      <Award className="w-3.5 h-3.5 text-amber-500" />
                      <span>पूर्णाङ्क: {phase.fullMarks} (उत्तीर्णाङ्क: {phase.passMarks})</span>
                    </div>
                    {phase.negativeMarkingNe && (
                      <>
                        <span>•</span>
                        <div className="flex items-center gap-1 font-semibold text-rose-600 dark:text-rose-400">
                          <AlertCircle className="w-3.5 h-3.5" />
                          <span>नेगेटिभ मार्किङ: {phase.negativeMarkingNe}</span>
                        </div>
                      </>
                    )}
                  </div>

                  {/* Sub-sections Pills */}
                  {phase.sectionsNe && phase.sectionsNe.length > 0 && (
                    <div className="mt-3 flex items-center gap-2 flex-wrap">
                      {phase.sectionsNe.map((sec, idx) => (
                        <span 
                          key={idx}
                          className="px-2.5 py-1 rounded-lg bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-[11px] font-medium border border-slate-200/60 dark:border-slate-700/60"
                        >
                          {sec}
                        </span>
                      ))}
                    </div>
                  )}
                </div>

                {/* Right Arrow / Action */}
                <div className="flex items-center gap-2 text-xs font-bold text-blue-600 dark:text-blue-400 group-hover:text-blue-700 shrink-0 self-end md:self-center">
                  <span>विषयहरू र पाठ सूची &rarr;</span>
                  <div className="w-8 h-8 rounded-full bg-blue-50 dark:bg-blue-950/50 flex items-center justify-center group-hover:bg-blue-600 group-hover:text-white transition-all">
                    <ChevronRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
