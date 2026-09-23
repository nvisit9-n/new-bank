import React, { useState } from 'react';
import { 
  ChevronRight, 
  ArrowLeft, 
  BookOpen, 
  Clock, 
  Award, 
  AlertCircle, 
  CheckCircle2, 
  Sparkles,
  FileText,
  HelpCircle,
  Filter
} from 'lucide-react';
import { TargetExam, ExamPhase, ExamTopicDetail, ExamCategory } from '../../data/examDrillDownData';

interface PhaseTopicsPageProps {
  exam: TargetExam;
  phase: ExamPhase;
  category?: ExamCategory;
  onBackToExam: () => void;
  onBackToCategory?: () => void;
  onBackToHome: () => void;
  onSelectTopic: (topicId: string) => void;
}

export const PhaseTopicsPage: React.FC<PhaseTopicsPageProps> = ({
  exam,
  phase,
  category,
  onBackToExam,
  onBackToCategory,
  onBackToHome,
  onSelectTopic
}) => {
  const [selectedSectionFilter, setSelectedSectionFilter] = useState<string>('all');

  const filteredTopics = selectedSectionFilter === 'all'
    ? phase.topics
    : phase.topics.filter(t => t.sectionNe.includes(selectedSectionFilter));

  return (
    <div className="space-y-6 pb-12 animate-fadeIn">
      {/* Top Breadcrumbs & Back Navigation */}
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
            {exam.nameNe}
          </button>
          <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
          <span className="text-slate-900 dark:text-white font-extrabold">
            {phase.phaseTitleNe}
          </span>
        </div>

        <button
          type="button"
          onClick={onBackToExam}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs font-bold text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800 transition cursor-pointer self-start sm:self-auto shadow-2xs"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>&larr; पछाडि फर्कनुहोस् ({exam.shortName} Overview)</span>
        </button>
      </div>

      {/* Phase Banner */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-2xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 font-black text-[10px] uppercase tracking-wider">
                {phase.badgeNe}
              </span>
              <span className="text-xs font-bold text-slate-500">
                {phase.formatNe}
              </span>
            </div>
            <h1 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white mt-1">
              {phase.phaseTitleNe}
            </h1>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 max-w-2xl">
              {phase.descriptionNe}
            </p>
          </div>

          <div className="flex items-center gap-3 p-3 bg-slate-50 dark:bg-slate-800 rounded-xl border border-slate-200/60 dark:border-slate-700/60 shrink-0">
            <div className="text-center px-2">
              <div className="text-[10px] text-slate-400 font-bold uppercase">पूर्णाङ्क</div>
              <div className="text-base font-black text-slate-900 dark:text-white">{phase.fullMarks}</div>
            </div>
            <div className="w-px h-8 bg-slate-200 dark:bg-slate-700" />
            <div className="text-center px-2">
              <div className="text-[10px] text-slate-400 font-bold uppercase">समय</div>
              <div className="text-base font-black text-slate-900 dark:text-white">{phase.timeLimitNe}</div>
            </div>
            {phase.negativeMarkingNe && (
              <>
                <div className="w-px h-8 bg-slate-200 dark:bg-slate-700" />
                <div className="text-center px-2">
                  <div className="text-[10px] text-rose-500 font-bold uppercase">नेगेटिभ</div>
                  <div className="text-xs font-black text-rose-600 dark:text-rose-400">-२०%</div>
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Sections Filter Pills */}
      {phase.sectionsNe && phase.sectionsNe.length > 0 && (
        <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
          <button
            type="button"
            onClick={() => setSelectedSectionFilter('all')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold shrink-0 transition cursor-pointer ${
              selectedSectionFilter === 'all'
                ? 'bg-blue-600 text-white shadow-xs'
                : 'bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-50'
            }`}
          >
            सबै खण्डहरू ({phase.topics.length})
          </button>

          {phase.sectionsNe.map((sec, idx) => {
            const shortSec = sec.split(':')[0] || sec;
            const isSelected = selectedSectionFilter === shortSec;
            return (
              <button
                key={idx}
                type="button"
                onClick={() => setSelectedSectionFilter(shortSec)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold shrink-0 transition cursor-pointer ${
                  isSelected
                    ? 'bg-blue-600 text-white shadow-xs'
                    : 'bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-50'
                }`}
              >
                {sec}
              </button>
            );
          })}
        </div>
      )}

      {/* Topics List Grid */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-base sm:text-lg font-black text-slate-900 dark:text-white">
            पाठ सूची (Topics & Detailed Lessons)
          </h2>
          <span className="text-xs text-slate-500 font-medium">
            {filteredTopics.length} वटा मुख्य विषयहरू
          </span>
        </div>

        {filteredTopics.length === 0 ? (
          <div className="p-8 text-center bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 text-slate-500 text-sm">
            यस खण्डमा हाल विषयहरू थपिँदै छन्। कृपया अन्य खण्ड चयन गर्नुहोस्।
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-3.5">
            {filteredTopics.map((topic, index) => (
              <div
                key={topic.id}
                onClick={() => onSelectTopic(topic.id)}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    onSelectTopic(topic.id);
                  }
                }}
                className="group bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-blue-500 rounded-2xl p-4 sm:p-5 shadow-2xs hover:shadow-md transition-all duration-200 cursor-pointer"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 flex-wrap mb-1">
                      <span className="px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold text-[10px]">
                        {topic.sectionNe.split(':')[0]}
                      </span>
                      <span className="px-2 py-0.5 rounded-md bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 font-black text-[10px]">
                        अङ्कभार: {topic.weightageMarks} अंक
                      </span>
                      <span className="text-[11px] text-slate-400 flex items-center gap-1 font-medium">
                        <Clock className="w-3 h-3" />
                        {topic.readTimeMin} मिनेट
                      </span>
                    </div>

                    <h3 className="text-base font-black text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                      {topic.titleNe}
                    </h3>
                    <p className="text-xs font-medium text-slate-500 dark:text-slate-400 mt-0.5">
                      {topic.titleEn}
                    </p>

                    {/* Quick Preview Bullets */}
                    {topic.keyProvisionsNe && topic.keyProvisionsNe.length > 0 && (
                      <div className="mt-2.5 space-y-1">
                        {topic.keyProvisionsNe.slice(0, 2).map((item, idx) => (
                          <div key={idx} className="flex items-start gap-1.5 text-xs text-slate-600 dark:text-slate-400">
                            <span className="text-blue-500 font-bold leading-none mt-1">•</span>
                            <span className="line-clamp-1">{item}</span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Right Button */}
                  <div className="flex items-center gap-2 shrink-0 self-end sm:self-center">
                    <span className="text-xs font-bold text-blue-600 dark:text-blue-400 group-hover:underline">
                      पाठ अध्ययन गर्नुहोस्
                    </span>
                    <div className="w-8 h-8 rounded-full bg-slate-50 dark:bg-slate-800 group-hover:bg-blue-600 flex items-center justify-center text-slate-400 group-hover:text-white transition-all">
                      <ChevronRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
