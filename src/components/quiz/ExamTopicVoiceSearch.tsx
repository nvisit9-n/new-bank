import React, { useState, useMemo } from 'react';
import { 
  Search, 
  X, 
  Sparkles, 
  Play, 
  BookOpen, 
  CheckCircle2, 
  ChevronRight,
  Target,
  Layers,
  HelpCircle,
  Clock
} from 'lucide-react';
import { SYLLABUS_MODULES, ALL_QUIZ_QUESTIONS } from '../../data/quizData';
import { SubjectCategory, QuizMode } from '../../types';
import { VoiceSearchButton } from '../common/VoiceSearchButton';

type SyllabusModuleType = typeof SYLLABUS_MODULES[number];

interface ExamTopicVoiceSearchProps {
  onSelectTopic: (category: SubjectCategory, moduleName: string, subTopicName?: string) => void;
  onLaunchTopicQuiz: (category: SubjectCategory, moduleName: string, subTopicName?: string) => void;
  selectedCount?: number;
}

export const ExamTopicVoiceSearch: React.FC<ExamTopicVoiceSearchProps> = ({
  onSelectTopic,
  onLaunchTopicQuiz,
  selectedCount = 10
}) => {
  const [query, setQuery] = useState('');

  const trimmedQuery = query.trim().toLowerCase();

  // Search through all syllabus modules and their subtopics
  const matchedResults = useMemo(() => {
    if (!trimmedQuery) return [];

    const results: {
      module: SyllabusModuleType;
      matchedSubTopic?: { id: string; nameNepali: string; nameEnglish: string; weightagePercent: number };
      matchType: 'module' | 'subtopic' | 'category' | 'description';
    }[] = [];

    SYLLABUS_MODULES.forEach(mod => {
      const modNameNe = mod.nameNepali.toLowerCase();
      const modNameEn = mod.nameEnglish.toLowerCase();
      const modCategory = (mod.category || '').toLowerCase();
      const modDesc = mod.description.toLowerCase();

      // Check subtopics first
      let subMatched = false;
      for (const sub of mod.subTopics) {
        if (
          sub.nameNepali.toLowerCase().includes(trimmedQuery) ||
          sub.nameEnglish.toLowerCase().includes(trimmedQuery)
        ) {
          results.push({
            module: mod,
            matchedSubTopic: sub,
            matchType: 'subtopic'
          });
          subMatched = true;
        }
      }

      // Check module title and category
      if (modNameNe.includes(trimmedQuery) || modNameEn.includes(trimmedQuery)) {
        if (!subMatched) {
          results.push({
            module: mod,
            matchType: 'module'
          });
        }
      } else if (modCategory.includes(trimmedQuery)) {
        if (!subMatched) {
          results.push({
            module: mod,
            matchType: 'category'
          });
        }
      } else if (modDesc.includes(trimmedQuery) && !subMatched) {
        results.push({
          module: mod,
          matchType: 'description'
        });
      }
    });

    return results;
  }, [trimmedQuery]);

  const handleVoiceTranscript = (spokenText: string) => {
    setQuery(spokenText);
  };

  const popularVoicePrompts = [
    { label: 'मौद्रिक नीति', query: 'मौद्रिक नीति' },
    { label: 'सार्वजनिक संस्थान', query: 'सार्वजनिक संस्थान' },
    { label: 'बैंकिङ कसूर', query: 'बैंकिङ कसूर' },
    { label: 'BAFIA २०७३', query: 'BAFIA' },
    { label: 'साइबर सुरक्षा', query: 'साइबर सुरक्षा' },
    { label: 'नेपालको भूगोल', query: 'भूगोल' },
    { label: 'व्यावहारिक गणित', query: 'गणित' },
    { label: 'संविधान र मौलिक हक', query: 'संविधान' }
  ];

  return (
    <div className="p-4 sm:p-5 rounded-3xl bg-gradient-to-br from-slate-900 via-[#0B2046] to-slate-900 border border-sky-500/30 text-white shadow-xl space-y-4">
      
      {/* Header with Voice-to-Text Feature Highlight */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-white/10 pb-3">
        <div className="space-y-0.5">
          <div className="flex items-center gap-2">
            <span className="px-2 py-0.5 rounded-full bg-rose-500/20 text-rose-300 border border-rose-500/30 text-[10px] font-black uppercase tracking-wider flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-rose-400 animate-ping" />
              Voice-to-Text Powered
            </span>
            <span className="text-[11px] text-sky-300 font-bold">Web Speech API</span>
          </div>
          <h3 className="text-base sm:text-lg font-black tracking-tight text-white flex items-center gap-2">
            <span>आवाजद्वारा परीक्षा विषय खोजी (Voice Topic Search)</span>
          </h3>
          <p className="text-xs text-slate-300">
            माइक बटन थिचेर परीक्षा विषय (जस्तै: मौद्रिक नीति, BAFIA, सार्वजनिक संस्थान, गणित) बोल्नुहोस्।
          </p>
        </div>

        {/* Voice Trigger with Mic */}
        <div className="flex items-center gap-2 self-start sm:self-auto">
          <VoiceSearchButton
            onTranscript={handleVoiceTranscript}
            darkBackground
            size="lg"
            tooltipText="परीक्षा विषय बोल्न यहाँ थिच्नुहोस्"
          />
          <span className="text-xs font-bold text-sky-300 hidden sm:inline">
            बोलेर खोज्नुहोस्
          </span>
        </div>
      </div>

      {/* Search Input Bar with embedded Voice button */}
      <div className="relative flex items-center">
        <Search className="absolute left-3.5 w-4 h-4 text-slate-400 pointer-events-none" />
        
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="परीक्षा विषय वा उप-विषय बोल्नुहोस् वा टाइप गर्नुहोस् (e.g. मौद्रिक नीति, BAFIA, संस्थान)..."
          className="w-full pl-10 pr-24 py-2.5 text-xs sm:text-sm bg-slate-800/90 text-white placeholder-slate-400 rounded-2xl border border-slate-700 focus:border-sky-400 focus:ring-2 focus:ring-sky-500/20 focus:outline-none transition-all shadow-inner"
        />

        <div className="absolute right-2 flex items-center gap-1.5">
          {query ? (
            <button
              type="button"
              onClick={() => setQuery('')}
              className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-700 transition cursor-pointer"
              title="हटाउनुहोस् (Clear)"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          ) : null}

          {/* Embedded Inline Mic Button */}
          <VoiceSearchButton
            onTranscript={handleVoiceTranscript}
            size="sm"
            darkBackground
          />
        </div>
      </div>

      {/* Voice Prompts Suggestions Pills */}
      <div className="flex items-center gap-1.5 flex-wrap">
        <span className="text-[11px] font-bold text-slate-400 shrink-0 flex items-center gap-1">
          <Sparkles className="w-3 h-3 text-amber-400" />
          लोकप्रिय परीक्षा विषय:
        </span>
        {popularVoicePrompts.map(prompt => (
          <button
            key={prompt.label}
            type="button"
            onClick={() => setQuery(prompt.query)}
            className="px-2.5 py-1 text-[11px] font-medium rounded-lg bg-white/5 hover:bg-sky-500/20 text-slate-300 hover:text-sky-300 border border-white/10 transition cursor-pointer"
          >
            {prompt.label}
          </button>
        ))}
      </div>

      {/* Search Results Display */}
      {trimmedQuery && (
        <div className="pt-2 border-t border-white/10 space-y-2 animate-fadeIn">
          <div className="flex items-center justify-between text-xs text-slate-300 font-semibold px-1">
            <span>
              "{query}" को लागि फेला परेका परीक्षा विषयहरू ({matchedResults.length}):
            </span>
            {matchedResults.length > 0 && (
              <span className="text-emerald-400 text-[11px]">
                क्विज सुरु गर्न दायाँ 'सुरु गर्नुहोस्' बटन थिच्नुहोस्
              </span>
            )}
          </div>

          {matchedResults.length === 0 ? (
            <div className="p-4 rounded-2xl bg-white/5 text-center text-xs text-slate-400 space-y-1">
              <p className="font-semibold text-slate-300">
                "{query}" सँग सम्बन्धित कुनै परीक्षा विषय भेटिएन।
              </p>
              <p className="text-[11px]">
                सुझाव: 'मौद्रिक नीति', 'संस्थान', 'बैंकिङ ऐन', 'लेखा', 'भूगोल' जस्ता प्रमुख विषयको नाम बोल्नुहोस्।
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2 max-h-64 overflow-y-auto pr-1 custom-scrollbar">
              {matchedResults.map(({ module: mod, matchedSubTopic, matchType }, idx) => (
                <div
                  key={`${mod.id}-${matchedSubTopic?.id || idx}`}
                  className="p-3 rounded-2xl bg-white/10 hover:bg-white/15 border border-white/10 hover:border-sky-400/50 transition-all flex items-center justify-between gap-3 group"
                >
                  <div className="min-w-0 space-y-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="px-1.5 py-0.5 rounded text-[10px] font-black bg-sky-500/20 text-sky-300 border border-sky-500/30">
                        {mod.category}
                      </span>
                      <h4 className="text-xs font-black text-white group-hover:text-sky-300 transition truncate">
                        {matchedSubTopic ? matchedSubTopic.nameNepali : mod.nameNepali}
                      </h4>
                    </div>

                    <p className="text-[11px] text-slate-300 line-clamp-1">
                      {matchedSubTopic ? `मोड्युल: ${mod.nameNepali}` : mod.description}
                    </p>

                    <div className="flex items-center gap-2 text-[10px] text-slate-400">
                      <span>{mod.totalMCQs}+ प्रश्नहरू</span>
                      <span>•</span>
                      <span>{mod.level}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-1.5 shrink-0">
                    <button
                      type="button"
                      onClick={() => {
                        onSelectTopic(
                          mod.category as SubjectCategory,
                          mod.nameNepali,
                          matchedSubTopic?.nameNepali
                        );
                      }}
                      className="px-2.5 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-slate-200 text-xs font-bold transition cursor-pointer"
                      title="फिल्टरमा चयन गर्नुहोस्"
                    >
                      छान्नुहोस्
                    </button>

                    <button
                      type="button"
                      onClick={() => {
                        onLaunchTopicQuiz(
                          mod.category as SubjectCategory,
                          mod.nameNepali,
                          matchedSubTopic?.nameNepali
                        );
                      }}
                      className="px-3 py-1.5 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-slate-950 text-xs font-extrabold transition flex items-center gap-1 shadow-md shadow-emerald-500/20 cursor-pointer"
                    >
                      <Play className="w-3 h-3 fill-current" />
                      <span>सुरु ({selectedCount})</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

    </div>
  );
};
