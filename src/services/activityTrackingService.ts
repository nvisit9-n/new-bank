import { collection, addDoc, doc, setDoc, getDocs, query, orderBy, limit, where } from 'firebase/firestore';
import { ref, push, set } from 'firebase/database';
import { db, rtdb, auth } from '../firebase';
import { UserActivityRecord, DownloadEventRecord, ExamScoreRecord, ExamSubmissionRecord, UserProfile } from '../types';
import { isExcludedAdminActivity } from '../utils/sanitizer';

export type { UserActivityRecord, DownloadEventRecord, ExamScoreRecord, ExamSubmissionRecord };
export type ActivityLogRecord = UserActivityRecord;

export interface GlobalUserActivityLog {
  id: string;
  userId: string;
  userName: string;
  userEmail: string;
  activityType: string;
  action: string;
  details: string;
  page?: string;
  device: string;
  browser: string;
  isYouTubeSubscribed: boolean;
  timestamp: string;
  metadata?: Record<string, any>;
}

export interface GlobalRegisteredUser {
  id: string;
  name: string;
  displayName: string;
  email: string;
  photoURL?: string;
  district?: string;
  province?: string;
  targetExam?: string;
  totalLogins: number;
  pagesVisited: string[];
  lastPageVisited?: string;
  testsTaken: number;
  isYouTubeSubscribed: boolean;
  lastLoginAt: string;
  lastActive: string;
  device: string;
  browser: string;
  registeredAt: string;
  totalXp: number;
  isPro: boolean;
  entryStatus: string;
}

export function getClientDeviceInfo(): { device: string; browser: string } {
  if (typeof window === 'undefined') {
    return { device: 'Desktop', browser: 'Browser' };
  }
  const ua = navigator.userAgent || '';
  let device = 'Desktop';
  if (/mobile|android|iphone|ipod|blackberry|iemobile|opera mini/i.test(ua)) {
    device = 'Mobile';
  } else if (/ipad|tablet/i.test(ua) || (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1)) {
    device = 'Tablet';
  }

  let browser = 'Unknown';
  if (/edg/i.test(ua)) browser = 'Edge';
  else if (/opr|opera/i.test(ua)) browser = 'Opera';
  else if (/chrome|crios/i.test(ua)) browser = 'Chrome';
  else if (/firefox|fxios/i.test(ua)) browser = 'Firefox';
  else if (/safari/i.test(ua)) browser = 'Safari';

  return { device, browser };
}

const STORAGE_KEYS = {
  USER_ACTIVITIES: 'btn_user_activities_cache',
  DOWNLOAD_EVENTS: 'btn_download_events_cache',
  EXAM_SCORES: 'btn_exam_scores_cache',
  EXAM_SUBMISSIONS: 'btn_exam_submissions_cache',
};

export class ActivityTrackingService {
  /**
   * Helper to resolve user details safely for both authenticated and guest users
   */
  private static resolveUserDetails(user?: Partial<UserProfile> | null): {
    uid: string;
    email: string;
    displayName: string;
    district: string;
    targetExam: string;
    isGuest: boolean;
    isValid: boolean;
  } {
    const authUser = auth?.currentUser;
    const isGuest = Boolean(user?.isGuest || (!user && !authUser));
    const email = user?.email?.trim() || authUser?.email || '';
    
    // Provide a consistent user identifier
    let uid = user?.authUid || user?.id || authUser?.uid || '';
    if (!uid) {
      uid = email ? `usr-${email.split('@')[0]}` : (isGuest ? `guest-${Math.random().toString(36).substring(2, 9)}` : 'std-student');
    }

    const displayName = user?.displayName || user?.name || authUser?.displayName || (email ? email.split('@')[0] : (isGuest ? 'अतिथि परीक्षार्थी' : 'विद्यार्थी'));
    const district = user?.district || 'काठमाडौँ';
    const targetExam = user?.targetExam || 'नेपाल राष्ट्र बैंक - सहायक ४';

    return {
      uid,
      email,
      displayName,
      district,
      targetExam,
      isGuest,
      isValid: true // All users (both guest & authenticated) are valid for tracking
    };
  }

  /**
   * Log authenticated user activity (e.g. detailed reading material, study notes, syllabus, login)
   */
  static async logActivity(params: {
    user?: Partial<UserProfile> | null;
    activityType: 'reading' | 'download' | 'exam_start' | 'exam_complete' | 'syllabus_view' | 'login' | 'channel_subscribe';
    details: string;
    targetId?: string;
    targetTitle?: string;
    metadata?: Record<string, any>;
  }): Promise<UserActivityRecord | null> {
    const resolved = this.resolveUserDetails(params.user);
    if (!resolved.isValid && !params.user?.isGuest) {
      return null;
    }

    const record: UserActivityRecord = {
      id: `act-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
      userId: resolved.uid,
      userName: resolved.displayName,
      userEmail: resolved.email,
      activityType: params.activityType,
      details: params.details,
      timestamp: new Date().toISOString(),
      metadata: {
        ...(params.metadata || {}),
        ...(params.targetId ? { targetId: params.targetId } : {}),
        ...(params.targetTitle ? { targetTitle: params.targetTitle } : {})
      }
    };

    // Also trigger mandatory global database logging
    this.logUserActivity({
      user: params.user,
      activityType: params.activityType,
      action: params.details,
      details: params.details,
      page: params.metadata?.page || 'अध्ययन सामग्री',
      metadata: params.metadata
    }).catch(() => {});

    // 1. Cache locally for instant availability
    try {
      const cached = this.getLocalActivities(false);
      cached.unshift(record);
      localStorage.setItem(STORAGE_KEYS.USER_ACTIVITIES, JSON.stringify(cached.slice(0, 200)));
    } catch (e) {
      console.warn('Local activity cache warning:', e);
    }

    // 2. Persist to Firebase Realtime Database (rtdb) for instant multi-user stream
    try {
      if (rtdb) {
        const actRef = push(ref(rtdb, 'user_activities'));
        set(actRef, record).catch(() => {});
        if (resolved.uid && resolved.uid !== 'anonymous_student') {
          set(ref(rtdb, `users/${resolved.uid}/lastActivity`), {
            ...record,
            lastSeenAt: new Date().toISOString()
          }).catch(() => {});
        }
      }
    } catch (rtdbErr) {
      console.warn('Realtime Database activity logging warning:', rtdbErr);
    }

    // 3. Persist to Firestore collection `user_activities`
    try {
      if (db) {
        await addDoc(collection(db, 'user_activities'), record);
      }
    } catch (fsErr) {
      console.warn('Firestore activity log warning:', fsErr);
    }

    // 4. Dual sync to backend API endpoint
    try {
      fetch('/api/tracking/activity', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(record),
      }).catch(() => {});
    } catch {}

    return record;
  }

  // =========================================================================
  // MANDATORY GLOBAL DATABASE LOGGING & REGISTERED USERS SYNC
  // Writes directly to Firestore `user_activity_logs` & `registered_users`,
  // backend server database, and Realtime Database.
  // =========================================================================

  /**
   * Log any action directly to `user_activity_logs` and auto-sync `registered_users`
   */
  static async logUserActivity(params: {
    user?: Partial<UserProfile> | null;
    activityType: string;
    action?: string;
    details: string;
    page?: string;
    isYouTubeSubscribed?: boolean;
    testsTakenIncrement?: boolean;
    metadata?: Record<string, any>;
  }): Promise<GlobalUserActivityLog> {
    const resolved = this.resolveUserDetails(params.user);
    const { device, browser } = getClientDeviceInfo();
    const timestamp = new Date().toISOString();
    const logId = `act-${Date.now()}-${Math.random().toString(36).substring(2, 8)}`;
    const page = params.page || params.metadata?.page || 'गृहपृष्ठ';
    const action = params.action || params.details;
    const isSubscribed = params.isYouTubeSubscribed ?? Boolean(params.user?.isYouTubeSubscribed);

    const logRecord: GlobalUserActivityLog = {
      id: logId,
      userId: resolved.uid,
      userName: resolved.displayName,
      userEmail: resolved.email,
      activityType: params.activityType,
      action,
      details: params.details,
      page,
      device,
      browser,
      isYouTubeSubscribed: isSubscribed,
      timestamp,
      metadata: params.metadata || {}
    };

    // 1. Direct write to Firestore `user_activity_logs`
    try {
      if (db) {
        const docRef = doc(collection(db, 'user_activity_logs'));
        setDoc(docRef, logRecord).catch(err => {
          console.warn('Firestore user_activity_logs write notice:', err.message);
        });
      }
    } catch (e) {
      console.warn('Firestore user_activity_logs notice:', e);
    }

    // 2. Direct write to Firestore `registered_users`
    try {
      if (db && (resolved.email || resolved.uid)) {
        const userDocId = (resolved.email || resolved.uid).toLowerCase().replace(/[^a-z0-9_@.-]/g, '_');
        const userDocRef = doc(db, 'registered_users', userDocId);
        
        const userData: Partial<GlobalRegisteredUser> = {
          id: resolved.uid,
          name: resolved.displayName,
          displayName: resolved.displayName,
          email: resolved.email,
          photoURL: params.user?.photoURL || params.user?.avatarUrl || '',
          district: resolved.district,
          province: params.user?.province || 'बागमती प्रदेश',
          targetExam: resolved.targetExam,
          lastActive: timestamp,
          lastPageVisited: page,
          device,
          browser,
          isYouTubeSubscribed: isSubscribed,
          isPro: Boolean(params.user?.isPro || params.user?.isProUser),
          entryStatus: params.user?.entryStatus || (params.user?.isPro ? 'प्रो सक्रिय' : (resolved.email.includes('@gmail.com') ? 'Google प्रमाणीकृत' : 'सक्रिय'))
        };

        if (params.activityType === 'login') {
          userData.lastLoginAt = timestamp;
        }

        setDoc(userDocRef, userData, { merge: true }).catch(() => {});
      }
    } catch (e) {
      console.warn('Firestore registered_users write notice:', e);
    }

    // 3. Direct write to Realtime Database
    try {
      if (rtdb) {
        const rtdbLogRef = push(ref(rtdb, 'user_activity_logs'));
        set(rtdbLogRef, logRecord).catch(() => {});
        if (resolved.uid) {
          set(ref(rtdb, `registered_users/${resolved.uid}`), {
            id: resolved.uid,
            displayName: resolved.displayName,
            email: resolved.email,
            device,
            browser,
            lastActive: timestamp,
            lastPageVisited: page,
            isYouTubeSubscribed: isSubscribed
          }).catch(() => {});
        }
      }
    } catch {}

    // 4. Dual write to backend server `/api/user-tracking/log`
    try {
      fetch('/api/user-tracking/log', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...logRecord,
          district: resolved.district,
          targetExam: resolved.targetExam,
          totalXp: params.user?.xp || 150,
          isPro: params.user?.isPro
        })
      }).catch(() => {});
    } catch {}

    return logRecord;
  }

  /**
   * Log User Login event
   */
  static async logUserLogin(user?: Partial<UserProfile> | null, page: string = 'गृहपृष्ठ'): Promise<void> {
    const resolved = this.resolveUserDetails(user);
    const { device, browser } = getClientDeviceInfo();
    const action = 'लगइन सफल';
    const details = `विद्यार्थी लगइन: ${resolved.displayName} (${resolved.email || 'अतिथि'}) • ${device} / ${browser}`;

    await this.logUserActivity({
      user,
      activityType: 'login',
      action,
      details,
      page,
      metadata: { loginTime: new Date().toISOString(), device, browser }
    });

    // Also sync user registration details
    this.syncRegisteredUser(user, true).catch(() => {});
  }

  /**
   * Log Page Navigation / Visit
   */
  static async logPageVisit(user?: Partial<UserProfile> | null, pageName: string = 'गृहपृष्ठ'): Promise<void> {
    const resolved = this.resolveUserDetails(user);
    const { device, browser } = getClientDeviceInfo();

    await this.logUserActivity({
      user,
      activityType: 'page_view',
      action: `पृष्ठ भ्रमण: ${pageName}`,
      details: `${resolved.displayName} ले '${pageName}' पृष्ठ भ्रमण गर्नुभयो (${device})`,
      page: pageName,
      metadata: { pageName, device, browser }
    });
  }

  /**
   * Log Quiz Attempt & Completion
   */
  static async logQuizAttempt(user: Partial<UserProfile> | null | undefined, params: {
    quizId: string;
    quizTitle: string;
    score?: number;
    totalQuestions: number;
    accuracy?: number;
    completed?: boolean;
    timeTakenSeconds?: number;
  }): Promise<void> {
    const resolved = this.resolveUserDetails(user);
    const isCompleted = params.completed ?? true;
    const type = isCompleted ? 'quiz_complete' : 'quiz_start';
    const scoreStr = typeof params.score === 'number' ? ` (${params.score}/${params.totalQuestions}, ${params.accuracy || 0}%)` : '';
    const action = isCompleted ? `परीक्षा सम्पन्न: ${params.quizTitle}` : `परीक्षा सुरु: ${params.quizTitle}`;
    const details = `${resolved.displayName} ले '${params.quizTitle}' ${isCompleted ? `सम्पन्न गर्नुभयो${scoreStr}` : 'सुरु गर्नुभयो'}`;

    await this.logUserActivity({
      user,
      activityType: type,
      action,
      details,
      page: '५० सेटहरू (अभ्यास परीक्षा)',
      testsTakenIncrement: isCompleted,
      metadata: {
        quizId: params.quizId,
        quizTitle: params.quizTitle,
        score: params.score,
        totalQuestions: params.totalQuestions,
        accuracy: params.accuracy,
        timeTakenSeconds: params.timeTakenSeconds
      }
    });
  }

  /**
   * Log YouTube Subscription & Unlock click
   */
  static async logYouTubeSubscribe(user?: Partial<UserProfile> | null): Promise<void> {
    const resolved = this.resolveUserDetails(user);
    const { device, browser } = getClientDeviceInfo();

    await this.logUserActivity({
      user,
      activityType: 'youtube_subscribe',
      action: 'युट्युब च्यानल सदस्यता अनलक',
      details: `${resolved.displayName} ले आधिकारिक युट्युब च्यानल Subscribe गरि १०,०००+ PDF अनलक गर्नुभयो (${device} • ${browser})`,
      page: 'युट्युब गेटवे अनलक',
      isYouTubeSubscribed: true,
      metadata: {
        channel: '@bankingtayarinepal',
        unlockedPdfCount: '10,000+',
        timestamp: new Date().toISOString()
      }
    });
  }

  /**
   * Upsert registered user row in database
   */
  static async syncRegisteredUser(user?: Partial<UserProfile> | null, isLoginEvent: boolean = false): Promise<void> {
    if (!user) return;
    const resolved = this.resolveUserDetails(user);
    const { device, browser } = getClientDeviceInfo();
    const timestamp = new Date().toISOString();

    const payload = {
      id: resolved.uid,
      name: resolved.displayName,
      displayName: resolved.displayName,
      email: resolved.email,
      photoURL: user.photoURL || user.avatarUrl || '',
      district: resolved.district,
      province: user.province || 'बागमती प्रदेश',
      targetExam: resolved.targetExam,
      device,
      browser,
      isYouTubeSubscribed: Boolean(user.isYouTubeSubscribed),
      isPro: Boolean(user.isPro || user.isProUser),
      totalXp: user.xp || 150,
      testsTaken: user.quizzesCompleted || 0,
      pagesVisited: Array.isArray(user.pagesVisited) ? user.pagesVisited : ['गृहपृष्ठ', '५० सेटहरू'],
      lastActive: timestamp,
      isLoginEvent
    };

    // Firestore
    try {
      if (db && (resolved.email || resolved.uid)) {
        const userDocId = (resolved.email || resolved.uid).toLowerCase().replace(/[^a-z0-9_@.-]/g, '_');
        await setDoc(doc(db, 'registered_users', userDocId), payload, { merge: true });
      }
    } catch {}

    // Server
    try {
      await fetch('/api/user-tracking/sync-user', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
    } catch {}
  }

  /**
   * Query complete step-by-step activity timeline for any specific user
   */
  static async getUserActivityTimeline(userId?: string, email?: string): Promise<GlobalUserActivityLog[]> {
    const idMap = new Map<string, GlobalUserActivityLog>();
    const cleanEmail = email?.trim().toLowerCase();

    // 1. Try Firestore direct query
    try {
      if (db) {
        const logsRef = collection(db, 'user_activity_logs');
        let q = query(logsRef, orderBy('timestamp', 'desc'), limit(100));
        if (cleanEmail) {
          q = query(logsRef, where('userEmail', '==', cleanEmail), orderBy('timestamp', 'desc'), limit(100));
        } else if (userId) {
          q = query(logsRef, where('userId', '==', userId), orderBy('timestamp', 'desc'), limit(100));
        }
        const snap = await getDocs(q);
        snap.forEach(d => {
          const data = d.data() as GlobalUserActivityLog;
          idMap.set(d.id, { id: d.id, ...data });
        });
      }
    } catch (fsErr) {
      // Fallback query without compound index
      try {
        if (db) {
          const q2 = query(collection(db, 'user_activity_logs'), orderBy('timestamp', 'desc'), limit(200));
          const snap2 = await getDocs(q2);
          snap2.forEach(d => {
            const data = d.data() as GlobalUserActivityLog;
            const match = (cleanEmail && data.userEmail && data.userEmail.toLowerCase() === cleanEmail) ||
                          (userId && data.userId === userId);
            if (match) {
              idMap.set(d.id, { id: d.id, ...data });
            }
          });
        }
      } catch {}
    }

    // 2. Query backend server database /api/user-tracking/logs
    try {
      const params = new URLSearchParams();
      if (cleanEmail) params.set('email', cleanEmail);
      else if (userId) params.set('userId', userId);
      params.set('limit', '200');

      const res = await fetch(`/api/user-tracking/logs?${params.toString()}`);
      if (res.ok) {
        const data = await res.json();
        if (data && Array.isArray(data.logs)) {
          for (const l of data.logs) {
            if (!idMap.has(l.id)) {
              idMap.set(l.id, l);
            }
          }
        }
      }
    } catch {}

    return Array.from(idMap.values()).sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
  }

  /**
   * Log authenticated user resource / PDF download event
   */
  static async logDownload(params: {
    user?: Partial<UserProfile> | null;
    resourceName?: string;
    fileType?: string;
    details?: string;
    fileId?: string;
    fileName?: string;
    resourceCategory?: string;
    fileSize?: string;
  }): Promise<DownloadEventRecord | null> {
    const resolved = this.resolveUserDetails(params.user);
    if (!resolved.isValid) {
      return null;
    }

    const name = params.resourceName || params.fileName || 'Study Material';
    const type = params.fileType || 'PDF';

    const record: DownloadEventRecord = {
      id: `dl-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
      userId: resolved.uid,
      userName: resolved.displayName,
      userEmail: resolved.email,
      resourceName: name,
      fileType: type,
      fileName: params.fileName || name,
      fileId: params.fileId,
      resourceCategory: params.resourceCategory,
      fileSize: params.fileSize,
      details: params.details || `डाउनलोड: ${name}`,
      timestamp: new Date().toISOString()
    };

    // 1. Cache locally
    try {
      const cached = this.getLocalDownloads();
      cached.unshift(record);
      localStorage.setItem(STORAGE_KEYS.DOWNLOAD_EVENTS, JSON.stringify(cached.slice(0, 200)));
    } catch (e) {
      console.warn('Local download cache warning:', e);
    }

    // 2. Realtime Database logging
    try {
      if (rtdb) {
        const dlRef = push(ref(rtdb, 'download_events'));
        set(dlRef, record).catch(() => {});
      }
    } catch (rtdbErr) {
      console.warn('Realtime Database download log warning:', rtdbErr);
    }

    // 3. Persist to Firestore collection `download_events`
    try {
      if (db) {
        await addDoc(collection(db, 'download_events'), record);
      }
    } catch (fsErr) {
      console.warn('Firestore download log warning:', fsErr);
    }

    // 4. Also log as general activity
    this.logActivity({
      user: params.user as UserProfile,
      activityType: 'download',
      details: `डाउनलोड: ${name} (${type})`,
      targetId: params.fileId,
      targetTitle: name,
      metadata: { resourceName: name, fileType: type, category: params.resourceCategory }
    }).catch(() => {});

    // 5. Dual sync to backend API
    try {
      fetch('/api/tracking/download', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(record),
      }).catch(() => {});
    } catch {}

    return record;
  }

  /**
   * Log authenticated user exam score directly to Realtime Database and Firestore
   */
  static async logExamScore(params: {
    user?: Partial<UserProfile> | null;
    quizId: string;
    quizTitle: string;
    category: string;
    mode?: string;
    score?: number;
    totalQuestions: number;
    correctAnswers?: number;
    incorrectAnswers?: number;
    negativeDeduction?: number;
    accuracy: number;
    timeElapsedSeconds?: number;
    attempted?: number;
    correct?: number;
    incorrect?: number;
    skipped?: number;
    netScore?: number;
    timeTakenSeconds?: number;
  }): Promise<ExamScoreRecord | null> {
    const resolved = this.resolveUserDetails(params.user);
    if (!resolved.isValid) {
      return null;
    }

    const netScore = params.score ?? params.netScore ?? 0;
    const correct = params.correctAnswers ?? params.correct ?? 0;
    const incorrect = params.incorrectAnswers ?? params.incorrect ?? 0;
    const timeSpent = params.timeElapsedSeconds ?? params.timeTakenSeconds ?? 0;

    const record: ExamScoreRecord = {
      id: `score-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
      userId: resolved.uid,
      userName: resolved.displayName,
      userEmail: resolved.email,
      quizId: params.quizId,
      quizTitle: params.quizTitle,
      category: params.category,
      mode: params.mode || 'practice',
      score: netScore,
      totalQuestions: params.totalQuestions,
      correctAnswers: correct,
      incorrectAnswers: incorrect,
      negativeDeduction: params.negativeDeduction || 0,
      accuracy: params.accuracy,
      timeElapsedSeconds: timeSpent,
      timestamp: new Date().toISOString()
    };

    // 1. Cache locally
    try {
      const cached = this.getLocalExamScores(false);
      cached.unshift(record);
      localStorage.setItem(STORAGE_KEYS.EXAM_SCORES, JSON.stringify(cached.slice(0, 200)));
    } catch (e) {
      console.warn('Local exam score cache warning:', e);
    }

    // 2. Persist to Firebase Realtime Database (rtdb)
    try {
      if (rtdb) {
        const scoreRef = push(ref(rtdb, 'exam_scores'));
        set(scoreRef, record).catch(() => {});
        if (resolved.uid && resolved.uid !== 'anonymous_student') {
          set(ref(rtdb, `users/${resolved.uid}/latestExamScore`), record).catch(() => {});
        }
      }
    } catch (rtdbErr) {
      console.warn('Realtime Database exam score log warning:', rtdbErr);
    }

    // 3. Persist to Firestore collection `exam_scores`
    try {
      if (db) {
        await addDoc(collection(db, 'exam_scores'), record);
      }
    } catch (fsErr) {
      console.warn('Firestore exam score log warning:', fsErr);
    }

    // 4. Dual sync to backend API
    try {
      fetch('/api/tracking/exam-score', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(record),
      }).catch(() => {});
    } catch {}

    // 5. Synchronize with exam_submissions collection as well
    this.recordExamSubmission({
      user: params.user as UserProfile,
      quizId: params.quizId,
      quizTitle: params.quizTitle,
      category: params.category,
      score: netScore,
      totalQuestions: params.totalQuestions,
      attemptedCount: params.attempted ?? (correct + incorrect),
      correctAnswers: correct,
      incorrectAnswers: incorrect,
      skippedCount: params.skipped ?? Math.max(0, params.totalQuestions - (correct + incorrect)),
      negativeDeduction: params.negativeDeduction ?? 0,
      accuracy: params.accuracy,
      timeTakenSeconds: timeSpent
    }).catch(() => {});

    return record;
  }

  /**
   * Record complete student exam submission to Realtime Database & Firestore `exam_submissions` collection in real-time
   */
  static async recordExamSubmission(params: {
    user?: Partial<UserProfile> | null;
    quizId: string;
    quizTitle: string;
    category?: string;
    score: number;
    totalQuestions: number;
    accuracy: number;
    timeTakenSeconds: number;
    attemptedCount?: number;
    correctAnswers?: number;
    incorrectAnswers?: number;
    skippedCount?: number;
    negativeDeduction?: number;
  }): Promise<ExamSubmissionRecord | null> {
    const resolved = this.resolveUserDetails(params.user);
    if (!resolved.isValid) {
      return null;
    }

    const submission: ExamSubmissionRecord = {
      id: `sub-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
      userId: resolved.uid,
      userName: resolved.displayName,
      userEmail: resolved.email,
      quizId: params.quizId,
      quizTitle: params.quizTitle,
      category: params.category || 'General Banking',
      score: Math.round(params.score * 100) / 100,
      totalQuestions: params.totalQuestions,
      attemptedCount: params.attemptedCount ?? ((params.correctAnswers ?? 0) + (params.incorrectAnswers ?? 0)),
      correctAnswers: params.correctAnswers ?? 0,
      incorrectAnswers: params.incorrectAnswers ?? 0,
      skippedCount: params.skippedCount ?? Math.max(0, params.totalQuestions - ((params.correctAnswers ?? 0) + (params.incorrectAnswers ?? 0))),
      negativeDeduction: params.negativeDeduction ?? 0,
      accuracy: Math.round(params.accuracy * 10) / 10,
      timeTakenSeconds: params.timeTakenSeconds,
      timestamp: new Date().toISOString(),
      submittedAt: new Date().toISOString()
    };

    // 1. Cache locally for instant offline availability
    try {
      const cached = this.getLocalExamSubmissions(false);
      cached.unshift(submission);
      localStorage.setItem(STORAGE_KEYS.EXAM_SUBMISSIONS, JSON.stringify(cached.slice(0, 200)));
    } catch (e) {
      console.warn('Local exam submission cache notice:', e);
    }

    // 2. Real-time logging to Firebase Realtime Database
    try {
      if (rtdb) {
        // Global path readable by Admin CMS
        const globalRef = ref(rtdb, `global_exam_results/${submission.id}`);
        set(globalRef, submission).catch((err) => console.warn('RTDB global_exam_results write notice:', err));

        // Submissions path
        const subRef = ref(rtdb, `exam_submissions/${submission.id}`);
        set(subRef, submission).catch(() => {});

        // User-specific path
        if (resolved.uid) {
          set(ref(rtdb, `users/${resolved.uid}/exam_results/${submission.id}`), submission).catch(() => {});
          set(ref(rtdb, `users/${resolved.uid}/latestSubmission`), submission).catch(() => {});
        }
      }
    } catch (rtdbErr) {
      console.warn('Realtime Database exam submission log warning:', rtdbErr);
    }

    // 3. Real-time logging to Firestore `global_exam_results` and `exam_submissions` collections
    try {
      if (db) {
        addDoc(collection(db, 'global_exam_results'), submission).catch(() => {});
        addDoc(collection(db, 'exam_submissions'), submission).catch(() => {});
        if (resolved.uid) {
          addDoc(collection(db, `users/${resolved.uid}/exam_results`), submission).catch(() => {});
        }
      }
    } catch (fsErr) {
      console.warn('Firestore exam_submissions recording warning:', fsErr);
    }

    // 4. Dual sync to backend API endpoints
    try {
      fetch('/api/tracking/exam-submission', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(submission),
      }).catch(() => {});
      fetch('/api/tracking/global-exam-result', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(submission),
      }).catch(() => {});
    } catch {}

    return submission;
  }

  // ==========================================
  // GETTERS FOR ADMIN VIEWING WITH ADMIN FILTERING
  // ==========================================

  static getLocalActivities(filterAdmins: boolean = false): UserActivityRecord[] {
    try {
      const raw = localStorage.getItem(STORAGE_KEYS.USER_ACTIVITIES);
      if (raw) {
        const list: UserActivityRecord[] = JSON.parse(raw);
        return filterAdmins ? list.filter(a => !isExcludedAdminActivity(a.userEmail)) : list;
      }
    } catch {}
    return [];
  }

  static getLocalDownloads(): DownloadEventRecord[] {
    try {
      const raw = localStorage.getItem(STORAGE_KEYS.DOWNLOAD_EVENTS);
      if (raw) return JSON.parse(raw);
    } catch {}
    return [];
  }

  static getLocalExamScores(filterAdmins: boolean = false): ExamScoreRecord[] {
    try {
      const raw = localStorage.getItem(STORAGE_KEYS.EXAM_SCORES);
      if (raw) {
        const list: ExamScoreRecord[] = JSON.parse(raw);
        return filterAdmins ? list.filter(s => !isExcludedAdminActivity(s.userEmail)) : list;
      }
    } catch {}
    return [];
  }

  static getLocalExamSubmissions(filterAdmins: boolean = false): ExamSubmissionRecord[] {
    try {
      const raw = localStorage.getItem(STORAGE_KEYS.EXAM_SUBMISSIONS);
      if (raw) {
        const list: ExamSubmissionRecord[] = JSON.parse(raw);
        return filterAdmins ? list.filter(s => !isExcludedAdminActivity(s.userEmail)) : list;
      }
    } catch {}
    return [];
  }

  /**
   * Fetch all activities with Firestore real-time priority + local fallback
   */
  static async getRecentActivities(limitCount: number = 100, filterAdmins: boolean = false): Promise<UserActivityRecord[]> {
    let result: UserActivityRecord[] = [];
    try {
      if (db) {
        const q = query(collection(db, 'user_activities'), orderBy('timestamp', 'desc'), limit(limitCount * 2));
        const snapshot = await getDocs(q);
        if (!snapshot.empty) {
          const list: UserActivityRecord[] = [];
          snapshot.forEach(doc => {
            list.push({ id: doc.id, ...(doc.data() as any) });
          });
          result = list;
        }
      }
    } catch (e) {
      console.warn('Firestore fetch activities fallback to local:', e);
    }

    if (result.length === 0) {
      // Try backend API
      try {
        const res = await fetch('/api/tracking/activities');
        if (res.ok) {
          const data = await res.json();
          if (data && data.activities && data.activities.length > 0) {
            result = data.activities;
          }
        }
      } catch {}
    }

    if (result.length === 0) {
      result = this.getLocalActivities(false);
    }

    if (filterAdmins) {
      result = result.filter(a => !isExcludedAdminActivity(a.userEmail));
    }

    return result.slice(0, limitCount);
  }

  /**
   * Fetch all download events with Firestore priority + local fallback
   */
  static async getRecentDownloads(limitCount: number = 100): Promise<DownloadEventRecord[]> {
    try {
      if (db) {
        const q = query(collection(db, 'download_events'), orderBy('timestamp', 'desc'), limit(limitCount));
        const snapshot = await getDocs(q);
        if (!snapshot.empty) {
          const list: DownloadEventRecord[] = [];
          snapshot.forEach(doc => {
            list.push({ id: doc.id, ...(doc.data() as any) });
          });
          return list;
        }
      }
    } catch (e) {
      console.warn('Firestore fetch downloads fallback to local:', e);
    }

    // Try backend API
    try {
      const res = await fetch('/api/tracking/downloads');
      if (res.ok) {
        const data = await res.json();
        if (data && data.downloads && data.downloads.length > 0) {
          return data.downloads;
        }
      }
    } catch {}

    return this.getLocalDownloads();
  }

  /**
   * Fetch all exam scores with Firestore priority + local fallback
   */
  static async getRecentExamScores(limitCount: number = 100, filterAdmins: boolean = false): Promise<ExamScoreRecord[]> {
    let result: ExamScoreRecord[] = [];
    try {
      if (db) {
        const q = query(collection(db, 'exam_scores'), orderBy('timestamp', 'desc'), limit(limitCount * 2));
        const snapshot = await getDocs(q);
        if (!snapshot.empty) {
          const list: ExamScoreRecord[] = [];
          snapshot.forEach(doc => {
            list.push({ id: doc.id, ...(doc.data() as any) });
          });
          result = list;
        }
      }
    } catch (e) {
      console.warn('Firestore fetch exam scores fallback to local:', e);
    }

    if (result.length === 0) {
      // Try backend API
      try {
        const res = await fetch('/api/tracking/exam-scores');
        if (res.ok) {
          const data = await res.json();
          if (data && data.scores && data.scores.length > 0) {
            result = data.scores;
          }
        }
      } catch {}
    }

    if (result.length === 0) {
      result = this.getLocalExamScores(false);
    }

    if (filterAdmins) {
      result = result.filter(s => !isExcludedAdminActivity(s.userEmail));
    }

    return result.slice(0, limitCount);
  }

  /**
   * Fetch all exam submissions with Firestore priority + local fallback
   */
  static async getRecentExamSubmissions(limitCount: number = 100, filterAdmins: boolean = false): Promise<ExamSubmissionRecord[]> {
    let result: ExamSubmissionRecord[] = [];
    try {
      if (db) {
        const q = query(collection(db, 'exam_submissions'), orderBy('timestamp', 'desc'), limit(limitCount * 2));
        const snapshot = await getDocs(q);
        if (!snapshot.empty) {
          const list: ExamSubmissionRecord[] = [];
          snapshot.forEach(doc => {
            list.push({ id: doc.id, ...(doc.data() as any) });
          });
          result = list;
        }
      }
    } catch (e) {
      console.warn('Firestore fetch exam submissions fallback to local:', e);
    }

    if (result.length === 0) {
      // Try backend API
      try {
        const res = await fetch('/api/tracking/exam-submissions');
        if (res.ok) {
          const data = await res.json();
          if (data && data.submissions && data.submissions.length > 0) {
            result = data.submissions;
          }
        }
      } catch {}
    }

    if (result.length === 0) {
      result = this.getLocalExamSubmissions(false);
    }

    if (filterAdmins) {
      result = result.filter(s => !isExcludedAdminActivity(s.userEmail));
    }

    return result.slice(0, limitCount);
  }
}
