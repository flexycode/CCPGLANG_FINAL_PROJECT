import { useState } from 'react';
import { CalendarIcon, Bell, Settings } from 'lucide-react';
import { Calendar } from '@/components/ui/calendar';
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from '@/components/ui/popover';
import NotificationsModal, { type NotificationItem } from './NotificationsModal';
import SettingsModal from './SettingsModal';

export default function HeaderDate() {
    const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
    const [isCalendarOpen, setIsCalendarOpen] = useState(false);
    const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
    const [isSettingsOpen, setIsSettingsOpen] = useState(false);

    const [notifications, setNotifications] = useState<NotificationItem[]>([
        {
            id: 1,
            title: 'Max Absences Reached',
            time: '10 mins ago',
            content: 'Rinoah Dela Rama has reached 4 absences, exceeding the maximum allowed.',
            read: false,
        },
        {
            id: 2,
            title: 'High Lates Warning',
            time: '1 hour ago',
            content: 'Jay Arre Talosig has 6 lates. This counts as 2 absences.',
            read: false,
        },
        {
            id: 3,
            title: 'System Update',
            time: '2 hours ago',
            content: 'Attendance records synced successfully.',
            read: true,
        },
    ]);

    const hasUnread = notifications.some((item) => !item.read);

    const handleMarkAllRead = () => {
        setNotifications((prev) => prev.map((item) => ({ ...item, read: true })));
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
                        className="flex items-center gap-2 text-xs font-semibold text-gray-500 cursor-pointer hover:text-gray-900 transition-colors select-none group"
                    >
                        <div className="p-1 text-gray-400 group-hover:text-gray-700 hover:bg-black/5 rounded-md transition-colors flex items-center justify-center">
                            <CalendarIcon size={16} />
                        </div>
                        <span>{formatDate(currentDate)}</span>
                        <span>•</span>
                        <span>{formatTime(currentDate)}</span>
                    </div>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-3 bg-white border border-gray-200/80 shadow-xl rounded-2xl z-50" align="start">
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
                    className="p-2.5 text-gray-600 hover:bg-gray-100/80 rounded-full transition-all relative cursor-pointer"
                >
                    <Bell size={18} />
                    {hasUnread && (
                        <span className="absolute top-2 right-2 w-2 h-2 rounded-full bg-blue-500 animate-in zoom-in duration-200"></span>
                    )}
                </button>
                <button
                    onClick={() => setIsSettingsOpen(true)}
                    aria-label="Settings"
                    className="p-2.5 text-gray-600 hover:bg-gray-100/80 rounded-full transition-all cursor-pointer"
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
