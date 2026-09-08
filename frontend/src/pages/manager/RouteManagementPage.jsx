import { motion } from 'framer-motion';
import { MapPin, Plus } from 'lucide-react';
import { fadeUp, staggerContainer } from '../../animations/variants';
import { PageHeader, Badge, Button } from '../../components/ui';
import { MOCK_ROUTES } from '../../mock/data';

export default function RouteManagementPage() {
    return (
        <motion.div variants={staggerContainer} initial="hidden" animate="visible" className="space-y-6">
            <motion.div variants={fadeUp}>
                <PageHeader title="Route Management"
                    subtitle={`${MOCK_ROUTES.length} routes registered`}
                    action={<Button><Plus size={15} /> Add Route</Button>} />
            </motion.div>

            <motion.div variants={staggerContainer} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {MOCK_ROUTES.map((route, i) => (
                    <motion.div key={route.id} variants={fadeUp}
                        whileHover={{ y: -3, boxShadow: '0 8px 24px rgba(18,59,93,0.10)' }}
                        className="card p-5 transition-all">
                        {/* Top accent color bar */}
                        <div className="h-1 -m-5 mb-4 rounded-t-card" style={{ background: `linear-gradient(90deg,#19A7A8,#2D8CFF)`, opacity: 0.6 + i * 0.05 }} />
                        <div className="flex items-start justify-between mb-3">
                            <div className="w-10 h-10 rounded-xl bg-[#E6F7F7] flex items-center justify-center">
                                <span className="font-outfit font-black text-[#19A7A8] text-sm">{route.routeNo}</span>
                            </div>
                            <Badge status={route.status || 'active'} />
                        </div>
                        <div className="flex items-start gap-2">
                            <MapPin size={14} className="text-[#19A7A8] mt-0.5 shrink-0" />
                            <div>
                                <p className="font-semibold text-[#14212B] text-sm">{route.from}</p>
                                <div className="w-0.5 h-3 bg-[#D0DAE6] ml-1 my-0.5" />
                                <p className="font-semibold text-[#14212B] text-sm">{route.to}</p>
                            </div>
                        </div>
                        <div className="mt-3 pt-3 border-t border-[#F7F9FC] flex justify-between text-xs text-[#98A9BB]">
                            <span>{route.distance || '—'} km</span>
                            <span>{route.stops || 0} stops</span>
                        </div>
                    </motion.div>
                ))}
            </motion.div>
        </motion.div>
    );
}
