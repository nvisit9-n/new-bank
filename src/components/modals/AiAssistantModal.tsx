import React, { useState, useRef, useEffect } from 'react';
import { 
  Sparkles, 
  X, 
  Send, 
  Bot, 
  Copy, 
  Check, 
  Paperclip, 
  Mic, 
  MicOff, 
  FileText, 
  Volume2, 
  VolumeX, 
  PanelLeftClose, 
  PanelLeft, 
  Plus, 
  MessageSquare, 
  Trash2, 
  Camera, 
  RotateCcw,
  BookOpen,
  Download,
  Compass,
  Eye,
  LogIn,
  Loader2,
  Image as ImageIcon
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { MarkdownRenderer } from '../common/MarkdownRenderer';
import { safeCopyToClipboard } from '../../utils/safeHelpers';
import { nepaliTts } from '../../utils/nepaliTts';
import { exportStudyNotesToPdf } from '../../utils/pdfExportHelper';
import { 
  AiChatSession, 
  ChatMessage, 
  ExamLevel, 
  AiChatSessionService, 
  generateChatTopicTitle 
} from '../../services/aiChatSessionService';
import { 
  executeAiQueryWithAutoRetry, 
  getOfflineKnowledgeFallback,
  transcribeAudioWithGemini 
} from '../../services/geminiClientService';
import { FirebaseAuthService } from '../../services/firebaseAuthService';
import { EvaluationCard } from '../ai/EvaluationCard';
import { cleanNepaliSpeechTranscript, appendSpeechTranscriptSafely, combineSpeechChunksSafely } from '../../utils/speechUtils';

interface AttachedFile {
  type: 'image' | 'pdf';
  base64: string;
  mimeType: string;
  name: string;
  sizeBytes: number;
  previewUrl?: string;
}

const formatFileSize = (bytes: number): string => {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
};

const detectExamLevelFromPrompt = (prompt: string, fallback: ExamLevel = 'level4-5'): ExamLevel => {
  const p = prompt.toLowerCase();
  if (
    p.includes('तह ९') || p.includes('तह १०') || p.includes('level 9') || p.includes('level 10') ||
    p.includes('प्रबन्धक') || p.includes('निर्देशक') || p.includes('उप-निर्देशक') ||
    p.includes('उपनिर्देशक') || p.includes('director') || p.includes('manager') ||
    p.includes('basel') || p.includes('macro-prudential') || p.includes('म्याक्रो')
  ) {
    return 'level9-10';
  }
  if (
    p.includes('तह ६') || p.includes('तह ७') || p.includes('तह ८') ||
    p.includes('level 6') || p.includes('level 7') || p.includes('level 8') ||
    p.includes('अधिकृत') || p.includes('officer') || p.includes('वरिष्ठ अधिकृत') ||
    p.includes('शाखा अधिकृत') || p.includes('सहायक प्रबन्धक') || p.includes('नीतिगत') ||
    p.includes('governance') || p.includes('सुशासन')
  ) {
    return 'level6-8';
  }
  if (
    p.includes('तह ४') || p.includes('तह ५') || p.includes('level 4') || p.includes('level 5') ||
    p.includes('सहायक') || p.includes('assistant') || p.includes('खरिदार') || p.includes('नासु') || p.includes('नायब सुब्बा')
  ) {
    return 'level4-5';
  }
  return fallback;
};

export const AiAssistantModal: React.FC = () => {
  const { isAiModalOpen, setIsAiModalOpen, user, addToast } = useApp();

  // Sessions and Active Thread State
  const [sessions, setSessions] = useState<AiChatSession[]>([]);
  const [currentSession, setCurrentSession] = useState<AiChatSession | null>(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState<boolean>(true);
  const [examLevel, setExamLevel] = useState<ExamLevel>('level4-5');
  const [sessionMode, setSessionMode] = useState<'general' | 'answer_sheet'>('general');

  // Deep Research Toggle in Input Bar (Default: fast & universal)
  const [isDeepResearchMode, setIsDeepResearchMode] = useState<boolean>(false);

  // Input & Streaming states
  const [inputQuery, setInputQuery] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [currentAiMessageId, setCurrentAiMessageId] = useState<string | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  
  // Multi-image upload (support 1-10 sheets) and PDF attachments
  const [attachedImages, setAttachedImages] = useState<AttachedFile[]>([]);
  const [attachedPdf, setAttachedPdf] = useState<AttachedFile | null>(null);
  const [previewingImage, setPreviewingImage] = useState<string | null>(null);
  const [retryNotice, setRetryNotice] = useState<string | null>(null);

  // Audio / TTS state
  const [ttsState, setTtsState] = useState<{ isPlaying: boolean; messageId: string | null }>({
    isPlaying: false,
    messageId: null
  });

  // Voice-to-Text: Controlled State Buffer & Single Session-End Flush
  const [isRecording, setIsRecording] = useState(false);
  const [isTranscribing, setIsTranscribing] = useState(false);
  const [recordingSeconds, setRecordingSeconds] = useState(0);
  const [speechLanguage, setSpeechLanguage] = useState<'ne-NP' | 'en-US'>('ne-NP');
  const [speechNotice, setSpeechNotice] = useState<string | null>(null);
  const [interimSpeechBuffer, setInterimSpeechBuffer] = useState<string>('');

  const speechBufferRef = useRef<string>('');
  const sessionFlushedRef = useRef<boolean>(false);
  const recognitionRef = useRef<any>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const recordingTimerRef = useRef<any>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Subscribe to TTS changes
  useEffect(() => {
    const unsubscribe = nepaliTts.subscribe((state) => {
      setTtsState(state);
    });
    return () => {
      unsubscribe();
      nepaliTts.stop();
    };
  }, []);

  // Clean up recording stream on unmount
  useEffect(() => {
    return () => {
      if (recordingTimerRef.current) clearInterval(recordingTimerRef.current);
      if (recognitionRef.current) {
        try {
          recognitionRef.current.abort();
        } catch {
          // ignore
        }
      }
      if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
        try {
          mediaRecorderRef.current.stop();
        } catch {
          // ignore
        }
      }
    };
  }, []);
  // Load chat sessions from Firestore and LocalStorage when modal opens
  useEffect(() => {
    if (isAiModalOpen) {
      const currentUid = user && !user.isGuest ? (user.authUid || user.id) : 'guest';
      AiChatSessionService.getUserSessions(currentUid).then((loaded) => {
        if (loaded && loaded.length > 0) {
          setSessions(loaded);
          setCurrentSession(loaded[0]);
          setExamLevel(loaded[0].level || 'level4-5');
          setSessionMode(loaded[0].mode || 'general');
        } else {
          const fresh = AiChatSessionService.createNewSession('level4-5', 'general');
          setSessions([fresh]);
          setCurrentSession(fresh);
          AiChatSessionService.saveSession(fresh, currentUid);
        }
      });
    } else {
      nepaliTts.stop();
      if (recordingTimerRef.current) clearInterval(recordingTimerRef.current);
      if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
        try { mediaRecorderRef.current.stop(); } catch { /* ignore */ }
      }
      setIsRecording(false);
      setIsTranscribing(false);
    }
  }, [isAiModalOpen, user]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isAiModalOpen) {
      scrollToBottom();
    }
  }, [currentSession?.messages, isTyping, isAiModalOpen]);

  if (!isAiModalOpen) return null;

  const messages = currentSession?.messages || [];
  const activeUid = user && !user.isGuest ? (user.authUid || user.id) : 'guest';

  // Handle "+ New Chat"
  const handleStartNewChat = (mode: 'general' | 'answer_sheet' = 'general') => {
    nepaliTts.stop();
    const newSession = AiChatSessionService.createNewSession(examLevel, mode);
    setSessions(prev => [newSession, ...prev.filter(s => s.id !== newSession.id)]);
    setCurrentSession(newSession);
    setSessionMode(mode);
    setAttachedImages([]);
    setAttachedPdf(null);
    setInputQuery('');
    AiChatSessionService.saveSession(newSession, activeUid).catch(err => {
      console.warn('Save new session error notice:', err);
    });
    
    // On small screens, close sidebar when new chat is started
    if (window.innerWidth < 768) {
      setIsSidebarOpen(false);
    }
  };

  // Handle selecting an existing session thread from sidebar
  const handleSelectSession = (session: AiChatSession) => {
    nepaliTts.stop();
    setCurrentSession(session);
    setExamLevel(session.level || 'level4-5');
    setSessionMode(session.mode || 'general');
    setAttachedImages([]);
    setAttachedPdf(null);
    setInputQuery('');
    
    if (window.innerWidth < 768) {
      setIsSidebarOpen(false);
    }
  };

  // Handle deleting a session
  const handleDeleteSession = async (e: React.MouseEvent, sessionId: string) => {
    e.stopPropagation();
    if (sessions.length <= 1) {
      const reset = AiChatSessionService.createNewSession(examLevel, 'general');
      setSessions([reset]);
      setCurrentSession(reset);
      await AiChatSessionService.saveSession(reset, activeUid);
      await AiChatSessionService.deleteSession(sessionId, activeUid);
      return;
    }

    const updated = sessions.filter(s => s.id !== sessionId);
    setSessions(updated);
    if (currentSession?.id === sessionId) {
      setCurrentSession(updated[0]);
    }
    await AiChatSessionService.deleteSession(sessionId, activeUid);
  };

  // Voice-to-Text: Controlled State Buffer with Single Session-End Flush
  const handleToggleSpeech = async () => {
    if (isRecording) {
      // Stop ongoing speech recognition session
      if (recognitionRef.current) {
        try {
          recognitionRef.current.stop();
        } catch {
          // ignore
        }
      }
      if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
        try {
          mediaRecorderRef.current.stop();
        } catch {
          // ignore
        }
      }
      if (recordingTimerRef.current) clearInterval(recordingTimerRef.current);
      setIsRecording(false);
      return;
    }

    // Reset controlled state buffer for this new session
    speechBufferRef.current = '';
    sessionFlushedRef.current = false;
    setInterimSpeechBuffer('');

    const SpeechRec = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    // 1. Browser Speech Recognition with Controlled State Buffer
    if (SpeechRec) {
      try {
        const recognition = new SpeechRec();
        recognition.lang = speechLanguage;
        recognition.interimResults = true;
        recognition.continuous = false;
        recognition.maxAlternatives = 1;

        recognition.onstart = () => {
          setIsRecording(true);
          setRecordingSeconds(0);
          setSpeechNotice(speechLanguage === 'ne-NP' ? '🔴 आवाज सुन्दैछ... स्पष्ट बोल्नुहोस्' : '🔴 Listening... speak clearly');
        };

        // Controlled State Buffer: Accumulate incoming speech without mutating inputQuery during stream
        recognition.onresult = (event: any) => {
          let finalChunk = '';
          let interimChunk = '';
          for (let i = 0; i < event.results.length; ++i) {
            const item = event.results[i];
            const transcript = (item[0]?.transcript || '').trim();
            if (item.isFinal) {
              finalChunk = appendSpeechTranscriptSafely(finalChunk, transcript);
            } else {
              interimChunk = appendSpeechTranscriptSafely(interimChunk, transcript);
            }
          }
          const cleanAccumulated = combineSpeechChunksSafely(finalChunk, interimChunk);
          speechBufferRef.current = cleanAccumulated;
          setInterimSpeechBuffer(cleanAccumulated);
          setSpeechNotice(`🔴 सुन्दैछ: "${cleanAccumulated}"`);
        };

        recognition.onerror = (event: any) => {
          console.warn('Speech recognition notice:', event.error);
          setIsRecording(false);
          setInterimSpeechBuffer('');
          setSpeechNotice(`आवाज पहिचान त्रुटि (${event.error || 'पुनः प्रयास गर्नुहोस्'})`);
          setTimeout(() => setSpeechNotice(null), 3000);
        };

        // Flush the recognition result into the input state ONLY ONCE per session-end
        recognition.onend = () => {
          setIsRecording(false);
          setInterimSpeechBuffer('');

          if (!sessionFlushedRef.current) {
            sessionFlushedRef.current = true;
            const finalResult = cleanNepaliSpeechTranscript(speechBufferRef.current);
            if (finalResult) {
              setInputQuery(prev => appendSpeechTranscriptSafely(prev, finalResult));
              setSpeechNotice('✅ आवाज रूपान्तरण भयो');
              setTimeout(() => setSpeechNotice(null), 2500);
            } else {
              setSpeechNotice(null);
            }
            speechBufferRef.current = '';
          }
        };

        recognitionRef.current = recognition;
        recognition.start();
        return;
      } catch (err) {
        console.warn('SpeechRecognition failed, falling back to MediaRecorder:', err);
      }
    }

    // 2. High-Fidelity Audio Buffer Fallback (gemini-3.5-transcribe)
    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
      setSpeechNotice('तपाईंको ब्राउजरमा माइक्रोफोन सुविधा उपलब्ध छैन।');
      setTimeout(() => setSpeechNotice(null), 4000);
      return;
    }

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const preferredMime = MediaRecorder.isTypeSupported('audio/webm') 
        ? 'audio/webm' 
        : (MediaRecorder.isTypeSupported('audio/mp4') ? 'audio/mp4' : '');

      const mediaRecorder = new MediaRecorder(stream, preferredMime ? { mimeType: preferredMime } : undefined);
      audioChunksRef.current = [];

      mediaRecorder.ondataavailable = (event) => {
        if (event.data && event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = async () => {
        stream.getTracks().forEach(t => t.stop());

        if (audioChunksRef.current.length === 0) {
          setSpeechNotice('कुनै आवाज प्राप्त भएन।');
          setTimeout(() => setSpeechNotice(null), 3000);
          return;
        }

        const audioBlob = new Blob(audioChunksRef.current, { type: preferredMime || 'audio/webm' });
        setIsTranscribing(true);
        setSpeechNotice('✨ AI ट्रान्सक्राइब गर्दैछ (gemini-3.5-transcribe)...');

        try {
          const transcribedText = await transcribeAudioWithGemini(audioBlob, speechLanguage);
          const cleanText = cleanNepaliSpeechTranscript(transcribedText || '');
          if (!sessionFlushedRef.current && cleanText) {
            sessionFlushedRef.current = true;
            setInputQuery(prev => appendSpeechTranscriptSafely(prev, cleanText));
            setSpeechNotice(`✅ आवाज रूपान्तरण भयो`);
            setTimeout(() => setSpeechNotice(null), 2500);
          } else if (!cleanText) {
            setSpeechNotice('आवाज स्पष्ट भएन, कृपया फेरि बोल्नुहोस्।');
            setTimeout(() => setSpeechNotice(null), 3000);
          }
        } catch (sttErr: any) {
          console.error('Audio transcription error:', sttErr);
          setSpeechNotice('ट्रान्सक्राइब गर्न सकिएन। पुनः प्रयास गर्नुहोस्।');
          setTimeout(() => setSpeechNotice(null), 3500);
        } finally {
          setIsTranscribing(false);
        }
      };

      mediaRecorder.start(250);
      mediaRecorderRef.current = mediaRecorder;
      setIsRecording(true);
      setRecordingSeconds(0);
      setSpeechNotice(speechLanguage === 'ne-NP' ? '🔴 आवाज रेकर्ड हुँदैछ... स्पष्ट बोल्नुहोस्' : '🔴 Recording... speak clearly');

      recordingTimerRef.current = setInterval(() => {
        setRecordingSeconds(s => s + 1);
      }, 1000);

    } catch (micErr) {
      console.warn('Microphone access denied:', micErr);
      setSpeechNotice('माइक्रोफोन अनुमति अस्वीकार गरियो। कृपया माइक अनुमति दिनुहोस्।');
      setTimeout(() => setSpeechNotice(null), 4000);
    }
  };

  // File selection handler (supporting multiple images 1-10 sheets, or 1 PDF)
  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const fileList = e.target.files;
    if (!fileList || fileList.length === 0) return;

    const filesArray = Array.from(fileList);

    // Check for PDF
    const pdfFile = filesArray.find(f => f.type === 'application/pdf' || f.name.toLowerCase().endsWith('.pdf'));
    if (pdfFile) {
      if (pdfFile.size > 25 * 1024 * 1024) {
        if (addToast) addToast('PDF फाइल आकार २५ MB भन्दा कम हुनुपर्छ।', 'error');
        return;
      }
      const reader = new FileReader();
      reader.onload = () => {
        const resultStr = reader.result as string;
        const base64Data = resultStr.split(',')[1] || '';
        setAttachedPdf({
          type: 'pdf',
          base64: base64Data,
          mimeType: pdfFile.type || 'application/pdf',
          name: pdfFile.name,
          sizeBytes: pdfFile.size
        });
        setAttachedImages([]); // Clear images if PDF is chosen
        setSessionMode('general');
      };
      reader.readAsDataURL(pdfFile);
      e.target.value = '';
      return;
    }

    // Otherwise handle image files
    const imageFiles = filesArray.filter(f => f.type.startsWith('image/'));
    if (imageFiles.length === 0) {
      if (addToast) addToast('केवल PDF दस्तावेज वा तस्बिर (JPG, PNG, WebP) संलग्न गर्न सकिन्छ।', 'error');
      return;
    }

    setAttachedPdf(null); // Clear PDF if images are chosen
    setSessionMode('answer_sheet');

    const availableSlots = 10 - attachedImages.length;
    if (availableSlots <= 0) {
      if (addToast) addToast('अधिकतम १० वटा हस्तलिखित पानाहरू मात्र संलग्न गर्न सकिन्छ।', 'info');
      return;
    }

    const filesToProcess = imageFiles.slice(0, availableSlots);
    const readers = filesToProcess.map((file, idx) => {
      return new Promise<AttachedFile>((resolve) => {
        const reader = new FileReader();
        reader.onload = () => {
          const resultStr = reader.result as string;
          const base64Data = resultStr.split(',')[1] || '';
          resolve({
            type: 'image',
            base64: base64Data,
            mimeType: file.type || 'image/jpeg',
            name: file.name || `पाना-${attachedImages.length + idx + 1}.jpg`,
            sizeBytes: file.size,
            previewUrl: resultStr
          });
        };
        reader.readAsDataURL(file);
      });
    });

    Promise.all(readers).then(newImgs => {
      setAttachedImages(prev => [...prev, ...newImgs]);
      if (addToast) {
        const total = attachedImages.length + newImgs.length;
        addToast(`${newImgs.length} पाना थपियो (जम्मा: ${total}/१० पाना)`, 'success');
      }
    });

    e.target.value = '';
  };

  const handleRemoveImage = (index: number) => {
    setAttachedImages(prev => prev.filter((_, i) => i !== index));
  };

  const handleClearAllAttachments = () => {
    setAttachedImages([]);
    setAttachedPdf(null);
    if (sessionMode === 'answer_sheet') {
      setSessionMode('general');
    }
  };

  // Quick Action: Check Answer Sheet
  const handleTriggerAnswerSheetEvaluation = () => {
    setSessionMode('answer_sheet');
    fileInputRef.current?.click();
  };

  // Send prompt (handles streaming SSE and updates chat session)
  const handleSendPrompt = async (textToSend?: string) => {
    const promptText = (typeof textToSend === 'string' ? textToSend : inputQuery).trim();
    const hasImages = attachedImages.length > 0;
    const hasPdf = Boolean(attachedPdf);

    if ((!promptText && !hasImages && !hasPdf) || isTyping) return;

    const imagesToSend = [...attachedImages];
    const pdfToSend = attachedPdf;
    const isAnswerSheet = hasImages || sessionMode === 'answer_sheet';

    // 1. Ensure valid session with valid ID exists in state BEFORE triggering AI generation
    let activeSession = currentSession;
    if (!activeSession || !activeSession.id) {
      activeSession = AiChatSessionService.createNewSession(examLevel, isAnswerSheet ? 'answer_sheet' : 'general');
    }

    // Auto-detect exam depth dynamically from prompt keywords
    const detectedLevel = detectExamLevelFromPrompt(promptText, activeSession.level || examLevel);
    if (detectedLevel !== examLevel) {
      setExamLevel(detectedLevel);
    }

    // 2. Safely auto-generate topic title on first user message
    const isFirstUserMessage = !activeSession.messages.some(m => m.sender === 'user') || activeSession.title === 'नयाँ कुराकानी';
    const sessionTitle = isFirstUserMessage
      ? generateChatTopicTitle(promptText, pdfToSend?.name || (hasImages ? `${imagesToSend.length} पाना उत्तरपुस्तिका` : undefined), isAnswerSheet ? 'answer_sheet' : 'general')
      : activeSession.title;

    const userMsgId = `user-${Date.now()}`;
    const userMessageText = promptText || (
      pdfToSend
        ? `[संलग्न PDF: ${pdfToSend.name}] कृपया यसको विस्तृत अध्ययन गरी मुख्य विषयवस्तु सम्झाउनुहोस्।`
        : (hasImages
            ? `[संलग्न ${imagesToSend.length} हस्तलिखित पानाहरू] कृपया यस उत्तरपुस्तिकाको १० अंकमा प्राप्ताङ्क, सबल पक्ष, कमजोरी र लोकसेवा/बैंकिङ परीक्षामा उच्चतम अंक प्राप्त गर्ने सुधार टिप्ससहित मूल्याङ्कन गर्नुहोस्।`
            : '')
    );

    const userMessage: ChatMessage = {
      id: userMsgId,
      sender: 'user',
      text: userMessageText,
      pdfAttachment: pdfToSend ? { name: pdfToSend.name, sizeBytes: pdfToSend.sizeBytes } : undefined,
      images: hasImages ? imagesToSend.map(img => img.previewUrl || img.base64) : undefined,
      image: hasImages ? (imagesToSend[0].previewUrl || imagesToSend[0].base64) : undefined,
      isDeepResearch: isDeepResearchMode,
      timestamp: Date.now()
    };

    const aiTempId = `ai-${Date.now() + 1}`;
    const initialAiMessage: ChatMessage = {
      id: aiTempId,
      sender: 'ai',
      text: '', // Empty text triggers the initial loading skeleton bubble
      isDeepResearch: isDeepResearchMode,
      timestamp: Date.now()
    };

    const updatedMessages = [...activeSession.messages, userMessage, initialAiMessage];

    const sessionWithPrompt: AiChatSession = {
      ...activeSession,
      id: activeSession.id,
      title: sessionTitle,
      updatedAt: Date.now(),
      level: detectedLevel,
      mode: isAnswerSheet ? 'answer_sheet' : 'general',
      messages: updatedMessages,
      messageCount: updatedMessages.length
    };

    // Immediately commit updated session and session list to state BEFORE fetching
    setCurrentSession(sessionWithPrompt);
    setSessions(prev => [sessionWithPrompt, ...prev.filter(s => s.id !== sessionWithPrompt.id)]);
    setInputQuery('');
    setAttachedImages([]);
    setAttachedPdf(null);
    setIsTyping(true);
    setCurrentAiMessageId(aiTempId);

    // Save session in background
    AiChatSessionService.saveSession(sessionWithPrompt, activeUid).catch(err => {
      console.warn('Initial session save background notice:', err);
    });

    // Helper to finalize AI message safely
    const finalizeAiMessage = (finalText: string, isError: boolean = false) => {
      setCurrentSession(prev => {
        if (!prev) return prev;
        const newMsgs = prev.messages.map(m =>
          m.id === aiTempId ? { ...m, text: finalText, isError, isDeepResearch: isDeepResearchMode } : m
        );
        const finalizedSession: AiChatSession = {
          ...prev,
          title: sessionTitle,
          updatedAt: Date.now(),
          messages: newMsgs,
          messageCount: newMsgs.length
        };
        setSessions(sPrev => [finalizedSession, ...sPrev.filter(s => s.id !== finalizedSession.id)]);
        AiChatSessionService.saveSession(finalizedSession, activeUid).catch(e => console.warn('Sync notice:', e));
        return finalizedSession;
      });
    };

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 75000);

    try {
      const historyPayload = activeSession.messages.slice(-10).map(m => ({
        sender: m.sender,
        text: m.text
      }));

      const attachmentPayload = pdfToSend ? {
        data: pdfToSend.base64,
        mimeType: pdfToSend.mimeType,
        name: pdfToSend.name
      } : (imagesToSend.length === 1 ? {
        data: imagesToSend[0].base64,
        mimeType: imagesToSend[0].mimeType,
        name: imagesToSend[0].name
      } : undefined);

      const imagesPayload = imagesToSend.length > 0 ? imagesToSend.map(img => ({
        data: img.base64,
        mimeType: img.mimeType,
        name: img.name
      })) : undefined;

      const finalText = await executeAiQueryWithAutoRetry({
        query: userMessageText,
        history: historyPayload,
        attachment: attachmentPayload,
        images: imagesPayload,
        isDeepResearch: isDeepResearchMode,
        level: detectedLevel,
        mode: isAnswerSheet ? 'answer_sheet' : 'general',
        signal: controller.signal,
        onRetry: (attempt, max) => {
          setRetryNotice(`पुनः जडान प्रयास गरिँदैछ (${attempt}/${max})...`);
        },
        onChunk: (_chunk, accumulated) => {
          setRetryNotice(null);
          setCurrentSession(prev => {
            if (!prev) return prev;
            const newMsgs = prev.messages.map(m =>
              m.id === aiTempId ? { ...m, text: accumulated } : m
            );
            return { ...prev, messages: newMsgs };
          });
        }
      });

      clearTimeout(timeoutId);
      setRetryNotice(null);
      finalizeAiMessage(finalText || 'माफ गर्नुहोस्, उत्तर प्राप्त हुन सकेन। कृपया पुनः प्रयास गर्नुहोस्।', false);

    } catch (streamErr: any) {
      clearTimeout(timeoutId);
      setRetryNotice(null);
      console.warn('Network error handled gracefully; providing syllabus knowledge fallback:', streamErr);
      const fallbackText = getOfflineKnowledgeFallback(userMessageText, isAnswerSheet ? 'answer_sheet' : 'general');
      finalizeAiMessage(fallbackText, false);
    } finally {
      setIsTyping(false);
      setCurrentAiMessageId(null);
      setRetryNotice(null);
    }
  };

  // Retry sending the preceding user prompt for an AI message
  const handleRetry = (msgIndex: number) => {
    if (isTyping || !currentSession) return;
    for (let i = msgIndex - 1; i >= 0; i--) {
      if (currentSession.messages[i].sender === 'user') {
        const lastUserPrompt = currentSession.messages[i].text;
        handleSendPrompt(lastUserPrompt);
        return;
      }
    }
  };

  const handleCopyText = async (id: string, text: string) => {
    const success = await safeCopyToClipboard(text);
    if (success) {
      setCopiedId(id);
      setTimeout(() => setCopiedId(null), 2000);
    }
  };

  // Toggle Nepali Text-To-Speech for an AI response
  const handleToggleTts = (messageId: string, text: string) => {
    if (ttsState.isPlaying && ttsState.messageId === messageId) {
      nepaliTts.stop();
    } else {
      nepaliTts.speak(text, messageId, 'ne-NP');
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/85 backdrop-blur-md flex flex-col sm:items-center sm:justify-center p-0 sm:p-3 md:p-6 animate-fadeIn">
      {/* Pure Sober Navy Slate (#0F172A) & Crisp White Modal Container */}
      <div className="bg-[#0F172A] text-slate-100 w-full sm:max-w-5xl h-[100dvh] sm:h-[90vh] sm:max-h-[920px] rounded-none sm:rounded-3xl border-0 sm:border sm:border-slate-800 shadow-2xl flex flex-col overflow-hidden transition-all">
        
        {/* Single Clean Top Header (Zero Clutter, No Split Tabs) */}
        <header className="pt-safe px-3 sm:px-5 py-2.5 border-b border-slate-800 flex items-center justify-between bg-[#0B1120] shrink-0 z-20 gap-3">
          <div className="flex items-center gap-2.5 sm:gap-3.5 min-w-0">
            {/* Sidebar Drawer Toggle Button */}
            <button
              onClick={() => setIsSidebarOpen(prev => !prev)}
              className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition cursor-pointer shrink-0"
              title={isSidebarOpen ? "च्याट इतिहास लुकाउनुहोस्" : "च्याट इतिहास हेर्नुहोस्"}
              aria-label="च्याट इतिहास टगल गर्नुहोस्"
            >
              {isSidebarOpen ? <PanelLeftClose className="w-5 h-5" /> : <PanelLeft className="w-5 h-5 text-amber-400" />}
            </button>

            <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-gradient-to-tr from-sky-600 via-indigo-600 to-emerald-600 flex items-center justify-center text-white font-bold shadow-sm shrink-0">
              <Bot className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
            </div>

            <div className="min-w-0">
              <h2 className="font-black text-white text-xs sm:text-sm tracking-tight truncate flex items-center gap-1.5">
                <span>AI अध्ययन साथी</span>
                <span className="hidden xs:inline-block px-2 py-0.5 rounded-full text-[10px] font-bold bg-slate-800 text-amber-400 border border-slate-700">
                  Lok Sewa & Banking
                </span>
              </h2>
              <p className="text-[10px] text-slate-400 truncate max-w-[200px] sm:max-w-md font-medium">
                {currentSession?.title || 'बैंकिङ तथा लोकसेवा परीक्षा तयारी'}
              </p>
            </div>
          </div>

          {/* Clean Action Controls: Auth Sync, TTS Stop & Close */}
          <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
            {/* User Account / Google Sign-in to persist to Firestore */}
            {user && !user.isGuest ? (
              <div 
                className="hidden xs:flex items-center gap-1.5 px-2.5 py-1 text-xs rounded-lg bg-slate-800/80 border border-slate-700/60 text-slate-300"
                title="Firestore क्लाउड डाटाबेस सिंक सक्रिय"
              >
                {user.photoURL ? (
                  <img src={user.photoURL} alt="" className="w-4 h-4 rounded-full" />
                ) : (
                  <div className="w-4 h-4 rounded-full bg-emerald-500/30 flex items-center justify-center text-[10px] text-emerald-400 font-bold">
                    {(user.displayName || user.name || 'U')[0].toUpperCase()}
                  </div>
                )}
                <span className="max-w-[80px] sm:max-w-[120px] truncate text-[11px] font-semibold">
                  {user.displayName || user.name || 'विद्यार्थी'}
                </span>
                <span className="inline-block w-1.5 h-1.5 rounded-full bg-emerald-400" title="Firestore सिंक" />
              </div>
            ) : (
              <button
                type="button"
                onClick={async () => {
                  try {
                    const profile = await FirebaseAuthService.signInWithGoogle();
                    if (profile && addToast) {
                      addToast(`स्वागत छ, ${profile.displayName || profile.name}! च्याट इतिहास Firestore मा सुरक्षित सिंक भयो।`, 'success');
                    }
                  } catch (e: any) {
                    if (addToast) addToast('Google लगइन गर्न सकिएन।', 'error');
                  }
                }}
                className="flex items-center gap-1.5 px-2.5 py-1 text-[11px] font-bold rounded-lg bg-emerald-500/20 text-emerald-300 hover:bg-emerald-500/30 border border-emerald-500/40 transition cursor-pointer"
                title="Google मार्फत लगइन गरी च्याट र उत्तरपुस्तिका प्रगति सुरक्षित राख्नुहोस्"
              >
                <LogIn className="w-3.5 h-3.5 text-emerald-400" />
                <span>Google लगइन</span>
              </button>
            )}

            {/* Global TTS Stop if currently playing */}
            {ttsState.isPlaying && (
              <button
                onClick={() => nepaliTts.stop()}
                className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-rose-500/20 text-rose-300 text-[11px] font-bold animate-pulse cursor-pointer border border-rose-500/40"
                title="आवाज बन्द गर्नुहोस्"
              >
                <VolumeX className="w-3.5 h-3.5" />
                <span className="hidden xs:inline">आवाज बन्द</span>
              </button>
            )}

            {/* Close Modal Button */}
            <button
              onClick={() => {
                nepaliTts.stop();
                setIsAiModalOpen(false);
              }}
              className="min-w-[36px] min-h-[36px] p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition shrink-0 flex items-center justify-center cursor-pointer"
              title="बन्द गर्नुहोस्"
              aria-label="बन्द गर्नुहोस्"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </header>

        {/* Main Body with Gemini-Style Collapsible Sidebar + Conversation */}
        <div className="flex-1 flex min-h-0 relative overflow-hidden bg-[#0F172A]">
          
          {/* Collapsible Left Drawer / Sidebar */}
          <aside
            className={`
              absolute md:static inset-y-0 left-0 z-30
              w-64 sm:w-72 bg-[#090D16] border-r border-slate-800
              flex flex-col transition-all duration-300 ease-in-out
              ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full md:w-0 md:hidden md:-translate-x-0'}
            `}
          >
            {/* Top: "+ New Chat" Button */}
            <div className="p-3 border-b border-slate-800 flex flex-col gap-2">
              <button
                onClick={() => handleStartNewChat('general')}
                className="w-full py-2 px-3 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-slate-950 font-black text-xs flex items-center justify-center gap-2 shadow-sm transition cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                <span>+ नयाँ कुराकानी (New Chat)</span>
              </button>

              {/* Quick Action: Answer Sheet Checking */}
              <button
                onClick={handleTriggerAnswerSheetEvaluation}
                className="w-full py-1.5 px-2.5 rounded-xl bg-emerald-950/40 hover:bg-emerald-900/40 text-emerald-300 border border-emerald-800/60 font-bold text-[11px] flex items-center justify-center gap-1.5 transition cursor-pointer"
                title="हस्तलिखित उत्तरपुस्तिका चेक गर्नुहोस्"
              >
                <Camera className="w-3.5 h-3.5 text-emerald-400" />
                <span>📝 उत्तरपुस्तिका मूल्याङ्कन (६-१० पाना)</span>
              </button>
            </div>

            {/* Recents Section (हालका कुराकानीहरू) */}
            <div className="flex-1 overflow-y-auto p-2 space-y-1 scrollbar-thin">
              <div className="px-2 py-1.5 text-[10px] font-black uppercase tracking-wider text-slate-500 flex items-center justify-between">
                <span>हालका कुराकानी (Recents)</span>
                <span className="text-[9px] bg-slate-800 px-1.5 py-0.5 rounded-full font-mono text-slate-300">
                  {sessions.length}
                </span>
              </div>

              {sessions.length === 0 ? (
                <div className="p-4 text-center text-xs text-slate-500">
                  कुनै अघिल्लो कुराकानी छैन।
                </div>
              ) : (
                sessions.map((sess) => {
                  const isActive = currentSession?.id === sess.id;
                  return (
                    <div
                      key={sess.id}
                      onClick={() => handleSelectSession(sess)}
                      className={`group w-full text-left p-2.5 rounded-xl text-xs transition flex items-center justify-between gap-2 cursor-pointer ${
                        isActive
                          ? 'bg-amber-500/15 text-amber-300 font-bold border border-amber-500/30'
                          : 'hover:bg-slate-800/60 text-slate-300'
                      }`}
                    >
                      <div className="flex items-center gap-2 min-w-0 flex-1">
                        <MessageSquare className={`w-3.5 h-3.5 shrink-0 ${isActive ? 'text-amber-400' : 'text-slate-500'}`} />
                        <div className="min-w-0 flex-1">
                          <p className="truncate text-xs leading-snug">
                            {sess.title || 'नयाँ कुराकानी'}
                          </p>
                          <div className="flex items-center gap-1.5 mt-0.5 text-[9px] text-slate-400 font-medium">
                            <span>{sess.level === 'level9-10' ? 'तह ९-१०' : sess.level === 'level6-8' ? 'तह ६-८' : 'तह ४-५'}</span>
                            <span>•</span>
                            <span>{sess.messageCount || sess.messages?.length || 1} म्यासेज</span>
                          </div>
                        </div>
                      </div>

                      {/* Delete session button */}
                      <button
                        onClick={(e) => handleDeleteSession(e, sess.id)}
                        className="opacity-0 group-hover:opacity-100 p-1 hover:text-rose-400 transition rounded-md hover:bg-slate-700/50 shrink-0 cursor-pointer"
                        title="च्याट मेटाउनुहोस्"
                        aria-label="च्याट मेटाउनुहोस्"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  );
                })
              )}
            </div>

            {/* Bottom Sync Status Banner */}
            <div className="p-2.5 border-t border-slate-800 text-[10px] text-slate-400 flex items-center justify-between">
              <span className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                <span>Firebase RTDB सिंक</span>
              </span>
              <span className="text-[9px] font-mono text-slate-400">
                {user && !user.isGuest ? 'अनलाइन' : 'अतिथि (Guest)'}
              </span>
            </div>
          </aside>

          {/* Backdrop for Mobile Sidebar */}
          {isSidebarOpen && (
            <div
              onClick={() => setIsSidebarOpen(false)}
              className="md:hidden fixed inset-0 bg-black/60 z-20 backdrop-blur-xs"
            />
          )}

          {/* Chat Stream & Interaction Area */}
          <main className="flex-1 flex flex-col min-w-0 bg-slate-100/70 dark:bg-[#0A0E1A] relative">
            
            {/* Mode Banner if evaluating answer sheet */}
            {sessionMode === 'answer_sheet' && (
              <div className="px-4 py-2 bg-emerald-950/50 border-b border-emerald-900/60 text-emerald-300 text-xs font-bold flex items-center justify-between shrink-0">
                <span className="flex items-center gap-1.5">
                  <Camera className="w-3.5 h-3.5 text-emerald-400" />
                  <span>📝 हस्तलिखित उत्तरपुस्तिका मूल्याङ्कन मोड सक्रिय (६-१० पाना, १० अंकमा परीक्षण)</span>
                </span>
                <button
                  onClick={() => setSessionMode('general')}
                  className="text-[10px] text-emerald-400 hover:underline cursor-pointer"
                >
                  सामान्य मोडमा फर्कनुहोस्
                </button>
              </div>
            )}

            {/* Chat Stream View */}
            <div className="flex-1 overflow-y-auto p-3 sm:p-5 space-y-4">
              {messages.map((msg, msgIdx) => {
                // Determine if this AI message represents an answer sheet evaluation
                const isAnswerSheetEvaluation = msg.sender === 'ai' && (
                  Boolean(msg.evaluationData) ||
                  msg.text.includes('उत्तरपुस्तिका मूल्याङ्कन') ||
                  msg.text.includes('प्राप्ताङ्क') ||
                  msg.text.includes('Word Rank Engine') ||
                  Boolean(currentSession?.messages[msgIdx - 1]?.images?.length)
                );

                const precedingUserImages = currentSession?.messages[msgIdx - 1]?.images;

                return (
                  <div
                    key={msg.id}
                    className={`flex gap-2 sm:gap-3 ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    {msg.sender === 'ai' && (
                      <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-xl bg-gradient-to-tr from-amber-500 to-orange-500 text-slate-950 flex items-center justify-center shrink-0 mt-0.5 shadow-sm font-bold">
                        <Bot className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-slate-950" />
                      </div>
                    )}

                    <div
                      className={`max-w-[95%] sm:max-w-[85%] min-w-0 p-4 sm:p-5 rounded-2xl text-xs sm:text-sm leading-relaxed ${
                        msg.sender === 'user'
                          ? 'bg-slate-800 text-white font-medium rounded-br-none border border-slate-700 shadow-md'
                          : msg.isError
                          ? 'bg-rose-50 dark:bg-rose-950/40 text-rose-900 dark:text-rose-200 rounded-bl-none border border-rose-200 dark:border-rose-900/60 shadow-sm'
                          : 'bg-white dark:bg-slate-900 text-slate-900 dark:text-[#FFFFFF] rounded-bl-none border border-slate-200 dark:border-slate-700/80 shadow-md ring-1 ring-slate-900/5 dark:ring-white/5'
                      }`}
                    >
                      {/* Deep Research Badge if sent in Deep Research Mode */}
                      {msg.isDeepResearch && (
                        <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-sky-50 dark:bg-slate-800 border border-sky-300 dark:border-sky-500/50 text-sky-800 dark:text-[#38BDF8] text-[10px] font-bold mb-2.5 shadow-xs">
                          <Compass className="w-3.5 h-3.5 text-[#38BDF8]" />
                          <span>Deep Research Mode • ऐन, कानुन तथा दफा प्रमाणित</span>
                        </div>
                      )}

                      {/* PDF Document Attachment Card in Chat History */}
                      {msg.pdfAttachment && (
                        <div className="flex items-center gap-2.5 p-2.5 rounded-xl bg-red-950/40 border border-red-900/60 mb-2.5">
                          <div className="w-8 h-8 rounded-lg bg-red-600 text-white flex items-center justify-center shrink-0 shadow-sm">
                            <FileText className="w-4 h-4" />
                          </div>
                          <div className="min-w-0 flex-1">
                            <p className="text-xs font-bold text-white truncate">{msg.pdfAttachment.name}</p>
                            <p className="text-[10px] text-red-300 font-medium">
                              PDF दस्तावेज संलग्न ({formatFileSize(msg.pdfAttachment.sizeBytes)}) • सुक्ष्म अध्ययन
                            </p>
                          </div>
                        </div>
                      )}

                      {/* Multi-Image Handwritten Sheets Display in User Message */}
                      {msg.images && msg.images.length > 0 && (
                        <div className="mb-3">
                          <div className="flex items-center gap-1.5 text-[11px] font-bold text-amber-300 mb-2">
                            <ImageIcon className="w-3.5 h-3.5" />
                            <span>हस्तलिखित उत्तरपुस्तिका ({msg.images.length} पाना संलग्न):</span>
                          </div>
                          <div className="grid grid-cols-2 xs:grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-2">
                            {msg.images.map((imgUrl, idx) => (
                              <div 
                                key={idx} 
                                onClick={() => setPreviewingImage(imgUrl)}
                                className="relative group rounded-xl overflow-hidden border border-slate-700 bg-slate-950 aspect-[3/4] cursor-pointer hover:border-amber-500 transition shadow-sm"
                              >
                                <img
                                  src={imgUrl}
                                  alt={`पाना ${idx + 1}`}
                                  className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                                />
                                <div className="absolute inset-0 bg-black/30 group-hover:bg-black/10 transition-colors flex items-center justify-center opacity-0 group-hover:opacity-100">
                                  <Eye className="w-5 h-5 text-white drop-shadow-md" />
                                </div>
                                <span className="absolute bottom-1 left-1 px-1.5 py-0.5 rounded bg-black/85 text-[10px] font-bold text-amber-300 border border-amber-500/40">
                                  पाना {idx + 1}
                                </span>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Single Image fallback if only one image */}
                      {!msg.images && msg.image && (
                        <div className="mb-2.5">
                          <img
                            src={msg.image}
                            alt="संलग्न तस्बिर"
                            onClick={() => setPreviewingImage(msg.image || null)}
                            className="max-h-56 sm:max-h-64 max-w-full rounded-xl border border-slate-700 object-contain shadow-sm bg-black/40 cursor-pointer hover:opacity-95 transition"
                          />
                        </div>
                      )}

                      {/* AI Response Display */}
                      {msg.sender === 'ai' ? (
                        !msg.text ? (
                          /* Initial loading skeleton bubble while waiting for first stream chunk */
                          <div className="space-y-3 py-1">
                            <div className="flex items-center gap-2 text-xs font-semibold text-amber-400">
                              <Sparkles className="w-4 h-4 animate-spin text-amber-400 shrink-0" />
                              <span>AI अध्ययन साथीले उत्तर तथा मूल्याङ्कन विश्लेषण गर्दैछ...</span>
                            </div>
                            <div className="space-y-2 animate-pulse">
                              <div className="h-3.5 bg-slate-800 rounded-md w-3/4"></div>
                              <div className="h-3.5 bg-slate-800 rounded-md w-full"></div>
                              <div className="h-3.5 bg-slate-800 rounded-md w-5/6"></div>
                            </div>
                          </div>
                        ) : (
                          <div className="min-w-0">
                            {/* Rich Evaluation Card rendered inside the chat stream */}
                            {isAnswerSheetEvaluation && (
                              <EvaluationCard
                                messageId={msg.id}
                                evaluation={msg.evaluationData}
                                rawText={msg.text}
                                sheetCount={precedingUserImages?.length || 6}
                                onToast={addToast}
                              />
                            )}

                            {/* Full Detailed Markdown Content */}
                            <div className="mt-1">
                              <MarkdownRenderer content={msg.text} />
                            </div>

                            {isTyping && msg.id === currentAiMessageId && (
                              <span className="inline-block w-1.5 h-3.5 ml-1 bg-amber-400 animate-pulse align-middle" />
                            )}
                          </div>
                        )
                      ) : (
                        <div className="whitespace-pre-line text-[#FFFFFF] font-medium leading-relaxed">
                          {msg.text}
                        </div>
                      )}

                      {/* Retry Button on Error */}
                      {msg.isError && !isTyping && (
                        <div className="mt-3 pt-2.5 border-t border-rose-900/60 flex items-center justify-between">
                          <button
                            onClick={() => handleRetry(msgIdx)}
                            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-rose-500/20 hover:bg-rose-500/30 text-rose-200 text-xs font-bold transition cursor-pointer"
                          >
                            <RotateCcw className="w-3.5 h-3.5" />
                            <span>पुनः प्रयास गर्नुहोस् (Retry)</span>
                          </button>
                        </div>
                      )}

                      {/* AI Message Footer Toolbar with Nepali Voice (TTS), Copy, PDF */}
                      {msg.sender === 'ai' && msg.text && !msg.isError && !isAnswerSheetEvaluation && (
                        <div className="pt-2.5 sm:pt-3 mt-3 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between text-[11px] text-slate-600 dark:text-[#FFFFFF] gap-2 flex-wrap">
                          <div className="flex items-center gap-3">
                            <button
                              onClick={() => handleToggleTts(msg.id, msg.text)}
                              className={`flex items-center gap-1 font-bold transition cursor-pointer ${
                                ttsState.isPlaying && ttsState.messageId === msg.id
                                  ? 'text-rose-600 dark:text-rose-400 animate-pulse'
                                  : 'hover:text-sky-600 dark:hover:text-[#38BDF8] text-slate-700 dark:text-[#FFFFFF]'
                              }`}
                              title="नेपालीमा आवाज सुन्नुहोस् (Text to Speech)"
                            >
                              {ttsState.isPlaying && ttsState.messageId === msg.id ? (
                                <>
                                  <VolumeX className="w-3.5 h-3.5" />
                                  <span>आवाज बन्द</span>
                                </>
                              ) : (
                                <>
                                  <Volume2 className="w-3.5 h-3.5 text-[#38BDF8]" />
                                  <span>आवाज सुन्नुहोस् (TTS)</span>
                                </>
                              )}
                            </button>

                            <button
                              onClick={() => handleCopyText(msg.id, msg.text)}
                              className="flex items-center gap-1 hover:text-slate-900 dark:hover:text-white transition cursor-pointer text-slate-700 dark:text-[#FFFFFF] font-semibold"
                            >
                              {copiedId === msg.id ? <Check className="w-3.5 h-3.5 text-[#4ADE80]" /> : <Copy className="w-3.5 h-3.5 text-slate-500 dark:text-slate-300" />}
                              <span>{copiedId === msg.id ? 'कपी भयो' : 'कपी'}</span>
                            </button>

                            <button
                              onClick={() => {
                                exportStudyNotesToPdf({
                                  title: currentSession?.title || 'AI Study Notes',
                                  topic: currentSession?.title || 'लोकसेवा तथा बैंकिङ परीक्षा टिपोट',
                                  content: msg.text,
                                  examLevel: examLevel === 'level9-10' ? 'तह ९-१० (व्यवस्थापकीय तह)' : examLevel === 'level6-8' ? 'तह ६-८ (अधिकृत तह)' : 'तह ४-५ (सहायक तह)',
                                  generatedDate: new Date().toLocaleDateString('ne-NP'),
                                  mode: sessionMode
                                });
                                if (typeof addToast === 'function') {
                                  addToast('PDF प्रिन्ट / डाउनलोड विन्डो खोलियो', 'success');
                                }
                              }}
                              className="flex items-center gap-1 text-emerald-700 dark:text-[#4ADE80] hover:text-emerald-800 dark:hover:text-emerald-300 transition cursor-pointer font-bold"
                              title="PDF डाउनलोड / प्रिन्ट गर्नुहोस्"
                            >
                              <Download className="w-3.5 h-3.5 text-emerald-600 dark:text-[#4ADE80]" />
                              <span>PDF डाउनलोड</span>
                            </button>
                          </div>
                        </div>
                      )}
                    </div>

                    {msg.sender === 'user' && (
                      <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-xl bg-slate-700 text-white flex items-center justify-center shrink-0 mt-0.5 font-bold text-xs shadow-sm border border-slate-600">
                        U
                      </div>
                    )}
                  </div>
                );
              })}

              {isTyping && (!currentAiMessageId || !messages.some(m => m.id === currentAiMessageId && !m.text)) && (
                <div className="flex items-center gap-2 text-xs text-amber-400 p-2">
                  <Sparkles className="w-3.5 h-3.5 animate-spin text-amber-400" />
                  <span className="font-medium">{retryNotice || 'AI अध्ययन साथीले उत्तर प्रवाह गर्दैछ...'}</span>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Speech Notice Banner */}
            {speechNotice && (
              <div className={`px-4 py-2 text-xs font-semibold flex items-center justify-between shrink-0 animate-fadeIn ${
                isRecording 
                  ? 'bg-rose-950/70 border-t border-rose-800 text-rose-200' 
                  : isTranscribing 
                  ? 'bg-sky-950/70 border-t border-sky-800 text-sky-200' 
                  : 'bg-slate-900 border-t border-slate-800 text-slate-300'
              }`}>
                <div className="flex items-center gap-2 truncate">
                  {isRecording ? (
                    <>
                      <span className="w-2.5 h-2.5 rounded-full bg-rose-500 animate-ping"></span>
                      <span className="font-mono text-rose-400 font-bold">
                        {Math.floor(recordingSeconds / 60).toString().padStart(2, '0')}:
                        {(recordingSeconds % 60).toString().padStart(2, '0')}
                      </span>
                    </>
                  ) : isTranscribing ? (
                    <Loader2 className="w-3.5 h-3.5 text-sky-400 animate-spin" />
                  ) : (
                    <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                  )}
                  <span className="truncate">{speechNotice}</span>
                </div>
                <button
                  type="button"
                  onClick={() => setSpeechLanguage(prev => prev === 'ne-NP' ? 'en-US' : 'ne-NP')}
                  className="text-[10px] bg-slate-800 px-2.5 py-0.5 rounded-lg border border-slate-700 text-slate-200 font-bold shrink-0 ml-2 hover:bg-slate-700 transition"
                  title="भाषा परिवर्तन गर्नुहोस्"
                >
                  भाषा: {speechLanguage === 'ne-NP' ? 'नेपाली (ne-NP)' : 'English (en-US)'}
                </button>
              </div>
            )}

            {/* Multi-Image Upload Preview Ribbon (6-10 Sheets) */}
            {attachedImages.length > 0 && (
              <div className="px-4 py-2.5 bg-[#0B1120] border-t border-slate-800 shrink-0">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2 text-xs font-bold text-amber-400">
                    <Camera className="w-4 h-4 text-amber-400" />
                    <span>
                      हस्तलिखित उत्तरपुस्तिका: {attachedImages.length}/१० पाना संलग्न
                    </span>
                    {attachedImages.length >= 6 && (
                      <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 text-[10px] font-bold border border-emerald-500/40">
                        पूर्ण परीक्षणका लागि उपयुक्त
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-2">
                    {attachedImages.length < 10 && (
                      <button
                        type="button"
                        onClick={() => fileInputRef.current?.click()}
                        className="text-[11px] font-bold text-sky-400 hover:text-sky-300 transition cursor-pointer"
                      >
                        + थप पाना
                      </button>
                    )}
                    <button
                      type="button"
                      onClick={handleClearAllAttachments}
                      className="text-[11px] font-bold text-rose-400 hover:text-rose-300 transition cursor-pointer"
                    >
                      सबै हटाउनुहोस्
                    </button>
                  </div>
                </div>

                {/* Thumbnails strip */}
                <div className="flex items-center gap-2.5 overflow-x-auto pb-1 scrollbar-thin">
                  {attachedImages.map((img, idx) => (
                    <div key={idx} className="relative shrink-0 group rounded-xl overflow-hidden border border-slate-700 w-16 h-20 bg-slate-900 shadow-sm">
                      <img
                        src={img.previewUrl}
                        alt={`Sheet ${idx + 1}`}
                        className="w-full h-full object-cover"
                      />
                      <span className="absolute bottom-0 inset-x-0 bg-black/80 text-[9px] text-center font-bold text-amber-300 py-0.5">
                        पाना {idx + 1}
                      </span>
                      <button
                        type="button"
                        onClick={() => handleRemoveImage(idx)}
                        className="absolute top-0.5 right-0.5 w-4 h-4 rounded-full bg-rose-600 text-white flex items-center justify-center text-[10px] font-black cursor-pointer hover:bg-rose-700 shadow-xs"
                        title="हटाउनुहोस्"
                      >
                        ✕
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Attached PDF Preview Bar */}
            {attachedPdf && (
              <div className="px-4 py-2 bg-[#0B1120] border-t border-slate-800 flex items-center justify-between shrink-0">
                <div className="flex items-center gap-2.5 min-w-0">
                  <div className="w-8 h-8 rounded-lg bg-red-600 text-white flex items-center justify-center shrink-0 shadow-sm">
                    <FileText className="w-4 h-4" />
                  </div>
                  <div className="min-w-0">
                    <p className="font-bold text-xs text-white truncate max-w-[200px] sm:max-w-md">
                      {attachedPdf.name}
                    </p>
                    <p className="text-[10px] text-red-300 font-medium">
                      PDF दस्तावेज संलग्न ({formatFileSize(attachedPdf.sizeBytes)})
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={handleClearAllAttachments}
                  className="text-xs text-rose-400 hover:text-rose-300 font-bold px-2 py-1 rounded-lg hover:bg-slate-800 transition shrink-0 cursor-pointer"
                >
                  हटाउनुहोस्
                </button>
              </div>
            )}

            {/* Chat Input Bar with Discrete Deep Research Switch */}
            <form
              onSubmit={(e) => {
                e.preventDefault();
                if (inputQuery.trim() || attachedImages.length > 0 || attachedPdf) {
                  handleSendPrompt();
                }
              }}
              className="p-2.5 sm:p-3.5 pb-safe border-t border-slate-800 bg-[#0B1120] flex items-center gap-1.5 sm:gap-2 shrink-0 z-20"
            >
              {/* File attachment input: Multiple Images (up to 10) & PDF */}
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileSelect}
                accept=".pdf,application/pdf,image/png,image/jpeg,image/jpg,image/webp"
                multiple
                className="hidden"
                id="ai-assistant-file-input"
              />

              {/* Upload Paperclip button */}
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                disabled={isTyping}
                className="w-10 h-10 min-w-[40px] flex items-center justify-center rounded-xl border border-slate-700 bg-slate-800/80 text-slate-300 hover:text-amber-400 hover:border-amber-500 transition disabled:opacity-40 shrink-0 cursor-pointer shadow-xs"
                title="हस्तलिखित उत्तरपुस्तिका (६-१० पाना) वा PDF संलग्न गर्नुहोस्"
                aria-label="फाइल संलग्न गर्नुहोस्"
              >
                <Paperclip className="w-4 h-4 sm:w-5 sm:h-5 text-amber-400" />
              </button>

              {/* Voice Input (Speech-to-Text with gemini-3.5-transcribe) Button */}
              <button
                type="button"
                onClick={handleToggleSpeech}
                disabled={isTyping || isTranscribing}
                className={`w-10 h-10 min-w-[40px] flex items-center justify-center rounded-xl border transition disabled:opacity-40 shrink-0 cursor-pointer shadow-xs ${
                  isRecording
                    ? 'bg-rose-500 text-white border-rose-600 animate-pulse ring-2 ring-rose-400 shadow-md'
                    : isTranscribing
                    ? 'bg-sky-500/20 text-sky-400 border-sky-500/60 ring-1 ring-sky-400 animate-pulse'
                    : 'border-slate-700 bg-slate-800/80 text-slate-300 hover:text-emerald-400 hover:border-emerald-500'
                }`}
                title={
                  isRecording
                    ? `आवाज रेकर्डिङ भइरहेको छ (${recordingSeconds}s)... बन्द गर्न थिच्नुहोस्`
                    : isTranscribing
                    ? "AI ट्रान्सक्राइब गर्दैछ (gemini-3.5-transcribe)..."
                    : "बोलेर प्रश्न सोध्नुहोस् (gemini-3.5-transcribe नेपाली/English STT)"
                }
                aria-label="बोलेर प्रश्न सोध्नुहोस्"
              >
                {isRecording ? (
                  <MicOff className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
                ) : isTranscribing ? (
                  <Loader2 className="w-4 h-4 sm:w-5 sm:h-5 text-sky-400 animate-spin" />
                ) : (
                  <Mic className="w-4 h-4 sm:w-5 sm:h-5 text-emerald-400" />
                )}
              </button>

              {/* Compound Input Text Field with Discrete Deep Research Toggle Icon INSIDE */}
              <div className="relative flex-1 min-w-0 flex items-center">
                <input
                  id="ai-assistant-input"
                  type="text"
                  value={inputQuery}
                  onChange={(e) => setInputQuery(e.target.value)}
                  placeholder={
                    attachedImages.length > 0
                      ? `हस्तलिखित ${attachedImages.length} पाना उत्तरपुस्तिका मूल्याङ्कन निर्देशन...`
                      : attachedPdf
                      ? 'यस PDF दस्तावेज सम्बन्धी प्रश्न वा सारांश...'
                      : (isDeepResearchMode
                          ? 'ऐन, कानुन, दफा वा गहिरो अनुसन्धान (Deep Research ON)...'
                          : 'सोध्नुहोस् वा बोलेर टाइप गर्नुहोस्...')
                  }
                  aria-label="आफ्नो प्रश्न यहाँ सोध्नुहोस्..."
                  className={`w-full h-10 sm:h-11 pl-3.5 sm:pl-4 ${
                    isDeepResearchMode ? 'pr-28 sm:pr-34' : 'pr-24 sm:pr-28'
                  } rounded-xl bg-slate-900 border ${
                    isDeepResearchMode
                      ? 'border-sky-500/60 ring-1 ring-sky-500/30'
                      : 'border-slate-700'
                  } text-xs sm:text-sm text-white placeholder:text-slate-500 focus:outline-none focus:border-amber-500 transition`}
                />

                {/* Discrete, Modern Deep Research Mode Toggle Icon INSIDE the Input Bar */}
                <button
                  type="button"
                  id="deep-research-toggle-inside"
                  onClick={() => setIsDeepResearchMode(prev => !prev)}
                  className={`absolute right-1 sm:right-1.5 h-7 sm:h-8 px-2 sm:px-2.5 rounded-lg flex items-center gap-1.5 transition cursor-pointer text-xs font-semibold ${
                    isDeepResearchMode
                      ? 'bg-sky-500/20 text-[#38BDF8] border border-sky-500/50 shadow-xs'
                      : 'text-slate-300 hover:text-white hover:bg-slate-800/80 border border-transparent'
                  }`}
                  title={
                    isDeepResearchMode
                      ? 'Deep Research सक्रिय: नेपालका ऐन, कानुन, दफा तथा विस्तृत अनुसन्धान मोड (बन्द गर्न थिच्नुहोस्)'
                      : 'Deep Research निष्क्रिय: क्लिक गरी ऐन, कानुन र दफा विश्लेषण मोड सक्रिय गर्नुहोस्'
                  }
                  aria-label={isDeepResearchMode ? "Disable Deep Research Mode" : "Enable Deep Research Mode"}
                >
                  <Compass
                    className={`w-3.5 h-3.5 ${
                      isDeepResearchMode ? 'text-[#38BDF8] animate-spin-slow' : 'text-slate-300'
                    }`}
                  />
                  <span className="text-[10px] sm:text-[11px] select-none font-medium">
                    {isDeepResearchMode ? 'Deep Research' : 'Deep Research'}
                  </span>
                  {isDeepResearchMode && (
                    <span className="w-1.5 h-1.5 rounded-full bg-[#38BDF8] animate-pulse shrink-0" />
                  )}
                </button>
              </div>

              {/* Submit / Send Button */}
              <button
                id="ai-assistant-send-btn"
                type="submit"
                disabled={(!inputQuery.trim() && attachedImages.length === 0 && !attachedPdf) || isTyping}
                className="w-10 h-10 sm:w-11 sm:h-11 min-w-[40px] flex items-center justify-center rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 text-slate-950 hover:from-amber-600 hover:to-orange-600 transition disabled:opacity-40 cursor-pointer shrink-0 shadow-md font-bold"
                title="पठाउनुहोस्"
                aria-label="पठाउनुहोस्"
              >
                <Send className="w-4 h-4 sm:w-5 sm:h-5 text-slate-950" />
              </button>
            </form>
          </main>

        </div>
      </div>

      {/* Full-Screen Image Lightbox Viewer */}
      {previewingImage && (
        <div 
          onClick={() => setPreviewingImage(null)}
          className="fixed inset-0 z-60 bg-black/90 backdrop-blur-md flex items-center justify-center p-4 animate-fadeIn cursor-pointer"
        >
          <div className="relative max-w-4xl max-h-[90vh] flex flex-col items-center" onClick={(e) => e.stopPropagation()}>
            <button
              onClick={() => setPreviewingImage(null)}
              className="absolute -top-10 right-0 p-2 rounded-full bg-slate-800/80 text-white hover:bg-slate-700 transition cursor-pointer"
              title="बन्द गर्नुहोस्"
            >
              <X className="w-6 h-6" />
            </button>
            <img
              src={previewingImage}
              alt="हस्तलिखित उत्तरपुस्तिका पूरा पाना"
              className="max-w-full max-h-[85vh] rounded-xl object-contain shadow-2xl border border-slate-700"
            />
          </div>
        </div>
      )}
    </div>
  );
};
