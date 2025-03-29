
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useDecks } from "@/hooks/useDecks";
import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import DeckList from "@/components/DeckList";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Skeleton } from "@/components/ui/skeleton";
import { Plus, Brain } from "lucide-react";

const Index = () => {
  const { decks, isLoading, deleteDeck } = useDecks();
  const [activeTab, setActiveTab] = useState("all");
  const [filteredDecks, setFilteredDecks] = useState(decks);

  useEffect(() => {
    if (activeTab === "all") {
      setFilteredDecks(decks);
    } else if (activeTab === "recent") {
      // Sort decks by creation date, newest first
      const sorted = [...decks].sort((a, b) => b.createdAt - a.createdAt);
      setFilteredDecks(sorted.slice(0, 5));
    } else if (activeTab === "due") {
      // Filter decks that have due cards
      const withDueCards = decks.filter(deck => {
        return deck.cards.some(card => !card.nextReviewDate || card.nextReviewDate <= Date.now());
      });
      setFilteredDecks(withDueCards);
    }
  }, [decks, activeTab]);

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-grow">
        <Hero />
        
        <section className="container py-12">
          <div className="flex justify-between items-center mb-6">
            <div className="flex items-center gap-2">
              <Brain className="h-6 w-6 text-primary" />
              <h2 className="text-2xl font-bold">Your Flashcard Decks</h2>
            </div>
            <Link to="/create">
              <Button className="gap-2">
                <Plus className="h-4 w-4" />
                Create Deck
              </Button>
            </Link>
          </div>
          
          <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="mb-6">
              <TabsTrigger value="all">All Decks</TabsTrigger>
              <TabsTrigger value="recent">Recent</TabsTrigger>
              <TabsTrigger value="due">Due for Review</TabsTrigger>
            </TabsList>
            
            <TabsContent value={activeTab}>
              {isLoading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {[1, 2, 3].map((i) => (
                    <Skeleton key={i} className="h-[260px] rounded-lg" />
                  ))}
                </div>
              ) : (
                <DeckList decks={filteredDecks} onDeleteDeck={deleteDeck} />
              )}
            </TabsContent>
          </Tabs>
        </section>
      </main>
      
      <footer className="border-t py-6 bg-muted/40">
        <div className="container flex flex-col md:flex-row justify-between items-center">
          <div className="flex items-center gap-2 mb-4 md:mb-0">
            <Brain className="h-5 w-5 text-primary" />
            <span className="font-semibold">FlashBrainBooster</span>
          </div>
          <div className="text-sm text-muted-foreground">
            © {new Date().getFullYear()} FlashBrainBooster. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
