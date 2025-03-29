
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Brain } from "lucide-react";

const Navbar = () => {
  return (
    <nav className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        <div className="flex items-center gap-2">
          <Brain className="h-8 w-8 text-primary" />
          <Link to="/" className="flex items-center">
            <span className="text-xl font-bold text-foreground hidden sm:inline">
              FlashBrainBooster
            </span>
            <span className="text-xl font-bold text-foreground sm:hidden">
              FBB
            </span>
          </Link>
        </div>

        <div className="flex items-center gap-4">
          <Link to="/">
            <Button variant="ghost" size="sm">Home</Button>
          </Link>
          <Link to="/create">
            <Button variant="ghost" size="sm">Create Deck</Button>
          </Link>
          <Link to="/study">
            <Button variant="default" size="sm">Study Now</Button>
          </Link>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
