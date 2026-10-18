import { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
    IdCard, User, Phone, Lock, Eye, EyeOff, Mail,
    ArrowRight, Bus, CheckCircle, AlertCircle, Loader2, ShieldCheck
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

// ── Role → dashboard map ─────────────────────────────────
const ROLE_DASH = { driver: '/driver/dashboard', conductor: '/conductor/dashboard' };

// ── Rotating statements (left panel) ─────────────────────
const STATEMENTS = ['Plan Duties', 'Track Attendance', 'Manage Leave', 'Keep Records'];

function RotatingStatement() {
    const [idx, setIdx] = useState(0);
    useEffect(() => {
        const id = setInterval(() => setIdx((i) => (i + 1) % STATEMENTS.length), 2800);
        return () => clearInterval(id);
    }, []);
    return (
        <div className="relative h-12 overflow-hidden">
            <AnimatePresence mode="wait">
                <motion.p
                    key={idx}
                    initial={{ y: 32, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    exit={{ y: -32, opacity: 0 }}
                    transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
                    className="absolute inset-0 flex items-center font-outfit font-black leading-none"
                    style={{
                        fontSize: 'clamp(2rem, 4vw, 3rem)',
                        background: 'linear-gradient(135deg,#5eead4,#2D8CFF)',
                        WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text'
                    }}>
                    {STATEMENTS[idx]}
                </motion.p>
            </AnimatePresence>
        </div>
    );
}

// ── Animated route SVG ────────────────────────────────────
function RouteAnimation() {
    return (
        <div className="absolute bottom-0 left-0 right-0 h-20 pointer-events-none overflow-hidden">
            <svg viewBox="0 0 500 60" className="w-full h-full" preserveAspectRatio="xMidYMid meet" fill="none">
                <line x1="0" y1="30" x2="500" y2="30" stroke="rgba(255,255,255,0.10)" strokeWidth="1.5" />
                <line x1="0" y1="30" x2="500" y2="30"
                    stroke="rgba(25,167,168,0.5)" strokeWidth="2"
                    strokeDasharray="14 7" className="route-dash" />
                {[60, 150, 260, 370, 460].map((x) => (
                    <circle key={x} cx={x} cy={30} r={4}
                        fill="rgba(25,167,168,0.8)" stroke="white" strokeWidth="1.5" />
                ))}
                <motion.g animate={{ x: [0, 400, 0] }}
                    transition={{ duration: 16, ease: 'linear', repeat: Infinity }}>
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

// ── Left visual panel ─────────────────────────────────────
function LeftPanel() {
    return (
        <div className="relative w-full h-full flex flex-col justify-end overflow-hidden">
            <div className="absolute inset-0">
                <img src="/depot-aerial.png" alt="Bus depot" className="w-full h-full object-cover object-center" />
                <div className="absolute inset-0"
                    style={{ background: 'linear-gradient(160deg, rgba(11,34,57,0.92) 0%, rgba(18,59,93,0.82) 40%, rgba(23,107,135,0.70) 75%, rgba(25,167,168,0.18) 100%)' }} />
            </div>

            <div className="relative z-10 px-10 pb-20">
                {/* Logo */}
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                    transition={{ delay: 0.3, duration: 0.6 }}
                    className="flex items-center gap-2 mb-8">
                    <div className="w-8 h-8 rounded-lg bg-[#19A7A8] flex items-center justify-center">
                        <Bus size={15} className="text-white" />
                    </div>
                    <span className="font-outfit font-black text-white text-lg">DepotOps</span>
                </motion.div>

                {/* Static prefix */}
                <motion.p initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5, duration: 0.6 }}
                    className="text-white/50 text-sm uppercase tracking-widest font-semibold mb-2">
                    One platform to
                </motion.p>

                {/* Rotating word */}
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                    transition={{ delay: 0.6, duration: 0.5 }}>
                    <RotatingStatement />
                </motion.div>

                <motion.p initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.9, duration: 0.6 }}
                    className="text-white/55 text-sm leading-relaxed max-w-xs mt-5">
                    Join your depot team on DepotOps — simple digital operations for drivers and conductors.
                </motion.p>

                {/* Feature dots */}
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                    transition={{ delay: 1.1 }}
                    className="flex flex-col gap-2.5 mt-6">
                    {['Role-based duty cards', 'One-tap attendance', 'Digital leave requests', 'Instant notifications'].map((f, i) => (
                        <motion.div key={f} initial={{ opacity: 0, x: -16 }} animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 1.2 + i * 0.1 }}
                            className="flex items-center gap-2.5">
                            <div className="w-1.5 h-1.5 rounded-full bg-[#19A7A8]" />
                            <span className="text-white/55 text-xs">{f}</span>
                        </motion.div>
                    ))}
                </motion.div>
            </div>

            <RouteAnimation />
        </div>
    );
}

// ── Password strength ─────────────────────────────────────
function getStrength(pw) {
    if (!pw) return { level: 0, label: '', color: '' };
    let score = 0;
    if (pw.length >= 6) score++;
    if (pw.length >= 10) score++;
    if (/[A-Z]/.test(pw)) score++;
    if (/[0-9]/.test(pw)) score++;
    if (/[^A-Za-z0-9]/.test(pw)) score++;

    if (score <= 2) return { level: 1, label: 'Weak', color: '#ef4444', bg: '#fee2e2', width: '33%' };
    if (score <= 3) return { level: 2, label: 'Medium', color: '#f59e0b', bg: '#fef3c7', width: '66%' };
    return { level: 3, label: 'Strong', color: '#10b981', bg: '#d1fae5', width: '100%' };
}

function PasswordStrength({ password }) {
    const s = getStrength(password);
    if (!password) return null;
    return (
        <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} className="mt-1.5 overflow-hidden">
            {/* Bar */}
            <div className="h-1.5 bg-[#E5EAF0] rounded-full overflow-hidden">
                <motion.div className="h-full rounded-full"
                    initial={{ width: 0 }}
                    animate={{ width: s.width, backgroundColor: s.color }}
                    transition={{ duration: 0.4, ease: 'easeOut' }} />
            </div>
            {/* Label */}
            <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                className="text-[11px] font-semibold mt-1"
                style={{ color: s.color }}>
                {s.label} password
            </motion.p>
        </motion.div>
    );
}

// ── Validation message ────────────────────────────────────
function ValidationMsg({ condition, message, dirty }) {
    if (!dirty) return null;
    return (
        <AnimatePresence>
            {!condition && (
                <motion.p initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -4 }} transition={{ duration: 0.2 }}
                    className="text-xs text-red-500 flex items-center gap-1 mt-1">
                    <AlertCircle size={11} /> {message}
                </motion.p>
            )}
        </AnimatePresence>
    );
}

// ── Form field wrapper ────────────────────────────────────
function Field({ label, children, hint }) {
    return (
        <div className="flex flex-col gap-1">
            <label className="text-xs font-semibold text-[#425466] uppercase tracking-wider">{label}</label>
            {children}
            {hint && <p className="text-[11px] text-[#98A9BB]">{hint}</p>}
        </div>
    );
}

// ── Right auth panel ──────────────────────────────────────
function SignupPanel() {
    const { signup } = useAuth();
    const navigate = useNavigate();

    const [form, setForm] = useState({
        employeeId: '', name: '', email: '', mobile: '', role: 'driver', password: '', confirm: ''
    });
    const [dirty, setDirty] = useState({});
    const [showPw, setShowPw] = useState(false);
    const [showCf, setShowCf] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [shakeKey, setShakeKey] = useState(0);

    const set = (k) => (e) => {
        setError('');
        setForm((f) => ({ ...f, [k]: e.target.value }));
        setDirty((d) => ({ ...d, [k]: true }));
    };
    const blur = (k) => () => setDirty((d) => ({ ...d, [k]: true }));

    const validEmp = form.employeeId.trim().length >= 3;
    const validName = form.name.trim().length >= 2;
    const validEmail = /^\S+@\S+\.\S+$/.test(form.email);
    const validMob = /^[6-9]\d{9}$/.test(form.mobile);
    const validPw = form.password.length >= 8;
    const validCf = form.confirm === form.password && form.confirm.length > 0;
    const canSubmit = validEmp && validName && validEmail && validMob && validPw && validCf && !loading;

    const handleSubmit = async (e) => {
        e.preventDefault();
        // Mark all dirty
        setDirty({ employeeId: true, name: true, email: true, mobile: true, password: true, confirm: true });
        if (!canSubmit) return;
        setError(''); setLoading(true);
        try {
            const user = await signup({
                email: form.email.trim().toLowerCase(),
                name: form.name, role: form.role, password: form.password,
                employeeId: form.employeeId.toUpperCase(),
                mobile: form.mobile, confirmPassword: form.confirm,
            });
            navigate(ROLE_DASH[user.role] || '/');
        } catch (err) {
            setError(err.message || 'Sign up failed. Please try again.');
            setShakeKey((k) => k + 1);
        } finally { setLoading(false); }
    };

    const stagger = { hidden: {}, visible: { transition: { staggerChildren: 0.07 } } };
    const item = { hidden: { opacity: 0, y: 16 }, visible: { opacity: 1, y: 0, transition: { duration: 0.45, ease: [0.22, 1, 0.36, 1] } } };
    const shakeV = { idle: { x: 0 }, shake: { x: [0, -8, 8, -6, 6, -3, 3, 0], transition: { duration: 0.5 } } };

    const inputCls = (k, valid) =>
        `input-base pl-10 ${dirty[k] && !valid ? 'error' : ''}`;

    return (
        <div className="flex flex-col h-full justify-start lg:justify-center overflow-y-auto px-6 sm:px-10 lg:px-14 py-8 lg:py-6">
            <motion.div variants={stagger} initial="hidden" animate="visible"
                className="w-full max-w-lg mx-auto">

                {/* Header */}
                <motion.div variants={item} className="mb-6">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#19A7A8] to-[#2D8CFF] flex items-center justify-center mb-4 shadow-[0_4px_16px_rgba(25,167,168,0.28)]">
                        <ShieldCheck size={18} className="text-white" />
                    </div>

                    <h1 className="font-outfit font-black text-[#14212B] text-3xl">Create Your Account</h1>
                    <p className="text-[#6B7E92] text-sm mt-1.5">Get started with simple digital depot operations.</p>
                </motion.div>

                {/* Notice: no manager signup */}
                <motion.div variants={item}
                    className="flex items-start gap-2 p-3 mb-5 rounded-xl bg-[#E6F7F7] border border-[#b2e8e8]">
                    <AlertCircle size={14} className="text-[#19A7A8] mt-0.5 shrink-0" />
                    <p className="text-xs text-[#178F90] leading-snug">
                        Driver and Conductor accounts can register here. Manager accounts are created by the depot administrator.
                    </p>
                </motion.div>

                {/* Error banner */}
                <AnimatePresence>
                    {error && (
                        <motion.div initial={{ opacity: 0, y: -8, height: 0 }} animate={{ opacity: 1, y: 0, height: 'auto' }}
                            exit={{ opacity: 0, height: 0 }} className="overflow-hidden mb-4">
                            <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded-xl text-red-700 text-sm">
                                <AlertCircle size={15} className="shrink-0" /> {error}
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* Form */}
                <motion.form key={shakeKey} variants={shakeV} animate={error ? 'shake' : 'idle'}
                    onSubmit={handleSubmit} className="space-y-4">

                    {/* Row 1 — Employee ID + Full Name */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <motion.div variants={item}>
                            <Field label="Employee ID">
                                <div className="relative group">
                                    <IdCard size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#98A9BB] group-focus-within:text-[#19A7A8] transition-colors" />
                                    <input type="text" placeholder="e.g. DRV-042" value={form.employeeId}
                                        onChange={set('employeeId')} onBlur={blur('employeeId')}
                                        className={inputCls('employeeId', validEmp)} style={{ height: 46 }} />
                                </div>
                                <ValidationMsg condition={validEmp} message="Min 3 characters" dirty={dirty.employeeId} />
                            </Field>
                        </motion.div>

                        <motion.div variants={item}>
                            <Field label="Full Name">
                                <div className="relative group">
                                    <User size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#98A9BB] group-focus-within:text-[#19A7A8] transition-colors" />
                                    <input type="text" placeholder="Suresh Patil" value={form.name}
                                        onChange={set('name')} onBlur={blur('name')}
                                        className={inputCls('name', validName)} style={{ height: 46 }} />
                                </div>
                                <ValidationMsg condition={validName} message="Enter your full name" dirty={dirty.name} />
                            </Field>
                        </motion.div>
                    </div>

                    {/* Email */}
                    <motion.div variants={item}>
                        <Field label="Email Address">
                            <div className="relative group">
                                <Mail size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#98A9BB] group-focus-within:text-[#19A7A8] transition-colors" />
                                <input type="email" placeholder="you@example.com" value={form.email}
                                    onChange={set('email')} onBlur={blur('email')}
                                    className={inputCls('email', validEmail)} style={{ height: 46 }} />
                            </div>
                            <ValidationMsg condition={validEmail} message="Enter a valid email address" dirty={dirty.email} />
                        </Field>
                    </motion.div>

                    {/* Row 2 — Mobile + Role */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <motion.div variants={item}>
                            <Field label="Mobile Number">
                                <div className="relative group">
                                    <Phone size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#98A9BB] group-focus-within:text-[#19A7A8] transition-colors" />
                                    <input type="tel" inputMode="numeric" placeholder="98XXXXXXXX" maxLength={10} value={form.mobile}
                                        onChange={(e) => { const mobile = e.target.value.replace(/\D/g, '').slice(0, 10); setError(''); setForm((f) => ({ ...f, mobile })); setDirty((d) => ({ ...d, mobile: true })); }} onBlur={blur('mobile')}
                                        className={inputCls('mobile', validMob)} style={{ height: 46 }} />
                                </div>
                                <ValidationMsg condition={validMob} message="Enter a valid 10-digit mobile number" dirty={dirty.mobile} />
                            </Field>
                        </motion.div>

                        <motion.div variants={item}>
                            <Field label="Role" hint="Manager accounts are assigned by admin.">
                                <div className="flex gap-2 mt-0.5">
                                    {['driver', 'conductor'].map((r) => (
                                        <button key={r} type="button"
                                            onClick={() => setForm((f) => ({ ...f, role: r }))}
                                            className="flex-1 py-2.5 rounded-xl border-2 text-sm font-semibold capitalize transition-all duration-200"
                                            style={{
                                                borderColor: form.role === r ? '#19A7A8' : '#E5EAF0',
                                                background: form.role === r ? '#E6F7F7' : '#FFFFFF',
                                                color: form.role === r ? '#178F90' : '#6B7E92',
                                                boxShadow: form.role === r ? '0 0 0 3px rgba(25,167,168,0.12)' : 'none',
                                            }}>
                                            {r === 'driver' ? '🚌' : '🎫'} {r.charAt(0).toUpperCase() + r.slice(1)}
                                        </button>
                                    ))}
                                </div>
                            </Field>
                        </motion.div>
                    </div>

                    {/* Password */}
                    <motion.div variants={item}>
                        <Field label="Password">
                            <div className="relative group">
                                <Lock size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#98A9BB] group-focus-within:text-[#19A7A8] transition-colors" />
                                <input type={showPw ? 'text' : 'password'} placeholder="Min 8 characters"
                                    value={form.password} onChange={set('password')} onBlur={blur('password')}
                                    className={`${inputCls('password', validPw)} pr-12`} style={{ height: 46 }} />
                                <motion.button type="button" whileTap={{ scale: 0.85 }}
                                    onClick={() => setShowPw((p) => !p)}
                                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#98A9BB] hover:text-[#425466] transition-colors p-1">
                                    <AnimatePresence mode="wait" initial={false}>
                                        <motion.span key={showPw ? 'h' : 's'}
                                            initial={{ opacity: 0, rotate: -10, scale: 0.8 }}
                                            animate={{ opacity: 1, rotate: 0, scale: 1 }}
                                            exit={{ opacity: 0, rotate: 10, scale: 0.8 }}
                                            transition={{ duration: 0.18 }}>
                                            {showPw ? <EyeOff size={16} /> : <Eye size={16} />}
                                        </motion.span>
                                    </AnimatePresence>
                                </motion.button>
                            </div>
                            <PasswordStrength password={form.password} />
                            <ValidationMsg condition={validPw} message="Password must be at least 8 characters" dirty={dirty.password} />
                        </Field>
                    </motion.div>

                    {/* Confirm password */}
                    <motion.div variants={item}>
                        <Field label="Confirm Password">
                            <div className="relative group">
                                <Lock size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#98A9BB] group-focus-within:text-[#19A7A8] transition-colors" />
                                <input type={showCf ? 'text' : 'password'} placeholder="Repeat your password"
                                    value={form.confirm} onChange={set('confirm')} onBlur={blur('confirm')}
                                    className={`${inputCls('confirm', validCf)} pr-12`} style={{ height: 46 }} />
                                <motion.button type="button" whileTap={{ scale: 0.85 }}
                                    onClick={() => setShowCf((p) => !p)}
                                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#98A9BB] hover:text-[#425466] transition-colors p-1">
                                    <AnimatePresence mode="wait" initial={false}>
                                        <motion.span key={showCf ? 'h' : 's'}
                                            initial={{ opacity: 0, rotate: -10, scale: 0.8 }}
                                            animate={{ opacity: 1, rotate: 0, scale: 1 }}
                                            exit={{ opacity: 0, rotate: 10, scale: 0.8 }}
                                            transition={{ duration: 0.18 }}>
                                            {showCf ? <EyeOff size={16} /> : <Eye size={16} />}
                                        </motion.span>
                                    </AnimatePresence>
                                </motion.button>
                                {/* Match tick */}
                                <AnimatePresence>
                                    {validCf && (
                                        <motion.span initial={{ scale: 0, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0, opacity: 0 }}
                                            className="absolute right-10 top-1/2 -translate-y-1/2">
                                            <CheckCircle size={15} className="text-green-500" />
                                        </motion.span>
                                    )}
                                </AnimatePresence>
                            </div>
                            <ValidationMsg condition={validCf} message="Passwords do not match" dirty={dirty.confirm} />
                        </Field>
                    </motion.div>

                    {/* Submit */}
                    <motion.div variants={item} className="pt-1">
                        <motion.button type="submit" disabled={!canSubmit}
                            whileHover={canSubmit ? { y: -2, boxShadow: '0 8px 24px rgba(25,167,168,0.38)' } : {}}
                            whileTap={canSubmit ? { scale: 0.97 } : {}}
                            className="w-full h-12 flex items-center justify-center gap-2.5 rounded-xl font-semibold text-white text-sm transition-all"
                            style={{
                                background: canSubmit
                                    ? 'linear-gradient(135deg, #19A7A8 0%, #2D8CFF 100%)'
                                    : '#D0DAE6',
                                color: canSubmit ? 'white' : '#98A9BB',
                                boxShadow: canSubmit ? '0 4px 16px rgba(25,167,168,0.25)' : 'none',
                                cursor: canSubmit ? 'pointer' : 'not-allowed',
                            }}>
                            <AnimatePresence mode="wait" initial={false}>
                                {loading ? (
                                    <motion.span key="l" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                                        className="flex items-center gap-2">
                                        <Loader2 size={17} className="animate-spin" /> Creating Account…
                                    </motion.span>
                                ) : (
                                    <motion.span key="i" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                                        className="flex items-center gap-2">
                                        Create Account <ArrowRight size={16} />
                                    </motion.span>
                                )}
                            </AnimatePresence>
                        </motion.button>
                    </motion.div>
                </motion.form>

                {/* Footer link */}
                <motion.p variants={item} className="text-center text-sm text-[#6B7E92] mt-5">
                    Already have an account?{' '}
                    <Link to="/login" className="text-[#19A7A8] hover:text-[#178F90] font-semibold transition-colors">
                        Login
                    </Link>
                </motion.p>
            </motion.div>
        </div>
    );
}

// ── Page shell ────────────────────────────────────────────
export default function SignupPage() {
    return (
        <div className="min-h-screen flex flex-col lg:flex-row bg-[#F7F9FC]">
            {/* LEFT visual — desktop: 40%, mobile: top strip */}
            <motion.div
                initial={{ opacity: 0, x: -40 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
                className="relative lg:w-[42%] w-full flex-shrink-0"
                style={{ height: 'clamp(240px,30vw,360px)' }}>
                <style>{`
          @media(min-width:1024px){
            .lg-sticky-left{ height:100vh!important; min-height:100vh!important; position:sticky; top:0; }
          }
        `}</style>
                <div className="lg-sticky-left w-full h-full">
                    <LeftPanel />
                </div>
            </motion.div>

            {/* RIGHT form area — desktop: 58%, mobile: full */}
            <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.65, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
                className="flex-1 flex flex-col bg-[#F7F9FC] min-h-0 overflow-y-auto">
                <SignupPanel />
            </motion.div>
        </div>
    );
}
