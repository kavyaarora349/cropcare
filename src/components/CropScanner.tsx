import { useState, useCallback } from "react";
import { cn } from "@/lib/utils";
import { Button, buttonVariants } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Upload, Camera, Loader2, AlertTriangle, CheckCircle, Leaf, X, AlertCircle } from "lucide-react";

interface AnalysisResult {
  disease: string;
  confidence: number;
  severity: "low" | "medium" | "high";
  description: string;
  suggestions: string[];
  products: { name: string; type: string; price: string; image?: string; purchase_url?: string }[];
}

const CropScanner = () => {
  const [image, setImage] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [cropType, setCropType] = useState<string | undefined>(undefined);

  const [error, setError] = useState<string | null>(null);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    if (file && file.type.startsWith("image/")) {
      const reader = new FileReader();
      reader.onload = () => setImage(reader.result as string);
      reader.readAsDataURL(file);
    }
  }, []);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => setImage(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  const dataUrlToBlob = (dataUrl: string): Blob => {
    const [header, base64] = dataUrl.split(",");
    const mime = header.match(/:(.*?);/)?.[1] ?? "image/jpeg";
    const bin = atob(base64);
    const arr = new Uint8Array(bin.length);
    for (let i = 0; i < bin.length; i++) arr[i] = bin.charCodeAt(i);
    return new Blob([arr], { type: mime });
  };

  const analyzeImage = async () => {
    if (!image) return;
    setIsAnalyzing(true);
    setError(null);
    try {
      const formData = new FormData();
      formData.append("file", dataUrlToBlob(image), "leaf.jpg");
      const url = cropType ? `/api/analyze?crop_type=${encodeURIComponent(cropType)}` : "/api/analyze";
      const apiRes = await fetch(url, {
        method: "POST",
        body: formData,
      });
      if (!apiRes.ok) {
        const msg = await apiRes.json().catch(() => ({ detail: apiRes.statusText }));
        throw new Error(msg.detail || `Request failed: ${apiRes.status}`);
      }
      const data = await apiRes.json();
      setResult({
        disease: data.disease,
        confidence: data.confidence,
        severity: data.severity,
        description: data.description,
        suggestions: data.suggestions,
        products: data.products,
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Analysis failed. Please try again.");
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleProductClick = (purchaseUrl: string) => {
    window.open(purchaseUrl, '_blank', 'noopener,noreferrer');
  };

  const resetScanner = () => {
    setImage(null);
    setResult(null);
    setError(null);
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "low":
        return "bg-success/10 text-success border-success/20";
      case "medium":
        return "bg-warning/10 text-warning border-warning/20";
      case "high":
        return "bg-destructive/10 text-destructive border-destructive/20";
      default:
        return "bg-muted text-muted-foreground";
    }
  };

  return (
    <section className="py-12 md:py-20">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-10 animate-fade-in">
            <div className="inline-flex items-center gap-2 bg-primary/10 rounded-full px-4 py-2 mb-4">
              <Camera className="w-4 h-4 text-primary" />
              <span className="text-sm font-medium text-primary">AI Scanner</span>
            </div>
            <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-4">
              Scan Your Crop
            </h2>
            <p className="text-muted-foreground max-w-xl mx-auto">
              Upload or take a photo of your crop to instantly detect diseases and get treatment recommendations
            </p>
          </div>

          {!result ? (
            <div className="space-y-6 animate-fade-in">
              {/* Crop Type Selection */}
              <Card className="p-6 shadow-card animate-fade-in-up">
                <div className="flex items-center gap-2 mb-4">
                  <Leaf className="w-5 h-5 text-primary" />
                  <h3 className="font-display font-semibold text-lg text-foreground">
                    Select Crop Type (Optional)
                  </h3>
                </div>
                <p className="text-muted-foreground text-sm mb-4">
                  Choose the crop type to get more accurate disease predictions by filtering results to relevant diseases only.
                </p>
                <Select value={cropType} onValueChange={setCropType}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select crop type (leave empty for all)" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Apple">Apple</SelectItem>
                    <SelectItem value="Corn">Corn (Maize)</SelectItem>
                    <SelectItem value="Grape">Grape</SelectItem>
                    <SelectItem value="Cherry">Cherry</SelectItem>
                    <SelectItem value="Blueberry">Blueberry</SelectItem>
                  </SelectContent>
                </Select>
              </Card>

              {/* Upload Area */}
              <Card
                className={`relative border-2 border-dashed transition-all duration-300 ${isDragging
                  ? "border-primary bg-primary/5"
                  : image
                    ? "border-success bg-success/5"
                    : "border-border hover:border-primary/50"
                  }`}
                onDragOver={(e) => {
                  e.preventDefault();
                  setIsDragging(true);
                }}
                onDragLeave={() => setIsDragging(false)}
                onDrop={handleDrop}
              >
                {image ? (
                  <div className="relative">
                    <img
                      src={image}
                      alt="Crop preview"
                      className="w-full h-64 md:h-80 object-cover rounded-lg"
                    />
                    <Button
                      variant="destructive"
                      size="icon"
                      className="absolute top-4 right-4"
                      onClick={resetScanner}
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  </div>
                ) : (
                  <div className="p-12 md:p-16 text-center group">
                    <div className="w-20 h-20 mx-auto mb-6 rounded-2xl bg-muted flex items-center justify-center group-hover:bg-primary/10 transition-colors duration-300">
                      <Upload className="w-10 h-10 text-muted-foreground group-hover:text-primary transition-colors duration-300 group-hover:animate-bounce" />
                    </div>
                    <h3 className="font-display font-semibold text-lg text-foreground mb-2">
                      Drop your image here
                    </h3>
                    <p className="text-muted-foreground mb-6">
                      or click to browse from your device
                    </p>
                    <label className={cn(buttonVariants({ variant: "outline" }), "cursor-pointer press-effect hover-glow flex items-center gap-2")}>
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={handleFileSelect}
                      />
                      <Camera className="w-4 h-4" />
                      Choose Image
                    </label>
                  </div>
                )}
              </Card>

              {/* Error */}
              {error && (
                <div className="flex items-center gap-2 p-4 rounded-lg bg-destructive/10 text-destructive border border-destructive/20 animate-fade-in">
                  <AlertCircle className="w-5 h-5 flex-shrink-0" />
                  <p className="text-sm">{error}</p>
                </div>
              )}

              {/* Analyze Button */}
              {image && (
                <div className="flex justify-center animate-bounce-in">
                  <Button
                    variant="hero"
                    size="xl"
                    onClick={analyzeImage}
                    disabled={isAnalyzing}
                    className="press-effect"
                  >
                    {isAnalyzing ? (
                      <>
                        <Loader2 className="w-5 h-5 animate-spin" />
                        <span className="shimmer bg-clip-text">Analyzing...</span>
                      </>
                    ) : (
                      <>
                        <Leaf className="w-5 h-5" />
                        Analyze Crop
                      </>
                    )}
                  </Button>
                </div>
              )}
            </div>
          ) : (
            <div className="space-y-6">
              {/* Result Header */}
              <Card className="p-6 shadow-card animate-scale-in-center overflow-hidden">
                <div className="flex items-start gap-4">
                  <img
                    src={image!}
                    alt="Analyzed crop"
                    className="w-24 h-24 rounded-xl object-cover ring-2 ring-primary/20"
                  />
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="font-display font-bold text-2xl text-foreground animate-fade-in-up">
                        {result.disease}
                      </h3>
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-medium border animate-bounce-in ${getSeverityColor(
                          result.severity
                        )}`}
                        style={{ animationDelay: "0.2s" }}
                      >
                        {result.severity.toUpperCase()} SEVERITY
                      </span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground animate-fade-in" style={{ animationDelay: "0.3s" }}>
                      <CheckCircle className="w-4 h-4 text-success" />
                      {result.confidence}% confidence
                    </div>
                    <p className="mt-3 text-muted-foreground text-sm leading-relaxed animate-fade-in" style={{ animationDelay: "0.4s" }}>
                      {result.description}
                    </p>
                  </div>
                </div>
              </Card>

              {/* Suggestions */}
              <Card className="p-6 shadow-card animate-fade-in-up" style={{ animationDelay: "0.2s" }}>
                <div className="flex items-center gap-2 mb-4">
                  <AlertTriangle className="w-5 h-5 text-warning animate-wiggle" />
                  <h4 className="font-display font-semibold text-lg text-foreground">
                    Treatment Suggestions
                  </h4>
                </div>
                <ul className="space-y-3 stagger-children">
                  {result.suggestions.map((suggestion, index) => (
                    <li
                      key={index}
                      className="flex items-start gap-3 text-muted-foreground group hover:text-foreground transition-colors cursor-default"
                    >
                      <span className="w-6 h-6 rounded-full bg-primary/10 text-primary text-xs font-medium flex items-center justify-center flex-shrink-0 mt-0.5 group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                        {index + 1}
                      </span>
                      {suggestion}
                    </li>
                  ))}
                </ul>
              </Card>

              {/* Recommended Products */}
              <Card className="p-6 shadow-card animate-fade-in-up" style={{ animationDelay: "0.4s" }}>
                <h4 className="font-display font-semibold text-lg text-foreground mb-4">
                  Recommended Products
                </h4>
                <div className="grid sm:grid-cols-3 gap-4">
                  {result.products.map((product, index) => (
                    <div
                      key={index}
                      className="rounded-xl bg-muted/50 border border-border hover:border-primary/30 hover-lift hover-glow transition-all cursor-pointer animate-scale-in overflow-hidden"
                      style={{ animationDelay: `${0.5 + index * 0.1}s` }}
                      onClick={() => product.purchase_url && handleProductClick(product.purchase_url)}
                    >
                      {/* Product Image */}
                      {product.image && (
                        <div className="relative h-32 bg-gradient-to-br from-muted to-muted/50 overflow-hidden">
                          <img
                            src={product.image}
                            alt={product.name}
                            className="w-full h-full object-contain p-2"
                            onError={(e) => {
                              e.currentTarget.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjQiIGhlaWdodD0iNjQiIHZpZXdCb3g9IjAgMCA2NCA2NCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3Qgd2lkdGg9IjY0IiBoZWlnaHQ9IjY0IiBmaWxsPSIjRjNGNEY2Ii8+CjxwYXRoIGQ9Ik0yMCAzMkM0NCAzMiA0NCAzMIDIwIDMyWiIgZmlsbD0iI0Q5RDlEOSIvPgo8cGF0aCBkPSJNMjAgMzJMNCA0OEw0IDMyTDIwIDE2WiIgZmlsbD0iI0JGQkZGRiIvPgo8L3N2Zz4K';
                            }}
                          />
                          {product.purchase_url && (
                            <div className="absolute top-2 right-2 bg-primary/90 text-primary-foreground text-xs px-2 py-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity">
                              Click to Buy
                            </div>
                          )}
                        </div>
                      )}
                      <div className="p-4">
                        <span className="text-xs font-medium text-primary bg-primary/10 px-2 py-1 rounded-full">
                          {product.type}
                        </span>
                        <h5 className="font-semibold text-foreground mt-2">
                          {product.name}
                        </h5>
                        <p className="text-lg font-bold text-gradient mt-1">
                          {product.price}
                        </p>
                        <Button variant="outline" size="sm" className="w-full mt-3 press-effect">
                          {product.purchase_url ? "Buy Now" : "View Details"}
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </Card>

              {/* Scan Another */}
              <div className="flex justify-center animate-fade-in" style={{ animationDelay: "0.6s" }}>
                <Button variant="outline" size="lg" onClick={resetScanner} className="press-effect hover-glow">
                  Scan Another Crop
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default CropScanner;
