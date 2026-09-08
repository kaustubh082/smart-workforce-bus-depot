import { useState } from 'react';
import { motion } from 'framer-motion';
import { CheckCircle, LogIn, LogOut, Clock, CalendarCheck } from 'lucide-react';
import { fadeUp, staggerContainer } from '../../animations/variants';
import { Badge } from '../../components/ui';
import { useAuth } from '../../context/AuthContext';
import { MOCK_ATTENDANCE } from '../../mock/data';

const TODAY = new Date().toISOString().split('T')[0];

export default function AttendancePage() {
    const { user } = useAuth();
    const [checkedIn, setCheckedIn] = useState(false);
    const [checkedOut, setCheckedOut] = useState(false);
    const [checkInTime, setCheckInTime] = useState(null);
    const [checkOutTime, setCheckOutTime] = useState(null);

    const history = MOCK_ATTENDANCE.filter((a) => a.employeeId === user?.id).slice(0, 10);

    const handleCheckIn = () => {
        const t = new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' });
        setCheckedIn(true); setCheckInTime(t);
    };
    const handleCheckOut = () => {
        const t = new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' });
        setCheckedOut(true); setCheckOutTime(t);
    };

    return (
        <motion.div variants={staggerContainer} initial="hidden" animate="visible" className="space-y-6">
            <motion.div variants={fadeUp}>
                <p className="text-[11px] text-[#19A7A8] uppercase tracking-widest font-bold mb-1">Today</p>
                <h1 className="text-2xl font-black font-outfit text-[#14212B]">Attendance</h1>
                <p className="text-sm text-[#6B7E92] mt-0.5">
                    {new Date().toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'long' })}
                </p>
            </motion.div>

            {/* Check IN / OUT card */}
            <motion.div variants={fadeUp}
                className="rounded-2xl p-6 border overflow-hidden"
                style={{ background: 'linear-gradient(135deg,#E6F7F7 0%,#E8F2FF 100%)', borderColor: '#b2e8e8' }}>
                <div className="flex items-center justify-between mb-6">
                    <div>
                        <p className="text-[10px] text-[#19A7A8] uppercase tracking-widest font-bold mb-1">Status</p>
                        <p className="font-outfit font-black text-[#14212B] text-xl">
                            {checkedOut ? 'Shift Complete' : checkedIn ? 'On Duty' : 'Not Checked In'}
                        </p>
                    </div>
                    <div className={`w-12 h-12 rounded-full flex items-center justify-center ${checkedIn ? 'bg-green-100' : 'bg-[#EEF2F7]'}`}>
                        <CheckCircle size={24} className={checkedIn ? 'text-green-500' : 'text-[#98A9BB]'} />
                    </div>
                </div>

                {/* Time display */}
                <div className="grid grid-cols-2 gap-3 mb-6">
                    <div className="bg-white rounded-xl p-4 border border-[#E5EAF0]">
                        <div className="flex items-center gap-2 mb-1">
                            <LogIn size={13} className="text-green-500" />
                            <p className="text-[10px] text-[#98A9BB] uppercase tracking-wider font-bold">Check In</p>
                        </div>
                        <p className={`font-outfit font-bold text-lg ${checkInTime ? 'text-green-600' : 'text-[#D0DAE6]'}`}>
                            {checkInTime || '--:--'}
                        </p>
                    </div>
                    <div className="bg-white rounded-xl p-4 border border-[#E5EAF0]">
                        <div className="flex items-center gap-2 mb-1">
                            <LogOut size={13} className="text-red-400" />
                            <p className="text-[10px] text-[#98A9BB] uppercase tracking-wider font-bold">Check Out</p>
                        </div>
                        <p className={`font-outfit font-bold text-lg ${checkOutTime ? 'text-red-500' : 'text-[#D0DAE6]'}`}>
                            {checkOutTime || '--:--'}
                        </p>
                    </div>
                </div>

                {/* Action button */}
                {!checkedIn ? (
                    <motion.button whileHover={{ y: -2 }} whileTap={{ scale: 0.97 }}
                        onClick={handleCheckIn}
                        className="w-full h-14 rounded-xl font-bold text-white text-base flex items-center justify-center gap-2"
                        style={{ background: 'linear-gradient(135deg,#19A7A8,#2D8CFF)', boxShadow: '0 4px 16px rgba(25,167,168,0.3)' }}>
                        <LogIn size={20} /> Check In Now
                    </motion.button>
                ) : !checkedOut ? (
                    <motion.button whileHover={{ y: -2 }} whileTap={{ scale: 0.97 }}
                        onClick={handleCheckOut}
                        className="w-full h-14 rounded-xl font-bold text-white text-base flex items-center justify-center gap-2"
                        style={{ background: 'linear-gradient(135deg,#ef4444,#f97316)', boxShadow: '0 4px 16px rgba(239,68,68,0.25)' }}>
                        <LogOut size={20} /> Check Out
                    </motion.button>
                ) : (
                    <div className="w-full h-14 rounded-xl bg-green-100 border border-green-200 flex items-center justify-center gap-2 font-bold text-green-700">
                        <CheckCircle size={20} /> Shift recorded
                    </div>
                )}
            </motion.div>

            {/* Attendance history */}
            <motion.div variants={fadeUp}>
                <p className="text-[10px] font-bold text-[#6B7E92] uppercase tracking-widest mb-3">History</p>
                <div className="card divide-y divide-[#F7F9FC]">
                    {history.length === 0 && <p className="p-4 text-sm text-[#98A9BB] text-center">No records</p>}
                    {history.map((a) => (
                        <div key={a.id} className="flex items-center justify-between p-4">
                            <div>
                                <p className="text-sm font-semibold text-[#14212B]">{a.date}</p>
                                <p className="text-xs text-[#98A9BB] flex items-center gap-1 mt-0.5">
                                    <Clock size={10} />
                                    {a.checkIn ? `In: ${a.checkIn}` : 'No check-in'}
                                    {a.checkOut ? ` · Out: ${a.checkOut}` : ''}
                                </p>
                            </div>
                            <Badge status={a.status} />
                        </div>
                    ))}
                </div>
            </motion.div>
        </motion.div>
    );
}
