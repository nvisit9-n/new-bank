import React, { useState } from 'react';
import { 
  BookOpen, 
  Search, 
  Sparkles, 
  Award, 
  CheckCircle2, 
  Clock, 
  ChevronRight, 
  FileText, 
  Calculator, 
  Scale, 
  HelpCircle, 
  Download, 
  Printer, 
  Bookmark, 
  ShieldCheck, 
  Building2, 
  Landmark, 
  Layers, 
  Zap, 
  Flame, 
  ArrowLeft,
  ChevronDown
} from 'lucide-react';
import { MASTER_BOOKS_DATABASE } from '../../data/masterBooksData';
import { MasterBook, MasterChapter } from '../../types/masterEcosystem';
import { useApp } from '../../context/AppContext';

export const MasterBooksScreen: React.FC = () => {
  const { setActiveTab } = useApp();
  const [selectedBookId, setSelectedBookId] = useState<string>(MASTER_BOOKS_DATABASE[0].id);
  const [selectedChapterId, setSelectedChapterId] = useState<string | null>(null);
  const [activeTabSubView, setActiveTabSubView] = useState<'reading' | 'subjective' | 'numerical' | 'mcq' | 'viva' | 'revision'>('reading');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [filterLevel, setFilterLevel] = useState<string>('all');
  const [filterInstitution, setFilterInstitution] = useState<string>('all');

  const currentBook = MASTER_BOOKS_DATABASE.find(b => b.id === selectedBookId) || MASTER_BOOKS_DATABASE[0];
  const currentChapter = currentBook.chapters.find(c => c.id === selectedChapterId) || currentBook.chapters[0];

  const filteredBooks = MASTER_BOOKS_DATABASE.filter(book => {
    if (filterLevel !== 'all' && !book.targetLevels.includes(filterLevel as any)) return false;
    if (filterInstitution !== 'all' && !book.targetInstitutions.includes(filterInstitution as any)) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return (
        book.titleNepali.toLowerCase().includes(q) ||
        book.titleEnglish.toLowerCase().includes(q) ||
        book.descriptionNepali.toLowerCase().includes(q)
      );
    }
    return true;
  });

  return (
    <div id="master-books-screen" className="space-y-6 pb-16 animate-fadeIn">
      {/* 1. Header Banner - Dark Theme WCAG AA Compliant */}
      <div className="relative overflow-hidden rounded-3xl bg-[#0B192C] text-white border border-slate-700 shadow-xl p-6 sm:p-8">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2 max-w-3xl">
            <div className="flex items-center gap-2.5 flex-wrap">
              <span className="px-3 py-1 rounded-full bg-emerald-950/80 text-emerald-300 border border-emerald-500/50 text-xs font-black">
                आधिकारिक पाठ्यक्रम ३०-बुँदे मास्टर पाठ्यपुस्तक
              </span>
              <span className="px-3 py-1 rounded-full bg-sky-950/80 text-sky-300 border border-sky-500/50 text-xs font-bold">
                NRB • RBB • NBL • ADBL
              </span>
              <span className="px-3 py-1 rounded-full bg-amber-950/80 text-amber-300 border border-amber-500/50 text-xs font-bold">
                तह ३, ४, ५, ६ & अधिकृत
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
              बैंकिङ मास्टर बुक्स (Banking Master Textbooks Engine)
            </h1>
            <p className="text-sm sm:text-base text-[#CBD5E1] leading-relaxed">
              भौतिक इन्स्टिच्युट वा छुट्टै गाइडबुक किन्नु नपर्ने गरी तयार पारिएको पूर्ण स्वअध्ययन पाठ्यपुस्तक। प्रत्येक अध्यायमा सिद्धान्त, नेपालको कानुनी दफाहरू, संख्यात्मक हिसाब, र लोकसेवा ढाँचाका ५/१०/१५ अङ्कका मोडेल उत्तरहरू।
            </p>
          </div>

          <div className="flex flex-wrap md:flex-col items-start md:items-end gap-2 shrink-0">
            <button
              onClick={() => setActiveTab('my-exam')}
              className="px-4 py-2.5 rounded-xl bg-sky-600 hover:bg-sky-500 text-white font-bold text-xs flex items-center gap-2 cursor-pointer shadow-md transition"
            >
              <Zap className="w-4 h-4" />
              <span>मेरो परीक्षा अध्ययन योजना</span>
            </button>
            <button
              onClick={() => setActiveTab('ai-tutor')}
              className="px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs flex items-center gap-2 cursor-pointer shadow-md transition"
            >
              <Sparkles className="w-4 h-4" />
              <span>एआई शिक्षकसँग सोध्नुहोस्</span>
            </button>
          </div>
        </div>
      </div>

      {/* 2. Filter & Selection Toolbar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs">
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="किताब वा अध्याय खोज्नुहोस् (उदा: Banking, CAR, NPL, Accounting)..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 rounded-xl text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-hidden focus:ring-2 focus:ring-sky-500"
          />
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <select
            value={filterInstitution}
            onChange={e => setFilterInstitution(e.target.value)}
            className="px-3 py-2 rounded-xl text-xs font-semibold bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 cursor-pointer"
          >
            <option value="all">सबै बैंक तथा संस्थान (All)</option>
            <option value="NRB">नेपाल राष्ट्र बैंक (NRB)</option>
            <option value="RBB">राष्ट्रिय वाणिज्य बैंक (RBB)</option>
            <option value="NBL">नेपाल बैंक लिमिटेड (NBL)</option>
            <option value="ADBL">कृषि विकास बैंक (ADBL)</option>
          </select>

          <select
            value={filterLevel}
            onChange={e => setFilterLevel(e.target.value)}
            className="px-3 py-2 rounded-xl text-xs font-semibold bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 cursor-pointer"
          >
            <option value="all">सबै तहहरू (All Levels)</option>
            <option value="4">तह ४ (सहायक / Cash)</option>
            <option value="5">तह ५ (वरिष्ठ सहायक)</option>
            <option value="6">तह ६ (अधिकृत तृतीय)</option>
          </select>
        </div>
      </div>

      {/* 3. Horizontal Book Shelves / Selector */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredBooks.map(book => {
          const isSelected = book.id === selectedBookId;
          return (
            <button
              key={book.id}
              onClick={() => {
                setSelectedBookId(book.id);
                setSelectedChapterId(book.chapters[0]?.id || null);
              }}
              className={`p-5 rounded-2xl text-left transition-all duration-200 cursor-pointer border ${
                isSelected
                  ? 'bg-gradient-to-br from-slate-900 to-slate-800 text-white border-sky-400 shadow-lg ring-2 ring-sky-400/40'
                  : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 hover:border-slate-300 text-slate-800 dark:text-slate-100 shadow-xs'
              }`}
            >
              <div className="flex items-start justify-between gap-2">
                <span className={`text-[10px] font-black px-2 py-0.5 rounded-md ${
                  isSelected ? 'bg-sky-900 text-sky-200' : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300'
                }`}>
                  {book.bookCode}
                </span>
                <span className={`text-[11px] font-bold ${isSelected ? 'text-amber-300' : 'text-amber-600'}`}>
                  {book.totalChapters} अध्याय • {book.totalEstimatedHours} घण्टा
                </span>
              </div>

              <h3 className="text-base font-black mt-2 leading-snug">
                {book.titleNepali}
              </h3>
              <p className={`text-xs mt-1 line-clamp-2 ${isSelected ? 'text-slate-300' : 'text-slate-500 dark:text-slate-400'}`}>
                {book.descriptionNepali}
              </p>

              <div className="mt-4 pt-3 border-t border-slate-200 dark:border-slate-800/80 flex items-center justify-between text-xs">
                <span className="font-semibold text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  {book.latestEditionYear}
                </span>
                <span className="font-bold text-sky-600 dark:text-sky-400 flex items-center gap-1">
                  अध्ययन गर्नुहोस् <ChevronRight className="w-3.5 h-3.5" />
                </span>
              </div>
            </button>
          );
        })}
      </div>

      {/* 4. Active Chapter Deep Reader Studio */}
      {currentChapter ? (
        <div className="rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
          {/* Chapter Top Title Bar */}
          <div className="p-6 bg-slate-50 dark:bg-slate-800/50 border-b border-slate-200 dark:border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 flex-wrap mb-1">
                <span className="px-2.5 py-0.5 rounded-md bg-sky-100 dark:bg-sky-950 text-sky-700 dark:text-sky-300 text-xs font-black">
                  अध्याय {currentChapter.chapterNumber}
                </span>
                <span className="text-xs text-slate-500 dark:text-slate-400 flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5" /> {currentChapter.estimatedStudyTimeMinutes} मिनेट अध्ययन
                </span>
                <span className="text-xs text-emerald-600 dark:text-emerald-400 font-bold flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5" /> प्रमाणीकृत स्रोत: {currentChapter.sources[0]?.sourceName || 'नेपाल कानुन आयोग'}
                </span>
              </div>
              <h2 className="text-lg sm:text-xl font-black text-slate-900 dark:text-white">
                {currentChapter.titleNepali}
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                {currentChapter.titleEnglish}
              </p>
            </div>

            {/* Depth Level Tabs */}
            <div className="flex items-center gap-1.5 p-1 rounded-xl bg-slate-200 dark:bg-slate-800 self-start md:self-auto overflow-x-auto">
              <button
                onClick={() => setActiveTabSubView('reading')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer flex items-center gap-1.5 ${
                  activeTabSubView === 'reading' ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-xs' : 'text-slate-600 dark:text-slate-400'
                }`}
              >
                <BookOpen className="w-3.5 h-3.5 text-sky-500" />
                <span>गहन पाठ (Textbook)</span>
              </button>
              <button
                onClick={() => setActiveTabSubView('subjective')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer flex items-center gap-1.5 ${
                  activeTabSubView === 'subjective' ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-xs' : 'text-slate-600 dark:text-slate-400'
                }`}
              >
                <FileText className="w-3.5 h-3.5 text-amber-500" />
                <span>मोडेल उत्तर (५/१०/१५ अङ्क)</span>
              </button>
              <button
                onClick={() => setActiveTabSubView('numerical')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer flex items-center gap-1.5 ${
                  activeTabSubView === 'numerical' ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-xs' : 'text-slate-600 dark:text-slate-400'
                }`}
              >
                <Calculator className="w-3.5 h-3.5 text-emerald-500" />
                <span>संख्यात्मक हिसाब ({currentChapter.numericalSolutions.length})</span>
              </button>
              <button
                onClick={() => setActiveTabSubView('mcq')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer flex items-center gap-1.5 ${
                  activeTabSubView === 'mcq' ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-xs' : 'text-slate-600 dark:text-slate-400'
                }`}
              >
                <Award className="w-3.5 h-3.5 text-purple-500" />
                <span>वस्तुगत MCQs</span>
              </button>
              <button
                onClick={() => setActiveTabSubView('revision')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer flex items-center gap-1.5 ${
                  activeTabSubView === 'revision' ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-xs' : 'text-slate-600 dark:text-slate-400'
                }`}
              >
                <Zap className="w-3.5 h-3.5 text-orange-500" />
                <span>स्मरण सूत्र (Revision)</span>
              </button>
            </div>
          </div>

          {/* Chapter Content Body */}
          <div className="p-6 sm:p-8 space-y-8">
            {activeTabSubView === 'reading' && (
              <div className="space-y-8 max-w-4xl">
                {currentChapter.sections.map((sec, idx) => (
                  <div key={idx} className="space-y-3 pb-6 border-b border-slate-100 dark:border-slate-800 last:border-b-0">
                    <h3 className="text-base sm:text-lg font-black text-slate-900 dark:text-white flex items-center gap-2">
                      <span className="text-sky-600 dark:text-sky-400">{sec.sectionNumber}</span>
                      <span>{sec.titleNepali}</span>
                    </h3>
                    <div className="text-xs sm:text-sm text-slate-700 dark:text-slate-300 leading-relaxed whitespace-pre-line font-normal">
                      {sec.contentMarkdown}
                    </div>

                    {/* Exact Legal Clauses Box */}
                    {sec.exactLegalClauses && sec.exactLegalClauses.length > 0 && (
                      <div className="mt-4 p-4 rounded-2xl bg-amber-50/70 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-800 space-y-2">
                        <span className="text-xs font-black text-amber-800 dark:text-amber-300 uppercase tracking-wider flex items-center gap-1.5">
                          <Scale className="w-4 h-4" /> विशिष्ट कानुनी दफा (Statutory Clause)
                        </span>
                        {sec.exactLegalClauses.map((clause, cIdx) => (
                          <div key={cIdx} className="text-xs space-y-1 text-slate-800 dark:text-slate-200">
                            <strong className="text-slate-900 dark:text-white">{clause.actName} — {clause.sectionClause}:</strong>
                            <p className="italic text-slate-700 dark:text-slate-300">"{clause.legalText}"</p>
                            <p className="text-[11px] text-slate-500 dark:text-slate-400">💡 व्यवहारिक उपयोग: {clause.practicalApplication}</p>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                ))}

                {/* Nepal Macroeconomic Context Box */}
                {currentChapter.nepalContextAnalysis && (
                  <div className="p-5 rounded-2xl bg-sky-50 dark:bg-sky-950/30 border border-sky-200 dark:border-sky-800 space-y-2">
                    <h4 className="text-sm font-black text-sky-900 dark:text-sky-200 flex items-center gap-2">
                      <Landmark className="w-4 h-4 text-sky-600" />
                      नेपालको समकालीन बैंकिङ परिदृश्य र आर्थिक यथार्थ (Nepal Banking Reality)
                    </h4>
                    <p className="text-xs sm:text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
                      {currentChapter.nepalContextAnalysis}
                    </p>
                  </div>
                )}
              </div>
            )}

            {/* Subjective Model Answers Tab (5, 10, 15 Marks) */}
            {activeTabSubView === 'subjective' && (
              <div className="space-y-6 max-w-4xl">
                <div className="p-4 rounded-xl bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-800 text-xs text-amber-800 dark:text-amber-300 font-semibold">
                  📌 लोक सेवा आयोग तथा बैंकिङ परीक्षाको उत्तर लेखन मानक: परिचय, परिभाषा, मुख्य बुँदा, नेपालको सन्दर्भ, चुनौती, समाधान र निष्कर्षको स्पष्ट खाका।
                </div>

                {currentChapter.subjectiveAnswers.map((ans, aIdx) => (
                  <div key={aIdx} className="p-6 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 space-y-4 shadow-xs">
                    <div className="flex items-start justify-between gap-3">
                      <span className="px-3 py-1 rounded-lg bg-sky-600 text-white text-xs font-black">
                        {ans.marks} अङ्कको नमुना उत्तर (पूर्णाङ्क: {ans.marks} | समय: {ans.timeAllocationMinutes} मिनेट)
                      </span>
                    </div>

                    <h3 className="text-base font-black text-slate-900 dark:text-white">
                      प्रश्न: {ans.questionNepali}
                    </h3>

                    <div className="space-y-4 text-xs sm:text-sm text-slate-700 dark:text-slate-300">
                      <div>
                        <strong className="text-slate-900 dark:text-white block mb-1">१. पृष्ठभूमि तथा अवधारणा (Introduction):</strong>
                        <p>{ans.structure.introduction}</p>
                      </div>

                      <div>
                        <strong className="text-slate-900 dark:text-white block mb-1">२. मुख्य बुँदागत व्याख्या (Main Body):</strong>
                        <div className="space-y-2">
                          {ans.structure.mainBodyPoints.map((pt, pIdx) => (
                            <div key={pIdx} className="p-3 rounded-xl bg-slate-50 dark:bg-slate-900/50 border border-slate-200/60 dark:border-slate-800">
                              <span className="font-bold text-slate-900 dark:text-white block">{pt.title}</span>
                              <span className="text-slate-600 dark:text-slate-300 mt-0.5 block">{pt.explanation}</span>
                            </div>
                          ))}
                        </div>
                      </div>

                      {ans.structure.nepalBankingContext && (
                        <div>
                          <strong className="text-slate-900 dark:text-white block mb-1">३. नेपालको सन्दर्भ (Nepalese Context):</strong>
                          <p>{ans.structure.nepalBankingContext}</p>
                        </div>
                      )}

                      {ans.structure.challengesOrGaps && (
                        <div>
                          <strong className="text-slate-900 dark:text-white block mb-1">४. विद्यमान चुनौतीहरू (Key Challenges):</strong>
                          <ul className="list-disc pl-5 space-y-1">
                            {ans.structure.challengesOrGaps.map((ch, cIdx) => (
                              <li key={cIdx}>{ch}</li>
                            ))}
                          </ul>
                        </div>
                      )}

                      <div>
                        <strong className="text-slate-900 dark:text-white block mb-1">५. निष्कर्ष (Conclusion):</strong>
                        <p>{ans.structure.conclusion}</p>
                      </div>
                    </div>

                    {ans.examTips && (
                      <div className="p-3 rounded-xl bg-purple-50 dark:bg-purple-950/20 border border-purple-200 dark:border-purple-800 text-xs text-purple-900 dark:text-purple-300">
                        <strong>🎯 Exam Tips:</strong> {ans.examTips.join(' • ')}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}

            {/* Numerical Tab */}
            {activeTabSubView === 'numerical' && (
              <div className="space-y-6 max-w-4xl">
                {currentChapter.numericalSolutions.length === 0 ? (
                  <div className="text-center py-12 text-slate-500">
                    यस अध्यायमा विशुद्ध सैद्धान्तिक विषयवस्तु रहेको छ। संख्यात्मक हिसाबहरू 'Book 02' तथा 'Numerical Master Book' मा समावेश छन्।
                  </div>
                ) : (
                  currentChapter.numericalSolutions.map((num, nIdx) => (
                    <div key={nIdx} className="p-6 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 space-y-5 shadow-xs">
                      <div className="flex items-center justify-between gap-2">
                        <h3 className="text-base font-black text-slate-900 dark:text-white">
                          {num.title}
                        </h3>
                        <span className="px-3 py-1 rounded-lg bg-emerald-600 text-white text-xs font-black">
                          {num.marks} अङ्क
                        </span>
                      </div>

                      <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-900 text-xs sm:text-sm text-slate-800 dark:text-slate-200 font-medium">
                        <strong>समस्या (Problem Statement):</strong>
                        <p className="mt-1 leading-relaxed">{num.problemStatementNepali}</p>
                      </div>

                      {/* Given Data */}
                      <div>
                        <strong className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase block mb-1.5">
                          दिएको मान (Given Data):
                        </strong>
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                          {num.givenData.map((g, gIdx) => (
                            <div key={gIdx} className="p-2.5 rounded-lg bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-xs">
                              <span className="text-slate-500 dark:text-slate-400 block">{g.variable}</span>
                              <span className="font-black text-slate-900 dark:text-white">{g.value} {g.unit}</span>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Step by Step Solution */}
                      <div className="space-y-3">
                        <strong className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase block">
                          चरणबद्ध समाधान विधि (Step-by-Step Solution):
                        </strong>
                        {num.stepByStepSolution.map(step => (
                          <div key={step.stepNumber} className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800 text-xs sm:text-sm space-y-1">
                            <span className="font-bold text-sky-600 dark:text-sky-400 block">
                              चरण {step.stepNumber}: {step.stepTitle}
                            </span>
                            <p className="font-mono text-slate-900 dark:text-white">{step.calculationText}</p>
                            {step.workingNote && (
                              <p className="text-[11px] text-slate-500 italic">Working Note: {step.workingNote}</p>
                            )}
                          </div>
                        ))}
                      </div>

                      {/* Final Answer & Trap */}
                      <div className="p-4 rounded-xl bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-300 dark:border-emerald-800 text-xs sm:text-sm space-y-2">
                        <strong className="text-emerald-900 dark:text-emerald-300 block">
                          अन्तिम नतिजा (Final Answer): {num.finalAnswerText}
                        </strong>
                        <p className="text-xs text-slate-700 dark:text-slate-300">
                          {num.interpretationAndExamTrap}
                        </p>
                      </div>
                    </div>
                  ))
                )}
              </div>
            )}

            {/* High-Yield MCQs Tab */}
            {activeTabSubView === 'mcq' && (
              <div className="space-y-4 max-w-4xl">
                {currentChapter.highYieldMcqs.map((mcq, mIdx) => (
                  <div key={mIdx} className="p-5 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 space-y-3 shadow-xs">
                    <span className="text-xs font-bold text-sky-600 dark:text-sky-400">
                      प्रश्न नं. {mIdx + 1}
                    </span>
                    <h4 className="text-sm font-black text-slate-900 dark:text-white">
                      {mcq.questionNepali}
                    </h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                      {mcq.options.map(opt => (
                        <div key={opt.key} className={`p-2.5 rounded-xl border ${
                          opt.key === mcq.correctAnswer 
                            ? 'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-400 text-emerald-800 dark:text-emerald-300 font-bold'
                            : 'bg-slate-50 dark:bg-slate-900 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300'
                        }`}>
                          {opt.key}. {opt.textNepali} {opt.key === mcq.correctAnswer && '✓ (सही उत्तर)'}
                        </div>
                      ))}
                    </div>
                    <div className="text-xs text-slate-600 dark:text-slate-400 p-2.5 rounded-lg bg-slate-50 dark:bg-slate-900/60 border border-slate-200/50">
                      💡 <strong>व्याख्या:</strong> {mcq.explanationNepali}
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Revision Summary Tab */}
            {activeTabSubView === 'revision' && (
              <div className="space-y-6 max-w-4xl">
                {currentChapter.revisionSummary.coreMemoryMnemonic && (
                  <div className="p-5 rounded-2xl bg-gradient-to-r from-amber-500 to-orange-600 text-white font-black text-base shadow-md">
                    स्मरण सूत्र (Mnemonic Formula): {currentChapter.revisionSummary.coreMemoryMnemonic}
                  </div>
                )}

                <div className="p-6 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 space-y-4">
                  <h4 className="text-sm font-black text-slate-900 dark:text-white uppercase tracking-wider">
                    द्रुत पुनरावलोकन बुँदाहरू (Quick Revision Summary):
                  </h4>
                  <ul className="space-y-2 text-xs sm:text-sm text-slate-700 dark:text-slate-300">
                    {currentChapter.revisionSummary.bulletSummary.map((b, bIdx) => (
                      <li key={bIdx} className="flex items-start gap-2">
                        <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                        <span>{b}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            )}
          </div>
        </div>
      ) : null}
    </div>
  );
};

export default MasterBooksScreen;
