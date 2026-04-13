export interface Message {
  role: 'user' | 'ai';
  content: string;
}

export interface Question {
  id?: string;
  text: string;
  options: string[];
  correctAnswer: number;
}

export interface ChatRequest {
  message: string;
  history?: Message[];
  context?: string;
}

export interface ChatResponse {
  reply: string;
}

export interface QuizParseResponse {
  questions: Question[];
}

export interface Quiz {
  id: string;
  title: string;
  category: string;
  questionsCount: number;
  timeAgo?: string;
  score?: string;
  icon: string;
  questions?: Question[];
  creatorId?: string;
  isPublic?: boolean;
}

export interface Category {
  id: string;
  name: string;
  icon: string;
  color: string;
}
