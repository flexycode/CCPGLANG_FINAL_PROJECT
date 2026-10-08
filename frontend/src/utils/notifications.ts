export interface NotificationItem {
    id: number;
    title: string;
    time: string;
    content: string;
    read: boolean;
    timestamp: number;
    type?: 'student' | 'user' | 'warning' | 'system' | 'class';
}

const STORAGE_KEY = 'checkmate_notifications';

export const formatRelativeTime = (timestamp: number): string => {
    const diff = Math.max(0, Date.now() - timestamp);
    const minutes = Math.floor(diff / (1000 * 60));
    if (minutes < 1) return 'Just now';
    if (minutes < 60) return `${minutes} min${minutes === 1 ? '' : 's'} ago`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours} hour${hours === 1 ? '' : 's'} ago`;
    const days = Math.floor(hours / 24);
    return `${days} day${days === 1 ? '' : 's'} ago`;
};

export const getStoredNotifications = (): NotificationItem[] => {
    try {
        const saved = localStorage.getItem(STORAGE_KEY);
        if (saved) {
            const parsed = JSON.parse(saved);
            if (Array.isArray(parsed) && parsed.length > 0) {
                return parsed.map((item: NotificationItem) => ({
                    ...item,
                    time: item.timestamp ? formatRelativeTime(item.timestamp) : item.time,
                }));
            }
        }
    } catch {}

    const now = Date.now();
    const initial: NotificationItem[] = [
        {
            id: 1,
            title: 'Attendance Records Synced',
            time: 'Just now',
            content: 'All active class attendance rosters are synchronized in real-time.',
            read: false,
            timestamp: now - 1000 * 60 * 2,
            type: 'system',
        },
        {
            id: 2,
            title: 'System Initialized',
            time: '5 mins ago',
            content: 'Checkmate Monitoring System is running and active.',
            read: true,
            timestamp: now - 1000 * 60 * 5,
            type: 'system',
        },
    ];
    saveNotifications(initial);
    return initial;
};

export const saveNotifications = (items: NotificationItem[]) => {
    try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    } catch {}
    window.dispatchEvent(new CustomEvent('checkmate_notifications_updated', { detail: items }));
};

export const addNotification = (
    title: string,
    content: string,
    type: 'student' | 'user' | 'warning' | 'system' | 'class' = 'system'
): NotificationItem => {
    const current = getStoredNotifications();
    const newNotification: NotificationItem = {
        id: Date.now() + Math.floor(Math.random() * 1000),
        title,
        content,
        time: 'Just now',
        read: false,
        timestamp: Date.now(),
        type,
    };
    const updated = [newNotification, ...current].slice(0, 30);
    saveNotifications(updated);
    return newNotification;
};

export const markAllNotificationsAsRead = () => {
    const current = getStoredNotifications();
    const updated = current.map((item) => ({ ...item, read: true }));
    saveNotifications(updated);
};

export const markNotificationAsRead = (id: number) => {
    const current = getStoredNotifications();
    const updated = current.map((item) => (item.id === id ? { ...item, read: true } : item));
    saveNotifications(updated);
};
