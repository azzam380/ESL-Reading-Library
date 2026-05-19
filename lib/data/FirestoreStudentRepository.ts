import { StudentRepository } from '../repositories/StudentRepository';
import { StudentProfile } from '@/types/student';
import { db, isDemoEnv } from '@/firebase/config';
import { doc, getDoc, setDoc, updateDoc, collection, getDocs, query, where, increment, deleteDoc, arrayUnion } from 'firebase/firestore';

// Initial mock student database for localized demo environments
const INITIAL_DEMO_STUDENTS: StudentProfile[] = [
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
];

export class FirestoreStudentRepository implements StudentRepository {
  private getDemoStudents(): StudentProfile[] {
    if (typeof window === 'undefined') return INITIAL_DEMO_STUDENTS;
    const data = localStorage.getItem('pell_students');
    if (!data) {
      localStorage.setItem('pell_students', JSON.stringify(INITIAL_DEMO_STUDENTS));
      return INITIAL_DEMO_STUDENTS;
    }
    return JSON.parse(data);
  }

  private saveDemoStudents(students: StudentProfile[]) {
    if (typeof window !== 'undefined') {
      localStorage.setItem('pell_students', JSON.stringify(students));
    }
  }

  async getById(schoolId: string, studentId: string): Promise<StudentProfile | null> {
    if (isDemoEnv()) {
      const match = this.getDemoStudents().find(s => s.schoolId === schoolId && s.id === studentId);
      return match || null;
    }

    try {
      const studentDocRef = doc(db, 'schools', schoolId, 'students', studentId);
      const studentSnap = await getDoc(studentDocRef);
      if (studentSnap.exists()) {
        return studentSnap.data() as StudentProfile;
      }
      return null;
    } catch (error) {
      console.error('Error fetching student from Firestore:', error);
      return null;
    }
  }

  async create(student: StudentProfile): Promise<void> {
    if (isDemoEnv()) {
      const students = this.getDemoStudents();
      // Remove duplicates
      const filtered = students.filter(s => !(s.schoolId === student.schoolId && s.id === student.id));
      filtered.push(student);
      this.saveDemoStudents(filtered);
      return;
    }

    try {
      const studentDocRef = doc(db, 'schools', student.schoolId, 'students', student.id);
      await setDoc(studentDocRef, student);
    } catch (error) {
      console.error('Error creating student in Firestore:', error);
      throw error;
    }
  }

  async updateXp(schoolId: string, studentId: string, xpDelta: number): Promise<number> {
    if (isDemoEnv()) {
      const students = this.getDemoStudents();
      const studentIndex = students.findIndex(s => s.schoolId === schoolId && s.id === studentId);
      if (studentIndex !== -1) {
        students[studentIndex].xp = (students[studentIndex].xp || 0) + xpDelta;
        this.saveDemoStudents(students);
        return students[studentIndex].xp;
      }
      throw new Error(`Student ${studentId} not found in local demo environment`);
    }

    try {
      const studentDocRef = doc(db, 'schools', schoolId, 'students', studentId);
      await updateDoc(studentDocRef, {
        xp: increment(xpDelta),
        updatedAt: new Date().toISOString()
      });
      
      // Fetch latest total
      const updatedSnap = await getDoc(studentDocRef);
      if (updatedSnap.exists()) {
        return (updatedSnap.data() as StudentProfile).xp || 0;
      }
      return 0;
    } catch (error) {
      console.error('Error updating student XP in Firestore:', error);
      throw error;
    }
  }

  async listAll(schoolId: string): Promise<StudentProfile[]> {
    if (isDemoEnv()) {
      return this.getDemoStudents().filter(s => s.schoolId === schoolId);
    }

    try {
      const studentsCollRef = collection(db, 'schools', schoolId, 'students');
      const querySnap = await getDocs(studentsCollRef);
      const list: StudentProfile[] = [];
      querySnap.forEach(d => {
        list.push(d.data() as StudentProfile);
      });
      return list;
    } catch (error) {
      console.error('Error listing school students from Firestore:', error);
      return [];
    }
  }

  async listByClass(schoolId: string, className: string): Promise<StudentProfile[]> {
    if (isDemoEnv()) {
      return this.getDemoStudents().filter(s => s.schoolId === schoolId && s.currentClass.toLowerCase() === className.toLowerCase());
    }

    try {
      const studentsCollRef = collection(db, 'schools', schoolId, 'students');
      const q = query(studentsCollRef, where('currentClass', '==', className));
      const querySnap = await getDocs(q);
      const list: StudentProfile[] = [];
      querySnap.forEach(d => {
        list.push(d.data() as StudentProfile);
      });
      return list;
    } catch (error) {
      console.error('Error listing class students from Firestore:', error);
      return [];
    }
  }

  async update(student: StudentProfile): Promise<void> {
    if (isDemoEnv()) {
      const students = this.getDemoStudents();
      const idx = students.findIndex(s => s.schoolId === student.schoolId && s.id === student.id);
      if (idx !== -1) {
        students[idx] = { ...student, updatedAt: new Date().toISOString() };
        this.saveDemoStudents(students);
        return;
      }
      throw new Error(`Student ${student.id} not found in local demo database.`);
    }

    try {
      const studentDocRef = doc(db, 'schools', student.schoolId, 'students', student.id);
      await setDoc(studentDocRef, { ...student, updatedAt: new Date().toISOString() }, { merge: true });
    } catch (error) {
      console.error('Error updating student in Firestore:', error);
      throw error;
    }
  }

  async delete(schoolId: string, studentId: string): Promise<void> {
    if (isDemoEnv()) {
      const students = this.getDemoStudents();
      const filtered = students.filter(s => !(s.schoolId === schoolId && s.id === studentId));
      this.saveDemoStudents(filtered);
      return;
    }

    try {
      const studentDocRef = doc(db, 'schools', schoolId, 'students', studentId);
      await deleteDoc(studentDocRef);
    } catch (error) {
      console.error('Error deleting student from Firestore:', error);
      throw error;
    }
  }

  async completeTopic(schoolId: string, studentId: string, topicId: string, xpDelta: number): Promise<StudentProfile> {
    if (isDemoEnv()) {
      const students = this.getDemoStudents();
      const idx = students.findIndex(s => s.schoolId === schoolId && s.id === studentId);
      if (idx !== -1) {
        const student = students[idx];
        student.xp = (student.xp || 0) + xpDelta;
        const completed = student.completedTopics || [];
        if (!completed.includes(topicId)) {
          completed.push(topicId);
        }
        student.completedTopics = completed;
        student.updatedAt = new Date().toISOString();
        
        students[idx] = student;
        this.saveDemoStudents(students);
        return student;
      }
      throw new Error(`Student ${studentId} not found in local demo database.`);
    }

    try {
      const studentDocRef = doc(db, 'schools', schoolId, 'students', studentId);
      await updateDoc(studentDocRef, {
        xp: increment(xpDelta),
        completedTopics: arrayUnion(topicId),
        updatedAt: new Date().toISOString()
      });
      
      const updatedSnap = await getDoc(studentDocRef);
      if (updatedSnap.exists()) {
        return updatedSnap.data() as StudentProfile;
      }
      throw new Error(`Student ${studentId} could not be refetched after updating.`);
    } catch (error) {
      console.error('Error completing topic in Firestore:', error);
      throw error;
    }
  }
}
