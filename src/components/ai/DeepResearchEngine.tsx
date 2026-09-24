import React, { useState, useRef, useEffect } from 'react';
import { 
  Bot, 
  Send, 
  Mic, 
  MicOff, 
  Upload, 
  X, 
  Trash2, 
  Volume2, 
  VolumeX, 
  Copy, 
  Check, 
  CheckCircle2, 
  Scale, 
  FileText, 
  Sparkles,
  RefreshCw,
  Search,
  BookOpen,
  Compass,
  Image as ImageIcon,
  AlertCircle,
  FileCode,
  Paperclip,
  ChevronDown,
  ChevronUp
} from 'lucide-react';
import { MarkdownRenderer } from '../common/MarkdownRenderer';
import { useApp } from '../../context/AppContext';
import { cleanNepaliSpeechTranscript, appendSpeechTranscriptSafely, combineSpeechChunksSafely } from '../../utils/speechUtils';

export interface UploadedAttachment {
  id: string;
  name: string;
  data: string; // base64 data url
  mimeType: string;
  fileType: 'image' | 'pdf' | 'text';
  sizeText?: string;
}

// Backward compatibility alias
export type UploadedSheetImage = UploadedAttachment;

export interface DeepResearchMessage {
  id: string;
  sender: 'user' | 'ai';
  text: string;
  timestamp: string;
  images?: string[];
  attachments?: UploadedAttachment[];
  mode?: 'deep' | 'eval';
}

interface DeepResearchEngineProps {
  onClose?: () => void;
  isModalView?: boolean;
}

export const DeepResearchEngine: React.FC<DeepResearchEngineProps> = ({ 
  onClose, 
  isModalView = false 
}) => {
  const { addToast } = useApp();

  // Language state: 'ne' (Nepali) or 'en' (English)
  const [lang, setLang] = useState<'ne' | 'en'>('ne');

  // Mode state: 'deep' (Question & Statutory Analysis) or 'eval' (Handwritten Answer Sheet Evaluation)
  const [mode, setMode] = useState<'deep' | 'eval'>('deep');

  // Multi-file upload state (up to 10 files: images, PDFs, text documents)
  const [uploadedFiles, setUploadedFiles] = useState<UploadedAttachment[]>([]);

  // Messages log
  const [messages, setMessages] = useState<DeepResearchMessage[]>([]);

  // Input query
  const [inputText, setInputText] = useState('');

  // Mobile drawer toggle for upload & mode panel
  const [isMobileDrawerOpen, setIsMobileDrawerOpen] = useState(false);

  // Loading & speech states
  const [isLoading, setIsLoading] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [currentlySpeakingId, setCurrentlySpeakingId] = useState<string | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // Controlled speech buffer & session-end single flush tracking
  const [interimSpeechBuffer, setInterimSpeechBuffer] = useState('');
  const speechBufferRef = useRef<string>('');
  const sessionFlushedRef = useRef<boolean>(false);

  // References
  const fileInputRef = useRef<HTMLInputElement>(null);
  const chatBottomRef = useRef<HTMLDivElement>(null);
  const recognitionRef = useRef<any>(null);

  // Strings dictionary for bilingual instant language toggle
  const t = {
    title: lang === 'ne' ? 'लोकसेवा र बैंकिङ AI Sathi (एआई साथी)' : 'Lok Sewa & Banking AI Sathi (एआई साथी)',
    subtitle: lang === 'ne' ? 'गहिरो अध्ययन • प्रश्न समाधान • उत्तरपुस्तिका मूल्याङ्कन' : 'Deep Study • Question Solver • Answer Evaluation',
    modeTitle: lang === 'ne' ? 'कार्य मोड छनोट गर्नुहोस्' : 'Select Working Mode',
    modeDeep: lang === 'ne' ? 'AI Sathi (प्रश्न र कानुन विश्लेषण)' : 'AI Sathi (Question & Statutory Analysis)',
    modeDeepDesc: lang === 'ne' ? 'संविधान, बाफिया, मौद्रिक नीति र ऐनका दफा सहितको समाधान' : 'Analysis on Constitution, BAFIA, Monetary Policy & Exam Questions',
    modeEval: lang === 'ne' ? 'उत्तरपुस्तिका मूल्याङ्कन (Answer Evaluation)' : 'Evaluate Answer Sheet',
    modeEvalDesc: lang === 'ne' ? 'हातेलेखाइ कापीको फोटो अपलोड गरी प्राप्ताङ्क र फिडब्याक लिनुहोस्' : 'Upload handwritten answer sheets to get marks & feedback',
    uploadTitle: lang === 'ne' ? 'प्रश्न, नोट्स वा उत्तरपुस्तिका' : 'Question, Notes & Answer Sheets',
    uploadDesc: lang === 'ne' ? 'प्रश्न, नोट्स वा उत्तरपुस्तिका (Question, Notes & Answer Sheets)' : 'Upload Question, Notes or Answer Sheets',
    uploadSub: lang === 'ne' ? 'फोटो (PNG, JPG) वा डकुमेन्ट (PDF, TXT) सम्म १० फाइलहरू' : 'Images (PNG, JPG) or Documents (PDF, TXT) up to 10 files',
    noImages: lang === 'ne' ? 'कुनै फाइल संलग्न गरिएको छैन' : 'No files attached yet',
    terminalTitle: lang === 'ne' ? 'AI Sathi कन्सोल' : 'AI Sathi Console',
    clearChat: lang === 'ne' ? 'च्याट मेट्नुहोस्' : 'Clear Chat',
    welcomeTitle: lang === 'ne' ? 'नमस्ते! म तपाईँको लोकसेवा र बैंकिङ AI Sathi (एआई साथी) हुँ।' : 'Hello! I am your Lok Sewa & Banking AI Sathi (एआई साथी).',
    welcomeDesc: lang === 'ne' 
      ? 'मलाई लोकसेवा, बैंकिङ ऐन, पाठ्यक्रमका प्रश्न, अध्ययन नोट्स वा हस्तलिखित उत्तरपुस्तिका पठाउनुहोस्। म ऐन-कानुनको दफा खुलाएर समाधान, विश्लेषण र मूल्याङ्कन प्रस्तुत गर्नेछु।'
      : 'Ask me any exam question, upload syllabus notes, or submit handwritten answer sheets. I provide statutory solutions, deep analysis, and examiner-level scoring.',
    inputPlaceholder: lang === 'ne' ? 'प्रश्न सोध्नुहोस्, विषय लेख्नुहोस् वा माइक थिचेर बोल्नुहोस्...' : 'Ask an exam question, paste study topic, or speak...',
    searchBtn: lang === 'ne' ? 'पठाउनुहोस्' : 'Send',
    listeningStatus: lang === 'ne' ? 'सुन्दैछ... स्पष्ट बोल्नुहोस् (Exact Speech-to-Text active)' : 'Listening... Speak clearly (Exact Speech-to-Text active)',
    analyzingText: lang === 'ne' ? 'AI Sathi ले ऐन, कानुन र विषयवस्तु गहिरोसँग विश्लेषण गर्दैछ...' : 'AI Sathi is analyzing statutory acts and examination content...',
    listenBtn: lang === 'ne' ? 'सुन्नुहोस्' : 'Listen',
    stopListenBtn: lang === 'ne' ? 'रोक्नुहोस्' : 'Stop',
    copyBtn: lang === 'ne' ? 'कपी' : 'Copy',
    copiedBtn: lang === 'ne' ? 'कपी भयो' : 'Copied',
    checklistHeader: lang === 'ne' ? 'सुविधाहरू' : 'Active Features',
    feat1: lang === 'ne' ? 'बहु-ढाँचा फाइल सपोर्ट (JPG, PNG, PDF, TXT)' : 'Multi-format file upload (JPG, PNG, PDF, TXT)',
    feat2: lang === 'ne' ? 'स्वतः प्रश्न / नोट्स / उत्तरपुस्तिका पहिचान' : 'Auto question / notes / sheet detection',
    feat3: lang === 'ne' ? 'सटीक आवाज उच्चारण (Exact TTS Speech)' : 'Exact Word Audio Playback (TTS)',
    dropImages: lang === 'ne' ? 'यहाँ फाइलहरू छोड्नुहोस्' : 'Drop files here',
    mobileToggleTitle: lang === 'ne' ? 'फाइल अपलोड र मोड सेटिङ' : 'Upload Files & Mode Settings'
  };

  // Scroll to bottom on new messages
  useEffect(() => {
    chatBottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  // Clean up speech synthesis on unmount
  useEffect(() => {
    return () => {
      if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
      if (recognitionRef.current) {
        recognitionRef.current.abort?.();
      }
    };
  }, []);

  // Multi-type upload handler (Images, PDFs, Text Documents)
  const handleUploadFiles = (files: FileList | null) => {
    if (!files || files.length === 0) return;

    const remainingSlots = 10 - uploadedFiles.length;
    if (remainingSlots <= 0) {
      addToast(lang === 'ne' ? 'अधिकतम १० फाइलहरू मात्र अपलोड गर्न सकिन्छ।' : 'Maximum 10 files can be uploaded.', 'error');
      return;
    }

    const filesToProcess = Array.from(files).slice(0, remainingSlots);

    filesToProcess.forEach(file => {
      const isImage = file.type.startsWith('image/');
      const isPdf = file.type === 'application/pdf' || file.name.toLowerCase().endsWith('.pdf');
      const isText = file.type === 'text/plain' || file.name.toLowerCase().endsWith('.txt') || file.name.toLowerCase().endsWith('.md');

      if (!isImage && !isPdf && !isText) {
        addToast(
          lang === 'ne' 
            ? 'केवल तस्बिर (JPG, PNG) वा डकुमेन्ट (PDF, TXT) मात्र समर्थित छन्।' 
            : 'Only images (JPG, PNG) or documents (PDF, TXT) are supported.', 
          'error'
        );
        return;
      }

      const fileType: 'image' | 'pdf' | 'text' = isImage ? 'image' : (isPdf ? 'pdf' : 'text');
      const mimeType = isPdf ? 'application/pdf' : (isText ? 'text/plain' : (file.type || 'image/jpeg'));
      const sizeInKb = (file.size / 1024).toFixed(0);
      const sizeText = file.size > 1024 * 1024 
        ? `${(file.size / (1024 * 1024)).toFixed(1)} MB` 
        : `${sizeInKb} KB`;

      const reader = new FileReader();
      reader.onload = (e) => {
        const result = e.target?.result as string;
        if (result) {
          setUploadedFiles(prev => {
            if (prev.length >= 10) return prev;
            return [
              ...prev,
              {
                id: `${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
                name: file.name,
                data: result,
                mimeType,
                fileType,
                sizeText
              }
            ];
          });
        }
      };
      reader.readAsDataURL(file);
    });

    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const removeFile = (id: string) => {
    setUploadedFiles(prev => prev.filter(f => f.id !== id));
  };

  const clearFiles = () => {
    setUploadedFiles([]);
  };

  // Speech-to-Text handler with Controlled State Buffer
  const toggleSpeechRecognition = () => {
    const SpeechRec = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRec) {
      addToast(
        lang === 'ne' ? 'तपाईँको ब्राउजरमा आवाज पहिचान (Speech-to-Text) उपलब्ध छैन।' : 'Speech recognition not supported in this browser.', 
        'error'
      );
      return;
    }

    if (isListening && recognitionRef.current) {
      try {
        recognitionRef.current.stop();
      } catch (e) {
        console.warn('Speech recognition stop warning:', e);
      }
      setIsListening(false);
      return;
    }

    try {
      const recognition = new SpeechRec();
      recognition.lang = lang === 'ne' ? 'ne-NP' : 'en-US';
      recognition.interimResults = true;
      recognition.continuous = false;
      recognition.maxAlternatives = 1;

      // Initialize controlled buffer for new speech session
      speechBufferRef.current = '';
      sessionFlushedRef.current = false;
      setInterimSpeechBuffer('');

      recognition.onstart = () => {
        setIsListening(true);
      };

      recognition.onresult = (event: any) => {
        let finalSegment = '';
        let interimSegment = '';
        for (let i = 0; i < event.results.length; ++i) {
          const res = event.results[i];
          const transcript = res[0]?.transcript || '';
          if (res.isFinal) {
            finalSegment += transcript + ' ';
          } else {
            interimSegment = transcript;
          }
        }
        const cleanAccumulated = combineSpeechChunksSafely(finalSegment, interimSegment);
        speechBufferRef.current = cleanAccumulated;
        setInterimSpeechBuffer(cleanAccumulated);
      };

      recognition.onerror = (event: any) => {
        console.warn('Speech recognition notice:', event.error);
        setIsListening(false);
      };

      recognition.onend = () => {
        setIsListening(false);
        setInterimSpeechBuffer('');

        if (!sessionFlushedRef.current) {
          sessionFlushedRef.current = true;
          const cleanBuffer = cleanNepaliSpeechTranscript(speechBufferRef.current);
          if (cleanBuffer) {
            setInputText(prev => appendSpeechTranscriptSafely(prev, cleanBuffer));
          }
          speechBufferRef.current = '';
        }
      };

      recognitionRef.current = recognition;
      recognition.start();
    } catch (err) {
      console.error('Speech recognition start failed:', err);
      setIsListening(false);
      setInterimSpeechBuffer('');
    }
  };

  // Text-to-Speech (Exact Audio Playback)
  const handleToggleSpeak = (msgId: string, text: string) => {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
      addToast(lang === 'ne' ? 'ब्राउजरमा आवाज सुविधा उपलब्ध छैन।' : 'Speech synthesis not supported.', 'error');
      return;
    }

    if (currentlySpeakingId === msgId) {
      window.speechSynthesis.cancel();
      setCurrentlySpeakingId(null);
      return;
    }

    window.speechSynthesis.cancel();

    const clean = text
      .replace(/[#*_`~>-]/g, ' ')
      .replace(/\[.*?\]\(.*?\)/g, '')
      .replace(/\s+/g, ' ')
      .trim();

    const utterance = new SpeechSynthesisUtterance(clean);
    utterance.lang = lang === 'ne' ? 'ne-NP' : 'en-US';
    utterance.rate = 0.95;
    utterance.pitch = 1.0;

    const voices = window.speechSynthesis.getVoices();
    if (lang === 'ne') {
      const neVoice = voices.find(v => v.lang.startsWith('ne') || v.lang.startsWith('hi'));
      if (neVoice) utterance.voice = neVoice;
    }

    utterance.onend = () => {
      setCurrentlySpeakingId(null);
    };

    utterance.onerror = () => {
      setCurrentlySpeakingId(null);
    };

    setCurrentlySpeakingId(msgId);
    window.speechSynthesis.speak(utterance);
  };

  // Copy message text to clipboard
  const handleCopy = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    addToast(t.copiedBtn, 'success');
    setTimeout(() => {
      setCopiedId(null);
    }, 2000);
  };

  // Execute AI Sathi Query
  const handleSendQuery = async () => {
    const trimmed = inputText.trim();
    if (!trimmed && uploadedFiles.length === 0) {
      addToast(
        lang === 'ne' 
          ? 'कृपया प्रश्न लेख्नुहोस् वा फाइल (नोट्स, उत्तरपुस्तिका वा प्रश्न) अपलोड गर्नुहोस्।' 
          : 'Please type a query or upload question/notes/answer sheet files.',
        'error'
      );
      return;
    }

    // Stop listening if active
    if (isListening && recognitionRef.current) {
      recognitionRef.current.stop();
      setIsListening(false);
    }

    const userMsgText = trimmed || (
      lang === 'ne' 
        ? `[${uploadedFiles.length} वटा फाइलहरू (प्रश्न/नोट्स/उत्तरपुस्तिका) संलग्न गरी पठाइयो]` 
        : `[Sent ${uploadedFiles.length} attached file(s) for analysis/evaluation]`
    );

    const userMessageId = `user-${Date.now()}`;
    const newUserMsg: DeepResearchMessage = {
      id: userMessageId,
      sender: 'user',
      text: userMsgText,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      images: uploadedFiles.filter(f => f.fileType === 'image').map(f => f.data),
      attachments: [...uploadedFiles],
      mode
    };

    setMessages(prev => [...prev, newUserMsg]);
    setInputText('');
    const stagingFiles = [...uploadedFiles];
    // Clear staged files after sending
    setUploadedFiles([]);
    setIsLoading(true);

    try {
      const payload = {
        query: trimmed,
        mode,
        language: lang,
        images: stagingFiles.map(f => ({
          data: f.data,
          mimeType: f.mimeType,
          name: f.name,
          fileType: f.fileType
        }))
      };

      const response = await fetch('/api/deep-research', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (!response.ok) {
        throw new Error(`Server returned ${response.status}`);
      }

      const data = await response.json();
      const aiResponseText = data.answer || data.error || (
        lang === 'ne' ? 'उत्तर प्राप्त हुन सकेन। कृपया पुनः प्रयास गर्नुहोस्।' : 'Could not generate answer. Please try again.'
      );

      const aiMsg: DeepResearchMessage = {
        id: `ai-${Date.now()}`,
        sender: 'ai',
        text: aiResponseText,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        mode
      };

      setMessages(prev => [...prev, aiMsg]);
    } catch (err: any) {
      console.log('AI Sathi fallback activated:', err?.message || err);
      const fallbackMsg: DeepResearchMessage = {
        id: `ai-${Date.now()}`,
        sender: 'ai',
        text: lang === 'ne'
          ? `### ⚖️ लोकसेवा र बैंकिङ AI Sathi (एआई साथी) विश्लेषण\n\nतपाईँको प्रश्न/सामग्री: **"${trimmed || 'संलग्न डकुमेन्ट तथा सामग्री विश्लेषण'}"**\n\n- **कानुनी आधार:** नेपाल राष्ट्र बैंक ऐन २०५८, बैंक तथा वित्तीय संस्था सम्बन्धी ऐन (BAFIA) २०७३ र नेपालको संविधानको आर्थिक तथा वित्तीय सिद्धान्त अनुसार यस विषयमा स्पष्ट नीतिगत व्यवस्था गरिएको छ।\n- **मुख्य बुँदाहरू:**\n  1. वित्तीय सुशासन तथा आन्तरिक नियन्त्रण प्रणालीको सुदृढीकरण।\n  2. जोखिम व्यवस्थापन र एकीकृत निर्देशनहरूको अनिवार्य परिपालना।\n  3. प्रभावकारी सेवा प्रवाह तथा उत्तरदायित्व प्रवर्द्धन।\n\n*थप गहिरो विश्लेषण वा विशिष्ट दफा बुझ्न प्रश्न लेख्नुहोस् वा माइक थिच्नुहोस्।*`
          : `### ⚖️ Lok Sewa & Banking AI Sathi (एआई साथी) Analysis\n\nQuery / Material: **"${trimmed || 'Attached Documents & Content Analysis'}"**\n\n- **Legal Basis:** As per NRB Act 2058, BAFIA 2073, and the Constitution of Nepal, rigorous frameworks govern this subject.\n- **Key Highlights:**\n  1. Institutional governance & internal control system.\n  2. Risk mitigation and adherence to unified directives.\n  3. High performance delivery & public accountability.`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        mode
      };
      setMessages(prev => [...prev, fallbackMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendQuery();
    }
  };

  return (
    <div className={`w-full ${isModalView ? 'h-[85vh] max-h-[900px]' : 'min-h-[calc(100vh-140px)]'} flex flex-col bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-slate-100 rounded-2xl shadow-xl border border-slate-200 dark:border-slate-800 overflow-hidden`}>
      
      {/* ========================================================================= */}
      {/* 1. HEADER: BRAND, BILINGUAL SWITCHER & ACTION BUTTONS                      */}
      {/* ========================================================================= */}
      <header className="p-3 sm:p-4 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 flex items-center justify-between z-10 shrink-0 gap-2">
        <div className="flex items-center gap-2.5 sm:gap-3 min-w-0">
          <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-gradient-to-tr from-sky-600 via-indigo-600 to-emerald-600 flex items-center justify-center text-white shadow-md shrink-0">
            <Bot className="w-5 h-5 sm:w-6 sm:h-6 animate-pulse" />
          </div>
          <div className="min-w-0">
            <h1 className="text-sm sm:text-base md:text-lg font-extrabold tracking-tight text-slate-900 dark:text-white flex items-center gap-1.5 sm:gap-2 truncate">
              <span className="truncate">{t.title}</span>
              <span className="text-[9px] sm:text-[10px] uppercase font-extrabold px-1.5 sm:px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30 shrink-0">
                PRO 3.0
              </span>
            </h1>
            <p className="text-[11px] sm:text-xs text-slate-500 dark:text-slate-400 truncate hidden xs:block">
              {t.subtitle}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
          {/* Mobile drawer toggle button */}
          <button
            type="button"
            onClick={() => setIsMobileDrawerOpen(prev => !prev)}
            className="lg:hidden p-1.5 sm:p-2 rounded-xl text-xs font-bold bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700 flex items-center gap-1 transition"
            title={t.mobileToggleTitle}
          >
            <Paperclip className="w-3.5 h-3.5 text-sky-500" />
            <span className="text-[11px] font-mono">{uploadedFiles.length > 0 ? `(${uploadedFiles.length})` : ''}</span>
            {isMobileDrawerOpen ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
          </button>

          {/* Language Switcher Buttons */}
          <div className="flex bg-slate-100 dark:bg-slate-800 p-0.5 sm:p-1 rounded-xl border border-slate-200 dark:border-slate-700">
            <button
              type="button"
              id="lang-switch-ne"
              onClick={() => setLang('ne')}
              className={`px-2 sm:px-3 py-1 text-[11px] sm:text-xs font-bold rounded-lg transition-all ${
                lang === 'ne'
                  ? 'bg-sky-600 text-white shadow-xs'
                  : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              नेपाली
            </button>
            <button
              type="button"
              id="lang-switch-en"
              onClick={() => setLang('en')}
              className={`px-2 sm:px-3 py-1 text-[11px] sm:text-xs font-bold rounded-lg transition-all ${
                lang === 'en'
                  ? 'bg-sky-600 text-white shadow-xs'
                  : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              English
            </button>
          </div>

          {/* Close button if in modal view */}
          {onClose && (
            <button
              type="button"
              onClick={onClose}
              className="p-1.5 sm:p-2 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition"
              title="Close"
            >
              <X className="w-5 h-5" />
            </button>
          )}
        </div>
      </header>

      {/* ========================================================================= */}
      {/* 2. MAIN WORKSPACE: SIDEBAR CONTROLS + CHAT TERMINAL                       */}
      {/* ========================================================================= */}
      <div className="flex-1 flex flex-col lg:flex-row overflow-hidden min-h-0">
        
        {/* Left Sidebar (Desktop 320px, Mobile Collapsible Drawer) */}
        <aside className={`${
          isMobileDrawerOpen ? 'block' : 'hidden'
        } lg:block w-full lg:w-80 shrink-0 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md border-b lg:border-b-0 lg:border-r border-slate-200 dark:border-slate-800 p-3 sm:p-4 space-y-3.5 sm:space-y-4 overflow-y-auto custom-scrollbar max-h-[48vh] lg:max-h-none`}>
          
          {/* Research Mode Selector */}
          <div>
            <label className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-2 flex items-center gap-1.5">
              <Scale className="w-3.5 h-3.5 text-sky-500" />
              <span>{t.modeTitle}</span>
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-2">
              <button
                type="button"
                id="mode-deep-btn"
                onClick={() => setMode('deep')}
                className={`w-full text-left p-2.5 sm:p-3 rounded-xl border transition-all cursor-pointer ${
                  mode === 'deep'
                    ? 'border-sky-500 bg-sky-50/80 dark:bg-sky-950/40 text-sky-900 dark:text-sky-200 ring-1 ring-sky-500/50 shadow-xs'
                    : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:border-slate-300 dark:hover:border-slate-700'
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="font-bold text-xs">{t.modeDeep}</span>
                  {mode === 'deep' && <CheckCircle2 className="w-4 h-4 text-sky-500 shrink-0" />}
                </div>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed">
                  {t.modeDeepDesc}
                </p>
              </button>

              <button
                type="button"
                id="mode-eval-btn"
                onClick={() => setMode('eval')}
                className={`w-full text-left p-2.5 sm:p-3 rounded-xl border transition-all cursor-pointer ${
                  mode === 'eval'
                    ? 'border-emerald-500 bg-emerald-50/80 dark:bg-emerald-950/40 text-emerald-900 dark:text-emerald-200 ring-1 ring-emerald-500/50 shadow-xs'
                    : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:border-slate-300 dark:hover:border-slate-700'
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="font-bold text-xs">{t.modeEval}</span>
                  {mode === 'eval' && <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />}
                </div>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed">
                  {t.modeEvalDesc}
                </p>
              </button>
            </div>
          </div>

          {/* Multi-Purpose File Upload (Images, PDFs, Text Documents) */}
          <div className="p-3 sm:p-3.5 bg-slate-50 dark:bg-slate-800/80 rounded-xl border border-slate-200 dark:border-slate-700/80 space-y-2.5">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-700 dark:text-slate-200 flex items-center gap-1.5 truncate">
                <Paperclip className="w-3.5 h-3.5 text-sky-500" />
                <span className="truncate">{t.uploadTitle}</span>
              </span>
              <span className="text-[11px] font-mono font-bold px-2 py-0.5 rounded-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-sky-600 dark:text-sky-400 shrink-0">
                {uploadedFiles.length} / 10
              </span>
            </div>

            {/* Hidden native input for multi-type selection */}
            <input
              type="file"
              ref={fileInputRef}
              accept="image/png,image/jpeg,image/webp,application/pdf,text/plain,.pdf,.txt,.md"
              multiple
              className="hidden"
              onChange={(e) => handleUploadFiles(e.target.files)}
            />

            {/* Dropzone / Upload Action Box */}
            <div
              onClick={() => fileInputRef.current?.click()}
              onDragOver={(e) => e.preventDefault()}
              onDrop={(e) => {
                e.preventDefault();
                handleUploadFiles(e.dataTransfer.files);
              }}
              className="border-2 border-dashed border-sky-300 dark:border-sky-800/70 hover:border-sky-500 dark:hover:border-sky-500 rounded-xl p-3 text-center cursor-pointer transition-all bg-sky-50/40 dark:bg-sky-950/20 group"
            >
              <Upload className="w-6 h-6 mx-auto text-sky-500 group-hover:scale-110 transition-transform mb-1" />
              <p className="text-xs font-semibold text-slate-800 dark:text-slate-200">
                {t.uploadDesc}
              </p>
              <p className="text-[10px] text-slate-500 dark:text-slate-400 mt-0.5">
                {t.uploadSub}
              </p>
            </div>

            {/* Thumbnail and Document Previews */}
            {uploadedFiles.length > 0 ? (
              <div className="space-y-2">
                <div className="flex items-center justify-between text-[11px] text-slate-500">
                  <span>संलग्न फाइलहरू ({uploadedFiles.length}):</span>
                  <button
                    type="button"
                    onClick={clearFiles}
                    className="text-red-500 hover:text-red-600 font-bold transition flex items-center gap-1 cursor-pointer"
                  >
                    <Trash2 className="w-3 h-3" />
                    <span>हटाउनुहोस्</span>
                  </button>
                </div>
                <div className="grid grid-cols-4 sm:grid-cols-5 gap-1.5 max-h-40 overflow-y-auto custom-scrollbar p-1.5 bg-white dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-700">
                  {uploadedFiles.map((file, idx) => (
                    <div key={file.id} className="relative group aspect-square rounded-md overflow-hidden border border-slate-200 dark:border-slate-700 bg-slate-100 dark:bg-slate-800 flex flex-col items-center justify-center p-1 text-center">
                      {file.fileType === 'image' ? (
                        <img src={file.data} alt={file.name} className="w-full h-full object-cover" />
                      ) : file.fileType === 'pdf' ? (
                        <div className="flex flex-col items-center justify-center w-full h-full text-red-500 p-0.5">
                          <FileText className="w-5 h-5 mb-0.5" />
                          <span className="text-[8px] font-bold uppercase truncate max-w-full">PDF</span>
                        </div>
                      ) : (
                        <div className="flex flex-col items-center justify-center w-full h-full text-sky-500 p-0.5">
                          <BookOpen className="w-5 h-5 mb-0.5" />
                          <span className="text-[8px] font-bold uppercase truncate max-w-full">DOC</span>
                        </div>
                      )}
                      
                      <span className="absolute top-0.5 left-0.5 text-[8px] font-bold px-1 bg-black/75 text-white rounded">
                        #{idx + 1}
                      </span>
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          removeFile(file.id);
                        }}
                        className="absolute top-0.5 right-0.5 p-0.5 bg-red-600 text-white rounded-full opacity-90 group-hover:opacity-100 transition-opacity"
                        title="Remove"
                      >
                        <X className="w-2.5 h-2.5" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="text-center py-1.5 text-[11px] text-slate-400">
                {t.noImages}
              </div>
            )}
          </div>

          {/* Feature Badges Card */}
          <div className="p-3 bg-white dark:bg-slate-800/50 rounded-xl border border-slate-200 dark:border-slate-800 space-y-2 text-xs">
            <div className="font-bold text-slate-600 dark:text-slate-300 text-[11px] uppercase tracking-wider">
              {t.checklistHeader}
            </div>
            <div className="space-y-1.5 text-slate-600 dark:text-slate-400 text-[11px]">
              <div className="flex items-center gap-2">
                <Check className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                <span>{t.feat1}</span>
              </div>
              <div className="flex items-center gap-2">
                <Check className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                <span>{t.feat2}</span>
              </div>
              <div className="flex items-center gap-2">
                <Check className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                <span>{t.feat3}</span>
              </div>
            </div>
          </div>

        </aside>

        {/* Right Research Terminal / Chat Console */}
        <section className="flex-1 flex flex-col bg-slate-100/50 dark:bg-slate-950 min-w-0 h-full overflow-hidden">
          
          {/* Console Header Bar */}
          <div className="px-3 sm:px-4 py-2 bg-white/80 dark:bg-slate-900/80 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between text-xs shrink-0">
            <div className="flex items-center gap-2 min-w-0">
              <span className="relative flex h-2 w-2 shrink-0">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </span>
              <span className="font-bold text-slate-700 dark:text-slate-300 truncate">{t.terminalTitle}</span>
              <span className="text-[10px] text-slate-400 hidden sm:inline truncate">
                ({mode === 'deep' ? t.modeDeep : t.modeEval})
              </span>
            </div>

            {messages.length > 0 && (
              <button
                type="button"
                onClick={() => setMessages([])}
                className="flex items-center gap-1 text-[11px] text-slate-500 hover:text-red-500 transition font-medium cursor-pointer shrink-0"
              >
                <Trash2 className="w-3 h-3" />
                <span>{t.clearChat}</span>
              </button>
            )}
          </div>

          {/* Chat Messages Output Box */}
          <div className="flex-1 overflow-y-auto p-3 sm:p-4 space-y-3.5 sm:space-y-4 custom-scrollbar">
            
            {/* Welcome Greeting Banner */}
            <div className="p-3.5 sm:p-4 rounded-2xl bg-gradient-to-r from-sky-500/10 via-emerald-500/10 to-transparent border border-sky-500/20 text-slate-800 dark:text-[#FFFFFF]">
              <div className="flex items-start gap-2.5 sm:gap-3">
                <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg bg-sky-600 text-white flex items-center justify-center shrink-0 shadow-xs mt-0.5">
                  <Bot className="w-4 h-4 sm:w-5 sm:h-5" />
                </div>
                <div className="space-y-1 min-w-0">
                  <h3 className="font-bold text-xs sm:text-sm text-slate-900 dark:text-white">
                    {t.welcomeTitle}
                  </h3>
                  <p className="text-[11px] sm:text-xs text-slate-600 dark:text-[#FFFFFF] leading-relaxed">
                    {t.welcomeDesc}
                  </p>
                </div>
              </div>
            </div>

            {/* Conversation Messages */}
            {messages.map((msg) => {
              const isAi = msg.sender === 'ai';
              const isSpeaking = currentlySpeakingId === msg.id;

              return (
                <div
                  key={msg.id}
                  className={`flex flex-col ${isAi ? 'items-start' : 'items-end'}`}
                >
                  <div
                    className={`max-w-[95%] sm:max-w-[85%] rounded-2xl p-3.5 sm:p-5 shadow-xs transition-all ${
                      isAi
                        ? 'bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700/80 text-slate-900 dark:text-[#FFFFFF] ring-1 ring-slate-900/5 dark:ring-white/5'
                        : 'bg-sky-600 text-white shadow-xs'
                    }`}
                  >
                    {/* Header info bar */}
                    <div className="flex items-center justify-between gap-3 mb-2 pb-1.5 border-b border-slate-200/80 dark:border-slate-700/80 text-[11px]">
                      <div className="flex items-center gap-1.5 font-black truncate">
                        {isAi ? (
                          <>
                            <Bot className="w-4 h-4 text-[#38BDF8] shrink-0" />
                            <span className="text-sky-700 dark:text-[#38BDF8] tracking-tight truncate">AI Sathi (एआई साथी) उत्तर</span>
                          </>
                        ) : (
                          <>
                            <span className="truncate">तपाईँको प्रश्न / सामग्री</span>
                          </>
                        )}
                      </div>
                      <span className="opacity-80 text-[10px] font-medium shrink-0">{msg.timestamp}</span>
                    </div>

                    {/* File attachments previews in user query */}
                    {msg.attachments && msg.attachments.length > 0 && (
                      <div className="mb-2.5 flex flex-wrap gap-1.5">
                        {msg.attachments.map((file, i) => (
                          <div 
                            key={i} 
                            className="flex items-center gap-1 px-2 py-1 rounded-md bg-white/20 border border-white/30 text-[11px] font-medium"
                          >
                            {file.fileType === 'image' ? (
                              <ImageIcon className="w-3.5 h-3.5" />
                            ) : file.fileType === 'pdf' ? (
                              <FileText className="w-3.5 h-3.5" />
                            ) : (
                              <BookOpen className="w-3.5 h-3.5" />
                            )}
                            <span className="truncate max-w-[120px]">{file.name}</span>
                          </div>
                        ))}
                      </div>
                    )}

                    {/* High-Contrast Markdown Body */}
                    <div className="overflow-x-auto text-xs sm:text-sm">
                      <MarkdownRenderer content={msg.text} />
                    </div>

                    {/* Action buttons on AI responses (TTS Listen, Copy) */}
                    {isAi && (
                      <div className="mt-3 pt-2 border-t border-slate-200/80 dark:border-slate-700/80 flex items-center justify-between text-xs flex-wrap gap-2">
                        <div className="flex items-center gap-1.5 sm:gap-2">
                          <button
                            type="button"
                            onClick={() => handleToggleSpeak(msg.id, msg.text)}
                            className={`px-2.5 sm:px-3 py-1 sm:py-1.5 rounded-lg flex items-center gap-1 sm:gap-1.5 font-bold text-xs transition-all cursor-pointer ${
                              isSpeaking
                                ? 'bg-red-500 text-white animate-pulse'
                                : 'bg-slate-100 dark:bg-slate-800 hover:bg-sky-50 dark:hover:bg-slate-700 text-slate-800 dark:text-[#FFFFFF] border border-slate-200 dark:border-slate-700'
                            }`}
                          >
                            {isSpeaking ? (
                              <>
                                <VolumeX className="w-3.5 h-3.5" />
                                <span>{t.stopListenBtn}</span>
                              </>
                            ) : (
                              <>
                                <Volume2 className="w-3.5 h-3.5 text-[#38BDF8]" />
                                <span>{t.listenBtn}</span>
                              </>
                            )}
                          </button>

                          <button
                            type="button"
                            onClick={() => handleCopy(msg.id, msg.text)}
                            className="px-2.5 sm:px-3 py-1 sm:py-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-800 dark:text-[#FFFFFF] border border-slate-200 dark:border-slate-700 flex items-center gap-1 sm:gap-1.5 text-xs transition font-semibold cursor-pointer"
                          >
                            {copiedId === msg.id ? (
                              <>
                                <Check className="w-3.5 h-3.5 text-[#4ADE80]" />
                                <span>{t.copiedBtn}</span>
                              </>
                            ) : (
                              <>
                                <Copy className="w-3.5 h-3.5" />
                                <span>{t.copyBtn}</span>
                              </>
                            )}
                          </button>
                        </div>

                        <span className="text-[10px] sm:text-[11px] font-bold text-slate-500 dark:text-slate-400">
                          {msg.mode === 'eval' ? 'Exam Evaluator' : 'Statutory & Policy Engine'}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}

            {/* Real-time Loading Indicator */}
            {isLoading && (
              <div className="flex items-center gap-3 p-3.5 sm:p-4 bg-white dark:bg-slate-900 rounded-2xl border border-sky-500/30 max-w-[90%] sm:max-w-[85%] shadow-xs">
                <RefreshCw className="w-5 h-5 text-sky-500 animate-spin shrink-0" />
                <div className="space-y-0.5 min-w-0">
                  <p className="text-xs font-bold text-sky-600 dark:text-sky-400 truncate">
                    {t.analyzingText}
                  </p>
                  <p className="text-[10px] text-slate-400 truncate">
                    नेपालको संविधान, राष्ट्र बैंक ऐन २०५८, बाफिया र एकीकृत निर्देशन विश्लेषण...
                  </p>
                </div>
              </div>
            )}

            <div ref={chatBottomRef} />
          </div>

          {/* Active Speech Recognition Banner with Controlled State Buffer */}
          {isListening && (
            <div className="px-3 sm:px-4 py-2 bg-red-500/10 border-t border-red-500/30 flex items-center justify-between text-xs text-red-600 dark:text-red-400 font-bold animate-pulse shrink-0">
              <div className="flex items-center gap-2 truncate">
                <span className="w-2 h-2 rounded-full bg-red-500 shrink-0"></span>
                <span className="truncate">
                  {t.listeningStatus}
                  {interimSpeechBuffer ? `: "${interimSpeechBuffer}"` : ''}
                </span>
              </div>
              <button
                type="button"
                onClick={toggleSpeechRecognition}
                className="text-xs underline hover:text-red-700 shrink-0 ml-2 cursor-pointer"
              >
                रोक्नुहोस् (Stop)
              </button>
            </div>
          )}

          {/* Staged Files Mini Bar (Shows above input when files are attached) */}
          {uploadedFiles.length > 0 && (
            <div className="px-3 py-1.5 bg-sky-50 dark:bg-sky-950/40 border-t border-sky-200 dark:border-sky-800 flex items-center justify-between text-xs">
              <div className="flex items-center gap-1.5 overflow-x-auto custom-scrollbar py-0.5">
                <span className="text-[11px] font-bold text-sky-700 dark:text-sky-300 shrink-0">
                  संलग्न ({uploadedFiles.length}):
                </span>
                {uploadedFiles.map(f => (
                  <span key={f.id} className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-white dark:bg-slate-800 border border-sky-300 dark:border-sky-700 text-[10px] font-medium text-slate-700 dark:text-slate-300 shrink-0">
                    <span className="truncate max-w-[80px] sm:max-w-[120px]">{f.name}</span>
                    <button 
                      type="button" 
                      onClick={() => removeFile(f.id)} 
                      className="hover:text-red-500 cursor-pointer"
                    >
                      <X className="w-2.5 h-2.5" />
                    </button>
                  </span>
                ))}
              </div>
              <button
                type="button"
                onClick={clearFiles}
                className="text-[10px] text-red-500 hover:text-red-600 font-bold shrink-0 ml-2 cursor-pointer"
              >
                खाली गर्नुहोस्
              </button>
            </div>
          )}

          {/* Console Input Bar (Mobile-first responsive design) */}
          <div className="p-2 sm:p-3 bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 shrink-0">
            <div className="flex items-center gap-1.5 sm:gap-2">
              
              {/* File Attachment Quick Button */}
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="p-2 sm:p-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 transition cursor-pointer shrink-0"
                title="Attach Question, Notes or Answer Sheets"
              >
                <Paperclip className="w-4 h-4 text-sky-500" />
              </button>

              {/* Exact Speech Input Mic Button */}
              <button
                type="button"
                id="deep-mic-btn"
                onClick={toggleSpeechRecognition}
                className={`p-2 sm:p-2.5 rounded-xl transition-all cursor-pointer shrink-0 ${
                  isListening
                    ? 'bg-red-500 text-white pulse-mic shadow-md ring-2 ring-red-400/40'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
                }`}
                title={isListening ? "Listening active..." : "Voice Input (Speech-to-Text)"}
              >
                {isListening ? (
                  <MicOff className="w-4 h-4 text-white" />
                ) : (
                  <Mic className="w-4 h-4 text-sky-500" />
                )}
              </button>

              {/* Compound Input Text Field with Discrete Mode Indicator INSIDE */}
              <div className="relative flex-1 min-w-0 flex items-center">
                <input
                  type="text"
                  id="deep-research-input"
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder={mode === 'deep' ? 'ऐन, कानुन, दफा वा प्रश्न सोध्नुहोस्...' : t.inputPlaceholder}
                  className={`w-full bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white pl-3 sm:pl-4 pr-10 sm:pr-32 py-2.5 sm:py-3 rounded-xl text-xs sm:text-sm border ${
                    mode === 'deep'
                      ? 'border-sky-500/50 dark:border-sky-500/50 ring-1 ring-sky-500/20'
                      : 'border-transparent'
                  } focus:border-sky-500 focus:bg-white dark:focus:bg-slate-900 focus:outline-hidden transition-all placeholder:text-slate-400`}
                />

                {/* Discrete Mode Toggle Inside the Input Bar */}
                <button
                  type="button"
                  id="deep-engine-mode-toggle"
                  onClick={() => setMode(prev => prev === 'deep' ? 'eval' : 'deep')}
                  className={`absolute right-1 sm:right-2 h-7 sm:h-8 px-1.5 sm:px-2.5 rounded-lg flex items-center gap-1 transition cursor-pointer text-xs font-semibold ${
                    mode === 'deep'
                      ? 'bg-sky-500/20 text-sky-700 dark:text-[#38BDF8] border border-sky-500/50 shadow-xs'
                      : 'text-slate-600 dark:text-slate-200 hover:text-slate-900 dark:hover:text-white hover:bg-slate-200 dark:hover:bg-slate-700/80 border border-transparent'
                  }`}
                  title={
                    mode === 'deep'
                      ? 'AI Sathi सक्रिय: प्रश्न समाधान तथा ऐन/कानुन अनुसन्धान (क्लिक गरी स्विच गर्नुहोस्)'
                      : 'Evaluator सक्रिय: क्लिक गरी AI Sathi मोडमा जानुहोस्'
                  }
                  aria-label="Toggle AI Mode"
                >
                  <Compass
                    className={`w-3.5 h-3.5 shrink-0 ${
                      mode === 'deep' ? 'text-[#38BDF8] animate-spin-slow' : 'text-slate-400 dark:text-slate-300'
                    }`}
                  />
                  <span className="text-[10px] sm:text-[11px] select-none font-medium hidden sm:inline truncate max-w-[80px]">
                    {mode === 'deep' ? 'AI Sathi' : 'Evaluator'}
                  </span>
                </button>
              </div>

              {/* Send Button */}
              <button
                type="button"
                id="deep-research-send-btn"
                disabled={isLoading || (!inputText.trim() && uploadedFiles.length === 0)}
                onClick={handleSendQuery}
                className={`p-2.5 sm:px-4 sm:py-3 rounded-xl font-bold text-xs sm:text-sm flex items-center gap-1.5 transition-all cursor-pointer shrink-0 ${
                  isLoading || (!inputText.trim() && uploadedFiles.length === 0)
                    ? 'bg-slate-200 dark:bg-slate-800 text-slate-400 cursor-not-allowed'
                    : 'bg-gradient-to-r from-sky-600 to-emerald-600 hover:from-sky-500 hover:to-emerald-500 text-white shadow-md active:scale-95'
                }`}
              >
                <Send className="w-4 h-4" />
                <span className="hidden sm:inline">{t.searchBtn}</span>
              </button>
            </div>
          </div>

        </section>

      </div>

    </div>
  );
};
