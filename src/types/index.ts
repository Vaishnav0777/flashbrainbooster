
export interface Flashcard {
  id: string;
  front: string;
  back: string;
  tags?: string[];
  createdAt: number;
  lastReviewed?: number;
  nextReviewDate?: number;
  difficulty?: 'easy' | 'medium' | 'hard';
  repetitionCount: number;
}

export interface Deck {
  id: string;
  name: string;
  description: string;
  cards: Flashcard[];
  createdAt: number;
  lastStudied?: number;
  category?: string;
  tags?: string[];
}

export interface StudySession {
  deckId: string;
  startTime: number;
  endTime?: number;
  cardsStudied: number;
  cardsCorrect: number;
}
