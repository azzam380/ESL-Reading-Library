'use client';

import React from 'react';
import { useContentBuilderController } from '@/lib/controllers/ContentBuilderController';
import { BookOpen, ArrowLeft, CheckCircle2, AlertTriangle, HelpCircle } from 'lucide-react';
import Link from 'next/link';
import { QuestionType } from '@/types/quiz';

export default function ContentBuilder() {
  const {
    schoolId,
    topics,
    isLoading,
    error,
    success,

    newTitle,
    setNewTitle,
    newDesc,
    setNewDesc,
    newOrder,
    setNewOrder,
    newXp,
    setNewXp,

    qTopicId,
    setQTopicId,
    qType,
    setQType,
    qPrompt,
    setQPrompt,
    qOptions,
    setQOptions,
    qAnswer,
    setQAnswer,
    qPoints,
    setQPoints,

    addTopic,
    addQuestion
  } = useContentBuilderController();

  const isAAR = schoolId === 'AAR';
  const accentColor = isAAR ? 'text-emerald-400' : 'text-sky-400';
  const buttonBg = isAAR ? 'bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500' : 'bg-gradient-to-r from-sky-600 to-blue-600 hover:from-sky-500 hover:to-blue-500';
  const focusColor = isAAR ? 'focus:ring-emerald-500/40 focus:border-emerald-400' : 'focus:ring-sky-500/40 focus:border-sky-400';

  const handleOptionChange = (index: number, val: string) => {
    const updated = [...qOptions];
    updated[index] = val;
    setQOptions(updated);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col">
      {/* Header */}
      <header className="border-b border-slate-900 bg-slate-950/60 backdrop-blur-md sticky top-0 z-40 px-4 py-4 sm:px-6 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Link 
            href="/teacher/dashboard"
            className="w-10 h-10 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-center text-slate-400 hover:text-white transition-all duration-300"
          >
            <ArrowLeft className="w-4 h-4" />
          </Link>
          <div>
            <h1 className="text-sm font-bold text-white uppercase tracking-wider">Content Builder</h1>
            <span className="text-[10px] text-slate-400 font-semibold uppercase">{isAAR ? 'Al-Ameen Academy' : 'British International School'}</span>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 lg:p-8 flex flex-col gap-6">
        
        {/* Status Alerts */}
        {success && (
          <div className="bg-emerald-950/40 border border-emerald-900/50 rounded-2xl px-4 py-3 text-xs text-emerald-300 font-medium flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
            <span>{success}</span>
          </div>
        )}

        {error && (
          <div className="bg-red-950/40 border border-red-900/50 rounded-2xl px-4 py-3 text-xs text-red-300 font-medium flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-red-400 flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
          
          {/* COL 1 & 2: Create Topic Form */}
          <div className="lg:col-span-2 flex flex-col gap-6">
            <div className="bg-slate-900/60 border border-slate-900 rounded-2xl p-5 sm:p-6 flex flex-col gap-5">
              <div className="flex items-center gap-2">
                <BookOpen className={`w-5 h-5 ${accentColor}`} />
                <h2 className="text-base font-bold text-white">Create New Topic</h2>
              </div>
              <p className="text-[11px] text-slate-400 -mt-2">Define curriculum categories that progressive assessments will unlock.</p>

              <form onSubmit={addTopic} className="flex flex-col gap-4">
                
                {/* Title Input */}
                <div className="flex flex-col gap-1">
                  <label htmlFor="topicTitle" className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Topic Title</label>
                  <input
                    id="topicTitle"
                    type="text"
                    value={newTitle}
                    onChange={(e) => setNewTitle(e.target.value)}
                    placeholder="e.g. Travel and Adventure"
                    className={`w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white outline-none transition-all duration-300 ${focusColor}`}
                  />
                </div>

                {/* Description Input */}
                <div className="flex flex-col gap-1">
                  <label htmlFor="topicDesc" className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Description</label>
                  <textarea
                    id="topicDesc"
                    value={newDesc}
                    onChange={(e) => setNewDesc(e.target.value)}
                    placeholder="Describe what key grammatical or vocabulary topics this card covers..."
                    rows={3}
                    className={`w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white outline-none transition-all duration-300 ${focusColor}`}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  {/* Order Input */}
                  <div className="flex flex-col gap-1">
                    <label htmlFor="topicOrder" className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Unlock Order</label>
                    <input
                      id="topicOrder"
                      type="number"
                      value={newOrder}
                      onChange={(e) => setNewOrder(Number(e.target.value))}
                      className={`w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white outline-none transition-all duration-300 ${focusColor}`}
                    />
                  </div>

                  {/* XP Reward */}
                  <div className="flex flex-col gap-1">
                    <label htmlFor="topicXp" className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Completion XP</label>
                    <input
                      id="topicXp"
                      type="number"
                      value={newXp}
                      onChange={(e) => setNewXp(Number(e.target.value))}
                      className={`w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white outline-none transition-all duration-300 ${focusColor}`}
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isLoading}
                  className={`w-full ${buttonBg} text-white font-bold rounded-xl py-2.5 text-xs shadow-lg transition-all duration-300 active:scale-[0.98] mt-2 flex items-center justify-center`}
                >
                  Create Topic Card
                </button>
              </form>
            </div>

            {/* List of existing topics */}
            <div className="bg-slate-900/60 border border-slate-900 rounded-2xl p-5 flex flex-col gap-3">
              <span className="text-[9px] text-slate-500 font-bold uppercase tracking-widest">Active Topics List</span>
              {topics.length === 0 ? (
                <div className="text-center py-4 text-[10px] text-slate-500">No active topics found.</div>
              ) : (
                <div className="flex flex-col gap-2">
                  {topics.map(t => (
                    <div key={t.id} className="flex items-center justify-between p-2.5 bg-slate-950/60 rounded-xl border border-slate-850">
                      <div className="flex flex-col">
                        <span className="text-xs font-bold text-white">{t.title}</span>
                        <span className="text-[9px] text-slate-400">Order: {t.order} • Payout: {t.xpReward} XP</span>
                      </div>
                      <span className="px-2 py-0.5 rounded bg-slate-900 border border-slate-800 text-[9px] font-mono text-slate-400">{t.id}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>

          </div>

          {/* COL 3, 4, 5: Create Question Form */}
          <div className="lg:col-span-3">
            <div className="bg-slate-900/60 border border-slate-900 rounded-2xl p-5 sm:p-6 flex flex-col gap-5">
              <div className="flex items-center gap-2">
                <HelpCircle className={`w-5 h-5 ${accentColor}`} />
                <h2 className="text-base font-bold text-white">Add Question Node</h2>
              </div>
              <p className="text-[11px] text-slate-400 -mt-2">Formulate quiz questions. Link them to active Topic sequences.</p>

              {topics.length === 0 ? (
                <div className="py-12 text-center text-xs text-slate-500 border border-dashed border-slate-850 rounded-xl">
                  Please create at least one learning topic card on the left before adding questions.
                </div>
              ) : (
                <form onSubmit={addQuestion} className="flex flex-col gap-4">
                  
                  {/* Topic Select */}
                  <div className="flex flex-col gap-1">
                    <label htmlFor="selectTopic" className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Target Topic</label>
                    <select
                      id="selectTopic"
                      value={qTopicId}
                      onChange={(e) => setQTopicId(e.target.value)}
                      className={`w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2.5 text-xs text-white outline-none transition-all duration-300 ${focusColor}`}
                    >
                      {topics.map(t => (
                        <option key={t.id} value={t.id}>{t.title} ({t.id})</option>
                      ))}
                    </select>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    {/* Question Type */}
                    <div className="flex flex-col gap-1">
                      <label htmlFor="selectType" className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Assessment Type</label>
                      <select
                        id="selectType"
                        value={qType}
                        onChange={(e) => setQType(e.target.value as QuestionType)}
                        className={`w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2.5 text-xs text-white outline-none transition-all duration-300 ${focusColor}`}
                      >
                        <option value="multiple-choice">Multiple Choice</option>
                        <option value="translation">Translation</option>
                        <option value="fill-in-the-blank">Fill in the blank</option>
                      </select>
                    </div>

                    {/* Question Points */}
                    <div className="flex flex-col gap-1">
                      <label htmlFor="qPoints" className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">XP Points Value</label>
                      <input
                        id="qPoints"
                        type="number"
                        value={qPoints}
                        onChange={(e) => setQPoints(Number(e.target.value))}
                        className={`w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white outline-none transition-all duration-300 ${focusColor}`}
                      />
                    </div>
                  </div>

                  {/* Question Prompt */}
                  <div className="flex flex-col gap-1">
                    <label htmlFor="qPrompt" className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Question Prompt</label>
                    <input
                      id="qPrompt"
                      type="text"
                      value={qPrompt}
                      onChange={(e) => setQPrompt(e.target.value)}
                      placeholder="e.g. Choose the correct form: 'We ____ gone to the peak of the mountain.'"
                      className={`w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2.5 text-xs text-white outline-none transition-all duration-300 ${focusColor}`}
                    />
                  </div>

                  {/* Options: Rendered dynamically for Multiple Choice */}
                  {qType === 'multiple-choice' && (
                    <div className="flex flex-col bg-slate-950/60 rounded-xl p-4 border border-slate-850 gap-3">
                      <span className="text-[9px] text-slate-500 font-bold uppercase">Multiple Choice Options</span>
                      <div className="grid grid-cols-2 gap-3">
                        {qOptions.map((opt, i) => (
                          <div key={i} className="flex flex-col gap-1">
                            <label htmlFor={`opt-${i}`} className="text-[8px] text-slate-400 font-semibold uppercase">Option {i + 1}</label>
                            <input
                              id={`opt-${i}`}
                              type="text"
                              value={opt}
                              onChange={(e) => handleOptionChange(i, e.target.value)}
                              placeholder={`Option ${i + 1}`}
                              className={`bg-slate-900 border border-slate-800 rounded-lg px-2.5 py-1.5 text-xs text-white outline-none transition-all duration-300 ${focusColor}`}
                            />
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Correct Answer */}
                  <div className="flex flex-col gap-1">
                    <label htmlFor="qAnswer" className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">
                      {qType === 'multiple-choice' ? 'Correct Option Match' : 'Correct Phrase / Word Key'}
                    </label>
                    <input
                      id="qAnswer"
                      type="text"
                      value={qAnswer}
                      onChange={(e) => setQAnswer(e.target.value)}
                      placeholder={qType === 'multiple-choice' ? 'Must match one of your options EXACTLY' : 'e.g. peak'}
                      className={`w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2.5 text-xs text-white outline-none transition-all duration-300 ${focusColor}`}
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={isLoading}
                    className={`w-full ${buttonBg} text-white font-bold rounded-xl py-2.5 text-xs shadow-lg transition-all duration-300 active:scale-[0.98] mt-2 flex items-center justify-center`}
                  >
                    Save Question Node
                  </button>
                </form>
              )}

            </div>
          </div>

        </div>

      </main>
    </div>
  );
}
