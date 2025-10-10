import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { MapPin, Bed, Bath, Square, Home } from "lucide-react";
import residentialImage from "@/assets/project-residential.jpg";
import commercialImage from "@/assets/project-commercial.jpg";

const Realty = () => {
  const [filter, setFilter] = useState("all");

  const properties = [
    {
      id: 1,
      title: "Luxury Modern Villa",
      type: "sale",
      category: "residential",
      price: "$850,000",
      location: "Beverly Hills, CA",
      beds: 4,
      baths: 3,
      sqft: "3,500",
      image: residentialImage,
      description: "Stunning modern villa with panoramic city views, high-end finishes, and smart home technology.",
      features: ["Pool", "Garden", "Garage", "Smart Home"],
      status: "For Sale",
    },
    {
      id: 2,
      title: "Downtown Office Space",
      type: "lease",
      category: "commercial",
      price: "$12,000/mo",
      location: "Downtown LA",
      beds: null,
      baths: 2,
      sqft: "5,000",
      image: commercialImage,
      description: "Prime office space in the heart of downtown, perfect for growing businesses.",
      features: ["Parking", "Elevator", "Conference Rooms", "24/7 Access"],
      status: "For Lease",
    },
    {
      id: 3,
      title: "Beachfront Condo",
      type: "sale",
      category: "residential",
      price: "$625,000",
      location: "Santa Monica, CA",
      beds: 2,
      baths: 2,
      sqft: "1,800",
      image: residentialImage,
      description: "Beautiful oceanfront condo with direct beach access and breathtaking sunset views.",
      features: ["Ocean View", "Balcony", "Gym", "Concierge"],
      status: "For Sale",
    },
    {
      id: 4,
      title: "Retail Shopping Space",
      type: "lease",
      category: "commercial",
      price: "$8,500/mo",
      location: "West Hollywood",
      beds: null,
      baths: 1,
      sqft: "2,500",
      image: commercialImage,
      description: "High-traffic retail location with excellent visibility and parking.",
      features: ["Storefront", "Storage", "Signage", "Parking"],
      status: "For Lease",
    },
  ];

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
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {filteredProperties.map((property, index) => (
            <Card
              key={property.id}
              className="bg-card border-border hover:border-primary transition-all duration-300 overflow-hidden group animate-slide-up"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <div className="relative overflow-hidden aspect-[16/10]">
                <img
                  src={property.image}
                  alt={property.title}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                />
                <Badge className="absolute top-4 right-4 bg-primary text-primary-foreground hover:bg-primary">
                  {property.status}
                </Badge>
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
                <div className="flex flex-wrap gap-4 mb-4 py-4 border-y border-border">
                  {property.beds && (
                    <div className="flex items-center">
                      <Bed className="w-5 h-5 text-primary mr-2" />
                      <span className="text-foreground font-medium">{property.beds} Beds</span>
                    </div>
                  )}
                  <div className="flex items-center">
                    <Bath className="w-5 h-5 text-primary mr-2" />
                    <span className="text-foreground font-medium">{property.baths} Baths</span>
                  </div>
                  <div className="flex items-center">
                    <Square className="w-5 h-5 text-primary mr-2" />
                    <span className="text-foreground font-medium">{property.sqft} sqft</span>
                  </div>
                </div>

                {/* Features */}
                <div className="mb-6">
                  <h4 className="text-sm font-semibold text-foreground mb-2">Features:</h4>
                  <div className="flex flex-wrap gap-2">
                    {property.features.map((feature, idx) => (
                      <Badge key={idx} variant="outline" className="border-primary/30 text-muted-foreground">
                        {feature}
                      </Badge>
                    ))}
                  </div>
                </div>

                <Button className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-semibold">
                  Contact for Details
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
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
