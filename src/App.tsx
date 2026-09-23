import React, { useEffect, useState } from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Dashboard } from './components/Dashboard';
import { SplashScreen } from './components/common/SplashScreen';
import { isOwnerAdmin } from './utils/sanitizer';

function AdminRouteHandler() {
  const { user, setActiveTab, addToast } = useApp();

  useEffect(() => {
    const checkAdminRoute = () => {
      const path = window.location.pathname.toLowerCase().replace(/\/+$/, '');
      const hash = window.location.hash.toLowerCase();
      const search = window.location.search.toLowerCase();
      
      const isAdminRoute = (
        path === '/admin' || 
        path.startsWith('/admin/') || 
        hash === '#admin' || 
        hash.startsWith('#admin/') ||
        search.includes('admin=true')
      );

      if (isAdminRoute) {
        if (!isOwnerAdmin(user?.email)) {
          // Strictly redirect unauthorized user or guest to Home (/)
          try {
            window.history.replaceState(null, '', '/');
          } catch {}
          setActiveTab('home');
          addToast('Unauthorized Access: प्रशासक ड्यासबोर्डमा पहुँच केवल आधिकारिक एप ओनरका लागि मात्र उपलब्ध छ।', 'error');
        } else {
          setActiveTab('admin');
        }
      }
    };

    checkAdminRoute();
    window.addEventListener('popstate', checkAdminRoute);
    window.addEventListener('hashchange', checkAdminRoute);
    return () => {
      window.removeEventListener('popstate', checkAdminRoute);
      window.removeEventListener('hashchange', checkAdminRoute);
    };
  }, [user?.email, setActiveTab, addToast]);

  return null;
}

function MainApp() {
  const [showSplash, setShowSplash] = useState<boolean>(() => {
    if (typeof window === 'undefined') return false;
    try {
      const shown = sessionStorage.getItem('btn_splash_shown');
      return !shown;
    } catch {
      return true;
    }
  });

  const handleSplashComplete = () => {
    setShowSplash(false);
    try {
      sessionStorage.setItem('btn_splash_shown', 'true');
    } catch {}
  };

  return (
    <>
      {showSplash && (
        <SplashScreen onComplete={handleSplashComplete} durationMs={2000} />
      )}
      <AdminRouteHandler />
      <Dashboard />
    </>
  );
}

export function App() {
  return (
    <AppProvider>
      <MainApp />
    </AppProvider>
  );
}

export default App;
