import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { toast } from "sonner";
import { ChevronLeft, ChevronRight, X } from "lucide-react";

interface GalleryPost {
  id: string;
  title: string;
  category: string;
  description: string;
  images: Array<{ image_url?: string } | string>;
}

const Gallery = () => {
  const [filter, setFilter] = useState("all");
  const [projects, setProjects] = useState<GalleryPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentImageIndex, setCurrentImageIndex] = useState<Record<string, number>>({});
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxProject, setLightboxProject] = useState<GalleryPost | null>(null);
  const [lightboxImageIndex, setLightboxImageIndex] = useState(0);

  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const postsPerPage = 6;

  // Helper to construct full image URL
  const getImageUrl = (img: string | { image_url?: string } | undefined) => {
    if (!img) return "/placeholder.svg";

    let path = typeof img === "string" ? img : img.image_url;
    if (!path) return "/placeholder.svg";

    return path.startsWith("http") ? path : `${import.meta.env.VITE_MEDIA_URL}/${path}`;
  };

  useEffect(() => {
    fetchGalleryPosts();
  }, []);

  const fetchGalleryPosts = async () => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/gallery`);
      if (!response.ok) throw new Error("Failed to fetch gallery posts");
      const data = await response.json();
      setProjects(data || []);
      console.log("Gallery data:", data); // ✅ check structure
    } catch (error: any) {
      console.error(error);
      toast.error("Failed to load gallery posts");
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

  const totalPages = Math.ceil(filteredProjects.length / postsPerPage);
  const indexOfLastPost = currentPage * postsPerPage;
  const indexOfFirstPost = indexOfLastPost - postsPerPage;
  const currentProjects = filteredProjects.slice(indexOfFirstPost, indexOfLastPost);

  const nextPage = () => {
    if (currentPage < totalPages) setCurrentPage((prev) => prev + 1);
  };

  const prevPage = () => {
    if (currentPage > 1) setCurrentPage((prev) => prev - 1);
  };

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
            Explore our portfolio of completed projects showcasing our commitment
            to excellence and craftsmanship.
          </p>
        </div>
      </section>

      {/* Filter Buttons */}
      <section className="container mx-auto px-4 mb-12">
        <div className="flex flex-wrap justify-center gap-4">
          {categories.map((category) => (
            <Button
              key={category.id}
              onClick={() => {
                setFilter(category.id);
                setCurrentPage(1);
              }}
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
        ) : currentProjects.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground">No projects found</p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {currentProjects.map((project, index) => (
                <Card
                  key={project.id}
                  className="bg-card border-border hover:border-primary transition-all duration-300 overflow-hidden group animate-scale-in"
                  style={{ animationDelay: `${index * 50}ms` }}
                >
                  <div className="relative overflow-hidden aspect-[4/3]">
                    <img
                      src={getImageUrl(project.images[currentImageIndex[project.id] || 0])}
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
                                ? "border-primary shadow-lg"
                                : "border-border hover:border-primary/50"
                            }`}
                          >
                            <img
                              src={getImageUrl(image)}
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

      {/* Lightbox */}
      <Dialog open={lightboxOpen} onOpenChange={setLightboxOpen}>
        <DialogContent className="max-w-7xl w-full h-[90vh] p-0 bg-background/95 backdrop-blur-sm">
          <button
            onClick={() => setLightboxOpen(false)}
            className="absolute top-4 right-4 z-50 p-2 rounded-full bg-background/80 hover:bg-background transition-colors"
          >
            <X className="w-6 h-6" />
          </button>

          {lightboxProject && (
            <div className="relative w-full h-full flex items-center justify-center p-16">
              <img
                src={getImageUrl(lightboxProject.images[lightboxImageIndex])}
                alt={`${lightboxProject.title} - Image ${lightboxImageIndex + 1}`}
                className="max-w-[90vw] max-h-[80vh] w-auto h-auto object-contain"
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
