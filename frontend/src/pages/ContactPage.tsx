import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import axios from "axios";
import { useToast } from "@/hooks/use-toast";
import { 
  Mail, 
  Phone, 
  MapPin, 
  Clock, 
  Send,
  MessageCircle,
  Calendar,
  CheckCircle,
  ArrowRight,
  Loader2
} from "lucide-react";

const ContactPage = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "",
    message: "",
    contactPreference: "email"
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const API_URL = `${import.meta.env.VITE_BASE_URL}/api/support/inquiry`;

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      const response = await axios.post(API_URL,   {
        "full_name": formData.name,
        "email": formData.email,
        "phone_number": formData.phone,
        "preferred_contact_method": formData.contactPreference,
        "subject": formData.subject,
        "message": formData.message,
      });

      console.log("Message sent successfully:", response.data);
      
      // Show success toast
      toast({
        title: "Message Sent Successfully!",
        description: "Thank you for contacting us. We'll get back to you within 24 hours.",
      });
      
      // Reset form
      setFormData({
        name: "",
        email: "",
        phone: "",
        subject: "",
        message: "",
        contactPreference: "email"
      });
      
    } catch (error) {
      console.log("Error sending message:", error);
      
      // Show error toast
      toast({
        title: "Failed to Send Message",
        description: "Please try again or contact us directly by phone.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  
  const contactInfo = [
    {
      icon: Phone,
      title: "Phone",
      details: "(630) 394-0632",
      description: "Call during business hours",
      action: "tel:630-394-0632"
    },
    {
      icon: Mail,
      title: "Email", 
      details: "info@aotherapyllc.com",
      description: "We respond within 24 hours",
      action: "mailto:info@aotherapyllc.com"
    },
    {
      icon: MapPin,
      title: "Location",
      details: "Illinois licensed OT",
      description: "Virtual & In-Person Sessions Available",
      action: null
    },
    {
      icon: Clock,
      title: "Hours",
      details: "Mon-Fri: 9AM-5PM",
      description: "Central Time Zone",
      action: null
    }
  ];

  const quickActions = [
    {
      title: "Schedule a Consultation",
      description: "Book your personalized therapy session",
      action: "/consultation",
      icon: Calendar,
      color: "bg-primary"
    },
    {
      title: "Browse Therapeutic Tools",
      description: "Explore our curated product selection", 
      action: "/shop",
      icon: ArrowRight,
      color: "bg-accent"
    },
    {
      title: "Learn About Services",
      description: "Discover our therapy approaches",
      action: "/services", 
      icon: MessageCircle,
      color: "bg-primary/80"
    }
  ];

  const faqs = [
    {
      question: "Do you accept insurance?",
      answer: "We are currently a private pay practice. We can provide documentation for potential reimbursement from your insurance provider."
    },
    {
      question: "What ages do you work with?",
      answer: "We provide services for individuals across the lifespan, from toddlers to adults, with specialization in neurodiverse populations."
    },
    {
      question: "How long are therapy sessions?",
      answer: "Session lengths vary based on individual needs, typically ranging from 45-90 minutes depending on the type of service."
    },
    {
      question: "Do you offer virtual sessions?",
      answer: "Yes! We offer secure, HIPAA-compliant virtual sessions for consultations and certain types of therapy interventions."
    }
  ];

  // Add this inside your component
  const isFormValid = formData.name && formData.email && formData.message;


  return (

    <div className="min-h-screen py-8">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16" data-aos="fade-up">
          <Badge className="bg-accent/10 text-accent mb-4">
            <MessageCircle className="w-3 h-3 mr-1" />
            We're Here to Help
          </Badge>
          <h1 className="text-4xl lg:text-5xl font-bold text-foreground mb-6">
            Contact A&O Therapy
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            Ready to take the next step? Reach out to discuss your needs, ask questions, 
            or schedule a consultation. We're committed to responding promptly and thoughtfully.
          </p>
        </div>

        {/* Quick Actions */}
        <section className="mb-16">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {quickActions.map((action, index) => (
              <Card key={index} className="therapy-card group cursor-pointer" data-aos="fade-up" data-aos-delay={`${index * 100}`}>
                <CardContent className="p-6">
                  <div className="flex items-start gap-4">
                    <div className={`w-12 h-12 ${action.color} rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform`}>
                      <action.icon className="w-6 h-6 text-white" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-foreground group-hover:text-primary transition-colors">
                        {action.title}
                      </h3>
                      <p className="text-sm text-muted-foreground">{action.description}</p>
                      <Button asChild variant="link" className="px-0 mt-2 h-auto">
                        <a href={action.action}>
                          Get Started <ArrowRight className="w-3 h-3 ml-1" />
                        </a>
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Contact Form */}
          <div className="lg:col-span-2" data-aos="fade-right">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Send className="w-5 h-5 text-accent" />
                  Send Us a Message
                </CardTitle>
                <CardDescription>
                  Fill out the form below and we'll get back to you within 24 hours during business days.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium text-foreground mb-2 block">
                        Full Name *
                      </label>
                      <Input
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        placeholder="Your full name"
                        required
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium text-foreground mb-2 block">
                        Email Address *
                      </label>
                      <Input
                        name="email"
                        type="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        placeholder="your@email.com"
                        required
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium text-foreground mb-2 block">
                        Phone Number
                      </label>
                      <Input
                        name="phone"
                        type="tel"
                        value={formData.phone}
                        onChange={handleInputChange}
                        placeholder="(555) 123-4567"
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium text-foreground mb-2 block">
                        Preferred Contact Method
                      </label>
                      <select
                        name="contactPreference"
                        value={formData.contactPreference}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-input rounded-md bg-background text-foreground"
                      >
                        <option value="email">Email</option>
                        <option value="phone">Phone</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="text-sm font-medium text-foreground mb-2 block">
                      Subject
                    </label>
                    <select
                      name="subject"
                      value={formData.subject}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-input rounded-md bg-background text-foreground"
                    >
                      <option value="">Select a topic</option>
                      <option value="consultation">Schedule Consultation</option>
                      <option value="services">Questions About Services</option>
                      <option value="pricing">Pricing Information</option>
                      <option value="insurance">Insurance Questions</option>
                      <option value="speaking">Speaking Engagement</option>
                      <option value="other">Other</option>
                    </select>
                  </div>

                  <div>
                    <label className="text-sm font-medium text-foreground mb-2 block">
                      Message *
                    </label>
                    <Textarea
                      name="message"
                      value={formData.message}
                      onChange={handleInputChange}
                      placeholder="Please tell us about your needs, questions, or how we can help you..."
                      rows={6}
                      required
                    />
                  </div>

                  <Button type="submit" size="lg" className="btn-hero w-full" disabled={!isFormValid || isSubmitting}>
                    {isSubmitting ? (
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    ) : (
                      <Send className="w-4 h-4 mr-2" />
                    )}
                    {isSubmitting ? "Sending..." : "Send Message"}
                  </Button>
                </form>
              </CardContent>
            </Card>

            {/* FAQ Section Below Form */}
            <Card className="mt-8" data-aos="fade-up">
              <CardHeader>
                <CardTitle>Frequently Asked Questions</CardTitle>
                <CardDescription>
                  Find answers to common questions about our services
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {faqs.map((faq, index) => (
                  <div key={index} className="space-y-3">
                    <div className="flex items-start gap-3">
                      <div className="w-6 h-6 rounded-full bg-accent/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                        <span className="text-xs font-bold text-accent">{index + 1}</span>
                      </div>
                      <div className="flex-1">
                        <h4 className="font-semibold text-foreground">{faq.question}</h4>
                        <p className="text-sm text-muted-foreground leading-relaxed mt-1">{faq.answer}</p>
                      </div>
                    </div>
                    {index < faqs.length - 1 && <hr className="border-border" />}
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>

          {/* Contact Information Sidebar */}
          <div className="space-y-8" data-aos="fade-left">
            {/* Contact Info */}
            <Card>
              <CardHeader>
                <CardTitle>Get in Touch</CardTitle>
                <CardDescription>
                  Multiple ways to reach us for your convenience
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {contactInfo.map((info, index) => (
                  <div key={index} className="flex items-start gap-3">
                    <div className="w-10 h-10 bg-accent/10 rounded-lg flex items-center justify-center flex-shrink-0">
                      <info.icon className="w-5 h-5 text-accent" />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-semibold text-foreground">{info.title}</h4>
                      {info.action ? (
                        <a 
                          href={info.action}
                          className="text-primary hover:text-primary/80 transition-colors font-medium"
                        >
                          {info.details}
                        </a>
                      ) : (
                        <p className="text-foreground font-medium">{info.details}</p>
                      )}
                      <p className="text-sm text-muted-foreground">{info.description}</p>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* FAQ */}
            {/* Moved to below the form */}

            {/* Response Promise */}
            <Card className="bg-secondary/50">
              <CardContent className="p-6">
                <div className="text-center">
                  <div className="w-12 h-12 bg-accent rounded-full flex items-center justify-center mx-auto mb-4">
                    <CheckCircle className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="font-semibold text-foreground mb-2">Our Promise</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    We respond to all inquiries within 24 hours during business days. 
                    For urgent matters, please call our phone number directly.
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Location & Service Area */}
        <section className="mt-20 py-16 bg-secondary/30 rounded-2xl" data-aos="fade-up">
          <div className="max-w-4xl mx-auto text-center px-8">
            <h2 className="text-2xl font-bold text-foreground mb-4">
              Service Area & Accessibility
            </h2>
            <p className="text-muted-foreground mb-8 leading-relaxed">
              Based in Illinois, we serve families throughout the state through both in-person and virtual sessions. 
              Our flexible approach ensures that distance doesn't prevent access to quality therapy services.
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="flex items-center justify-center gap-2">
                <MapPin className="w-4 h-4 text-accent" />
                <span className="text-sm font-medium">Illinois licensed OT</span>
              </div>
              <div className="flex items-center justify-center gap-2">
                <MessageCircle className="w-4 h-4 text-accent" />
                <span className="text-sm font-medium">Virtual Sessions Available</span>
              </div>
              <div className="flex items-center justify-center gap-2">
                <Clock className="w-4 h-4 text-accent" />
                <span className="text-sm font-medium">Flexible Scheduling</span>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
    
  );
};

export default ContactPage;