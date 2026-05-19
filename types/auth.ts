export type UserRole = 'super-admin' | 'school-admin' | 'teacher' | 'student';

export interface UserProfile {
  uid: string;
  email: string;
  role: UserRole;
  schoolId: string;     // Enforces strict multi-tenant data isolation by school
  firstName: string;
  lastName: string;
  createdAt: string;    // ISO timestamp
  updatedAt?: string;   // ISO timestamp
}

export interface TeacherProfile extends UserProfile {
  classes: string[];    // Array of classes this teacher manages, e.g. ["5-Alpha", "4-Beta"]
}

