import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';

/* Animated route dots background — using CSS animation to avoid SVG cx:undefined issue */
function RouteBg() {
    const TRACKS = [80, 160, 240, 320];
    const STOPS = [150, 320, 500, 700, 900, 1080];
    return (
        <div className="absolute inset-0 z-0 overflow-hidden opacity-25 pointer-events-none">
            <style>{`
        @keyframes routeDot { from { transform: translateX(0px); } to { transform: translateX(1200px); } }
      `}</style>
            <svg className="w-full h-full" viewBox="0 0 1200 400" preserveAspectRatio="xMidYMid slice">
                {TRACKS.map((y) => (
                    <g key={y}>
                        <line x1="0" y1={y} x2="1200" y2={y} stroke="rgba(20,184,166,0.3)" strokeWidth="1" strokeDasharray="10 8" />
                        <circle cx="0" cy={y} r={5} fill="rgba(20,184,166,0.7)"
                            style={{ animation: `routeDot ${8 + y * 0.02}s linear infinite`, animationDelay: `${y * 0.015}s` }} />
                    </g>
                ))}
                {STOPS.map((x) =>
                    TRACKS.map((y) => (
                        <circle key={`${x}-${y}`} cx={x} cy={y} r={2.5}
                            fill="rgba(20,184,166,0.5)" stroke="rgba(255,255,255,0.2)" strokeWidth="0.5" />
                    ))
                )}
            </svg>
        </div>
    );
}

export default function CTASection() {
    return (
        <section className="relative py-32 overflow-hidden"
            style={{ background: 'linear-gradient(135deg, #060c1c 0%, #0d1a3a 50%, #0f2a28 100%)' }}>
            <RouteBg />

            {/* Glow orbs */}
            <div className="absolute top-1/4 left-1/3 w-80 h-80 rounded-full blur-3xl pointer-events-none"
                style={{ background: 'radial-gradient(ellipse, rgba(20,184,166,0.15) 0%, transparent 70%)' }} />
            <div className="absolute bottom-1/4 right-1/3 w-64 h-64 rounded-full blur-3xl pointer-events-none"
                style={{ background: 'radial-gradient(ellipse, rgba(99,102,241,0.10) 0%, transparent 70%)' }} />

            <div className="relative z-10 max-w-4xl mx-auto px-4 text-center">
                <motion.p
                    initial={{ opacity: 0 }} whileInView={{ opacity: 1 }}
                    viewport={{ once: true }} transition={{ duration: 0.5 }}
                    className="text-teal-400 text-xs uppercase tracking-[0.25em] font-bold mb-4">
                    Get started today
                </motion.p>

                <motion.h2
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.7 }}
                    className="font-outfit font-black text-white leading-tight mb-6"
                    style={{ fontSize: 'clamp(2.5rem, 6vw, 4.5rem)' }}>
                    Make every duty<br />easier to manage.
                </motion.h2>

                <motion.p
                    initial={{ opacity: 0, y: 16 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.2, duration: 0.6 }}
                    className="text-white/50 text-lg max-w-xl mx-auto mb-12 leading-relaxed">
                    Digitize your depot operations. From duty allocation to attendance — all in one place.
                </motion.p>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.35, duration: 0.6 }}
                    className="flex flex-col sm:flex-row gap-4 justify-center">
                    <Link to="/login"
                        className="group flex items-center justify-center gap-2.5 px-10 py-4 border border-white/20 hover:border-white/40 bg-white/06 hover:bg-white/12 text-white font-semibold rounded-xl text-lg transition-all backdrop-blur-sm">
                        Login
                    </Link>
                    <Link to="/signup"
                        className="group flex items-center justify-center gap-2.5 px-10 py-4 bg-teal-500 hover:bg-teal-400 text-white font-bold rounded-xl text-lg transition-all duration-200 hover:shadow-[0_0_40px_rgba(20,184,166,0.45)]">
                        Get Started
                        <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
                    </Link>
                </motion.div>

                {/* Role indicators */}
                <motion.p
                    initial={{ opacity: 0 }} whileInView={{ opacity: 1 }}
                    viewport={{ once: true }} transition={{ delay: 0.6 }}
                    className="text-white/25 text-xs mt-8">
                    Available for Managers · Drivers · Conductors
                </motion.p>
            </div>
        </section>
    );
}
