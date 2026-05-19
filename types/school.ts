export interface SchoolBranding {
  primaryColor: string;    // e.g. "hsl(215, 80%, 50%)" - Modern dynamic HSL design
  secondaryColor: string;  // e.g. "hsl(280, 80%, 50%)"
  logoUrl?: string;
}

export interface AcademicTerm {
  id: string;              // e.g. "2026-term1"
  name: string;            // e.g. "Term 1"
  startDate: string;
  endDate: string;
  isCurrent: boolean;
}

export interface SchoolConfig {
  schoolId: string;        // e.g. "AAR", "BIS" (Isolated tenant code)
  name: string;            // e.g. "Al-Ameen Academy"
  branding: SchoolBranding;
  studentSequenceCounter: number; // Used for transaction-based safe Student ID padding
  activeTermId?: string;
  terms: AcademicTerm[];
  isActive: boolean;
  createdAt: string;
  updatedAt?: string;
}
