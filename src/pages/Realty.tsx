import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { MapPin, Square, Home } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface RealtyPost {
  id: string;
  title: string;
  type: string;
  category: string;
  price: string;
  location: string;
  description: string;
  living_room_sqm: number | null;
  kitchen_sqm: number | null;
  images: { image_url: string }[];
  bedrooms: { name: string; sqm: number }[];
}

const Realty = () => {
  const [filter, setFilter] = useState("all");
  const [properties, setProperties] = useState<RealtyPost[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchRealtyPosts();
  }, []);

  const fetchRealtyPosts = async () => {
    try {
      const { data: posts, error: postsError } = await supabase
        .from("realty_posts")
        .select(`
          id,
          title,
          type,
          category,
          price,
          location,
          description,
          living_room_sqm,
          kitchen_sqm,
          images:realty_images(image_url),
          bedrooms:realty_bedrooms(name, sqm)
        `)
        .order("created_at", { ascending: false });

      if (postsError) throw postsError;
      
      setProperties(posts || []);
    } catch (error: any) {
      toast.error("Failed to load realty posts");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const filters = [
    { id: "all", label: "All Properties" },
    { id: "sale", label: "For Sale" },
    { id: "lease", label: "For Lease" },
  ];

  const filteredProperties =
    filter === "all"
      ? properties
      : properties.filter((property) => property.type === filter);

  return (
    <div className="min-h-screen py-20">
      {/* Hero Section */}
      <section className="container mx-auto px-4 mb-16">
        <div className="text-center max-w-3xl mx-auto animate-fade-in">
          <h1 className="text-5xl md:text-6xl font-bold text-foreground mb-6">
            <span className="text-primary">Realty</span> Listings
          </h1>
          <p className="text-xl text-muted-foreground">
            Discover our latest properties for sale and lease — premium locations, quality construction, and exceptional value
          </p>
        </div>
      </section>

      {/* Filter Buttons */}
      <section className="container mx-auto px-4 mb-12">
        <div className="flex flex-wrap justify-center gap-4">
          {filters.map((item) => (
            <Button
              key={item.id}
              onClick={() => setFilter(item.id)}
              variant={filter === item.id ? "default" : "outline"}
              className={
                filter === item.id
                  ? "bg-primary text-primary-foreground hover:bg-primary/90"
                  : "border-2 border-border hover:border-primary hover:text-primary"
              }
            >
              {item.label}
            </Button>
          ))}
        </div>
      </section>

      {/* Properties Grid */}
      <section className="container mx-auto px-4 mb-20">
        {loading ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground">Loading properties...</p>
          </div>
        ) : filteredProperties.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground">No properties found</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {filteredProperties.map((property, index) => (
              <Card
                key={property.id}
                className="bg-card border-border hover:border-primary transition-all duration-300 overflow-hidden group animate-slide-up"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className="relative overflow-hidden aspect-[16/10]">
                  <img
                    src={property.images[0]?.image_url || "/placeholder.svg"}
                    alt={property.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  <Badge className="absolute top-4 right-4 bg-primary text-primary-foreground hover:bg-primary">
                    {property.type === "sale" ? "For Sale" : "For Lease"}
                  </Badge>
                  {property.images.length > 1 && (
                    <Badge className="absolute top-4 left-4 bg-background/80 text-foreground">
                      {property.images.length} photos
                    </Badge>
                  )}
                </div>

                <CardHeader>
                  <div className="flex items-start justify-between mb-2">
                    <CardTitle className="text-2xl text-foreground group-hover:text-primary transition-colors">
                      {property.title}
                    </CardTitle>
                    <span className="text-2xl font-bold text-primary whitespace-nowrap ml-4">
                      {property.price}
                    </span>
                  </div>
                  <div className="flex items-center text-muted-foreground">
                    <MapPin className="w-4 h-4 mr-2 text-primary" />
                    <span>{property.location}</span>
                  </div>
                </CardHeader>

                <CardContent>
                  <p className="text-muted-foreground mb-4">{property.description}</p>

                  {/* Property Details */}
                  <div className="space-y-2 mb-4 py-4 border-y border-border">
                    {property.bedrooms.length > 0 && (
                      <div>
                        <h4 className="text-sm font-semibold text-foreground mb-1">Bedrooms:</h4>
                        <div className="flex flex-wrap gap-2">
                          {property.bedrooms.map((bedroom, idx) => (
                            <Badge key={idx} variant="outline" className="border-primary/30">
                              {bedroom.name}: {bedroom.sqm} sqm
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )}
                    {property.living_room_sqm && (
                      <div className="flex items-center">
                        <Square className="w-4 h-4 text-primary mr-2" />
                        <span className="text-foreground">Living Room: {property.living_room_sqm} sqm</span>
                      </div>
                    )}
                    {property.kitchen_sqm && (
                      <div className="flex items-center">
                        <Square className="w-4 h-4 text-primary mr-2" />
                        <span className="text-foreground">Kitchen: {property.kitchen_sqm} sqm</span>
                      </div>
                    )}
                  </div>

                  <Button className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-semibold">
                    Contact for Details
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </section>

      {/* CTA Section */}
      <section className="container mx-auto px-4">
        <div className="bg-card rounded-2xl p-12 border border-border text-center">
          <Home className="w-16 h-16 text-primary mx-auto mb-6" />
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            Looking for Something Specific?
          </h2>
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            We have access to exclusive listings and can help you find the perfect property
          </p>
          <Button size="lg" className="bg-primary hover:bg-primary/90 text-primary-foreground font-semibold text-lg px-12">
            Schedule a Consultation
          </Button>
        </div>
      </section>
    </div>
  );
};

export default Realty;
