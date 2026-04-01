import { Outlet } from 'react-router-dom';
import Sidebar from '../components/layout/Sidebar';
import Header from '../components/layout/Header';
import FloatingAssistant from '../components/ai/FloatingAssistant';

export default function DashboardLayout() {
  return (
    <div 
      className="group/sidebar-wrapper flex w-full h-screen overflow-hidden bg-background"
      style={{ '--sidebar-width': '16rem', '--sidebar-width-icon': '4.5rem' } as React.CSSProperties}
    >
      <Sidebar />
      <div 
        className="flex flex-col h-screen min-h-[600px] w-full" 
        style={{ '--top-header-height': '3.8rem', '--content-padding-top': '0.5rem' } as React.CSSProperties}
      >
        <Header />
        <main className="flex-1 min-w-0 overflow-hidden flex flex-col bg-pattern-active">
          <div className="flex-1 min-h-0 pb-4" style={{ paddingTop: 'var(--content-padding-top)' }}>
            <div className="h-full transition-opacity duration-200">
              <Outlet />
            </div>
          </div>
        </main>
      </div>
      <FloatingAssistant />
    </div>
  );
}
