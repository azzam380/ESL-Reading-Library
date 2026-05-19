import { StudentProfile } from '@/types/student';

export interface StudentRepository {
  /**
   * Retrieves a student by their unique permanent ID (e.g. AAR-0001)
   */
  getById(schoolId: string, studentId: string): Promise<StudentProfile | null>;

  /**
   * Creates or registers a new student record
   */
  create(student: StudentProfile): Promise<void>;

  /**
   * Atomically increments/decrements a student's cumulative XP score and returns the new total
   */
  updateXp(schoolId: string, studentId: string, xpDelta: number): Promise<number>;

  /**
   * Retrieves all students belonging to a specific school tenant
   */
  listAll(schoolId: string): Promise<StudentProfile[]>;

  /**
   * Retrieves students belonging to a specific class under a school tenant (e.g. "5-Alpha")
   */
  listByClass(schoolId: string, className: string): Promise<StudentProfile[]>;

  /**
   * Updates an existing student profile
   */
  update(student: StudentProfile): Promise<void>;

  /**
   * Deletes a student record
   */
  delete(schoolId: string, studentId: string): Promise<void>;

  /**
   * Completes a learning topic, increments XP, and registers the completed topic ID.
   */
  completeTopic(schoolId: string, studentId: string, topicId: string, xpDelta: number): Promise<StudentProfile>;
}
