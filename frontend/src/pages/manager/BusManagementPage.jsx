import { motion } from 'framer-motion';
import { Bus, Plus, Wrench, CheckCircle, XCircle } from 'lucide-react';
import { fadeUp, staggerContainer } from '../../animations/variants';
import { PageHeader, Badge, Button } from '../../components/ui';
import { MOCK_BUSES } from '../../mock/data';

const STATUS_ICONS = {
    operational: { Ic: CheckCircle, color: 'text-green-500', bg: 'bg-green-50', border: 'border-green-200' },
    maintenance: { Ic: Wrench, color: 'text-amber-500', bg: 'bg-amber-50', border: 'border-amber-200' },
    'out-of-service': { Ic: XCircle, color: 'text-red-500', bg: 'bg-red-50', border: 'border-red-200' },
};

export default function BusManagementPage() {
    const operational = MOCK_BUSES.filter(b => b.status === 'operational').length;
    const maintenance = MOCK_BUSES.filter(b => b.status === 'maintenance').length;
    const outOfService = MOCK_BUSES.filter(b => b.status === 'out-of-service').length;

    return (
        <motion.div variants={staggerContainer} initial="hidden" animate="visible" className="space-y-6">
            <motion.div variants={fadeUp}>
                <PageHeader title="Bus Fleet"
                    subtitle={`${MOCK_BUSES.length} buses · ${operational} operational`}
                    action={<Button><Plus size={15} /> Add Bus</Button>} />
            </motion.div>

            {/* Fleet summary strip */}
            <motion.div variants={fadeUp} className="grid grid-cols-3 gap-4">
                {[
                    { label: 'Operational', count: operational, color: 'text-green-600', bg: 'bg-green-50', border: 'border-green-200' },
                    { label: 'Maintenance', count: maintenance, color: 'text-amber-600', bg: 'bg-amber-50', border: 'border-amber-200' },
                    { label: 'Out of Service', count: outOfService, color: 'text-red-600', bg: 'bg-red-50', border: 'border-red-200' },
                ].map((s) => (
                    <div key={s.label} className={`card p-4 text-center border ${s.border} ${s.bg}`}>
                        <p className={`text-2xl font-black font-outfit ${s.color}`}>{s.count}</p>
                        <p className="text-xs text-[#6B7E92] mt-0.5">{s.label}</p>
                    </div>
                ))}
            </motion.div>

            {/* Bus cards */}
            <motion.div variants={staggerContainer} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {MOCK_BUSES.map((bus) => {
                    const s = STATUS_ICONS[bus.status] || STATUS_ICONS.operational;
                    const Ic = s.Ic;
                    return (
                        <motion.div key={bus.id} variants={fadeUp}
                            whileHover={{ y: -3, boxShadow: '0 8px 24px rgba(18,59,93,0.10)' }}
                            className="card p-5 transition-all">
                            <div className="flex items-start justify-between mb-4">
                                <div className={`w-10 h-10 rounded-xl ${s.bg} border ${s.border} flex items-center justify-center`}>
                                    <Bus size={18} className={s.color} />
                                </div>
                                <Ic size={18} className={s.color} />
                            </div>
                            <p className="font-outfit font-bold text-[#14212B] text-lg">{bus.registrationNo}</p>
                            <p className="text-xs text-[#6B7E92] mt-0.5">{bus.model} · {bus.capacity} seats</p>
                            <div className="mt-3 pt-3 border-t border-[#F7F9FC] flex justify-between text-xs text-[#98A9BB]">
                                <span>Year: {bus.year || 2020}</span>
                                <Badge status={bus.status} />
                            </div>
                        </motion.div>
                    );
                })}
            </motion.div>
        </motion.div>
    );
}
