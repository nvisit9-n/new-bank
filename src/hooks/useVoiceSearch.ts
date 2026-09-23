import { useState, useRef, useEffect, useCallback } from 'react';
import { 
  cleanNepaliSpeechTranscript, 
  combineSpeechChunksSafely, 
  appendSpeechTranscriptSafely 
} from '../utils/speechUtils';

export interface UseVoiceSearchOptions {
  defaultLanguage?: 'ne-NP' | 'en-US';
  onResult?: (transcript: string) => void;
  onInterim?: (interim: string) => void;
  onError?: (error: string) => void;
  autoStopMs?: number;
}

export interface UseVoiceSearchReturn {
  isListening: boolean;
  interimTranscript: string;
  isSupported: boolean;
  language: 'ne-NP' | 'en-US';
  setLanguage: (lang: 'ne-NP' | 'en-US') => void;
  startListening: () => void;
  stopListening: () => void;
  toggleListening: () => void;
  error: string | null;
}

/**
 * Custom hook providing robust Web Speech API Voice-to-Text for Nepali and English.
 * Eliminates duplicate echoes, manages interim results cleanly, and handles browser compatibility.
 */
export function useVoiceSearch({
  defaultLanguage = 'ne-NP',
  onResult,
  onInterim,
  onError,
  autoStopMs = 8000
}: UseVoiceSearchOptions = {}): UseVoiceSearchReturn {
  const [isListening, setIsListening] = useState<boolean>(false);
  const [interimTranscript, setInterimTranscript] = useState<string>('');
  const [language, setLanguage] = useState<'ne-NP' | 'en-US'>(defaultLanguage);
  const [error, setError] = useState<string | null>(null);

  const recognitionRef = useRef<any>(null);
  const speechBufferRef = useRef<string>('');
  const sessionFlushedRef = useRef<boolean>(false);
  const autoStopTimerRef = useRef<any>(null);

  // Check Web Speech API availability
  const isSupported = typeof window !== 'undefined' && 
    Boolean((window as any).SpeechRecognition || (window as any).webkitSpeechRecognition);

  const stopListening = useCallback(() => {
    if (autoStopTimerRef.current) {
      clearTimeout(autoStopTimerRef.current);
      autoStopTimerRef.current = null;
    }

    if (recognitionRef.current) {
      try {
        recognitionRef.current.stop();
      } catch (err) {
        console.warn('Speech recognition stop warning:', err);
      }
    }
    setIsListening(false);
  }, []);

  const startListening = useCallback(() => {
    setError(null);
    setInterimTranscript('');
    speechBufferRef.current = '';
    sessionFlushedRef.current = false;

    if (!isSupported) {
      const msg = language === 'ne-NP'
        ? 'तपाईँको ब्राउजरमा आवाज पहिचान (Web Speech API) उपलब्ध छैन। कृपया Google Chrome वा Edge प्रयोग गर्नुहोस्।'
        : 'Web Speech API is not supported in this browser. Please use Chrome or Edge.';
      setError(msg);
      if (onError) onError(msg);
      return;
    }

    const SpeechRec = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    try {
      const recognition = new SpeechRec();
      recognition.lang = language;
      recognition.interimResults = true;
      recognition.continuous = false;
      recognition.maxAlternatives = 1;

      recognition.onstart = () => {
        setIsListening(true);
        // Safety auto-stop timer after silence/duration
        if (autoStopTimerRef.current) clearTimeout(autoStopTimerRef.current);
        autoStopTimerRef.current = setTimeout(() => {
          stopListening();
        }, autoStopMs);
      };

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
        setInterimTranscript(cleanAccumulated);
        if (onInterim) onInterim(cleanAccumulated);

        // Reset auto-stop timer whenever active speech is registered
        if (autoStopTimerRef.current) clearTimeout(autoStopTimerRef.current);
        autoStopTimerRef.current = setTimeout(() => {
          stopListening();
        }, 3500);
      };

      recognition.onerror = (event: any) => {
        console.warn('Voice search recognition event error:', event.error);
        setIsListening(false);
        setInterimTranscript('');

        let errorMsg = '';
        if (event.error === 'not-allowed' || event.error === 'permission-denied') {
          errorMsg = language === 'ne-NP' 
            ? 'माइक्रोफोन अनुमति अस्वीकृत भयो। कृपया ब्राउजरमा माइक्रोफोन अनुमति दिनुहोस्।'
            : 'Microphone permission denied. Please allow microphone access in your browser.';
        } else if (event.error === 'no-speech') {
          errorMsg = language === 'ne-NP'
            ? 'कुनै आवाज सुनिएन। कृपया माइक नजिक प्रस्ट बोल्नुहोस्।'
            : 'No speech detected. Please speak clearly into your microphone.';
        } else if (event.error === 'network') {
          errorMsg = language === 'ne-NP'
            ? 'इन्टरनेट जडान वा स्पीच सर्भर त्रुटि।'
            : 'Speech recognition network error.';
        } else {
          errorMsg = language === 'ne-NP'
            ? `आवाज पहिचान त्रुटि (${event.error || 'पुनः प्रयास गर्नुहोस्'})`
            : `Voice search error (${event.error || 'please retry'})`;
        }

        setError(errorMsg);
        if (onError) onError(errorMsg);
      };

      recognition.onend = () => {
        setIsListening(false);
        setInterimTranscript('');

        if (autoStopTimerRef.current) {
          clearTimeout(autoStopTimerRef.current);
          autoStopTimerRef.current = null;
        }

        // Flush finalized transcript safely
        if (!sessionFlushedRef.current) {
          sessionFlushedRef.current = true;
          const finalResult = cleanNepaliSpeechTranscript(speechBufferRef.current);
          if (finalResult && onResult) {
            onResult(finalResult);
          }
          speechBufferRef.current = '';
        }
      };

      recognitionRef.current = recognition;
      recognition.start();
    } catch (err: any) {
      console.error('Failed to start Web Speech recognition:', err);
      setIsListening(false);
      const msg = language === 'ne-NP'
        ? 'आवाज पहिचान सुरु हुन सकेन। पुनः प्रयास गर्नुहोस्।'
        : 'Could not initialize speech recognition. Please retry.';
      setError(msg);
      if (onError) onError(msg);
    }
  }, [isSupported, language, onResult, onInterim, onError, autoStopMs, stopListening]);

  const toggleListening = useCallback(() => {
    if (isListening) {
      stopListening();
    } else {
      startListening();
    }
  }, [isListening, startListening, stopListening]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (autoStopTimerRef.current) clearTimeout(autoStopTimerRef.current);
      if (recognitionRef.current) {
        try {
          recognitionRef.current.stop();
        } catch {}
      }
    };
  }, []);

  return {
    isListening,
    interimTranscript,
    isSupported,
    language,
    setLanguage,
    startListening,
    stopListening,
    toggleListening,
    error
  };
}
