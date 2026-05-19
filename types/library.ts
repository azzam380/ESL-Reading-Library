export interface Book {
  id: string;              // Unique book UID
  title: string;
  author: string;
  coverUrl?: string;
  description: string;
  lexileLevel: string;     // e.g. "450L" (Standard ESL reading framework measure)
  wordCount: number;       // Tracks words read for reading metrics
  pages: number;
  schoolId: string;        // "global" for shared library, or e.g. "AAR" for custom school books
  createdAt: string;
}

export interface ReadingSession {
  id: string;
  studentId: string;       // e.g. "AAR-0001"
  schoolId: string;        // e.g. "AAR"
  bookId: string;
  startedAt: string;
  completedAt?: string;
  status: 'reading' | 'completed';
  pagesRead: number;       // Current progress
  timeSpentSeconds: number;// Interactive tracker timer
  wordsCounted: number;    // Calculated: (pagesRead/totalPages) * wordCount
}

export interface StudentProgress {
  studentId: string;
  schoolId: string;
  totalBooksRead: number;
  totalMinutesRead: number;
  totalWordsRead: number;
  averageLexile: number;   // Calculated dynamic rating based on books read
  lastReadDate?: string;
}
