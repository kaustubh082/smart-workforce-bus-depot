import { motion } from 'framer-motion';
import { fadeUp, staggerContainer } from '../../animations/variants';
import { PageHeader, Badge, Table } from '../../components/ui';
import { MOCK_SHIFTS, MOCK_EMPLOYEES } from '../../mock/data';

const SHIFT_COLORS = { Morning: 'badge-info', Afternoon: 'badge-warning', Night: 'bg-purple-500/15 text-purple-400 border border-purple-500/20' };

export default function ShiftManagementPage() {
    const columns = [
        { key: 'name', label: 'Shift', render: (v) => <span className={`badge ${SHIFT_COLORS[v] || 'badge-neutral'}`}>{v}</span> },
        { key: 'startTime', label: 'Start', render: (v) => <span className="font-mono text-gray-200">{v}</span> },
        { key: 'endTime', label: 'End', render: (v) => <span className="font-mono text-gray-200">{v}</span> },
        {
            key: 'id', label: 'Employees', render: (id, row) => {
                const count = MOCK_EMPLOYEES.filter((e) => e.shift === row.name).length;
                return <span className="text-teal-400 font-semibold">{count}</span>;
            }
        },
    ];

    return (
        <motion.div variants={staggerContainer} initial="hidden" animate="visible" className="space-y-6">
            <motion.div variants={fadeUp}>
                <PageHeader title="Shift Management" subtitle="View and manage depot shift timings" />
            </motion.div>

            {/* Shift cards */}
            <motion.div variants={staggerContainer} className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {MOCK_SHIFTS.map((s) => {
                    const empCount = MOCK_EMPLOYEES.filter((e) => e.shift === s.name).length;
                    const colorMap = { Morning: 'border-teal-500/25 bg-teal-500/5', Afternoon: 'border-amber-400/25 bg-amber-400/5', Night: 'border-purple-500/25 bg-purple-500/5' };
                    const textMap = { Morning: 'text-teal-400', Afternoon: 'text-amber-400', Night: 'text-purple-400' };
                    return (
                        <motion.div key={s.id} variants={fadeUp}
                            className={`card p-5 border ${colorMap[s.name] || 'border-white/06'}`}>
                            <p className={`text-2xl font-bold font-outfit ${textMap[s.name] || 'text-gray-300'}`}>{s.name}</p>
                            <p className="text-sm text-gray-400 mt-1 font-mono">{s.startTime} → {s.endTime}</p>
                            <p className="text-xs text-gray-500 mt-3">{empCount} employees assigned</p>
                        </motion.div>
                    );
                })}
            </motion.div>

            <motion.div variants={fadeUp}>
                <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">Shift Details</p>
                <Table columns={columns} data={MOCK_SHIFTS} />
            </motion.div>
        </motion.div>
    );
}
