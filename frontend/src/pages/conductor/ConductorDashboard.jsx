import { motion } from 'framer-motion';
import { Bus, Clock, MapPin, User, CheckCircle, Calendar, AlertCircle } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { fadeUp, staggerContainer } from '../../animations/variants';
import { Badge } from '../../components/ui';
import { MOCK_DUTIES, MOCK_ATTENDANCE, MOCK_NOTIFICATIONS } from '../../mock/data';

export default function ConductorDashboard() {
    const { user } = useAuth();
    const today = new Date().toISOString().split('T')[0];
    const todayDuty = MOCK_DUTIES.find((d) => d.employeeId === user?.id && d.date === today);
    const todayAtt = MOCK_ATTENDANCE.find((a) => a.employeeId === user?.id && a.date === today);
    const unread = MOCK_NOTIFICATIONS.filter((n) => n.userId === user?.id && !n.isRead);

    return (
        <motion.div variants={staggerContainer} initial="hidden" animate="visible" className="space-y-6">
            <motion.div variants={fadeUp}>
                <h1 className="text-2xl font-bold font-outfit text-white">
                    Hello, {user?.name?.split(' ')[0]} 👋
                </h1>
                <p className="text-sm text-gray-400 mt-1">{formatDate(today)}</p>
            </motion.div>

            {/* Today's assignment */}
            {todayDuty ? (
                <motion.div variants={fadeUp}
                    className="bg-gradient-to-br from-amber-400/10 to-amber-500/5 border border-amber-400/25 rounded-card p-6">
                    <p className="text-xs text-amber-300/70 uppercase tracking-widest mb-1">Today's Assignment</p>
                    <h2 className="text-2xl font-bold font-outfit text-white mb-1">Route {todayDuty.routeNo}</h2>
                    <div className="flex items-center gap-2 mb-4">
                        <MapPin size={14} className="text-amber-400" />
                        <span className="text-sm text-gray-300">{todayDuty.routeFrom} → {todayDuty.routeTo}</span>
                    </div>
                    <div className="grid grid-cols-2 gap-4 mb-4">
                        <div className="bg-navy-800/60 rounded-xl p-3">
                            <p className="text-xs text-gray-500 mb-1">Bus</p>
                            <div className="flex items-center gap-2">
                                <Bus size={14} className="text-amber-400" />
                                <span className="text-sm font-semibold text-white">{todayDuty.busReg}</span>
                            </div>
                        </div>
                        <div className="bg-navy-800/60 rounded-xl p-3">
                            <p className="text-xs text-gray-500 mb-1">Timing</p>
                            <div className="flex items-center gap-2">
                                <Clock size={14} className="text-amber-400" />
                                <span className="text-sm font-semibold text-white">{todayDuty.startTime} – {todayDuty.endTime}</span>
                            </div>
                        </div>
                    </div>
                    {todayDuty.driverName && (
                        <div className="flex items-center gap-2 text-sm text-gray-400">
                            <User size={13} /> Driver: <span className="text-white font-medium">{todayDuty.driverName}</span>
                        </div>
                    )}
                </motion.div>
            ) : (
                <motion.div variants={fadeUp} className="card p-8 text-center border border-white/06">
                    <AlertCircle size={32} className="text-gray-600 mx-auto mb-2" />
                    <p className="text-lg font-semibold text-gray-400">No assignment today</p>
                    <p className="text-sm text-gray-600">Check back or contact your manager</p>
                </motion.div>
            )}

            {/* Status row */}
            <motion.div variants={fadeUp} className="grid grid-cols-3 gap-3">
                {[
                    { label: 'Status', value: todayAtt?.status === 'present' ? 'Present' : '—', color: todayAtt?.checkIn ? 'text-green-400' : 'text-gray-500', sub: todayAtt?.checkIn || 'Not checked in' },
                    { label: 'Next Duty', value: 'Sep 6', color: 'text-amber-400', sub: 'Route 22-B' },
                    { label: 'Alerts', value: unread.length, color: 'text-teal-400', sub: 'unread' },
                ].map((s) => (
                    <div key={s.label} className="card p-4 text-center">
                        <p className="text-xs text-gray-500 mb-1">{s.label}</p>
                        <p className={`text-lg font-bold font-outfit ${s.color}`}>{s.value}</p>
                        <p className="text-xs text-gray-600 mt-0.5">{s.sub}</p>
                    </div>
                ))}
            </motion.div>

            {/* Quick actions */}
            <motion.div variants={fadeUp}>
                <h2 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-3">Quick Actions</h2>
                <div className="grid grid-cols-2 gap-3">
                    {[
                        { to: '/shared/attendance', icon: CheckCircle, label: 'Check In / Out', color: 'teal' },
                        { to: '/shared/leave', icon: Calendar, label: 'Apply Leave', color: 'amber' },
                    ].map(({ to, icon: Icon, label, color }) => {
                        const cls = { teal: 'bg-teal-500/10 border-teal-500/20 text-teal-400 hover:border-teal-500/40', amber: 'bg-amber-400/10 border-amber-400/20 text-amber-400 hover:border-amber-400/40' }[color];
                        return (
                            <Link key={to} to={to}>
                                <motion.div whileHover={{ y: -2 }} whileTap={{ scale: 0.97 }}
                                    className={`card p-5 flex flex-col items-center gap-3 border ${cls} transition-colors cursor-pointer`}>
                                    <div className="w-12 h-12 rounded-xl flex items-center justify-center bg-navy-700">
                                        <Icon size={22} className={cls.split(' ')[2]} />
                                    </div>
                                    <span className="text-sm font-semibold text-white">{label}</span>
                                </motion.div>
                            </Link>
                        );
                    })}
                </div>
            </motion.div>
        </motion.div>
    );
}

function formatDate(iso) {
    return new Date(iso + 'T00:00:00').toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });
}
