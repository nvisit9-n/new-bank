import React, { useState } from 'react';
import { 
  Flame, 
  Landmark, 
  Building2, 
  Scale, 
  CheckCircle2, 
  Clock, 
  ChevronRight, 
  BookOpen, 
  Sparkles, 
  ArrowRight, 
  Award, 
  FileText, 
  ShieldCheck, 
  Zap, 
  Play, 
  Check, 
  Layers,
  ChevronDown
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { LEVEL_SYLLABUS_DATABASE, LevelCategoryData } from '../../data/levelDashboardData';
import { OFFICIAL_SYLLABI } from '../../data/officialSyllabi';

export const MasterSequenceDashboard: React.FC = () => {
  const { setActiveTab, startQuiz, openLevelDashboard, openNoteReader, requireAuth, addToast } = useApp();

  // Selected Bank for Item #2 (Banking Written Prep)
  const [selectedBank, setSelectedBank] = useState<'NRB' | 'RBB' | 'NBL' | 'ADBL'>('NRB');
  const [selectedBankingLevel, setSelectedBankingLevel] = useState<'4' | '5' | '6'>('4');

  // Selected Enterprise for Item #3 (Public Enterprises Written Prep)
  const [selectedEnterprise, setSelectedEnterprise] = useState<'EPF' | 'CIT' | 'NTC' | 'NEA'>('EPF');
  const [selectedEnterpriseLevel, setSelectedEnterpriseLevel] = useState<'4' | '5' | '6'>('4');

  // Selected Loksewa Role for Item #4 (Civil Service Written Prep)
  const [selectedLoksewaRole, setSelectedLoksewaRole] = useState<'officer' | 'nasu' | 'kharidar'>('nasu');

  // Launch a pre-test set (1-50) directly into the quiz engine
  const handleLaunchPreTestSet = (setNumber: number) => {
    if (!requireAuth(() => handleLaunchPreTestSet(setNumber), 'परीक्षा सेट सुरु गर्न कृपया पहिले लगइन गर्नुहोस्।')) {
      return;
    }
    try {
      // Trigger navigation event to select Set and open Quiz tab
      window.dispatchEvent(new CustomEvent('btn:launch-pretest-set', { detail: { setNumber } }));
      setActiveTab('quiz');
      addToast(`सङ्गठित संस्था सेट ${setNumber} लोड हुँदैछ...`, 'info');
    } catch {
      setActiveTab('quiz');
    }
  };

  // Syllabus modules for Item #1
  const preTestSyllabusModules = [
    { no: '१', name: 'नेपालको भूगोल', weight: '५ प्रश्न (१० अङ्क)' },
    { no: '२', name: 'इतिहास & संस्कृति', weight: '५ प्रश्न (१० अङ्क)' },
    { no: '३', name: 'अर्थतन्त्र & मौद्रिक नीति', weight: '५ प्रश्न (१० अङ्क)' },
    { no: '४', name: 'नेपालको संविधान & शासन', weight: '५ प्रश्न (१० अङ्क)' },
    { no: '५', name: 'SAARC, UN & समसामयिक', weight: '५ प्रश्न (१० अङ्क)' },
    { no: '६', name: 'सूचना प्रविधि, AI & साइबर', weight: '५ प्रश्न (१० अङ्क)' },
    { no: '७', name: 'कार्यालय सञ्चालन & व्यवस्थापन', weight: '५ प्रश्न (१० अङ्क)' },
    { no: '८', name: 'सार्वजनिक संस्थान व्यवस्थापन', weight: '५ प्रश्न (१० अङ्क)' },
    { no: '९', name: 'सामान्य गणित & ऐकिक नियम', weight: '५ प्रश्न (१० अङ्क)' },
    { no: '१०', name: 'भाषा परीक्षण (व्याकरण)', weight: '५ प्रश्न (१० अङ्क)' }
  ];

  // Banking institutes config
  const bankingInstitutes = [
    { id: 'NRB' as const, nameNe: 'नेपाल राष्ट्र बैंक', code: 'NRB', desc: 'केन्द्रीय बैंक • तह ४, ५ र ६' },
    { id: 'RBB' as const, nameNe: 'राष्ट्रिय वाणिज्य बैंक', code: 'RBB', desc: 'सरकारी वाणिज्य बैंक • तह ४ र ५' },
    { id: 'NBL' as const, nameNe: 'नेपाल बैंक लिमिटेड', code: 'NBL', desc: 'पहिलो बैंक • तह ३ र ४' },
    { id: 'ADBL' as const, nameNe: 'कृषि विकास बैंक', code: 'ADBL', desc: 'कृषि तथा वाणिज्य • तह ४ र ५' }
  ];

  // Public Enterprises config
  const enterpriseInstitutes = [
    { id: 'EPF' as const, nameNe: 'कर्मचारी सञ्चय कोष', code: 'EPF', desc: 'सञ्चय कोष • तह ४, ५ र ६' },
    { id: 'CIT' as const, nameNe: 'नागरिक लगानी कोष', code: 'CIT', desc: 'ट्रस्ट तथा लगानी • तह ४, ५ र ६' },
    { id: 'NTC' as const, nameNe: 'नेपाल टेलिकम (ने.दू.सं.)', code: 'NTC', desc: 'दूरसञ्चार सेवा • तह ४, ५ र ६' },
    { id: 'NEA' as const, nameNe: 'नेपाल विद्युत प्राधिकरण', code: 'NEA', desc: 'विद्युत सेवा • तह ४, ५ र ६' }
  ];

  // Civil service roles config
  const loksewaRoles = [
    { id: 'officer' as const, nameNe: 'शाखा अधिकृत (Section Officer)', level: '६', desc: '४ वटै पत्र (शासन, समसामयिक, सेवा सम्बन्धी)' },
    { id: 'nasu' as const, nameNe: 'नायब सुब्बा (NaSu)', level: '५', desc: 'प्रथम & द्वितीय पत्र (सामान्य ज्ञान र सेवा व्यवस्थापन)' },
    { id: 'kharidar' as const, nameNe: 'खरिदार (Kharidar)', level: '४', desc: 'प्रथम & द्वितीय पत्र (गणित र कार्यालय कार्यज्ञान)' }
  ];

  return (
    <section className="space-y-6" aria-label="Official Examination Sequence">
      
      {/* Section Header: Sober Deep Navy Blue & Clear Hierarchy */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2 border-b border-slate-200 dark:border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-[11px] font-black uppercase tracking-wider text-sky-600 dark:text-sky-400 bg-sky-50 dark:bg-sky-950/60 px-2.5 py-0.5 rounded-md border border-sky-200 dark:border-sky-800">
              आधिकारिक परीक्षा तयारी क्रमबद्धता
            </span>
            <span className="text-xs font-bold text-slate-500 dark:text-slate-400">
              १ देखि ४ चरण
            </span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-[#0F172A] dark:text-white mt-1">
            परीक्षा तयारी मूल क्रम (Preparation Sequence 1 to 4)
          </h2>
        </div>
        <p className="text-xs text-slate-500 dark:text-slate-400 max-w-sm">
          प्रिटेस्ट बहुवैकल्पिक (Item #1) र विषयगत/लिखित परीक्षा पाठ्यक्रम (Item #2, #3, #4) को पूर्ण पृथकीकरण
        </p>
      </div>

      {/* =========================================================================
          ITEM #1: संगठित संस्था एकीकृत प्रिटेस्ट (HIGHEST PRIORITY FOR ALL EXAMS)
          Strictly dedicated to the 50-Set MCQ Integrated Pre-Test engine.
          ========================================================================= */}
      <div 
        id="home-sequence-item-1"
        className="rounded-3xl border-2 border-sky-400/80 dark:border-sky-600/80 bg-white dark:bg-slate-900 shadow-sm overflow-hidden transition-all"
      >
        {/* Deep Navy Blue Header Banner */}
        <div className="bg-[#0F172A] text-white p-5 sm:p-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-2">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="px-2.5 py-0.5 rounded-full bg-sky-500 text-white text-[11px] font-black uppercase tracking-wide flex items-center gap-1 shadow-2xs">
                <Flame className="w-3.5 h-3.5 fill-amber-300 text-amber-300" />
                <span>१. सर्वोच्च प्राथमिकता (HIGHEST PRIORITY)</span>
              </span>
              <span className="px-2.5 py-0.5 rounded-full bg-slate-800 text-sky-300 text-[11px] font-bold border border-slate-700">
                ५० पूर्ण सेटहरू • २,५००+ वस्तुगत प्रश्नहरू
              </span>
              <span className="px-2.5 py-0.5 rounded-full bg-emerald-900/60 text-emerald-300 text-[11px] font-bold border border-emerald-700/60">
                सबै संस्थान तथा बैंकका लागि साझा
              </span>
            </div>
            
            <h3 className="text-xl sm:text-2xl font-black text-white tracking-tight">
              १. संगठित संस्था एकीकृत प्रिटेस्ट (Integrated Pre-Test 50 Sets Engine)
            </h3>
            
            <p className="text-xs sm:text-sm text-slate-300 max-w-2xl leading-relaxed">
              लोक सेवा आयोगको आधिकारिक संगठित संस्था साझा पाठ्यक्रममा आधारित ५० वटा पूर्ण नमुना परीक्षा सेटहरू। ४५ मिनेट स्वचालित समय सीमा, १० वटै आधिकारिक खण्डहरू र ०.४ नेगेटिभ मार्किङसहितको वास्तविक परीक्षा हल अभ्यास।
            </p>
          </div>

          <div className="flex flex-col sm:flex-row md:flex-col gap-2 shrink-0">
            <button
              type="button"
              id="home-btn-launch-pretest-engine"
              onClick={() => setActiveTab('quiz')}
              className="px-5 py-3 rounded-2xl bg-sky-500 hover:bg-sky-400 active:scale-95 text-white font-black text-xs sm:text-sm transition-all flex items-center justify-center gap-2 shadow-md cursor-pointer"
            >
              <Play className="w-4 h-4 fill-current" />
              <span>प्रिटेस्ट इन्जिन खोल्नुहोस् (५० सेट)</span>
            </button>
            <button
              type="button"
              onClick={() => handleLaunchPreTestSet(1)}
              className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-sky-200 hover:text-white font-bold text-xs transition border border-slate-700 flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <span>सेट १ तत्काल सुरु गर्नुहोस्</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* 10 Syllabus Modules Preview (Sober Slate Layout) */}
        <div className="p-4 sm:p-5 bg-slate-50/80 dark:bg-slate-900/60 border-b border-slate-200 dark:border-slate-800">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-black uppercase tracking-wider text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
              <BookOpen className="w-3.5 h-3.5 text-sky-600" />
              <span>१० वटै आधिकारिक खण्डहरू (Official 10 Modules Breakdown):</span>
            </span>
            <span className="text-[11px] font-bold text-slate-500">
              प्रत्येक सेट = ५० प्रश्न (१०० अङ्क) • ४५ मिनेट
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2">
            {preTestSyllabusModules.map((mod, idx) => (
              <div 
                key={idx}
                className="p-2.5 rounded-xl bg-white dark:bg-slate-800 border border-slate-200/90 dark:border-slate-700/80 shadow-2xs hover:border-sky-400 transition"
              >
                <div className="flex items-center gap-1.5">
                  <span className="w-4 h-4 rounded-full bg-slate-100 dark:bg-slate-700 text-[#0F172A] dark:text-white font-black text-[10px] flex items-center justify-center shrink-0">
                    {mod.no}
                  </span>
                  <span className="text-xs font-bold text-slate-800 dark:text-slate-200 truncate">
                    {mod.name}
                  </span>
                </div>
                <p className="text-[10px] text-slate-500 dark:text-slate-400 mt-1 pl-5">
                  {mod.weight}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Quick Set Direct Launch Pills (Set 1 to 5, 10, 25, 50) */}
        <div className="p-4 sm:p-5 bg-white dark:bg-slate-900 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-xs font-bold text-slate-600 dark:text-slate-400">
              द्रुत अभ्यास सेट:
            </span>
            {[1, 2, 3, 4, 5, 10, 25, 50].map((num) => (
              <button
                key={num}
                type="button"
                onClick={() => handleLaunchPreTestSet(num)}
                className="px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-sky-500 hover:text-white dark:bg-slate-800 dark:hover:bg-sky-600 text-slate-700 dark:text-slate-200 text-xs font-bold transition shadow-2xs border border-slate-200/80 dark:border-slate-700 cursor-pointer"
                title={`सङ्गठित संस्था सेट ${num} सुरु गर्नुहोस्`}
              >
                सेट {num}
              </button>
            ))}
          </div>

          <button
            type="button"
            onClick={() => setActiveTab('quiz')}
            className="text-xs font-bold text-sky-600 dark:text-sky-400 hover:underline flex items-center gap-1 self-end sm:self-auto cursor-pointer"
          >
            <span>सबै ५० सेटहरू ब्राउज गर्नुहोस् &rarr;</span>
          </button>
        </div>
      </div>

      {/* =========================================================================
          ITEM #2: बैंकिङ्ग सेवा (Banking Sector Written & Syllabus)
          Specifically designed for Level-based Subjective/Written Exam Prep:
          NRB, RBB, NBL, ADBL (Level 4, Level 5, Level 6) with Paper I & II breakdowns.
          Seamlessly embeds official NRB syllabi, acts, and chapters!
          ========================================================================= */}
      <div 
        id="home-sequence-item-2"
        className="rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm overflow-hidden"
      >
        {/* Category Header */}
        <div className="p-5 sm:p-6 bg-slate-50 dark:bg-slate-850/60 border-b border-slate-200 dark:border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="w-7 h-7 rounded-lg bg-[#0F172A] text-white font-black text-xs flex items-center justify-center">
                २
              </span>
              <span className="text-xs font-black uppercase tracking-wider text-sky-600 dark:text-sky-400">
                लिखित तथा विषयगत परीक्षा तयारी (Subjective / Written Preparation)
              </span>
            </div>
            <h3 className="text-lg sm:text-xl font-black text-[#0F172A] dark:text-white tracking-tight">
              २. बैंकिङ्ग सेवा (Banking Sector Written & Syllabus: NRB, RBB, NBL, ADBL)
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              तह ४ (सहायक), तह ५ (वरिष्ठ सहायक) र तह ६ (अधिकृत) का लागि प्रथम र द्वितीय पत्रको विस्तृत विषयगत पाठ्यक्रम
            </p>
          </div>

          <button
            type="button"
            onClick={() => openLevelDashboard('banking', selectedBankingLevel, 0)}
            className="px-4 py-2.5 rounded-xl bg-[#0F172A] hover:bg-slate-800 text-white font-bold text-xs flex items-center justify-center gap-1.5 transition cursor-pointer shrink-0 shadow-xs"
          >
            <BookOpen className="w-3.5 h-3.5 text-sky-400" />
            <span>बैंकिङ्ग लिखित पाठ्यक्रम खोल्नुहोस्</span>
          </button>
        </div>

        {/* Bank Selection Tabs: NRB, RBB, NBL, ADBL */}
        <div className="p-4 sm:p-5 border-b border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {bankingInstitutes.map(bank => {
              const isActive = selectedBank === bank.id;
              return (
                <button
                  key={bank.id}
                  type="button"
                  onClick={() => setSelectedBank(bank.id)}
                  className={`p-3 rounded-2xl border text-left transition-all cursor-pointer ${
                    isActive
                      ? 'border-sky-500 bg-sky-50/60 dark:bg-sky-950/30 shadow-xs'
                      : 'border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/40'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className={`text-xs font-black ${isActive ? 'text-sky-700 dark:text-sky-300' : 'text-slate-900 dark:text-white'}`}>
                      {bank.nameNe}
                    </span>
                    <span className={`text-[10px] font-mono px-1.5 py-0.2 rounded font-bold ${
                      isActive ? 'bg-sky-500 text-white' : 'bg-slate-100 dark:bg-slate-800 text-slate-500'
                    }`}>
                      {bank.code}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">
                    {bank.desc}
                  </p>
                </button>
              );
            })}
          </div>
        </div>

        {/* Level Tabs: Level 4, Level 5, Level 6 */}
        <div className="p-4 sm:p-5 bg-slate-50/60 dark:bg-slate-900/40 space-y-4">
          <div className="flex items-center justify-between flex-wrap gap-2">
            <div className="flex items-center gap-1.5">
              <span className="text-xs font-bold text-slate-600 dark:text-slate-400">
                लिखित परीक्षा तह छनोट:
              </span>
              {(['4', '5', '6'] as const).map(lvl => (
                <button
                  key={lvl}
                  type="button"
                  onClick={() => setSelectedBankingLevel(lvl)}
                  className={`px-3 py-1 rounded-lg text-xs font-bold transition cursor-pointer ${
                    selectedBankingLevel === lvl
                      ? 'bg-[#0F172A] text-white shadow-2xs'
                      : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700 hover:bg-slate-100'
                  }`}
                >
                  तह {lvl} {lvl === '4' ? '(सहायक)' : lvl === '5' ? '(वरिष्ठ सहायक)' : '(अधिकृत)'}
                </button>
              ))}
            </div>

            <span className="text-[11px] font-bold text-slate-500 dark:text-slate-400">
              {selectedBank} तह {selectedBankingLevel} आधिकारिक ढाँचा
            </span>
          </div>

          {/* Paper I & Paper II Subjective Breakdown Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {/* Paper I */}
            <div className="p-4 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700/80 shadow-2xs space-y-2">
              <div className="flex items-center justify-between">
                <span className="px-2 py-0.5 rounded bg-sky-100 dark:bg-sky-950 text-sky-700 dark:text-sky-300 text-xs font-black">
                  प्रथम पत्र (Paper I)
                </span>
                <span className="text-xs font-bold text-slate-500">
                  पूर्णाङ्क: १०० • उत्तीर्णाङ्क: ४०
                </span>
              </div>
              <h4 className="text-sm font-black text-slate-900 dark:text-white">
                {selectedBank === 'NRB' 
                  ? 'सामान्य ज्ञान, बौद्धिक परीक्षण, गणित तथा कम्प्युटर' 
                  : 'बैंकिङ व्यवस्थापन, अर्थशास्त्र, लेखा तथा सूचना प्रविधि'}
              </h4>
              <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                {selectedBank === 'NRB'
                  ? 'नेपालको भूगोल, इतिहास, अर्थतन्त्र, बजेट, मौद्रिक नीति, आधारभूत गणित (ऐकिक नियम, प्रतिशत, ब्याज) र कम्प्युटर।'
                  : 'बैंकिङ सिद्धान्त, निक्षेप तथा कर्जा व्यवस्थापन, वासलात, दोहोरो लेखा प्रणाली, अनुपात विश्लेषण र कम्प्युटर ज्ञान।'}
              </p>
              <div className="pt-2 flex items-center justify-between border-t border-slate-100 dark:border-slate-700">
                <span className="text-[11px] text-slate-500">विषयगत + वस्तुगत प्रश्नहरू</span>
                <button
                  type="button"
                  onClick={() => openLevelDashboard('banking', selectedBankingLevel, 0)}
                  className="text-xs font-bold text-sky-600 dark:text-sky-400 hover:underline"
                >
                  खण्डहरू हेर्नुहोस् &rarr;
                </button>
              </div>
            </div>

            {/* Paper II */}
            <div className="p-4 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700/80 shadow-2xs space-y-2">
              <div className="flex items-center justify-between">
                <span className="px-2 py-0.5 rounded bg-sky-100 dark:bg-sky-950 text-sky-700 dark:text-sky-300 text-xs font-black">
                  द्वितीय पत्र (Paper II)
                </span>
                <span className="text-xs font-bold text-slate-500">
                  पूर्णाङ्क: १०० • समय: ३ घण्टा
                </span>
              </div>
              <h4 className="text-sm font-black text-slate-900 dark:text-white">
                {selectedBank === 'NRB'
                  ? 'बैंकिङ कानुन, व्यवस्थापन, लेखा तथा ऐन नियम'
                  : 'बैंकिङ कानुन, कार्य सञ्चालन, सुशासन तथा ऐन नियम'}
              </h4>
              <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                {selectedBank === 'NRB'
                  ? 'नेपाल राष्ट्र बैंक ऐन २०५८, BAFIA २०७३, बैंकिङ कसूर ऐन २०६४, AML/CFT, राष्ट्र बैंक एकीकृत निर्देशनहरू।'
                  : 'सम्बन्धित बैंकको कर्मचारी विनियमावली, BAFIA, कर्जा असुली, ग्राहक सेवा (KYC) र जोखिम व्यवस्थापन।'}
              </p>
              <div className="pt-2 flex items-center justify-between border-t border-slate-100 dark:border-slate-700">
                <span className="text-[11px] text-slate-500">१० प्रश्न × १० अङ्क (विश्लेषणात्मक)</span>
                <button
                  type="button"
                  onClick={() => openLevelDashboard('banking', selectedBankingLevel, 1)}
                  className="text-xs font-bold text-sky-600 dark:text-sky-400 hover:underline"
                >
                  खण्डहरू हेर्नुहोस् &rarr;
                </button>
              </div>
            </div>
          </div>

          {/* Embedded NRB Law & Directives Quick Cards when NRB is selected */}
          {selectedBank === 'NRB' && (
            <div className="p-3.5 rounded-2xl bg-sky-50/70 dark:bg-sky-950/20 border border-sky-200 dark:border-sky-900/40 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="flex items-center gap-2.5 min-w-0">
                <ShieldCheck className="w-5 h-5 text-sky-600 shrink-0" />
                <div className="truncate">
                  <p className="text-xs font-black text-slate-900 dark:text-white truncate">
                    नेपाल राष्ट्र बैंक (NRB) आधिकारिक ऐन तथा एकीकृत निर्देशन संग्रह
                  </p>
                  <p className="text-[11px] text-slate-600 dark:text-slate-300 truncate">
                    NRB Act २०५८ • एकीकृत निर्देशन २०८१/८२ • BAFIA २०७३ • AML/CFT कानुन
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <button
                  type="button"
                  onClick={() => openNoteReader('note-nrb-act-bare-act')}
                  className="px-3 py-1.5 rounded-lg bg-sky-600 hover:bg-sky-500 text-white text-xs font-bold transition cursor-pointer"
                >
                  NRB ऐन पढ्नुहोस्
                </button>
                <button
                  type="button"
                  onClick={() => openNoteReader('note-directives')}
                  className="px-3 py-1.5 rounded-lg bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 text-xs font-bold border border-slate-200 dark:border-slate-700 hover:bg-slate-100 transition cursor-pointer"
                >
                  निर्देशनहरू
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* =========================================================================
          ITEM #3: संगठित संस्था (Public Enterprises Written & Syllabus)
          Specifically designed for Level-based Subjective/Written Exam Prep:
          NTC, NEA, EPF, CIT (Level 4, Level 5, Level 6) with Paper I & II breakdowns.
          ========================================================================= */}
      <div 
        id="home-sequence-item-3"
        className="rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm overflow-hidden"
      >
        {/* Category Header */}
        <div className="p-5 sm:p-6 bg-slate-50 dark:bg-slate-850/60 border-b border-slate-200 dark:border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="w-7 h-7 rounded-lg bg-[#0F172A] text-white font-black text-xs flex items-center justify-center">
                ३
              </span>
              <span className="text-xs font-black uppercase tracking-wider text-sky-600 dark:text-sky-400">
                सार्वजनिक संस्थान विषयगत पाठ्यक्रम (Public Enterprises Written Prep)
              </span>
            </div>
            <h3 className="text-lg sm:text-xl font-black text-[#0F172A] dark:text-white tracking-tight">
              ३. संगठित संस्था (Public Enterprises Written & Syllabus: NTC, NEA, EPF, CIT)
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              कर्मचारी सञ्चय कोष, नागरिक लगानी कोष, नेपाल टेलिकम र विद्युत प्राधिकरणको तह ४, ५ र ६ लिखित पाठ्यक्रम
            </p>
          </div>

          <button
            type="button"
            onClick={() => openLevelDashboard('enterprises', selectedEnterpriseLevel, 0)}
            className="px-4 py-2.5 rounded-xl bg-[#0F172A] hover:bg-slate-800 text-white font-bold text-xs flex items-center justify-center gap-1.5 transition cursor-pointer shrink-0 shadow-xs"
          >
            <BookOpen className="w-3.5 h-3.5 text-sky-400" />
            <span>संगठित संस्था पाठ्यक्रम खोल्नुहोस्</span>
          </button>
        </div>

        {/* Enterprise Selector Tabs */}
        <div className="p-4 sm:p-5 border-b border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {enterpriseInstitutes.map(ent => {
              const isActive = selectedEnterprise === ent.id;
              return (
                <button
                  key={ent.id}
                  type="button"
                  onClick={() => setSelectedEnterprise(ent.id)}
                  className={`p-3 rounded-2xl border text-left transition-all cursor-pointer ${
                    isActive
                      ? 'border-sky-500 bg-sky-50/60 dark:bg-sky-950/30 shadow-xs'
                      : 'border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/40'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className={`text-xs font-black ${isActive ? 'text-sky-700 dark:text-sky-300' : 'text-slate-900 dark:text-white'}`}>
                      {ent.nameNe}
                    </span>
                    <span className={`text-[10px] font-mono px-1.5 py-0.2 rounded font-bold ${
                      isActive ? 'bg-sky-500 text-white' : 'bg-slate-100 dark:bg-slate-800 text-slate-500'
                    }`}>
                      {ent.code}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">
                    {ent.desc}
                  </p>
                </button>
              );
            })}
          </div>
        </div>

        {/* Level Tabs & Paper I & II Breakdown */}
        <div className="p-4 sm:p-5 bg-slate-50/60 dark:bg-slate-900/40 space-y-4">
          <div className="flex items-center justify-between flex-wrap gap-2">
            <div className="flex items-center gap-1.5">
              <span className="text-xs font-bold text-slate-600 dark:text-slate-400">
                लिखित परीक्षा तह:
              </span>
              {(['4', '5', '6'] as const).map(lvl => (
                <button
                  key={lvl}
                  type="button"
                  onClick={() => setSelectedEnterpriseLevel(lvl)}
                  className={`px-3 py-1 rounded-lg text-xs font-bold transition cursor-pointer ${
                    selectedEnterpriseLevel === lvl
                      ? 'bg-[#0F172A] text-white shadow-2xs'
                      : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700 hover:bg-slate-100'
                  }`}
                >
                  तह {lvl} {lvl === '4' ? '(सहायक)' : lvl === '5' ? '(सुपरभाइजर)' : '(अधिकृत)'}
                </button>
              ))}
            </div>

            <span className="text-[11px] font-bold text-slate-500">
              {selectedEnterprise} तह {selectedEnterpriseLevel} लिखित परीक्षा योजना
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div className="p-4 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700/80 shadow-2xs space-y-2">
              <span className="px-2 py-0.5 rounded bg-sky-100 dark:bg-sky-950 text-sky-700 dark:text-sky-300 text-xs font-black">
                प्रथम पत्र: संस्थान व्यवस्थापन र कानुन
              </span>
              <h4 className="text-sm font-black text-slate-900 dark:text-white">
                सार्वजनिक संस्थान सिद्धान्त, सञ्चालन तथा प्रशासनिक कार्यविधि
              </h4>
              <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                सार्वजनिक संस्थानको अवधारणा, उदारीकरण, निजीकरण, संस्थान सञ्चालन ऐन, कर्मचारी प्रशासन विनियमावली र लेखापरीक्षण।
              </p>
              <div className="pt-2 flex items-center justify-between border-t border-slate-100 dark:border-slate-700">
                <span className="text-[11px] text-slate-500">१०० पूर्णाङ्क • उत्तीर्णाङ्क ४०</span>
                <button
                  type="button"
                  onClick={() => openLevelDashboard('enterprises', selectedEnterpriseLevel, 0)}
                  className="text-xs font-bold text-sky-600 dark:text-sky-400 hover:underline"
                >
                  अध्ययन गर्नुहोस् &rarr;
                </button>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700/80 shadow-2xs space-y-2">
              <span className="px-2 py-0.5 rounded bg-sky-100 dark:bg-sky-950 text-sky-700 dark:text-sky-300 text-xs font-black">
                द्वितीय पत्र: सेवा सम्बन्धी विषयगत
              </span>
              <h4 className="text-sm font-black text-slate-900 dark:text-white">
                सम्बन्धित संस्थानको ऐन, नियमावली र कार्यक्षेत्र ज्ञान
              </h4>
              <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                कर्मचारी सञ्चय कोष ऐन / नागरिक लगानी कोष ऐन / नेपाल दूरसञ्चार ऐन / विद्युत ऐन, कोष परिचालन र ग्राहक सेवा।
              </p>
              <div className="pt-2 flex items-center justify-between border-t border-slate-100 dark:border-slate-700">
                <span className="text-[11px] text-slate-500">१० प्रश्न × १० अङ्क</span>
                <button
                  type="button"
                  onClick={() => openLevelDashboard('enterprises', selectedEnterpriseLevel, 1)}
                  className="text-xs font-bold text-sky-600 dark:text-sky-400 hover:underline"
                >
                  अध्ययन गर्नुहोस् &rarr;
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* =========================================================================
          ITEM #4: निजामती / लोकसेवा (PSC Civil Service Written & Syllabus)
          Specifically designed for Level-based Subjective/Written Exam Prep:
          Section Officer (Level 6), NaSu (Level 5), Kharidar (Level 4).
          ========================================================================= */}
      <div 
        id="home-sequence-item-4"
        className="rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm overflow-hidden"
      >
        {/* Category Header */}
        <div className="p-5 sm:p-6 bg-slate-50 dark:bg-slate-850/60 border-b border-slate-200 dark:border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="w-7 h-7 rounded-lg bg-[#0F172A] text-white font-black text-xs flex items-center justify-center">
                ४
              </span>
              <span className="text-xs font-black uppercase tracking-wider text-sky-600 dark:text-sky-400">
                लोकसेवा आयोग निजामती सेवा (PSC Civil Service Written Prep)
              </span>
            </div>
            <h3 className="text-lg sm:text-xl font-black text-[#0F172A] dark:text-white tracking-tight">
              ४. निजामती / लोकसेवा (PSC Civil Service Written & Syllabus: Section Officer, NaSu, Kharidar)
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              शाखा अधिकृत (तह ६), नायब सुब्बा (तह ५) र खरिदार (तह ४) का सम्पूर्ण विषयगत पत्रहरूको अद्यावधिक पाठ्यक्रम
            </p>
          </div>

          <button
            type="button"
            onClick={() => openLevelDashboard('loksewa', selectedLoksewaRole === 'officer' ? '6' : selectedLoksewaRole === 'nasu' ? '5' : '4', 0)}
            className="px-4 py-2.5 rounded-xl bg-[#0F172A] hover:bg-slate-800 text-white font-bold text-xs flex items-center justify-center gap-1.5 transition cursor-pointer shrink-0 shadow-xs"
          >
            <BookOpen className="w-3.5 h-3.5 text-sky-400" />
            <span>लोकसेवा पाठ्यक्रम खोल्नुहोस्</span>
          </button>
        </div>

        {/* Loksewa Role Selector */}
        <div className="p-4 sm:p-5 border-b border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
            {loksewaRoles.map(role => {
              const isActive = selectedLoksewaRole === role.id;
              return (
                <button
                  key={role.id}
                  type="button"
                  onClick={() => setSelectedLoksewaRole(role.id)}
                  className={`p-3.5 rounded-2xl border text-left transition-all cursor-pointer ${
                    isActive
                      ? 'border-sky-500 bg-sky-50/60 dark:bg-sky-950/30 shadow-xs'
                      : 'border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/40'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className={`text-xs sm:text-sm font-black ${isActive ? 'text-sky-700 dark:text-sky-300' : 'text-slate-900 dark:text-white'}`}>
                      {role.nameNe}
                    </span>
                    <span className={`text-[10px] font-mono px-2 py-0.5 rounded font-bold ${
                      isActive ? 'bg-sky-500 text-white' : 'bg-slate-100 dark:bg-slate-800 text-slate-600'
                    }`}>
                      तह {role.level}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">
                    {role.desc}
                  </p>
                </button>
              );
            })}
          </div>
        </div>

        {/* Paper Breakdown for Selected Loksewa Role */}
        <div className="p-4 sm:p-5 bg-slate-50/60 dark:bg-slate-900/40 space-y-3">
          {selectedLoksewaRole === 'officer' && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5">
              <div className="p-3 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
                <span className="text-[10px] font-black uppercase text-sky-600">प्रथम पत्र</span>
                <h5 className="text-xs font-bold text-slate-900 dark:text-white mt-1">प्रशासनिक अभिरुचि परीक्षण (GK/IQ)</h5>
                <p className="text-[11px] text-slate-500 mt-0.5">१०० पूर्णाङ्क • वस्तुगत परीक्षा</p>
              </div>
              <div className="p-3 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
                <span className="text-[10px] font-black uppercase text-sky-600">द्वितीय पत्र</span>
                <h5 className="text-xs font-bold text-slate-900 dark:text-white mt-1">शासकीय प्रबन्ध (Governance)</h5>
                <p className="text-[11px] text-slate-500 mt-0.5">१० प्रश्न × १० अङ्क • ३ घण्टा</p>
              </div>
              <div className="p-3 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
                <span className="text-[10px] font-black uppercase text-sky-600">तृतीय पत्र</span>
                <h5 className="text-xs font-bold text-slate-900 dark:text-white mt-1">समसामयिक मामिला (Contemporary)</h5>
                <p className="text-[11px] text-slate-500 mt-0.5">१० प्रश्न × १० अङ्क • ३ घण्टा</p>
              </div>
              <div className="p-3 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
                <span className="text-[10px] font-black uppercase text-sky-600">चतुर्थ पत्र</span>
                <h5 className="text-xs font-bold text-slate-900 dark:text-white mt-1">सेवा सम्बन्धी विषयगत (Service)</h5>
                <p className="text-[11px] text-slate-500 mt-0.5">प्रशासन, लेखा वा न्याय सेवा</p>
              </div>
            </div>
          )}

          {selectedLoksewaRole === 'nasu' && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="p-3.5 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
                <span className="text-[10px] font-black uppercase text-sky-600">प्रथम पत्र</span>
                <h5 className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white mt-1">सामान्य ज्ञान तथा आधारभूत बौद्धिक परीक्षण</h5>
                <p className="text-xs text-slate-500 mt-1">५० वस्तुगत प्रश्नहरू • १०० पूर्णाङ्क • ४५ मिनेट</p>
              </div>
              <div className="p-3.5 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
                <span className="text-[10px] font-black uppercase text-sky-600">द्वितीय पत्र</span>
                <h5 className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white mt-1">समसामयिक अध्ययन तथा सार्वजनिक सेवा व्यवस्थापन</h5>
                <p className="text-xs text-slate-500 mt-1">लिखित विषयगत परीक्षा • १०० पूर्णाङ्क • २ घण्टा ३० मिनेट</p>
              </div>
            </div>
          )}

          {selectedLoksewaRole === 'kharidar' && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="p-3.5 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
                <span className="text-[10px] font-black uppercase text-sky-600">प्रथम पत्र</span>
                <h5 className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white mt-1">सामान्य ज्ञान तथा आधारभूत गणित परीक्षण</h5>
                <p className="text-xs text-slate-500 mt-1">५० वस्तुगत प्रश्नहरू • १०० पूर्णाङ्क • ४५ मिनेट</p>
              </div>
              <div className="p-3.5 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
                <span className="text-[10px] font-black uppercase text-sky-600">द्वितीय पत्र</span>
                <h5 className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white mt-1">कार्यालय सञ्चालन तथा सामान्य कार्यज्ञान</h5>
                <p className="text-xs text-slate-500 mt-1">लिखित विषयगत परीक्षा • १०० पूर्णाङ्क • २ घण्टा ३० मिनेट</p>
              </div>
            </div>
          )}

          <div className="pt-1 flex items-center justify-end">
            <button
              type="button"
              onClick={() => openLevelDashboard('loksewa', selectedLoksewaRole === 'officer' ? '6' : selectedLoksewaRole === 'nasu' ? '5' : '4', 0)}
              className="text-xs font-bold text-sky-600 dark:text-sky-400 hover:underline flex items-center gap-1 cursor-pointer"
            >
              <span>लोकसेवा पूर्ण पाठ्यक्रम र नोटहरू हेर्नुहोस् &rarr;</span>
            </button>
          </div>
        </div>
      </div>

    </section>
  );
};
