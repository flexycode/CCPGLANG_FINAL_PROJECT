/**
 * LandingPage.tsx — Cinematic Landing Page
 * ========================================
 * PARADIGM: Functional Programming (FP)
 *
 * Full-screen landing page with:
 * - Looping video background (or animated gradient fallback)
 * - Checkmate branding with contour line art
 * - "Get Started" CTA button → navigates to /login
 * - Smooth staggered fade-in animations
 *
 * HOW TO ADD YOUR VIDEO:
 * 1. Place your video file at: frontend/public/landing-video.mp4
 * 2. Set HAS_VIDEO to true below.
 * 3. The video will auto-play, loop, and be muted.
 */

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';

// ─── Configuration ──────────────────────────────────────────────
// Set to true once you place your video at public/landing-video.mp4
const HAS_VIDEO = false;
const VIDEO_SRC = '/landing-video.mp4';

const LandingPage: React.FC = () => {
  const navigate = useNavigate();
  const [videoError, setVideoError] = useState(false);

  const showVideo = HAS_VIDEO && !videoError;

  return (
    <div className="landing-page">
      {/* ─── Background Layer ──────────────────────────────────── */}
      {showVideo ? (
        <video
          className="landing-video-bg"
          src={VIDEO_SRC}
          autoPlay
          loop
          muted
          playsInline
          onError={() => setVideoError(true)}
        />
      ) : (
        <div className="landing-gradient-bg" />
      )}

      {/* ─── Dark Overlay ──────────────────────────────────────── */}
      <div className="landing-overlay" />

      {/* ─── Floating Contour Art ──────────────────────────────── */}
      <svg
        className="landing-contour-art"
        viewBox="0 0 1440 900"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        preserveAspectRatio="xMidYMid slice"
      >
        <circle cx="720" cy="450" r="200" stroke="rgba(255,255,255,0.06)" strokeWidth="1.2" />
        <circle cx="720" cy="450" r="320" stroke="rgba(255,255,255,0.04)" strokeWidth="1" />
        <circle cx="720" cy="450" r="450" stroke="rgba(255,255,255,0.03)" strokeWidth="0.8" />
        <circle cx="720" cy="450" r="600" stroke="rgba(255,255,255,0.02)" strokeWidth="0.6" />
        {/* Decorative diagonal lines */}
        <line x1="0" y1="0" x2="400" y2="900" stroke="rgba(255,255,255,0.02)" strokeWidth="0.5" />
        <line x1="1440" y1="0" x2="1040" y2="900" stroke="rgba(255,255,255,0.02)" strokeWidth="0.5" />
      </svg>

      {/* ─── Center Content ────────────────────────────────────── */}
      <div className="landing-content">
        {/* Logo + Brand */}
        <div className="landing-logo-row">
          <div className="landing-logo-square">
            <div className="landing-logo-inner" />
          </div>
          <div className="landing-brand-text">
            <span className="landing-brand-title">Checkmate</span>
            <span className="landing-brand-subtitle">ATTENDANCE MONITORING</span>
          </div>
        </div>

        {/* Tagline */}
        <p className="landing-tagline">
          Streamline your classroom attendance tracking with real-time insights and effortless management.
        </p>

        {/* CTA Buttons */}
        <div className="landing-cta-group">
          <button
            className="landing-cta-btn"
            onClick={() => navigate('/login')}
            id="landing-get-started"
          >
            Get Started
            <ArrowRight size={18} />
          </button>
          <button
            className="landing-signin-link"
            onClick={() => navigate('/login')}
          >
            Already have an account? Sign In
          </button>
        </div>
      </div>

      {/* ─── Footer ────────────────────────────────────────────── */}
      <div className="landing-footer">
        <p className="landing-footer-text">© 2026 Checkmate · Attendance Monitoring</p>
      </div>
    </div>
  );
};

export default LandingPage;
