import React, { useState, Suspense, lazy } from 'react';
import { BrowserRouter } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { NotificationProvider } from './contexts/NotificationContext';
import { Navbar } from './components/navigation/Navbar';
import { StarField } from './components/ui/StarField';
import { MagneticCursor } from './components/ui/MagneticCursor';
import { NotificationContainer } from './components/ui/NotificationContainer';
import { NotificationButton } from './components/ui/NotificationButton';
import { LoginPage } from './components/auth/LoginPage';
import { RegisterPage } from './components/auth/RegisterPage';

// Lazy load all page components
const GalaxyView = lazy(() => import('./components/pages/GalaxyView').then(module => ({ default: module.GalaxyView })));
const StackBuilder = lazy(() => import('./components/pages/StackBuilder').then(module => ({ default: module.StackBuilder })));
const StackShowroom = lazy(() => import('./components/pages/StackShowroom').then(module => ({ default: module.StackShowroom })));
const DevLogs = lazy(() => import('./components/pages/DevLogs').then(module => ({ default: module.DevLogs })));
const CodeArena = lazy(() => import('./components/pages/CodeArena').then(module => ({ default: module.CodeArena })));
const UserPanel = lazy(() => import('./components/pages/UserPanel').then(module => ({ default: module.UserPanel })));
const UserSearch = lazy(() => import('./components/pages/UserSearch').then(module => ({ default: module.UserSearch })));
const UserProfile = lazy(() => import('./components/pages/UserProfile').then(module => ({ default: module.UserProfile })));
const PlanetDetail = lazy(() => import('./components/pages/PlanetDetail').then(module => ({ default: module.PlanetDetail })));
const Nebula = lazy(() => import('./components/pages/Nebula').then(module => ({ default: module.Nebula })));

// Loading component
const PageLoader: React.FC = () => (
  <div className="min-h-screen pt-20 sm:pt-44 px-4 flex items-center justify-center">
    <div className="text-center">
      <div className="w-16 h-16 border-4 border-cyber-blue border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
      <p className="text-white/70 font-orbitron">Loading...</p>
    </div>
  </div>
);

const AppContent: React.FC = () => {
  const [currentPage, setCurrentPage] = useState('galaxy');
  const [authPage, setAuthPage] = useState<'login' | 'register' | null>(null);
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);
  const [selectedPlanetId, setSelectedPlanetId] = useState<string | null>(null);
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-space-dark flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-cyber-blue border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-white font-orbitron">Initializing DevVerse³...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    if (authPage === 'register') {
      return (
        <div className="magnetic-cursor min-h-screen bg-space-dark text-white relative overflow-x-hidden">
          <StarField />
          <MagneticCursor />
          <RegisterPage onSwitchToLogin={() => setAuthPage('login')} />
        </div>
      );
    }

    return (
      <div className="magnetic-cursor min-h-screen bg-space-dark text-white relative overflow-x-hidden">
        <StarField />
        <MagneticCursor />
        <LoginPage onSwitchToRegister={() => setAuthPage('register')} />
      </div>
    );
  }

  // Handle user profile navigation
  if (selectedUserId) {
    return (
      <div className="magnetic-cursor min-h-screen bg-space-dark text-white relative overflow-x-hidden">
        <StarField />
        <MagneticCursor />
        <Navbar currentPage={currentPage} onPageChange={setCurrentPage} />
        <NotificationContainer />
        <NotificationButton />
        <main className="relative z-10">
          <Suspense fallback={<PageLoader />}>
            <UserProfile 
              userId={selectedUserId} 
              onBack={() => setSelectedUserId(null)} 
            />
          </Suspense>
        </main>
      </div>
    );
  }

  // Handle planet detail navigation
  if (selectedPlanetId) {
    return (
      <div className="magnetic-cursor min-h-screen bg-space-dark text-white relative overflow-x-hidden">
        <StarField />
        <MagneticCursor />
        <Navbar currentPage={currentPage} onPageChange={setCurrentPage} />
        <NotificationContainer />
        <NotificationButton />
        <main className="relative z-10">
          <Suspense fallback={<PageLoader />}>
            <PlanetDetail 
              planetId={selectedPlanetId} 
              onBack={() => setSelectedPlanetId(null)}
              onNavigateToUser={setSelectedUserId}
            />
          </Suspense>
        </main>
      </div>
    );
  }

  const renderPage = () => {
    switch (currentPage) {
      case 'galaxy':
        return <GalaxyView onNavigate={setCurrentPage} />;
      case 'builder':
        return <StackBuilder />;
      case 'showroom':
        return <StackShowroom 
          onNavigateToUser={setSelectedUserId} 
          onNavigateToPlanet={setSelectedPlanetId}
        />;
      case 'devlogs':
        return <DevLogs />;
      case 'arena':
        return <CodeArena />;
      case 'search':
        return <UserSearch onNavigateToUser={setSelectedUserId} />;
      case 'nebula':
        return <Nebula />;
      case 'settings':
        return <UserPanel />;
      default:
        return <GalaxyView onNavigate={setCurrentPage} />;
    }
  };

  return (
    <div className="magnetic-cursor min-h-screen bg-space-dark text-white relative overflow-x-hidden">
      <StarField />
      <MagneticCursor />
      <Navbar currentPage={currentPage} onPageChange={setCurrentPage} />
      <NotificationContainer />
      <NotificationButton />
      <main className="relative z-10">
        <Suspense fallback={<PageLoader />}>
          {renderPage()}
        </Suspense>
      </main>
    </div>
  );
};

function App() {
  return (
    <BrowserRouter>
      <NotificationProvider>
        <AuthProvider>
          <AppContent />
          <Toaster
            position="top-right"
            toastOptions={{
              duration: 4000,
              style: {
                background: 'rgba(255, 255, 255, 0.1)',
                backdropFilter: 'blur(10px)',
                color: '#ffffff',
                border: '1px solid rgba(255, 255, 255, 0.2)',
              },
            }}
          />
        </AuthProvider>
      </NotificationProvider>
    </BrowserRouter>
  );
}

export default App;