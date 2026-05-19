export interface AcademicHistoryRecord {
  year: number;            // e.g. 2025
  grade: number;           // e.g. 4
  className: string;       // e.g. "4-A"
  promotedAt: string;      // ISO Date string
  promotedByUid: string;   // UID of Teacher/Admin who executed rollover
}

export interface StudentProfile {
  id: string;              // e.g. "AAR-0001" - The permanent sequential identifier
  schoolId: string;        // e.g. "AAR" - Strict separation
  seqNumber: number;       // e.g. 1 - Clean sequence index
  firstName: string;
  lastName: string;
  email?: string;          // Optional student login email
  
  // Dynamic fields (Updated during annual/semesterly rollovers)
  currentGrade: number;    // e.g. 5 (Grade 5)
  currentClass: string;    // e.g. "5-Alpha"
  xp: number;              // Current cumulative Experience Points (XP)
  
  enrollmentYear: number;  // e.g. 2026
  isActive: boolean;
  history: AcademicHistoryRecord[]; // Historical snapshots
  
  createdAt: string;
  updatedAt?: string;
}
