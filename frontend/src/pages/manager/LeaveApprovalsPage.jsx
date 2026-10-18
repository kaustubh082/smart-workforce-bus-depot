import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { CheckCircle, X } from 'lucide-react';
import { PageHeader, Badge, Button } from '../../components/ui';
import { api } from '../../services/api';

export default function LeaveApprovalsPage() {
    const [leaves, setLeaves] = useState([]); const [error, setError] = useState(''); const [saving, setSaving] = useState('');
    const load = () => api('/leaves/pending').then(setLeaves).catch((err) => setError(err.message));
    useEffect(() => { load(); }, []);
    const decide = async (id, choice) => { setSaving(`${id}-${choice}`); setError(''); try { await api(`/leaves/${id}/${choice}`, { method: 'PUT' }); load(); } catch (err) { setError(err.message); } finally { setSaving(''); } };
    return <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="space-y-6"><PageHeader title="Leave Approvals" subtitle={`${leaves.length} pending requests`} />{error && <p className="text-sm text-red-600">{error}</p>}<div className="space-y-3">{leaves.map((leave) => <div key={leave.id} className="card p-4 flex items-center gap-4"><div className="w-10 h-10 rounded-full bg-[#E6F7F7] flex items-center justify-center font-bold text-[#19A7A8]">{leave.name?.charAt(0)}</div><div className="flex-1"><p className="font-semibold text-[#14212B]">{leave.name}</p><p className="text-xs text-[#6B7E92]">{leave.leave_type} · {leave.start_date} to {leave.end_date}</p><p className="text-xs text-[#98A9BB] mt-1">{leave.reason}</p></div><Badge status="pending" /><div className="flex gap-2"><Button size="sm" variant="danger" loading={saving === `${leave.id}-reject`} onClick={() => decide(leave.id, 'reject')}><X size={14} /> Reject</Button><Button size="sm" loading={saving === `${leave.id}-approve`} onClick={() => decide(leave.id, 'approve')}><CheckCircle size={14} /> Approve</Button></div></div>)}</div>{!leaves.length && <div className="card p-12 text-center text-[#98A9BB]">No leave requests are waiting for approval.</div>}</motion.div>;
}
