/**
 * Settings.tsx — Account Settings Page (Figma Layer 3)
 * ====================================================
 * PARADIGM: Functional Programming (FP)
 * 
 * Standalone page view for Account Settings matching the Figma
 * design specifications.
 */

import React, { useState, useEffect } from 'react';
import { Check, Save } from 'lucide-react';
import { UserSettingsData } from '../components/SettingsModal';

const Settings: React.FC = () => {
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
    const fetchSettings = async () => {
      try {
        const res = await fetch('http://localhost:8000/api/settings');
        if (res.ok) {
          const data = await res.json();
          setFormData(data);
        }
      } catch (err) {
        console.warn('Could not fetch settings:', err);
      }
    };
    fetchSettings();
  }, []);

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
        setTimeout(() => setSaveSuccess(false), 3000);
      }
    } catch (err) {
      console.error('Error saving settings:', err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.headerArea}>
        <h1 style={styles.pageTitle}>Settings & Institutional Configuration</h1>
        <p style={styles.pageSubtitle}>Manage your faculty profile and attendance alert policies.</p>
      </div>

      <div style={styles.card}>
        <h2 style={styles.cardTitle}>Account Settings</h2>

        <form onSubmit={handleSave} style={styles.form}>
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

          {saveSuccess && (
            <div style={styles.successNotice}>
              <Check size={16} color="#16A34A" />
              <span>Settings updated successfully!</span>
            </div>
          )}

          <div style={styles.actionRow}>
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
  container: {
    padding: '2.5rem',
    maxWidth: '650px',
  },
  headerArea: {
    marginBottom: '2rem',
  },
  pageTitle: {
    fontSize: '2rem',
    fontWeight: 700,
    margin: 0,
    color: '#1E1E1E',
  },
  pageSubtitle: {
    color: 'var(--text-muted)',
    fontSize: '0.95rem',
    marginTop: '0.4rem',
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: '20px',
    padding: '2.5rem',
    border: '1px solid var(--border-color)',
    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.04)',
  },
  cardTitle: {
    fontSize: '1.35rem',
    fontWeight: 700,
    marginBottom: '1.5rem',
    color: '#1E1E1E',
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
    marginTop: '0.5rem',
  },
  saveBtn: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '0.5rem',
    padding: '0.75rem 1.6rem',
    borderRadius: '8px',
    border: 'none',
    backgroundColor: '#1E1E1E',
    color: '#FFFFFF',
    fontWeight: 500,
    fontSize: '0.95rem',
    cursor: 'pointer',
    transition: 'background-color 0.2s',
  },
};

export default Settings;
