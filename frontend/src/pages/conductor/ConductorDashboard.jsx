import { motion } from 'framer-motion';
import {
    Bus, Clock, MapPin, CheckCircle, Calendar, Bell,
    ArrowRight, ChevronRight, Ticket, BarChart2, Shield
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useCountUp } from '../../hooks';
import { fadeUp, staggerContainer } from '../../animations/variants';
import { Badge } from '../../components/ui';
import { MOCK_DUTIES, MOCK_ATTENDANCE, MOCK_NOTIFICATIONS } from '../../mock/data';

function getGreeting() {
    const h = new Date().getHours();
    if (h < 12) return 'Morning'; if (h < 17) return 'Afternoon'; return 'Evening';
}
function timeAgo(ts) {
    if (!ts) return '2 min ago';
    const m = Math.floor((Date.now() - new Date(ts).getTime()) / 60000);
    if (m < 60) return `${m || 1}m ago`; return `${Math.floor(m / 60)}h ago`;
}

// ── Animated route line (blue accent for Conductor) ───────
const CONDUCTOR_STOPS = ['Depot', 'Deccan', 'Baner Rd', 'Hinjewadi'];
function RouteTimeline() {
    return (
        <div className="mt-5">
            <p className="text-[10px] text-[#98A9BB] uppercase tracking-widest font-bold mb-3">Route Progress</p>
            <div className="relative flex items-center justify-between">
                <div className="absolute left-0 right-0 h-0.5 bg-[#E5EAF0] top-3" />
                <motion.div className="absolute left-0 h-0.5 bg-gradient-to-r from-[#2D8CFF] to-[#19A7A8] top-3"
                    initial={{ width: 0 }} animate={{ width: '50%' }}
                    transition={{ duration: 1.2, ease: 'easeOut', delay: 0.4 }} />
                <motion.div className="absolute top-0 z-10"
                    initial={{ left: '0%' }} animate={{ left: '46%' }}
                    transition={{ duration: 1.2, ease: 'easeOut', delay: 0.4 }}>
                    <div className="w-7 h-6 rounded bg-[#2D8CFF] flex items-center justify-center -translate-y-1 shadow-md">
                        <Ticket size={12} className="text-white" />
                    </div>
                </motion.div>
                {CONDUCTOR_STOPS.map((stop, i) => {
                    const passed = i <= 1;
                    return (
                        <div key={stop} className="flex flex-col items-center gap-2 z-10">
                            <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }}
                                transition={{ delay: 0.2 + i * 0.1, type: 'spring', stiffness: 400 }}
                                className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${passed ? 'border-[#2D8CFF] bg-[#2D8CFF]' : 'border-[#D0DAE6] bg-white'
                                    }`}>
                                {passed && <div className="w-2 h-2 rounded-full bg-white" />}
                            </motion.div>
                            <span className="text-[9px] text-[#98A9BB] font-medium text-center leading-tight max-w-[48px]">{stop}</span>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}

function TodayDutyCard({ duty }) {
    if (!duty) return (
        <div className="card p-8 text-center">
            <div className="w-14 h-14 rounded-2xl bg-[#EEF2F7] flex items-center justify-center mx-auto mb-3">
                <Ticket size={26} className="text-[#98A9BB]" />
            </div>
            <p className="font-semibold text-[#425466]">No duty assigned today</p>
            <p className="text-sm text-[#98A9BB] mt-1">Contact your depot manager</p>
        </div>
    );
    return (
        <div className="rounded-2xl overflow-hidden" style={{ boxShadow: '0 4px 24px rgba(18,59,93,0.10)' }}>
            <div className="h-1.5" style={{ background: 'linear-gradient(90deg,#2D8CFF,#19A7A8)' }} />
            <div className="bg-white p-5">
                <div className="flex items-start justify-between mb-4">
                    <div>
                        <p className="text-[10px] text-[#2D8CFF] uppercase tracking-widest font-bold mb-1">Today's Duty</p>
                        <h2 className="font-outfit font-black text-[#14212B] text-xl">Route {duty.routeNo}</h2>
                    </div>
                    <Badge status={duty.status} />
                </div>
                <div className="grid grid-cols-2 gap-3">
                    <div className="rounded-xl p-3.5 border border-[#E5EAF0] bg-[#F7F9FC]">
                        <p className="text-[10px] text-[#98A9BB] uppercase tracking-wider font-bold mb-1.5">Bus</p>
                        <div className="flex items-center gap-2">
                            <div className="w-7 h-7 rounded-lg bg-[#E8F2FF] flex items-center justify-center">
                                <Bus size={13} className="text-[#2D8CFF]" />
                            </div>
                            <span className="font-bold text-[#14212B] text-sm">{duty.busReg}</span>
                        </div>
                    </div>
                    <div className="rounded-xl p-3.5 border border-[#E5EAF0] bg-[#F7F9FC]">
                        <p className="text-[10px] text-[#98A9BB] uppercase tracking-wider font-bold mb-1.5">Shift</p>
                        <div className="flex items-center gap-2">
                            <div className="w-7 h-7 rounded-lg bg-amber-50 flex items-center justify-center">
                                <Clock size={13} className="text-amber-500" />
                            </div>
                            <span className="font-bold text-[#14212B] text-sm">{duty.startTime}–{duty.endTime}</span>
                        </div>
                    </div>
                </div>
                <div className="mt-4 flex items-center gap-2 text-sm text-[#6B7E92]">
                    <MapPin size={14} className="text-[#2D8CFF] shrink-0" />
                    <span className="font-medium text-[#14212B]">{duty.routeFrom}</span>
                    <ArrowRight size={12} className="text-[#D0DAE6] shrink-0" />
                    <span className="font-medium text-[#14212B]">{duty.routeTo}</span>
                </div>
                {duty.driverName && (
                    <p className="text-xs text-[#6B7E92] mt-3 flex items-center gap-1.5">
                        <Bus size={11} className="text-[#98A9BB]" /> Driver: {duty.driverName}
                    </p>
                )}
                <RouteTimeline />
            </div>
        </div>
    );
}

function StatChip({ icon: Icon, label, target, suffix = '', color, bg, border }) {
    const { count, ref } = useCountUp(target, 1400);
    return (
        <div ref={ref} className="card p-4 flex flex-col items-center text-center gap-1.5"
            style={{ borderColor: border, background: bg }}>
            <div className="w-9 h-9 rounded-xl flex items-center justify-center"
                style={{ background: 'white', boxShadow: '0 2px 6px rgba(18,59,93,0.08)' }}>
                <Icon size={17} style={{ color }} />
            </div>
            <p className="font-outfit font-black text-xl" style={{ color }}>{count}{suffix}</p>
            <p className="text-[10px] text-[#98A9BB] font-semibold uppercase tracking-wider">{label}</p>
        </div>
    );
}

function LatestNotification({ notif }) {
    if (!notif) return null;
    return (
        <motion.div variants={fadeUp}
            className="card p-4 flex items-start gap-3"
            whileHover={{ y: -1, boxShadow: '0 6px 18px rgba(18,59,93,0.08)' }}>
            <div className="w-9 h-9 rounded-xl bg-[#E8F2FF] flex items-center justify-center shrink-0">
                <Bell size={16} className="text-[#2D8CFF]" />
            </div>
            <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-2">
                    <p className="text-sm font-semibold text-[#14212B] leading-tight">{notif.title}</p>
                    <span className="text-[10px] text-[#98A9BB] shrink-0">{timeAgo(notif.timestamp)}</span>
                </div>
                <p className="text-xs text-[#6B7E92] mt-0.5">{notif.body}</p>
            </div>
        </motion.div>
    );
}

export default function ConductorDashboard() {
    const { user } = useAuth();
    const today = new Date().toISOString().split('T')[0];
    const todayDuty = MOCK_DUTIES.find((d) => d.conductorName === user?.name && d.date === today);
    const notifs = MOCK_NOTIFICATIONS.filter((n) => n.userId === user?.id);
    const initial = user?.name?.charAt(0)?.toUpperCase() || 'C';

    return (
        <motion.div variants={staggerContainer} initial="hidden" animate="visible"
            className="space-y-5 max-w-2xl mx-auto">

            {/* Header */}
            <motion.div variants={fadeUp} className="flex items-center justify-between">
                <div>
                    <p className="text-[11px] text-[#2D8CFF] uppercase tracking-widest font-bold">Conductor Portal</p>
                    <h1 className="text-2xl font-black font-outfit text-[#14212B] mt-0.5">
                        Good {getGreeting()}, {user?.name?.split(' ')[0]} 👋
                    </h1>
                    <p className="text-sm text-[#6B7E92] mt-0.5">
                        {new Date().toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'long' })}
                    </p>
                </div>
                <div className="w-12 h-12 rounded-full flex items-center justify-center font-black text-lg text-white shrink-0"
                    style={{ background: 'linear-gradient(135deg,#2D8CFF,#19A7A8)', boxShadow: '0 4px 12px rgba(45,140,255,0.3)' }}>
                    {initial}
                </div>
            </motion.div>

            {/* Duty Card */}
            <motion.div variants={fadeUp}><TodayDutyCard duty={todayDuty} /></motion.div>

            {/* Primary action */}
            <motion.div variants={fadeUp} className="space-y-3">
                <Link to="/shared/attendance">
                    <motion.button whileHover={{ y: -2, boxShadow: '0 10px 28px rgba(45,140,255,0.38)' }}
                        whileTap={{ scale: 0.97 }}
                        className="w-full h-14 rounded-2xl flex items-center justify-center gap-3 font-bold text-white text-base"
                        style={{ background: 'linear-gradient(135deg,#2D8CFF 0%,#19A7A8 100%)', boxShadow: '0 6px 20px rgba(45,140,255,0.28)' }}>
                        <CheckCircle size={22} />
                        Mark Attendance
                    </motion.button>
                </Link>
                <div className="grid grid-cols-2 gap-3">
                    {[
                        { to: '/shared/duty-history', label: 'My Duty', icon: Shield, color: '#2D8CFF', bg: '#E8F2FF', border: '#bfdbfe' },
                        { to: '/shared/leave', label: 'Apply Leave', icon: Calendar, color: '#f59e0b', bg: '#fef3c7', border: '#fde68a' },
                    ].map(({ to, label, icon: Icon, color, bg, border }) => (
                        <Link key={to} to={to}>
                            <motion.button whileHover={{ y: -2 }} whileTap={{ scale: 0.97 }}
                                className="w-full h-12 rounded-xl flex items-center justify-center gap-2 font-semibold text-sm border"
                                style={{ background: bg, borderColor: border, color }}>
                                <Icon size={17} />{label}
                            </motion.button>
                        </Link>
                    ))}
                </div>
            </motion.div>

            {/* Stats */}
            <motion.div variants={fadeUp}>
                <p className="text-[10px] font-bold text-[#6B7E92] uppercase tracking-widest mb-3">Summary</p>
                <div className="grid grid-cols-3 gap-3">
                    <StatChip icon={BarChart2} label="Attendance" target={91} suffix="%" color="#2D8CFF" bg="#E8F2FF" border="#bfdbfe" />
                    <StatChip icon={Ticket} label="Tickets" target={284} color="#19A7A8" bg="#E6F7F7" border="#b2e8e8" />
                    <StatChip icon={Calendar} label="Leave Days" target={6} color="#f59e0b" bg="#fef3c7" border="#fde68a" />
                </div>
            </motion.div>

            {/* Notification */}
            <motion.div variants={fadeUp}>
                <div className="flex items-center justify-between mb-3">
                    <p className="text-[10px] font-bold text-[#6B7E92] uppercase tracking-widest">Latest Alert</p>
                    <Link to="/shared/notifications"
                        className="text-xs text-[#2D8CFF] font-semibold flex items-center gap-1 hover:text-[#1A6FD4] transition-colors">
                        See all <ChevronRight size={12} />
                    </Link>
                </div>
                <LatestNotification notif={notifs[0]} />
            </motion.div>

        </motion.div>
    );
}
