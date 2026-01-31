import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Heart,
  MessageCircle,
  Share2,
  Image as ImageIcon,
  Send,
  MapPin,
  Leaf,
} from "lucide-react";

interface Post {
  id: number;
  author: {
    name: string;
    avatar: string;
    location: string;
  };
  content: string;
  image?: string;
  likes: number;
  comments: number;
  timeAgo: string;
  isLiked: boolean;
  tags: string[];
}

const CommunityFeed = () => {
  const [newPost, setNewPost] = useState("");
  const [posts, setPosts] = useState<Post[]>([
    {
      id: 1,
      author: {
        name: "Rajesh Kumar",
        avatar: "",
        location: "Punjab, India",
      },
      content:
        "Just harvested my tomatoes! 🍅 This season was incredible thanks to the early disease detection. CropGuard helped me identify leaf blight early and saved 80% of my crop. Highly recommend for all farmers!",
      likes: 234,
      comments: 45,
      timeAgo: "2 hours ago",
      isLiked: false,
      tags: ["tomatoes", "success", "harvest"],
    },
    {
      id: 2,
      author: {
        name: "Maria Santos",
        avatar: "",
        location: "California, USA",
      },
      content:
        "Has anyone dealt with powdery mildew on grape vines this season? Looking for organic treatment options. My vineyard is about 3 acres and I want to avoid chemical fungicides if possible.",
      likes: 89,
      comments: 67,
      timeAgo: "5 hours ago",
      isLiked: true,
      tags: ["grapes", "organic", "help"],
    },
    {
      id: 3,
      author: {
        name: "John Okonkwo",
        avatar: "",
        location: "Lagos, Nigeria",
      },
      content:
        "Pro tip for cassava farmers: Regular monitoring with the scan feature has helped me prevent brown streak disease three times this year. Prevention is always better than cure! 🌱",
      likes: 567,
      comments: 123,
      timeAgo: "1 day ago",
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
      comments: 89,
      timeAgo: "2 days ago",
      isLiked: false,
      tags: ["apples", "IPM", "sustainable"],
    },
  ]);

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

  const handlePost = () => {
    if (!newPost.trim()) return;

    const post: Post = {
      id: Date.now(),
      author: {
        name: "You",
        avatar: "",
        location: "Your Location",
      },
      content: newPost,
      likes: 0,
      comments: 0,
      timeAgo: "Just now",
      isLiked: false,
      tags: [],
    };

    setPosts([post, ...posts]);
    setNewPost("");
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
          <Card className="p-4 mb-6 shadow-card animate-fade-in">
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
                <div className="flex items-center justify-between mt-3">
                  <Button variant="ghost" size="sm" className="text-muted-foreground">
                    <ImageIcon className="w-4 h-4 mr-2" />
                    Add Photo
                  </Button>
                  <Button
                    variant="hero"
                    size="sm"
                    onClick={handlePost}
                    disabled={!newPost.trim()}
                  >
                    <Send className="w-4 h-4 mr-2" />
                    Post
                  </Button>
                </div>
              </div>
            </div>
          </Card>

          {/* Feed */}
          <div className="space-y-4 stagger-children">
            {posts.map((post, index) => (
              <Card
                key={post.id}
                className="p-4 shadow-card hover:shadow-lg hover-lift transition-all group"
              >
                {/* Author Info */}
                <div className="flex items-start gap-3 mb-3">
                  <Avatar className="w-10 h-10">
                    <AvatarImage src={post.author.avatar} />
                    <AvatarFallback className="bg-primary/10 text-primary font-medium">
                      {post.author.name.charAt(0)}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-foreground">
                        {post.author.name}
                      </span>
                      <span className="text-xs text-muted-foreground">
                        · {post.timeAgo}
                      </span>
                    </div>
                    <div className="flex items-center gap-1 text-xs text-muted-foreground">
                      <MapPin className="w-3 h-3" />
                      {post.author.location}
                    </div>
                  </div>
                </div>

                {/* Content */}
                <p className="text-foreground leading-relaxed mb-3">{post.content}</p>

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
                    className={`gap-2 press-effect group ${
                      post.isLiked ? "text-destructive" : "text-muted-foreground hover:text-destructive"
                    }`}
                    onClick={() => handleLike(post.id)}
                  >
                    <Heart
                      className={`w-4 h-4 transition-transform group-hover:scale-125 ${
                        post.isLiked ? "fill-current animate-heartbeat" : ""
                      }`}
                    />
                    {post.likes}
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="gap-2 text-muted-foreground press-effect hover:text-primary"
                  >
                    <MessageCircle className="w-4 h-4 transition-transform hover:scale-110" />
                    {post.comments}
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="gap-2 text-muted-foreground press-effect hover:text-primary"
                  >
                    <Share2 className="w-4 h-4 transition-transform hover:rotate-12" />
                    Share
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default CommunityFeed;
