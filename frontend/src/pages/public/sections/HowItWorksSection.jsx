import { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';

const JOURNEY = [
    { role: 'MANAGER', icon: '👤', color: '#14b8a6', desc: 'Logs in to the depot dashboard' },
    { role: 'ALLOCATES DUTY', icon: '📅', color: '#6366f1', desc: 'Assigns driver + bus + route + shift' },
    { role: 'DRIVER / CONDUCTOR', icon: '🚌', color: '#f59e0b', desc: 'Receives duty notification instantly' },
    { role: 'VIEWS DUTY', icon: '👁', color: '#10b981', desc: 'Opens daily duty card on the mobile' },
    { role: 'MARKS ATTENDANCE', icon: '✅', color: '#14b8a6', desc: 'One-tap check-in at depot' },
    { role: 'LEAVE MANAGEMENT', icon: '📝', color: '#f59e0b', desc: 'Applies online · Manager approves' },
    { role: 'CENTRAL RECORDS', icon: '📊', color: '#6366f1', desc: 'All data captured · Reports generated' },
];

function JourneyNode({ step, index, total }) {
    const isLast = index === total - 1;
    return (
        <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-40px' }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            className="flex flex-col items-center relative">
            {/* vertical connector above (skip for first) */}
            {index > 0 && (
                <motion.div
                    initial={{ scaleY: 0 }}
                    whileInView={{ scaleY: 1 }}
                    viewport={{ once: true, margin: '-40px' }}
                    transition={{ duration: 0.5, delay: index * 0.1 - 0.05 }}
                    style={{ originY: 0 }}
                    className="w-px h-8 mb-1"
                    style2={{ background: `linear-gradient(to bottom, ${JOURNEY[index - 1].color}80, ${step.color}80)` }}>
                    <div className="w-full h-full" style={{ background: `linear-gradient(to bottom, ${JOURNEY[index - 1].color}80, ${step.color}80)` }} />
                </motion.div>
            )}

            {/* node */}
            <motion.div
                whileHover={{ scale: 1.1 }}
                className="relative w-16 h-16 rounded-2xl flex items-center justify-center border-2 bg-white/05 backdrop-blur-sm"
                style={{ borderColor: step.color + '60', boxShadow: `0 0 24px ${step.color}25` }}>
                <span className="text-2xl">{step.icon}</span>
                {/* pulse ring */}
                <motion.div
                    className="absolute inset-0 rounded-2xl border-2"
                    style={{ borderColor: step.color }}
                    animate={{ scale: [1, 1.18, 1], opacity: [0.6, 0, 0.6] }}
                    transition={{ duration: 2.8, repeat: Infinity, delay: index * 0.4 }} />
            </motion.div>

            {/* label */}
            <p className="text-xs font-black text-white uppercase tracking-wider mt-3 text-center leading-tight max-w-[90px]" style={{ color: step.color }}>
                {step.role}
            </p>
            <p className="text-[10px] text-slate-500 text-center mt-1 max-w-[90px] leading-snug">
                {step.desc}
            </p>
        </motion.div>
    );
}

export default function HowItWorksSection() {
    const ref = useRef(null);
    const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] });
    const lineWidth = useTransform(scrollYProgress, [0.1, 0.9], ['0%', '100%']);

    return (
        <section ref={ref} className="py-24 bg-[#060c1c] relative overflow-hidden">
            {/* ambient glow */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] rounded-full blur-3xl pointer-events-none"
                style={{ background: 'radial-gradient(ellipse, rgba(20,184,166,0.06) 0%, transparent 70%)' }} />

            <div className="max-w-5xl mx-auto px-4 relative z-10">
                <motion.div
                    initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }} transition={{ duration: 0.6 }}
                    className="text-center mb-16">
                    <p className="text-teal-400 text-xs uppercase tracking-[0.25em] font-bold mb-3">How it works</p>
                    <h2 className="font-outfit font-black text-white" style={{ fontSize: 'clamp(2rem,4vw,3rem)' }}>
                        The daily duty journey
                    </h2>
                    <p className="text-slate-400 mt-3 max-w-sm mx-auto text-sm">
                        From manager's dashboard to central records — the full workflow, automated.
                    </p>
                </motion.div>

                {/* Journey — vertical on mobile, horizontal on desktop */}
                <div className="hidden lg:flex items-start justify-between gap-2 relative">
                    {/* Animated progress line */}
                    <div className="absolute top-8 left-8 right-8 h-px bg-white/08 rounded-full">
                        <motion.div className="h-full bg-teal-500 rounded-full" style={{ width: lineWidth }} />
                    </div>
                    {JOURNEY.map((step, i) => (
                        <div key={step.role} className="flex flex-col items-center flex-1">
                            <motion.div
                                initial={{ opacity: 0, scale: 0.7 }}
                                whileInView={{ opacity: 1, scale: 1 }}
                                viewport={{ once: true, margin: '-40px' }}
                                transition={{ duration: 0.4, delay: i * 0.1 }}
                                whileHover={{ scale: 1.1 }}
                                className="relative w-16 h-16 rounded-2xl flex items-center justify-center border-2 bg-white/05 backdrop-blur-sm z-10"
                                style={{ borderColor: step.color + '60', boxShadow: `0 0 20px ${step.color}20` }}>
                                <span className="text-2xl">{step.icon}</span>
                                <motion.div
                                    className="absolute inset-0 rounded-2xl border-2"
                                    style={{ borderColor: step.color }}
                                    animate={{ scale: [1, 1.2, 1], opacity: [0.5, 0, 0.5] }}
                                    transition={{ duration: 2.6, repeat: Infinity, delay: i * 0.35 }} />
                            </motion.div>
                            <motion.p
                                initial={{ opacity: 0 }} whileInView={{ opacity: 1 }}
                                viewport={{ once: true }} transition={{ delay: i * 0.1 + 0.2 }}
                                className="text-[10px] font-black uppercase tracking-wider mt-3 text-center leading-tight"
                                style={{ color: step.color }}>{step.role}
                            </motion.p>
                            <motion.p
                                initial={{ opacity: 0 }} whileInView={{ opacity: 1 }}
                                viewport={{ once: true }} transition={{ delay: i * 0.1 + 0.3 }}
                                className="text-[9px] text-slate-500 text-center mt-1 max-w-[80px] leading-snug">
                                {step.desc}
                            </motion.p>
                        </div>
                    ))}
                </div>

                {/* Mobile: vertical */}
                <div className="lg:hidden flex flex-col items-center gap-0">
                    {JOURNEY.map((step, i) => (
                        <JourneyNode key={step.role} step={step} index={i} total={JOURNEY.length} />
                    ))}
                </div>
            </div>
        </section>
    );
}
