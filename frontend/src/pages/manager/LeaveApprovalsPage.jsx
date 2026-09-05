import { useState } from 'react';
import { motion } from 'framer-motion';
import { Check, X } from 'lucide-react';
import { fadeUp, staggerContainer } from '../../animations/variants';
import { Badge, PageHeader, Button, Alert } from '../../components/ui';
import { MOCK_LEAVES } from '../../mock/data';

export default function LeaveApprovalsPage() {
    const [leaves, setLeaves] = useState(MOCK_LEAVES);
    const [lastAction, setLastAction] = useState('');

    const act = (id, action) => {
        setLeaves((prev) => prev.map((l) => l.id === id ? { ...l, status: action } : l));
        setLastAction(action === 'approved' ? '✓ Leave approved' : '✗ Leave rejected');
        setTimeout(() => setLastAction(''), 3000);
    };

    const pending = leaves.filter((l) => l.status === 'pending');
    const processed = leaves.filter((l) => l.status !== 'pending');

    return (
        <motion.div variants={staggerContainer} initial="hidden" animate="visible" className="space-y-6">
            <motion.div variants={fadeUp}>
                <PageHeader title="Leave Approvals" subtitle={`${pending.length} pending requests`} />
            </motion.div>

            {lastAction && <motion.div variants={fadeUp}><Alert type={lastAction.startsWith('✓') ? 'success' : 'danger'}>{lastAction}</Alert></motion.div>}

            {/* Pending */}
            {pending.length === 0 ? (
                <motion.div variants={fadeUp} className="card p-10 text-center border border-white/05">
                    <Check size={30} className="text-green-400 mx-auto mb-2" />
                    <p className="text-gray-400 font-medium">All leave requests processed!</p>
                </motion.div>
            ) : (
                <div className="space-y-4">
                    {pending.map((l) => (
                        <motion.div key={l.id} variants={fadeUp}
                            className="card p-5 border border-amber-400/15 hover:border-amber-400/25 transition-colors">
                            <div className="flex items-start justify-between mb-3">
                                <div>
                                    <p className="text-base font-semibold font-outfit text-white">{l.employeeName}</p>
                                    <p className="text-sm text-gray-400">{l.leaveType} · {l.days} day(s)</p>
                                    <p className="text-xs text-gray-500 mt-0.5">{l.fromDate} → {l.toDate}</p>
                                </div>
                                <Badge status="pending" />
                            </div>
                            {l.reason && <p className="text-sm text-gray-400 italic mb-4">"{l.reason}"</p>}
                            <div className="flex gap-3">
                                <Button variant="primary" size="sm" icon={<Check size={14} />} onClick={() => act(l.id, 'approved')}>Approve</Button>
                                <Button variant="danger" size="sm" icon={<X size={14} />} onClick={() => act(l.id, 'rejected')}>Reject</Button>
                            </div>
                        </motion.div>
                    ))}
                </div>
            )}

            {/* Processed */}
            {processed.length > 0 && (
                <motion.div variants={fadeUp}>
                    <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">Processed</p>
                    <div className="space-y-2">
                        {processed.map((l) => (
                            <div key={l.id} className="card p-4 flex items-center justify-between border border-white/04 opacity-70">
                                <div>
                                    <p className="text-sm font-medium text-white">{l.employeeName} — {l.leaveType}</p>
                                    <p className="text-xs text-gray-500">{l.fromDate} → {l.toDate} · {l.days}d</p>
                                </div>
                                <Badge status={l.status} />
                            </div>
                        ))}
                    </div>
                </motion.div>
            )}
        </motion.div>
    );
}
