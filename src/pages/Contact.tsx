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

  const [loading, setLoading] = useState(false);



  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/contact/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        toast.success("Thank you! We'll get back to you soon.", {
          description: "Your message has been received successfully.",
        });
        setFormData({ name: "", email: "", phone: "", subject: "", message: "" });
      } else {
        toast.error("Something went wrong. Please try again later.");
      }
    } catch (error) {
      console.error("Error submitting contact form:", error);
      toast.error("Network error. Please check your connection.");
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const contactInfo = [
    {
      icon: Phone,
      title: "Phone",
      details: ["+234 810 123 4567", "+234 803 987 6543"],
      action: "tel:+2348101234567",
    },
    {
      icon: Mail,
      title: "Email",
      details: ["info@lioncage.com", "support@lioncage.com"],
      action: "mailto:info@lioncage.com",
    },
    {
      icon: MapPin,
      title: "Location",
      details: ["Wuse Zone 4", "Abuja, Nigeria"],
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
        {/* Team Section */}
        <section className="mb-20">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Image */}
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

            {/* Text */}
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
                  href="tel:+2348101234567"
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

        {/* Contact Info */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-20">
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
                      placeholder="+234 810 123 4567"
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
                  disabled={loading}
                  className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-semibold text-lg"
                >
                  {loading ? "Sending..." : "Send Message"}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>

        {/* Map */}
        <div className="mt-20">
          <Card className="bg-card border-border overflow-hidden">
            <div className="aspect-[21/9] relative">
              <iframe
                title="Lion Cage Construction Location - Wuse Zone 4, Abuja"
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3969.2768678849917!2d7.484454074994943!3d9.06682589071686!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x104e0a53789e9083%3A0xfec6b1f9e65f70f4!2sWuse%20Zone%204%2C%20Abuja%2C%20Nigeria!5e0!3m2!1sen!2sng!4v1698261234567!5m2!1sen!2sng"
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                className="absolute inset-0 w-full h-full rounded-none"
              ></iframe>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Contact;
