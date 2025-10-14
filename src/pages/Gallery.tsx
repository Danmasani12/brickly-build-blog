import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { ChevronLeft, ChevronRight, X } from "lucide-react";

interface GalleryPost {
  id: string;
  title: string;
  category: string;
  description: string;
  images: { image_url: string }[];
}

const Gallery = () => {
  const [filter, setFilter] = useState("all");
  const [projects, setProjects] = useState<GalleryPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentImageIndex, setCurrentImageIndex] = useState<Record<string, number>>({});
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxProject, setLightboxProject] = useState<GalleryPost | null>(null);
  const [lightboxImageIndex, setLightboxImageIndex] = useState(0);

  useEffect(() => {
    fetchGalleryPosts();
  }, []);

  const fetchGalleryPosts = async () => {
    try {
      const { data: posts, error: postsError } = await supabase
        .from("gallery_posts")
        .select(`
          id,
          title,
          category,
          description,
          images:gallery_images(image_url)
        `)
        .order("created_at", { ascending: false });

      if (postsError) throw postsError;
      
      setProjects(posts || []);
    } catch (error: any) {
      toast.error("Failed to load gallery posts");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const categories = [
    { id: "all", label: "All Projects" },
    { id: "residential", label: "Residential" },
    { id: "commercial", label: "Commercial" },
    { id: "renovation", label: "Renovations" },
  ];

  const filteredProjects =
    filter === "all"
      ? projects
      : projects.filter((project) => project.category === filter);

  const openLightbox = (project: GalleryPost, imageIndex: number) => {
    setLightboxProject(project);
    setLightboxImageIndex(imageIndex);
    setLightboxOpen(true);
  };

  const handlePrevImage = () => {
    if (!lightboxProject) return;
    setLightboxImageIndex((prev) => 
      prev === 0 ? lightboxProject.images.length - 1 : prev - 1
    );
  };

  const handleNextImage = () => {
    if (!lightboxProject) return;
    setLightboxImageIndex((prev) => 
      prev === lightboxProject.images.length - 1 ? 0 : prev + 1
    );
  };

  return (
    <div className="min-h-screen py-20">
      {/* Hero Section */}
      <section className="container mx-auto px-4 mb-16">
        <div className="text-center max-w-3xl mx-auto animate-fade-in">
          <h1 className="text-5xl md:text-6xl font-bold text-foreground mb-6">
            Our <span className="text-primary">Gallery</span>
          </h1>
          <p className="text-xl text-muted-foreground">
            Explore our portfolio of completed projects showcasing our commitment to excellence and craftsmanship
          </p>
        </div>
      </section>

      {/* Filter Buttons */}
      <section className="container mx-auto px-4 mb-12">
        <div className="flex flex-wrap justify-center gap-4">
          {categories.map((category) => (
            <Button
              key={category.id}
              onClick={() => setFilter(category.id)}
              variant={filter === category.id ? "default" : "outline"}
              className={
                filter === category.id
                  ? "bg-primary text-primary-foreground hover:bg-primary/90"
                  : "border-2 border-border hover:border-primary hover:text-primary"
              }
            >
              {category.label}
            </Button>
          ))}
        </div>
      </section>

      {/* Gallery Grid */}
      <section className="container mx-auto px-4">
        {loading ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground">Loading gallery...</p>
          </div>
        ) : filteredProjects.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground">No projects found</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredProjects.map((project, index) => (
              <Card
                key={project.id}
                className="bg-card border-border hover:border-primary transition-all duration-300 overflow-hidden group animate-scale-in"
                style={{ animationDelay: `${index * 50}ms` }}
              >
                <div className="relative overflow-hidden aspect-[4/3]">
                  <img
                    src={project.images[currentImageIndex[project.id] || 0]?.image_url || "/placeholder.svg"}
                    alt={project.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-background/90 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end">
                    <div className="p-6 w-full">
                      <span className="inline-block px-3 py-1 bg-primary text-primary-foreground text-xs font-semibold rounded-full mb-2 uppercase">
                        {project.category}
                      </span>
                    </div>
                  </div>
                </div>
                <CardContent className="p-6">
                  <h3 className="text-xl font-bold text-foreground mb-2 group-hover:text-primary transition-colors">
                    {project.title}
                  </h3>
                  <p className="text-muted-foreground">{project.description}</p>
                  {project.images.length > 1 && (
                    <div className="flex gap-2 mt-4 flex-wrap">
                      {project.images.map((image, imgIndex) => (
                        <button
                          key={imgIndex}
                          onClick={() => openLightbox(project, imgIndex)}
                          className={`w-16 h-16 rounded-md overflow-hidden border-2 transition-all duration-200 hover:scale-105 ${
                            (currentImageIndex[project.id] || 0) === imgIndex 
                              ? 'border-primary shadow-lg' 
                              : 'border-border hover:border-primary/50'
                          }`}
                        >
                          <img
                            src={image.image_url}
                            alt={`${project.title} thumbnail ${imgIndex + 1}`}
                            className="w-full h-full object-cover"
                          />
                        </button>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </section>

      {/* Stats Section */}
      <section className="container mx-auto px-4 py-20">
        <div className="bg-card rounded-2xl p-12 border border-border">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            {[
              { number: "500+", label: "Completed Projects" },
              { number: "25+", label: "Years Experience" },
              { number: "100%", label: "Client Satisfaction" },
              { number: "50+", label: "Awards Won" },
            ].map((stat, index) => (
              <div key={index} className="animate-fade-in" style={{ animationDelay: `${index * 100}ms` }}>
                <div className="text-4xl md:text-5xl font-bold text-primary mb-2">
                  {stat.number}
                </div>
                <div className="text-muted-foreground font-medium">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Call to Action Section */}
      <section className="container mx-auto px-4 py-20">
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-primary/10 via-primary/5 to-background border-2 border-primary/20">
          <div className="absolute inset-0 bg-[url('/src/assets/hero-construction.jpg')] bg-cover bg-center opacity-5"></div>
          <div className="relative px-8 md:px-16 py-20 text-center">
            <div className="max-w-3xl mx-auto space-y-8 animate-fade-in">
              <h2 className="text-4xl md:text-5xl font-bold text-foreground">
                Ready to Start Your <span className="text-primary">Dream Project?</span>
              </h2>
              <p className="text-xl text-muted-foreground leading-relaxed">
                Join hundreds of satisfied clients who have transformed their visions into reality. 
                Our expert team is ready to bring your ideas to life with precision and excellence.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-4">
                <Button 
                  size="lg" 
                  className="bg-primary text-primary-foreground hover:bg-primary/90 text-lg px-8 py-6 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
                  onClick={() => window.location.href = '/contact'}
                >
                  Get Free Consultation
                </Button>
                <Button 
                  size="lg" 
                  variant="outline"
                  className="border-2 border-primary text-primary hover:bg-primary hover:text-primary-foreground text-lg px-8 py-6 rounded-full transition-all duration-300 hover:scale-105"
                  onClick={() => window.location.href = '/services'}
                >
                  Explore Services
                </Button>
              </div>
              <div className="flex flex-wrap justify-center gap-8 pt-8 text-sm text-muted-foreground">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-primary animate-pulse"></div>
                  <span>Free Project Assessment</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-primary animate-pulse"></div>
                  <span>24/7 Support Available</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-primary animate-pulse"></div>
                  <span>Licensed & Insured</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Image Lightbox */}
      <Dialog open={lightboxOpen} onOpenChange={setLightboxOpen}>
        <DialogContent className="max-w-7xl w-full h-[90vh] p-0 bg-background/95 backdrop-blur-sm">
          <button
            onClick={() => setLightboxOpen(false)}
            className="absolute top-4 right-4 z-50 p-2 rounded-full bg-background/80 hover:bg-background transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
          
          {lightboxProject && (
            <div className="relative w-full h-full flex items-center justify-center p-12">
              <img
                src={lightboxProject.images[lightboxImageIndex]?.image_url}
                alt={`${lightboxProject.title} - Image ${lightboxImageIndex + 1}`}
                className="max-w-full max-h-full object-contain"
              />
              
              {lightboxProject.images.length > 1 && (
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
                    {lightboxImageIndex + 1} / {lightboxProject.images.length}
                  </div>
                </>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Gallery;
