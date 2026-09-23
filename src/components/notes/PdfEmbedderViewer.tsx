import React, { useState, useEffect } from 'react';
import { 
  Download, 
  Printer, 
  ZoomIn, 
  ZoomOut, 
  RotateCcw, 
  Maximize2, 
  Minimize2, 
  FileText, 
  Sparkles,
  Layers,
  CheckCircle2,
  ExternalLink,
  WifiOff,
  CloudCheck,
  Check,
  QrCode
} from 'lucide-react';
import { BankingExamTopicNote } from '../../data/bankingExamNotesData';
import { downloadPdfNote, printPdfNote } from '../../utils/pdfDownloadEngine';
import { getCachedPdfUrlOrBlob } from '../../services/offlineNotesCacheService';
import { useOnlineStatus } from '../../hooks/useOnlineStatus';
import { LatexFormulaRenderer } from './LatexFormulaRenderer';
import { PaywallService } from '../../services/paywallService';
import { useApp } from '../../context/AppContext';
import { isUserAdmin, isOwnerAdmin } from '../../utils/sanitizer';

interface PdfEmbedderViewerProps {
  note: BankingExamTopicNote;
  onBookmark?: () => void;
  isBookmarked?: boolean;
  onTriggerPaywall?: (action: 'download' | 'print') => void;
}

export const PdfEmbedderViewer: React.FC<PdfEmbedderViewerProps> = ({
  note,
  onBookmark,
  isBookmarked = false,
  onTriggerPaywall
}) => {
  const { user } = useApp();
  const isOnline = useOnlineStatus();
  const [blobUrl, setBlobUrl] = useState<string>('');
  const [isFromCache, setIsFromCache] = useState<boolean>(false);
  const [isLoadingPdf, setIsLoadingPdf] = useState<boolean>(true);
  const [zoomLevel, setZoomLevel] = useState<number>(100);
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);
  const [previewMode, setPreviewMode] = useState<'embed' | 'document'>('embed');

  const isAdmin = Boolean(
    user?.role === 'admin' ||
    (user?.email && (isUserAdmin(user.email) || isOwnerAdmin(user.email)))
  );

  useEffect(() => {
    let active = true;
    let createdUrl = '';
    setIsLoadingPdf(true);

    getCachedPdfUrlOrBlob(note)
      .then(({ url, fromCache }) => {
        if (!active) {
          if (url) URL.revokeObjectURL(url);
          return;
        }
        createdUrl = url;
        setBlobUrl(url);
        setIsFromCache(fromCache);
        setIsLoadingPdf(false);
      })
      .catch((err) => {
        console.error('Error retrieving PDF url for viewer:', err);
        setIsLoadingPdf(false);
      });

    return () => {
      active = false;
      if (createdUrl) {
        URL.revokeObjectURL(createdUrl);
      }
    };
  }, [note.id]);

  const handleZoomIn = () => setZoomLevel(prev => Math.min(prev + 15, 175));
  const handleZoomOut = () => setZoomLevel(prev => Math.max(prev - 15, 60));
  const handleResetZoom = () => setZoomLevel(100);

  return (
    <div className={`rounded-2xl bg-white border border-slate-200 overflow-hidden shadow-sm transition-all ${
      isFullscreen ? 'fixed inset-4 z-50 flex flex-col bg-white border-2 border-[#1E40AF] shadow-2xl' : ''
    }`}>
      {/* Top Embedded Viewer Toolbar */}
      <div className="p-3 sm:p-4 bg-[#F8FAFC] border-b border-slate-200 flex flex-wrap items-center justify-between gap-3 text-[#0F172A]">
        <div className="flex items-center gap-2.5 min-w-0">
          <div className="p-2.5 rounded-xl bg-blue-50 text-[#1E40AF] border border-blue-200 shrink-0">
            <FileText className="w-5 h-5 text-[#1E40AF]" />
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="px-2 py-0.5 rounded text-[10px] font-black bg-[#1E40AF] text-white">
                PDF ENGINE
              </span>
              {isFromCache ? (
                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-300 flex items-center gap-1">
                  <CloudCheck className="w-3 h-3 text-emerald-600" />
                  <span>अफलाइन क्यास उपलब्ध</span>
                </span>
              ) : (
                <span className="text-xs text-slate-500 hidden sm:inline font-bold">
                  A4 आधिकारिक ढाँचा
                </span>
              )}
              {!isOnline && (
                <span className="px-2 py-0.5 rounded text-[10px] font-black bg-[#DC2626] text-white flex items-center gap-1">
                  <WifiOff className="w-3 h-3" />
                  <span>Offline Active</span>
                </span>
              )}
            </div>
            <h4 className="text-xs sm:text-sm font-black text-[#0F172A] truncate mt-0.5">
              {note.pdfFilename}
            </h4>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-1.5 flex-wrap">
          {/* Mode Switch: Embed vs Clean Document */}
          <div className="flex items-center bg-white rounded-xl p-0.5 border border-slate-200 text-xs">
            <button
              type="button"
              onClick={() => setPreviewMode('embed')}
              className={`px-2.5 py-1 rounded-lg font-bold transition cursor-pointer ${
                previewMode === 'embed'
                  ? 'bg-[#1E40AF] text-white shadow-xs'
                  : 'text-slate-600 hover:text-[#1E40AF]'
              }`}
            >
              PDF भ्युअर
            </button>
            <button
              type="button"
              onClick={() => setPreviewMode('document')}
              className={`px-2.5 py-1 rounded-lg font-bold transition cursor-pointer ${
                previewMode === 'document'
                  ? 'bg-[#1E40AF] text-white shadow-xs'
                  : 'text-slate-600 hover:text-[#1E40AF]'
              }`}
            >
              डकुमेन्ट पाना
            </button>
          </div>

          {/* Zoom Controls (Active in document mode) */}
          {previewMode === 'document' && (
            <div className="flex items-center bg-white rounded-xl border border-slate-200 p-0.5 text-xs">
              <button
                type="button"
                onClick={handleZoomOut}
                className="p-1.5 text-slate-600 hover:text-slate-900 cursor-pointer"
                title="Zoom Out"
              >
                <ZoomOut className="w-3.5 h-3.5" />
              </button>
              <button
                type="button"
                onClick={handleResetZoom}
                className="px-1.5 font-mono text-[11px] font-bold text-[#1E40AF] hover:underline cursor-pointer"
                title="Reset Zoom"
              >
                {zoomLevel}%
              </button>
              <button
                type="button"
                onClick={handleZoomIn}
                className="p-1.5 text-slate-600 hover:text-slate-900 cursor-pointer"
                title="Zoom In"
              >
                <ZoomIn className="w-3.5 h-3.5" />
              </button>
            </div>
          )}

          {/* Fullscreen toggle */}
          <button
            type="button"
            onClick={() => setIsFullscreen(prev => !prev)}
            className="p-1.5 rounded-xl bg-white hover:bg-slate-100 text-slate-700 border border-slate-200 transition cursor-pointer"
            title={isFullscreen ? 'Exit Fullscreen' : 'Fullscreen'}
          >
            {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
          </button>

          {/* Direct Print & Download Buttons (Admin Only) */}
          {isAdmin ? (
            <>
              <button
                type="button"
                onClick={() => printPdfNote(note)}
                className="px-2.5 py-1.5 rounded-xl bg-white hover:bg-slate-100 text-slate-700 border border-slate-200 text-xs font-bold flex items-center gap-1.5 transition cursor-pointer"
                title="प्रिन्ट गर्नुहोस् (Admin)"
              >
                <Printer className="w-3.5 h-3.5 text-slate-700" />
                <span className="hidden sm:inline">प्रिन्ट</span>
              </button>

              <button
                type="button"
                onClick={() => downloadPdfNote(note)}
                className="px-3 py-1.5 rounded-xl bg-[#1E40AF] hover:bg-blue-800 text-white text-xs font-bold flex items-center gap-1.5 transition shadow-xs cursor-pointer"
                title="PDF डाउनलोड (Admin)"
              >
                <Download className="w-3.5 h-3.5" />
                <span>PDF डाउनलोड</span>
              </button>
            </>
          ) : (
            <div className="flex items-center gap-1.5">
              <div className="px-2.5 py-1 rounded-xl bg-slate-100 text-slate-600 border border-slate-200 text-xs font-bold flex items-center gap-1.5 cursor-default select-none">
                <FileText className="w-3.5 h-3.5 text-[#1E40AF]" />
                <span className="hidden sm:inline">अनलाइन अध्ययन (View-Only)</span>
              </div>
              <button
                type="button"
                onClick={() => onTriggerPaywall?.('download')}
                className="px-2.5 py-1 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-300 text-xs font-bold flex items-center gap-1.5 transition cursor-pointer"
                title="PDF डाउनलोडका लागि QR स्क्यान गर्नुहोस्"
              >
                <QrCode className="w-3.5 h-3.5 text-emerald-600" />
                <span className="hidden sm:inline">QR भुक्तानी</span>
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Main Viewport Content */}
      <div className={`relative ${isFullscreen ? 'flex-1' : 'min-h-[580px] max-h-[800px]'} overflow-auto bg-[#F1F5F9] p-2 sm:p-4`}>
        {isLoadingPdf ? (
          <div className="h-[520px] flex flex-col items-center justify-center text-center p-6 space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-blue-100 border border-blue-200 flex items-center justify-center text-[#1E40AF] animate-spin">
              <RotateCcw className="w-6 h-6" />
            </div>
            <div>
              <p className="text-sm font-black text-[#0F172A]">
                PDF इन्जिन लोड हुँदैछ...
              </p>
              <p className="text-xs text-slate-500 mt-1">
                उच्च गुणस्तरको A4 आधिकारिक लेआउट तयार गरिँदैछ
              </p>
            </div>
          </div>
        ) : previewMode === 'embed' && blobUrl ? (
          <div className="w-full h-full min-h-[550px] rounded-xl overflow-hidden bg-white shadow-xs border border-slate-200 flex flex-col">
            <iframe
              src={`${blobUrl}#toolbar=1&navpanes=0&scrollbar=1&view=FitH`}
              title={note.titleEn}
              className="w-full flex-1 min-h-[550px] border-0"
            />
            {/* Fallback open in new tab bar */}
            <div className="px-4 py-2 bg-[#F8FAFC] border-t border-slate-200 flex items-center justify-between text-xs text-slate-600">
              <span className="font-medium">
                यदि ब्राउजरमा PDF सिधै नदेखिएमा तलको लिंक प्रयोग गर्न सक्नुहुन्छ:
              </span>
              <a
                href={blobUrl}
                target="_blank"
                rel="noreferrer"
                className="text-[#1E40AF] font-bold hover:underline flex items-center gap-1"
              >
                नयाँ विन्डोमा खोल्नुहोस् <ExternalLink className="w-3 h-3" />
              </a>
            </div>
          </div>
        ) : (
          /* High-Fidelity A4 Document Typeset View */
          <div className="flex justify-center py-2 sm:py-6">
            <div 
              style={{ width: `${zoomLevel}%`, maxWidth: '850px' }}
              className="bg-white text-slate-900 rounded-xl shadow-lg border border-slate-200 p-6 sm:p-10 font-sans transition-all duration-150"
            >
              {/* Document Header */}
              <div className="border-b-2 border-[#1E40AF] pb-4 mb-6">
                <div className="flex justify-between items-start gap-4">
                  <div>
                    <span className="text-[10px] font-black uppercase tracking-widest text-[#1E40AF] bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
                      BANKING TAYARI NEPAL • OFFICIAL STUDY NOTE
                    </span>
                    <h1 className="text-xl sm:text-2xl font-black text-[#0F172A] mt-2">
                      {note.titleNe}
                    </h1>
                    <p className="text-sm font-semibold text-slate-600">
                      {note.titleEn}
                    </p>
                  </div>
                  <div className="text-right text-xs text-slate-600 font-bold shrink-0">
                    <div>{note.paperReference}</div>
                    <div className="text-[#DC2626] font-black">{note.examWeightage}</div>
                  </div>
                </div>
              </div>

              {/* Definition Box */}
              {note.definitionCard && (
                <div className="mb-6 p-4 rounded-xl bg-blue-50/60 border border-blue-200 text-xs">
                  <div className="font-black text-[#1E40AF] uppercase tracking-wider text-[11px] mb-1">
                    परिभाषा: {note.definitionCard.termNe} ({note.definitionCard.termEn})
                  </div>
                  <p className="text-slate-800 leading-relaxed font-medium">
                    {note.definitionCard.definitionNe}
                  </p>
                  <div className="text-[10px] text-slate-500 font-bold mt-1 text-right">
                    स्रोत: {note.definitionCard.source}
                  </div>
                </div>
              )}

              {/* Statutory Provisions */}
              {note.statutoryCard && (
                <div className="mb-6 p-4 rounded-xl bg-slate-50 border border-slate-200 text-xs">
                  <div className="font-black text-slate-900 text-xs mb-2">
                    {note.statutoryCard.actTitleNe}
                  </div>
                  <div className="space-y-2">
                    {note.statutoryCard.clauses.map((c, i) => (
                      <div key={i} className="pl-3 border-l-2 border-[#1E40AF]">
                        <span className="font-black text-[#1E40AF]">{c.clause}: </span>
                        <span className="font-bold text-slate-900">{c.title} - </span>
                        <span className="text-slate-700">{c.description}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Formulas if any */}
              {note.ratios && note.ratios.length > 0 && (
                <div className="mb-6 space-y-3">
                  <h3 className="text-sm font-black text-[#0F172A] border-b border-slate-200 pb-1">
                    प्रमुख वित्तीय अनुपात तथा गणितीय सूत्रहरू (Formulas)
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {note.ratios.map(r => (
                      <div key={r.id} className="p-3 rounded-lg border border-slate-200 bg-[#F8FAFC] text-xs">
                        <div className="font-black text-[#0F172A] mb-1">
                          {r.nameNe} ({r.nameEn})
                        </div>
                        <div className="py-1 text-center font-serif">
                          <LatexFormulaRenderer latex={r.formulaLatex} />
                        </div>
                        <div className="text-[11px] text-slate-600 mt-1">
                          <strong>मानक:</strong> {r.standardBenchmark}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Comparison Table if any */}
              {note.comparisonTable && (
                <div className="mb-6">
                  <h3 className="text-sm font-black text-[#0F172A] mb-2">
                    {note.comparisonTable.titleNe}
                  </h3>
                  <div className="overflow-x-auto">
                    <table className="w-full text-xs text-left border-collapse border border-slate-200">
                      <thead>
                        <tr className="bg-slate-100 text-slate-900 font-black">
                          <th className="p-2 border border-slate-200">{note.comparisonTable.column1Header}</th>
                          <th className="p-2 border border-slate-200">{note.comparisonTable.column2Header}</th>
                          {note.comparisonTable.column3Header && (
                            <th className="p-2 border border-slate-200">{note.comparisonTable.column3Header}</th>
                          )}
                        </tr>
                      </thead>
                      <tbody>
                        {note.comparisonTable.rows.map((row, idx) => (
                          <tr key={idx} className={idx % 2 === 0 ? 'bg-white' : 'bg-slate-50'}>
                            <td className="p-2 border border-slate-200 font-bold text-slate-900">{row.parameterNe}</td>
                            <td className="p-2 border border-slate-200 text-slate-800">{row.column1Value}</td>
                            {note.comparisonTable?.column3Header && (
                              <td className="p-2 border border-slate-200 text-slate-800">{row.column2Value}</td>
                            )}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {/* Exam Questions */}
              {note.probableExamQuestions && (
                <div className="mb-6 space-y-3">
                  <h3 className="text-sm font-black text-[#0F172A] border-b border-slate-200 pb-1">
                    सम्भावित परीक्षा प्रश्न तथा उत्तर संरचना (Model Exam Questions)
                  </h3>
                  {note.probableExamQuestions.map((q, idx) => (
                    <div key={idx} className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 text-xs space-y-2">
                      <div className="flex items-start justify-between gap-2">
                        <span className="font-black text-[#0F172A]">प्रश्न {idx + 1}: {q.questionNe}</span>
                        <span className="px-2 py-0.5 rounded font-black bg-blue-100 text-[#1E40AF] shrink-0">
                          {q.marks} अङ्क
                        </span>
                      </div>
                      <div className="pl-3 border-l-2 border-amber-400 space-y-1">
                        <div className="font-bold text-slate-800 text-[11px]">उत्तर संरचना (Model Framework):</div>
                        {q.modelAnswerFramework.map((point, pIdx) => (
                          <div key={pIdx} className="text-slate-600 text-[11px]">• {point}</div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Document Footer */}
              <div className="mt-8 pt-4 border-t border-slate-200 text-[10px] text-slate-500 flex justify-between items-center">
                <span>Banking Tayari Nepal • https://bankingtayari.np</span>
                <span>Page 1 of Official Syllabus Typeset</span>
              </div>
            </div>
          </div>
        )}
      </div>

    </div>
  );
};
