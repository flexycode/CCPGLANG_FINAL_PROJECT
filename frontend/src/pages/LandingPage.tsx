import { useState, useRef, useEffect } from 'react';
import { LogIn, BarChart3, Clock, Users, ChevronRight, ChevronDown, ChevronUp, ExternalLink } from 'lucide-react';
import { useTheme } from '../utils/theme';
import AnimatedBackground from '../components/AnimatedBackground';
import DarkModeToggle from '../components/DarkModeToggle';
import ChessGame from '../components/ChessGame';
import logo from '../assets/checkmate_logo.jpg';

/**
 * LandingPage — The first screen users see.
 * 
 * Features:
 * - Animated chess-themed background (canvas)
 * - Hero section with branding and CTAs
 * - Feature cards showcasing system capabilities
 * - Accessible scrollbar & interactive floating scroll controls for users without a mouse wheel
 * - Chess mini-game accessible via CTA button
 * - Footer with team credits
 */

interface LandingPageProps {
  onGetStarted: () => void;
}

const FEATURES = [
  {
    icon: Clock,
    title: 'Real-Time Tracking',
    description: 'Monitor student attendance with precise time-in and time-out logging for every class session.',
  },
  {
    icon: BarChart3,
    title: 'Smart Analytics',
    description: 'Gain insights with attendance percentages, absence streaks, and trend analysis across all classes.',
  },
  {
    icon: Users,
    title: 'Student Management',
    description: 'Manage student records, enrollment status, and attendance history from a unified dashboard.',
  },
];

const TEAM_MEMBERS = [
  'Jay Arre Talosig',
  'James Adrian Castro',
  'Marco Polo Cunanan',
  'Rinoah Dela Rama',
  'Jannah Cleine Glodo',
  'Jersey Mae Marisga',
  'Jed Nathan Poserio',
];

const SECTIONS = [
  { id: 'hero', label: 'Top' },
  { id: 'features', label: 'Features' },
  { id: 'paradigms', label: 'Paradigms' },
  { id: 'footer', label: 'Team' },
];

export default function LandingPage({ onGetStarted }: LandingPageProps) {
  const { isDark } = useTheme();
  const [showChess, setShowChess] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const scrollTrackRef = useRef<HTMLDivElement>(null);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [isDraggingThumb, setIsDraggingThumb] = useState(false);
  const [activeSection, setActiveSection] = useState<'hero' | 'features' | 'paradigms' | 'footer'>('hero');

  const handleScroll = () => {
    const el = containerRef.current;
    if (!el) return;
    const totalHeight = el.scrollHeight - el.clientHeight;
    if (totalHeight > 0) {
      setScrollProgress(Math.min(100, Math.max(0, (el.scrollTop / totalHeight) * 100)));
    }

    const scrollPos = el.scrollTop + 250;
    const featuresEl = document.getElementById('features');
    const paradigmsEl = document.getElementById('paradigms');
    const footerEl = document.getElementById('footer');

    if (footerEl && el.scrollTop + el.clientHeight >= el.scrollHeight - 60) {
      setActiveSection('footer');
    } else if (paradigmsEl && scrollPos >= paradigmsEl.offsetTop) {
      setActiveSection('paradigms');
    } else if (featuresEl && scrollPos >= featuresEl.offsetTop) {
      setActiveSection('features');
    } else {
      setActiveSection('hero');
    }
  };

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    el.addEventListener('scroll', handleScroll, { passive: true });
    return () => el.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToSection = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const scrollByAmount = (delta: number) => {
    if (containerRef.current) {
      containerRef.current.scrollBy({ top: delta, behavior: 'smooth' });
    }
  };

  const handleTrackPointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    const track = scrollTrackRef.current;
    const el = containerRef.current;
    if (!track || !el) return;

    e.currentTarget.setPointerCapture(e.pointerId);
    setIsDraggingThumb(true);

    const rect = track.getBoundingClientRect();
    const offsetY = Math.max(0, Math.min(rect.height, e.clientY - rect.top));
    const ratio = offsetY / rect.height;
    const maxScroll = el.scrollHeight - el.clientHeight;
    el.scrollTop = ratio * maxScroll;
  };

  const handleTrackPointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!isDraggingThumb) return;
    const track = scrollTrackRef.current;
    const el = containerRef.current;
    if (!track || !el) return;

    const rect = track.getBoundingClientRect();
    const offsetY = Math.max(0, Math.min(rect.height, e.clientY - rect.top));
    const ratio = offsetY / rect.height;
    const maxScroll = el.scrollHeight - el.clientHeight;
    el.scrollTop = ratio * maxScroll;
  };

  const handleTrackPointerUp = (e: React.PointerEvent<HTMLDivElement>) => {
    setIsDraggingThumb(false);
    try {
      e.currentTarget.releasePointerCapture(e.pointerId);
    } catch {}
  };

  return (
    <div
      id="landing-container"
      ref={containerRef}
      className="relative h-screen w-full overflow-y-auto overflow-x-hidden scroll-smooth landing-scrollbar"
    >
      {/* Top Scroll Progress Indicator */}
      <div className="fixed top-0 left-0 right-0 h-1 z-50 pointer-events-none bg-black/5 dark:bg-white/5">
        <div
          className="h-full bg-gradient-to-r from-amber-500 via-purple-500 to-blue-500 transition-all duration-100 ease-out"
          style={{ width: `${scrollProgress}%` }}
        />
      </div>

      {/* Floating On-Screen Scroll Controller & Alternative Scrollbar (for mice without scroll wheel) */}
      <div
        className="fixed right-3 md:right-5 top-1/2 -translate-y-1/2 z-40 flex flex-col items-center gap-2 p-2 rounded-2xl border shadow-2xl backdrop-blur-md transition-all select-none bg-white/90 dark:bg-[#151D2A]/90 border-gray-200/90 dark:border-white/10"
        title="Scroll Controls & Scrollbar"
      >
        {/* Scroll Up Button */}
        <button
          onClick={() => scrollByAmount(-450)}
          className={`p-1.5 rounded-xl transition-colors cursor-pointer ${
            isDark ? 'text-gray-400 hover:text-white hover:bg-white/10' : 'text-gray-600 hover:text-gray-900 hover:bg-black/5'
          }`}
          title="Scroll Up"
          aria-label="Scroll Up"
        >
          <ChevronUp size={16} />
        </button>

        {/* Custom Interactive Scrollbar Track & Thumb */}
        <div
          ref={scrollTrackRef}
          onPointerDown={handleTrackPointerDown}
          onPointerMove={handleTrackPointerMove}
          onPointerUp={handleTrackPointerUp}
          onPointerCancel={handleTrackPointerUp}
          className="w-3.5 h-28 rounded-full relative cursor-pointer select-none bg-black/10 dark:bg-white/10 hover:bg-black/15 dark:hover:bg-white/15 transition-colors touch-none group"
          title={`Scrollbar (${Math.round(scrollProgress)}%) — Click or drag to scroll`}
          aria-label="On-Screen Scrollbar Track"
        >
          {/* Draggable Thumb */}
          <div
            className={`w-full h-6 rounded-full transition-transform duration-75 shadow-xs cursor-grab active:cursor-grabbing ${
              isDraggingThumb
                ? 'bg-amber-500 scale-105 shadow-md ring-2 ring-amber-400/50'
                : 'bg-gray-400 dark:bg-gray-300 hover:bg-amber-500 dark:hover:bg-amber-400'
            }`}
            style={{
              transform: `translateY(${(scrollProgress / 100) * (112 - 24)}px)`,
            }}
          />

          {/* Floating Percent Tooltip */}
          <div className="absolute right-6 top-1/2 -translate-y-1/2 px-2 py-0.5 rounded-md text-[10px] font-bold tracking-wide uppercase opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity whitespace-nowrap shadow-md bg-gray-900 text-white dark:bg-white dark:text-gray-900">
            {Math.round(scrollProgress)}%
          </div>
        </div>

        {/* Section Jump Dots */}
        <div className="flex flex-col items-center gap-2 py-1 border-t border-b border-black/5 dark:border-white/5 my-0.5">
          {SECTIONS.map((sec) => {
            const isActive = activeSection === sec.id;
            return (
              <button
                key={sec.id}
                onClick={() => scrollToSection(sec.id)}
                className="group relative flex items-center justify-center p-1 cursor-pointer"
                title={`Jump to ${sec.label}`}
                aria-label={`Jump to ${sec.label}`}
              >
                <span
                  className={`block rounded-full transition-all duration-200 ${
                    isActive
                      ? 'w-2.5 h-2.5 bg-amber-500 ring-4 ring-amber-500/20 shadow-xs'
                      : isDark
                      ? 'w-1.5 h-1.5 bg-gray-500 group-hover:bg-gray-300'
                      : 'w-1.5 h-1.5 bg-gray-400 group-hover:bg-gray-700'
                  }`}
                />
                <span className="absolute right-7 px-2 py-1 rounded-md text-[10px] font-semibold tracking-wide uppercase opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity whitespace-nowrap shadow-md bg-gray-900 text-white dark:bg-white dark:text-gray-900">
                  {sec.label}
                </span>
              </button>
            );
          })}
        </div>

        {/* Scroll Down Button */}
        <button
          onClick={() => scrollByAmount(450)}
          className={`p-1.5 rounded-xl transition-colors cursor-pointer ${
            isDark ? 'text-gray-400 hover:text-white hover:bg-white/10' : 'text-gray-600 hover:text-gray-900 hover:bg-black/5'
          }`}
          title="Scroll Down"
          aria-label="Scroll Down"
        >
          <ChevronDown size={16} />
        </button>
      </div>

      {/* Animated Background */}
      <AnimatedBackground />

      {/* Content Layer */}
      <div className="relative z-10 flex flex-col min-h-screen">
        {/* Navigation */}
        <nav className="flex items-center justify-between px-4 sm:px-6 md:px-12 py-4 sm:py-5">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl overflow-hidden shadow-sm">
              <img src={logo} alt="Checkmate Logo" className="w-full h-full object-cover" />
            </div>
            <div>
              <span className={`text-lg font-bold font-serif ${isDark ? 'text-white' : 'text-gray-900'}`}>
                Checkmate
              </span>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <DarkModeToggle />
            <button
              onClick={onGetStarted}
              className={`flex items-center gap-2 px-4 sm:px-5 py-2 sm:py-2.5 rounded-full text-xs sm:text-sm font-semibold transition-all cursor-pointer
                ${isDark
                  ? 'bg-white text-gray-900 hover:bg-gray-100 shadow-lg shadow-white/10'
                  : 'bg-gray-900 text-white hover:bg-gray-800 shadow-lg shadow-black/20'
                }`}
            >
              <LogIn size={15} />
              Sign In
            </button>
          </div>
        </nav>

        {/* Hero Section with Responsive Viewport & Scroll Down Indicator */}
        <main id="hero" className="flex-1 min-h-[calc(100vh-80px)] flex flex-col items-center justify-between px-4 sm:px-6 py-6 md:py-10 text-center">
          <div className="my-auto flex flex-col items-center justify-center max-w-4xl">
            {/* Badge */}
            <div className={`inline-flex items-center gap-2 px-3.5 sm:px-4 py-1.5 rounded-full text-[11px] sm:text-xs font-semibold mb-6 md:mb-8
              ${isDark
                ? 'bg-purple-500/15 text-purple-300 border border-purple-500/20'
                : 'bg-amber-50 text-amber-700 border border-amber-200'
              }`}
              style={{ animation: 'fadeInDown 0.5s ease-out' }}
            >
              <span>♔</span>
              <span>CCPGLANG — Programming Language Final Project</span>
            </div>

            {/* Main Title */}
            <h1
              className={`text-4xl sm:text-6xl md:text-7xl lg:text-8xl font-bold font-serif mb-4 sm:mb-6 leading-[1.05] tracking-tight
                ${isDark ? 'text-white' : 'text-gray-900'}`}
              style={{ animation: 'fadeInUp 0.6s ease-out' }}
            >
              Check
              <span className={isDark ? 'text-amber-400' : 'text-amber-600'}>mate</span>
            </h1>

            {/* Subtitle */}
            <p
              className={`text-base sm:text-lg md:text-xl max-w-[600px] mb-8 md:mb-10 leading-relaxed px-2
                ${isDark ? 'text-gray-400' : 'text-gray-500'}`}
              style={{ animation: 'fadeInUp 0.7s ease-out' }}
            >
              Track, analyze, and optimize student attendance with precision and elegance.
              A modern monitoring system for the modern classroom.
            </p>

            {/* CTA Buttons */}
            <div
              className="flex flex-col sm:flex-row gap-3 sm:gap-4 items-center w-full sm:w-auto px-4 sm:px-0"
              style={{ animation: 'fadeInUp 0.8s ease-out' }}
            >
              <button
                onClick={onGetStarted}
                className={`group flex items-center justify-center gap-2 px-8 py-4 rounded-2xl text-base font-bold transition-all cursor-pointer w-full sm:w-auto
                  ${isDark
                    ? 'bg-white text-gray-900 hover:bg-gray-100 shadow-xl shadow-white/10 hover:shadow-white/20'
                    : 'bg-gray-900 text-white hover:bg-gray-800 shadow-xl shadow-black/20 hover:shadow-black/30'
                  } hover:scale-[1.03] active:scale-[0.98]`}
              >
                Get Started
                <ChevronRight size={18} className="transition-transform group-hover:translate-x-0.5" />
              </button>
              <button
                onClick={() => setShowChess(true)}
                className={`flex items-center justify-center gap-2 px-8 py-4 rounded-2xl text-base font-semibold transition-all cursor-pointer w-full sm:w-auto
                  ${isDark
                    ? 'bg-white/10 text-white hover:bg-white/15 border border-white/10 backdrop-blur-sm'
                    : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-200 shadow-lg'
                  } hover:scale-[1.03] active:scale-[0.98]`}
              >
                <span className="text-lg">♟</span>
                Play Chess
              </button>
            </div>
          </div>

          {/* Scroll Down Indicator (visible in both Horizontal and Vertical views) */}
          <div className="pt-8 pb-3 flex flex-col items-center">
            <button
              onClick={() => scrollToSection('features')}
              className={`group flex flex-col items-center gap-2 transition-all cursor-pointer select-none p-2 rounded-2xl ${
                isDark ? 'text-gray-400 hover:text-amber-400' : 'text-gray-500 hover:text-gray-900'
              }`}
              title="Scroll down to explore features"
              aria-label="Scroll down to explore features"
            >
              <span className="text-[11px] font-bold tracking-widest uppercase opacity-80 group-hover:opacity-100 transition-opacity">
                Scroll to explore
              </span>
              <div className={`w-6 h-9 rounded-full border-2 flex items-start justify-center p-1 transition-all ${
                isDark ? 'border-white/30 group-hover:border-amber-400' : 'border-gray-400 group-hover:border-gray-800'
              }`}>
                <div className={`w-1.5 h-2.5 rounded-full animate-bounce ${
                  isDark ? 'bg-amber-400' : 'bg-gray-800'
                }`} />
              </div>
              <ChevronDown size={18} className="animate-bounce -mt-1 opacity-70 group-hover:opacity-100 transition-opacity" />
            </button>
          </div>
        </main>

        {/* Features Section */}
        <section id="features" className="px-6 md:px-12 py-16 scroll-mt-6">
          <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6">
            {FEATURES.map((feature, idx) => (
              <div
                key={feature.title}
                className={`group p-7 rounded-2xl transition-all duration-300 hover:scale-[1.02]
                  ${isDark
                    ? 'bg-white/5 border border-white/10 hover:bg-white/8 hover:border-white/15 backdrop-blur-sm'
                    : 'bg-white/80 border border-gray-100 hover:bg-white hover:shadow-lg backdrop-blur-sm'
                  }`}
                style={{ animation: `fadeInUp ${0.8 + idx * 0.15}s ease-out` }}
              >
                <div className={`w-11 h-11 rounded-xl flex items-center justify-center mb-4 transition-colors
                  ${isDark
                    ? 'bg-purple-500/15 text-purple-400 group-hover:bg-purple-500/25'
                    : 'bg-amber-50 text-amber-600 group-hover:bg-amber-100'
                  }`}>
                  <feature.icon size={22} />
                </div>
                <h3 className={`text-base font-bold mb-2 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                  {feature.title}
                </h3>
                <p className={`text-sm leading-relaxed ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* Paradigm Section */}
        <section id="paradigms" className="px-6 md:px-12 py-12 scroll-mt-6">
          <div className={`max-w-5xl mx-auto rounded-2xl p-8 md:p-10
            ${isDark
              ? 'bg-gradient-to-br from-purple-500/10 to-blue-500/10 border border-white/10'
              : 'bg-gradient-to-br from-amber-50 to-orange-50 border border-amber-100'
            }`}>
            <div className="text-center mb-8">
              <h2 className={`text-2xl md:text-3xl font-bold font-serif mb-3
                ${isDark ? 'text-white' : 'text-gray-900'}`}>
                Two Paradigms, One System
              </h2>
              <p className={`text-sm max-w-lg mx-auto ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                Demonstrating how Functional and Object-Oriented programming solve the same attendance monitoring problem
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className={`p-6 rounded-xl ${isDark ? 'bg-white/5' : 'bg-white/70'}`}>
                <div className={`text-xs font-bold uppercase tracking-wider mb-3
                  ${isDark ? 'text-blue-400' : 'text-blue-600'}`}>
                  Frontend — TypeScript + React
                </div>
                <div className={`text-sm font-semibold mb-2 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                  Functional Paradigm
                </div>
                <ul className={`text-xs space-y-1.5 ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                  <li>→ Pure functions & immutability</li>
                  <li>→ Function composition & HOFs</li>
                  <li>→ useState / useReducer for state</li>
                  <li>→ No side effects in logic</li>
                </ul>
              </div>
              <div className={`p-6 rounded-xl ${isDark ? 'bg-white/5' : 'bg-white/70'}`}>
                <div className={`text-xs font-bold uppercase tracking-wider mb-3
                  ${isDark ? 'text-green-400' : 'text-green-600'}`}>
                  Backend — Python + FastAPI
                </div>
                <div className={`text-sm font-semibold mb-2 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                  Object-Oriented Paradigm
                </div>
                <ul className={`text-xs space-y-1.5 ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                  <li>→ Classes & encapsulation</li>
                  <li>→ Mutable internal state</li>
                  <li>→ Method chaining & inheritance</li>
                  <li>→ Stateful business logic</li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer id="footer" className={`px-6 md:px-12 py-8 border-t scroll-mt-6
          ${isDark ? 'border-white/5' : 'border-gray-100'}`}>
          <div className="max-w-5xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex flex-col items-center md:items-start gap-1">
              <div className="flex items-center gap-2 mb-2">
                <div className="w-6 h-6 rounded-md overflow-hidden">
                  <img src={logo} alt="" className="w-full h-full object-cover" />
                </div>
                <span className={`text-sm font-bold font-serif ${isDark ? 'text-white' : 'text-gray-900'}`}>
                  Checkmate
                </span>
              </div>
              <p className={`text-xs ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>
                © 2026 Artificial Ledger · CCPGLANG — COM232
              </p>
            </div>
            <div className="flex flex-wrap justify-center gap-2">
              {TEAM_MEMBERS.map(name => (
                <span
                  key={name}
                  className={`text-[10px] px-2.5 py-1 rounded-full
                    ${isDark ? 'bg-white/5 text-gray-500' : 'bg-gray-100 text-gray-500'}`}
                >
                  {name}
                </span>
              ))}
            </div>
            <a
              href="https://github.com/flexycode/CCPGLANG_FINAL_PROJECT"
              target="_blank"
              rel="noopener noreferrer"
              className={`flex items-center gap-1.5 text-xs transition-colors
                ${isDark ? 'text-gray-500 hover:text-gray-300' : 'text-gray-400 hover:text-gray-600'}`}
            >
              <ExternalLink size={14} />
              View on GitHub
            </a>
          </div>
        </footer>
      </div>

      {/* Chess Game Modal */}
      <ChessGame isOpen={showChess} onClose={() => setShowChess(false)} />

      <style>{`
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(24px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes fadeInDown {
          from { opacity: 0; transform: translateY(-12px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
}
