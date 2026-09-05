import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { useCountUp } from '../../../hooks';

function AnimatedStat({ target, suffix = '', label, sublabel, delay = 0 }) {
    const ref = useRef(null);
    const isInView = useInView(ref, { once: true, margin: '-60px' });
    const { count } = useCountUp(isInView ? target : 0, 2000);

    return (
        <motion.div
            ref={ref}
            initial={{ opacity: 0, y: 48 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-60px' }}
            transition={{ duration: 0.7, delay, ease: [0.22, 1, 0.36, 1] }}
            className="flex flex-col items-center text-center group cursor-default">
            {/* Large counter */}
            <div className="relative">
                <span
                    className="font-outfit font-black text-white leading-none select-none"
                    style={{ fontSize: 'clamp(4rem, 10vw, 7rem)', letterSpacing: '-0.04em' }}>
                    {typeof target === 'string' ? target : count}{suffix}
                </span>
                {/* teal underline that expands on view */}
                <motion.div
                    initial={{ scaleX: 0 }}
                    whileInView={{ scaleX: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8, delay: delay + 0.4 }}
                    className="absolute -bottom-2 left-0 right-0 h-0.5 bg-teal-500 origin-left" />
            </div>
            {/* Label */}
            <p className="text-teal-400 text-xs font-bold uppercase tracking-[0.22em] mt-4">{label}</p>
            {sublabel && <p className="text-slate-500 text-xs mt-1 max-w-[140px] leading-snug">{sublabel}</p>}
        </motion.div>
    );
}

const STATS = [
    { target: '01', suffix: '', label: 'Workforce Platform', sublabel: 'Purpose-built for bus depots', isString: true },
    { target: '24', suffix: '/7', label: 'Duty Visibility', sublabel: 'Know who is assigned, always' },
    { target: 100, suffix: '%', label: 'Digital Records', sublabel: 'No paper, no confusion' },
    { target: 3, suffix: '', label: 'Primary User Roles', sublabel: 'Manager · Driver · Conductor' },
];

export default function StatsSection() {
    return (
        <section className="py-28 bg-[#060c1c] relative overflow-hidden">
            {/* Background grid */}
            <div className="absolute inset-0 opacity-[0.025]"
                style={{
                    backgroundImage: 'linear-gradient(rgba(255,255,255,0.4) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.4) 1px, transparent 1px)',
                    backgroundSize: '60px 60px'
                }} />
            {/* Glow orbs */}
            <div className="absolute top-0 left-1/4 w-96 h-96 rounded-full blur-3xl pointer-events-none"
                style={{ background: 'radial-gradient(ellipse, rgba(20,184,166,0.08) 0%, transparent 70%)' }} />
            <div className="absolute bottom-0 right-1/4 w-96 h-96 rounded-full blur-3xl pointer-events-none"
                style={{ background: 'radial-gradient(ellipse, rgba(99,102,241,0.07) 0%, transparent 70%)' }} />

            <div className="relative z-10 max-w-6xl mx-auto px-4">
                <motion.div
                    initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }} transition={{ duration: 0.6 }}
                    className="text-center mb-20">
                    <p className="text-teal-400 text-xs uppercase tracking-[0.25em] font-bold mb-3">By the numbers</p>
                    <h2 className="font-outfit font-black text-white"
                        style={{ fontSize: 'clamp(2rem, 4vw, 3rem)' }}>
                        Built for real operations
                    </h2>
                </motion.div>

                <div className="grid grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-0 lg:divide-x lg:divide-white/08">
                    {STATS.map((s, i) => (
                        <AnimatedStat
                            key={s.label}
                            target={s.isString ? s.target : s.target}
                            suffix={s.suffix}
                            label={s.label}
                            sublabel={s.sublabel}
                            delay={i * 0.12}
                        />
                    ))}
                </div>
            </div>
        </section>
    );
}
