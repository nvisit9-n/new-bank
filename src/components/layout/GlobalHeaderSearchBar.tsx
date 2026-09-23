import React, { useState, useEffect, useRef, useMemo } from 'react';
import { 
  Search, 
  X, 
  Scale, 
  BookOpen, 
  Landmark, 
  Building2, 
  ChevronRight, 
  Clock, 
  FileText, 
  CheckCircle2, 
  Sparkles,
  ArrowRight,
  Filter
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { DIRECT_LAWS_DATA, LawActDetail } from '../../data/portalData';
import { StorageService } from '../../services/storageService';
import { StudyNote } from '../../types';
import { VoiceSearchButton } from '../common/VoiceSearchButton';

export type BankInstitutionId = 'all' | 'nrb' | 'rbb' | 'adbl' | 'nbl';
export type SearchCategoryFilter = 'all' | 'laws' | 'notes' | 'institutions' | BankInstitutionId;

interface LawMatch extends LawActDetail {
  matchedInstitutions: ('NRB' | 'RBB' | 'ADBL' | 'NBL')[];
}

interface NoteMatch {
  note: StudyNote;
  matchedInstitutions: ('NRB' | 'RBB' | 'ADBL' | 'NBL')[];
  snippet?: string;
}

interface InstitutionMatch {
  id: 'nrb' | 'rbb' | 'adbl' | 'nbl';
  nameNe: string;
  nameEn: string;
  shortName: string;
  badge: string;
  levels: string;
  themeColor: string;
  vacancyStatus: string;
}

// Institution badges styling
const INSTITUTION_STYLE_MAP: Record<'NRB' | 'RBB' | 'ADBL' | 'NBL', { bg: string; text: string; border: string }> = {
  NRB: { bg: 'bg-red-50', text: 'text-red-700', border: 'border-red-200' },
  RBB: { bg: 'bg-blue-50', text: 'text-blue-700', border: 'border-blue-200' },
  ADBL: { bg: 'bg-emerald-50', text: 'text-emerald-700', border: 'border-emerald-200' },
  NBL: { bg: 'bg-indigo-50', text: 'text-indigo-700', border: 'border-indigo-200' }
};

export interface GlobalHeaderSearchBarProps {
  isMobileModal?: boolean;
  onClose?: () => void;
  className?: string;
}

export const GlobalHeaderSearchBar: React.FC<GlobalHeaderSearchBarProps> = ({
  isMobileModal = false,
  onClose,
  className = ''
}) => {
  const { openNoteReader, setActiveTab, addToast } = useApp();
  
  const [query, setQuery] = useState('');
  const [isOpen, setIsOpen] = useState(isMobileModal);
  const [selectedFilter, setSelectedFilter] = useState<SearchCategoryFilter>('all');
  const [selectedIndex, setSelectedIndex] = useState<number>(-1);

  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Auto-focus when in mobile modal mode
  useEffect(() => {
    if (isMobileModal && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isMobileModal]);

  // Keyboard shortcut listener (⌘K / Ctrl+K)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setIsOpen(true);
        inputRef.current?.focus();
      }
      if (e.key === 'Escape') {
        setIsOpen(false);
        if (onClose) onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  // Click outside to dismiss desktop dropdown
  useEffect(() => {
    if (isMobileModal) return;
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isMobileModal]);

  // Load study notes from StorageService
  const allNotes = useMemo(() => {
    return StorageService.getAllNotes();
  }, []);

  // Map laws to their supported banking institutions
  const lawsWithInstitutions = useMemo<LawMatch[]>(() => {
    return DIRECT_LAWS_DATA.map(law => {
      let insts: ('NRB' | 'RBB' | 'ADBL' | 'NBL')[] = ['NRB', 'RBB', 'ADBL', 'NBL'];
      
      if (law.id === 'foreign-exchange-2019' || law.id === 'payment-settlement-2075') {
        insts = ['NRB', 'RBB', 'NBL'];
      } else if (law.id === 'debt-recovery-2058') {
        insts = ['RBB', 'ADBL', 'NBL'];
      } else if (law.id === 'negotiable-instruments-2034' || law.id === 'company-act-2063') {
        insts = ['RBB', 'ADBL', 'NBL', 'NRB'];
      }

      return {
        ...law,
        matchedInstitutions: insts
      };
    });
  }, []);

  // Map notes to their supported banking institutions
  const notesWithInstitutions = useMemo<NoteMatch[]>(() => {
    return allNotes.map(n => {
      const text = `${n.title} ${n.subject} ${n.category} ${n.examTip || ''}`.toLowerCase();
      const insts: ('NRB' | 'RBB' | 'ADBL' | 'NBL')[] = [];

      // Check specific institution affinity
      const isNRB = text.includes('राष्ट्र बैंक') || text.includes('nrb') || text.includes('केन्द्रीय') || text.includes('मौद्रिक');
      const isRBB = text.includes('वाणिज्य') || text.includes('rbb') || text.includes('व्यापारिक') || text.includes('क वर्ग');
      const isADBL = text.includes('कृषि') || text.includes('adbl') || text.includes('ग्रामीण') || text.includes('किसान');
      const isNBL = text.includes('नेपाल बैंक') || text.includes('nbl') || text.includes('इतिहास') || text.includes('गोल्ड टेस्टर');

      if (isNRB) insts.push('NRB');
      if (isRBB) insts.push('RBB');
      if (isADBL) insts.push('ADBL');
      if (isNBL) insts.push('NBL');

      // If generic banking or law or accounts note, it applies across all banks
      if (insts.length === 0) {
        insts.push('NRB', 'RBB', 'ADBL', 'NBL');
      }

      return {
        note: n,
        matchedInstitutions: insts
      };
    });
  }, [allNotes]);

  // Filtered Results
  const { matchedLaws, matchedNotes, matchedInstitutions } = useMemo(() => {
    const q = query.trim().toLowerCase();
    
    // Check institution filter
    const activeInstFilter = (selectedFilter === 'nrb' || selectedFilter === 'rbb' || selectedFilter === 'adbl' || selectedFilter === 'nbl')
      ? selectedFilter.toUpperCase() as 'NRB' | 'RBB' | 'ADBL' | 'NBL'
      : null;

    // 1. Laws Matching
    let laws: LawMatch[] = [];
    if (selectedFilter === 'all' || selectedFilter === 'laws' || activeInstFilter) {
      laws = lawsWithInstitutions.filter(law => {
        // Institution condition
        if (activeInstFilter && !law.matchedInstitutions.includes(activeInstFilter)) {
          return false;
        }
        if (!q) return true; // Show trending if no search query
        
        const inCode = law.shortCode.toLowerCase().includes(q);
        const inTitleNe = law.titleNe.toLowerCase().includes(q);
        const inTitleEn = law.titleEn.toLowerCase().includes(q);
        const inFocus = law.primaryFocus.toLowerCase().includes(q);
        const inSections = law.keySections.some(s => 
          s.titleNe.toLowerCase().includes(q) || s.summaryNe.toLowerCase().includes(q)
        );
        return inCode || inTitleNe || inTitleEn || inFocus || inSections;
      });
    }

    // 2. Study Notes Matching
    let notes: NoteMatch[] = [];
    if (selectedFilter === 'all' || selectedFilter === 'notes' || activeInstFilter) {
      notes = notesWithInstitutions.filter(({ note, matchedInstitutions }) => {
        // Institution condition
        if (activeInstFilter && !matchedInstitutions.includes(activeInstFilter)) {
          return false;
        }
        if (!q) return false; // Only show notes when query is entered

        const inTitle = note.title.toLowerCase().includes(q);
        const inSubject = note.subject.toLowerCase().includes(q);
        const inTip = (note.examTip || '').toLowerCase().includes(q);
        const inCategory = note.category.toLowerCase().includes(q);
        return inTitle || inSubject || inTip || inCategory;
      });
    }

    // 3. Institution Hub Cards Matching
    let insts: InstitutionMatch[] = [];
    if (selectedFilter === 'all' || selectedFilter === 'institutions' || activeInstFilter) {
      const allInsts: InstitutionMatch[] = [
        {
          id: 'nrb',
          nameNe: 'नेपाल राष्ट्र बैंक (केन्द्रीय बैंक)',
          nameEn: 'Nepal Rastra Bank (Central Bank)',
          shortName: 'NRB',
          badge: 'Central Bank of Nepal',
          levels: 'तह ४ (सहायक) & तह ६ (अधिकृत)',
          themeColor: 'red',
          vacancyStatus: 'वार्षिक क्यालेन्डर अनुसार विज्ञापन प्रक्रियामा'
        },
        {
          id: 'rbb',
          nameNe: 'राष्ट्रिय वाणिज्य बैंक लिमिटेड',
          nameEn: 'Rastriya Banijya Bank Limited',
          shortName: 'RBB',
          badge: '100% Gov Owned Commercial Bank',
          levels: 'तह ४ (सहायक/नगद) & तह ५ (वरिष्ठ सहायक)',
          themeColor: 'blue',
          vacancyStatus: 'नयाँ पदपूर्ति तालिका प्रकाशित'
        },
        {
          id: 'adbl',
          nameNe: 'कृषि विकास बैंक लिमिटेड',
          nameEn: 'Agricultural Development Bank Ltd',
          shortName: 'ADBL',
          badge: 'Agriculture & Commercial Banking',
          levels: 'तह ४ (लेखापाल) & तह ५ (व्यवसाय सहायक)',
          themeColor: 'emerald',
          vacancyStatus: 'विज्ञापन तथा परीक्षा तयारी खुला'
        },
        {
          id: 'nbl',
          nameNe: 'नेपाल बैंक लिमिटेड',
          nameEn: 'Nepal Bank Limited (First Bank)',
          shortName: 'NBL',
          badge: 'First Commercial Bank of Nepal (1994 BS)',
          levels: 'तह ३ (गोल्ड टेस्टर) & तह ४ (सहायक)',
          themeColor: 'indigo',
          vacancyStatus: 'नियमित खुला पदपूर्ति सूचना'
        }
      ];

      insts = allInsts.filter(i => {
        if (activeInstFilter && i.shortName !== activeInstFilter) {
          return false;
        }
        if (!q) return Boolean(activeInstFilter); // If filter active, show that bank card
        
        return (
          i.shortName.toLowerCase().includes(q) ||
          i.nameNe.toLowerCase().includes(q) ||
          i.nameEn.toLowerCase().includes(q) ||
          i.levels.toLowerCase().includes(q)
        );
      });
    }

    return {
      matchedLaws: laws.slice(0, q ? 8 : 6),
      matchedNotes: notes.slice(0, 10),
      matchedInstitutions: insts
    };
  }, [query, selectedFilter, lawsWithInstitutions, notesWithInstitutions]);

  const totalResults = matchedLaws.length + matchedNotes.length + matchedInstitutions.length;

  const handleSelectLaw = (law: LawMatch) => {
    setIsOpen(false);
    if (onClose) onClose();
    
    if (law.relatedNoteId) {
      openNoteReader(law.relatedNoteId);
      addToast(`${law.shortCode} - ऐन विवरण खोलियो`, 'info');
    } else {
      setActiveTab('portal');
      addToast(`${law.shortCode} - ऐन तथा कानुन हबमा लगियो`, 'info');
    }
  };

  const handleSelectNote = (note: StudyNote) => {
    setIsOpen(false);
    if (onClose) onClose();
    openNoteReader(note);
    addToast(`${note.title} - अध्ययन सामग्री खोलियो`, 'info');
  };

  const handleSelectInstitution = (inst: InstitutionMatch) => {
    setIsOpen(false);
    if (onClose) onClose();
    setActiveTab('portal');
    addToast(`${inst.shortName} - बैंक संस्थान हब खोलियो`, 'info');
  };

  const handleQuickTagClick = (tag: string) => {
    setQuery(tag);
    inputRef.current?.focus();
  };

  return (
    <div 
      ref={containerRef}
      className={`relative w-full ${className}`}
    >
      {/* Search Input Box */}
      <div className="relative w-full">
        <div className="relative flex items-center">
          <Search className="absolute left-3.5 w-4 h-4 text-[#0F172A] pointer-events-none group-focus-within:text-[#1E40AF] transition" style={{ color: '#0F172A' }} />
          
          <input
            ref={inputRef}
            type="text"
            id="global-header-search-input"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              if (!isOpen) setIsOpen(true);
            }}
            onFocus={() => setIsOpen(true)}
            placeholder="ऐन, कानुन वा बैंक नोट्स खोज्नुहोस् वा बोल्नुहोस्..."
            className="w-full pl-10 pr-24 py-2 text-xs sm:text-sm bg-[#F1F5F9] hover:bg-[#F8FAFC] focus:bg-white text-[#0F172A] placeholder-slate-500 rounded-xl border border-slate-300 hover:border-slate-400 focus:border-[#1E40AF] focus:ring-2 focus:ring-blue-500/20 focus:outline-none transition-all"
            style={{ color: '#0F172A' }}
          />

          <div className="absolute right-2 flex items-center gap-1.5">
            {query ? (
              <button
                type="button"
                onClick={() => {
                  setQuery('');
                  inputRef.current?.focus();
                }}
                className="p-1 rounded-md text-slate-400 hover:text-slate-700 hover:bg-slate-200/70 transition cursor-pointer"
                title="हटाउनुहोस् (Clear)"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            ) : (
              <kbd className="hidden lg:inline-flex items-center px-1.5 py-0.5 text-[10px] font-semibold bg-white border border-slate-300 rounded text-slate-500 font-mono select-none shadow-2xs">
                ⌘K
              </kbd>
            )}

            <VoiceSearchButton
              onTranscript={(text) => {
                setQuery(text);
                if (!isOpen) setIsOpen(true);
              }}
              darkBackground={false}
              size="sm"
              tooltipText="आवाजद्वारा खोज्नुहोस् (Voice Search)"
            />
          </div>
        </div>
      </div>

      {/* Floating Global Search Results Palette */}
      {isOpen && (
        <div 
          id="global-search-dropdown-palette"
          className={`${
            isMobileModal 
              ? 'relative mt-3 w-full' 
              : 'absolute top-full left-0 right-0 mt-2 z-50 shadow-xl rounded-2xl border border-slate-200 bg-white'
          } overflow-hidden max-h-[75vh] flex flex-col`}
          style={{ minWidth: isMobileModal ? '100%' : '560px' }}
        >
          {/* Header Filter Chips Bar */}
          <div className="p-2.5 border-b border-slate-200 bg-slate-50 flex items-center gap-1.5 overflow-x-auto scrollbar-none">
            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider px-1.5 shrink-0 flex items-center gap-1">
              <Filter className="w-3 h-3 text-[#1E40AF]" />
              फिल्टर:
            </span>

            {[
              { id: 'all', label: 'सबै (All)' },
              { id: 'laws', label: '⚖️ ऐन/कानुन (Laws)' },
              { id: 'nrb', label: '🇳🇵 NRB' },
              { id: 'rbb', label: '🏛️ RBB' },
              { id: 'adbl', label: '🌾 ADBL' },
              { id: 'nbl', label: '🏦 NBL' },
              { id: 'notes', label: '📚 अध्ययन नोट्स (Notes)' }
            ].map((chip) => {
              const isActive = selectedFilter === chip.id;
              return (
                <button
                  key={chip.id}
                  type="button"
                  onClick={() => setSelectedFilter(chip.id as SearchCategoryFilter)}
                  className={`px-2.5 py-1 rounded-lg text-xs font-semibold whitespace-nowrap transition cursor-pointer shrink-0 ${
                    isActive
                      ? 'bg-[#1E40AF] text-white shadow-xs'
                      : 'bg-white text-slate-600 hover:text-slate-900 hover:bg-slate-100 border border-slate-200'
                  }`}
                >
                  {chip.label}
                </button>
              );
            })}
          </div>

          {/* Scrollable Results Body */}
          <div className="flex-1 overflow-y-auto p-3 space-y-4 divide-y divide-slate-100">
            
            {/* Empty State / Trending Suggestions */}
            {!query && selectedFilter === 'all' && (
              <div className="space-y-3 pt-1">
                <div className="flex items-center justify-between text-[11px] font-bold uppercase tracking-wider text-slate-500 px-1">
                  <span className="flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                    लोकप्रिय खोजीहरू (Trending Law & Exam Notes)
                  </span>
                  <span className="text-slate-400">क्लिक गर्नुहोस्</span>
                </div>

                <div className="flex flex-wrap gap-1.5 px-1">
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
                      type="button"
                      onClick={() => handleQuickTagClick(tag)}
                      className="px-2.5 py-1 text-xs font-medium rounded-lg bg-slate-50 hover:bg-blue-50 text-slate-700 hover:text-blue-800 border border-slate-200 transition cursor-pointer"
                    >
                      {tag}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Zero Results */}
            {query && totalResults === 0 && (
              <div className="py-8 text-center space-y-2">
                <Scale className="w-8 h-8 text-slate-400 mx-auto" />
                <p className="text-sm font-bold text-slate-800">
                  "{query}" सँग मिल्दोजुल्दो कुनै ऐन, कानुन वा नोट्स फेला परेन।
                </p>
                <p className="text-xs text-slate-500">
                  सुझाव: BAFIA, राष्ट्र बैंक ऐन, मौद्रिक नीति, वा RBB/ADBL जस्ता शब्द टाइप गर्नुहोस्।
                </p>
              </div>
            )}

            {/* 1. Laws & Acts Results */}
            {matchedLaws.length > 0 && (
              <div className="space-y-2 pt-2">
                <div className="flex items-center justify-between px-1">
                  <span className="text-[11px] font-black uppercase text-blue-700 tracking-wider flex items-center gap-1.5">
                    <Scale className="w-3.5 h-3.5" />
                    ऐन, कानुन तथा नियमहरू ({matchedLaws.length})
                  </span>
                  <span className="text-[10px] text-slate-500 font-medium">Bare Act & Sections</span>
                </div>

                <div className="space-y-1.5">
                  {matchedLaws.map((law) => (
                    <div
                      key={law.id}
                      onClick={() => handleSelectLaw(law)}
                      className="p-2.5 rounded-xl bg-white hover:bg-slate-50 border border-slate-200 hover:border-blue-300 transition cursor-pointer group flex items-start justify-between gap-3 shadow-2xs"
                    >
                      <div className="flex items-start gap-2.5 min-w-0">
                        <div className="w-8 h-8 rounded-lg bg-blue-50 border border-blue-200 flex items-center justify-center shrink-0 text-blue-700 mt-0.5">
                          <Scale className="w-4 h-4" />
                        </div>

                        <div className="min-w-0 space-y-1">
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className="text-xs font-bold text-slate-900 group-hover:text-blue-700 transition">
                              {law.titleNe}
                            </span>
                            <span className="px-1.5 py-0.5 rounded text-[10px] font-black bg-blue-50 text-blue-800 border border-blue-200">
                              {law.shortCode}
                            </span>
                          </div>

                          <p className="text-[11px] text-slate-600 line-clamp-1">
                            {law.primaryFocus}
                          </p>

                          <div className="flex items-center gap-2 flex-wrap text-[10px] text-slate-500">
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

                      <div className="flex items-center gap-1 shrink-0 self-center">
                        <span className="hidden sm:inline-flex items-center gap-1 text-[11px] font-bold text-blue-700 group-hover:translate-x-0.5 transition-transform">
                          ऐन पढ्नुहोस्
                          <ChevronRight className="w-3.5 h-3.5" />
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* 2. Study Notes Results Across Institutions */}
            {matchedNotes.length > 0 && (
              <div className="space-y-2 pt-3">
                <div className="flex items-center justify-between px-1">
                  <span className="text-[11px] font-black uppercase text-emerald-700 tracking-wider flex items-center gap-1.5">
                    <BookOpen className="w-3.5 h-3.5" />
                    संस्थानगत अध्ययन नोट्स ({matchedNotes.length})
                  </span>
                  <span className="text-[10px] text-slate-500 font-medium">Exam-Focused Notes</span>
                </div>

                <div className="space-y-1.5">
                  {matchedNotes.map(({ note, matchedInstitutions: noteInsts }) => (
                    <div
                      key={note.id}
                      onClick={() => handleSelectNote(note)}
                      className="p-2.5 rounded-xl bg-white hover:bg-slate-50 border border-slate-200 hover:border-emerald-300 transition cursor-pointer group flex items-start justify-between gap-3 shadow-2xs"
                    >
                      <div className="flex items-start gap-2.5 min-w-0">
                        <div className="w-8 h-8 rounded-lg bg-emerald-50 border border-emerald-200 flex items-center justify-center shrink-0 text-emerald-700 mt-0.5">
                          <BookOpen className="w-4 h-4" />
                        </div>

                        <div className="min-w-0 space-y-1">
                          <div className="flex items-center gap-2 flex-wrap">
                            <h4 className="text-xs font-bold text-slate-900 group-hover:text-emerald-700 transition truncate">
                              {note.title}
                            </h4>
                            <span className="px-1.5 py-0.5 rounded text-[9px] font-bold bg-emerald-50 text-emerald-800 border border-emerald-200">
                              {note.subject}
                            </span>
                          </div>

                          {note.examTip && (
                            <p className="text-[11px] text-slate-600 line-clamp-1">
                              परीक्षा सुझाव: {note.examTip}
                            </p>
                          )}

                          <div className="flex items-center gap-2 flex-wrap text-[10px] text-slate-500">
                            <span className="flex items-center gap-1">
                              <Clock className="w-3 h-3 text-slate-400" />
                              {note.readTime}
                            </span>
                            <span>•</span>
                            <span className="flex items-center gap-1">
                              लागू हुने बैंकहरू:
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

                      <div className="flex items-center gap-1 shrink-0 self-center">
                        <span className="hidden sm:inline-flex items-center gap-1 text-[11px] font-bold text-emerald-700 group-hover:translate-x-0.5 transition-transform">
                          नोट पढ्नुहोस्
                          <ChevronRight className="w-3.5 h-3.5" />
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* 3. Institution Hub Matches */}
            {matchedInstitutions.length > 0 && (
              <div className="space-y-2 pt-3">
                <div className="flex items-center justify-between px-1">
                  <span className="text-[11px] font-black uppercase text-amber-700 tracking-wider flex items-center gap-1.5">
                    <Landmark className="w-3.5 h-3.5" />
                    बैंकिङ संस्थान तथा पाठ्यक्रम हब ({matchedInstitutions.length})
                  </span>
                  <span className="text-[10px] text-slate-500 font-medium">NRB / RBB / ADBL / NBL</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {matchedInstitutions.map((inst) => (
                    <div
                      key={inst.id}
                      onClick={() => handleSelectInstitution(inst)}
                      className="p-2.5 rounded-xl bg-white hover:bg-slate-50 border border-slate-200 hover:border-amber-300 transition cursor-pointer group space-y-1.5 shadow-2xs"
                    >
                      <div className="flex items-center justify-between gap-2">
                        <div className="flex items-center gap-2">
                          <span className="w-6 h-6 rounded-md bg-amber-50 border border-amber-200 text-amber-800 flex items-center justify-center font-black text-xs">
                            {inst.shortName}
                          </span>
                          <span className="text-xs font-bold text-slate-900 group-hover:text-amber-800 transition">
                            {inst.nameNe}
                          </span>
                        </div>
                        <ChevronRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-amber-700 transition" />
                      </div>

                      <p className="text-[10px] text-slate-600 line-clamp-1">
                        तह: {inst.levels}
                      </p>
                      
                      <div className="text-[9px] font-medium text-emerald-700 flex items-center gap-1">
                        <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                        {inst.vacancyStatus}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

          </div>

          {/* Footer Quick Action Bar */}
          <div className="p-2.5 border-t border-slate-200 bg-slate-50 flex items-center justify-between text-[11px] text-slate-600">
            <div className="flex items-center gap-3">
              <span className="font-semibold text-slate-700">
                कुल परिणाम: <span className="text-blue-700 font-bold">{totalResults}</span>
              </span>
              <span className="hidden sm:inline text-slate-400">•</span>
              <span className="hidden sm:inline">समर्थित बैंक: NRB, RBB, ADBL, NBL</span>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => {
                  setIsOpen(false);
                  if (onClose) onClose();
                }}
                className="px-2.5 py-1 text-xs font-medium text-slate-600 hover:text-slate-900 hover:bg-slate-200 rounded-lg transition cursor-pointer"
              >
                बन्द गर्नुहोस् (ESC)
              </button>
            </div>
          </div>

        </div>
      )}
    </div>
  );
};
