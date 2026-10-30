import React from 'react';
import { useAuth } from '@/modules/auth/AuthContext';
import { LogOut, User as UserIcon } from 'lucide-react';
import { Button } from '@/shared/components/ui/Button';

export const Navbar: React.FC = () => {
  const { user, logout } = useAuth();

  return (
    <header className="h-16 bg-white border-b border-slate-200 px-6 flex items-center justify-between">
      <div className="flex items-center gap-2">
        <h2 className="text-sm font-medium text-slate-500">Overview</h2>
      </div>

      <div className="flex items-center gap-4">
        {user && (
          <div className="flex items-center gap-2 text-sm text-slate-700">
            <div className="w-8 h-8 rounded-full bg-slate-100 border border-slate-200 flex items-center justify-center text-slate-600">
              <UserIcon className="w-4 h-4" />
            </div>
            <div className="hidden sm:block text-left">
              <p className="font-medium text-xs text-slate-800 leading-tight">
                {user.full_name || user.email}
              </p>
              <p className="text-[11px] text-slate-400">{user.email}</p>
            </div>
          </div>
        )}

        <Button
          variant="ghost"
          size="sm"
          onClick={logout}
          className="text-slate-500 hover:text-rose-600"
          title="Sign out"
        >
          <LogOut className="w-4 h-4 mr-1.5" />
          <span className="hidden sm:inline">Logout</span>
        </Button>
      </div>
    </header>
  );
};

