import { motion } from 'framer-motion';
import { BarChart3, TrendingUp, Users, CheckCircle, Download } from 'lucide-react';
import { fadeUp, staggerContainer } from '../../animations/variants';
import { PageHeader, StatCard, Button } from '../../components/ui';
import { MOCK_STATS } from '../../mock/data';

const MONTHLY_ATTENDANCE = [
    { month: 'Apr', pct: 91 }, { month: 'May', pct: 88 }, { month: 'Jun', pct: 94 },
    { month: 'Jul', pct: 89 }, { month: 'Aug', pct: 96 }, { month: 'Sep', pct: 93 },
];
const MAX = Math.max(...MONTHLY_ATTENDANCE.map(m => m.pct));

export default function ReportsPage() {
    return (
        <motion.div variants={staggerContainer} initial="hidden" animate="visible" className="space-y-6">
            <motion.div variants={fadeUp}>
                <PageHeader title="Reports & Analytics" subtitle="September 2026"
                    action={<Button variant="secondary"><Download size={15} /> Export CSV</Button>} />
            </motion.div>

            {/* Summary stats */}
            <motion.div variants={staggerContainer} className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                <motion.div variants={fadeUp}><StatCard label="Total Employees" value={MOCK_STATS.totalEmployees} icon={Users} color="teal" /></motion.div>
                <motion.div variants={fadeUp}><StatCard label="Attendance Rate" value={MOCK_STATS.attendanceToday} suffix="%" icon={TrendingUp} color="green" change="This month" /></motion.div>
                <motion.div variants={fadeUp}><StatCard label="Duties Completed" value={48} icon={CheckCircle} color="blue" change="This month" /></motion.div>
                <motion.div variants={fadeUp}><StatCard label="Leaves Approved" value={12} icon={BarChart3} color="amber" change="This month" /></motion.div>
            </motion.div>

            {/* Attendance bar chart */}
            <motion.div variants={fadeUp} className="card p-6">
                <h3 className="font-outfit font-bold text-[#14212B] mb-5">Monthly Attendance Trend</h3>
                <div className="flex items-end gap-3 h-48">
                    {MONTHLY_ATTENDANCE.map(({ month, pct }) => (
                        <div key={month} className="flex-1 flex flex-col items-center gap-2">
                            <span className="text-xs font-bold text-[#19A7A8]">{pct}%</span>
                            <div className="w-full rounded-t-lg overflow-hidden"
                                style={{ height: `${(pct / MAX) * 160}px`, background: 'linear-gradient(180deg,#19A7A8,#2D8CFF)', opacity: 0.75 + (pct / MAX) * 0.25 }} />
                            <span className="text-[10px] text-[#98A9BB] font-medium">{month}</span>
                        </div>
                    ))}
                </div>
            </motion.div>

            {/* Role breakdown */}
            <motion.div variants={fadeUp} className="card p-6">
                <h3 className="font-outfit font-bold text-[#14212B] mb-4">Workforce Breakdown</h3>
                <div className="space-y-4">
                    {[
                        { label: 'Drivers', count: 18, total: MOCK_STATS.totalEmployees, color: '#19A7A8' },
                        { label: 'Conductors', count: 14, total: MOCK_STATS.totalEmployees, color: '#2D8CFF' },
                    ].map(({ label, count, total, color }) => (
                        <div key={label}>
                            <div className="flex justify-between text-sm mb-1.5">
                                <span className="font-medium text-[#14212B]">{label}</span>
                                <span className="text-[#6B7E92]">{count} of {total}</span>
                            </div>
                            <div className="h-2.5 bg-[#EEF2F7] rounded-full overflow-hidden">
                                <motion.div initial={{ width: 0 }} animate={{ width: `${(count / total) * 100}%` }}
                                    transition={{ duration: 0.8, ease: 'easeOut' }}
                                    className="h-full rounded-full" style={{ background: color }} />
                            </div>
                        </div>
                    ))}
                </div>
            </motion.div>
        </motion.div>
    );
}
