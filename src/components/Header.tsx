
import { useState } from "react";
import { Menu, Search, X, MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from "@/components/ui/sheet";
import { useIsMobile } from "@/hooks/use-mobile";

export function Header() {
  const isMobile = useIsMobile();
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  return (
    <header className="bg-white border-b sticky top-0 z-10 shadow-sm">
      <div className="container mx-auto px-4">
        <div className="h-16 flex items-center justify-between">
          <div className="flex items-center">
            {isMobile && (
              <Sheet>
                <SheetTrigger asChild>
                  <Button variant="ghost" size="icon">
                    <Menu className="h-5 w-5" />
                  </Button>
                </SheetTrigger>
                <SheetContent side="left">
                  <nav className="flex flex-col gap-4 mt-8">
                    {/* Settings link has been removed */}
                  </nav>
                </SheetContent>
              </Sheet>
            )}
            
            <h1 className="text-xl font-bold text-dock-primary">StackBox</h1>
            
            {!isMobile && (
              <nav className="ml-8 flex items-center space-x-4">
                {/* Settings link has been removed */}
              </nav>
            )}
          </div>
          
          <div className="flex items-center space-x-2">
            {isSearchOpen ? (
              <div className="flex items-center">
                <Input
                  type="search"
                  placeholder="Search..."
                  className="w-[200px] mr-2"
                  autoFocus
                />
                <Button variant="ghost" size="icon" onClick={() => setIsSearchOpen(false)}>
                  <X className="h-4 w-4" />
                </Button>
              </div>
            ) : (
              <Button variant="ghost" size="icon" onClick={() => setIsSearchOpen(true)}>
                <Search className="h-4 w-4" />
              </Button>
            )}
            <Button variant="ghost" size="icon" className="text-secondary hover:text-secondary/80">
              <MessageCircle className="h-5 w-5" />
              <span className="sr-only">Enable chatbot</span>
            </Button>
            {/* Refresh button has been removed */}
          </div>
        </div>
      </div>
    </header>
  );
}
