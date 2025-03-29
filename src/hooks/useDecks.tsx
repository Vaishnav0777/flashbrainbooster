
import { useState, useEffect } from 'react';
import { Deck, Flashcard } from '@/types';
import { v4 as uuidv4 } from 'uuid';
import { updateSpacedRepetitionInfo } from '@/utils/studyUtils';
import { useToast } from '@/components/ui/use-toast';

const STORAGE_KEY = 'flashbrainbooster-decks';

export const useDecks = () => {
  const [decks, setDecks] = useState<Deck[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    // Load decks from localStorage
    const loadDecks = () => {
      try {
        const storedDecks = localStorage.getItem(STORAGE_KEY);
        if (storedDecks) {
          setDecks(JSON.parse(storedDecks));
        } else {
          // Create sample deck if no decks exist
          const sampleDeck = createSampleDeck();
          setDecks([sampleDeck]);
          saveDecksToStorage([sampleDeck]);
        }
      } catch (error) {
        console.error('Error loading decks:', error);
        toast({
          title: "Error loading decks",
          description: "There was a problem loading your saved decks",
          variant: "destructive"
        });
      } finally {
        setIsLoading(false);
      }
    };

    loadDecks();
  }, [toast]);

  const saveDecksToStorage = (updatedDecks: Deck[]) => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedDecks));
    } catch (error) {
      console.error('Error saving decks:', error);
      toast({
        title: "Error saving decks",
        description: "There was a problem saving your decks",
        variant: "destructive"
      });
    }
  };

  const createDeck = (name: string, description: string, category?: string) => {
    const newDeck: Deck = {
      id: uuidv4(),
      name,
      description,
      category,
      cards: [],
      createdAt: Date.now(),
      tags: []
    };
    
    const updatedDecks = [...decks, newDeck];
    setDecks(updatedDecks);
    saveDecksToStorage(updatedDecks);
    
    toast({
      title: "Deck created",
      description: `Your new deck "${name}" has been created`,
    });
    
    return newDeck.id;
  };

  const getDeck = (deckId: string) => {
    return decks.find(deck => deck.id === deckId);
  };

  const updateDeck = (updatedDeck: Deck) => {
    const updatedDecks = decks.map(deck => 
      deck.id === updatedDeck.id ? updatedDeck : deck
    );
    setDecks(updatedDecks);
    saveDecksToStorage(updatedDecks);
    
    toast({
      title: "Deck updated",
      description: `Your deck "${updatedDeck.name}" has been updated`,
    });
  };

  const deleteDeck = (deckId: string) => {
    const deckToDelete = decks.find(deck => deck.id === deckId);
    if (!deckToDelete) return;
    
    const updatedDecks = decks.filter(deck => deck.id !== deckId);
    setDecks(updatedDecks);
    saveDecksToStorage(updatedDecks);
    
    toast({
      title: "Deck deleted",
      description: `"${deckToDelete.name}" has been deleted`,
    });
  };

  const addCardToDeck = (deckId: string, front: string, back: string, tags?: string[]) => {
    const deckIndex = decks.findIndex(deck => deck.id === deckId);
    if (deckIndex === -1) return;
    
    const newCard: Flashcard = {
      id: uuidv4(),
      front,
      back,
      tags,
      createdAt: Date.now(),
      repetitionCount: 0
    };
    
    const updatedDeck = { 
      ...decks[deckIndex],
      cards: [...decks[deckIndex].cards, newCard] 
    };
    
    const updatedDecks = [...decks];
    updatedDecks[deckIndex] = updatedDeck;
    
    setDecks(updatedDecks);
    saveDecksToStorage(updatedDecks);
    
    toast({
      title: "Card added",
      description: "New flashcard has been added to the deck",
    });
    
    return newCard.id;
  };

  const updateCard = (deckId: string, updatedCard: Flashcard) => {
    const deckIndex = decks.findIndex(deck => deck.id === deckId);
    if (deckIndex === -1) return;
    
    const updatedCards = decks[deckIndex].cards.map(card => 
      card.id === updatedCard.id ? updatedCard : card
    );
    
    const updatedDeck = { 
      ...decks[deckIndex],
      cards: updatedCards 
    };
    
    const updatedDecks = [...decks];
    updatedDecks[deckIndex] = updatedDeck;
    
    setDecks(updatedDecks);
    saveDecksToStorage(updatedDecks);
  };

  const deleteCard = (deckId: string, cardId: string) => {
    const deckIndex = decks.findIndex(deck => deck.id === deckId);
    if (deckIndex === -1) return;
    
    const updatedCards = decks[deckIndex].cards.filter(card => card.id !== cardId);
    
    const updatedDeck = { 
      ...decks[deckIndex],
      cards: updatedCards 
    };
    
    const updatedDecks = [...decks];
    updatedDecks[deckIndex] = updatedDeck;
    
    setDecks(updatedDecks);
    saveDecksToStorage(updatedDecks);
    
    toast({
      title: "Card deleted",
      description: "Flashcard has been removed from the deck",
    });
  };

  const updateCardStudyProgress = (
    deckId: string, 
    cardId: string, 
    difficulty: 'easy' | 'medium' | 'hard'
  ) => {
    const deckIndex = decks.findIndex(deck => deck.id === deckId);
    if (deckIndex === -1) return;
    
    const cardIndex = decks[deckIndex].cards.findIndex(card => card.id === cardId);
    if (cardIndex === -1) return;
    
    const card = decks[deckIndex].cards[cardIndex];
    const updatedCard = updateSpacedRepetitionInfo(card, difficulty);
    
    const updatedCards = [...decks[deckIndex].cards];
    updatedCards[cardIndex] = updatedCard;
    
    const updatedDeck = { 
      ...decks[deckIndex],
      cards: updatedCards,
      lastStudied: Date.now()
    };
    
    const updatedDecks = [...decks];
    updatedDecks[deckIndex] = updatedDeck;
    
    setDecks(updatedDecks);
    saveDecksToStorage(updatedDecks);
  };

  const addCardsFromAI = (deckId: string, aiGeneratedCards: { front: string; back: string }[]) => {
    const deckIndex = decks.findIndex(deck => deck.id === deckId);
    if (deckIndex === -1) return;
    
    const newCards: Flashcard[] = aiGeneratedCards.map(card => ({
      id: uuidv4(),
      front: card.front,
      back: card.back,
      createdAt: Date.now(),
      repetitionCount: 0
    }));
    
    const updatedDeck = { 
      ...decks[deckIndex],
      cards: [...decks[deckIndex].cards, ...newCards] 
    };
    
    const updatedDecks = [...decks];
    updatedDecks[deckIndex] = updatedDeck;
    
    setDecks(updatedDecks);
    saveDecksToStorage(updatedDecks);
    
    toast({
      title: "Cards generated",
      description: `${newCards.length} flashcards have been added to the deck`,
    });
    
    return newCards.length;
  };

  const createSampleDeck = (): Deck => {
    return {
      id: uuidv4(),
      name: "Sample Biology Deck",
      description: "A sample deck to demonstrate how FlashBrainBooster works",
      cards: [
        {
          id: uuidv4(),
          front: "What is photosynthesis?",
          back: "The process by which green plants and some other organisms use sunlight to synthesize nutrients from carbon dioxide and water, generating oxygen as a byproduct.",
          createdAt: Date.now(),
          repetitionCount: 0
        },
        {
          id: uuidv4(),
          front: "What is mitosis?",
          back: "A type of cell division that results in two daughter cells each having the same number and kind of chromosomes as the parent nucleus.",
          createdAt: Date.now(),
          repetitionCount: 0
        },
        {
          id: uuidv4(),
          front: "What is DNA?",
          back: "Deoxyribonucleic acid, a self-replicating material which is present in nearly all living organisms as the main constituent of chromosomes. It is the carrier of genetic information.",
          createdAt: Date.now(),
          repetitionCount: 0
        }
      ],
      createdAt: Date.now(),
      tags: ["biology", "science", "sample"]
    };
  };

  return {
    decks,
    isLoading,
    createDeck,
    getDeck,
    updateDeck,
    deleteDeck,
    addCardToDeck,
    updateCard,
    deleteCard,
    updateCardStudyProgress,
    addCardsFromAI
  };
};
