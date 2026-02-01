import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import {
  Heart,
  MessageCircle,
  Share2,
  Image as ImageIcon,
  Send,
  MapPin,
  Leaf,
  Trophy,
  Star,
  ShieldCheck,
  TrendingUp,
  Clock,
  Filter
} from "lucide-react";
import { toast } from "sonner";

interface Comment {
  id: number;
  author: string;
  avatar: string;
  content: string;
  timeAgo: string;
}

interface Post {
  id: number;
  author: {
    name: string;
    avatar: string;
    location: string;
    badge?: "expert" | "contributor" | "verified";
  };
  content: string;
  image?: string;
  likes: number;
  comments: number;
  commentsList: Comment[];
  timeAgo: string;
  timestamp: number; // For sorting
  isLiked: boolean;
  tags: string[];
}

const CommunityFeed = () => {
  const [newPost, setNewPost] = useState("");
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [activeFilter, setActiveFilter] = useState<"trending" | "newest">("trending");
  const [expandedComments, setExpandedComments] = useState<number[]>([]);

  const [posts, setPosts] = useState<Post[]>([
    {
      id: 1,
      author: {
        name: "Rajesh Kumar",
        avatar: "",
        location: "Punjab, India",
        badge: "expert",
      },
      content:
        "Just harvested my tomatoes! 🍅 This season was incredible thanks to the early disease detection. CropGuard helped me identify leaf blight early and saved 80% of my crop. Highly recommend for all farmers!",
      likes: 234,
      comments: 2,
      commentsList: [
        { id: 101, author: "Amit Singh", avatar: "", content: "Great harvest! What fungicide did you use?", timeAgo: "1h ago" },
        { id: 102, author: "Rajesh Kumar", avatar: "", content: "I used the organic neem solution recommended by the app.", timeAgo: "30m ago" }
      ],
      timeAgo: "2 hours ago",
      timestamp: Date.now() - 7200000,
      isLiked: false,
      tags: ["tomatoes", "success", "harvest"],
    },
    {
      id: 2,
      author: {
        name: "Maria Santos",
        avatar: "",
        location: "California, USA",
        badge: "contributor",
      },
      content:
        "Has anyone dealt with powdery mildew on grape vines this season? Looking for organic treatment options. My vineyard is about 3 acres and I want to avoid chemical fungicides if possible.",
      likes: 89,
      comments: 3,
      commentsList: [
        { id: 201, author: "David Chen", avatar: "", content: "Try baking soda and water mixture, worked for me.", timeAgo: "2h ago" },
        { id: 202, author: "Sarah Jones", avatar: "", content: "Sulfur dust is also effective and organic approved.", timeAgo: "1h ago" }
      ],
      timeAgo: "5 hours ago",
      timestamp: Date.now() - 18000000,
      isLiked: true,
      tags: ["grapes", "organic", "help"],
    },
    {
      id: 3,
      author: {
        name: "John Okonkwo",
        avatar: "",
        location: "Lagos, Nigeria",
        badge: "verified",
      },
      content:
        "Pro tip for cassava farmers: Regular monitoring with the scan feature has helped me prevent brown streak disease three times this year. Prevention is always better than cure! 🌱",
      likes: 567,
      comments: 1,
      commentsList: [
        { id: 301, author: "Kofi Mensah", avatar: "", content: "Thanks for the tip! I will start checking weekly.", timeAgo: "5h ago" }
      ],
      timeAgo: "1 day ago",
      timestamp: Date.now() - 86400000,
      isLiked: false,
      tags: ["cassava", "tips", "prevention"],
    },
    {
      id: 4,
      author: {
        name: "Emily Chen",
        avatar: "",
        location: "British Columbia, Canada",
      },
      content:
        "Beautiful morning in the apple orchard! 🍎 Started using integrated pest management this year and the results are amazing. Less pesticide use, healthier trees, and the beneficial insects are thriving.",
      likes: 412,
      comments: 0,
      commentsList: [],
      timeAgo: "2 days ago",
      timestamp: Date.now() - 172800000,
      isLiked: false,
      tags: ["apples", "IPM", "sustainable"],
    },
  ]);

  // Sort posts based on active filter
  const sortedPosts = [...posts].sort((a, b) => {
    if (activeFilter === "trending") {
      return b.likes - a.likes;
    } else {
      return b.timestamp - a.timestamp;
    }
  });

  const handleLike = (postId: number) => {
    setPosts(
      posts.map((post) =>
        post.id === postId
          ? {
            ...post,
            isLiked: !post.isLiked,
            likes: post.isLiked ? post.likes - 1 : post.likes + 1,
          }
          : post
      )
    );
  };

  const toggleComments = (postId: number) => {
    setExpandedComments(prev =>
      prev.includes(postId)
        ? prev.filter(id => id !== postId)
        : [...prev, postId]
    );
  };

  const handleShare = () => {
    toast.success("Link copied to clipboard!", {
      description: "Share this post with your network",
    });
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setSelectedImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handlePost = () => {
    if (!newPost.trim() && !selectedImage) return;

    const post: Post = {
      id: Date.now(),
      author: {
        name: "You",
        avatar: "",
        location: "Your Location",
      },
      content: newPost,
      image: selectedImage || undefined,
      likes: 0,
      comments: 0,
      commentsList: [],
      timeAgo: "Just now",
      timestamp: Date.now(),
      isLiked: false,
      tags: [],
    };

    setPosts([post, ...posts]);
    setNewPost("");
    setSelectedImage(null);
    toast.success("Post created successfully!");
  };

  const getBadgeIcon = (type?: string) => {
    switch (type) {
      case "expert":
        return <Trophy className="w-3 h-3 text-yellow-500" />;
      case "contributor":
        return <Star className="w-3 h-3 text-blue-500" />;
      case "verified":
        return <ShieldCheck className="w-3 h-3 text-green-500" />;
      default:
        return null;
    }
  };

  const getBadgeLabel = (type?: string) => {
    switch (type) {
      case "expert": return "Expert Farmer";
      case "contributor": return "Top Contributor";
      case "verified": return "Verified";
      default: return "";
    }
  };

  return (
    <section className="py-12 md:py-20 bg-muted/30">
      <div className="container mx-auto px-4">
        <div className="max-w-2xl mx-auto">
          {/* Header */}
          <div className="text-center mb-10 animate-fade-in">
            <div className="inline-flex items-center gap-2 bg-primary/10 rounded-full px-4 py-2 mb-4">
              <MessageCircle className="w-4 h-4 text-primary" />
              <span className="text-sm font-medium text-primary">Community</span>
            </div>
            <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-4">
              Farmer Community
            </h2>
            <p className="text-muted-foreground">
              Connect with farmers worldwide, share experiences, and learn from each other
            </p>
          </div>

          {/* Create Post */}
          <Card className="p-4 mb-8 shadow-card animate-fade-in">
            <div className="flex gap-3">
              <Avatar className="w-10 h-10">
                <AvatarFallback className="bg-primary/10 text-primary font-medium">
                  Y
                </AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <Textarea
                  placeholder="Share your farming experience, ask questions, or give tips..."
                  value={newPost}
                  onChange={(e) => setNewPost(e.target.value)}
                  className="min-h-[80px] resize-none border-0 bg-muted/50 focus-visible:ring-1"
                />

                {selectedImage && (
                  <div className="mt-2 relative inline-block animate-fade-in">
                    <img
                      src={selectedImage}
                      alt="Preview"
                      className="max-h-40 rounded-lg object-cover"
                    />
                    <Button
                      variant="destructive"
                      size="icon"
                      className="absolute -top-2 -right-2 w-6 h-6 rounded-full"
                      onClick={() => setSelectedImage(null)}
                    >
                      ×
                    </Button>
                  </div>
                )}

                <div className="flex items-center justify-between mt-3">
                  <div className="relative">
                    <input
                      type="file"
                      accept="image/*"
                      id="image-upload"
                      className="hidden"
                      onChange={handleImageUpload}
                    />
                    <label htmlFor="image-upload">
                      <Button variant="ghost" size="sm" className="text-muted-foreground cursor-pointer hover:bg-primary/10 hover:text-primary transition-colors" asChild>
                        <span>
                          <ImageIcon className="w-4 h-4 mr-2" />
                          Add Photo
                        </span>
                      </Button>
                    </label>
                  </div>
                  <Button
                    variant="hero"
                    size="sm"
                    onClick={handlePost}
                    disabled={!newPost.trim() && !selectedImage}
                    className="transition-all duration-300"
                  >
                    <Send className="w-4 h-4 mr-2" />
                    Post
                  </Button>
                </div>
              </div>
            </div>
          </Card>

          {/* Feed Filter */}
          <div className="flex items-center justify-between mb-6 animate-fade-in">
            <div className="flex bg-muted p-1 rounded-lg">
              <button
                onClick={() => setActiveFilter("trending")}
                className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-all ${activeFilter === "trending"
                  ? "bg-background text-foreground shadow-sm"
                  : "text-muted-foreground hover:text-foreground"
                  }`}
              >
                <TrendingUp className="w-4 h-4" />
                Trending
              </button>
              <button
                onClick={() => setActiveFilter("newest")}
                className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-all ${activeFilter === "newest"
                  ? "bg-background text-foreground shadow-sm"
                  : "text-muted-foreground hover:text-foreground"
                  }`}
              >
                <Clock className="w-4 h-4" />
                Newest
              </button>
            </div>
          </div>

          {/* Feed */}
          <div className="space-y-4 stagger-children">
            {sortedPosts.map((post) => (
              <Card
                key={post.id}
                className="p-4 shadow-card hover:shadow-lg transition-all group border-border/50"
              >
                {/* Author Info */}
                <div className="flex items-start gap-3 mb-3">
                  <Avatar className="w-10 h-10 border border-border">
                    <AvatarImage src={post.author.avatar} />
                    <AvatarFallback className="bg-primary/10 text-primary font-medium">
                      {post.author.name.charAt(0)}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-semibold text-foreground">
                        {post.author.name}
                      </span>
                      {post.author.badge && (
                        <div className="flex items-center gap-1 bg-secondary/30 px-2 py-0.5 rounded-full text-[10px] font-medium text-foreground/80 border border-secondary/20">
                          {getBadgeIcon(post.author.badge)}
                          <span>{getBadgeLabel(post.author.badge)}</span>
                        </div>
                      )}
                      <span className="text-xs text-muted-foreground">
                        · {post.timeAgo}
                      </span>
                    </div>
                    <div className="flex items-center gap-1 text-xs text-muted-foreground mt-0.5">
                      <MapPin className="w-3 h-3" />
                      {post.author.location}
                    </div>
                  </div>
                </div>

                {/* Content */}
                <p className="text-foreground leading-relaxed mb-3 whitespace-pre-wrap">{post.content}</p>

                {post.image && (
                  <div className="mb-4 rounded-xl overflow-hidden border border-border">
                    <img src={post.image} alt="Post content" className="w-full h-auto object-cover max-h-96" />
                  </div>
                )}

                {/* Tags */}
                {post.tags.length > 0 && (
                  <div className="flex flex-wrap gap-2 mb-3">
                    {post.tags.map((tag, tagIndex) => (
                      <span
                        key={tag}
                        className="inline-flex items-center gap-1 text-xs font-medium text-primary bg-primary/10 px-2 py-1 rounded-full hover:bg-primary hover:text-primary-foreground transition-colors cursor-pointer"
                        style={{ animationDelay: `${tagIndex * 50}ms` }}
                      >
                        <Leaf className="w-3 h-3" />
                        {tag}
                      </span>
                    ))}
                  </div>
                )}

                {/* Actions */}
                <div className="flex items-center gap-4 pt-3 border-t border-border">
                  <Button
                    variant="ghost"
                    size="sm"
                    className={`gap-2 press-effect group ${post.isLiked ? "text-destructive hover:text-destructive/90" : "text-muted-foreground hover:text-destructive"
                      }`}
                    onClick={() => handleLike(post.id)}
                  >
                    <Heart
                      className={`w-4 h-4 transition-transform group-hover:scale-125 ${post.isLiked ? "fill-current animate-heartbeat" : ""
                        }`}
                    />
                    {post.likes}
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    className={`gap-2 press-effect hover:text-primary ${expandedComments.includes(post.id) ? "text-primary bg-primary/5" : "text-muted-foreground"
                      }`}
                    onClick={() => toggleComments(post.id)}
                  >
                    <MessageCircle className="w-4 h-4 transition-transform hover:scale-110" />
                    {post.comments} Comment{post.comments !== 1 ? 's' : ''}
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="gap-2 text-muted-foreground press-effect hover:text-primary"
                    onClick={handleShare}
                  >
                    <Share2 className="w-4 h-4 transition-transform hover:rotate-12" />
                    Share
                  </Button>
                </div>

                {/* Comments Section */}
                {expandedComments.includes(post.id) && (
                  <div className="mt-4 pt-4 border-t border-border animate-fade-in-down bg-muted/10 -mx-4 px-4 pb-0">
                    {post.commentsList.length > 0 ? (
                      <div className="space-y-4 mb-4">
                        {post.commentsList.map(comment => (
                          <div key={comment.id} className="flex gap-3">
                            <Avatar className="w-8 h-8">
                              <AvatarFallback className="bg-secondary text-secondary-foreground text-xs">
                                {comment.author.charAt(0)}
                              </AvatarFallback>
                            </Avatar>
                            <div className="flex-1">
                              <div className="bg-background rounded-lg p-3 border border-border shadow-sm">
                                <div className="flex justify-between items-center mb-1">
                                  <span className="text-sm font-semibold">{comment.author}</span>
                                  <span className="text-xs text-muted-foreground">{comment.timeAgo}</span>
                                </div>
                                <p className="text-sm text-foreground/90">{comment.content}</p>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-4 text-sm text-muted-foreground italic">
                        No comments yet. Be the first to start the conversation!
                      </div>
                    )}

                    <div className="flex gap-2 items-center mt-3 pb-3">
                      <Avatar className="w-8 h-8">
                        <AvatarFallback className="bg-primary/10 text-primary text-xs">Y</AvatarFallback>
                      </Avatar>
                      <input
                        className="flex-1 bg-background border border-border rounded-full px-4 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-primary"
                        placeholder="Write a comment..."
                      />
                      <Button size="icon" variant="ghost" className="rounded-full hover:bg-primary/10 hover:text-primary">
                        <Send className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                )}
              </Card>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default CommunityFeed;
