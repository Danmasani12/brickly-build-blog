import { useState } from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Upload, X, Plus } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

interface Bedroom {
  name: string;
  sqm: string;
}

export const RealtyPostForm = ({ onSuccess }: { onSuccess: () => void }) => {
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

  const addBedroom = () => {
    setBedrooms([...bedrooms, { name: "", sqm: "" }]);
  };

  const removeBedroom = (index: number) => {
    setBedrooms(bedrooms.filter((_, i) => i !== index));
  };

  const updateBedroom = (index: number, field: keyof Bedroom, value: string) => {
    const updated = [...bedrooms];
    updated[index][field] = value;
    setBedrooms(updated);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (images.length === 0) {
      toast.error("Please upload at least one image");
      return;
    }

    setIsSubmitting(true);

    try {
      // Insert realty post
      const { data: post, error: postError } = await supabase
        .from("realty_posts")
        .insert({
          title: formData.title,
          description: formData.description,
          price: formData.price,
          location: formData.location,
          type: formData.type,
          category: formData.category,
          living_room_sqm: formData.living_room_sqm ? parseFloat(formData.living_room_sqm) : null,
          kitchen_sqm: formData.kitchen_sqm ? parseFloat(formData.kitchen_sqm) : null,
        })
        .select()
        .single();

      if (postError) throw postError;

      // Insert bedrooms
      const validBedrooms = bedrooms.filter((b) => b.name && b.sqm);
      if (validBedrooms.length > 0) {
        const bedroomInserts = validBedrooms.map((bedroom) => ({
          realty_post_id: post.id,
          name: bedroom.name,
          sqm: parseFloat(bedroom.sqm),
        }));

        const { error: bedroomsError } = await supabase
          .from("realty_bedrooms")
          .insert(bedroomInserts);

        if (bedroomsError) throw bedroomsError;
      }

      // Insert images
      const imageInserts = images.map((image, index) => ({
        realty_post_id: post.id,
        image_url: image,
        display_order: index,
      }));

      const { error: imagesError } = await supabase
        .from("realty_images")
        .insert(imageInserts);

      if (imagesError) throw imagesError;

      toast.success("Realty post created successfully!");
      
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
      onSuccess();
    } catch (error: any) {
      toast.error(error.message || "Failed to create realty post");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
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

      <div className="space-y-2">
        <Label htmlFor="price">Price *</Label>
        <Input
          id="price"
          value={formData.price}
          onChange={(e) => setFormData({ ...formData, price: e.target.value })}
          required
          placeholder="$850,000 or $12,000/mo"
        />
      </div>

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

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="type">Type *</Label>
          <Select
            value={formData.type}
            onValueChange={(value) => setFormData({ ...formData, type: value })}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="sale">For Sale</SelectItem>
              <SelectItem value="lease">For Lease</SelectItem>
            </SelectContent>
          </Select>
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
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="living_room_sqm">Living Room (sqm)</Label>
          <Input
            id="living_room_sqm"
            type="number"
            step="0.01"
            value={formData.living_room_sqm}
            onChange={(e) => setFormData({ ...formData, living_room_sqm: e.target.value })}
            placeholder="45.5"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="kitchen_sqm">Kitchen (sqm)</Label>
          <Input
            id="kitchen_sqm"
            type="number"
            step="0.01"
            value={formData.kitchen_sqm}
            onChange={(e) => setFormData({ ...formData, kitchen_sqm: e.target.value })}
            placeholder="20.0"
          />
        </div>
      </div>

      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <Label>Bedrooms</Label>
          <Button type="button" size="sm" variant="outline" onClick={addBedroom}>
            <Plus className="w-4 h-4 mr-1" />
            Add Bedroom
          </Button>
        </div>
        {bedrooms.map((bedroom, index) => (
          <div key={index} className="flex gap-2">
            <Input
              placeholder="Bedroom name"
              value={bedroom.name}
              onChange={(e) => updateBedroom(index, "name", e.target.value)}
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

      <div className="space-y-2">
        <Label htmlFor="description">Description *</Label>
        <Textarea
          id="description"
          value={formData.description}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          required
          placeholder="Stunning modern villa with..."
          rows={4}
        />
      </div>

      <div className="space-y-2">
        <Label>Upload Images * (Multiple)</Label>
        <div className="relative">
          <Input
            id="realty-images"
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
            onClick={() => document.getElementById("realty-images")?.click()}
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
        {isSubmitting ? "Publishing..." : "Publish Realty Post"}
      </Button>
    </form>
  );
};
