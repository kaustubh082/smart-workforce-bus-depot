import { useState } from 'react';
import { motion } from 'framer-motion';
import { Calendar, Send, AlertCircle } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { fadeUp, staggerContainer } from '../../animations/variants';
import { Button, Alert, PageHeader, Badge } from '../../components/ui';
import { MOCK_LEAVES, MOCK_LEAVE_BALANCE } from '../../mock/data';

const LEAVE_TYPES = ['Casual Leave', 'Sick Leave', 'Annual Leave'];

export default function LeavePage() {
    const { user } = useAuth();
    const balance = MOCK_LEAVE_BALANCE[user?.id] || {};
    const myLeaves = MOCK_LEAVES.filter((l) => l.employeeId === user?.id);

    const [form, setForm] = useState({ leaveType: 'Casual Leave', fromDate: '', toDate: '', reason: '' });
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState('');
    const [error, setError] = useState('');
    const [leaves, setLeaves] = useState(myLeaves);

    const change = (k) => (e) => setForm({ ...form, [k]: e.target.value });

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!form.fromDate || !form.toDate) { setError('Please select dates'); return; }
        if (form.toDate < form.fromDate) { setError('End date must be after start date'); return; }
        setError(''); setLoading(true);
        await delay(800);
        const newLeave = {
            id: 'L' + Date.now(),
            employeeId: user.id, employeeName: user.name,
            leaveType: form.leaveType, fromDate: form.fromDate, toDate: form.toDate,
            days: daysBetween(form.fromDate, form.toDate),
            reason: form.reason, status: 'pending',
            appliedOn: new Date().toISOString().split('T')[0],
        };
        setLeaves([newLeave, ...leaves]);
        setSuccess(`Leave request submitted for ${newLeave.days} day(s) — awaiting approval`);
        setForm({ leaveType: 'Casual Leave', fromDate: '', toDate: '', reason: '' });
        setLoading(false);
    };

    return (
        <motion.div variants={staggerContainer} initial="hidden" animate="visible" className="space-y-6 max-w-lg">
            <motion.div variants={fadeUp}>
                <PageHeader title="Leave Management" subtitle="Apply and track your leave requests" />
            </motion.div>

            {/* Leave balance */}
            {Object.keys(balance).length > 0 && (
                <motion.div variants={fadeUp} className="grid grid-cols-3 gap-3">
                    {Object.entries(balance).map(([type, b]) => (
                        <div key={type} className="card p-4 text-center">
                            <p className="text-2xl font-bold font-outfit text-teal-400">{b.remaining}</p>
                            <p className="text-xs text-gray-500 mt-1 capitalize">{type}<br />remaining</p>
                        </div>
                    ))}
                </motion.div>
            )}

            {success && <motion.div variants={fadeUp}><Alert type="success">{success}</Alert></motion.div>}
            {error && <motion.div variants={fadeUp}><Alert type="danger">{error}</Alert></motion.div>}

            {/* Apply leave form */}
            <motion.div variants={fadeUp} className="card p-5 border border-white/06">
                <h2 className="text-base font-semibold font-outfit text-white mb-4">Apply for Leave</h2>
                <form onSubmit={handleSubmit} className="space-y-4">
                    {/* Type */}
                    <div className="flex flex-col gap-1">
                        <label className="text-xs font-medium text-gray-400 uppercase tracking-wider">Leave Type</label>
                        <select className="input-base" value={form.leaveType} onChange={change('leaveType')}
                            style={{ background: '#1a2847' }}>
                            {LEAVE_TYPES.map((t) => <option key={t}>{t}</option>)}
                        </select>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                        <div className="flex flex-col gap-1">
                            <label className="text-xs font-medium text-gray-400 uppercase tracking-wider">From</label>
                            <input type="date" className="input-base" value={form.fromDate} onChange={change('fromDate')}
                                min={new Date().toISOString().split('T')[0]} style={{ colorScheme: 'dark' }} />
                        </div>
                        <div className="flex flex-col gap-1">
                            <label className="text-xs font-medium text-gray-400 uppercase tracking-wider">To</label>
                            <input type="date" className="input-base" value={form.toDate} onChange={change('toDate')}
                                min={form.fromDate || new Date().toISOString().split('T')[0]} style={{ colorScheme: 'dark' }} />
                        </div>
                    </div>

                    {form.fromDate && form.toDate && form.toDate >= form.fromDate && (
                        <p className="text-sm text-teal-400">
                            {daysBetween(form.fromDate, form.toDate)} day(s) selected
                        </p>
                    )}

                    <div className="flex flex-col gap-1">
                        <label className="text-xs font-medium text-gray-400 uppercase tracking-wider">Reason</label>
                        <textarea className="input-base resize-none h-20" placeholder="Briefly explain your reason…"
                            value={form.reason} onChange={change('reason')} />
                    </div>

                    <Button type="submit" variant="primary" size="lg" className="w-full" loading={loading} icon={<Send size={16} />}>
                        Submit Leave Request
                    </Button>
                </form>
            </motion.div>

            {/* My leaves */}
            <motion.div variants={fadeUp}>
                <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">My Leave History</p>
                {leaves.length === 0
                    ? <p className="text-sm text-gray-600 text-center py-6">No leave requests yet</p>
                    : (
                        <div className="space-y-3">
                            {leaves.map((l) => (
                                <div key={l.id} className="card p-4 border border-white/05">
                                    <div className="flex items-start justify-between mb-1.5">
                                        <div>
                                            <p className="text-sm font-semibold text-white">{l.leaveType}</p>
                                            <p className="text-xs text-gray-400">
                                                {l.fromDate} → {l.toDate} · {l.days} day(s)
                                            </p>
                                        </div>
                                        <Badge status={l.status} />
                                    </div>
                                    {l.reason && <p className="text-xs text-gray-500 mt-1">"{l.reason}"</p>}
                                </div>
                            ))}
                        </div>
                    )}
            </motion.div>
        </motion.div>
    );
}

function delay(ms) { return new Promise((r) => setTimeout(r, ms)); }
function daysBetween(from, to) {
    return Math.max(1, Math.round((new Date(to) - new Date(from)) / 86400000) + 1);
}
