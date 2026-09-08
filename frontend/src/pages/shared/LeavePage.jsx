import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FileCheck, Plus, Calendar, ArrowRight, CheckCircle, X, Clock } from 'lucide-react';
import { fadeUp, staggerContainer } from '../../animations/variants';
import { Badge, Button, Modal, Select } from '../../components/ui';
import { useAuth } from '../../context/AuthContext';
import { MOCK_LEAVES } from '../../mock/data';

const LEAVE_TYPES = ['Sick Leave', 'Casual Leave', 'Earned Leave', 'Emergency Leave'];

export default function LeavePage() {
    const { user } = useAuth();
    const myLeaves = MOCK_LEAVES.filter((l) => l.employeeId === user?.id);
    const [showApply, setShowApply] = useState(false);
    const [form, setForm] = useState({ type: 'Sick Leave', from: '', to: '', reason: '' });

    const balance = { sick: 5, casual: 8, earned: 12 };

    return (
        <motion.div variants={staggerContainer} initial="hidden" animate="visible" className="space-y-6">
            <motion.div variants={fadeUp} className="flex items-start justify-between gap-4">
                <div>
                    <p className="text-[11px] text-[#19A7A8] uppercase tracking-widest font-bold mb-1">Worker</p>
                    <h1 className="text-2xl font-black font-outfit text-[#14212B]">My Leaves</h1>
                </div>
                <Button onClick={() => setShowApply(true)}><Plus size={15} /> Apply Leave</Button>
            </motion.div>

            {/* Leave balance */}
            <motion.div variants={fadeUp} className="grid grid-cols-3 gap-3">
                {[
                    { label: 'Sick', days: balance.sick, color: 'text-red-600', bg: 'bg-red-50', border: 'border-red-200' },
                    { label: 'Casual', days: balance.casual, color: 'text-amber-600', bg: 'bg-amber-50', border: 'border-amber-200' },
                    { label: 'Earned', days: balance.earned, color: 'text-green-600', bg: 'bg-green-50', border: 'border-green-200' },
                ].map((b) => (
                    <div key={b.label} className={`card p-4 text-center border ${b.border} ${b.bg}`}>
                        <p className={`text-2xl font-black font-outfit ${b.color}`}>{b.days}</p>
                        <p className="text-xs text-[#6B7E92] mt-0.5">{b.label} days</p>
                    </div>
                ))}
            </motion.div>

            {/* Leave history timeline */}
            <motion.div variants={fadeUp}>
                <p className="text-[10px] font-bold text-[#6B7E92] uppercase tracking-widest mb-3">My Applications</p>
                {myLeaves.length === 0 ? (
                    <div className="card p-10 text-center">
                        <FileCheck size={36} className="mx-auto mb-3 text-[#D0DAE6]" />
                        <p className="text-[#98A9BB] text-sm">No leave applications yet</p>
                    </div>
                ) : (
                    <div className="space-y-3">
                        {myLeaves.map((leave) => (
                            <motion.div key={leave.id} variants={fadeUp} className="card p-4">
                                <div className="flex items-start gap-3">
                                    <div className="w-9 h-9 rounded-xl bg-[#E6F7F7] flex items-center justify-center shrink-0">
                                        <Calendar size={16} className="text-[#19A7A8]" />
                                    </div>
                                    <div className="flex-1">
                                        <div className="flex items-center justify-between">
                                            <p className="font-semibold text-[#14212B] text-sm">{leave.leaveType}</p>
                                            <Badge status={leave.status} />
                                        </div>
                                        <p className="text-xs text-[#6B7E92] mt-0.5 flex items-center gap-1">
                                            <Clock size={10} />
                                            {leave.startDate} → {leave.endDate} · {leave.days} day(s)
                                        </p>
                                        {leave.reason && <p className="text-xs text-[#98A9BB] mt-1 italic">"{leave.reason}"</p>}
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                )}
            </motion.div>

            {/* Apply modal */}
            <Modal open={showApply} onClose={() => setShowApply(false)} title="Apply for Leave"
                footer={<><Button variant="secondary" onClick={() => setShowApply(false)}>Cancel</Button><Button><CheckCircle size={14} /> Submit</Button></>}>
                <div className="space-y-4">
                    <Select label="Leave Type" value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value })}>
                        {LEAVE_TYPES.map((t) => <option key={t} value={t}>{t}</option>)}
                    </Select>
                    <div className="grid grid-cols-2 gap-3">
                        <div>
                            <label className="text-xs font-semibold text-[#425466] uppercase tracking-wider block mb-1.5">From</label>
                            <input type="date" className="input-base" value={form.from} onChange={(e) => setForm({ ...form, from: e.target.value })} />
                        </div>
                        <div>
                            <label className="text-xs font-semibold text-[#425466] uppercase tracking-wider block mb-1.5">To</label>
                            <input type="date" className="input-base" value={form.to} onChange={(e) => setForm({ ...form, to: e.target.value })} />
                        </div>
                    </div>
                    <div>
                        <label className="text-xs font-semibold text-[#425466] uppercase tracking-wider block mb-1.5">Reason</label>
                        <textarea rows={3} className="input-base" placeholder="Brief reason…"
                            value={form.reason} onChange={(e) => setForm({ ...form, reason: e.target.value })} />
                    </div>
                </div>
            </Modal>
        </motion.div>
    );
}
