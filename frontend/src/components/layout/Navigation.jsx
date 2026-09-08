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

const LINK_BASE = 'flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-150';
const LINK_ACTIVE = `${LINK_BASE} bg-[#E6F7F7] text-[#178F90] border border-[#b2e8e8]`;
const LINK_IDLE = `${LINK_BASE} text-[#425466] hover:text-[#14212B] hover:bg-[#F7F9FC]`;
const navLinkClass = ({ isActive }) => isActive ? LINK_ACTIVE : LINK_IDLE;

export function Sidebar({ mobileOpen, onClose }) {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const role = user?.role;
    const navItems = role === 'manager' ? NAV_MANAGER : NAV_WORKER;
    const handleLogout = () => { logout(); navigate('/login'); };

    const content = (
        <div className="flex flex-col h-full">
            {/* Logo */}
            <div className="flex items-center justify-between px-4 py-5 border-b border-[#E5EAF0]">
                <NavLink to="/" className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-lg bg-[#19A7A8] flex items-center justify-center">
                        <Bus size={16} className="text-white" />
                    </div>
                    <span className="font-outfit font-bold text-[#14212B] text-lg">DepotOps</span>
                </NavLink>
                <button onClick={onClose} className="lg:hidden p-1.5 rounded-lg hover:bg-[#F7F9FC] text-[#98A9BB]">
                    <X size={18} />
                </button>
            </div>

            {/* User pill */}
            <div className="px-4 py-3 border-b border-[#E5EAF0]">
                <div className="flex items-center gap-3 p-2.5 rounded-xl bg-[#F7F9FC] border border-[#E5EAF0]">
                    <div className="w-9 h-9 rounded-full bg-gradient-to-br from-[#19A7A8] to-[#2D8CFF] flex items-center justify-center text-sm font-bold text-white shrink-0">
                        {user?.name?.charAt(0)?.toUpperCase() || 'U'}
                    </div>
                    <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold text-[#14212B] truncate">{user?.name}</p>
                        <p className="text-xs text-[#6B7E92] capitalize truncate">{user?.role} · {user?.employeeId}</p>
                    </div>
                </div>
            </div>

            {/* Nav links */}
            <nav className="flex-1 overflow-y-auto px-3 py-3 space-y-0.5">
                {navItems.map((item) => {
                    const to = item.dynamic ? item.to(role) : item.to;
                    const Icon = item.icon;
                    return (
                        <NavLink key={to} to={to} className={navLinkClass} onClick={onClose} end={item.dynamic}>
                            <Icon size={17} />
                            <span>{item.label}</span>
                            <ChevronRight size={12} className="ml-auto opacity-25" />
                        </NavLink>
                    );
                })}
            </nav>

            {/* Bottom */}
            <div className="px-3 py-3 border-t border-[#E5EAF0] space-y-0.5">
                <NavLink to="/shared/profile" className={navLinkClass} onClick={onClose}>
                    <User size={17} /><span>Profile</span>
                </NavLink>
                <button onClick={handleLogout}
                    className="flex items-center gap-3 w-full px-3 py-2.5 rounded-xl text-sm font-medium text-red-500 hover:bg-red-50 transition-all">
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
                        <motion.div className="fixed inset-0 z-30 bg-black/25 backdrop-blur-sm lg:hidden"
                            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onClose} />
                        <motion.aside className="fixed top-0 left-0 h-full w-64 bg-white z-40 border-r border-[#E5EAF0] flex flex-col lg:hidden"
                            style={{ boxShadow: '6px 0 24px rgba(18,59,93,0.10)' }}
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

export function TopBar({ onMenuClick }) {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const [dropOpen, setDropOpen] = useState(false);
    const dropRef = useRef(null);
    useClickOutside(dropRef, () => setDropOpen(false));
    const unreadCount = 2;

    return (
        <header className="h-16 bg-white border-b border-[#E5EAF0] flex items-center justify-between px-4 lg:px-6 sticky top-0 z-20"
            style={{ boxShadow: '0 1px 8px rgba(18,59,93,0.06)' }}>
            <div className="flex items-center gap-3">
                <button onClick={onMenuClick} className="lg:hidden p-2 rounded-lg hover:bg-[#F7F9FC] text-[#6B7E92]">
                    <Menu size={20} />
                </button>
                <div className="hidden sm:flex items-center gap-2">
                    <Bus size={14} className="text-[#19A7A8]" />
                    <span className="text-sm text-[#6B7E92]">Central Bus Depot, Pune</span>
                </div>
            </div>

            <div className="flex items-center gap-2">
                <NavLink to="/shared/notifications"
                    className="relative p-2 rounded-xl hover:bg-[#F7F9FC] text-[#6B7E92] hover:text-[#14212B] transition-colors">
                    <Bell size={20} />
                    {unreadCount > 0 && (
                        <span className="absolute top-1 right-1 w-4 h-4 bg-[#19A7A8] text-white text-[9px] font-bold rounded-full flex items-center justify-center">
                            {unreadCount}
                        </span>
                    )}
                </NavLink>

                <div className="relative" ref={dropRef}>
                    <button onClick={() => setDropOpen((p) => !p)}
                        className="w-9 h-9 rounded-full bg-gradient-to-br from-[#19A7A8] to-[#2D8CFF] flex items-center justify-center text-sm font-bold text-white hover:ring-2 hover:ring-[#19A7A8]/40 transition-all">
                        {user?.name?.charAt(0)?.toUpperCase() || 'U'}
                    </button>
                    <AnimatePresence>
                        {dropOpen && (
                            <motion.div className="absolute right-0 top-11 w-44 bg-white border border-[#E5EAF0] rounded-xl py-1 z-50"
                                style={{ boxShadow: '0 8px 24px rgba(18,59,93,0.12)' }}
                                initial={{ opacity: 0, y: -8, scale: 0.95 }}
                                animate={{ opacity: 1, y: 0, scale: 1 }}
                                exit={{ opacity: 0, y: -4, scale: 0.95 }}
                                transition={{ duration: 0.15 }}>
                                <NavLink to="/shared/profile" onClick={() => setDropOpen(false)}
                                    className="flex items-center gap-2 px-4 py-2.5 text-sm text-[#425466] hover:text-[#14212B] hover:bg-[#F7F9FC] transition-colors">
                                    <User size={14} /> Profile
                                </NavLink>
                                <button onClick={() => { logout(); navigate('/login'); }}
                                    className="flex items-center gap-2 w-full px-4 py-2.5 text-sm text-red-500 hover:bg-red-50 transition-colors">
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

export function BottomNav() {
    const { user } = useAuth();
    const role = user?.role;
    if (role === 'manager') return null;

    const items = [
        { to: `/${role}/dashboard`, label: 'Home', icon: LayoutDashboard },
        { to: '/shared/attendance', label: 'Attendance', icon: CalendarCheck },
        { to: '/shared/leave', label: 'Leave', icon: FileCheck },
        { to: '/shared/notifications', label: 'Alerts', icon: Bell },
        { to: '/shared/profile', label: 'Me', icon: User },
    ];

    return (
        <nav className="fixed bottom-0 left-0 right-0 h-16 bg-white border-t border-[#E5EAF0] flex lg:hidden z-20"
            style={{ boxShadow: '0 -2px 12px rgba(18,59,93,0.07)' }}>
            {items.map(({ to, label, icon: Icon }) => (
                <NavLink key={to} to={to} end={to.includes('dashboard')}
                    className={({ isActive }) =>
                        `flex-1 flex flex-col items-center justify-center gap-0.5 text-xs font-medium transition-colors ${isActive ? 'text-[#19A7A8]' : 'text-[#98A9BB] hover:text-[#6B7E92]'
                        }`
                    }>
                    <Icon size={20} />
                    <span>{label}</span>
                </NavLink>
            ))}
        </nav>
    );
}
