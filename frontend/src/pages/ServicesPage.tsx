import ServiceCard from "@/components/ServiceCard";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Brain,
  Heart,
  Users,
  Video,
  CheckCircle,
  ArrowRight,
  Zap,
  Target,
  Lightbulb,
  Shield,
} from "lucide-react";

const ServicesPage = () => {

  

  const mainServices = [
    {
      id:"Sensory",
      icon: Brain,
      title: "Sensory Processing Therapy",
      description:
        "Specialized treatment for sensory processing challenges, helping children and adults better integrate sensory information.",
      features: [
        "Individual assessment & treatment plans",
        "Holistic evidence-based therapeutic techniques",
        "Sensory integration activities",
        "Holistic family education & support",
      ],
      ctaText: "Learn More",
      ctaLink: "sensory-details",
    },
    {
      icon: Heart,
      title: "Traumatic Brain Injury Intervention",
      description:
        "Focusing on biomechanical and cognitive rehabilitation approaches",
      features: [
        "Biomechanical therapy - functional motor skills training",
        "Cognitive rehabilitation therapy",
        "Trauma therapy: Trauma-Focused Cognitive Behavioral Therapy (TF-CBT)",
        // "Memory & attention strategies",
        // "Neurodiverse-friendly approaches"
      ],
      ctaText: "Learn More",
      ctaLink: "tbi-details",
      gradient: true,
    },
    {
      icon: Video,
      title: "Virtual Consultations",
      description:
        "Convenient online sessions that bring expert therapy services directly to your home environment.",
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

  const approaches = [
    {
      icon: Target,
      title: "Holistic Evidence-Based Treatment",
      description:
        "All interventions are grounded in the latest research and proven holistic therapeutic methods for optimal outcomes.",
    },
    {
      icon: Users,
      title: "Holistic Family-Centered Care",
      description:
        "Collaborative holistic approach that involves and empowers families as active participants in the therapeutic process.",
    },
    {
      icon: Lightbulb,
      title: "Individualized Holistic Plans",
      description:
        "Every treatment plan is uniquely designed to meet specific needs, goals, and preferences of each client with a holistic approach.",
    },
    {
      icon: Shield,
      title: "Safe & Supportive Environment",
      description:
        "Therapeutic setting that promotes trust, comfort, and positive therapeutic relationships in a holistic manner.",
    },
  ];

  const processSteps = [
    {
      step: "01",
      title: "Initial Consultation",
      description:
        "Comprehensive assessment to understand needs, challenges, and goals. Discussion of medical history and current concerns.",
    },
    {
      step: "02",
      title: "Detailed Evaluation",
      description:
        "In-depth evaluation using standardized assessments and observational tools to identify specific areas for intervention.",
    },
    {
      step: "03",
      title: "Treatment Planning",
      description:
        "Development of individualized treatment plan with specific, measurable goals and evidence-based intervention strategies.",
    },
    {
      step: "04",
      title: "Active Treatment",
      description:
        "Implementation of therapeutic interventions through regular sessions, with ongoing monitoring and plan adjustments.",
    },
    {
      step: "05",
      title: "Progress Review",
      description:
        "Regular assessment of progress towards goals, plan modifications as needed, and transition planning when appropriate.",
    },
  ];

  

  return (

    <div className="min-h-screen py-8">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16" data-aos="fade-up">
          <Badge className="bg-accent/10 text-accent mb-4">
            Illinois licensed OT • Holistic Evidence-Based Care
          </Badge>
          <h1 className="text-4xl lg:text-5xl font-bold text-foreground mb-6">
            Specialized Therapy Services
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            Comprehensive, compassionate holistic care for sensory processing
            challenges and traumatic brain injury recovery. Every treatment plan
            is individualized to celebrate and support each person's unique
            potential.
          </p>
        </div>

        {/* Areas of Specialization */}
        <section className="mb-20" data-aos="fade-up">
          <div className="max-w-5xl mx-auto px-2 sm:px-4">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-foreground mb-4">
                Areas of Specialization
              </h2>
              <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
                Our occupational therapy consultant specializes in a broad range
                of conditions, providing holistic, individualized care for each.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {[
                "Sensory Processing Disorders",
                "Traumatic Brain Injury (TBI)",
                "Neurological Disorders (ADHD & Autism Spectrum Disorder)",
                "Developmental Delays",
                "Orthopedic-related issues",
                "Socio-Emotional & Cognitive Disorders",
              ].map((area, index) => (
                <div
                  key={index}
                  className="flex items-start gap-3 p-4 rounded-lg bg-secondary/30 border border-white/10"
                  data-aos="fade-up"
                  data-aos-delay={`${(index % 3) * 100}`}
                >
                  <CheckCircle className="w-5 h-5 text-accent flex-shrink-0 mt-0.5" />
                  <span className="text-foreground font-medium">{area}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Main Services */}
        <section className="mb-20">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {mainServices.map((service, index) => (
              <div
                key={index}
                data-aos="fade-up"
                data-aos-delay={`${index * 100}`}
              >
                <ServiceCard {...service} />
              </div>
            ))}
          </div>
        </section>

        {/* Treatment Approach */}
        <section className="mb-20 py-16 bg-secondary/30 rounded-2xl">
          <div className="max-w-6xl mx-auto px-8">
            <div className="text-center mb-12" data-aos="fade-up">
              <h2 className="text-3xl font-bold text-foreground mb-4">
                Our Treatment Approach
              </h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                A holistic, evidence-based methodology that puts individuals and
                families at the center of the therapeutic process.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {approaches.map((approach, index) => (
                <Card key={index} className="therapy-card text-center" data-aos="fade-up" data-aos-delay={`${index * 100}`}>
                  <CardContent className="pt-6">
                    <div className="w-12 h-12 bg-accent/10 rounded-lg flex items-center justify-center mx-auto mb-4">
                      <approach.icon className="w-6 h-6 text-accent" />
                    </div>
                    <h3 className="font-semibold text-foreground mb-2">
                      {approach.title}
                    </h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      {approach.description}
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Process Steps */}
        <section className="mb-20">
          <div className="text-center mb-12" data-aos="fade-up">
            <h2 className="text-3xl font-bold text-foreground mb-4">
              The Therapy Process
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              A clear, structured pathway from initial consultation to achieving
              your therapeutic goals.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6">
            {processSteps.map((step, index) => (
              <Card key={index} className="relative therapy-card" data-aos="fade-up" data-aos-delay={`${index * 100}`}>
                <CardContent className="pt-6">
                  <div className="text-center mb-4">
                    <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center mx-auto mb-3">
                      <span className="text-white font-bold">{step.step}</span>
                    </div>
                    <h3 className="font-semibold text-foreground mb-2">
                      {step.title}
                    </h3>
                  </div>
                  <p className="text-sm text-muted-foreground leading-relaxed text-center">
                    {step.description}
                  </p>
                </CardContent>
                {index < processSteps.length - 1 && (
                  <div className="hidden xl:block absolute top-1/2 -right-3 transform -translate-y-1/2">
                    <ArrowRight className="w-6 h-6 text-accent" />
                  </div>
                )}
              </Card>
            ))}
          </div>
        </section>

        {/* Detailed Service Sections */}
        <section className="space-y-20 mb-20">
          {/* Sensory Processing Details */}
          <div
            id="sensory-details"
            className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center"
          >
            <div className="space-y-6">
              <div>
                <Badge className="bg-accent/10 text-accent mb-4">
                  <Zap className="w-3 h-3 mr-1" />
                  Sensory Integration Specialist
                </Badge>
                <h2 className="text-3xl font-bold text-foreground mb-4">
                  Sensory Processing Therapy
                </h2>
                <p className="text-lg text-muted-foreground leading-relaxed">
                  Specialized holistic treatment for individuals who struggle
                  with processing sensory information from their environment.
                  Our holistic approach helps develop better sensory integration
                  skills for improved daily functioning.
                </p>
              </div>

              <div className="space-y-4">
                <h3 className="text-xl font-semibold text-foreground">
                  Who Can Benefit:
                </h3>
                <div className="grid grid-cols-1 gap-3">
                  {[
                    "Individuals with autism spectrum disorders",
                    "Individuals with ADHD or attention challenges",
                    "Individuals with sensory processing disorders",
                    "Individuals experiencing sensory defensiveness",
                    "Individuals seeking sensory regulation strategies",
                  ].map((item, index) => (
                    <div key={index} className="flex items-center gap-3">
                      <CheckCircle className="w-4 h-4 text-accent" />
                      <span className="text-muted-foreground">{item}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <Card className="bg-gradient-to-br from-accent/10 to-primary/10">
              <CardContent className="p-8">
                <h3 className="text-xl font-semibold text-foreground mb-6">
                  Treatment Components
                </h3>
                <div className="space-y-4">
                  {[
                    "Sensory assessment and profiling",
                    "Therapeutic sensory activities",
                    "Environmental modifications",
                    "Sensory diet development",
                    "Family education and training",
                    "Progress monitoring and adjustment",
                  ].map((component, index) => (
                    <div key={index} className="flex items-start gap-3">
                      <div className="w-6 h-6 bg-accent rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                        <CheckCircle className="w-3 h-3 text-white" />
                      </div>
                      <span className="text-foreground">{component}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* TBI Support Details */}
          <div
            id="tbi-details"
            className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center"
          >
            <Card className="bg-gradient-to-br from-primary/10 to-accent/10 order-2 lg:order-1">
              <CardContent className="p-8">
                <h3 className="text-xl font-semibold text-foreground mb-6">
                  Rehabilitation Focus Areas
                </h3>
                <div className="space-y-4">
                  {[
                    "Biomechanical therapy - functional motor skills training",
                    "Cognitive function restoration",
                    "Memory and attention training",
                    "Executive function development",
                    "Adaptive strategy training",
                    "Functional skill building",
                    "Community reintegration support",
                  ].map((area, index) => (
                    <div key={index} className="flex items-start gap-3">
                      <div className="w-6 h-6 bg-primary rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                        <CheckCircle className="w-3 h-3 text-white" />
                      </div>
                      <span className="text-foreground">{area}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <div className="space-y-6 order-1 lg:order-2">
              <div>
                <Badge className="bg-primary/10 text-primary mb-4">
                  <Heart className="w-3 h-3 mr-1" />
                  TBI Rehabilitation Specialist
                </Badge>
                <h2 className="text-3xl font-bold text-foreground mb-4">
                  Traumatic Brain Injury Intervention
                </h2>
                <p className="text-lg text-muted-foreground leading-relaxed">
                  Comprehensive holistic rehabilitation services for individuals
                  recovering from traumatic brain injury. Our holistic
                  neurodiverse-friendly approach focuses on rebuilding cognitive
                  function and adaptive skills.
                </p>
              </div>

              <div className="space-y-4">
                <h3 className="text-xl font-semibold text-foreground">
                  Conditions We Treat:
                </h3>
                <div className="grid grid-cols-1 gap-3">
                  {[
                    "Mild to moderate traumatic brain injury",
                    "Post-concussion syndrome",
                    "Cognitive processing challenges",
                    "Executive function deficits",
                    "Memory and attention difficulties",
                  ].map((condition, index) => (
                    <div key={index} className="flex items-center gap-3">
                      <CheckCircle className="w-4 h-4 text-primary" />
                      <span className="text-muted-foreground">{condition}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
          
          {/* Environmental Modification */}
          <div className="py-16 bg-secondary/30 rounded-2xl">
            <div className="max-w-4xl mx-auto px-8">
              <div className="text-center mb-8">
                <Badge className="bg-accent/10 text-accent mb-4">
                  <Target className="w-3 h-3 mr-1" />
                  Workplace Specialist
                </Badge>
                <h2 className="text-3xl font-bold text-foreground mb-4">
                  Environmental Modification
                </h2>
                <p className="text-lg text-muted-foreground leading-relaxed">
                  Specializes in making changes to a person's work environment to improve motor functional performance and safety workplace.
                </p>
              </div>
              
              <Card className="therapy-card">
                <CardContent className="p-8">
                  <h3 className="text-xl font-semibold text-foreground mb-6">Services Include:</h3>
                  <div className="space-y-4">
                    {[
                      "Work environment assessment and modifications",
                      "Ergonomic workplace evaluations",
                      "Work Compensation and adaptation for work related injuries",
                      "Functional performance improvement strategies",
                      "Safety workplace enhancements",
                      "Adaptive equipment recommendations"
                    ].map((service, index) => (
                      <div key={index} className="flex items-start gap-3">
                        <div className="w-6 h-6 bg-accent rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                          <CheckCircle className="w-3 h-3 text-white" />
                        </div>
                        <span className="text-muted-foreground">{service}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        <section className="py-10 px-6 bg-white">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">
              Environmental Modification
            </h2>
            <ul className="list-disc list-inside text-gray-700 space-y-2">
              <li>
                Specializes in making changes to a person's work environment to
                improve{" "}
                <span className="font-medium">
                  motor functional performance
                </span>{" "}
                and <span className="font-medium">workplace safety</span>.
              </li>
              <li>
                Provides{" "}
                <span className="font-medium">
                  work compensation and adaptation
                </span>{" "}
                services for individuals with{" "}
                <span className="font-medium">work-related injuries</span>.
              </li>
            </ul>
          </div>
        </section>

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

export default ServicesPage;
