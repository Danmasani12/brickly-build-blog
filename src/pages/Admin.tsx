import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { LogOut, Trash2 } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { GalleryPostForm } from "@/components/admin/GalleryPostForm";
import { RealtyPostForm } from "@/components/admin/RealtyPostForm";

interface GalleryPost {
  id: string;
  title: string;
  category: string;
  created_at: string;
}

interface RealtyPost {
  id: string;
  title: string;
  location: string;
  price: string;
  created_at: string;
}

const Admin = () => {
  const navigate = useNavigate();
  const { signOut } = useAuth();
  const [postType, setPostType] = useState<"gallery" | "realty" | "">("");
  const [isOpen, setIsOpen] = useState(false);
  const [galleryPosts, setGalleryPosts] = useState<GalleryPost[]>([]);
  const [realtyPosts, setRealtyPosts] = useState<RealtyPost[]>([]);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [postToDelete, setPostToDelete] = useState<{ id: string; type: "gallery" | "realty" } | null>(null);

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    try {
      const { data: gallery } = await supabase
        .from("gallery_posts")
        .select("id, title, category, created_at")
        .order("created_at", { ascending: false });

      const { data: realty } = await supabase
        .from("realty_posts")
        .select("id, title, location, price, created_at")
        .order("created_at", { ascending: false });

      setGalleryPosts(gallery || []);
      setRealtyPosts(realty || []);
    } catch (error) {
      console.error("Error fetching posts:", error);
    }
  };

  const handleLogout = async () => {
    await signOut();
    toast.success("Logged out successfully");
    navigate("/");
  };

  const handlePostTypeChange = (value: string) => {
    setPostType(value as "gallery" | "realty");
    setIsOpen(true);
  };

  const handleSuccess = () => {
    setPostType("");
    setIsOpen(false);
    fetchPosts();
  };

  const handleDeleteClick = (id: string, type: "gallery" | "realty") => {
    setPostToDelete({ id, type });
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!postToDelete) return;

    try {
      if (postToDelete.type === "gallery") {
        const { error } = await supabase
          .from("gallery_posts")
          .delete()
          .eq("id", postToDelete.id);

        if (error) throw error;
      } else {
        const { error } = await supabase
          .from("realty_posts")
          .delete()
          .eq("id", postToDelete.id);

        if (error) throw error;
      }

      toast.success("Post deleted successfully");
      fetchPosts();
    } catch (error: any) {
      toast.error("Failed to delete post");
      console.error(error);
    } finally {
      setDeleteDialogOpen(false);
      setPostToDelete(null);
    }
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

        {/* Post Type Selection and Form */}
        <div className="max-w-4xl mx-auto">
          <Card className="bg-card border-border">
            <CardHeader>
              <CardTitle className="text-2xl text-foreground">
                Create New Post
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {/* Dropdown to select post type */}
                <div className="space-y-2">
                  <Label>Select Post Destination *</Label>
                  <Select value={postType} onValueChange={handlePostTypeChange}>
                    <SelectTrigger className="bg-background border-border">
                      <SelectValue placeholder="Choose where to post..." />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="gallery">Gallery Page</SelectItem>
                      <SelectItem value="realty">Realty Page</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Collapsible form based on selection */}
                <Collapsible open={isOpen} onOpenChange={setIsOpen}>
                  <CollapsibleContent className="space-y-4">
                    {postType === "gallery" && (
                      <div className="animate-fade-in">
                        <GalleryPostForm onSuccess={handleSuccess} />
                      </div>
                    )}
                    {postType === "realty" && (
                      <div className="animate-fade-in">
                        <RealtyPostForm onSuccess={handleSuccess} />
                      </div>
                    )}
                  </CollapsibleContent>
                </Collapsible>
              </div>
            </CardContent>
          </Card>

          {/* Existing Posts Management */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
            {/* Gallery Posts */}
            <Card className="bg-card border-border">
              <CardHeader>
                <CardTitle className="text-xl text-foreground">Gallery Posts</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {galleryPosts.length === 0 ? (
                    <p className="text-muted-foreground text-sm">No gallery posts yet</p>
                  ) : (
                    galleryPosts.map((post) => (
                      <div
                        key={post.id}
                        className="flex items-center justify-between p-3 bg-background rounded-lg border border-border"
                      >
                        <div className="flex-1 min-w-0">
                          <h4 className="text-sm font-medium text-foreground truncate">
                            {post.title}
                          </h4>
                          <p className="text-xs text-muted-foreground capitalize">
                            {post.category}
                          </p>
                        </div>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleDeleteClick(post.id, "gallery")}
                          className="ml-2 text-destructive hover:text-destructive hover:bg-destructive/10"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    ))
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Realty Posts */}
            <Card className="bg-card border-border">
              <CardHeader>
                <CardTitle className="text-xl text-foreground">Realty Posts</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {realtyPosts.length === 0 ? (
                    <p className="text-muted-foreground text-sm">No realty posts yet</p>
                  ) : (
                    realtyPosts.map((post) => (
                      <div
                        key={post.id}
                        className="flex items-center justify-between p-3 bg-background rounded-lg border border-border"
                      >
                        <div className="flex-1 min-w-0">
                          <h4 className="text-sm font-medium text-foreground truncate">
                            {post.title}
                          </h4>
                          <p className="text-xs text-muted-foreground">
                            {post.location} • {post.price}
                          </p>
                        </div>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleDeleteClick(post.id, "realty")}
                          className="ml-2 text-destructive hover:text-destructive hover:bg-destructive/10"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    ))
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the post and all its associated images.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteConfirm}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default Admin;
