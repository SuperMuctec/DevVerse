import React, { useState } from 'react';
import { BrowserRouter } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { NotificationProvider } from './contexts/NotificationContext';
import { Navbar } from './components/navigation/Navbar';
import { StarField } from './components/ui/StarField';
import { MagneticCursor } from './components/ui/MagneticCursor';
import { NotificationContainer } from './components/ui/NotificationContainer';
import { GalaxyView } from './components/pages/GalaxyView';
import { StackBuilder } from './components/pages/StackBuilder';
import { StackShowroom } from './components/pages/StackShowroom';
import { DevLogs } from './components/pages/DevLogs';
import { CodeArena } from './components/pages/CodeArena';
import { UserPanel } from './components/pages/UserPanel';
import { UserSearch } from './components/pages/UserSearch';
import { UserProfile } from './components/pages/UserProfile';
import { PlanetDetail } from './components/pages/PlanetDetail';
import { Nebula } from './components/pages/Nebula';
import { LoginPage } from './components/auth/LoginPage';
import { RegisterPage } from './components/auth/RegisterPage';

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
          <p className="text-white font-jetbrains">Initializing DevVerse³...</p>
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
        <main className="relative z-10">
          <UserProfile 
            userId={selectedUserId} 
            onBack={() => setSelectedUserId(null)} 
          />
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
        <main className="relative z-10">
          <PlanetDetail 
            planetId={selectedPlanetId} 
            onBack={() => setSelectedPlanetId(null)}
            onNavigateToUser={setSelectedUserId}
          />
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
      <main className="relative z-10">
        {renderPage()}
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
                fontFamily: 'JetBrains Mono, monospace',
              },
            }}
          />
        </AuthProvider>
      </NotificationProvider>
    </BrowserRouter>
  );
}

export default App;