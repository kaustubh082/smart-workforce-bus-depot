import { motion } from 'framer-motion';
import { Clock, Plus, Sun, Moon, Sunset } from 'lucide-react';
import { fadeUp, staggerContainer } from '../../animations/variants';
import { PageHeader, Button } from '../../components/ui';

const SHIFTS = [
    { name: 'Morning Shift', time: '06:00 – 14:00', icon: Sun, color: '#f59e0b', bg: '#fef3c7', border: '#fde68a', workers: 8 },
    { name: 'Afternoon Shift', time: '14:00 – 22:00', icon: Sunset, color: '#19A7A8', bg: '#E6F7F7', border: '#b2e8e8', workers: 7 },
    { name: 'Night Shift', time: '22:00 – 06:00', icon: Moon, color: '#6366f1', bg: '#ede9fe', border: '#c4b5fd', workers: 5 },
];

export default function ShiftManagementPage() {
    return (
        <motion.div variants={staggerContainer} initial="hidden" animate="visible" className="space-y-6">
            <motion.div variants={fadeUp}>
                <PageHeader title="Shift Management" subtitle="Configure and monitor depot shifts"
                    action={<Button><Plus size={15} /> Add Shift</Button>} />
            </motion.div>

            <motion.div variants={staggerContainer} className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {SHIFTS.map(({ name, time, icon: Icon, color, bg, border, workers }) => (
                    <motion.div key={name} variants={fadeUp}
                        whileHover={{ y: -3, boxShadow: '0 8px 24px rgba(18,59,93,0.10)' }}
                        className="card p-6 transition-all" style={{ borderColor: border, background: bg }}>
                        <div className="w-12 h-12 rounded-2xl bg-white flex items-center justify-center mb-4"
                            style={{ boxShadow: '0 2px 8px rgba(18,59,93,0.08)' }}>
                            <Icon size={22} style={{ color }} />
                        </div>
                        <h3 className="font-outfit font-bold text-[#14212B] mb-1">{name}</h3>
                        <div className="flex items-center gap-1.5 text-sm text-[#6B7E92] mb-3">
                            <Clock size={13} style={{ color }} />
                            {time}
                        </div>
                        <div className="flex items-center justify-between pt-3 border-t border-[#E5EAF0]">
                            <span className="text-xs text-[#98A9BB]">{workers} workers</span>
                            <button className="text-xs font-semibold transition-colors" style={{ color }}>
                                Edit →
                            </button>
                        </div>
                    </motion.div>
                ))}
            </motion.div>

            {/* Info note */}
            <motion.div variants={fadeUp}
                className="card p-4 flex items-start gap-3 border border-[#E5EAF0] bg-[#F7F9FC]">
                <Clock size={16} className="text-[#19A7A8] mt-0.5 shrink-0" />
                <p className="text-sm text-[#6B7E92]">
                    Shifts are assigned during Duty Allocation. To change the schedule for a specific date, go to
                    <span className="text-[#19A7A8] font-semibold"> Duty Allocation</span>.
                </p>
            </motion.div>
        </motion.div>
    );
}
