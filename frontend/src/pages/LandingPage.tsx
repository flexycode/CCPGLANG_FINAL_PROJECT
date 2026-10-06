import { useState } from 'react';
import { LogIn, BarChart3, Clock, Users, ChevronRight, ExternalLink } from 'lucide-react';
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

export default function LandingPage({ onGetStarted }: LandingPageProps) {
  const { isDark } = useTheme();
  const [showChess, setShowChess] = useState(false);

  return (
    <div className="relative min-h-screen w-full overflow-y-auto overflow-x-hidden">
      {/* Animated Background */}
      <AnimatedBackground />

      {/* Content Layer */}
      <div className="relative z-10 flex flex-col min-h-screen">
        {/* Navigation */}
        <nav className="flex items-center justify-between px-6 md:px-12 py-5">
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
              className={`hidden sm:flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-semibold transition-all cursor-pointer
                ${isDark
                  ? 'bg-white text-gray-900 hover:bg-gray-100 shadow-lg shadow-white/10'
                  : 'bg-gray-900 text-white hover:bg-gray-800 shadow-lg shadow-black/20'
                }`}
            >
              <LogIn size={16} />
              Sign In
            </button>
          </div>
        </nav>

        {/* Hero Section */}
        <main className="flex-1 flex flex-col items-center justify-center px-6 py-12 md:py-20 text-center">
          {/* Badge */}
          <div className={`inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-semibold mb-8
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
            className={`text-5xl md:text-7xl lg:text-8xl font-bold font-serif mb-6 leading-[1.05] tracking-tight
              ${isDark ? 'text-white' : 'text-gray-900'}`}
            style={{ animation: 'fadeInUp 0.6s ease-out' }}
          >
            Check
            <span className={isDark ? 'text-amber-400' : 'text-amber-600'}>mate</span>
          </h1>

          {/* Subtitle */}
          <p
            className={`text-lg md:text-xl max-w-[600px] mb-10 leading-relaxed
              ${isDark ? 'text-gray-400' : 'text-gray-500'}`}
            style={{ animation: 'fadeInUp 0.7s ease-out' }}
          >
            Track, analyze, and optimize student attendance with precision and elegance.
            A modern monitoring system for the modern classroom.
          </p>

          {/* CTA Buttons */}
          <div
            className="flex flex-col sm:flex-row gap-4 items-center"
            style={{ animation: 'fadeInUp 0.8s ease-out' }}
          >
            <button
              onClick={onGetStarted}
              className={`group flex items-center gap-2 px-8 py-4 rounded-2xl text-base font-bold transition-all cursor-pointer
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
              className={`flex items-center gap-2 px-8 py-4 rounded-2xl text-base font-semibold transition-all cursor-pointer
                ${isDark
                  ? 'bg-white/10 text-white hover:bg-white/15 border border-white/10 backdrop-blur-sm'
                  : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-200 shadow-lg'
                } hover:scale-[1.03] active:scale-[0.98]`}
            >
              <span className="text-lg">♟</span>
              Play Chess
            </button>
          </div>
        </main>

        {/* Features Section */}
        <section className="px-6 md:px-12 py-16">
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
        <section className="px-6 md:px-12 py-12">
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
        <footer className={`px-6 md:px-12 py-8 border-t
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
