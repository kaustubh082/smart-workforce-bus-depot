import { motion } from 'framer-motion';
import { Bus, Clock, MapPin, Calendar } from 'lucide-react';
import { fadeUp, staggerContainer } from '../../animations/variants';
import { Badge, PageHeader } from '../../components/ui';
import { useAuth } from '../../context/AuthContext';
import { MOCK_DUTIES } from '../../mock/data';

export default function DutyHistoryPage() {
    const { user } = useAuth();
    const history = MOCK_DUTIES.filter((d) =>
        d.employeeId === user?.id || d.driverName === user?.name || d.conductorName === user?.name
    ).sort((a, b) => b.date.localeCompare(a.date));

    return (
        <motion.div variants={staggerContainer} initial="hidden" animate="visible" className="space-y-6">
            <motion.div variants={fadeUp}>
                <PageHeader title="Duty History" subtitle={`${history.length} total assignments`} />
            </motion.div>

            {history.length === 0 ? (
                <motion.div variants={fadeUp} className="card p-12 text-center">
                    <Calendar size={36} className="mx-auto mb-3 text-[#D0DAE6]" />
                    <p className="text-[#98A9BB] text-sm">No duty history found</p>
                </motion.div>
            ) : (
                <motion.div variants={staggerContainer} className="space-y-3">
                    {history.map((duty) => (
                        <motion.div key={duty.id} variants={fadeUp}
                            whileHover={{ y: -1, boxShadow: '0 4px 14px rgba(18,59,93,0.08)' }}
                            className="card p-4 transition-all">
                            <div className="flex items-start justify-between mb-3">
                                <div>
                                    <p className="text-[10px] text-[#98A9BB] uppercase tracking-wider font-bold mb-0.5 flex items-center gap-1">
                                        <Calendar size={9} /> {duty.date}
                                    </p>
                                    <h3 className="font-outfit font-bold text-[#14212B]">Route {duty.routeNo}</h3>
                                </div>
                                <Badge status={duty.status} />
                            </div>
                            <div className="grid grid-cols-3 gap-3 text-xs">
                                <div className="flex items-center gap-1.5 text-[#6B7E92]">
                                    <Bus size={11} className="text-[#19A7A8]" />
                                    <span>{duty.busReg}</span>
                                </div>
                                <div className="flex items-center gap-1.5 text-[#6B7E92]">
                                    <Clock size={11} className="text-amber-500" />
                                    <span>{duty.startTime}–{duty.endTime}</span>
                                </div>
                                <div className="flex items-center gap-1.5 text-[#6B7E92]">
                                    <MapPin size={11} className="text-[#2D8CFF]" />
                                    <span className="truncate">{duty.routeFrom}→{duty.routeTo}</span>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </motion.div>
            )}
        </motion.div>
    );
}
