/**
 * Session Security Service: 3-Hour Inactivity Auto-Logout & Re-authentication Manager
 * Strictly enforces 180-minute idle session timeout across browser tabs/PWA lifecycle.
 */

import { StorageService } from './storageService';
import { safeStorage } from '../utils/safeHelpers';
import { ActivityTrackingService } from './activityTrackingService';

export const INACTIVITY_TIMEOUT_MS = 3 * 60 * 60 * 1000; // 3 hours (180 minutes)
const STORAGE_KEY_LAST_ACTIVITY = 'btn_last_user_activity_ts';
const STORAGE_KEY_SESSION_EXPIRED = 'btn_session_expired_flag';

type SessionExpiredListener = (reason: string) => void;

export class SessionSecurityService {
  private static listeners: Set<SessionExpiredListener> = new Set();
  private static checkIntervalId: any = null;
  private static isInitialized = false;
  private static lastRecordedLocalTs = Date.now();

  /**
   * Initialize inactivity tracking listeners
   */
  static init(onSessionExpired?: SessionExpiredListener) {
    if (typeof window === 'undefined' || this.isInitialized) {
      if (onSessionExpired) this.listeners.add(onSessionExpired);
      return;
    }

    if (onSessionExpired) {
      this.listeners.add(onSessionExpired);
    }

    // Set initial activity timestamp if none exists
    const existing = safeStorage.getItem(STORAGE_KEY_LAST_ACTIVITY) || localStorage.getItem(STORAGE_KEY_LAST_ACTIVITY);
    if (!existing) {
      this.recordUserActivity();
    }

    // User interaction events to monitor
    const interactionEvents: (keyof WindowEventMap)[] = [
      'mousedown',
      'keydown',
      'touchstart',
      'scroll',
      'click'
    ];

    const handleUserInteraction = () => {
      const now = Date.now();
      // Throttle recording to once every 20 seconds to prevent unnecessary storage writes
      if (now - this.lastRecordedLocalTs > 20000) {
        this.recordUserActivity();
      }
    };

    interactionEvents.forEach(evt => {
      window.addEventListener(evt, handleUserInteraction, { passive: true });
    });

    // Also check immediately when tab becomes visible again
    document.addEventListener('visibilitychange', () => {
      if (document.visibilityState === 'visible') {
        this.verifySessionValidity();
      }
    });

    // Run background check every 30 seconds
    this.checkIntervalId = setInterval(() => {
      this.verifySessionValidity();
    }, 30000);

    this.isInitialized = true;
  }

  /**
   * Touch/record the current user activity timestamp
   */
  static recordUserActivity() {
    if (typeof window === 'undefined') return;
    const now = Date.now();
    this.lastRecordedLocalTs = now;
    safeStorage.setItem(STORAGE_KEY_LAST_ACTIVITY, now.toString());
    try {
      localStorage.setItem(STORAGE_KEY_LAST_ACTIVITY, now.toString());
    } catch {}
  }

  /**
   * Get the last recorded activity timestamp
   */
  static getLastActivityTimestamp(): number {
    if (typeof window === 'undefined') return Date.now();
    const val = safeStorage.getItem(STORAGE_KEY_LAST_ACTIVITY) || localStorage.getItem(STORAGE_KEY_LAST_ACTIVITY);
    return val ? parseInt(val, 10) : Date.now();
  }

  /**
   * Check if current session has exceeded 3 hours of inactivity
   */
  static isSessionExpired(): boolean {
    const lastActive = this.getLastActivityTimestamp();
    const elapsed = Date.now() - lastActive;
    return elapsed >= INACTIVITY_TIMEOUT_MS;
  }

  /**
   * Verify session status and trigger auto-logout if expired
   */
  static verifySessionValidity(): boolean {
    if (typeof window === 'undefined') return true;

    // Check if the user is currently logged in (not guest)
    const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
    if (!isLoggedIn) return true;

    if (this.isSessionExpired()) {
      this.triggerAutoLogout('३ घण्टा निष्क्रिय रहेकाले तपाईंको सत्र (Session) समाप्त भएको छ। सुरक्षाका लागि कृपया Fingerprint/Face ID वा पासवर्डद्वारा पुनः प्रमाणीकरण गर्नुहोस्।');
      return false;
    }

    return true;
  }

  /**
   * Smoothly clear active session tokens and notify listeners
   */
  static triggerAutoLogout(reason: string) {
    if (typeof window === 'undefined') return;

    try {
      // 1. Preserve user email & snapshot for instant 1-tap Fingerprint / Biometric re-authentication
      const currentUserRaw = localStorage.getItem('btn_authenticated_user') || localStorage.getItem('user_profile') || localStorage.getItem('user');
      if (currentUserRaw) {
        try {
          const parsed = JSON.parse(currentUserRaw);
          if (parsed && parsed.email) {
            localStorage.setItem('btn_last_auth_email', parsed.email);
            localStorage.setItem('btn_last_auth_name', parsed.displayName || parsed.name || '');
            localStorage.setItem('btn_biometric_user_profile', JSON.stringify(parsed));
          }
        } catch {}
      }

      // 2. Clear active session tokens
      localStorage.setItem('isLoggedIn', 'false');
      localStorage.removeItem('btn_user_session_token');
      safeStorage.removeItem('btn_user_session_token');
      localStorage.setItem(STORAGE_KEY_SESSION_EXPIRED, 'true');

      // 3. Log security auto-logout in CMS audit trail
      ActivityTrackingService.logActivity({
        activityType: 'reading',
        details: '३ घण्टा निष्क्रियता सुरक्षा: स्वचालित लगआउट सम्पन्न (3-Hour Session Timeout Security)',
        metadata: { reason: 'inactivity_timeout_3h' }
      }).catch(() => {});
    } catch (e) {
      console.error('Session security auto-logout error:', e);
    }

    // 4. Notify listeners to update React state & prompt for Fingerprint/Face ID re-auth
    this.listeners.forEach(fn => {
      try {
        fn(reason);
      } catch (err) {
        console.warn('Listener error in session security:', err);
      }
    });

    // 5. Dispatch global window event
    window.dispatchEvent(new CustomEvent('btn:session-expired', { detail: { reason } }));
  }

  /**
   * Reset session timer upon fresh login or re-authentication
   */
  static resetSessionTimer() {
    this.recordUserActivity();
    if (typeof window !== 'undefined') {
      localStorage.removeItem(STORAGE_KEY_SESSION_EXPIRED);
      safeStorage.removeItem(STORAGE_KEY_SESSION_EXPIRED);
    }
  }

  /**
   * Subscribe to session expired events
   */
  static onSessionExpired(listener: SessionExpiredListener): () => void {
    this.listeners.add(listener);
    return () => {
      this.listeners.delete(listener);
    };
  }
}
