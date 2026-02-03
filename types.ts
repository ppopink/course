
export enum Difficulty {
  BEGINNER = '入门',
  EASY = '简单',
  MEDIUM = '中等',
  HARD = '困难'
}

export type QuestionType = 'choice' | 'fill';

export enum Language {
  PYTHON = 'Python',
  C = 'C',
  JAVA = 'Java'
}

export interface Level {
  id: number;
  chapterId: number;
  chapterTitle: string;
  title: string;
  topic: string;
  description: string;
  instruction: string;
  type: QuestionType;
  options?: string[]; 
  template?: string;
  placeholders?: string[]; 
  difficulty: Difficulty;
  points: number;
  isBoss?: boolean;
}

export interface LanguageProgress {
  completedLevels: number[];
  unlockedLevelId: number;
  score: number;
}

export interface GameState {
  currentLanguage: Language | null;
  progress: Record<Language, LanguageProgress>;
}

export interface GradingResult {
  success: boolean;
  feedback: string;
  explanation?: string;
  suggestions?: string[];
}
