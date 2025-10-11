import { useState } from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Upload, X } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

export const GalleryPostForm = ({ onSuccess }: { onSuccess: () => void }) => {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    category: "residential",
  });
  const [images, setImages] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      Array.from(files).forEach((file) => {
        const reader = new FileReader();
        reader.onloadend = () => {
          setImages((prev) => [...prev, reader.result as string]);
        };
        reader.readAsDataURL(file);
      });
      toast.success(`${files.length} image(s) uploaded`);
    }
  };

  const removeImage = (index: number) => {
    setImages((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (images.length === 0) {
      toast.error("Please upload at least one image");
      return;
    }

    setIsSubmitting(true);

    try {
      // Insert gallery post
      const { data: post, error: postError } = await supabase
        .from("gallery_posts")
        .insert({
          title: formData.title,
          description: formData.description,
          category: formData.category,
        })
        .select()
        .single();

      if (postError) throw postError;

      // Insert images
      const imageInserts = images.map((image, index) => ({
        gallery_post_id: post.id,
        image_url: image,
        display_order: index,
      }));

      const { error: imagesError } = await supabase
        .from("gallery_images")
        .insert(imageInserts);

      if (imagesError) throw imagesError;

      toast.success("Gallery post created successfully!");
      
      // Reset form
      setFormData({ title: "", description: "", category: "residential" });
      setImages([]);
      onSuccess();
    } catch (error: any) {
      toast.error(error.message || "Failed to create gallery post");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="title">Project Title *</Label>
        <Input
          id="title"
          value={formData.title}
          onChange={(e) => setFormData({ ...formData, title: e.target.value })}
          required
          placeholder="Modern Family Home"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="category">Category *</Label>
        <Select
          value={formData.category}
          onValueChange={(value) => setFormData({ ...formData, category: value })}
        >
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="residential">Residential</SelectItem>
            <SelectItem value="commercial">Commercial</SelectItem>
            <SelectItem value="renovation">Renovation</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">Description *</Label>
        <Textarea
          id="description"
          value={formData.description}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          required
          placeholder="Contemporary 4-bedroom family residence..."
          rows={4}
        />
      </div>

      <div className="space-y-2">
        <Label>Upload Images * (Multiple)</Label>
        <div className="relative">
          <Input
            id="gallery-images"
            type="file"
            accept="image/*"
            multiple
            onChange={handleImageUpload}
            className="hidden"
          />
          <Button
            type="button"
            variant="outline"
            className="w-full border-2 border-dashed"
            onClick={() => document.getElementById("gallery-images")?.click()}
          >
            <Upload className="w-5 h-5 mr-2" />
            Upload Images
          </Button>
        </div>
        
        {images.length > 0 && (
          <div className="grid grid-cols-2 gap-2 mt-2">
            {images.map((image, index) => (
              <div key={index} className="relative rounded-lg overflow-hidden">
                <img src={image} alt={`Preview ${index + 1}`} className="w-full h-32 object-cover" />
                <Button
                  type="button"
                  variant="destructive"
                  size="icon"
                  className="absolute top-1 right-1 h-6 w-6"
                  onClick={() => removeImage(index)}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </div>
        )}
      </div>

      <Button type="submit" className="w-full" disabled={isSubmitting}>
        {isSubmitting ? "Publishing..." : "Publish Gallery Post"}
      </Button>
    </form>
  );
};
