import { Button } from "@/components/ui/button";
import { Scan, Users, ShoppingBag, ArrowRight, Leaf } from "lucide-react";

interface HeroSectionProps {
  onGetStarted: () => void;
  onJoinCommunity: () => void;
}

const HeroSection = ({ onGetStarted, onJoinCommunity }: HeroSectionProps) => {
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
      {/* Animated Background Pattern */}
      <div className="absolute inset-0 opacity-[0.03]">
        <div className="absolute top-20 left-10 w-32 h-32 rounded-full border-2 border-primary animate-pulse-glow" />
        <div className="absolute top-40 right-20 w-24 h-24 rounded-full border-2 border-secondary animate-float" />
        <div className="absolute bottom-32 left-1/4 w-16 h-16 rounded-full border-2 border-primary animate-float-delayed" />
        <div className="absolute top-1/2 right-1/3 w-20 h-20 rounded-full border-2 border-accent animate-spin-slow opacity-50" />
      </div>

      {/* Floating Leaves with enhanced animation */}
      <div className="absolute top-32 right-[15%] animate-float">
        <Leaf className="w-8 h-8 text-primary/20 animate-wiggle" />
      </div>
      <div className="absolute bottom-40 left-[10%] animate-float-delayed">
        <Leaf className="w-6 h-6 text-primary/15" />
      </div>
      <div className="absolute top-1/2 left-[5%] animate-float" style={{ animationDelay: "1s" }}>
        <Leaf className="w-5 h-5 text-accent/20" />
      </div>
      <div className="absolute bottom-1/4 right-[8%] animate-float-delayed" style={{ animationDelay: "3s" }}>
        <Leaf className="w-7 h-7 text-primary/10" />
      </div>

      <div className="container mx-auto px-4 py-16 md:py-24 relative z-10">
        <div className="max-w-4xl mx-auto text-center">
          {/* Badge with bounce animation */}
          <div className="inline-flex items-center gap-2 bg-primary/10 border border-primary/20 rounded-full px-4 py-2 mb-8 animate-bounce-in">
            <span className="w-2 h-2 bg-success rounded-full animate-pulse" />
            <span className="text-sm font-medium text-primary">AI-Powered Crop Protection</span>
          </div>

          {/* Heading with stagger effect */}
          <h1 className="font-display text-4xl md:text-6xl lg:text-7xl font-bold text-foreground mb-6 leading-tight">
            <span className="inline-block animate-fade-in-up">Protect Your Crops with</span>
            <span className="block text-gradient animate-fade-in-up" style={{ animationDelay: "0.2s" }}>
              Intelligent Care
            </span>
          </h1>

          {/* Subheading */}
          <p className="text-lg md:text-xl text-muted-foreground mb-10 max-w-2xl mx-auto animate-fade-in-up" style={{ animationDelay: "0.4s" }}>
            Detect crop diseases instantly using AI, connect with farmers worldwide,
            and get expert product recommendations to keep your harvest healthy.
          </p>

          {/* CTA Buttons with enhanced hover */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16 animate-fade-in-up" style={{ animationDelay: "0.6s" }}>
            <Button variant="hero" size="xl" onClick={onGetStarted} className="press-effect animate-pulse-glow">
              Scan Your Crop
              <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
            </Button>
            <Button variant="outline" size="xl" onClick={onJoinCommunity} className="press-effect hover-glow">
              Join Community
            </Button>
          </div>

          {/* Feature Cards with stagger and hover effects */}
          <div className="grid md:grid-cols-3 gap-6 mt-16 stagger-children">
            {features.map((feature, index) => (
              <div
                key={feature.title}
                className="glass-card rounded-2xl p-6 shadow-card hover-lift hover-glow cursor-pointer group"
                style={{ animationDelay: `${0.8 + index * 0.1}s` }}
              >
                <div className="w-14 h-14 gradient-primary rounded-xl flex items-center justify-center mb-4 mx-auto shadow-md group-hover:scale-110 group-hover:rotate-3 transition-all duration-300">
                  <feature.icon className="w-7 h-7 text-primary-foreground" />
                </div>
                <h3 className="font-display font-semibold text-lg text-foreground mb-2 group-hover:text-primary transition-colors">
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
