import { Link } from "react-router-dom";
import { Mail, Phone, MapPin, Heart } from "lucide-react";

const Footer = () => {
  return (

    <footer className="bg-primary text-primary-foreground">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Company Info */}
          <div className="space-y-4">
            <h3 className="text-xl font-bold">A&O Therapy LLC</h3>
            <p className="text-primary-foreground/80 leading-relaxed">
              Empowering neurodiverse lives through specialized sensory processing and traumatic brain injury therapy.
            </p>
            <div className="flex items-center space-x-2 text-primary-foreground/80">
              <Heart size={16} className="text-accent" />
              <span className="text-sm">Licensed in Illinois • Evidence-Based Care • NBCOT Certified Occupational Therapist</span>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h4 className="font-semibold text-lg">Quick Links</h4>
            <div className="flex flex-col space-y-2">
              <Link to="/services" className="text-primary-foreground/80 hover:text-accent transition-colors">
                Our Services
              </Link>
              <Link to="/shop" className="text-primary-foreground/80 hover:text-accent transition-colors">
                Therapeutic Tools
              </Link>
              <Link to="/consultation" className="text-primary-foreground/80 hover:text-accent transition-colors">
                Book Consultation
              </Link>
              <Link to="/presentations" className="text-primary-foreground/80 hover:text-accent transition-colors">
                Presentations
              </Link>
              <Link to="/about" className="text-primary-foreground/80 hover:text-accent transition-colors">
                About Liz Ani, PhD, MOT, OTR/L
              </Link>
            </div>
          </div>

          {/* Services */}
          <div className="space-y-4">
            <h4 className="font-semibold text-lg">Specialties</h4>
            <div className="flex flex-col space-y-2 text-primary-foreground/80">
              <span>Sensory Processing Therapy</span>
              <span>Traumatic Brain Injury Support</span>
              <span>Neurodiverse Treatment</span>
              <span>Virtual Consultations</span>
              <span>Family-Centered Approach</span>
            </div>
          </div>

          {/* Contact */}
          <div className="space-y-4">
            <h4 className="font-semibold text-lg">Contact Us</h4>
            <div className="space-y-3">
              <a 
                href="tel:630-394-0632"
                className="flex items-center space-x-3 text-primary-foreground/80 hover:text-accent transition-colors"
              >
                <Phone size={16} />
                <span>(630) 394-0632</span>
              </a>
              <a
                href="mailto:info@aotherapyllc.com"
                className="flex items-center space-x-3 text-primary-foreground/80 hover:text-accent transition-colors"
              >
                <Mail size={16} />
                <span>info@aotherapyllc.com</span>
              </a>
              <div className="flex items-start space-x-3 text-primary-foreground/80">
                <MapPin size={16} className="mt-1 flex-shrink-0" />
                <span>Illinois licensed OT<br />Virtual & In-Person Sessions</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-primary-foreground/20 mt-12 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <p className="text-primary-foreground/60 text-sm">
              © 2025 A&O Therapy LLC. All rights reserved.
            </p>
            <div className="flex space-x-6 text-sm">
              <Link to="/privacy-policy" className="text-primary-foreground/60 hover:text-accent transition-colors">
                Privacy Policy
              </Link>
              <Link to="/terms" className="text-primary-foreground/60 hover:text-accent transition-colors">
                Terms of Service
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
    
  );
};

export default Footer;