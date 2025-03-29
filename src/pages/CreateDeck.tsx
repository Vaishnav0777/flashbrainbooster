
import { useNavigate } from "react-router-dom";
import Navbar from "@/components/Navbar";
import CreateDeckForm from "@/components/CreateDeckForm";
import { useDecks } from "@/hooks/useDecks";

const CreateDeck = () => {
  const { createDeck, addCardsFromAI } = useDecks();
  const navigate = useNavigate();
  
  const handleCreateDeck = (name: string, description: string) => {
    return createDeck(name, description);
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-grow container py-12">
        <div className="max-w-3xl mx-auto">
          <CreateDeckForm 
            onCreateDeck={handleCreateDeck}
            onAddCardsFromAI={addCardsFromAI}
          />
        </div>
      </main>
    </div>
  );
};

export default CreateDeck;
