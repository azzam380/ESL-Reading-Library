'use client';

import React from 'react';
import { useContentBuilderController } from '@/lib/controllers/ContentBuilderController';
import { Users, BookOpen, Settings, Award, PlusCircle, LogOut } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function TeacherDashboard() {
  const router = useRouter();
  const [showRegisterForm, setShowRegisterForm] = React.useState(false);
  
  const {
    teacher,
    schoolId,
    students,
    topics,
    isLoading,
    error,
    success,
    regFirstName,
    setRegFirstName,
    regLastName,
    setRegLastName,
    regGrade,
    setRegGrade,
    regClass,
    setRegClass,
    registerStudent
  } = useContentBuilderController();

  const handleLogout = () => {
    sessionStorage.removeItem('pell_session');
    router.push('/login');
  };

  const isAAR = schoolId === 'AAR';
  const accentColor = isAAR ? 'text-emerald-400' : 'text-sky-400';
  const bgGlow = isAAR ? 'rgba(16, 185, 129, 0.03)' : 'rgba(14, 165, 233, 0.03)';

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col">
      {/* Header Bar */}
      <header className="border-b border-slate-900 bg-slate-950/60 backdrop-blur-md sticky top-0 z-40 px-4 py-4 sm:px-6 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-center">
            <Settings className={`w-5 h-5 ${accentColor}`} />
          </div>
          <div>
            <h1 className="text-sm font-bold text-white uppercase tracking-wider">TEACHER PORTAL</h1>
            <span className="text-[10px] text-slate-400 font-semibold uppercase">{isAAR ? 'Al-Ameen Academy' : 'British International School'}</span>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <span className="hidden sm:inline text-xs text-slate-400">
            Welcome, <strong className="text-slate-200">Mr. {teacher?.lastName || 'Hariri'}</strong>
          </span>
          <button 
            onClick={handleLogout}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-850 hover:border-red-900 text-xs text-slate-400 hover:text-red-400 transition-all duration-300"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Sign Out</span>
          </button>
        </div>
      </header>

      {/* Main Grid */}
      <main className="max-w-6xl w-full mx-auto px-4 py-6 sm:py-8 flex flex-col gap-6 sm:gap-8">
        
        {/* Banner Card */}
        <div className="relative overflow-hidden rounded-3xl bg-slate-900 border border-slate-900 p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
          style={{ backgroundColor: bgGlow }}
        >
          <div className="absolute top-0 right-0 w-80 h-80 rounded-full bg-indigo-500/5 blur-[90px] pointer-events-none" />
          <div className="flex flex-col gap-2 max-w-xl">
            <span className={`text-[10px] font-bold uppercase tracking-wider ${accentColor}`}>ACADEMIC OPERATIONS</span>
            <h2 className="text-lg sm:text-xl font-bold text-white">Manage class progress, student XP points, and structured assessments.</h2>
            <p className="text-xs text-slate-400">Use the Content Builder to create reading topics, and formulate multiple choice, translation, and fill-in-the-blank questions.</p>
          </div>
          <Link 
            href="/teacher/content-builder"
            className={`flex items-center gap-2 bg-gradient-to-r ${isAAR ? 'from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 shadow-emerald-500/10' : 'from-sky-600 to-blue-600 hover:from-sky-500 hover:to-blue-500 shadow-sky-500/10'} px-4 py-2.5 rounded-xl text-xs font-bold text-white transition-all duration-300 shadow-md self-start sm:self-center`}
          >
            <PlusCircle className="w-4 h-4" />
            <span>Content Builder</span>
          </Link>
        </div>

        {/* Stats Row */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          <div className="bg-slate-900/60 border border-slate-900 rounded-2xl p-5 flex items-center justify-between">
            <div className="flex flex-col gap-1">
              <span className="text-[10px] text-slate-500 font-bold uppercase">CURRICULUM STUDENTS</span>
              <span className="text-2xl font-bold text-white">{students.length}</span>
            </div>
            <div className={`w-10 h-10 rounded-xl bg-slate-950 border border-slate-850 flex items-center justify-center ${accentColor}`}>
              <Users className="w-5 h-5" />
            </div>
          </div>

          <div className="bg-slate-900/60 border border-slate-900 rounded-2xl p-5 flex items-center justify-between">
            <div className="flex flex-col gap-1">
              <span className="text-[10px] text-slate-500 font-bold uppercase">ACTIVE TOPICS</span>
              <span className="text-2xl font-bold text-white">{topics.length}</span>
            </div>
            <div className={`w-10 h-10 rounded-xl bg-slate-950 border border-slate-850 flex items-center justify-center ${accentColor}`}>
              <BookOpen className="w-5 h-5" />
            </div>
          </div>

          <div className="bg-slate-900/60 border border-slate-900 rounded-2xl p-5 flex items-center justify-between">
            <div className="flex flex-col gap-1">
              <span className="text-[10px] text-slate-500 font-bold uppercase">TOTAL CLASSROOM XP</span>
              <span className="text-2xl font-bold text-white">
                {students.reduce((acc, curr) => acc + (curr.xp || 0), 0)}
              </span>
            </div>
            <div className={`w-10 h-10 rounded-xl bg-slate-950 border border-slate-850 flex items-center justify-center ${accentColor}`}>
              <Award className="w-5 h-5" />
            </div>
          </div>
        </div>

        {/* Students Table Container */}
        <div className="bg-slate-900/60 border border-slate-900 rounded-2xl p-5 sm:p-6 flex flex-col gap-4">
          <div className="flex items-center justify-between flex-wrap gap-3">
            <div>
              <h3 className="text-base font-bold text-white">Registered Student Roster</h3>
              <p className="text-xs text-slate-500">Real-time student progress tracking and cumulative XP scores.</p>
            </div>
            <button
              onClick={() => setShowRegisterForm(!showRegisterForm)}
              className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl border text-xs font-bold transition-all duration-300 cursor-pointer ${
                showRegisterForm 
                  ? 'border-slate-850 bg-slate-950 text-slate-300' 
                  : isAAR 
                    ? 'border-emerald-900/50 bg-emerald-950/20 text-emerald-400 hover:bg-emerald-950/40' 
                    : 'border-sky-900/50 bg-sky-950/20 text-sky-400 hover:bg-sky-950/40'
              }`}
            >
              <PlusCircle className="w-4 h-4" />
              {showRegisterForm ? 'Close Form' : 'Register New Student'}
            </button>
          </div>

          {/* Dynamic Register Form Slide-down */}
          {showRegisterForm && (
            <form onSubmit={registerStudent} className="bg-slate-950/80 border border-slate-900 rounded-2xl p-4 sm:p-5 flex flex-col gap-4 animate-fadeIn">
              <h4 className="text-xs font-black text-white uppercase tracking-widest border-b border-slate-900 pb-2">Register Student Account</h4>
              
              {error && (
                <div className="p-3 text-xs bg-red-950/20 border border-red-900/30 text-red-400 rounded-xl">
                  {error}
                </div>
              )}
              {success && (
                <div className="p-3 text-xs bg-emerald-950/20 border border-emerald-900/30 text-emerald-400 rounded-xl">
                  {success}
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] uppercase font-bold text-slate-500 tracking-wider">First Name</label>
                  <input
                    type="text"
                    required
                    value={regFirstName}
                    onChange={(e) => setRegFirstName(e.target.value)}
                    placeholder="e.g. Fatima"
                    className="bg-slate-900 border border-slate-850 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-slate-700 transition-colors"
                  />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] uppercase font-bold text-slate-500 tracking-wider">Last Name</label>
                  <input
                    type="text"
                    required
                    value={regLastName}
                    onChange={(e) => setRegLastName(e.target.value)}
                    placeholder="e.g. Al-Mansoor"
                    className="bg-slate-900 border border-slate-850 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-slate-700 transition-colors"
                  />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] uppercase font-bold text-slate-500 tracking-wider">Academic Grade</label>
                  <select
                    value={regGrade}
                    onChange={(e) => setRegGrade(Number(e.target.value))}
                    className="bg-slate-900 border border-slate-850 rounded-xl px-3 py-2.5 text-xs text-white focus:outline-none focus:border-slate-700 transition-colors"
                  >
                    {[3, 4, 5, 6, 7, 8].map(g => (
                      <option key={g} value={g}>Grade {g}</option>
                    ))}
                  </select>
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] uppercase font-bold text-slate-500 tracking-wider">Class Section Name</label>
                  <input
                    type="text"
                    required
                    value={regClass}
                    onChange={(e) => setRegClass(e.target.value)}
                    placeholder="e.g. Alpha, Oak, Beta"
                    className="bg-slate-900 border border-slate-850 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-slate-700 transition-colors"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 border-t border-slate-900 pt-3">
                <button
                  type="button"
                  onClick={() => setShowRegisterForm(false)}
                  className="px-4 py-2 text-xs font-semibold text-slate-400 hover:text-white transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isLoading}
                  className={`px-4 py-2 rounded-xl text-xs font-bold text-slate-950 transition-all duration-300 cursor-pointer ${
                    isAAR 
                      ? 'bg-emerald-400 hover:bg-emerald-300' 
                      : 'bg-sky-400 hover:bg-sky-300'
                  }`}
                >
                  {isLoading ? 'Registering...' : 'Register and Generate ID'}
                </button>
              </div>
            </form>
          )}

          {isLoading && students.length === 0 ? (
            <div className="py-12 flex justify-center">
              <svg className="animate-spin h-6 w-6 text-indigo-400" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
              </svg>
            </div>
          ) : students.length === 0 ? (
            <div className="py-12 text-center text-xs text-slate-500 border border-dashed border-slate-850 rounded-xl">
              No registered students found under this school tenant.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="border-b border-slate-850 text-slate-500 uppercase text-[9px] tracking-widest font-bold">
                    <th className="py-3 px-4">Student ID</th>
                    <th className="py-3 px-4">Full Name</th>
                    <th className="py-3 px-4">Grade</th>
                    <th className="py-3 px-4">Class</th>
                    <th className="py-3 px-4 text-right">XP Points</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-850">
                  {students.map(s => (
                    <tr key={s.id} className="hover:bg-slate-900/30 transition-colors duration-200">
                      <td className="py-3 px-4 font-mono font-bold text-slate-400">{s.id}</td>
                      <td className="py-3 px-4 font-semibold text-white">{s.firstName} {s.lastName}</td>
                      <td className="py-3 px-4 text-slate-300">Grade {s.currentGrade}</td>
                      <td className="py-3 px-4">
                        <span className="px-2 py-1 rounded bg-slate-950 border border-slate-800 font-medium text-slate-400">
                          {s.currentClass}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-right font-bold text-amber-400">{s.xp || 0} XP</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

      </main>
    </div>
  );
}
