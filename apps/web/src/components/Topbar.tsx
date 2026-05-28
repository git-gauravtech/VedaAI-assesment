import { Bell, ArrowLeft, ChevronDown } from 'lucide-react';
import Link from 'next/link';

export default function Topbar() {
  return (
    <div className="h-20 bg-[#F3F4F6] flex items-center justify-between px-8 sticky top-0 z-10 w-full">
      <div className="flex items-center gap-4">
        <Link href="/" className="w-8 h-8 flex items-center justify-center hover:bg-gray-200 rounded-full transition-colors">
          <ArrowLeft size={20} className="text-gray-600" />
        </Link>
        <div className="flex items-center gap-2 text-sm text-gray-500">
          <span className="flex items-center justify-center w-5 h-5 opacity-50">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="7" height="7"></rect><rect x="14" y="3" width="7" height="7"></rect><rect x="14" y="14" width="7" height="7"></rect><rect x="3" y="14" width="7" height="7"></rect></svg>
          </span>
          Assignment
        </div>
      </div>

      <div className="flex items-center gap-6">
        <button className="relative text-gray-600 hover:text-gray-900 transition-colors">
          <Bell size={20} />
          <span className="absolute 0 top-0 right-0 w-2 h-2 bg-orange-500 rounded-full"></span>
        </button>

        <div className="flex items-center gap-3 cursor-pointer bg-white px-3 py-1.5 rounded-full shadow-sm hover:shadow transition-shadow">
          <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center overflow-hidden">
             <div className="w-full h-full bg-blue-100"></div>
          </div>
          <span className="text-sm font-medium text-gray-800">John Doe</span>
          <ChevronDown size={16} className="text-gray-500" />
        </div>
      </div>
    </div>
  );
}
