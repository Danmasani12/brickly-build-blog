import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { toast } from "sonner";
import { LogOut, UserPlus, Trash2 } from "lucide-react";
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
  const [selectedGalleryPosts, setSelectedGalleryPosts] = useState<string[]>([]);
  const [selectedRealtyPosts, setSelectedRealtyPosts] = useState<string[]>([]);
  const [isSuperAdmin, setIsSuperAdmin] = useState(false);
  const [newAdmin, setNewAdmin] = useState({ name: "", email: "", password: "" });

  useEffect(() => {
    fetchPosts();
    checkSuperAdminStatus();
  }, []);

  const checkSuperAdminStatus = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const { data } = await supabase
      .from("user_roles")
      .select("role")
      .eq("user_id", user.id)
      .eq("role", "admin")
      .single();

    setIsSuperAdmin(!!data);
  };

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
      setSelectedGalleryPosts([]);
      setSelectedRealtyPosts([]);
    } catch (error: any) {
      toast.error("Failed to delete post");
      console.error(error);
    } finally {
      setDeleteDialogOpen(false);
      setPostToDelete(null);
    }
  };

  const handleDeleteSelected = async () => {
    const totalSelected = selectedGalleryPosts.length + selectedRealtyPosts.length;
    
    if (totalSelected === 0) {
      toast.error("Please select at least one post to delete");
      return;
    }

    try {
      // Delete selected gallery posts
      if (selectedGalleryPosts.length > 0) {
        const { error } = await supabase
          .from("gallery_posts")
          .delete()
          .in("id", selectedGalleryPosts);

        if (error) throw error;
      }

      // Delete selected realty posts
      if (selectedRealtyPosts.length > 0) {
        const { error } = await supabase
          .from("realty_posts")
          .delete()
          .in("id", selectedRealtyPosts);

        if (error) throw error;
      }

      toast.success(`Successfully deleted ${totalSelected} post(s)`);
      setSelectedGalleryPosts([]);
      setSelectedRealtyPosts([]);
      fetchPosts();
    } catch (error: any) {
      toast.error("Failed to delete selected posts");
      console.error(error);
    }
  };

  const toggleGalleryPost = (postId: string) => {
    setSelectedGalleryPosts((prev) =>
      prev.includes(postId)
        ? prev.filter((id) => id !== postId)
        : [...prev, postId]
    );
  };

  const toggleRealtyPost = (postId: string) => {
    setSelectedRealtyPosts((prev) =>
      prev.includes(postId)
        ? prev.filter((id) => id !== postId)
        : [...prev, postId]
    );
  };

  const handleCreateJuniorAdmin = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!newAdmin.name || !newAdmin.email || !newAdmin.password) {
      toast.error("Please fill in all fields");
      return;
    }

    try {
      const { data, error } = await supabase.auth.signUp({
        email: newAdmin.email,
        password: newAdmin.password,
        options: {
          data: {
            name: newAdmin.name,
          },
          emailRedirectTo: `${window.location.origin}/admin`,
        },
      });

      if (error) throw error;

      if (data.user) {
        const { error: roleError } = await supabase
          .from("user_roles")
          .insert({
            user_id: data.user.id,
            role: "moderator",
          });

        if (roleError) throw roleError;

        toast.success("Junior admin created successfully");
        setNewAdmin({ name: "", email: "", password: "" });
      }
    } catch (error: any) {
      toast.error(error.message || "Failed to create junior admin");
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

          {/* Delete Posts Section - Only for Super Admins */}
          {isSuperAdmin && (
            <Card className="bg-card border-border mt-8">
              <CardHeader>
                <CardTitle className="text-2xl text-foreground">Delete Post</CardTitle>
                <p className="text-sm text-muted-foreground">
                  Select one or multiple posts to delete
                </p>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Gallery Posts Selection */}
                  <div className="space-y-3">
                    <Label className="text-base font-semibold">Gallery Posts</Label>
                    <div className="space-y-2 max-h-64 overflow-y-auto border border-border rounded-md p-3 bg-background">
                      {galleryPosts.length === 0 ? (
                        <p className="text-sm text-muted-foreground">No gallery posts</p>
                      ) : (
                        galleryPosts.map((post) => (
                          <div
                            key={post.id}
                            className="flex items-start space-x-3 p-2 rounded hover:bg-accent/50 transition-colors"
                          >
                            <Checkbox
                              id={`gallery-${post.id}`}
                              checked={selectedGalleryPosts.includes(post.id)}
                              onCheckedChange={() => toggleGalleryPost(post.id)}
                              className="mt-1"
                            />
                            <label
                              htmlFor={`gallery-${post.id}`}
                              className="flex-1 cursor-pointer text-sm"
                            >
                              <div className="font-medium text-foreground">{post.title}</div>
                              <div className="text-xs text-muted-foreground capitalize">
                                {post.category}
                              </div>
                            </label>
                          </div>
                        ))
                      )}
                    </div>
                    {selectedGalleryPosts.length > 0 && (
                      <p className="text-xs text-muted-foreground">
                        {selectedGalleryPosts.length} gallery post(s) selected
                      </p>
                    )}
                  </div>

                  {/* Realty Posts Selection */}
                  <div className="space-y-3">
                    <Label className="text-base font-semibold">Realty Posts</Label>
                    <div className="space-y-2 max-h-64 overflow-y-auto border border-border rounded-md p-3 bg-background">
                      {realtyPosts.length === 0 ? (
                        <p className="text-sm text-muted-foreground">No realty posts</p>
                      ) : (
                        realtyPosts.map((post) => (
                          <div
                            key={post.id}
                            className="flex items-start space-x-3 p-2 rounded hover:bg-accent/50 transition-colors"
                          >
                            <Checkbox
                              id={`realty-${post.id}`}
                              checked={selectedRealtyPosts.includes(post.id)}
                              onCheckedChange={() => toggleRealtyPost(post.id)}
                              className="mt-1"
                            />
                            <label
                              htmlFor={`realty-${post.id}`}
                              className="flex-1 cursor-pointer text-sm"
                            >
                              <div className="font-medium text-foreground">{post.title}</div>
                              <div className="text-xs text-muted-foreground">
                                {post.location} • {post.price}
                              </div>
                            </label>
                          </div>
                        ))
                      )}
                    </div>
                    {selectedRealtyPosts.length > 0 && (
                      <p className="text-xs text-muted-foreground">
                        {selectedRealtyPosts.length} realty post(s) selected
                      </p>
                    )}
                  </div>
                </div>

                {/* Delete Button */}
                <div className="mt-6 flex justify-end">
                  <Button
                    onClick={handleDeleteSelected}
                    variant="destructive"
                    className="gap-2"
                    disabled={selectedGalleryPosts.length === 0 && selectedRealtyPosts.length === 0}
                  >
                    <Trash2 className="w-4 h-4" />
                    Delete Selected ({selectedGalleryPosts.length + selectedRealtyPosts.length})
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Create Junior Admin Section - Only for Super Admins */}
          {isSuperAdmin && (
            <Card className="bg-card border-border mt-8">
              <CardHeader>
                <CardTitle className="text-2xl text-foreground flex items-center gap-2">
                  <UserPlus className="w-6 h-6" />
                  Create Junior Admin
                </CardTitle>
                <p className="text-sm text-muted-foreground">
                  Junior admins can create and edit posts but cannot delete posts or create new admins
                </p>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleCreateJuniorAdmin} className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="admin-name">Name *</Label>
                      <Input
                        id="admin-name"
                        type="text"
                        placeholder="Admin name"
                        value={newAdmin.name}
                        onChange={(e) => setNewAdmin({ ...newAdmin, name: e.target.value })}
                        className="bg-background border-border"
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="admin-email">Email *</Label>
                      <Input
                        id="admin-email"
                        type="email"
                        placeholder="admin@example.com"
                        value={newAdmin.email}
                        onChange={(e) => setNewAdmin({ ...newAdmin, email: e.target.value })}
                        className="bg-background border-border"
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="admin-password">Password *</Label>
                      <Input
                        id="admin-password"
                        type="password"
                        placeholder="Minimum 6 characters"
                        value={newAdmin.password}
                        onChange={(e) => setNewAdmin({ ...newAdmin, password: e.target.value })}
                        className="bg-background border-border"
                        minLength={6}
                        required
                      />
                    </div>
                  </div>
                  <Button type="submit" className="w-full md:w-auto">
                    <UserPlus className="w-4 h-4 mr-2" />
                    Create Junior Admin
                  </Button>
                </form>
              </CardContent>
            </Card>
          )}
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
