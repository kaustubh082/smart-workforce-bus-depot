import { useState } from 'react';
import { motion } from 'framer-motion';
import { CheckCircle, XCircle, Clock, Calendar } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { fadeUp, staggerContainer } from '../../animations/variants';
import { Button, Alert, PageHeader, Badge } from '../../components/ui';
import { MOCK_ATTENDANCE } from '../../mock/data';

export default function AttendancePage() {
    const { user } = useAuth();
    const today = new Date().toISOString().split('T')[0];
    const todayRecord = MOCK_ATTENDANCE.find((a) => a.employeeId === user?.id && a.date === today);
    const [status, setStatus] = useState(todayRecord?.status || 'not-marked');
    const [checkIn, setCheckIn] = useState(todayRecord?.checkIn || null);
    const [checkOut, setCheckOut] = useState(todayRecord?.checkOut || null);
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState('');

    const now = () => new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', hour12: false });

    const handleCheckIn = async () => {
        setLoading(true);
        await delay(600);
        const t = now();
        setCheckIn(t);
        setStatus('present');
        setSuccess(`Check-in recorded at ${t}`);
        setLoading(false);
    };

    const handleCheckOut = async () => {
        setLoading(true);
        await delay(600);
        const t = now();
        setCheckOut(t);
        setSuccess(`Check-out recorded at ${t}`);
        setLoading(false);
    };

    const isCheckedIn = !!checkIn;
    const isCheckedOut = !!checkOut;

    return (
        <motion.div variants={staggerContainer} initial="hidden" animate="visible" className="space-y-6 max-w-lg">
            <motion.div variants={fadeUp}>
                <PageHeader title="Attendance" subtitle={formatDate(today)} />
            </motion.div>

            {success && (
                <motion.div variants={fadeUp}>
                    <Alert type="success">{success}</Alert>
                </motion.div>
            )}

            {/* Status card */}
            <motion.div variants={fadeUp}
                className={`rounded-card p-6 border text-center ${status === 'present' ? 'bg-success/8 border-success/25' : 'bg-navy-800 border-white/06'
                    }`}>
                <div className="w-16 h-16 rounded-full mx-auto mb-4 flex items-center justify-center
          bg-navy-700">
                    {status === 'present'
                        ? <CheckCircle size={32} className="text-green-400" />
                        : <XCircle size={32} className="text-gray-600" />
                    }
                </div>
                <p className="text-lg font-bold font-outfit text-white mb-1">
                    {status === 'present' ? 'Attendance Marked' : 'Not Checked In Yet'}
                </p>
                <p className="text-sm text-gray-400">{formatDate(today)}</p>

                {checkIn && (
                    <div className="mt-4 grid grid-cols-2 gap-3">
                        <div className="bg-navy-700/60 rounded-xl p-3">
                            <p className="text-xs text-gray-500 mb-1">Check In</p>
                            <p className="text-base font-semibold text-green-400">{checkIn}</p>
                        </div>
                        <div className="bg-navy-700/60 rounded-xl p-3">
                            <p className="text-xs text-gray-500 mb-1">Check Out</p>
                            <p className="text-base font-semibold text-gray-400">{checkOut || '—'}</p>
                        </div>
                    </div>
                )}
            </motion.div>

            {/* Action buttons */}
            <motion.div variants={fadeUp} className="space-y-3">
                {!isCheckedIn && (
                    <Button variant="primary" size="xl" className="w-full" loading={loading} onClick={handleCheckIn}
                        icon={<CheckCircle size={20} />}>
                        Check In
                    </Button>
                )}
                {isCheckedIn && !isCheckedOut && (
                    <Button variant="secondary" size="xl" className="w-full border-amber-400/30 text-amber-400 hover:bg-amber-400/10"
                        loading={loading} onClick={handleCheckOut} icon={<Clock size={20} />}>
                        Check Out
                    </Button>
                )}
                {isCheckedOut && (
                    <div className="text-center text-sm text-gray-500">Attendance complete for today ✓</div>
                )}
            </motion.div>

            {/* Recent history preview */}
            <motion.div variants={fadeUp}>
                <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">Recent History</p>
                <div className="space-y-2">
                    {MOCK_ATTENDANCE.filter((a) => a.employeeId === user?.id && a.date !== today)
                        .slice(0, 5)
                        .map((rec) => (
                            <div key={rec.id} className="card p-3.5 flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <Calendar size={15} className="text-gray-500" />
                                    <span className="text-sm text-gray-300">{rec.date}</span>
                                </div>
                                <div className="flex items-center gap-4">
                                    <span className="text-xs text-gray-500">{rec.checkIn || '—'} → {rec.checkOut || '—'}</span>
                                    <Badge status={rec.status} />
                                </div>
                            </div>
                        ))}
                </div>
            </motion.div>
        </motion.div>
    );
}

function delay(ms) { return new Promise((r) => setTimeout(r, ms)); }
function formatDate(iso) {
    return new Date(iso + 'T00:00:00').toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });
}
