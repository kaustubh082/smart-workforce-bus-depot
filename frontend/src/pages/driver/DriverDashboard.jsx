import { motion } from 'framer-motion';
import { Bus, Clock, MapPin, User, CheckCircle, AlertCircle, Calendar } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { fadeUp, staggerContainer } from '../../animations/variants';
import { Card, Badge, Button } from '../../components/ui';
import { MOCK_DUTIES, MOCK_ATTENDANCE, MOCK_NOTIFICATIONS } from '../../mock/data';

function TodayDutyCard({ duty }) {
    if (!duty) {
        return (
            <motion.div variants={fadeUp}
                className="card p-8 flex flex-col items-center justify-center gap-3 text-center border border-surface-200">
                <AlertCircle size={32} className="text-slate-300" />
                <p className="text-lg font-semibold text-slate-500">No duty assigned today</p>
                <p className="text-sm text-slate-400">Contact your depot manager for assignment</p>
            </motion.div>
        );
    }
    return (
        <motion.div variants={fadeUp}
            className="bg-gradient-to-br from-teal-50 to-teal-50/40 border border-teal-100 rounded-card p-6">
            <div className="flex items-start justify-between mb-6">
                <div>
                    <p className="text-xs text-teal-600/70 uppercase tracking-widest font-semibold mb-1">Today's Duty</p>
                    <h2 className="text-2xl font-bold font-outfit text-navy-900">Route {duty.routeNo}</h2>
                    <div className="flex items-center gap-2 mt-1">
                        <MapPin size={14} className="text-teal-500" />
                        <span className="text-sm text-slate-500">{duty.routeFrom} → {duty.routeTo}</span>
                    </div>
                </div>
                <Badge status={duty.status} />
            </div>
            <div className="grid grid-cols-2 gap-4">
                <div className="bg-white rounded-xl p-4 border border-surface-200 shadow-soft">
                    <p className="text-xs text-slate-500 mb-1">Bus</p>
                    <div className="flex items-center gap-2">
                        <Bus size={16} className="text-teal-500" />
                        <span className="text-base font-semibold text-navy-900">{duty.busReg}</span>
                    </div>
                </div>
                <div className="bg-white rounded-xl p-4 border border-surface-200 shadow-soft">
                    <p className="text-xs text-slate-500 mb-1">Shift Timing</p>
                    <div className="flex items-center gap-2">
                        <Clock size={16} className="text-amber-500" />
                        <span className="text-base font-semibold text-navy-900">{duty.startTime} – {duty.endTime}</span>
                    </div>
                </div>
            </div>
            {duty.conductorName && (
                <div className="mt-4 flex items-center gap-2 text-sm text-slate-500">
                    <User size={14} className="text-slate-400" />
                    Conductor: <span className="text-navy-900 font-medium">{duty.conductorName}</span>
                </div>
            )}
            {duty.driverName && (
                <div className="mt-4 flex items-center gap-2 text-sm text-slate-500">
                    <User size={14} className="text-slate-400" />
                    Driver: <span className="text-navy-900 font-medium">{duty.driverName}</span>
                </div>
            )}
        </motion.div>
    );
}

export default function DriverDashboard() {
    const { user } = useAuth();
    const today = new Date().toISOString().split('T')[0];
    const todayDuty = MOCK_DUTIES.find((d) => d.employeeId === user?.id && d.date === today);
    const todayAtt = MOCK_ATTENDANCE.find((a) => a.employeeId === user?.id && a.date === today);
    const unread = MOCK_NOTIFICATIONS.filter((n) => n.userId === user?.id && !n.isRead);

    return (
        <motion.div variants={staggerContainer} initial="hidden" animate="visible" className="space-y-6">
            <motion.div variants={fadeUp}>
                <h1 className="text-2xl font-bold font-outfit text-navy-900">Good {getGreeting()}, {user?.name?.split(' ')[0]} 👋</h1>
                <p className="text-sm text-slate-500 mt-1">{formatDate(today)}</p>
            </motion.div>

            <TodayDutyCard duty={todayDuty} />

            <motion.div variants={fadeUp} className="grid grid-cols-3 gap-3">
                {[
                    { label: 'Attendance', value: todayAtt?.status === 'present' ? 'Present' : 'Not Marked', color: todayAtt?.status === 'present' ? 'text-green-600' : 'text-slate-400', sub: todayAtt?.checkIn ? `In: ${todayAtt.checkIn}` : 'Tap to check in' },
                    { label: 'Upcoming', value: 'Sep 6', color: 'text-teal-600', sub: 'Route 15-A' },
                    { label: 'Alerts', value: unread.length, color: 'text-amber-600', sub: 'unread' },
                ].map((s) => (
                    <div key={s.label} className="card p-4 text-center border border-surface-200">
                        <p className="text-xs text-slate-400 mb-1">{s.label}</p>
                        <p className={`text-lg font-bold font-outfit ${s.color}`}>{s.value}</p>
                        <p className="text-xs text-slate-400 mt-0.5">{s.sub}</p>
                    </div>
                ))}
            </motion.div>

            <motion.div variants={fadeUp}>
                <h2 className="text-sm font-semibold text-slate-400 uppercase tracking-wider mb-3">Quick Actions</h2>
                <div className="grid grid-cols-2 gap-3">
                    <Link to="/shared/attendance">
                        <motion.div whileHover={{ y: -2 }} whileTap={{ scale: 0.97 }}
                            className="card p-5 flex flex-col items-center gap-3 border border-teal-100 hover:border-teal-300 hover:shadow-card-hover transition-all cursor-pointer bg-teal-50/50">
                            <div className="w-12 h-12 rounded-xl bg-teal-100 flex items-center justify-center">
                                <CheckCircle size={22} className="text-teal-600" />
                            </div>
                            <span className="text-sm font-semibold text-navy-900">Attendance</span>
                        </motion.div>
                    </Link>
                    <Link to="/shared/leave">
                        <motion.div whileHover={{ y: -2 }} whileTap={{ scale: 0.97 }}
                            className="card p-5 flex flex-col items-center gap-3 border border-amber-100 hover:border-amber-300 hover:shadow-card-hover transition-all cursor-pointer bg-amber-50/50">
                            <div className="w-12 h-12 rounded-xl bg-amber-100 flex items-center justify-center">
                                <Calendar size={22} className="text-amber-600" />
                            </div>
                            <span className="text-sm font-semibold text-navy-900">Apply Leave</span>
                        </motion.div>
                    </Link>
                </div>
            </motion.div>

            {unread.length > 0 && (
                <motion.div variants={fadeUp}>
                    <h2 className="text-sm font-semibold text-slate-400 uppercase tracking-wider mb-3">Recent Alerts</h2>
                    <div className="space-y-2">
                        {unread.slice(0, 2).map((n) => (
                            <div key={n.id} className="card p-4 flex items-start gap-3 border border-surface-200">
                                <div className="w-2 h-2 rounded-full bg-teal-500 mt-1.5 shrink-0" />
                                <div>
                                    <p className="text-sm font-medium text-navy-900">{n.title}</p>
                                    <p className="text-xs text-slate-400 mt-0.5">{n.body}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </motion.div>
            )}
        </motion.div>
    );
}

function getGreeting() {
    const h = new Date().getHours();
    if (h < 12) return 'Morning'; if (h < 17) return 'Afternoon'; return 'Evening';
}
function formatDate(iso) {
    return new Date(iso + 'T00:00:00').toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });
}
