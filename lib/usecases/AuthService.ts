import { UserProfile } from '@/types/auth';
import { StudentProfile } from '@/types/student';
import { StudentRepository } from '../repositories/StudentRepository';
import { auth, db, isDemoEnv } from '@/firebase/config';
import { signInWithEmailAndPassword, signOut } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';

// Initial mock users for localized demo environments
const INITIAL_DEMO_USERS: UserProfile[] = [
  {
    uid: 'demo_admin_aar',
    email: 'admin@pell.edu',
    role: 'school-admin',
    schoolId: 'AAR',
    firstName: 'Principal',
    lastName: 'Fatima',
    createdAt: new Date().toISOString()
  },
  {
    uid: 'demo_teacher_aar',
    email: 'teacher@pell.edu',
    role: 'teacher',
    schoolId: 'AAR',
    firstName: 'Ahmad',
    lastName: 'Hariri',
    createdAt: new Date().toISOString()
  },
  {
    uid: 'demo_teacher_bis',
    email: 'teacher.bis@pell.edu',
    role: 'teacher',
    schoolId: 'BIS',
    firstName: 'Chloe',
    lastName: 'Sterling',
    createdAt: new Date().toISOString()
  }
];

export class AuthService {
  constructor(private studentRepo: StudentRepository) {}

  private getDemoUsers(): UserProfile[] {
    if (typeof window === 'undefined') return INITIAL_DEMO_USERS;
    const data = localStorage.getItem('pell_users');
    if (!data) {
      localStorage.setItem('pell_users', JSON.stringify(INITIAL_DEMO_USERS));
      return INITIAL_DEMO_USERS;
    }
    return JSON.parse(data);
  }

  /**
   * Performs hybrid login for both email credentials (teachers/admins)
   * and unique zero-padded Student IDs (e.g. AAR-0001).
   */
  async login(identifier: string, password: string): Promise<{
    user: UserProfile | StudentProfile;
    type: 'staff' | 'student';
  }> {
    const trimmed = identifier.trim();

    if (!trimmed) {
      throw new Error('Please enter a username or Student ID.');
    }

    if (!password) {
      throw new Error('Please enter your password.');
    }

    // A: Detect if it is a Student ID (starts with a letters hyphen, e.g. AAR-0001, and contains no "@")
    if (!trimmed.includes('@')) {
      const parts = trimmed.split('-');
      if (parts.length !== 2 || !parts[0] || !parts[1]) {
        throw new Error('Invalid Student ID format. Please use "SCHOOL-0000" format (e.g. AAR-0001).');
      }

      const schoolId = parts[0].toUpperCase();
      const studentId = trimmed.toUpperCase();

      // Verify the student profile exists in our repository before performing authentication
      const student = await this.studentRepo.getById(schoolId, studentId);
      if (!student) {
        throw new Error(`No student record found for ID: ${studentId} in School: ${schoolId}`);
      }

      const virtualEmail = `${studentId.toLowerCase()}@student.pell.internal`;

      if (isDemoEnv()) {
        // Simple demo password match validation
        if (password !== '12345' && password !== studentId) {
          throw new Error('Incorrect password. For demo students, please use password "12345".');
        }
        
        return {
          user: student,
          type: 'student'
        };
      }

      try {
        // Live client authentication
        await signInWithEmailAndPassword(auth, virtualEmail, password);
        return {
          user: student,
          type: 'student'
        };
      } catch (error) {
        const errorObj = error as { code: string };
        console.error('Firebase Auth error for Student ID:', error);
        throw new Error(this.mapAuthErrorMessage(errorObj.code) || 'Authentication failed. Please check your credentials.');
      }
    } 
    
    // B: Standard Staff Email and Password login
    else {
      if (isDemoEnv()) {
        const user = this.getDemoUsers().find(u => u.email.toLowerCase() === trimmed.toLowerCase());
        if (!user) {
          throw new Error(`No registered teacher or administrator found for email: ${trimmed}`);
        }
        
        if (password !== '12345') {
          throw new Error('Incorrect password. For demo teachers, please use password "12345".');
        }

        return {
          user,
          type: 'staff'
        };
      }

      try {
        const creds = await signInWithEmailAndPassword(auth, trimmed, password);
        
        // Fetch User profile doc from Firestore
        const userDocRef = doc(db, 'users', creds.user.uid);
        const userSnap = await getDoc(userDocRef);
        
        if (userSnap.exists()) {
          const userProfile = userSnap.data() as UserProfile;
          return {
            user: userProfile,
            type: 'staff'
          };
        } else {
          // Fallback to minimal profile if Firestore is unwritten
          const minimalProfile: UserProfile = {
            uid: creds.user.uid,
            email: creds.user.email || trimmed,
            role: 'teacher',
            schoolId: 'AAR',
            firstName: 'Teacher',
            lastName: 'Staff',
            createdAt: new Date().toISOString()
          };
          return {
            user: minimalProfile,
            type: 'staff'
          };
        }
      } catch (error) {
        const errorObj = error as { code: string };
        console.error('Firebase Auth error for Staff Email:', error);
        throw new Error(this.mapAuthErrorMessage(errorObj.code) || 'Authentication failed. Please check your credentials.');
      }
    }
  }

  async logout(): Promise<void> {
    if (isDemoEnv()) return;
    try {
      await signOut(auth);
    } catch (error) {
      console.error('Error logging out:', error);
    }
  }

  private mapAuthErrorMessage(code: string): string | null {
    switch (code) {
      case 'auth/invalid-credential':
      case 'auth/wrong-password':
      case 'auth/user-not-found':
        return 'Incorrect username/ID or password. Please try again.';
      case 'auth/user-disabled':
        return 'This account has been disabled by administrators.';
      case 'auth/too-many-requests':
        return 'Too many login attempts. Please wait a few minutes before trying again.';
      default:
        return null;
    }
  }
}
