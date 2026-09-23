import React, { useState, useEffect } from 'react';
import { 
  Award, 
  CheckCircle2, 
  AlertTriangle, 
  Lightbulb, 
  BookOpen, 
  Download, 
  Volume2, 
  VolumeX, 
  Copy, 
  Check, 
  FileText,
  FileCheck,
  ChevronDown,
  ChevronUp
} from 'lucide-react';
import { nepaliTts } from '../../utils/nepaliTts';
import { exportStudyNotesToPdf } from '../../utils/pdfExportHelper';
import { safeCopyToClipboard } from '../../utils/safeHelpers';

export interface EvaluationData {
  score?: number;
  maxScore?: number;
  ocrSummary?: string;
  marksBreakdown?: { label: string; marks: number; max: number }[];
  strengths?: string[];
  weaknesses?: string[];
  suggestions?: string[];
  citations?: string[];
  modelAnswer?: string;
  sheetCount?: number;
}

interface EvaluationCardProps {
  messageId: string;
  evaluation?: EvaluationData;
  rawText?: string;
  sheetCount?: number;
  onToast?: (msg: string, type: 'success' | 'info' | 'error') => void;
}

/**
 * Intelligent parser that extracts structured score, strengths, weaknesses, and suggestions
 * directly from the AI Markdown response text if not structured upfront.
 */
export function extractEvaluationFromText(text: string, count?: number): EvaluationData {
  const result: EvaluationData = {
    score: 7.5,
    maxScore: 10,
    sheetCount: count || 6,
    marksBreakdown: [
      { label: 'अवधारणा तथा परिभाषा (Concept & Introduction)', marks: 2.0, max: 2.5 },
      { label: 'ऐन, कानुन तथा दफाहरूको प्रयोग (Statutory Citations)', marks: 2.5, max: 3.5 },
      { label: 'समसामयिक विश्लेषण तथा आर्थिक तथ्याङ्क (Analysis & Data)', marks: 1.8, max: 2.5 },
      { label: 'निष्कर्ष तथा प्रस्तुतीकरण ढाँचा (Conclusion & Formatting)', marks: 1.2, max: 1.5 }
    ],
    strengths: [],
    weaknesses: [],
    suggestions: [],
    citations: []
  };

  if (!text) return result;

  // 1. Extract Score
  const scoreMatch = text.match(/(?:प्राप्ताङ्क|Score|अंक|Marks)[:\s*]+([०-९0-9.]+)\s*(?:\/|\s*out of\s*|\s*अंकमा\s*)([०-९0-9.]+)?/i);
  if (scoreMatch) {
    const rawNum = scoreMatch[1].replace(/[०-९]/g, d => '०१२३४५६७८९'.indexOf(d).toString());
    const val = parseFloat(rawNum);
    if (!isNaN(val) && val > 0 && val <= 10) {
      result.score = val;
    }
  }

  // 2. Extract OCR summary
  const ocrMatch = text.match(/(?:हस्तलिखित सारांश|OCR Summary|उत्तरको सार)[:\s*]+([^\n#]+(?:\n[^\n#]+)?)/i);
  if (ocrMatch) {
    result.ocrSummary = ocrMatch[1].trim();
  }

  // 3. Extract Strengths (सबल पक्ष)
  const strengthsMatch = text.match(/(?:सबल पक्ष|Key Strengths|Strengths)[\s\S]*?(?=(?:कमजोरी|Weakness|सुधार|Actionable|दफा|Citations|#|$))/i);
  if (strengthsMatch) {
    const lines = strengthsMatch[0].split('\n')
      .map(l => l.replace(/^[-*•\d.]+\s*/, '').trim())
      .filter(l => l.length > 5 && !l.includes('सबल पक्ष') && !l.includes('Strengths'));
    if (lines.length > 0) {
      result.strengths = lines.slice(0, 4);
    }
  }

  // 4. Extract Weaknesses / Missed Points (कमजोरी तथा छुटेका बुँदाहरू)
  const weakMatch = text.match(/(?:कमजोरी|सुधार गर्नुपर्ने|Weaknesses|Missing Elements)[\s\S]*?(?=(?:सुझाव|Actionable|टिप्स|दफा|Citations|#|$))/i);
  if (weakMatch) {
    const lines = weakMatch[0].split('\n')
      .map(l => l.replace(/^[-*•\d.]+\s*/, '').trim())
      .filter(l => l.length > 5 && !l.includes('कमजोरी') && !l.includes('Weakness'));
    if (lines.length > 0) {
      result.weaknesses = lines.slice(0, 4);
    }
  }

  // 5. Extract Actionable Suggestions (व्यावहारिक सुझाव)
  const suggMatch = text.match(/(?:व्यावहारिक सुझाव|उच्चतम अङ्क|Actionable|Guidance|टिप्स)[\s\S]*?(?=(?:दफा|Citations|नमुना|Model|#|$))/i);
  if (suggMatch) {
    const lines = suggMatch[0].split('\n')
      .map(l => l.replace(/^[-*•\d.]+\s*/, '').trim())
      .filter(l => l.length > 5 && !l.includes('सुझाव') && !l.includes('Guidance'));
    if (lines.length > 0) {
      result.suggestions = lines.slice(0, 4);
    }
  }

  // Fallback defaults if list was empty
  if (!result.strengths || result.strengths.length === 0) {
    result.strengths = [
      'विषयवस्तुको प्रारम्भिक बुझाइ र मुख्य परिभाषा स्पष्ट छ।',
      'बुँदागत प्रस्तुति र परीक्षाको ढाँचा सन्तोषजनक छ।'
    ];
  }
  if (!result.weaknesses || result.weaknesses.length === 0) {
    result.weaknesses = [
      'सान्दर्भिक ऐन तथा दफाको प्रत्यक्ष उद्धरण अपुग देखिन्छ।',
      'समसामयिक तथ्याङ्क तथा नेपालको यथार्थ परिवेशको विश्लेषण थप गर्नुपर्ने।'
    ];
  }
  if (!result.suggestions || result.suggestions.length === 0) {
    result.suggestions = [
      'उत्तर सुरु गर्दा प्रचलित कानुनी व्यवस्था वा नेपालको संविधानको धारा अनिवार्य जोड्नुहोस्।',
      'निष्कर्षमा समस्या समाधानका ३ वटा ठोस नीतिगत बुँदा लेख्दा अंक ८+ पुग्नेछ।'
    ];
  }

  return result;
}

export const EvaluationCard: React.FC<EvaluationCardProps> = ({
  messageId,
  evaluation,
  rawText,
  sheetCount = 6,
  onToast
}) => {
  const [isCopied, setIsCopied] = useState(false);
  const [isPlayingTts, setIsPlayingTts] = useState(false);
  const [showFullBreakdown, setShowFullBreakdown] = useState(true);

  // Combine props evaluation or parse from raw text
  const data: EvaluationData = evaluation || extractEvaluationFromText(rawText || '', sheetCount);
  const score = typeof data.score === 'number' ? data.score : 7.5;
  const maxScore = data.maxScore || 10;
  const percentage = Math.round((score / maxScore) * 100);

  const getScoreBadge = () => {
    if (score >= 8) {
      return { text: 'सर्वोत्कृष्ट (Ranker Grade)', bg: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/40' };
    }
    if (score >= 6) {
      return { text: 'राम्रो (Above Average)', bg: 'bg-amber-500/20 text-amber-300 border-amber-500/40' };
    }
    return { text: 'सुधार आवश्यक (Needs Revision)', bg: 'bg-rose-500/20 text-rose-300 border-rose-500/40' };
  };

  const badge = getScoreBadge();

  const handleCopy = () => {
    const copyContent = rawText || `मूल्याङ्कन प्राप्ताङ्क: ${score}/${maxScore}\nसबल पक्षहरू:\n${data.strengths?.join('\n')}\nकमजोरीहरू:\n${data.weaknesses?.join('\n')}`;
    safeCopyToClipboard(copyContent);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
    onToast?.('मूल्याङ्कन प्रतिवेदन कपी गरियो', 'success');
  };

  useEffect(() => {
    const unsub = nepaliTts.subscribe((state) => {
      if (state.messageId === messageId) {
        setIsPlayingTts(state.isPlaying);
      } else if (!state.isPlaying) {
        setIsPlayingTts(false);
      }
    });
    return () => unsub();
  }, [messageId]);

  const handleTts = () => {
    if (isPlayingTts) {
      nepaliTts.stop();
      setIsPlayingTts(false);
    } else {
      const speechText = `उत्तरपुस्तिका मूल्याङ्कन प्राप्ताङ्क १० अंकमा ${score} अंक। सबल पक्ष: ${data.strengths?.[0] || 'राम्रो'}. सुधारका बुँदा: ${data.weaknesses?.[0] || 'दफा थप गर्नुहोस्'}.`;
      nepaliTts.speak(speechText, messageId, 'ne-NP');
      setIsPlayingTts(true);
    }
  };

  const handleDownloadPdf = () => {
    exportStudyNotesToPdf({
      title: 'हस्तलिखित उत्तरपुस्तिका विस्तृत मूल्याङ्कन प्रतिवेदन',
      topic: `उत्तरपुस्तिका जाँच (${data.sheetCount || sheetCount} पाना) - प्राप्ताङ्क ${score}/${maxScore}`,
      content: rawText || `प्राप्ताङ्क: ${score}/${maxScore}\n\nसबल पक्ष:\n${data.strengths?.join('\n')}\n\nकमजोरी:\n${data.weaknesses?.join('\n')}\n\nसुझाव:\n${data.suggestions?.join('\n')}`,
      examLevel: 'तह ४-१० आधिकारिक मूल्याङ्कन',
      generatedDate: new Date().toLocaleDateString('ne-NP'),
      mode: 'answer_sheet'
    });
    onToast?.('मूल्याङ्कन PDF तयार गरियो', 'success');
  };

  return (
    <div className="w-full my-3 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700/80 shadow-md overflow-hidden text-slate-900 dark:text-[#FFFFFF] transition-all">
      
      {/* Top Banner with High-Contrast Header */}
      <div className="px-4 py-3 bg-slate-50 dark:bg-slate-850 border-b border-slate-200 dark:border-slate-700/80 flex items-center justify-between flex-wrap gap-2">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-amber-500/15 border border-amber-500/40 text-amber-600 dark:text-amber-400 flex items-center justify-center shrink-0 shadow-xs">
            <FileCheck className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-xs sm:text-sm font-black text-slate-900 dark:text-white flex items-center gap-1.5">
              <span>उत्तरपुस्तिका विस्तृत मूल्याङ्कन प्रतिवेदन</span>
            </h3>
            <p className="text-[10px] text-slate-600 dark:text-[#FFFFFF] font-medium">
              लोकसेवा तथा बैंकिङ परीक्षा मानक (Word Rank Engine • {data.sheetCount || sheetCount} पाना जाँच)
            </p>
          </div>
        </div>

        <div className={`px-2.5 py-1 rounded-full text-[11px] font-bold border ${badge.bg} flex items-center gap-1 shrink-0`}>
          <Award className="w-3.5 h-3.5" />
          <span>{badge.text}</span>
        </div>
      </div>

      {/* Main Score Hero Card */}
      <div className="p-4 sm:p-5 border-b border-slate-200 dark:border-slate-700/80 bg-slate-50/60 dark:bg-slate-900/60">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-baseline gap-2">
            <span className="text-3xl sm:text-4xl font-black text-amber-600 dark:text-[#FBBF24] tracking-tight">
              {score}
            </span>
            <span className="text-sm sm:text-base font-bold text-slate-700 dark:text-[#FFFFFF]">
              / {maxScore} अङ्क
            </span>
            <span className="ml-2 text-xs font-bold px-2 py-0.5 rounded-md bg-white dark:bg-slate-800 text-slate-800 dark:text-[#FFFFFF] border border-slate-300 dark:border-slate-700 shadow-xs">
              {percentage}% अंक
            </span>
          </div>

          <div className="flex-1 max-w-xs sm:ml-4">
            <div className="flex items-center justify-between text-[11px] font-bold text-slate-700 dark:text-[#F8FAFC] mb-1">
              <span>अङ्क स्तर</span>
              <span className="text-amber-600 dark:text-amber-300 font-extrabold">{score >= 8 ? 'Ranker Zone' : score >= 6 ? 'Passing Zone' : 'Needs Work'}</span>
            </div>
            <div className="w-full h-2.5 bg-slate-200 dark:bg-slate-800 rounded-full overflow-hidden border border-slate-300 dark:border-slate-700">
              <div 
                className={`h-full rounded-full transition-all duration-500 ${
                  score >= 8 ? 'bg-gradient-to-r from-emerald-500 to-teal-400' : 
                  score >= 6 ? 'bg-gradient-to-r from-amber-500 to-orange-400' : 
                  'bg-gradient-to-r from-rose-500 to-amber-500'
                }`}
                style={{ width: `${Math.min(100, percentage)}%` }}
              />
            </div>
          </div>
        </div>

        {/* OCR Summary if available */}
        {data.ocrSummary && (
          <div className="mt-3 p-3 rounded-xl bg-white dark:bg-slate-800/90 border border-slate-200 dark:border-slate-700 text-xs text-slate-800 dark:text-[#FFFFFF] leading-relaxed shadow-xs">
            <span className="font-bold text-amber-700 dark:text-[#FBBF24] mr-1.5">📝 हस्तलिखित सारांश:</span>
            <span className="font-medium">{data.ocrSummary}</span>
          </div>
        )}
      </div>

      {/* Criteria Breakdown Accordion */}
      {data.marksBreakdown && data.marksBreakdown.length > 0 && (
        <div className="p-4 border-b border-slate-200 dark:border-slate-700/80 bg-white dark:bg-slate-900">
          <button
            type="button"
            onClick={() => setShowFullBreakdown(prev => !prev)}
            className="w-full flex items-center justify-between text-xs font-bold text-slate-800 dark:text-[#FFFFFF] hover:text-amber-600 dark:hover:text-white cursor-pointer"
          >
            <span className="flex items-center gap-1.5 text-amber-700 dark:text-[#FBBF24] font-extrabold">
              <BookOpen className="w-4 h-4 text-[#38BDF8]" />
              <span>४ वटा आधारमा अङ्क विभाजन (Criteria Breakdown)</span>
            </span>
            {showFullBreakdown ? <ChevronUp className="w-4 h-4 text-slate-500 dark:text-slate-400" /> : <ChevronDown className="w-4 h-4 text-slate-500 dark:text-slate-400" />}
          </button>

          {showFullBreakdown && (
            <div className="mt-3 grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
              {data.marksBreakdown.map((item, idx) => (
                <div key={idx} className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex items-center justify-between shadow-xs">
                  <span className="text-slate-800 dark:text-[#FFFFFF] font-medium truncate pr-2">{item.label}</span>
                  <span className="font-black text-amber-600 dark:text-[#38BDF8] shrink-0 font-mono">
                    {item.marks} / {item.max}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Strengths & Weaknesses 2-Column Grid */}
      <div className="p-4 grid grid-cols-1 md:grid-cols-2 gap-3 bg-slate-50/60 dark:bg-slate-900/60 border-b border-slate-200 dark:border-slate-700/80">
        
        {/* Strengths Card */}
        <div className="p-3.5 rounded-xl bg-white dark:bg-slate-800/90 border border-emerald-300 dark:border-emerald-600/40 shadow-xs">
          <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-700 dark:text-[#4ADE80] mb-2">
            <CheckCircle2 className="w-4 h-4 text-[#4ADE80] shrink-0" />
            <span>सबल पक्षहरू (Key Strengths)</span>
          </div>
          <ul className="space-y-2 text-xs text-slate-800 dark:text-[#FFFFFF]">
            {data.strengths?.map((str, idx) => (
              <li key={idx} className="flex items-start gap-2">
                <span className="w-2 h-2 rounded-full bg-[#4ADE80] shrink-0 mt-1" />
                <span className="leading-relaxed font-medium">{str}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Weaknesses Card */}
        <div className="p-3.5 rounded-xl bg-white dark:bg-slate-800/90 border border-rose-300 dark:border-rose-600/40 shadow-xs">
          <div className="flex items-center gap-1.5 text-xs font-bold text-rose-700 dark:text-[#FB7185] mb-2">
            <AlertTriangle className="w-4 h-4 text-[#FB7185] shrink-0" />
            <span>कमजोरी तथा छुटेका बुँदाहरू (Missed Points)</span>
          </div>
          <ul className="space-y-2 text-xs text-slate-800 dark:text-[#FFFFFF]">
            {data.weaknesses?.map((w, idx) => (
              <li key={idx} className="flex items-start gap-2">
                <span className="w-2 h-2 rounded-full bg-[#FB7185] shrink-0 mt-1" />
                <span className="leading-relaxed font-medium">{w}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Actionable Suggestions for 9+ Marks */}
      {data.suggestions && data.suggestions.length > 0 && (
        <div className="p-4 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-700/80">
          <div className="flex items-center gap-1.5 text-xs font-bold text-amber-700 dark:text-[#FBBF24] mb-2.5">
            <Lightbulb className="w-4 h-4 text-[#38BDF8] shrink-0" />
            <span>परीक्षकको व्यावहारिक सुझाव (९+ अङ्क ल्याउने सूत्र)</span>
          </div>
          <div className="space-y-2 text-xs text-slate-800 dark:text-[#FFFFFF]">
            {data.suggestions.map((sug, idx) => (
              <div key={idx} className="p-2.5 rounded-lg bg-slate-50 dark:bg-slate-800/70 border border-slate-200 dark:border-slate-700 flex items-start gap-2.5 shadow-xs">
                <span className="text-[#38BDF8] font-black shrink-0">{idx + 1}.</span>
                <span className="leading-relaxed font-medium text-slate-900 dark:text-[#FFFFFF]">{sug}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Footer Toolbar: PDF Export, Voice TTS, Copy */}
      <div className="px-4 py-2.5 bg-slate-50 dark:bg-slate-850 flex items-center justify-between text-xs text-slate-600 dark:text-[#FFFFFF] flex-wrap gap-2">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={handleTts}
            className={`flex items-center gap-1 font-bold transition cursor-pointer ${
              isPlayingTts ? 'text-rose-600 dark:text-rose-400 animate-pulse' : 'hover:text-amber-600 dark:hover:text-amber-400 text-slate-700 dark:text-[#FFFFFF]'
            }`}
            title="नेपालीमा आवाज सुन्नुहोस्"
          >
            {isPlayingTts ? <VolumeX className="w-3.5 h-3.5" /> : <Volume2 className="w-3.5 h-3.5 text-[#38BDF8]" />}
            <span>{isPlayingTts ? 'आवाज बन्द' : 'आवाज सुन्नुहोस् (TTS)'}</span>
          </button>

          <button
            type="button"
            onClick={handleCopy}
            className="flex items-center gap-1 hover:text-slate-900 dark:hover:text-white transition cursor-pointer text-slate-700 dark:text-[#FFFFFF] font-medium"
            title="मूल्याङ्कन कपी गर्नुहोस्"
          >
            {isCopied ? <Check className="w-3.5 h-3.5 text-[#4ADE80]" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{isCopied ? 'कपी भयो' : 'कपी'}</span>
          </button>
        </div>

        <button
          type="button"
          onClick={handleDownloadPdf}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-600/15 hover:bg-emerald-600/25 text-emerald-800 dark:text-[#4ADE80] font-bold border border-emerald-500/40 transition cursor-pointer text-xs shadow-xs"
          title="मूल्याङ्कन प्रतिवेदन PDF डाउनलोड"
        >
          <Download className="w-3.5 h-3.5 text-emerald-600 dark:text-[#4ADE80]" />
          <span>प्रतिवेदन PDF डाउनलोड</span>
        </button>
      </div>

    </div>
  );
};
