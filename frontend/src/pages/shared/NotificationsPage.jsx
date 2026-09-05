import { motion } from 'framer-motion';
import { Bell, CheckCheck } from 'lucide-react';
import { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { fadeUp, staggerContainer } from '../../animations/variants';
import { PageHeader, Button } from '../../components/ui';
import { MOCK_NOTIFICATIONS } from '../../mock/data';

const TYPE_COLOR = {
    duty: 'bg-teal-500/15 text-teal-400',
    leave: 'bg-amber-400/15 text-amber-400',
    info: 'bg-blue-500/15 text-blue-400',
    alert: 'bg-danger/15 text-red-400',
};

export default function NotificationsPage() {
    const { user } = useAuth();
    const myAll = MOCK_NOTIFICATIONS.filter((n) => n.userId === user?.id);
    const [notifications, setNotifications] = useState(myAll);

    const markAll = () => setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
    const markOne = (id) => setNotifications((prev) => prev.map((n) => n.id === id ? { ...n, isRead: true } : n));

    const unread = notifications.filter((n) => !n.isRead).length;

    return (
        <motion.div variants={staggerContainer} initial="hidden" animate="visible" className="space-y-6 max-w-lg">
            <motion.div variants={fadeUp}>
                <PageHeader
                    title="Notifications"
                    subtitle={`${unread} unread`}
                    actions={unread > 0 && (
                        <Button variant="ghost" size="sm" icon={<CheckCheck size={14} />} onClick={markAll}>
                            Mark all read
                        </Button>
                    )}
                />
            </motion.div>

            {notifications.length === 0 ? (
                <motion.div variants={fadeUp} className="card p-10 text-center border border-white/05">
                    <Bell size={30} className="text-gray-600 mx-auto mb-2" />
                    <p className="text-gray-500">No notifications</p>
                </motion.div>
            ) : (
                <div className="space-y-2">
                    {notifications.map((n, i) => (
                        <motion.div key={n.id} variants={fadeUp} custom={i}
                            onClick={() => markOne(n.id)}
                            className={`card p-4 border cursor-pointer transition-all ${n.isRead ? 'border-white/04 opacity-60' : 'border-white/08 hover:border-teal-500/20'
                                }`}
                        >
                            <div className="flex items-start gap-3">
                                <span className={`mt-0.5 px-2 py-0.5 rounded text-[10px] font-semibold uppercase ${TYPE_COLOR[n.type] || TYPE_COLOR.info}`}>
                                    {n.type}
                                </span>
                                <div className="flex-1 min-w-0">
                                    <div className="flex items-center justify-between gap-2">
                                        <p className={`text-sm font-semibold ${n.isRead ? 'text-gray-400' : 'text-white'}`}>{n.title}</p>
                                        {!n.isRead && <span className="w-2 h-2 bg-teal-400 rounded-full shrink-0" />}
                                    </div>
                                    <p className="text-xs text-gray-500 mt-0.5">{n.body}</p>
                                    <p className="text-[10px] text-gray-600 mt-1">{formatTime(n.createdAt)}</p>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>
            )}
        </motion.div>
    );
}

function formatTime(iso) {
    return new Date(iso).toLocaleString('en-IN', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' });
}
