import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { LogOut } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
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
} from "@/components/ui/collapsible";
import { GalleryPostForm } from "@/components/admin/GalleryPostForm";
import { RealtyPostForm } from "@/components/admin/RealtyPostForm";

const ModeratorDashboard = () => {
  const navigate = useNavigate();
  const { signOut } = useAuth();
  const [postType, setPostType] = useState<"gallery" | "realty" | "">("");
  const [isOpen, setIsOpen] = useState(false);

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
    toast.success("Post created successfully!");
  };

  return (
    <div className="min-h-screen py-20 bg-background">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="mb-12 animate-fade-in flex items-center justify-between">
          <div>
            <h1 className="text-5xl font-bold text-foreground mb-4">
              Moderator <span className="text-primary">Dashboard</span>
            </h1>
            <p className="text-xl text-muted-foreground">
              Create and manage property listings and gallery posts
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
        </div>
      </div>
    </div>
  );
};

export default ModeratorDashboard;
