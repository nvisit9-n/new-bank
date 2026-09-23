/**
 * Utilities for cleaning and deduplicating Speech-to-Text (Nepali and English)
 * Completely eliminates repeated words (e.g. "नेपाल नेपाल..."), sentence fragment echoes,
 * and overlapping token boundaries when stream-accumulating final and interim chunks.
 */

/**
 * Normalizes Nepali/Devanagari and English words for comparison
 * Strips punctuation, quotes, and non-essential whitespace while preserving characters.
 */
export function normalizeToken(token: string): string {
  return (token || '')
    .trim()
    .toLowerCase()
    .replace(/[।.,?!;:"'()\[\]{}—–\-_/\\#@$%^&*`~]/g, '');
}

/**
 * Deduplicates immediate consecutive words and multi-word repeated phrases (n-grams up to 10 words).
 * Handles both Devanagari (Nepali) unicode scripts and Latin alphabets.
 * Completely eliminates duplicate phrase echoes in speech-to-text streams.
 * 
 * Examples:
 * - "नेपाल नेपाल" -> "नेपाल"
 * - "नेपाल राष्ट्र बैंक नेपाल राष्ट्र बैंक" -> "नेपाल राष्ट्र बैंक"
 * - "नमस्कार साथीहरु नमस्कार साथीहरु" -> "नमस्कार साथीहरु"
 */
export function cleanNepaliSpeechTranscript(raw: string): string {
  if (!raw) return '';

  // 1. Normalize excessive whitespace
  let text = raw.replace(/\s+/g, ' ').trim();
  if (!text) return '';

  // 2. Split into words preserving Unicode boundaries
  let words = text.split(' ').filter(w => w.trim().length > 0);
  if (words.length <= 1) return text;

  // Pass 1: Multi-pass N-gram phrase deduplication (checking phrases of length up to 10 down to 1)
  let changed = true;
  let iterations = 0;

  while (changed && iterations < 8) {
    changed = false;
    iterations++;

    const maxLen = Math.min(10, Math.floor(words.length / 2));
    for (let phraseLen = maxLen; phraseLen >= 1; phraseLen--) {
      const nextWords: string[] = [];
      let i = 0;

      while (i < words.length) {
        if (i + 2 * phraseLen <= words.length) {
          const firstPhrase = words.slice(i, i + phraseLen).map(normalizeToken).join(' ');
          const secondPhrase = words.slice(i + phraseLen, i + 2 * phraseLen).map(normalizeToken).join(' ');

          if (firstPhrase.length > 0 && firstPhrase === secondPhrase) {
            // Found exact duplicate phrase! Keep the first phrase, skip the second
            for (let k = 0; k < phraseLen; k++) {
              nextWords.push(words[i + k]);
            }
            i += 2 * phraseLen;
            changed = true;
            continue;
          }
        }

        nextWords.push(words[i]);
        i++;
      }

      words = nextWords;
    }
  }

  // Pass 2: Consecutive single-word deduplication
  const finalWords: string[] = [];
  for (let i = 0; i < words.length; i++) {
    const cur = words[i];
    const normCur = normalizeToken(cur);

    if (
      finalWords.length > 0 &&
      normalizeToken(finalWords[finalWords.length - 1]) === normCur &&
      normCur.length > 0
    ) {
      continue;
    }

    finalWords.push(cur);
  }

  return finalWords.join(' ').trim();
}

/**
 * Seamlessly appends a newly finalized transcript chunk or combines finalChunk + interimChunk,
 * detecting and stripping any overlapping word boundary or prefix echo.
 */
export function appendSpeechTranscriptSafely(existingText: string, incomingTranscript: string): string {
  const cleanExisting = cleanNepaliSpeechTranscript(existingText || '');
  const cleanIncoming = cleanNepaliSpeechTranscript(incomingTranscript || '');

  if (!cleanExisting) return cleanIncoming;
  if (!cleanIncoming) return cleanExisting;

  const normExisting = normalizeToken(cleanExisting);
  const normIncoming = normalizeToken(cleanIncoming);

  // If already identical
  if (normExisting === normIncoming) {
    return cleanExisting;
  }

  // If cleanExisting already ends with cleanIncoming
  if (cleanExisting.endsWith(cleanIncoming) || normExisting.endsWith(normIncoming)) {
    return cleanExisting;
  }

  // If incoming already starts with existing (common when interim or new chunk repeats whole prior phrase)
  if (cleanIncoming.startsWith(cleanExisting) || normIncoming.startsWith(normExisting)) {
    return cleanIncoming;
  }

  // If existing starts with incoming
  if (cleanExisting.startsWith(cleanIncoming) || normExisting.startsWith(normIncoming)) {
    return cleanExisting;
  }

  const existingWords = cleanExisting.split(' ').filter(w => w.length > 0);
  const incomingWords = cleanIncoming.split(' ').filter(w => w.length > 0);

  // Check overlap of up to 15 words at the boundary
  let maxOverlap = 0;
  const maxCheck = Math.min(existingWords.length, incomingWords.length, 15);

  for (let k = maxCheck; k > 0; k--) {
    const existingTail = existingWords.slice(-k).map(normalizeToken).join(' ');
    const incomingHead = incomingWords.slice(0, k).map(normalizeToken).join(' ');

    if (existingTail === incomingHead) {
      maxOverlap = k;
      break;
    }
  }

  if (maxOverlap > 0) {
    const nonOverlappingIncoming = incomingWords.slice(maxOverlap).join(' ');
    if (!nonOverlappingIncoming) return cleanExisting;
    return cleanNepaliSpeechTranscript(`${cleanExisting} ${nonOverlappingIncoming}`);
  }

  return cleanNepaliSpeechTranscript(`${cleanExisting} ${cleanIncoming}`);
}

/**
 * Combines finalChunk and interimChunk safely in onresult handler.
 * Prevents SpeechRecognition from echoing the final words into the interim buffer.
 */
export function combineSpeechChunksSafely(finalChunk: string, interimChunk: string): string {
  const cleanFinal = cleanNepaliSpeechTranscript(finalChunk || '');
  const cleanInterim = cleanNepaliSpeechTranscript(interimChunk || '');

  if (!cleanFinal) return cleanInterim;
  if (!cleanInterim) return cleanFinal;

  const normFinal = normalizeToken(cleanFinal);
  const normInterim = normalizeToken(cleanInterim);

  // If interim begins with the final chunk, just use the interim chunk (which has the complete sentence)
  if (normInterim.startsWith(normFinal)) {
    return cleanInterim;
  }

  // If final ends with the interim chunk, don't duplicate
  if (normFinal.endsWith(normInterim)) {
    return cleanFinal;
  }

  return appendSpeechTranscriptSafely(cleanFinal, cleanInterim);
}
