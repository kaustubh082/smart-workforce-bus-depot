import { motion } from 'framer-motion';
import { Bell, CheckCircle } from 'lucide-react';
import { fadeUp, staggerContainer } from '../../animations/variants';
import { useAuth } from '../../context/AuthContext';
import { MOCK_NOTIFICATIONS } from '../../mock/data';

const TYPE_STYLE = {
    info: { dot: 'bg-[#19A7A8]', bg: '#E6F7F7', border: '#b2e8e8' },
    success: { dot: 'bg-green-500', bg: '#d1fae5', border: '#a7f3d0' },
    warning: { dot: 'bg-amber-400', bg: '#fef3c7', border: '#fde68a' },
    danger: { dot: 'bg-red-500', bg: '#fee2e2', border: '#fecaca' },
};

export default function NotificationsPage() {
    const { user } = useAuth();
    const notifs = MOCK_NOTIFICATIONS.filter((n) => n.userId === user?.id);
    const unread = notifs.filter((n) => !n.isRead).length;

    return (
        <motion.div variants={staggerContainer} initial="hidden" animate="visible" className="space-y-6">
            <motion.div variants={fadeUp} className="flex items-start justify-between">
                <div>
                    <p className="text-[11px] text-[#19A7A8] uppercase tracking-widest font-bold mb-1">Inbox</p>
                    <h1 className="text-2xl font-black font-outfit text-[#14212B]">Notifications</h1>
                    {unread > 0 && <p className="text-sm text-[#6B7E92] mt-0.5">{unread} unread</p>}
                </div>
                {unread > 0 && (
                    <button className="text-xs font-semibold text-[#19A7A8] hover:text-[#178F90] flex items-center gap-1 transition-colors">
                        <CheckCircle size={13} /> Mark all read
                    </button>
                )}
            </motion.div>

            {notifs.length === 0 ? (
                <motion.div variants={fadeUp} className="card p-12 text-center">
                    <Bell size={36} className="mx-auto mb-3 text-[#D0DAE6]" />
                    <p className="text-[#98A9BB] text-sm">No notifications yet</p>
                </motion.div>
            ) : (
                <motion.div variants={staggerContainer} className="space-y-2">
                    {notifs.map((n) => {
                        const s = TYPE_STYLE[n.type] || TYPE_STYLE.info;
                        return (
                            <motion.div key={n.id} variants={fadeUp}
                                className="card p-4 flex items-start gap-3 cursor-pointer transition-all"
                                style={!n.isRead ? { borderColor: s.border, background: s.bg } : {}}
                                whileHover={{ y: -1, boxShadow: '0 4px 14px rgba(18,59,93,0.08)' }}>
                                <span className={`w-2 h-2 rounded-full mt-1.5 shrink-0 ${s.dot} ${n.isRead ? 'opacity-30' : ''}`} />
                                <div className="flex-1">
                                    <p className={`text-sm font-semibold ${n.isRead ? 'text-[#6B7E92]' : 'text-[#14212B]'}`}>{n.title}</p>
                                    <p className="text-xs text-[#98A9BB] mt-0.5">{n.body}</p>
                                </div>
                                {!n.isRead && (
                                    <span className="w-2 h-2 rounded-full bg-[#19A7A8] shrink-0 mt-1.5" />
                                )}
                            </motion.div>
                        );
                    })}
                </motion.div>
            )}
        </motion.div>
    );
}
