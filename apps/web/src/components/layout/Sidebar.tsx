'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { Settings } from 'lucide-react';
import { useState, useEffect } from 'react';
import { useAuthStore } from '@/store/authStore';

function VedaAILogo() {
  return (
    <svg
      width="136"
      height="40"
      viewBox="19.7142 1.85519 134 40"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="block"
    >
      <rect
        x="19.7142"
        y="1.85519"
        width="40"
        height="40"
        rx="10"
        fill="url(#vedaBg)"
      />

      <g filter="url(#vedaShadow)">
        <path
          fillRule="evenodd"
          clipRule="evenodd"
          d="M42.4413 30.2153C42.4413 30.2153 43.1688 32.1573 43.8355 32.2789H35.4112C33.7141 32.2789 32.1993 31.3079 31.714 29.487L26.805 14.9207C26.805 14.9207 26.381 13.1606 25.7143 12.8571H34.3204C36.0175 12.9179 37.1691 13.5247 37.8357 15.7706L42.4413 30.2153Z"
          fill="white"
        />

        <path
          opacity="0.2"
          fillRule="evenodd"
          clipRule="evenodd"
          d="M42.4413 30.2153C42.4413 30.2153 43.1688 32.1573 43.8355 32.2789H35.4112C33.7141 32.2789 32.1993 31.3079 31.714 29.487L26.805 14.9207C26.805 14.9207 26.381 13.1606 25.7143 12.8571H34.3204C36.0175 12.9179 37.1691 13.5247 37.8357 15.7706L42.4413 30.2153Z"
          fill="url(#vedaVShade)"
        />

        <path
          fillRule="evenodd"
          clipRule="evenodd"
          d="M37.0471 30.2149C37.0471 30.2149 36.3196 32.1569 35.6529 32.2784H44.0772C45.7743 32.2784 47.2891 31.3074 47.7744 29.4865L52.6231 14.9207C52.6231 14.9207 53.0471 13.1606 53.7138 12.8571H45.168C43.4709 12.8571 42.3801 13.464 41.7134 15.7098L37.0471 30.2149Z"
          fill="white"
        />
      </g>

      <text
        x="68"
        y="31"
        fontFamily='"Bricolage Grotesque", sans-serif'
        fontSize="28"
        fontWeight="700"
        letterSpacing="-0.06em"
        fill="#303030"
      >
        VedaAI
      </text>

      <defs>
        <linearGradient
          id="vedaBg"
          x1="39.7142"
          y1="1.85519"
          x2="39.7142"
          y2="41.8552"
        >
          <stop stopColor="#E56820" />
          <stop offset="1" stopColor="#D45E3E" />
        </linearGradient>

        <linearGradient
          id="vedaVShade"
          x1="34.7749"
          y1="11.2061"
          x2="34.7749"
          y2="33.9908"
        >
          <stop stopColor="white" stopOpacity="0" />
          <stop offset="0.33" stopColor="white" stopOpacity="0" />
          <stop offset="0.76" stopColor="#0E1513" />
          <stop offset="1" stopColor="#0E1513" />
        </linearGradient>

        <filter
          id="vedaShadow"
          x="0"
          y="0"
          width="79.4281"
          height="70.8503"
          filterUnits="userSpaceOnUse"
        >
          <feDropShadow
            dx="0"
            dy="4.28571"
            stdDeviation="4.28571"
            floodOpacity="0.2"
          />
          <feDropShadow
            dx="0"
            dy="8.57143"
            stdDeviation="8.57143"
            floodOpacity="0.15"
          />
          <feDropShadow
            dx="0"
            dy="12.8571"
            stdDeviation="12.8571"
            floodOpacity="0.1"
          />
        </filter>
      </defs>
    </svg>
  );
}

const HomeIcon = ({ active }: { active: boolean }) => (
  <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
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

const MyGroupsIcon = ({ active }: { active: boolean }) => (
  <svg width="20" height="14" viewBox="0 0 20 14" fill="none">
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M18.0053 0C19.1069 0 20 0.867353 20 1.93727V12.0627C20 12.8063 19.5687 13.452 18.9357 13.7767C18.7114 13.0842 18.552 12.599 18.4574 12.321C18.403 12.1608 18.3777 12.011 18.2979 11.8819C18.2236 11.7617 18.1006 11.6182 17.9791 11.4747L17.9521 11.4428C17.5516 10.968 17.0414 10.3553 16.609 9.82839C16.1946 9.32331 15.8524 8.89639 15.7181 8.78227C15.3989 8.51105 14.9468 8.21401 14.2686 8.21401H9.66755C9.62487 8.2067 9.53035 8.1911 9.41489 8.14943C8.91888 7.97045 7.88479 7.51948 7.36702 7.30995C6.21465 6.13586 5.35029 5.25332 4.77394 4.66235C4.72638 4.61361 4.61117 4.49397 4.42827 4.30347C4.20391 4.06978 3.83109 4.04594 3.57713 4.24907C3.32508 4.45067 3.28322 4.81013 3.48253 5.06133C5.29064 7.33994 6.21755 8.50276 6.2633 8.5498C6.37468 8.66433 6.70673 8.87699 7.11436 9.1439C7.53415 9.41875 8.03354 9.75 8.41755 10.0092C8.77511 10.2505 8.97606 10.3192 9.01596 10.655C9.10394 11.3955 9.21032 12.5105 9.33511 14H1.99468C0.893058 14 0 13.1326 0 12.0627V1.93727C0 0.867353 0.893058 0 1.99468 0H18.0053ZM15.7979 11.7915C15.9066 11.7819 16.0276 11.915 16.0771 11.9594C16.2486 12.1131 16.3003 12.1721 16.4096 12.2694C16.5691 12.4114 16.7331 12.5764 16.7553 12.6051C16.9727 12.99 17.2919 13.7639 17.4073 14L15.4654 14C15.5489 13.0617 15.6021 12.459 15.625 12.1919C15.6516 11.8819 15.6891 11.8011 15.7979 11.7915ZM12.4734 3.06088C11.1955 3.06088 10.1596 4.06699 10.1596 5.30811C10.1596 6.54922 11.1955 7.55534 12.4734 7.55534C13.7513 7.55534 14.7872 6.54922 14.7872 5.30811C14.7872 4.06699 13.7513 3.06088 12.4734 3.06088Z"
      fill={active ? '#303030' : '#5E5E5E'}
      fillOpacity={active ? 1 : 0.8}
    />
  </svg>
);

const FileIcon = ({ active }: { active: boolean }) => (
  <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
    <path
      d="M17.6749 13.2417C17.1448 14.4954 16.3156 15.6002 15.2598 16.4594C14.2041 17.3187 12.9539 17.9062 11.6186 18.1707C10.2833 18.4351 8.90361 18.3685 7.60005 17.9765C6.29649 17.5845 5.10878 16.8792 4.14078 15.9222C3.17277 14.9652 2.45394 13.7856 2.04712 12.4866C1.64031 11.1876 1.5579 9.80874 1.80709 8.47053C2.05629 7.13232 2.62951 5.87553 3.47663 4.81003C4.32376 3.74453 5.419 2.90277 6.6666 2.35834"
      stroke={active ? '#303030' : '#5E5E5E'}
      strokeOpacity={active ? 1 : 0.8}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />

    <path
      d="M18.3333 10C18.3333 8.90567 18.1178 7.82204 17.699 6.81099C17.2802 5.79994 16.6664 4.88129 15.8926 4.10746C15.1187 3.33364 14.2001 2.71981 13.189 2.30102C12.178 1.88224 11.0943 1.66669 10 1.66669V10H18.3333Z"
      stroke={active ? '#303030' : '#5E5E5E'}
      strokeOpacity={active ? 1 : 0.8}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const AssignmentIcon = ({ active }: { active: boolean }) => (
  <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M7.5 14.1667H12.5" stroke="#303030" strokeWidth="2" strokeLinecap="round"/>
<path d="M7.5 10.8333H12.5" stroke="#303030" strokeWidth="2" strokeLinecap="round"/>
<path d="M7.5 7.5H8.33333" stroke="#303030" strokeWidth="2" strokeLinecap="round"/>
<path d="M4.16667 5C4.16667 3.61929 5.28596 2.5 6.66667 2.5H10.9763C11.4183 2.5 11.8423 2.67559 12.1548 2.98816L15.3452 6.17851C15.6577 6.49107 15.8333 6.915 15.8333 7.35702V15C15.8333 16.3807 14.7141 17.5 13.3333 17.5H6.66667C5.28596 17.5 4.16667 16.3807 4.16667 15V5Z" stroke="#303030" strokeWidth="2"/>
<path d="M10.8333 2.5V4.16667C10.8333 6.00762 12.3257 7.5 14.1667 7.5H15.8333" stroke="#303030" strokeWidth="2"/>
</svg>
);

const ToolkitIcon = ({ active }: { active: boolean }) => (
  <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
    <path
      d="M3.33325 16.25C3.33325 15.6975 3.55275 15.1676 3.94345 14.7769C4.33415 14.3862 4.86405 14.1667 5.41659 14.1667H16.6666M3.33325 16.25C3.33325 16.8026 3.55275 17.3325 3.94345 17.7232C4.33415 18.1139 4.86405 18.3334 5.41659 18.3334H16.6666V1.66669H5.41659C4.86405 1.66669 4.33415 1.88618 3.94345 2.27688C3.55275 2.66758 3.33325 3.19749 3.33325 3.75002V16.25Z"
      stroke={active ? '#303030' : '#5E5E5E'}
      strokeOpacity={active ? 1 : 0.8}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

export default function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();

  const { user, token, logout, _hasHydrated } = useAuthStore();

  const [activeCount, setActiveCount] = useState<number>(0);

  const fetchCount = () => {
    if (!token) return;

    fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api'}/assignments`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) {
          setActiveCount(data.length);
        }
      })
      .catch((err) =>
        console.warn('Sidebar count fetch error', err)
      );
  };

  useEffect(() => {
    fetchCount();
  }, [pathname, token]);

  useEffect(() => {
    const handleDeleted = () => fetchCount();

    window.addEventListener(
      'assignmentDeleted',
      handleDeleted
    );

    return () =>
      window.removeEventListener(
        'assignmentDeleted',
        handleDeleted
      );
  }, [token]);

  const handleLogout = () => {
    logout();
    router.push('/login');
  };

  if (!_hasHydrated) return null;

 const navItems = [
  {
    name: 'Home',
    href: '/home',
    icon: HomeIcon,
  },
  {
    name: 'My Groups',
    href: '/groups',
    icon: MyGroupsIcon,
  },
  {
    name: 'Assignments',
    href: '/',
    icon: AssignmentIcon,
    badge: activeCount > 0 ? activeCount : undefined,
  },
  {
    name: "AI Teacher's Toolkit",
    href: '/toolkit',
    icon: ToolkitIcon,
  },
  {
    name: 'My Library',
    href: '/library',
    icon: FileIcon,
  },
];

  return (
    <div
      className="
        w-[304px]
        h-full
        bg-white
        rounded-[16px]
        flex
        flex-col
        justify-between
        items-center
        p-6
        gap-8
        overflow-y-auto
        print:hidden
      "
      style={{
        boxShadow: `
          0px 16px 48px rgba(0,0,0,0.12),
          0px 32px 48px rgba(0,0,0,0.20)
        `,
      }}
    >
      {/* TOP */}
      <div className="w-[251px] flex flex-col items-center gap-14">
        
        {/* LOGO */}
        <div className="w-full flex items-center">
          <VedaAILogo />
        </div>

        {/* BUTTON */}
        <Link
          href="/create-assignment"
          className="
            relative
            flex
            h-[45px]
            w-[250px]
            items-center
            justify-center
            gap-2
            overflow-hidden
            rounded-full
            border-[4px]
            border-[#ff7a59]
            bg-[#272727]
            px-[43px]
            py-[8px]
            transition-all
            duration-200
            hover:scale-[1.01]
            active:scale-[0.98]
          "
          style={{
            boxShadow: `
              0px 16px 48px rgba(255,255,255,0.12),
              0px 32px 48px rgba(255,255,255,0.20),
              inset 0px -1px 3.5px rgba(177,177,177,0.60),
              inset 0px 0px 34.5px rgba(255,255,255,0.25)
            `,
          }}
        >
          <div className="absolute inset-x-0 top-0 h-[1px] bg-white/40" />

          <svg
  width="19"
  height="18"
  viewBox="0 0 19 18"
  fill="none"
  xmlns="http://www.w3.org/2000/svg"
  className="shrink-0"
>
  <path
    fillRule="evenodd"
    clipRule="evenodd"
    d="M4.63783 8.63783L6.18377 4H7.13246L8.6784 8.63783L13.3162 10.1838V11.1325L8.6784 12.6784L7.13246 17.3162H6.18377L4.63783 12.6784L0 11.1325V10.1838L4.63783 8.63783Z"
    fill="white"
  />

  <path
    fillRule="evenodd"
    clipRule="evenodd"
    d="M13.3878 2.38783L14.1838 0H15.1325L15.9284 2.38783L18.3162 3.18377V4.13246L15.9284 4.9284L15.1325 7.31623H14.1838L13.3878 4.9284L11 4.13246V3.18377L13.3878 2.38783Z"
    fill="white"
  />
</svg>

          <span
            className="
              flex
              items-center
              text-white
              text-[16px]
              font-medium
              leading-[28px]
              tracking-[-0.04em]
              whitespace-nowrap
            "
            style={{
              fontFamily:
                'Inter, sans-serif',
            }}
          >
            Create Assignment
          </span>
        </Link>

        {/* MENU */}
        <div className="w-[251px] flex flex-col gap-2">
          {navItems.map((item) => {
            const isActive =
              pathname === item.href ||
              (item.name ===
                'Assignments' &&
                (pathname.startsWith(
                  '/result'
                ) ||
                  pathname.startsWith(
                    '/generating'
                  )));

            return (
              <Link
                key={item.name}
                href={item.href}
                className={`
                  flex
                  items-center
                  justify-between
                  px-3
                  py-2
                  rounded-[8px]
                  transition-all
                  h-[40px]

                  ${
                    isActive
                      ? 'bg-[#F0F0F0]'
                      : 'hover:bg-[#F7F7F7]'
                  }
                `}
              >
                <div className="flex items-center gap-2">
                  <item.icon active={isActive} />

                  <span
                    className={`
                      text-[16px]
                      leading-[140%]
                      tracking-[-0.04em]

                      ${
                        isActive
                          ? 'text-[#303030] font-medium'
                          : 'text-[#5E5E5ECC] font-normal'
                      }
                    `}
                    style={{
                      fontFamily:
                        '"Bricolage Grotesque", sans-serif',
                    }}
                  >
                    {item.name}
                  </span>
                </div>

                {item.badge !==
                  undefined && (
                  <div
  className="
    flex
    items-center
    justify-center
    px-[10px]
    h-[20px]
    min-w-[37px]
    rounded-[48px]
    bg-[#FF5623]
    text-white
    font-[family-name:var(--font-bricolage)]
    font-semibold
    text-[14px]
    leading-[140%]
    tracking-[-0.04em]
    whitespace-nowrap
  "
>
  {item.badge}
</div>
                )}
              </Link>
            );
          })}
        </div>
      </div>

      {/* BOTTOM */}
      <div className="w-[256px] flex flex-col gap-2">
        
        {/* SETTINGS */}
        <Link
          href="/profile"
          className="
            flex
            items-center
            gap-2
            px-3
            py-2
            rounded-[8px]
            h-[38px]
            hover:bg-[#F7F7F7]
            transition-all
          "
        >
          <Settings
            size={20}
            className="text-[#5E5E5ECC]"
          />

          <span
            className="
              text-[16px]
              leading-[140%]
              tracking-[-0.04em]
              text-[#5E5E5ECC]
            "
            style={{
              fontFamily:
                '"Bricolage Grotesque", sans-serif',
            }}
          >
            Settings
          </span>
        </Link>

        {/* PROFILE CARD */}
        <Link
          href="/profile"
          className="
            w-full
            bg-[#F0F0F0]
            rounded-[16px]
            p-3
            hover:bg-[#ebebeb]
            transition-all
          "
        >
          <div className="flex items-center gap-2">
            
            <div className="w-[59px] h-[56px] rounded-[12px] overflow-hidden shrink-0 bg-orange-100">
              {user?.profileImage ? (
                <img
                  src={user.profileImage}
                  alt={user.name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-orange-600 font-bold text-lg">
                  {user?.name
                    ?.charAt(0)
                    .toUpperCase() || 'T'}
                </div>
              )}
            </div>

            <div className="flex flex-col">
              <p
                className="
                  text-[16px]
                  font-bold
                  leading-[140%]
                  tracking-[-0.04em]
                  text-[#303030]
                "
                style={{
                  fontFamily:
                    '"Bricolage Grotesque", sans-serif',
                }}
              >
                {user?.schoolName ||
                  'School Name'}
              </p>

              <p
                className="
                  text-[14px]
                  font-normal
                  leading-[140%]
                  tracking-[-0.04em]
                  text-[#5E5E5E]
                "
                style={{
                  fontFamily:
                    '"Bricolage Grotesque", sans-serif',
                }}
              >
                {user?.city || 'City'}
              </p>
            </div>
          </div>
        </Link>
      </div>
    </div>
  );
}