/**
 * Topbar.tsx — Top Navigation Bar with Real-Time Clock, Notifications & Settings
 * ==============================================================================
 * PARADIGM: Functional Programming (FP)
 * 
 * Features:
 * - Real-time institutional date & active class period via useServerTime()
 * - Live notification badge and popover (Figma Layer 2)
 * - Account settings modal launcher (Figma Layer 3)
 */

import React, { useState, useEffect, useCallback } from 'react';
import { Bell, Settings, Search } from 'lucide-react';
import { useServerTime } from '../utils/useServerTime';
import NotificationPopover, { NotificationItem } from './NotificationPopover';
import SettingsModal, { UserSettingsData } from './SettingsModal';

const Topbar: React.FC = () => {
  const { formattedDate, activePeriod } = useServerTime();
  
  // Notification state
  const [notifications, setNotifications] = useState<readonly NotificationItem[]>([]);
  const [unreadCount, setUnreadCount] = useState<number>(0);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState<boolean>(false);
  
  // Settings modal state
  const [isSettingsOpen, setIsSettingsOpen] = useState<boolean>(false);

  // Fetch notifications from backend
  const fetchNotifications = useCallback(async () => {
    try {
      const res = await fetch('http://localhost:8000/api/notifications');
      if (res.ok) {
        const data = await res.json();
        setNotifications(data.notifications || []);
        setUnreadCount(data.unread_count || 0);
      }
    } catch (err) {
      console.warn('Could not fetch notifications from backend:', err);
    }
  }, []);

  useEffect(() => {
    fetchNotifications();
    // Periodically poll for new alerts every 30 seconds
    const interval = setInterval(fetchNotifications, 30000);
    return () => clearInterval(interval);
  }, [fetchNotifications]);

  // Mark all notifications as read
  const handleMarkAllAsRead = async () => {
    try {
      const res = await fetch('http://localhost:8000/api/notifications/mark-all-read', {
        method: 'POST',
      });
      if (res.ok) {
        setNotifications((prev) =>
          prev.map((n) => ({ ...n, is_read: true }))
        );
        setUnreadCount(0);
      }
    } catch (err) {
      console.error('Failed to mark all notifications as read:', err);
    }
  };

  // Mark single notification as read
  const handleMarkAsRead = async (id: number) => {
    try {
      const res = await fetch(`http://localhost:8000/api/notifications/${id}/read`, {
        method: 'PATCH',
      });
      if (res.ok) {
        setNotifications((prev) =>
          prev.map((n) => (n.id === id ? { ...n, is_read: true } : n))
        );
        setUnreadCount((prev) => Math.max(0, prev - 1));
      }
    } catch (err) {
      console.error('Failed to mark notification as read:', err);
    }
  };

  return (
    <>
      <header style={styles.topbar}>
        {/* Search Bar */}
        <div style={styles.searchContainer}>
          <Search size={18} style={styles.searchIcon} />
          <input 
            type="text" 
            placeholder="Quick search a student or class" 
            style={styles.searchInput}
          />
        </div>
        
        {/* Actions & DateTime */}
        <div style={styles.actions}>
          {/* Synchronized Real-Time Institutional Clock */}
          <div style={styles.datetime}>
            <span style={styles.date}>{formattedDate}</span>
            <span style={styles.time}>{activePeriod}</span>
          </div>
          
          {/* Notification Button & Popover */}
          <div style={styles.buttonWrapper}>
            <button 
              style={{
                ...styles.iconButton,
                backgroundColor: isNotificationsOpen ? '#F0ECE4' : 'var(--bg-white)',
              }}
              onClick={() => setIsNotificationsOpen((prev) => !prev)}
              aria-label="Toggle notifications"
              type="button"
            >
              <Bell size={20} />
              {unreadCount > 0 && (
                <span style={styles.badge}>{unreadCount}</span>
              )}
            </button>

            {isNotificationsOpen && (
              <NotificationPopover 
                notifications={notifications}
                onClose={() => setIsNotificationsOpen(false)}
                onMarkAllAsRead={handleMarkAllAsRead}
                onMarkAsRead={handleMarkAsRead}
              />
            )}
          </div>
          
          {/* Settings Button */}
          <button 
            style={styles.iconButton}
            onClick={() => setIsSettingsOpen(true)}
            aria-label="Open settings"
            type="button"
          >
            <Settings size={20} />
          </button>
        </div>
      </header>

      {/* Account Settings Modal */}
      <SettingsModal 
        isOpen={isSettingsOpen} 
        onClose={() => setIsSettingsOpen(false)}
        onSaved={(updated: UserSettingsData) => {
          console.log('Saved updated settings:', updated);
        }}
      />
    </>
  );
};

const styles = {
  topbar: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '1.5rem 2.5rem',
    backgroundColor: 'var(--bg-primary)',
    borderBottom: '1px solid var(--border-color)',
    position: 'relative' as const,
    zIndex: 50,
  },
  searchContainer: {
    position: 'relative' as const,
    width: '400px',
  },
  searchIcon: {
    position: 'absolute' as const,
    left: '1rem',
    top: '50%',
    transform: 'translateY(-50%)',
    color: 'var(--text-muted)',
  },
  searchInput: {
    width: '100%',
    padding: '0.6rem 1rem 0.6rem 2.5rem',
    borderRadius: '20px',
    border: '1px solid var(--border-color)',
    backgroundColor: 'var(--bg-white)',
    fontFamily: 'var(--font-body)',
  },
  actions: {
    display: 'flex',
    alignItems: 'center',
    gap: '1.5rem',
  },
  datetime: {
    display: 'flex',
    flexDirection: 'column' as const,
    alignItems: 'flex-end',
    marginRight: '0.5rem',
  },
  date: {
    fontWeight: 600,
    fontSize: '0.9rem',
    color: 'var(--text-primary)',
  },
  time: {
    fontSize: '0.8rem',
    color: 'var(--text-muted)',
    marginTop: '0.1rem',
  },
  buttonWrapper: {
    position: 'relative' as const,
  },
  iconButton: {
    position: 'relative' as const,
    padding: '0.5rem',
    borderRadius: '50%',
    backgroundColor: 'var(--bg-white)',
    border: '1px solid var(--border-color)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: 'var(--text-secondary)',
    cursor: 'pointer',
    transition: 'background-color 0.2s',
  },
  badge: {
    position: 'absolute' as const,
    top: '-5px',
    right: '-5px',
    backgroundColor: 'var(--status-absent-text)',
    color: 'white',
    fontSize: '0.65rem',
    fontWeight: 700,
    width: '18px',
    height: '18px',
    borderRadius: '50%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    boxShadow: '0 1px 3px rgba(0,0,0,0.2)',
  }
};

export default Topbar;
