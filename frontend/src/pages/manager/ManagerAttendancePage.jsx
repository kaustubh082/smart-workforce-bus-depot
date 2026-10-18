import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { CalendarCheck } from 'lucide-react';
import { PageHeader, Badge } from '../../components/ui';
import { api } from '../../services/api';

export default function ManagerAttendancePage() {
    const [records, setRecords] = useState([]);
    const [error, setError] = useState('');
    const today = new Date().toISOString().slice(0, 10);
    useEffect(() => { api(`/attendance?from=${today}&to=${today}`).then(setRecords).catch((err) => setError(err.message)); }, [today]);
    return <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
        <PageHeader title="Attendance" subtitle="Today’s employee attendance records" />
        {error && <p className="text-sm text-red-600">{error}</p>}
        <div className="grid grid-cols-2 gap-4 max-w-md"><div className="card p-4"><p className="text-2xl font-black text-[#19A7A8]">{records.length}</p><p className="text-xs text-[#6B7E92]">Marked today</p></div><div className="card p-4"><p className="text-2xl font-black text-green-600">{records.filter((r) => r.status === 'PRESENT').length}</p><p className="text-xs text-[#6B7E92]">Present</p></div></div>
        <div className="card overflow-hidden">{records.length ? <table className="w-full text-sm"><thead><tr className="bg-[#F7F9FC] border-b border-[#E5EAF0]">{['Employee', 'Employee ID', 'Status', 'Check in', 'Check out'].map((h) => <th key={h} className="text-left p-4 text-xs text-[#6B7E92]">{h}</th>)}</tr></thead><tbody>{records.map((record) => <tr key={record.id} className="border-b border-[#F7F9FC]"><td className="p-4 font-medium">{record.name}</td><td className="p-4">{record.employee_code}</td><td className="p-4"><Badge status={record.status} /></td><td className="p-4">{new Date(record.marked_at).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })}</td><td className="p-4">{record.check_out_at ? new Date(record.check_out_at).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' }) : '—'}</td></tr>)}</tbody></table> : <div className="p-12 text-center text-[#98A9BB]"><CalendarCheck size={32} className="mx-auto mb-3" /><p>No attendance has been marked today.</p></div>}</div>
    </motion.div>;
}
