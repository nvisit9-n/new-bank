import React, { useState, useEffect } from 'react';
import { 
  Search, 
  X, 
  BookOpen, 
  CheckSquare, 
  Newspaper, 
  Sparkles, 
  ChevronRight, 
  Scale, 
  Clock, 
  Filter,
  CheckCircle2
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { MOCK_QUESTIONS, MOCK_PREMIUM_NOTES, MOCK_CURRENT_AFFAIRS } from '../../data/mockData';
import { DIRECT_LAWS_DATA, LawActDetail } from '../../data/portalData';
import { StorageService } from '../../services/storageService';
import { QuizSet, StudyNote } from '../../types';
import { VoiceSearchButton } from '../common/VoiceSearchButton';

export type SearchFilterType = 'all' | 'laws' | 'nrb' | 'rbb' | 'adbl' | 'nbl' | 'notes' | 'quiz';

const INSTITUTION_STYLE_MAP: Record<'NRB' | 'RBB' | 'ADBL' | 'NBL', { bg: string; text: string; border: string }> = {
  NRB: { bg: 'bg-red-500/15', text: 'text-red-400', border: 'border-red-500/30' },
  RBB: { bg: 'bg-blue-500/15', text: 'text-blue-400', border: 'border-blue-500/30' },
  ADBL: { bg: 'bg-emerald-500/15', text: 'text-emerald-400', border: 'border-emerald-500/30' },
  NBL: { bg: 'bg-indigo-500/15', text: 'text-indigo-400', border: 'border-indigo-500/30' }
};

export const SearchModal: React.FC = () => {
  const { 
    isSearchOpen, 
    setIsSearchOpen, 
    openNoteReader, 
    openPremiumDetail, 
    startQuiz, 
    setActiveTab,
    addToast
  } = useApp();
  
  const [query, setQuery] = useState('');
  const [filter, setFilter] = useState<SearchFilterType>('all');

  // Close on Escape
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setIsSearchOpen(false);
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setIsSearchOpen(true);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [setIsSearchOpen]);

  if (!isSearchOpen) return null;

  const trimmed = query.trim().toLowerCase();
  const allNotes = StorageService.getAllNotes();

  const activeInstFilter = (filter === 'nrb' || filter === 'rbb' || filter === 'adbl' || filter === 'nbl')
    ? filter.toUpperCase() as 'NRB' | 'RBB' | 'ADBL' | 'NBL'
    : null;

  // 1. Laws matching
  const matchedLaws = (filter === 'all' || filter === 'laws' || activeInstFilter)
    ? DIRECT_LAWS_DATA.map(law => {
        let insts: ('NRB' | 'RBB' | 'ADBL' | 'NBL')[] = ['NRB', 'RBB', 'ADBL', 'NBL'];
        if (law.id === 'foreign-exchange-2019' || law.id === 'payment-settlement-2075') {
          insts = ['NRB', 'RBB', 'NBL'];
        } else if (law.id === 'debt-recovery-2058') {
          insts = ['RBB', 'ADBL', 'NBL'];
        } else if (law.id === 'negotiable-instruments-2034' || law.id === 'company-act-2063') {
          insts = ['RBB', 'ADBL', 'NBL', 'NRB'];
        }
        return { ...law, matchedInstitutions: insts };
      }).filter(law => {
        if (activeInstFilter && !law.matchedInstitutions.includes(activeInstFilter)) return false;
        if (!trimmed) return filter === 'laws' || activeInstFilter;
        return (
          law.shortCode.toLowerCase().includes(trimmed) ||
          law.titleNe.toLowerCase().includes(trimmed) ||
          law.titleEn.toLowerCase().includes(trimmed) ||
          law.primaryFocus.toLowerCase().includes(trimmed) ||
          law.keySections.some(s => s.titleNe.toLowerCase().includes(trimmed) || s.summaryNe.toLowerCase().includes(trimmed))
        );
      })
    : [];

  // 2. Study Notes matching
  const matchedNotes = (filter === 'all' || filter === 'notes' || activeInstFilter)
    ? allNotes.map(n => {
        const text = `${n.title} ${n.subject} ${n.category} ${n.examTip || ''}`.toLowerCase();
        const insts: ('NRB' | 'RBB' | 'ADBL' | 'NBL')[] = [];
        if (text.includes('राष्ट्र बैंक') || text.includes('nrb') || text.includes('केन्द्रीय') || text.includes('मौद्रिक')) insts.push('NRB');
        if (text.includes('वाणिज्य') || text.includes('rbb') || text.includes('व्यापारिक') || text.includes('क वर्ग')) insts.push('RBB');
        if (text.includes('कृषि') || text.includes('adbl') || text.includes('ग्रामीण') || text.includes('किसान')) insts.push('ADBL');
        if (text.includes('नेपाल बैंक') || text.includes('nbl') || text.includes('इतिहास') || text.includes('गोल्ड टेस्टर')) insts.push('NBL');
        if (insts.length === 0) insts.push('NRB', 'RBB', 'ADBL', 'NBL');
        return { note: n, matchedInstitutions: insts };
      }).filter(({ note, matchedInstitutions }) => {
        if (activeInstFilter && !matchedInstitutions.includes(activeInstFilter)) return false;
        if (!trimmed) return filter === 'notes';
        return (
          note.title.toLowerCase().includes(trimmed) ||
          note.subject.toLowerCase().includes(trimmed) ||
          (note.examTip || '').toLowerCase().includes(trimmed) ||
          note.category.toLowerCase().includes(trimmed)
        );
      })
    : [];

  // 3. Questions matching
  const matchedQuestions = (filter === 'all' || filter === 'quiz') && trimmed
    ? MOCK_QUESTIONS.filter(q => q.questionNepali.toLowerCase().includes(trimmed) || (q.questionEnglish && q.questionEnglish.toLowerCase().includes(trimmed)))
    : [];

  // 4. Premium Notes matching
  const matchedPremium = (filter === 'all' || filter === 'notes') && trimmed
    ? MOCK_PREMIUM_NOTES.filter(p => {
        const authorName = typeof p.author === 'string' ? p.author : (p.author?.name || '');
        return p.title.toLowerCase().includes(trimmed) || authorName.toLowerCase().includes(trimmed);
      })
    : [];

  // 5. Current Affairs matching
  const matchedAffairs = filter === 'all' && trimmed
    ? MOCK_CURRENT_AFFAIRS.filter(a => a.title.toLowerCase().includes(trimmed) || a.summary.toLowerCase().includes(trimmed))
    : [];

  const totalResults = matchedLaws.length + matchedNotes.length + matchedQuestions.length + matchedPremium.length + matchedAffairs.length;

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-start justify-center p-3 sm:p-6 pt-12 sm:pt-16 animate-fadeIn">
      <div className="bg-[#0F172A] rounded-2xl sm:rounded-3xl max-w-3xl w-full border border-slate-700/90 shadow-2xl overflow-hidden flex flex-col max-h-[85vh]">
        
        {/* Search Input Bar */}
        <div className="p-3.5 sm:p-4 border-b border-slate-800 flex items-center gap-3 bg-[#1E293B]">
          <Search className="w-5 h-5 text-sky-400 shrink-0" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="ऐन, कानुन, नोट्स वा परीक्षा विषय खोज्नुहोस् वा बोल्नुहोस्..."
            autoFocus
            className="flex-1 text-sm sm:text-base bg-transparent text-[#FFFFFF] placeholder-slate-400 focus:outline-none"
          />
          {query && (
            <button
              onClick={() => setQuery('')}
              className="p-1 text-slate-400 hover:text-white rounded-lg transition cursor-pointer"
              title="खाली गर्नुहोस्"
            >
              <X className="w-4 h-4" />
            </button>
          )}
          <VoiceSearchButton
            onTranscript={(text) => setQuery(text)}
            darkBackground
            size="md"
            tooltipText="नोट्स वा परीक्षा विषय बोलेर खोज्नुहोस्"
          />
          <button
            onClick={() => setIsSearchOpen(false)}
            className="px-2.5 py-1 text-xs font-semibold rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 transition cursor-pointer"
          >
            ESC
          </button>
        </div>

        {/* Filter Pills Bar */}
        <div className="px-3.5 py-2 border-b border-slate-800 bg-[#0F172A] flex items-center gap-1.5 overflow-x-auto scrollbar-none">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider px-1 shrink-0 flex items-center gap-1">
            <Filter className="w-3 h-3 text-sky-400" />
            फिल्टर:
          </span>

          {[
            { id: 'all', label: 'सबै (All)' },
            { id: 'laws', label: '⚖️ ऐन/कानुन (Laws)' },
            { id: 'nrb', label: '🇳🇵 NRB' },
            { id: 'rbb', label: '🏛️ RBB' },
            { id: 'adbl', label: '🌾 ADBL' },
            { id: 'nbl', label: '🏦 NBL' },
            { id: 'notes', label: '📚 नोट्स (Notes)' },
            { id: 'quiz', label: '📝 क्विज (MCQs)' }
          ].map(chip => (
            <button
              key={chip.id}
              type="button"
              onClick={() => setFilter(chip.id as SearchFilterType)}
              className={`px-2.5 py-1 rounded-lg text-xs font-semibold whitespace-nowrap transition cursor-pointer shrink-0 ${
                filter === chip.id
                  ? 'bg-sky-500 text-white shadow-xs'
                  : 'bg-[#1E293B] text-slate-300 hover:text-white hover:bg-slate-800'
              }`}
            >
              {chip.label}
            </button>
          ))}
        </div>

        {/* Results Container */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {!trimmed && filter === 'all' ? (
            <div className="py-8 text-center text-xs text-slate-400 space-y-4">
              <div className="flex items-center justify-center gap-2 text-slate-300 font-bold">
                <Sparkles className="w-4 h-4 text-amber-400" />
                <span>लोकप्रिय खोजीहरू (Trending Law & Exam Topics)</span>
              </div>
              <div className="flex flex-wrap items-center justify-center gap-2 max-w-xl mx-auto">
                {[
                  'BAFIA २०७३',
                  'नेपाल राष्ट्र बैंक ऐन',
                  'सम्पत्ति शुद्धीकरण (AML)',
                  'बैंकिङ कसूर ऐन',
                  'NRB मौद्रिक नीति',
                  'RBB तह ४/५',
                  'ADBL लेखा प्रणाली',
                  'विदेशी विनिमय ऐन'
                ].map(tag => (
                  <button
                    key={tag}
                    onClick={() => setQuery(tag)}
                    className="px-3 py-1.5 rounded-xl bg-[#1E293B] hover:bg-sky-500/20 text-slate-200 hover:text-sky-300 border border-slate-700/80 transition font-medium cursor-pointer"
                  >
                    {tag}
                  </button>
                ))}
              </div>
            </div>
          ) : totalResults === 0 ? (
            <div className="py-10 text-center text-xs text-slate-400 space-y-2">
              <Scale className="w-8 h-8 text-slate-600 mx-auto" />
              <p className="text-sm font-semibold text-white">
                "{query}" सँग सम्बन्धित कुनै सामग्री फेला परेन।
              </p>
              <p>सुझाव: BAFIA, राष्ट्र बैंक ऐन, वा RBB/ADBL जस्ता शब्द टाइप गर्नुहोस्।</p>
            </div>
          ) : (
            <div className="space-y-4 divide-y divide-slate-800/80">
              
              {/* 1. Matched Laws & Acts */}
              {matchedLaws.length > 0 && (
                <div className="space-y-2 pt-1">
                  <span className="text-[11px] font-black uppercase text-sky-400 tracking-wider flex items-center gap-1.5">
                    <Scale className="w-3.5 h-3.5" />
                    ऐन, कानुन तथा नियमहरू ({matchedLaws.length})
                  </span>
                  <div className="space-y-1.5">
                    {matchedLaws.map(law => (
                      <div
                        key={law.id}
                        onClick={() => {
                          setIsSearchOpen(false);
                          if (law.relatedNoteId) {
                            openNoteReader(law.relatedNoteId);
                            addToast(`${law.shortCode} - ऐन विवरण खोलियो`, 'info');
                          } else {
                            setActiveTab('portal');
                          }
                        }}
                        className="p-3 rounded-xl bg-[#1E293B] hover:bg-slate-800 border border-slate-700/80 hover:border-sky-500/50 cursor-pointer transition flex items-start justify-between gap-3 group"
                      >
                        <div className="flex items-start gap-2.5 min-w-0">
                          <div className="w-8 h-8 rounded-lg bg-sky-500/10 border border-sky-500/30 flex items-center justify-center shrink-0 text-sky-400 mt-0.5">
                            <Scale className="w-4 h-4" />
                          </div>
                          <div className="min-w-0 space-y-1">
                            <div className="flex items-center gap-2 flex-wrap">
                              <h4 className="text-xs font-bold text-white group-hover:text-sky-300 transition">
                                {law.titleNe}
                              </h4>
                              <span className="px-1.5 py-0.5 rounded text-[10px] font-black bg-slate-800 text-sky-300 border border-slate-700">
                                {law.shortCode}
                              </span>
                            </div>
                            <p className="text-[11px] text-slate-300 line-clamp-1">{law.primaryFocus}</p>
                            <div className="flex items-center gap-2 flex-wrap text-[10px] text-slate-400">
                              <span>जारी: {law.enactedBikram}</span>
                              <span>•</span>
                              <span>{law.totalChapters} परिच्छेद • {law.totalSections} दफा</span>
                              <span>•</span>
                              <span className="flex items-center gap-1">
                                परीक्षार्थी:
                                {law.matchedInstitutions.map(inst => {
                                  const style = INSTITUTION_STYLE_MAP[inst];
                                  return (
                                    <span 
                                      key={inst}
                                      className={`px-1 py-0.2 rounded font-bold text-[9px] border ${style.bg} ${style.text} ${style.border}`}
                                    >
                                      {inst}
                                    </span>
                                  );
                                })}
                              </span>
                            </div>
                          </div>
                        </div>
                        <div className="hidden sm:flex items-center gap-1 text-[11px] font-bold text-sky-400 group-hover:translate-x-0.5 transition-transform shrink-0 self-center">
                          ऐन पढ्नुहोस्
                          <ChevronRight className="w-3.5 h-3.5" />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* 2. Matched Study Notes Across Institutions */}
              {matchedNotes.length > 0 && (
                <div className="space-y-2 pt-3">
                  <span className="text-[11px] font-black uppercase text-emerald-400 tracking-wider flex items-center gap-1.5">
                    <BookOpen className="w-3.5 h-3.5" />
                    संस्थानगत अध्ययन नोट्स ({matchedNotes.length})
                  </span>
                  <div className="space-y-1.5">
                    {matchedNotes.map(({ note: n, matchedInstitutions: noteInsts }) => (
                      <div
                        key={n.id}
                        onClick={() => {
                          setIsSearchOpen(false);
                          openNoteReader(n);
                        }}
                        className="p-3 rounded-xl bg-[#1E293B] hover:bg-slate-800 border border-slate-700/80 hover:border-emerald-500/50 cursor-pointer transition flex items-start justify-between gap-3 group"
                      >
                        <div className="flex items-start gap-2.5 min-w-0">
                          <div className="w-8 h-8 rounded-lg bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center shrink-0 text-emerald-400 mt-0.5">
                            <BookOpen className="w-4 h-4" />
                          </div>
                          <div className="min-w-0 space-y-1">
                            <div className="flex items-center gap-2 flex-wrap">
                              <h4 className="text-xs font-bold text-white group-hover:text-emerald-300 transition truncate">
                                {n.title}
                              </h4>
                              <span className="px-1.5 py-0.5 rounded text-[9px] font-bold bg-slate-800 text-emerald-300 border border-slate-700">
                                {n.subject}
                              </span>
                            </div>
                            {n.examTip && (
                              <p className="text-[11px] text-slate-300 line-clamp-1">परीक्षा टिप: {n.examTip}</p>
                            )}
                            <div className="flex items-center gap-2 flex-wrap text-[10px] text-slate-400">
                              <span className="flex items-center gap-1">
                                <Clock className="w-3 h-3 text-slate-500" />
                                {n.readTime}
                              </span>
                              <span>•</span>
                              <span className="flex items-center gap-1">
                                बैंकहरू:
                                {noteInsts.map(inst => {
                                  const style = INSTITUTION_STYLE_MAP[inst];
                                  return (
                                    <span 
                                      key={inst}
                                      className={`px-1 py-0.2 rounded font-bold text-[9px] border ${style.bg} ${style.text} ${style.border}`}
                                    >
                                      {inst}
                                    </span>
                                  );
                                })}
                              </span>
                            </div>
                          </div>
                        </div>
                        <div className="hidden sm:flex items-center gap-1 text-[11px] font-bold text-emerald-400 group-hover:translate-x-0.5 transition-transform shrink-0 self-center">
                          नोट पढ्नुहोस्
                          <ChevronRight className="w-3.5 h-3.5" />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* 3. Matched Questions */}
              {matchedQuestions.length > 0 && (
                <div className="space-y-2 pt-3">
                  <span className="text-[11px] font-black uppercase text-blue-400 tracking-wider flex items-center gap-1.5">
                    <CheckSquare className="w-3.5 h-3.5" />
                    क्विज प्रश्नहरू ({matchedQuestions.length})
                  </span>
                  {matchedQuestions.slice(0, 4).map(q => (
                    <div
                      key={q.id}
                      onClick={() => {
                        setIsSearchOpen(false);
                        const singleSet: QuizSet = {
                          id: `search-q-${q.id}`,
                          title: 'खोजिएको प्रश्न अभ्यास',
                          description: 'चयन गरिएको प्रश्नको अभ्यास',
                          category: q.category,
                          difficulty: q.difficulty,
                          mode: 'practice',
                          timeLimitMinutes: 3,
                          questions: [q],
                          badge: 'Question'
                        };
                        startQuiz(singleSet);
                      }}
                      className="p-3 rounded-xl bg-[#1E293B] hover:bg-slate-800 border border-slate-700/80 hover:border-blue-500/50 cursor-pointer transition flex items-center justify-between gap-3"
                    >
                      <div className="flex items-center gap-2.5 min-w-0">
                        <CheckSquare className="w-4 h-4 text-blue-400 shrink-0" />
                        <div className="min-w-0">
                          <p className="text-xs font-bold text-white truncate">{q.questionNepali}</p>
                          <p className="text-[10px] text-slate-400">{q.category} • {q.difficulty}</p>
                        </div>
                      </div>
                      <ChevronRight className="w-4 h-4 text-slate-400 shrink-0" />
                    </div>
                  ))}
                </div>
              )}

              {/* 4. Matched Premium Books */}
              {matchedPremium.length > 0 && (
                <div className="space-y-2 pt-3">
                  <span className="text-[11px] font-black uppercase text-amber-400 tracking-wider flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5" />
                    प्रिमियम सामग्री ({matchedPremium.length})
                  </span>
                  {matchedPremium.map(p => (
                    <div
                      key={p.id}
                      onClick={() => {
                        setIsSearchOpen(false);
                        openPremiumDetail(p);
                      }}
                      className="p-3 rounded-xl bg-[#1E293B] hover:bg-slate-800 border border-slate-700/80 hover:border-amber-500/50 cursor-pointer transition flex items-center justify-between gap-3"
                    >
                      <div className="flex items-center gap-2.5 min-w-0">
                        <Sparkles className="w-4 h-4 text-amber-400 shrink-0" />
                        <div className="min-w-0">
                          <p className="text-xs font-bold text-white truncate">{p.title}</p>
                          <p className="text-[10px] text-slate-400">
                            {typeof p.author === 'string' ? p.author : (p.author?.name || 'विशेषज्ञ')} • रु. {p.discountPrice || p.price || p.originalPrice}
                          </p>
                        </div>
                      </div>
                      <ChevronRight className="w-4 h-4 text-slate-400 shrink-0" />
                    </div>
                  ))}
                </div>
              )}

              {/* 5. Matched Current Affairs */}
              {matchedAffairs.length > 0 && (
                <div className="space-y-2 pt-3">
                  <span className="text-[11px] font-black uppercase text-indigo-400 tracking-wider flex items-center gap-1.5">
                    <Newspaper className="w-3.5 h-3.5" />
                    समसामयिक घटनाक्रम ({matchedAffairs.length})
                  </span>
                  {matchedAffairs.map(a => (
                    <div
                      key={a.id}
                      onClick={() => {
                        setIsSearchOpen(false);
                        setActiveTab('current-affairs');
                      }}
                      className="p-3 rounded-xl bg-[#1E293B] hover:bg-slate-800 border border-slate-700/80 hover:border-indigo-500/50 cursor-pointer transition flex items-center justify-between gap-3"
                    >
                      <div className="flex items-center gap-2.5 min-w-0">
                        <Newspaper className="w-4 h-4 text-indigo-400 shrink-0" />
                        <div className="min-w-0">
                          <p className="text-xs font-bold text-white truncate">{a.title}</p>
                          <p className="text-[10px] text-slate-400">{a.category} • {a.date}</p>
                        </div>
                      </div>
                      <ChevronRight className="w-4 h-4 text-slate-400 shrink-0" />
                    </div>
                  ))}
                </div>
              )}

            </div>
          )}
        </div>

        {/* Footer info bar */}
        <div className="p-3 border-t border-slate-800 bg-[#0F172A] flex items-center justify-between text-[11px] text-slate-400">
          <span>
            कुल परिणाम: <span className="text-sky-400 font-bold">{totalResults}</span>
          </span>
          <span className="hidden sm:inline">समर्थित बैंक: NRB, RBB, ADBL, NBL</span>
        </div>

      </div>
    </div>
  );
};
