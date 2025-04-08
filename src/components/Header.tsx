
import { useState } from "react";
import { Bell, Menu, Search, X } from "lucide-react";
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
    <header className="bg-white border-b sticky top-0 z-10">
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
                    <a href="#" className="text-lg font-medium">Dashboard</a>
                    <a href="#" className="text-lg text-muted-foreground">Dock Planning</a>
                    <a href="#" className="text-lg text-muted-foreground">Truck Management</a>
                    <a href="#" className="text-lg text-muted-foreground">Reports</a>
                    <a href="#" className="text-lg text-muted-foreground">Settings</a>
                  </nav>
                </SheetContent>
              </Sheet>
            )}
            
            <h1 className="text-xl font-bold text-dock-primary">Dockside Flow</h1>
            
            {!isMobile && (
              <nav className="ml-8 flex items-center space-x-4">
                <a href="#" className="text-sm font-medium">Dashboard</a>
                <a href="#" className="text-sm text-muted-foreground">Dock Planning</a>
                <a href="#" className="text-sm text-muted-foreground">Truck Management</a>
                <a href="#" className="text-sm text-muted-foreground">Reports</a>
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
            <Button variant="ghost" size="icon">
              <Bell className="h-4 w-4" />
            </Button>
            <Button variant="outline" size="sm">Refresh</Button>
          </div>
        </div>
      </div>
    </header>
  );
}
