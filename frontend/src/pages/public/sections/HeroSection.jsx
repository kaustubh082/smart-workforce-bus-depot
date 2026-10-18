import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, useAnimation, AnimatePresence } from 'framer-motion';
import { ArrowRight, MapPin, ChevronDown, Bus } from 'lucide-react';

/* ── word-by-word reveal ──────────────────────────────────── */
const HEADLINE_1 = ['SMART', 'WORKFORCE'];
const HEADLINE_2 = ['AND', 'OPERATIONS', 'MANAGEMENT'];

function Word({ word, delay }) {
    return (
        <motion.span
            className="inline-block mr-[0.25em]"
            initial={{ opacity: 0, y: 60, rotateX: -40 }}
            animate={{ opacity: 1, y: 0, rotateX: 0 }}
            transition={{ duration: 0.7, delay, ease: [0.22, 1, 0.36, 1] }}
            style={{ transformOrigin: 'bottom center', display: 'inline-block' }}
        >
            {word}
        </motion.span>
    );
}

/* ── animated SVG bus route ───────────────────────────────── */
function AnimatedRoute() {
    return (
        <div className="absolute bottom-28 left-0 right-0 z-10 px-6 pointer-events-none">
            <svg viewBox="0 0 1200 40" preserveAspectRatio="xMidYMid meet"
                className="w-full h-10 overflow-visible">
                {/* track */}
                <line x1="0" y1="20" x2="1200" y2="20" stroke="rgba(255,255,255,0.12)" strokeWidth="1.5" />
                {/* animated dashes */}
                <motion.line x1="0" y1="20" x2="1200" y2="20"
                    stroke="rgba(20,184,166,0.5)" strokeWidth="2"
                    strokeDasharray="12 8"
                    initial={{ pathLength: 0, opacity: 0 }}
                    animate={{ pathLength: 1, opacity: 1 }}
                    transition={{ duration: 2.8, delay: 2.2, ease: 'easeInOut' }} />
                {/* stops */}
                {[120, 300, 500, 720, 960, 1100].map((x, i) => (
                    <motion.circle key={x} cx={x} cy={20} r={4.5}
                        fill="rgba(20,184,166,0.9)" stroke="white" strokeWidth="1.5"
                        initial={{ scale: 0, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ delay: 2.6 + i * 0.18, duration: 0.3 }} />
                ))}
                {/* moving bus */}
                <motion.g animate={{ x: [0, 1040, 0] }}
                    transition={{ duration: 18, ease: 'linear', repeat: Infinity, delay: 3.5 }}>
                    <rect x="-22" y="8" width="38" height="24" rx="5" fill="#14b8a6" opacity="0.95" />
                    <rect x="-20" y="10" width="13" height="9" rx="1.5" fill="rgba(255,255,255,0.8)" />
                    <rect x="-5" y="10" width="13" height="9" rx="1.5" fill="rgba(255,255,255,0.8)" />
                    <circle cx="-15" cy="32" r="4" fill="#0d9488" />
                    <circle cx="10" cy="32" r="4" fill="#0d9488" />
                </motion.g>
            </svg>
        </div>
    );
}

/* ── hero ─────────────────────────────────────────────────── */
export default function HeroSection() {
    const videoRef = useRef(null);
    const [videoFailed, setVideoFailed] = useState(false);

    return (
        <section className="relative w-full min-h-screen overflow-hidden flex items-center">

            {/* ── BG image with Ken Burns zoom ── */}
            <motion.div
                className="absolute inset-0 z-0"
                initial={{ scale: 1.08 }}
                animate={{ scale: 1 }}
                transition={{ duration: 8, ease: 'easeOut' }}>
                <img
                    src="/bus-hero.png"
                    alt="Bus depot"
                    className="w-full h-full object-cover object-center"
                />
            </motion.div>

            {/* ── dark gradient overlay ── */}
            <div className="absolute inset-0 z-[1]"
                style={{
                    background: 'linear-gradient(120deg, rgba(6,12,28,0.90) 0%, rgba(6,12,28,0.75) 45%, rgba(6,12,28,0.40) 80%, rgba(6,12,28,0.20) 100%)'
                }} />

            {/* ── teal accent light ── */}
            <div className="absolute top-1/3 left-1/4 w-[600px] h-[400px] rounded-full z-[1] pointer-events-none"
                style={{ background: 'radial-gradient(ellipse,rgba(20,184,166,0.10) 0%,transparent 70%)' }} />

            {/* ── animated route ── */}
            <AnimatedRoute />

            {/* ── content ── */}
            <div className="relative z-10 w-full max-w-7xl mx-auto px-6 sm:px-12 pt-24 pb-40">
                <div className="max-w-3xl">

                    {/* Location pill */}
                    <motion.div
                        initial={{ opacity: 0, x: -24 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.6, delay: 0.4 }}
                        className="inline-flex items-center gap-2 mb-8 px-4 py-2 rounded-full border border-white/15 bg-white/08 backdrop-blur-sm text-white/70 text-xs font-semibold tracking-widest uppercase">
                        <motion.span
                            animate={{ scale: [1, 1.3, 1] }}
                            transition={{ duration: 1.6, repeat: Infinity, ease: 'easeInOut' }}
                            className="w-2 h-2 rounded-full bg-teal-400" />
                        Central Bus Depot &nbsp;·&nbsp; Pune, MH
                    </motion.div>

                    {/* Main heading */}
                    <div
    className="font-outfit font-black leading-none tracking-tight mb-6 text-white"
    style={{ fontSize: 'clamp(3rem, 8vw, 7rem)', perspective: '800px' }}
>
                        <div className="flex flex-wrap">
                            {HEADLINE_1.map((w, i) => (
                                <Word key={w} word={w} delay={0.8 + i * 0.18} />
                            ))}
                        </div>
                        <div className="flex flex-wrap">
                            {HEADLINE_2.map((w, i) => (
                                <Word key={w}
                                    word={<span style={{
                                        background: 'linear-gradient(135deg,#5eead4,#2dd4bf,#67e8f9)',
                                        WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text'
                                    }}>{w}</span>}
                                    delay={1.18 + i * 0.18} />
                            ))}
                        </div>
                    </div>

                    {/* Subtitle */}
                    <motion.p
                        initial={{ opacity: 0, y: 28 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 2.0, ease: 'easeOut' }}
                        className="text-white/65 text-lg sm:text-xl leading-relaxed mb-10 max-w-xl font-inter">
                        Simple digital workforce management for modern bus depots.
                    </motion.p>

                    {/* CTAs */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.7, delay: 2.4, ease: 'easeOut' }}
                        className="flex flex-col sm:flex-row items-start gap-4">
                        <Link to="/signup"
                            className="group flex items-center gap-2.5 px-8 py-4 bg-teal-500 hover:bg-teal-400 text-white font-bold rounded-xl text-base transition-all duration-200 hover:shadow-[0_0_32px_rgba(20,184,166,0.45)]">
                            Get Started
                            <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                        </Link>
                        <Link to="/login"
                            className="flex items-center gap-2.5 px-8 py-4 border border-white/25 hover:border-white/50 bg-white/08 hover:bg-white/14 text-white font-semibold rounded-xl text-base transition-all backdrop-blur-sm">
                            Login
                        </Link>
                        <Link to="/guide"
                            className="flex items-center gap-2.5 px-8 py-4 border border-white/25 hover:border-white/50 bg-white/08 hover:bg-white/14 text-white font-semibold rounded-xl text-base transition-all backdrop-blur-sm">
                            How to Use
                        </Link>
                    </motion.div>

                    {/* Role tags */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 2.9, duration: 0.8 }}
                        className="flex flex-wrap gap-2 mt-8">
                        {['Depot Manager', 'Bus Driver', 'Conductor'].map((r, i) => (
                            <motion.span key={r}
                                initial={{ opacity: 0, scale: 0.85 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ delay: 3.0 + i * 0.12 }}
                                className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/08 border border-white/12 text-white/60 text-xs font-medium backdrop-blur-sm">
                                <Bus size={10} className="text-teal-400" /> {r}
                            </motion.span>
                        ))}
                    </motion.div>
                </div>
            </div>

            {/* ── scroll cue ── */}
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 3.6, duration: 0.8 }}
                className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1.5 z-10">
                <motion.div
                    animate={{ y: [0, 10, 0] }}
                    transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
                    className="flex flex-col items-center gap-1 text-white/40">
                    <span className="text-[10px] uppercase tracking-[0.2em] font-medium">Scroll</span>
                    <ChevronDown size={18} />
                </motion.div>
            </motion.div>
        </section>
    );
}
