'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { MoreVertical, Plus, ArrowLeft } from 'lucide-react';
import { useAuthStore } from '@/store/authStore';
import { useRouter } from 'next/navigation';

interface Assignment {
  _id: string;
  title: string;
  subject: string;
  grade: string;
  dueDate: string;
  createdAt: string;
  status: string;
}

const FILTER_OPTIONS = [
  { label: 'All', value: 'all' },
  { label: 'Completed', value: 'completed' },
  { label: 'Generating', value: 'generating' },
  { label: 'Queued', value: 'queued' },
  { label: 'Draft', value: 'draft' },
  { label: 'Failed', value: 'failed' },
];

function EmptyAssignmentsSvg() {
  return (
    <svg
      width="293"
      height="240"
      viewBox="0 0 293 240"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path d="M143 240C209.274 240 263 186.274 263 120C263 53.7258 209.274 0 143 0C76.7258 0 23 53.7258 23 120C23 186.274 76.7258 240 143 240Z" fill="url(#paint0_linear_22474_224)" />
      <g filter="url(#filter0_d_22474_224)">
        <rect x="82.0001" y="34.5564" width="124.537" height="155.029" rx="16" fill="white" />
      </g>
      <rect x="93.0001" y="54.5564" width="50" height="9.8" rx="4.9" fill="#011625" />
      <rect x="93.0001" y="82.3564" width="100" height="9.8" rx="4.9" fill="#D5D5D5" />
      <rect x="93.0001" y="110.156" width="100" height="9.8" rx="4.9" fill="#D5D5D5" />
      <rect x="93.0001" y="137.956" width="100" height="9.8" rx="4.9" fill="#D5D5D5" />
      <rect x="93.0001" y="165.756" width="100" height="9.8" rx="4.9" fill="#D5D5D5" />

      <g filter="url(#filter1_d_22474_224)">
        <path d="M281.15 17.424H221.069C218.27 17.424 216 19.8125 216 22.7588V52.478C216 55.4243 218.27 57.8128 221.069 57.8128H281.15C283.95 57.8128 286.219 55.4243 286.219 52.478V22.7588C286.219 19.8125 283.95 17.424 281.15 17.424Z" fill="white" />
      </g>

      <path d="M231 44C234.314 44 237 41.3137 237 38C237 34.6863 234.314 32 231 32C227.686 32 225 34.6863 225 38C225 41.3137 227.686 44 231 44Z" fill="#CCC6D9" />
      <rect x="245" y="32" width="32" height="12" rx="6" fill="#D5D5D5" />

      <path d="M178.11 71.5633C212.627 71.5633 240.61 99.5455 240.61 134.063C240.61 147.539 236.344 160.017 229.091 170.224L268.364 207.716L253.605 224.841L212.904 185.988C202.958 192.666 190.989 196.563 178.11 196.563C143.592 196.563 115.61 168.581 115.61 134.063C115.61 99.5455 143.592 71.5633 178.11 71.5633ZM178.505 81.1502C149.282 81.1503 125.592 104.84 125.592 134.063C125.592 163.286 149.282 186.976 178.505 186.976C207.728 186.976 231.418 163.286 231.418 134.063C231.418 104.84 207.728 81.1502 178.505 81.1502Z" fill="#CCC6D9" />

      <path d="M178.5 188C208.6 188 233 163.823 233 134C233 104.177 208.6 80 178.5 80C148.4 80 124 104.177 124 134C124 163.823 148.4 188 178.5 188Z" fill="white" fillOpacity="0.3" />

      <path d="M187.923 134L201.112 120.862C202.348 119.562 203.025 117.835 202.999 116.047C202.974 114.259 202.248 112.552 200.976 111.287C199.704 110.023 197.986 109.301 196.187 109.276C194.388 109.251 192.65 109.923 191.342 111.151L178.124 124.289L164.935 111.151C164.3 110.484 163.537 109.95 162.691 109.58C161.845 109.211 160.933 109.014 160.009 109.001C159.085 108.988 158.168 109.159 157.312 109.504C156.456 109.85 155.678 110.362 155.024 111.012C154.371 111.661 153.855 112.434 153.508 113.285C153.16 114.136 152.988 115.048 153.001 115.967C153.014 116.885 153.212 117.791 153.584 118.632C153.955 119.473 154.493 120.231 155.165 120.862L168.376 134L155.165 147.138C154.493 147.769 153.955 148.527 153.584 149.368C153.212 150.209 153.014 151.115 153.001 152.033C152.988 152.952 153.16 153.863 153.508 154.715C153.855 155.566 154.371 156.339 155.024 156.988C155.678 157.637 156.456 158.15 157.312 158.496C158.168 158.841 159.085 159.012 160.009 158.999C160.933 158.986 161.845 158.789 162.691 158.42C163.537 158.05 164.3 157.516 164.935 156.849L178.153 143.711L191.372 156.849C192.692 158.004 194.405 158.616 196.164 158.559C197.922 158.503 199.592 157.782 200.834 156.544C202.076 155.305 202.796 153.643 202.848 151.896C202.9 150.148 202.279 148.446 201.112 147.138L187.923 134Z" fill="#FF4040" />

      <path d="M253.601 224.843L268.362 207.717L270.585 209.84C272.742 211.899 274.033 214.775 274.175 217.836C274.317 220.898 273.297 223.893 271.341 226.163C269.384 228.433 266.651 229.792 263.742 229.941C260.833 230.09 257.987 229.017 255.83 226.958L253.607 224.836L253.601 224.843Z" fill="#E1DCEB" />

      <path fillRule="evenodd" clipRule="evenodd" d="M49.3144 62.1717C49.2956 60.7456 49.1167 59.3073 48.7589 57.8592C47.5042 52.7771 41.9064 49.5144 35.9484 48.7473C29.9927 47.9802 23.7993 49.7258 21.4123 54.1465C20.047 56.674 19.8587 58.8525 20.4166 60.6891C20.9721 62.5159 22.2903 64.0304 24.0793 65.2106C29.0675 68.4978 37.8034 69.169 41.7887 67.7946C43.6319 67.1578 45.4327 66.3908 47.1864 65.513C46.1836 71.259 42.4477 76.7024 37.4619 81.6075C26.6264 92.2683 9.81169 100.36 0.654562 103.335C0.162573 103.495 -0.110516 104.04 0.0424948 104.554C0.195506 105.068 0.718088 105.356 1.21008 105.196C10.5485 102.162 27.6905 93.8984 38.7402 83.0262C44.4487 77.4105 48.5164 71.0893 49.2109 64.4435C62.1156 57.242 72.7134 44.1767 81.774 33.1815C82.1106 32.7758 82.0659 32.1587 81.6751 31.8071C81.2844 31.4579 80.6958 31.5022 80.3592 31.9103C71.6681 42.4556 61.5812 54.9997 49.3144 62.1717ZM47.4383 63.2166C47.509 61.6136 47.3582 59.9859 46.951 58.3435C45.8658 53.9449 40.8776 51.3437 35.72 50.6798C32.5585 50.2742 29.3077 50.6086 26.7583 51.7985C25.1552 52.546 23.8345 53.6302 23.0389 55.1055C21.9937 57.0404 21.7677 58.6951 22.1961 60.099C22.6245 61.5128 23.6887 62.6486 25.0752 63.5608C29.6208 66.5579 37.575 67.1948 41.2025 65.9433C43.3423 65.2057 45.4186 64.2861 47.4383 63.2166Z" fill="#011625" />

      <circle cx="278" cy="155" r="6" fill="#417BA4" />

      <path fillRule="evenodd" clipRule="evenodd" d="M51.3844 196.394C52.4552 195.993 53.582 195.459 54.4509 194.686C55.4829 193.769 55.9026 192.587 56.1845 191.343C56.5463 189.744 56.6909 188.042 57.1297 186.441C57.2921 185.846 57.6048 185.621 57.7389 185.522C58.078 185.27 58.4207 185.202 58.7432 185.228C59.1254 185.257 59.6503 185.409 59.9955 186.083C60.0448 186.18 60.1087 186.327 60.1518 186.528C60.1832 186.676 60.2035 187.137 60.2367 187.328C60.3198 187.797 60.3894 188.266 60.4546 188.737C60.6718 190.306 60.7968 191.639 61.4829 193.081C62.414 195.038 63.3469 196.235 64.6122 196.766C65.8355 197.279 67.2983 197.182 69.1672 196.78C69.3451 196.735 69.521 196.696 69.6952 196.664C70.5192 196.513 71.3069 197.082 71.4687 197.946C71.6306 198.809 71.1069 199.65 70.2903 199.84C70.1198 199.88 69.9518 199.917 69.7857 199.952C67.2601 200.61 64.3364 202.958 62.6374 205.014C62.1137 205.648 61.3469 207.421 60.5647 208.551C59.9875 209.386 59.3389 209.935 58.7943 210.13C58.4294 210.261 58.1217 210.24 57.8675 210.174C57.4983 210.079 57.1918 209.868 56.9568 209.533C56.8288 209.35 56.71 209.104 56.6534 208.791C56.6263 208.64 56.6232 208.257 56.6238 208.083C56.4644 207.506 56.2694 206.943 56.1272 206.36C55.7881 204.971 55.1229 204.092 54.3327 202.93C53.5937 201.843 52.7998 201.159 51.6361 200.614C51.4848 200.575 50.2632 200.26 49.8318 200.08C49.2017 199.815 48.9014 199.371 48.7924 199.132C48.6072 198.727 48.5881 198.373 48.6251 198.077C48.6798 197.641 48.8657 197.268 49.1955 196.967C49.3998 196.78 49.7051 196.598 50.1137 196.509C50.4294 196.44 51.2669 196.4 51.3844 196.394ZM58.5506 194.13C58.6072 194.263 58.6675 194.396 58.7315 194.531C60.0952 197.397 61.6201 198.998 63.4737 199.774L63.5358 199.799C62.2958 200.768 61.1733 201.851 60.3155 202.889C59.9623 203.317 59.4946 204.205 58.9894 205.115C58.5303 203.545 57.7795 202.435 56.8355 201.045C56.1143 199.985 55.3586 199.187 54.43 198.537C55.1506 198.148 55.838 197.692 56.4367 197.16C57.4337 196.273 58.0927 195.246 58.5506 194.13Z" fill="#417BA4" />

      <defs>
        <filter id="filter0_d_22474_224" x="52.0001" y="24.5564" width="184.537" height="215.029" filterUnits="userSpaceOnUse" colorInterpolationFilters="sRGB">
          <feFlood floodOpacity="0" result="BackgroundImageFix" />
          <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha" />
          <feOffset dy="20" />
          <feGaussianBlur stdDeviation="15" />
          <feComposite in2="hardAlpha" operator="out" />
          <feColorMatrix type="matrix" values="0 0 0 0 0.570833 0 0 0 0 0.570833 0 0 0 0 0.570833 0 0 0 0.19 0" />
          <feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow_22474_224" />
          <feBlend mode="normal" in="SourceGraphic" in2="effect1_dropShadow_22474_224" result="shape" />
        </filter>

        <filter id="filter1_d_22474_224" x="209" y="8.42395" width="96.219" height="66.3889" filterUnits="userSpaceOnUse" colorInterpolationFilters="sRGB">
          <feFlood floodOpacity="0" result="BackgroundImageFix" />
          <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha" />
          <feOffset dx="6" dy="4" />
          <feGaussianBlur stdDeviation="6.5" />
          <feComposite in2="hardAlpha" operator="out" />
          <feColorMatrix type="matrix" values="0 0 0 0 0.104618 0 0 0 0 0.465612 0 0 0 0 0.545833 0 0 0 0.09 0" />
          <feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow_22474_224" />
          <feBlend mode="normal" in="SourceGraphic" in2="effect1_dropShadow_22474_224" result="shape" />
        </filter>

        <linearGradient id="paint0_linear_22474_224" x1="142.075" y1="-39.0749" x2="144.533" y2="382.347" gradientUnits="userSpaceOnUse">
          <stop stopColor="#F2F2F2" />
          <stop offset="1" stopColor="#EFEFEF" />
        </linearGradient>
      </defs>
    </svg>
  );
}


export default function AssignmentsPage() {
  const { token, _hasHydrated } = useAuthStore();
  const router = useRouter();

  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeMenuId, setActiveMenuId] = useState<string | null>(null);
  const [filterOpen, setFilterOpen] = useState(false);
  const [activeFilter, setActiveFilter] = useState('all');
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const filterRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      setActiveMenuId(null);
      if (filterRef.current && !filterRef.current.contains(e.target as Node)) {
        setFilterOpen(false);
      }
    };

    window.addEventListener('click', handleClick);
    return () => window.removeEventListener('click', handleClick);
  }, []);

  useEffect(() => {
    if (token) fetchAssignments();
    else if (_hasHydrated) setLoading(false);
  }, [token, _hasHydrated]);

  const fetchAssignments = async () => {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api'}/assignments`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (res.ok) {
        const data = await res.json();
        setAssignments(data);
      }
    } catch {
      console.warn('Backend fetch error');
    } finally {
      setLoading(false);
    }
  };

  const deleteAssignment = async (id: string) => {
    setDeletingId(id);

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api'}/assignments/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });

      if (res.ok) {
        setAssignments(assignments.filter((a) => a._id !== id));
        window.dispatchEvent(new Event('assignmentDeleted'));
      }
    } catch (error) {
      console.error('Delete error', error);
    } finally {
      setDeletingId(null);
      setActiveMenuId(null);
    }
  };

  const filteredAssignments = assignments.filter((assignment) => {
    const matchesSearch =
      assignment.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      assignment.subject.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesFilter =
      activeFilter === 'all' || assignment.status.toLowerCase() === activeFilter;

    return matchesSearch && matchesFilter;
  });

  const formatDate = (date: string) =>
    new Date(date).toLocaleDateString('en-GB').replace(/\//g, '-');

  if (!_hasHydrated || loading) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-orange-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div
      className={`max-w-[1200px] mx-auto px-6 py-6 pb-24 ${
        assignments.length === 0 ? 'h-[calc(100vh-100px)] flex flex-col justify-center' : ''
      }`}
      style={{ fontFamily: '"Bricolage Grotesque", sans-serif' }}
    >
      {assignments.length === 0 ? (
        <div className="flex flex-col justify-center items-center gap-8 mx-auto w-full max-w-[486px] min-h-[calc(100vh-200px)] px-4">
          <div className="flex flex-col items-center gap-3 w-full">
            <div className="w-full max-w-[300px] aspect-square flex items-center justify-center">
              <EmptyAssignmentsSvg />
            </div>

            <div className="flex flex-col justify-center items-center gap-2 w-full">
              <h2 className="text-[20px] font-bold leading-[140%] tracking-[-0.04em] text-[#303030] text-center">
                No assignments yet
              </h2>

              <p className="w-full text-[16px] font-normal leading-[140%] tracking-[-0.04em] text-center text-[rgba(94,94,94,0.8)]">
                Create your first assignment to start collecting and grading student
                submissions. You can set up rubrics, define marking criteria, and let AI
                assist with grading.
              </p>
            </div>
          </div>

          <Link
  href="/create-assignment"
  className="
    box-border
    flex
    flex-row
    items-center
    justify-center
    gap-1
    w-full
    max-w-[277px]
    h-[46px]
    px-6
    py-3
    rounded-[48px]
    bg-[#181818]
    hover:bg-black
    text-white
    transition-all
    whitespace-nowrap
    shrink-0
  "
>
  
<svg
  width="20"
  height="20"
  viewBox="0 0 20 20"
  fill="none"
  xmlns="http://www.w3.org/2000/svg"
  className="shrink-0"
>
  <path
    fillRule="evenodd"
    clipRule="evenodd"
    d="M2.5 9.99996C2.5 9.53972 2.8731 9.16663 3.33333 9.16663H16.6667C17.1269 9.16663 17.5 9.53972 17.5 9.99996C17.5 10.4602 17.1269 10.8333 16.6667 10.8333H3.33333C2.8731 10.8333 2.5 10.4602 2.5 9.99996Z"
    fill="white"
  />
  <path
    fillRule="evenodd"
    clipRule="evenodd"
    d="M9.99998 2.5C10.4602 2.5 10.8333 2.8731 10.8333 3.33333L10.8333 16.6667C10.8333 17.1269 10.4602 17.5 9.99998 17.5C9.53974 17.5 9.16665 17.1269 9.16665 16.6667L9.16665 3.33333C9.16665 2.8731 9.53974 2.5 9.99998 2.5Z"
    fill="white"
  />
</svg>
            <span className="text-[16px] font-medium leading-[22px] tracking-[-0.04em] whitespace-nowrap">
              Create Your First Assignment
            </span>
          </Link>

          {/* Mobile FAB */}
          <Link
            href="/create-assignment"
            className="flex lg:hidden fixed bottom-[100px] right-6 w-[56px] h-[56px] bg-white rounded-full items-center justify-center shadow-[0_8px_30px_rgba(0,0,0,0.12)] z-40 transition-transform active:scale-95 border border-gray-100"
          >
            <Plus size={28} className="text-[#FF5000]" strokeWidth={2.5} />
          </Link>
        </div>
      ) : (
        <>
          <div className="mb-8">
            <div className="flex flex-col gap-6">
              {/* Desktop Header */}
              <div className="hidden lg:flex items-start gap-3">
                <div className="w-2 h-2 rounded-full bg-green-500 mt-2 shadow-[0_0_8px_rgba(34,197,94,0.6)]" />

                <div>
                  <h1 className="text-[22px] font-bold text-[#303030] mb-1 tracking-[-0.04em]">
                    Assignments
                  </h1>
                  <p className="text-sm text-[#5E5E5E] font-medium tracking-[-0.04em]">
                    Manage and create assignments for your classes.
                  </p>
                </div>
              </div>

              {/* Mobile Header */}
              <div className="flex lg:hidden items-center justify-center relative w-full h-[40px]">
                <button 
                  onClick={() => router.back()}
                  className="absolute left-0 w-10 h-10 flex items-center justify-center rounded-full bg-white shadow-sm"
                >
                  <ArrowLeft size={20} className="text-[#303030]" />
                </button>
                <h1 className="text-[18px] font-bold text-[#303030]">
                  Assignments
                </h1>
              </div>

              <div className="flex items-center justify-between w-full bg-white rounded-[20px] px-6 h-[64px]">
                <div className="relative shrink-0" ref={filterRef}>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setFilterOpen(!filterOpen);
                    }}
                    className="flex items-center gap-2 text-[#A9A9A9] hover:text-[#303030] font-medium text-[14px] transition-colors cursor-pointer"
                  >
                    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg" className="shrink-0">
                      <path fillRule="evenodd" clipRule="evenodd" d="M2.5 4.82153C2.5 3.53938 3.53938 2.5 4.82153 2.5H15.1785C16.4606 2.5 17.5 3.53938 17.5 4.82153C17.5 5.49412 17.2594 6.14453 16.8217 6.6552L14.4599 9.41062C13.5537 10.4679 13.0556 11.8144 13.0556 13.2069V15C13.0556 16.3807 11.9363 17.5 10.5556 17.5H9.44444C8.06373 17.5 6.94444 16.3807 6.94444 15V13.2069C6.94444 11.8144 6.44632 10.4679 5.54011 9.41062L3.17832 6.6552C2.7406 6.14453 2.5 5.49412 2.5 4.82153ZM4.82153 4.16667C4.45986 4.16667 4.16667 4.45986 4.16667 4.82153C4.16667 5.09627 4.26495 5.36195 4.44375 5.57054L6.80554 8.32597C7.97067 9.68529 8.61111 11.4166 8.61111 13.2069V15C8.61111 15.4602 8.98421 15.8333 9.44444 15.8333H10.5556C11.0158 15.8333 11.3889 15.4602 11.3889 15V13.2069C11.3889 11.4166 12.0293 9.68529 13.1945 8.32597L15.5563 5.57054C15.7351 5.36195 15.8333 5.09627 15.8333 4.82153C15.8333 4.45986 15.5401 4.16667 15.1785 4.16667H4.82153Z" fill="#A9A9A9"/>
                    </svg>
                    <span>Filter By</span>
                  </button>

                  {filterOpen && (
                    <div className="absolute left-0 mt-4 w-48 bg-white rounded-xl shadow-lg border border-gray-100 py-1 z-10">
                      {FILTER_OPTIONS.map((opt) => (
                        <button
                          key={opt.value}
                          onClick={() => {
                            setActiveFilter(opt.value);
                            setFilterOpen(false);
                          }}
                          className={`w-full text-left px-4 py-2 text-sm flex items-center justify-between hover:bg-gray-50 ${
                            activeFilter === opt.value
                              ? 'text-orange-600 font-bold bg-orange-50/50'
                              : 'text-gray-700'
                          }`}
                        >
                          {opt.label}
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                <div className="relative w-[280px]">
                  <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg" className="absolute left-4 top-1/2 -translate-y-1/2 shrink-0">
                    <path fillRule="evenodd" clipRule="evenodd" d="M9.16675 3.33335C5.94509 3.33335 3.33341 5.94503 3.33341 9.16669C3.33341 12.3883 5.94509 15 9.16675 15C12.3884 15 15.0001 12.3883 15.0001 9.16669C15.0001 5.94503 12.3884 3.33335 9.16675 3.33335ZM1.66675 9.16669C1.66675 5.02455 5.02461 1.66669 9.16675 1.66669C13.3089 1.66669 16.6667 5.02455 16.6667 9.16669C16.6667 13.3088 13.3089 16.6667 9.16675 16.6667C5.02461 16.6667 1.66675 13.3088 1.66675 9.16669Z" fill="#A9A9A9"/>
                    <path fillRule="evenodd" clipRule="evenodd" d="M13.5776 13.5775C13.903 13.252 14.4306 13.252 14.7561 13.5775L18.0894 16.9108C18.4149 17.2362 18.4149 17.7639 18.0894 18.0893C17.764 18.4147 17.2363 18.4147 16.9109 18.0893L13.5776 14.756C13.2521 14.4305 13.2521 13.9029 13.5776 13.5775Z" fill="#A9A9A9"/>
                  </svg>
                  <input
                    type="text"
                    placeholder="Search Assignment"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-11 pr-4 py-2.5 bg-[#F8F8F8] border border-[#E8E8E8] rounded-full text-sm focus:outline-none focus:border-[#ccc] transition-all placeholder-[#A9A9A9] font-medium text-[#303030]"
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 animate-fade-in">
            {filteredAssignments.map((assignment) => (
              <div
                key={assignment._id}
                className="w-full max-w-[542px] h-[162px] bg-white rounded-[24px] p-6 flex flex-col justify-center gap-12 transition-all group relative shadow-sm hover:shadow-md"
              >
                <div className="flex flex-col justify-between gap-10 w-full h-[114px]">
                  <div className="flex items-center justify-between gap-[39px] w-full h-[29px]">
                    <h3
                      className="text-[24px] font-extrabold leading-[120%] tracking-[-0.04em] text-[#303030] truncate cursor-pointer"
                      onClick={() => router.push(`/result/${assignment._id}`)}
                    >
                      {assignment.title}
                    </h3>

                    <div className="relative shrink-0">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setActiveMenuId(
                            activeMenuId === assignment._id ? null : assignment._id
                          );
                        }}
                        className="p-0 text-[#A9A9A9] hover:text-black transition-colors"
                      >
                        <MoreVertical size={24} />
                      </button>

                      {activeMenuId === assignment._id && (
                        <div className="absolute right-0 mt-2 w-40 bg-white rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.12)] py-2 z-20 overflow-hidden">
                          <button
                            onClick={() => router.push(`/result/${assignment._id}`)}
                            className="w-full text-left px-5 py-2.5 text-sm text-gray-800 hover:bg-gray-50 font-bold transition-colors"
                          >
                            View Assignment
                          </button>

                          <button
                            onClick={() => deleteAssignment(assignment._id)}
                            disabled={deletingId === assignment._id}
                            className="w-full text-left px-5 py-2.5 text-sm text-red-500 hover:bg-red-50 font-bold transition-colors disabled:opacity-50"
                          >
                            {deletingId === assignment._id ? 'Deleting...' : 'Delete'}
                          </button>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center justify-between w-full h-auto sm:h-[19px] gap-2 sm:gap-6">
                    <div className="flex items-center gap-1 sm:gap-[4px] whitespace-nowrap">
                      <span className="text-[13px] sm:text-[16px] font-extrabold leading-[120%] tracking-[-0.04em] text-[#303030]">
                        Assigned on :
                      </span>
                      <span className="text-[13px] sm:text-[16px] font-normal leading-[120%] tracking-[-0.04em] text-[rgba(0,0,0,0.5)]">
                        {formatDate(assignment.createdAt)}
                      </span>
                    </div>

                    <div className="flex items-center gap-1 sm:gap-[4px] whitespace-nowrap">
                      <span className="text-[13px] sm:text-[16px] font-extrabold leading-[120%] tracking-[-0.04em] text-[#303030]">
                        Due :
                      </span>
                      <span className="text-[13px] sm:text-[16px] font-normal leading-[120%] tracking-[-0.04em] text-[rgba(0,0,0,0.5)]">
                        {formatDate(assignment.dueDate)}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Create Assignment Button - Desktop */}
          <Link
            href="/create-assignment"
            className="hidden lg:flex fixed bottom-8 left-[calc(50%+140px)] -translate-x-1/2 items-center justify-center gap-1 bg-[#181818] hover:bg-black text-white rounded-[48px] transition-all z-40 whitespace-nowrap"
            style={{
              width: '208px',
              height: '46px',
              padding: '12px 24px',
              fontFamily: '"Bricolage Grotesque", sans-serif',
            }}
          >
            <svg
              width="20"
              height="20"
              viewBox="0 0 20 20"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className="shrink-0"
            >
              <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M2.5 9.99996C2.5 9.53972 2.8731 9.16663 3.33333 9.16663H16.6667C17.1269 9.16663 17.5 9.53972 17.5 9.99996C17.5 10.4602 17.1269 10.8333 16.6667 10.8333H3.33333C2.8731 10.8333 2.5 10.4602 2.5 9.99996Z"
                fill="white"
              />
              <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M9.99998 2.5C10.4602 2.5 10.8333 2.8731 10.8333 3.33333L10.8333 16.6667C10.8333 17.1269 10.4602 17.5 9.99998 17.5C9.53974 17.5 9.16665 17.1269 9.16665 16.6667L9.16665 3.33333C9.16665 2.8731 9.53974 2.5 9.99998 2.5Z"
                fill="white"
              />
            </svg>
            <span className="text-[16px] font-medium leading-[140%] tracking-[-0.04em] text-white text-center">
              Create Assignment
            </span>
          </Link>

          {/* Create Assignment Button - Mobile FAB */}
          <Link
            href="/create-assignment"
            className="flex lg:hidden fixed bottom-[100px] right-6 w-[56px] h-[56px] bg-white rounded-full items-center justify-center shadow-[0_8px_30px_rgba(0,0,0,0.12)] z-40 transition-transform active:scale-95 border border-gray-100"
          >
            <Plus size={28} className="text-[#FF5000]" strokeWidth={2.5} />
          </Link>
        </>
      )}
    </div>
  );
}
