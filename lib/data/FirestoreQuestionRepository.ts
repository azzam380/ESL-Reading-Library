import { QuestionRepository } from '../repositories/QuestionRepository';
import { TopicEntity, QuestionEntity } from '@/types/quiz';
import { db, isDemoEnv } from '@/firebase/config';
import { doc, getDoc, setDoc, collection, getDocs, query, where, orderBy } from 'firebase/firestore';

// Default high-fidelity educational topics for the mock database
const INITIAL_DEMO_TOPICS: TopicEntity[] = [
  {
    id: 't1',
    schoolId: 'AAR',
    title: 'Adventures of the Forest Realm',
    description: 'Explore fundamental vocabulary relating to exploration, wild animals, and geography.',
    order: 1,
    xpReward: 80,
    minGrade: 4,
    isActive: true,
    createdAt: new Date().toISOString()
  },
  {
    id: 't2',
    schoolId: 'AAR',
    title: 'Perfect Actions: Present Perfect tense',
    description: 'Master auxiliary verbs and past participles to talk about life experiences.',
    order: 2,
    xpReward: 100,
    minGrade: 4,
    isActive: true,
    createdAt: new Date().toISOString()
  },
  {
    id: 't1',
    schoolId: 'BIS',
    title: 'Vocabulary of Explorers',
    description: 'Build descriptive phrases and nouns mapping geography, climates, and mountain peaks.',
    order: 1,
    xpReward: 80,
    minGrade: 4,
    isActive: true,
    createdAt: new Date().toISOString()
  },
  {
    id: 't2',
    schoolId: 'BIS',
    title: 'Present Perfect Journeys',
    description: 'Apply auxiliary sentences for talking about destinations and travel achievements.',
    order: 2,
    xpReward: 100,
    minGrade: 4,
    isActive: true,
    createdAt: new Date().toISOString()
  }
];

// Default interactive multi-format assessment questions for the mock database
const INITIAL_DEMO_QUESTIONS: QuestionEntity[] = [
  // AAR Questions (Topic 1)
  {
    id: 'q1_aar',
    topicId: 't1',
    schoolId: 'AAR',
    type: 'multiple-choice',
    prompt: 'Choose the correct adjective: "The ancient forest was filled with ____ trees that grew high into the sky."',
    options: ['tiny', 'gigantic', 'digital', 'liquid'],
    correctAnswer: 'gigantic',
    points: 20,
    createdAt: new Date().toISOString()
  },
  {
    id: 'q2_aar',
    topicId: 't1',
    schoolId: 'AAR',
    type: 'translation',
    prompt: 'Translate into English: "Singa itu tidur di bawah pohon rindang."',
    correctAnswer: 'The lion sleeps under the shady tree',
    points: 30,
    createdAt: new Date().toISOString()
  },
  {
    id: 'q3_aar',
    topicId: 't1',
    schoolId: 'AAR',
    type: 'fill-in-the-blank',
    prompt: 'Complete the sentence: "We walked down the narrow jungle path and stood on the river ____ to watch the fish." (Hint: starts with b)',
    correctAnswer: 'bank',
    points: 30,
    createdAt: new Date().toISOString()
  },
  // BIS Questions (Topic 1)
  {
    id: 'q1_bis',
    topicId: 't1',
    schoolId: 'BIS',
    type: 'multiple-choice',
    prompt: 'Choose the correct option: "The explorers climbed the steep ridge and set up a camp near the ____ of the high mountain."',
    options: ['water', 'peak', 'basement', 'roof'],
    correctAnswer: 'peak',
    points: 20,
    createdAt: new Date().toISOString()
  },
  {
    id: 'q2_bis',
    topicId: 't1',
    schoolId: 'BIS',
    type: 'translation',
    prompt: 'Translate into English: "Mereka berjalan melewati padang gurun yang kering."',
    correctAnswer: 'They walked through the dry desert',
    points: 30,
    createdAt: new Date().toISOString()
  },
  {
    id: 'q3_bis',
    topicId: 't1',
    schoolId: 'BIS',
    type: 'fill-in-the-blank',
    prompt: 'Complete the sentence: "A hot, dry ecosystem that receives very little rainfall is called a ____." (Hint: starts with d)',
    correctAnswer: 'desert',
    points: 30,
    createdAt: new Date().toISOString()
  },
  // AAR Questions (Topic 2)
  {
    id: 'q4_aar',
    topicId: 't2',
    schoolId: 'AAR',
    type: 'multiple-choice',
    prompt: 'Choose the correct verb: "She ____ already visited the beautiful waterfalls of Sumatra."',
    options: ['have', 'has', 'is', 'did'],
    correctAnswer: 'has',
    points: 30,
    createdAt: new Date().toISOString()
  },
  {
    id: 'q5_aar',
    topicId: 't2',
    schoolId: 'AAR',
    type: 'fill-in-the-blank',
    prompt: 'Complete the sentence: "They have ____ (write) three books about wild animals." (Provide the past participle of write)',
    correctAnswer: 'written',
    points: 30,
    createdAt: new Date().toISOString()
  },
  // BIS Questions (Topic 2)
  {
    id: 'q4_bis',
    topicId: 't2',
    schoolId: 'BIS',
    type: 'multiple-choice',
    prompt: 'Choose the correct verb form: "We ____ not eaten lunch yet because we were climbing."',
    options: ['has', 'did', 'have', 'are'],
    correctAnswer: 'have',
    points: 30,
    createdAt: new Date().toISOString()
  },
  {
    id: 'q5_bis',
    topicId: 't2',
    schoolId: 'BIS',
    type: 'fill-in-the-blank',
    prompt: 'Complete the sentence: "She has ____ (go) to the London Library to borrow books." (Provide the past participle of go)',
    correctAnswer: 'gone',
    points: 30,
    createdAt: new Date().toISOString()
  }
];

export class FirestoreQuestionRepository implements QuestionRepository {
  private getDemoTopics(schoolId: string): TopicEntity[] {
    if (typeof window === 'undefined') {
      return INITIAL_DEMO_TOPICS.filter(t => t.schoolId === schoolId);
    }
    const data = localStorage.getItem('pell_topics');
    if (!data) {
      localStorage.setItem('pell_topics', JSON.stringify(INITIAL_DEMO_TOPICS));
      return INITIAL_DEMO_TOPICS.filter(t => t.schoolId === schoolId);
    }
    const parsed: TopicEntity[] = JSON.parse(data);
    return parsed.filter(t => t.schoolId === schoolId);
  }

  private saveDemoTopics(topics: TopicEntity[]) {
    if (typeof window !== 'undefined') {
      localStorage.setItem('pell_topics', JSON.stringify(topics));
    }
  }

  private getDemoQuestions(schoolId: string): QuestionEntity[] {
    if (typeof window === 'undefined') {
      return INITIAL_DEMO_QUESTIONS.filter(q => q.schoolId === schoolId);
    }
    const data = localStorage.getItem('pell_questions');
    if (!data) {
      localStorage.setItem('pell_questions', JSON.stringify(INITIAL_DEMO_QUESTIONS));
      return INITIAL_DEMO_QUESTIONS.filter(q => q.schoolId === schoolId);
    }
    const parsed: QuestionEntity[] = JSON.parse(data);
    return parsed.filter(q => q.schoolId === schoolId);
  }

  private saveDemoQuestions(questions: QuestionEntity[]) {
    if (typeof window !== 'undefined') {
      localStorage.setItem('pell_questions', JSON.stringify(questions));
    }
  }

  async getTopicById(schoolId: string, id: string): Promise<TopicEntity | null> {
    if (isDemoEnv()) {
      const match = this.getDemoTopics(schoolId).find(t => t.id === id);
      return match || null;
    }

    try {
      const docRef = doc(db, 'schools', schoolId, 'topics', id);
      const snap = await getDoc(docRef);
      if (snap.exists()) {
        return snap.data() as TopicEntity;
      }
      return null;
    } catch (error) {
      console.error('Error fetching topic from Firestore:', error);
      return null;
    }
  }

  async listTopics(schoolId: string): Promise<TopicEntity[]> {
    if (isDemoEnv()) {
      return this.getDemoTopics(schoolId).sort((a, b) => a.order - b.order);
    }

    try {
      const collRef = collection(db, 'schools', schoolId, 'topics');
      const q = query(collRef, orderBy('order', 'asc'));
      const snap = await getDocs(q);
      const list: TopicEntity[] = [];
      snap.forEach(d => {
        list.push(d.data() as TopicEntity);
      });
      return list;
    } catch (error) {
      console.error('Error listing topics from Firestore:', error);
      return [];
    }
  }

  async createTopic(topic: TopicEntity): Promise<void> {
    if (isDemoEnv()) {
      // Get all demo topics in memory
      let allTopics: TopicEntity[] = [];
      if (typeof window !== 'undefined') {
        const data = localStorage.getItem('pell_topics');
        allTopics = data ? JSON.parse(data) : INITIAL_DEMO_TOPICS;
      } else {
        allTopics = INITIAL_DEMO_TOPICS;
      }

      // Filter duplicates
      const filtered = allTopics.filter(t => !(t.schoolId === topic.schoolId && t.id === topic.id));
      filtered.push(topic);
      this.saveDemoTopics(filtered);
      return;
    }

    try {
      const docRef = doc(db, 'schools', topic.schoolId, 'topics', topic.id);
      await setDoc(docRef, topic);
    } catch (error) {
      console.error('Error creating topic in Firestore:', error);
      throw error;
    }
  }

  async getQuestionById(schoolId: string, id: string): Promise<QuestionEntity | null> {
    if (isDemoEnv()) {
      const match = this.getDemoQuestions(schoolId).find(q => q.id === id);
      return match || null;
    }

    try {
      const docRef = doc(db, 'schools', schoolId, 'questions', id);
      const snap = await getDoc(docRef);
      if (snap.exists()) {
        return snap.data() as QuestionEntity;
      }
      return null;
    } catch (error) {
      console.error('Error fetching question from Firestore:', error);
      return null;
    }
  }

  async listQuestionsByTopic(schoolId: string, topicId: string): Promise<QuestionEntity[]> {
    if (isDemoEnv()) {
      return this.getDemoQuestions(schoolId).filter(q => q.topicId === topicId);
    }

    try {
      const collRef = collection(db, 'schools', schoolId, 'questions');
      const q = query(collRef, where('topicId', '==', topicId));
      const snap = await getDocs(q);
      const list: QuestionEntity[] = [];
      snap.forEach(d => {
        list.push(d.data() as QuestionEntity);
      });
      return list;
    } catch (error) {
      console.error('Error listing topic questions from Firestore:', error);
      return [];
    }
  }

  async createQuestion(question: QuestionEntity): Promise<void> {
    if (isDemoEnv()) {
      let allQuestions: QuestionEntity[] = [];
      if (typeof window !== 'undefined') {
        const data = localStorage.getItem('pell_questions');
        allQuestions = data ? JSON.parse(data) : INITIAL_DEMO_QUESTIONS;
      } else {
        allQuestions = INITIAL_DEMO_QUESTIONS;
      }

      const filtered = allQuestions.filter(q => !(q.schoolId === question.schoolId && q.id === question.id));
      filtered.push(question);
      this.saveDemoQuestions(filtered);
      return;
    }

    try {
      const docRef = doc(db, 'schools', question.schoolId, 'questions', question.id);
      await setDoc(docRef, question);
    } catch (error) {
      console.error('Error saving question in Firestore:', error);
      throw error;
    }
  }
}
