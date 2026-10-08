import { useState, useEffect } from 'react';
import { CalendarIcon, Bell, Settings } from 'lucide-react';
import { Calendar } from '@/components/ui/calendar';
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from '@/components/ui/popover';
import NotificationsModal from './NotificationsModal';
import SettingsModal from './SettingsModal';
import {
    getStoredNotifications,
    markAllNotificationsAsRead,
    type NotificationItem,
} from '../utils/notifications';

export default function HeaderDate() {
    const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
    const [isCalendarOpen, setIsCalendarOpen] = useState(false);
    const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
    const [isSettingsOpen, setIsSettingsOpen] = useState(false);

    const [notifications, setNotifications] = useState<NotificationItem[]>(getStoredNotifications);

    useEffect(() => {
        const syncNotifications = () => {
            setNotifications(getStoredNotifications());
        };
        window.addEventListener('checkmate_notifications_updated', syncNotifications);
        window.addEventListener('storage', syncNotifications);
        return () => {
            window.removeEventListener('checkmate_notifications_updated', syncNotifications);
            window.removeEventListener('storage', syncNotifications);
        };
    }, []);

    const unreadCount = notifications.filter((item) => !item.read).length;
    const hasUnread = unreadCount > 0;

    const handleMarkAllRead = () => {
        markAllNotificationsAsRead();
    };

    const currentDate = selectedDate || new Date();

    const formatDate = (date: Date) => {
        return date.toLocaleDateString('en-US', {
            weekday: 'long',
            month: 'long',
            day: 'numeric',
        });
    };

    const formatTime = (date: Date) => {
        return date.toLocaleTimeString('en-US', {
            hour: 'numeric',
            minute: '2-digit',
            hour12: true,
        });
    };

    return (
        <div className="flex items-center justify-between w-full">
            {/* Date & Time Picker */}
            <Popover open={isCalendarOpen} onOpenChange={setIsCalendarOpen}>
                <PopoverTrigger asChild>
                    <div
                        role="button"
                        tabIndex={0}
                        title="Click to open date picker"
                        className="flex items-center gap-2 text-xs font-semibold text-gray-500 dark:text-gray-400 cursor-pointer hover:text-gray-900 dark:hover:text-gray-100 transition-colors select-none group"
                    >
                        <div className="p-1 text-gray-400 dark:text-gray-400 group-hover:text-gray-700 dark:group-hover:text-gray-200 hover:bg-black/5 dark:hover:bg-white/10 rounded-md transition-colors flex items-center justify-center">
                            <CalendarIcon size={16} />
                        </div>
                        <span className="hidden sm:inline">{formatDate(currentDate)}</span>
                        <span className="sm:hidden">{currentDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</span>
                        <span>•</span>
                        <span>{formatTime(currentDate)}</span>
                    </div>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-3 bg-white dark:bg-[#16213e] border border-gray-200/80 dark:border-white/10 shadow-2xl rounded-2xl z-50 text-gray-900 dark:text-gray-100" align="start">
                    <Calendar
                        mode="single"
                        selected={selectedDate}
                        onSelect={(date) => {
                            if (date) {
                                setSelectedDate(date);
                                setIsCalendarOpen(false);
                            }
                        }}
                    />
                </PopoverContent>
            </Popover>

            {/* Notification & Settings Action Buttons */}
            <div className="flex items-center gap-1">
                <button
                    onClick={() => setIsNotificationsOpen(true)}
                    aria-label="Notifications"
                    className="p-2.5 text-gray-600 dark:text-gray-300 hover:bg-gray-100/80 dark:hover:bg-white/10 rounded-full transition-all relative cursor-pointer"
                >
                    <Bell size={18} />
                    {hasUnread && (
                        <span className="absolute top-1.5 right-1.5 min-w-[15px] h-[15px] px-0.5 rounded-full bg-blue-500 text-white text-[9px] font-bold flex items-center justify-center animate-in zoom-in duration-200 shadow-xs">
                            {unreadCount > 9 ? '9+' : unreadCount}
                        </span>
                    )}
                </button>
                <button
                    onClick={() => setIsSettingsOpen(true)}
                    aria-label="Settings"
                    className="p-2.5 text-gray-600 dark:text-gray-300 hover:bg-gray-100/80 dark:hover:bg-white/10 rounded-full transition-all cursor-pointer"
                >
                    <Settings size={18} />
                </button>
            </div>

            {/* Modals */}
            <NotificationsModal
                isOpen={isNotificationsOpen}
                onClose={() => setIsNotificationsOpen(false)}
                notifications={notifications}
                onMarkAllRead={handleMarkAllRead}
            />
            <SettingsModal isOpen={isSettingsOpen} onClose={() => setIsSettingsOpen(false)} />
        </div>
    );
}
