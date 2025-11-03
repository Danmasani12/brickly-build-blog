import { useEffect, useRef, useState } from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Upload, X } from "lucide-react";
import { toast } from "sonner";

interface GalleryPost {
  id?: number;
  title: string;
  description: string;
  category: string;
  images?: string[];
}

export const GalleryPostForm = ({
  onSuccess,
  editingPost,
}: {
  onSuccess: () => void;
  editingPost?: GalleryPost | null;
}) => {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    category: "residential",
  });
  const [images, setImages] = useState<File[]>([]);
  const [previewImages, setPreviewImages] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const formRef = useRef<HTMLFormElement>(null);

  // Prefill when editing
  useEffect(() => {
    if (editingPost) {
      setFormData({
        title: editingPost.title || "",
        description: editingPost.description || "",
        category: editingPost.category || "residential",
      });
      setPreviewImages(editingPost.images || []);

      // Scroll to form
      setTimeout(() => {
        formRef.current?.scrollIntoView({ behavior: "smooth" });
      }, 200);
    }
  }, [editingPost]);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const newFiles = Array.from(e.target.files);
      setImages((prev) => [...prev, ...newFiles]);
      toast.success(`${newFiles.length} image(s) added`);
      e.target.value = ""; // ✅ Reset file input for re-upload
    }
  };

  const removeImage = (index: number) => {
    setImages((prev) => prev.filter((_, i) => i !== index));
  };

  const removePreviewImage = (index: number) => {
    setPreviewImages((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.title.trim() || !formData.description.trim()) {
      toast.error("All fields are required");
      return;
    }

    if (!editingPost && images.length === 0) {
      toast.error("Please upload at least one image");
      return;
    }

    setIsSubmitting(true);

    try {
      const payload = new FormData();
      payload.append("title", formData.title);
      payload.append("description", formData.description);
      payload.append("category", formData.category);
      images.forEach((img) => payload.append("images", img));

      // Optional: send which old images remain (for edit)
      if (editingPost && previewImages.length > 0) {
        previewImages.forEach((url) => payload.append("existing_images", url));
      }

      const url = editingPost
        ? `${import.meta.env.VITE_API_URL}/api/gallery/${editingPost.id}/`
        : `${import.meta.env.VITE_API_URL}/api/gallery/`;

      const method = editingPost ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        body: payload,
        credentials: "include",
      });

      if (!res.ok) {
        const errData = await res.text();
        console.error("Gallery post error:", errData);
        throw new Error("Failed to save gallery post");
      }

      toast.success(
        editingPost
          ? "Gallery post updated successfully!"
          : "Gallery post created successfully!"
      );

      // Reset form
      setFormData({ title: "", description: "", category: "residential" });
      setImages([]);
      setPreviewImages([]);
      onSuccess();
    } catch (error: any) {
      toast.error(error.message || "Failed to save gallery post");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form ref={formRef} onSubmit={handleSubmit} className="space-y-4">
      {/* Title */}
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

      {/* Category */}
      <div className="space-y-2">
        <Label htmlFor="category">Category *</Label>
        <Select
          value={formData.category}
          onValueChange={(value) =>
            setFormData({ ...formData, category: value })
          }
        >
          <SelectTrigger>
            <SelectValue placeholder="Select category" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="residential">Residential</SelectItem>
            <SelectItem value="commercial">Commercial</SelectItem>
            <SelectItem value="renovation">Renovation</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Description */}
      <div className="space-y-2">
        <Label htmlFor="description">Description *</Label>
        <Textarea
          id="description"
          value={formData.description}
          onChange={(e) =>
            setFormData({ ...formData, description: e.target.value })
          }
          required
          placeholder="Contemporary 4-bedroom family residence..."
          rows={4}
        />
      </div>

      {/* Image Upload */}
      <div className="space-y-2">
        <Label>Upload Images * (Multiple)</Label>
        <div className="relative">
          <input
            ref={fileInputRef}
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
            onClick={() => fileInputRef.current?.click()}
          >
            <Upload className="w-5 h-5 mr-2" />
            {editingPost ? "Update Images" : "Upload Images"}
          </Button>
        </div>

        {/* Existing images */}
        {previewImages.length > 0 && (
          <div className="grid grid-cols-2 gap-2 mt-2">
            {previewImages.map((url, index) => (
              <div key={index} className="relative rounded-lg overflow-hidden">
                <img
                  src={url}
                  alt={`Existing Preview ${index + 1}`}
                  className="w-full h-32 object-cover"
                />
                <Button
                  type="button"
                  variant="destructive"
                  size="icon"
                  className="absolute top-1 right-1 h-6 w-6"
                  onClick={() => removePreviewImage(index)}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </div>
        )}

        {/* New images */}
        {images.length > 0 && (
          <div className="grid grid-cols-2 gap-2 mt-2">
            {images.map((file, index) => (
              <div key={index} className="relative rounded-lg overflow-hidden">
                <img
                  src={URL.createObjectURL(file)}
                  alt={`Preview ${index + 1}`}
                  className="w-full h-32 object-cover"
                />
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
        {isSubmitting
          ? editingPost
            ? "Updating..."
            : "Publishing..."
          : editingPost
          ? "Update Gallery Post"
          : "Publish Gallery Post"}
      </Button>
    </form>
  );
};
