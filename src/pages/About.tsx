import { Card, CardContent } from "@/components/ui/card";
import { Award, Users, Target, Heart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import logo from "@/assets/lion-cage-logo.png";

const About = () => {
  const values = [
    {
      icon: Award,
      title: "Excellence",
      description: "We strive for perfection in every project, delivering superior quality and craftsmanship.",
    },
    {
      icon: Users,
      title: "Collaboration",
      description: "We work closely with our clients to understand their vision and bring it to life.",
    },
    {
      icon: Target,
      title: "Precision",
      description: "Attention to detail and meticulous planning ensure flawless execution.",
    },
    {
      icon: Heart,
      title: "Integrity",
      description: "Honesty, transparency, and ethical practices are at the heart of everything we do.",
    },
  ];

  const milestones = [
    { year: "1998", event: "Lion Cage Founded", description: "Started with a vision to build dreams" },
    { year: "2005", event: "500 Projects Milestone", description: "Celebrated our 500th completed project" },
    { year: "2015", event: "Award Winning", description: "Received Builder of the Year award" },
    { year: "2023", event: "25 Years Strong", description: "Quarter century of excellence in construction" },
  ];

  return (
    <div className="min-h-screen py-20">
      {/* Hero Section */}
      <section className="container mx-auto px-4 mb-20">
        <div className="text-center max-w-3xl mx-auto animate-fade-in mb-12">
          <img src={logo} alt="Lion Cage" className="h-24 w-auto mx-auto mb-8" />
          <h1 className="text-5xl md:text-6xl font-bold text-foreground mb-6">
            About <span className="text-primary">Lion Cage</span>
          </h1>
          <p className="text-xl text-muted-foreground leading-relaxed">
            For over 25 years, Lion Cage Construction has been transforming visions into reality, building structures that stand the test of time with unwavering commitment to quality and excellence.
          </p>
        </div>
      </section>

      {/* Our Story */}
      <section className="container mx-auto px-4 mb-20">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="animate-slide-up">
            <h2 className="text-4xl font-bold text-foreground mb-6">Our Story</h2>
            <div className="space-y-4 text-muted-foreground leading-relaxed">
              <p>
                Founded in 1998, Lion Cage Construction began with a simple mission: to deliver exceptional construction services that exceed client expectations. What started as a small family-owned business has grown into one of the region's most trusted construction companies.
              </p>
              <p>
                Our name, "Lion Cage," symbolizes the strength and reliability we bring to every project. Like the lion represents power and majesty, and the cage represents structure and security, we combine strength with precision to create buildings that are both beautiful and enduring.
              </p>
              <p>
                Over the years, we've completed hundreds of projects, from custom homes to large commercial developments. But no matter the size or scope, every project receives the same level of attention, care, and expertise that has become our hallmark.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-6 animate-fade-in">
            {[
              { number: "500+", label: "Projects" },
              { number: "25+", label: "Years" },
              { number: "100%", label: "Satisfaction" },
              { number: "50+", label: "Team Members" },
            ].map((stat, index) => (
              <Card key={index} className="bg-card border-border text-center p-8">
                <CardContent className="p-0">
                  <div className="text-4xl font-bold text-primary mb-2">{stat.number}</div>
                  <div className="text-muted-foreground">{stat.label}</div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Our Values */}
      <section className="bg-card py-20 mb-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-foreground mb-4">Our Core Values</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              The principles that guide everything we do
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((value, index) => (
              <div
                key={index}
                className="text-center animate-slide-up"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-primary/10 mb-6">
                  <value.icon className="w-10 h-10 text-primary" />
                </div>
                <h3 className="text-2xl font-bold text-foreground mb-3">{value.title}</h3>
                <p className="text-muted-foreground">{value.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Timeline */}
      <section className="container mx-auto px-4 mb-20">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-foreground mb-4">Our Journey</h2>
          <p className="text-xl text-muted-foreground">Key milestones in our history</p>
        </div>

        <div className="max-w-4xl mx-auto">
          <div className="relative">
            {/* Timeline Line */}
            <div className="absolute left-1/2 transform -translate-x-1/2 h-full w-0.5 bg-border hidden md:block" />

            {milestones.map((milestone, index) => (
              <div
                key={index}
                className={`relative mb-12 animate-fade-in ${
                  index % 2 === 0 ? "md:text-right md:pr-12" : "md:text-left md:pl-12"
                }`}
                style={{ animationDelay: `${index * 200}ms` }}
              >
                <div className={`md:w-1/2 ${index % 2 === 0 ? "md:ml-auto" : "md:mr-auto"}`}>
                  <Card className="bg-card border-border hover:border-primary transition-all">
                    <CardContent className="p-6">
                      <div className="inline-block px-4 py-2 bg-primary/10 rounded-full mb-4">
                        <span className="text-primary font-bold text-lg">{milestone.year}</span>
                      </div>
                      <h3 className="text-2xl font-bold text-foreground mb-2">{milestone.event}</h3>
                      <p className="text-muted-foreground">{milestone.description}</p>
                    </CardContent>
                  </Card>
                </div>

                {/* Timeline Dot */}
                <div className="absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 w-6 h-6 rounded-full bg-primary border-4 border-background hidden md:block" />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="container mx-auto px-4">
        <div className="bg-gradient-to-br from-primary to-primary/80 rounded-2xl p-12 text-center animate-fade-in">
          <h2 className="text-4xl md:text-5xl font-bold text-primary-foreground mb-6">
            Join Our Story
          </h2>
          <p className="text-xl text-primary-foreground/90 mb-8 max-w-2xl mx-auto">
            Let's create something extraordinary together. Contact us to start your next project.
          </p>
          <Button asChild size="lg" variant="secondary" className="bg-background text-foreground hover:bg-background/90 font-semibold text-lg px-12">
            <Link to="/contact">Start Your Project</Link>
          </Button>
        </div>
      </section>
    </div>
  );
};

export default About;
