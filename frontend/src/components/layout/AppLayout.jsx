import { useState } from 'react';
import { Outlet, Navigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../../context/AuthContext';
import { Sidebar, TopBar, BottomNav } from './Navigation';

// ── Route guards ──────────────────────────────────────────────────────────────
export function RequireAuth() {
    const { user } = useAuth();
    if (!user) return <Navigate to="/login" replace />;
    return <Outlet />;
}

export function RequireRole({ roles }) {
    const { user } = useAuth();
    if (!user || !roles.includes(user.role)) return <Navigate to={`/${user?.role || ''}/dashboard`} replace />;
    return <Outlet />;
}

// ── App layout shell ──────────────────────────────────────────────────────────
export function AppLayout() {
    const [mobileOpen, setMobileOpen] = useState(false);

    return (
        <div className="flex min-h-screen bg-surface-50 font-inter">
            {/* Sidebar */}
            <Sidebar mobileOpen={mobileOpen} onClose={() => setMobileOpen(false)} />

            {/* Main area */}
            <div className="flex-1 flex flex-col lg:ml-[260px] min-h-screen">
                <TopBar onMenuClick={() => setMobileOpen(true)} />

                <motion.main
                    className="flex-1 px-4 lg:px-8 py-6 max-w-7xl w-full mx-auto pb-20 lg:pb-8"
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, ease: 'easeOut' }}
                >
                    <Outlet />
                </motion.main>
            </div>

            {/* Mobile bottom navigation */}
            <BottomNav />
        </div>
    );
}
