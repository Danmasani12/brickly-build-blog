import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Building2, CheckCircle, Award, Users } from "lucide-react";
import heroImage from "@/assets/hero-construction.jpg";
import teamImage from "@/assets/team-construction.jpg";
import planningImage from "@/assets/team-planning.jpg";

const Home = () => {
  const features = [
    {
      icon: CheckCircle,
      title: "On Time Delivery",
      description: "We respect your time with planning and predictable project timelines.",
    },
    {
      icon: Award,
      title: "Quality Assured",
      description: "We use trusted materials and follow the highest standards of excellence.",
    },
    {
      icon: Users,
      title: "Expert Team",
      description: "Our experienced professionals bring expertise to every project.",
    },
    {
      icon: Building2,
      title: "Full Service",
      description: "From planning to completion, we handle every aspect of your project.",
    },
  ];

  const stats = [
    { number: "500+", label: "Projects Completed" },
    { number: "25+", label: "Years Experience" },
    { number: "100%", label: "Client Satisfaction" },
    { number: "50+", label: "Expert Team" },
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative h-screen flex items-center justify-center overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage: `url(${heroImage})`,
          }}
        >
          <div className="absolute inset-0 bg-gradient-to-r from-background via-background/80 to-background/40" />
        </div>

        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-3xl animate-fade-in">
            <div className="inline-block mb-4 px-4 py-2 bg-primary/10 border border-primary/20 rounded-full">
              <span className="text-primary font-semibold text-sm">25+ YEARS OF EXCELLENCE</span>
            </div>
            <h1 className="text-5xl md:text-7xl font-bold mb-6 text-foreground leading-tight">
              Building Your <span className="text-primary">Dreams</span> to Reality
            </h1>
            <p className="text-xl md:text-2xl text-muted-foreground mb-8 leading-relaxed">
              From custom homes to commercial spaces, Lion Cage delivers quality construction solutions — on time, on budget, and built to last.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Button asChild size="lg" className="bg-primary hover:bg-primary/90 text-primary-foreground font-semibold text-lg px-8 shadow-lg">
                <Link to="/contact">Get Started</Link>
              </Button>
              <Button asChild size="lg" variant="outline" className="border-2 border-primary text-primary hover:bg-primary hover:text-primary-foreground font-semibold text-lg px-8">
                <Link to="/gallery">View Our Work</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-card">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, index) => (
              <Card key={index} className="bg-background border-border hover:border-primary transition-all duration-300 animate-slide-up" style={{ animationDelay: `${index * 100}ms` }}>
                <CardContent className="p-6 text-center">
                  <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 mb-4">
                    <feature.icon className="w-8 h-8 text-primary" />
                  </div>
                  <h3 className="text-xl font-semibold text-foreground mb-2">{feature.title}</h3>
                  <p className="text-muted-foreground">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 bg-gradient-to-br from-primary to-primary/80 relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxwYXRoIGQ9Ik0zNiAxOGMzLjMxNCAwIDYgMi42ODYgNiA2cy0yLjY4NiA2LTYgNi02LTIuNjg2LTYtNiAyLjY4Ni02IDYtNiIgc3Ryb2tlPSIjZmZmIiBzdHJva2Utb3BhY2l0eT0iLjA1IiBzdHJva2Utd2lkdGg9IjIiLz48L2c+PC9zdmc+')] opacity-10" />
        <div className="container mx-auto px-4 relative z-10">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center animate-scale-in" style={{ animationDelay: `${index * 100}ms` }}>
                <div className="text-5xl md:text-6xl font-bold text-primary-foreground mb-2">
                  {stat.number}
                </div>
                <div className="text-primary-foreground/80 font-medium text-lg">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Services Preview */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12 animate-fade-in">
            <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
              Our Services
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Comprehensive construction solutions tailored to your needs
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                title: "Residential Construction",
                description: "Custom-built homes designed with care, quality, and unique character in mind.",
                link: "/services",
              },
              {
                title: "Commercial Projects",
                description: "Professional commercial spaces built to support and grow your business.",
                link: "/services",
              },
              {
                title: "Renovations",
                description: "Transform your existing spaces with expert renovation and remodeling services.",
                link: "/services",
              },
            ].map((service, index) => (
              <Card key={index} className="bg-card border-border hover:border-primary transition-all duration-300 group animate-slide-up" style={{ animationDelay: `${index * 100}ms` }}>
                <CardContent className="p-8">
                  <h3 className="text-2xl font-bold text-foreground mb-3 group-hover:text-primary transition-colors">
                    {service.title}
                  </h3>
                  <p className="text-muted-foreground mb-6">{service.description}</p>
                  <Link
                    to={service.link}
                    className="inline-flex items-center text-primary font-semibold hover:underline"
                  >
                    Learn More
                    <svg className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </Link>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="text-center mt-12">
            <Button asChild size="lg" className="bg-primary hover:bg-primary/90 text-primary-foreground font-semibold">
              <Link to="/services">View All Services</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Team Image */}
            <div className="animate-slide-up">
              <div className="relative rounded-2xl overflow-hidden shadow-2xl">
                <img 
                  src={teamImage} 
                  alt="Lion Cage Construction Professional Team" 
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-background/60 to-transparent" />
              </div>
            </div>

            {/* Team Content */}
            <div className="animate-fade-in">
              <div className="inline-block mb-4 px-4 py-2 bg-primary/10 border border-primary/20 rounded-full">
                <span className="text-primary font-semibold text-sm">MEET OUR EXPERTS</span>
              </div>
              <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-6">
                Built by Professionals Who <span className="text-primary">Care</span>
              </h2>
              <p className="text-lg text-muted-foreground mb-6 leading-relaxed">
                Our team of 50+ certified professionals brings over 25 years of combined expertise to every project. From skilled craftsmen to experienced project managers, each member is dedicated to delivering excellence.
              </p>
              <p className="text-lg text-muted-foreground mb-8 leading-relaxed">
                We believe that great construction starts with great people. That's why we invest in continuous training, safety certifications, and cutting-edge technology to ensure your project exceeds expectations.
              </p>
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <div className="text-3xl font-bold text-primary mb-2">100%</div>
                  <p className="text-muted-foreground">Licensed & Insured</p>
                </div>
                <div>
                  <div className="text-3xl font-bold text-primary mb-2">25+</div>
                  <p className="text-muted-foreground">Years Experience</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Planning Process Section */}
      <section className="py-20 bg-card">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Content First on Desktop */}
            <div className="animate-fade-in order-2 lg:order-1">
              <div className="inline-block mb-4 px-4 py-2 bg-primary/10 border border-primary/20 rounded-full">
                <span className="text-primary font-semibold text-sm">OUR PROCESS</span>
              </div>
              <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-6">
                Every Project Starts with a <span className="text-primary">Plan</span>
              </h2>
              <p className="text-lg text-muted-foreground mb-6 leading-relaxed">
                Success in construction isn't just about building—it's about planning. Our meticulous approach ensures every detail is considered before breaking ground, saving you time, money, and stress.
              </p>
              <p className="text-lg text-muted-foreground mb-8 leading-relaxed">
                From initial consultation to final walkthrough, we keep you informed every step of the way. Our transparent communication and detailed project timelines mean no surprises—just results that exceed your expectations.
              </p>
              <Button asChild size="lg" className="bg-primary hover:bg-primary/90 text-primary-foreground font-semibold">
                <Link to="/about">Learn About Our Process</Link>
              </Button>
            </div>

            {/* Planning Image */}
            <div className="animate-slide-up order-1 lg:order-2">
              <div className="relative rounded-2xl overflow-hidden shadow-2xl">
                <img 
                  src={planningImage} 
                  alt="Construction planning and collaboration" 
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-background/60 to-transparent" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center animate-fade-in">
            <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-6">
              Ready to Start Your Project?
            </h2>
            <p className="text-xl text-muted-foreground mb-8">
              Let's bring your vision to life. Contact us today for a free consultation.
            </p>
            <Button asChild size="lg" className="bg-primary hover:bg-primary/90 text-primary-foreground font-semibold text-lg px-12 shadow-lg">
              <Link to="/contact">Get a Free Quote</Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
