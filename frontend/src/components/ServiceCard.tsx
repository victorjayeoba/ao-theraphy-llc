import { Button } from "@/components/ui/button";
import { LucideIcon, ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { CheckCircle } from "lucide-react";

interface ServiceCardProps {
  icon: LucideIcon;
  title: string;
  description: string;
  features: string[];
  ctaText: string;
  ctaLink: string;
  image?: string;
  gradient?: boolean;
}

const ServiceCard = ({ 
  icon: Icon, 
  title, 
  description, 
  features, 
  ctaText, 
  ctaLink,
  image,
  gradient = false 
}: ServiceCardProps) => {
  const navigate = useNavigate();

  const handleClick = (e: React.MouseEvent) => {
  e.preventDefault();

  // Replace this with your actual header height in pixels
  const headerHeight = 120; // example: 80px

  if (!ctaLink.startsWith("/")) {
    const section = document.getElementById(ctaLink);
    if (section) {
      const top = section.getBoundingClientRect().top + window.scrollY - headerHeight;
      window.scrollTo({ top, behavior: "smooth" });
    }
  } else {
    // Navigate to external page
    navigate(ctaLink);
  }
};

  return (
    <div data-aos="fade-up" data-aos-duration="700" className={`group relative overflow-hidden rounded-2xl border border-white/20 shadow-lg hover:shadow-2xl transition-all duration-500 h-full ${
      gradient 
        ? 'bg-gradient-to-br from-accent/10 to-accent/5' 
        : 'bg-white/50 backdrop-blur-sm'
    }`}>
      {/* Gradient background overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"></div>

      <div className="relative flex flex-col h-full">
        {/* Image Container */}
        {image && (
          <div className="relative w-full h-56 overflow-hidden bg-gradient-to-br from-accent/20 to-accent/10">
            <img 
              src={image} 
              alt={title}
              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
          </div>
        )}

        {/* Content */}
        <div className="flex-1 flex flex-col p-7">
          {/* Icon Badge */}
          <div className={`w-16 h-16 rounded-xl flex items-center justify-center mb-6 flex-shrink-0 group-hover:scale-110 transition-transform duration-300 ${
            gradient 
              ? 'bg-gradient-to-br from-accent to-accent/70 text-white' 
              : 'bg-gradient-to-br from-accent/20 to-accent/10 text-accent'
          }`}>
            <Icon className="w-8 h-8" />
          </div>

          {/* Title */}
          <h3 className="text-2xl font-bold text-foreground mb-3 group-hover:text-accent transition-colors duration-300">{title}</h3>
          
          {/* Description */}
          <p className="text-muted-foreground mb-6 leading-relaxed text-sm flex-shrink-0">{description}</p>
          
          {/* Features */}
          <ul className="space-y-3 mb-8 flex-1">
            {features.map((feature, index) => (
              <li key={index} className="flex items-start space-x-3 text-sm group/item">
                <CheckCircle className="w-5 h-5 text-accent flex-shrink-0 mt-0.5 group-hover/item:scale-110 transition-transform duration-300" />
                <span className="text-muted-foreground group-hover/item:text-foreground transition-colors duration-300">{feature}</span>
              </li>
            ))}
          </ul>

          {/* CTA Button */}
          <Button
            className="w-full bg-gradient-to-r from-accent to-accent/80 hover:from-accent hover:to-accent text-white font-semibold transition-all duration-300 group/btn overflow-hidden relative"
            onClick={handleClick}
          >
            <span className="relative flex items-center justify-center gap-2">
              {ctaText}
              <ArrowRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform duration-300" />
            </span>
          </Button>
        </div>

      </div>
    </div>
  );
};

export default ServiceCard;
