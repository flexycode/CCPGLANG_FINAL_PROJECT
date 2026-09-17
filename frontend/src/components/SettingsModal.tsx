/**
 * SettingsModal.tsx — Account Settings Dialog (Figma Layer 3)
 * ==========================================================
 * PARADIGM: Functional Programming (FP)
 * 
 * Pixel-accurate reproduction of Figma "Settings" layer:
 * - Header: "Account Settings" with close button (X)
 * - Avatar: Faculty profile image with "Change Avatar" button
 * - Form fields: Full Name, Email Address, Role / Department
 * - System thresholds: Absence Warning, Late Count, Notification toggles
 * - Live update integration with PUT /api/settings
 */

import React, { useState, useEffect } from 'react';
import { X, Check, Save } from 'lucide-react';

export interface UserSettingsData {
  readonly id: number;
  readonly username: string;
  readonly full_name: string;
  readonly email: string;
  readonly role: string;
  readonly department: string;
  readonly avatar_url: string | null;
  readonly absence_threshold: number;
  readonly late_threshold: number;
  readonly email_alerts_enabled: boolean;
}

interface SettingsModalProps {
  readonly isOpen: boolean;
  readonly onClose: () => void;
  readonly onSaved?: (updated: UserSettingsData) => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({
  isOpen,
  onClose,
  onSaved,
}) => {
  const [formData, setFormData] = useState<UserSettingsData>({
    id: 1,
    username: 'Scaluya7',
    full_name: 'Susan S. Caluya',
    email: 'sscaluya@national-u.edu.ph',
    role: 'Faculty',
    department: 'Faculty',
    avatar_url: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&auto=format&fit=crop&q=80',
    absence_threshold: 4,
    late_threshold: 3,
    email_alerts_enabled: true,
  });

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [saveSuccess, setSaveSuccess] = useState<boolean>(false);

  useEffect(() => {
    if (!isOpen) return;

    // Fetch live settings on modal open
    const fetchSettings = async () => {
      try {
        const res = await fetch('http://localhost:8000/api/settings');
        if (res.ok) {
          const data = await res.json();
          setFormData(data);
        }
      } catch (err) {
        console.warn('Could not fetch settings from backend:', err);
      }
    };

    fetchSettings();
  }, [isOpen]);

  if (!isOpen) return null;

  const handleChange = (field: keyof UserSettingsData, value: string | number | boolean) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setSaveSuccess(false);

    try {
      const res = await fetch('http://localhost:8000/api/settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (res.ok) {
        const updated = await res.json();
        setFormData(updated);
        setSaveSuccess(true);
        if (onSaved) onSaved(updated);
        setTimeout(() => setSaveSuccess(false), 3000);
      }
    } catch (err) {
      console.error('Error saving settings:', err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div style={styles.overlay} onClick={onClose}>
      <div style={styles.modalCard} onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div style={styles.header}>
          <h2 style={styles.title}>Account Settings</h2>
          <button 
            onClick={onClose} 
            style={styles.closeBtn}
            type="button"
            aria-label="Close settings"
          >
            <X size={20} />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSave} style={styles.form}>
          {/* Avatar Section */}
          <div style={styles.avatarSection}>
            <div style={styles.avatarWrapper}>
              <img 
                src={formData.avatar_url || "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&auto=format&fit=crop&q=80"} 
                alt="Teacher avatar" 
                style={styles.avatarImg}
              />
            </div>
            <button 
              type="button" 
              style={styles.changeAvatarBtn}
              onClick={() => {
                const newUrl = prompt("Enter new avatar image URL:", formData.avatar_url || "");
                if (newUrl) handleChange('avatar_url', newUrl);
              }}
            >
              Change Avatar
            </button>
          </div>

          {/* Full Name */}
          <div style={styles.fieldGroup}>
            <label style={styles.label}>Full Name</label>
            <input 
              type="text" 
              style={styles.input}
              value={formData.full_name}
              onChange={(e) => handleChange('full_name', e.target.value)}
              required
            />
          </div>

          {/* Email Address */}
          <div style={styles.fieldGroup}>
            <label style={styles.label}>Email Address</label>
            <input 
              type="email" 
              style={styles.input}
              value={formData.email}
              onChange={(e) => handleChange('email', e.target.value)}
              required
            />
          </div>

          {/* Role / Department */}
          <div style={styles.fieldGroup}>
            <label style={styles.label}>Role / Department</label>
            <input 
              type="text" 
              style={styles.input}
              value={formData.role || formData.department}
              onChange={(e) => {
                handleChange('role', e.target.value);
                handleChange('department', e.target.value);
              }}
              required
            />
          </div>

          {/* Attendance Rules & Thresholds */}
          <div style={styles.thresholdsGrid}>
            <div style={styles.fieldGroup}>
              <label style={styles.label}>Absence Alert Limit</label>
              <input 
                type="number" 
                min="1" 
                max="10"
                style={styles.input}
                value={formData.absence_threshold}
                onChange={(e) => handleChange('absence_threshold', parseInt(e.target.value) || 4)}
              />
            </div>
            <div style={styles.fieldGroup}>
              <label style={styles.label}>Lates = 1 Absence</label>
              <input 
                type="number" 
                min="1" 
                max="10"
                style={styles.input}
                value={formData.late_threshold}
                onChange={(e) => handleChange('late_threshold', parseInt(e.target.value) || 3)}
              />
            </div>
          </div>

          {/* Feedback & Actions */}
          {saveSuccess && (
            <div style={styles.successNotice}>
              <Check size={16} color="#16A34A" />
              <span>Settings updated successfully!</span>
            </div>
          )}

          <div style={styles.actionRow}>
            <button 
              type="button" 
              onClick={onClose} 
              style={styles.cancelBtn}
            >
              Cancel
            </button>
            <button 
              type="submit" 
              disabled={isLoading}
              style={styles.saveBtn}
            >
              <Save size={16} />
              {isLoading ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

const styles = {
  overlay: {
    position: 'fixed' as const,
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.45)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 2000,
    backdropFilter: 'blur(2px)',
  },
  modalCard: {
    backgroundColor: '#FFFFFF',
    width: '100%',
    maxWidth: '480px',
    borderRadius: '20px',
    boxShadow: '0 20px 40px rgba(0,0,0,0.15)',
    border: '1px solid var(--border-color)',
    padding: '2rem',
    position: 'relative' as const,
    animation: 'fadeIn 0.2s ease-out',
  },
  header: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: '1.5rem',
  },
  title: {
    fontSize: '1.4rem',
    fontWeight: 700,
    fontFamily: 'var(--font-heading)',
    margin: 0,
    color: '#1E1E1E',
  },
  closeBtn: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: '#71717A',
    background: 'none',
    border: 'none',
    cursor: 'pointer',
    padding: '0.25rem',
    borderRadius: '6px',
    transition: 'color 0.2s',
  },
  form: {
    display: 'flex',
    flexDirection: 'column' as const,
    gap: '1.25rem',
  },
  avatarSection: {
    display: 'flex',
    alignItems: 'center',
    gap: '1.25rem',
    marginBottom: '0.5rem',
  },
  avatarWrapper: {
    width: '64px',
    height: '64px',
    borderRadius: '50%',
    overflow: 'hidden',
    backgroundColor: '#EAE3D9',
    border: '2px solid #E0DCD3',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarImg: {
    width: '100%',
    height: '100%',
    objectFit: 'cover' as const,
  },
  changeAvatarBtn: {
    padding: '0.55rem 1rem',
    fontSize: '0.85rem',
    fontWeight: 500,
    color: '#2C2C2C',
    backgroundColor: '#F5F3EF',
    border: '1px solid #D6D2C8',
    borderRadius: '8px',
    cursor: 'pointer',
    transition: 'background-color 0.2s',
  },
  fieldGroup: {
    display: 'flex',
    flexDirection: 'column' as const,
    gap: '0.4rem',
  },
  label: {
    fontSize: '0.86rem',
    fontWeight: 600,
    color: '#333333',
  },
  input: {
    padding: '0.75rem 1rem',
    borderRadius: '8px',
    border: '1px solid #D8D4CA',
    backgroundColor: '#FBF9F6',
    fontSize: '0.95rem',
    color: '#1E1E1E',
    fontFamily: 'var(--font-body)',
    outline: 'none',
    transition: 'border-color 0.2s, box-shadow 0.2s',
  },
  thresholdsGrid: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '1rem',
  },
  successNotice: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
    padding: '0.65rem 1rem',
    borderRadius: '8px',
    backgroundColor: '#F0FDF4',
    border: '1px solid #BBF7D0',
    color: '#15803D',
    fontSize: '0.85rem',
  },
  actionRow: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-end',
    gap: '0.75rem',
    marginTop: '0.5rem',
  },
  cancelBtn: {
    padding: '0.65rem 1.25rem',
    borderRadius: '8px',
    border: '1px solid #D6D2C8',
    backgroundColor: 'transparent',
    color: '#555555',
    fontWeight: 500,
    fontSize: '0.9rem',
    cursor: 'pointer',
  },
  saveBtn: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '0.5rem',
    padding: '0.65rem 1.4rem',
    borderRadius: '8px',
    border: 'none',
    backgroundColor: '#1E1E1E',
    color: '#FFFFFF',
    fontWeight: 500,
    fontSize: '0.9rem',
    cursor: 'pointer',
    transition: 'background-color 0.2s',
  },
};

export default SettingsModal;
