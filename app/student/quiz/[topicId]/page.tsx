'use client';

import React, { useEffect, use } from 'react';
import { useQuizController } from '@/lib/controllers/QuizController';
import { ChevronRight, CheckCircle2, XCircle, Award, ArrowLeft, HelpCircle } from 'lucide-react';
import Link from 'next/link';

interface QuizPageProps {
  params: Promise<{
    topicId: string;
  }>;
}

export default function StudentQuizPage({ params }: QuizPageProps) {
  const resolvedParams = use(params);
  const topicId = resolvedParams.topicId;

  const {
    student,
    topic,
    questions,
    currentQuestionIndex,
    selectedAnswer,
    setSelectedAnswer,
    isAnswered,
    isCorrect,
    score,
    xpEarned,
    quizCompleted,
    isLoading,
    error,
    loadQuiz,
    submitAnswer,
    nextQuestion
  } = useQuizController();

  useEffect(() => {
    if (topicId) {
      loadQuiz(topicId);
    }
  }, [topicId, loadQuiz]);

  const isAAR = student?.schoolId === 'AAR';
  const accentColor = isAAR ? 'text-emerald-400' : 'text-sky-400';
  const progressBg = isAAR ? 'bg-emerald-500' : 'bg-sky-500';
  const focusBorder = isAAR ? 'focus:ring-emerald-500/40 focus:border-emerald-400' : 'focus:ring-sky-500/40 focus:border-sky-400';

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-950 text-slate-100 flex items-center justify-center">
        <svg className="animate-spin h-8 w-8 text-indigo-400" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
        </svg>
      </div>
    );
  }

  if (error || !topic || questions.length === 0) {
    return (
      <div className="min-h-screen bg-slate-950 text-slate-100 flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-slate-900 border border-slate-800 rounded-3xl p-6 text-center flex flex-col gap-4">
          <XCircle className="w-12 h-12 text-red-400 mx-auto" />
          <h2 className="text-lg font-bold text-white">Quiz Loading Failed</h2>
          <p className="text-xs text-slate-400">{error || 'This topic card has no questions added yet.'}</p>
          <Link href="/student/dashboard" className="px-4 py-2 bg-slate-950 rounded-xl border border-slate-850 hover:bg-slate-900 text-xs font-bold text-white transition-all">
            Back to Dashboard
          </Link>
        </div>
      </div>
    );
  }

  // A: Victory Recap Screen
  if (quizCompleted) {
    return (
      <main className="min-h-screen bg-slate-950 text-slate-100 flex flex-col items-center justify-center p-4 relative overflow-hidden">
        {/* Glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 rounded-full bg-indigo-900/5 blur-[100px] pointer-events-none" />
        
        <div className="w-full max-w-md bg-slate-900 border border-slate-850 rounded-3xl p-6 sm:p-8 shadow-2xl flex flex-col text-center gap-6 z-10">
          
          <div className="relative w-20 h-20 rounded-full bg-slate-950 border border-slate-800 flex items-center justify-center mx-auto shadow-inner">
            <Award className="w-10 h-10 text-amber-400 animate-bounce" />
          </div>

          <div className="flex flex-col gap-1.5">
            <h2 className="text-xl font-extrabold text-white">Milestone Achieved!</h2>
            <span className="text-[10px] text-slate-400 uppercase font-mono tracking-widest">{topic.title}</span>
          </div>

          {/* Stats Recap */}
          <div className="grid grid-cols-2 gap-4 bg-slate-950/60 rounded-2xl p-4 border border-slate-850">
            <div className="flex flex-col gap-1 border-r border-slate-850">
              <span className="text-[8px] text-slate-500 font-bold uppercase tracking-wider">ACCURACY</span>
              <span className={`text-base font-bold ${accentColor}`}>{score} / {questions.length} Correct</span>
            </div>
            <div className="flex flex-col gap-1">
              <span className="text-[8px] text-slate-500 font-bold uppercase tracking-wider">XP REWARDS</span>
              <span className="text-base font-bold text-amber-400">+{xpEarned} XP</span>
            </div>
          </div>

          <p className="text-[11px] text-slate-400">Your cumulative XP and progress level has been safely synced with Al-Ameen cloud servers.</p>

          <Link
            href="/student/dashboard"
            className={`w-full ${isAAR ? 'bg-emerald-600 hover:bg-emerald-500' : 'bg-sky-600 hover:bg-sky-500'} text-white font-bold rounded-xl py-3 text-xs shadow-lg transition-all duration-300`}
          >
            Return to Learning Pathway
          </Link>
        </div>
      </main>
    );
  }

  const currentQuestion = questions[currentQuestionIndex];
  const progressPercent = ((currentQuestionIndex + 1) / questions.length) * 100;

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col justify-between">
      {/* Header bar */}
      <header className="border-b border-slate-900 bg-slate-950/60 backdrop-blur-md px-4 py-4 sm:px-6 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Link 
            href="/student/dashboard"
            className="w-10 h-10 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-center text-slate-400 hover:text-white transition-all duration-300"
          >
            <ArrowLeft className="w-4 h-4" />
          </Link>
          <div>
            <span className="text-[9px] text-slate-500 font-bold uppercase tracking-widest">ACTIVE QUIZ ENGINE</span>
            <h1 className="text-xs font-bold text-white uppercase tracking-wider truncate max-w-[200px]">{topic.title}</h1>
          </div>
        </div>

        <div className="text-right">
          <span className="text-[9px] text-slate-500 font-bold uppercase">Progress</span>
          <div className="text-xs font-bold text-white">{currentQuestionIndex + 1} / {questions.length}</div>
        </div>
      </header>

      {/* Progressive Top Progress Bar */}
      <div className="w-full bg-slate-950 h-1.5 overflow-hidden">
        <div 
          className={`h-full ${progressBg} transition-all duration-500 ease-out`}
          style={{ width: `${progressPercent}%` }}
        />
      </div>

      {/* Main assessment area */}
      <main className="flex-1 max-w-xl w-full mx-auto p-4 flex flex-col justify-center gap-6">
        
        {/* Question Prompt Card */}
        <div className="bg-slate-900/60 border border-slate-900 rounded-3xl p-6 sm:p-8 flex flex-col gap-6 shadow-xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 rounded-full bg-indigo-500/5 blur-[50px]" />
          
          <div className="flex items-center gap-2 z-10">
            <span className={`px-2 py-0.5 rounded bg-slate-950 border border-slate-800 text-[8px] font-mono font-bold tracking-widest ${accentColor}`}>
              QUESTION {currentQuestionIndex + 1}
            </span>
            <span className="text-[9px] text-slate-400 font-bold uppercase">{currentQuestion.points} XP node</span>
          </div>

          <h3 className="text-base sm:text-lg font-bold text-white leading-relaxed z-10">{currentQuestion.prompt}</h3>
          
          {/* Answer formatting: Multiple Choice */}
          {currentQuestion.type === 'multiple-choice' && currentQuestion.options && (
            <div className="grid grid-cols-1 gap-3 mt-2 z-10">
              {currentQuestion.options.map((opt, i) => {
                const isSelected = selectedAnswer === opt;
                
                let optionStyle = 'bg-slate-950 border-slate-850 hover:bg-slate-900/50';
                if (isSelected) {
                  optionStyle = isAAR ? 'bg-emerald-950/30 border-emerald-500/50 text-white' : 'bg-sky-950/30 border-sky-500/50 text-white';
                }

                return (
                  <button
                    key={i}
                    disabled={isAnswered}
                    onClick={() => setSelectedAnswer(opt)}
                    className={`w-full border rounded-2xl px-4 py-3 text-left text-xs font-medium text-slate-300 transition-all duration-300 select-none ${optionStyle}`}
                  >
                    {opt}
                  </button>
                );
              })}
            </div>
          )}

          {/* Answer formatting: Translation or Fill-in-the-blank */}
          {currentQuestion.type !== 'multiple-choice' && (
            <div className="flex flex-col gap-1.5 mt-2 z-10">
              <label htmlFor="studentAnswer" className="text-[9px] text-slate-500 font-bold uppercase tracking-wider">Type your answer key</label>
              <input
                id="studentAnswer"
                type="text"
                disabled={isAnswered}
                value={selectedAnswer}
                onChange={(e) => setSelectedAnswer(e.target.value)}
                placeholder="Case-insensitive spelling match..."
                className={`w-full bg-slate-950 border border-slate-850 rounded-2xl px-4 py-3.5 text-xs text-white placeholder-slate-600 outline-none transition-all duration-300 ${focusBorder}`}
              />
            </div>
          )}
        </div>

      </main>

      {/* Bottom control feedback bar */}
      <footer className="border-t border-slate-900 bg-slate-950/80 backdrop-blur-md p-4 flex flex-col gap-4">
        <div className="max-w-xl w-full mx-auto">
          {isAnswered ? (
            <div className="flex flex-col gap-4">
              {isCorrect ? (
                <div className="bg-emerald-950/40 border border-emerald-900/40 rounded-2xl px-4 py-3 text-xs text-emerald-300 font-medium flex items-center gap-2">
                  <CheckCircle2 className="w-5 h-5 text-emerald-400 flex-shrink-0" />
                  <div>
                    <span className="font-bold block">Correct Answer!</span>
                    <span className="text-[10px] text-slate-400">Awesome job! You earned +{currentQuestion.points} XP.</span>
                  </div>
                </div>
              ) : (
                <div className="bg-red-950/40 border border-red-900/40 rounded-2xl px-4 py-3 text-xs text-red-300 font-medium flex items-center gap-2">
                  <XCircle className="w-5 h-5 text-red-400 flex-shrink-0" />
                  <div>
                    <span className="font-bold block">Incorrect answer</span>
                    <span className="text-[10px] text-slate-400">Correct key: <strong className="text-slate-200 font-mono">{currentQuestion.correctAnswer}</strong></span>
                  </div>
                </div>
              )}

              <button
                onClick={nextQuestion}
                className={`w-full ${isAAR ? 'bg-emerald-600 hover:bg-emerald-500' : 'bg-sky-600 hover:bg-sky-500'} text-white font-bold rounded-xl py-3.5 text-xs shadow-lg transition-all duration-300 active:scale-[0.98] flex items-center justify-center gap-1.5`}
              >
                <span>Continue</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <button
              onClick={submitAnswer}
              disabled={!selectedAnswer.trim()}
              className={`w-full ${isAAR ? 'bg-emerald-600 hover:bg-emerald-500' : 'bg-sky-600 hover:bg-sky-500'} text-white font-bold rounded-xl py-3.5 text-xs shadow-lg transition-all duration-300 active:scale-[0.98] disabled:opacity-50 disabled:pointer-events-none flex items-center justify-center`}
            >
              Check Answer
            </button>
          )}
        </div>
      </footer>
    </div>
  );
}
