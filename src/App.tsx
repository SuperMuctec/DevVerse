import React, { useState } from 'react';
import { BrowserRouter } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { Navbar } from './components/navigation/Navbar';
import { StarField } from './components/ui/StarField';
import { MagneticCursor } from './components/ui/MagneticCursor';
import { GalaxyView } from './components/pages/GalaxyView';
import { StackBuilder } from './components/pages/StackBuilder';
import { StackShowroom } from './components/pages/StackShowroom';
import { DevLogs } from './components/pages/DevLogs';
import { CodeArena } from './components/pages/CodeArena';
import { UserPanel } from './components/pages/UserPanel';
import { UserSearch } from './components/pages/UserSearch';
import { LoginPage } from './components/auth/LoginPage';
import { RegisterPage } from './components/auth/RegisterPage';

const AppContent: React.FC = () => {
  const [currentPage, setCurrentPage] = useState('galaxy');
  const [authPage, setAuthPage] = useState<'login' | 'register' | null>(null);
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

  const renderPage = () => {
    switch (currentPage) {
      case 'galaxy':
        return <GalaxyView />;
      case 'builder':
        return <StackBuilder />;
      case 'showroom':
        return <StackShowroom />;
      case 'devlogs':
        return <DevLogs />;
      case 'arena':
        return <CodeArena />;
      case 'search':
        return <UserSearch />;
      case 'nebula':
        return <div className="min-h-screen pt-20 flex items-center justify-center">
          <div className="text-center">
            <h1 className="font-orbitron text-4xl font-bold text-cyber-yellow mb-4">The Nebula</h1>
            <p className="font-sora text-white/70">Achievement Constellation</p>
          </div>
        </div>;
      case 'settings':
        return <UserPanel />;
      default:
        return <GalaxyView />;
    }
  };

  return (
    <div className="magnetic-cursor min-h-screen bg-space-dark text-white relative overflow-x-hidden">
      <StarField />
      <MagneticCursor />
      <Navbar currentPage={currentPage} onPageChange={setCurrentPage} />
      <main className="relative z-10">
        {renderPage()}
      </main>
    </div>
  );
};

function App() {
  return (
    <BrowserRouter>
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
    </BrowserRouter>
  );
}

export default App;