import { useState } from 'react';
import { motion } from 'framer-motion';
import { CheckCircle, X, Clock, MessageSquare } from 'lucide-react';
import { fadeUp, staggerContainer } from '../../animations/variants';
import { PageHeader, Badge, Modal, Button } from '../../components/ui';
import { MOCK_LEAVES } from '../../mock/data';

export default function LeaveApprovalsPage() {
    const [leaves, setLeaves] = useState(MOCK_LEAVES);
    const [viewLeave, setViewLeave] = useState(null);
    const [filterStatus, setFilterStatus] = useState('all');

    const filtered = filterStatus === 'all' ? leaves : leaves.filter((l) => l.status === filterStatus);

    const updateStatus = (id, status) => {
        setLeaves((prev) => prev.map((l) => l.id === id ? { ...l, status } : l));
        setViewLeave(null);
    };

    const STATUS_TABS = ['all', 'pending', 'approved', 'rejected'];

    return (
        <motion.div variants={staggerContainer} initial="hidden" animate="visible" className="space-y-6">
            <motion.div variants={fadeUp}>
                <PageHeader title="Leave Approvals"
                    subtitle={`${leaves.filter(l => l.status === 'pending').length} pending requests`} />
            </motion.div>

            {/* Filter tabs */}
            <motion.div variants={fadeUp} className="flex gap-2 flex-wrap">
                {STATUS_TABS.map((s) => (
                    <button key={s} onClick={() => setFilterStatus(s)} capitalize
                        className="px-4 py-2 rounded-xl text-sm font-semibold border capitalize transition-all"
                        style={{
                            background: filterStatus === s ? '#E6F7F7' : '#FFFFFF',
                            borderColor: filterStatus === s ? '#19A7A8' : '#E5EAF0',
                            color: filterStatus === s ? '#178F90' : '#6B7E92',
                        }}>
                        {s === 'all' ? 'All' : s.charAt(0).toUpperCase() + s.slice(1)}
                        <span className="ml-1.5 text-[10px] font-bold">
                            ({s === 'all' ? leaves.length : leaves.filter(l => l.status === s).length})
                        </span>
                    </button>
                ))}
            </motion.div>

            {/* Leave list */}
            <motion.div variants={staggerContainer} className="space-y-3">
                {filtered.map((leave) => (
                    <motion.div key={leave.id} variants={fadeUp}
                        className="card p-4 flex items-center gap-4 cursor-pointer transition-all"
                        style={{ ':hover': { borderColor: '#19A7A8' } }}
                        whileHover={{ y: -1, boxShadow: '0 4px 16px rgba(18,59,93,0.08)' }}
                        onClick={() => setViewLeave(leave)}>
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#19A7A8] to-[#2D8CFF] flex items-center justify-center text-white font-bold shrink-0">
                            {leave.employeeName?.charAt(0)}
                        </div>
                        <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2">
                                <p className="font-semibold text-[#14212B] text-sm">{leave.employeeName}</p>
                                <Badge status={leave.status} />
                            </div>
                            <p className="text-xs text-[#6B7E92] mt-0.5">
                                {leave.leaveType} · {leave.days} day(s) · {leave.startDate}
                            </p>
                        </div>
                        {leave.status === 'pending' && (
                            <div className="flex gap-2 shrink-0">
                                <button onClick={(e) => { e.stopPropagation(); updateStatus(leave.id, 'approved'); }}
                                    className="p-2 rounded-xl bg-green-50 border border-green-200 text-green-600 hover:bg-green-100 transition-colors">
                                    <CheckCircle size={16} />
                                </button>
                                <button onClick={(e) => { e.stopPropagation(); updateStatus(leave.id, 'rejected'); }}
                                    className="p-2 rounded-xl bg-red-50 border border-red-200 text-red-500 hover:bg-red-100 transition-colors">
                                    <X size={16} />
                                </button>
                            </div>
                        )}
                    </motion.div>
                ))}
            </motion.div>

            {filtered.length === 0 && (
                <div className="text-center py-12 text-[#98A9BB]">No requests in this category.</div>
            )}

            {/* Detail modal */}
            <Modal open={!!viewLeave} onClose={() => setViewLeave(null)} title="Leave Request"
                footer={viewLeave?.status === 'pending' ? (
                    <>
                        <Button variant="secondary" onClick={() => setViewLeave(null)}>Close</Button>
                        <Button variant="danger" onClick={() => updateStatus(viewLeave.id, 'rejected')}><X size={14} /> Reject</Button>
                        <Button onClick={() => updateStatus(viewLeave.id, 'approved')}><CheckCircle size={14} /> Approve</Button>
                    </>
                ) : <Button variant="secondary" onClick={() => setViewLeave(null)}>Close</Button>}>
                {viewLeave && (
                    <div className="space-y-3">
                        {[
                            { label: 'Employee', value: viewLeave.employeeName },
                            { label: 'Leave Type', value: viewLeave.leaveType },
                            { label: 'Duration', value: `${viewLeave.startDate} to ${viewLeave.endDate} (${viewLeave.days} days)` },
                            { label: 'Status', value: <Badge status={viewLeave.status} /> },
                            { label: 'Reason', value: viewLeave.reason },
                        ].map(({ label, value }) => (
                            <div key={label} className="flex items-start gap-3">
                                <span className="text-xs text-[#98A9BB] w-24 shrink-0 pt-0.5">{label}</span>
                                <span className="text-sm font-medium text-[#14212B]">{value}</span>
                            </div>
                        ))}
                    </div>
                )}
            </Modal>
        </motion.div>
    );
}
