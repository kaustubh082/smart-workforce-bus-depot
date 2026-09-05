import { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { ArrowDown } from 'lucide-react';

const FLOW_STEPS = [
    { label: 'Paper Register', icon: '📋', color: '#94a3b8', desc: 'Manual, error-prone, hard to audit' },
    { label: 'Digital Duty', icon: '📅', color: '#14b8a6', desc: 'Duty assignment in seconds' },
    { label: 'Attendance', icon: '✅', color: '#10b981', desc: 'One-tap check-in, check-out' },
    { label: 'Leave', icon: '🗓', color: '#f59e0b', desc: 'Apply and approve digitally' },
    { label: 'Reports', icon: '📊', color: '#6366f1', desc: 'Instant operational insights' },
];

function FlowStep({ step, index }) {
    return (
        <motion.div
            initial={{ opacity: 0, x: 40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: '-40px' }}
            transition={{ duration: 0.5, delay: index * 0.15 }}
            className="flex flex-col items-center">
            {/* Node */}
            <motion.div
                whileHover={{ scale: 1.08 }}
                className="w-16 h-16 rounded-2xl flex flex-col items-center justify-center shadow-lg border-2 border-white/80 bg-white cursor-default"
                style={{ boxShadow: `0 8px 24px ${step.color}30` }}>
                <span className="text-2xl leading-none">{step.icon}</span>
            </motion.div>
            <div className="mt-3 text-center">
                <p className="text-sm font-bold text-white">{step.label}</p>
                <p className="text-[11px] text-white/45 mt-0.5 max-w-[100px] leading-tight">{step.desc}</p>
            </div>
            {/* Connector */}
            {index < FLOW_STEPS.length - 1 && (
                <motion.div
                    initial={{ scaleY: 0 }}
                    whileInView={{ scaleY: 1 }}
                    viewport={{ once: true, margin: '-40px' }}
                    transition={{ duration: 0.4, delay: index * 0.15 + 0.35 }}
                    style={{ originY: 0 }}
                    className="flex flex-col items-center mt-2">
                    <div className="w-0.5 h-6 bg-gradient-to-b from-teal-400/60 to-teal-400/20" />
                    <ArrowDown size={12} className="text-teal-400/50" />
                </motion.div>
            )}
        </motion.div>
    );
}

export default function ProductStorySection() {
    const sectionRef = useRef(null);
    const { scrollYProgress } = useScroll({ target: sectionRef, offset: ['start end', 'end start'] });
    const imgX = useTransform(scrollYProgress, [0, 1], [0, -30]);
    const textX = useTransform(scrollYProgress, [0, 1], [0, 20]);

    return (
        <section ref={sectionRef} className="py-24 bg-[#060c1c] overflow-hidden">
            <div className="max-w-7xl mx-auto px-6">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">

                    {/* ── LEFT — big statement ── */}
                    <motion.div style={{ x: textX }}>
                        <motion.p
                            initial={{ opacity: 0 }}
                            whileInView={{ opacity: 1 }}
                            viewport={{ once: true }}
                            className="text-teal-400 text-xs uppercase tracking-[0.2em] font-bold mb-4">
                            Product Story
                        </motion.p>
                        <motion.h2
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.7 }}
                            className="font-outfit font-black text-white leading-tight mb-6"
                            style={{ fontSize: 'clamp(2rem, 4vw, 3.5rem)' }}>
                            From paper registers<br />
                            to simple<br />
                            <span className="gradient-text">digital operations.</span>
                        </motion.h2>
                        <motion.p
                            initial={{ opacity: 0, y: 16 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: 0.2, duration: 0.6 }}
                            className="text-slate-400 text-base leading-relaxed max-w-md">
                            Bus depots in India have run on handwritten registers for decades. We built DepotOps to change that — one depot at a time.
                        </motion.p>

                        <motion.div
                            initial={{ opacity: 0, y: 16 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: 0.4 }}
                            className="mt-8 p-4 rounded-2xl border border-teal-500/20 bg-teal-500/05 inline-flex gap-4">
                            {[
                                { n: '100%', label: 'Digital records' },
                                { n: '0', label: 'Paper registers' },
                                { n: '3', label: 'User roles' },
                            ].map((s) => (
                                <div key={s.label} className="text-center px-3">
                                    <p className="text-2xl font-black font-outfit text-teal-400">{s.n}</p>
                                    <p className="text-[11px] text-slate-500 mt-0.5">{s.label}</p>
                                </div>
                            ))}
                        </motion.div>
                    </motion.div>

                    {/* ── RIGHT — animated flow ── */}
                    <motion.div style={{ x: imgX }} className="flex flex-col items-center">
                        <div className="relative bg-white/04 border border-white/08 rounded-3xl p-8 w-full max-w-xs mx-auto">
                            {/* glow backdrop */}
                            <div className="absolute inset-0 rounded-3xl pointer-events-none"
                                style={{ background: 'radial-gradient(ellipse at 50% 50%,rgba(20,184,166,0.07) 0%,transparent 70%)' }} />
                            <div className="relative z-10">
                                {FLOW_STEPS.map((step, i) => (
                                    <FlowStep key={step.label} step={step} index={i} />
                                ))}
                            </div>
                        </div>
                    </motion.div>
                </div>
            </div>
        </section>
    );
}
