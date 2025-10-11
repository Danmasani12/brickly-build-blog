import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { Upload, Image as ImageIcon, Trash2, Plus, LogOut } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface BlogPost {
  id: number;
  title: string;
  description: string;
  price: string;
  location: string;
  type: string;
  category: string;
  image: string;
}

const Admin = () => {
  const navigate = useNavigate();
  const { signOut } = useAuth();
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    price: "",
    location: "",
    type: "sale",
    category: "residential",
  });
  const [previewImage, setPreviewImage] = useState<string>("");

  const handleLogout = async () => {
    await signOut();
    toast.success("Logged out successfully");
    navigate("/");
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!previewImage) {
      toast.error("Please upload an image");
      return;
    }

    const newPost: BlogPost = {
      id: Date.now(),
      ...formData,
      image: previewImage,
    };

    setPosts([newPost, ...posts]);
    toast.success("Post created successfully!", {
      description: "Your property listing has been added to the Realty page.",
    });

    // Reset form
    setFormData({
      title: "",
      description: "",
      price: "",
      location: "",
      type: "sale",
      category: "residential",
    });
    setPreviewImage("");
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewImage(reader.result as string);
        toast.success("Image uploaded successfully");
      };
      reader.readAsDataURL(file);
    }
  };

  const handleDelete = (id: number) => {
    setPosts(posts.filter((post) => post.id !== id));
    toast.success("Post deleted successfully");
  };

  return (
    <div className="min-h-screen py-20 bg-background">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="mb-12 animate-fade-in flex items-center justify-between">
          <div>
            <h1 className="text-5xl font-bold text-foreground mb-4">
              Admin <span className="text-primary">Dashboard</span>
            </h1>
            <p className="text-xl text-muted-foreground">
              Manage your property listings and blog posts
            </p>
          </div>
          <Button 
            onClick={handleLogout}
            variant="outline"
            className="flex items-center gap-2"
          >
            <LogOut className="w-4 h-4" />
            Logout
          </Button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Create Post Form */}
          <div className="lg:col-span-1">
            <Card className="bg-card border-border sticky top-24">
              <CardHeader>
                <CardTitle className="text-2xl text-foreground flex items-center">
                  <Plus className="w-6 h-6 mr-2 text-primary" />
                  Create New Post
                </CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="title" className="text-foreground">
                      Title *
                    </Label>
                    <Input
                      id="title"
                      name="title"
                      value={formData.title}
                      onChange={handleChange}
                      required
                      placeholder="Luxury Modern Villa"
                      className="bg-background border-border"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="price" className="text-foreground">
                      Price *
                    </Label>
                    <Input
                      id="price"
                      name="price"
                      value={formData.price}
                      onChange={handleChange}
                      required
                      placeholder="$850,000 or $12,000/mo"
                      className="bg-background border-border"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="location" className="text-foreground">
                      Location *
                    </Label>
                    <Input
                      id="location"
                      name="location"
                      value={formData.location}
                      onChange={handleChange}
                      required
                      placeholder="Beverly Hills, CA"
                      className="bg-background border-border"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="type" className="text-foreground">
                      Type *
                    </Label>
                    <Select
                      value={formData.type}
                      onValueChange={(value) => setFormData({ ...formData, type: value })}
                    >
                      <SelectTrigger className="bg-background border-border">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="sale">For Sale</SelectItem>
                        <SelectItem value="lease">For Lease</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="category" className="text-foreground">
                      Category *
                    </Label>
                    <Select
                      value={formData.category}
                      onValueChange={(value) => setFormData({ ...formData, category: value })}
                    >
                      <SelectTrigger className="bg-background border-border">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="residential">Residential</SelectItem>
                        <SelectItem value="commercial">Commercial</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="description" className="text-foreground">
                      Description *
                    </Label>
                    <Textarea
                      id="description"
                      name="description"
                      value={formData.description}
                      onChange={handleChange}
                      required
                      placeholder="Stunning modern villa with..."
                      rows={4}
                      className="bg-background border-border resize-none"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="image" className="text-foreground">
                      Upload Image *
                    </Label>
                    <div className="relative">
                      <Input
                        id="image"
                        type="file"
                        accept="image/*"
                        onChange={handleImageUpload}
                        className="hidden"
                      />
                      <Button
                        type="button"
                        variant="outline"
                        className="w-full border-2 border-dashed border-border hover:border-primary"
                        onClick={() => document.getElementById("image")?.click()}
                      >
                        <Upload className="w-5 h-5 mr-2" />
                        {previewImage ? "Change Image" : "Upload Image"}
                      </Button>
                    </div>
                    {previewImage && (
                      <div className="relative mt-2 rounded-lg overflow-hidden">
                        <img
                          src={previewImage}
                          alt="Preview"
                          className="w-full h-48 object-cover"
                        />
                      </div>
                    )}
                  </div>

                  <Button
                    type="submit"
                    className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-semibold"
                  >
                    Publish Post
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>

          {/* Posts List */}
          <div className="lg:col-span-2">
            <Card className="bg-card border-border mb-6">
              <CardHeader>
                <CardTitle className="text-2xl text-foreground flex items-center">
                  <ImageIcon className="w-6 h-6 mr-2 text-primary" />
                  Published Posts ({posts.length})
                </CardTitle>
              </CardHeader>
            </Card>

            {posts.length === 0 ? (
              <Card className="bg-card border-border">
                <CardContent className="p-12 text-center">
                  <ImageIcon className="w-16 h-16 text-muted-foreground mx-auto mb-4 opacity-50" />
                  <p className="text-muted-foreground text-lg">No posts yet</p>
                  <p className="text-muted-foreground text-sm">Create your first property listing using the form</p>
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-6">
                {posts.map((post, index) => (
                  <Card
                    key={post.id}
                    className="bg-card border-border hover:border-primary transition-all animate-slide-up"
                    style={{ animationDelay: `${index * 50}ms` }}
                  >
                    <div className="flex flex-col md:flex-row">
                      <div className="md:w-1/3">
                        <img
                          src={post.image}
                          alt={post.title}
                          className="w-full h-full object-cover min-h-[200px]"
                        />
                      </div>
                      <div className="flex-1 p-6">
                        <div className="flex items-start justify-between mb-4">
                          <div>
                            <h3 className="text-2xl font-bold text-foreground mb-2">
                              {post.title}
                            </h3>
                            <div className="flex gap-2 mb-2">
                              <span className="px-3 py-1 bg-primary/10 text-primary text-xs font-semibold rounded-full">
                                {post.type === "sale" ? "For Sale" : "For Lease"}
                              </span>
                              <span className="px-3 py-1 bg-muted text-muted-foreground text-xs font-semibold rounded-full">
                                {post.category}
                              </span>
                            </div>
                          </div>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleDelete(post.id)}
                            className="text-destructive hover:text-destructive hover:bg-destructive/10"
                          >
                            <Trash2 className="w-5 h-5" />
                          </Button>
                        </div>
                        <p className="text-xl font-bold text-primary mb-2">{post.price}</p>
                        <p className="text-muted-foreground mb-4">{post.location}</p>
                        <p className="text-muted-foreground line-clamp-2">{post.description}</p>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Admin;
