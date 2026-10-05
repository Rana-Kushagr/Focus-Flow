import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { Sidebar } from './Sidebar';
import { Topbar } from './Topbar';
import { CommandPalette } from '../common/CommandPalette';
import { useApp } from '../../context/AppContext';
import { AmbientBackground } from '../common/AmbientBackground';

export const DashboardLayout: React.FC = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { isZenMode, userSettings } = useApp();

  return (
    <div className="relative min-h-screen bg-zinc-50 dark:bg-zinc-950 flex text-zinc-900 dark:text-zinc-100 transition-colors overflow-x-hidden">
      {/* Dynamic Ambient Background Canvas */}
      {userSettings.backgroundPattern !== 'clean' && (
        <AmbientBackground interactive={false} />
      )}
      
      <CommandPalette />

      {/* When in Zen Focus Mode, hide sidebar & topbar for maximum deep work immersion */}
      {!isZenMode && (
        <Sidebar 
          mobileOpen={mobileMenuOpen} 
          onCloseMobile={() => setMobileMenuOpen(false)} 
        />
      )}

      <div className="relative flex-1 flex flex-col min-w-0 min-h-screen overflow-x-hidden z-10">
        {!isZenMode && (
          <Topbar onToggleMobileMenu={() => setMobileMenuOpen(prev => !prev)} />
        )}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto animate-in fade-in duration-150">
          <Outlet />
        </main>
      </div>
    </div>
  );
};
