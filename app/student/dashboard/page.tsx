'use client';

import React, { useState, useEffect } from 'react';
import { useQuizController } from '@/lib/controllers/QuizController';
import { FirestoreQuestionRepository } from '@/lib/data/FirestoreQuestionRepository';
import { TopicEntity } from '@/types/quiz';
import { Award, Compass, Lock, LogOut, Play, Sparkles, BookOpen } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function StudentDashboard() {
  const router = useRouter();
  const { student } = useQuizController();
  const [topics, setTopics] = useState<TopicEntity[]>([]);
  const [isLoadingTopics, setIsLoadingTopics] = useState(true);

  // Load topics from repository
  useEffect(() => {
    if (student) {
      const questionRepo = new FirestoreQuestionRepository();
      questionRepo.listTopics(student.schoolId)
        .then(list => {
          setTopics(list);
          setIsLoadingTopics(false);
        })
        .catch(err => {
          console.error('Error loading topics:', err);
          setIsLoadingTopics(false);
        });
    }
  }, [student]);

  const handleLogout = () => {
    sessionStorage.removeItem('pell_session');
    router.push('/login');
  };

  const isAAR = student?.schoolId === 'AAR';
  const accentColor = isAAR ? 'text-emerald-400' : 'text-sky-400';
  const borderHighlight = isAAR ? 'border-emerald-950 hover:border-emerald-700/50' : 'border-sky-950 hover:border-sky-700/50';
  const progressBg = isAAR ? 'bg-emerald-500' : 'bg-sky-500';
  const dynamicGlow = isAAR ? 'shadow-emerald-500/10' : 'shadow-sky-500/10';

  // Gamification formulas
  const xp = student?.xp || 0;
  const currentLevel = Math.floor(xp / 100) + 1;
  const levelProgress = xp % 100;

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col">
      {/* Dynamic Header */}
      <header className="border-b border-slate-900 bg-slate-950/60 backdrop-blur-md sticky top-0 z-40 px-4 py-4 sm:px-6 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-center">
            <Sparkles className={`w-5 h-5 ${accentColor} animate-pulse`} />
          </div>
          <div>
            <h1 className="text-sm font-bold text-white uppercase tracking-wider">{student?.firstName}&apos;s PATH</h1>
            <span className="text-[10px] text-slate-400 font-semibold uppercase">{isAAR ? 'Al-Ameen Academy' : 'British International School'}</span>
          </div>
        </div>

        <button 
          onClick={handleLogout}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-850 hover:border-red-900 text-xs text-slate-400 hover:text-red-400 transition-all duration-300"
        >
          <LogOut className="w-3.5 h-3.5" />
          <span>Sign Out</span>
        </button>
      </header>

      {/* Main Container */}
      <main className="flex-1 max-w-5xl w-full mx-auto p-4 sm:p-6 lg:p-8 flex flex-col gap-8">
        
        {/* Dynamic Level Tracker Card */}
        {student && (
          <div className={`bg-slate-900/60 border border-slate-900 rounded-3xl p-6 sm:p-8 shadow-2xl ${dynamicGlow} relative overflow-hidden flex flex-col sm:flex-row items-center gap-6`}>
            {/* Holographic background blob */}
            <div className="absolute -top-24 -left-24 w-48 h-48 rounded-full bg-indigo-500/5 blur-[80px]" />
            
            {/* Level badge circle */}
            <div className="relative w-24 h-24 sm:w-28 sm:h-28 rounded-full bg-slate-950 border-4 border-slate-850 flex flex-col items-center justify-center shadow-inner flex-shrink-0 animate-bounce-slow">
              <span className="text-[9px] text-slate-500 font-bold uppercase tracking-widest">LEVEL</span>
              <span className={`text-3xl sm:text-4xl font-extrabold ${accentColor}`}>{currentLevel}</span>
              <div className="absolute -bottom-1 px-3 py-0.5 rounded-full bg-slate-900 border border-slate-800 text-[8px] font-bold text-amber-400">
                {xp} XP Total
              </div>
            </div>

            {/* Level metadata */}
            <div className="flex-1 w-full flex flex-col gap-3">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1.5">
                <div>
                  <h2 className="text-lg font-bold text-white">English Explorer</h2>
                  <span className="text-[10px] text-slate-400 uppercase font-mono tracking-wider">Student ID: {student.id} • Class: {student.currentClass}</span>
                </div>
                <div className="text-[10px] font-bold text-slate-400">
                  {100 - levelProgress} XP until Level {currentLevel + 1}
                </div>
              </div>

              {/* Progress bar */}
              <div className="w-full bg-slate-950 border border-slate-850 rounded-full h-3.5 overflow-hidden p-0.5 shadow-inner">
                <div 
                  className={`h-full ${progressBg} rounded-full transition-all duration-1000 ease-out`}
                  style={{ width: `${levelProgress}%` }}
                />
              </div>

              <div className="flex items-center gap-4 text-[10px] text-slate-400 font-bold uppercase tracking-wider">
                <span className="flex items-center gap-1.5">
                  <Award className="w-4 h-4 text-amber-400" />
                  <span>Rank: Apprentice</span>
                </span>
                <span className="flex items-center gap-1.5">
                  <Compass className="w-4 h-4 text-indigo-400" />
                  <span>Unlocked Grade: {student.currentGrade}</span>
                </span>
              </div>
            </div>
          </div>
        )}

        {/* Dynamic Curriculum Pathway */}
        <div className="flex flex-col gap-4">
          <div>
            <h3 className="text-base font-bold text-white uppercase tracking-wider flex items-center gap-2">
              <BookOpen className={`w-5 h-5 ${accentColor}`} />
              <span>Progressive Learning Pathway</span>
            </h3>
            <p className="text-xs text-slate-500">Answer correct assessment nodes consecutively to level up and earn high accolades!</p>
          </div>

          {isLoadingTopics ? (
            <div className="py-16 flex justify-center">
              <svg className="animate-spin h-8 w-8 text-indigo-400" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
              </svg>
            </div>
          ) : topics.length === 0 ? (
            <div className="py-12 text-center text-xs text-slate-500 border border-dashed border-slate-850 rounded-2xl">
              No learning pathway nodes mapped yet. Check back soon!
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-2">
              {topics.map((t, idx) => {
                // First topic is always unlocked. Order 2 requires 50 XP
                const isUnlocked = idx === 0 || xp >= 50;

                return (
                  <div
                    key={t.id}
                    className={`bg-slate-900/60 border ${isUnlocked ? borderHighlight : 'border-slate-900/50'} rounded-3xl p-6 transition-all duration-300 flex flex-col justify-between gap-6 relative`}
                  >
                    {!isUnlocked && (
                      <div className="absolute top-4 right-4 w-8 h-8 rounded-full bg-slate-950/80 border border-slate-850 flex items-center justify-center text-slate-500">
                        <Lock className="w-3.5 h-3.5" />
                      </div>
                    )}

                    <div className="flex flex-col gap-2.5">
                      <div className="flex items-center gap-2">
                        <span className={`px-2 py-0.5 rounded bg-slate-950 border border-slate-800 text-[8px] font-mono font-bold tracking-widest ${accentColor}`}>
                          MILESTONE {idx + 1}
                        </span>
                        <span className="text-[9px] text-slate-400 font-bold uppercase tracking-wider">{t.xpReward} XP Payout</span>
                      </div>

                      <h4 className={`text-base font-bold ${isUnlocked ? 'text-white' : 'text-slate-500'}`}>{t.title}</h4>
                      <p className={`text-xs ${isUnlocked ? 'text-slate-400' : 'text-slate-600'} leading-relaxed`}>{t.description}</p>
                    </div>

                    {isUnlocked ? (
                      <Link
                        href={`/student/quiz/${t.id}`}
                        className={`flex items-center justify-center gap-2 bg-slate-950 border border-slate-850 hover:bg-slate-900 text-xs font-bold text-white rounded-xl py-3 shadow-md transition-all duration-300 group`}
                      >
                        <Play className={`w-3.5 h-3.5 ${accentColor} group-hover:scale-110 transition-transform`} />
                        <span>Start Milestone Quiz</span>
                      </Link>
                    ) : (
                      <button
                        disabled
                        className="flex items-center justify-center gap-2 bg-slate-950/20 border border-slate-900 text-xs font-bold text-slate-600 rounded-xl py-3 cursor-not-allowed"
                      >
                        <span>Unlocks at 50 XP</span>
                      </button>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>

      </main>
    </div>
  );
}
