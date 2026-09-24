/**
 * Topbar.tsx — Top Navigation Bar with Real-Time Clock, Notifications & Settings
 * ==============================================================================
 * PARADIGM: Functional Programming (FP)
 * 
 * Features:
 * - Real-time Philippine clock (WorldTimeAPI/Asia/Manila) with live ticking seconds
 * - Figma-aligned search bar (pill-shaped, left-aligned)
 * - Date + clock + active period display (right-aligned, stacked)
 * - Live notification badge and popover (Figma Layer 2)
 * - Account settings modal launcher (Figma Layer 3)
 * 
 * Layout (matching Figma node 2010-3598):
 * ┌──────────────────────────────────────────────────────────────────────────┐
 * │  🔍 Quick search a student or class   │  Thursday, September 17  🔔  ⚙️ │
 * │  [pill-shaped search input]            │  3:45:22 PM  PHT              │
 * │                                        │  3:00 PM - 5:00 PM            │
 * └──────────────────────────────────────────────────────────────────────────┘
 */

import React, { useState, useEffect, useCallback } from 'react';
import { Bell, Settings, Search, Clock } from 'lucide-react';
import { useServerTime } from '../utils/useServerTime';
import NotificationPopover, { NotificationItem } from './NotificationPopover';
import SettingsModal, { UserSettingsData } from './SettingsModal';

const Topbar: React.FC = () => {
  const { formattedDate, formattedTime, timezone, isLive } = useServerTime();
  
  // Search state
  const [isSearchFocused, setIsSearchFocused] = useState<boolean>(false);

  // Notification state
  const [notifications, setNotifications] = useState<readonly NotificationItem[]>([]);
  const [unreadCount, setUnreadCount] = useState<number>(0);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState<boolean>(false);
  
  // Settings modal state
  const [isSettingsOpen, setIsSettingsOpen] = useState<boolean>(false);

  // Fetch notifications from backend
  const fetchNotifications = useCallback(async () => {
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:8000'}/api/notifications`);
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
      const res = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:8000'}/api/notifications/mark-all-read`, {
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
      const res = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:8000'}/api/notifications/${id}/read`, {
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
        {/* Search Bar — Figma: pill-shaped, left-aligned, ~480px */}
        <div style={styles.searchContainer}>
          <Search size={18} style={styles.searchIcon} />
          <input 
            type="text" 
            placeholder="Quick search a student or class" 
            className="topbar-search-input"
            style={{
              ...styles.searchInput,
              backgroundColor: isSearchFocused ? 'var(--bg-white)' : 'var(--bg-secondary)',
              borderColor: isSearchFocused ? 'var(--brand-primary)' : 'var(--border-color)',
              boxShadow: isSearchFocused ? '0 0 0 3px rgba(30, 30, 30, 0.08)' : 'none',
            }}
            onFocus={() => setIsSearchFocused(true)}
            onBlur={() => setIsSearchFocused(false)}
          />
        </div>
        
        {/* Right Section: DateTime + Actions */}
        <div style={styles.actions}>
          {/* Synchronized Real-Time Philippine Clock (WorldTimeAPI) */}
          <div style={styles.datetime}>
            <span style={styles.date}>{formattedDate}</span>
            <div style={styles.clockRow}>
              <Clock size={14} style={styles.clockIcon} />
              <span style={styles.time}>{formattedTime}</span>
              <span style={styles.timezoneBadge}>{timezone}</span>
              {isLive && <span style={styles.liveDot} title="Synced with WorldTimeAPI" />}
            </div>
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
    padding: '1rem 2.5rem',
    backgroundColor: 'var(--bg-primary)',
    borderBottom: '1px solid var(--border-color)',
    position: 'relative' as const,
    zIndex: 50,
    minHeight: '72px',
  },
  searchContainer: {
    position: 'relative' as const,
    width: '480px',
    maxWidth: '45%',
  },
  searchIcon: {
    position: 'absolute' as const,
    left: '1rem',
    top: '50%',
    transform: 'translateY(-50%)',
    color: 'var(--text-muted)',
    pointerEvents: 'none' as const,
  },
  searchInput: {
    width: '100%',
    padding: '0.65rem 1rem 0.65rem 2.75rem',
    borderRadius: '24px',
    border: '1px solid var(--border-color)',
    backgroundColor: 'var(--bg-secondary)',
    fontFamily: 'var(--font-body)',
    fontSize: '0.875rem',
    color: 'var(--text-primary)',
    outline: 'none',
    transition: 'all 0.25s ease',
  },
  actions: {
    display: 'flex',
    alignItems: 'center',
    gap: '1.25rem',
  },
  datetime: {
    display: 'flex',
    flexDirection: 'column' as const,
    alignItems: 'flex-end',
    marginRight: '0.5rem',
    gap: '2px',
  },
  date: {
    fontWeight: 600,
    fontSize: '0.875rem',
    color: 'var(--text-primary)',
    lineHeight: 1.3,
  },
  clockRow: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.35rem',
  },
  clockIcon: {
    color: 'var(--text-muted)',
    opacity: 0.7,
  },
  time: {
    fontSize: '0.85rem',
    fontWeight: 500,
    color: 'var(--text-secondary)',
    fontFamily: "'Inter', monospace",
    fontVariantNumeric: 'tabular-nums',
    letterSpacing: '0.01em',
    lineHeight: 1.3,
  },
  timezoneBadge: {
    fontSize: '0.6rem',
    fontWeight: 600,
    color: 'var(--status-present-text)',
    backgroundColor: 'var(--status-present-bg)',
    padding: '1px 5px',
    borderRadius: '4px',
    letterSpacing: '0.03em',
    lineHeight: 1.4,
  },
  liveDot: {
    width: '6px',
    height: '6px',
    borderRadius: '50%',
    backgroundColor: 'var(--status-present-text)',
    display: 'inline-block',
    animation: 'pulse 2s ease-in-out infinite',
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
    transition: 'background-color 0.2s, box-shadow 0.2s',
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
