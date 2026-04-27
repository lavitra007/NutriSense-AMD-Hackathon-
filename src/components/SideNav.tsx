'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function SideNav() {
  const pathname = usePathname();

  const navItems = [
    { label: 'Dashboard', icon: 'dashboard', href: '/dashboard' },
    { label: 'AI Scanner', icon: 'photoscan', href: '/scanner' },
    { label: 'NutriAI Chat', icon: 'chat_bubble', href: '/chat' },
    { label: 'Weekly Progress', icon: 'monitoring', href: '/progress' },
    { label: 'Meal Plan', icon: 'calendar_month', href: '/plan' },
  ];

  return (
    <nav className="flex flex-col fixed left-0 top-0 h-full w-64 border-r border-[#e0e3de] bg-white z-50">
      <div className="p-6 flex items-center gap-4 border-b border-[#e0e3de]">
        <div className="w-10 h-10 rounded-full bg-[#1E6B47] text-white flex items-center justify-center font-bold">
          NA
        </div>
        <div>
          <h1 className="text-xl font-bold text-[#1E6B47] tracking-tight">NutriSense AI</h1>
          <p className="text-xs font-medium text-[#6B6560]">The Empathetic Expert</p>
        </div>
      </div>
      
      <div className="p-4">
        <Link 
          href="/dashboard" 
          className="w-full py-3 rounded-lg bg-[#1E6B47] text-white font-bold text-sm hover:opacity-90 transition-all flex items-center justify-center gap-2 shadow-sm"
        >
          <span className="material-symbols-outlined text-sm">add</span>
          Log Meal
        </Link>
      </div>

      <ul className="flex-1 px-4 py-2 space-y-2 overflow-y-auto">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <li key={item.href}>
              <Link
                href={item.href}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 text-sm font-medium ${
                  isActive
                    ? 'bg-[#f1f5ef] text-[#1E6B47] border-r-4 border-[#1E6B47]'
                    : 'text-[#6B6560] hover:bg-[#f7faf5] hover:text-[#181d19]'
                }`}
              >
                <span className="material-symbols-outlined">{item.icon}</span>
                {item.label}
              </Link>
            </li>
          );
        })}
      </ul>

      <div className="p-4 border-t border-[#e0e3de] space-y-2">
        <button className="w-full flex items-center gap-3 px-4 py-2 rounded-lg text-[#6B6560] hover:bg-[#f7faf5] transition-colors text-sm font-medium">
          <span className="material-symbols-outlined">settings</span>
          Settings
        </button>
        <button className="w-full flex items-center gap-3 px-4 py-2 rounded-lg text-[#6B6560] hover:bg-[#f7faf5] transition-colors text-sm font-medium">
          <span className="material-symbols-outlined">help</span>
          Support
        </button>
      </div>
    </nav>
  );
}
