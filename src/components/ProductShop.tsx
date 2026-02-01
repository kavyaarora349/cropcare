import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  ShoppingCart,
  Star,
  Search,
  Filter,
  Leaf,
  Shield,
  Droplets,
  Bug,
} from "lucide-react";

interface Product {
  id: number;
  name: string;
  category: string;
  description: string;
  price: number;
  originalPrice?: number;
  rating: number;
  reviews: number;
  image: string;
  badge?: string;
  icon: typeof Leaf;
  purchaseUrl?: string;
}

const ProductShop = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");

  const handleProductClick = (purchaseUrl: string) => {
    window.open(purchaseUrl, '_blank', 'noopener,noreferrer');
  };

  const categories = [
    { id: "all", label: "All Products", icon: ShoppingCart },
    { id: "fungicide", label: "Fungicides", icon: Shield },
    { id: "pesticide", label: "Pesticides", icon: Bug },
    { id: "fertilizer", label: "Fertilizers", icon: Leaf },
    { id: "equipment", label: "Equipment", icon: Droplets },
  ];

  const products: Product[] = [
    {
      id: 1,
      name: "Bayer Nativo 75 WG",
      category: "fungicide",
      description: "Broad-spectrum fungicide for effective control of leaf blight, powdery mildew, and rust diseases.",
      price: 850,
      originalPrice: 950,
      rating: 4.8,
      reviews: 342,
      image: "https://images.unsplash.com/photo-1595246140625-573b715d11dc?w=400&h=300&fit=crop",
      badge: "Best Seller",
      icon: Shield,
      purchaseUrl: "https://www.amazon.in/s?k=bayer+nativo+75+wg+fungicide&ref=nb_sb_noss_2",
    },
    {
      id: 2,
      name: "Tata Rallis Manik",
      category: "pesticide",
      description: "Natural pest control spray safe for organic farming. Controls aphids, whiteflies, and mites.",
      price: 380,
      rating: 4.6,
      reviews: 256,
      image: "https://images.unsplash.com/photo-1615486511484-92e004640864?w=400&h=300&fit=crop",
      icon: Bug,
      purchaseUrl: "https://www.amazon.in/s?k=tata+rallis+manik+insecticide&ref=nb_sb_noss_2",
    },
    {
      id: 3,
      name: "Iffco Nano Urea",
      category: "fertilizer",
      description: "Balanced NPK fertilizer with micronutrients for healthy plant growth and higher yields.",
      price: 240,
      rating: 4.9,
      reviews: 521,
      image: "https://images.unsplash.com/photo-1605000797499-95a51c5269ae?w=400&h=300&fit=crop",
      badge: "Organic",
      icon: Leaf,
      purchaseUrl: "https://www.amazon.in/s?k=iffco+nano+urea&ref=nb_sb_noss_2",
    },
    {
      id: 4,
      name: "Syngenta Amistar Top",
      category: "fungicide",
      description: "Systemic fungicide that provides protection from inside the plant. Long-lasting formula.",
      price: 1200,
      rating: 4.7,
      reviews: 189,
      image: "https://images.unsplash.com/photo-1585314062340-f1a5a7c9328d?w=400&h=300&fit=crop",
      icon: Shield,
      purchaseUrl: "https://www.amazon.in/s?k=syngenta+amistar+top+fungicide&ref=nb_sb_noss_2",
    },
    {
      id: 5,
      name: "Bayer Confidor",
      category: "pesticide",
      description: "Biological pest control using beneficial microorganisms. Safe for bees and beneficial insects.",
      price: 450,
      originalPrice: 520,
      rating: 4.5,
      reviews: 167,
      image: "https://images.unsplash.com/photo-1530836369250-ef72a3f5cda8?w=400&h=300&fit=crop",
      badge: "Eco-Friendly",
      icon: Bug,
      purchaseUrl: "https://www.amazon.in/s?k=bayer+confidor+insecticide&ref=nb_sb_noss_2",
    },
    {
      id: 6,
      name: "KisanKraft Battery Sprayer",
      category: "equipment",
      description: "Battery-powered backpack sprayer with adjustable nozzle and 16L capacity.",
      price: 3500,
      rating: 4.8,
      reviews: 423,
      image: "https://images.unsplash.com/photo-1574943320219-553eb213da96?w=400&h=300&fit=crop",
      icon: Droplets,
      purchaseUrl: "https://www.amazon.in/s?k=kisankraft+battery+sprayer&ref=nb_sb_noss_2",
    },
  ];

  const filteredProducts = products.filter((product) => {
    const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === "all" || product.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <section className="py-12 md:py-20">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-10 animate-fade-in">
          <div className="inline-flex items-center gap-2 bg-primary/10 rounded-full px-4 py-2 mb-4">
            <ShoppingCart className="w-4 h-4 text-primary" />
            <span className="text-sm font-medium text-primary">Shop</span>
          </div>
          <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-4">
            Recommended Products
          </h2>
          <p className="text-muted-foreground max-w-xl mx-auto">
            Quality products to protect and nourish your crops, recommended based on common diseases
          </p>
        </div>

        {/* Search and Filter */}
        <div className="max-w-4xl mx-auto mb-8 animate-fade-in">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <Input
                placeholder="Search products..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <div className="flex gap-2 overflow-x-auto pb-2 sm:pb-0">
              {categories.map((cat) => (
                <Button
                  key={cat.id}
                  variant={selectedCategory === cat.id ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSelectedCategory(cat.id)}
                  className="whitespace-nowrap"
                >
                  <cat.icon className="w-4 h-4 mr-1" />
                  {cat.label}
                </Button>
              ))}
            </div>
          </div>
        </div>

        {/* Products Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto stagger-children">
          {filteredProducts.map((product, index) => (
            <Card
              key={product.id}
              className="overflow-hidden shadow-card hover-lift hover-glow transition-all cursor-pointer group"
              onClick={() => product.purchaseUrl && handleProductClick(product.purchaseUrl)}
            >
              {/* Product Image */}
              <div className="relative h-48 bg-gradient-to-br from-muted to-muted/50 overflow-hidden">
                {product.image ? (
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-full object-cover p-0 group-hover:scale-110 transition-all duration-300"
                    onError={(e) => {
                      // Fallback to icon if image fails to load
                      e.currentTarget.style.display = 'none';
                      const fallback = e.currentTarget.nextElementSibling as HTMLElement;
                      if (fallback) fallback.style.display = 'flex';
                    }}
                  />
                ) : null}
                <div className="absolute inset-0 items-center justify-center hidden">
                  <div className="w-20 h-20 rounded-2xl gradient-primary flex items-center justify-center shadow-lg">
                    <product.icon className="w-10 h-10 text-primary-foreground" />
                  </div>
                </div>
                {product.badge && (
                  <Badge className="absolute top-3 left-3 bg-accent text-accent-foreground animate-bounce-in">
                    {product.badge}
                  </Badge>
                )}
                {product.purchaseUrl && (
                  <div className="absolute top-3 right-3 bg-primary/90 text-primary-foreground text-xs px-2 py-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity">
                    Click to Buy
                  </div>
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-background/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>

              {/* Product Info */}
              <div className="p-4">
                <div className="flex items-start justify-between gap-2 mb-2">
                  <h3 className="font-display font-semibold text-lg text-foreground">
                    {product.name}
                  </h3>
                  <span className="text-xs font-medium text-muted-foreground bg-muted px-2 py-1 rounded-full capitalize">
                    {product.category}
                  </span>
                </div>

                <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
                  {product.description}
                </p>

                {/* Rating */}
                <div className="flex items-center gap-2 mb-4">
                  <div className="flex items-center gap-1">
                    <Star className="w-4 h-4 fill-warning text-warning" />
                    <span className="text-sm font-medium text-foreground">
                      {product.rating}
                    </span>
                  </div>
                  <span className="text-sm text-muted-foreground">
                    ({product.reviews} reviews)
                  </span>
                </div>

                {/* Price and CTA */}
                <div className="flex items-center justify-between">
                  <div className="flex items-baseline gap-2">
                    <span className="text-xl font-bold text-gradient">
                      ₹{product.price}
                    </span>
                    {product.originalPrice && (
                      <span className="text-sm text-muted-foreground line-through">
                        ₹{product.originalPrice}
                      </span>
                    )}
                  </div>
                  <Button variant="default" size="sm" className="press-effect">
                    <ShoppingCart className="w-4 h-4 mr-1 group-hover:animate-wiggle" />
                    {product.purchaseUrl ? "Buy Now" : "Add"}
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>

        {filteredProducts.length === 0 && (
          <div className="text-center py-12">
            <p className="text-muted-foreground">No products found matching your search.</p>
          </div>
        )}
      </div>
    </section>
  );
};

export default ProductShop;
