import { motion, AnimatePresence } from 'framer-motion';
import { forwardRef } from 'react';

/* ── Button ──────────────────────────────────────── */
export function Button({ children, variant = 'primary', size = 'md', loading, disabled, className = '', ...props }) {
    const base = 'inline-flex items-center justify-center gap-2 font-semibold rounded-btn transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed select-none';
    const sizes = { sm: 'px-3 py-1.5 text-xs', md: 'px-5 py-2.5 text-sm', lg: 'px-7 py-3 text-base' };
    const variants = {
        primary: 'bg-gradient-to-r from-[#19A7A8] to-[#2D8CFF] text-white hover:shadow-[0_4px_16px_rgba(25,167,168,0.35)] hover:-translate-y-0.5',
        secondary: 'bg-white border border-[#E5EAF0] text-[#14212B] hover:border-[#19A7A8] hover:text-[#19A7A8] hover:bg-[#E6F7F7]',
        danger: 'bg-red-500 text-white hover:bg-red-600',
        ghost: 'bg-transparent text-[#19A7A8] hover:bg-[#E6F7F7]',
        navy: 'bg-[#123B5D] text-white hover:bg-[#176B87]',
    };
    return (
        <motion.button whileTap={{ scale: 0.97 }} disabled={disabled || loading}
            className={`${base} ${sizes[size]} ${variants[variant]} ${className}`} {...props}>
            {loading && <span className="w-3.5 h-3.5 border-2 border-white/40 border-t-white rounded-full animate-spin" />}
            {children}
        </motion.button>
    );
}

/* ── Card ────────────────────────────────────────── */
export function Card({ children, className = '', hover = false, accent, onClick }) {
    const base = 'card';
    const hoverCls = hover ? 'card-hover cursor-pointer' : '';
    const accentCls = accent ? 'stat-card-accent' : '';
    return onClick ? (
        <motion.div whileHover={hover ? { y: -3 } : {}} whileTap={hover ? { scale: 0.98 } : {}}
            onClick={onClick} className={`${base} ${hoverCls} ${accentCls} ${className}`}>
            {children}
        </motion.div>
    ) : (
        <div className={`${base} ${hoverCls} ${accentCls} ${className}`}>{children}</div>
    );
}

/* ── Badge ───────────────────────────────────────── */
export function Badge({ status, label, className = '' }) {
    const map = {
        present: 'badge-success', active: 'badge-success', approved: 'badge-success', operational: 'badge-success',
        absent: 'badge-danger', inactive: 'badge-danger', rejected: 'badge-danger', 'out-of-service': 'badge-danger',
        pending: 'badge-warning', leave: 'badge-warning', maintenance: 'badge-warning', late: 'badge-warning',
        assigned: 'badge-info', 'on-duty': 'badge-info',
        default: 'badge-neutral',
    };
    const cls = map[(status || '').toLowerCase()] || map.default;
    const text = label || (status ? status.charAt(0).toUpperCase() + status.slice(1) : '');
    return <span className={`badge ${cls} ${className}`}>{text}</span>;
}

/* ── Input ───────────────────────────────────────── */
export const Input = forwardRef(function Input({ label, error, icon: Icon, className = '', ...props }, ref) {
    return (
        <div className="flex flex-col gap-1">
            {label && <label className="text-xs font-semibold text-[#425466] uppercase tracking-wider">{label}</label>}
            <div className="relative group">
                {Icon && <Icon size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#98A9BB] group-focus-within:text-[#19A7A8] transition-colors" />}
                <input ref={ref}
                    className={`input-base ${Icon ? 'pl-10' : ''} ${error ? 'error' : ''} ${className}`}
                    {...props} />
            </div>
            <AnimatePresence>
                {error && (
                    <motion.p initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                        className="text-xs text-red-500">{error}
                    </motion.p>
                )}
            </AnimatePresence>
        </div>
    );
});

/* ── Select ──────────────────────────────────────── */
export function Select({ label, error, children, className = '', ...props }) {
    return (
        <div className="flex flex-col gap-1">
            {label && <label className="text-xs font-semibold text-[#425466] uppercase tracking-wider">{label}</label>}
            <select className={`input-base bg-white ${error ? 'error' : ''} ${className}`} {...props}>
                {children}
            </select>
            {error && <p className="text-xs text-red-500">{error}</p>}
        </div>
    );
}

/* ── Modal ───────────────────────────────────────── */
export function Modal({ open, onClose, title, children, footer, size = 'md' }) {
    const sizes = { sm: 'max-w-md', md: 'max-w-lg', lg: 'max-w-2xl', xl: 'max-w-4xl' };
    return (
        <AnimatePresence>
            {open && (
                <motion.div className="fixed inset-0 z-50 flex items-center justify-center p-4"
                    initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                    <div className="absolute inset-0 bg-black/30 backdrop-blur-sm" onClick={onClose} />
                    <motion.div className={`relative z-10 w-full ${sizes[size]} bg-white rounded-2xl shadow-[0_20px_60px_rgba(18,59,93,0.18)] overflow-hidden`}
                        initial={{ scale: 0.94, y: 20, opacity: 0 }}
                        animate={{ scale: 1, y: 0, opacity: 1 }}
                        exit={{ scale: 0.94, y: 10, opacity: 0 }}
                        transition={{ duration: 0.25 }}>
                        {title && (
                            <div className="px-6 py-4 border-b border-[#E5EAF0] flex items-center justify-between">
                                <h3 className="font-outfit font-bold text-[#14212B] text-lg">{title}</h3>
                                <button onClick={onClose} className="p-1.5 rounded-lg text-[#98A9BB] hover:text-[#425466] hover:bg-[#F7F9FC] transition-all">✕</button>
                            </div>
                        )}
                        <div className="p-6">{children}</div>
                        {footer && <div className="px-6 py-4 border-t border-[#E5EAF0] flex justify-end gap-3">{footer}</div>}
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}

/* ── Alert ───────────────────────────────────────── */
export function Alert({ type = 'info', children }) {
    const map = {
        info: { cls: 'bg-[#E6F7F7] border-[#b2e8e8] text-[#178F90]', dot: 'bg-[#19A7A8]' },
        success: { cls: 'bg-green-50 border-green-200 text-green-800', dot: 'bg-green-500' },
        warning: { cls: 'bg-amber-50 border-amber-200 text-amber-800', dot: 'bg-amber-500' },
        danger: { cls: 'bg-red-50 border-red-200 text-red-800', dot: 'bg-red-500' },
    };
    const { cls, dot } = map[type] || map.info;
    return (
        <div className={`flex items-start gap-3 p-4 rounded-xl border ${cls}`}>
            <span className={`mt-1.5 w-2 h-2 rounded-full ${dot} shrink-0`} />
            <div className="text-sm">{children}</div>
        </div>
    );
}

/* ── Table ───────────────────────────────────────── */
export function Table({ columns, data, emptyText = 'No data found' }) {
    return (
        <div className="overflow-x-auto">
            <table className="w-full text-sm">
                <thead>
                    <tr className="border-b border-[#E5EAF0]">
                        {columns.map((col) => (
                            <th key={col.key} className="text-left py-3 px-4 text-[10px] font-bold text-[#6B7E92] uppercase tracking-wider">
                                {col.label}
                            </th>
                        ))}
                    </tr>
                </thead>
                <tbody>
                    {data.length === 0 ? (
                        <tr><td colSpan={columns.length} className="text-center py-8 text-[#98A9BB]">{emptyText}</td></tr>
                    ) : (
                        data.map((row, i) => (
                            <tr key={i} className="border-b border-[#F7F9FC] table-row-hover transition-colors">
                                {columns.map((col) => (
                                    <td key={col.key} className="py-3 px-4 text-[#14212B]">
                                        {col.render ? col.render(row[col.key], row) : row[col.key]}
                                    </td>
                                ))}
                            </tr>
                        ))
                    )}
                </tbody>
            </table>
        </div>
    );
}

/* ── StatCard ────────────────────────────────────── */
const statColors = {
    teal: { icon: 'bg-[#E6F7F7] text-[#19A7A8]', value: 'text-[#19A7A8]' },
    blue: { icon: 'bg-[#E8F2FF] text-[#2D8CFF]', value: 'text-[#2D8CFF]' },
    green: { icon: 'bg-green-50 text-green-600', value: 'text-green-600' },
    amber: { icon: 'bg-amber-50 text-amber-600', value: 'text-amber-600' },
    navy: { icon: 'bg-[#EEF2F7] text-[#123B5D]', value: 'text-[#123B5D]' },
};

export function StatCard({ label, value, icon: Icon, color = 'teal', suffix = '', change, accent = true }) {
    const c = statColors[color] || statColors.teal;
    return (
        <div className={`card p-5 ${accent ? 'stat-card-accent' : ''}`}>
            <div className="flex items-start justify-between mb-3">
                <p className="text-[10px] font-bold text-[#6B7E92] uppercase tracking-wider">{label}</p>
                {Icon && <div className={`w-9 h-9 rounded-xl flex items-center justify-center ${c.icon}`}><Icon size={17} /></div>}
            </div>
            <p className={`font-outfit font-black text-3xl ${c.value}`}>{value}{suffix}</p>
            {change && <p className="text-xs text-[#98A9BB] mt-1">{change}</p>}
        </div>
    );
}

/* ── PageHeader ──────────────────────────────────── */
export function PageHeader({ title, subtitle, action }) {
    return (
        <div className="flex items-start justify-between gap-4">
            <div>
                <h1 className="font-outfit font-black text-[#14212B] text-2xl">{title}</h1>
                {subtitle && <p className="text-sm text-[#6B7E92] mt-0.5">{subtitle}</p>}
            </div>
            {action}
        </div>
    );
}

/* ── EmptyState ──────────────────────────────────── */
export function EmptyState({ icon: Icon, title, desc }) {
    return (
        <div className="flex flex-col items-center justify-center py-16 gap-3 text-center">
            {Icon && <div className="w-14 h-14 rounded-2xl bg-[#EEF2F7] flex items-center justify-center"><Icon size={26} className="text-[#98A9BB]" /></div>}
            <p className="font-semibold text-[#425466]">{title}</p>
            {desc && <p className="text-sm text-[#98A9BB] max-w-xs">{desc}</p>}
        </div>
    );
}

/* ── Toggle ──────────────────────────────────────── */
export function Toggle({ checked, onChange, label }) {
    return (
        <label className="flex items-center gap-3 cursor-pointer select-none">
            <div onClick={() => onChange(!checked)}
                className={`relative w-10 h-5.5 rounded-full transition-colors ${checked ? 'bg-[#19A7A8]' : 'bg-[#D0DAE6]'}`}
                style={{ height: 22 }}>
                <motion.div animate={{ x: checked ? 18 : 2 }} transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                    className="absolute top-0.5 w-4 h-4 bg-white rounded-full shadow-sm" />
            </div>
            {label && <span className="text-sm text-[#425466]">{label}</span>}
        </label>
    );
}
