/**
 * Automated Question Deduplication Utility
 * Performs deep semantic comparison of question stems and options
 * to remove duplicate and repeated MCQs across Loksewa & Banking sets.
 */

export interface DeduplicationOptions {
  stripNumbering?: boolean;
  normalizeWhitespace?: boolean;
  ignorePunctuation?: boolean;
  compareOptions?: boolean;
}

/**
 * Normalizes question text for canonical comparison:
 * - Strips question numbers (e.g., "1.", "५०.", "(१)", "Q1:", "प्रश्न नं १:")
 * - Cleans leading/trailing quotes, hyphens, and punctuation
 * - Normalizes Unicode and whitespace
 * - Handles bilingual text splits
 */
export function normalizeQuestionStem(text: string): string {
  if (!text) return '';

  let cleaned = text
    // Normalize unicode
    .normalize('NFKC')
    // Remove leading numbering like "1.", "12.", "१.", "५०.", "Q1:", "Q.1", "प्रश्न १:", "(1)", "(क)"
    .replace(/^(\s*Q\s*[\d\.\:\-]+|\s*प्रश्न\s*(\s*नं\.?)?\s*[\d\u0966-\u096F\.\:\-]+|[\(\[]?[\d\u0966-\u096F]+[\)\].\:\-]?)/i, '')
    // Remove common prefixes
    .replace(/^[\s\.\:\-\,\–\—\*\#]+/, '')
    // Collapse all whitespace into a single space
    .replace(/\s+/g, ' ')
    .trim()
    .toLowerCase();

  // Strip trailing punctuation
  cleaned = cleaned.replace(/[\?\.\,\!\;\:\s\।]+$/, '').trim();

  return cleaned;
}

/**
 * Normalizes an option string for fingerprinting
 */
export function normalizeOptionText(opt: any): string {
  if (!opt) return '';
  const text = typeof opt === 'string' ? opt : (opt.text || opt.title || opt.nepali || opt.english || '');
  return text
    .normalize('NFKC')
    .replace(/^([A-D]|[क-घ]|[१-४]|\d+)[\.\)\:\-\s]+/i, '')
    .replace(/\s+/g, ' ')
    .trim()
    .toLowerCase()
    .replace(/[\.\,\!\;\:\s\।]+$/, '');
}

/**
 * Generates a unique canonical fingerprint for an MCQ.
 * Compares both question stem and sorted options if available.
 */
export function getQuestionFingerprint(item: any): string {
  if (!item) return '';

  // Extract question text
  const primaryQuestion = item.question || item.questionNepali || item.qNep || item.qEng || item.questionEnglish || '';
  const secondaryQuestion = item.questionEnglish || item.qEng || '';
  
  const stem1 = normalizeQuestionStem(primaryQuestion);
  const stem2 = normalizeQuestionStem(secondaryQuestion);

  // Extract and normalize options
  const rawOptions = item.options || item.distractors || [];
  let optionFingerprint = '';
  if (Array.isArray(rawOptions) && rawOptions.length > 0) {
    const normOpts = rawOptions
      .map(normalizeOptionText)
      .filter(Boolean)
      .sort();
    optionFingerprint = normOpts.join('|');
  }

  // Combine stem and options
  return `${stem1}__${stem2}__${optionFingerprint}`;
}

/**
 * Deduplicates an array of questions.
 * Preserves the highest-fidelity question item when duplicates occur.
 */
export function deduplicateQuestions<T = any>(
  questions: T[],
  customKeyExtractor?: (item: T) => string
): { unique: T[]; duplicatesRemoved: number; duplicateKeys: string[] } {
  if (!Array.isArray(questions) || questions.length === 0) {
    return { unique: [], duplicatesRemoved: 0, duplicateKeys: [] };
  }

  const seenFingerprints = new Map<string, T>();
  const duplicateKeys: string[] = [];
  let duplicatesRemoved = 0;

  for (const item of questions) {
    const key = customKeyExtractor ? customKeyExtractor(item) : getQuestionFingerprint(item);
    
    // If the key is virtually empty, fall back to item ID or keep it
    if (!key || key === '____') {
      const fallbackId = (item as any)?.id || Math.random().toString();
      seenFingerprints.set(fallbackId, item);
      continue;
    }

    if (seenFingerprints.has(key)) {
      duplicatesRemoved++;
      duplicateKeys.push(key);
      // If current item has richer explanation, update it
      const existing = seenFingerprints.get(key) as any;
      const cur = item as any;
      if (
        (!existing.explanation && cur.explanation) ||
        (!existing.explanationNepali && cur.explanationNepali) ||
        (!existing.actSection && cur.actSection)
      ) {
        seenFingerprints.set(key, item);
      }
    } else {
      seenFingerprints.set(key, item);
    }
  }

  const unique = Array.from(seenFingerprints.values());
  return {
    unique,
    duplicatesRemoved,
    duplicateKeys
  };
}
