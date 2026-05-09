import { useNavigate } from 'react-router-dom';
import { Menu, LogOut, User } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth.js';
import { useUiStore } from '../../store/uiStore.js';

export default function Navbar() {
  const { user, clearAuth } = useAuth();
  const { toggleSidebar } = useUiStore();
  const navigate = useNavigate();

  const handleLogout = () => {
    clearAuth();
    navigate('/login');
  };

  return (
    <header className="h-16 bg-white border-b border-slate-200 flex items-center px-4 gap-4 sticky top-0 z-10">
      <button
        onClick={toggleSidebar}
        className="p-2 rounded-lg text-slate-500 hover:bg-slate-100 md:hidden"
      >
        <Menu size={20} />
      </button>

      <div className="flex-1" />

      {/* User info + logout */}
      <div className="flex items-center gap-3">
        <div className="hidden sm:flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-brand-100 flex items-center justify-center">
            <User size={16} className="text-brand-600" />
          </div>
          <div className="leading-tight">
            <p className="text-sm font-medium text-slate-900 leading-none">{user?.name}</p>
            <p className="text-xs text-slate-500">{user?.globalRole}</p>
          </div>
        </div>
        <button
          onClick={handleLogout}
          className="flex items-center gap-1.5 px-3 py-1.5 text-sm text-slate-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
        >
          <LogOut size={16} />
          <span className="hidden sm:inline">Logout</span>
        </button>
      </div>
    </header>
  );
}
