import { useState, useEffect, useCallback } from 'react';
import { FirestoreQuestionRepository } from '../data/FirestoreQuestionRepository';
import { FirestoreStudentRepository } from '../data/FirestoreStudentRepository';
import { TopicEntity, QuestionEntity } from '@/types/quiz';
import { StudentProfile } from '@/types/student';
import { useRouter } from 'next/navigation';

// Instantiating concrete adapters as singletons outside render scope
const questionRepo = new FirestoreQuestionRepository();
const studentRepo = new FirestoreStudentRepository();

export interface UseQuizControllerReturn {
  student: StudentProfile | null;
  topic: TopicEntity | null;
  questions: QuestionEntity[];
  currentQuestionIndex: number;
  selectedAnswer: string;
  setSelectedAnswer: (val: string) => void;
  isAnswered: boolean;
  isCorrect: boolean | null;
  score: number;
  xpEarned: number;
  quizCompleted: boolean;
  isLoading: boolean;
  error: string | null;

  // Actions
  loadQuiz: (topicId: string) => Promise<void>;
  submitAnswer: () => void;
  nextQuestion: () => Promise<void>;
}

export function useQuizController(): UseQuizControllerReturn {
  const router = useRouter();
  const [student, setStudent] = useState<StudentProfile | null>(null);
  const [topic, setTopic] = useState<TopicEntity | null>(null);
  const [questions, setQuestions] = useState<QuestionEntity[]>([]);
  
  // Game states
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState('');
  const [isAnswered, setIsAnswered] = useState(false);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [score, setScore] = useState(0);
  const [xpEarned, setXpEarned] = useState(0);
  const [quizCompleted, setQuizCompleted] = useState(false);
  
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Session state load

  // Load Session and verify credentials
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const data = sessionStorage.getItem('pell_session');
      if (!data) {
        router.push('/login');
        return;
      }
      
      const session = JSON.parse(data);
      if (session.type !== 'student') {
        router.push('/login');
        return;
      }

      setStudent(session.user);
    }
  }, [router]);

  const loadQuiz = useCallback(async (topicId: string) => {
    if (typeof window === 'undefined') return;
    const sessionData = sessionStorage.getItem('pell_session');
    if (!sessionData) return;
    const session = JSON.parse(sessionData);
    const schoolId = session.user.schoolId;

    setIsLoading(true);
    setError(null);

    try {
      const resolvedTopic = await questionRepo.getTopicById(schoolId, topicId);
      const questionList = await questionRepo.listQuestionsByTopic(schoolId, topicId);
      
      if (!resolvedTopic) {
        throw new Error(`Learning topic ${topicId} could not be resolved.`);
      }

      setTopic(resolvedTopic);
      setQuestions(questionList);
    } catch (err) {
      const errorObj = err as Error;
      setError(errorObj.message || 'Error loading quiz parameters.');
    } finally {
      setIsLoading(false);
    }
  }, []);

  const submitAnswer = () => {
    if (isAnswered || !selectedAnswer.trim()) return;

    const currentQuestion = questions[currentQuestionIndex];
    if (!currentQuestion) return;

    const parsedUserAns = selectedAnswer.trim().toLowerCase();
    const parsedCorrectAns = currentQuestion.correctAnswer.trim().toLowerCase();

    const correct = parsedUserAns === parsedCorrectAns;
    setIsCorrect(correct);
    setIsAnswered(true);

    if (correct) {
      setScore(prev => prev + 1);
      setXpEarned(prev => prev + currentQuestion.points);
    }
  };

  const nextQuestion = async () => {
    if (currentQuestionIndex + 1 < questions.length) {
      // Move to next question node
      setCurrentQuestionIndex(prev => prev + 1);
      setSelectedAnswer('');
      setIsAnswered(false);
      setIsCorrect(null);
    } else {
      // Quiz complete! Calculate dynamic payouts and trigger database updates
      setQuizCompleted(true);
      if (student && xpEarned > 0) {
        try {
          const updatedXp = await studentRepo.updateXp(student.schoolId, student.id, xpEarned);
          
          // Sync changes back into active sessionStorage session
          const sessionData = sessionStorage.getItem('pell_session');
          if (sessionData) {
            const parsed = JSON.parse(sessionData);
            parsed.user.xp = updatedXp;
            sessionStorage.setItem('pell_session', JSON.stringify(parsed));
            setStudent(parsed.user);
          }
        } catch (err) {
          console.error('Error writing XP increments to Firestore:', err);
        }
      }
    }
  };

  return {
    student,
    topic,
    questions,
    currentQuestionIndex,
    selectedAnswer,
    setSelectedAnswer,
    isAnswered,
    isCorrect,
    score,
    xpEarned,
    quizCompleted,
    isLoading,
    error,
    loadQuiz,
    submitAnswer,
    nextQuestion
  };
}
