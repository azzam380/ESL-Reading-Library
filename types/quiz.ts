export interface TopicEntity {
  id: string;               // Unique Topic ID
  schoolId: string;         // Isolated school id
  title: string;
  description: string;
  order: number;            // Sort index for progressive unlock
  xpReward: number;         // Total XP earned on completion (e.g. 100 XP)
  minGrade?: number;        // Grade lock parameter
  isActive: boolean;
  createdAt: string;
}

export type QuestionType = 'multiple-choice' | 'translation' | 'fill-in-the-blank';

export interface QuestionEntity {
  id: string;
  topicId: string;          // Maps back to Topic
  schoolId: string;
  type: QuestionType;
  prompt: string;           // E.g. "Complete: 'She ____ English every day.'"
  options?: string[];       // Options for multiple-choice
  correctAnswer: string;    // Case-insensitive answer key
  points: number;           // XP value per question (e.g. 20 XP)
  createdAt: string;
}
