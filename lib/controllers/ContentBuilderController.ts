import { useState, useEffect, useCallback } from 'react';
import { ContentBuilderUseCase } from '../usecases/ContentBuilderUseCase';
import { FirestoreQuestionRepository } from '../data/FirestoreQuestionRepository';
import { FirestoreStudentRepository } from '../data/FirestoreStudentRepository';
import { TopicEntity, QuestionType } from '@/types/quiz';
import { StudentProfile } from '@/types/student';
import { UserProfile } from '@/types/auth';
import { useRouter } from 'next/navigation';

// Instantiating clean architecture layers as singletons outside render scope
const questionRepo = new FirestoreQuestionRepository();
const studentRepo = new FirestoreStudentRepository();
const useCase = new ContentBuilderUseCase(questionRepo, studentRepo);

export interface UseContentBuilderControllerReturn {
  teacher: UserProfile | null;
  schoolId: string;
  students: StudentProfile[];
  topics: TopicEntity[];
  isLoading: boolean;
  error: string | null;
  success: string | null;

  // New Topic Form states
  newTitle: string;
  setNewTitle: (val: string) => void;
  newDesc: string;
  setNewDesc: (val: string) => void;
  newOrder: number;
  setNewOrder: (val: number) => void;
  newXp: number;
  setNewXp: (val: number) => void;

  // New Question Form states
  qTopicId: string;
  setQTopicId: (val: string) => void;
  qType: QuestionType;
  setQType: (val: QuestionType) => void;
  qPrompt: string;
  setQPrompt: (val: string) => void;
  qOptions: string[];
  setQOptions: (val: string[]) => void;
  qAnswer: string;
  setQAnswer: (val: string) => void;
  qPoints: number;
  setQPoints: (val: number) => void;

  // New Student Registration form states
  regFirstName: string;
  setRegFirstName: (val: string) => void;
  regLastName: string;
  setRegLastName: (val: string) => void;
  regGrade: number;
  setRegGrade: (val: number) => void;
  regClass: string;
  setRegClass: (val: string) => void;

  // Actions
  addTopic: (e: React.FormEvent) => Promise<void>;
  addQuestion: (e: React.FormEvent) => Promise<void>;
  registerStudent: (e: React.FormEvent) => Promise<void>;
  loadData: () => Promise<void>;
}

export function useContentBuilderController(): UseContentBuilderControllerReturn {
  const router = useRouter();
  
  // Auth Session state
  const [teacher, setTeacher] = useState<UserProfile | null>(null);
  const [schoolId, setSchoolId] = useState('AAR');

  // Database lists
  const [students, setStudents] = useState<StudentProfile[]>([]);
  const [topics, setTopics] = useState<TopicEntity[]>([]);
  
  // UX State Indicators
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  // New Topic form parameters
  const [newTitle, setNewTitle] = useState('');
  const [newDesc, setNewDesc] = useState('');
  const [newOrder, setNewOrder] = useState(1);
  const [newXp, setNewXp] = useState(80);

  // New Question form parameters
  const [qTopicId, setQTopicId] = useState('');
  const [qType, setQType] = useState<QuestionType>('multiple-choice');
  const [qPrompt, setQPrompt] = useState('');
  const [qOptions, setQOptions] = useState<string[]>(['', '', '', '']);
  const [qAnswer, setQAnswer] = useState('');
  const [qPoints, setQPoints] = useState(20);

  // Student registration form parameters
  const [regFirstName, setRegFirstName] = useState('');
  const [regLastName, setRegLastName] = useState('');
  const [regGrade, setRegGrade] = useState(5);
  const [regClass, setRegClass] = useState('Alpha');

  // Load Session and verify credentials
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const data = sessionStorage.getItem('pell_session');
      if (!data) {
        router.push('/login');
        return;
      }
      
      const session = JSON.parse(data);
      if (session.type !== 'staff') {
        router.push('/login');
        return;
      }

      setTeacher(session.user);
      setSchoolId(session.schoolId);
    }
  }, [router]);

  const loadData = useCallback(async () => {
    if (!schoolId) return;
    setIsLoading(true);
    setError(null);
    try {
      const studentList = await useCase.getSchoolStudents(schoolId);
      const topicList = await useCase.getSchoolTopics(schoolId);
      
      setStudents(studentList);
      setTopics(topicList);

      // Auto select first topic in the question creator drop-down if available
      if (topicList.length > 0 && !qTopicId) {
        setQTopicId(topicList[0].id);
      }
    } catch (err) {
      const errorObj = err as Error;
      setError(errorObj.message || 'Error loading dashboard lists.');
    } finally {
      setIsLoading(false);
    }
  }, [schoolId, qTopicId]);

  useEffect(() => {
    if (schoolId) {
      loadData();
    }
  }, [schoolId, loadData]);

  // Submit Action: Add Learning Topic
  const addTopic = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    setSuccess(null);

    try {
      await useCase.createTopic({
        schoolId,
        title: newTitle,
        description: newDesc,
        order: Number(newOrder),
        xpReward: Number(newXp)
      });

      setSuccess('Topic created successfully!');
      setNewTitle('');
      setNewDesc('');
      setNewOrder(prev => prev + 1);
      
      // Refresh local topics list
      await loadData();
    } catch (err) {
      const errorObj = err as Error;
      setError(errorObj.message || 'Error creating topic.');
    } finally {
      setIsLoading(false);
    }
  };

  // Submit Action: Add Assessment Question
  const addQuestion = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    setSuccess(null);

    try {
      if (!qTopicId) throw new Error('Please select a topic to attach this question.');

      await useCase.createQuestion({
        schoolId,
        topicId: qTopicId,
        type: qType,
        prompt: qPrompt,
        options: qType === 'multiple-choice' ? qOptions : undefined,
        correctAnswer: qAnswer,
        points: Number(qPoints)
      });

      setSuccess('Question added successfully!');
      setQPrompt('');
      setQAnswer('');
      setQOptions(['', '', '', '']);
    } catch (err) {
      const errorObj = err as Error;
      setError(errorObj.message || 'Error creating question.');
    } finally {
      setIsLoading(false);
    }
  };

  const registerStudent = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    setSuccess(null);

    try {
      const newStudent = await useCase.registerStudent({
        schoolId,
        firstName: regFirstName,
        lastName: regLastName,
        grade: Number(regGrade),
        className: regClass
      });

      setSuccess(`Student registered successfully! Generated ID: ${newStudent.id}`);
      setRegFirstName('');
      setRegLastName('');
    } catch (err) {
      const errorObj = err as Error;
      setError(errorObj.message || 'Error registering student.');
    } finally {
      setIsLoading(false);
      await loadData();
    }
  };

  return {
    teacher,
    schoolId,
    students,
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

    regFirstName,
    setRegFirstName,
    regLastName,
    setRegLastName,
    regGrade,
    setRegGrade,
    regClass,
    setRegClass,

    addTopic,
    addQuestion,
    registerStudent,
    loadData
  };
}
