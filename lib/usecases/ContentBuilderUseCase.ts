import { TopicEntity, QuestionEntity, QuestionType } from '@/types/quiz';
import { StudentProfile } from '@/types/student';
import { QuestionRepository } from '../repositories/QuestionRepository';
import { StudentRepository } from '../repositories/StudentRepository';
import { generateStudentId } from '../domain/idGenerator';

export class ContentBuilderUseCase {
  constructor(
    private questionRepo: QuestionRepository,
    private studentRepo: StudentRepository
  ) {}

  async createTopic(params: {
    schoolId: string;
    title: string;
    description: string;
    order: number;
    xpReward: number;
    minGrade?: number;
  }): Promise<TopicEntity> {
    if (!params.title.trim()) throw new Error('Topic title cannot be empty.');
    if (!params.description.trim()) throw new Error('Topic description cannot be empty.');
    if (params.xpReward <= 0) throw new Error('Topic XP reward must be positive.');

    const topic: TopicEntity = {
      id: `topic_${Date.now()}`,
      schoolId: params.schoolId,
      title: params.title.trim(),
      description: params.description.trim(),
      order: params.order,
      xpReward: params.xpReward,
      minGrade: params.minGrade || 4,
      isActive: true,
      createdAt: new Date().toISOString()
    };

    await this.questionRepo.createTopic(topic);
    return topic;
  }

  async createQuestion(params: {
    schoolId: string;
    topicId: string;
    type: QuestionType;
    prompt: string;
    options?: string[];
    correctAnswer: string;
    points: number;
  }): Promise<QuestionEntity> {
    if (!params.prompt.trim()) throw new Error('Question prompt cannot be empty.');
    if (!params.correctAnswer.trim()) throw new Error('Correct answer key cannot be empty.');
    if (params.points <= 0) throw new Error('Question points must be positive.');

    if (params.type === 'multiple-choice') {
      if (!params.options || params.options.length < 2) {
        throw new Error('Multiple-choice questions require at least two options.');
      }
      const trimmedOptions = params.options.map(o => o.trim()).filter(Boolean);
      if (trimmedOptions.length < 2) {
        throw new Error('Multiple-choice questions require at least two non-empty options.');
      }
      if (!trimmedOptions.includes(params.correctAnswer.trim())) {
        throw new Error('The correct answer must be one of the options.');
      }
    }

    const question: QuestionEntity = {
      id: `q_${Date.now()}`,
      topicId: params.topicId,
      schoolId: params.schoolId,
      type: params.type,
      prompt: params.prompt.trim(),
      options: params.type === 'multiple-choice' ? params.options?.map(o => o.trim()) : undefined,
      correctAnswer: params.correctAnswer.trim(),
      points: params.points,
      createdAt: new Date().toISOString()
    };

    await this.questionRepo.createQuestion(question);
    return question;
  }

  async getSchoolStudents(schoolId: string): Promise<StudentProfile[]> {
    return this.studentRepo.listAll(schoolId);
  }

  async getSchoolTopics(schoolId: string): Promise<TopicEntity[]> {
    return this.questionRepo.listTopics(schoolId);
  }

  async registerStudent(params: {
    schoolId: string;
    firstName: string;
    lastName: string;
    grade: number;
    className: string;
  }): Promise<StudentProfile> {
    if (!params.firstName.trim()) throw new Error('First name cannot be empty.');
    if (!params.lastName.trim()) throw new Error('Last name cannot be empty.');
    if (!params.className.trim()) throw new Error('Class section cannot be empty.');

    const existing = await this.studentRepo.listAll(params.schoolId);
    const nextSeq = existing.length + 1;
    const studentId = generateStudentId(params.schoolId, nextSeq);

    const student: StudentProfile = {
      id: studentId,
      schoolId: params.schoolId,
      seqNumber: nextSeq,
      firstName: params.firstName.trim(),
      lastName: params.lastName.trim(),
      currentGrade: params.grade,
      currentClass: `${params.grade}-${params.className.toUpperCase()}`,
      xp: 0,
      enrollmentYear: new Date().getFullYear(),
      isActive: true,
      history: [],
      createdAt: new Date().toISOString()
    };

    await this.studentRepo.create(student);
    return student;
  }
}
