import { motion } from 'framer-motion';
import { fadeUp, staggerContainer } from '../../animations/variants';
import { PageHeader, Badge } from '../../components/ui';
import { MOCK_ROSTER, MOCK_SHIFTS } from '../../mock/data';

const SHIFT_COLOR = { Morning: 'badge-info', Afternoon: 'badge-warning', Night: 'bg-purple-500/15 text-purple-400', Off: 'badge-neutral' };
const DAYS = ['mon', 'tue', 'wed', 'thu', 'fri', 'sat', 'sun'];
const DAY_LABELS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

export default function RosterPage() {
    return (
        <motion.div variants={staggerContainer} initial="hidden" animate="visible" className="space-y-6">
            <motion.div variants={fadeUp}>
                <PageHeader title="Weekly Roster" subtitle="Week of Sep 1 – Sep 7, 2026" />
            </motion.div>

            {/* Legend */}
            <motion.div variants={fadeUp} className="flex flex-wrap gap-2">
                {MOCK_SHIFTS.map((s) => (
                    <div key={s.name} className="flex items-center gap-2 px-3 py-1.5 bg-navy-800 border border-white/06 rounded-full text-xs">
                        <span className={`badge ${SHIFT_COLOR[s.name]}`}>{s.name}</span>
                        <span className="text-gray-500">{s.startTime}–{s.endTime}</span>
                    </div>
                ))}
                <span className="badge badge-neutral self-center">Off</span>
            </motion.div>

            {/* Roster table */}
            <motion.div variants={fadeUp} className="overflow-x-auto rounded-card border border-white/06">
                <table className="w-full text-sm">
                    <thead>
                        <tr className="bg-navy-700/50 border-b border-white/06">
                            <th className="px-4 py-3 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider whitespace-nowrap min-w-[140px]">Employee</th>
                            {DAY_LABELS.map((d) => (
                                <th key={d} className="px-3 py-3 text-center text-xs font-semibold text-gray-400 uppercase tracking-wider">{d}</th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {MOCK_ROSTER.map((row, i) => (
                            <tr key={i} className="border-b border-white/04 hover:bg-navy-700/20 transition-colors">
                                <td className="px-4 py-3">
                                    <div className="flex items-center gap-2">
                                        <div className="w-6 h-6 rounded-full bg-teal-500/20 flex items-center justify-center text-xs font-bold text-teal-400">
                                            {row.employee.charAt(0)}
                                        </div>
                                        <span className="text-gray-200 text-sm whitespace-nowrap">{row.employee}</span>
                                    </div>
                                </td>
                                {DAYS.map((day) => (
                                    <td key={day} className="px-3 py-3 text-center">
                                        <span className={`badge ${SHIFT_COLOR[row[day]] || 'badge-neutral'} text-[10px]`}>
                                            {row[day]}
                                        </span>
                                    </td>
                                ))}
                            </tr>
                        ))}
                    </tbody>
                </table>
            </motion.div>

            <motion.div variants={fadeUp} className="text-center text-xs text-gray-600 py-4">
                Drag-and-drop roster editing will be available in production version
            </motion.div>
        </motion.div>
    );
}
