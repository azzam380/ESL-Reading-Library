'use client';

import React from 'react';
import { useAuthController } from '@/lib/controllers/AuthController';
import { Shield, BookOpen, GraduationCap, Compass } from 'lucide-react';

export default function LoginPage() {
  const {
    identifier,
    setIdentifier,
    password,
    setPassword,
    isLoading,
    error,
    detectedSchoolId,
    submitLogin
  } = useAuthController();

  // Dynamic Theme mapping based on parsed school tenant
  const isAAR = detectedSchoolId === 'AAR';
  const isBIS = detectedSchoolId === 'BIS';

  // Harmony branding colors
  let brandColor = 'text-indigo-400';
  let focusRingColor = 'focus:ring-indigo-500/50 focus:border-indigo-400';
  let buttonBg = 'bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500';
  let cardBorder = 'border-slate-800';
  let glowColor = 'shadow-indigo-500/10';
  let schoolName = 'Progressive Learning Library';
  let schoolLogo = <Compass className="w-8 h-8 text-indigo-400 animate-spin-slow" />;

  if (isAAR) {
    brandColor = 'text-emerald-400';
    focusRingColor = 'focus:ring-emerald-500/50 focus:border-emerald-400';
    buttonBg = 'bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500';
    cardBorder = 'border-emerald-900/50';
    glowColor = 'shadow-emerald-500/15';
    schoolName = 'Al-Ameen Academy';
    schoolLogo = <GraduationCap className="w-8 h-8 text-emerald-400" />;
  } else if (isBIS) {
    brandColor = 'text-sky-400';
    focusRingColor = 'focus:ring-sky-500/50 focus:border-sky-400';
    buttonBg = 'bg-gradient-to-r from-sky-600 to-blue-600 hover:from-sky-500 hover:to-blue-500';
    cardBorder = 'border-sky-900/50';
    glowColor = 'shadow-sky-500/15';
    schoolName = 'British International School';
    schoolLogo = <BookOpen className="w-8 h-8 text-sky-400" />;
  }

  return (
    <main className="min-h-screen bg-slate-950 text-slate-100 flex flex-col items-center justify-center p-4 relative overflow-hidden">
      {/* Background Ambient Glows */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 rounded-full bg-indigo-900/10 blur-[100px] pointer-events-none transition-colors duration-700" 
        style={{
          backgroundColor: isAAR ? 'rgba(16, 185, 129, 0.05)' : isBIS ? 'rgba(14, 165, 233, 0.05)' : 'rgba(99, 102, 241, 0.05)'
        }}
      />
      
      <div className="w-full max-w-md flex flex-col gap-6 z-10">
        
        {/* Portal Branding Card */}
        <div className="flex flex-col items-center text-center gap-2">
          <div className="w-16 h-16 rounded-2xl bg-slate-900 border border-slate-800 flex items-center justify-center shadow-2xl transition-all duration-500 transform hover:scale-105">
            {schoolLogo}
          </div>
          <h1 className="text-xl font-bold uppercase tracking-wider text-slate-300 mt-2">P E L L</h1>
          <p className="text-xs text-slate-400">Progressive English Learning Library</p>
        </div>

        {/* Dynamic Login Container */}
        <div className={`w-full bg-slate-900/80 backdrop-blur-xl border ${cardBorder} rounded-3xl p-6 sm:p-8 shadow-2xl ${glowColor} transition-all duration-500`}>
          
          <div className="flex flex-col gap-1.5 mb-6">
            <h2 className="text-lg font-bold text-white transition-colors duration-500">{schoolName}</h2>
            <p className="text-xs text-slate-400">Enter your credentials to enter the library portal.</p>
          </div>

          {error && (
            <div className="mb-4 bg-red-950/50 border border-red-900/60 rounded-xl px-4 py-3 text-xs text-red-300 font-medium flex items-center gap-2">
              <Shield className="w-4 h-4 text-red-400 flex-shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={submitLogin} className="flex flex-col gap-5">
            
            {/* Input 1: Username / ID */}
            <div className="flex flex-col gap-1.5">
              <label htmlFor="identifier" className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">
                Username or Student ID
              </label>
              <input
                id="identifier"
                type="text"
                autoComplete="username"
                value={identifier}
                onChange={(e) => setIdentifier(e.target.value)}
                placeholder="e.g. AAR-0001 or teacher@pell.edu"
                className={`w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-sm text-white placeholder-slate-600 outline-none transition-all duration-300 ${focusRingColor}`}
              />
            </div>

            {/* Input 2: Password */}
            <div className="flex flex-col gap-1.5">
              <label htmlFor="password" className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">
                Password
              </label>
              <input
                id="password"
                type="password"
                autoComplete="current-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className={`w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-sm text-white placeholder-slate-600 outline-none transition-all duration-300 ${focusRingColor}`}
              />
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className={`w-full ${buttonBg} text-white font-semibold rounded-xl py-3 text-sm shadow-xl transition-all duration-300 active:scale-[0.98] disabled:opacity-50 disabled:pointer-events-none mt-2 flex items-center justify-center`}
            >
              {isLoading ? (
                <span className="flex items-center gap-2">
                  <svg className="animate-spin h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  <span>Authenticating...</span>
                </span>
              ) : (
                'Secure Log In'
              )}
            </button>
          </form>
        </div>

        {/* Dynamic Sandbox Login Guide */}
        <div className="w-full bg-slate-900/40 border border-slate-900 rounded-2xl p-4 flex flex-col gap-2">
          <span className="text-[9px] text-slate-500 font-bold uppercase tracking-widest">DEVELOPER QUICK LOGIN GUIDE</span>
          <div className="grid grid-cols-2 gap-3 text-[10px] text-slate-400">
            <div className="flex flex-col bg-slate-950/60 rounded-lg p-2 border border-slate-900">
              <span className="font-semibold text-slate-300">Staff Account:</span>
              <span className="font-mono text-indigo-400">teacher@pell.edu</span>
              <span>Pass: <span className="font-mono text-slate-300">12345</span></span>
            </div>
            <div className="flex flex-col bg-slate-950/60 rounded-lg p-2 border border-slate-900">
              <span className="font-semibold text-slate-300">Student ID:</span>
              <span className="font-mono text-emerald-400">AAR-0001</span>
              <span>Pass: <span className="font-mono text-slate-300">12345</span></span>
            </div>
          </div>
        </div>

      </div>
    </main>
  );
}
