import { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { Play, Pause, Volume2, VolumeX } from 'lucide-react';

export default function VideoSection() {
    const [playing, setPlaying] = useState(false);
    const [muted, setMuted] = useState(true);
    const videoRef = useRef(null);

    const toggle = () => {
        if (!videoRef.current) return;
        if (playing) { videoRef.current.pause(); setPlaying(false); }
        else { videoRef.current.play(); setPlaying(true); }
    };

    return (
        <section className="py-24 bg-[#04080f]">
            <div className="max-w-5xl mx-auto px-4">
                <motion.div
                    initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }} transition={{ duration: 0.6 }}
                    className="text-center mb-10">
                    <p className="text-teal-400 text-xs uppercase tracking-[0.25em] font-bold mb-3">Platform preview</p>
                    <h2 className="font-outfit font-black text-white" style={{ fontSize: 'clamp(1.8rem,4vw,3rem)' }}>
                        One platform for everyday<br />depot operations.
                    </h2>
                </motion.div>

                {/* Media frame */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.96, y: 30 }}
                    whileInView={{ opacity: 1, scale: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.7 }}
                    className="relative rounded-3xl overflow-hidden cursor-pointer group"
                    style={{
                        aspectRatio: '16/9',
                        boxShadow: '0 40px 100px rgba(0,0,0,0.7), 0 0 0 1px rgba(20,184,166,0.15)',
                    }}
                    onClick={toggle}>

                    {/* Video element — uses bus image as poster fallback */}
                    <video
                        ref={videoRef}
                        className="w-full h-full object-cover"
                        poster="/bus-hero.png"
                        muted={muted}
                        loop
                        playsInline>
                        {/* No src — gracefully falls back to poster image */}
                    </video>

                    {/* Poster overlay when not playing */}
                    {!playing && (
                        <div className="absolute inset-0">
                            <img src="/bus-hero.png" alt="DepotOps preview" className="w-full h-full object-cover" />
                            <div className="absolute inset-0"
                                style={{ background: 'linear-gradient(to top, rgba(4,8,15,0.75) 0%, rgba(4,8,15,0.25) 100%)' }} />
                        </div>
                    )}

                    {/* Center play button */}
                    {!playing && (
                        <motion.div
                            initial={{ scale: 0, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            transition={{ delay: 0.4 }}
                            className="absolute inset-0 flex items-center justify-center">
                            <motion.div
                                whileHover={{ scale: 1.08 }}
                                whileTap={{ scale: 0.95 }}
                                className="w-20 h-20 rounded-full bg-teal-500 flex items-center justify-center shadow-[0_0_40px_rgba(20,184,166,0.5)]">
                                <Play size={30} fill="white" className="text-white ml-1" />
                            </motion.div>
                        </motion.div>
                    )}

                    {/* Bottom text overlay */}
                    <div className="absolute bottom-0 left-0 right-0 p-6 flex items-end justify-between">
                        <div>
                            <p className="text-teal-400 text-xs font-bold uppercase tracking-widest mb-1">Platform Demo</p>
                            <p className="text-white font-semibold text-sm">DepotOps · Smart Workforce Management</p>
                        </div>
                        {/* Custom controls */}
                        <div className="flex gap-2">
                            <button
                                onClick={(e) => { e.stopPropagation(); toggle(); }}
                                className="w-9 h-9 rounded-full bg-white/10 border border-white/15 flex items-center justify-center text-white hover:bg-white/20 transition-all backdrop-blur-sm">
                                {playing ? <Pause size={14} /> : <Play size={14} className="ml-0.5" />}
                            </button>
                            <button
                                onClick={(e) => { e.stopPropagation(); setMuted((m) => !m); if (videoRef.current) videoRef.current.muted = !muted; }}
                                className="w-9 h-9 rounded-full bg-white/10 border border-white/15 flex items-center justify-center text-white hover:bg-white/20 transition-all backdrop-blur-sm">
                                {muted ? <VolumeX size={14} /> : <Volume2 size={14} />}
                            </button>
                        </div>
                    </div>

                    {/* Decorative corner rings */}
                    <div className="absolute top-4 left-4 w-12 h-12 rounded-full border border-teal-500/20 pointer-events-none" />
                    <div className="absolute top-4 left-4 w-6 h-6 rounded-full border border-teal-500/40 pointer-events-none" />
                    <div className="absolute bottom-4 right-4 w-12 h-12 rounded-full border border-teal-500/20 pointer-events-none" />
                </motion.div>

                {/* Feature pills below the frame */}
                <motion.div
                    initial={{ opacity: 0, y: 16 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.3, duration: 0.5 }}
                    className="flex flex-wrap justify-center gap-3 mt-8">
                    {['Role-based dashboards', 'Duty assignment', 'Attendance tracking', 'Leave management', 'Instant reports'].map((f) => (
                        <span key={f}
                            className="px-4 py-1.5 rounded-full border border-white/10 bg-white/04 text-white/55 text-xs font-medium backdrop-blur-sm">
                            {f}
                        </span>
                    ))}
                </motion.div>
            </div>
        </section>
    );
}
