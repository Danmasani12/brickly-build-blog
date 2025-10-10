import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Building2, Home, Wrench, Hammer, PaintBucket, Ruler } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const Services = () => {
  const services = [
    {
      icon: Home,
      title: "Residential Construction",
      description: "Build your dream home from the ground up with our comprehensive residential construction services.",
      features: [
        "Custom Home Building",
        "Architectural Planning",
        "Interior Design Consultation",
        "Quality Material Selection",
        "Energy-Efficient Solutions",
      ],
    },
    {
      icon: Building2,
      title: "Commercial Construction",
      description: "Professional commercial spaces designed to support and grow your business operations.",
      features: [
        "Office Buildings",
        "Retail Spaces",
        "Industrial Facilities",
        "Restaurant Construction",
        "Mixed-Use Developments",
      ],
    },
    {
      icon: Wrench,
      title: "Renovations & Remodeling",
      description: "Transform your existing spaces with our expert renovation and remodeling services.",
      features: [
        "Kitchen Remodeling",
        "Bathroom Upgrades",
        "Basement Finishing",
        "Room Additions",
        "Complete Home Makeovers",
      ],
    },
    {
      icon: Hammer,
      title: "Structural Work",
      description: "Ensure the integrity and safety of your building with our structural engineering expertise.",
      features: [
        "Foundation Repair",
        "Structural Reinforcement",
        "Load-Bearing Wall Installation",
        "Beam Replacement",
        "Seismic Retrofitting",
      ],
    },
    {
      icon: PaintBucket,
      title: "Finishing Services",
      description: "Add the perfect finishing touches to your project with our professional services.",
      features: [
        "Interior & Exterior Painting",
        "Flooring Installation",
        "Tile & Stone Work",
        "Cabinetry & Millwork",
        "Decorative Finishes",
      ],
    },
    {
      icon: Ruler,
      title: "Design & Planning",
      description: "Comprehensive design and planning services to bring your vision to life.",
      features: [
        "Architectural Design",
        "3D Visualization",
        "Permit Processing",
        "Cost Estimation",
        "Project Management",
      ],
    },
  ];

  return (
    <div className="min-h-screen py-20">
      {/* Hero Section */}
      <section className="container mx-auto px-4 mb-20">
        <div className="text-center max-w-3xl mx-auto animate-fade-in">
          <h1 className="text-5xl md:text-6xl font-bold text-foreground mb-6">
            Our <span className="text-primary">Services</span>
          </h1>
          <p className="text-xl text-muted-foreground">
            Comprehensive construction solutions designed to meet every need — from concept to completion, we deliver excellence at every stage.
          </p>
        </div>
      </section>

      {/* Services Grid */}
      <section className="container mx-auto px-4 mb-20">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.map((service, index) => (
            <Card
              key={index}
              className="bg-card border-border hover:border-primary transition-all duration-300 animate-slide-up group"
              style={{ animationDelay: `${index * 50}ms` }}
            >
              <CardHeader>
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 mb-4 group-hover:bg-primary/20 transition-colors">
                  <service.icon className="w-8 h-8 text-primary" />
                </div>
                <CardTitle className="text-2xl text-foreground group-hover:text-primary transition-colors">
                  {service.title}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground mb-6">{service.description}</p>
                <ul className="space-y-2">
                  {service.features.map((feature, idx) => (
                    <li key={idx} className="flex items-start">
                      <span className="inline-block w-1.5 h-1.5 rounded-full bg-primary mt-2 mr-3 flex-shrink-0" />
                      <span className="text-muted-foreground text-sm">{feature}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="bg-card py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-foreground mb-4">Why Choose Lion Cage?</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              We're committed to delivering exceptional quality and service
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { title: "Licensed & Insured", desc: "Fully certified professionals" },
              { title: "Quality Materials", desc: "Premium building materials" },
              { title: "On-Time Delivery", desc: "Punctual project completion" },
              { title: "Competitive Pricing", desc: "Great value for your investment" },
            ].map((item, index) => (
              <div
                key={index}
                className="text-center p-6 rounded-lg bg-background border border-border hover:border-primary transition-all animate-scale-in"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <h3 className="text-xl font-semibold text-foreground mb-2">{item.title}</h3>
                <p className="text-muted-foreground">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="container mx-auto px-4 py-20">
        <div className="max-w-4xl mx-auto text-center animate-fade-in">
          <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-6">
            Let's Build Something Amazing Together
          </h2>
          <p className="text-xl text-muted-foreground mb-8">
            Contact us today to discuss your project and get a free consultation
          </p>
          <Button asChild size="lg" className="bg-primary hover:bg-primary/90 text-primary-foreground font-semibold text-lg px-12">
            <Link to="/contact">Get in Touch</Link>
          </Button>
        </div>
      </section>
    </div>
  );
};

export default Services;
