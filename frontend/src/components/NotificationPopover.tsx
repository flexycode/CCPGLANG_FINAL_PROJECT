/**
 * NotificationPopover.tsx — Notification Popover (Figma Layer 2)
 * ==============================================================
 * PARADIGM: Functional Programming (FP)
 * 
 * Pixel-accurate reproduction of Figma Notifications panel:
 * - Header: "Notifications" + "Mark all as read"
 * - Card list with title, relative timestamp, and body message
 * - Live unread badge & mark-as-read API integration
 */

import React, { useEffect, useRef } from 'react';

export interface NotificationItem {
  readonly id: number;
  readonly title: string;
  readonly message: string;
  readonly category: string;
  readonly is_read: boolean;
  readonly relative_time: string;
}

interface NotificationPopoverProps {
  readonly notifications: readonly NotificationItem[];
  readonly onClose: () => void;
  readonly onMarkAllAsRead: () => void;
  readonly onMarkAsRead: (id: number) => void;
  readonly onSyncAction?: () => void;
}

export const NotificationPopover: React.FC<NotificationPopoverProps> = ({
  notifications,
  onClose,
  onMarkAllAsRead,
  onMarkAsRead,
  onSyncAction,
}) => {
  const popoverRef = useRef<HTMLDivElement>(null);

  // Close on outside click
  useEffect(() => {
    const handleOutsideClick = (e: MouseEvent) => {
      if (popoverRef.current && !popoverRef.current.contains(e.target as Node)) {
        onClose();
      }
    };
    document.addEventListener('mousedown', handleOutsideClick);
    return () => document.removeEventListener('mousedown', handleOutsideClick);
  }, [onClose]);

  return (
    <div ref={popoverRef} style={styles.container}>
      {/* Popover Header */}
      <div style={styles.header}>
        <h3 style={styles.title}>Notifications</h3>
        <button 
          onClick={onMarkAllAsRead} 
          style={styles.markAllReadBtn}
          type="button"
        >
          Mark all as read
        </button>
      </div>

      {/* Notifications List */}
      <div style={styles.list}>
        {notifications.length === 0 ? (
          <div style={styles.emptyState}>No notifications</div>
        ) : (
          notifications.map((item) => (
            <div 
              key={item.id} 
              style={{
                ...styles.item,
                backgroundColor: item.is_read ? 'transparent' : 'rgba(0, 0, 0, 0.015)',
              }}
              onClick={() => {
                onMarkAsRead(item.id);
                if (item.category === 'system' && onSyncAction) {
                  onSyncAction();
                }
              }}
            >
              <div style={styles.itemHeader}>
                <div style={styles.titleContainer}>
                  <span style={styles.itemTitle}>{item.title}</span>
                </div>
                <span style={styles.itemTime}>{item.relative_time}</span>
              </div>
              <p style={styles.itemMessage}>{item.message}</p>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

const styles = {
  container: {
    position: 'absolute' as const,
    top: 'calc(100% + 12px)',
    right: '0',
    width: '320px',
    backgroundColor: '#FFFFFF',
    borderRadius: '8px',
    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
    border: '1px solid var(--border-color)',
    zIndex: 1000,
    overflow: 'hidden',
    animation: 'fadeIn 0.15s ease-out',
  },
  header: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '1.2rem 1.25rem',
    borderBottom: '1px solid #EBE8E0',
  },
  title: {
    fontSize: '1.25rem',
    fontWeight: 700,
    margin: 0,
    fontFamily: 'var(--font-body)',
    color: '#1A1A1A',
  },
  markAllReadBtn: {
    fontSize: '0.9rem',
    fontWeight: 500,
    color: '#2563EB',
    background: 'none',
    border: 'none',
    cursor: 'pointer',
    padding: 0,
    textDecoration: 'none',
    transition: 'opacity 0.2s',
  },
  list: {
    maxHeight: '357px',
    overflowY: 'auto' as const,
  },
  item: {
    padding: '1.2rem 1.25rem',
    borderBottom: '1px solid #F0ECE4',
    cursor: 'pointer',
    transition: 'background-color 0.15s',
  },
  itemHeader: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: '0.4rem',
  },
  titleContainer: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
  },
  itemTitle: {
    fontSize: '1rem',
    fontWeight: 700,
    color: '#1A1A1A',
  },
  itemTime: {
    fontSize: '0.85rem',
    color: '#8A8A8A',
    whiteSpace: 'nowrap' as const,
  },
  itemMessage: {
    fontSize: '0.95rem',
    color: '#666666',
    lineHeight: 1.5,
    margin: 0,
  },
  emptyState: {
    padding: '2rem',
    textAlign: 'center' as const,
    color: 'var(--text-muted)',
    fontSize: '0.9rem',
  },
};

export default NotificationPopover;
