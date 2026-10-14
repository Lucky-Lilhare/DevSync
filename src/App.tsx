import React, { useEffect } from 'react';
import { WorkspaceProvider, useWorkspace } from './context/WorkspaceContext';
import { DashboardView } from './components/dashboard/DashboardView';
import { WorkspaceView } from './components/workspace/WorkspaceView';
import { ToastContainer } from './components/common/Toast';

const AppContent: React.FC = () => {
  const { currentView, joinSession, colorTheme } = useWorkspace();

  // Listen to hash changes for direct room links (e.g. #room=room-alpha-702)
  useEffect(() => {
    const handleHash = () => {
      const hash = window.location.hash;
      if (hash && hash.startsWith('#room=')) {
        const roomId = hash.replace('#room=', '');
        if (roomId) {
          joinSession(roomId);
        }
      }
    };

    handleHash();
    window.addEventListener('hashchange', handleHash);
    return () => window.removeEventListener('hashchange', handleHash);
  }, [joinSession]);

  const getThemeBackground = () => {
    switch (colorTheme) {
      case 'bexer-clean':
        return 'bg-[#151b26] text-slate-100';
      case 'emerald-matrix':
        return 'bg-[#060e0a] text-emerald-50';
      case 'sunset-coral':
        return 'bg-[#0e0711] text-rose-50';
      case 'deep-cosmic':
        return 'bg-[#060b17] text-blue-50';
      case 'cyber-iris':
      default:
        return 'bg-[#080913] text-zinc-100';
    }
  };

  return (
    <div className={`min-h-screen ${getThemeBackground()} font-sans antialiased theme-${colorTheme} transition-colors duration-300 selection:bg-[#86c33a]/30 selection:text-white`}>
      {currentView === 'dashboard' ? <DashboardView /> : <WorkspaceView />}
      <ToastContainer />
    </div>
  );
};

export default function App() {
  return (
    <WorkspaceProvider>
      <AppContent />
    </WorkspaceProvider>
  );
}
