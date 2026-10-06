import { ArrowLeft } from 'lucide-react';
import { useTheme } from '../utils/theme';
import DarkModeToggle from './DarkModeToggle';
import logo from '../assets/checkmate_logo.jpg';

interface SidePanelProps {
  onBackToLanding?: () => void;
}

export default function SidePanel({ onBackToLanding }: SidePanelProps) {
  const { isDark } = useTheme();

  return (
    <div className={`w-full md:w-1/3 lg:w-1/4 relative flex flex-col justify-center p-10 overflow-hidden max-md:px-6 max-md:py-[60px] max-md:items-center min-h-[250px]
      ${isDark
        ? 'bg-[linear-gradient(180deg,#1a1a2e_0%,#16213e_34.13%,#0f3460_100%)]'
        : 'bg-[linear-gradient(180deg,#E6D0C1_0%,#FFFAF6_34.13%,#EEE9E4_100%)]'
      }`}>

      {/* Top bar: Back + Dark mode */}
      <div className="absolute top-4 left-4 right-4 flex items-center justify-between z-10">
        {onBackToLanding ? (
          <button
            onClick={onBackToLanding}
            className={`flex items-center gap-1.5 text-xs font-medium transition-colors cursor-pointer
              ${isDark ? 'text-gray-400 hover:text-white' : 'text-gray-500 hover:text-gray-800'}`}
          >
            <ArrowLeft size={14} />
            Home
          </button>
        ) : <div />}
        <DarkModeToggle className="w-8 h-8" />
      </div>

      <div className="flex items-center gap-4 z-10">

        {/* replace add logo here */}
        <div className="w-[50px] h-[50px] shrink-0 flex items-center justify-center rounded-xl shadow-sm overflow-hidden">
          <img src={logo} alt="Checkmate Logo" className="w-full h-full object-cover" />
        </div>
        <div className="flex flex-col">
          <h2 className={`text-[28px] font-bold font-serif m-0 leading-[1.1]
            ${isDark ? 'text-white' : 'text-[#1F2328]'}`}>Checkmate</h2>
          <p className={`text-[10px] font-bold m-0 tracking-[1.5px] uppercase mt-1
            ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>ATTENDANCE MONITORING</p>
        </div>
      </div>

      {/* Decorative circles */}
      <div className={`absolute border rounded-full pointer-events-none
        ${isDark ? 'border-white/5' : 'border-black/5'}`}
        style={{ bottom: '-10%', left: '-10%', width: '300px', height: '300px' }}></div>
      <div className={`absolute border rounded-full pointer-events-none
        ${isDark ? 'border-white/5' : 'border-black/5'}`}
        style={{ bottom: '10%', left: '10%', width: '400px', height: '400px' }}></div>
      <div className={`absolute border rounded-full pointer-events-none
        ${isDark ? 'border-white/5' : 'border-black/5'}`}
        style={{ bottom: '-20%', left: '30%', width: '500px', height: '500px' }}></div>

      <div className={`absolute bottom-6 left-10 text-xs z-10 max-md:relative max-md:bottom-auto max-md:left-auto max-md:mt-10
        ${isDark ? 'text-gray-500' : 'text-gray-500'}`}>
        &copy; 2026 Checkmate - Attendance Monitoring
      </div>
    </div>
  );
}

