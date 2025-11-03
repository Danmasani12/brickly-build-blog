import { useEffect, useRef, useState } from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Upload, X, Plus, Image as ImageIcon } from "lucide-react";
import { toast } from "sonner";

interface Bedroom {
  name: string;
  sqm: string;
}

interface RealtyPost {
  id?: number;
  title: string;
  description: string;
  price: string;
  location: string;
  type: string;
  category: string;
  living_room_sqm: string;
  kitchen_sqm: string;
  bedrooms?: Bedroom[];
  images?: string[];
}

export const RealtyPostForm = ({
  onSuccess,
  editingPost,
}: {
  onSuccess: () => void;
  editingPost?: RealtyPost | null;
}) => {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    price: "",
    location: "",
    type: "sale",
    category: "residential",
    living_room_sqm: "",
    kitchen_sqm: "",
  });

  const [bedrooms, setBedrooms] = useState<Bedroom[]>([{ name: "", sqm: "" }]);
  const [images, setImages] = useState<File[]>([]);
  const [previewImages, setPreviewImages] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const formRef = useRef<HTMLFormElement>(null);

  // ✅ Prefill when editing
  useEffect(() => {
    if (editingPost) {
      setFormData({
        title: editingPost.title || "",
        description: editingPost.description || "",
        price: editingPost.price || "",
        location: editingPost.location || "",
        type: editingPost.type || "sale",
        category: editingPost.category || "residential",
        living_room_sqm: editingPost.living_room_sqm || "",
        kitchen_sqm: editingPost.kitchen_sqm || "",
      });

      setBedrooms(editingPost.bedrooms?.length ? editingPost.bedrooms : [{ name: "", sqm: "" }]);
      setPreviewImages(editingPost.images || []);

      setTimeout(() => {
        formRef.current?.scrollIntoView({ behavior: "smooth" });
      }, 200);
    }
  }, [editingPost]);

  const addBedroom = () => setBedrooms((prev) => [...prev, { name: "", sqm: "" }]);
  const removeBedroom = (index: number) => setBedrooms((prev) => prev.filter((_, i) => i !== index));
  const updateBedroom = (index: number, field: keyof Bedroom, value: string) => {
    setBedrooms((prev) => {
      const updated = [...prev];
      updated[index] = { ...updated[index], [field]: value };
      return updated;
    });
  };

  // ✅ Handle multiple image uploads
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      const newFiles = Array.from(files);
      setImages((prev) => [...prev, ...newFiles]);
      setPreviewImages((prev) => [...prev, ...newFiles.map((f) => URL.createObjectURL(f))]);
      toast.success(`${newFiles.length} image(s) added`);
    }
  };

  const removeImage = (index: number) => {
    setImages((prev) => prev.filter((_, i) => i !== index));
    setPreviewImages((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.title || !formData.location || !formData.price) {
      toast.error("Please fill all required fields");
      return;
    }

    if (!editingPost && images.length === 0) {
      toast.error("Please upload at least one image");
      return;
    }

    setIsSubmitting(true);

    try {
      const payload = new FormData();
      Object.entries(formData).forEach(([key, value]) => payload.append(key, value));
      payload.append("bedrooms", JSON.stringify(bedrooms));
      images.forEach((img) => payload.append("images", img));

      const url = editingPost
        ? `${import.meta.env.VITE_API_URL}/api/realty/${editingPost.id}/`
        : `${import.meta.env.VITE_API_URL}/api/realty/`;

      const method = editingPost ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        body: payload,
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.detail || "Failed to save realty post");

      toast.success(editingPost ? "Realty post updated successfully!" : "Realty post created successfully!");

      // Reset form
      setFormData({
        title: "",
        description: "",
        price: "",
        location: "",
        type: "sale",
        category: "residential",
        living_room_sqm: "",
        kitchen_sqm: "",
      });
      setBedrooms([{ name: "", sqm: "" }]);
      setImages([]);
      setPreviewImages([]);
      onSuccess?.();
    } catch (error: any) {
      toast.error(error.message || "Failed to save realty post");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form ref={formRef} onSubmit={handleSubmit} className="space-y-6">
      {/* Title */}
      <div className="space-y-2">
        <Label htmlFor="title">Title *</Label>
        <Input
          id="title"
          value={formData.title}
          onChange={(e) => setFormData({ ...formData, title: e.target.value })}
          required
          placeholder="Luxury Modern Villa"
        />
      </div>

      {/* Price */}
      <div className="space-y-2">
        <Label htmlFor="price">Price *</Label>
        <div className="relative">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">₦</span>
          <Input
            id="price"
            type="number"
            min="0"
            value={formData.price}
            onChange={(e) => setFormData({ ...formData, price: e.target.value })}
            required
            placeholder="850000 or 12000 (for monthly)"
            className="pl-7"
          />
        </div>
      </div>

      {/* Location */}
      <div className="space-y-2">
        <Label htmlFor="location">Location *</Label>
        <Input
          id="location"
          value={formData.location}
          onChange={(e) => setFormData({ ...formData, location: e.target.value })}
          required
          placeholder="Beverly Hills, CA"
        />
      </div>

      {/* Description */}
      <div className="space-y-2">
        <Label htmlFor="description">Description</Label>
        <Textarea
          id="description"
          value={formData.description}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          placeholder="Write a short description of the property..."
          className="min-h-[100px]"
        />
      </div>

      {/* Type & Category */}
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label>Type *</Label>
          <Select value={formData.type} onValueChange={(value) => setFormData({ ...formData, type: value })}>
            <SelectTrigger><SelectValue placeholder="Select type" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="sale">For Sale</SelectItem>
              <SelectItem value="lease">For Lease</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label>Category *</Label>
          <Select
            value={formData.category}
            onValueChange={(value) => setFormData({ ...formData, category: value })}
          >
            <SelectTrigger><SelectValue placeholder="Select category" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="residential">Residential</SelectItem>
              <SelectItem value="commercial">Commercial</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Living Room & Kitchen */}
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label>Living Room (sqm)</Label>
          <Input
            type="number"
            step="0.01"
            value={formData.living_room_sqm}
            onChange={(e) => setFormData({ ...formData, living_room_sqm: e.target.value })}
          />
        </div>
        <div className="space-y-2">
          <Label>Kitchen (sqm)</Label>
          <Input
            type="number"
            step="0.01"
            value={formData.kitchen_sqm}
            onChange={(e) => setFormData({ ...formData, kitchen_sqm: e.target.value })}
          />
        </div>
      </div>

      {/* Bedrooms */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <Label>Bedrooms</Label>
          <Button type="button" size="sm" variant="outline" onClick={addBedroom}>
            <Plus className="w-4 h-4 mr-1" /> Add Bedroom
          </Button>
        </div>

        {bedrooms.map((bedroom, index) => (
          <div key={index} className="flex items-center gap-2">
            <Input
              placeholder="Bedroom name"
              value={bedroom.name}
              onChange={(e) => updateBedroom(index, "name", e.target.value)}
              className="flex-1"
            />
            <Input
              type="number"
              step="0.01"
              placeholder="sqm"
              value={bedroom.sqm}
              onChange={(e) => updateBedroom(index, "sqm", e.target.value)}
              className="w-32"
            />
            {bedrooms.length > 1 && (
              <Button
                type="button"
                size="icon"
                variant="destructive"
                onClick={() => removeBedroom(index)}
              >
                <X className="w-4 h-4" />
              </Button>
            )}
          </div>
        ))}
      </div>

      {/* 📸 Image Upload */}
      <div className="space-y-2">
        <Label>Upload Images *</Label>
        <div>
          <Input
            id="realty-images"
            type="file"
            accept="image/*"
            multiple
            className="hidden"
            onChange={handleImageUpload}
          />
          <Button
            type="button"
            variant="outline"
            className="w-full border-2 border-dashed"
            onClick={() => document.getElementById("realty-images")?.click()}
          >
            <Upload className="w-5 h-5 mr-2" /> {editingPost ? "Update Images" : "Upload Images"}
          </Button>
        </div>

        {/* Combined preview grid */}
        {previewImages.length > 0 && (
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mt-3">
            {previewImages.map((url, index) => (
              <div key={index} className="relative group rounded-md overflow-hidden border">
                <img
                  src={url}
                  alt={`Preview ${index + 1}`}
                  className="w-full h-32 object-cover transition-transform duration-200 group-hover:scale-105"
                />
                <Button
                  type="button"
                  variant="destructive"
                  size="icon"
                  className="absolute top-1 right-1 h-6 w-6 opacity-0 group-hover:opacity-100"
                  onClick={() => removeImage(index)}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Submit */}
      <Button type="submit" className="w-full" disabled={isSubmitting}>
        {isSubmitting
          ? editingPost
            ? "Updating..."
            : "Publishing..."
          : editingPost
          ? "Update Realty Post"
          : "Publish Realty Post"}
      </Button>
    </form>
  );
};
