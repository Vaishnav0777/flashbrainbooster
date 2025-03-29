
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useDecks } from "@/hooks/useDecks";
import Navbar from "@/components/Navbar";
import StudyMode from "@/components/StudyMode";
import { Button } from "@/components/ui/button";
import { ArrowLeft, AlertTriangle } from "lucide-react";

const Study = () => {
  const { deckId } = useParams<{ deckId: string }>();
  const { decks, getDeck, updateCardStudyProgress } = useDecks();
  const [currentDeck, setCurrentDeck] = useState(getDeck(deckId || ""));
  const navigate = useNavigate();

  useEffect(() => {
    if (deckId) {
      const deck = getDeck(deckId);
      setCurrentDeck(deck);
      
      if (!deck) {
        navigate("/");
      }
    } else if (decks.length > 0) {
      // If no deck specified, use the first one
      setCurrentDeck(decks[0]);
    } else {
      navigate("/");
    }
  }, [deckId, decks, getDeck, navigate]);

  if (!currentDeck) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-grow container py-12 flex flex-col items-center justify-center">
          <div className="text-center">
            <AlertTriangle className="h-12 w-12 text-yellow-500 mx-auto mb-4" />
            <h2 className="text-2xl font-bold mb-2">Deck not found</h2>
            <p className="text-muted-foreground mb-6">
              The deck you're looking for doesn't exist or has been deleted.
            </p>
            <Button onClick={() => navigate("/")}>Return to Home</Button>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-grow container py-12">
        <div className="max-w-3xl mx-auto">
          <StudyMode 
            deck={currentDeck} 
            onUpdateCardProgress={updateCardStudyProgress} 
          />
        </div>
      </main>
    </div>
  );
};

export default Study;
