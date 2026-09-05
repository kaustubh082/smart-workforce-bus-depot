import { motion } from 'framer-motion';
import { Bus, MapPin, Clock, Calendar } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { fadeUp, staggerContainer } from '../../animations/variants';
import { Badge, PageHeader } from '../../components/ui';
import { MOCK_DUTIES } from '../../mock/data';

export default function DutyHistoryPage() {
    const { user } = useAuth();
    const myDuties = MOCK_DUTIES
        .filter((d) => d.employeeId === user?.id)
        .sort((a, b) => b.date.localeCompare(a.date));

    return (
        <motion.div variants={staggerContainer} initial="hidden" animate="visible" className="space-y-6 max-w-lg">
            <motion.div variants={fadeUp}>
                <PageHeader title="Duty History" subtitle="All your past and upcoming duty assignments" />
            </motion.div>

            {myDuties.length === 0 ? (
                <motion.div variants={fadeUp} className="card p-10 text-center border border-white/05">
                    <Bus size={32} className="text-gray-600 mx-auto mb-2" />
                    <p className="text-gray-500">No duty history found</p>
                </motion.div>
            ) : (
                <div className="space-y-3">
                    {myDuties.map((d, i) => (
                        <motion.div key={d.id} variants={fadeUp} custom={i}
                            className="card p-5 border border-white/05 hover:border-teal-500/15 transition-colors">
                            <div className="flex items-start justify-between mb-3">
                                <div>
                                    <p className="text-base font-semibold font-outfit text-white">Route {d.routeNo}</p>
                                    <div className="flex items-center gap-1.5 mt-0.5 text-sm text-gray-400">
                                        <MapPin size={13} className="text-gray-500" />
                                        {d.routeFrom} → {d.routeTo}
                                    </div>
                                </div>
                                <Badge status={d.status} />
                            </div>
                            <div className="flex flex-wrap items-center gap-4 text-xs text-gray-500">
                                <span className="flex items-center gap-1.5"><Calendar size={12} />{d.date}</span>
                                <span className="flex items-center gap-1.5"><Clock size={12} />{d.startTime} – {d.endTime}</span>
                                <span className="flex items-center gap-1.5"><Bus size={12} />{d.busReg}</span>
                            </div>
                        </motion.div>
                    ))}
                </div>
            )}
        </motion.div>
    );
}
