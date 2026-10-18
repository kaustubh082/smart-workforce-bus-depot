import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Bus, Clock, MapPin, Calendar } from 'lucide-react';
import { Badge, PageHeader } from '../../components/ui';
import { api } from '../../services/api';

export default function DutyHistoryPage() {
    const [duties, setDuties] = useState([]); const [error, setError] = useState('');
    useEffect(() => { api('/duties/my').then(setDuties).catch((err) => setError(err.message)); }, []);
    return <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="space-y-6"><PageHeader title="Duty History" subtitle={`${duties.length} total assignments`} />{error && <p className="text-sm text-red-600">Unable to load duties: {error}</p>}{!duties.length ? <div className="card p-12 text-center"><Calendar size={36} className="mx-auto mb-3 text-[#D0DAE6]" /><p className="text-[#98A9BB] text-sm">No duty history found</p></div> : <div className="space-y-3">{duties.map((duty) => <div key={duty.id} className="card p-4"><div className="flex justify-between mb-3"><div><p className="text-xs text-[#98A9BB]"><Calendar size={11} className="inline mr-1" />{duty.duty_date}</p><h3 className="font-bold text-[#14212B]">Route {duty.route_code}</h3></div><Badge status={duty.status?.toLowerCase()} /></div><div className="grid grid-cols-3 gap-3 text-xs text-[#6B7E92]"><span className="flex gap-1"><Bus size={13} className="text-[#19A7A8]" />{duty.registration_number}</span><span className="flex gap-1"><Clock size={13} className="text-amber-500" />{duty.start_time?.slice(0, 5)}–{duty.end_time?.slice(0, 5)}</span><span className="flex gap-1"><MapPin size={13} className="text-[#2D8CFF]" />{duty.route_from}→{duty.route_to}</span></div></div>)}</div>}</motion.div>;
}
