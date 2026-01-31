import { useState } from "react";
import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import CropScanner from "@/components/CropScanner";
import CommunityFeed from "@/components/CommunityFeed";
import ProductShop from "@/components/ProductShop";

const Index = () => {
  const [activeTab, setActiveTab] = useState("home");

  const renderContent = () => {
    switch (activeTab) {
      case "scan":
        return <CropScanner />;
      case "community":
        return <CommunityFeed />;
      case "shop":
        return <ProductShop />;
      default:
        return <HeroSection onGetStarted={() => setActiveTab("scan")} />;
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar activeTab={activeTab} onTabChange={setActiveTab} />
      <main>{renderContent()}</main>
      
      {/* Footer */}
      <footer className="border-t border-border bg-card/50 py-8">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 gradient-primary rounded-lg flex items-center justify-center">
                <svg
                  className="w-4 h-4 text-primary-foreground"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z"
                  />
                </svg>
              </div>
              <span className="font-display font-semibold text-foreground">
                CropGuard
              </span>
            </div>
            <p className="text-sm text-muted-foreground">
              © 2024 CropGuard. Protecting farmers worldwide.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
