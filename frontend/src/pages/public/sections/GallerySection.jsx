import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const SLIDES = [
    { img: '/bus-hero.png', caption: 'Bus Fleet Ready to Deploy', num: '01' },
    { img: '/depot-aerial.png', caption: 'Aerial View of Central Bus Depot', num: '02' },
    { img: '/driver-cockpit.png', caption: 'Driver at the Wheel', num: '03' },
    { img: '/conductor.png', caption: 'Conductor on Duty', num: '04' },
    { img: '/bus-hero.png', caption: 'Fleet Coordination at Scale', num: '05' },
];

const SLIDE_DURATION = 4000;

export default function GallerySection() {
    const [cur, setCur] = useState(0);
    const [dir, setDir] = useState(1);
    const total = SLIDES.length;

    const next = useCallback(() => {
        setDir(1);
        setCur((c) => (c + 1) % total);
    }, [total]);

    const prev = useCallback(() => {
        setDir(-1);
        setCur((c) => (c - 1 + total) % total);
    }, [total]);

    useEffect(() => {
        const id = setInterval(next, SLIDE_DURATION);
        return () => clearInterval(id);
    }, [next]);

    const variants = {
        enter: (d) => ({ x: d > 0 ? '100%' : '-100%', opacity: 0, scale: 0.96 }),
        center: { x: 0, opacity: 1, scale: 1 },
        exit: (d) => ({ x: d > 0 ? '-100%' : '100%', opacity: 0, scale: 0.96 }),
    };

    const getPrev2 = (i) => (i - 2 + total) % total;
    const getPrev1 = (i) => (i - 1 + total) % total;
    const getNext1 = (i) => (i + 1) % total;

    return (
        <section className="py-24 bg-[#04080f] overflow-hidden">
            <div className="max-w-7xl mx-auto px-4">
                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }} transition={{ duration: 0.6 }}
                    className="text-center mb-12">
                    <p className="text-teal-400 text-xs uppercase tracking-[0.25em] font-bold mb-3">Visual Gallery</p>
                    <h2 className="font-outfit font-black text-white"
                        style={{ fontSize: 'clamp(1.8rem,4vw,3rem)' }}>
                        Life at the depot
                    </h2>
                </motion.div>

                {/* Carousel */}
                <div className="relative flex items-center justify-center gap-4 select-none">
                    {/* Ghost cards left — partially visible */}
                    <div className="hidden lg:block w-40 flex-shrink-0 overflow-hidden rounded-xl" style={{ height: 420, opacity: 0.35, transform: 'scale(0.88)', transformOrigin: 'right center' }}>
                        <img src={SLIDES[getPrev1(cur)].img} alt="" className="w-full h-full object-cover" />
                    </div>

                    {/* Main card */}
                    <div className="relative flex-1 max-w-3xl overflow-hidden rounded-2xl"
                        style={{ height: 'clamp(300px,48vw,520px)', boxShadow: '0 32px 80px rgba(0,0,0,0.6)' }}>
                        <AnimatePresence custom={dir} mode="popLayout">
                            <motion.div key={cur}
                                custom={dir}
                                variants={variants}
                                initial="enter" animate="center" exit="exit"
                                transition={{ duration: 0.55, ease: [0.25, 0.46, 0.45, 0.94] }}
                                className="absolute inset-0">
                                <img src={SLIDES[cur].img} alt={SLIDES[cur].caption}
                                    className="w-full h-full object-cover" />
                                <div className="absolute inset-0"
                                    style={{ background: 'linear-gradient(to top, rgba(4,8,15,0.85) 0%, transparent 55%)' }} />
                                {/* caption */}
                                <motion.div
                                    initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.25, duration: 0.5 }}
                                    className="absolute bottom-0 left-0 right-0 p-8 flex items-end justify-between">
                                    <div>
                                        <p className="text-teal-400 text-xs font-bold uppercase tracking-widest mb-1">
                                            {SLIDES[cur].num} / {String(total).padStart(2, '0')}
                                        </p>
                                        <p className="text-white text-xl font-semibold font-outfit">{SLIDES[cur].caption}</p>
                                    </div>
                                </motion.div>
                            </motion.div>
                        </AnimatePresence>

                        {/* Nav arrows */}
                        <button onClick={prev}
                            className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-black/40 border border-white/15 flex items-center justify-center text-white hover:bg-black/60 transition-all backdrop-blur-sm z-10">
                            <ChevronLeft size={20} />
                        </button>
                        <button onClick={next}
                            className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-black/40 border border-white/15 flex items-center justify-center text-white hover:bg-black/60 transition-all backdrop-blur-sm z-10">
                            <ChevronRight size={20} />
                        </button>
                    </div>

                    {/* Ghost card right */}
                    <div className="hidden lg:block w-40 flex-shrink-0 overflow-hidden rounded-xl" style={{ height: 420, opacity: 0.35, transform: 'scale(0.88)', transformOrigin: 'left center' }}>
                        <img src={SLIDES[getNext1(cur)].img} alt="" className="w-full h-full object-cover" />
                    </div>
                </div>

                {/* Dot indicators */}
                <div className="flex justify-center gap-2 mt-8">
                    {SLIDES.map((_, i) => (
                        <button key={i} onClick={() => { setDir(i > cur ? 1 : -1); setCur(i); }}
                            className="transition-all duration-300 rounded-full"
                            style={{
                                width: i === cur ? 24 : 8, height: 8,
                                background: i === cur ? '#14b8a6' : 'rgba(255,255,255,0.2)'
                            }} />
                    ))}
                </div>
            </div>
        </section>
    );
}
