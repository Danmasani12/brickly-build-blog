import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

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
                    src={project.images[0]?.image_url || "/placeholder.svg"}
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
                    <p className="text-xs text-muted-foreground mt-2">
                      +{project.images.length - 1} more {project.images.length === 2 ? "image" : "images"}
                    </p>
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
    </div>
  );
};

export default Gallery;
