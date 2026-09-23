import React, { useState, useEffect, useRef } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import { 
  Mail, 
  ArrowRight, 
  User, 
  ShieldCheck, 
  X, 
  AlertCircle, 
  CheckCircle2, 
  UserCheck, 
  Sparkles,
  Key,
  Lock,
  Eye,
  EyeOff,
  Fingerprint,
  ScanFace,
  Clock
} from 'lucide-react';
import { UserProfile } from '../../types';
import { DbService } from '../../services/dbService';
import { BrandLogo } from '../common/BrandLogo';
import { safeStorage } from '../../utils/safeHelpers';
import { StorageService } from '../../services/storageService';
import { FirebaseAuthService } from '../../services/firebaseAuthService';
import { ActivityTrackingService } from '../../services/activityTrackingService';
import { BiometricAuthService } from '../../services/biometricAuthService';
import { SessionSecurityService } from '../../services/sessionSecurityService';
import { useApp } from '../../context/AppContext';
import { isOwnerAdmin, sanitizeUserProfile } from '../../utils/sanitizer';

export interface LoginModalProps {
  isOpen?: boolean;
  onSuccess?: (user: UserProfile) => void;
  setUser?: (user: UserProfile) => void;
  setIsLoggedIn?: (loggedIn: boolean) => void;
  setShowAuthModal?: (show: boolean) => void;
  onClose?: () => void;
  customMessage?: string;
}

const POPULAR_TARGET_EXAMS = [
  'नेपाल राष्ट्र बैंक (NRB) - सहायक ४',
  'नेपाल राष्ट्र बैंक (NRB) - अधिकृत ३',
  'राष्ट्रिय वाणिज्य बैंक (RBB) - तह ४/५',
  'कृषि विकास बैंक (ADBL) - तह ४/५',
  'नेपाल बैंक लिमिटेड (NBL) - तह ३/४',
  'संगठित संस्था / लोकसेवा आयोग'
];

type AuthTab = 'signin' | 'signup' | 'forgot';

export const LoginModal: React.FC<LoginModalProps> = ({
  isOpen = true,
  onSuccess,
  setUser,
  setIsLoggedIn,
  setShowAuthModal: externalSetShowAuthModal,
  onClose,
  customMessage
}) => {
  const { 
    closeLoginModal, 
    setIsLoginModalOpen, 
    setUser: appSetUser, 
    setIsLoggedIn: appSetIsLoggedIn 
  } = useApp();

  const [activeTab, setActiveTab] = useState<AuthTab>('signin');
  const [isSigningIn, setIsSigningIn] = useState<boolean>(false);
  const [error, setError] = useState<string>('');
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [toastType, setToastType] = useState<'info' | 'success' | 'error'>('info');

  // Biometric / WebAuthn states
  const [isBiometricSupported, setIsBiometricSupported] = useState<boolean>(true);
  const [isBiometricAuthenticating, setIsBiometricAuthenticating] = useState<boolean>(false);
  const [hasEnrolledBiometric, setHasEnrolledBiometric] = useState<boolean>(false);

  const [isVisible, setIsVisible] = useState<boolean>(isOpen);

  useEffect(() => {
    setIsVisible(isOpen);
    if (isOpen) {
      BiometricAuthService.isBiometricAvailable().then((res) => {
        setIsBiometricSupported(res.supported);
      });
      setHasEnrolledBiometric(BiometricAuthService.hasEnrolledBiometric());
    }
  }, [isOpen]);

  const callbacksRef = useRef({
    onSuccess,
    setUser,
    setIsLoggedIn,
    externalSetShowAuthModal,
    onClose,
    closeLoginModal,
    setIsLoginModalOpen
  });

  useEffect(() => {
    callbacksRef.current = {
      onSuccess,
      setUser,
      setIsLoggedIn,
      externalSetShowAuthModal,
      onClose,
      closeLoginModal,
      setIsLoginModalOpen
    };
  });

  /**
   * AUTO-CLOSE LOGIN MODAL ON SUCCESS:
   * Listen to memoized FirebaseAuthService state. As soon as user is logged in,
   * cleanly close modal without re-triggering recursive state loops.
   */
  useEffect(() => {
    if (!isVisible) return;

    const unsubscribe = FirebaseAuthService.onAuthStateChanged((profile) => {
      if (profile && profile.email && !profile.isGuest) {
        setIsVisible(false);
        setIsSigningIn(false);
        const { externalSetShowAuthModal, onClose, closeLoginModal, setIsLoginModalOpen, onSuccess } = callbacksRef.current;
        if (externalSetShowAuthModal) externalSetShowAuthModal(false);
        if (onClose) onClose();
        closeLoginModal();
        setIsLoginModalOpen(false);
        if (onSuccess) onSuccess(profile);
      }
    });

    return () => unsubscribe();
  }, [isVisible]);

  /**
   * Helper to ensure auth modal is closed immediately across all states and props
   */
  const setShowAuthModal = (show: boolean) => {
    if (!show) {
      setIsVisible(false);
      setIsSigningIn(false);
      if (externalSetShowAuthModal) {
        externalSetShowAuthModal(false);
      }
      if (onClose) {
        onClose();
      }
      closeLoginModal();
      setIsLoginModalOpen(false);
    } else {
      setIsVisible(true);
      if (externalSetShowAuthModal) {
        externalSetShowAuthModal(true);
      }
      setIsLoginModalOpen(true);
    }
  };

  const [fullName, setFullName] = useState<string>(() => {
    try {
      const stored = localStorage.getItem('btn_last_auth_name');
      if (stored) return stored;
      const rawUser = localStorage.getItem('user_profile');
      if (rawUser) {
        const parsed = JSON.parse(rawUser);
        if (parsed?.name && parsed.name !== 'अतिथि प्रयोगकर्ता' && parsed.name !== 'विद्यार्थी') {
          return parsed.name;
        }
      }
    } catch {}
    return '';
  });

  const [email, setEmail] = useState<string>(() => {
    try {
      const stored = localStorage.getItem('btn_last_auth_email');
      if (stored) return stored;
      const rawUser = localStorage.getItem('user_profile');
      if (rawUser) {
        const parsed = JSON.parse(rawUser);
        if (parsed?.email && parsed.email.includes('@')) {
          return parsed.email;
        }
      }
    } catch {}
    return '';
  });

  const [password, setPassword] = useState<string>('');
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [targetExam, setTargetExam] = useState<string>(POPULAR_TARGET_EXAMS[0]);

  const showToast = (message: string, type: 'info' | 'success' | 'error' = 'info') => {
    setToastMessage(message);
    setToastType(type);
    setTimeout(() => {
      setToastMessage((current) => (current === message ? null : current));
    }, 4500);
  };

  /**
   * Finalizes session authentication: updates storage, DB, and dispatches global events immediately.
   * If Firestore sync takes longer, session is saved in LocalStorage immediately and loading state is dismissed.
   */
  const finalizeAuthentication = (profileData: UserProfile) => {
    try {
      // 0. Force-close modal immediately so popup closes with 0ms delay
      setShowAuthModal(false);
      if (onClose) onClose();
      closeLoginModal();
      setIsLoginModalOpen(false);
      setIsSigningIn(false);

      const sessionToken = `btn_sess_${profileData.id || Date.now()}_${Date.now()}`;
      const derivedName = profileData.displayName || profileData.name || (profileData.email ? profileData.email.split('@')[0] : 'विद्यार्थी');
      const authenticAvatar = profileData.photoURL || profileData.avatarUrl || `https://ui-avatars.com/api/?name=${encodeURIComponent(derivedName)}&background=0052FF&color=fff&size=256`;

      const cleanEmail = (profileData.email || '').toLowerCase().trim();
      const isOwner = isOwnerAdmin(cleanEmail);

      const enrichedProfile: UserProfile = sanitizeUserProfile({
        ...profileData,
        email: cleanEmail,
        displayName: derivedName,
        name: derivedName,
        photoURL: authenticAvatar,
        avatarUrl: authenticAvatar,
        sessionToken,
        isGuest: false,
        isRegistered: true,
        role: isOwner ? 'admin' : (profileData.role || 'student'),
        isPro: isOwner ? true : Boolean(profileData.isPro || profileData.isProUser),
        isProUser: isOwner ? true : Boolean(profileData.isPro || profileData.isProUser),
        proStatus: isOwner ? 'active' : (profileData.proStatus || 'inactive')
      });

      // 1. React App State Updates: Immediately update global auth state (setUser, isLoggedIn)
      // This immediately reflects DisplayName and Google Profile Photo on the header
      if (setUser) setUser(enrichedProfile);
      if (appSetUser) appSetUser(enrichedProfile);
      if (setIsLoggedIn) setIsLoggedIn(true);
      if (appSetIsLoggedIn) appSetIsLoggedIn(true);
      if (onSuccess) onSuccess(enrichedProfile);

      // 2. Save session in LocalStorage immediately
      const serialized = JSON.stringify(enrichedProfile);
      localStorage.setItem('isLoggedIn', 'true');
      localStorage.setItem('btn_authenticated_user', serialized);
      localStorage.setItem('user', serialized);
      localStorage.setItem('user_profile', serialized);
      safeStorage.setItem('user_profile', serialized);
      localStorage.setItem('btn_user_profile_v1', serialized);
      localStorage.setItem('btn_user_session_token', sessionToken);
      localStorage.setItem('btn_last_auth_provider', enrichedProfile.authProvider || 'google');
      localStorage.setItem('btn_last_auth_email', enrichedProfile.email || '');
      localStorage.setItem('btn_last_auth_name', enrichedProfile.displayName || enrichedProfile.name || '');
      localStorage.setItem('btn_auth_uid', enrichedProfile.id);

      // 3. Dispatch global window events for instant header/dashboard reactive updates
      window.dispatchEvent(new CustomEvent('btn:profile-updated', { detail: enrichedProfile }));
      window.dispatchEvent(new CustomEvent('btn:user-login', { detail: enrichedProfile }));

      showToast(`स्वागत छ, ${enrichedProfile.displayName || enrichedProfile.name}!`, 'success');

      // 4. DO NOT block UI or wait for Firestore async background sync (`saveUserToFirestore`).
      // Run Firestore profile creation asynchronously in the background.
      setTimeout(() => {
        FirebaseAuthService.saveUserToFirestore(enrichedProfile).catch(() => {});
        FirebaseAuthService.syncUserProfileToFirestore(enrichedProfile).catch(() => {});
        DbService.saveStudentProfile(enrichedProfile).catch(() => {});
      }, 0);

      // 5. Log authenticated user login event
      ActivityTrackingService.logActivity({
        user: enrichedProfile,
        activityType: 'reading',
        details: `प्रयोगकर्ता लगइन सम्पन्न (${enrichedProfile.authProvider || 'Google/Email'})`,
        metadata: { provider: enrichedProfile.authProvider }
      }).catch(() => {});

      // 6. Reset 3-hour session security inactivity timer
      SessionSecurityService.resetSessionTimer();

      // 7. Enroll/link biometrics in background for instant 1-tap Fingerprint / Face ID login
      BiometricAuthService.registerBiometrics(enrichedProfile).catch(() => {});
    } catch (err) {
      console.error('Authentication finalization error:', err);
      setShowAuthModal(false);
      if (onClose) onClose();
      closeLoginModal();
      setIsLoginModalOpen(false);
      setIsSigningIn(false);
      if (setUser) setUser(profileData);
      if (appSetUser) appSetUser(profileData);
      if (setIsLoggedIn) setIsLoggedIn(true);
      if (appSetIsLoggedIn) appSetIsLoggedIn(true);
      if (onSuccess) onSuccess(profileData);
    }
  };

  /**
   * Authentic Google OAuth Pop-up Sign-In
   */
  const handleGoogleSignIn = async () => {
    setError('');
    setIsSigningIn(true);

    try {
      const googleProfile = await FirebaseAuthService.signInWithGoogle();
      // 1. Call setShowAuthModal(false) (or onClose()) IMMEDIATELY as the very first line upon Firebase authentication success
      setShowAuthModal(false);
      if (onClose) onClose();
      setIsSigningIn(false);

      if (googleProfile && googleProfile.email) {
        finalizeAuthentication(googleProfile);
      }
    } catch (err: any) {
      setIsSigningIn(false);
      console.warn('Google sign-in popup notice:', err);
      const errorCode = err?.code || '';
      const errorMsg = String(err?.message || '');

      // User closed popup or cancelled: silent exit
      if (errorCode === 'auth/popup-closed-by-user' || errorCode === 'auth/cancelled-popup-request') {
        return;
      }

      // Automatically fallback to Guest Preview mode smoothly if auth domain is pending configuration
      if (
        errorCode === 'auth/unauthorized-domain' ||
        errorMsg.includes('unauthorized-domain') ||
        errorCode === 'auth/configuration-not-found'
      ) {
        handleContinueAsGuest();
        showToast('पूर्वावलोकन मोड सक्रिय भयो (Guest Preview)', 'info');
        return;
      }

      if (errorCode === 'auth/popup-blocked') {
        setError('ब्राउजरले गुगल लगइन पपअप अनुमति दिएन। कृपया पपअप अन गर्नुहोस्।');
        return;
      }

      // Never dump raw Firebase error string to the UI
      setError('गुगल लगइन हुन सकेन। कृपया पुनः प्रयास गर्नुहोस् वा अतिथि मोड रोज्नुहोस्।');
    }
  };

  /**
   * 1-Tap Biometric Fingerprint / Face ID Sign-In Handler
   */
  const handleBiometricSignIn = async () => {
    setError('');
    setIsBiometricAuthenticating(true);

    try {
      const result = await BiometricAuthService.authenticateWithBiometrics();
      if (result.success && result.profile) {
        showToast('बायोमेट्रिक प्रमाणीकरण सफल भयो! स्वागत छ।', 'success');
        finalizeAuthentication(result.profile);
      } else {
        const fallbackMsg = result.error || 'बायोमेट्रिक प्रमाणीकरण असफल भयो। कृपया पासवर्ड वा गुगलबाट लगइन गर्नुहोस्।';
        setError(fallbackMsg);
        showToast(fallbackMsg, 'error');
      }
    } catch (err: any) {
      console.warn('Biometric sign-in error:', err);
      setError('बायोमेट्रिक सेन्सर प्रमाणीकरण रद्द भयो वा त्रुटि भयो।');
    } finally {
      setIsBiometricAuthenticating(false);
    }
  };

  /**
   * Email/Password Sign-In Handler
   */
  const handleEmailSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    const cleanEmail = email.trim().toLowerCase();
    if (!cleanEmail || !cleanEmail.includes('@') || !cleanEmail.includes('.')) {
      setError('कृपया मान्य इमेल ठेगाना प्रविष्ट गर्नुहोस् (उदा: yourname@gmail.com)।');
      return;
    }

    if (!password) {
      setError('कृपया पासवर्ड प्रविष्ट गर्नुहोस्।');
      return;
    }

    setIsSigningIn(true);

    try {
      const profile = await FirebaseAuthService.signInWithEmail(cleanEmail, password);
      // 1. Call setShowAuthModal(false) (or onClose()) IMMEDIATELY as the very first line upon Firebase authentication success
      setShowAuthModal(false);
      if (onClose) onClose();
      setIsSigningIn(false);

      if (profile && profile.email) {
        finalizeAuthentication(profile);
      }
    } catch (err: any) {
      console.warn('Email sign in notice:', err);
      const errorCode = err?.code || '';
      const errorMsg = String(err?.message || '');

      // If unauthorized domain, smoothly fallback to Guest Preview
      if (
        errorCode === 'auth/unauthorized-domain' ||
        errorMsg.includes('unauthorized-domain')
      ) {
        handleContinueAsGuest();
        showToast('पूर्वावलोकन मोड सक्रिय भयो (Guest Preview)', 'info');
        return;
      }

      // Friendly subtle helper text only when invalid credentials
      if (
        errorCode === 'auth/user-not-found' ||
        errorCode === 'auth/wrong-password' ||
        errorCode === 'auth/invalid-credential' ||
        errorCode === 'auth/invalid-login-credentials'
      ) {
        setError('इमेल वा पासवर्ड मिलेन।');
      } else if (errorCode === 'auth/too-many-requests') {
        setError('धेरै पटक असफल प्रयास भयो। कृपया केही समयपछि पुनः प्रयास गर्नुहोस्।');
      } else {
        setError('लगइन गर्न सकिएन। विवरण जाँच गरी पुनः प्रयास गर्नुहोस्।');
      }
    } finally {
      setIsSigningIn(false);
    }
  };

  /**
   * Email/Password Sign-Up Handler
   */
  const handleEmailSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    const cleanEmail = email.trim().toLowerCase();
    if (!cleanEmail || !cleanEmail.includes('@') || !cleanEmail.includes('.')) {
      setError('कृपया मान्य इमेल प्रविष्ट गर्नुहोस्।');
      return;
    }

    if (!fullName.trim()) {
      setError('कृपया आफ्नो पूरा नाम प्रविष्ट गर्नुहोस्।');
      return;
    }

    if (!password || password.length < 6) {
      setError('पासवर्ड कम्तिमा ६ अक्षरको हुनुपर्छ।');
      return;
    }

    setIsSigningIn(true);

    try {
      const newProfile = await FirebaseAuthService.signUpWithEmail(fullName, cleanEmail, password, targetExam);
      // 1. Call setShowAuthModal(false) (or onClose()) IMMEDIATELY as the very first line upon Firebase authentication success
      setShowAuthModal(false);
      if (onClose) onClose();
      setIsSigningIn(false);

      if (newProfile && newProfile.email) {
        finalizeAuthentication(newProfile);
      }
    } catch (err: any) {
      console.warn('Sign up notice:', err);
      const errorCode = err?.code || '';
      const errorMsg = String(err?.message || '');

      if (
        errorCode === 'auth/unauthorized-domain' ||
        errorMsg.includes('unauthorized-domain')
      ) {
        handleContinueAsGuest();
        showToast('पूर्वावलोकन मोड सक्रिय भयो (Guest Preview)', 'info');
        return;
      }

      if (errorCode === 'auth/email-already-in-use') {
        setError('यो इमेल पहिले नै दर्ता भइसकेको छ। कृपया लगइन गर्नुहोस्।');
      } else if (errorCode === 'auth/weak-password') {
        setError('पासवर्ड कम्तिमा ६ अक्षरको हुनुपर्छ।');
      } else {
        setError('खाता सिर्जना गर्न सकिएन। कृपया पुनः प्रयास गर्नुहोस्।');
      }
    } finally {
      setIsSigningIn(false);
    }
  };

  /**
   * Password Reset Handler
   */
  const handlePasswordReset = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    const cleanEmail = email.trim().toLowerCase();
    if (!cleanEmail || !cleanEmail.includes('@') || !cleanEmail.includes('.')) {
      setError('कृपया पासवर्ड रिसेट गर्न आफ्नो मान्य इमेल प्रविष्ट गर्नुहोस्।');
      return;
    }

    setIsSigningIn(true);
    try {
      await FirebaseAuthService.sendPasswordReset(cleanEmail);
      showToast(`पासवर्ड रिसेट लिंक ${cleanEmail} मा पठाइयो। कृपया आफ्नो इनबक्स जाँच गर्नुहोस्।`, 'success');
      setActiveTab('signin');
    } catch (err: any) {
      console.warn('Password reset notice:', err);
      showToast(`पासवर्ड रिसेट निर्देशन ${cleanEmail} मा पठाइयो।`, 'success');
      setActiveTab('signin');
    } finally {
      setIsSigningIn(false);
    }
  };

  /**
   * Continue as Guest
   */
  const handleContinueAsGuest = () => {
    setIsSigningIn(false);
    const guest = StorageService.getGuestProfile();
    StorageService.saveUserProfile(guest);
    if (setUser) setUser(guest);
    if (appSetUser) appSetUser(guest);
    if (setIsLoggedIn) setIsLoggedIn(false);
    if (appSetIsLoggedIn) appSetIsLoggedIn(false);
    if (onSuccess) onSuccess(guest);
    window.dispatchEvent(new CustomEvent('btn:profile-updated', { detail: guest }));
    showToast('अतिथि (Guest) मोड सक्रिय भयो।', 'info');
    setShowAuthModal(false);
    if (onClose) onClose();
  };

  if (!isOpen || !isVisible) return null;

  return (
    <div 
      id="login-auth-modal-overlay"
      onClick={(e) => {
        if (e.target === e.currentTarget) {
          setShowAuthModal(false);
        }
      }}
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/50 backdrop-blur-xs overflow-y-auto animate-in fade-in duration-150"
    >
      {/* Subtle Toast Notification */}
      {toastMessage && (
        <div className="fixed top-5 left-1/2 -translate-x-1/2 z-70 max-w-sm w-[90%] px-4 py-2.5 rounded-xl shadow-lg border flex items-center gap-2.5 text-xs font-medium bg-[#0F172A] text-white border-slate-700 animate-in fade-in slide-in-from-top-3 duration-200">
          {toastType === 'error' && <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />}
          {toastType === 'success' && <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />}
          {toastType === 'info' && <ShieldCheck className="w-4 h-4 text-sky-400 shrink-0" />}
          <span className="flex-1">{toastMessage}</span>
          <button 
            type="button" 
            onClick={() => setToastMessage(null)}
            className="p-1 text-slate-400 hover:text-white"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      <div 
        id="login-auth-modal-card"
        className="relative w-full max-w-[390px] mx-auto bg-white dark:bg-[#0F172A] border border-[#E2E8F0] dark:border-slate-800 rounded-2xl shadow-xl overflow-hidden my-auto p-5 sm:p-6 transition-all"
      >
        {/* Top Close Button */}
        <button
          type="button"
          onClick={() => setShowAuthModal(false)}
          className="absolute top-3.5 right-3.5 p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition cursor-pointer"
          title="बन्द गर्नुहोस्"
          aria-label="बन्द गर्नुहोस्"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Subtle Logo & Title */}
        <div className="text-center pt-1 pb-4">
          <div className="flex justify-center mb-2.5">
            <BrandLogo variant="full" className="h-8 w-auto object-contain" />
          </div>
          <h2 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white tracking-tight">
            {activeTab === 'signin' && 'लगइन गर्नुहोस्'}
            {activeTab === 'signup' && 'नयाँ खाता सिर्जना'}
            {activeTab === 'forgot' && 'पासवर्ड रिसेट'}
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            {activeTab === 'signin' && 'बैंकिङ्ग तथा लोक सेवा तयारी पोर्टल'}
            {activeTab === 'signup' && 'तयारी सुरु गर्न आफ्नो विवरण प्रविष्ट गर्नुहोस्'}
            {activeTab === 'forgot' && 'आफ्नो दर्ता भएको इमेल प्रविष्ट गर्नुहोस्'}
          </p>
        </div>

        {/* Subtle Inline Error Notification (Only when submitted credentials fail) */}
        {error && (
          <div className="mb-3 px-3 py-2 rounded-lg bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900/60 text-rose-600 dark:text-rose-400 text-xs font-medium text-center">
            {error}
          </div>
        )}

        {/* Subtle Security / Context Notification Banner (e.g. 3-Hour Session Timeout) */}
        {customMessage && (
          <div className="mb-3 px-3 py-2 rounded-xl bg-sky-50 dark:bg-sky-950/40 border border-sky-200 dark:border-sky-800/60 text-sky-800 dark:text-sky-300 text-xs font-medium flex items-center gap-2">
            <Clock className="w-4 h-4 text-sky-500 shrink-0" />
            <span className="leading-relaxed">{customMessage}</span>
          </div>
        )}

        <div className="space-y-3.5">
          {/* Quick Fingerprint / Face ID Biometric Login Button (Mobile App & Web 1-Tap Entry) */}
          {activeTab === 'signin' && (
            <button
              type="button"
              id="btn-biometric-auth-trigger"
              disabled={isSigningIn || isBiometricAuthenticating}
              onClick={handleBiometricSignIn}
              className="w-full min-h-[44px] py-2 px-3.5 flex items-center justify-between bg-gradient-to-r from-sky-600 to-blue-600 hover:from-sky-500 hover:to-blue-500 text-white font-medium text-xs sm:text-sm rounded-xl border border-sky-400/30 shadow-2xs hover:shadow-xs transition active:scale-[0.99] cursor-pointer disabled:opacity-50"
              title="Fingerprint वा Face ID मार्फत द्रुत १-ट्याप लगइन"
            >
              <div className="flex items-center gap-2.5">
                {isBiometricAuthenticating ? (
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin shrink-0" />
                ) : (
                  <Fingerprint className="w-4 h-4 text-sky-100 shrink-0" />
                )}
                <span>
                  {isBiometricAuthenticating 
                    ? 'सेन्सर प्रमाणीकरण हुँदैछ...' 
                    : 'Fingerprint/Face ID मार्फत लगइन गर्नुहोस्'}
                </span>
              </div>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-white/20 text-white font-medium shrink-0">
                १-ट्याप
              </span>
            </button>
          )}

          {/* Prominent, clean "Google मार्फत जारी राख्नुहोस्" button */}
          {activeTab !== 'forgot' && (
            <>
              <button
                type="button"
                id="btn-google-auth-trigger"
                disabled={isSigningIn}
                onClick={handleGoogleSignIn}
                className="w-full min-h-[44px] py-2 px-3.5 flex items-center justify-center gap-2.5 bg-white dark:bg-[#1E293B] hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200 font-medium text-xs sm:text-sm rounded-xl border border-[#E2E8F0] dark:border-slate-700 shadow-2xs hover:shadow-xs transition active:scale-[0.99] cursor-pointer disabled:opacity-50"
              >
                <GoogleGIcon className="w-4 h-4 shrink-0" />
                <span>Google मार्फत जारी राख्नुहोस्</span>
              </button>

              <div className="relative flex py-1 items-center">
                <div className="flex-grow border-t border-[#E2E8F0] dark:border-slate-800" />
                <span className="flex-shrink mx-3 text-[11px] text-slate-400 dark:text-slate-500 font-medium">
                  वा इमेलबाट
                </span>
                <div className="flex-grow border-t border-[#E2E8F0] dark:border-slate-800" />
              </div>
            </>
          )}

          {/* Simple Email & Password form: Sign In Tab */}
          {activeTab === 'signin' && (
            <form onSubmit={handleEmailSignIn} className="space-y-3">
              <div className="space-y-1">
                <label className="text-xs font-medium text-slate-700 dark:text-slate-300">
                  इमेल
                </label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="yourname@gmail.com"
                  className="w-full px-3 py-2 bg-white dark:bg-[#1E293B] text-slate-900 dark:text-white text-xs sm:text-sm rounded-xl border border-[#E2E8F0] dark:border-slate-700 focus:border-slate-800 dark:focus:border-sky-400 outline-none transition"
                />
              </div>

              <div className="space-y-1">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-medium text-slate-700 dark:text-slate-300">
                    पासवर्ड
                  </label>
                  <button
                    type="button"
                    onClick={() => { setActiveTab('forgot'); setError(''); }}
                    className="text-[11px] text-sky-600 dark:text-sky-400 hover:underline"
                  >
                    पासवर्ड बिर्सनुभयो?
                  </button>
                </div>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full px-3 py-2 bg-white dark:bg-[#1E293B] text-slate-900 dark:text-white text-xs sm:text-sm rounded-xl border border-[#E2E8F0] dark:border-slate-700 focus:border-slate-800 dark:focus:border-sky-400 outline-none transition pr-9"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-0.5"
                  >
                    {showPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                  </button>
                </div>
              </div>

              {/* Sleek, single primary action button */}
              <button
                type="submit"
                disabled={isSigningIn}
                className="w-full min-h-[42px] py-2 px-4 bg-[#0F172A] hover:bg-slate-800 dark:bg-sky-600 dark:hover:bg-sky-500 active:scale-[0.99] text-white font-semibold text-xs sm:text-sm rounded-xl transition flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 shadow-2xs"
              >
                {isSigningIn ? (
                  <span>प्रक्रिया हुँदैछ...</span>
                ) : (
                  <span>लगइन गर्नुहोस्</span>
                )}
              </button>

              <div className="text-center pt-1">
                <button
                  type="button"
                  onClick={() => { setActiveTab('signup'); setError(''); }}
                  className="text-xs text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition"
                >
                  खाता छैन? <span className="font-semibold text-sky-600 dark:text-sky-400">नयाँ दर्ता गर्नुहोस्</span>
                </button>
              </div>
            </form>
          )}

          {/* Simple Form: Sign Up Tab */}
          {activeTab === 'signup' && (
            <form onSubmit={handleEmailSignUp} className="space-y-3">
              <div className="space-y-1">
                <label className="text-xs font-medium text-slate-700 dark:text-slate-300">
                  पूरा नाम
                </label>
                <input
                  type="text"
                  required
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="उदा: ऋषि राम थापा"
                  className="w-full px-3 py-2 bg-white dark:bg-[#1E293B] text-slate-900 dark:text-white text-xs sm:text-sm rounded-xl border border-[#E2E8F0] dark:border-slate-700 focus:border-slate-800 dark:focus:border-sky-400 outline-none transition"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-medium text-slate-700 dark:text-slate-300">
                  इमेल
                </label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="yourname@gmail.com"
                  className="w-full px-3 py-2 bg-white dark:bg-[#1E293B] text-slate-900 dark:text-white text-xs sm:text-sm rounded-xl border border-[#E2E8F0] dark:border-slate-700 focus:border-slate-800 dark:focus:border-sky-400 outline-none transition"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-medium text-slate-700 dark:text-slate-300">
                  पासवर्ड (कम्तिमा ६ अक्षर)
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    minLength={6}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full px-3 py-2 bg-white dark:bg-[#1E293B] text-slate-900 dark:text-white text-xs sm:text-sm rounded-xl border border-[#E2E8F0] dark:border-slate-700 focus:border-slate-800 dark:focus:border-sky-400 outline-none transition pr-9"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-0.5"
                  >
                    {showPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                  </button>
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-medium text-slate-700 dark:text-slate-300">
                  लक्षित परीक्षा
                </label>
                <select
                  value={targetExam}
                  onChange={(e) => setTargetExam(e.target.value)}
                  className="w-full px-3 py-2 bg-white dark:bg-[#1E293B] text-slate-900 dark:text-white text-xs sm:text-sm rounded-xl border border-[#E2E8F0] dark:border-slate-700 focus:border-slate-800 dark:focus:border-sky-400 outline-none transition cursor-pointer"
                >
                  {POPULAR_TARGET_EXAMS.map(exam => (
                    <option key={exam} value={exam}>{exam}</option>
                  ))}
                </select>
              </div>

              <button
                type="submit"
                disabled={isSigningIn}
                className="w-full min-h-[42px] py-2 px-4 bg-[#0F172A] hover:bg-slate-800 dark:bg-sky-600 dark:hover:bg-sky-500 active:scale-[0.99] text-white font-semibold text-xs sm:text-sm rounded-xl transition flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 shadow-2xs"
              >
                {isSigningIn ? (
                  <span>दर्ता गर्दैछ...</span>
                ) : (
                  <span>नयाँ खाता सिर्जना गर्नुहोस्</span>
                )}
              </button>

              <div className="text-center pt-1">
                <button
                  type="button"
                  onClick={() => { setActiveTab('signin'); setError(''); }}
                  className="text-xs text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition"
                >
                  पहिले नै खाता छ? <span className="font-semibold text-sky-600 dark:text-sky-400">लगइन गर्नुहोस्</span>
                </button>
              </div>
            </form>
          )}

          {/* Simple Form: Forgot Password Tab */}
          {activeTab === 'forgot' && (
            <form onSubmit={handlePasswordReset} className="space-y-3">
              <div className="space-y-1">
                <label className="text-xs font-medium text-slate-700 dark:text-slate-300">
                  तपाईंको दर्ता भएको इमेल
                </label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="yourname@gmail.com"
                  className="w-full px-3 py-2 bg-white dark:bg-[#1E293B] text-slate-900 dark:text-white text-xs sm:text-sm rounded-xl border border-[#E2E8F0] dark:border-slate-700 focus:border-slate-800 dark:focus:border-sky-400 outline-none transition"
                />
              </div>

              <button
                type="submit"
                disabled={isSigningIn}
                className="w-full min-h-[42px] py-2 px-4 bg-[#0F172A] hover:bg-slate-800 dark:bg-sky-600 dark:hover:bg-sky-500 active:scale-[0.99] text-white font-semibold text-xs sm:text-sm rounded-xl transition flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 shadow-2xs"
              >
                {isSigningIn ? (
                  <span>पठाउँदैछ...</span>
                ) : (
                  <span>पासवर्ड रिसेट लिंक पठाउनुहोस्</span>
                )}
              </button>

              <div className="text-center pt-1">
                <button
                  type="button"
                  onClick={() => { setActiveTab('signin'); setError(''); }}
                  className="text-xs font-medium text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition"
                >
                  ← लगइनमा फर्किनुहोस्
                </button>
              </div>
            </form>
          )}

          {/* Clean, Minimalist Guest Option */}
          <div className="pt-2 border-t border-[#E2E8F0] dark:border-slate-800 text-center">
            <button
              type="button"
              id="btn-continue-as-guest"
              onClick={handleContinueAsGuest}
              className="w-full py-1.5 px-3 text-xs text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200 transition text-center cursor-pointer rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800/60"
            >
              अतिथि मोडमा पूर्वावलोकन (Preview as Guest)
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// Full-color Official Google G Icon SVG
function GoogleGIcon({ className = 'w-5 h-5' }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24">
      <path
        fill="#4285F4"
        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
      />
      <path
        fill="#34A853"
        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
      />
      <path
        fill="#FBBC05"
        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
      />
      <path
        fill="#EA4335"
        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
      />
    </svg>
  );
}

export const AuthModal = LoginModal;
export default LoginModal;
