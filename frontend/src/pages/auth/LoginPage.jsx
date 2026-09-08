import { useState, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence, useAnimation } from 'framer-motion';
import {
    IdCard, Lock, Eye, EyeOff, ArrowRight, Bus, CheckCircle,
    Calendar, Users, Map, FileCheck, AlertCircle, Loader2
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

// ── Role → dashboard map ───────────────────────────────────
const ROLE_DASH = {
    manager: '/manager/dashboard',
    driver: '/driver/dashboard',
    conductor: '/conductor/dashboard',
};

// ── Animated route SVG on the left panel ──────────────────
function RouteAnimation() {
    return (
        <div className="absolute bottom-0 left-0 right-0 h-20 pointer-events-none overflow-hidden">
            <svg viewBox="0 0 500 60" className="w-full h-full" preserveAspectRatio="xMidYMid meet" fill="none">
                {/* track */}
                <line x1="0" y1="30" x2="500" y2="30" stroke="rgba(255,255,255,0.12)" strokeWidth="1.5" />
                {/* animated dashes */}
                <line x1="0" y1="30" x2="500" y2="30"
                    stroke="rgba(25,167,168,0.5)" strokeWidth="2"
                    strokeDasharray="14 7"
                    className="route-dash" />
                {/* stops */}
                {[60, 150, 260, 370, 460].map((x) => (
                    <circle key={x} cx={x} cy={30} r={4} fill="rgba(25,167,168,0.8)" stroke="white" strokeWidth="1.5" />
                ))}
                {/* bus icon */}
                <motion.g animate={{ x: [0, 400, 0] }} transition={{ duration: 14, ease: 'linear', repeat: Infinity }}>
                    <rect x="0" y="19" width="36" height="22" rx="5" fill="#19A7A8" />
                    <rect x="2" y="21" width="12" height="9" rx="1.5" fill="rgba(255,255,255,0.8)" />
                    <rect x="16" y="21" width="12" height="9" rx="1.5" fill="rgba(255,255,255,0.8)" />
                    <circle cx="6" cy="42" r="3.5" fill="#178F90" />
                    <circle cx="30" cy="42" r="3.5" fill="#178F90" />
                </motion.g>
            </svg>
        </div>
    );
}

// ── Floating info cards on the left panel ─────────────────
const FLOAT_CARDS = [
    { icon: Calendar, label: "Today's Duties", value: '3 assigned', color: 'teal', delay: 0 },
    { icon: CheckCircle, label: 'Attendance', value: '98% this week', color: 'green', delay: 1.5 },
    { icon: FileCheck, label: 'Leave', value: '2 pending', color: 'amber', delay: 0.8 },
    { icon: Map, label: 'Routes', value: '14 active', color: 'blue', delay: 2.2 },
];

const CARD_COLORS = {
    teal: { bg: 'rgba(25,167,168,0.15)', border: 'rgba(25,167,168,0.3)', icon: '#19A7A8' },
    green: { bg: 'rgba(16,185,129,0.15)', border: 'rgba(16,185,129,0.3)', icon: '#10b981' },
    amber: { bg: 'rgba(245,158,11,0.15)', border: 'rgba(245,158,11,0.3)', icon: '#f59e0b' },
    blue: { bg: 'rgba(45,140,255,0.15)', border: 'rgba(45,140,255,0.3)', icon: '#2D8CFF' },
};

const POSITIONS = [
    { top: '18%', left: '5%' },
    { top: '38%', right: '5%' },
    { top: '58%', left: '8%' },
    { top: '72%', right: '8%' },
];

function FloatingCard({ card, position, index }) {
    const c = CARD_COLORS[card.color];
    const Icon = card.icon;
    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.8, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ delay: 1.2 + card.delay * 0.25, duration: 0.5, ease: 'easeOut' }}
            style={{
                position: 'absolute',
                ...position,
                background: c.bg,
                border: `1px solid ${c.border}`,
                backdropFilter: 'blur(12px)',
                animation: `floatY ${6 + index * 1.5}s ease-in-out infinite`,
                animationDelay: `${card.delay * 0.5}s`,
            }}
            className="flex items-center gap-2.5 px-3 py-2 rounded-xl min-w-[140px]">
            <div className="w-8 h-8 rounded-lg flex items-center justify-center"
                style={{ background: 'rgba(255,255,255,0.15)' }}>
                <Icon size={15} style={{ color: c.icon }} />
            </div>
            <div>
                <p className="text-[10px] text-white/55 font-medium leading-none">{card.label}</p>
                <p className="text-xs text-white font-semibold mt-0.5">{card.value}</p>
            </div>
        </motion.div>
    );
}

// ── Left visual panel ──────────────────────────────────────
function LeftPanel() {
    return (
        <div className="relative w-full h-full flex flex-col justify-end overflow-hidden">
            {/* Background photo */}
            <div className="absolute inset-0">
                <img src="/bus-hero.png" alt="Bus depot" className="w-full h-full object-cover object-center" />
                {/* Gradient overlay: dark primary + teal tint */}
                <div className="absolute inset-0"
                    style={{ background: 'linear-gradient(160deg, rgba(11,34,57,0.88) 0%, rgba(18,59,93,0.80) 40%, rgba(23,107,135,0.72) 75%, rgba(25,167,168,0.20) 100%)' }} />
            </div>

            {/* Floating info cards */}
            {FLOAT_CARDS.map((card, i) => (
                <FloatingCard key={card.label} card={card} position={POSITIONS[i]} index={i} />
            ))}

            {/* Content block at bottom */}
            <div className="relative z-10 px-10 pb-20">
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.3, duration: 0.6 }}
                    className="flex items-center gap-2 mb-5">
                    <div className="w-8 h-8 rounded-lg bg-[#19A7A8] flex items-center justify-center">
                        <Bus size={16} className="text-white" />
                    </div>
                    <span className="font-outfit font-black text-white text-lg">DepotOps</span>
                </motion.div>

                <motion.h2
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5, duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
                    className="font-outfit font-black text-white leading-tight mb-4"
                    style={{ fontSize: 'clamp(1.8rem, 3.5vw, 2.8rem)', textShadow: '0 2px 12px rgba(0,0,0,0.3)' }}>
                    SMART WORKFORCE<br />
                    <span style={{
                        background: 'linear-gradient(135deg,#5eead4,#2D8CFF)',
                        WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text'
                    }}>& OPERATIONS</span>
                </motion.h2>

                <motion.p
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.75, duration: 0.6 }}
                    className="text-white/60 text-sm leading-relaxed max-w-xs">
                    Simple digital workforce management for everyday depot operations.
                </motion.p>
            </div>

            {/* Route animation at very bottom */}
            <RouteAnimation />
        </div>
    );
}

// ── Shake animation for error ─────────────────────────────
const shakeVariants = {
    idle: { x: 0 },
    shake: {
        x: [0, -8, 8, -6, 6, -4, 4, 0],
        transition: { duration: 0.5, ease: 'easeInOut' },
    },
};

// ── Right: auth form ───────────────────────────────────────
function AuthPanel() {
    const { login } = useAuth();
    const navigate = useNavigate();

    const [form, setForm] = useState({ email: '', password: '' });
    const [showPw, setShowPw] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState(false);
    const [shakeKey, setShakeKey] = useState(0);

    const QUICK = [
        { label: 'Manager', email: 'manager@busworkforce.demo', password: 'password' },
        { label: 'Driver', email: 'driver1@busworkforce.demo', password: 'password' },
        { label: 'Conductor', email: 'conductor1@busworkforce.demo', password: 'password' },
    ];

    const doLogin = async (email, password) => {
        setError(''); setLoading(true);
        try {
            const user = await login(email, password);
            setSuccess(true);
            setTimeout(() => navigate(ROLE_DASH[user.role] || '/'), 900);
        } catch (err) {
            setError(err.message || 'Invalid credentials');
            setShakeKey((k) => k + 1);
        } finally { setLoading(false); }
    };

    const containerVariants = {
        hidden: {},
        visible: { transition: { staggerChildren: 0.08 } },
    };
    const itemVariants = {
        hidden: { opacity: 0, y: 18 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.45, ease: [0.22, 1, 0.36, 1] } },
    };

    return (
        <div className="flex flex-col h-full justify-center px-8 sm:px-12 lg:px-16 py-10">
            <motion.div
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                className="w-full max-w-md mx-auto">

                {/* Header */}
                <motion.div variants={itemVariants} className="mb-8">
                    {success ? (
                        <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }}
                            className="w-14 h-14 rounded-full bg-green-100 border border-green-200 flex items-center justify-center mb-4">
                            <CheckCircle size={26} className="text-green-600" />
                        </motion.div>
                    ) : (
                        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#19A7A8] to-[#2D8CFF] flex items-center justify-center mb-4 shadow-[0_4px_16px_rgba(25,167,168,0.3)]">
                            <Bus size={18} className="text-white" />
                        </div>
                    )}
                    <h1 className="font-outfit font-black text-[#14212B] text-3xl leading-tight">
                        {success ? 'Signed in!' : 'Welcome Back'}
                    </h1>
                    <p className="text-[#6B7E92] text-sm mt-1.5">
                        {success ? 'Redirecting to your workspace…' : 'Sign in to continue to your depot workspace.'}
                    </p>
                </motion.div>

                {/* Quick demo logins */}
                {!success && (
                    <motion.div variants={itemVariants} className="mb-6">
                        <p className="text-[10px] text-[#98A9BB] uppercase tracking-wider font-semibold mb-2">
                            ⚡ Quick demo login
                        </p>
                        <div className="flex gap-2">
                            {QUICK.map((q) => (
                                <button key={q.label} type="button"
                                    onClick={() => doLogin(q.email, q.password)}
                                    disabled={loading}
                                    className="flex-1 py-2 border border-[#E5EAF0] rounded-lg text-xs font-semibold text-[#425466] hover:border-[#19A7A8] hover:text-[#19A7A8] hover:bg-[#E6F7F7] transition-all disabled:opacity-50">
                                    {q.label}
                                </button>
                            ))}
                        </div>
                    </motion.div>
                )}

                {!success && (
                    <>
                        {/* Divider */}
                        <motion.div variants={itemVariants} className="flex items-center gap-3 mb-6">
                            <div className="flex-1 h-px bg-[#E5EAF0]" />
                            <span className="text-[11px] text-[#98A9BB] font-medium">or enter credentials</span>
                            <div className="flex-1 h-px bg-[#E5EAF0]" />
                        </motion.div>

                        {/* Error banner */}
                        <AnimatePresence>
                            {error && (
                                <motion.div
                                    initial={{ opacity: 0, y: -8, height: 0 }}
                                    animate={{ opacity: 1, y: 0, height: 'auto' }}
                                    exit={{ opacity: 0, y: -4, height: 0 }}
                                    className="overflow-hidden mb-4">
                                    <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded-xl text-red-700 text-sm">
                                        <AlertCircle size={15} className="shrink-0" />
                                        {error}
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>

                        {/* Form */}
                        <motion.form
                            key={shakeKey}
                            variants={shakeVariants}
                            animate={error ? 'shake' : 'idle'}
                            onSubmit={(e) => { e.preventDefault(); doLogin(form.email, form.password); }}
                            className="space-y-4">

                            {/* Employee ID / Email */}
                            <motion.div variants={itemVariants}>
                                <label className="block text-xs font-semibold text-[#425466] uppercase tracking-wider mb-1.5">
                                    Employee ID or Email
                                </label>
                                <div className="relative group">
                                    <IdCard size={16}
                                        className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#98A9BB] group-focus-within:text-[#19A7A8] transition-colors" />
                                    <input
                                        type="text"
                                        required
                                        autoComplete="username"
                                        placeholder="e.g. MGR-001 or you@depot.com"
                                        value={form.email}
                                        onChange={(e) => { setError(''); setForm({ ...form, email: e.target.value }); }}
                                        className={`input-base pl-10 text-base ${error ? 'error' : ''}`}
                                        style={{ fontSize: '0.9rem', height: '48px' }}
                                    />
                                </div>
                            </motion.div>

                            {/* Password */}
                            <motion.div variants={itemVariants}>
                                <div className="flex items-center justify-between mb-1.5">
                                    <label className="text-xs font-semibold text-[#425466] uppercase tracking-wider">Password</label>
                                    <button type="button" className="text-xs text-[#19A7A8] hover:text-[#178F90] font-medium transition-colors">
                                        Forgot password?
                                    </button>
                                </div>
                                <div className="relative group">
                                    <Lock size={16}
                                        className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#98A9BB] group-focus-within:text-[#19A7A8] transition-colors" />
                                    <input
                                        type={showPw ? 'text' : 'password'}
                                        required
                                        autoComplete="current-password"
                                        placeholder="••••••••"
                                        value={form.password}
                                        onChange={(e) => { setError(''); setForm({ ...form, password: e.target.value }); }}
                                        className={`input-base pl-10 pr-12 ${error ? 'error' : ''}`}
                                        style={{ fontSize: '0.9rem', height: '48px' }}
                                    />
                                    <motion.button
                                        type="button"
                                        whileTap={{ scale: 0.85 }}
                                        onClick={() => setShowPw((p) => !p)}
                                        className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#98A9BB] hover:text-[#425466] transition-colors p-1">
                                        <AnimatePresence mode="wait" initial={false}>
                                            <motion.span key={showPw ? 'hide' : 'show'}
                                                initial={{ opacity: 0, rotate: -10, scale: 0.8 }}
                                                animate={{ opacity: 1, rotate: 0, scale: 1 }}
                                                exit={{ opacity: 0, rotate: 10, scale: 0.8 }}
                                                transition={{ duration: 0.18 }}>
                                                {showPw ? <EyeOff size={16} /> : <Eye size={16} />}
                                            </motion.span>
                                        </AnimatePresence>
                                    </motion.button>
                                </div>
                            </motion.div>

                            {/* Submit button */}
                            <motion.div variants={itemVariants} className="pt-1">
                                <motion.button
                                    type="submit"
                                    disabled={loading}
                                    whileHover={{ y: -2, boxShadow: '0 8px 24px rgba(25,167,168,0.35)' }}
                                    whileTap={{ scale: 0.97 }}
                                    className="w-full h-12 flex items-center justify-center gap-2.5 rounded-xl font-semibold text-white text-sm transition-all disabled:opacity-60"
                                    style={{ background: 'linear-gradient(135deg, #19A7A8 0%, #2D8CFF 100%)', boxShadow: '0 4px 16px rgba(25,167,168,0.25)' }}>
                                    <AnimatePresence mode="wait" initial={false}>
                                        {loading ? (
                                            <motion.span key="loading" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                                                className="flex items-center gap-2">
                                                <Loader2 size={18} className="animate-spin" /> Signing in…
                                            </motion.span>
                                        ) : (
                                            <motion.span key="idle" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                                                className="flex items-center gap-2">
                                                Sign In <ArrowRight size={16} />
                                            </motion.span>
                                        )}
                                    </AnimatePresence>
                                </motion.button>
                            </motion.div>
                        </motion.form>

                        {/* Footer links */}
                        <motion.p variants={itemVariants} className="text-center text-sm text-[#6B7E92] mt-6">
                            New user?{' '}
                            <Link to="/signup" className="text-[#19A7A8] hover:text-[#178F90] font-semibold transition-colors">
                                Create Account
                            </Link>
                        </motion.p>
                    </>
                )}
            </motion.div>
        </div>
    );
}

// ── Page ──────────────────────────────────────────────────
export default function LoginPage() {
    return (
        <div className="min-h-screen flex flex-col lg:flex-row bg-[#F7F9FC]">

            {/* ── LEFT visual (desktop: 45%, mobile: top strip ~32%) ── */}
            <motion.div
                initial={{ opacity: 0, x: -40 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
                className="relative lg:w-[45%] w-full"
                style={{ height: 'clamp(260px, 32vw, 400px)', minHeight: '260px' }}
            /* On desktop override height */
            >
                <style>{`
          @media (min-width: 1024px) {
            .lg-full-h { height: 100vh !important; min-height: 100vh !important; position: sticky; top: 0; }
          }
        `}</style>
                <div className="lg-full-h w-full h-full">
                    <LeftPanel />
                </div>
            </motion.div>

            {/* ── RIGHT auth area (desktop: 55%, mobile: full below image) ── */}
            <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.65, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
                className="flex-1 flex flex-col justify-center bg-[#F7F9FC]">
                <AuthPanel />
            </motion.div>
        </div>
    );
}
