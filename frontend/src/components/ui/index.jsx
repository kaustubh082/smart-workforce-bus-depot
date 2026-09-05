import { motion, AnimatePresence } from 'framer-motion';
import { X, AlertCircle, CheckCircle, Info, AlertTriangle } from 'lucide-react';
import { tapScale } from '../../animations/variants';

// =========================================
// Button
// =========================================
const btnBase = 'inline-flex items-center justify-center gap-2 font-semibold rounded-btn transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed';

const btnVariants = {
    primary: 'bg-teal-500 hover:bg-teal-600 text-white focus:ring-teal-400 shadow-teal-glow',
    secondary: 'bg-surface-100 hover:bg-surface-200 text-navy-900 border border-surface-300 focus:ring-teal-400',
    danger: 'bg-red-50 hover:bg-red-100 text-red-700 border border-red-200 focus:ring-red-400',
    ghost: 'bg-transparent hover:bg-surface-100 text-navy-700 focus:ring-teal-400',
    outline: 'bg-transparent border border-teal-500/60 text-teal-600 hover:bg-teal-50 focus:ring-teal-400',
};

const btnSizes = {
    sm: 'px-3 py-1.5 text-xs',
    md: 'px-4 py-2.5 text-sm',
    lg: 'px-6 py-3 text-base',
    xl: 'px-8 py-4 text-lg',
};

export function Button({ variant = 'primary', size = 'md', children, className = '', loading, icon, ...props }) {
    return (
        <motion.button
            whileTap={tapScale}
            className={`${btnBase} ${btnVariants[variant]} ${btnSizes[size]} ${className}`}
            disabled={loading || props.disabled}
            {...props}
        >
            {loading ? (
                <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                </svg>
            ) : icon}
            {children}
        </motion.button>
    );
}

// =========================================
// Card
// =========================================
export function Card({ children, className = '', hover = false, glow = false, onClick }) {
    const base = `card ${hover ? 'card-hover cursor-pointer' : ''} ${glow ? 'teal-glow' : ''}`;
    if (onClick || hover) {
        return (
            <motion.div className={`${base} ${className}`}
                whileHover={{ y: -3, boxShadow: '0 6px 24px rgba(0,0,0,0.10)' }}
                onClick={onClick}>
                {children}
            </motion.div>
        );
    }
    return <div className={`${base} ${className}`}>{children}</div>;
}

// =========================================
// Badge
// =========================================
const badgeMap = {
    success: 'badge-success', danger: 'badge-danger', warning: 'badge-warning',
    info: 'badge-info', neutral: 'badge-neutral',
    active: 'badge-success', inactive: 'badge-neutral', 'on-leave': 'badge-warning',
    operational: 'badge-success', maintenance: 'badge-warning', 'out-of-service': 'badge-danger',
    pending: 'badge-warning', approved: 'badge-success', rejected: 'badge-danger',
    present: 'badge-success', absent: 'badge-danger', scheduled: 'badge-info', completed: 'badge-neutral',
};

export function Badge({ status, children, className = '' }) {
    const cls = badgeMap[status?.toLowerCase()] || 'badge-neutral';
    return <span className={`badge ${cls} ${className}`}>{children ?? status}</span>;
}

// =========================================
// Input
// =========================================
export function Input({ label, error, icon, className = '', ...props }) {
    return (
        <div className="flex flex-col gap-1">
            {label && <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">{label}</label>}
            <div className="relative">
                {icon && <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">{icon}</span>}
                <input
                    className={`input-base ${icon ? 'pl-10' : ''} ${error ? '!border-red-400 focus:!border-red-500' : ''} ${className}`}
                    {...props}
                />
            </div>
            {error && <p className="text-xs text-red-500 flex items-center gap-1"><AlertCircle size={12} />{error}</p>}
        </div>
    );
}

// =========================================
// Select
// =========================================
export function Select({ label, error, options = [], className = '', ...props }) {
    return (
        <div className="flex flex-col gap-1">
            {label && <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">{label}</label>}
            <select
                className={`input-base appearance-none ${error ? 'border-red-400' : ''} ${className}`}
                {...props}
            >
                {options.map((opt) => (
                    <option key={opt.value ?? opt} value={opt.value ?? opt}>
                        {opt.label ?? opt}
                    </option>
                ))}
            </select>
            {error && <p className="text-xs text-red-500">{error}</p>}
        </div>
    );
}

// =========================================
// Modal
// =========================================
export function Modal({ isOpen, onClose, title, children, size = 'md' }) {
    const sizeMap = { sm: 'max-w-sm', md: 'max-w-lg', lg: 'max-w-2xl', xl: 'max-w-4xl' };
    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div className="fixed inset-0 z-50 flex items-center justify-center p-4"
                    initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                    <div className="absolute inset-0 bg-black/30 backdrop-blur-sm" onClick={onClose} />
                    <motion.div className={`relative w-full ${sizeMap[size]} bg-white border border-surface-200 rounded-card shadow-modal overflow-hidden`}
                        initial={{ opacity: 0, scale: 0.92, y: 16 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: 8 }}
                        transition={{ duration: 0.25, ease: [0.25, 0.46, 0.45, 0.94] }}>
                        <div className="flex items-center justify-between p-5 border-b border-surface-200">
                            <h3 className="text-lg font-semibold text-navy-900">{title}</h3>
                            <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-surface-100 text-slate-400 hover:text-slate-600 transition-colors">
                                <X size={18} />
                            </button>
                        </div>
                        <div className="p-5">{children}</div>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}

// =========================================
// Alert
// =========================================
const alertMap = {
    success: { cls: 'bg-green-50 border-green-200 text-green-800', Icon: CheckCircle },
    danger: { cls: 'bg-red-50 border-red-200 text-red-700', Icon: AlertCircle },
    warning: { cls: 'bg-amber-50 border-amber-200 text-amber-800', Icon: AlertTriangle },
    info: { cls: 'bg-teal-50 border-teal-200 text-teal-800', Icon: Info },
};

export function Alert({ type = 'info', children }) {
    const { cls, Icon } = alertMap[type] || alertMap.info;
    return (
        <div className={`flex items-start gap-3 p-4 rounded-card border text-sm ${cls}`}>
            <Icon size={16} className="mt-0.5 shrink-0" />
            <div>{children}</div>
        </div>
    );
}

// =========================================
// Table
// =========================================
export function Table({ columns, data, emptyText = 'No records found' }) {
    return (
        <div className="overflow-x-auto rounded-card border border-surface-200 shadow-soft">
            <table className="w-full text-sm">
                <thead>
                    <tr className="bg-surface-50 border-b border-surface-200">
                        {columns.map((col) => (
                            <th key={col.key} className="px-4 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider whitespace-nowrap">
                                {col.label}
                            </th>
                        ))}
                    </tr>
                </thead>
                <tbody>
                    {data.length === 0 ? (
                        <tr><td colSpan={columns.length} className="px-4 py-10 text-center text-slate-400">{emptyText}</td></tr>
                    ) : data.map((row, i) => (
                        <tr key={row.id ?? i} className="border-b border-surface-100 hover:bg-surface-50 transition-colors">
                            {columns.map((col) => (
                                <td key={col.key} className="px-4 py-3 text-navy-800 whitespace-nowrap">
                                    {col.render ? col.render(row[col.key], row) : row[col.key] ?? '—'}
                                </td>
                            ))}
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}

// =========================================
// Skeleton
// =========================================
export function Skeleton({ className = '' }) {
    return <div className={`bg-surface-200 animate-pulse rounded-lg ${className}`} />;
}
export function SkeletonCard() {
    return (
        <div className="card p-5 space-y-3">
            <Skeleton className="h-4 w-2/5" />
            <Skeleton className="h-8 w-1/3" />
            <Skeleton className="h-3 w-3/5" />
        </div>
    );
}

// =========================================
// StatCard
// =========================================
export function StatCard({ label, value, change, icon: Icon, color = 'teal', suffix = '', onClick }) {
    const colorMap = {
        teal: { bg: 'bg-teal-50', text: 'text-teal-600', icon: 'text-teal-500', border: 'border-teal-100' },
        amber: { bg: 'bg-amber-50', text: 'text-amber-700', icon: 'text-amber-500', border: 'border-amber-100' },
        green: { bg: 'bg-green-50', text: 'text-green-700', icon: 'text-green-500', border: 'border-green-100' },
        red: { bg: 'bg-red-50', text: 'text-red-700', icon: 'text-red-500', border: 'border-red-100' },
        blue: { bg: 'bg-blue-50', text: 'text-blue-700', icon: 'text-blue-500', border: 'border-blue-100' },
    };
    const c = colorMap[color] || colorMap.teal;
    return (
        <motion.div whileHover={{ y: -3, boxShadow: '0 6px 24px rgba(0,0,0,0.10)' }}
            onClick={onClick}
            className={`card p-5 border ${c.border} ${onClick ? 'cursor-pointer' : ''}`}>
            <div className="flex items-start justify-between mb-3">
                <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">{label}</p>
                {Icon && <div className={`p-2 rounded-lg ${c.bg}`}><Icon size={18} className={c.icon} /></div>}
            </div>
            <p className={`text-3xl font-bold font-outfit ${c.text}`}>{value}{suffix}</p>
            {change && <p className="text-xs text-slate-400 mt-1">{change}</p>}
        </motion.div>
    );
}

// =========================================
// PageHeader
// =========================================
export function PageHeader({ title, subtitle, actions }) {
    return (
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-6">
            <div>
                <h1 className="text-2xl font-bold text-navy-900 font-outfit">{title}</h1>
                {subtitle && <p className="text-sm text-slate-500 mt-0.5">{subtitle}</p>}
            </div>
            {actions && <div className="flex items-center gap-2 flex-wrap">{actions}</div>}
        </div>
    );
}

// =========================================
// EmptyState
// =========================================
export function EmptyState({ icon: Icon, title, description, action }) {
    return (
        <div className="flex flex-col items-center justify-center py-16 text-center">
            {Icon && <div className="p-4 bg-surface-100 rounded-full mb-4"><Icon size={28} className="text-slate-400" /></div>}
            <p className="text-lg font-semibold text-navy-800 mb-1">{title}</p>
            {description && <p className="text-sm text-slate-500 mb-4 max-w-xs">{description}</p>}
            {action}
        </div>
    );
}

// =========================================
// Divider
// =========================================
export function Divider({ className = '' }) {
    return <hr className={`section-divider my-6 ${className}`} />;
}

// =========================================
// Toggle
// =========================================
export function Toggle({ checked, onChange, label }) {
    return (
        <label className="flex items-center gap-3 cursor-pointer">
            <div onClick={() => onChange(!checked)}
                className={`relative w-11 h-6 rounded-full transition-colors duration-200 ${checked ? 'bg-teal-500' : 'bg-surface-300'}`}>
                <span className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform duration-200 ${checked ? 'translate-x-5' : 'translate-x-0'}`} />
            </div>
            {label && <span className="text-sm text-navy-700">{label}</span>}
        </label>
    );
}
