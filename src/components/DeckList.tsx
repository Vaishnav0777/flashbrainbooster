
import { useState } from "react";
import { Link } from "react-router-dom";
import { Deck } from "@/types";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { calculateStudyStats } from "@/utils/studyUtils";
import {
  BookOpen,
  MoreVertical,
  Edit,
  Trash2,
  Plus,
  Clock,
  BookMarked,
} from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

interface DeckListProps {
  decks: Deck[];
  onDeleteDeck: (deckId: string) => void;
}

const DeckList = ({ decks, onDeleteDeck }: DeckListProps) => {
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [deckToDelete, setDeckToDelete] = useState<string | null>(null);

  const handleDeleteClick = (deckId: string) => {
    setDeckToDelete(deckId);
    setDeleteDialogOpen(true);
  };

  const confirmDelete = () => {
    if (deckToDelete) {
      onDeleteDeck(deckToDelete);
      setDeleteDialogOpen(false);
      setDeckToDelete(null);
    }
  };

  const formatDate = (timestamp: number) => {
    return new Date(timestamp).toLocaleDateString(undefined, {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  return (
    <div className="space-y-8">
      {decks.length === 0 ? (
        <div className="text-center py-12">
          <h3 className="text-xl font-medium mb-2">No decks found</h3>
          <p className="text-muted-foreground mb-6">
            Create your first flashcard deck to get started
          </p>
          <Link to="/create">
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Create Deck
            </Button>
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {decks.map((deck) => {
            const stats = calculateStudyStats(deck.cards);
            
            return (
              <Card key={deck.id} className="overflow-hidden flex flex-col">
                <CardHeader className="pb-2">
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="text-xl">{deck.name}</CardTitle>
                      <CardDescription className="line-clamp-2 mt-1">
                        {deck.description}
                      </CardDescription>
                    </div>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <MoreVertical className="h-4 w-4" />
                          <span className="sr-only">Menu</span>
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <Link to={`/study/${deck.id}`}>
                          <DropdownMenuItem>
                            <BookOpen className="mr-2 h-4 w-4" />
                            Study Deck
                          </DropdownMenuItem>
                        </Link>
                        <Link to={`/edit/${deck.id}`}>
                          <DropdownMenuItem>
                            <Edit className="mr-2 h-4 w-4" />
                            Edit Deck
                          </DropdownMenuItem>
                        </Link>
                        <DropdownMenuItem
                          className="text-destructive focus:text-destructive"
                          onClick={() => handleDeleteClick(deck.id)}
                        >
                          <Trash2 className="mr-2 h-4 w-4" />
                          Delete Deck
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </CardHeader>
                <CardContent className="pb-2 flex-grow">
                  <div className="flex justify-between text-sm text-muted-foreground mb-4">
                    <div className="flex items-center">
                      <BookMarked className="mr-1 h-4 w-4" />
                      {stats.totalCards} cards
                    </div>
                    <div className="flex items-center">
                      <Clock className="mr-1 h-4 w-4" />
                      Created {formatDate(deck.createdAt)}
                    </div>
                  </div>
                  
                  <div className="w-full bg-secondary rounded-full h-2.5 mb-1">
                    <div 
                      className="bg-primary h-2.5 rounded-full" 
                      style={{ width: `${stats.completionRate}%` }}
                    ></div>
                  </div>
                  <div className="flex justify-between text-xs text-muted-foreground">
                    <span>{stats.studiedCards} studied</span>
                    <span>{stats.dueCards} due</span>
                  </div>
                </CardContent>
                <CardFooter className="pt-3">
                  <div className="flex gap-2 w-full">
                    <Link to={`/study/${deck.id}`} className="flex-1">
                      <Button className="w-full" variant="default">
                        <BookOpen className="mr-2 h-4 w-4" />
                        Study
                      </Button>
                    </Link>
                    <Link to={`/edit/${deck.id}`} className="flex-1">
                      <Button className="w-full" variant="outline">
                        <Edit className="mr-2 h-4 w-4" />
                        Edit
                      </Button>
                    </Link>
                  </div>
                </CardFooter>
              </Card>
            );
          })}
        </div>
      )}

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete this deck and all its flashcards.
              This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmDelete}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default DeckList;
