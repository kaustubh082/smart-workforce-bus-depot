import { motion } from 'framer-motion';
import { User, Phone, Mail, IdCard, Calendar, LogOut } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { fadeUp, staggerContainer } from '../../animations/variants';
import { useAuth } from '../../context/AuthContext';
import { Button } from '../../components/ui';

export default function ProfilePage() {
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    const INFO_ROWS = [
        { label: 'Employee ID', value: user?.employeeId || '—', icon: IdCard },
        { label: 'Role', value: user?.role ? user.role.charAt(0).toUpperCase() + user.role.slice(1) : '—', icon: User },
        { label: 'Mobile', value: user?.mobile || '9876543210', icon: Phone },
        { label: 'Email', value: user?.email || `${user?.employeeId?.toLowerCase()}@depot.com`, icon: Mail },
        { label: 'Joined', value: user?.joinDate || 'Jan 2024', icon: Calendar },
    ];

    return (
        <motion.div variants={staggerContainer} initial="hidden" animate="visible" className="space-y-6">
            {/* Profile hero card */}
            <motion.div variants={fadeUp}
                className="rounded-2xl overflow-hidden"
                style={{ background: 'linear-gradient(135deg,#123B5D 0%,#176B87 60%,#19A7A8 100%)' }}>
                <div className="p-8 flex flex-col items-center text-center">
                    <div className="w-20 h-20 rounded-full bg-white/20 border-2 border-white/40 flex items-center justify-center text-white font-black text-3xl font-outfit mb-4">
                        {user?.name?.charAt(0)?.toUpperCase() || 'U'}
                    </div>
                    <h2 className="text-xl font-black text-white font-outfit">{user?.name}</h2>
                    <p className="text-white/65 text-sm mt-1 capitalize">{user?.role} · {user?.depot || 'Central Bus Depot'}</p>
                    <span className="mt-3 inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/15 border border-white/25 text-xs font-semibold text-white">
                        ✓ Active
                    </span>
                </div>
            </motion.div>

            {/* Info cards */}
            <motion.div variants={fadeUp} className="card divide-y divide-[#F7F9FC]">
                {INFO_ROWS.map(({ label, value, icon: Icon }) => (
                    <div key={label} className="flex items-center gap-3 p-4">
                        <div className="w-9 h-9 rounded-xl bg-[#F7F9FC] border border-[#E5EAF0] flex items-center justify-center shrink-0">
                            <Icon size={15} className="text-[#19A7A8]" />
                        </div>
                        <div className="flex-1 min-w-0">
                            <p className="text-[10px] text-[#98A9BB] uppercase tracking-wider font-bold">{label}</p>
                            <p className="font-medium text-[#14212B] text-sm mt-0.5 truncate">{value}</p>
                        </div>
                    </div>
                ))}
            </motion.div>

            {/* Logout */}
            <motion.div variants={fadeUp}>
                <Button variant="secondary" className="w-full border-red-200 text-red-500 hover:bg-red-50 hover:text-red-600"
                    onClick={() => { logout(); navigate('/login'); }}>
                    <LogOut size={15} /> Sign Out
                </Button>
            </motion.div>
        </motion.div>
    );
}
