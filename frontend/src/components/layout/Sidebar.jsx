import { NavLink, useNavigate } from 'react-router-dom'
import { LayoutDashboard, ArrowLeftRight, Target, LogOut, Wallet } from 'lucide-react'
import { useAuthStore } from '../../store/authStore'
import clsx from 'clsx'

const nav = [
  { to: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
  { to: '/transaksi', icon: ArrowLeftRight,  label: 'Transaksi' },
  { to: '/anggaran',  icon: Target,          label: 'Anggaran' },
]

export default function Sidebar() {
  const { user, logout } = useAuthStore()
  const navigate = useNavigate()
  const handleLogout = () => { logout(); navigate('/login') }

  return (
    <aside className="w-60 min-h-screen glass border-r border-white/5 flex flex-col p-4 gap-2">
      <div className="flex items-center gap-2.5 px-3 py-4 mb-2">
        <div className="w-8 h-8 bg-brand-500 rounded-xl flex items-center justify-center">
          <Wallet size={16} className="text-white" />
        </div>
        <span className="font-bold text-lg tracking-tight">Dompet</span>
      </div>

      <nav className="flex flex-col gap-1 flex-1">
        {nav.map(({ to, icon: Icon, label }) => (
          <NavLink key={to} to={to}
            className={({ isActive }) => clsx(
              'flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all',
              isActive ? 'bg-brand-500/15 text-brand-400' : 'text-zinc-500 hover:text-zinc-200 hover:bg-white/5'
            )}>
            <Icon size={18} />
            {label}
          </NavLink>
        ))}
      </nav>

      <div className="border-t border-white/5 pt-3 mt-2">
        <p className="px-3 text-xs text-zinc-600 mb-1">Masuk sebagai</p>
        <p className="px-3 text-sm font-medium text-zinc-300 truncate mb-3">{user?.name ?? '—'}</p>
        <button onClick={handleLogout}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-zinc-500 hover:text-red-400 hover:bg-red-500/10 transition-all">
          <LogOut size={18} />
          Keluar
        </button>
      </div>
    </aside>
  )
}
