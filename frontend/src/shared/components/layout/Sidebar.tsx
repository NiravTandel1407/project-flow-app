import React from 'react';
import { NavLink } from 'react-router-dom';
import { LayoutDashboard, FolderKanban, CheckSquare } from 'lucide-react';
import { Logo } from '@/shared/components/ui/Logo';

export const Sidebar: React.FC = () => {
  const navItems = [
    { label: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
    { label: 'Projects', path: '/projects', icon: FolderKanban },
    { label: 'Tasks', path: '/tasks', icon: CheckSquare },
  ];

  return (
    <aside className="w-64 bg-white border-r border-[#E4E7EC] flex flex-col shrink-0 min-h-screen">
      {/* Brand Header */}
      <div className="h-20 flex items-center px-6 border-b border-[#F2F4F7]">
        <Logo variant="primary" size={38} showWordmark wordmarkSize="sm" />
      </div>

      {/* Navigation Links */}
      <nav className="flex-1 px-4 py-6 space-y-1.5">
        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-semibold transition-all ${
                  isActive
                    ? 'bg-[#EEF1F9] text-[#3B5BFF]'
                    : 'text-[#475467] hover:bg-slate-50 hover:text-[#101828]'
                }`
              }
            >
              <Icon className="w-4 h-4" />
              {item.label}
            </NavLink>
          );
        })}
      </nav>

      {/* Footer Info */}
      <div className="p-4 border-t border-[#F2F4F7]">
        <div className="text-xs text-[#98A2B3] text-center font-medium">
          Project Flow v1.0.0
        </div>
      </div>
    </aside>
  );
};
