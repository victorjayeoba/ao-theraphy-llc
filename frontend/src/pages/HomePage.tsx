import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import ServiceCard from "@/components/ServiceCard";
import TypingText from "@/components/TypingText";
import logo from "/lizz.jpg";
import heroBackground from "@/assets/hero-background.jpg";
import certFamousJohns from "/cartificate.jpg";
import ProductCard from "@/components/ProductCard";
import TherapyGallery from "@/components/TherapyGallery";
import { useQuery } from "@tanstack/react-query";
import { useMemo, useState, useEffect } from "react";
import strengthBallGrip from "@/assets/strength-ball-grip.png";
import grabberReacher from "@/assets/grabber-reacher.png";
import foamRoller from "@/assets/foam-roller.png";
import NotFound from "@/assets/undraw_file-search_cbur.svg";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import { 
  Brain, 
  Heart, 
  Users, 
  Video, 
  Star, 
  CheckCircle, 
  ArrowRight,
  Award,
  Clock,
  Shield
} from "lucide-react";

const HomePage = () => {

  const [isMobile, setIsMobile] = useState(false);

  const services = [
    {
      icon: Brain,
      title: "Sensory Processing Therapy",
      description: "Specialized treatment for sensory processing challenges, helping children and adults better integrate sensory information.",
      features: [
        "Individual assessment & treatment plans",
        "Evidence-based therapeutic techniques", 
        "Sensory integration activities",
        "Family education & support"
      ],
      ctaText: "Learn More",
      ctaLink: "/services",
    },
    {
      icon: Heart,
      title: "Traumatic Brain Injury Intervention",
      description: "Focusing on biomechanical and cognitive rehabilitation approaches",
      features: [
        "Biomechanical therapy - functional motor skills training",
        "Cognitive rehabilitation therapy",
        "Trauma therapy: Trauma-Focused Cognitive Behavioral Therapy (TF-CBT)",
        // "Memory & attention strategies",
        // "Neurodiverse-friendly approaches"
      ],
      ctaText: "Get Support",
      ctaLink: "/services",
      gradient: true,
    },
    {
      icon: Video,
      title: "Virtual Consultations",
      description: "Convenient online sessions that bring expert therapy services directly to your home environment.",
      features: [
        "Home virtual assessment",
        "Individualized OT sessions",
        "Family group sessions",
        // "Secure HIPAA-compliant platform",
        // "Home environment assessments",
        // "Real-time family involvement"
      ],
      ctaText: "Book Now",
      ctaLink: "/consultation",
    },
  ];

  const defaultFeaturedProducts = [
    {
      id: "1",
      name: "Strength Ball Grip and Fidgets",
      description: "Perfect for hand strengthening and fidgeting needs. Improves grip strength and provides tactile stimulation.",
      price: 6.99,
      image: strengthBallGrip,
      category: "Sensory Tools",
      rating: 4.8,
      reviewCount: 124,
      inStock: true,
      featured: true,
    },
    {
      id: "6", 
      name: "Grabber Reacher Tool",
      description: "Essential adaptive tool for elderly independence, reaching items without bending or straining.",
      price: 9.99,
      image: grabberReacher,
      category: "Fine Motor",
      rating: 4.9,
      reviewCount: 45,
      inStock: true,
      featured: true,
    },
    {
      id: "12",
      name: "CanDo Premium Foam Roller (Round)",
      description: "Blue Marble EVA Foam Roller for muscle restoration, massage therapy, sport recovery and physical therapy. 6\" x 12\" Round.",
      price: 45.00,
      image: foamRoller,
      category: "Movement Tools", 
      rating: 4.9,
      reviewCount: 203,
      inStock: true,
    },
  ];

  const stats = [
    { icon: Users, value: "1000+", label: "Families Served" },
    { icon: Award, value: "10+", label: "Years Experience" },
    { icon: Clock, value: "95%", label: "Satisfaction Rate" },
    { icon: Shield, value: "Licensed", label: "Illinois Provider" },
  ];

  const API_BASE = `${import.meta.env.VITE_BASE_URL}/api`;

  // Helper: normalize achievement image URL (tries nested shapes and makes absolute)
  const resolveImageUrl = (img: any) => {
    if (!img) return certFamousJohns;
    // If the API returns nested structures, try common places
    const urlCandidate =
      typeof img === 'string'
        ? img
        : img.url ?? img.data?.attributes?.url ?? img.attributes?.image?.data?.attributes?.url ?? null;

    if (!urlCandidate) return certFamousJohns;

    // If already absolute, return as-is
    if (/^https?:\/\//i.test(urlCandidate)) return urlCandidate;

    // Otherwise build an absolute URL relative to API_HOST
    try {
      // Use API_BASE as base for relative paths
      return new URL(urlCandidate, API_BASE).toString();
    } catch {
      return certFamousJohns;
    }
  };

  const fetchProducts = async () => {
    const res = await fetch(`${API_BASE}/products`);
    if (!res.ok) throw new Error(`Failed to fetch products: ${res.status}`);
    const data = await res.json();
    return data;
  };

  const { data: productsData, isLoading: productsLoading, error: productsError } = useQuery({
    queryKey: ['products'],
    queryFn: fetchProducts,
    staleTime: 1000 * 60 * 2,
    retry: 1,
  });

  const productList = useMemo(() => {
    if (!productsData) return [];
    if (Array.isArray(productsData)) return productsData;
    return productsData?.data ?? [];
  }, [productsData]);

  const featuredProducts = useMemo(() => {
    // Prefer explicit `featured` flag, otherwise take first 6
    const featured = productList.filter((p: any) => p.featured || p.featured === true);
    if (featured.length > 0) return featured.slice(0, 3);
    return productList.slice(0, 3);
  }, [productList]);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Add achievements fetch
  const fetchAchievements = async () => {
    const res = await fetch(`${API_BASE}/achievements`);
    if (!res.ok) throw new Error(`Failed to fetch achievements: ${res.status}`);
    const data = await res.json();
    return data;
  };

  const { data: achievementsData, isLoading: achievementsLoading, error: achievementsError } = useQuery({
    queryKey: ['achievements'],
    queryFn: fetchAchievements,
    staleTime: 1000 * 60 * 5, // 5 minutes
    retry: 1,
  });

  // Normalize achievements array
  const achievements = useMemo(() => {
    if (!achievementsData) return [];
    if (Array.isArray(achievementsData)) return achievementsData;
    return achievementsData?.data ?? [];
  }, [achievementsData]);

  return (

    <div className="min-h-screen">
      {/* Hero Section */}
      <section 
        className="relative text-primary-foreground py-20 lg:py-28 overflow-hidden"
        style={{
          backgroundImage: `linear-gradient(rgba(0, 43, 92, 0.85), rgba(0, 168, 168, 0.75)), url(${heroBackground})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat'
        }}
      >
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Hero Content */}
            <div className="space-y-8" data-aos="fade-right" data-aos-duration="900" data-aos-once="true">
              <div className="space-y-4">
                <Badge className="bg-white/20 text-white border-white/30">
                  ✨ Licensed in Illinois • Evidence-Based Care • NBCOT Certified Occupational Therapist
                </Badge>
                <h1 className="text-4xl lg:text-6xl font-bold leading-tight">
                  Empowering <TypingText text="Neurodiverse" speed={80} className="text-accent" /> Lives Through Therapy
                </h1>
                <p className="text-xl text-primary-foreground/90 leading-relaxed">
                  Specialized in all occupational therapy and traumatic brain injury therapy for all ages.
                  Compassionate, holistic, evidence-based treatment that celebrates every individual unique potential.
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-4">
                <Button asChild size="lg" className="btn-hero bg-white text-primary hover:bg-white/90">
                  <a href="/consultation">
                    Book Consultation
                    <ArrowRight className="ml-2 w-5 h-5" />
                  </a>
                </Button>
                <Button asChild variant="outline" size="lg" className="border-white text-white bg-transparent hover:border-white">
                  <a href="/shop">Shop Therapeutic Tools</a>
                </Button>
              </div>

              {/* Key Points */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-8">
                <div className="flex items-center space-x-2">
                  <CheckCircle className="w-5 h-5 text-accent" />
                  <span className="text-sm">Virtual & In-Person</span>
                </div>
                <div className="flex items-center space-x-2">
                  <CheckCircle className="w-5 h-5 text-accent" />
                  <span className="text-sm">Family-Centered</span>
                </div>
                <div className="flex items-center space-x-2">
                  <CheckCircle className="w-5 h-5 text-accent" />
                  <span className="text-sm">Individualized Plans</span>
                </div>
              </div>
            </div>

            {/* Hero Stats */}
            <div className="grid grid-cols-2 gap-6" data-aos="fade-left" data-aos-duration="900" data-aos-once="true">
              {stats.map((stat, index) => (
                <div key={index} className="bg-white/10 backdrop-blur-sm rounded-xl p-6 text-center floating-card">
                  <stat.icon className="w-8 h-8 mx-auto mb-3 text-accent" />
                  <div className="text-2xl font-bold">{stat.value}</div>
                  <div className="text-primary-foreground/80 text-sm">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* About Preview Section */}
      <section className="py-20 bg-secondary/30" data-aos="fade-up" data-aos-duration="800">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="animate-fade-in">
              <div className="rounded-2xl p-1 therapy-card shadow-xl overflow-hidden border border-white/10">
                <div className="bg-gradient-to-br from-white/5 to-white/0 rounded-2xl p-4 lg:p-5">
                  <div className="relative rounded-xl overflow-hidden mb-5 group">
                    <div className="absolute inset-0 bg-gradient-to-br from-accent/0 via-transparent to-accent/10 z-10 pointer-events-none"></div>
                    <img 
                      src={logo} 
                      alt="A&O therapy LLC - Occupational Therapist & Consultant" 
                      className="w-full lg:h-[500px] object-cover object-top hover:scale-110 transition-transform duration-700"
                    />
                  </div>

                  <div className="text-center space-y-2">
                    <h2 className="text-2xl lg:text-3xl font-bold text-foreground">
                      Dr. Liz Ani, PhD
                    </h2>
                    <div className="flex justify-center mb-2">
                      <div className="inline-flex items-center gap-1 bg-accent/10 px-3 py-1 rounded-full">
                        <Star className="w-3 h-3 text-accent" />
                        <span className="text-xs font-semibold text-accent">Award Recipient</span>
                      </div>
                    </div>
                    <div className="text-xs text-muted-foreground font-medium leading-relaxed space-y-1">
                      <div className="flex flex-wrap justify-center gap-2 text-center">
                        <span>PhD in Educational Leadership</span>
                        <span className="hidden sm:inline">•</span>
                        <span>MOT - Masters in OT</span>
                        <span className="hidden sm:inline">•</span>
                        <span>OTR/L - Board Certified</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="space-y-6 animate-slide-in lg:pl-4">
              <div className="space-y-3">
                <div>
                  <h3 className="text-3xl font-bold text-foreground mb-2">Professional Excellence</h3>
                  <div className="h-1 w-12 bg-accent rounded-full"></div>
                </div>
                <p className="text-base text-muted-foreground leading-relaxed">
                  With <span className="font-semibold text-foreground">10+ years</span> of experience in sensory processing and traumatic brain injury therapy, 
                  Dr. Ani provides compassionate, holistic, evidence-based care that empowers neurodiverse individuals and families.
                </p>
                <p className="text-sm text-muted-foreground leading-relaxed italic">
                  Recognized with Top Professional Awards including The Marquis Who's Who Top Professional Recognition for excellence in occupational therapy services.
                </p>
              </div>
              
              <div className="grid grid-cols-1 gap-3">
                <div className="flex items-start space-x-4 p-3 rounded-lg hover:bg-white/20 transition-colors duration-300">
                  <div className="flex-shrink-0">
                    <div className="flex items-center justify-center h-10 w-10 rounded-lg bg-accent/10">
                      <Star className="w-5 h-5 text-accent" />
                    </div>
                  </div>
                  <div className="flex-1">
                    <h4 className="font-semibold text-sm text-foreground">Licensed Professional</h4>
                    <p className="text-muted-foreground text-xs leading-snug">Illinois licensed OT specializing in sensory integration</p>
                  </div>
                </div>

                <div className="flex items-start space-x-4 p-3 rounded-lg hover:bg-white/20 transition-colors duration-300">
                  <div className="flex-shrink-0">
                    <div className="flex items-center justify-center h-10 w-10 rounded-lg bg-accent/10">
                      <Heart className="w-5 h-5 text-accent" />
                    </div>
                  </div>
                  <div className="flex-1">
                    <h4 className="font-semibold text-sm text-foreground">Family-Centered Approach</h4>
                    <p className="text-muted-foreground text-xs leading-snug">Collaborative treatment plans empowering entire families</p>
                  </div>
                </div>

                <div className="flex items-start space-x-4 p-3 rounded-lg hover:bg-white/20 transition-colors duration-300">
                  <div className="flex-shrink-0">
                    <div className="flex items-center justify-center h-10 w-10 rounded-lg bg-accent/10">
                      <Brain className="w-5 h-5 text-accent" />
                    </div>
                  </div>
                  <div className="flex-1">
                    <h4 className="font-semibold text-sm text-foreground">Evidence-Based Methods</h4>
                    <p className="text-muted-foreground text-xs leading-snug">Latest research-backed techniques for optimal outcomes</p>
                  </div>
                </div>
              </div>
              
              <Button asChild className="btn-accent w-full font-semibold h-11">
                <a href="/about">Learn More About Dr. Ani</a>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="py-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-foreground mb-4">
              Specialized Therapy Services
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Comprehensive treatment approaches tailored to meet the unique needs of each individual and family.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {services.map((service, index) => (
              <div key={index} data-aos="fade-up" data-aos-delay={`${index * 100}`}>
                <ServiceCard {...service} />
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 bg-secondary/30">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-foreground mb-4">
              Featured Therapeutic Tools
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Professional-grade tools and resources to support therapy goals at home and in clinical settings.
            </p>
          </div>
          
          {/* Center the product grid: use parent flex + inline-grid so the grid shrinks to content and centers */}
          {isMobile ? (
            <div className="mb-12">
              <Swiper
                modules={[Navigation]}
                spaceBetween={10}
                slidesPerView={1}
                navigation
                className="products-swiper"
              >
                {featuredProducts.map((product, index) => (
                  <SwiperSlide key={index}>
                    <div data-aos="fade-up" data-aos-delay={`${index * 100}`}>
                      <ProductCard {...product} />
                    </div>
                  </SwiperSlide>
                ))} 
              </Swiper>
            </div>
          ) : (
            <div className="flex justify-center mb-12">
              <div className="inline-grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {featuredProducts.map((product, index) => (
                  <div key={index} data-aos="fade-up" data-aos-delay={`${index * 100}`}>
                    <ProductCard {...product} />
                  </div>
                ))} 
              </div>
            </div>
          )}
          
          <div className="text-center">
            <Button asChild size="lg" className="btn-accent">
              <a href="/shop">
                View All Products
                <ArrowRight className="ml-2 w-5 h-5" />
              </a>
            </Button>
          </div>
        </div>
      </section>

      {/* Awards & Certifications Section */}
      <section className="py-20 bg-white">
  <div
    className={`container mx-auto sm:px-4 ${
      achievements?.length === 2 ? "lg:px-[250px]" : "lg:px-8"
    }`}
  >
    {/* Heading */}
    <div className="text-center mb-16" data-aos="fade-up" data-aos-duration="800">
      <h2 className="text-3xl lg:text-4xl font-bold text-foreground mb-4">
        Professional Recognition & Credentials
      </h2>
      <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
        Trusted expertise backed by professional certifications and recognition
        in occupational therapy.
      </p>
    </div>

    {/* Loading State */}
    {achievementsLoading ? (
      <div className="flex justify-center items-center py-12">
        <div className="text-muted-foreground">Loading achievements...</div>
      </div>
    ) : achievementsError ? (
      <div className="text-center text-red-500 py-8">
        Failed to load achievements. Showing featured items instead.
      </div>
    ) : (
      <div
        className={`grid grid-cols-1 ${
          achievements?.length === 1
            ? "md:grid-cols-1"
            : achievements?.length === 2
            ? "md:grid-cols-2"
            : "md:grid-cols-3"
        } gap-8 justify-items-center`}
      >
        {/* If API has achievements */}
        {achievements.length > 0 ? (
          achievements.map((ach: any, index: number) => (
            <div
              key={ach.id ?? index}
              className="rounded-xl overflow-hidden p-4 therapy-card flex flex-col max-w-[420px] w-full"
            >
              <h3 className="text-sm font-semibold text-center pb-5 text-foreground mb-1">
                {ach.title}
              </h3>

              <div className="aspect-[4/3] w-full mb-4 bg-background rounded-md overflow-hidden flex items-center justify-center">
                <img
                  src={resolveImageUrl(ach.picture)}
                  alt={ach.title || `Achievement ${index + 1}`}
                  className="object-contain w-full h-full"
                />
              </div>
            </div>
          ))
        ) : (
          <div className="col-span-full flex flex-col items-center justify-center py-12">
            {/* FALLBACK CERTIFICATES */}
            <div className="flex justify-center">
                  <img src={NotFound} className="h-[200px] w-[200px]" alt="" />
            </div>

           <p className=" text-gray-500 py-4 text-center">No award found</p>
          </div>
        )}
      </div>
    )}

    {/* Button */}
    <div className="mt-12 text-center">
      <Button asChild size="lg" className="btn-accent">
        <a href="/about">
          Learn More About Dr. Ani
          <ArrowRight className="ml-2 w-5 h-5" />
        </a>
      </Button>
    </div>
  </div>
      </section>

      {/* Therapy Gallery Section */}
      <TherapyGallery />

      {/* ...rest of page... */}

       <div className="container mx-auto px-4 sm:px-6 lg:px-8 mb-10">
         {/* CTA Section */}
        <section className="text-center py-16 bg-gradient-to-r from-primary to-accent rounded-2xl text-white">
          <div className="max-w-3xl mx-auto px-8">
            <h2 className="text-3xl font-bold mb-4">
              Ready to Begin Your Therapy Journey?
            </h2>
            <p className="text-xl text-white/90 mb-8 leading-relaxed">
              Schedule a consultation to discuss your specific needs and develop
              a personalized holistic treatment plan that supports your goals
              and celebrates your unique potential.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                asChild
                size="lg"
                className="bg-white text-primary hover:bg-white/90 font-semibold"
              >
                <a href="/consultation">Schedule Consultation</a>
              </Button>
              <Button
                asChild
                size="lg"
                variant="outline"
                className="border-white text-white bg-transparent hover:bg-white/10"
              >
                <a href="/about">Learn About Dr. Ani</a>
              </Button>
            </div>
          </div>
        </section>
       </div>
    </div>

  );
};

export default HomePage;