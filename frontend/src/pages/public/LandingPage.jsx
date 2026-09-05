import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Bus, Menu, X } from 'lucide-react';

import HeroSection from './sections/HeroSection';
import VisualStripSection from './sections/VisualStripSection';
import ProductStorySection from './sections/ProductStorySection';
import BentoGridSection from './sections/BentoGridSection';
import GallerySection from './sections/GallerySection';
import StatsSection from './sections/StatsSection';
import HowItWorksSection from './sections/HowItWorksSection';
import VideoSection from './sections/VideoSection';
import CTASection from './sections/CTASection';
import FooterSection from './sections/FooterSection';

/* ── Sticky Navbar ─────────────────────────────────── */
function Navbar() {
    const [scrolled, setScrolled] = useState(false);
    const [mobileOpen, setMobileOpen] = useState(false);

    useEffect(() => {
        const onScroll = () => setScrolled(window.scrollY > 60);
        window.addEventListener('scroll', onScroll, { passive: true });
        return () => window.removeEventListener('scroll', onScroll);
    }, []);

    const navLinks = [
        { href: '#features', label: 'Features' },
        { href: '#gallery', label: 'Gallery' },
        { href: '#howitworks', label: 'How it Works' },
        { href: '#stats', label: 'Stats' },
    ];

    return (
        <>
            <motion.nav
                initial={{ y: -80, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.6, ease: 'easeOut' }}
                className="fixed top-0 left-0 right-0 z-50 transition-all duration-500"
                style={{
                    background: scrolled ? 'rgba(4,8,15,0.92)' : 'transparent',
                    backdropFilter: scrolled ? 'blur(20px)' : 'none',
                    borderBottom: scrolled ? '1px solid rgba(255,255,255,0.06)' : 'none',
                }}>
                <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
                    {/* Logo */}
                    <Link to="/" className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-lg bg-teal-500 flex items-center justify-center">
                            <Bus size={16} className="text-white" />
                        </div>
                        <span className="font-outfit font-black text-white text-lg tracking-tight">DepotOps</span>
                    </Link>

                    {/* Desktop nav links */}
                    <div className="hidden md:flex items-center gap-6">
                        {navLinks.map((l) => (
                            <a key={l.href} href={l.href}
                                className="text-white/50 hover:text-white text-sm font-medium transition-colors">
                                {l.label}
                            </a>
                        ))}
                    </div>

                    {/* CTA buttons */}
                    <div className="flex items-center gap-3">
                        <Link to="/login"
                            className="hidden sm:block text-white/60 hover:text-white text-sm font-medium transition-colors">
                            Login
                        </Link>
                        <Link to="/signup"
                            className="px-4 py-2 bg-teal-500 hover:bg-teal-400 text-white text-sm font-bold rounded-lg transition-all hover:shadow-[0_0_20px_rgba(20,184,166,0.4)]">
                            Get Started
                        </Link>
                        {/* Mobile hamburger */}
                        <button onClick={() => setMobileOpen(true)}
                            className="md:hidden p-2 rounded-lg text-white/60 hover:text-white hover:bg-white/08 transition-all">
                            <Menu size={20} />
                        </button>
                    </div>
                </div>
            </motion.nav>

            {/* Mobile drawer */}
            <AnimatePresence>
                {mobileOpen && (
                    <>
                        <motion.div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm"
                            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                            onClick={() => setMobileOpen(false)} />
                        <motion.div
                            className="fixed top-0 right-0 bottom-0 z-50 w-72 bg-[#06121e] border-l border-white/08 flex flex-col p-6"
                            initial={{ x: 300 }} animate={{ x: 0 }} exit={{ x: 300 }}
                            transition={{ type: 'spring', stiffness: 300, damping: 30 }}>
                            <div className="flex items-center justify-between mb-8">
                                <span className="font-outfit font-black text-white text-lg">DepotOps</span>
                                <button onClick={() => setMobileOpen(false)}
                                    className="p-2 rounded-lg text-white/50 hover:text-white hover:bg-white/08 transition-all">
                                    <X size={18} />
                                </button>
                            </div>
                            <nav className="flex flex-col gap-1">
                                {navLinks.map((l) => (
                                    <a key={l.href} href={l.href} onClick={() => setMobileOpen(false)}
                                        className="px-3 py-2.5 rounded-lg text-white/60 hover:text-white hover:bg-white/06 text-sm font-medium transition-all">
                                        {l.label}
                                    </a>
                                ))}
                            </nav>
                            <div className="mt-auto flex flex-col gap-3">
                                <Link to="/login" onClick={() => setMobileOpen(false)}
                                    className="text-center py-3 border border-white/15 rounded-xl text-white font-semibold text-sm hover:bg-white/06 transition-all">
                                    Login
                                </Link>
                                <Link to="/signup" onClick={() => setMobileOpen(false)}
                                    className="text-center py-3 bg-teal-500 hover:bg-teal-400 rounded-xl text-white font-bold text-sm transition-all">
                                    Get Started
                                </Link>
                            </div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
        </>
    );
}

/* ── Landing Page ──────────────────────────────────── */
export default function LandingPage() {
    return (
        <div className="bg-[#060c1c] overflow-x-hidden">
            <Navbar />

            {/* ① Cinematic hero */}
            <HeroSection />

            {/* ② Floating visual strip */}
            <VisualStripSection />

            {/* ③ Product story */}
            <ProductStorySection />

            {/* ④ Bento grid */}
            <div id="features">
                <BentoGridSection />
            </div>

            {/* ⑤ Gallery carousel */}
            <div id="gallery">
                <GallerySection />
            </div>

            {/* ⑥ Animated statistics */}
            <div id="stats">
                <StatsSection />
            </div>

            {/* ⑦ How it works */}
            <div id="howitworks">
                <HowItWorksSection />
            </div>

            {/* ⑧ Video feature */}
            <VideoSection />

            {/* ⑨ Final CTA */}
            <CTASection />

            {/* Footer */}
            <FooterSection />
        </div>
    );
}
