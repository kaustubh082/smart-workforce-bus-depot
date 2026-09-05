import { useState, useRef } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../../context/AuthContext';
import { useClickOutside } from '../../hooks';
import {
    LayoutDashboard, Users, Calendar, Clock, Bus, Map, FileCheck, BarChart3,
    Bell, User, LogOut, Menu, X, ChevronRight, GripVertical,
    History, CalendarCheck
} from 'lucide-react';

const NAV_MANAGER = [
    { to: '/manager/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { to: '/manager/employees', label: 'Employees', icon: Users },
    { to: '/manager/duty-allocation', label: 'Duty Allocation', icon: Calendar },
    { to: '/manager/shifts', label: 'Shift Mgmt', icon: Clock },
    { to: '/manager/roster', label: 'Roster', icon: GripVertical },
    { to: '/manager/buses', label: 'Bus Fleet', icon: Bus },
    { to: '/manager/routes', label: 'Routes', icon: Map },
    { to: '/manager/leave-approvals', label: 'Leave Approvals', icon: FileCheck },
    { to: '/manager/attendance', label: 'Attendance', icon: CalendarCheck },
    { to: '/manager/reports', label: 'Reports', icon: BarChart3 },
];

const NAV_WORKER = [
    { to: (role) => `/${role}/dashboard`, label: 'Dashboard', icon: LayoutDashboard, dynamic: true },
    { to: '/shared/attendance', label: 'Attendance', icon: CalendarCheck },
    { to: '/shared/leave', label: 'My Leaves', icon: FileCheck },
    { to: '/shared/duty-history', label: 'Duty History', icon: History },
    { to: '/shared/notifications', label: 'Notifications', icon: Bell },
];

// =========================================
// Sidebar
// =========================================
export function Sidebar({ mobileOpen, onClose }) {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const role = user?.role;
    const navItems = role === 'manager' ? NAV_MANAGER : NAV_WORKER;

    const handleLogout = () => { logout(); navigate('/login'); };

    const navLinkClass = ({ isActive }) =>
        `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-150 ${isActive
            ? 'bg-teal-50 text-teal-700 border border-teal-100'
            : 'text-slate-600 hover:text-navy-900 hover:bg-surface-100'
        }`;

    const content = (
        <div className="flex flex-col h-full">
            {/* Logo */}
            <div className="flex items-center justify-between px-4 py-5 border-b border-surface-200">
                <NavLink to="/" className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-lg bg-teal-500 flex items-center justify-center">
                        <Bus size={16} className="text-white" />
                    </div>
                    <span className="font-outfit font-bold text-navy-900 text-lg">DepotOps</span>
                </NavLink>
                <button onClick={onClose} className="lg:hidden p-1 rounded-lg hover:bg-surface-100 text-slate-400">
                    <X size={18} />
                </button>
            </div>

            {/* User pill */}
            <div className="px-4 py-4 border-b border-surface-200">
                <div className="flex items-center gap-3 p-2.5 rounded-xl bg-surface-50 border border-surface-200">
                    <div className="w-9 h-9 rounded-full bg-teal-500 flex items-center justify-center text-sm font-bold text-white shrink-0">
                        {user?.name?.charAt(0)?.toUpperCase() || 'U'}
                    </div>
                    <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold text-navy-900 truncate">{user?.name}</p>
                        <p className="text-xs text-slate-500 capitalize truncate">{user?.role} · {user?.employeeId}</p>
                    </div>
                </div>
            </div>

            {/* Nav links */}
            <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-0.5">
                {navItems.map((item) => {
                    const to = item.dynamic ? item.to(role) : item.to;
                    const Icon = item.icon;
                    return (
                        <NavLink key={to} to={to} className={navLinkClass} onClick={onClose} end={item.dynamic}>
                            <Icon size={17} />
                            <span>{item.label}</span>
                            <ChevronRight size={13} className="ml-auto opacity-30" />
                        </NavLink>
                    );
                })}
            </nav>

            {/* Bottom */}
            <div className="px-3 py-4 border-t border-surface-200 space-y-0.5">
                <NavLink to="/shared/profile" className={navLinkClass} onClick={onClose}>
                    <User size={17} /><span>Profile</span>
                </NavLink>
                <button onClick={handleLogout}
                    className="flex items-center gap-3 w-full px-3 py-2.5 rounded-lg text-sm font-medium text-red-500 hover:bg-red-50 hover:text-red-600 transition-all">
                    <LogOut size={17} /><span>Logout</span>
                </button>
            </div>
        </div>
    );

    return (
        <>
            <aside className="sidebar hidden lg:flex flex-col">{content}</aside>
            <AnimatePresence>
                {mobileOpen && (
                    <>
                        <motion.div className="fixed inset-0 z-30 bg-black/30 backdrop-blur-sm lg:hidden"
                            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                            onClick={onClose}
                        />
                        <motion.aside className="fixed top-0 left-0 h-full w-64 bg-white z-40 border-r border-surface-200 flex flex-col lg:hidden shadow-modal"
                            initial={{ x: -264 }} animate={{ x: 0 }} exit={{ x: -264 }}
                            transition={{ type: 'spring', stiffness: 300, damping: 30 }}>
                            {content}
                        </motion.aside>
                    </>
                )}
            </AnimatePresence>
        </>
    );
}

// =========================================
// TopBar
// =========================================
export function TopBar({ onMenuClick }) {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const [dropOpen, setDropOpen] = useState(false);
    const dropRef = useRef(null);
    useClickOutside(dropRef, () => setDropOpen(false));
    const unreadCount = 2;

    return (
        <header className="h-16 bg-white border-b border-surface-200 flex items-center justify-between px-4 lg:px-6 sticky top-0 z-20 shadow-soft">
            <div className="flex items-center gap-3">
                <button onClick={onMenuClick} className="lg:hidden p-2 rounded-lg hover:bg-surface-100 text-slate-500">
                    <Menu size={20} />
                </button>
                <div className="hidden sm:flex items-center gap-2">
                    <Bus size={15} className="text-teal-500" />
                    <span className="text-sm text-slate-500">Central Bus Depot, Pune</span>
                </div>
            </div>

            <div className="flex items-center gap-2">
                <NavLink to="/shared/notifications"
                    className="relative p-2 rounded-lg hover:bg-surface-100 text-slate-500 hover:text-navy-900 transition-colors">
                    <Bell size={20} />
                    {unreadCount > 0 && (
                        <span className="absolute top-1 right-1 w-4 h-4 bg-teal-500 text-white text-[9px] font-bold rounded-full flex items-center justify-center">
                            {unreadCount}
                        </span>
                    )}
                </NavLink>

                <div className="relative" ref={dropRef}>
                    <button onClick={() => setDropOpen((p) => !p)}
                        className="w-9 h-9 rounded-full bg-teal-500 flex items-center justify-center text-sm font-bold text-white hover:bg-teal-600 transition-all hover:ring-2 hover:ring-teal-300">
                        {user?.name?.charAt(0)?.toUpperCase() || 'U'}
                    </button>
                    <AnimatePresence>
                        {dropOpen && (
                            <motion.div className="absolute right-0 top-11 w-44 bg-white border border-surface-200 rounded-card shadow-modal py-1 z-50"
                                initial={{ opacity: 0, y: -8, scale: 0.95 }}
                                animate={{ opacity: 1, y: 0, scale: 1 }}
                                exit={{ opacity: 0, y: -4, scale: 0.95 }}
                                transition={{ duration: 0.15 }}>
                                <NavLink to="/shared/profile" onClick={() => setDropOpen(false)}
                                    className="flex items-center gap-2 px-4 py-2.5 text-sm text-slate-600 hover:text-navy-900 hover:bg-surface-50 transition-colors">
                                    <User size={14} /> Profile
                                </NavLink>
                                <button onClick={() => { logout(); navigate('/login'); }}
                                    className="flex items-center gap-2 w-full px-4 py-2.5 text-sm text-red-500 hover:text-red-600 hover:bg-red-50 transition-colors">
                                    <LogOut size={14} /> Logout
                                </button>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </div>
        </header>
    );
}

// =========================================
// BottomNav (mobile, worker)
// =========================================
export function BottomNav() {
    const { user } = useAuth();
    const role = user?.role;
    if (role === 'manager') return null;

    const items = [
        { to: `/${role}/dashboard`, label: 'Home', icon: LayoutDashboard },
        { to: '/shared/attendance', label: 'Mark', icon: CalendarCheck },
        { to: '/shared/leave', label: 'Leave', icon: FileCheck },
        { to: '/shared/notifications', label: 'Alerts', icon: Bell },
        { to: '/shared/profile', label: 'Me', icon: User },
    ];

    return (
        <nav className="fixed bottom-0 left-0 right-0 h-16 bg-white border-t border-surface-200 flex lg:hidden z-20 shadow-[0_-2px_8px_rgba(0,0,0,0.06)]">
            {items.map((item) => {
                const Icon = item.icon;
                return (
                    <NavLink key={item.to} to={item.to} end={item.to.includes('dashboard')}
                        className={({ isActive }) =>
                            `flex-1 flex flex-col items-center justify-center gap-0.5 text-xs transition-colors ${isActive ? 'text-teal-600' : 'text-slate-400 hover:text-slate-600'
                            }`
                        }
                    >
                        <Icon size={20} />
                        <span>{item.label}</span>
                    </NavLink>
                );
            })}
        </nav>
    );
}
