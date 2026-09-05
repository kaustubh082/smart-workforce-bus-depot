import { useState } from 'react';
import { motion } from 'framer-motion';
import { User, Mail, Phone, Building2, Calendar, Shield, Edit3, Check, X } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { fadeUp, staggerContainer } from '../../animations/variants';
import { PageHeader, Button, Input, Badge, Alert } from '../../components/ui';

export default function ProfilePage() {
    const { user, logout } = useAuth();
    const [editing, setEditing] = useState(false);
    const [form, setForm] = useState({ name: user?.name || '', phone: user?.phone || '' });
    const [saved, setSaved] = useState(false);

    const save = () => { setEditing(false); setSaved(true); setTimeout(() => setSaved(false), 3000); };

    return (
        <motion.div variants={staggerContainer} initial="hidden" animate="visible" className="space-y-6 max-w-lg">
            <motion.div variants={fadeUp}>
                <PageHeader title="My Profile" subtitle="View and update your account details" />
            </motion.div>

            {saved && <motion.div variants={fadeUp}><Alert type="success">Profile updated successfully</Alert></motion.div>}

            {/* Avatar card */}
            <motion.div variants={fadeUp} className="card p-6 border border-white/06">
                <div className="flex items-center gap-5">
                    <div className="w-20 h-20 rounded-full bg-gradient-to-br from-teal-500 to-teal-600 flex items-center justify-center text-3xl font-bold font-outfit text-navy-950 shrink-0">
                        {user?.name?.charAt(0)?.toUpperCase() || 'U'}
                    </div>
                    <div>
                        <h2 className="text-xl font-bold font-outfit text-white">{user?.name}</h2>
                        <span className="badge badge-info capitalize mt-1">{user?.role}</span>
                        <p className="text-sm text-gray-500 mt-1">{user?.employeeId}</p>
                    </div>
                </div>
            </motion.div>

            {/* Info grid */}
            <motion.div variants={fadeUp} className="card p-5 border border-white/06">
                <div className="flex items-center justify-between mb-4">
                    <h3 className="text-base font-semibold text-white">Personal Information</h3>
                    {!editing
                        ? <Button variant="ghost" size="sm" icon={<Edit3 size={14} />} onClick={() => setEditing(true)}>Edit</Button>
                        : (
                            <div className="flex gap-2">
                                <Button variant="primary" size="sm" icon={<Check size={14} />} onClick={save}>Save</Button>
                                <Button variant="ghost" size="sm" icon={<X size={14} />} onClick={() => setEditing(false)}>Cancel</Button>
                            </div>
                        )
                    }
                </div>

                <div className="space-y-4">
                    {editing ? (
                        <>
                            <Input label="Full Name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} icon={<User size={14} />} />
                            <Input label="Phone" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} icon={<Phone size={14} />} />
                        </>
                    ) : (
                        <>
                            {[
                                { icon: User, label: 'Full Name', value: user?.name },
                                { icon: Mail, label: 'Email', value: user?.email },
                                { icon: Phone, label: 'Phone', value: user?.phone || 'Not set' },
                                { icon: Building2, label: 'Depot', value: user?.depot },
                                { icon: Calendar, label: 'Joined', value: user?.joinedDate },
                                { icon: Shield, label: 'Role', value: user?.role, capitalize: true },
                            ].map(({ icon: Icon, label, value, capitalize }) => (
                                <div key={label} className="flex items-center gap-3 py-2 border-b border-white/04 last:border-0">
                                    <Icon size={15} className="text-gray-500 shrink-0" />
                                    <div>
                                        <p className="text-xs text-gray-500">{label}</p>
                                        <p className={`text-sm text-white font-medium ${capitalize ? 'capitalize' : ''}`}>{value || '—'}</p>
                                    </div>
                                </div>
                            ))}
                        </>
                    )}
                </div>
            </motion.div>

            {/* Danger zone */}
            <motion.div variants={fadeUp} className="card p-5 border border-danger/20">
                <h3 className="text-sm font-semibold text-red-400 mb-3">Account</h3>
                <Button variant="danger" size="md" onClick={logout}>Sign Out</Button>
            </motion.div>
        </motion.div>
    );
}
