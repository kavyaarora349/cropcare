import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Menu, X, Scan, Users, ShoppingBag } from "lucide-react";
import { cn } from "@/lib/utils";
import Logo from "./Logo";
import { ThemeToggle } from "./ThemeToggle";
import WeatherWidget from "./WeatherWidget";

interface NavbarProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

const Navbar = ({ activeTab, onTabChange }: NavbarProps) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const navItems = [
    { id: "scan", label: "Scan Crop", icon: Scan },
    { id: "community", label: "Community", icon: Users },
    { id: "shop", label: "Shop", icon: ShoppingBag },
  ];

  return (
    <nav className="sticky top-0 z-50 glass-card border-b animate-fade-in-down">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <button
            onClick={() => onTabChange("home")}
            className="group"
          >
            <Logo className="group-hover:scale-105 transition-transform duration-300" />
          </button>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-2">

            {/* Weather Widget */}
            <div className="mr-2">
              <WeatherWidget />
            </div>

            {navItems.map((item, index) => (
              <Button
                key={item.id}
                variant={activeTab === item.id ? "default" : "ghost"}
                onClick={() => onTabChange(item.id)}
                className="gap-2 press-effect animate-fade-in"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <item.icon className={`w-4 h-4 ${activeTab === item.id ? "" : "group-hover:rotate-12"} transition-transform`} />
                {item.label}
              </Button>
            ))}
            <div className="ml-2 pl-2 border-l border-border">
              <ThemeToggle />
            </div>
          </div>

          {/* Mobile Menu Button */}
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? <X /> : <Menu />}
          </Button>
        </div>

        {/* Mobile Navigation */}
        <div
          className={cn(
            "md:hidden overflow-hidden transition-all duration-300",
            isMobileMenuOpen ? "max-h-48 pb-4" : "max-h-0"
          )}
        >
          <div className="flex flex-col gap-2">
            {navItems.map((item) => (
              <Button
                key={item.id}
                variant={activeTab === item.id ? "default" : "ghost"}
                onClick={() => {
                  onTabChange(item.id);
                  setIsMobileMenuOpen(false);
                }}
                className="justify-start gap-2"
              >
                <item.icon className="w-4 h-4" />
                {item.label}
              </Button>
            ))}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
