import { safeStorage } from '../utils/safeHelpers';
import { isUserAdmin, isOwnerAdmin } from '../utils/sanitizer';

export interface ManualPaymentRequest {
  id: string;
  userEmail: string;
  userName: string;
  userPhone: string;
  plan: 'single' | 'full';
  topicId?: string;
  topicTitle?: string;
  amount: number;
  paymentMethod: 'esewa' | 'khalti';
  transactionId: string;
  screenshotUrl?: string;
  submittedAt: string;
  status: 'pending' | 'approved' | 'rejected';
}

const STORAGE_KEY_UNLOCKED_TOPICS = 'btn_unlocked_suite_topics_v1';
const STORAGE_KEY_FULL_SUITE = 'btn_full_suite_unlocked_v1';
const STORAGE_KEY_MANUAL_PAYMENTS = 'btn_manual_payment_requests_v1';

export const PaywallService = {
  /**
   * Checks whether the user has access to download/print this topic.
   * Admins have 100% free override bypass.
   */
  hasAccessToTopic(topicId: string, user?: { email?: string | null } | null): boolean {
    // 1. Admin Override Bypass
    if (user?.email && (isUserAdmin(user.email) || isOwnerAdmin(user.email))) {
      return true;
    }

    // 2. Full Suite Unlocked
    if (this.isFullSuiteUnlocked()) {
      return true;
    }

    // 3. Single Topic Unlocked
    const unlocked = this.getUnlockedTopics();
    return unlocked.includes(topicId);
  },

  isFullSuiteUnlocked(): boolean {
    return safeStorage.getItem(STORAGE_KEY_FULL_SUITE) === 'true';
  },

  getUnlockedTopics(): string[] {
    const raw = safeStorage.getItem(STORAGE_KEY_UNLOCKED_TOPICS);
    if (!raw) return [];
    try {
      return JSON.parse(raw);
    } catch {
      return [];
    }
  },

  unlockTopic(topicId: string): void {
    const current = this.getUnlockedTopics();
    if (!current.includes(topicId)) {
      const updated = [...current, topicId];
      safeStorage.setItem(STORAGE_KEY_UNLOCKED_TOPICS, JSON.stringify(updated));
      window.dispatchEvent(new CustomEvent('btn:paywall-updated'));
    }
  },

  unlockFullSuite(): void {
    safeStorage.setItem(STORAGE_KEY_FULL_SUITE, 'true');
    window.dispatchEvent(new CustomEvent('btn:paywall-updated'));
  },

  resetAllAccess(): void {
    safeStorage.removeItem(STORAGE_KEY_FULL_SUITE);
    safeStorage.removeItem(STORAGE_KEY_UNLOCKED_TOPICS);
    window.dispatchEvent(new CustomEvent('btn:paywall-updated'));
  },

  getManualPayments(): ManualPaymentRequest[] {
    const raw = safeStorage.getItem(STORAGE_KEY_MANUAL_PAYMENTS);
    if (!raw) return [];
    try {
      return JSON.parse(raw);
    } catch {
      return [];
    }
  },

  submitManualPayment(
    data: Omit<ManualPaymentRequest, 'id' | 'submittedAt' | 'status'>
  ): ManualPaymentRequest {
    const existing = this.getManualPayments();
    const newRecord: ManualPaymentRequest = {
      ...data,
      id: `PAY-${Date.now()}-${Math.random().toString(36).substring(2, 7).toUpperCase()}`,
      submittedAt: new Date().toISOString(),
      status: 'pending'
    };

    const updated = [newRecord, ...existing];
    safeStorage.setItem(STORAGE_KEY_MANUAL_PAYMENTS, JSON.stringify(updated));
    window.dispatchEvent(new CustomEvent('btn:manual-payment-submitted', { detail: newRecord }));
    return newRecord;
  },

  approveManualPayment(id: string): boolean {
    const payments = this.getManualPayments();
    const target = payments.find(p => p.id === id);
    if (!target) return false;

    target.status = 'approved';
    safeStorage.setItem(STORAGE_KEY_MANUAL_PAYMENTS, JSON.stringify(payments));

    if (target.plan === 'full') {
      this.unlockFullSuite();
    } else if (target.topicId) {
      this.unlockTopic(target.topicId);
    }

    window.dispatchEvent(new CustomEvent('btn:manual-payment-approved', { detail: target }));
    return true;
  },

  rejectManualPayment(id: string): boolean {
    const payments = this.getManualPayments();
    const target = payments.find(p => p.id === id);
    if (!target) return false;

    target.status = 'rejected';
    safeStorage.setItem(STORAGE_KEY_MANUAL_PAYMENTS, JSON.stringify(payments));
    window.dispatchEvent(new CustomEvent('btn:manual-payment-rejected', { detail: target }));
    return true;
  },

  deleteManualPayment(id: string): void {
    const payments = this.getManualPayments().filter(p => p.id !== id);
    safeStorage.setItem(STORAGE_KEY_MANUAL_PAYMENTS, JSON.stringify(payments));
    window.dispatchEvent(new CustomEvent('btn:manual-payment-deleted'));
  }
};
