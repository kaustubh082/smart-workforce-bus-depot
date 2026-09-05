import { motion } from 'framer-motion';
import { Users, Bus, Map, Calendar, FileCheck, BarChart3, AlertTriangle, TrendingUp } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { fadeUp, staggerContainer } from '../../animations/variants';
import { StatCard, PageHeader } from '../../components/ui';
import { MOCK_STATS, MOCK_LEAVES, MOCK_NOTIFICATIONS } from '../../mock/data';

const QUICK_ACTIONS = [
    { to: '/manager/duty-allocation', label: 'Allocate Duty', icon: Calendar, color: 'teal' },
    { to: '/manager/employees', label: 'Employees', icon: Users, color: 'blue' },
    { to: '/manager/leave-approvals', label: 'Leave Approvals', icon: FileCheck, color: 'amber' },
    { to: '/manager/buses', label: 'Fleet', icon: Bus, color: 'green' },
    { to: '/manager/routes', label: 'Routes', icon: Map, color: 'teal' },
    { to: '/manager/reports', label: 'Reports', icon: BarChart3, color: 'blue' },
];

const colorMap = {
    teal: 'bg-teal-50 border-teal-100 text-teal-600',
    amber: 'bg-amber-50 border-amber-100 text-amber-600',
    blue: 'bg-blue-50  border-blue-100  text-blue-600',
    green: 'bg-green-50 border-green-100 text-green-600',
};

export default function ManagerDashboard() {
    const { user } = useAuth();
    const pendingLeaves = MOCK_LEAVES.filter((l) => l.status === 'pending');
    const today = new Date().toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'long' });

    return (
        <motion.div variants={staggerContainer} initial="hidden" animate="visible" className="space-y-8">
            <motion.div variants={fadeUp}>
                <PageHeader title="Manager Dashboard" subtitle={`${today} · ${user?.depot}`} />
            </motion.div>

            {/* Stats */}
            <motion.div variants={staggerContainer} className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                {[
                    { label: 'Total Employees', value: MOCK_STATS.totalEmployees, icon: Users, color: 'teal', change: '+2 this month' },
                    { label: 'Fleet Buses', value: MOCK_STATS.totalBuses, icon: Bus, color: 'blue', change: `${MOCK_STATS.operationalBuses} operational` },
                    { label: 'Active Routes', value: MOCK_STATS.routesActive, icon: Map, color: 'green', change: '1 suspended' },
                    { label: 'Attendance Today', value: MOCK_STATS.attendanceToday, icon: TrendingUp, color: 'teal', suffix: '%', change: 'of workforce' },
                ].map((s) => (
                    <motion.div key={s.label} variants={fadeUp}>
                        <StatCard {...s} />
                    </motion.div>
                ))}
            </motion.div>

            {/* Pending leave alert */}
            {pendingLeaves.length > 0 && (
                <motion.div variants={fadeUp}
                    className="flex items-center gap-3 p-4 rounded-card bg-amber-50 border border-amber-200">
                    <AlertTriangle size={18} className="text-amber-500 shrink-0" />
                    <div className="flex-1">
                        <p className="text-sm font-semibold text-amber-800">{pendingLeaves.length} leave request{pendingLeaves.length > 1 ? 's' : ''} awaiting approval</p>
                        <p className="text-xs text-amber-600/80 mt-0.5">Review them before the end of day</p>
                    </div>
                    <Link to="/manager/leave-approvals"
                        className="text-xs font-semibold text-amber-700 hover:text-amber-900 whitespace-nowrap transition-colors">
                        Review →
                    </Link>
                </motion.div>
            )}

            {/* Quick actions */}
            <motion.div variants={fadeUp}>
                <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-4">Quick Actions</p>
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
                    {QUICK_ACTIONS.map(({ to, label, icon: Icon, color }) => {
                        const cls = colorMap[color];
                        return (
                            <Link key={to} to={to}>
                                <motion.div whileHover={{ y: -3 }} whileTap={{ scale: 0.97 }}
                                    className={`card p-4 flex flex-col items-center gap-2.5 border cursor-pointer bg-white hover:shadow-card-hover transition-all`}>
                                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${cls.split(' ').slice(0, 2).join(' ')}`}>
                                        <Icon size={18} className={cls.split(' ')[2]} />
                                    </div>
                                    <span className="text-xs font-semibold text-navy-900 text-center leading-tight">{label}</span>
                                </motion.div>
                            </Link>
                        );
                    })}
                </div>
            </motion.div>

            {/* Two-column lower */}
            <motion.div variants={staggerContainer} className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Pending leaves */}
                <motion.div variants={fadeUp} className="card p-5 border border-surface-200">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="text-base font-semibold font-outfit text-navy-900">Pending Leaves</h3>
                        <Link to="/manager/leave-approvals" className="text-xs text-teal-600 hover:text-teal-700 transition-colors">View all</Link>
                    </div>
                    {pendingLeaves.length === 0
                        ? <p className="text-sm text-slate-400 text-center py-4">No pending requests</p>
                        : pendingLeaves.map((l) => (
                            <div key={l.id} className="flex items-center justify-between py-2.5 border-b border-surface-100 last:border-0">
                                <div>
                                    <p className="text-sm font-medium text-navy-900">{l.employeeName}</p>
                                    <p className="text-xs text-slate-400">{l.leaveType} · {l.days} day(s)</p>
                                </div>
                                <span className="badge badge-warning">Pending</span>
                            </div>
                        ))
                    }
                </motion.div>

                {/* Fleet summary */}
                <motion.div variants={fadeUp} className="card p-5 border border-surface-200">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="text-base font-semibold font-outfit text-navy-900">Fleet Status</h3>
                        <Link to="/manager/buses" className="text-xs text-teal-600 hover:text-teal-700 transition-colors">View all</Link>
                    </div>
                    <div className="space-y-3">
                        {[
                            { label: 'Operational', value: MOCK_STATS.operationalBuses, color: 'text-green-600', dot: 'bg-green-500' },
                            { label: 'Maintenance', value: 1, color: 'text-amber-600', dot: 'bg-amber-400' },
                            { label: 'Out of Service', value: 1, color: 'text-red-600', dot: 'bg-red-500' },
                        ].map((item) => (
                            <div key={item.label} className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                    <span className={`w-2 h-2 rounded-full ${item.dot}`} />
                                    <span className="text-sm text-slate-500">{item.label}</span>
                                </div>
                                <span className={`text-sm font-semibold ${item.color}`}>{item.value}</span>
                            </div>
                        ))}
                    </div>
                    <div className="mt-4 h-2 bg-surface-200 rounded-full overflow-hidden flex">
                        <div className="bg-green-500 h-full" style={{ width: `${(28 / 32) * 100}%` }} />
                        <div className="bg-amber-400 h-full" style={{ width: `${(1 / 32) * 100}%` }} />
                        <div className="bg-red-500 h-full" style={{ width: `${(1 / 32) * 100}%` }} />
                    </div>
                </motion.div>
            </motion.div>
        </motion.div>
    );
}
