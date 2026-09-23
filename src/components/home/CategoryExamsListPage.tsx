import React from 'react';
import { 
  ChevronRight, 
  ArrowLeft, 
  ArrowRight,
  Landmark, 
  Building2, 
  Scale, 
  Coins, 
  Layers, 
  Award,
  Sparkles,
  BookOpen
} from 'lucide-react';
import { ExamCategory, TargetExam, TARGET_EXAMS_DATA } from '../../data/examDrillDownData';

interface CategoryExamsListPageProps {
  category: ExamCategory;
  onBackToHome: () => void;
  onSelectExam: (examId: string) => void;
}

export const CategoryExamsListPage: React.FC<CategoryExamsListPageProps> = ({
  category,
  onBackToHome,
  onSelectExam
}) => {
  const getCategoryIcon = () => {
    switch (category.iconName) {
      case 'Landmark':
        return <Landmark className="w-6 h-6 text-emerald-600 dark:text-emerald-400" />;
      case 'Building2':
        return <Building2 className="w-6 h-6 text-sky-600 dark:text-sky-400" />;
      case 'Scale':
        return <Scale className="w-6 h-6 text-amber-600 dark:text-amber-400" />;
      default:
        return <Landmark className="w-6 h-6 text-blue-600" />;
    }
  };

  const getExamIcon = (examId: string) => {
    switch (examId) {
      case 'nrb':
        return <Landmark className="w-5 h-5 text-emerald-600" />;
      case 'rbb':
        return <Building2 className="w-5 h-5 text-blue-600" />;
      case 'nbl':
        return <Coins className="w-5 h-5 text-indigo-600" />;
      case 'adbl':
        return <Coins className="w-5 h-5 text-teal-600" />;
      case 'ntc':
        return <Building2 className="w-5 h-5 text-sky-600" />;
      case 'nea':
        return <Building2 className="w-5 h-5 text-amber-600" />;
      case 'epf':
        return <Building2 className="w-5 h-5 text-violet-600" />;
      case 'cit':
        return <Building2 className="w-5 h-5 text-rose-600" />;
      case 'officer':
      case 'nasu':
      case 'kharidar':
        return <Scale className="w-5 h-5 text-amber-600" />;
      default:
        return <Landmark className="w-5 h-5 text-blue-600" />;
    }
  };

  const exams: TargetExam[] = category.examIds
    .map(id => TARGET_EXAMS_DATA[id])
    .filter(Boolean);

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
          <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
          <span className="text-slate-900 dark:text-white font-extrabold">
            {category.titleNe}
          </span>
        </div>

        <button
          type="button"
          onClick={onBackToHome}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs font-bold text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800 transition cursor-pointer self-start sm:self-auto shadow-2xs"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>&larr; पछाडि फर्कनुहोस् (Home)</span>
        </button>
      </div>

      {/* Category Banner Hero */}
      <div className={`rounded-2xl p-5 sm:p-6 border ${category.borderColor} ${category.bgColor} shadow-2xs`}>
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 flex-wrap mb-1.5">
              <span className="w-6 h-6 rounded-full bg-slate-900 dark:bg-white text-white dark:text-slate-900 text-xs font-black flex items-center justify-center">
                {category.numNe}
              </span>
              <span className="px-2.5 py-0.5 rounded-full bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200 font-bold text-[10px] uppercase tracking-wider border border-slate-200 dark:border-slate-700">
                {category.badgeNe}
              </span>
            </div>

            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-xl bg-white dark:bg-slate-800 flex items-center justify-center shadow-2xs shrink-0 border border-slate-200/80 dark:border-slate-700">
                {getCategoryIcon()}
              </div>
              <div>
                <h1 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white">
                  {category.titleNe}
                </h1>
                <p className="text-xs font-semibold text-slate-500 dark:text-slate-400">
                  {category.titleEn}
                </p>
              </div>
            </div>

            <p className="text-xs sm:text-sm text-slate-700 dark:text-slate-300 mt-3 max-w-3xl leading-relaxed">
              {category.descriptionNe}
            </p>
          </div>

          <div className="flex items-center gap-2 text-xs font-bold text-slate-600 dark:text-slate-300 bg-white dark:bg-slate-900 p-3 rounded-xl border border-slate-200 dark:border-slate-800 shrink-0 self-start md:self-center">
            <BookOpen className="w-4 h-4 text-blue-600" />
            <span>कुल {exams.length} वटा आधिकारिक पाठ्यक्रमहरू</span>
          </div>
        </div>
      </div>

      {/* Target Exams List under Category */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-base sm:text-lg font-black text-slate-900 dark:text-white">
            लक्षित परीक्षा छनोट गर्नुहोस् (Choose Specific Exam)
          </h2>
          <span className="text-xs text-slate-500">
            कुनै पनि परीक्षा छानेर विस्तृत चरण र पाठमा जानुहोस्
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {exams.map((exam) => (
            <div
              key={exam.id}
              onClick={() => onSelectExam(exam.id)}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  onSelectExam(exam.id);
                }
              }}
              className="group bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-blue-500 dark:hover:border-blue-500 rounded-2xl p-5 shadow-2xs hover:shadow-md transition-all duration-200 cursor-pointer flex flex-col justify-between"
            >
              <div>
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-slate-50 dark:bg-slate-800 flex items-center justify-center shrink-0 border border-slate-200/60 dark:border-slate-700/60 group-hover:scale-105 transition-transform">
                      {getExamIcon(exam.id)}
                    </div>
                    <div>
                      <span className="inline-block px-2 py-0.5 rounded-md text-[10px] font-black uppercase tracking-wider bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 mb-1">
                        {exam.badgeNe}
                      </span>
                      <h3 className="text-base font-black text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                        {exam.nameNe}
                      </h3>
                    </div>
                  </div>

                  <div className="w-7 h-7 rounded-full bg-slate-50 dark:bg-slate-800 group-hover:bg-blue-600 flex items-center justify-center text-slate-400 group-hover:text-white transition-all shrink-0">
                    <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                  </div>
                </div>

                <div className="mt-3">
                  <div className="text-xs font-bold text-slate-700 dark:text-slate-300">
                    {exam.levelsNe}
                  </div>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 line-clamp-2">
                    {exam.taglineNe}
                  </p>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center gap-2 text-[11px] text-slate-500 dark:text-slate-400">
                  <Layers className="w-3.5 h-3.5 text-blue-500" />
                  <span className="font-semibold text-slate-700 dark:text-slate-300">
                    {exam.totalPhasesCount} चरण परीक्षा (MCQs + लिखित)
                  </span>
                </div>
              </div>

              <div className="mt-4 flex items-center justify-between text-xs font-bold text-blue-600 dark:text-blue-400 group-hover:text-blue-700 dark:group-hover:text-blue-300">
                <span>पाठ्यक्रम र चरणहरू हेर्नुहोस्</span>
                <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
