
import { useState } from "react";
import { Flashcard as FlashcardType } from "@/types";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { RefreshCw, ArrowLeftCircle, ArrowRightCircle } from "lucide-react";

interface FlashcardViewProps {
  cards: FlashcardType[];
  onUpdateProgress?: (
    cardId: string,
    difficulty: "easy" | "medium" | "hard"
  ) => void;
  showAnswerControls?: boolean;
}

const FlashcardView = ({
  cards,
  onUpdateProgress,
  showAnswerControls = false,
}: FlashcardViewProps) => {
  const [currentCardIndex, setCurrentCardIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);

  const currentCard = cards[currentCardIndex];

  const handleCardClick = () => {
    if (!isAnimating) {
      setIsAnimating(true);
      setIsFlipped(!isFlipped);
      setTimeout(() => setIsAnimating(false), 600);
    }
  };

  const handleNextCard = () => {
    if (currentCardIndex < cards.length - 1 && !isAnimating) {
      setIsAnimating(true);
      setIsFlipped(false);
      setTimeout(() => {
        setCurrentCardIndex(currentCardIndex + 1);
        setIsAnimating(false);
      }, 300);
    }
  };

  const handlePrevCard = () => {
    if (currentCardIndex > 0 && !isAnimating) {
      setIsAnimating(true);
      setIsFlipped(false);
      setTimeout(() => {
        setCurrentCardIndex(currentCardIndex - 1);
        setIsAnimating(false);
      }, 300);
    }
  };

  const handleDifficultySelect = (difficulty: "easy" | "medium" | "hard") => {
    if (onUpdateProgress && currentCard) {
      onUpdateProgress(currentCard.id, difficulty);
      handleNextCard();
    }
  };

  if (!currentCard) {
    return (
      <div className="flex flex-col items-center justify-center h-64 bg-muted/30 rounded-xl p-8">
        <h3 className="text-xl font-medium mb-2">No flashcards found</h3>
        <p className="text-muted-foreground text-center">
          This deck doesn't have any flashcards yet.
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center">
      <div className="w-full max-w-2xl">
        <div className="flex justify-between items-center mb-4">
          <Button
            variant="outline"
            size="icon"
            onClick={handlePrevCard}
            disabled={currentCardIndex === 0 || isAnimating}
          >
            <ArrowLeftCircle className="h-4 w-4" />
          </Button>

          <div className="text-sm text-muted-foreground">
            Card {currentCardIndex + 1} of {cards.length}
          </div>

          <Button
            variant="outline"
            size="icon"
            onClick={handleNextCard}
            disabled={currentCardIndex === cards.length - 1 || isAnimating}
          >
            <ArrowRightCircle className="h-4 w-4" />
          </Button>
        </div>

        <div
          className={cn("flashcard w-full aspect-[3/2] cursor-pointer", {
            flipped: isFlipped,
          })}
          onClick={handleCardClick}
        >
          <div className="flashcard-inner w-full h-full">
            <div className="flashcard-front bg-card shadow-md border p-6 flex flex-col items-center justify-center">
              <div className="text-center">
                <div className="text-2xl font-bold mb-4">{currentCard.front}</div>
                <div className="text-sm text-muted-foreground">
                  Click to flip card
                </div>
              </div>
            </div>
            <div className="flashcard-back bg-primary text-primary-foreground shadow-md p-6 flex flex-col items-center justify-center">
              <div className="text-center">
                <div className="text-xl mb-4">{currentCard.back}</div>
                <div className="text-sm opacity-70">
                  Click to flip back
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-6 flex justify-center">
          <Button
            variant="outline"
            size="sm"
            className="flex items-center"
            onClick={() => setIsFlipped(!isFlipped)}
          >
            <RefreshCw className="mr-2 h-4 w-4" />
            Flip Card
          </Button>
        </div>

        {showAnswerControls && isFlipped && (
          <div className="mt-6 grid grid-cols-3 gap-4">
            <Button
              onClick={() => handleDifficultySelect("hard")}
              className="bg-red-500 hover:bg-red-600 text-white"
            >
              Hard
            </Button>
            <Button
              onClick={() => handleDifficultySelect("medium")}
              className="bg-yellow-500 hover:bg-yellow-600 text-white"
            >
              Medium
            </Button>
            <Button
              onClick={() => handleDifficultySelect("easy")}
              className="bg-green-500 hover:bg-green-600 text-white"
            >
              Easy
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default FlashcardView;
