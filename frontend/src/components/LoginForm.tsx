import React, { useState } from 'react';
import { User, Lock, EyeOff, Eye, LogIn } from 'lucide-react';
import { useTheme } from '../utils/theme';
import { setCurrentUser } from '../utils/user';
import { addNotification } from '../utils/notifications';

interface LoginFormProps {
  onSignIn?: () => void;
}

export default function LoginForm({ onSignIn }: LoginFormProps) {
  const [username, setUsername] = useState('Scaluya7');
  const [showPassword, setShowPassword] = useState(false);
  const { isDark } = useTheme();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const user = setCurrentUser(username);
    addNotification(
      'User Authenticated',
      `${user.displayName} (${user.username}) successfully signed in to Checkmate Monitoring System.`,
      'user'
    );
    if (onSignIn) {
      onSignIn();
    }
  };

  return (
    <div className={`flex-1 flex justify-center items-center p-10
      ${isDark ? 'bg-gray-900' : 'bg-[#FFFBF4]'}`}>
      <div className="w-full max-w-[440px]">
        <div className="mb-10">
          <h1 className={`text-[32px] font-serif font-bold mb-2
            ${isDark ? 'text-white' : 'text-[#1F2328]'}`}>Sign In</h1>
          <p className={`text-sm leading-relaxed
            ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>Welcome back! Sign in to access your attendance monitoring platform.</p>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-5">
          <div className="flex flex-col gap-2">
            <label htmlFor="username" className={`text-[13px] font-semibold
              ${isDark ? 'text-gray-200' : 'text-[#1F2328]'}`}>Username</label>
            <div className="relative flex items-center">
              <User size={18} className={`absolute left-3.5 pointer-events-none
                ${isDark ? 'text-gray-500' : 'text-gray-400'}`} />
              <input
                type="text"
                id="username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Ex. Scaluya7"
                required
                className={`w-full py-3 px-10 border rounded-lg text-sm transition-all focus:outline-none focus:ring-2
                  ${isDark
                    ? 'bg-gray-800 border-gray-700 text-white placeholder-gray-500 focus:border-gray-500 focus:ring-gray-500/20'
                    : 'bg-white border-gray-300 text-[#1F2328] placeholder-gray-400 focus:border-[#1A1A1A] focus:ring-[#1A1A1A]/10'
                  }`}
              />
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <label htmlFor="password" className={`text-[13px] font-semibold
              ${isDark ? 'text-gray-200' : 'text-[#1F2328]'}`}>Password</label>
            <div className="relative flex items-center">
              <Lock size={18} className={`absolute left-3.5 pointer-events-none
                ${isDark ? 'text-gray-500' : 'text-gray-400'}`} />
              <input
                type={showPassword ? 'text' : 'password'}
                id="password"
                placeholder="Enter your password"
                required
                className={`w-full py-3 px-10 border rounded-lg text-sm transition-all focus:outline-none focus:ring-2
                  ${isDark
                    ? 'bg-gray-800 border-gray-700 text-white placeholder-gray-500 focus:border-gray-500 focus:ring-gray-500/20'
                    : 'bg-white border-gray-300 text-[#1F2328] placeholder-gray-400 focus:border-[#1A1A1A] focus:ring-[#1A1A1A]/10'
                  }`}
              />
              <button
                type="button"
                className={`absolute right-3.5 cursor-pointer flex items-center justify-center p-0 bg-transparent border-none
                  ${isDark ? 'text-gray-500 hover:text-white' : 'text-gray-400 hover:text-[#1F2328]'}`}
                onClick={() => setShowPassword(!showPassword)}
                aria-label="Toggle password visibility"
              >
                {showPassword ? <Eye size={18} /> : <EyeOff size={18} />}
              </button>
            </div>
            <div className="flex justify-end -mt-1">
              <a href="#forgot" className={`text-[12px] hover:underline transition-colors
                ${isDark ? 'text-gray-500 hover:text-gray-300' : 'text-gray-500 hover:text-[#1F2328]'}`}>Forgot Password?</a>
            </div>
          </div>

          <button type="submit" className={`mt-2.5 w-full py-3.5 border-none rounded-lg text-[15px] font-semibold cursor-pointer flex items-center justify-center gap-2 transition-colors
            ${isDark
              ? 'bg-white text-gray-900 hover:bg-gray-100'
              : 'bg-[#1A1A1A] hover:bg-[#333333] text-white'
            }`}>
            <LogIn size={18} />
            Sign In
          </button>
        </form>
      </div>
    </div>
  );
}
