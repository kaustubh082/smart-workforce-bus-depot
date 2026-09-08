import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Calendar, ChevronLeft, ChevronRight, Grid3X3, List } from 'lucide-react';
import { fadeUp, staggerContainer } from '../../animations/variants';
import { PageHeader, Badge } from '../../components/ui';
import { MOCK_EMPLOYEES, MOCK_DUTIES, MOCK_BUSES, MOCK_ROUTES } from '../../mock/data';

// ── helpers ─────────────────────────────────────────────────
const TODAY = new Date().toISOString().split('T')[0];
const DAYS_LONG = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

function formatDate(iso) {
    return new Date(iso + 'T00:00:00').toLocaleDateString('en-IN', { day: 'numeric', month: 'short' });
}

function getWeekDates(anchor) {
    const d = new Date(anchor + 'T00:00:00');
    const day = d.getDay(); // 0=Sun
    const monday = new Date(d);
    monday.setDate(d.getDate() - ((day + 6) % 7));
    return Array.from({ length: 7 }, (_, i) => {
        const nd = new Date(monday);
        nd.setDate(monday.getDate() + i);
        return nd.toISOString().split('T')[0];
    });
}

// ── Status dot ───────────────────────────────────────────────
function StatusDot({ status }) {
    const c = {
        scheduled: '#19A7A8',
        completed: '#059669',
        cancelled: '#ef4444',
        'on-duty': '#2D8CFF',
    };
    return <span className="w-2 h-2 rounded-full inline-block" style={{ background: c[status] || '#98A9BB' }} />;
}

// ── Table row reveal animation ────────────────────────────────
const rowVariant = {
    hidden: { opacity: 0, x: -8 },
    visible: { opacity: 1, x: 0 },
};

// ── Enriched duty data ────────────────────────────────────────
function enrichDuty(duty) {
    const emp = MOCK_EMPLOYEES.find((e) => e.id === duty.employeeId);
    return { ...duty, employeeName: emp?.name || duty.driverName || duty.conductorName || '—', role: emp?.role || '—' };
}

// ── Daily Roster ──────────────────────────────────────────────
function DailyRoster({ date, onPrev, onNext }) {
    const duties = MOCK_DUTIES.filter((d) => d.date === date).map(enrichDuty);

    return (
        <div className="space-y-4">
            {/* Date nav */}
            <div className="flex items-center justify-between">
                <button onClick={onPrev}
                    className="p-2 rounded-xl border border-[#E5EAF0] hover:bg-[#F7F9FC] text-[#6B7E92] transition-colors">
                    <ChevronLeft size={18} />
                </button>
                <div className="text-center">
                    <p className="font-outfit font-bold text-[#14212B]">
                        {new Date(date + 'T00:00:00').toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}
                    </p>
                    {date === TODAY && (
                        <span className="text-xs font-semibold text-[#19A7A8]">Today</span>
                    )}
                </div>
                <button onClick={onNext}
                    className="p-2 rounded-xl border border-[#E5EAF0] hover:bg-[#F7F9FC] text-[#6B7E92] transition-colors">
                    <ChevronRight size={18} />
                </button>
            </div>

            {/* Table */}
            <div className="card overflow-hidden">
                {duties.length === 0 ? (
                    <div className="p-12 text-center">
                        <Calendar size={36} className="mx-auto mb-3 text-[#D0DAE6]" />
                        <p className="text-[#98A9BB] font-medium">No duties assigned for this date</p>
                        <p className="text-xs text-[#D0DAE6] mt-1">Use Duty Allocation to schedule</p>
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                            <thead>
                                <tr className="border-b border-[#E5EAF0] bg-[#F7F9FC]">
                                    {['Employee', 'Role', 'Bus', 'Route', 'Shift', 'Time', 'Status'].map((h) => (
                                        <th key={h} className="text-left py-3 px-4 text-[10px] font-bold text-[#6B7E92] uppercase tracking-wider whitespace-nowrap">
                                            {h}
                                        </th>
                                    ))}
                                </tr>
                            </thead>
                            <motion.tbody variants={staggerContainer} initial="hidden" animate="visible">
                                {duties.map((d, i) => (
                                    <motion.tr key={d.id} variants={rowVariant}
                                        transition={{ delay: i * 0.05 }}
                                        className="border-b border-[#F7F9FC] hover:bg-[#F7F9FC] transition-colors">
                                        <td className="py-3 px-4">
                                            <div className="flex items-center gap-2.5">
                                                <div className="w-7 h-7 rounded-full flex items-center justify-center text-white text-xs font-bold shrink-0"
                                                    style={{ background: 'linear-gradient(135deg,#19A7A8,#2D8CFF)' }}>
                                                    {d.employeeName?.charAt(0)}
                                                </div>
                                                <span className="font-medium text-[#14212B] whitespace-nowrap">{d.employeeName}</span>
                                            </div>
                                        </td>
                                        <td className="py-3 px-4 text-[#6B7E92] capitalize">{d.role}</td>
                                        <td className="py-3 px-4 font-medium text-[#14212B] whitespace-nowrap">{d.busReg}</td>
                                        <td className="py-3 px-4">
                                            <span className="font-semibold text-[#14212B]">R{d.routeNo}</span>
                                            <span className="text-xs text-[#98A9BB] ml-1 hidden sm:inline">{d.routeFrom}→{d.routeTo}</span>
                                        </td>
                                        <td className="py-3 px-4 text-[#6B7E92] capitalize">{d.shift || 'Morning'}</td>
                                        <td className="py-3 px-4 text-[#6B7E92] whitespace-nowrap text-xs">{d.startTime}–{d.endTime}</td>
                                        <td className="py-3 px-4">
                                            <div className="flex items-center gap-1.5">
                                                <StatusDot status={d.status} />
                                                <span className="text-xs font-semibold text-[#6B7E92] capitalize">{d.status}</span>
                                            </div>
                                        </td>
                                    </motion.tr>
                                ))}
                            </motion.tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    );
}

// ── Weekly Roster ─────────────────────────────────────────────
function WeeklyRoster({ anchorDate, onPrevWeek, onNextWeek }) {
    const weekDates = getWeekDates(anchorDate);
    const employees = MOCK_EMPLOYEES.filter((e) => e.status === 'active').slice(0, 8);

    const getDuty = (empId, date) =>
        MOCK_DUTIES.find((d) => d.employeeId === empId && d.date === date);

    return (
        <div className="space-y-4">
            {/* Week nav */}
            <div className="flex items-center justify-between">
                <button onClick={onPrevWeek}
                    className="p-2 rounded-xl border border-[#E5EAF0] hover:bg-[#F7F9FC] text-[#6B7E92] transition-colors">
                    <ChevronLeft size={18} />
                </button>
                <p className="font-outfit font-bold text-[#14212B] text-sm">
                    {formatDate(weekDates[0])} — {formatDate(weekDates[6])}
                </p>
                <button onClick={onNextWeek}
                    className="p-2 rounded-xl border border-[#E5EAF0] hover:bg-[#F7F9FC] text-[#6B7E92] transition-colors">
                    <ChevronRight size={18} />
                </button>
            </div>

            {/* Weekly grid table */}
            <div className="card overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-xs">
                        <thead>
                            <tr className="border-b border-[#E5EAF0] bg-[#F7F9FC]">
                                <th className="text-left py-3 px-4 text-[10px] font-bold text-[#6B7E92] uppercase tracking-wider min-w-[130px]">
                                    Employee
                                </th>
                                {weekDates.map((d, i) => (
                                    <th key={d} className={`text-center py-3 px-2 min-w-[72px] text-[10px] font-bold uppercase tracking-wider ${d === TODAY ? 'text-[#19A7A8]' : 'text-[#6B7E92]'}`}>
                                        <span className="block">{DAYS_LONG[i]}</span>
                                        <span className={`block text-[11px] font-bold ${d === TODAY ? 'text-[#19A7A8]' : 'text-[#14212B]'}`}>
                                            {formatDate(d)}
                                        </span>
                                    </th>
                                ))}
                            </tr>
                        </thead>
                        <motion.tbody variants={staggerContainer} initial="hidden" animate="visible">
                            {employees.map((emp, ei) => (
                                <motion.tr key={emp.id} variants={rowVariant}
                                    transition={{ delay: ei * 0.05 }}
                                    className="border-b border-[#F7F9FC] hover:bg-[#F7F9FC] transition-colors">
                                    <td className="py-3 px-4">
                                        <div className="flex items-center gap-2">
                                            <div className="w-7 h-7 rounded-full flex items-center justify-center text-white text-[10px] font-bold shrink-0"
                                                style={{ background: 'linear-gradient(135deg,#19A7A8,#2D8CFF)' }}>
                                                {emp.name.charAt(0)}
                                            </div>
                                            <div>
                                                <p className="font-semibold text-[#14212B] whitespace-nowrap">{emp.name.split(' ')[0]}</p>
                                                <p className="text-[#98A9BB] capitalize text-[10px]">{emp.role}</p>
                                            </div>
                                        </div>
                                    </td>
                                    {weekDates.map((date) => {
                                        const duty = getDuty(emp.id, date);
                                        const isToday = date === TODAY;
                                        return (
                                            <td key={date} className="text-center p-1.5">
                                                {duty ? (
                                                    <div className={`rounded-lg px-1.5 py-1.5 ${isToday ? 'ring-2 ring-[#19A7A8]/30' : ''}`}
                                                        style={{ background: '#E6F7F7', border: '1px solid #b2e8e8' }}
                                                        title={`Route ${duty.routeNo} · ${duty.startTime}–${duty.endTime}`}>
                                                        <p className="font-bold text-[#178F90] text-[10px]">R{duty.routeNo}</p>
                                                        <p className="text-[9px] text-[#19A7A8] font-medium">{duty.startTime}</p>
                                                    </div>
                                                ) : (
                                                    <div className="rounded-lg px-1.5 py-1.5"
                                                        style={{ background: '#F7F9FC', border: '1px solid #EEF2F7' }}>
                                                        <span className="text-[10px] font-semibold text-[#D0DAE6]">—</span>
                                                    </div>
                                                )}
                                            </td>
                                        );
                                    })}
                                </motion.tr>
                            ))}
                        </motion.tbody>
                    </table>
                </div>

                {/* Legend */}
                <div className="flex items-center gap-4 px-4 py-3 border-t border-[#E5EAF0] bg-[#F7F9FC]">
                    <div className="flex items-center gap-1.5">
                        <span className="w-3 h-3 rounded" style={{ background: '#E6F7F7', border: '1px solid #b2e8e8' }} />
                        <span className="text-[10px] text-[#6B7E92]">Duty assigned</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                        <span className="w-3 h-3 rounded" style={{ background: '#F7F9FC', border: '1px solid #EEF2F7' }} />
                        <span className="text-[10px] text-[#6B7E92]">No duty</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                        <span className="w-3 h-3 rounded ring-1 ring-[#19A7A8]/40" style={{ background: '#E6F7F7' }} />
                        <span className="text-[10px] text-[#6B7E92]">Today</span>
                    </div>
                </div>
            </div>
        </div>
    );
}

// ── Main ─────────────────────────────────────────────────────
export default function RosterPage() {
    const [view, setView] = useState('daily');   // 'daily' | 'weekly'
    const [dailyDate, setDailyDate] = useState(TODAY);
    const [weekAnchor, setWeekAnchor] = useState(TODAY);

    const stepDay = (delta) => {
        const d = new Date(dailyDate + 'T00:00:00');
        d.setDate(d.getDate() + delta);
        setDailyDate(d.toISOString().split('T')[0]);
    };
    const stepWeek = (delta) => {
        const d = new Date(weekAnchor + 'T00:00:00');
        d.setDate(d.getDate() + delta * 7);
        setWeekAnchor(d.toISOString().split('T')[0]);
    };

    return (
        <motion.div variants={staggerContainer} initial="hidden" animate="visible" className="space-y-5">
            <motion.div variants={fadeUp}>
                <PageHeader title="Roster" subtitle="View and manage duty schedules" />
            </motion.div>

            {/* View toggle */}
            <motion.div variants={fadeUp}
                className="inline-flex items-center gap-1 p-1 rounded-xl bg-[#EEF2F7] border border-[#E5EAF0]">
                {[
                    { id: 'daily', label: 'Daily', icon: List },
                    { id: 'weekly', label: 'Weekly', icon: Grid3X3 },
                ].map(({ id, label, icon: Icon }) => (
                    <button key={id} onClick={() => setView(id)}
                        className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition-all"
                        style={{
                            background: view === id ? '#FFFFFF' : 'transparent',
                            color: view === id ? '#14212B' : '#6B7E92',
                            boxShadow: view === id ? '0 2px 6px rgba(18,59,93,0.08)' : 'none',
                        }}>
                        <Icon size={15} />{label}
                    </button>
                ))}
            </motion.div>

            {/* Roster view */}
            <AnimatePresence mode="wait">
                {view === 'daily' ? (
                    <motion.div key="daily" initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
                        <DailyRoster date={dailyDate} onPrev={() => stepDay(-1)} onNext={() => stepDay(1)} />
                    </motion.div>
                ) : (
                    <motion.div key="weekly" initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
                        <WeeklyRoster anchorDate={weekAnchor} onPrevWeek={() => stepWeek(-1)} onNextWeek={() => stepWeek(1)} />
                    </motion.div>
                )}
            </AnimatePresence>
        </motion.div>
    );
}
