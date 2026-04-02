import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from '../components/layout/Sidebar';
import Header from '../components/layout/Header';
import FloatingAssistant from '../components/ai/FloatingAssistant';
import { CurriculumProvider } from '../contexts/CurriculumContext';

export default function DashboardLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(true);

  return (
    <CurriculumProvider>
    <div 
      className="group/sidebar-wrapper flex flex-col w-full h-screen overflow-hidden bg-background"
      style={{ '--sidebar-width': '16rem', '--sidebar-width-icon': '4.5rem', '--top-header-height': '3.8rem', '--content-padding-top': '0.5rem' } as React.CSSProperties}
    >
      <Header sidebarOpen={sidebarOpen} onToggleSidebar={() => setSidebarOpen(prev => !prev)} />
      
      <div className="flex flex-1 min-h-[600px] min-w-0 overflow-hidden">
        {/* Sidebar - slide in/out */}
        <div
          className={`shrink-0 transition-[width] duration-200 ease-linear h-full bg-[#fbfbfc] relative z-10 border-r border-zinc-200 ${
            sidebarOpen ? 'w-[var(--sidebar-width)]' : 'w-[var(--sidebar-width-icon)]'
          }`}
        >
          <Sidebar isCollapsed={!sidebarOpen} />
        </div>

        {/* Main Content */}
        <div className="flex flex-col flex-1 min-w-0">
          <main className="flex-1 min-w-0 overflow-y-auto overflow-x-hidden flex flex-col bg-pattern-active">
            <div className="flex-1 min-h-0 pb-4 flex flex-col" style={{ paddingTop: 'var(--content-padding-top)' }}>
              <div className="flex-1 min-h-0 flex flex-col transition-opacity duration-200">
                <Outlet />
              </div>
            </div>
          </main>
        </div>
      </div>

      <FloatingAssistant />
    </div>
    </CurriculumProvider>
  );
}
