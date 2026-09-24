import { 
  collection, 
  onSnapshot, 
  query, 
  orderBy, 
  limit,
  getDocs,
  Timestamp 
} from 'firebase/firestore';
import { ref, onValue } from 'firebase/database';
import { db, rtdb } from '../firebase';
import { AdminAnalyticsRecord } from '../types';

export interface AdminRegisteredUser {
  id: string;
  authUid: string;
  displayName: string;
  email: string;
  registrationDate: string;
  lastActive: string;
  totalXp: number;
  quizzesCompleted: number;
  questionsSolved: number;
  targetExam: string;
  district?: string;
  province?: string;
  photoURL?: string;
  isPro?: boolean;
  entryStatus?: string;
  pagesVisited?: string[];
  lastPageVisited?: string;
  isYouTubeSubscribed?: boolean;
  totalLogins?: number;
  testsTaken?: number;
  device?: string;
  browser?: string;
}

export interface AdminExamRecord {
  id: string;
  userId?: string;
  studentName: string;
  studentEmail: string;
  quizTitle: string;
  quizId: string;
  totalQuestions: number;
  attemptedCount: number;
  correctAnswers: number;
  incorrectAnswers: number;
  skippedCount?: number;
  negativeDeduction?: number;
  score: number; // Marks obtained
  netScore?: number;
  percentage: number; // Accuracy %
  accuracy?: number;
  timeTakenSeconds: number; // Completion time in seconds
  timeElapsedSeconds?: number;
  timestamp: string; // Date & Time
  category: string;
  district?: string;
  targetExam?: string;
  isGuest?: boolean;
  entryStatus?: string;
  loginTime?: string;
  pagesVisited?: string[];
}

export interface AdminNotesActivityRecord {
  id: string;
  studentName: string;
  studentEmail: string;
  noteTitle: string;
  details: string;
  timestamp: string;
  accumulatedXp: number;
  activityType: string;
}

export interface AdminSummaryMetrics {
  totalActiveStudents: number;
  totalExamsCompleted: number;
  averageScorePercent: number;
  totalNotesRead: number;
  averageCompletionTimeSeconds: number;
  topPerformingStudent?: string;
}

export class AdminAnalyticsService {
  /**
   * Helper to format timestamps gracefully
   */
  private static parseDate(raw: any): string {
    if (!raw) return new Date().toISOString();
    if (raw instanceof Timestamp) {
      return raw.toDate().toISOString();
    }
    if (typeof raw === 'object' && raw.seconds) {
      return new Date(raw.seconds * 1000).toISOString();
    }
    if (typeof raw === 'string') {
      return raw;
    }
    return new Date().toISOString();
  }

  /**
   * Real-time listener for registered and logged-in users directly from central DB:
   * Firebase Firestore `registered_users`, Firestore `users`, Realtime Database `users`,
   * and backend server table `/api/user-tracking/users`.
   * Strictly queries central database - zero local storage fallbacks.
   */
  static subscribeToRegisteredUsers(
    onUpdate: (users: AdminRegisteredUser[]) => void
  ): () => void {
    let isUnsubscribed = false;
    let rtdbUsers: AdminRegisteredUser[] = [];
    let firestoreUsers: AdminRegisteredUser[] = [];
    let firestoreRegUsers: AdminRegisteredUser[] = [];
    let serverUsers: AdminRegisteredUser[] = [];

    const emitMerged = () => {
      if (isUnsubscribed) return;
      const userMap = new Map<string, AdminRegisteredUser>();

      // 1. Central Server DB Users
      for (const u of serverUsers) {
        const key = (u.email ? u.email.toLowerCase() : u.id) || u.authUid;
        if (key) {
          const prev = userMap.get(key);
          userMap.set(key, { ...prev, ...u });
        }
      }
      // 2. Firestore registered_users (Central DB)
      for (const u of firestoreRegUsers) {
        const key = (u.email ? u.email.toLowerCase() : u.id) || u.authUid;
        if (key) {
          const prev = userMap.get(key);
          userMap.set(key, { ...prev, ...u });
        }
      }
      // 3. Firestore users collection (Central DB)
      for (const u of firestoreUsers) {
        const key = (u.email ? u.email.toLowerCase() : u.id) || u.authUid;
        if (key) {
          const prev = userMap.get(key);
          userMap.set(key, { ...prev, ...u });
        }
      }
      // 4. RTDB Users (Central DB)
      for (const u of rtdbUsers) {
        const key = (u.email ? u.email.toLowerCase() : u.id) || u.authUid;
        if (key) {
          const prev = userMap.get(key);
          userMap.set(key, { ...prev, ...u });
        }
      }

      const merged = Array.from(userMap.values()).sort((a, b) => {
        return new Date(b.lastActive).getTime() - new Date(a.lastActive).getTime();
      });

      onUpdate(merged);
    };

    // Fetch from Central Backend Server Table `/api/user-tracking/users`
    const fetchServerUsers = async () => {
      try {
        const res = await fetch('/api/user-tracking/users');
        if (res.ok) {
          const data = await res.json();
          if (data && Array.isArray(data.users)) {
            serverUsers = data.users.map((u: any) => ({
              id: u.id,
              authUid: u.id,
              displayName: u.displayName || u.name || (u.email ? u.email.split('@')[0] : 'विद्यार्थी'),
              email: u.email || '',
              registrationDate: this.parseDate(u.registeredAt || u.lastLoginAt),
              lastActive: this.parseDate(u.lastActive || u.lastLoginAt),
              totalXp: typeof u.totalXp === 'number' ? u.totalXp : 200,
              quizzesCompleted: typeof u.testsTaken === 'number' ? u.testsTaken : 0,
              questionsSolved: (u.testsTaken || 0) * 10,
              targetExam: u.targetExam || 'नेपाल राष्ट्र बैंक - सहायक ४',
              district: u.district || 'काठमाडौँ',
              province: u.province || 'बागमती प्रदेश',
              photoURL: u.photoURL || '',
              isPro: Boolean(u.isPro),
              entryStatus: u.entryStatus || (u.isPro ? 'प्रो सक्रिय' : (u.email?.includes('@gmail.com') ? 'Google प्रमाणीकृत' : 'सक्रिय')),
              pagesVisited: Array.isArray(u.pagesVisited) && u.pagesVisited.length ? u.pagesVisited : ['गृहपृष्ठ', '५० सेटहरू'],
              lastPageVisited: u.lastPageVisited || 'गृहपृष्ठ',
              isYouTubeSubscribed: Boolean(u.isYouTubeSubscribed),
              totalLogins: u.totalLogins || 1,
              testsTaken: u.testsTaken || 0,
              device: u.device || 'Desktop',
              browser: u.browser || 'Unknown'
            }));
            emitMerged();
          }
        }
      } catch (err) {
        console.warn('Could not fetch server registered_users:', err);
      }
    };
    fetchServerUsers();

    // 1. Subscribe to Firebase Realtime Database `users/` node
    let rtdbUnsub: (() => void) | null = null;
    try {
      if (rtdb) {
        const usersRef = ref(rtdb, 'users');
        rtdbUnsub = onValue(usersRef, (snapshot) => {
          if (isUnsubscribed) return;
          const data = snapshot.val();
          const list: AdminRegisteredUser[] = [];
          if (data && typeof data === 'object') {
            Object.entries(data).forEach(([key, val]: [string, any]) => {
              if (!val || typeof val !== 'object') return;
              list.push({
                id: key,
                authUid: val.authUid || key,
                displayName: val.displayName || val.name || (val.email ? val.email.split('@')[0] : 'विद्यार्थी'),
                email: val.email || '',
                registrationDate: this.parseDate(val.createdAt || val.registeredAt),
                lastActive: this.parseDate(val.lastLoginAt || val.updatedAt || val.lastActiveDate || val.createdAt),
                totalXp: typeof val.xp === 'number' ? val.xp : 200,
                quizzesCompleted: typeof val.quizzesAttempted === 'number' ? val.quizzesAttempted : (typeof val.quizzesCompleted === 'number' ? val.quizzesCompleted : 0),
                questionsSolved: typeof val.questionsSolved === 'number' ? val.questionsSolved : 0,
                targetExam: val.targetExam || 'नेपाल राष्ट्र बैंक - सहायक ४',
                district: val.district || 'काठमाडौँ',
                province: val.province || 'बागमती प्रदेश',
                photoURL: val.photoURL || val.avatarUrl || '',
                isPro: Boolean(val.isPro || val.role === 'pro' || val.isProUser),
                entryStatus: val.entryStatus || (val.isPro ? 'प्रो सक्रिय' : (val.email?.includes('@gmail.com') ? 'Google प्रमाणीकृत' : 'सक्रिय')),
                pagesVisited: Array.isArray(val.pagesVisited) && val.pagesVisited.length ? val.pagesVisited : ['गृहपृष्ठ', '५० सेटहरू'],
                lastPageVisited: val.lastPageVisited || 'सङ्गठित संस्था ५० सेटहरू',
                isYouTubeSubscribed: val.isYouTubeSubscribed,
                totalLogins: val.totalLogins || 1,
                testsTaken: val.testsTaken || 0,
                device: val.device || 'Desktop',
                browser: val.browser || 'Browser'
              });
            });
          }
          rtdbUsers = list;
          emitMerged();
        }, (err) => {
          console.warn('RTDB users listener notice:', err);
        });
      }
    } catch (rtdbErr) {
      console.warn('Could not attach RTDB users listener:', rtdbErr);
    }

    // 2. Subscribe to Firestore `registered_users` collection (Explicit table requested)
    let fsRegUnsub: (() => void) | null = null;
    try {
      const regCol = collection(db, 'registered_users');
      fsRegUnsub = onSnapshot(
        regCol,
        (snapshot) => {
          if (isUnsubscribed) return;
          const list: AdminRegisteredUser[] = [];
          snapshot.forEach((docSnap) => {
            const data = docSnap.data();
            const id = docSnap.id;
            list.push({
              id,
              authUid: data.id || id,
              displayName: data.displayName || data.name || (data.email ? data.email.split('@')[0] : 'विद्यार्थी'),
              email: data.email || '',
              registrationDate: this.parseDate(data.registeredAt || data.createdAt),
              lastActive: this.parseDate(data.lastActive || data.lastLoginAt),
              totalXp: typeof data.totalXp === 'number' ? data.totalXp : 200,
              quizzesCompleted: typeof data.testsTaken === 'number' ? data.testsTaken : (data.quizzesCompleted || 0),
              questionsSolved: typeof data.questionsSolved === 'number' ? data.questionsSolved : 0,
              targetExam: data.targetExam || 'नेपाल राष्ट्र बैंक - सहायक ४',
              district: data.district || 'काठमाडौँ',
              province: data.province || 'बागमती प्रदेश',
              photoURL: data.photoURL || '',
              isPro: Boolean(data.isPro),
              entryStatus: data.entryStatus || (data.isPro ? 'प्रो सक्रिय' : (data.email?.includes('@gmail.com') ? 'Google प्रमाणीकृत' : 'सक्रिय')),
              pagesVisited: Array.isArray(data.pagesVisited) && data.pagesVisited.length ? data.pagesVisited : ['गृहपृष्ठ', '५० सेटहरू'],
              lastPageVisited: data.lastPageVisited || 'गृहपृष्ठ',
              isYouTubeSubscribed: Boolean(data.isYouTubeSubscribed),
              totalLogins: data.totalLogins || 1,
              testsTaken: data.testsTaken || 0,
              device: data.device || 'Desktop',
              browser: data.browser || 'Unknown'
            });
          });
          firestoreRegUsers = list;
          emitMerged();
        },
        (error) => {
          console.warn('Firestore registered_users subscription notice:', error.message);
        }
      );
    } catch (err) {
      console.warn('Could not attach Firestore registered_users snapshot:', err);
    }

    // 3. Subscribe to Firestore `users` collection
    let fsUnsub: (() => void) | null = null;
    try {
      const usersCol = collection(db, 'users');
      fsUnsub = onSnapshot(
        usersCol,
        (snapshot) => {
          if (isUnsubscribed) return;
          const list: AdminRegisteredUser[] = [];
          snapshot.forEach((docSnap) => {
            const data = docSnap.data();
            const id = docSnap.id;
            list.push({
              id,
              authUid: data.authUid || id,
              displayName: data.displayName || data.name || (data.email ? data.email.split('@')[0] : 'विद्यार्थी'),
              email: data.email || '',
              registrationDate: this.parseDate(data.createdAt || data.registeredAt),
              lastActive: this.parseDate(data.lastLoginAt || data.updatedAt || data.lastActiveDate || data.createdAt),
              totalXp: typeof data.xp === 'number' ? data.xp : 200,
              quizzesCompleted: typeof data.quizzesAttempted === 'number' ? data.quizzesAttempted : (typeof data.quizzesCompleted === 'number' ? data.quizzesCompleted : 0),
              questionsSolved: typeof data.questionsSolved === 'number' ? data.questionsSolved : 0,
              targetExam: data.targetExam || 'नेपाल राष्ट्र बैंक - सहायक ४',
              district: data.district || 'काठमाडौँ',
              province: data.province || 'बागमती प्रदेश',
              photoURL: data.photoURL || data.avatarUrl || '',
              isPro: Boolean(data.isPro || data.role === 'pro' || data.isProUser),
              entryStatus: data.entryStatus || (data.isPro ? 'प्रो सक्रिय' : (data.email?.includes('@gmail.com') ? 'Google प्रमाणीकृत' : 'सक्रिय')),
              pagesVisited: Array.isArray(data.pagesVisited) && data.pagesVisited.length ? data.pagesVisited : ['गृहपृष्ठ', '५० सेटहरू'],
              lastPageVisited: data.lastPageVisited || 'सङ्गठित संस्था ५० सेटहरू',
              isYouTubeSubscribed: data.isYouTubeSubscribed,
              totalLogins: data.totalLogins || 1,
              testsTaken: data.testsTaken || 0,
              device: data.device || 'Desktop',
              browser: data.browser || 'Browser'
            });
          });
          firestoreUsers = list;
          emitMerged();
        },
        (error) => {
          console.warn('Firestore users subscription notice:', error.message);
        }
      );
    } catch (err) {
      console.warn('Could not attach Firestore users snapshot:', err);
    }

    return () => {
      isUnsubscribed = true;
      if (typeof rtdbUnsub === 'function') rtdbUnsub();
      if (typeof fsRegUnsub === 'function') fsRegUnsub();
      if (typeof fsUnsub === 'function') fsUnsub();
    };
  }

  /**
   * Real-time listener for Exam & Quiz Submissions across ALL users directly from Central Database:
   * Firebase RTDB (`global_exam_results`, `exam_submissions`, `users` nested results),
   * Firestore (`global_exam_results`, `exam_submissions`), and server DB endpoints (`/api/tracking/exam-submissions`).
   * Strictly queries central database - zero local storage fallbacks.
   */
  static subscribeToExamSubmissions(
    onUpdate: (exams: AdminExamRecord[]) => void
  ): () => void {
    let isUnsubscribed = false;

    let rtdbGlobalExams: AdminExamRecord[] = [];
    let rtdbSubmissions: AdminExamRecord[] = [];
    let rtdbUserNestedExams: AdminExamRecord[] = [];
    let firestoreGlobalExams: AdminExamRecord[] = [];
    let firestoreSubmissions: AdminExamRecord[] = [];
    let serverExams: AdminExamRecord[] = [];

    const emitMerged = () => {
      if (isUnsubscribed) return;
      const idMap = new Map<string, AdminExamRecord>();

      // Merge central sources: server -> firestore -> rtdb (rtdb freshest)
      for (const ex of serverExams) idMap.set(ex.id, ex);
      for (const ex of firestoreSubmissions) idMap.set(ex.id, ex);
      for (const ex of firestoreGlobalExams) idMap.set(ex.id, ex);
      for (const ex of rtdbSubmissions) idMap.set(ex.id, ex);
      for (const ex of rtdbUserNestedExams) idMap.set(ex.id, ex);
      for (const ex of rtdbGlobalExams) idMap.set(ex.id, ex);

      const merged = Array.from(idMap.values()).sort((a, b) => {
        return new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime();
      });

      onUpdate(merged);
    };

    // Helper to map snapshot data to AdminExamRecord
    const mapDocData = (id: string, data: any): AdminExamRecord => {
      const totalQ = data.totalQuestions || 25;
      const score = typeof data.score === 'number' ? data.score : (data.netScore || 0);
      const percentage = typeof data.accuracy === 'number' 
        ? data.accuracy 
        : (totalQ > 0 ? Math.round((score / totalQ) * 100) : 0);

      const correct = data.correctAnswers || 0;
      const incorrect = data.incorrectAnswers || 0;
      const skipped = data.skippedCount ?? Math.max(0, totalQ - (correct + incorrect));
      const neg = data.negativeDeduction ?? Number((incorrect * 0.2).toFixed(2));
      const timeSpent = data.timeTakenSeconds || data.timeElapsedSeconds || 240;

      return {
        id,
        userId: data.userId || '',
        studentName: data.userName || (data.userEmail ? data.userEmail.split('@')[0] : 'विद्यार्थी'),
        studentEmail: data.userEmail || (data.userId && data.userId.includes('@') ? data.userId : ''),
        quizTitle: data.quizTitle || 'बैंकिङ परीक्षा सेट',
        quizId: data.quizId || '',
        totalQuestions: totalQ,
        attemptedCount: data.attemptedCount || totalQ,
        correctAnswers: correct,
        incorrectAnswers: incorrect,
        skippedCount: skipped,
        negativeDeduction: neg,
        score: Math.round(score * 100) / 100,
        netScore: Math.round(score * 100) / 100,
        percentage: Math.min(100, Math.max(0, percentage)),
        accuracy: Math.min(100, Math.max(0, percentage)),
        timeTakenSeconds: timeSpent,
        timeElapsedSeconds: timeSpent,
        timestamp: this.parseDate(data.submittedAt || data.timestamp),
        category: data.category || 'General Banking',
        district: data.district || 'काठमाडौँ',
        targetExam: data.targetExam || 'नेपाल राष्ट्र बैंक - सहायक ४',
        isGuest: Boolean(data.isGuest)
      };
    };

    // 1. RTDB `global_exam_results` subscription
    let unsubRtdbGlobal: (() => void) | null = null;
    try {
      if (rtdb) {
        const globalRef = ref(rtdb, 'global_exam_results');
        unsubRtdbGlobal = onValue(globalRef, (snap) => {
          if (isUnsubscribed) return;
          const val = snap.val();
          const list: AdminExamRecord[] = [];
          if (val && typeof val === 'object') {
            Object.entries(val).forEach(([key, d]: [string, any]) => {
              if (d && typeof d === 'object') {
                list.push(mapDocData(key, d));
              }
            });
          }
          rtdbGlobalExams = list;
          emitMerged();
        }, (err) => {
          console.warn('RTDB global_exam_results notice:', err);
        });
      }
    } catch (e) {
      console.warn('Could not listen to RTDB global_exam_results:', e);
    }

    // 2. RTDB `exam_submissions` subscription
    let unsubRtdbSubs: (() => void) | null = null;
    try {
      if (rtdb) {
        const subsRef = ref(rtdb, 'exam_submissions');
        unsubRtdbSubs = onValue(subsRef, (snap) => {
          if (isUnsubscribed) return;
          const val = snap.val();
          const list: AdminExamRecord[] = [];
          if (val && typeof val === 'object') {
            Object.entries(val).forEach(([key, d]: [string, any]) => {
              if (d && typeof d === 'object') {
                list.push(mapDocData(key, d));
              }
            });
          }
          rtdbSubmissions = list;
          emitMerged();
        }, (err) => {
          console.warn('RTDB exam_submissions notice:', err);
        });
      }
    } catch (e) {
      console.warn('Could not listen to RTDB exam_submissions:', e);
    }

    // 3. RTDB `users` node: extract nested `exam_results` from ALL users
    let unsubRtdbUsers: (() => void) | null = null;
    try {
      if (rtdb) {
        const usersRef = ref(rtdb, 'users');
        unsubRtdbUsers = onValue(usersRef, (snap) => {
          if (isUnsubscribed) return;
          const val = snap.val();
          const list: AdminExamRecord[] = [];
          if (val && typeof val === 'object') {
            Object.entries(val).forEach(([uid, uData]: [string, any]) => {
              if (!uData || typeof uData !== 'object') return;
              // Check nested exam_results
              if (uData.exam_results && typeof uData.exam_results === 'object') {
                Object.entries(uData.exam_results).forEach(([resId, resData]: [string, any]) => {
                  if (resData && typeof resData === 'object') {
                    list.push(mapDocData(resId, {
                      userId: uid,
                      userName: uData.displayName || uData.name,
                      userEmail: uData.email,
                      district: uData.district,
                      targetExam: uData.targetExam,
                      ...resData
                    }));
                  }
                });
              }
              // Check latestSubmission
              if (uData.latestSubmission && typeof uData.latestSubmission === 'object') {
                const ls = uData.latestSubmission;
                const subId = ls.id || `sub-user-${uid}`;
                list.push(mapDocData(subId, {
                  userId: uid,
                  userName: uData.displayName || uData.name,
                  userEmail: uData.email,
                  district: uData.district,
                  targetExam: uData.targetExam,
                  ...ls
                }));
              }
            });
          }
          rtdbUserNestedExams = list;
          emitMerged();
        }, (err) => {
          console.warn('RTDB users nested exams notice:', err);
        });
      }
    } catch (e) {
      console.warn('Could not listen to RTDB users for nested exams:', e);
    }

    // 4. Firestore `global_exam_results` collection
    let unsubFsGlobal: (() => void) | null = null;
    try {
      const globalCol = collection(db, 'global_exam_results');
      const q = query(globalCol, limit(200));
      unsubFsGlobal = onSnapshot(q, (snapshot) => {
        if (isUnsubscribed) return;
        const list: AdminExamRecord[] = [];
        snapshot.forEach(docSnap => {
          list.push(mapDocData(docSnap.id, docSnap.data()));
        });
        firestoreGlobalExams = list;
        emitMerged();
      }, () => {});
    } catch {}

    // 5. Firestore `exam_submissions` collection
    let unsubFsSubs: (() => void) | null = null;
    try {
      const submissionsCol = collection(db, 'exam_submissions');
      const q = query(submissionsCol, limit(200));
      unsubFsSubs = onSnapshot(q, (snapshot) => {
        if (isUnsubscribed) return;
        const list: AdminExamRecord[] = [];
        snapshot.forEach(docSnap => {
          list.push(mapDocData(docSnap.id, docSnap.data()));
        });
        firestoreSubmissions = list;
        emitMerged();
      }, (error) => {
        console.warn('Firestore exam_submissions notice:', error.message);
      });
    } catch (err) {
      console.warn('Could not attach Firestore exam_submissions listener:', err);
    }

    // 6. Server-synced submissions check
    fetch('/api/tracking/exam-submissions')
      .then(res => res.json())
      .then(data => {
        if (data && data.submissions && Array.isArray(data.submissions)) {
          serverExams = data.submissions.map((item: any) => mapDocData(item.id || `srv-${Date.now()}`, item));
          emitMerged();
        }
      })
      .catch(() => {});

    fetch('/api/tracking/global-exam-results')
      .then(res => res.json())
      .then(data => {
        if (data && data.results && Array.isArray(data.results)) {
          const list = data.results.map((item: any) => mapDocData(item.id || `srv-${Date.now()}`, item));
          serverExams = [...serverExams, ...list];
          emitMerged();
        }
      })
      .catch(() => {});

    return () => {
      isUnsubscribed = true;
      if (typeof unsubRtdbGlobal === 'function') unsubRtdbGlobal();
      if (typeof unsubRtdbSubs === 'function') unsubRtdbSubs();
      if (typeof unsubRtdbUsers === 'function') unsubRtdbUsers();
      if (typeof unsubFsGlobal === 'function') unsubFsGlobal();
      if (typeof unsubFsSubs === 'function') unsubFsSubs();
    };
  }

  /**
   * Helper to map an AdminExamRecord into an AdminAnalyticsRecord for display in Admin CMS
   */
  static mapExamRecordToAnalyticsRecord(r: AdminExamRecord): AdminAnalyticsRecord {
    const totalQ = r.totalQuestions || 25;
    const correct = r.correctAnswers || 0;
    const incorrect = r.incorrectAnswers || 0;
    const skipped = r.skippedCount ?? Math.max(0, totalQ - (correct + incorrect));
    const neg = r.negativeDeduction ?? Number((incorrect * 0.2).toFixed(2));
    const net = r.netScore ?? r.score;
    const acc = r.accuracy ?? r.percentage;
    const time = r.timeElapsedSeconds ?? r.timeTakenSeconds;

    return {
      id: r.id,
      userId: r.userId || r.studentEmail || r.studentName,
      userEmail: r.studentEmail || (r.userId && r.userId.includes('@') ? r.userId : ''),
      userName: r.studentName,
      district: r.district || 'काठमाडौँ',
      targetExam: r.targetExam || 'नेपाल राष्ट्र बैंक - सहायक ४',
      entryStatus: r.entryStatus || (r.studentEmail ? 'Google प्रमाणीकृत' : (r.isGuest ? 'अतिथि' : 'सक्रिय')),
      loginTime: r.loginTime || r.timestamp,
      pagesVisited: r.pagesVisited || (r.category ? [r.category] : ['क्विज अभ्यास']),
      quizId: r.quizId || 'exam-set',
      quizTitle: r.quizTitle,
      category: r.category || 'General Banking',
      totalQuestions: totalQ,
      attemptedCount: r.attemptedCount || (correct + incorrect),
      skippedCount: skipped,
      correctAnswers: correct,
      incorrectAnswers: incorrect,
      negativeDeduction: neg,
      netScore: net,
      accuracy: acc,
      timeElapsedSeconds: time,
      timestamp: r.timestamp
    };
  }

  /**
   * Real-time listener for Content & Notes Activity
   */
  static subscribeToNotesActivity(
    registeredUsers: AdminRegisteredUser[],
    onUpdate: (activities: AdminNotesActivityRecord[]) => void
  ): () => void {
    let isUnsubscribed = false;

    // Helper map to quickly find student XP
    const getStudentXp = (email?: string, name?: string): number => {
      if (email) {
        const found = registeredUsers.find(u => u.email.toLowerCase() === email.toLowerCase());
        if (found) return found.totalXp;
      }
      if (name) {
        const found = registeredUsers.find(u => u.displayName.toLowerCase() === name.toLowerCase());
        if (found) return found.totalXp;
      }
      return 250;
    };

    try {
      const actCol = collection(db, 'user_activities');
      const q = query(actCol, limit(150));

      const unsubscribe = onSnapshot(
        q,
        (snapshot) => {
          if (isUnsubscribed) return;
          const firestoreActs: AdminNotesActivityRecord[] = [];

          snapshot.forEach((docSnap) => {
            const data = docSnap.data();
            const id = docSnap.id;
            const targetTitle = data.metadata?.targetTitle || data.targetTitle || data.details || 'बैंकिङ पाठ्यक्रम नोट अध्ययन';

            firestoreActs.push({
              id,
              studentName: data.userName || (data.userEmail ? data.userEmail.split('@')[0] : 'विद्यार्थी'),
              studentEmail: data.userEmail || '',
              noteTitle: targetTitle,
              details: data.details || 'सामग्री अध्ययन तथा नोट रिभिजन सम्पन्न',
              timestamp: this.parseDate(data.timestamp),
              accumulatedXp: getStudentXp(data.userEmail, data.userName),
              activityType: data.activityType || 'reading'
            });
          });

          // Server-synced activities from central DB
          fetch('/api/tracking/activities')
            .then(res => res.json())
            .then(data => {
              if (data && data.activities && Array.isArray(data.activities)) {
                for (const item of data.activities) {
                  if (!firestoreActs.some(a => a.id === item.id)) {
                    firestoreActs.push({
                      id: item.id || `srv-${Date.now()}`,
                      studentName: item.userName || 'विद्यार्थी',
                      studentEmail: item.userEmail || '',
                      noteTitle: item.metadata?.targetTitle || item.details || 'नोट अध्ययन',
                      details: item.details || 'अध्ययन विवरण',
                      timestamp: item.timestamp || new Date().toISOString(),
                      accumulatedXp: getStudentXp(item.userEmail, item.userName),
                      activityType: item.activityType || 'reading'
                    });
                  }
                }
              }
            })
            .catch(() => {})
            .finally(() => {
              const idMap = new Map<string, AdminNotesActivityRecord>();
              for (const act of firestoreActs) {
                idMap.set(act.id, act);
              }

              const merged = Array.from(idMap.values()).sort((a, b) => {
                return new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime();
              });

              onUpdate(merged);
            });
        },
        (err) => {
          console.warn('Firestore user_activities notice:', err.message);
        }
      );

      return () => {
        isUnsubscribed = true;
        unsubscribe();
      };
    } catch (err) {
      console.warn('Could not attach Firestore user_activities listener:', err);
      return () => {
        isUnsubscribed = true;
      };
    }
  }

  /**
   * Calculates top summary metrics from users and exams lists
   */
  static calculateSummaryMetrics(
    users: AdminRegisteredUser[],
    exams: AdminExamRecord[],
    notesActivities: AdminNotesActivityRecord[]
  ): AdminSummaryMetrics {
    const totalActiveStudents = users.length;
    const totalExamsCompleted = exams.length;

    let totalScoreSum = 0;
    let totalTimeSum = 0;

    for (const e of exams) {
      totalScoreSum += e.percentage;
      totalTimeSum += e.timeTakenSeconds;
    }

    const averageScorePercent = totalExamsCompleted > 0 
      ? Math.round(totalScoreSum / totalExamsCompleted) 
      : 0;

    const averageCompletionTimeSeconds = totalExamsCompleted > 0 
      ? Math.round(totalTimeSum / totalExamsCompleted) 
      : 0;

    // Filter notes read activities
    const totalNotesRead = notesActivities.filter(a => 
      a.activityType === 'reading' || 
      a.details.toLowerCase().includes('पढ्न') || 
      a.details.toLowerCase().includes('note')
    ).length;

    // Determine top performing student
    let topStudentName = '';
    let highestXp = -1;
    for (const u of users) {
      if (u.totalXp > highestXp) {
        highestXp = u.totalXp;
        topStudentName = `${u.displayName} (${u.totalXp} XP)`;
      }
    }

    return {
      totalActiveStudents,
      totalExamsCompleted,
      averageScorePercent,
      totalNotesRead,
      averageCompletionTimeSeconds,
      topPerformingStudent: topStudentName || (users.length > 0 ? `${users[0].displayName} (${users[0].totalXp} XP)` : 'N/A')
    };
  }

  /**
   * Helper to format seconds to mm:ss or human readable
   */
  static formatTime(seconds: number): string {
    if (!seconds || seconds <= 0) return '0:00';
    const m = Math.floor(seconds / 60);
    const s = Math.floor(seconds % 60);
    return `${m}m ${s < 10 ? '0' : ''}${s}s`;
  }
}
