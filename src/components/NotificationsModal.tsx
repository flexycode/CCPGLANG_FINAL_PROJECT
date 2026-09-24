export interface NotificationItem {
    id: number;
    title: string;
    time: string;
    content: string;
    read: boolean;
}

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

    return (
        <div className="fixed inset-0 z-50 flex items-start justify-end p-6 pt-20 bg-black/20 backdrop-blur-xs animate-in fade-in duration-200">
            {/* Backdrop click to close */}
            <div className="fixed inset-0" onClick={onClose}></div>

            {/* Notifications Popover Card */}
            <div className="relative w-full max-w-sm bg-white rounded-3xl shadow-2xl border border-gray-100 overflow-hidden z-10 animate-in zoom-in-95 duration-150">
                {/* Header */}
                <div className="flex items-center justify-between px-6 py-5 border-b border-gray-100">
                    <h2 className="text-lg font-bold text-[#1F2328]">Notifications</h2>
                    <button
                        onClick={onMarkAllRead}
                        className="text-xs font-semibold text-blue-600 hover:text-blue-700 transition-colors cursor-pointer"
                    >
                        Mark all as read
                    </button>
                </div>

                {/* Notifications List */}
                <div className="p-6 flex flex-col gap-5 max-h-[420px] overflow-y-auto">
                    {notifications.map((item) => (
                        <div key={item.id} className="flex flex-col gap-1 pb-4 border-b border-gray-100 last:border-b-0 last:pb-0">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                    {!item.read && (
                                        <span className="w-2 h-2 rounded-full bg-blue-500 shrink-0" title="Unread"></span>
                                    )}
                                    <span className="text-sm font-bold text-[#1F2328]">{item.title}</span>
                                </div>
                                <span className="text-xs text-gray-400 font-normal">{item.time}</span>
                            </div>
                            <p className="text-xs text-gray-500 leading-relaxed mt-0.5">{item.content}</p>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
