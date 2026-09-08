import { useState } from 'react';
import { motion } from 'framer-motion';
import {
    Users, Bus, Calendar, FileCheck, BarChart3, TrendingUp,
    AlertTriangle, CheckCircle, Wrench, Map, Clock, ArrowRight,
    ChevronRight, Bell
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useCountUp } from '../../hooks';
import { fadeUp, staggerContainer } from '../../animations/variants';
import { Badge } from '../../components/ui';
import { MOCK_STATS, MOCK_LEAVES, MOCK_DUTIES, MOCK_NOTIFICATIONS } from '../../mock/data';

// ── Count-up bento stat cell ──────────────────────────────
function BentoStat({ icon: Icon, label, target, suffix = '', color, bg, border, wide = false, change }) {
    const { count, ref } = useCountUp(target, 1400);
    return (
        <motion.div ref={ref} variants={fadeUp}
            whileHover={{ y: -3, boxShadow: '0 10px 28px rgba(18,59,93,0.12)' }}
            className={`card p-5 flex flex-col justify-between gap-3 transition-all ${wide ? 'sm:col-span-2' : ''}`}
            style={{ minHeight: 120, borderColor: border, background: bg }}>
            <div className="flex items-start justify-between">
                <div className="w-10 h-10 rounded-xl flex items-center justify-center"
                    style={{ background: 'white', boxShadow: '0 2px 8px rgba(18,59,93,0.08)' }}>
                    <Icon size={19} style={{ color }} />
                </div>
                {change && (
                    <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full"
                        style={{ background: 'white', color }}>
                        {change}
                    </span>
                )}
            </div>
            <div>
                <p className="font-outfit font-black text-3xl" style={{ color }}>
                    {count}{suffix}
                </p>
                <p className="text-[11px] font-semibold text-[#6B7E92] uppercase tracking-wider mt-0.5">{label}</p>
            </div>
        </motion.div>
    );
}

// ── Upcoming duty row ─────────────────────────────────────
function DutyRow({ duty }) {
    const STATUS_DOT = {
        scheduled: 'bg-[#19A7A8]',
        completed: 'bg-green-500',
        cancelled: 'bg-red-400',
    };
    return (
        <motion.div variants={fadeUp}
            className="flex items-center gap-3 py-3 border-b border-[#F7F9FC] last:border-0">
            <div className="w-9 h-9 rounded-xl bg-[#F7F9FC] border border-[#E5EAF0] flex items-center justify-center shrink-0">
                <Bus size={15} className="text-[#19A7A8]" />
            </div>
            <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-[#14212B] truncate">
                    Route {duty.routeNo}
                    <span className="ml-2 text-xs font-normal text-[#98A9BB]">
                        {duty.routeFrom} → {duty.routeTo}
                    </span>
                </p>
                <div className="flex items-center gap-2 mt-0.5 text-xs text-[#98A9BB]">
                    <Clock size={10} />
                    {duty.startTime} – {duty.endTime}
                    <span className="mx-1">·</span>
                    {duty.busReg}
                </div>
            </div>
            <div className="flex items-center gap-1.5 shrink-0">
                <span className={`w-2 h-2 rounded-full ${STATUS_DOT[duty.status] || 'bg-gray-300'}`} />
                <span className="text-xs font-semibold text-[#6B7E92] capitalize">{duty.status}</span>
            </div>
        </motion.div>
    );
}

// ── Leave request row ─────────────────────────────────────
function LeaveRow({ leave, onApprove, onReject }) {
    return (
        <motion.div variants={fadeUp}
            className="flex items-center gap-3 py-3 border-b border-[#F7F9FC] last:border-0">
            <div className="w-9 h-9 rounded-full flex items-center justify-center text-white text-sm font-bold shrink-0"
                style={{ background: 'linear-gradient(135deg,#19A7A8,#2D8CFF)' }}>
                {leave.employeeName?.charAt(0)}
            </div>
            <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-[#14212B] truncate">{leave.employeeName}</p>
                <p className="text-xs text-[#98A9BB]">{leave.leaveType} · {leave.days} day(s)</p>
            </div>
            <div className="flex gap-1.5 shrink-0">
                <button onClick={() => onApprove(leave.id)}
                    className="w-8 h-8 rounded-lg bg-green-50 border border-green-200 text-green-600 flex items-center justify-center hover:bg-green-100 transition-colors">
                    <CheckCircle size={14} />
                </button>
                <button onClick={() => onReject(leave.id)}
                    className="w-8 h-8 rounded-lg bg-red-50 border border-red-200 text-red-500 flex items-center justify-center hover:bg-red-100 transition-colors">
                    <span className="text-xs font-bold">✕</span>
                </button>
            </div>
        </motion.div>
    );
}

// ── Main ──────────────────────────────────────────────────
const TODAY = new Date().toISOString().split('T')[0];

const QUICK_ACTIONS = [
    { to: '/manager/duty-allocation', label: 'Allocate Duty', icon: Calendar, color: '#19A7A8', bg: '#E6F7F7', border: '#b2e8e8' },
    { to: '/manager/employees', label: 'Employees', icon: Users, color: '#2D8CFF', bg: '#E8F2FF', border: '#bfdbfe' },
    { to: '/manager/buses', label: 'Fleet', icon: Bus, color: '#059669', bg: '#d1fae5', border: '#a7f3d0' },
    { to: '/manager/routes', label: 'Routes', icon: Map, color: '#6366f1', bg: '#ede9fe', border: '#c4b5fd' },
    { to: '/manager/reports', label: 'Reports', icon: BarChart3, color: '#f59e0b', bg: '#fef3c7', border: '#fde68a' },
    { to: '/manager/leave-approvals', label: 'Leaves', icon: FileCheck, color: '#ec4899', bg: '#fce7f3', border: '#fbcfe8' },
];

export default function ManagerDashboard() {
    const { user } = useAuth();
    const [leaves, setLeaves] = useState(MOCK_LEAVES.filter((l) => l.status === 'pending'));
    const today = new Date().toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'long' });
    const upcomingDuties = MOCK_DUTIES.filter((d) => d.date >= TODAY).slice(0, 5);
    const initial = user?.name?.charAt(0)?.toUpperCase() || 'M';

    const handleApprove = (id) => setLeaves((p) => p.filter((l) => l.id !== id));
    const handleReject = (id) => setLeaves((p) => p.filter((l) => l.id !== id));

    return (
        <motion.div variants={staggerContainer} initial="hidden" animate="visible" className="space-y-6">

            {/* ── Header ── */}
            <motion.div variants={fadeUp} className="flex items-start justify-between gap-4">
                <div>
                    <p className="text-[11px] text-[#19A7A8] uppercase tracking-widest font-bold">Manager Portal</p>
                    <h1 className="font-outfit font-black text-[#14212B] text-2xl mt-0.5">Manager Dashboard</h1>
                    <p className="text-sm text-[#6B7E92] mt-0.5">
                        {today} · {user?.depot || 'Central Bus Depot, Pune'}
                    </p>
                </div>
                <div className="flex items-center gap-3 shrink-0">
                    {leaves.length > 0 && (
                        <div className="w-8 h-8 rounded-full bg-amber-100 border border-amber-200 flex items-center justify-center relative">
                            <Bell size={15} className="text-amber-600" />
                            <span className="absolute -top-1 -right-1 w-4 h-4 bg-amber-500 text-white text-[9px] font-bold rounded-full flex items-center justify-center">
                                {leaves.length}
                            </span>
                        </div>
                    )}
                    <div className="w-11 h-11 rounded-full flex items-center justify-center font-black text-base text-white"
                        style={{ background: 'linear-gradient(135deg,#123B5D,#19A7A8)', boxShadow: '0 4px 12px rgba(18,59,93,0.25)' }}>
                        {initial}
                    </div>
                </div>
            </motion.div>

            {/* ── Bento stat grid ── */}
            <motion.div variants={staggerContainer}
                className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
                <BentoStat icon={Users} label="Total Employees" target={MOCK_STATS.totalEmployees} color="#19A7A8" bg="#E6F7F7" border="#b2e8e8" change="+2" />
                <BentoStat icon={Calendar} label="Today's Duties" target={upcomingDuties.length} color="#2D8CFF" bg="#E8F2FF" border="#bfdbfe" />
                <BentoStat icon={TrendingUp} label="Present Today" target={MOCK_STATS.attendanceToday} color="#059669" bg="#d1fae5" border="#a7f3d0" suffix="%" />
                <BentoStat icon={FileCheck} label="Pending Leaves" target={leaves.length} color="#f59e0b" bg="#fef3c7" border="#fde68a" />
                <BentoStat icon={Bus} label="Available Buses" target={MOCK_STATS.operationalBuses} color="#6366f1" bg="#ede9fe" border="#c4b5fd" />
                <BentoStat icon={Wrench} label="Maintenance" target={1} color="#ef4444" bg="#fee2e2" border="#fecaca" />
            </motion.div>

            {/* ── Pending leave alert ── */}
            {leaves.length > 0 && (
                <motion.div variants={fadeUp}
                    className="flex items-center gap-3 p-4 rounded-2xl bg-amber-50 border border-amber-200">
                    <div className="w-9 h-9 rounded-xl bg-amber-100 flex items-center justify-center shrink-0">
                        <AlertTriangle size={17} className="text-amber-600" />
                    </div>
                    <div className="flex-1">
                        <p className="text-sm font-semibold text-amber-800">
                            {leaves.length} leave request{leaves.length > 1 ? 's' : ''} pending approval
                        </p>
                        <p className="text-xs text-amber-600 mt-0.5">Review before end of day</p>
                    </div>
                    <Link to="/manager/leave-approvals"
                        className="text-xs font-bold text-amber-700 flex items-center gap-1 whitespace-nowrap hover:text-amber-900 transition-colors">
                        Review <ArrowRight size={12} />
                    </Link>
                </motion.div>
            )}

            {/* ── Quick actions ── */}
            <motion.div variants={fadeUp}>
                <p className="text-[10px] font-bold text-[#6B7E92] uppercase tracking-widest mb-3">Quick Actions</p>
                <div className="grid grid-cols-3 sm:grid-cols-6 gap-3">
                    {QUICK_ACTIONS.map(({ to, label, icon: Icon, color, bg, border }) => (
                        <Link key={to} to={to}>
                            <motion.div whileHover={{ y: -3, boxShadow: '0 8px 20px rgba(18,59,93,0.10)' }}
                                whileTap={{ scale: 0.97 }}
                                className="card p-4 flex flex-col items-center gap-2 cursor-pointer transition-all"
                                style={{ borderColor: border, background: bg }}>
                                <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center"
                                    style={{ boxShadow: '0 2px 6px rgba(18,59,93,0.08)' }}>
                                    <Icon size={18} style={{ color }} />
                                </div>
                                <span className="text-xs font-semibold text-[#14212B] text-center leading-tight">{label}</span>
                            </motion.div>
                        </Link>
                    ))}
                </div>
            </motion.div>

            {/* ── Two-column: Duties + Leaves ── */}
            <motion.div variants={staggerContainer}
                className="grid grid-cols-1 lg:grid-cols-2 gap-5">

                {/* Upcoming duties */}
                <motion.div variants={fadeUp} className="card p-5">
                    <div className="flex items-center justify-between mb-1">
                        <h3 className="font-outfit font-bold text-[#14212B]">Upcoming Duties</h3>
                        <Link to="/manager/duty-allocation"
                            className="text-xs text-[#19A7A8] font-semibold flex items-center gap-1 hover:text-[#178F90] transition-colors">
                            View all <ChevronRight size={12} />
                        </Link>
                    </div>
                    <p className="text-xs text-[#98A9BB] mb-3">{upcomingDuties.length} scheduled from today</p>
                    <motion.div variants={staggerContainer}>
                        {upcomingDuties.length === 0
                            ? <p className="text-sm text-[#98A9BB] text-center py-6">No upcoming duties</p>
                            : upcomingDuties.map((d) => <DutyRow key={d.id} duty={d} />)
                        }
                    </motion.div>
                </motion.div>

                {/* Pending leave requests */}
                <motion.div variants={fadeUp} className="card p-5">
                    <div className="flex items-center justify-between mb-1">
                        <h3 className="font-outfit font-bold text-[#14212B]">Leave Requests</h3>
                        <Link to="/manager/leave-approvals"
                            className="text-xs text-[#19A7A8] font-semibold flex items-center gap-1 hover:text-[#178F90] transition-colors">
                            View all <ChevronRight size={12} />
                        </Link>
                    </div>
                    <p className="text-xs text-[#98A9BB] mb-3">{leaves.length} awaiting review</p>
                    <motion.div variants={staggerContainer}>
                        {leaves.length === 0
                            ? (
                                <div className="flex flex-col items-center py-6 gap-2">
                                    <CheckCircle size={32} className="text-green-300" />
                                    <p className="text-sm text-[#98A9BB]">All requests reviewed</p>
                                </div>
                            )
                            : leaves.slice(0, 5).map((l) => (
                                <LeaveRow key={l.id} leave={l}
                                    onApprove={handleApprove} onReject={handleReject} />
                            ))
                        }
                    </motion.div>
                </motion.div>
            </motion.div>

            {/* ── Fleet status mini bar ── */}
            <motion.div variants={fadeUp} className="card p-5">
                <div className="flex items-center justify-between mb-4">
                    <h3 className="font-outfit font-bold text-[#14212B]">Fleet Status</h3>
                    <Link to="/manager/buses"
                        className="text-xs text-[#19A7A8] font-semibold flex items-center gap-1 hover:text-[#178F90] transition-colors">
                        View fleet <ChevronRight size={12} />
                    </Link>
                </div>
                <div className="grid grid-cols-3 gap-4">
                    {[
                        { label: 'Operational', value: MOCK_STATS.operationalBuses, pct: (28 / 32) * 100, color: '#059669', bg: '#d1fae5', border: '#a7f3d0' },
                        { label: 'Maintenance', value: 1, pct: (1 / 32) * 100, color: '#f59e0b', bg: '#fef3c7', border: '#fde68a' },
                        { label: 'Out of Service', value: 1, pct: (1 / 32) * 100, color: '#ef4444', bg: '#fee2e2', border: '#fecaca' },
                    ].map(({ label, value, pct, color, bg, border }) => (
                        <div key={label} className="text-center">
                            <div className="rounded-xl p-3 mb-2" style={{ background: bg, border: `1px solid ${border}` }}>
                                <p className="font-outfit font-black text-2xl" style={{ color }}>{value}</p>
                                <p className="text-[10px] font-semibold text-[#6B7E92] uppercase tracking-wider mt-0.5">{label}</p>
                            </div>
                            <div className="h-1.5 bg-[#EEF2F7] rounded-full overflow-hidden">
                                <motion.div initial={{ width: 0 }} animate={{ width: `${pct}%` }}
                                    transition={{ duration: 0.8, delay: 0.4, ease: 'easeOut' }}
                                    className="h-full rounded-full" style={{ background: color }} />
                            </div>
                        </div>
                    ))}
                </div>
            </motion.div>

        </motion.div>
    );
}
