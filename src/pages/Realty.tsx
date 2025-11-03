import { useState, useEffect } from "react"; 
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { MapPin, Square, Home, ChevronLeft, ChevronRight, X } from "lucide-react";
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
  images: ({ image_url?: string } | string)[];
  bedrooms: { name: string; sqm: number }[];
}

const Realty = () => {
  const [filter, setFilter] = useState("all");
  const [properties, setProperties] = useState<RealtyPost[]>([]);
  const [loading, setLoading] = useState(true);

  // Image handling states
  const [currentImageIndex, setCurrentImageIndex] = useState<Record<string, number>>({});
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxProperty, setLightboxProperty] = useState<RealtyPost | null>(null);
  const [lightboxImageIndex, setLightboxImageIndex] = useState(0);

  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const postsPerPage = 4;

  // ✅ Helper to construct full image URL
  const getImageUrl = (img: string | { image_url?: string } | undefined) => {
    if (!img) return "/placeholder.svg";
    const path = typeof img === "string" ? img : img.image_url;
    if (!path) return "/placeholder.svg";

    // If URL is already absolute, return it as-is
    if (path.startsWith("http://") || path.startsWith("https://")) {
      return path;
    }

    // Otherwise, prepend media URL
    return `${import.meta.env.VITE_MEDIA_URL}/${path.replace(/^\/+/, "")}`;
  };

  useEffect(() => {
    fetchRealtyPosts();
  }, []);

  const fetchRealtyPosts = async () => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/realty`);
      if (!response.ok) throw new Error("Failed to fetch properties");
      const data = await response.json();
      setProperties(data || []);
    } catch (error: any) {
      console.error(error);
      toast.error("Failed to load realty posts");
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

  // Pagination logic
  const indexOfLast = currentPage * postsPerPage;
  const indexOfFirst = indexOfLast - postsPerPage;
  const currentProperties = filteredProperties.slice(indexOfFirst, indexOfLast);
  const totalPages = Math.ceil(filteredProperties.length / postsPerPage);

  const nextPage = () => {
    if (currentPage < totalPages) setCurrentPage((prev) => prev + 1);
  };
  const prevPage = () => {
    if (currentPage > 1) setCurrentPage((prev) => prev - 1);
  };
  useEffect(() => {
    setCurrentPage(1);
  }, [filter]);

  // Lightbox handlers
  const openLightbox = (property: RealtyPost, index: number) => {
    setLightboxProperty(property);
    setLightboxImageIndex(index);
    setLightboxOpen(true);
  };

  const handlePrevImage = () => {
    if (!lightboxProperty) return;
    setLightboxImageIndex((prev) =>
      prev === 0 ? lightboxProperty.images.length - 1 : prev - 1
    );
  };

  const handleNextImage = () => {
    if (!lightboxProperty) return;
    setLightboxImageIndex((prev) =>
      prev === lightboxProperty.images.length - 1 ? 0 : prev + 1
    );
  };

  return (
    <div className="min-h-screen py-20">
      {/* Hero Section */}
      <section className="container mx-auto px-4 mb-16">
        <div className="text-center max-w-3xl mx-auto animate-fade-in">
          <h1 className="text-5xl md:text-6xl font-bold text-foreground mb-6">
            <span className="text-primary">Realty</span> Listings
          </h1>
          <p className="text-xl text-muted-foreground">
            Discover our latest properties for sale and lease — premium
            locations, quality construction, and exceptional value
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
        ) : currentProperties.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground">No properties found</p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {currentProperties.map((property, index) => (
                <Card
                  key={property.id}
                  className="bg-card border-border hover:border-primary transition-all duration-300 overflow-hidden group animate-slide-up"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  {/* Main Image Section */}
                  <div className="relative overflow-hidden aspect-[16/10]">
                    <img
                      src={getImageUrl(
                        property.images[currentImageIndex[property.id] || 0]
                      )}
                      alt={property.title}
                      className="w-full h-full object-cover transition-all duration-500 rounded-t-lg cursor-pointer"
                      onClick={() =>
                        openLightbox(
                          property,
                          currentImageIndex[property.id] || 0
                        )
                      }
                    />

                    <Badge className="absolute top-4 right-4 bg-primary text-primary-foreground hover:bg-primary">
                      {property.type === "sale" ? "For Sale" : "For Lease"}
                    </Badge>

                    {/* Image Thumbnails */}
                    {property.images.length > 1 && (
                      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 bg-background/70 px-3 py-2 rounded-lg shadow-md">
                        {property.images.map((img, imgIndex) => (
                          <button
                            key={imgIndex}
                            onClick={() =>
                              setCurrentImageIndex((prev) => ({
                                ...prev,
                                [property.id]: imgIndex,
                              }))
                            }
                            className={`w-12 h-12 rounded-md overflow-hidden border-2 transition-all duration-200 hover:scale-105 ${
                              (currentImageIndex[property.id] || 0) === imgIndex
                                ? "border-primary shadow-lg"
                                : "border-border hover:border-primary/50"
                            }`}
                          >
                            <img
                              src={getImageUrl(img)}
                              alt={`${property.title} thumbnail ${imgIndex + 1}`}
                              className="w-full h-full object-cover"
                            />
                          </button>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Property Details */}
                  <CardHeader>
                    <div className="flex items-start justify-between mb-2">
                      <CardTitle className="text-2xl text-foreground group-hover:text-primary transition-colors">
                        {property.title}
                      </CardTitle>
                      <span className="text-2xl font-bold text-primary whitespace-nowrap ml-4">
                        ₦{property.price}
                      </span>
                    </div>
                    <div className="flex items-center text-muted-foreground">
                      <MapPin className="w-4 h-4 mr-2 text-primary" />
                      <span>{property.location}</span>
                    </div>
                  </CardHeader>

                  <CardContent>
                    <p className="text-muted-foreground mb-4">
                      {property.description}
                    </p>

                    <div className="space-y-2 mb-4 py-4 border-y border-border">
                      {property.bedrooms?.length > 0 && (
                        <div>
                          <h4 className="text-sm font-semibold text-foreground mb-1">
                            Bedrooms:
                          </h4>
                          <div className="flex flex-wrap gap-2">
                            {property.bedrooms.map((bedroom, idx) => (
                              <Badge
                                key={idx}
                                variant="outline"
                                className="border-primary/30"
                              >
                                {bedroom.name}: {bedroom.sqm} sqm
                              </Badge>
                            ))}
                          </div>
                        </div>
                      )}
                      {property.living_room_sqm && (
                        <div className="flex items-center">
                          <Square className="w-4 h-4 text-primary mr-2" />
                          <span className="text-foreground">
                            Living Room: {property.living_room_sqm} sqm
                          </span>
                        </div>
                      )}
                      {property.kitchen_sqm && (
                        <div className="flex items-center">
                          <Square className="w-4 h-4 text-primary mr-2" />
                          <span className="text-foreground">
                            Kitchen: {property.kitchen_sqm} sqm
                          </span>
                        </div>
                      )}
                    </div>

                    <Button
                      className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-semibold"
                      onClick={() => {
                        const message = `Hello, I saw your property - ${property.title}, and I would like to know more about it.`;
                        const whatsappUrl = `https://wa.me/2348098149314?text=${encodeURIComponent(
                          message
                        )}`;
                        window.open(whatsappUrl, "_blank");
                      }}
                    >
                      Contact for Details
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Pagination Controls */}
            <div className="flex justify-between items-center mt-10">
              <Button
                onClick={prevPage}
                disabled={currentPage === 1}
                variant="outline"
              >
                Previous
              </Button>

              <span className="text-sm text-muted-foreground">
                Page {currentPage} of {totalPages}
              </span>

              <Button
                onClick={nextPage}
                disabled={currentPage === totalPages}
                variant="outline"
              >
                Next
              </Button>
            </div>
          </>
        )}
      </section>

      {/* Lightbox Modal */}
      <Dialog open={lightboxOpen} onOpenChange={setLightboxOpen}>
        <DialogContent className="max-w-7xl w-full h-[90vh] p-0 bg-background/95 backdrop-blur-sm">
          <button
            onClick={() => setLightboxOpen(false)}
            className="absolute top-4 right-4 z-50 p-2 rounded-full bg-background/80 hover:bg-background transition-colors"
          >
            <X className="w-6 h-6" />
          </button>

          {lightboxProperty && (
            <div className="relative w-full h-full flex items-center justify-center p-16">
              <img
                src={getImageUrl(
                  lightboxProperty.images[lightboxImageIndex]
                )}
                alt={`${lightboxProperty.title} - Image ${lightboxImageIndex + 1}`}
                className="max-w-[90vw] max-h-[80vh] w-auto h-auto object-contain"
              />

              {lightboxProperty.images.length > 1 && (
                <>
                  <button
                    onClick={handlePrevImage}
                    className="absolute left-4 top-1/2 -translate-y-1/2 p-3 rounded-full bg-background/80 hover:bg-background transition-all hover:scale-110"
                  >
                    <ChevronLeft className="w-8 h-8" />
                  </button>

                  <button
                    onClick={handleNextImage}
                    className="absolute right-4 top-1/2 -translate-y-1/2 p-3 rounded-full bg-background/80 hover:bg-background transition-all hover:scale-110"
                  >
                    <ChevronRight className="w-8 h-8" />
                  </button>

                  <div className="absolute bottom-4 left-1/2 -translate-x-1/2 px-4 py-2 rounded-full bg-background/80 text-sm">
                    {lightboxImageIndex + 1} / {lightboxProperty.images.length}
                  </div>
                </>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* CTA Section */}
      <section className="container mx-auto px-4">
        <div className="bg-card rounded-2xl p-12 border border-border text-center">
          <Home className="w-16 h-16 text-primary mx-auto mb-6" />
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            Looking for Something Specific?
          </h2>
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            We have access to exclusive listings and can help you find the
            perfect property
          </p>
          <Button
            size="lg"
            className="bg-primary hover:bg-primary/90 text-primary-foreground font-semibold text-lg px-12"
          >
            Schedule a Consultation
          </Button>
        </div>
      </section>
    </div>
  );
};

export default Realty;
