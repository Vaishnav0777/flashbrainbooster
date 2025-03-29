
import { Flashcard } from '@/types';

// Spaced repetition intervals (in milliseconds)
const EASY_INTERVAL = 7 * 24 * 60 * 60 * 1000; // 7 days
const MEDIUM_INTERVAL = 3 * 24 * 60 * 60 * 1000; // 3 days
const HARD_INTERVAL = 1 * 24 * 60 * 60 * 1000; // 1 day

/**
 * Updates a flashcard's spaced repetition information based on difficulty
 */
export const updateSpacedRepetitionInfo = (
  card: Flashcard,
  difficulty: 'easy' | 'medium' | 'hard'
): Flashcard => {
  const now = Date.now();
  let interval: number;
  
  // Determine interval based on difficulty and repetition count
  switch (difficulty) {
    case 'easy':
      interval = EASY_INTERVAL * (card.repetitionCount + 1);
      break;
    case 'medium':
      interval = MEDIUM_INTERVAL * (Math.floor(card.repetitionCount / 2) + 1);
      break;
    case 'hard':
      interval = HARD_INTERVAL;
      break;
  }
  
  return {
    ...card,
    difficulty,
    lastReviewed: now,
    nextReviewDate: now + interval,
    repetitionCount: card.repetitionCount + 1
  };
};

/**
 * Gets cards that are due for review based on their next review date
 */
export const getDueCards = (cards: Flashcard[]): Flashcard[] => {
  const now = Date.now();
  
  // Get cards that have a next review date and it's in the past,
  // or cards that have never been reviewed
  return cards.filter(card => 
    !card.nextReviewDate || card.nextReviewDate <= now
  );
};

/**
 * Sort cards by their due status and next review date
 */
export const sortCardsByDueDate = (cards: Flashcard[]): Flashcard[] => {
  return [...cards].sort((a, b) => {
    // Cards with no next review date (never reviewed) come first
    if (!a.nextReviewDate && b.nextReviewDate) return -1;
    if (a.nextReviewDate && !b.nextReviewDate) return 1;
    if (!a.nextReviewDate && !b.nextReviewDate) return 0;
    
    // Sort by next review date (ascending)
    return (a.nextReviewDate || 0) - (b.nextReviewDate || 0);
  });
};

/**
 * Calculate study stats for a deck
 */
export const calculateStudyStats = (cards: Flashcard[]) => {
  const totalCards = cards.length;
  const studiedCards = cards.filter(card => card.lastReviewed).length;
  const dueCards = getDueCards(cards).length;
  
  return {
    totalCards,
    studiedCards,
    dueCards,
    completionRate: totalCards ? Math.round((studiedCards / totalCards) * 100) : 0
  };
};
