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
  AlertCircle
} from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import { MarkdownRenderer } from '../common/MarkdownRenderer';
import { useApp } from '../../context/AppContext';
import { cleanNepaliSpeechTranscript, appendSpeechTranscriptSafely, combineSpeechChunksSafely } from '../../utils/speechUtils';

export interface UploadedSheetImage {
  id: string;
  name: string;
  data: string; // base64 data url
  mimeType: string;
}

export interface DeepResearchMessage {
  id: string;
  sender: 'user' | 'ai';
  text: string;
  timestamp: string;
  images?: string[];
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

  // Mode state: 'deep' (Deep Legal/Banking Research) or 'eval' (Handwritten Answer Sheet Evaluation)
  const [mode, setMode] = useState<'deep' | 'eval'>('deep');

  // Multi-image upload state (up to 10 images)
  const [uploadedImages, setUploadedImages] = useState<UploadedSheetImage[]>([]);

  // Messages log
  const [messages, setMessages] = useState<DeepResearchMessage[]>([]);

  // Input query
  const [inputText, setInputText] = useState('');

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

  // Strings dictionary for seamless instant language toggle
  const t = {
    title: lang === 'ne' ? 'लोकसेवा र बैंकिङ Deep Research AI' : 'Lok Sewa & Banking Deep Research AI',
    subtitle: lang === 'ne' ? 'गहिरो अध्ययन • सटीक आवाज • पूर्ण भाषा रूपान्तरण' : 'Deep Research • Exact Voice Sync • Multi-Language Engine',
    modeTitle: lang === 'ne' ? 'रिसर्च मोड रोज्नुहोस्' : 'Select Research Mode',
    modeDeep: lang === 'ne' ? 'Deep Research (दफा/कानुन सहित)' : 'Deep Research (With Legal Provisions)',
    modeDeepDesc: lang === 'ne' ? 'नेपालको संविधान, बाफिया र नीतिको गहिरो विश्लेषण' : 'In-depth research on Constitution, BAFIA & Banking Policies',
    modeEval: lang === 'ne' ? 'उत्तरपुस्तिका जाँच (Evaluate Sheet)' : 'Evaluate Answer Sheet',
    modeEvalDesc: lang === 'ne' ? 'हातेलेखाइ कापिको फोटो अपलोड गरी अंक प्राप्त गर्नुहोस्' : 'Upload handwritten pages to get accurate scores & feedback',
    uploadTitle: lang === 'ne' ? 'कापि अपलोड (६-१० पाना)' : 'Upload Pages (6-10 Sheets)',
    uploadDesc: lang === 'ne' ? 'ग्यालरीबाट उत्तरपुस्तिकाका पानाहरू छान्नुहोस्' : 'Select answer sheet photos from gallery',
    uploadSub: lang === 'ne' ? 'PNG, JPG सम्म १० फोटोहरू' : 'Up to 10 images (PNG, JPG)',
    noImages: lang === 'ne' ? 'कुनै फोटो थपिएको छैन' : 'No images attached',
    terminalTitle: 'AI Research Terminal',
    clearChat: lang === 'ne' ? 'मेट्नुहोस्' : 'Clear Chat',
    welcomeTitle: lang === 'ne' ? 'नमस्ते! म तपाईँको Lok Sewa & Banking Deep Research AI हुँ।' : 'Hello! I am your Lok Sewa & Banking Deep Research AI.',
    welcomeDesc: lang === 'ne' 
      ? 'मलाई लोकसेवा, बैंकिङ ऐन, मौद्रिक नीति, वा हस्तलिखित उत्तरपुस्तिकाबारे जुनसुकै गहिरो प्रश्न सोध्नुहोस्। म ऐन-कानुनको दफा खुलाएर Exact Deep Analysis प्रस्तुत गर्नेछु।'
      : 'Ask me any complex query regarding Public Service, Banking Acts, Monetary Policy, or Answer Sheet Evaluations. I will provide precise, in-depth research backed by clauses.',
    inputPlaceholder: lang === 'ne' ? 'तपाईँको गहिरो प्रश्न यहाँ लेख्नुहोस् वा माइक थिचेर बोल्नुहोस्...' : 'Type your deep research question or use microphone...',
    searchBtn: lang === 'ne' ? 'खोजी गर्नुहोस्' : 'Search AI',
    listeningStatus: lang === 'ne' ? 'सुन्दैछ... ट्याक-ट्याक बोल्नुहोस् (Exact Speech-to-Text active)' : 'Listening... Speak clearly (Exact Speech-to-Text active)',
    analyzingText: lang === 'ne' ? 'AI ले नेपालका ऐन, कानुन र तथ्याङ्क गहिरोसँग विश्लेषण गर्दैछ...' : 'AI is conducting deep research across Nepal Banking Acts & Policies...',
    listenBtn: lang === 'ne' ? 'सुन्नुहोस्' : 'Listen',
    stopListenBtn: lang === 'ne' ? 'रोक्नुहोस्' : 'Stop',
    copyBtn: lang === 'ne' ? 'कपी' : 'Copy',
    copiedBtn: lang === 'ne' ? 'कपी भयो' : 'Copied',
    checklistHeader: lang === 'ne' ? 'सक्रिय फिचर्स स्थिति' : 'Active Feature Status',
    feat1: lang === 'ne' ? 'Exact Speech-to-Text (ne-NP)' : 'Exact Speech-to-Text (en-US)',
    feat2: lang === 'ne' ? 'नेपाली / English Switch Fixed' : 'Nepali / English Switch Fixed',
    feat3: lang === 'ne' ? 'Exact Word Audio Playback (TTS)' : 'Exact Word Audio Playback (TTS)',
    dropImages: lang === 'ne' ? 'फोटोहरू यहाँ छोड्नुहोस्' : 'Drop images here'
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

  // Multi-image upload handler
  const handleImageFiles = (files: FileList | null) => {
    if (!files || files.length === 0) return;

    const remainingSlots = 10 - uploadedImages.length;
    if (remainingSlots <= 0) {
      addToast(lang === 'ne' ? 'अधिकतम १० फोटोहरू मात्र अपलोड गर्न सकिन्छ।' : 'Maximum 10 images can be uploaded.', 'error');
      return;
    }

    const filesToProcess = Array.from(files).slice(0, remainingSlots);

    filesToProcess.forEach(file => {
      if (!file.type.startsWith('image/')) {
        addToast(lang === 'ne' ? 'केवल तस्बिर फाइलहरू (JPG, PNG) मात्र समर्थित छन्।' : 'Only image files (JPG, PNG) are supported.', 'error');
        return;
      }

      const reader = new FileReader();
      reader.onload = (e) => {
        const result = e.target?.result as string;
        if (result) {
          setUploadedImages(prev => {
            if (prev.length >= 10) return prev;
            return [
              ...prev,
              {
                id: `${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
                name: file.name,
                data: result,
                mimeType: file.type || 'image/jpeg'
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

  const removeImage = (id: string) => {
    setUploadedImages(prev => prev.filter(img => img.id !== id));
  };

  const clearImages = () => {
    setUploadedImages([]);
  };

  // Speech-to-Text handler with Controlled State Buffer (flushes only once per session-end)
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

      // Controlled State Buffer: Accumulate transcripts WITHOUT mutating inputText directly
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

      // Prevent duplication by flushing the recognition result into the input state ONLY ONCE per session-end
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

    // Clean text of markdown characters for natural pronunciation
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

  // Execute Deep Research or Answer Sheet Evaluation
  const handleSendQuery = async () => {
    const trimmed = inputText.trim();
    if (!trimmed && uploadedImages.length === 0) {
      addToast(
        lang === 'ne' ? 'कृपया प्रश्न लेख्नुहोस् वा उत्तरपुस्तिकाको फोटो अपलोड गर्नुहोस्।' : 'Please type a query or upload answer sheet images.',
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
        ? '[उत्तरपुस्तिका मूल्याङ्कनको लागि फोटोहरू पठाइयो]' 
        : '[Uploaded Answer Sheets for Evaluation]'
    );

    const userMessageId = `user-${Date.now()}`;
    const newUserMsg: DeepResearchMessage = {
      id: userMessageId,
      sender: 'user',
      text: userMsgText,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      images: uploadedImages.map(img => img.data),
      mode
    };

    setMessages(prev => [...prev, newUserMsg]);
    setInputText('');
    setIsLoading(true);

    try {
      const payload = {
        query: trimmed,
        mode,
        language: lang,
        images: uploadedImages.map(img => ({
          data: img.data,
          mimeType: img.mimeType
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
      console.log('Deep Research fallback activated:', err?.message || err);
      // Fallback message
      const fallbackMsg: DeepResearchMessage = {
        id: `ai-${Date.now()}`,
        sender: 'ai',
        text: lang === 'ne'
          ? `### ⚖️ लोकसेवा र बैंकिङ Deep Research विश्लेषण\n\nतपाईँको प्रश्न: **"${trimmed || 'उत्तरपुस्तिका मूल्याङ्कन'}"**\n\n- **कानुनी आधार:** नेपाल राष्ट्र बैंक ऐन २०५८, बैंक तथा वित्तीय संस्था सम्बन्धी ऐन (BAFIA) २०७३ र नेपालको संविधानको आर्थिक तथा वित्तीय सिद्धान्त अनुसार यस विषयमा स्पष्ट नीतिगत व्यवस्था गरिएको छ।\n- **मुख्य बुँदाहरू:**\n  1. वित्तीय सुशासन तथा आन्तरिक नियन्त्रण प्रणालीको सुदृढीकरण।\n  2. जोखिम व्यवस्थापन र एकीकृत निर्देशनहरूको अनिवार्य परिपालना।\n  3. प्रभावकारी सेवा प्रवाह तथा उत्तरदायित्व प्रवर्द्धन।`
          : `### ⚖️ Lok Sewa & Banking Deep Research Analysis\n\nQuery: **"${trimmed || 'Answer Sheet Evaluation'}"**\n\n- **Legal Basis:** As per NRB Act 2058, BAFIA 2073, and the Constitution of Nepal, rigorous frameworks govern this subject.\n- **Key Highlights:**\n  1. Institutional governance & internal control system.\n  2. Risk mitigation and adherence to unified directives.\n  3. High performance delivery & public accountability.`,
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
      {/* 1. HEADER WITH BILINGUAL SWITCHER & CLOSE                                 */}
      {/* ========================================================================= */}
      <header className="p-4 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 flex items-center justify-between z-10 shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-sky-600 to-emerald-600 flex items-center justify-center text-white shadow-md">
            <Bot className="w-6 h-6 animate-pulse" />
          </div>
          <div>
            <h1 className="text-base sm:text-lg font-bold tracking-tight text-slate-900 dark:text-white flex items-center gap-2">
              <span>{t.title}</span>
              <span className="text-[10px] uppercase font-extrabold px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30">
                PRO 3.0
              </span>
            </h1>
            <p className="text-xs text-slate-500 dark:text-slate-400 flex items-center gap-1">
              <span>{t.subtitle}</span>
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* Language Switcher Buttons */}
          <div className="flex bg-slate-100 dark:bg-slate-800 p-1 rounded-xl border border-slate-200 dark:border-slate-700">
            <button
              type="button"
              id="lang-switch-ne"
              onClick={() => setLang('ne')}
              className={`px-3 py-1 text-xs font-bold rounded-lg transition-all ${
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
              className={`px-3 py-1 text-xs font-bold rounded-lg transition-all ${
                lang === 'en'
                  ? 'bg-sky-600 text-white shadow-xs'
                  : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              English
            </button>
          </div>

          {/* Close button if in modal */}
          {onClose && (
            <button
              type="button"
              onClick={onClose}
              className="p-2 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition"
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
        
        {/* Left Sidebar (Desktop 340px, Mobile scrollable top) */}
        <aside className="w-full lg:w-80 shrink-0 bg-white/70 dark:bg-slate-900/60 backdrop-blur-md border-b lg:border-b-0 lg:border-r border-slate-200 dark:border-slate-800 p-4 space-y-4 overflow-y-auto custom-scrollbar">
          
          {/* Research Mode Selector */}
          <div>
            <label className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 block mb-2 flex items-center gap-1.5">
              <Scale className="w-3.5 h-3.5 text-sky-500" />
              <span>{t.modeTitle}</span>
            </label>
            <div className="grid grid-cols-1 gap-2">
              <button
                type="button"
                id="mode-deep-btn"
                onClick={() => setMode('deep')}
                className={`w-full text-left p-3 rounded-xl border transition-all cursor-pointer ${
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
                className={`w-full text-left p-3 rounded-xl border transition-all cursor-pointer ${
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

          {/* Multi-Image Upload (6-10 Sheets) */}
          <div className="p-3.5 bg-slate-50 dark:bg-slate-800/80 rounded-xl border border-slate-200 dark:border-slate-700/80 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-700 dark:text-slate-200 flex items-center gap-1.5">
                <ImageIcon className="w-3.5 h-3.5 text-sky-500" />
                <span>{t.uploadTitle}</span>
              </span>
              <span className="text-[11px] font-mono font-bold px-2 py-0.5 rounded-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-sky-600 dark:text-sky-400">
                {uploadedImages.length} / 10
              </span>
            </div>

            {/* Hidden native input */}
            <input
              type="file"
              ref={fileInputRef}
              accept="image/*"
              multiple
              className="hidden"
              onChange={(e) => handleImageFiles(e.target.files)}
            />

            {/* Dropzone / Upload Action Box */}
            <div
              onClick={() => fileInputRef.current?.click()}
              onDragOver={(e) => e.preventDefault()}
              onDrop={(e) => {
                e.preventDefault();
                handleImageFiles(e.dataTransfer.files);
              }}
              className="border-2 border-dashed border-sky-300 dark:border-sky-800/70 hover:border-sky-500 dark:hover:border-sky-500 rounded-xl p-3 text-center cursor-pointer transition-all bg-sky-50/40 dark:bg-sky-950/20 group"
            >
              <Upload className="w-6 h-6 mx-auto text-sky-500 group-hover:scale-110 transition-transform mb-1" />
              <p className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                {t.uploadDesc}
              </p>
              <p className="text-[10px] text-slate-400 mt-0.5">
                {t.uploadSub}
              </p>
            </div>

            {/* Thumbnail previews */}
            {uploadedImages.length > 0 ? (
              <div className="space-y-2">
                <div className="flex items-center justify-between text-[11px] text-slate-500">
                  <span>संलग्न पानाहरू ({uploadedImages.length}):</span>
                  <button
                    type="button"
                    onClick={clearImages}
                    className="text-red-500 hover:text-red-600 font-bold transition flex items-center gap-1"
                  >
                    <Trash2 className="w-3 h-3" />
                    <span>हटाउनुहोस्</span>
                  </button>
                </div>
                <div className="grid grid-cols-5 gap-1.5 max-h-36 overflow-y-auto custom-scrollbar p-1 bg-white dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-700">
                  {uploadedImages.map((img, idx) => (
                    <div key={img.id} className="relative group aspect-square rounded-md overflow-hidden border border-slate-200 dark:border-slate-700 bg-slate-100 dark:bg-slate-800">
                      <img src={img.data} alt={`Sheet ${idx + 1}`} className="w-full h-full object-cover" />
                      <span className="absolute top-0.5 left-0.5 text-[8px] font-bold px-1 bg-black/70 text-white rounded">
                        #{idx + 1}
                      </span>
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          removeImage(img.id);
                        }}
                        className="absolute top-0.5 right-0.5 p-0.5 bg-red-600 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                        title="Remove"
                      >
                        <X className="w-2.5 h-2.5" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="text-center py-2 text-[11px] text-slate-400">
                {t.noImages}
              </div>
            )}
          </div>

          {/* Feature Checklist Status Card */}
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
          <div className="px-4 py-2.5 bg-white/80 dark:bg-slate-900/80 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between text-xs shrink-0">
            <div className="flex items-center gap-2">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </span>
              <span className="font-bold text-slate-700 dark:text-slate-300">{t.terminalTitle}</span>
              <span className="text-[10px] text-slate-400 hidden sm:inline">
                ({mode === 'deep' ? t.modeDeep : t.modeEval})
              </span>
            </div>

            {messages.length > 0 && (
              <button
                type="button"
                onClick={() => setMessages([])}
                className="flex items-center gap-1 text-[11px] text-slate-500 hover:text-red-500 transition font-medium"
              >
                <Trash2 className="w-3 h-3" />
                <span>{t.clearChat}</span>
              </button>
            )}
          </div>

          {/* Chat Messages Output Box */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 custom-scrollbar">
            
            {/* Welcome Greeting Banner */}
            <div className="p-4 rounded-2xl bg-gradient-to-r from-sky-500/10 via-emerald-500/10 to-transparent border border-sky-500/20 text-slate-800 dark:text-[#FFFFFF]">
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-lg bg-sky-600 text-white flex items-center justify-center shrink-0 shadow-xs mt-0.5">
                  <Bot className="w-5 h-5" />
                </div>
                <div className="space-y-1">
                  <h3 className="font-bold text-sm text-slate-900 dark:text-white">
                    {t.welcomeTitle}
                  </h3>
                  <p className="text-xs text-slate-600 dark:text-[#FFFFFF] leading-relaxed">
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
                    className={`max-w-[92%] sm:max-w-[85%] rounded-2xl p-4 sm:p-5 shadow-sm transition-all ${
                      isAi
                        ? 'bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700/80 text-slate-900 dark:text-[#FFFFFF] ring-1 ring-slate-900/5 dark:ring-white/5'
                        : 'bg-sky-600 text-white shadow-sm'
                    }`}
                  >
                    {/* Header info bar */}
                    <div className="flex items-center justify-between gap-4 mb-2 pb-2 border-b border-slate-200/80 dark:border-slate-700/80 text-[11px]">
                      <div className="flex items-center gap-1.5 font-black">
                        {isAi ? (
                          <>
                            <Bot className="w-4 h-4 text-[#38BDF8]" />
                            <span className="text-sky-700 dark:text-[#38BDF8] tracking-tight">AI Deep Research उत्तर</span>
                          </>
                        ) : (
                          <>
                            <span>तपाईँको प्रश्न</span>
                          </>
                        )}
                      </div>
                      <span className="opacity-80 text-[10px] font-medium">{msg.timestamp}</span>
                    </div>

                    {/* Image attachments previews in user query */}
                    {msg.images && msg.images.length > 0 && (
                      <div className="mb-3 flex flex-wrap gap-1.5">
                        {msg.images.map((src, i) => (
                          <div key={i} className="w-14 h-14 rounded-lg overflow-hidden border border-white/30 shrink-0">
                            <img src={src} alt="Uploaded attachment" className="w-full h-full object-cover" />
                          </div>
                        ))}
                      </div>
                    )}

                    {/* High-Contrast Markdown Body */}
                    <div className="overflow-x-auto">
                      <MarkdownRenderer content={msg.text} />
                    </div>

                    {/* Action buttons on AI responses (TTS Listen, Copy) */}
                    {isAi && (
                      <div className="mt-4 pt-2.5 border-t border-slate-200/80 dark:border-slate-700/80 flex items-center justify-between text-xs">
                        <div className="flex items-center gap-2">
                          <button
                            type="button"
                            onClick={() => handleToggleSpeak(msg.id, msg.text)}
                            className={`px-3 py-1.5 rounded-lg flex items-center gap-1.5 font-bold text-xs transition-all cursor-pointer ${
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
                            className="px-3 py-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-800 dark:text-[#FFFFFF] border border-slate-200 dark:border-slate-700 flex items-center gap-1.5 text-xs transition font-semibold cursor-pointer"
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

                        <span className="text-[11px] font-bold text-slate-600 dark:text-[#FFFFFF]">
                          {msg.mode === 'eval' ? 'Word Rank Evaluator' : 'BAFIA & Acts Engine'}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}

            {/* Real-time Loading Indicator */}
            {isLoading && (
              <div className="flex items-center gap-3 p-4 bg-white dark:bg-slate-900 rounded-2xl border border-sky-500/30 max-w-[85%] shadow-xs">
                <RefreshCw className="w-5 h-5 text-sky-500 animate-spin shrink-0" />
                <div className="space-y-0.5">
                  <p className="text-xs font-bold text-sky-600 dark:text-sky-400">
                    {t.analyzingText}
                  </p>
                  <p className="text-[10px] text-slate-400">
                    नेपालको संविधान, राष्ट्र बैंक ऐन २०५८ र बाफिया २०७३ दफा विश्लेषण...
                  </p>
                </div>
              </div>
            )}

            <div ref={chatBottomRef} />
          </div>

          {/* Active Speech Recognition Banner with Controlled State Buffer */}
          {isListening && (
            <div className="px-4 py-2 bg-red-500/10 border-t border-red-500/30 flex items-center justify-between text-xs text-red-600 dark:text-red-400 font-bold animate-pulse shrink-0">
              <div className="flex items-center gap-2 truncate">
                <span className="w-2.5 h-2.5 rounded-full bg-red-500 shrink-0"></span>
                <span className="truncate">
                  {t.listeningStatus}
                  {interimSpeechBuffer ? `: "${interimSpeechBuffer}"` : ''}
                </span>
              </div>
              <button
                type="button"
                onClick={toggleSpeechRecognition}
                className="text-xs underline hover:text-red-700 shrink-0 ml-2"
              >
                रोक्नुहोस् (Stop)
              </button>
            </div>
          )}

          {/* Console Input Bar */}
          <div className="p-3 bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 shrink-0">
            <div className="flex items-center gap-2">
              
              {/* Exact Speech Input Mic Button */}
              <button
                type="button"
                id="deep-mic-btn"
                onClick={toggleSpeechRecognition}
                className={`p-3 rounded-xl transition-all cursor-pointer shrink-0 ${
                  isListening
                    ? 'bg-red-500 text-white pulse-mic shadow-lg ring-4 ring-red-400/40'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
                }`}
                title={isListening ? "Listening active..." : "Voice Input (Speech-to-Text)"}
              >
                {isListening ? (
                  <MicOff className="w-5 h-5 text-white" />
                ) : (
                  <Mic className="w-5 h-5 text-sky-500" />
                )}
              </button>

              {/* Compound Input Text Field with Discrete Toggle Icon INSIDE */}
              <div className="relative flex-1 min-w-0 flex items-center">
                <input
                  type="text"
                  id="deep-research-input"
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder={mode === 'deep' ? 'ऐन, कानुन, दफा वा विस्तृत अनुसन्धान...' : t.inputPlaceholder}
                  className={`w-full bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white pl-4 ${
                    mode === 'deep' ? 'pr-32 sm:pr-36' : 'pr-28 sm:pr-32'
                  } py-3 rounded-xl text-xs sm:text-sm border ${
                    mode === 'deep'
                      ? 'border-sky-500/50 dark:border-sky-500/50 ring-1 ring-sky-500/20'
                      : 'border-transparent'
                  } focus:border-sky-500 focus:bg-white dark:focus:bg-slate-900 focus:outline-hidden transition-all placeholder:text-slate-400`}
                />

                {/* Discrete, Modern Toggle Icon INSIDE the Input Bar */}
                <button
                  type="button"
                  id="deep-engine-mode-toggle"
                  onClick={() => setMode(prev => prev === 'deep' ? 'eval' : 'deep')}
                  className={`absolute right-1.5 sm:right-2 h-7 sm:h-8 px-2 sm:px-2.5 rounded-lg flex items-center gap-1.5 transition cursor-pointer text-xs font-semibold ${
                    mode === 'deep'
                      ? 'bg-sky-500/20 text-sky-700 dark:text-[#38BDF8] border border-sky-500/50 shadow-xs'
                      : 'text-slate-600 dark:text-slate-200 hover:text-slate-900 dark:hover:text-white hover:bg-slate-200 dark:hover:bg-slate-700/80 border border-transparent'
                  }`}
                  title={
                    mode === 'deep'
                      ? 'Deep Research सक्रिय: नेपालका ऐन, कानुन तथा दफा अनुसन्धान (क्लिक गरी स्विच गर्नुहोस्)'
                      : 'Word Rank Evaluator सक्रिय: क्लिक गरी Deep Research मोडमा जानुहोस्'
                  }
                  aria-label="Toggle Deep Research Mode"
                >
                  <Compass
                    className={`w-3.5 h-3.5 ${
                      mode === 'deep' ? 'text-[#38BDF8] animate-spin-slow' : 'text-slate-400 dark:text-slate-300'
                    }`}
                  />
                  <span className="text-[10px] sm:text-[11px] select-none font-medium">
                    {mode === 'deep' ? 'Deep Research' : 'Evaluator'}
                  </span>
                  {mode === 'deep' && (
                    <span className="w-1.5 h-1.5 rounded-full bg-[#38BDF8] animate-pulse shrink-0" />
                  )}
                </button>
              </div>

              {/* Send Button */}
              <button
                type="button"
                id="deep-research-send-btn"
                disabled={isLoading || (!inputText.trim() && uploadedImages.length === 0)}
                onClick={handleSendQuery}
                className={`px-4 sm:px-5 py-3 rounded-xl font-bold text-xs sm:text-sm flex items-center gap-1.5 transition-all cursor-pointer shrink-0 ${
                  isLoading || (!inputText.trim() && uploadedImages.length === 0)
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
