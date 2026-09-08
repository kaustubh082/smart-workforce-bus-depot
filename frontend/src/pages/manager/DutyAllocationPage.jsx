import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Bus, User, MapPin, Clock, Calendar, CheckCircle,
    AlertTriangle, XCircle, ArrowRight, ChevronRight, Loader
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { fadeUp, staggerContainer } from '../../animations/variants';
import { PageHeader } from '../../components/ui';
import { MOCK_EMPLOYEES, MOCK_BUSES, MOCK_ROUTES, MOCK_DUTIES, MOCK_LEAVES } from '../../mock/data';

// ── helpers ──────────────────────────────────────────────────
const TODAY = new Date().toISOString().split('T')[0];

const SHIFTS = [
    { id: 'morning', label: 'Morning', start: '06:00', end: '14:00' },
    { id: 'afternoon', label: 'Afternoon', start: '14:00', end: '22:00' },
    { id: 'night', label: 'Night', start: '22:00', end: '06:00' },
];

// ── Row label left / input right ─────────────────────────────
function FormRow({ label, children }) {
    return (
        <div className="space-y-1.5">
            <label className="text-[11px] font-bold text-[#425466] uppercase tracking-widest block">
                {label}
            </label>
            {children}
        </div>
    );
}

// ── Conflict / status pill ───────────────────────────────────
function ConflictBadge({ type, msg }) {
    const styles = {
        error: { bg: 'bg-red-50', border: 'border-red-200', text: 'text-red-700', icon: XCircle, ic: 'text-red-500' },
        warning: { bg: 'bg-amber-50', border: 'border-amber-200', text: 'text-amber-800', icon: AlertTriangle, ic: 'text-amber-500' },
        success: { bg: 'bg-green-50', border: 'border-green-200', text: 'text-green-700', icon: CheckCircle, ic: 'text-green-500' },
    };
    const s = styles[type] || styles.warning;
    const Icon = s.icon;
    return (
        <motion.div initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -4 }}
            className={`flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl border text-sm ${s.bg} ${s.border}`}>
            <Icon size={15} className={s.ic + ' shrink-0'} />
            <span className={`font-medium ${s.text}`}>{msg}</span>
        </motion.div>
    );
}

// ── Animated route preview stops ─────────────────────────────
const PREVIEW_STOPS = ['Depot', 'Mid-City', 'Via Hub', 'Terminus'];

function RoutePreviewLine({ routeNo, animate }) {
    return (
        <div className="mt-3">
            <p className="text-[10px] text-[#98A9BB] uppercase tracking-widest font-bold mb-3">Route Visual</p>
            <div className="relative flex items-center justify-between">
                <div className="absolute left-0 right-0 h-0.5 bg-[#E5EAF0] top-3" />
                <motion.div className="absolute left-0 h-0.5 top-3"
                    key={routeNo}
                    style={{ background: 'linear-gradient(90deg,#19A7A8,#2D8CFF)' }}
                    initial={{ width: 0 }} animate={{ width: animate ? '100%' : 0 }}
                    transition={{ duration: 1.4, ease: 'easeOut', delay: 0.2 }} />
                {/* Bus icon glides across */}
                <motion.div className="absolute top-0 z-10"
                    key={'bus-' + routeNo}
                    initial={{ left: '2%' }}
                    animate={{ left: animate ? '93%' : '2%' }}
                    transition={{ duration: 1.4, ease: 'easeOut', delay: 0.2 }}>
                    <div className="w-7 h-6 rounded-md bg-[#19A7A8] flex items-center justify-center -translate-y-1 shadow"
                        style={{ boxShadow: '0 2px 8px rgba(25,167,168,0.4)' }}>
                        <Bus size={12} className="text-white" />
                    </div>
                </motion.div>
                {PREVIEW_STOPS.map((stop, i) => (
                    <div key={stop} className="flex flex-col items-center gap-2 z-10">
                        <motion.div
                            key={'dot-' + routeNo + i}
                            initial={{ scale: 0 }} animate={{ scale: 1 }}
                            transition={{ delay: 0.15 + i * 0.12, type: 'spring', stiffness: 400, damping: 20 }}
                            className="w-6 h-6 rounded-full border-2 border-[#19A7A8] bg-white flex items-center justify-center">
                            <div className="w-2 h-2 rounded-full bg-[#19A7A8]" />
                        </motion.div>
                        <span className="text-[9px] text-[#98A9BB] font-medium text-center leading-tight max-w-[42px]">{stop}</span>
                    </div>
                ))}
            </div>
        </div>
    );
}

// ── Live Preview Card ─────────────────────────────────────────
function LivePreview({ employee, bus, route, shift, startTime, endTime }) {
    const isEmpty = !employee && !bus && !route;

    return (
        <div className="sticky top-20">
            <div className="flex items-center gap-2 mb-3">
                <div className="w-2 h-2 rounded-full bg-[#19A7A8] animate-pulse" />
                <p className="text-[11px] font-bold text-[#6B7E92] uppercase tracking-widest">Live Duty Preview</p>
            </div>

            <AnimatePresence mode="wait">
                {isEmpty ? (
                    <motion.div key="empty" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                        className="card p-8 text-center border-dashed border-2 border-[#E5EAF0]"
                        style={{ background: '#FAFBFC' }}>
                        <div className="w-14 h-14 rounded-2xl bg-[#EEF2F7] flex items-center justify-center mx-auto mb-3">
                            <Calendar size={24} className="text-[#D0DAE6]" />
                        </div>
                        <p className="text-sm text-[#98A9BB] font-medium">Fill in the form to see a live preview</p>
                    </motion.div>
                ) : (
                    <motion.div key="preview"
                        initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -6 }}
                        transition={{ duration: 0.25 }}
                        className="rounded-2xl overflow-hidden"
                        style={{ boxShadow: '0 8px 32px rgba(18,59,93,0.12)' }}>
                        {/* Top gradient bar */}
                        <div className="h-1.5" style={{ background: 'linear-gradient(90deg,#19A7A8,#2D8CFF)' }} />
                        <div className="bg-white p-5 space-y-4">
                            {/* Employee */}
                            {employee && (
                                <div className="flex items-center gap-3">
                                    <div className="w-11 h-11 rounded-full flex items-center justify-center text-white font-black text-base shrink-0"
                                        style={{ background: 'linear-gradient(135deg,#19A7A8,#2D8CFF)' }}>
                                        {employee.name.charAt(0)}
                                    </div>
                                    <div>
                                        <p className="font-outfit font-bold text-[#14212B]">{employee.name}</p>
                                        <p className="text-xs text-[#6B7E92] capitalize">{employee.role} · {employee.employeeId}</p>
                                    </div>
                                    <div className="ml-auto">
                                        <span className="badge badge-success">Available</span>
                                    </div>
                                </div>
                            )}

                            {/* Divider */}
                            {(employee && (bus || route)) && <div className="border-t border-[#F7F9FC]" />}

                            {/* Bus */}
                            {bus && (
                                <div className="flex items-center gap-3 p-3 rounded-xl bg-[#F7F9FC] border border-[#E5EAF0]">
                                    <div className="w-9 h-9 rounded-xl bg-[#E6F7F7] flex items-center justify-center">
                                        <Bus size={17} className="text-[#19A7A8]" />
                                    </div>
                                    <div>
                                        <p className="text-[10px] text-[#98A9BB] uppercase tracking-wider font-bold">Bus</p>
                                        <p className="font-bold text-[#14212B] text-sm">{bus.registrationNo}</p>
                                        <p className="text-xs text-[#98A9BB]">{bus.model} · {bus.capacity} seats</p>
                                    </div>
                                    <div className="ml-auto">
                                        <span className={`badge ${bus.status === 'operational' ? 'badge-success' : 'badge-danger'}`}>
                                            {bus.status}
                                        </span>
                                    </div>
                                </div>
                            )}

                            {/* Route */}
                            {route && (
                                <div className="flex items-start gap-3 p-3 rounded-xl bg-[#F7F9FC] border border-[#E5EAF0]">
                                    <div className="w-9 h-9 rounded-xl bg-[#E8F2FF] flex items-center justify-center shrink-0">
                                        <MapPin size={17} className="text-[#2D8CFF]" />
                                    </div>
                                    <div className="flex-1">
                                        <p className="text-[10px] text-[#98A9BB] uppercase tracking-wider font-bold mb-0.5">Route {route.routeNo}</p>
                                        <div className="flex items-center gap-1.5 text-sm">
                                            <span className="font-semibold text-[#14212B]">{route.from}</span>
                                            <ArrowRight size={12} className="text-[#D0DAE6]" />
                                            <span className="font-semibold text-[#14212B]">{route.to}</span>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* Shift / Time */}
                            {(shift || startTime) && (
                                <div className="grid grid-cols-2 gap-3">
                                    {shift && (
                                        <div className="p-3 rounded-xl bg-amber-50 border border-amber-100">
                                            <p className="text-[10px] text-amber-600 uppercase tracking-wider font-bold mb-0.5">Shift</p>
                                            <p className="font-bold text-[#14212B] text-sm capitalize">{shift}</p>
                                        </div>
                                    )}
                                    {(startTime || endTime) && (
                                        <div className="p-3 rounded-xl bg-[#F7F9FC] border border-[#E5EAF0]">
                                            <p className="text-[10px] text-[#98A9BB] uppercase tracking-wider font-bold mb-0.5">Timing</p>
                                            <div className="flex items-center gap-1">
                                                <Clock size={11} className="text-[#98A9BB]" />
                                                <p className="font-bold text-[#14212B] text-sm">{startTime} – {endTime}</p>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            )}

                            {/* Route animation */}
                            {route && <RoutePreviewLine routeNo={route.routeNo} animate={!!route} />}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}

// ── Main page ─────────────────────────────────────────────────
export default function DutyAllocationPage() {
    const navigate = useNavigate();

    const [form, setForm] = useState({
        date: TODAY, employeeId: '', busId: '', routeId: '',
        shift: '', startTime: '06:00', endTime: '14:00', role: 'all',
    });
    const [status, setStatus] = useState('idle'); // idle | loading | success
    const [conflicts, setConflicts] = useState([]);

    // ── Derived selections ──
    const employee = MOCK_EMPLOYEES.find((e) => e.id === form.employeeId);
    const bus = MOCK_BUSES.find((b) => b.id === form.busId);
    const route = MOCK_ROUTES.find((r) => r.id === form.routeId);
    const shiftObj = SHIFTS.find((s) => s.id === form.shift);

    // ── Conflict detection ──
    const detectedConflicts = useMemo(() => {
        const c = [];
        if (employee && form.date) {
            const onLeave = MOCK_LEAVES.some((l) =>
                l.employeeId === employee.id && l.status === 'approved' &&
                l.startDate <= form.date && l.endDate >= form.date
            );
            if (onLeave) c.push({ type: 'error', msg: `${employee.name} is on approved leave on this date.` });

            const hasDuty = MOCK_DUTIES.some((d) =>
                d.employeeId === employee.id && d.date === form.date
            );
            if (!onLeave && hasDuty) c.push({ type: 'warning', msg: `${employee.name} already has a duty assigned on this date.` });
        }
        if (bus) {
            if (bus.status === 'maintenance') c.push({ type: 'error', msg: `Bus ${bus.registrationNo} is currently under maintenance.` });
            else if (bus.status === 'out-of-service') c.push({ type: 'error', msg: `Bus ${bus.registrationNo} is out of service.` });
            else {
                const assigned = MOCK_DUTIES.some((d) => d.busReg === bus.registrationNo && d.date === form.date);
                if (assigned) c.push({ type: 'warning', msg: `Bus ${bus.registrationNo} is already assigned to another duty today.` });
            }
        }
        if (c.length === 0 && employee && bus && route && form.shift) {
            c.push({ type: 'success', msg: 'All checks passed — ready to assign.' });
        }
        return c;
    }, [form.employeeId, form.busId, form.date, form.shift, employee, bus, route]);

    const hasErrors = detectedConflicts.some((c) => c.type === 'error');

    // ── Filtered employees by role ──
    const filteredEmployees = MOCK_EMPLOYEES.filter(
        (e) => e.status === 'active' && (form.role === 'all' || e.role === form.role)
    );

    // ── Shift auto-fill ──
    const handleShift = (shiftId) => {
        const s = SHIFTS.find((sh) => sh.id === shiftId);
        setForm((p) => ({ ...p, shift: shiftId, startTime: s?.start || p.startTime, endTime: s?.end || p.endTime }));
    };

    // ── Assign ──
    const handleAssign = async () => {
        if (hasErrors || !employee || !bus || !route || !form.shift) return;
        setStatus('loading');
        await new Promise((r) => setTimeout(r, 1600));
        setStatus('success');
        setTimeout(() => {
            setForm({ date: TODAY, employeeId: '', busId: '', routeId: '', shift: '', startTime: '06:00', endTime: '14:00', role: 'all' });
            setStatus('idle');
        }, 2200);
    };

    const sel = 'input-base w-full bg-white';
    const canAssign = employee && bus && route && form.shift && !hasErrors;

    return (
        <motion.div variants={staggerContainer} initial="hidden" animate="visible" className="space-y-6">

            {/* Header */}
            <motion.div variants={fadeUp}>
                <PageHeader title="Duty Allocation"
                    subtitle="Assign drivers and conductors to routes and buses" />
            </motion.div>

            {/* Two-column layout */}
            <div className="grid grid-cols-1 lg:grid-cols-[1fr_380px] gap-6 items-start">

                {/* ── LEFT: Form ── */}
                <motion.div variants={fadeUp}
                    className="card p-6 space-y-5"
                    style={{ background: '#F7F9FC' }}>

                    <h3 className="font-outfit font-bold text-[#14212B] text-lg">Allocation Form</h3>

                    {/* Date */}
                    <FormRow label="Date">
                        <div className="relative">
                            <Calendar size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#98A9BB]" />
                            <input type="date" value={form.date}
                                onChange={(e) => setForm((p) => ({ ...p, date: e.target.value }))}
                                className={`${sel} pl-10`} />
                        </div>
                    </FormRow>

                    {/* Role filter */}
                    <FormRow label="Filter by Role">
                        <div className="flex gap-2">
                            {[{ id: 'all', label: 'All' }, { id: 'driver', label: 'Driver' }, { id: 'conductor', label: 'Conductor' }].map((r) => (
                                <button key={r.id} onClick={() => setForm((p) => ({ ...p, role: r.id, employeeId: '' }))}
                                    className="flex-1 py-2 rounded-xl text-sm font-semibold border transition-all"
                                    style={{
                                        background: form.role === r.id ? '#E6F7F7' : '#FFFFFF',
                                        borderColor: form.role === r.id ? '#19A7A8' : '#E5EAF0',
                                        color: form.role === r.id ? '#178F90' : '#6B7E92',
                                    }}>
                                    {r.label}
                                </button>
                            ))}
                        </div>
                    </FormRow>

                    {/* Employee */}
                    <FormRow label="Employee">
                        <div className="relative">
                            <User size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#98A9BB] pointer-events-none" />
                            <select className={`${sel} pl-10 appearance-none`}
                                value={form.employeeId}
                                onChange={(e) => setForm((p) => ({ ...p, employeeId: e.target.value }))}>
                                <option value="">Select employee…</option>
                                {filteredEmployees.map((e) => (
                                    <option key={e.id} value={e.id}>{e.name} ({e.employeeId})</option>
                                ))}
                            </select>
                        </div>
                    </FormRow>

                    {/* Bus */}
                    <FormRow label="Bus">
                        <div className="relative">
                            <Bus size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#98A9BB] pointer-events-none" />
                            <select className={`${sel} pl-10 appearance-none`}
                                value={form.busId}
                                onChange={(e) => setForm((p) => ({ ...p, busId: e.target.value }))}>
                                <option value="">Select bus…</option>
                                {MOCK_BUSES.map((b) => (
                                    <option key={b.id} value={b.id}
                                        disabled={b.status !== 'operational'}>
                                        {b.registrationNo} — {b.model}
                                        {b.status !== 'operational' ? ` (${b.status})` : ''}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </FormRow>

                    {/* Route */}
                    <FormRow label="Route">
                        <div className="relative">
                            <MapPin size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#98A9BB] pointer-events-none" />
                            <select className={`${sel} pl-10 appearance-none`}
                                value={form.routeId}
                                onChange={(e) => setForm((p) => ({ ...p, routeId: e.target.value }))}>
                                <option value="">Select route…</option>
                                {MOCK_ROUTES.map((r) => (
                                    <option key={r.id} value={r.id}>{r.routeNo}: {r.from} → {r.to}</option>
                                ))}
                            </select>
                        </div>
                    </FormRow>

                    {/* Shift pills */}
                    <FormRow label="Shift">
                        <div className="grid grid-cols-3 gap-2">
                            {SHIFTS.map((s) => (
                                <button key={s.id} onClick={() => handleShift(s.id)}
                                    className="py-3 px-2 rounded-xl border text-sm font-semibold transition-all text-center"
                                    style={{
                                        background: form.shift === s.id ? '#123B5D' : '#FFFFFF',
                                        borderColor: form.shift === s.id ? '#123B5D' : '#E5EAF0',
                                        color: form.shift === s.id ? '#FFFFFF' : '#425466',
                                        boxShadow: form.shift === s.id ? '0 4px 12px rgba(18,59,93,0.20)' : 'none',
                                    }}>
                                    <span className="block">{s.label}</span>
                                    <span className="text-[10px] font-normal" style={{ opacity: form.shift === s.id ? 0.7 : 0.55 }}>
                                        {s.start}–{s.end}
                                    </span>
                                </button>
                            ))}
                        </div>
                    </FormRow>

                    {/* Start / End time */}
                    <div className="grid grid-cols-2 gap-4">
                        <FormRow label="Start Time">
                            <div className="relative">
                                <Clock size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#98A9BB]" />
                                <input type="time" className={`${sel} pl-10`}
                                    value={form.startTime}
                                    onChange={(e) => setForm((p) => ({ ...p, startTime: e.target.value }))} />
                            </div>
                        </FormRow>
                        <FormRow label="End Time">
                            <div className="relative">
                                <Clock size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#98A9BB]" />
                                <input type="time" className={`${sel} pl-10`}
                                    value={form.endTime}
                                    onChange={(e) => setForm((p) => ({ ...p, endTime: e.target.value }))} />
                            </div>
                        </FormRow>
                    </div>

                    {/* Conflict messages */}
                    <AnimatePresence>
                        {detectedConflicts.map((c, i) => (
                            <ConflictBadge key={i} type={c.type} msg={c.msg} />
                        ))}
                    </AnimatePresence>

                    {/* Assign button */}
                    <AnimatePresence mode="wait">
                        {status === 'success' ? (
                            <motion.div key="success"
                                initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ opacity: 0 }}
                                className="w-full h-14 rounded-2xl bg-green-500 flex items-center justify-center gap-2.5 font-bold text-white text-base">
                                <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: 'spring', stiffness: 400, delay: 0.1 }}>
                                    <CheckCircle size={22} />
                                </motion.div>
                                Duty Assigned Successfully
                            </motion.div>
                        ) : (
                            <motion.button key="assign"
                                whileHover={canAssign ? { y: -2, boxShadow: '0 12px 32px rgba(18,59,93,0.25)' } : {}}
                                whileTap={canAssign ? { scale: 0.97 } : {}}
                                onClick={handleAssign}
                                disabled={!canAssign || status === 'loading'}
                                className="w-full h-14 rounded-2xl font-bold text-base transition-all flex items-center justify-center gap-2.5"
                                style={{
                                    background: canAssign ? 'linear-gradient(135deg,#123B5D,#19A7A8)' : '#EEF2F7',
                                    color: canAssign ? '#FFFFFF' : '#98A9BB',
                                    cursor: canAssign ? 'pointer' : 'not-allowed',
                                    boxShadow: canAssign ? '0 6px 20px rgba(18,59,93,0.20)' : 'none',
                                }}>
                                {status === 'loading' ? (
                                    <>
                                        <Loader size={20} className="animate-spin" />
                                        Assigning…
                                    </>
                                ) : (
                                    <>
                                        <CheckCircle size={20} />
                                        Assign Duty
                                    </>
                                )}
                            </motion.button>
                        )}
                    </AnimatePresence>
                </motion.div>

                {/* ── RIGHT: Live Preview ── */}
                <motion.div variants={fadeUp}>
                    <LivePreview
                        employee={employee}
                        bus={bus}
                        route={route}
                        shift={form.shift}
                        startTime={form.startTime}
                        endTime={form.endTime} />
                </motion.div>
            </div>
        </motion.div>
    );
}
