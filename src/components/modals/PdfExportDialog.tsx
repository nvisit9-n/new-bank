import React, { useState, useEffect } from 'react';
import { 
  FileDown, 
  Printer, 
  CheckCircle2, 
  X, 
  Layers, 
  BookOpen, 
  ShieldCheck, 
  Sliders, 
  Download, 
  Sparkles, 
  AlertCircle,
  Building2,
  FileText,
  Lock,
  Unlock,
  Youtube
} from 'lucide-react';
import { 
  exportAllFiftyPreTestSets, 
  exportSinglePreTestSet, 
  exportAllQuestionBank,
  exportAdminCmsQuestions,
  buildDocumentHtml,
  downloadOfflineHtmlDocument,
  triggerPrintDocument,
  PdfSetGroup,
  normalizeSangathitQuestion,
  normalizeQuizQuestion
} from '../../utils/questionBankPdfEngine';
import { SYLLABUS_MODULES, buildModuleRepository } from '../../data/quizData';
import { allFiftySets } from '../../data/sangathitDatabase';
import { TOTAL_SETS } from '../../data/questionBank';
import { Question } from '../../types';
import { YouTubeSubscriptionGate } from '../../services/youtubeService';
import { YouTubeSubscribeModal } from './YouTubeSubscribeModal';
import { ActivityTrackingService } from '../../services/activityTrackingService';
import { useApp } from '../../context/AppContext';
import { isOwnerAdmin, PRIMARY_OWNER_EMAIL } from '../../utils/sanitizer';

export interface PdfExportDialogProps {
  isOpen: boolean;
  onClose: () => void;
  defaultScope?: 'all-50-sets' | 'single-set' | 'all-10k' | 'admin-cms';
  defaultSetNumber?: number;
  adminQuestions?: Question[];
}

export const PdfExportDialog: React.FC<PdfExportDialogProps> = ({
  isOpen,
  onClose,
  defaultScope = 'all-50-sets',
  defaultSetNumber = 1,
  adminQuestions = []
}) => {
  const { user } = useApp();
  const [scope, setScope] = useState<'all-50-sets' | 'single-set' | 'all-10k' | 'admin-cms'>(defaultScope);
  const [selectedSetNum, setSelectedSetNum] = useState<number>(defaultSetNumber);
  const [selectedModules, setSelectedModules] = useState<string[]>([]); // empty = all
  const [layoutMode, setLayoutMode] = useState<'comprehensive' | 'exam'>('comprehensive');
  const [includeWatermark, setIncludeWatermark] = useState<boolean>(true);
  const [includeCoverPage, setIncludeCoverPage] = useState<boolean>(true);

  // Status & Progress
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [progressPercent, setProgressPercent] = useState<number>(0);
  const [progressMessage, setProgressMessage] = useState<string>('');

  // YouTube Subscription Gateway State
  const [isSubscribed, setIsSubscribed] = useState<boolean>(() => YouTubeSubscriptionGate.isUnlocked());
  const [showSubscribeModal, setShowSubscribeModal] = useState<boolean>(false);
  const [pendingAction, setPendingAction] = useState<'print' | 'download' | null>(null);

  useEffect(() => {
    const handleUnlockedEvent = () => {
      setIsSubscribed(true);
    };
    window.addEventListener('btn-youtube-unlocked', handleUnlockedEvent);
    return () => {
      window.removeEventListener('btn-youtube-unlocked', handleUnlockedEvent);
    };
  }, []);


  if (!isOpen) return null;

  // Strict Admin Guard: PDF Download restricted to Admin (nvisit9@gmail.com)
  if (!isOwnerAdmin(user?.email)) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
        <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 max-w-md w-full border border-slate-200 dark:border-slate-800 shadow-2xl space-y-5 text-center">
          <div className="w-14 h-14 rounded-2xl bg-amber-500/10 text-amber-500 flex items-center justify-center mx-auto">
            <Lock className="w-7 h-7" />
          </div>
          <div>
            <span className="px-3 py-1 rounded-full bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300 text-xs font-bold">
              अनलाइन अभ्यास मोड (View-Only Practice Mode)
            </span>
            <h3 className="text-lg font-black text-slate-900 dark:text-white mt-2">
              विद्यार्थीहरूका लागि अनलाइन अभ्यास खुला छ
            </h3>
            <p className="text-xs text-slate-600 dark:text-slate-300 mt-2 leading-relaxed">
              १०,०००+ प्रश्न भण्डार तथा ५० वटै Pre-Test सेटहरू विद्यार्थीहरूका लागि पूर्ण अनलाइन इन्टरएक्टिभ अभ्यास मोडमा निःशुल्क उपलब्ध छन्। 
              आधिकारिक A4 PDF डाउनलोड सुविधा केवल प्रशासक खाता (<span className="font-mono text-red-500 font-bold">{PRIMARY_OWNER_EMAIL}</span>) का लागि मात्र Admin CMS भित्र सुरक्षित गरिएको छ।
            </p>
          </div>
          <div className="pt-2 flex flex-col gap-2">
            <button
              type="button"
              onClick={onClose}
              className="w-full py-3 rounded-2xl bg-[#0F2942] hover:bg-[#1A3A5F] text-white font-black text-xs sm:text-sm shadow-md transition cursor-pointer"
            >
              अनलाइन अभ्यास सुरु गर्नुहोस् (Start Online Practice)
            </button>
            <button
              type="button"
              onClick={onClose}
              className="w-full py-2 text-xs text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition cursor-pointer"
            >
              बन्द गर्नुहोस् (Close)
            </button>
          </div>
        </div>
      </div>
    );
  }

  const handleToggleModule = (modId: string) => {
    setSelectedModules(prev => 
      prev.includes(modId) ? prev.filter(id => id !== modId) : [...prev, modId]
    );
  };

  const handleSelectAllModules = () => {
    setSelectedModules([]);
  };

  const runExport = async (actionType: 'print' | 'download') => {
    // 1. YouTube Subscription Gatekeeper check
    if (!isSubscribed && !YouTubeSubscriptionGate.isUnlocked()) {
      setPendingAction(actionType);
      setShowSubscribeModal(true);
      return;
    }

    setIsGenerating(true);
    setProgressPercent(10);
    setProgressMessage('डेटा सङ्कलन तथा प्रशोधन हुँदैछ...');

    // Log PDF download attempt in user activity tracker
    const exportTitle = scope === 'all-50-sets' 
      ? '५० पूर्ण Pre-Test सेटहरू (२,५०० MCQs)' 
      : scope === 'all-10k' 
      ? '१०,०००+ सम्पूर्ण प्रश्न भण्डार' 
      : scope === 'single-set'
      ? `Pre-Test सेट ${selectedSetNum}`
      : 'प्रशासनिक CMS प्रश्न भण्डार';

    try {
      ActivityTrackingService.logDownload({
        user: user || undefined,
        fileName: `${exportTitle}.pdf`,
        fileType: 'PDF',
        resourceCategory: scope === 'all-10k' ? '10,000+ Question Bank' : scope === 'all-50-sets' ? '50 Pre-Test Sets' : 'Quiz Sets',
        details: `PDF निर्यात सुरु (${actionType === 'print' ? 'प्रिन्ट / PDF Save' : 'अफलाइन डाउनलोड'}): ${exportTitle} • ढाँचा: ${layoutMode}`
      }).catch(() => {});
    } catch {}

    try {
      if (scope === 'all-50-sets') {
        setProgressPercent(30);
        setProgressMessage('५० वटै Pre-Test सेटहरू (२,५०० प्रश्नहरू) तयार गरिँदैछ...');
        
        const groups: PdfSetGroup[] = allFiftySets.map((rawSet, idx) => ({
          setId: rawSet.setId || (idx + 1),
          title: `Set ${rawSet.setId || (idx + 1)}: L4 & L5 Pre-Test`,
          nepaliTitle: rawSet.setName || `सङ्गठित संस्था Pre-Test - सेट ${rawSet.setId || (idx + 1)}`,
          targetLevel: 'तह ४ र ५ (Assistant & Officer)',
          timeLimitMinutes: 45,
          questions: (rawSet.questions || []).map((q, qIdx) => normalizeSangathitQuestion(q, qIdx))
        }));

        setProgressPercent(70);
        setProgressMessage('वाटरमार्क तथा A4 पृष्ठहरू संरचना गरिँदैछ...');

        const html = buildDocumentHtml(groups, {
          title: 'सङ्गठित संस्था ५० पूर्ण Pre-Test सेटहरू (All 50 Master Sets)',
          subtitle: 'नेपाल राष्ट्र बैंक, सार्वजनिक संस्थान तथा लोकसेवा आयोग प्रथम पत्र नमुना परीक्षा ५० सेटहरू (२,५०० MCQs)',
          examLevel: 'तह ४ र तह ५',
          mode: layoutMode,
          includeWatermark,
          includeCoverPage
        });

        setProgressPercent(95);
        if (actionType === 'print') {
          setProgressMessage('प्रिन्ट तथा Save-as-PDF डायलग खुल्दैछ...');
          triggerPrintDocument(html);
        } else {
          setProgressMessage('अफलाइन HTML/PDF फाइल डाउनलोड हुँदैछ...');
          downloadOfflineHtmlDocument(html, 'Banking_Tayari_Nepal_50_PreTest_Sets');
        }

      } else if (scope === 'single-set') {
        setProgressPercent(50);
        setProgressMessage(`सेट ${selectedSetNum} तयार गरिँदैछ...`);
        
        const safeNum = Math.max(1, Math.min(TOTAL_SETS, selectedSetNum));
        const rawSet = allFiftySets[safeNum - 1];
        
        const group: PdfSetGroup = {
          setId: safeNum,
          title: `Set ${safeNum}: Pre-Test`,
          nepaliTitle: rawSet.setName || `सङ्गठित संस्था Pre-Test - सेट ${safeNum}`,
          targetLevel: 'तह ४ र ५',
          timeLimitMinutes: 45,
          questions: (rawSet.questions || []).map((q, qIdx) => normalizeSangathitQuestion(q, qIdx))
        };

        const html = buildDocumentHtml([group], {
          title: `सङ्गठित संस्था Pre-Test - सेट ${safeNum}`,
          subtitle: 'आधिकारिक पाठ्यक्रम अनुसार ५० वस्तुगत प्रश्नोत्तर',
          examLevel: 'तह ४ र ५',
          mode: layoutMode,
          includeWatermark,
          includeCoverPage: false
        });

        if (actionType === 'print') {
          triggerPrintDocument(html);
        } else {
          downloadOfflineHtmlDocument(html, `Banking_Tayari_Nepal_Set_${safeNum}`);
        }

      } else if (scope === 'all-10k') {
        const targetModules = selectedModules.length > 0 
          ? SYLLABUS_MODULES.filter(m => selectedModules.includes(m.id))
          : SYLLABUS_MODULES;

        const groups: PdfSetGroup[] = [];
        let count = 0;

        for (const mod of targetModules) {
          setProgressPercent(20 + Math.round((count / targetModules.length) * 60));
          setProgressMessage(`मोड्युल तयार हुँदैछ: ${mod.nameNepali}...`);

          const rawQuestions = buildModuleRepository(mod.id, 1000);
          groups.push({
            title: mod.nameEnglish,
            nepaliTitle: mod.nameNepali,
            description: mod.description,
            targetLevel: mod.level,
            questions: rawQuestions.map((q, qIdx) => normalizeQuizQuestion(q, qIdx))
          });

          count++;
          await new Promise(r => setTimeout(r, 15));
        }

        setProgressPercent(85);
        setProgressMessage('बृहत् १०,०००+ A4 लेआउट र वाटरमार्क निर्माण हुँदैछ...');

        const html = buildDocumentHtml(groups, {
          title: '१०,०००+ बृहत् वस्तुगत प्रश्न भण्डार (Mega Question Bank)',
          subtitle: 'नेपाल राष्ट्र बैंक, वाणिज्य बैंकहरू तथा लोकसेवा आयोग १० वटै पाठ्यक्रम मोड्युलहरूको सङ्ग्रह',
          examLevel: 'तह ४ देखि तह १०',
          mode: layoutMode,
          includeWatermark,
          includeCoverPage
        });

        setProgressPercent(95);
        if (actionType === 'print') {
          triggerPrintDocument(html);
        } else {
          downloadOfflineHtmlDocument(html, 'Banking_Tayari_Nepal_10000_Question_Bank');
        }

      } else if (scope === 'admin-cms') {
        setProgressPercent(60);
        setProgressMessage(`प्रशासनिक प्रश्नहरू (${adminQuestions.length}) तयार गरिँदैछ...`);
        exportAdminCmsQuestions(adminQuestions, 'all', layoutMode, includeWatermark);
      }

      setProgressPercent(100);
      setProgressMessage('सफलतापूर्वक सम्पन्न भयो!');
      setTimeout(() => {
        setIsGenerating(false);
        onClose();
      }, 1200);

    } catch (err) {
      console.error('PDF Export Error:', err);
      setIsGenerating(false);
      alert('PDF तयार गर्दा केही त्रुटि भयो। कृपया पुन: प्रयास गर्नुहोस्।');
    }
  };

  return (
    <div 
      className="fixed inset-0 z-[9999] flex items-center justify-center p-3 sm:p-5 bg-slate-950/85 backdrop-blur-md animate-in fade-in duration-200"
      role="dialog"
      aria-modal="true"
      onClick={onClose}
    >
      <div 
        className="w-full max-w-2xl bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden flex flex-col max-h-[90vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="p-4 sm:p-5 bg-[#0F2942] text-white flex items-center justify-between border-b border-blue-900/50 shrink-0">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-2xl bg-white/10 text-white border border-white/20">
              <FileDown className="w-6 h-6 text-red-400" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base sm:text-lg font-black text-white">
                  आधिकारिक PDF तथा परीक्षा सामग्री डाउनलोड इन्जिन
                </h3>
                <span className="px-2 py-0.5 rounded-full bg-[#E63946] text-white text-[10px] font-black">
                  A4 Print Ready
                </span>
              </div>
              <p className="text-xs text-blue-200 mt-0.5">
                बृहत् १०,०००+ प्रश्न भण्डार तथा ५० Pre-Test सेटहरू • वाटरमार्क र उत्तरकुञ्जी सहित
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            disabled={isGenerating}
            className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-white transition cursor-pointer disabled:opacity-50"
            title="बन्द गर्नुहोस्"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-5">
          
          {/* YouTube Subscription Gateway Status Banner */}
          {!isSubscribed ? (
            <div className="p-3.5 rounded-2xl bg-gradient-to-r from-red-50 via-rose-50 to-amber-50 dark:from-red-950/40 dark:via-slate-800/80 dark:to-slate-900 border border-red-300 dark:border-red-900/60 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-sm">
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-xl bg-red-600 text-white shrink-0 shadow-sm">
                  <Youtube className="w-5 h-5 fill-current" />
                </div>
                <div>
                  <div className="flex items-center gap-1.5">
                    <span className="text-[10px] font-black uppercase tracking-wider px-1.5 py-0.5 rounded bg-red-600 text-white flex items-center gap-1">
                      <Lock className="w-2.5 h-2.5" />
                      PDF सुरक्षा गेटवे
                    </span>
                    <span className="text-xs font-black text-slate-900 dark:text-white">
                      PDF डाउनलोड गर्न हाम्रो Official YouTube Channel Subscribe गर्नुहोस्
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-600 dark:text-slate-400 mt-0.5">
                    हाम्रो Official YouTube Channel (@bankingtayarinepal) Subscribe गरेपछि सम्पूर्ण १०,०००+ प्रश्न तथा ५० वटै सेटहरूको PDF तुरुन्त अनलक हुनेछ।
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setShowSubscribeModal(true)}
                className="w-full sm:w-auto px-3.5 py-2 rounded-xl bg-red-600 hover:bg-red-700 text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow-sm transition cursor-pointer shrink-0 active:scale-95"
              >
                <Youtube className="w-4 h-4 fill-current" />
                <span>Subscribe गरी अनलक गर्नुहोस्</span>
              </button>
            </div>
          ) : (
            <div className="p-2.5 px-3.5 rounded-2xl bg-emerald-50/90 dark:bg-emerald-950/30 border border-emerald-300/80 dark:border-emerald-900/50 flex items-center justify-between gap-2 text-xs">
              <div className="flex items-center gap-2 text-emerald-800 dark:text-emerald-300 font-bold">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>YouTube Subscription प्रमाणित • सबै PDF डाउनलोड तथा प्रिन्ट अनलक छन्</span>
              </div>
              <span className="px-2 py-0.5 rounded-full bg-emerald-600 text-white text-[10px] font-black tracking-wider uppercase flex items-center gap-1">
                <Unlock className="w-3 h-3" />
                UNLOCKED
              </span>
            </div>
          )}

          {/* 1. Scope Selection */}
          <div className="space-y-2">
            <label className="text-xs font-black text-slate-700 dark:text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
              <Layers className="w-4 h-4 text-red-500" />
              <span>१. डाउनलोडको दायरा छनोट गर्नुहोस् (Select Export Scope)</span>
            </label>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {/* Option 1: 50 Sets */}
              <button
                type="button"
                onClick={() => setScope('all-50-sets')}
                className={`p-3.5 rounded-2xl border text-left transition cursor-pointer flex flex-col justify-between ${
                  scope === 'all-50-sets'
                    ? 'border-[#E63946] bg-red-50/70 dark:bg-red-950/20 ring-2 ring-[#E63946]/30'
                    : 'border-slate-200 dark:border-slate-800 bg-slate-50/60 dark:bg-slate-800/40 hover:border-slate-300'
                }`}
              >
                <div className="flex items-center justify-between mb-1.5">
                  <span className="font-black text-xs text-slate-800 dark:text-slate-100 flex items-center gap-1.5">
                    <Building2 className="w-4 h-4 text-red-600" />
                    ५० Pre-Test सेटहरू (All 50 Sets)
                  </span>
                  <span className="px-2 py-0.5 rounded-full bg-red-600 text-white text-[10px] font-bold">
                    २,५०० MCQs
                  </span>
                </div>
                <p className="text-[11px] text-slate-500 dark:text-slate-400">
                  तह ४ र ५ का ५० वटै पूर्ण सेटहरू, १० खण्ड पाठ्यक्रम र उत्तरकुञ्जी एकमुष्ट।
                </p>
              </button>

              {/* Option 2: 10,000+ Question Bank */}
              <button
                type="button"
                onClick={() => setScope('all-10k')}
                className={`p-3.5 rounded-2xl border text-left transition cursor-pointer flex flex-col justify-between ${
                  scope === 'all-10k'
                    ? 'border-[#0F2942] bg-blue-50/70 dark:bg-blue-950/20 ring-2 ring-[#0F2942]/30'
                    : 'border-slate-200 dark:border-slate-800 bg-slate-50/60 dark:bg-slate-800/40 hover:border-slate-300'
                }`}
              >
                <div className="flex items-center justify-between mb-1.5">
                  <span className="font-black text-xs text-slate-800 dark:text-slate-100 flex items-center gap-1.5">
                    <BookOpen className="w-4 h-4 text-blue-700" />
                    १०,०००+ प्रश्न भण्डार (Mega Bank)
                  </span>
                  <span className="px-2 py-0.5 rounded-full bg-[#0F2942] text-white text-[10px] font-bold">
                    १०,०००+ MCQs
                  </span>
                </div>
                <p className="text-[11px] text-slate-500 dark:text-slate-400">
                  १० वटै पाठ्यक्रम मोड्युलका १०,०००+ आधिकारिक प्रश्नहरू तथा पूर्ण कानुनी व्याख्या।
                </p>
              </button>

              {/* Option 3: Single Set */}
              <button
                type="button"
                onClick={() => setScope('single-set')}
                className={`p-3.5 rounded-2xl border text-left transition cursor-pointer flex flex-col justify-between ${
                  scope === 'single-set'
                    ? 'border-emerald-600 bg-emerald-50/70 dark:bg-emerald-950/20 ring-2 ring-emerald-500/30'
                    : 'border-slate-200 dark:border-slate-800 bg-slate-50/60 dark:bg-slate-800/40 hover:border-slate-300'
                }`}
              >
                <div className="flex items-center justify-between mb-1.5">
                  <span className="font-black text-xs text-slate-800 dark:text-slate-100 flex items-center gap-1.5">
                    <FileText className="w-4 h-4 text-emerald-600" />
                    कुनै निश्चित १ सेट (Individual Set)
                  </span>
                  <span className="px-2 py-0.5 rounded-full bg-emerald-600 text-white text-[10px] font-bold">
                    ५० MCQs
                  </span>
                </div>
                <p className="text-[11px] text-slate-500 dark:text-slate-400">
                  सेट १ देखि ५० मध्ये कुनै १ निश्चित सेट मात्र डाउनलोड गर्न।
                </p>
              </button>

              {/* Option 4: Admin CMS Questions */}
              <button
                type="button"
                onClick={() => setScope('admin-cms')}
                className={`p-3.5 rounded-2xl border text-left transition cursor-pointer flex flex-col justify-between ${
                  scope === 'admin-cms'
                    ? 'border-purple-600 bg-purple-50/70 dark:bg-purple-950/20 ring-2 ring-purple-500/30'
                    : 'border-slate-200 dark:border-slate-800 bg-slate-50/60 dark:bg-slate-800/40 hover:border-slate-300'
                }`}
              >
                <div className="flex items-center justify-between mb-1.5">
                  <span className="font-black text-xs text-slate-800 dark:text-slate-100 flex items-center gap-1.5">
                    <Sliders className="w-4 h-4 text-purple-600" />
                    प्रशासनिक प्रश्न भण्डार (Admin CMS)
                  </span>
                  <span className="px-2 py-0.5 rounded-full bg-purple-600 text-white text-[10px] font-bold">
                    {adminQuestions.length} प्रश्न
                  </span>
                </div>
                <p className="text-[11px] text-slate-500 dark:text-slate-400">
                  CMS प्यानलमा थपिएका र सम्पादित प्रश्नहरूको अभिलेख।
                </p>
              </button>
            </div>
          </div>

          {/* Sub-selectors depending on scope */}
          {scope === 'single-set' && (
            <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-2">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                सेट नम्बर छनोट गर्नुहोस् (Select Set 1 to 50):
              </label>
              <select
                value={selectedSetNum}
                onChange={(e) => setSelectedSetNum(Number(e.target.value))}
                className="w-full px-3 py-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 text-xs font-bold text-slate-800 dark:text-slate-100"
              >
                {Array.from({ length: TOTAL_SETS }, (_, i) => i + 1).map((num) => (
                  <option key={num} value={num}>
                    सेट {num} (सङ्गठित संस्था L4 & L5 Pre-Test - ५० प्रश्नहरू)
                  </option>
                ))}
              </select>
            </div>
          )}

          {scope === 'all-10k' && (
            <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-2.5">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                  पाठ्यक्रम मोड्युल छनोट गर्नुहोस् (Select Modules):
                </label>
                <button
                  type="button"
                  onClick={handleSelectAllModules}
                  className="text-[11px] font-bold text-blue-600 hover:underline"
                >
                  {selectedModules.length === 0 ? '✓ सबै १० मोड्युल (१०,००० प्रश्न)' : 'सबै १० वटै छनोट गर्नुहोस्'}
                </button>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-2 gap-1.5 max-h-36 overflow-y-auto pr-1">
                {SYLLABUS_MODULES.map((mod) => {
                  const isChecked = selectedModules.length === 0 || selectedModules.includes(mod.id);
                  return (
                    <button
                      key={mod.id}
                      type="button"
                      onClick={() => handleToggleModule(mod.id)}
                      className={`px-2.5 py-1.5 rounded-lg text-left text-[11px] font-bold border transition flex items-center justify-between ${
                        isChecked 
                          ? 'bg-blue-100/70 dark:bg-blue-950/50 border-blue-400 text-blue-900 dark:text-blue-200' 
                          : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-700 text-slate-600'
                      }`}
                    >
                      <span className="truncate">{mod.nameNepali}</span>
                      <span className="text-[10px] text-slate-400 shrink-0 ml-1">१,००० Q</span>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* 2. Format & Layout Mode */}
          <div className="space-y-2">
            <label className="text-xs font-black text-slate-700 dark:text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
              <Sliders className="w-4 h-4 text-red-500" />
              <span>२. ढाँचा र लेआउट (Format & Layout Mode)</span>
            </label>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              <button
                type="button"
                onClick={() => setLayoutMode('comprehensive')}
                className={`p-3 rounded-2xl border text-left transition cursor-pointer flex items-start gap-2.5 ${
                  layoutMode === 'comprehensive'
                    ? 'border-[#0F2942] bg-blue-50/50 dark:bg-blue-950/20 ring-2 ring-[#0F2942]/20'
                    : 'border-slate-200 dark:border-slate-800 hover:bg-slate-50'
                }`}
              >
                <div className={`p-1.5 rounded-lg mt-0.5 ${layoutMode === 'comprehensive' ? 'bg-[#0F2942] text-white' : 'bg-slate-200 text-slate-600'}`}>
                  <BookOpen className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-xs font-black text-slate-800 dark:text-slate-100">
                    विस्तृत अध्ययन गाइड (Study Guide)
                  </h4>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                    प्रत्येक प्रश्नको मुनि सही उत्तर (टिक मार्क), ऐन/दफाको कानुनी आधार र पूर्ण नेपाली व्याख्या।
                  </p>
                </div>
              </button>

              <button
                type="button"
                onClick={() => setLayoutMode('exam')}
                className={`p-3 rounded-2xl border text-left transition cursor-pointer flex items-start gap-2.5 ${
                  layoutMode === 'exam'
                    ? 'border-[#E63946] bg-red-50/50 dark:bg-red-950/20 ring-2 ring-[#E63946]/20'
                    : 'border-slate-200 dark:border-slate-800 hover:bg-slate-50'
                }`}
              >
                <div className={`p-1.5 rounded-lg mt-0.5 ${layoutMode === 'exam' ? 'bg-[#E63946] text-white' : 'bg-slate-200 text-slate-600'}`}>
                  <Printer className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-xs font-black text-slate-800 dark:text-slate-100">
                    परीक्षा प्रश्नपत्र ढाँचा (Exam Model Paper)
                  </h4>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                    नमुना परीक्षा प्रश्नपत्र मात्र, र सबैभन्दा अन्त्यमा OMR उत्तरकुञ्जी तालिका (Answer Key Grid)।
                  </p>
                </div>
              </button>
            </div>
          </div>

          {/* 3. Branding & Watermark Options */}
          <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/80 flex flex-wrap items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <span className="font-bold text-slate-800 dark:text-slate-200">
                आधिकारिक वाटरमार्क (Diagonal Light Watermark)
              </span>
            </div>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={includeWatermark}
                onChange={(e) => setIncludeWatermark(e.target.checked)}
                className="w-4 h-4 rounded text-red-600 focus:ring-red-500 cursor-pointer"
              />
              <span className="font-semibold text-slate-600 dark:text-slate-300">
                वाटरमार्क समावेश गर्नुहोस् (सिफारिस गरिएको)
              </span>
            </label>
          </div>

          {/* Progress Bar (Visible while generating) */}
          {isGenerating && (
            <div className="p-4 rounded-2xl bg-blue-50 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-900/60 space-y-2">
              <div className="flex items-center justify-between text-xs font-bold text-blue-900 dark:text-blue-200">
                <span className="flex items-center gap-1.5">
                  <Sparkles className="w-4 h-4 text-red-500 animate-spin" />
                  {progressMessage}
                </span>
                <span>{progressPercent}%</span>
              </div>
              <div className="w-full h-2 bg-blue-200 dark:bg-blue-900 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-gradient-to-r from-[#0F2942] to-[#E63946] transition-all duration-300"
                  style={{ width: `${progressPercent}%` }}
                />
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer Actions */}
        <div className="p-4 sm:p-5 bg-slate-50 dark:bg-slate-800/80 border-t border-slate-200 dark:border-slate-700/80 flex flex-col sm:flex-row items-center justify-between gap-3 shrink-0">
          <div className="text-[11px] text-slate-500 dark:text-slate-400 text-center sm:text-left">
            <span>A4 ढाँचा • नेपाली युनिकोड शतप्रतिशत शुद्ध • Google Chrome / Safari / Edge Print to PDF समर्थित</span>
          </div>

          <div className="flex items-center gap-2.5 w-full sm:w-auto">
            <button
              type="button"
              disabled={isGenerating}
              onClick={() => runExport('download')}
              className={`flex-1 sm:flex-none px-4 py-2.5 rounded-xl border font-bold text-xs flex items-center justify-center gap-2 transition cursor-pointer disabled:opacity-50 ${
                !isSubscribed 
                  ? 'border-red-300 dark:border-red-800 bg-red-50 dark:bg-red-950/30 text-red-700 dark:text-red-300 hover:bg-red-100' 
                  : 'border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-800 dark:text-slate-200'
              }`}
            >
              {!isSubscribed ? <Lock className="w-3.5 h-3.5 text-red-500" /> : <Download className="w-4 h-4 text-slate-600" />}
              <span>अफलाइन HTML/PDF सेभ गर्नुहोस्</span>
            </button>

            <button
              type="button"
              disabled={isGenerating}
              onClick={() => runExport('print')}
              className={`flex-1 sm:flex-none px-5 py-2.5 rounded-xl text-white font-black text-xs flex items-center justify-center gap-2 shadow-md transition cursor-pointer active:scale-95 disabled:opacity-50 ${
                !isSubscribed
                  ? 'bg-gradient-to-r from-red-600 to-rose-700 hover:from-red-700 hover:to-rose-800 shadow-red-950/20'
                  : 'bg-[#0F2942] hover:bg-[#1A3A5F] shadow-blue-950/20'
              }`}
            >
              {!isSubscribed ? <Lock className="w-4 h-4 text-amber-300" /> : <Printer className="w-4 h-4 text-red-400" />}
              <span>{!isSubscribed ? 'युट्युब Subscribe गरी PDF खोल्नुहोस्' : 'PDF प्रिन्ट / डाउनलोड गर्नुहोस्'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Dedicated YouTube Subscription Gateway Modal */}
      {showSubscribeModal && (
        <YouTubeSubscribeModal
          isOpen={showSubscribeModal}
          onClose={() => setShowSubscribeModal(false)}
          onSuccess={() => {
            setIsSubscribed(true);
            setShowSubscribeModal(false);
            if (pendingAction) {
              const act = pendingAction;
              setPendingAction(null);
              setTimeout(() => {
                runExport(act);
              }, 400);
            }
          }}
          targetResourceName={
            scope === 'all-50-sets' 
              ? '५० पूर्ण Pre-Test सेटहरू (२,५०० MCQs) PDF' 
              : scope === 'all-10k' 
              ? '१०,०००+ सम्पूर्ण प्रश्न भण्डार A4 PDF' 
              : `Pre-Test सेट ${selectedSetNum} PDF`
          }
        />
      )}
    </div>
  );
};
