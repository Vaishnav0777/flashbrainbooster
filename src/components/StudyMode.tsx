
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Flashcard, Deck } from "@/types";
import { sortCardsByDueDate, getDueCards } from "@/utils/studyUtils";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { useToast } from "@/components/ui/use-toast";
import FlashcardView from "./FlashcardView";
import { CheckCircle2, ArrowLeft, Timer } from "lucide-react";

interface StudyModeProps {
  deck: Deck;
  onUpdateCardProgress: (
    deckId: string,
    cardId: string,
    difficulty: "easy" | "medium" | "hard"
  ) => void;
}

const StudyMode = ({ deck, onUpdateCardProgress }: StudyModeProps) => {
  const [studyCards, setStudyCards] = useState<Flashcard[]>([]);
  const [studiedCount, setStudiedCount] = useState(0);
  const [isComplete, setIsComplete] = useState(false);
  const [studyStartTime, setStudyStartTime] = useState(Date.now());
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    // Get cards due for review, sorted by due date
    const dueCards = getDueCards(deck.cards);
    const sortedDueCards = sortCardsByDueDate(dueCards);
    setStudyCards(sortedDueCards);
    setStudyStartTime(Date.now());
    
    if (sortedDueCards.length === 0) {
      setIsComplete(true);
      toast({
        title: "All caught up!",
        description: "You've reviewed all the cards in this deck for now.",
      });
    }
  }, [deck.cards, toast]);

  const handleUpdateProgress = (
    cardId: string,
    difficulty: "easy" | "medium" | "hard"
  ) => {
    onUpdateCardProgress(deck.id, cardId, difficulty);
    setStudiedCount(studiedCount + 1);
    
    // Check if we've studied all cards
    if (studiedCount + 1 >= studyCards.length) {
      setIsComplete(true);
      const studyDuration = Math.round((Date.now() - studyStartTime) / 1000);
      toast({
        title: "Study session complete!",
        description: `You reviewed ${studyCards.length} cards in ${formatTime(studyDuration)}.`,
      });
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}m ${secs}s`;
  };

  const getStudyProgress = () => {
    if (studyCards.length === 0) return 100;
    return Math.round((studiedCount / studyCards.length) * 100);
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex justify-between items-start">
          <div>
            <CardTitle>{deck.name}</CardTitle>
            <CardDescription>
              Study session • {studyCards.length} cards to review
            </CardDescription>
          </div>
          <Button variant="outline" size="sm" onClick={() => navigate(`/`)}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Decks
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        {isComplete ? (
          <div className="py-12 flex flex-col items-center justify-center">
            <div className="w-20 h-20 rounded-full bg-green-100 flex items-center justify-center mb-4">
              <CheckCircle2 className="h-10 w-10 text-green-600" />
            </div>
            <h2 className="text-2xl font-bold mb-2">Study Complete!</h2>
            <p className="text-muted-foreground text-center mb-6">
              You've reviewed all the cards scheduled for today.
              Come back tomorrow for more review.
            </p>
            <Button onClick={() => navigate('/')}>
              Return to Decks
            </Button>
          </div>
        ) : (
          <>
            <div className="mb-6">
              <div className="flex justify-between items-center mb-2">
                <div className="flex items-center">
                  <Timer className="h-4 w-4 mr-2 text-muted-foreground" />
                  <span className="text-sm text-muted-foreground">
                    Progress: {studiedCount}/{studyCards.length} cards
                  </span>
                </div>
                <span className="text-sm font-medium">{getStudyProgress()}%</span>
              </div>
              <Progress value={getStudyProgress()} className="h-2" />
            </div>
            <FlashcardView
              cards={studyCards}
              onUpdateProgress={handleUpdateProgress}
              showAnswerControls={true}
            />
          </>
        )}
      </CardContent>
      {!isComplete && (
        <CardFooter className="flex justify-between border-t pt-6">
          <div className="text-sm text-muted-foreground">
            Rate each card after viewing the answer
          </div>
        </CardFooter>
      )}
    </Card>
  );
};

export default StudyMode;
