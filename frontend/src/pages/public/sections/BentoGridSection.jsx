import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Calendar, CheckCircle, Bell, Bus, Map, BarChart3, FileCheck, Clock } from 'lucide-react';

/* ── Mini UI previews ─────────────────────────────── */
function MiniRoster() {
    const rows = [
        { name: 'Rajesh K.', shifts: ['M', 'A', 'M', 'O', 'M', 'A', 'O'] },
        { name: 'Suresh P.', shifts: ['O', 'M', 'A', 'M', 'O', 'M', 'M'] },
        { name: 'Anita D.', shifts: ['A', 'O', 'M', 'A', 'M', 'O', 'A'] },
    ];
    return (
        <div className="space-y-1.5 mt-2">
            {rows.map(row => (
                <div key={row.name} className="flex items-center gap-1">
                    <div className="w-14 text-[8px] text-slate-500 truncate">{row.name}</div>
                    <div className="flex gap-0.5">
                        {row.shifts.map((s, i) => (
                            <div key={i} className={`w-4 h-4 rounded text-[6px] font-bold flex items-center justify-center
                ${s === 'M' ? 'bg-teal-100 text-teal-700' : s === 'A' ? 'bg-amber-100 text-amber-700' : 'bg-slate-100 text-slate-400'}`}>{s}</div>
                        ))}
                    </div>
                </div>
            ))}
        </div>
    );
}

function MiniAttendance() {
    const [active, setActive] = useState(null);
    return (
        <div className="flex gap-2 mt-2">
            {['Present', 'Absent', 'Leave'].map((s) => {
                const colors = { Present: 'bg-green-100 text-green-700 border-green-200', Absent: 'bg-red-100 text-red-700 border-red-200', Leave: 'bg-amber-100 text-amber-700 border-amber-200' };
                return (
                    <motion.button key={s} whileTap={{ scale: 0.94 }} onClick={() => setActive(s)}
                        className={`flex-1 py-1.5 rounded-lg border text-[9px] font-bold transition-all ${active === s ? colors[s] : 'bg-white border-slate-200 text-slate-400'
                            }`}>{s}</motion.button>
                );
            })}
        </div>
    );
}

function MiniLeaveTimeline() {
    const items = [
        { date: 'Sep 1', status: 'Approved', color: 'bg-green-500' },
        { date: 'Sep 8', status: 'Pending', color: 'bg-amber-500' },
        { date: 'Sep 15', status: 'Approved', color: 'bg-green-500' },
    ];
    return (
        <div className="mt-2 space-y-1.5">
            {items.map((item, i) => (
                <motion.div key={item.date}
                    initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.15 }}
                    className="flex items-center gap-2">
                    <div className={`w-1.5 h-1.5 rounded-full ${item.color} shrink-0`} />
                    <span className="text-[9px] text-slate-500">{item.date}</span>
                    <span className="ml-auto text-[9px] font-semibold" style={{ color: item.color.includes('green') ? '#16a34a' : '#d97706' }}>{item.status}</span>
                </motion.div>
            ))}
        </div>
    );
}

function MiniNotifications() {
    const notifs = [
        { msg: 'Duty assigned: Route 15-A', icon: '📅' },
        { msg: 'Leave approved by Manager', icon: '✅' },
        { msg: 'Schedule updated for Sep 6', icon: '🔔' },
    ];
    return (
        <div className="mt-2 space-y-1.5">
            {notifs.map((n, i) => (
                <motion.div key={i}
                    initial={{ opacity: 0, y: -6, x: 8 }} animate={{ opacity: 1, y: 0, x: 0 }}
                    transition={{ delay: i * 0.22, repeat: Infinity, repeatDelay: 3 }}
                    className="flex items-center gap-1.5 bg-white rounded-lg px-2 py-1.5 border border-slate-100 shadow-sm">
                    <span className="text-xs">{n.icon}</span>
                    <span className="text-[9px] text-slate-600 leading-tight">{n.msg}</span>
                </motion.div>
            ))}
        </div>
    );
}

function MiniBusList() {
    return (
        <div className="mt-2 space-y-1.5">
            {[['MH-12-AB-1234', 'Route 15-A', '🟢'], ['MH-12-CD-5678', 'Route 22-B', '🟡'], ['MH-12-EF-9012', 'Route 5-X', '🟢']].map(([reg, route, dot]) => (
                <div key={reg} className="flex items-center gap-1.5 bg-white rounded-lg px-2 py-1.5 border border-slate-100">
                    <span className="text-[8px]">{dot}</span>
                    <span className="text-[9px] font-mono text-teal-600">{reg}</span>
                    <span className="ml-auto text-[9px] text-slate-400">{route}</span>
                </div>
            ))}
        </div>
    );
}

function MiniBarChart() {
    const bars = [45, 43, 46, 41, 44, 38];
    const max = 50;
    return (
        <div className="flex items-end gap-1.5 mt-2 h-14">
            {bars.map((v, i) => (
                <motion.div key={i}
                    initial={{ scaleY: 0 }} animate={{ scaleY: 1 }}
                    transition={{ delay: i * 0.1, duration: 0.5, ease: 'easeOut' }}
                    style={{ height: `${(v / max) * 100}%`, originY: 1 }}
                    className="flex-1 rounded-t bg-teal-400 opacity-80" />
            ))}
        </div>
    );
}

/* ── Bento Cards config ────────────────────────────── */
const CARDS = [
    {
        id: 'duty', title: 'Duty Allocation', icon: Calendar, color: 'teal',
        desc: 'Assign drivers to routes instantly', size: 'col-span-2 row-span-2',
        preview: <MiniRoster />,
    },
    {
        id: 'att', title: 'Attendance', icon: CheckCircle, color: 'green',
        desc: 'One-tap check in · check out', size: 'col-span-1 row-span-1',
        preview: <MiniAttendance />,
    },
    {
        id: 'leave', title: 'Leave Management', icon: FileCheck, color: 'amber',
        desc: 'Apply · track · approve', size: 'col-span-1 row-span-2',
        preview: <MiniLeaveTimeline />,
    },
    {
        id: 'notif', title: 'Notifications', icon: Bell, color: 'blue',
        desc: 'Real-time alerts for every event', size: 'col-span-1 row-span-2',
        preview: <MiniNotifications />,
    },
    {
        id: 'bus', title: 'Bus Management', icon: Bus, color: 'purple',
        desc: 'Track fleet status and routes', size: 'col-span-1 row-span-1',
        preview: <MiniBusList />,
    },
    {
        id: 'reports', title: 'Reports', icon: BarChart3, color: 'indigo',
        desc: 'Attendance and duty analytics', size: 'col-span-2 row-span-1',
        preview: <MiniBarChart />,
    },
];

const COLOR_MAP = {
    teal: { bg: 'bg-teal-500/10', icon: 'text-teal-400', border: 'border-teal-500/20', glow: 'rgba(20,184,166,0.15)' },
    green: { bg: 'bg-green-500/10', icon: 'text-green-400', border: 'border-green-500/20', glow: 'rgba(16,185,129,0.15)' },
    amber: { bg: 'bg-amber-500/10', icon: 'text-amber-400', border: 'border-amber-500/20', glow: 'rgba(245,158,11,0.15)' },
    blue: { bg: 'bg-blue-500/10', icon: 'text-blue-400', border: 'border-blue-500/20', glow: 'rgba(59,130,246,0.15)' },
    purple: { bg: 'bg-purple-500/10', icon: 'text-purple-400', border: 'border-purple-500/20', glow: 'rgba(168,85,247,0.15)' },
    indigo: { bg: 'bg-indigo-500/10', icon: 'text-indigo-400', border: 'border-indigo-500/20', glow: 'rgba(99,102,241,0.15)' },
};

function BentoCard({ card, index }) {
    const c = COLOR_MAP[card.color];
    const Icon = card.icon;
    return (
        <motion.div
            initial={{ opacity: 0, y: 30, scale: 0.96 }}
            whileInView={{ opacity: 1, y: 0, scale: 1 }}
            viewport={{ once: true, margin: '-40px' }}
            transition={{ duration: 0.5, delay: index * 0.08 }}
            whileHover={{ y: -4, boxShadow: `0 16px 40px ${c.glow}, 0 0 0 1px ${c.glow}` }}
            className={`${card.size} relative rounded-2xl border ${c.border} bg-white/04 p-5 overflow-hidden flex flex-col transition-shadow duration-300 cursor-default`}>
            {/* glow bg */}
            <div className={`absolute inset-0 ${c.bg} opacity-60 pointer-events-none`} />
            {/* icon + header */}
            <div className="relative z-10">
                <div className={`w-9 h-9 rounded-xl ${c.bg} flex items-center justify-center mb-3`}>
                    <Icon size={18} className={c.icon} />
                </div>
                <p className="text-white font-semibold font-outfit text-sm leading-none">{card.title}</p>
                <p className="text-white/40 text-[11px] mt-1">{card.desc}</p>
            </div>
            {/* preview */}
            <div className="relative z-10 flex-1 mt-2 overflow-hidden">
                {card.preview}
            </div>
        </motion.div>
    );
}

export default function BentoGridSection() {
    return (
        <section className="py-24 bg-[#060c1c]">
            <div className="max-w-6xl mx-auto px-4">
                <motion.div className="text-center mb-14"
                    initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }} transition={{ duration: 0.6 }}>
                    <p className="text-teal-400 text-xs uppercase tracking-[0.25em] font-bold mb-3">All Features</p>
                    <h2 className="font-outfit font-black text-white leading-tight"
                        style={{ fontSize: 'clamp(2rem,4vw,3.5rem)' }}>
                        Every module.<br />One platform.
                    </h2>
                    <p className="text-slate-400 mt-4 max-w-md mx-auto">
                        From duty allocation to reports — everything a depot needs, digitized.
                    </p>
                </motion.div>

                <div className="grid grid-cols-2 sm:grid-cols-4 auto-rows-[140px] gap-4">
                    {CARDS.map((card, i) => <BentoCard key={card.id} card={card} index={i} />)}
                </div>
            </div>
        </section>
    );
}
