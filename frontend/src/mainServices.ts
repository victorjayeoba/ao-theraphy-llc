import { Brain, Heart, Video } from "lucide-react";

const mainServices = [
    {
      icon: Brain,
      title: "Sensory Processing Therapy",
      description: "Comprehensive sensory integration therapy designed to help individuals better process and respond to sensory information in their environment.",
      features: [
        "Detailed sensory assessment & evaluation",
        "Customized sensory diet programs", 
        "Environmental modification strategies",
        "Sensory integration activities & exercises",
        "Family education & home programs",
        "Progress monitoring & adjustments"
      ],
      ctaText: "Learn More",
      ctaLink: "#sensory-details",
    },
    {
      icon: Heart,
      title: "Traumatic Brain Injury Support",
      description: "Specialized neurodiverse treatment focusing on cognitive rehabilitation, functional improvement, and adaptive strategies for daily living.",
      features: [
        "Cognitive rehabilitation therapy",
        "Memory & attention training",
        "Executive function strategies",
        "Functional skills development",
        "Compensatory technique training",
        "Neurodiverse-friendly approaches"
      ],
      ctaText: "Get Support",
      ctaLink: "#tbi-details",
      gradient: true,
    },
    {
      icon: Video,
      title: "Virtual Therapy Sessions",
      description: "Convenient, effective online therapy sessions that bring professional care directly to your comfortable home environment.",
      features: [
        "HIPAA-compliant secure platform",
        "Flexible scheduling options",
        "Real-time family involvement",
        "Digital resource sharing",
        "Home environment assessments",
      ],
      ctaText: "Book Virtual Session",
      ctaLink: "/consultation",
    },
  ];

export default mainServices;
