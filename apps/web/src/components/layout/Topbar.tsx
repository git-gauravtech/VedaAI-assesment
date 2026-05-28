'use client';

import { useState, useEffect } from 'react';
import { ArrowLeft, LayoutGrid, Bell, ChevronDown, User, LogOut, Sparkles } from 'lucide-react';
import { useRouter, usePathname } from 'next/navigation';
import { useAuthStore } from '@/store/authStore';

// Map of sub-pages to their parent route (for back navigation within app scope)
// Only sub-pages that you "drill into" should have a back arrow.
const PARENT_ROUTES: Record<string, string> = {
  '/create-assignment': '/',
  '/profile': '/',
};

// All top-level sidebar pages where the back arrow should NOT appear
const ROOT_PAGES = ['/', '/home', '/groups', '/toolkit', '/library'];

export default function Topbar() {
  const router = useRouter();
  const pathname = usePathname();
  const { user, _hasHydrated, logout } = useAuthStore();
  const [menuOpen, setMenuOpen] = useState(false);

  // Close menu on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (!target.closest('#topbar-user-menu')) {
        setMenuOpen(false);
      }
    };
    if (menuOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [menuOpen]);

  let breadcrumbs = 'Assignment';
  if (pathname === '/create-assignment') breadcrumbs = 'Create New';
  else if (pathname.startsWith('/result')) breadcrumbs = 'Assignment Result';
  else if (pathname.startsWith('/generating')) breadcrumbs = 'Generating';
  else if (pathname === '/profile') breadcrumbs = 'Profile Settings';
  else if (pathname === '/') breadcrumbs = 'Assignment';
  else if (pathname === '/home') breadcrumbs = 'Home';
  else if (pathname === '/groups') breadcrumbs = 'My Groups';
  else if (pathname === '/toolkit') breadcrumbs = "AI Teacher's Toolkit";
  else if (pathname === '/library') breadcrumbs = 'My Library';

  // Determine the parent route for the back button.
  // Only returns a route for sub-pages you "drill into" from a parent.
  // Returns null for all top-level sidebar items so arrow never shows there.
  const getParentRoute = (): string | null => {
    // Root / sidebar pages: no back button
    if (ROOT_PAGES.includes(pathname)) return null;
    // Explicit parent mapping for known sub-pages
    if (PARENT_ROUTES[pathname]) return PARENT_ROUTES[pathname];
    // Dynamic sub-routes: /result/xxx -> /, /generating/xxx -> /
    if (pathname.startsWith('/result/')) return '/';
    if (pathname.startsWith('/generating/')) return '/';
    // Any other unknown page: no back button (don't guess)
    return null;
  };

  if (!_hasHydrated) return null;

  return (
    <div className="h-[60px] lg:h-[72px] bg-[#F3F4F6] lg:bg-white rounded-none lg:rounded-[24px] flex items-center justify-between px-4 lg:px-6 mb-2 lg:mb-4 shrink-0 shadow-none lg:shadow-sm print:hidden">
      {/* LEFT SIDE */}
      <div className="flex items-center gap-4">
        {/* Mobile Logo (Hidden on desktop) */}
        <div className="flex lg:hidden items-center gap-2">
          <svg width="28" height="28" viewBox="19.7142 1.85519 40 40" fill="none" xmlns="http://www.w3.org/2000/svg" className="shrink-0">
            <rect x="19.7142" y="1.85519" width="40" height="40" rx="10" fill="url(#vedaBgTopbar)" />
            <path fillRule="evenodd" clipRule="evenodd" d="M42.4413 30.2153C42.4413 30.2153 43.1688 32.1573 43.8355 32.2789H35.4112C33.7141 32.2789 32.1993 31.3079 31.714 29.487L26.805 14.9207C26.805 14.9207 26.381 13.1606 25.7143 12.8571H34.3204C36.0175 12.9179 37.1691 13.5247 37.8357 15.7706L42.4413 30.2153Z" fill="white" />
            <path fillRule="evenodd" clipRule="evenodd" d="M37.0471 30.2149C37.0471 30.2149 36.3196 32.1569 35.6529 32.2784H44.0772C45.7743 32.2784 47.2891 31.3074 47.7744 29.4865L52.6231 14.9207C52.6231 14.9207 53.0471 13.1606 53.7138 12.8571H45.168C43.4709 12.8571 42.3801 13.464 41.7134 15.7098L37.0471 30.2149Z" fill="white" />
            <defs>
              <linearGradient id="vedaBgTopbar" x1="39.7142" y1="1.85519" x2="39.7142" y2="41.8552">
                <stop stopColor="#E56820" />
                <stop offset="1" stopColor="#D45E3E" />
              </linearGradient>
            </defs>
          </svg>
          <span className="font-bold text-xl text-[#303030]">VedaAI</span>
        </div>

        {/* Desktop Breadcrumbs (Hidden on mobile) */}
        <div className="hidden lg:flex items-center gap-4">
          {getParentRoute() ? (
            <button 
              onClick={() => router.push(getParentRoute()!)}
              className="w-9 h-9 flex items-center justify-center rounded-xl bg-gray-50 hover:bg-gray-100 text-gray-600 transition-colors"
            >
              <ArrowLeft size={18} />
            </button>
          ) : (
            <div className="w-9"></div>
          )}
          <div className="flex items-center gap-2">
            {pathname === '/create-assignment' ? (
              <Sparkles size={18} className="text-gray-400" />
            ) : (
              <LayoutGrid size={18} className="text-gray-400" />
            )}
            <span className="font-semibold text-[rgb(0,0,0,0.5)] text-sm">{breadcrumbs}</span>
          </div>
        </div>
      </div>

      {/* RIGHT SIDE */}
      <div className="flex items-center gap-3 lg:gap-5">
        <button className="w-10 h-10 flex lg:hidden items-center justify-center rounded-full bg-white transition-colors text-gray-600 relative">
          <Bell size={20} />
          <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
        </button>

        <button className="hidden lg:flex w-10 h-10 items-center justify-center rounded-full hover:bg-gray-100 transition-colors text-gray-600 relative">
          <Bell size={20} />
          <span className="absolute top-2.5 right-2.5 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
        </button>

        <div className="relative" id="topbar-user-menu">
          <div
            onClick={() => setMenuOpen(!menuOpen)}
            className="flex min-h-[40px] lg:min-h-[44px] min-w-fit max-w-[260px] items-center gap-2 rounded-full lg:rounded-[12px] px-1 lg:px-3 py-1 lg:py-[6px] cursor-pointer transition-colors hover:bg-gray-50 bg-white lg:bg-transparent lg:shadow-[0px_16px_48px_rgba(0,0,0,0.12),0px_32px_48px_rgba(0,0,0,0.2)]"
          >
            {/* Avatar */}
            <div className="w-8 h-8 rounded-full overflow-hidden bg-[#F6F6F6] flex items-center justify-center shrink-0">
              {user?.profileImage ? (
                <img src={user.profileImage} alt={user?.name || 'User'} className="w-full h-full object-cover" />
              ) : (
                <span className="text-orange-600 font-bold text-xs">{user?.name ? user.name.charAt(0).toUpperCase() : 'U'}</span>
              )}
            </div>

            {/* Name + Chevron (Desktop only) */}
            <div className="hidden lg:flex items-center gap-1">
              <span className="text-[16px] font-semibold leading-[19px] tracking-[-0.04em] text-[#303030] whitespace-nowrap">
                {user?.name || 'John Doe'}
              </span>
              <ChevronDown size={24} strokeWidth={1.5} className={`text-[#303030] transition-transform shrink-0 ${menuOpen ? 'rotate-180' : ''}`} />
            </div>

            {/* Hamburger (Mobile only) */}
            <div className="flex lg:hidden items-center justify-center px-1">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="3" y1="12" x2="21" y2="12"></line>
                <line x1="3" y1="6" x2="21" y2="6"></line>
                <line x1="3" y1="18" x2="21" y2="18"></line>
              </svg>
            </div>
          </div>

          {/* Dropdown */}
          {menuOpen && (
            <div className="absolute right-0 mt-2 w-52 overflow-hidden rounded-[16px] border border-[#F0F0F0] bg-white py-1 z-50 shadow-[0px_16px_48px_rgba(0,0,0,0.12),0px_32px_48px_rgba(0,0,0,0.20)]">
              <button
                onClick={() => { setMenuOpen(false); router.push('/profile'); }}
                className="flex w-full items-center gap-3 px-4 py-3 text-left text-[15px] font-medium text-[#303030] transition-colors hover:bg-[#F7F7F7]"
              >
                <User size={18} />
                View Profile
              </button>
              <div className="mx-3 h-px bg-[#F0F0F0]" />
              <button
                onClick={() => { setMenuOpen(false); logout(); router.push('/login'); }}
                className="flex w-full items-center gap-3 px-4 py-3 text-left text-[15px] font-medium text-[#E5484D] transition-colors hover:bg-red-50"
              >
                <LogOut size={18} />
                Logout
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
