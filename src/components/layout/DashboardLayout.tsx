import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { Sidebar } from './Sidebar';
import { Topbar } from './Topbar';
import { CommandPalette } from '../common/CommandPalette';
import { useApp } from '../../context/AppContext';

export const DashboardLayout: React.FC = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { isZenMode, userSettings } = useApp();

  const patternClass = 
    userSettings.backgroundPattern === 'grid' 
      ? 'bg-grid-pattern opacity-60' 
      : userSettings.backgroundPattern === 'dots' 
      ? 'bg-dot-pattern opacity-50' 
      : '';

  return (
    <div className="relative min-h-screen bg-zinc-50 dark:bg-zinc-950 flex text-zinc-900 dark:text-zinc-100 transition-colors">
      {/* Background Architectural Pattern */}
      {patternClass && (
        <div className={`absolute inset-0 ${patternClass} [mask-image:radial-gradient(ellipse_70%_60%_at_50%_0%,#000_75%,transparent_100%)] pointer-events-none`} />
      )}
      <div className="absolute inset-x-0 top-0 h-[400px] ambient-spotlight pointer-events-none" />
      <CommandPalette />

      {/* When in Zen Focus Mode, hide sidebar & topbar for maximum deep work immersion */}
      {!isZenMode && (
        <Sidebar 
          mobileOpen={mobileMenuOpen} 
          onCloseMobile={() => setMobileMenuOpen(false)} 
        />
      )}

      <div className="relative flex-1 flex flex-col min-w-0 min-h-screen overflow-x-hidden">
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
