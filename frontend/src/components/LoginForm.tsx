import React, { useState } from 'react';
import { User, Lock, EyeOff, Eye, LogIn } from 'lucide-react';

interface LoginFormProps {
  onSignIn?: () => void;
}

export default function LoginForm({ onSignIn }: LoginFormProps) {
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (onSignIn) {
      onSignIn();
    }
  };

  return (
    <div className="flex-1 bg-[#FFFBF4] flex justify-center items-center p-10">
      <div className="w-full max-w-[440px]">
        <div className="mb-10">
          <h1 className="text-[32px] font-serif font-bold text-[#1F2328] mb-2">Sign In</h1>
          <p className="text-gray-500 text-sm leading-relaxed">Welcome back! Sign in to access your attendance monitoring platform.</p>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-5">
          <div className="flex flex-col gap-2">
            <label htmlFor="username" className="text-[13px] font-semibold text-[#1F2328]">Username</label>
            <div className="relative flex items-center">
              <User size={18} className="absolute left-3.5 text-gray-400 pointer-events-none" />
              <input
                type="text"
                id="username"
                placeholder="Ex. Scaluya7"
                required
                className="w-full py-3 px-10 border border-gray-300 rounded-lg text-sm text-[#1F2328] bg-white transition-all focus:outline-none focus:border-[#1A1A1A] focus:ring-2 focus:ring-[#1A1A1A]/10 placeholder-gray-400"
              />
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <label htmlFor="password" className="text-[13px] font-semibold text-[#1F2328]">Password</label>
            <div className="relative flex items-center">
              <Lock size={18} className="absolute left-3.5 text-gray-400 pointer-events-none" />
              <input
                type={showPassword ? 'text' : 'password'}
                id="password"
                placeholder="Enter your password"
                required
                className="w-full py-3 px-10 border border-gray-300 rounded-lg text-sm text-[#1F2328] bg-white transition-all focus:outline-none focus:border-[#1A1A1A] focus:ring-2 focus:ring-[#1A1A1A]/10 placeholder-gray-400"
              />
              <button
                type="button"
                className="absolute right-3.5 text-gray-400 hover:text-[#1F2328] cursor-pointer flex items-center justify-center p-0 bg-transparent border-none"
                onClick={() => setShowPassword(!showPassword)}
                aria-label="Toggle password visibility"
              >
                {showPassword ? <Eye size={18} /> : <EyeOff size={18} />}
              </button>
            </div>
            <div className="flex justify-end -mt-1">
              <a href="#forgot" className="text-[12px] text-gray-500 hover:text-[#1F2328] hover:underline transition-colors">Forgot Password?</a>
            </div>
          </div>

          <button type="submit" className="mt-2.5 w-full py-3.5 bg-[#1A1A1A] hover:bg-[#333333] text-white border-none rounded-lg text-[15px] font-semibold cursor-pointer flex items-center justify-center gap-2 transition-colors">
            <LogIn size={18} />
            Sign In
          </button>
        </form>
      </div>
    </div>
  );
}
