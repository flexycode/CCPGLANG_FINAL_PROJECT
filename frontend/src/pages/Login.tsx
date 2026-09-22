/**
 * Login.tsx — Sign In Page (Figma Layer 1: User Login)
 * ====================================================
 * PARADIGM: Functional Programming (FP)
 * 
 * Pixel-accurate reproduction of the Figma User Login screen:
 * - Dual-pane layout: Warm sand beige left banner with Checkmate branding,
 *   geometric contour line art, and bottom copyright.
 * - Off-white right pane with "Sign In" header, welcome copy, username input
 *   with User icon, password input with Lock icon and show/hide toggle,
 *   "Forgot Password?" link, and dark pill submit button with LogIn icon.
 * - Connected to POST /api/auth/login with functional state management.
 */

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { User, Lock, Eye, EyeOff, LogIn, AlertCircle } from 'lucide-react';
import { saveSession } from '../utils/auth';

const Login: React.FC = () => {
  const navigate = useNavigate();

  // Functional state hooks
  const [username, setUsername] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMessage(null);

    try {
      const response = await fetch('http://localhost:8000/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || 'Sign in failed. Please verify your credentials.');
      }

      const data = await response.json();
      saveSession(data);
      navigate('/dashboard');
    } catch (err: unknown) {
      if (err instanceof Error) {
        setErrorMessage(err.message);
      } else {
        setErrorMessage('An unexpected error occurred while signing in.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div style={styles.pageContainer} className="login-page-enter">
      {/* ─── Left Brand Column (Figma Sand / Beige Banner) ─────────── */}
      <div style={styles.leftColumn}>
        {/* Geometric Contour Line Art (Figma aesthetic) */}
        <div style={styles.contourBackground}>
          <svg 
            viewBox="0 0 500 600" 
            fill="none" 
            xmlns="http://www.w3.org/2000/svg"
            style={styles.contourSvg}
          >
            <circle cx="250" cy="350" r="140" stroke="#D3C9BC" strokeWidth="1" opacity="0.55" />
            <circle cx="250" cy="350" r="220" stroke="#D3C9BC" strokeWidth="0.9" opacity="0.40" />
            <circle cx="250" cy="350" r="310" stroke="#D3C9BC" strokeWidth="0.7" opacity="0.30" />
            <circle cx="250" cy="350" r="400" stroke="#D3C9BC" strokeWidth="0.5" opacity="0.20" />
          </svg>
        </div>

        {/* Brand Center Content */}
        <div style={styles.brandContent}>
          <div style={styles.logoRow}>
            <div style={styles.logoSquare}>
              <div style={styles.logoDotGrid} />
            </div>
            <div style={styles.brandNames}>
              <span style={styles.brandTitle}>Checkmate</span>
              <span style={styles.brandSubtitle}>ATTENDANCE MONITORING</span>
            </div>
          </div>
        </div>

        {/* Left Column Bottom Copyright */}
        <div style={styles.leftFooter}>
          <p style={styles.copyrightText}>© 2026 Checkmate - Attendance Monitoring</p>
        </div>
      </div>

      {/* ─── Right Sign In Form Column ─────────────────────────────── */}
      <div style={styles.rightColumn}>
        <div style={styles.formContainer}>
          <div style={styles.formHeader}>
            <h1 style={styles.heading}>Sign In</h1>
            <p style={styles.subheading}>
              Welcome back! Sign in to access your attendance monitoring platform.
            </p>
          </div>

          {/* Error Banner */}
          {errorMessage && (
            <div style={styles.errorAlert}>
              <AlertCircle size={18} color="#DC2626" style={{ flexShrink: 0 }} />
              <span style={styles.errorText}>{errorMessage}</span>
            </div>
          )}

          <form onSubmit={handleLogin} style={styles.form}>
            {/* Username Input */}
            <div style={styles.inputGroup}>
              <label style={styles.label}>Username</label>
              <div style={styles.inputWrapper}>
                <User size={18} style={styles.inputLeadingIcon} />
                <input 
                  type="text" 
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="Ex. Scaluya7" 
                  style={styles.input}
                  required 
                />
              </div>
            </div>

            {/* Password Input */}
            <div style={styles.inputGroup}>
              <label style={styles.label}>Password</label>
              <div style={styles.inputWrapper}>
                <Lock size={18} style={styles.inputLeadingIcon} />
                <input 
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password" 
                  style={styles.input}
                  required 
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((prev) => !prev)}
                  style={styles.eyeButton}
                  aria-label="Toggle password visibility"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            {/* Forgot Password */}
            <div style={styles.optionsRow}>
              <a 
                href="#forgot" 
                style={styles.forgotLink}
                onClick={(e) => {
                  e.preventDefault();
                  alert("Password recovery instructions have been sent to your registered institutional email.");
                }}
              >
                Forgot Password?
              </a>
            </div>

            {/* Submit Button */}
            <button 
              type="submit" 
              disabled={isLoading}
              style={{
                ...styles.submitButton,
                opacity: isLoading ? 0.75 : 1,
              }}
            >
              <LogIn size={18} />
              <span>{isLoading ? 'Signing in...' : 'Sign In'}</span>
            </button>
          </form>

          {/* Demo helper hint */}
          <div style={styles.demoHintBox}>
            <span style={styles.demoHintText}>
              Academic Demo Faculty: <strong>Scaluya7</strong> • Password: <strong>password123</strong>
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

const styles = {
  pageContainer: {
    display: 'flex',
    minHeight: '100vh',
    width: '100%',
    backgroundColor: '#FAF8F5',
    fontFamily: 'var(--font-body)',
  },
  leftColumn: {
    flex: '0 0 38%',
    backgroundColor: '#EAE3D9',
    position: 'relative' as const,
    display: 'flex',
    flexDirection: 'column' as const,
    justifyContent: 'space-between',
    padding: '3rem',
    overflow: 'hidden',
    borderRight: '1px solid #DFD7CB',
  },
  contourBackground: {
    position: 'absolute' as const,
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    pointerEvents: 'none' as const,
    overflow: 'hidden',
  },
  contourSvg: {
    width: '140%',
    height: '140%',
    position: 'absolute' as const,
    left: '-20%',
    top: '10%',
  },
  brandContent: {
    position: 'relative' as const,
    zIndex: 2,
    marginTop: 'auto',
    marginBottom: 'auto',
  },
  logoRow: {
    display: 'flex',
    alignItems: 'center',
    gap: '1rem',
  },
  logoSquare: {
    width: '42px',
    height: '42px',
    backgroundColor: '#6B6864',
    borderRadius: '8px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoDotGrid: {
    width: '18px',
    height: '18px',
    border: '2px solid #EAE3D9',
    borderRadius: '3px',
    opacity: 0.85,
  },
  brandNames: {
    display: 'flex',
    flexDirection: 'column' as const,
  },
  brandTitle: {
    fontSize: '1.65rem',
    fontWeight: 700,
    color: '#1E1E1E',
    letterSpacing: '-0.02em',
    lineHeight: 1.1,
  },
  brandSubtitle: {
    fontSize: '0.68rem',
    fontWeight: 600,
    letterSpacing: '0.14em',
    color: '#6E6B65',
    marginTop: '0.2rem',
  },
  leftFooter: {
    position: 'relative' as const,
    zIndex: 2,
  },
  copyrightText: {
    fontSize: '0.8rem',
    color: '#8A857D',
    margin: 0,
  },
  rightColumn: {
    flex: '1',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '3rem',
    backgroundColor: '#FAF8F5',
  },
  formContainer: {
    width: '100%',
    maxWidth: '430px',
  },
  formHeader: {
    marginBottom: '2rem',
  },
  heading: {
    fontSize: '2.5rem',
    fontWeight: 700,
    color: '#1E1E1E',
    fontFamily: 'var(--font-heading)',
    margin: '0 0 0.5rem 0',
  },
  subheading: {
    fontSize: '0.92rem',
    color: '#6B6964',
    lineHeight: 1.5,
    margin: 0,
  },
  errorAlert: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.75rem',
    padding: '0.85rem 1rem',
    borderRadius: '10px',
    backgroundColor: '#FEF2F2',
    border: '1px solid #FCA5A5',
    marginBottom: '1.5rem',
  },
  errorText: {
    fontSize: '0.85rem',
    color: '#B91C1C',
    lineHeight: 1.4,
  },
  form: {
    display: 'flex',
    flexDirection: 'column' as const,
    gap: '1.35rem',
  },
  inputGroup: {
    display: 'flex',
    flexDirection: 'column' as const,
    gap: '0.45rem',
  },
  label: {
    fontSize: '0.88rem',
    fontWeight: 600,
    color: '#2A2A2A',
  },
  inputWrapper: {
    position: 'relative' as const,
    display: 'flex',
    alignItems: 'center',
  },
  inputLeadingIcon: {
    position: 'absolute' as const,
    left: '1rem',
    color: '#8C8984',
    pointerEvents: 'none' as const,
  },
  input: {
    width: '100%',
    padding: '0.8rem 1rem 0.8rem 2.75rem',
    borderRadius: '10px',
    border: '1px solid #DCD6CC',
    backgroundColor: '#FFFFFF',
    fontSize: '0.95rem',
    color: '#1E1E1E',
    outline: 'none',
    transition: 'border-color 0.2s ease, box-shadow 0.2s ease',
    fontFamily: 'var(--font-body)',
  },
  eyeButton: {
    position: 'absolute' as const,
    right: '0.85rem',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: '#8C8984',
    background: 'none',
    border: 'none',
    cursor: 'pointer',
    padding: '0.25rem',
  },
  optionsRow: {
    display: 'flex',
    justifyContent: 'flex-end',
    marginTop: '-0.25rem',
  },
  forgotLink: {
    fontSize: '0.82rem',
    fontWeight: 500,
    color: '#6E6B65',
    textDecoration: 'none',
    transition: 'color 0.2s',
  },
  submitButton: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '0.6rem',
    width: '100%',
    padding: '0.85rem 1.5rem',
    borderRadius: '10px',
    backgroundColor: '#1E1E1E',
    color: '#FFFFFF',
    fontSize: '0.95rem',
    fontWeight: 600,
    border: 'none',
    cursor: 'pointer',
    transition: 'background-color 0.2s ease, transform 0.1s ease',
    marginTop: '0.5rem',
  },
  demoHintBox: {
    marginTop: '2rem',
    padding: '0.75rem 1rem',
    backgroundColor: '#F3EFE9',
    borderRadius: '8px',
    textAlign: 'center' as const,
    border: '1px solid #E2DCD2',
  },
  demoHintText: {
    fontSize: '0.78rem',
    color: '#6B6862',
  },
};

export default Login;
