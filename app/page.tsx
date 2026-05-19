'use client';

import React, { useState } from 'react';
import { 
  BookOpen, 
  Users, 
  Settings, 
  BarChart3, 
  User, 
  Plus, 
  Clock, 
  Search, 
  GraduationCap, 
  Shield, 
  Award, 
  Sparkles,
  BookMarked,
  CheckCircle,
  Building
} from 'lucide-react';
import { useSchool } from '../hooks/useSchool';
import { generateStudentId } from '../lib/domain/idGenerator';
import { Book, StudentProfile } from '../types';

export default function Home() {
  const { schoolId, config, setManualSchoolId } = useSchool();
  
  // Dashboard states
  const [activeTab, setActiveTab] = useState<'library' | 'students' | 'school' | 'analytics'>('library');
  const [userRole, setUserRole] = useState<'super-admin' | 'school-admin' | 'teacher' | 'student'>('school-admin');
  
  // Search and filter states
  const [lexileFilter, setLexileFilter] = useState<string>('all');
  const [studentSearch, setStudentSearch] = useState<string>('');
  
  // Active reading state
  const [activeBook, setActiveBook] = useState<Book | null>(null);
  const [readingTimer, setReadingTimer] = useState<number>(0);
  const [timerInterval, setTimerInterval] = useState<ReturnType<typeof setInterval> | null>(null);
  
  // Mock Database state
  const [students, setStudents] = useState<StudentProfile[]>([
    {
      id: 'AAR-0001',
      schoolId: 'AAR',
      seqNumber: 1,
      firstName: 'Fatima',
      lastName: 'Al-Mansoor',
      currentGrade: 5,
      currentClass: '5-Alpha',
      xp: 320,
      enrollmentYear: 2025,
      isActive: true,
      history: [],
      createdAt: new Date().toISOString()
    },
    {
      id: 'AAR-0002',
      schoolId: 'AAR',
      seqNumber: 2,
      firstName: 'Ahmad',
      lastName: 'Hariri',
      currentGrade: 4,
      currentClass: '4-Beta',
      xp: 150,
      enrollmentYear: 2025,
      isActive: true,
      history: [],
      createdAt: new Date().toISOString()
    },
    {
      id: 'BIS-0001',
      schoolId: 'BIS',
      seqNumber: 1,
      firstName: 'Chloe',
      lastName: 'Sterling',
      currentGrade: 5,
      currentClass: '5-Oak',
      xp: 450,
      enrollmentYear: 2026,
      isActive: true,
      history: [],
      createdAt: new Date().toISOString()
    },
    {
      id: 'BIS-0002',
      schoolId: 'BIS',
      seqNumber: 2,
      firstName: 'Oliver',
      lastName: 'Smith',
      currentGrade: 6,
      currentClass: '6-Maple',
      xp: 280,
      enrollmentYear: 2026,
      isActive: true,
      history: [],
      createdAt: new Date().toISOString()
    }
  ]);

  // Form states for creating students
  const [newFirstName, setNewFirstName] = useState('');
  const [newLastName, setNewLastName] = useState('');
  const [newGrade, setNewGrade] = useState(5);
  const [newClass, setNewClass] = useState('A');
  const [isSuccessModal, setIsSuccessModal] = useState(false);
  const [lastCreatedId, setLastCreatedId] = useState('');

  // Mock library items
  const books: Book[] = [
    {
      id: 'b1',
      title: 'The Secret of the Whispering Woods',
      author: 'Evelyn Brooks',
      description: 'Follow Lucas and Maya as they solve ancient riddles deep inside the magical whispering forests.',
      lexileLevel: '350L',
      wordCount: 1200,
      pages: 18,
      schoolId: 'global',
      createdAt: new Date().toISOString()
    },
    {
      id: 'b2',
      title: 'Journey to the Iron Nebula',
      author: 'Marcus Vance',
      description: 'A stellar science-fiction adventure following a young mechanic who builds an interstellar rocket.',
      lexileLevel: '550L',
      wordCount: 3500,
      pages: 34,
      schoolId: 'global',
      createdAt: new Date().toISOString()
    },
    {
      id: 'b3',
      title: 'The Great Baking Battle',
      author: 'Sarah Jenkins',
      description: 'Mia competes in the Junior Pastry Championship to save her grandmother’s cozy bakery.',
      lexileLevel: '450L',
      wordCount: 2200,
      pages: 24,
      schoolId: 'global',
      createdAt: new Date().toISOString()
    },
    {
      id: 'b4',
      title: 'Riddles of the Golden Sphinx',
      author: 'Amir Al-Sayed',
      description: 'A thrilling historical mystery exploring hidden passages inside the Great Pyramid of Giza.',
      lexileLevel: '680L',
      wordCount: 5200,
      pages: 42,
      schoolId: 'global',
      createdAt: new Date().toISOString()
    }
  ];

  // Dynamic values
  const currentSchoolId = schoolId || 'AAR';
  const filteredStudents = students.filter(s => 
    s.schoolId === currentSchoolId && 
    (`${s.firstName} ${s.lastName}`).toLowerCase().includes(studentSearch.toLowerCase())
  );

  const filteredBooks = books.filter(b => 
    lexileFilter === 'all' ? true : b.lexileLevel === lexileFilter
  );

  // Student registration sequence logic
  const handleCreateStudent = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newFirstName || !newLastName) return;

    // Simulate database transaction by counting current tenant students + 1
    const tenantStudents = students.filter(s => s.schoolId === currentSchoolId);
    const nextSeq = tenantStudents.length + 1;
    const permanentId = generateStudentId(currentSchoolId, nextSeq);

    const newStudent: StudentProfile = {
      id: permanentId,
      schoolId: currentSchoolId,
      seqNumber: nextSeq,
      firstName: newFirstName,
      lastName: newLastName,
      currentGrade: Number(newGrade),
      currentClass: `${newGrade}-${newClass.toUpperCase()}`,
      xp: 0,
      enrollmentYear: 2026,
      isActive: true,
      history: [],
      createdAt: new Date().toISOString()
    };

    setStudents([...students, newStudent]);
    setLastCreatedId(permanentId);
    setIsSuccessModal(true);
    setNewFirstName('');
    setNewLastName('');
    
    // Auto close modal
    setTimeout(() => {
      setIsSuccessModal(false);
    }, 4000);
  };

  // Dynamic reading session timer
  const toggleReadingSession = (book: Book) => {
    if (activeBook && activeBook.id === book.id) {
      // Pause
      if (timerInterval) clearInterval(timerInterval);
      setTimerInterval(null);
      setActiveBook(null);
    } else {
      // Start/Resume
      if (timerInterval) clearInterval(timerInterval);
      setActiveBook(book);
      setReadingTimer(0);
      const interval = setInterval(() => {
        setReadingTimer(prev => prev + 1);
      }, 1000);
      setTimerInterval(interval);
    }
  };

  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  return (
    <div className="flex flex-1 flex-col md:flex-row min-h-screen bg-slate-950">
      
      {/* Dynamic Shell Settings Panel (Super-Admin Context Changer) */}
      <div className="md:hidden glassmorphism px-4 py-3 flex items-center justify-between z-50">
        <div className="flex items-center gap-2">
          <BookMarked className="w-6 h-6 text-school-primary" />
          <span className="font-display font-bold text-lg text-white">LEARN LIB</span>
        </div>
        <div className="flex items-center gap-2">
          <select 
            value={currentSchoolId} 
            onChange={(e) => setManualSchoolId(e.target.value)}
            className="bg-slate-900 border border-slate-700 text-xs rounded px-2 py-1 text-white"
          >
            <option value="AAR">Al-Ameen (AAR)</option>
            <option value="BIS">British Int (BIS)</option>
          </select>
        </div>
      </div>

      {/* Dynamic Responsive Sidebar */}
      <aside className="hidden md:flex flex-col w-72 glassmorphism border-r border-slate-800 p-6 gap-8">
        
        {/* Brand Header */}
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl brand-gradient flex items-center justify-center brand-glow">
            <BookMarked className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="font-display font-extrabold text-xl tracking-tight text-white leading-none">PELL</h1>
            <p className="text-[10px] text-slate-400 font-medium uppercase tracking-widest mt-1">Learning Library</p>
          </div>
        </div>

        {/* Tenant Config Indicator */}
        <div className="glassmorphism-light rounded-xl p-4 border border-slate-800/80">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-school-primary/20 flex items-center justify-center border border-school-primary/30">
              <Building className="w-4 h-4 text-school-primary" />
            </div>
            <div>
              <p className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider leading-none">Active School</p>
              <h3 className="text-sm font-display font-bold text-white mt-1 leading-tight">
                {config?.name || 'Loading Academy...'}
              </h3>
            </div>
          </div>

          <div className="mt-3.5 pt-3 border-t border-slate-800/60 flex items-center justify-between">
            <span className="text-[10px] text-slate-400">ID Prefix:</span>
            <span className="text-xs font-mono font-bold bg-slate-900 px-2 py-0.5 rounded border border-slate-800 text-school-primary uppercase">
              {currentSchoolId}
            </span>
          </div>
        </div>

        {/* Navigation Menu */}
        <nav className="flex-1 flex flex-col gap-1">
          <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider px-3 mb-2">MAIN DESK</span>
          
          <button 
            onClick={() => setActiveTab('library')}
            className={`w-full flex items-center gap-3.5 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 ${
              activeTab === 'library' 
                ? 'bg-gradient-to-r from-school-primary/15 to-school-secondary/5 text-white border-l-4 border-school-primary shadow-sm shadow-school-primary/5' 
                : 'text-slate-400 hover:bg-slate-900/60 hover:text-white'
            }`}
          >
            <BookOpen className="w-4.5 h-4.5" />
            ESL Library Books
          </button>

          {(userRole === 'school-admin' || userRole === 'teacher') && (
            <button 
              onClick={() => setActiveTab('students')}
              className={`w-full flex items-center gap-3.5 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 ${
                activeTab === 'students' 
                  ? 'bg-gradient-to-r from-school-primary/15 to-school-secondary/5 text-white border-l-4 border-school-primary shadow-sm shadow-school-primary/5' 
                  : 'text-slate-400 hover:bg-slate-900/60 hover:text-white'
              }`}
            >
              <Users className="w-4.5 h-4.5" />
              Student Register
            </button>
          )}

          <button 
            onClick={() => setActiveTab('analytics')}
            className={`w-full flex items-center gap-3.5 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 ${
              activeTab === 'analytics' 
                ? 'bg-gradient-to-r from-school-primary/15 to-school-secondary/5 text-white border-l-4 border-school-primary shadow-sm shadow-school-primary/5' 
                : 'text-slate-400 hover:bg-slate-900/60 hover:text-white'
            }`}
          >
            <BarChart3 className="w-4.5 h-4.5" />
            Reading Metrics
          </button>

          <button 
            onClick={() => setActiveTab('school')}
            className={`w-full flex items-center gap-3.5 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 ${
              activeTab === 'school' 
                ? 'bg-gradient-to-r from-school-primary/15 to-school-secondary/5 text-white border-l-4 border-school-primary shadow-sm shadow-school-primary/5' 
                : 'text-slate-400 hover:bg-slate-900/60 hover:text-white'
            }`}
          >
            <Settings className="w-4.5 h-4.5" />
            School Settings
          </button>
        </nav>

        {/* Global Controls Panel (Demonstration Toolbar) */}
        <div className="glassmorphism-light rounded-xl p-4 border border-slate-800/80 text-xs flex flex-col gap-3">
          <div className="flex items-center gap-1.5 text-school-primary font-bold">
            <Sparkles className="w-3.5 h-3.5" />
            <span>SaaS Sandbox Controls</span>
          </div>
          
          <div className="flex flex-col gap-1.5">
            <label className="text-[10px] text-slate-400 font-semibold uppercase">Toggle School Tenant</label>
            <div className="grid grid-cols-2 gap-1 bg-slate-900/60 p-0.5 rounded-lg border border-slate-850">
              <button 
                onClick={() => setManualSchoolId('AAR')}
                className={`py-1 rounded font-medium text-[10px] ${currentSchoolId === 'AAR' ? 'bg-school-primary text-white font-bold' : 'text-slate-400'}`}
              >
                Al-Ameen
              </button>
              <button 
                onClick={() => setManualSchoolId('BIS')}
                className={`py-1 rounded font-medium text-[10px] ${currentSchoolId === 'BIS' ? 'bg-school-primary text-white font-bold' : 'text-slate-400'}`}
              >
                British Int
              </button>
            </div>
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-[10px] text-slate-400 font-semibold uppercase">Simulate Role View</label>
            <select 
              value={userRole} 
              onChange={(e: React.ChangeEvent<HTMLSelectElement>) => {
                setUserRole(e.target.value as 'super-admin' | 'school-admin' | 'teacher' | 'student');
                if (e.target.value === 'student') setActiveTab('library');
              }}
              className="w-full bg-slate-900 border border-slate-800 rounded p-1.5 text-[11px] text-slate-300 font-medium"
            >
              <option value="school-admin">School Admin</option>
              <option value="teacher">Teacher</option>
              <option value="student">Student</option>
            </select>
          </div>
        </div>

      </aside>

      {/* Main Panel Content Area */}
      <main className="flex-1 flex flex-col min-w-0">
        
        {/* Dynamic Top Header */}
        <header className="glassmorphism border-b border-slate-800 p-6 flex flex-col sm:flex-row gap-4 items-center justify-between">
          <div>
            <h2 className="text-2xl font-display font-extrabold text-white text-gradient leading-none">
              {activeTab === 'library' && 'ESL Reading Library'}
              {activeTab === 'students' && 'Academic Student Directory'}
              {activeTab === 'school' && 'Tenant Configuration & Branding'}
              {activeTab === 'analytics' && 'Reading Progress & Metrics'}
            </h2>
            <p className="text-xs text-slate-400 mt-1 font-medium">
              {activeTab === 'library' && 'Encouraging reading fluency with custom vocabulary Lexile targets.'}
              {activeTab === 'students' && 'Safeguarding permanent student identifiers with dynamic classroom rollovers.'}
              {activeTab === 'school' && 'Tailor HSL visual assets, academic terms, and sequence counts.'}
              {activeTab === 'analytics' && 'Realtime charts tracking words read, Lexile improvement, and session metrics.'}
            </p>
          </div>

          {/* User Profile Info Card */}
          <div className="flex items-center gap-3 glassmorphism-light rounded-xl px-4 py-2 border border-slate-800/80">
            <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-school-primary to-school-secondary flex items-center justify-center">
              <User className="w-4 h-4 text-white" />
            </div>
            <div className="text-left">
              <h4 className="text-xs font-bold text-white leading-none">
                {userRole === 'school-admin' && 'Principal Amina'}
                {userRole === 'teacher' && 'Teacher Clara'}
                {userRole === 'student' && 'Student Fatima'}
              </h4>
              <span className="text-[10px] text-slate-400 capitalize inline-block mt-0.5">
                {userRole.replace('-', ' ')}
              </span>
            </div>
          </div>
        </header>

        {/* Dynamic Workspaces */}
        <section className="flex-1 p-6 md:p-8 overflow-y-auto">
          
          {/* TAB 1: LIBRARY BOOK EXPLORER */}
          {activeTab === 'library' && (
            <div className="flex flex-col gap-6">
              
              {/* Active Reading Timer widget */}
              {activeBook && (
                <div className="brand-glow glassmorphism rounded-2xl p-5 border border-school-primary/40 flex flex-col md:flex-row items-center justify-between gap-4">
                  <div className="flex items-center gap-4">
                    <div className="animate-pulse p-2 rounded-xl bg-school-primary/20 flex items-center justify-center border border-school-primary/30">
                      <Clock className="w-5 h-5 text-school-primary" />
                    </div>
                    <div>
                      <span className="text-[9px] font-bold text-school-primary uppercase tracking-widest leading-none">Active Reading Session</span>
                      <h4 className="text-base font-display font-extrabold text-white mt-1 leading-tight">{activeBook.title}</h4>
                      <p className="text-xs text-slate-400 mt-0.5">Author: {activeBook.author} | target: {activeBook.lexileLevel}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-5">
                    <div className="text-center md:text-right">
                      <span className="text-[10px] text-slate-400 uppercase font-semibold">TIMER</span>
                      <div className="text-2xl font-mono font-extrabold text-white leading-none mt-1">
                        {formatTime(readingTimer)}
                      </div>
                    </div>
                    <button 
                      onClick={() => toggleReadingSession(activeBook)}
                      className="bg-red-500/20 hover:bg-red-500/30 text-red-300 font-bold border border-red-550/40 rounded-xl px-4 py-2 text-xs transition"
                    >
                      Stop Session
                    </button>
                  </div>
                </div>
              )}

              {/* Filters Toolbar */}
              <div className="flex flex-col sm:flex-row gap-4 items-center justify-between bg-slate-900/40 border border-slate-850 p-4 rounded-2xl">
                <div className="flex items-center gap-2 bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 w-full sm:max-w-xs">
                  <Search className="w-4 h-4 text-slate-400" />
                  <input 
                    type="text" 
                    placeholder="Search books..." 
                    className="bg-transparent border-none text-xs text-slate-200 outline-none w-full placeholder-slate-500" 
                  />
                </div>
                <div className="flex items-center gap-2 w-full sm:w-auto">
                  <span className="text-xs text-slate-400 shrink-0 font-medium">Lexile Target:</span>
                  <div className="flex gap-1 overflow-x-auto p-0.5 bg-slate-950 border border-slate-800 rounded-xl w-full">
                    {['all', '350L', '450L', '550L', '680L'].map((level) => (
                      <button
                        key={level}
                        onClick={() => setLexileFilter(level)}
                        className={`text-[10px] font-bold px-3 py-1.5 rounded-lg uppercase tracking-wider transition ${
                          lexileFilter === level 
                            ? 'bg-school-primary text-white font-extrabold' 
                            : 'text-slate-400 hover:text-white'
                        }`}
                      >
                        {level}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Book Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {filteredBooks.map((book) => {
                  const isCurrentBookActive = activeBook?.id === book.id;
                  return (
                    <div 
                      key={book.id} 
                      className={`glassmorphism rounded-2xl overflow-hidden hover:scale-[1.02] transition-all duration-300 flex flex-col group ${
                        isCurrentBookActive ? 'ring-2 ring-school-primary' : 'border border-slate-850'
                      }`}
                    >
                      
                      {/* Cover Placeholder */}
                      <div className="h-44 brand-gradient relative flex items-center justify-center group-hover:opacity-90 transition-opacity">
                        <BookOpen className="w-12 h-12 text-white/50" />
                        <div className="absolute top-3 right-3 bg-slate-900/90 backdrop-blur border border-slate-700/50 rounded-lg px-2.5 py-1 text-[10px] font-bold text-school-primary font-mono shadow-md">
                          {book.lexileLevel}
                        </div>
                      </div>

                      {/* Content details */}
                      <div className="p-5 flex-1 flex flex-col justify-between">
                        <div>
                          <h4 className="font-display font-extrabold text-base text-white group-hover:text-school-primary transition-colors leading-snug">
                            {book.title}
                          </h4>
                          <span className="text-xs text-slate-400 font-medium inline-block mt-0.5">By {book.author}</span>
                          <p className="text-xs text-slate-400 mt-2.5 line-clamp-3 leading-relaxed">
                            {book.description}
                          </p>
                        </div>

                        <div className="mt-5 pt-4 border-t border-slate-800/80 flex items-center justify-between">
                          <span className="text-[10px] font-mono text-slate-400">
                            {book.wordCount.toLocaleString()} words ({book.pages} pages)
                          </span>
                          <button 
                            onClick={() => toggleReadingSession(book)}
                            className={`rounded-xl px-3.5 py-2 text-xs font-bold transition flex items-center gap-1.5 ${
                              isCurrentBookActive 
                                ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40 hover:bg-amber-500/30' 
                                : 'bg-school-primary text-white hover:opacity-90 shadow shadow-school-primary/20'
                            }`}
                          >
                            {isCurrentBookActive ? (
                              <>
                                <Clock className="w-3.5 h-3.5 animate-spin" />
                                Pause
                              </>
                            ) : (
                              'Start Reading'
                            )}
                          </button>
                        </div>
                      </div>

                    </div>
                  );
                })}
              </div>

            </div>
          )}

          {/* TAB 2: STUDENT MANAGEMENT & ID CREATION */}
          {activeTab === 'students' && (
            <div className="flex flex-col lg:flex-row gap-8">
              
              {/* Left Column: Student Directory */}
              <div className="flex-1 flex flex-col gap-6">
                <div className="flex flex-col sm:flex-row gap-4 items-center justify-between bg-slate-900/40 border border-slate-850 p-4 rounded-2xl">
                  <div className="flex items-center gap-2 bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 w-full sm:max-w-xs">
                    <Search className="w-4 h-4 text-slate-400" />
                    <input 
                      type="text" 
                      placeholder="Search students..." 
                      value={studentSearch}
                      onChange={(e) => setStudentSearch(e.target.value)}
                      className="bg-transparent border-none text-xs text-slate-200 outline-none w-full placeholder-slate-500" 
                    />
                  </div>
                  <div className="text-xs text-slate-400 font-medium">
                    Showing <span className="text-school-primary font-bold">{filteredStudents.length}</span> students for tenant <span className="text-school-primary uppercase font-bold">{currentSchoolId}</span>
                  </div>
                </div>

                {/* Directory list table */}
                <div className="glassmorphism rounded-2xl overflow-hidden border border-slate-850">
                  <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse text-xs">
                      <thead>
                        <tr className="bg-slate-900/80 border-b border-slate-850 text-slate-400 font-semibold">
                          <th className="p-4 uppercase tracking-wider">Permanent ID</th>
                          <th className="p-4 uppercase tracking-wider">Full Name</th>
                          <th className="p-4 uppercase tracking-wider">Dynamic Grade</th>
                          <th className="p-4 uppercase tracking-wider">Assigned Room</th>
                          <th className="p-4 uppercase tracking-wider">Status</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-850">
                        {filteredStudents.map((student) => (
                          <tr key={student.id} className="hover:bg-slate-900/30 transition">
                            <td className="p-4 font-mono font-bold text-school-primary">{student.id}</td>
                            <td className="p-4 font-display font-bold text-white">{student.firstName} {student.lastName}</td>
                            <td className="p-4 font-medium text-slate-300">Grade {student.currentGrade}</td>
                            <td className="p-4">
                              <span className="bg-slate-900 border border-slate-800 px-2.5 py-1 rounded text-[10px] font-bold text-slate-300 font-mono">
                                {student.currentClass}
                              </span>
                            </td>
                            <td className="p-4">
                              <span className="inline-flex items-center gap-1.5 text-emerald-400 font-bold bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20 text-[10px]">
                                <CheckCircle className="w-3 h-3" />
                                Active
                              </span>
                            </td>
                          </tr>
                        ))}
                        {filteredStudents.length === 0 && (
                          <tr>
                            <td colSpan={5} className="p-8 text-center text-slate-500 font-medium">
                              No students registered under this school tenant yet. Use the sidebar sandbox controls to switch schools or add one!
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>

              {/* Right Column: Register Student Form */}
              <div className="w-full lg:w-96 flex flex-col gap-6 shrink-0">
                <div className="glassmorphism rounded-2xl p-6 border border-slate-850">
                  <div className="flex items-center gap-2 mb-4">
                    <Plus className="w-5 h-5 text-school-primary" />
                    <h3 className="text-base font-display font-extrabold text-white">Add New ESL Student</h3>
                  </div>
                  
                  <form onSubmit={handleCreateStudent} className="flex flex-col gap-4">
                    <div className="flex flex-col gap-1.5">
                      <label className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">FIRST NAME</label>
                      <input 
                        type="text" 
                        required
                        value={newFirstName}
                        onChange={(e) => setNewFirstName(e.target.value)}
                        placeholder="Enter first name"
                        className="bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-white outline-none focus:border-school-primary transition w-full"
                      />
                    </div>

                    <div className="flex flex-col gap-1.5">
                      <label className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">LAST NAME</label>
                      <input 
                        type="text" 
                        required
                        value={newLastName}
                        onChange={(e) => setNewLastName(e.target.value)}
                        placeholder="Enter last name"
                        className="bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-white outline-none focus:border-school-primary transition w-full"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="flex flex-col gap-1.5">
                        <label className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">GRADE TARGET</label>
                        <select 
                          value={newGrade}
                          onChange={(e) => setNewGrade(Number(e.target.value))}
                          className="bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-white outline-none focus:border-school-primary transition w-full"
                        >
                          {[1, 2, 3, 4, 5, 6].map(g => (
                            <option key={g} value={g}>Grade {g}</option>
                          ))}
                        </select>
                      </div>

                      <div className="flex flex-col gap-1.5">
                        <label className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">ROOM/CLASS</label>
                        <input 
                          type="text" 
                          required
                          maxLength={5}
                          value={newClass}
                          onChange={(e) => setNewClass(e.target.value)}
                          placeholder="e.g. Alpha, A"
                          className="bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-white outline-none focus:border-school-primary transition w-full font-bold uppercase"
                        />
                      </div>
                    </div>

                    {/* Sequential ID preview block */}
                    <div className="glassmorphism-light rounded-xl p-4 border border-slate-850 mt-2">
                      <span className="text-[10px] text-slate-400 font-semibold block leading-none">AUTO-ASSIGNED PERMANENT ID PREVIEW</span>
                      <div className="flex items-center justify-between mt-2.5">
                        <span className="text-[11px] text-slate-500 font-semibold uppercase">NEXT COUNTER INDEX</span>
                        <span className="text-xs font-mono font-bold bg-slate-900 border border-slate-800 px-2 py-0.5 rounded text-white">
                          {(students.filter(s => s.schoolId === currentSchoolId).length + 1).toString().padStart(4, '0')}
                        </span>
                      </div>
                      <div className="flex items-center justify-between mt-2 pt-2 border-t border-slate-800/60">
                        <span className="text-[11px] text-slate-400 font-bold uppercase">PERMANENT FORMAT ID</span>
                        <span className="text-sm font-mono font-black text-school-primary uppercase">
                          {generateStudentId(currentSchoolId, students.filter(s => s.schoolId === currentSchoolId).length + 1)}
                        </span>
                      </div>
                    </div>

                    <button 
                      type="submit"
                      className="w-full bg-school-primary text-white font-bold rounded-xl py-3 text-xs mt-3 hover:opacity-90 shadow-lg shadow-school-primary/20 transition duration-200"
                    >
                      Generate Account Profile
                    </button>
                  </form>
                </div>

                {/* Interactive Success Modal Card */}
                {isSuccessModal && (
                  <div className="brand-glow glassmorphism rounded-2xl p-5 border border-emerald-500/40 bg-emerald-950/20 text-slate-200 animate-in fade-in slide-in-from-bottom duration-300">
                    <div className="flex gap-3">
                      <div className="w-8 h-8 rounded-full bg-emerald-500/20 flex items-center justify-center border border-emerald-500/30">
                        <Award className="w-4 h-4 text-emerald-400" />
                      </div>
                      <div>
                        <h4 className="font-display font-extrabold text-sm text-white leading-tight">Student ID Sequenced!</h4>
                        <p className="text-[11px] text-emerald-300 mt-1 leading-normal font-semibold">
                          Transaction secured. Permanent ID generated successfully in Firestore.
                        </p>
                        <div className="mt-3 flex items-center justify-between bg-slate-950/90 border border-slate-850/80 p-2.5 rounded-lg">
                          <span className="text-[9px] font-bold text-slate-400">ASSIGNED ID:</span>
                          <span className="text-xs font-mono font-black text-emerald-400 tracking-wider font-bold">
                            {lastCreatedId}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

              </div>
            </div>
          )}

          {/* TAB 3: TENANT CONFIG & BRANDING EDIT */}
          {activeTab === 'school' && (
            <div className="max-w-3xl flex flex-col gap-6">
              
              {/* Branding Live Demo Card */}
              <div className="glassmorphism rounded-3xl p-8 border border-slate-850 relative overflow-hidden brand-glow">
                
                {/* Visual Ambient glow circle in background based on primary color */}
                <div className="absolute -top-24 -right-24 w-64 h-64 rounded-full brand-gradient blur-3xl opacity-20 pointer-events-none"></div>
                
                <h3 className="text-xl font-display font-extrabold text-white text-gradient">
                  School Branding Customization (Dynamic CSS variables)
                </h3>
                <p className="text-xs text-slate-400 mt-1.5 leading-relaxed">
                  Our architecture uses a dynamic HSL styling bridge. By updating the values stored in your Firestore config document, the frontend automatically updates the UI layout colors without redeploying code.
                </p>

                {/* Color slider demonstration */}
                <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-8 pt-6 border-t border-slate-800/80">
                  <div className="flex flex-col gap-5">
                    <h4 className="text-xs font-bold uppercase text-white tracking-wider flex items-center gap-1.5">
                      <Sparkles className="w-3.5 h-3.5 text-school-primary" />
                      Dynamic HSL Theme Customizer
                    </h4>

                    {/* Color Presets */}
                    <div className="flex flex-col gap-2">
                      <span className="text-[10px] text-slate-500 font-bold uppercase">BRANDING PRESETS</span>
                      <div className="grid grid-cols-3 gap-2">
                        <button 
                          onClick={() => {
                            document.documentElement.style.setProperty('--school-primary', '215 80% 50%');
                            document.documentElement.style.setProperty('--school-secondary', '280 80% 50%');
                          }}
                          className="bg-slate-900 border border-slate-800 rounded-lg p-2.5 flex items-center justify-between text-slate-300 font-bold text-[10px] hover:bg-slate-850"
                        >
                          Ocean Blue
                          <span className="w-3 h-3 rounded-full bg-blue-500"></span>
                        </button>
                        <button 
                          onClick={() => {
                            document.documentElement.style.setProperty('--school-primary', '142 70% 45%');
                            document.documentElement.style.setProperty('--school-secondary', '160 80% 40%');
                          }}
                          className="bg-slate-900 border border-slate-800 rounded-lg p-2.5 flex items-center justify-between text-slate-300 font-bold text-[10px] hover:bg-slate-850"
                        >
                          Emerald Green
                          <span className="w-3 h-3 rounded-full bg-emerald-500"></span>
                        </button>
                        <button 
                          onClick={() => {
                            document.documentElement.style.setProperty('--school-primary', '346 84% 50%');
                            document.documentElement.style.setProperty('--school-secondary', '20 90% 55%');
                          }}
                          className="bg-slate-900 border border-slate-800 rounded-lg p-2.5 flex items-center justify-between text-slate-300 font-bold text-[10px] hover:bg-slate-850"
                        >
                          Crimson Sunset
                          <span className="w-3 h-3 rounded-full bg-rose-500"></span>
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Brand Display Mock mockup */}
                  <div className="glassmorphism-light rounded-2xl p-6 border border-slate-800/80 flex flex-col items-center justify-center gap-4 text-center">
                    <span className="text-[9px] text-slate-500 font-bold uppercase tracking-wider">LIVE THEME BOUNDS PREVIEW</span>
                    <div className="w-14 h-14 rounded-2xl brand-gradient flex items-center justify-center brand-glow">
                      <GraduationCap className="w-7 h-7 text-white" />
                    </div>
                    <div>
                      <h5 className="font-display font-black text-sm text-white">Visual Dynamic Gradient Logo</h5>
                      <p className="text-[11px] text-slate-400 mt-1 max-w-[200px]">This card’s ambient glow updates instantly as colors switch.</p>
                    </div>
                    <div className="flex gap-2">
                      <span className="px-3 py-1 rounded bg-school-primary text-white font-bold text-[10px]">Primary Color</span>
                      <span className="px-3 py-1 rounded bg-school-secondary text-white font-bold text-[10px]">Secondary Color</span>
                    </div>
                  </div>
                </div>

              </div>

              {/* Schema Configuration */}
              <div className="glassmorphism rounded-3xl p-6 border border-slate-850 flex flex-col gap-4">
                <div className="flex items-center gap-2">
                  <Shield className="w-5 h-5 text-school-primary" />
                  <h3 className="text-base font-display font-extrabold text-white">School Operations Config</h3>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-2">
                  <div className="flex flex-col gap-1.5">
                    <span className="text-[10px] text-slate-500 font-bold uppercase">SCHOOL PREPARED NAME</span>
                    <span className="bg-slate-900 border border-slate-800 rounded-xl px-4 py-3 text-xs font-bold text-white">
                      {config?.name || 'Academy Loading...'}
                    </span>
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <span className="text-[10px] text-slate-500 font-bold uppercase">ACADEMIC SECURITY CLAIMS</span>
                    <span className="bg-slate-900 border border-slate-800 rounded-xl px-4 py-3 text-xs font-mono font-bold text-school-primary">
                      enforce.tenantId == &quot;{currentSchoolId}&quot;
                    </span>
                  </div>
                </div>
              </div>

            </div>
          )}

          {/* TAB 4: METRICS & ANALYTICS */}
          {activeTab === 'analytics' && (
            <div className="flex flex-col gap-8">
              
              {/* Stats Widgets */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                
                <div className="glassmorphism rounded-2xl p-6 border border-slate-850 flex items-center justify-between">
                  <div>
                    <span className="text-[10px] text-slate-400 font-bold uppercase">Total Words Read</span>
                    <h3 className="text-3xl font-display font-extrabold text-white mt-1.5">84,250</h3>
                    <p className="text-[11px] text-emerald-400 mt-1 font-semibold flex items-center gap-0.5">
                      +14.2% <span className="text-slate-400">vs last week</span>
                    </p>
                  </div>
                  <div className="p-3.5 rounded-xl bg-school-primary/10 border border-school-primary/20">
                    <Sparkles className="w-6 h-6 text-school-primary" />
                  </div>
                </div>

                <div className="glassmorphism rounded-2xl p-6 border border-slate-850 flex items-center justify-between">
                  <div>
                    <span className="text-[10px] text-slate-400 font-bold uppercase">Reading Time</span>
                    <h3 className="text-3xl font-display font-extrabold text-white mt-1.5">320 min</h3>
                    <p className="text-[11px] text-emerald-400 mt-1 font-semibold flex items-center gap-0.5">
                      +8.4% <span className="text-slate-400">vs last month</span>
                    </p>
                  </div>
                  <div className="p-3.5 rounded-xl bg-school-primary/10 border border-school-primary/20">
                    <Clock className="w-6 h-6 text-school-primary" />
                  </div>
                </div>

                <div className="glassmorphism rounded-2xl p-6 border border-slate-850 flex items-center justify-between">
                  <div>
                    <span className="text-[10px] text-slate-400 font-bold uppercase">Lexile Avg Level</span>
                    <h3 className="text-3xl font-display font-extrabold text-white mt-1.5">480L</h3>
                    <p className="text-[11px] text-school-primary mt-1 font-semibold flex items-center gap-0.5">
                      Target Lexile: 500L
                    </p>
                  </div>
                  <div className="p-3.5 rounded-xl bg-school-primary/10 border border-school-primary/20">
                    <Award className="w-6 h-6 text-school-primary" />
                  </div>
                </div>

              </div>

              {/* Progress charts mockup */}
              <div className="glassmorphism rounded-3xl p-6 md:p-8 border border-slate-850">
                <h3 className="text-lg font-display font-extrabold text-white">Monthly ESL Vocabulary Progress</h3>
                <p className="text-xs text-slate-400 mt-1">Tracks word retention milestones across all classes.</p>
                
                {/* SVG mock Chart */}
                <div className="mt-8 h-64 w-full flex items-end justify-between gap-2.5 md:gap-6 border-b border-l border-slate-800 pb-4 pl-4">
                  {[24, 38, 48, 55, 78, 92].map((val, idx) => (
                    <div key={idx} className="flex-1 flex flex-col items-center gap-2 group h-full justify-end">
                      <div className="text-[10px] font-mono text-school-primary font-bold opacity-0 group-hover:opacity-100 transition-opacity">
                        {(val * 100).toLocaleString()}w
                      </div>
                      <div 
                        style={{ height: `${val}%` }}
                        className="w-full brand-gradient rounded-t-lg brand-glow group-hover:brightness-110 transition-all duration-350 cursor-pointer"
                      ></div>
                      <span className="text-[10px] text-slate-500 font-bold uppercase font-sans mt-1">
                        {['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'][idx]}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

            </div>
          )}

        </section>

      </main>

    </div>
  );
}
