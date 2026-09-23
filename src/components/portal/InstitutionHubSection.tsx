import React, { useState } from 'react';
import { 
  Building2, 
  Landmark, 
  Scale, 
  ArrowRight, 
  Award, 
  BookOpen, 
  CheckCircle2, 
  ExternalLink, 
  FileText, 
  Play, 
  Clock, 
  Target, 
  ShieldCheck, 
  AlertCircle 
} from 'lucide-react';
import { INSTITUTION_DATA_HUB, InstitutionHubItem } from '../../data/portalData';
import { useApp } from '../../context/AppContext';
import { getQuestionsByCategory, convertQuizQuestionToQuestion } from '../../data/quizData';
import { QuizSet } from '../../types';

export interface InstitutionHubSectionProps {
  className?: string;
  onSelectInstitution?: (institutionId: string) => void;
}

export const InstitutionHubSection: React.FC<InstitutionHubSectionProps> = ({ 
  className = '',
  onSelectInstitution 
}) => {
  const { startQuiz, setActiveTab, openNoteReader, addToast } = useApp();
  const [selectedInstId, setSelectedInstId] = useState<string>('nrb');

  const institutions = Object.values(INSTITUTION_DATA_HUB);
  const currentInst = INSTITUTION_DATA_HUB[selectedInstId] || institutions[0];

  const handleStartExamMock = () => {
    const pulled = getQuestionsByCategory(currentInst.quizCategory, 15, 'Medium');
    const questions = pulled.map(convertQuizQuestionToQuestion);

    const quizSet: QuizSet = {
      id: `portal-mock-${currentInst.id}-${Date.now()}`,
      title: `${currentInst.shortName} विशेष पूर्वयोग्यता (Pre-Test) नमुना सेट`,
      description: `${currentInst.nameNe} को वास्तविक परीक्षा संरचनामा आधारित १५ उच्च सम्भावित प्रश्नहरू।`,
      category: currentInst.quizCategory,
      difficulty: 'Medium',
      mode: 'practice',
      timeLimitMinutes: 15,
      questions,
      badge: currentInst.shortName
    };

    startQuiz(quizSet);
    addToast(`${currentInst.shortName} परीक्षा सेट सुरु भयो! शुभकामना!`, 'info');
  };

  return (
    <div 
      id="institution-exam-hub" 
      className={`bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 sm:p-6 shadow-sm ${className}`}
    >
      {/* Top Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 pb-5 border-b border-slate-100 dark:border-slate-800">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-bold bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 border border-blue-200/60 dark:border-blue-800/60">
              <Building2 className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
              बैंक तथा लोकसेवा परीक्षा विशेष हब
            </span>
            <span className="text-xs text-slate-500 dark:text-slate-400">
              NRB, RBB, ADBL, NBL & Loksewa
            </span>
          </div>
          <h2 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <Landmark className="w-5 h-5 text-blue-600 dark:text-blue-400" />
            <span>प्रमुख बैंक तथा संस्थान समर्पित परीक्षा मोड्युलहरू</span>
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 mt-1">
            पाठ्यक्रम विश्लेषण, पूर्वयोग्यता परीक्षा ढाँचा, नेगेटिभ मार्किङ नियम, र प्रत्यक्ष नमुना परीक्षा
          </p>
        </div>

        {/* Start Mock Quiz Quick Button */}
        <button
          onClick={handleStartExamMock}
          className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl font-bold text-xs sm:text-sm text-white bg-blue-600 hover:bg-blue-700 shadow-sm transition-all transform active:scale-95 cursor-pointer shrink-0"
        >
          <Play className="w-4 h-4 fill-white" />
          <span>{currentInst.shortName} Pre-Test नमुना सेट सुरु गर्नुहोस्</span>
        </button>
      </div>

      {/* Institution Tabs */}
      <div className="mt-5 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2">
        {institutions.map((inst) => {
          const isSelected = selectedInstId === inst.id;
          return (
            <button
              key={inst.id}
              onClick={() => {
                setSelectedInstId(inst.id);
                onSelectInstitution?.(inst.id);
              }}
              className={`p-3 rounded-xl border text-left transition-all cursor-pointer flex flex-col justify-between ${
                isSelected
                  ? 'border-blue-600 dark:border-blue-500 bg-blue-50/70 dark:bg-blue-950/40 ring-2 ring-blue-500/20 shadow-xs'
                  : 'border-slate-200 dark:border-slate-800 bg-slate-50/60 dark:bg-slate-850 hover:border-slate-300 dark:hover:border-slate-700'
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <span className="w-8 h-8 rounded-lg bg-blue-600 text-white font-extrabold flex items-center justify-center text-xs shadow-xs">
                  {inst.logoLetter}
                </span>
                <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${isSelected ? 'bg-blue-600 text-white' : 'bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300'}`}>
                  {inst.shortName}
                </span>
              </div>
              <div>
                <h4 className="font-bold text-xs text-slate-900 dark:text-white truncate">
                  {inst.nameNe}
                </h4>
                <p className="text-[10px] text-slate-500 dark:text-slate-400 truncate mt-0.5">
                  स्थापना: {inst.established}
                </p>
              </div>
            </button>
          );
        })}
      </div>

      {/* Active Institution Detail Panel */}
      <div className="mt-6 p-4 sm:p-5 rounded-2xl bg-slate-50/80 dark:bg-slate-850 border border-slate-200 dark:border-slate-800">
        {/* Banner with Meta Info */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-200 dark:border-slate-800">
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 bg-blue-600 text-white rounded text-xs font-bold">
                {currentInst.badge}
              </span>
              <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">
                केन्द्रीय कार्यालय: {currentInst.headquartersNe}
              </span>
            </div>
            <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white mt-1">
              {currentInst.nameNe} ({currentInst.nameEn})
            </h3>
            <p className="text-xs text-slate-600 dark:text-slate-300 italic mt-0.5">
              "{currentInst.taglineNe}"
            </p>
          </div>

          <div className="flex items-center gap-2 self-start sm:self-auto">
            <a
              href={currentInst.officialCareerUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-700 transition"
            >
              <span>आधिकारिक पदपूर्ति पोर्टल</span>
              <ExternalLink className="w-3.5 h-3.5 text-blue-500" />
            </a>
          </div>
        </div>

        {/* 2-Column Responsive Layout for Levels & Exam Details */}
        <div className="mt-5 grid grid-cols-1 lg:grid-cols-2 gap-5">
          {/* Left Column: Key Levels & Exam Pattern */}
          <div className="space-y-4">
            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-2 flex items-center gap-1.5">
                <Target className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
                <span>प्रमुख तहहरू तथा योग्यता (Key Examination Levels)</span>
              </h4>
              <div className="space-y-2">
                {currentInst.keyLevels.map((lvl, idx) => (
                  <div 
                    key={idx}
                    className="p-3 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex items-center justify-between"
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="px-2 py-0.5 rounded text-[11px] font-black bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300">
                          {lvl.level}
                        </span>
                        <span className="font-bold text-xs sm:text-sm text-slate-900 dark:text-white">
                          {lvl.designationNe}
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">
                        योग्यता: {lvl.qualification}
                      </p>
                    </div>

                    <div className="text-right shrink-0">
                      <span className="text-xs font-bold text-slate-900 dark:text-white block">
                        {lvl.preTestMarks} पूर्णाङ्क
                      </span>
                      <span className="text-[10px] text-slate-500 dark:text-slate-400">
                        {lvl.timeMinutes} मिनेट
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Exam Pattern & Negative Marking Box */}
            <div className="p-3.5 rounded-xl bg-amber-50/70 dark:bg-amber-950/30 border border-amber-200/80 dark:border-amber-900/40">
              <h5 className="font-bold text-xs text-amber-900 dark:text-amber-200 flex items-center gap-1.5 mb-1.5">
                <AlertCircle className="w-4 h-4 text-amber-600 dark:text-amber-400" />
                <span>परीक्षा संरचना र नेगेटिभ मार्किङ नियम</span>
              </h5>
              <ul className="text-xs text-amber-900 dark:text-amber-200 space-y-1">
                <li>• <strong>प्रथम चरण:</strong> {currentInst.examPattern.firstPaper}</li>
                <li>• <strong>उत्तीर्णाङ्क:</strong> {currentInst.examPattern.passMarks}</li>
                <li>• <strong>नेगेटिभ मार्किङ:</strong> {currentInst.examPattern.negativeMarking}</li>
              </ul>
            </div>
          </div>

          {/* Right Column: Key Syllabus Topics & Mandatory Acts */}
          <div className="space-y-4">
            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-2 flex items-center gap-1.5">
                <BookOpen className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
                <span>उच्च प्राथमिकता पाठ्यक्रम विषयहरू (High Priority Topics)</span>
              </h4>
              <div className="p-3 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-2">
                {currentInst.keySyllabusTopics.map((topic, idx) => (
                  <div key={idx} className="flex items-start gap-2 text-xs text-slate-700 dark:text-slate-200">
                    <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                    <span>{topic}</span>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-2 flex items-center gap-1.5">
                <FileText className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
                <span>अध्ययन गर्नैपर्ने अनिवार्य ऐनहरू (Mandatory Acts)</span>
              </h4>
              <div className="flex flex-wrap gap-2">
                {currentInst.mandatoryActs.map((act, idx) => (
                  <button
                    key={idx}
                    onClick={() => setActiveTab('free-notes')}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-200 border border-slate-200 dark:border-slate-700 hover:border-blue-500 dark:hover:border-blue-500 transition cursor-pointer"
                  >
                    <span>{act}</span>
                    <ArrowRight className="w-3 h-3 text-blue-500" />
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
