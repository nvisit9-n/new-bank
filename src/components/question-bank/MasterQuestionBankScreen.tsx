import React, { useState } from 'react';
import { 
  Award, 
  Search, 
  Filter, 
  CheckCircle2, 
  HelpCircle, 
  BookOpen, 
  Clock, 
  Sparkles, 
  Layers, 
  Scale, 
  FileText, 
  Calculator, 
  Landmark, 
  Check, 
  ChevronDown, 
  ChevronUp,
  Bookmark
} from 'lucide-react';
import { MASTER_QUESTION_BANK_DATA, MasterQuestionRecord } from '../../data/masterQuestionBankData';
import { QuestionArchetype, InstitutionId } from '../../types/masterEcosystem';
import { useApp } from '../../context/AppContext';

export const MasterQuestionBankScreen: React.FC = () => {
  const { setActiveTab, addToast } = useApp();
  const [selectedArchetype, setSelectedArchetype] = useState<string>('all');
  const [selectedInstitution, setSelectedInstitution] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [expandedQuestionId, setExpandedQuestionId] = useState<string | null>(null);
  const [userSelections, setUserSelections] = useState<Record<string, string>>({});

  const filteredQuestions = MASTER_QUESTION_BANK_DATA.filter(q => {
    if (selectedArchetype !== 'all') {
      if (selectedArchetype === 'past_exam' && !q.isPreviousExamQuestion) return false;
      if (selectedArchetype !== 'past_exam' && q.archetype !== selectedArchetype) return false;
    }
    if (selectedInstitution !== 'all' && q.institution !== 'ALL' && q.institution !== selectedInstitution) return false;
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      return (
        q.questionNepali.toLowerCase().includes(query) ||
        (q.questionEnglish && q.questionEnglish.toLowerCase().includes(query)) ||
        q.topic.toLowerCase().includes(query)
      );
    }
    return true;
  });

  const toggleExpand = (id: string) => {
    setExpandedQuestionId(prev => prev === id ? null : id);
  };

  const handleSelectOption = (qId: string, optKey: string) => {
    setUserSelections(prev => ({ ...prev, [qId]: optKey }));
  };

  return (
    <div id="master-question-bank-screen" className="space-y-6 pb-16 animate-fadeIn">
      {/* 1. Header Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-[#0B192C] text-white border border-slate-700 shadow-xl p-6 sm:p-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2 max-w-3xl">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="px-3 py-1 rounded-full bg-amber-950/80 text-amber-300 border border-amber-500/50 text-xs font-black flex items-center gap-1.5">
                <Award className="w-3.5 h-3.5" />
                १५-प्रारूप मास्टर प्रश्न बैंक (15-Archetype Question Bank)
              </span>
              <span className="px-3 py-1 rounded-full bg-sky-950/80 text-sky-300 border border-sky-500/50 text-xs font-bold">
                विगतका आधिकारिक प्रश्नहरू सहित
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-white">
              मास्टर प्रश्न बैंक तथा विगतका परीक्षा प्रश्नहरू
            </h1>
            <p className="text-sm text-[#CBD5E1] leading-relaxed">
              वस्तुगत (MCQ), कथन र कारण (Assertion/Reason), जोडा मिलाउने, संख्यात्मक हिसाब, केस स्टडी, र विगतका परीक्षाका ५/१०/१५ अङ्कका आधिकारिक प्रश्नहरू सविस्तार समाधान सहित।
            </p>
          </div>

          <div className="flex flex-col items-center justify-center p-4 rounded-2xl bg-slate-900/90 border border-slate-700 text-center shrink-0 min-w-[150px]">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">कुल प्रश्नहरू</span>
            <span className="text-3xl font-black text-sky-400 my-1">{MASTER_QUESTION_BANK_DATA.length}+</span>
            <span className="text-[10px] text-slate-400">प्रमाणीकृत समाधान सहित</span>
          </div>
        </div>
      </div>

      {/* 2. Filter Bar */}
      <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="विषय वा प्रश्न खोज्नुहोस् (उदा: BAFIA, CRR, NPL, AML)..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 rounded-xl text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-hidden focus:ring-2 focus:ring-sky-500"
          />
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          {/* Archetype Filter */}
          <select
            value={selectedArchetype}
            onChange={e => setSelectedArchetype(e.target.value)}
            className="px-3 py-2 rounded-xl text-xs font-bold bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 cursor-pointer"
          >
            <option value="all">सबै प्रश्न ढाँचा (All Types)</option>
            <option value="past_exam">⭐ विगतका परीक्षा प्रश्नहरू (Past Exams)</option>
            <option value="assertion_reason">कथन र कारण (Assertion/Reason)</option>
            <option value="match_following">जोडा मिलाउने (Match Following)</option>
            <option value="case_study">केस स्टडी (Case Study)</option>
            <option value="numerical">संख्यात्मक हिसाब (Numerical)</option>
            <option value="long_answer_10m">१० अङ्कको उत्तर (10 Marks)</option>
          </select>

          {/* Institution Filter */}
          <select
            value={selectedInstitution}
            onChange={e => setSelectedInstitution(e.target.value)}
            className="px-3 py-2 rounded-xl text-xs font-bold bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 cursor-pointer"
          >
            <option value="all">सबै बैंक (All Institutions)</option>
            <option value="NRB">नेपाल राष्ट्र बैंक (NRB)</option>
            <option value="RBB">राष्ट्रिय वाणिज्य बैंक (RBB)</option>
            <option value="NBL">नेपाल बैंक लिमिटेड (NBL)</option>
            <option value="ADBL">कृषि विकास बैंक (ADBL)</option>
          </select>
        </div>
      </div>

      {/* 3. Question Cards Feed */}
      <div className="space-y-4">
        {filteredQuestions.map(q => {
          const isExpanded = expandedQuestionId === q.id;
          const userChoice = userSelections[q.id];

          return (
            <div 
              key={q.id} 
              className="p-5 sm:p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-4 transition-all"
            >
              {/* Question Meta Badges */}
              <div className="flex items-center justify-between gap-2 flex-wrap">
                <div className="flex items-center gap-2 flex-wrap">
                  {q.isPreviousExamQuestion && (
                    <span className="px-2.5 py-0.5 rounded-md bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-300 text-[11px] font-black border border-amber-300 dark:border-amber-700">
                      ★ विगतको प्रश्न ({q.examYearBS} BS • {q.institution})
                    </span>
                  )}
                  <span className="px-2 py-0.5 rounded-md bg-sky-100 dark:bg-sky-950 text-sky-700 dark:text-sky-300 text-[11px] font-bold">
                    {q.subject} • {q.topic}
                  </span>
                  <span className="px-2 py-0.5 rounded-md bg-purple-100 dark:bg-purple-950 text-purple-700 dark:text-purple-300 text-[11px] font-bold">
                    पूर्णाङ्क: {q.marks}
                  </span>
                  <span className="text-[11px] text-slate-500 dark:text-slate-400 flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5" /> {q.timeEstimateMinutes} मिनेट
                  </span>
                </div>

                <span className="text-xs text-emerald-600 dark:text-emerald-400 font-semibold">
                  स्रोत: {q.sourceCitation}
                </span>
              </div>

              {/* Question Statement */}
              <div className="space-y-1">
                <h3 className="text-sm sm:text-base font-black text-slate-900 dark:text-white leading-snug">
                  {q.questionNepali}
                </h3>
                {q.questionEnglish && (
                  <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">
                    {q.questionEnglish}
                  </p>
                )}
              </div>

              {/* Assertion & Reason Display */}
              {q.archetype === 'assertion_reason' && (
                <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-2 text-xs sm:text-sm">
                  <div className="font-bold text-slate-900 dark:text-white">{q.assertionText}</div>
                  <div className="font-bold text-slate-900 dark:text-white">{q.reasonText}</div>
                </div>
              )}

              {/* Match The Following Display */}
              {q.archetype === 'match_following' && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 text-xs sm:text-sm">
                  <div>
                    <strong className="block mb-1 text-slate-900 dark:text-white">समूह I:</strong>
                    {q.columnA?.map(item => (
                      <div key={item.id} className="py-0.5 text-slate-700 dark:text-slate-300">{item.label}</div>
                    ))}
                  </div>
                  <div>
                    <strong className="block mb-1 text-slate-900 dark:text-white">समूह II:</strong>
                    {q.columnB?.map(item => (
                      <div key={item.id} className="py-0.5 text-slate-700 dark:text-slate-300">{item.id}. {item.label}</div>
                    ))}
                  </div>
                </div>
              )}

              {/* MCQ Options If Present */}
              {q.options && q.options.length > 0 && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {q.options.map(opt => {
                    const isSelected = userChoice === opt.key;
                    const isCorrect = opt.key === q.correctAnswerKey;
                    const showResult = Boolean(userChoice);

                    let btnStyle = 'bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200';
                    if (showResult) {
                      if (isCorrect) {
                        btnStyle = 'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-500 text-emerald-800 dark:text-emerald-300 font-bold';
                      } else if (isSelected && !isCorrect) {
                        btnStyle = 'bg-rose-50 dark:bg-rose-950/40 border-rose-500 text-rose-800 dark:text-rose-300';
                      }
                    }

                    return (
                      <button
                        key={opt.key}
                        onClick={() => handleSelectOption(q.id, opt.key)}
                        className={`p-3 rounded-xl text-left text-xs font-medium border transition cursor-pointer flex items-center justify-between ${btnStyle}`}
                      >
                        <span>
                          <strong className="mr-1.5">{opt.key}.</strong> {opt.text}
                        </span>
                        {showResult && isCorrect && <Check className="w-4 h-4 text-emerald-500 shrink-0" />}
                      </button>
                    );
                  })}
                </div>
              )}

              {/* Action Toolbar & Expand Solutions */}
              <div className="flex items-center justify-between gap-3 pt-2 border-t border-slate-100 dark:border-slate-800">
                <button
                  onClick={() => toggleExpand(q.id)}
                  className="text-xs font-bold text-sky-600 dark:text-sky-400 hover:text-sky-500 flex items-center gap-1.5 cursor-pointer"
                >
                  <span>{isExpanded ? 'समाधान लुकाउनुहोस्' : 'सविस्तार समाधान तथा व्याख्या हेर्नुहोस्'}</span>
                  {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                </button>

                <button
                  onClick={() => addToast('प्रश्न बुकमार्कमा सुरक्षित गरियो!', 'success')}
                  className="text-xs text-slate-500 hover:text-slate-700 dark:hover:text-slate-300 flex items-center gap-1 cursor-pointer"
                >
                  <Bookmark className="w-3.5 h-3.5" />
                  <span>बुकमार्क</span>
                </button>
              </div>

              {/* Expandable Model Answer / Detailed Solution */}
              {isExpanded && (
                <div className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 text-xs sm:text-sm space-y-3 animate-fadeIn">
                  {/* Subjective Model Outline */}
                  {q.modelAnswerOutline && (
                    <div className="space-y-2">
                      <strong className="text-slate-900 dark:text-white block">
                        १. परिचय (Introduction):
                      </strong>
                      <p className="text-slate-700 dark:text-slate-300">{q.modelAnswerOutline.introduction}</p>

                      <strong className="text-slate-900 dark:text-white block pt-1">
                        २. मुख्य बुँदाहरू (Key Execution Points):
                      </strong>
                      <ul className="list-disc pl-5 space-y-1 text-slate-700 dark:text-slate-300">
                        {q.modelAnswerOutline.keyPoints.map((pt, idx) => (
                          <li key={idx}>{pt}</li>
                        ))}
                      </ul>

                      {q.modelAnswerOutline.nepalContext && (
                        <p className="text-slate-700 dark:text-slate-300 pt-1">
                          <strong>नेपालको सन्दर्भ:</strong> {q.modelAnswerOutline.nepalContext}
                        </p>
                      )}

                      <p className="text-slate-700 dark:text-slate-300 pt-1">
                        <strong>निष्कर्ष:</strong> {q.modelAnswerOutline.conclusion}
                      </p>
                    </div>
                  )}

                  {/* Numerical Step Solution */}
                  {q.stepByStepSolution && (
                    <div className="space-y-1.5 font-mono">
                      <strong className="text-slate-900 dark:text-white font-sans block mb-1">
                        चरणबद्ध गणना विधि:
                      </strong>
                      {q.stepByStepSolution.map((st, sIdx) => (
                        <div key={sIdx} className="p-2 rounded-lg bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-200">
                          {st}
                        </div>
                      ))}
                      {q.finalAnswer && (
                        <div className="p-2.5 rounded-lg bg-emerald-50 dark:bg-emerald-950/40 text-emerald-800 dark:text-emerald-300 font-bold font-sans mt-2">
                          अन्तिम नतिजा: {q.finalAnswer}
                        </div>
                      )}
                    </div>
                  )}

                  {/* General Explanation */}
                  {q.explanationNepali && (
                    <div className="p-3 rounded-xl bg-sky-50 dark:bg-sky-950/30 text-sky-900 dark:text-sky-300 text-xs">
                      💡 <strong>प्राज्ञिक व्याख्या:</strong> {q.explanationNepali}
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

export default MasterQuestionBankScreen;
