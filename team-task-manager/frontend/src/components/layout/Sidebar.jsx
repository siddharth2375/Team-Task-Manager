import { NavLink } from 'react-router-dom';
import { LayoutDashboard, FolderKanban, X } from 'lucide-react';
import { useUiStore } from '../../store/uiStore.js';
import { cn } from '../../lib/utils.js';

const navItems = [
  { to: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { to: '/projects', label: 'Projects', icon: FolderKanban },
];

export default function Sidebar() {
  const { sidebarOpen, setSidebar } = useUiStore();

  return (
    <>
      {/* Mobile backdrop */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/30 z-20 md:hidden"
          onClick={() => setSidebar(false)}
        />
      )}

      <aside
        className={cn(
          'fixed top-0 left-0 h-full bg-white border-r border-slate-200 z-30 flex flex-col',
          'transition-transform duration-200',
          'w-64',
          sidebarOpen ? 'translate-x-0' : '-translate-x-full',
          'md:translate-x-0 md:static md:z-auto'
        )}
      >
        {/* Logo */}
        <div className="flex items-center justify-between px-5 h-16 border-b border-slate-100">
          <span className="font-bold text-brand-600 text-lg tracking-tight">
            TaskManager
          </span>
          <button
            className="md:hidden p-1 rounded text-slate-400 hover:text-slate-600"
            onClick={() => setSidebar(false)}
          >
            <X size={18} />
          </button>
        </div>

        {/* Nav */}
        <nav className="flex-1 py-4 px-3 space-y-1">
          {navItems.map(({ to, label, icon: Icon }) => (
            <NavLink
              key={to}
              to={to}
              className={({ isActive }) =>
                cn(
                  'flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors',
                  isActive
                    ? 'bg-brand-50 text-brand-700'
                    : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                )
              }
            >
              <Icon size={18} />
              {label}
            </NavLink>
          ))}
        </nav>
      </aside>
    </>
  );
}
