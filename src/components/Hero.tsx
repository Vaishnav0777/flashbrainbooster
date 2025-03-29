
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Brain, BookOpen, Zap } from "lucide-react";

const Hero = () => {
  return (
    <div className="relative overflow-hidden bg-background py-12 md:py-24">
      <div
        className="absolute inset-0 bg-gradient-to-b from-brain-100/40 to-transparent z-0"
        aria-hidden="true"
      />
      <div className="container relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
          <div className="flex flex-col gap-6">
            <div className="flex items-center gap-2">
              <Brain className="h-8 w-8 text-primary" />
              <span className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-brain-500 to-brain-700">
                FlashBrainBooster
              </span>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold tracking-tight">
              AI-Powered Flashcards for{" "}
              <span className="text-primary">Smarter</span> Learning
            </h1>
            <p className="text-xl text-muted-foreground">
              Transform your study materials into interactive flashcards with the
              power of AI. Learn faster, remember longer, and study smarter.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link to="/create">
                <Button size="lg" className="gap-2">
                  <Zap className="h-4 w-4" />
                  Create AI Flashcards
                </Button>
              </Link>
              <Link to="/study">
                <Button variant="outline" size="lg" className="gap-2">
                  <BookOpen className="h-4 w-4" />
                  Start Studying
                </Button>
              </Link>
            </div>
          </div>
          <div className="hidden md:flex justify-center">
            <div className="relative w-full max-w-md">
              <div className="absolute -right-4 -top-4 h-72 w-72 bg-purple-200 rounded-full -z-10 blur-2xl opacity-60" />
              <div className="absolute -left-8 -bottom-8 h-60 w-60 bg-brain-200 rounded-full -z-10 blur-3xl opacity-60" />
              <div className="flashcard hover:shadow-lg transition-all duration-300 bg-white rounded-xl p-6 rotate-3 shadow-md">
                <div className="text-center">
                  <div className="text-lg font-semibold mb-1 text-brain-700">BIOLOGY</div>
                  <div className="text-2xl font-bold mb-6">What is photosynthesis?</div>
                  <div className="text-muted-foreground italic">Click to reveal answer</div>
                </div>
              </div>
              <div className="flashcard absolute top-20 -left-10 hover:shadow-lg transition-all duration-300 bg-white rounded-xl p-6 -rotate-6 shadow-md">
                <div className="text-center">
                  <div className="text-lg font-semibold mb-1 text-brain-700">CHEMISTRY</div>
                  <div className="text-2xl font-bold mb-6">Define Atomic Number</div>
                  <div className="text-muted-foreground italic">Click to reveal answer</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-20">
          <h2 className="text-2xl font-bold text-center mb-10">How It Works</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-card rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow">
              <div className="bg-brain-100 w-12 h-12 mb-4 rounded-full flex items-center justify-center">
                <span className="text-brain-700 font-bold text-xl">1</span>
              </div>
              <h3 className="text-xl font-bold mb-2">Input Your Study Material</h3>
              <p className="text-muted-foreground">
                Paste your notes, textbook excerpts, or any study content into our AI system.
              </p>
            </div>
            <div className="bg-card rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow">
              <div className="bg-brain-100 w-12 h-12 mb-4 rounded-full flex items-center justify-center">
                <span className="text-brain-700 font-bold text-xl">2</span>
              </div>
              <h3 className="text-xl font-bold mb-2">AI Creates Flashcards</h3>
              <p className="text-muted-foreground">
                Our AI analyzes your content and automatically generates question-answer pairs as flashcards.
              </p>
            </div>
            <div className="bg-card rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow">
              <div className="bg-brain-100 w-12 h-12 mb-4 rounded-full flex items-center justify-center">
                <span className="text-brain-700 font-bold text-xl">3</span>
              </div>
              <h3 className="text-xl font-bold mb-2">Study Smart & Retain More</h3>
              <p className="text-muted-foreground">
                Review your cards using our spaced repetition system to optimize your learning and memory retention.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Hero;
