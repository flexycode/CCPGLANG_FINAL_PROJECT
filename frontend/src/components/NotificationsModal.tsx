import { Bell, UserPlus, User, AlertTriangle, BookOpen, X, CheckCheck } from 'lucide-react';
import { type NotificationItem, markNotificationAsRead } from '../utils/notifications';

export { type NotificationItem };

interface NotificationsModalProps {
    isOpen: boolean;
    onClose: () => void;
    notifications: NotificationItem[];
    onMarkAllRead: () => void;
}

export default function NotificationsModal({
    isOpen,
    onClose,
    notifications,
    onMarkAllRead,
}: NotificationsModalProps) {
    if (!isOpen) return null;

    const getNotificationIcon = (type?: string) => {
        switch (type) {
            case 'student':
                return <UserPlus size={15} className="text-emerald-500" />;
            case 'user':
                return <User size={15} className="text-blue-500" />;
            case 'warning':
                return <AlertTriangle size={15} className="text-amber-500" />;
            case 'class':
                return <BookOpen size={15} className="text-purple-500" />;
            default:
                return <Bell size={15} className="text-gray-400 dark:text-gray-300" />;
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-start justify-end p-6 pt-20 bg-black/20 backdrop-blur-xs animate-in fade-in duration-200">
            {/* Backdrop click to close */}
            <div className="fixed inset-0" onClick={onClose}></div>

            {/* Notifications Popover Card */}
            <div className="relative w-full max-w-sm bg-white dark:bg-[#151D2A] rounded-3xl shadow-2xl border border-gray-100 dark:border-white/10 overflow-hidden z-10 animate-in zoom-in-95 duration-150 flex flex-col">
                {/* Header */}
                <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 dark:border-white/10">
                    <div className="flex items-center gap-2">
                        <h2 className="text-base font-bold text-[#1F2328] dark:text-white">Notifications</h2>
                        {notifications.some((n) => !n.read) && (
                            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-blue-100 dark:bg-blue-900/40 text-blue-600 dark:text-blue-400">
                                {notifications.filter((n) => !n.read).length} new
                            </span>
                        )}
                    </div>
                    <div className="flex items-center gap-2">
                        <button
                            onClick={onMarkAllRead}
                            title="Mark all as read"
                            className="flex items-center gap-1 text-xs font-semibold text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 transition-colors cursor-pointer"
                        >
                            <CheckCheck size={14} />
                            <span>Read all</span>
                        </button>
                        <button
                            onClick={onClose}
                            className="p-1 rounded-lg text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors cursor-pointer"
                            aria-label="Close"
                        >
                            <X size={16} />
                        </button>
                    </div>
                </div>

                {/* Notifications List */}
                <div className="p-4 flex flex-col gap-2.5 max-h-[420px] overflow-y-auto">
                    {notifications.length > 0 ? (
                        notifications.map((item) => (
                            <div
                                key={item.id}
                                onClick={() => !item.read && markNotificationAsRead(item.id)}
                                className={`p-3 rounded-2xl transition-all cursor-pointer flex gap-3 items-start border ${
                                    item.read
                                        ? 'bg-transparent border-transparent hover:bg-gray-50/80 dark:hover:bg-white/5 opacity-75 hover:opacity-100'
                                        : 'bg-blue-50/40 dark:bg-blue-950/20 border-blue-100/60 dark:border-blue-900/40 hover:bg-blue-50/70'
                                }`}
                            >
                                <div className="w-8 h-8 rounded-xl bg-gray-100 dark:bg-white/10 flex items-center justify-center shrink-0 mt-0.5">
                                    {getNotificationIcon(item.type)}
                                </div>
                                <div className="flex-1 flex flex-col gap-0.5 min-w-0">
                                    <div className="flex items-center justify-between gap-1">
                                        <div className="flex items-center gap-1.5 min-w-0">
                                            {!item.read && (
                                                <span className="w-2 h-2 rounded-full bg-blue-500 shrink-0" title="Unread" />
                                            )}
                                            <span className="text-xs font-bold text-[#1F2328] dark:text-white truncate">
                                                {item.title}
                                            </span>
                                        </div>
                                        <span className="text-[10px] text-gray-400 shrink-0">{item.time}</span>
                                    </div>
                                    <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed line-clamp-2">
                                        {item.content}
                                    </p>
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className="py-10 text-center text-xs text-gray-400 font-medium">
                            No notifications yet.
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
