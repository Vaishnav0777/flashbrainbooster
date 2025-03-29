
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Brain, BookOpen, Sparkles } from "lucide-react";

const Hero = () => {
  return (
    <section className="py-16 bg-gradient-to-b from-primary/10 to-background">
      <div className="container px-4 md:px-6">
        <div className="flex flex-col items-center space-y-4 text-center">
          <div className="space-y-2">
            <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl lg:text-6xl">
              Learn Faster with AI-Powered Flashcards
            </h1>
            <p className="mx-auto max-w-[700px] text-muted-foreground md:text-xl">
              Turn your study materials into intelligent flashcards that adapt to your learning style.
            </p>
          </div>
          <div className="flex flex-wrap items-center justify-center gap-4">
            <Link to="/create">
              <Button size="lg" className="gap-2">
                <Sparkles className="h-4 w-4" />
                Create New Deck
              </Button>
            </Link>
            <Link to="/study">
              <Button variant="outline" size="lg" className="gap-2">
                <BookOpen className="h-4 w-4" />
                Start Studying
              </Button>
            </Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 mt-12">
            <div className="flex flex-col items-center space-y-2 p-4 border rounded-lg bg-card">
              <div className="p-2 bg-primary/10 rounded-full">
                <Brain className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-xl font-bold">AI-Powered Generation</h3>
              <p className="text-sm text-muted-foreground text-center">
                Our AI identifies key concepts to create perfect flashcards from your notes.
              </p>
            </div>
            <div className="flex flex-col items-center space-y-2 p-4 border rounded-lg bg-card">
              <div className="p-2 bg-primary/10 rounded-full">
                <BookOpen className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-xl font-bold">Spaced Repetition</h3>
              <p className="text-sm text-muted-foreground text-center">
                Remember more with scientifically-proven study techniques built in.
              </p>
            </div>
            <div className="flex flex-col items-center space-y-2 p-4 border rounded-lg bg-card">
              <div className="p-2 bg-primary/10 rounded-full">
                <Sparkles className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-xl font-bold">Customize & Share</h3>
              <p className="text-sm text-muted-foreground text-center">
                Edit your flashcards and share decks with classmates and friends.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
