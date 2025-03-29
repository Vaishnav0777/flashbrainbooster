
import { toast } from "@/components/ui/use-toast";

// This is a simulated AI function since we can't access actual AI APIs directly in the browser
export const generateFlashcardsFromText = async (text: string): Promise<{ front: string; back: string }[]> => {
  // This would normally call an external API like OpenAI
  // For now, we'll simulate the AI response with a simple algorithm
  
  // For demo purposes, let's extract sentences and try to create question-answer pairs
  try {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    const sentences = text.split(/[.!?]+/)
      .map(s => s.trim())
      .filter(s => s.length > 10);
    
    if (sentences.length === 0) {
      throw new Error("Couldn't extract enough content from the provided text.");
    }
    
    // Create simple flashcards based on the sentences
    const flashcards: { front: string; back: string }[] = [];
    
    for (let i = 0; i < Math.min(sentences.length, 10); i++) {
      const sentence = sentences[i];
      
      // Try to create a question from the sentence
      // This is a very simplified approach. A real AI would do much better.
      const words = sentence.split(' ');
      
      if (words.length < 5) continue;
      
      // Find important terms based on capitalization and length
      const importantTerms = words.filter(word => 
        (word.length > 5 && !isCommonWord(word)) || 
        (word[0] === word[0].toUpperCase() && word.length > 3 && !isAfterPunctuation(word, words))
      );
      
      if (importantTerms.length === 0) continue;
      
      // Get a random important term
      const termToUse = importantTerms[Math.floor(Math.random() * importantTerms.length)];
      
      // Create a question
      const question = sentence.includes(termToUse) 
        ? `What is ${termToUse.toLowerCase().replace(/[^\w\s]/g, '')}?`
        : `Explain this concept: ${termToUse.replace(/[^\w\s]/g, '')}`;
      
      // Create an answer
      const answer = sentence;
      
      flashcards.push({
        front: question,
        back: answer
      });
    }
    
    // If we couldn't create flashcards, provide a fallback
    if (flashcards.length === 0) {
      flashcards.push(
        {
          front: "What is the main topic of this text?",
          back: sentences[0]
        },
        {
          front: "Summarize the key points from this text.",
          back: sentences.slice(0, 3).join('. ')
        }
      );
    }
    
    return flashcards;
  } catch (error) {
    console.error("Error generating flashcards:", error);
    toast({
      title: "Error generating flashcards",
      description: "There was a problem analyzing your text. Please try again with different content.",
      variant: "destructive"
    });
    return [];
  }
};

// Helper functions for the simple AI simulation
const commonWords = new Set([
  'the', 'and', 'that', 'have', 'for', 'not', 'with', 'you', 'this', 'but',
  'his', 'from', 'they', 'she', 'will', 'would', 'there', 'their', 'what',
  'about', 'which', 'when', 'were', 'your', 'said', 'could', 'been'
]);

const isCommonWord = (word: string): boolean => {
  return commonWords.has(word.toLowerCase());
};

const isAfterPunctuation = (word: string, words: string[]): boolean => {
  const index = words.indexOf(word);
  if (index <= 0) return false;
  
  const prevWord = words[index - 1];
  return prevWord.endsWith('.') || prevWord.endsWith('!') || prevWord.endsWith('?');
};
