import { doc, getDoc, setDoc } from 'firebase/firestore';
import { db } from '../firebase';
import { BookmarkItem, UserProfile } from '../types';
import { StorageService } from './storageService';
import { ExamProgressService } from './examProgressService';

export interface SyncedStudyProgress {
  userId: string;
  targetExam?: string;
  quizzesCompleted: number;
  questionsSolved: number;
  accuracy: number;
  xp: number;
  level: number;
  streak: number;
  categoryProgress: Record<string, string[]>;
  lastSyncedAt: string;
  notesReadCount?: number;
}

export class FirebaseSyncService {
  private static isSyncingBookmarks = false;
  private static isSyncingStudyProgress = false;
  private static lastBookmarkSyncHash = '';
  private static lastProgressSyncHash = '';

  /**
   * Seamlessly persists user bookmarks to Firestore under `users/{userId}/data/bookmarks`
   * and dual-syncs to the root user profile for maximum compatibility across devices.
   */
  static async syncBookmarksToFirestore(userId: string, bookmarks: BookmarkItem[]): Promise<boolean> {
    if (!userId || !db) return false;

    const hash = JSON.stringify(bookmarks.map(b => b.id).sort());
    if (hash === this.lastBookmarkSyncHash && this.lastBookmarkSyncHash !== '') {
      return true;
    }

    try {
      this.isSyncingBookmarks = true;
      const cleanBookmarks = bookmarks.map(b => ({
        id: b.id,
        type: b.type,
        targetId: b.targetId,
        title: b.title,
        category: b.category,
        savedAt: b.savedAt || new Date().toISOString()
      }));

      // 1. Dedicated bookmarks subdocument in Firestore
      const bookmarkDocRef = doc(db, 'users', userId, 'data', 'bookmarks');
      await setDoc(bookmarkDocRef, {
        userId,
        items: cleanBookmarks,
        count: cleanBookmarks.length,
        updatedAt: new Date().toISOString()
      }, { merge: true });

      // 2. Also merge into main user document for atomic retrieval on login
      const userDocRef = doc(db, 'users', userId);
      await setDoc(userDocRef, {
        bookmarksCount: cleanBookmarks.length,
        bookmarksLastUpdated: new Date().toISOString()
      }, { merge: true });

      this.lastBookmarkSyncHash = hash;
      return true;
    } catch (err) {
      console.warn('Firestore bookmarks sync notice (saved locally):', err);
      return false;
    } finally {
      this.isSyncingBookmarks = false;
    }
  }

  /**
   * Fetches cloud bookmarks for a user from Firestore
   */
  static async fetchBookmarksFromFirestore(userId: string): Promise<BookmarkItem[] | null> {
    if (!userId || !db) return null;

    try {
      const bookmarkDocRef = doc(db, 'users', userId, 'data', 'bookmarks');
      const snap = await getDoc(bookmarkDocRef);
      if (snap.exists()) {
        const data = snap.data();
        if (data && Array.isArray(data.items)) {
          return data.items as BookmarkItem[];
        }
      }
    } catch (err) {
      console.warn('Error fetching bookmarks from Firestore:', err);
    }
    return null;
  }

  /**
   * Merges remote cloud bookmarks with local bookmarks, resolving conflicts and syncing back
   */
  static async mergeAndSyncBookmarks(userId: string, localBookmarks: BookmarkItem[]): Promise<BookmarkItem[]> {
    if (!userId) return localBookmarks;

    try {
      const remote = await this.fetchBookmarksFromFirestore(userId);
      if (!remote || remote.length === 0) {
        // If no remote bookmarks yet, push local to remote
        if (localBookmarks.length > 0) {
          await this.syncBookmarksToFirestore(userId, localBookmarks);
        }
        return localBookmarks;
      }

      // Merge: unique by type + targetId
      const map = new Map<string, BookmarkItem>();

      // Load remote items
      remote.forEach(item => {
        const key = `${item.type}:${item.targetId}`;
        map.set(key, item);
      });

      // Load local items (if newer or not in remote, add)
      localBookmarks.forEach(item => {
        const key = `${item.type}:${item.targetId}`;
        if (!map.has(key)) {
          map.set(key, item);
        }
      });

      const merged = Array.from(map.values());
      
      // Update local storage
      StorageService.saveBookmarks(merged);

      // Sync back merged collection to Firestore
      await this.syncBookmarksToFirestore(userId, merged);

      // Dispatch event for UI reactivity
      if (typeof window !== 'undefined') {
        window.dispatchEvent(new CustomEvent('btn:bookmarks-synced', { detail: merged }));
      }

      return merged;
    } catch (e) {
      console.warn('Error merging bookmarks:', e);
      return localBookmarks;
    }
  }

  /**
   * Seamlessly persists user overall Study Progress to Firestore
   * - Completed Syllabus topics (Banking, Loksewa, NRB)
   * - Quizzes solved & accuracy rate
   * - XP, Level, Streak, Target Exam
   */
  static async syncStudyProgressToFirestore(userId: string, customProgress?: Partial<SyncedStudyProgress>): Promise<boolean> {
    if (!userId || !db) return false;

    try {
      this.isSyncingStudyProgress = true;
      const user = StorageService.getUserProfile();
      const categoryProgress = ExamProgressService.getStoredCompletedTopicIds();

      const progressPayload: SyncedStudyProgress = {
        userId,
        targetExam: user.targetExam || 'नेपाल राष्ट्र बैंक (NRB) - सहायक ४',
        quizzesCompleted: user.quizzesCompleted || 0,
        questionsSolved: user.questionsSolved || 0,
        accuracy: user.accuracy || 100,
        xp: user.xp || 250,
        level: user.level || 1,
        streak: user.streak || 1,
        categoryProgress,
        lastSyncedAt: new Date().toISOString(),
        ...customProgress
      };

      const hash = JSON.stringify(progressPayload);
      if (hash === this.lastProgressSyncHash && this.lastProgressSyncHash !== '') {
        return true;
      }

      // 1. Dedicated study_progress document under user
      const progressDocRef = doc(db, 'users', userId, 'data', 'study_progress');
      await setDoc(progressDocRef, progressPayload, { merge: true });

      // 2. Also update main user document stats
      const userDocRef = doc(db, 'users', userId);
      await setDoc(userDocRef, {
        quizzesCompleted: progressPayload.quizzesCompleted,
        questionsSolved: progressPayload.questionsSolved,
        accuracy: progressPayload.accuracy,
        xp: progressPayload.xp,
        level: progressPayload.level,
        streak: progressPayload.streak,
        targetExam: progressPayload.targetExam,
        studyProgressLastSynced: progressPayload.lastSyncedAt
      }, { merge: true });

      this.lastProgressSyncHash = hash;
      return true;
    } catch (err) {
      console.warn('Firestore study progress sync notice (saved locally):', err);
      return false;
    } finally {
      this.isSyncingStudyProgress = false;
    }
  }

  /**
   * Fetches study progress from Firestore
   */
  static async fetchStudyProgressFromFirestore(userId: string): Promise<SyncedStudyProgress | null> {
    if (!userId || !db) return null;

    try {
      const progressDocRef = doc(db, 'users', userId, 'data', 'study_progress');
      const snap = await getDoc(progressDocRef);
      if (snap.exists()) {
        return snap.data() as SyncedStudyProgress;
      }
    } catch (err) {
      console.warn('Error fetching study progress from Firestore:', err);
    }
    return null;
  }

  /**
   * Restores remote study progress onto current device on user login or page refresh
   */
  static async restoreStudyProgress(userId: string): Promise<void> {
    if (!userId) return;

    try {
      const remote = await this.fetchStudyProgressFromFirestore(userId);
      if (!remote) {
        // If no remote study progress yet, sync local progress up
        await this.syncStudyProgressToFirestore(userId);
        return;
      }

      // 1. Merge completed topic IDs
      if (remote.categoryProgress && typeof remote.categoryProgress === 'object') {
        const local = ExamProgressService.getStoredCompletedTopicIds();
        const merged: Record<string, string[]> = { ...local };

        Object.keys(remote.categoryProgress).forEach(cat => {
          const remoteList = remote.categoryProgress[cat] || [];
          const localList = local[cat as any] || [];
          const combined = Array.from(new Set([...localList, ...remoteList]));
          merged[cat] = combined;
        });

        // Save into local storage
        try {
          localStorage.setItem('btn_exam_category_progress_v2', JSON.stringify(merged));
          if (typeof window !== 'undefined') {
            window.dispatchEvent(new CustomEvent('btn:category-progress-updated', { detail: merged }));
          }
        } catch {}
      }

      // 2. Update user profile metrics if remote has more progress
      const localUser = StorageService.getUserProfile();
      let hasUpdates = false;
      const updatedUser: UserProfile = { ...localUser };

      if ((remote.quizzesCompleted || 0) > (localUser.quizzesCompleted || 0)) {
        updatedUser.quizzesCompleted = remote.quizzesCompleted;
        hasUpdates = true;
      }
      if ((remote.questionsSolved || 0) > (localUser.questionsSolved || 0)) {
        updatedUser.questionsSolved = remote.questionsSolved;
        hasUpdates = true;
      }
      if ((remote.xp || 0) > (localUser.xp || 0)) {
        updatedUser.xp = remote.xp;
        updatedUser.level = remote.level || Math.max(1, Math.floor(remote.xp / 500) + 1);
        hasUpdates = true;
      }
      if (remote.targetExam && !localUser.targetExam) {
        updatedUser.targetExam = remote.targetExam;
        hasUpdates = true;
      }

      if (hasUpdates) {
        StorageService.saveUserProfile(updatedUser);
        if (typeof window !== 'undefined') {
          window.dispatchEvent(new CustomEvent('btn:profile-updated', { detail: updatedUser }));
        }
      }
    } catch (e) {
      console.warn('Error restoring study progress:', e);
    }
  }
}
