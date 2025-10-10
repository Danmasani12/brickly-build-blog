import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { Mail, Phone, MapPin, Clock } from "lucide-react";
import teamContactImage from "@/assets/team-contact.jpg";

const Contact = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "",
    message: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success("Thank you! We'll get back to you soon.", {
      description: "Your message has been received successfully.",
    });
    setFormData({ name: "", email: "", phone: "", subject: "", message: "" });
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const contactInfo = [
    {
      icon: Phone,
      title: "Phone",
      details: ["+1 (234) 567-890", "+1 (234) 567-891"],
      action: "tel:+1234567890",
    },
    {
      icon: Mail,
      title: "Email",
      details: ["info@lioncage.com", "sales@lioncage.com"],
      action: "mailto:info@lioncage.com",
    },
    {
      icon: MapPin,
      title: "Location",
      details: ["123 Construction Ave", "Building City, BC 12345"],
      action: null,
    },
    {
      icon: Clock,
      title: "Business Hours",
      details: ["Monday - Friday: 8am - 6pm", "Saturday: 9am - 4pm"],
      action: null,
    },
  ];

  return (
    <div className="min-h-screen py-20">
      {/* Hero Section */}
      <section className="container mx-auto px-4 mb-16">
        <div className="text-center max-w-3xl mx-auto animate-fade-in">
          <h1 className="text-5xl md:text-6xl font-bold text-foreground mb-6">
            Get In <span className="text-primary">Touch</span>
          </h1>
          <p className="text-xl text-muted-foreground">
            Have a project in mind? We'd love to hear from you. Send us a message and we'll respond as soon as possible.
          </p>
        </div>
      </section>

      <div className="container mx-auto px-4">
        {/* Team Introduction Section */}
        <section className="mb-20">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Team Image */}
            <div className="animate-slide-up">
              <div className="relative rounded-2xl overflow-hidden shadow-2xl">
                <img 
                  src={teamContactImage} 
                  alt="Lion Cage Construction Team ready to help" 
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-background/80 to-transparent" />
                <div className="absolute bottom-8 left-8 right-8">
                  <h3 className="text-3xl font-bold text-white mb-2">Your Project Partners</h3>
                  <p className="text-white/90 text-lg">Dedicated to bringing your vision to life</p>
                </div>
              </div>
            </div>

            {/* Team Content */}
            <div className="animate-fade-in">
              <div className="inline-block mb-4 px-4 py-2 bg-primary/10 border border-primary/20 rounded-full">
                <span className="text-primary font-semibold text-sm">LET'S CONNECT</span>
              </div>
              <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-6">
                Talk to the Experts Who <span className="text-primary">Deliver</span>
              </h2>
              <p className="text-lg text-muted-foreground mb-6 leading-relaxed">
                Behind every successful project is a team that truly cares. Our experienced professionals are ready to listen, advise, and transform your ideas into reality with precision and passion.
              </p>
              <p className="text-lg text-muted-foreground mb-8 leading-relaxed">
                Whether you're planning a dream home, expanding your business, or renovating a space, we're here to guide you through every decision. Reach out today—let's start building something extraordinary together.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <a 
                  href="tel:+1234567890"
                  className="inline-flex items-center justify-center px-6 py-3 bg-primary text-primary-foreground font-semibold rounded-lg hover:bg-primary/90 transition-colors"
                >
                  <Phone className="w-5 h-5 mr-2" />
                  Call Now
                </a>
                <a 
                  href="mailto:info@lioncage.com"
                  className="inline-flex items-center justify-center px-6 py-3 border-2 border-primary text-primary font-semibold rounded-lg hover:bg-primary hover:text-primary-foreground transition-colors"
                >
                  <Mail className="w-5 h-5 mr-2" />
                  Email Us
                </a>
              </div>
            </div>
          </div>
        </section>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-20">
          {/* Contact Information Cards */}
          {contactInfo.map((info, index) => (
            <Card
              key={index}
              className="bg-card border-border hover:border-primary transition-all duration-300 animate-slide-up"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <CardHeader>
                <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-primary/10 mb-4">
                  <info.icon className="w-7 h-7 text-primary" />
                </div>
                <CardTitle className="text-xl text-foreground">{info.title}</CardTitle>
              </CardHeader>
              <CardContent>
                {info.details.map((detail, idx) => (
                  <p key={idx} className="text-muted-foreground mb-1">
                    {info.action && idx === 0 ? (
                      <a href={info.action} className="hover:text-primary transition-colors">
                        {detail}
                      </a>
                    ) : (
                      detail
                    )}
                  </p>
                ))}
              </CardContent>
            </Card>
          ))}

          {/* Placeholder for 4th card alignment */}
          <div className="hidden lg:block" />
        </div>

        {/* Contact Form */}
        <div className="max-w-4xl mx-auto">
          <Card className="bg-card border-border animate-fade-in">
            <CardHeader>
              <CardTitle className="text-3xl text-foreground text-center">Send Us a Message</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="name" className="text-foreground">
                      Full Name *
                    </Label>
                    <Input
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      required
                      placeholder="John Doe"
                      className="bg-background border-border focus:border-primary"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="email" className="text-foreground">
                      Email Address *
                    </Label>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      placeholder="john@example.com"
                      className="bg-background border-border focus:border-primary"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="phone" className="text-foreground">
                      Phone Number
                    </Label>
                    <Input
                      id="phone"
                      name="phone"
                      type="tel"
                      value={formData.phone}
                      onChange={handleChange}
                      placeholder="+1 (234) 567-890"
                      className="bg-background border-border focus:border-primary"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="subject" className="text-foreground">
                      Subject *
                    </Label>
                    <Input
                      id="subject"
                      name="subject"
                      value={formData.subject}
                      onChange={handleChange}
                      required
                      placeholder="Project Inquiry"
                      className="bg-background border-border focus:border-primary"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="message" className="text-foreground">
                    Your Message *
                  </Label>
                  <Textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    required
                    placeholder="Tell us about your project..."
                    rows={6}
                    className="bg-background border-border focus:border-primary resize-none"
                  />
                </div>

                <Button
                  type="submit"
                  size="lg"
                  className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-semibold text-lg"
                >
                  Send Message
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>

        {/* Map Section (Placeholder) */}
        <div className="mt-20">
          <Card className="bg-card border-border overflow-hidden">
            <div className="aspect-[21/9] bg-muted flex items-center justify-center">
              <div className="text-center">
                <MapPin className="w-16 h-16 text-primary mx-auto mb-4" />
                <p className="text-muted-foreground text-lg">Interactive Map Coming Soon</p>
                <p className="text-muted-foreground text-sm">123 Construction Ave, Building City, BC 12345</p>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Contact;
