import { useState } from "react";
import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import CropScanner from "@/components/CropScanner";
import CommunityFeed from "@/components/CommunityFeed";
import ProductShop from "@/components/ProductShop";
import Logo from "@/components/Logo";
import LeafBot from "@/components/LeafBot";
import ScrollProgress from "@/components/ScrollProgress";
import { AnimatePresence, motion } from "framer-motion";

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
        return <HeroSection
          onGetStarted={() => setActiveTab("scan")}
          onJoinCommunity={() => setActiveTab("community")}
        />;
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <ScrollProgress />
      <Navbar activeTab={activeTab} onTabChange={setActiveTab} />

      <AnimatePresence mode="wait">
        <motion.main
          key={activeTab}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.3 }}
          className="min-h-[calc(100vh-4rem)]" // Ensure min height for transitions
        >
          {renderContent()}
        </motion.main>
      </AnimatePresence>

      {/* Footer */}
      <footer className="border-t border-border bg-card/50 py-8">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <Logo size="sm" />
            </div>
            <p className="text-sm text-muted-foreground">
              © 2024 Crop Care Connect. Protecting farmers worldwide.
            </p>
          </div>
        </div>
      </footer>
      <LeafBot />
    </div>
  );
};

export default Index;
