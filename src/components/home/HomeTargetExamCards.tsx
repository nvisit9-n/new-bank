import React from 'react';
import { 
  Landmark, 
  Building2, 
  Scale, 
  ChevronRight, 
  ArrowRight,
  Sparkles,
  Layers,
  BookOpen
} from 'lucide-react';
import { EXAM_CATEGORIES, ExamCategory } from '../../data/examDrillDownData';

interface HomeTargetExamCardsProps {
  onSelectCategory: (categoryId: 'banking' | 'enterprises' | 'loksewa') => void;
}

export const HomeTargetExamCards: React.FC<HomeTargetExamCardsProps> = ({ onSelectCategory }) => {
  const categories: ExamCategory[] = Object.values(EXAM_CATEGORIES);

  const getCategoryIcon = (iconName: string) => {
    switch (iconName) {
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

  return (
    <div className="space-y-3.5">
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center gap-1.5">
            <span className="px-2 py-0.5 rounded-full bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 font-bold text-[10px] uppercase tracking-wider">
              Target Exam Selection
            </span>
          </div>
          <h2 className="text-lg sm:text-xl font-black text-slate-900 dark:text-white mt-1">
            लक्षित परीक्षा छनोट गर्नुहोस् (Choose Target Exam)
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            आफूले तयारी गरिरहेको क्षेत्र छानेर सम्बन्धित बैंक वा संस्थानको पाठ्यक्रम र पाठहरूमा प्रवेश गर्नुहोस्।
          </p>
        </div>
      </div>

      {/* Grid of the 3 Core Categories Matching Sidebar Navigation */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {categories.map((cat) => (
          <div
            key={cat.id}
            onClick={() => onSelectCategory(cat.id)}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                onSelectCategory(cat.id);
              }
            }}
            className="group relative bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-blue-500/60 dark:hover:border-blue-400/60 rounded-2xl p-5 shadow-2xs hover:shadow-md transition-all duration-200 cursor-pointer flex flex-col justify-between"
          >
            <div>
              {/* Header inside Card: Number Badge + Icon + Arrow */}
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="w-11 h-11 rounded-xl bg-slate-50 dark:bg-slate-800 flex items-center justify-center shrink-0 border border-slate-200/60 dark:border-slate-700/60 group-hover:scale-105 transition-transform">
                    {getCategoryIcon(cat.iconName)}
                  </div>
                  <div>
                    <div className="flex items-center gap-1.5 mb-1">
                      <span className="w-5 h-5 rounded-full bg-slate-900 dark:bg-white text-white dark:text-slate-900 text-[10px] font-black flex items-center justify-center">
                        {cat.numNe}
                      </span>
                      <span className="inline-block px-1.5 py-0.5 rounded-md text-[9px] font-black uppercase tracking-wider bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700">
                        {cat.badgeNe}
                      </span>
                    </div>
                    <h3 className="text-base sm:text-lg font-black text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                      {cat.titleNe}
                    </h3>
                  </div>
                </div>

                <div className="w-8 h-8 rounded-full bg-slate-50 dark:bg-slate-800 group-hover:bg-blue-600 flex items-center justify-center text-slate-400 group-hover:text-white transition-all shrink-0">
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                </div>
              </div>

              {/* Subtext & Description */}
              <div className="mt-3.5">
                <div className="text-xs font-bold text-blue-600 dark:text-blue-400">
                  {cat.subtextNe}
                </div>
                <div className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 mt-0.5">
                  {cat.titleEn}
                </div>
                <p className="text-xs text-slate-600 dark:text-slate-400 mt-2 line-clamp-2 leading-relaxed">
                  {cat.descriptionNe}
                </p>
              </div>

              {/* Institutions / Positions Pill Preview */}
              <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center gap-1.5 text-[11px] text-slate-500 dark:text-slate-400 flex-wrap">
                <Layers className="w-3.5 h-3.5 text-blue-500 shrink-0" />
                <span>कुल {cat.examIds.length} वटा पाठ्यक्रम सूची</span>
              </div>
            </div>

            {/* Bottom Call to Action */}
            <div className="mt-4 flex items-center justify-between text-xs font-bold text-blue-600 dark:text-blue-400 group-hover:text-blue-700 dark:group-hover:text-blue-300">
              <span>संस्थान तथा पदहरू हेर्नुहोस्</span>
              <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
