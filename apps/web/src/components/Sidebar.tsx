import Link from 'next/link';
import { LayoutGrid, Users, FileText, Bot, BookOpen, Settings } from 'lucide-react';
import Image from 'next/image';

export default function Sidebar() {
  return (
    <div className="w-[280px] h-screen bg-white shadow-[2px_0_8px_rgba(0,0,0,0.05)] flex flex-col pt-6 pb-6 px-4 shrink-0 rounded-tr-3xl rounded-br-3xl z-10 sticky top-0">
      <div className="flex items-center gap-3 px-2 mb-10">
        <div className="w-10 h-10 bg-[#FF5722] rounded-xl flex items-center justify-center text-white font-bold text-xl">
          V
        </div>
        <span className="text-xl font-bold tracking-tight text-gray-900">VedaAI</span>
      </div>

      <button className="bg-[#2D2D2D] hover:bg-black text-white font-medium py-3.5 px-4 rounded-full flex items-center justify-center gap-2 mb-8 shadow-md transition-colors border border-gray-700 w-full relative overflow-hidden group">
        <span className="absolute inset-0 bg-gradient-to-r from-[#FF5722]/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></span>
        <span className="relative z-10 flex items-center gap-2">
          <span className="text-xl leading-none">+</span>
          Create Assignment
        </span>
      </button>

      <nav className="flex-1 space-y-1">
        <SidebarItem icon={<LayoutGrid size={20} />} label="Home" href="/" />
        <SidebarItem icon={<Users size={20} />} label="My Groups" href="/groups" />
        <SidebarItem icon={<FileText size={20} />} label="Assignments" href="/assignments" active badge="10" />
        <SidebarItem icon={<Bot size={20} />} label="AI Teacher's Toolkit" href="/toolkit" />
        <SidebarItem icon={<BookOpen size={20} />} label="My Library" href="/library" badge="32" />
      </nav>

      <div className="mt-auto space-y-4">
        <SidebarItem icon={<Settings size={20} />} label="Settings" href="/settings" />
        
        <div className="bg-gray-100 rounded-2xl p-3 flex items-center gap-3 cursor-pointer hover:bg-gray-200 transition-colors">
          <div className="w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center overflow-hidden shrink-0">
             <div className="w-full h-full bg-orange-300"></div>
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold text-gray-900 truncate">Delhi Public School</p>
            <p className="text-xs text-gray-500 truncate">Bokaro Steel City</p>
          </div>
        </div>
      </div>
    </div>
  );
}

function SidebarItem({ icon, label, href, active, badge }: { icon: React.ReactNode, label: string, href: string, active?: boolean, badge?: string }) {
  return (
    <Link href={href} className={`flex items-center justify-between px-4 py-3 rounded-xl transition-colors ${active ? 'bg-gray-100 text-gray-900 font-medium' : 'text-gray-500 hover:bg-gray-50 hover:text-gray-900'}`}>
      <div className="flex items-center gap-3">
        {icon}
        <span className="text-sm">{label}</span>
      </div>
      {badge && (
        <span className="bg-[#FF5722] text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
          {badge}
        </span>
      )}
    </Link>
  );
}
