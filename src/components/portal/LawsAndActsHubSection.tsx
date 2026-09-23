import React, { useState } from 'react';
import { 
  Scale, 
  Bookmark, 
  BookmarkCheck, 
  BookOpen, 
  HelpCircle, 
  CheckCircle2, 
  ExternalLink, 
  FileText, 
  ArrowRight,
  ShieldCheck,
  Star,
  Sparkles
} from 'lucide-react';
import { DIRECT_LAWS_DATA, LawActDetail } from '../../data/portalData';
import { useApp } from '../../context/AppContext';
import { getQuestionsByCategory, convertQuizQuestionToQuestion } from '../../data/quizData';

export interface LawsAndActsHubSectionProps {
  className?: string;
}

export const LawsAndActsHubSection: React.FC<LawsAndActsHubSectionProps> = ({ 
  className = '' 
}) => {
  const { 
    bookmarks, 
    toggleBookmark, 
    isBookmarked,
    openNoteReader, 
    setActiveTab, 
    startQuiz, 
    addToast 
  } = useApp();

  const laws = DIRECT_LAWS_DATA;
  const [selectedLawId, setSelectedLawId] = useState<string>('bafia-2073');

  const currentLaw = laws.find(l => l.id === selectedLawId) || laws[0];

  const isCurrentLawBookmarked = isBookmarked ? isBookmarked('note', currentLaw.id) : bookmarks.some(
    b => b.targetId === currentLaw.id || b.id === currentLaw.id
  );

  const handleToggleLawBookmark = () => {
    const newState = toggleBookmark('note', currentLaw.id, currentLaw.titleNe, 'Banking');
    addToast(
      newState ? 'ऐन बुकमार्कमा सुरक्षित गरियो (Cloud Synced)' : 'ऐन बुकमार्कबाट हटाइयो',
      newState ? 'success' : 'info'
    );
  };

  return (
    <div 
      id="laws-acts-hub" 
      className={`bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 sm:p-6 shadow-sm ${className}`}
    >
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-5 border-b border-slate-100 dark:border-slate-800">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-50 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300 border border-amber-200/60 dark:border-amber-800/60">
              <Scale className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />
              बैंकिङ कानुन तथा ऐन नियम हब
            </span>
            <span className="text-xs text-slate-500 dark:text-slate-400">
              Laws, Acts & Frequent Exam Questions
            </span>
          </div>
          <h2 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <Scale className="w-5 h-5 text-amber-600 dark:text-amber-400" />
            <span>प्रमुख बैंकिङ ऐनहरू: महत्वपूर्ण दफाहरू र परीक्षा प्रश्नहरू</span>
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 mt-1">
            BAFIA, NRB Act, AML/CFT, बैंकिङ कसूर, कम्पनी ऐन र विनिमय अधिकारपत्र ऐनको गहन विश्लेषण
          </p>
        </div>

        {/* Action Button: Bookmark or Read Note */}
        <div className="flex items-center gap-2">
          <button
            onClick={handleToggleLawBookmark}
            className={`inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold transition cursor-pointer border ${
              isCurrentLawBookmarked
                ? 'bg-amber-50 dark:bg-amber-950 text-amber-700 dark:text-amber-300 border-amber-300 dark:border-amber-700'
                : 'bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 border-slate-200 dark:border-slate-700'
            }`}
            title="यस ऐनलाई आफ्नो व्यक्तिगत बुकमार्कमा सेभ गर्नुहोस्"
          >
            {isCurrentLawBookmarked ? (
              <>
                <BookmarkCheck className="w-4 h-4 text-amber-600 dark:text-amber-400" />
                <span>सुरक्षित छ (Bookmarked)</span>
              </>
            ) : (
              <>
                <Bookmark className="w-4 h-4 text-slate-500 dark:text-slate-400" />
                <span>ऐन बुकमार्क गर्नुहोस्</span>
              </>
            )}
          </button>

          {currentLaw.relatedNoteId && (
            <button
              onClick={() => openNoteReader(currentLaw.relatedNoteId!)}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold bg-blue-600 hover:bg-blue-700 text-white shadow-xs transition cursor-pointer"
            >
              <BookOpen className="w-4 h-4" />
              <span>विस्तृत नोट पढ्नुहोस्</span>
            </button>
          )}
        </div>
      </div>

      {/* Direct Act Tab Navigation */}
      <div className="mt-5 flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
        {laws.map((law) => {
          const isSelected = selectedLawId === law.id;
          return (
            <button
              key={law.id}
              onClick={() => setSelectedLawId(law.id)}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer flex items-center gap-2 border ${
                isSelected
                  ? 'bg-amber-600 text-white border-amber-600 shadow-xs'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:bg-slate-200 dark:hover:bg-slate-750'
              }`}
            >
              <span>{law.shortCode}</span>
              <span className={`text-[10px] px-1.5 py-0.2 rounded ${isSelected ? 'bg-white/20 text-white' : 'bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-300'}`}>
                {law.totalSections} दफा
              </span>
            </button>
          );
        })}
      </div>

      {/* Active Act Summary Banner */}
      <div className="mt-4 p-4 rounded-xl bg-slate-50 dark:bg-slate-850 border border-slate-200 dark:border-slate-800">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="px-2 py-0.5 rounded text-[11px] font-bold bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-300">
                {currentLaw.significanceRating} Priority
              </span>
              <span className="text-xs text-slate-500 dark:text-slate-400">
                प्रमाणीकरण/लागू: {currentLaw.enactedBikram} ({currentLaw.amendmentInfo})
              </span>
            </div>
            <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white">
              {currentLaw.titleNe}
            </h3>
            <p className="text-xs text-slate-600 dark:text-slate-300 mt-1">
              <strong>मुख्य उद्देश्य:</strong> {currentLaw.primaryFocus}
            </p>
          </div>

          <div className="flex items-center gap-4 text-xs font-bold text-slate-600 dark:text-slate-300 shrink-0">
            <div className="text-center px-3 py-1.5 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
              <div className="text-slate-900 dark:text-white text-base font-black">{currentLaw.totalChapters}</div>
              <div className="text-[10px] text-slate-400">कुल परिच्छेद</div>
            </div>
            <div className="text-center px-3 py-1.5 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
              <div className="text-slate-900 dark:text-white text-base font-black">{currentLaw.totalSections}</div>
              <div className="text-[10px] text-slate-400">कुल दफा</div>
            </div>
          </div>
        </div>
      </div>

      {/* 2-Column Grid: Landmark Sections vs Frequent Exam Questions */}
      <div className="mt-5 grid grid-cols-1 lg:grid-cols-2 gap-5">
        {/* Left: Landmark Sections (दफाहरू) */}
        <div>
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-3 flex items-center gap-1.5">
            <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
            <span>परीक्षाका दृष्टिले महत्वपूर्ण मुख्य दफाहरू (Landmark Sections)</span>
          </h4>
          <div className="space-y-2.5">
            {currentLaw.keySections.map((sec, idx) => (
              <div 
                key={idx}
                className="p-3.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-amber-300 dark:hover:border-amber-700 transition"
              >
                <div className="flex items-center justify-between mb-1.5">
                  <span className="font-extrabold text-xs text-amber-700 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/60 px-2 py-0.5 rounded">
                    {sec.sectionNum}
                  </span>
                  {sec.isExamFavorite && (
                    <span className="text-[10px] font-bold text-rose-600 dark:text-rose-400 bg-rose-50 dark:bg-rose-950/50 px-1.5 py-0.2 rounded flex items-center gap-1">
                      <Sparkles className="w-3 h-3" />
                      <span>Exam Favorite</span>
                    </span>
                  )}
                </div>
                <h5 className="font-bold text-xs sm:text-sm text-slate-900 dark:text-white">
                  {sec.titleNe}
                </h5>
                <p className="text-xs text-slate-600 dark:text-slate-300 mt-1 leading-relaxed">
                  {sec.summaryNe}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Right: Frequently Asked Past Subjective & Objective Questions */}
        <div>
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-3 flex items-center gap-1.5">
            <HelpCircle className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
            <span>विगतका परीक्षाहरूमा सोधिएका महत्वपूर्ण प्रश्नहरू</span>
          </h4>
          <div className="space-y-3">
            {currentLaw.frequentExamQuestions.map((q, idx) => (
              <div 
                key={idx}
                className="p-4 rounded-xl bg-blue-50/50 dark:bg-blue-950/20 border border-blue-200/80 dark:border-blue-900/40"
              >
                <div className="flex items-center justify-between gap-2 mb-2">
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-blue-600 text-white">
                    {q.type} Question
                  </span>
                  <div className="flex items-center gap-1">
                    {q.frequentlyAskedBy.map((bank, bIdx) => (
                      <span key={bIdx} className="text-[10px] font-bold text-blue-700 dark:text-blue-300 bg-white dark:bg-slate-900 px-1.5 py-0.5 rounded border border-blue-200 dark:border-blue-800">
                        {bank}
                      </span>
                    ))}
                  </div>
                </div>
                <p className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white leading-relaxed">
                  {q.questionNe}
                </p>
              </div>
            ))}

            {/* Quick Practice Prompt */}
            <div className="p-4 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 text-white flex items-center justify-between gap-3 shadow-xs">
              <div>
                <h5 className="font-bold text-xs sm:text-sm">यस ऐनसँग सम्बन्धित वस्तुगत प्रश्नहरू हल गर्नुहोस्</h5>
                <p className="text-[11px] text-blue-100 mt-0.5">नियमित अभ्यासले मात्र परीक्षामा दफा सम्झिन सकिन्छ।</p>
              </div>
              <button
                onClick={() => {
                  const pulled = getQuestionsByCategory('Banking', 10, 'Medium');
                  startQuiz({
                    id: `law-quiz-${currentLaw.id}-${Date.now()}`,
                    title: `${currentLaw.shortCode} विशेष कानुन सेट`,
                    description: `${currentLaw.titleNe} मा आधारित १० वस्तुगत प्रश्नहरू`,
                    category: 'Banking',
                    difficulty: 'Medium',
                    mode: 'practice',
                    timeLimitMinutes: 10,
                    questions: pulled.map(convertQuizQuestionToQuestion),
                    badge: currentLaw.shortCode
                  });
                }}
                className="px-3 py-1.5 rounded-lg bg-white text-blue-700 font-bold text-xs hover:bg-blue-50 transition cursor-pointer shrink-0"
              >
                क्विज सुरु
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
