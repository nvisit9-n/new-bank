import { BANKING_EXAM_TOPICS_DATA, BankingExamTopicNote } from '../data/bankingExamNotesData';
import { buildJsPdfDocument } from '../utils/pdfDownloadEngine';

export const PDF_CACHE_NAME = 'pdf-documents-cache';
export const NOTES_CACHE_NAME = 'study-notes-hub-cache';

export interface OfflineCacheProgress {
  total: number;
  completed: number;
  currentTitle: string;
  isFinished: boolean;
  error?: string;
}

export interface OfflineStorageStats {
  totalTopics: number;
  cachedCount: number;
  cachedTopicIds: string[];
  isFullyCached: boolean;
  estimatedBytes: number;
}

/**
 * Check if the browser supports the Cache API
 */
export function isCacheStorageAvailable(): boolean {
  return typeof window !== 'undefined' && 'caches' in window;
}

/**
 * Checks if a specific topic's PDF is already cached offline
 */
export async function isTopicPdfCached(topicId: string): Promise<boolean> {
  if (!isCacheStorageAvailable()) return false;
  try {
    const cache = await caches.open(PDF_CACHE_NAME);
    const primaryUrl = `/notes-pdf/${topicId}.pdf`;
    const response = await cache.match(primaryUrl);
    if (response) return true;

    // Check if matching by topic object's custom filename
    const topic = BANKING_EXAM_TOPICS_DATA.find(t => t.id === topicId);
    if (topic?.pdfFilename) {
      const secondaryMatch = await cache.match(`/notes-pdf/${topic.pdfFilename}`);
      if (secondaryMatch) return true;
    }
    return false;
  } catch (err) {
    console.warn('Error checking topic PDF cache:', err);
    return false;
  }
}

/**
 * Retrieves the cached PDF as a Blob or object URL for offline rendering
 */
export async function getCachedPdfUrlOrBlob(note: BankingExamTopicNote): Promise<{ url: string; fromCache: boolean }> {
  const targetPath = `/notes-pdf/${note.id}.pdf`;

  if (isCacheStorageAvailable()) {
    try {
      const cache = await caches.open(PDF_CACHE_NAME);
      const match = await cache.match(targetPath) || await cache.match(`/notes-pdf/${note.pdfFilename}`);

      if (match) {
        const blob = await match.blob();
        return {
          url: URL.createObjectURL(blob),
          fromCache: true
        };
      }
    } catch (e) {
      console.warn('Failed reading from CacheStorage, falling back:', e);
    }
  }

  // If online, try fetching static asset from server and save to cache
  if (typeof navigator !== 'undefined' && navigator.onLine) {
    try {
      const res = await fetch(targetPath);
      if (res.ok) {
        const blob = await res.blob();
        // Background cache it
        if (isCacheStorageAvailable()) {
          caches.open(PDF_CACHE_NAME).then(c => {
            c.put(targetPath, new Response(blob.slice(0), {
              headers: { 'Content-Type': 'application/pdf', 'Content-Length': blob.size.toString() }
            })).catch(() => {});
          });
        }
        return {
          url: URL.createObjectURL(blob),
          fromCache: false
        };
      }
    } catch {
      // ignore fetch error and fall through
    }
  }

  // Fallback: Generate on-the-fly using bundled jsPDF engine (100% offline capable!)
  const doc = buildJsPdfDocument(note);
  const generatedBlob = doc.output('blob');
  
  // Store generated blob into cache storage for subsequent calls
  if (isCacheStorageAvailable()) {
    try {
      const cache = await caches.open(PDF_CACHE_NAME);
      await cache.put(targetPath, new Response(generatedBlob.slice(0), {
        headers: { 'Content-Type': 'application/pdf', 'Content-Length': generatedBlob.size.toString() }
      }));
    } catch {
      // ignore
    }
  }

  return {
    url: URL.createObjectURL(generatedBlob),
    fromCache: true
  };
}

/**
 * Downloads and caches all 5 Study Notes topics & PDFs for 100% offline access
 */
export async function cacheAllStudyNotesOffline(
  onProgress?: (progress: OfflineCacheProgress) => void
): Promise<boolean> {
  if (!isCacheStorageAvailable()) {
    throw new Error('CacheStorage API is not supported in this browser environment.');
  }

  const total = BANKING_EXAM_TOPICS_DATA.length;
  let completed = 0;

  try {
    const pdfCache = await caches.open(PDF_CACHE_NAME);
    const notesCache = await caches.open(NOTES_CACHE_NAME);

    // 1. Cache manifest first
    try {
      await notesCache.add('/data/studyNotesManifest.json');
    } catch {
      // If server route isn't hit, synthetic response
      const manifestJson = JSON.stringify({
        totalTopics: total,
        cachedAt: new Date().toISOString(),
        topics: BANKING_EXAM_TOPICS_DATA.map(t => ({ id: t.id, titleEn: t.titleEn, pdfFilename: t.pdfFilename }))
      });
      await notesCache.put(
        '/data/studyNotesManifest.json',
        new Response(manifestJson, { headers: { 'Content-Type': 'application/json' } })
      );
    }

    // 2. Loop through each topic and guarantee its PDF exists in CacheStorage
    for (const topic of BANKING_EXAM_TOPICS_DATA) {
      if (onProgress) {
        onProgress({
          total,
          completed,
          currentTitle: `${topic.titleNe} (${topic.titleEn})`,
          isFinished: false
        });
      }

      const pdfUrl = `/notes-pdf/${topic.id}.pdf`;
      let cachedSuccessfully = false;

      // Try fetching the static file first if network exists
      if (navigator.onLine) {
        try {
          const fetchRes = await fetch(pdfUrl);
          if (fetchRes.ok) {
            await pdfCache.put(pdfUrl, fetchRes.clone());
            if (topic.pdfFilename) {
              await pdfCache.put(`/notes-pdf/${topic.pdfFilename}`, fetchRes);
            }
            cachedSuccessfully = true;
          }
        } catch (fetchErr) {
          console.warn(`Static fetch failed for ${topic.id}, falling back to generator:`, fetchErr);
        }
      }

      // If static fetch didn't happen (offline or 404), build it via jsPDF and cache the Response
      if (!cachedSuccessfully) {
        const doc = buildJsPdfDocument(topic);
        const blob = doc.output('blob');
        const syntheticResponse = new Response(blob, {
          headers: {
            'Content-Type': 'application/pdf',
            'Content-Length': blob.size.toString(),
            'X-Generated-Offline': 'true'
          }
        });
        await pdfCache.put(pdfUrl, syntheticResponse.clone());
        if (topic.pdfFilename) {
          await pdfCache.put(`/notes-pdf/${topic.pdfFilename}`, syntheticResponse);
        }
      }

      completed++;
    }

    if (onProgress) {
      onProgress({
        total,
        completed,
        currentTitle: 'सबै नोट्स र PDF अफलाइन सुरक्षित गरियो!',
        isFinished: true
      });
    }

    // Persist timestamp in local storage
    try {
      localStorage.setItem('btn_study_notes_offline_cached_at', Date.now().toString());
    } catch {
      // ignore
    }

    return true;
  } catch (err: any) {
    console.error('Failed caching all study notes offline:', err);
    if (onProgress) {
      onProgress({
        total,
        completed,
        currentTitle: 'त्रुटि भयो',
        isFinished: true,
        error: err?.message || 'अज्ञात त्रुटि'
      });
    }
    return false;
  }
}

/**
 * Inspects offline storage stats
 */
export async function getOfflineStorageStats(): Promise<OfflineStorageStats> {
  const totalTopics = BANKING_EXAM_TOPICS_DATA.length;
  if (!isCacheStorageAvailable()) {
    return {
      totalTopics,
      cachedCount: 0,
      cachedTopicIds: [],
      isFullyCached: false,
      estimatedBytes: 0
    };
  }

  try {
    const pdfCache = await caches.open(PDF_CACHE_NAME);
    const cachedTopicIds: string[] = [];
    let estimatedBytes = 0;

    for (const topic of BANKING_EXAM_TOPICS_DATA) {
      const match = await pdfCache.match(`/notes-pdf/${topic.id}.pdf`);
      if (match) {
        cachedTopicIds.push(topic.id);
        const cl = match.headers.get('content-length');
        if (cl) {
          estimatedBytes += parseInt(cl, 10);
        } else {
          estimatedBytes += 22000; // Average ~22KB
        }
      }
    }

    return {
      totalTopics,
      cachedCount: cachedTopicIds.length,
      cachedTopicIds,
      isFullyCached: cachedTopicIds.length === totalTopics,
      estimatedBytes
    };
  } catch (err) {
    console.warn('Failed getting offline storage stats:', err);
    return {
      totalTopics,
      cachedCount: 0,
      cachedTopicIds: [],
      isFullyCached: false,
      estimatedBytes: 0
    };
  }
}

/**
 * Clears the offline notes and PDF cache
 */
export async function clearOfflineNotesCache(): Promise<boolean> {
  if (!isCacheStorageAvailable()) return false;
  try {
    await caches.delete(PDF_CACHE_NAME);
    await caches.delete(NOTES_CACHE_NAME);
    localStorage.removeItem('btn_study_notes_offline_cached_at');
    return true;
  } catch (err) {
    console.warn('Failed to clear notes cache:', err);
    return false;
  }
}
