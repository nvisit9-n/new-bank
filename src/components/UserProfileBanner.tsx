import React, { useRef, useState } from 'react';
import { 
  Camera, 
  MapPin, 
  Flame, 
  Sparkles, 
  CheckCircle2, 
  ShieldCheck, 
  Trophy, 
  User, 
  Edit3, 
  Mail, 
  Phone, 
  Building2, 
  Zap,
  Crown
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { DbService } from '../services/dbService';

export interface UserProfileBannerProps {
  onEditProfile?: () => void;
  onStartChallenge?: () => void;
  onOpenNotes?: () => void;
}

export const UserProfileBanner: React.FC<UserProfileBannerProps> = ({
  onEditProfile,
  onStartChallenge,
  onOpenNotes
}) => {
  const { user, refreshUser, addToast, setIsProfileModalOpen, setActiveTab, openLoginModal } = useApp();
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [isUploadingPhoto, setIsUploadingPhoto] = useState<boolean>(false);

  const isGuest = !user?.email || Boolean(user?.isGuest);

  // Dynamic user session bindings:
  const emailPrefix = user?.email ? user.email.split('@')[0] : '';
  const displayName = isGuest 
    ? 'अतिथि (Guest User)' 
    : (user?.displayName || (user?.name && user.name !== 'विद्यार्थी' ? user.name : (emailPrefix || 'परीक्षार्थी')));
  const userEmail = isGuest ? '' : (user?.email || '');
  const photoURL = user?.photoURL || user?.avatarUrl || (isGuest ? '/default-avatar.png' : `https://ui-avatars.com/api/?name=${encodeURIComponent(displayName)}&background=0B2046&color=fff&size=256`);

  const userLevel = user?.level ?? (Math.floor((user?.xp || 100) / 500) + 1);
  const targetExam = user?.targetExam || 'नेपाल राष्ट्र बैंक (NRB) - तह ४/५';
  const streakDays = user?.streak ?? 1;
  const currentXp = user?.xp ?? 100;
  const nextLevelXp = userLevel * 500;
  const xpProgressPercent = Math.min(100, Math.round(((currentXp % 500) / 500) * 100));
  const isPro = Boolean(user && DbService.isUserPro(user));

  // Handle direct photo change via Camera overlay button
  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      addToast('कृपया मान्य फोटो (JPG, PNG, WebP) छान्नुहोस्।', 'error');
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      addToast('फोटोको साइज ५ MB भन्दा कम हुनुपर्छ।', 'warning');
      return;
    }

    setIsUploadingPhoto(true);

    const reader = new FileReader();
    reader.onload = async (event) => {
      const rawDataUrl = event.target?.result as string;

      // Downscale for optimal storage footprint and instant rendering
      const img = new Image();
      img.onload = async () => {
        try {
          const canvas = document.createElement('canvas');
          const maxDim = 240;
          let w = img.width;
          let h = img.height;

          if (w > h) {
            if (w > maxDim) {
              h = Math.round((h * maxDim) / w);
              w = maxDim;
            }
          } else {
            if (h > maxDim) {
              w = Math.round((w * maxDim) / h);
              h = maxDim;
            }
          }

          canvas.width = w;
          canvas.height = h;
          const ctx = canvas.getContext('2d');
          let finalPhotoUrl = rawDataUrl;

          if (ctx) {
            ctx.drawImage(img, 0, 0, w, h);
            finalPhotoUrl = canvas.toDataURL('image/jpeg', 0.88);
          }

          await DbService.saveStudentProfile({ avatarUrl: finalPhotoUrl, photoURL: finalPhotoUrl });
          refreshUser();
          addToast('तपाईंको प्रोफाइल फोटो सफलतापूर्वक अद्यावधिक भयो!', 'success');
        } catch {
          addToast('फोटो सुरक्षित गर्न सकिएन, कृपया पुनः प्रयास गर्नुहोस्।', 'error');
        } finally {
          setIsUploadingPhoto(false);
        }
      };

      img.onerror = () => {
        setIsUploadingPhoto(false);
        addToast('फोटो लोड गर्न सकिएन।', 'error');
      };

      img.src = rawDataUrl;
    };

    reader.onerror = () => {
      setIsUploadingPhoto(false);
      addToast('फाइल पढ्न सकिएन।', 'error');
    };

    reader.readAsDataURL(file);
  };

  const handleOpenEdit = () => {
    if (onEditProfile) {
      onEditProfile();
    } else {
      setIsProfileModalOpen(true);
    }
  };

  return (
    <div 
      className="user-profile-hero user-hero-card rounded-3xl bg-white p-6 sm:p-8 relative overflow-hidden transition-all shadow-md"
      style={{
        backgroundColor: '#FFFFFF',
        border: '1px solid #E2E8F0',
        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.08), 0 2px 4px -2px rgba(0, 0, 0, 0.05)',
        color: '#0F172A'
      }}
    >
      {/* Subtle decorative background glow */}
      <div className="absolute top-0 right-0 w-80 h-80 bg-blue-50/60 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20" />
      <div className="absolute bottom-0 left-1/3 w-64 h-64 bg-amber-50/40 rounded-full blur-2xl pointer-events-none" />

      {/* Top Banner Row: Streak Badge & Cloud Sync Indicator */}
      <div className="flex flex-wrap items-center justify-between gap-3 mb-5 relative z-10">
        
        {/* Streak Counter Badge */}
        <div 
          className="inline-flex items-center gap-2 bg-amber-50 text-[#0F172A] text-[13px] px-3.5 py-1.5 rounded-full font-black border border-amber-300 shadow-2xs"
          style={{ color: '#0F172A' }}
        >
          <Flame className="w-4 h-4 text-amber-600 fill-amber-600" />
          <span style={{ color: '#0F172A' }}>{streakDays} दिने निरन्तर अध्ययन Streak</span>
        </div>

        {/* Cloud Synced & Exam Module Badge */}
        <div className="flex items-center gap-2 text-[13px] font-bold text-[#0F172A]">
          <span 
            className="flex items-center gap-1.5 bg-slate-100 px-3 py-1 rounded-full border border-slate-200 text-[#0F172A] shadow-2xs font-bold"
            style={{ color: '#0F172A', backgroundColor: '#F1F5F9', borderColor: '#E2E8F0' }}
          >
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
            <span style={{ color: '#0F172A' }}>७७ जिल्ला लाइभ सिंक</span>
          </span>
          <span 
            className="hidden sm:inline bg-slate-100 px-2.5 py-1 rounded-full border border-slate-200 text-[#0F172A] shadow-2xs font-bold"
            style={{ color: '#0F172A', backgroundColor: '#F1F5F9', borderColor: '#E2E8F0' }}
          >
            तह ४ र ५ विशेष
          </span>
        </div>
      </div>

      {/* Main Profile Content: Avatar, Details & XP */}
      <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6 relative z-10">
        
        {/* Left: Avatar with Camera Overlay & Name/Details */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-6 w-full lg:w-auto">
          
          {/* Avatar with Camera Overlay Icon */}
          <div className="relative shrink-0 group self-center sm:self-auto">
            <div className="w-20 h-20 sm:w-22 sm:h-22 rounded-full overflow-hidden border-2 border-white shadow-sm object-cover bg-blue-50 flex items-center justify-center ring-2 ring-blue-500/30">
              {photoURL ? (
                <img
                  src={photoURL}
                  alt={displayName}
                  referrerPolicy="no-referrer"
                  className="w-full h-full rounded-full object-cover transition-transform duration-200 group-hover:scale-105"
                />
              ) : (
                <User className="w-10 h-10 text-slate-400" />
              )}
            </div>

            {/* Level Badge Overlay (Top Left) */}
            <span className="absolute -top-1 -left-1 px-2.5 py-0.5 rounded-full bg-[#1E40AF] text-white font-black text-[10px] shadow-xs uppercase tracking-wider">
              Lvl {userLevel}
            </span>

            {/* Camera / Edit Badge Overlay (Bottom Right) */}
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="absolute -bottom-1 -right-1 rounded-full p-2 bg-white border-2 border-slate-200 text-[#0F172A] shadow-md hover:bg-slate-100 transition-transform hover:scale-110 active:scale-95 cursor-pointer"
              title="फोटो परिवर्तन गर्नुहोस्"
            >
              <Camera className="w-3.5 h-3.5 text-[#0F172A]" />
            </button>

            {/* Hidden Photo Upload Input */}
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handlePhotoUpload}
              className="hidden"
            />
          </div>

          {/* Student Profile Identity Details */}
          <div className="space-y-2 text-center sm:text-left w-full sm:w-auto">
            <div>
              <h1 
                className="text-[24px] sm:text-[28px] font-black tracking-tight leading-tight hero-user-name"
                style={{ color: '#0F172A' }}
              >
                {displayName ? `नमस्ते, ${displayName}! 👋` : 'नमस्ते, परीक्षार्थी! 👋'}
              </h1>
            </div>

            {/* Target Exam, Province & District Badges */}
            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
              {isPro ? (
                <span 
                  className="hero-pill inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-100 text-[#0F172A] text-[13px] font-bold border border-slate-300 shadow-2xs"
                  style={{ backgroundColor: '#F1F5F9', borderColor: '#CBD5E1', color: '#0F172A' }}
                >
                  <Crown className="w-3.5 h-3.5 fill-amber-500 text-amber-600" />
                  <span style={{ color: '#0F172A', fontWeight: 700 }}>PRO MEMBER</span>
                </span>
              ) : (
                <button
                  type="button"
                  onClick={() => setActiveTab('premium')}
                  className="hero-pill inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-[#0F172A] text-[13px] font-bold border border-slate-300 shadow-2xs transition cursor-pointer"
                  style={{ backgroundColor: '#F1F5F9', borderColor: '#CBD5E1', color: '#0F172A' }}
                >
                  <Sparkles className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
                  <span style={{ color: '#0F172A', fontWeight: 700 }}>Unlock PRO</span>
                </button>
              )}

              <span 
                className="hero-pill inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-100 text-[#0F172A] text-[13px] font-bold border border-slate-300 shadow-2xs"
                style={{ backgroundColor: '#F1F5F9', borderColor: '#CBD5E1', color: '#0F172A' }}
              >
                <Building2 className="w-3.5 h-3.5 text-[#0F172A]" style={{ color: '#0F172A' }} />
                <span style={{ color: '#0F172A', fontWeight: 700 }}>{targetExam}</span>
              </span>

              {user.district && (
                <span 
                  className="hero-pill inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-100 text-[#0F172A] text-[13px] font-bold border border-slate-300 shadow-2xs"
                  style={{ backgroundColor: '#F1F5F9', borderColor: '#CBD5E1', color: '#0F172A' }}
                >
                  <MapPin className="w-3.5 h-3.5 text-rose-600" />
                  <span style={{ color: '#0F172A', fontWeight: 700 }}>{user.district}</span>
                </span>
              )}
            </div>

            {/* Contact Information (Email & Phone) as input pills with subtle bg-slate-100 & border-slate-300 */}
            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2 text-[13px] pt-1">
              {isGuest ? (
                <div className="flex items-center gap-2 pt-1">
                  <button
                    type="button"
                    onClick={() => openLoginModal()}
                    className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-[#1E40AF] hover:bg-blue-800 text-white font-bold text-xs shadow-xs active:scale-95 transition cursor-pointer"
                  >
                    <User className="w-3.5 h-3.5" />
                    <span>लगइन गर्नुहोस्</span>
                  </button>
                  <span 
                    className="text-[13px] font-bold hidden sm:inline"
                    style={{ color: '#0F172A' }}
                  >
                    (स्कोर र प्रगति सुरक्षित गर्न खाता खोल्नुहोस्)
                  </span>
                </div>
              ) : (
                <>
                  {userEmail && (
                    <div 
                      className="hero-pill inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-100 border border-slate-300 text-[#0F172A] text-[13px] font-bold shadow-2xs"
                      style={{ backgroundColor: '#F1F5F9', borderColor: '#CBD5E1', color: '#0F172A' }}
                    >
                      <Mail className="w-3.5 h-3.5 text-[#0F172A] shrink-0" style={{ color: '#0F172A' }} />
                      <span className="truncate max-w-[220px] sm:max-w-none font-bold" style={{ color: '#0F172A', fontWeight: 700 }}>{userEmail}</span>
                    </div>
                  )}
                  {user.phone && (
                    <div 
                      className="hero-pill inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-100 border border-slate-300 text-[#0F172A] text-[13px] font-mono font-bold shadow-2xs"
                      style={{ backgroundColor: '#F1F5F9', borderColor: '#CBD5E1', color: '#0F172A' }}
                    >
                      <Phone className="w-3.5 h-3.5 text-[#0F172A] shrink-0" style={{ color: '#0F172A' }} />
                      <span className="font-bold" style={{ color: '#0F172A', fontWeight: 700 }}>{user.phone}</span>
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
        </div>

        {/* Right: Clean Light XP Bar & Study Streak Card with Explicit Borders & Elevation */}
        <div 
          className="hero-xp-card w-full lg:w-72 space-y-3 rounded-2xl p-4 sm:p-5"
          style={{
            backgroundColor: '#F8FAFC',
            border: '1px solid #CBD5E1',
            boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.06), 0 2px 4px -2px rgba(0, 0, 0, 0.04)',
            color: '#0F172A'
          }}
        >
          <div className="flex items-center justify-between text-[13px] font-bold">
            <span 
              className="flex items-center gap-1.5 font-bold xp-title"
              style={{ color: '#0F172A' }}
            >
              <Zap className="w-4 h-4 text-amber-500 fill-amber-500" />
              <span style={{ color: '#0F172A', fontWeight: 700 }}>अध्ययन XP: {currentXp}</span>
            </span>
            <span 
              className="text-[12px] font-bold xp-sub"
              style={{ color: '#0F172A', fontWeight: 700 }}
            >
              Lvl {userLevel + 1} को लागि
            </span>
          </div>

          {/* XP Progress Bar */}
          <div 
            className="w-full h-2.5 rounded-full overflow-hidden"
            style={{ backgroundColor: '#E2E8F0', border: '1px solid #CBD5E1' }}
          >
            <div 
              className="h-full bg-[#1E40AF] rounded-full transition-all duration-500"
              style={{ width: `${xpProgressPercent}%` }}
            />
          </div>

          <div className="flex items-center justify-between text-[12px] font-bold">
            <span style={{ color: '#0F172A', fontWeight: 700 }}>प्रगति: {xpProgressPercent}%</span>
            <span style={{ color: '#0F172A', fontWeight: 700 }}>{nextLevelXp - (currentXp % 500)} XP बाँकी</span>
          </div>

          {/* Profile Action Button (Min 44px touch target) */}
          {isGuest ? (
            <button
              type="button"
              id="dashboard-guest-login-btn"
              onClick={() => openLoginModal()}
              className="w-full min-h-[44px] py-2.5 px-3 rounded-xl bg-[#1E40AF] hover:bg-blue-800 active:scale-[0.99] text-white font-bold text-xs flex items-center justify-center gap-2 transition cursor-pointer shadow-xs"
              title="Google वा इमेलबाट लगइन गर्नुहोस्"
            >
              <User className="w-3.5 h-3.5" />
              <span>लगइन / खाता खोल्नुहोस्</span>
            </button>
          ) : (
            <button
              type="button"
              id="dashboard-edit-profile-btn"
              onClick={handleOpenEdit}
              className="w-full min-h-[44px] py-2.5 px-3 rounded-xl bg-white hover:bg-slate-50 active:scale-[0.99] text-[#0F172A] font-bold text-xs flex items-center justify-center gap-2 transition cursor-pointer border border-slate-200 shadow-2xs"
              style={{ color: '#0F172A', borderColor: '#E2E8F0' }}
              title="प्रोफाइल सम्पादन गर्नुहोस् (Edit Profile)"
            >
              <Edit3 className="w-3.5 h-3.5 text-[#1E40AF]" />
              <span style={{ color: '#0F172A' }}>प्रोफाइल सम्पादन गर्नुहोस्</span>
            </button>
          )}
        </div>
      </div>

      {/* Quick Action Navigation Buttons (Mobile-First 48px+ touch targets) */}
      <div className="mt-6 pt-5 border-t border-slate-200 grid grid-cols-1 sm:grid-cols-2 lg:flex lg:flex-wrap items-center gap-3 relative z-10">
        
        {/* Primary CTA button styled in clean Navy/Blue */}
        <button
          type="button"
          onClick={() => {
            if (onStartChallenge) {
              onStartChallenge();
            } else {
              setActiveTab('quiz');
            }
          }}
          className="min-h-[48px] bg-[#1E40AF] hover:bg-blue-800 text-white font-bold text-xs sm:text-sm px-5 py-3 rounded-2xl transition shadow-xs flex items-center justify-center gap-2 cursor-pointer active:scale-98"
        >
          <CheckCircle2 className="w-4 h-4 shrink-0" />
          <span>आजको १० प्रश्न Challenge</span>
        </button>

        <button
          type="button"
          onClick={() => {
            if (onOpenNotes) {
              onOpenNotes();
            } else {
              setActiveTab('free-notes');
            }
          }}
          className="min-h-[48px] bg-white hover:bg-slate-50 active:scale-98 text-slate-800 font-bold text-xs sm:text-sm px-4 py-3 rounded-2xl transition border border-slate-200 shadow-2xs flex items-center justify-center gap-2 cursor-pointer"
        >
          <Sparkles className="w-4 h-4 text-[#1E40AF] shrink-0" />
          <span>AI परीक्षा नोट्स जेनेरेटर</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('leaderboard')}
          className="min-h-[48px] sm:col-span-2 lg:col-span-1 lg:ml-auto text-xs text-slate-600 hover:text-slate-900 font-bold transition flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl hover:bg-white border border-transparent hover:border-slate-200 shadow-2xs"
        >
          <Trophy className="w-4 h-4 text-amber-500 shrink-0" />
          <span>सम्पूर्ण रिपोर्ट तथा श्रेणी हेर्नुहोस् &rarr;</span>
        </button>
      </div>

    </div>
  );
};
