import { TopicEntity, QuestionEntity } from '@/types/quiz';

export interface QuestionRepository {
  /**
   * Retrieves a learning topic by its unique ID
   */
  getTopicById(schoolId: string, id: string): Promise<TopicEntity | null>;

  /**
   * Lists all learning topics for a given school tenant sorted by their order sequence
   */
  listTopics(schoolId: string): Promise<TopicEntity[]>;

  /**
   * Saves a new learning topic record to the database
   */
  createTopic(topic: TopicEntity): Promise<void>;

  /**
   * Retrieves a single assessment question by its unique ID
   */
  getQuestionById(schoolId: string, id: string): Promise<QuestionEntity | null>;

  /**
   * Lists all structured questions belonging to a specific topic
   */
  listQuestionsByTopic(schoolId: string, topicId: string): Promise<QuestionEntity[]>;

  /**
   * Saves a new question record linked to a topic
   */
  createQuestion(question: QuestionEntity): Promise<void>;
}
