import { Button } from "@/components/ui/button";
import { Scan, Users, ShoppingBag, ArrowRight, Leaf } from "lucide-react";

interface HeroSectionProps {
  onGetStarted: () => void;
}

const HeroSection = ({ onGetStarted }: HeroSectionProps) => {
  const features = [
    {
      icon: Scan,
      title: "AI Disease Detection",
      description: "Upload a photo of your crop and get instant disease diagnosis",
    },
    {
      icon: Users,
      title: "Farmer Community",
      description: "Connect with fellow farmers, share experiences and learn together",
    },
    {
      icon: ShoppingBag,
      title: "Smart Recommendations",
      description: "Get personalized product suggestions to protect your crops",
    },
  ];

  return (
    <section className="min-h-[calc(100vh-4rem)] gradient-hero relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-[0.03]">
        <div className="absolute top-20 left-10 w-32 h-32 rounded-full border-2 border-primary" />
        <div className="absolute top-40 right-20 w-24 h-24 rounded-full border-2 border-secondary" />
        <div className="absolute bottom-32 left-1/4 w-16 h-16 rounded-full border-2 border-primary" />
      </div>

      {/* Floating Leaves */}
      <div className="absolute top-32 right-[15%] animate-float">
        <Leaf className="w-8 h-8 text-primary/20" />
      </div>
      <div className="absolute bottom-40 left-[10%] animate-float" style={{ animationDelay: "2s" }}>
        <Leaf className="w-6 h-6 text-primary/15" />
      </div>

      <div className="container mx-auto px-4 py-16 md:py-24 relative z-10">
        <div className="max-w-4xl mx-auto text-center animate-fade-in">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 bg-primary/10 border border-primary/20 rounded-full px-4 py-2 mb-8">
            <span className="w-2 h-2 bg-success rounded-full animate-pulse" />
            <span className="text-sm font-medium text-primary">AI-Powered Crop Protection</span>
          </div>

          {/* Heading */}
          <h1 className="font-display text-4xl md:text-6xl lg:text-7xl font-bold text-foreground mb-6 leading-tight">
            Protect Your Crops with
            <span className="block text-primary">Intelligent Care</span>
          </h1>

          {/* Subheading */}
          <p className="text-lg md:text-xl text-muted-foreground mb-10 max-w-2xl mx-auto">
            Detect crop diseases instantly using AI, connect with farmers worldwide, 
            and get expert product recommendations to keep your harvest healthy.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
            <Button variant="hero" size="xl" onClick={onGetStarted}>
              Scan Your Crop
              <ArrowRight className="w-5 h-5" />
            </Button>
            <Button variant="outline" size="xl" onClick={() => {}}>
              Join Community
            </Button>
          </div>

          {/* Feature Cards */}
          <div className="grid md:grid-cols-3 gap-6 mt-16">
            {features.map((feature, index) => (
              <div
                key={feature.title}
                className="glass-card rounded-2xl p-6 shadow-card hover:shadow-lg transition-all duration-300 hover:-translate-y-1 animate-fade-in"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="w-14 h-14 gradient-primary rounded-xl flex items-center justify-center mb-4 mx-auto shadow-md">
                  <feature.icon className="w-7 h-7 text-primary-foreground" />
                </div>
                <h3 className="font-display font-semibold text-lg text-foreground mb-2">
                  {feature.title}
                </h3>
                <p className="text-muted-foreground text-sm">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
