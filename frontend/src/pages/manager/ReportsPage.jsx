import { motion } from 'framer-motion';
import { BarChart2, TrendingUp, Users, Bus } from 'lucide-react';
import { fadeUp, staggerContainer } from '../../animations/variants';
import { PageHeader, StatCard } from '../../components/ui';
import { MOCK_ATTENDANCE, MOCK_EMPLOYEES, MOCK_STATS } from '../../mock/data';

// Simple bar chart using CSS
function BarChart({ data, max }) {
    const colors = ['bg-teal-500', 'bg-teal-400', 'bg-teal-600', 'bg-amber-400', 'bg-teal-500', 'bg-teal-500', 'bg-teal-400'];
    return (
        <div className="flex items-end gap-2 h-32">
            {data.map((item, i) => (
                <div key={item.label} className="flex flex-col items-center gap-1 flex-1">
                    <span className="text-[10px] text-gray-500">{item.value}</span>
                    <div className={`w-full rounded-t-sm ${colors[i % colors.length]} opacity-80 transition-all`}
                        style={{ height: `${(item.value / max) * 100}%` }} />
                    <span className="text-[10px] text-gray-500 text-center leading-tight">{item.label}</span>
                </div>
            ))}
        </div>
    );
}

const WEEKLY_ATTENDANCE = [
    { label: 'Mon', value: 45 }, { label: 'Tue', value: 43 }, { label: 'Wed', value: 44 },
    { label: 'Thu', value: 41 }, { label: 'Fri', value: 46 }, { label: 'Sat', value: 38 }, { label: 'Sun', value: 20 },
];

const ROLE_DIST = [
    { label: 'Drivers', value: MOCK_STATS.activeDrivers, color: 'bg-teal-500' },
    { label: 'Conductors', value: MOCK_STATS.activeConductors, color: 'bg-amber-400' },
    { label: 'Managers', value: 2, color: 'bg-blue-500' },
];

export default function ReportsPage() {
    const presentToday = MOCK_ATTENDANCE.filter((a) => a.date === '2026-09-05' && a.status === 'present').length;

    return (
        <motion.div variants={staggerContainer} initial="hidden" animate="visible" className="space-y-8">
            <motion.div variants={fadeUp}>
                <PageHeader title="Reports & Analytics" subtitle="Operational overview and key metrics" />
            </motion.div>

            {/* Summary stats */}
            <motion.div variants={staggerContainer} className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                {[
                    { label: 'Total Employees', value: MOCK_STATS.totalEmployees, icon: Users, color: 'teal' },
                    { label: 'Operational Fleet', value: MOCK_STATS.operationalBuses, icon: Bus, color: 'blue' },
                    { label: 'Attendance Today', value: `${MOCK_STATS.attendanceToday}%`, icon: TrendingUp, color: 'green' },
                    { label: 'Active Routes', value: MOCK_STATS.routesActive, icon: BarChart2, color: 'amber' },
                ].map((s) => (
                    <motion.div key={s.label} variants={fadeUp}>
                        <StatCard {...s} />
                    </motion.div>
                ))}
            </motion.div>

            {/* Two charts */}
            <motion.div variants={staggerContainer} className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Attendance chart */}
                <motion.div variants={fadeUp} className="card p-5 border border-white/06">
                    <p className="text-sm font-semibold font-outfit text-white mb-4">Weekly Attendance (This Week)</p>
                    <BarChart data={WEEKLY_ATTENDANCE} max={50} />
                </motion.div>

                {/* Role distribution */}
                <motion.div variants={fadeUp} className="card p-5 border border-white/06">
                    <p className="text-sm font-semibold font-outfit text-white mb-4">Workforce Composition</p>
                    <div className="space-y-4">
                        {ROLE_DIST.map((r) => (
                            <div key={r.label}>
                                <div className="flex justify-between text-sm mb-1.5">
                                    <span className="text-gray-400">{r.label}</span>
                                    <span className="text-white font-medium">{r.value}</span>
                                </div>
                                <div className="h-2 bg-navy-700 rounded-full overflow-hidden">
                                    <motion.div
                                        className={`h-full rounded-full ${r.color}`}
                                        initial={{ width: 0 }}
                                        whileInView={{ width: `${(r.value / MOCK_STATS.totalEmployees) * 100}%` }}
                                        viewport={{ once: true }}
                                        transition={{ duration: 1, ease: 'easeOut' }}
                                    />
                                </div>
                            </div>
                        ))}
                    </div>
                </motion.div>
            </motion.div>

            {/* Leave breakdown */}
            <motion.div variants={fadeUp} className="card p-5 border border-white/06">
                <p className="text-sm font-semibold font-outfit text-white mb-4">Leave Status Summary</p>
                <div className="grid grid-cols-3 gap-4 text-center">
                    {[
                        { label: 'Pending', value: 2, color: 'text-amber-400' },
                        { label: 'Approved', value: 1, color: 'text-green-400' },
                        { label: 'Rejected', value: 0, color: 'text-red-400' },
                    ].map((s) => (
                        <div key={s.label}>
                            <p className={`text-3xl font-bold font-outfit ${s.color}`}>{s.value}</p>
                            <p className="text-xs text-gray-500 mt-1">{s.label}</p>
                        </div>
                    ))}
                </div>
            </motion.div>

            {/* Export note */}
            <motion.div variants={fadeUp} className="text-center py-4">
                <p className="text-xs text-gray-600">CSV / PDF export available after backend integration</p>
            </motion.div>
        </motion.div>
    );
}
