'use client';

import { usePathname, useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/authStore';
import { useEffect } from 'react';
import Sidebar from './Sidebar';
import Topbar from './Topbar';
import BottomNav from './BottomNav';

export default function ClientLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const { token, _hasHydrated } = useAuthStore();

  const isAuthPage = pathname === '/login' || pathname === '/signup';

  useEffect(() => {
    if (_hasHydrated) {
      if (!token && !isAuthPage) {
        router.push('/login');
      } else if (token && isAuthPage) {
        router.push('/');
      }
    }
  }, [token, _hasHydrated, pathname, router, isAuthPage]);

  if (!_hasHydrated) {
    return (
      <div className="flex h-screen w-screen items-center justify-center bg-[#F3F4F6]">
        <div className="w-10 h-10 border-4 border-orange-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  // If on login or signup, render full page without layout wrappers
  if (isAuthPage) {
    return <div className="h-full w-full">{children}</div>;
  }

  // Avoid flashing protected content before redirect
  if (!token && !isAuthPage) {
    return null; 
  }

  return (
    <div className="flex h-[100dvh] w-full overflow-hidden bg-[#EAEAEA] lg:p-4 gap-4 print:block print:h-auto print:overflow-visible print:bg-white print:p-0 print:static">
      {/* Sidebar - always visible on desktop */}
      <div className="shrink-0 hidden lg:block print:hidden">
        <Sidebar />
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 h-full overflow-hidden relative lg:rounded-[24px] print:block print:w-full print:h-auto print:overflow-visible print:rounded-none print:static">
        <div className="print:hidden">
          <Topbar />
        </div>
        
        <main className="flex-1 overflow-y-auto w-full pb-28 lg:pb-0 print:block print:w-full print:h-auto print:overflow-visible print:static">
          {children}
        </main>
      </div>

      <BottomNav />
    </div>
  );
}
