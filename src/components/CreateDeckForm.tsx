
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Loader2, Sparkles, Save, ArrowLeft } from "lucide-react";
import { generateFlashcardsFromText } from "@/utils/aiUtils";

interface CreateDeckFormProps {
  onCreateDeck: (name: string, description: string) => string;
  onAddCardsFromAI: (deckId: string, cards: { front: string; back: string }[]) => number;
}

const CreateDeckForm = ({ onCreateDeck, onAddCardsFromAI }: CreateDeckFormProps) => {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [studyText, setStudyText] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [currentTab, setCurrentTab] = useState("deck-info");
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setName(e.target.value);
  };

  const handleDescriptionChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setDescription(e.target.value);
  };

  const handleStudyTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setStudyText(e.target.value);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!name.trim()) {
      toast({
        title: "Missing information",
        description: "Please provide a name for your deck",
        variant: "destructive",
      });
      return;
    }
    
    if (currentTab === "deck-info") {
      // Create deck and move to AI tab
      onCreateDeck(name, description);
      setCurrentTab("ai-create");
      toast({
        title: "Deck created",
        description: "Now let's add some flashcards using AI!",
      });
    } else {
      // Process AI text and create cards
      if (!studyText.trim()) {
        toast({
          title: "Missing information",
          description: "Please provide some text to generate flashcards from",
          variant: "destructive",
        });
        return;
      }
      
      try {
        setIsGenerating(true);
        
        // Create deck
        const deckId = onCreateDeck(name, description);
        
        // Generate flashcards from text
        const aiCards = await generateFlashcardsFromText(studyText);
        
        if (aiCards.length === 0) {
          toast({
            title: "Generation failed",
            description: "Could not generate flashcards from the provided text. Try with different content.",
            variant: "destructive",
          });
          
          navigate(`/edit/${deckId}`);
          return;
        }
        
        // Add cards to deck
        const cardsAdded = onAddCardsFromAI(deckId, aiCards);
        
        toast({
          title: "Success!",
          description: `Created a new deck with ${cardsAdded} AI-generated flashcards`,
        });
        
        // Navigate to the study page for this deck
        navigate(`/study/${deckId}`);
      } catch (error) {
        console.error(error);
        toast({
          title: "Error",
          description: "Something went wrong while creating your flashcards",
          variant: "destructive",
        });
      } finally {
        setIsGenerating(false);
      }
    }
  };

  const handleTabChange = (value: string) => {
    setCurrentTab(value);
  };

  return (
    <form onSubmit={handleSubmit}>
      <Card className="w-full">
        <CardHeader>
          <CardTitle>Create New Flashcard Deck</CardTitle>
          <CardDescription>
            Create a new deck and generate flashcards with AI
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs value={currentTab} onValueChange={handleTabChange}>
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="deck-info">Deck Information</TabsTrigger>
              <TabsTrigger value="ai-create" disabled={isGenerating}>
                AI Generation
              </TabsTrigger>
            </TabsList>
            <TabsContent value="deck-info" className="space-y-4 mt-4">
              <div className="space-y-2">
                <Label htmlFor="name">Deck Name</Label>
                <Input
                  id="name"
                  placeholder="Enter deck name"
                  value={name}
                  onChange={handleNameChange}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  placeholder="Enter deck description"
                  value={description}
                  onChange={handleDescriptionChange}
                  rows={4}
                />
              </div>
            </TabsContent>
            <TabsContent value="ai-create" className="space-y-4 mt-4">
              <div className="space-y-2">
                <Label htmlFor="study-text">
                  Study Material for AI Analysis
                </Label>
                <Textarea
                  id="study-text"
                  placeholder="Paste your notes, text from a textbook, or any study material here. The AI will analyze this content and generate flashcards."
                  value={studyText}
                  onChange={handleStudyTextChange}
                  rows={10}
                  disabled={isGenerating}
                />
                <p className="text-sm text-muted-foreground mt-2">
                  Tip: Provide structured content with clear concepts and
                  definitions for best results.
                </p>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
        <CardFooter className="flex justify-between">
          {currentTab === "deck-info" ? (
            <>
              <Button variant="outline" onClick={() => navigate("/")}>
                <ArrowLeft className="mr-2 h-4 w-4" />
                Cancel
              </Button>
              <Button type="submit">
                Continue
                <Sparkles className="ml-2 h-4 w-4" />
              </Button>
            </>
          ) : (
            <>
              <Button
                variant="outline"
                onClick={() => setCurrentTab("deck-info")}
                disabled={isGenerating}
              >
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back
              </Button>
              <Button
                type="submit"
                disabled={isGenerating}
              >
                {isGenerating ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Generating...
                  </>
                ) : (
                  <>
                    <Save className="mr-2 h-4 w-4" />
                    Create Deck
                  </>
                )}
              </Button>
            </>
          )}
        </CardFooter>
      </Card>
    </form>
  );
};

export default CreateDeckForm;
