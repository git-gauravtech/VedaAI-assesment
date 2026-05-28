'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState, useEffect } from 'react';
import { useAuthStore } from '@/store/authStore';

const HomeIcon = ({ active }: { active: boolean }) => (
  <svg width="24" height="24" viewBox="0 0 20 20" fill="none">
    <path
      d="M17.5001 11.6667H11.6667V17.5H17.5001V11.6667Z"
      stroke={active ? '#303030' : '#5E5E5E'}
      strokeOpacity={active ? 1 : 0.8}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M8.33333 11.6667H2.5V17.5H8.33333V11.6667Z"
      stroke={active ? '#303030' : '#5E5E5E'}
      strokeOpacity={active ? 1 : 0.8}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M17.5001 2.5H11.6667V8.33333H17.5001V2.5Z"
      stroke={active ? '#303030' : '#5E5E5E'}
      strokeOpacity={active ? 1 : 0.8}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M8.33333 2.5H2.5V8.33333H8.33333V2.5Z"
      stroke={active ? '#303030' : '#5E5E5E'}
      strokeOpacity={active ? 1 : 0.8}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const AssignmentIcon = ({ active }: { active: boolean }) => (
  <svg width="24" height="24" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M7.5 14.1667H12.5" stroke={active ? '#ffffff' : '#5E5E5E'} strokeWidth="2" strokeLinecap="round"/>
    <path d="M7.5 10.8333H12.5" stroke={active ? '#ffffff' : '#5E5E5E'} strokeWidth="2" strokeLinecap="round"/>
    <path d="M7.5 7.5H8.33333" stroke={active ? '#ffffff' : '#5E5E5E'} strokeWidth="2" strokeLinecap="round"/>
    <path d="M4.16667 5C4.16667 3.61929 5.28596 2.5 6.66667 2.5H10.9763C11.4183 2.5 11.8423 2.67559 12.1548 2.98816L15.3452 6.17851C15.6577 6.49107 15.8333 6.915 15.8333 7.35702V15C15.8333 16.3807 14.7141 17.5 13.3333 17.5H6.66667C5.28596 17.5 4.16667 16.3807 4.16667 15V5Z" stroke={active ? '#ffffff' : '#5E5E5E'} strokeWidth="2"/>
    <path d="M10.8333 2.5V4.16667C10.8333 6.00762 12.3257 7.5 14.1667 7.5H15.8333" stroke={active ? '#ffffff' : '#5E5E5E'} strokeWidth="2"/>
  </svg>
);

const FileIcon = ({ active }: { active: boolean }) => (
  <svg width="24" height="24" viewBox="0 0 20 20" fill="none">
    <path
      d="M17.6749 13.2417C17.1448 14.4954 16.3156 15.6002 15.2598 16.4594C14.2041 17.3187 12.9539 17.9062 11.6186 18.1707C10.2833 18.4351 8.90361 18.3685 7.60005 17.9765C6.29649 17.5845 5.10878 16.8792 4.14078 15.9222C3.17277 14.9652 2.45394 13.7856 2.04712 12.4866C1.64031 11.1876 1.5579 9.80874 1.80709 8.47053C2.05629 7.13232 2.62951 5.87553 3.47663 4.81003C4.32376 3.74453 5.419 2.90277 6.6666 2.35834"
      stroke={active ? '#ffffff' : '#5E5E5E'}
      strokeOpacity={active ? 1 : 0.8}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M18.3333 10C18.3333 8.90567 18.1178 7.82204 17.699 6.81099C17.2802 5.79994 16.6664 4.88129 15.8926 4.10746C15.1187 3.33364 14.2001 2.71981 13.189 2.30102C12.178 1.88224 11.0943 1.66669 10 1.66669V10H18.3333Z"
      stroke={active ? '#ffffff' : '#5E5E5E'}
      strokeOpacity={active ? 1 : 0.8}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const ToolkitIcon = ({ active }: { active: boolean }) => (
  <svg width="24" height="24" viewBox="0 0 20 20" fill="none">
    <path
      d="M3.33325 16.25C3.33325 15.6975 3.55275 15.1676 3.94345 14.7769C4.33415 14.3862 4.86405 14.1667 5.41659 14.1667H16.6666M3.33325 16.25C3.33325 16.8026 3.55275 17.3325 3.94345 17.7232C4.33415 18.1139 4.86405 18.3334 5.41659 18.3334H16.6666V1.66669H5.41659C4.86405 1.66669 4.33415 1.88618 3.94345 2.27688C3.55275 2.66758 3.33325 3.19749 3.33325 3.75002V16.25Z"
      stroke={active ? '#ffffff' : '#5E5E5E'}
      strokeOpacity={active ? 1 : 0.8}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

export default function BottomNav() {
  const pathname = usePathname();

  const navItems = [
    {
      name: 'Home',
      href: '/home',
      icon: HomeIcon,
    },
    {
      name: 'Assignments',
      href: '/',
      icon: AssignmentIcon,
    },
    {
      name: 'Library',
      href: '/library',
      icon: FileIcon,
    },
    {
      name: 'AI Toolkit',
      href: '/toolkit',
      icon: ToolkitIcon,
    },
  ];

  return (
    <div className="fixed bottom-4 left-4 right-4 h-[72px] bg-[#1a1a1a] rounded-[24px] flex justify-around items-center px-2 z-50 lg:hidden print:hidden">
      {navItems.map((item) => {
        const isActive =
          pathname === item.href ||
          (item.name === 'Assignments' &&
            (pathname.startsWith('/result') || pathname.startsWith('/generating')));

        return (
          <Link
            key={item.name}
            href={item.href}
            className={`flex flex-col items-center justify-center w-full h-full gap-1 transition-all`}
          >
            <item.icon active={isActive} />
            <span
              className={`text-[10px] font-medium ${
                isActive ? 'text-white' : 'text-[#5E5E5E]'
              }`}
            >
              {item.name}
            </span>
          </Link>
        );
      })}
    </div>
  );
}
