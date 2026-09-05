import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Bus, Calendar, Users, BarChart3, Map, FileCheck, Bell, LogIn, UserPlus, Mail } from 'lucide-react';

const NAV_GROUPS = [
    {
        heading: 'Platform',
        links: [
            { label: 'Duty Allocation', icon: Calendar },
            { label: 'Attendance', icon: Users },
            { label: 'Leave Management', icon: FileCheck },
            { label: 'Bus Fleet', icon: Bus },
            { label: 'Routes', icon: Map },
            { label: 'Reports', icon: BarChart3 },
            { label: 'Notifications', icon: Bell },
        ],
    },
    {
        heading: 'Roles',
        links: [
            { label: 'Depot Manager', icon: Users },
            { label: 'Bus Driver', icon: Bus },
            { label: 'Conductor', icon: Users },
        ],
    },
    {
        heading: 'Account',
        links: [
            { to: '/login', label: 'Login', icon: LogIn },
            { to: '/signup', label: 'Sign Up', icon: UserPlus },
        ],
    },
];

export default function FooterSection() {
    return (
        <footer className="bg-[#04080f] border-t border-white/05">
            {/* Main footer content */}
            <div className="max-w-7xl mx-auto px-6 py-16">
                <div className="grid grid-cols-1 md:grid-cols-5 gap-10">

                    {/* Brand column — 2 wide */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }} transition={{ duration: 0.5 }}
                        className="md:col-span-2">
                        <div className="flex items-center gap-3 mb-4">
                            <div className="w-10 h-10 rounded-xl bg-teal-500 flex items-center justify-center">
                                <Bus size={20} className="text-white" />
                            </div>
                            <div>
                                <p className="font-outfit font-black text-white text-xl">DepotOps</p>
                                <p className="text-white/30 text-[10px] uppercase tracking-widest">Smart Workforce Management</p>
                            </div>
                        </div>
                        <p className="text-slate-400 text-sm leading-relaxed max-w-xs mb-6">
                            A complete digital platform for bus depot workforce management — purpose-built for modern Indian depots.
                        </p>
                        {/* Built with badge */}
                        <div className="flex flex-wrap gap-2">
                            {['React', 'Vite', 'Tailwind CSS', 'Framer Motion'].map((t) => (
                                <span key={t} className="px-2.5 py-1 rounded-full bg-white/04 border border-white/08 text-white/30 text-[10px] font-mono">
                                    {t}
                                </span>
                            ))}
                        </div>
                    </motion.div>

                    {/* Nav groups */}
                    {NAV_GROUPS.map((group, gi) => (
                        <motion.div
                            key={group.heading}
                            initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }} transition={{ duration: 0.5, delay: gi * 0.08 }}>
                            <p className="text-white/50 text-[10px] uppercase tracking-[0.2em] font-bold mb-4">
                                {group.heading}
                            </p>
                            <ul className="space-y-2.5">
                                {group.links.map(({ label, icon: Icon, to }) => (
                                    <li key={label}>
                                        {to ? (
                                            <Link to={to}
                                                className="flex items-center gap-2 text-slate-400 hover:text-teal-400 text-sm transition-colors group">
                                                <Icon size={13} className="group-hover:text-teal-400 transition-colors shrink-0" />
                                                {label}
                                            </Link>
                                        ) : (
                                            <span className="flex items-center gap-2 text-slate-500 text-sm">
                                                <Icon size={13} className="shrink-0 text-slate-600" />{label}
                                            </span>
                                        )}
                                    </li>
                                ))}
                            </ul>
                        </motion.div>
                    ))}
                </div>
            </div>

            {/* Bottom bar */}
            <div className="border-t border-white/05">
                <div className="max-w-7xl mx-auto px-6 py-5 flex flex-col sm:flex-row items-center justify-between gap-3">
                    <p className="text-white/20 text-xs">
                        © 2026 DepotOps · Smart Workforce & Operations Management System for Bus Depots
                    </p>
                    <div className="flex items-center gap-6">
                        <Link to="/login" className="text-white/25 hover:text-teal-400 text-xs transition-colors">Login</Link>
                        <Link to="/signup" className="text-white/25 hover:text-teal-400 text-xs transition-colors">Sign Up</Link>
                    </div>
                </div>
            </div>
        </footer>
    );
}
