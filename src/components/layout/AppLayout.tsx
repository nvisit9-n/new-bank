import React from 'react';
import { useApp } from '../../context/AppContext';
import { Header } from './Header';
import { Sidebar } from './Sidebar';
import { BottomNav } from './BottomNav';

// Screens
import { HomeScreen } from '../home/HomeScreen';
import { CoursesScreen } from '../courses/CoursesScreen';
import { PublicEnterprisesScreen } from '../PublicEnterprisesScreen';
import { CurrentAffairsScreen } from '../current-affairs/CurrentAffairsScreen';
import { FreeNotesScreen } from '../notes/FreeNotesScreen';
import { PremiumMarketplace } from '../premium/PremiumMarketplace';
import { PurchasesScreen } from '../purchases/PurchasesScreen';
import { BookmarksScreen } from '../bookmarks/BookmarksScreen';
import { ProfileScreen } from '../profile/ProfileScreen';
import { VideoLecturesScreen } from '../videos/VideoLecturesScreen';
import { LeaderboardSection } from '../leaderboard/LeaderboardSection';
import { AboutUsScreen } from '../about/AboutUsScreen';
import { AdminAnalyticsDashboard } from '../admin/AdminAnalyticsDashboard';
import { DeepResearchEngine } from '../ai/DeepResearchEngine';
import { FlashcardsScreen } from '../flashcards/FlashcardsScreen';
import { IntegratedHybridPortal } from '../portal/IntegratedHybridPortal';
import { BankingStudyNotesHub } from '../notes/BankingStudyNotesHub';
import { ToolsScreen } from '../tools/ToolsScreen';
import { Footer } from './Footer';

// Readers & Modals
import { NoteReader } from '../notes/NoteReader';
import { DocumentReaderModal } from '../premium/DocumentReaderModal';
import { PurchaseModal } from '../premium/PurchaseModal';
import { SearchModal } from '../modals/SearchModal';
import { AiAssistantModal } from '../modals/AiAssistantModal';
import { NotificationsModal } from '../modals/NotificationsModal';
import { AdminModal } from '../modals/AdminModal';
import { AdminPinModal } from '../modals/AdminPinModal';
import { StudentProfileModal } from '../StudentProfileModal';
import { LoginModal } from '../auth/LoginModal';
import { MASTER_ADMIN_PIN, isUserAdmin, isOwnerAdmin } from '../../utils/sanitizer';
import { PWAInstallPrompt } from '../pwa/PWAInstallPrompt';
import { OfflineIndicator } from '../pwa/OfflineIndicator';
import { TimedYouTubePopupModal } from '../modals/TimedYouTubePopupModal';
import { LevelDashboardModal } from '../levels/LevelDashboardModal';

export interface AppLayoutProps {
  onLogout?: () => void;
}

export const AppLayout: React.FC<AppLayoutProps> = () => {
  const { 
    activeTab, 
    activeNote, 
    closeNoteReader,
    activePremiumNote,
    closePremiumDetail,
    hasPurchased,
    isProfileModalOpen,
    setIsProfileModalOpen,
    isAdminPinModalOpen,
    setIsAdminPinModalOpen,
    verifyAdminPin,
    isLoginModalOpen,
    setIsLoginModalOpen,
    closeLoginModal,
    loginModalMessage,
    user,
    setUser,
    setIsLoggedIn,
    isLevelDashboardOpen,
    closeLevelDashboard,
    levelDashboardConfig
  } = useApp();

  const [purchasingModalNote, setPurchasingModalNote] = React.useState<any>(null);

  return (
    <div className="min-h-screen bg-[#F1F5F9] dark:bg-slate-950 text-slate-800 dark:text-slate-100 flex font-sans transition-colors selection:bg-blue-600 selection:text-white">
      
      {/* Desktop Left Sidebar */}
      <Sidebar />

      {/* Main Framework Column: Header + Scrollable Screen Viewport */}
      <div className="flex-1 flex flex-col min-w-0">
        <Header />

        <main className={`flex-1 ${activeTab === 'admin' ? 'p-0 w-full' : 'p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto'} pb-32 sm:pb-24 md:pb-12`}>
          {activeTab === 'home' && <HomeScreen />}
          {activeTab === 'portal' && <IntegratedHybridPortal />}
          {activeTab === 'courses' && <CoursesScreen />}
          {activeTab === 'quiz' && <PublicEnterprisesScreen />}
          {activeTab === 'flashcards' && <FlashcardsScreen />}
          {activeTab === 'tools' && <ToolsScreen />}
          {activeTab === 'video-lectures' && <VideoLecturesScreen />}
          {activeTab === 'current-affairs' && <CurrentAffairsScreen />}
          {activeTab === 'free-notes' && <FreeNotesScreen />}
          {activeTab === 'notes-hub' && <BankingStudyNotesHub />}
          {activeTab === 'premium' && <PremiumMarketplace />}
          {activeTab === 'purchases' && <PurchasesScreen />}
          {activeTab === 'bookmarks' && <BookmarksScreen />}
          {activeTab === 'profile' && <ProfileScreen />}
          {activeTab === 'leaderboard' && <LeaderboardSection currentUser={user} />}
          {activeTab === 'deep-research' && <DeepResearchEngine />}
          {activeTab === 'about' && <AboutUsScreen />}
          {activeTab === 'admin' && isOwnerAdmin(user?.email) && <AdminAnalyticsDashboard />}
        </main>

        {/* Global Application Footer with Social Links */}
        <Footer />
      </div>

      {/* Mobile Bottom Navigation */}
      <BottomNav />

      {/* Mobile PWA Install Prompt Banner */}
      <PWAInstallPrompt />

      {/* Global Offline Network Status Indicator */}
      <OfflineIndicator />

      {/* Active Note Reader Overlay */}
      {activeNote && (
        <NoteReader 
          note={activeNote} 
          onClose={closeNoteReader} 
        />
      )}

      {/* Active Premium Detail Reader Overlay */}
      {activePremiumNote && (
        <DocumentReaderModal
          note={activePremiumNote}
          onClose={closePremiumDetail}
          onOpenPurchase={() => {
            const target = activePremiumNote;
            closePremiumDetail();
            setPurchasingModalNote(target);
          }}
        />
      )}

      {/* Purchase Modal */}
      {purchasingModalNote && (
        <PurchaseModal
          note={purchasingModalNote}
          onClose={() => setPurchasingModalNote(null)}
          onSuccess={() => setPurchasingModalNote(null)}
        />
      )}

      {/* Global Search Modal (⌘K) */}
      <SearchModal />

      {/* AI Study Assistant Modal */}
      <AiAssistantModal />

      {/* Notifications Modal */}
      <NotificationsModal />

      {/* Admin Architecture & Database Modal - STRICTLY UNMOUNTED FOR ALL ACCOUNTS EXCEPT nvisit9@gmail.com */}
      {isUserAdmin(user?.email) && <AdminModal />}

      {/* Admin Master PIN Verification Modal (RBAC Gate) - STRICTLY UNMOUNTED FOR ALL ACCOUNTS EXCEPT nvisit9@gmail.com */}
      {isUserAdmin(user?.email) && (
        <AdminPinModal
          isOpen={isAdminPinModalOpen}
          onClose={() => setIsAdminPinModalOpen(false)}
          onSuccess={() => {
            verifyAdminPin(MASTER_ADMIN_PIN);
          }}
          userEmail={user?.email}
        />
      )}

      {/* Gamified Profile Modal with Live Completion Bar and Google Lock */}
      {isProfileModalOpen && (
        <StudentProfileModal 
          isOpen={isProfileModalOpen}
          forceMandatory={false}
          onClose={() => setIsProfileModalOpen(false)}
        />
      )}

      {/* SaaS Welcome Back Login Interceptor Modal */}
      {isLoginModalOpen && (
        <LoginModal
          isOpen={isLoginModalOpen}
          onClose={closeLoginModal}
          setShowAuthModal={setIsLoginModalOpen}
          setUser={setUser}
          setIsLoggedIn={setIsLoggedIn}
          customMessage={loginModalMessage}
        />
      )}

      {/* 2-Day Timed Auto-Appearing YouTube Subscribe & PDF Unlock Gateway */}
      <TimedYouTubePopupModal />

      {/* Interactive Level Dashboard Modal (4-Tab Breakdown) */}
      {isLevelDashboardOpen && (
        <LevelDashboardModal
          isOpen={isLevelDashboardOpen}
          onClose={closeLevelDashboard}
          initialCategoryId={levelDashboardConfig?.categoryId || 'banking'}
          initialLevel={levelDashboardConfig?.level || '4'}
          initialTab={levelDashboardConfig?.activeTab ?? 0}
        />
      )}

    </div>
  );
};
