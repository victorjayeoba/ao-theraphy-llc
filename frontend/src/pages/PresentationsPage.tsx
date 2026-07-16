import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Calendar, 
  Clock, 
  Users, 
  Video, 
  BookOpen, 
  Award,
  ArrowRight,
  CheckCircle,
  Star
} from "lucide-react";

const PresentationsPage = () => {

  const upcomingWorkshops = [
    {
      id: 1,
      title: "Sensory Processing in the Classroom",
      date: "March 15, 2026",
      time: "2:00 PM - 4:00 PM CT",
      format: "Virtual Workshop",
      price: 85,
      audience: "Educators & Therapists",
      description: "Learn practical strategies for supporting students with sensory processing challenges in educational settings.",
      topics: [
        "Identifying sensory needs in students",
        "Classroom modifications and accommodations",
        "Sensory break strategies", 
        "Collaboration with families and therapists"
      ],
      ceus: 2.0
    },
    {
      id: 2,
      title: "TBI Recovery: A Family-Centered Approach",
      date: "March 28, 2026",
      time: "6:00 PM - 8:00 PM CT",
      format: "Virtual Webinar",
      price: 65,
      audience: "Families & Caregivers",
      description: "Comprehensive guide for families navigating traumatic brain injury recovery and rehabilitation.",
      topics: [
        "Understanding TBI and its effects",
        "Supporting cognitive rehabilitation at home",
        "Communication strategies",
        "Building resilience and hope"
      ],
      ceus: 1.5
    },
    {
      id: 3,
      title: "Advanced Sensory Integration Techniques",
      date: "April 10, 2026",
      time: "9:00 AM - 4:00 PM CT", 
      format: "In-Person Workshop",
      price: 245,
      audience: "Licensed Therapists",
      description: "Hands-on training in advanced sensory integration techniques for experienced occupational therapists.",
      topics: [
        "Advanced assessment techniques",
        "Complex case management",
        "Evidence-based intervention strategies",
        "Treatment planning and goal setting"
      ],
      ceus: 6.0
    }
  ];

  const pastPresentations = [
    {
      title: "Neurodiverse-Friendly Therapy Approaches",
      type: "Conference Presentation"
    },
    {
      title: "Sensory Processing Across the Lifespan",
      type: "Keynote Address"
    },
    {
      title: "Family Engagement in TBI Recovery",
      type: "Workshop Facilitator"
    }
  ];

  const customTraining = [
    {
      title: "School District Training",
      description: "Customized professional development for educational teams focusing on sensory processing support in classrooms.",
      duration: "Half-day or Full-day options",
      audience: "Schools & Districts"
    },
    {
      title: "Healthcare Team Education", 
      description: "Specialized training for healthcare professionals on neurodiverse-friendly approaches to therapy.",
      duration: "2-4 hours",
      audience: "Medical Teams"
    },
    {
      title: "Parent Education Series",
      description: "Multi-session workshop series designed to empower families with knowledge and practical strategies.",
      duration: "4-6 week series",
      audience: "Parents & Caregivers"
    }
  ];

  return (

    <div className="min-h-screen py-8">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <Badge className="bg-accent/10 text-accent mb-4">
            <BookOpen className="w-3 h-3 mr-1" />
            Professional Development & Education
          </Badge>
          <h1 className="text-4xl lg:text-5xl font-bold text-foreground mb-6">
            Presentations & Workshops
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            Empowering professionals, families, and communities with knowledge and practical strategies 
            for supporting neurodiverse individuals through education and training.
          </p>
        </div>

        {/* Upcoming Workshops */}
        <section className="mb-20">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-3xl font-bold text-foreground">Upcoming Workshops</h2>
            <Badge className="bg-primary/10 text-primary">
              <Calendar className="w-3 h-3 mr-1" />
              Registration Open
            </Badge>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-8">
            {upcomingWorkshops.map((workshop, index) => (
              <Card key={workshop.id} className="therapy-card h-full">
                <CardHeader>
                  <div className="flex justify-between items-start mb-2">
                    <Badge variant="outline">{workshop.audience}</Badge>
                    <div className="text-right">
                      <div className="text-2xl font-bold text-primary">${workshop.price}</div>
                      <div className="text-sm text-muted-foreground">{workshop.ceus} CEUs</div>
                    </div>
                  </div>
                  <CardTitle className="text-xl">{workshop.title}</CardTitle>
                  <CardDescription className="space-y-2">
                    <div className="flex items-center gap-2 text-sm">
                      <Calendar className="w-4 h-4" />
                      {workshop.date}
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <Clock className="w-4 h-4" />
                      {workshop.time}
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <Video className="w-4 h-4" />
                      {workshop.format}
                    </div>
                  </CardDescription>
                </CardHeader>
                <CardContent className="flex-1 flex flex-col">
                  <p className="text-muted-foreground mb-4 leading-relaxed">
                    {workshop.description}
                  </p>
                  
                  <div className="mb-6 flex-1">
                    <h4 className="font-semibold text-foreground mb-3">Topics Covered:</h4>
                    <ul className="space-y-2">
                      {workshop.topics.map((topic, topicIndex) => (
                        <li key={topicIndex} className="flex items-start gap-2 text-sm">
                          <CheckCircle className="w-3 h-3 text-accent mt-1 flex-shrink-0" />
                          <span className="text-muted-foreground">{topic}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                  
                  <Button className="btn-accent w-full">
                    Register Now
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* Custom Training Options */}
        <section className="mb-20 py-16 bg-secondary/30 rounded-2xl">
          <div className="max-w-6xl mx-auto px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-foreground mb-4">
                Custom Training Solutions
              </h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Tailored professional development programs designed to meet the specific needs of your organization or team.
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
              {customTraining.map((training, index) => (
                <Card key={index} className="therapy-card text-center">
                  <CardContent className="pt-6">
                    <div className="w-12 h-12 bg-accent/10 rounded-lg flex items-center justify-center mx-auto mb-4">
                      <Users className="w-6 h-6 text-accent" />
                    </div>
                    <h3 className="font-semibold text-foreground mb-2">{training.title}</h3>
                    <p className="text-sm text-muted-foreground mb-4 leading-relaxed">
                      {training.description}
                    </p>
                    <div className="space-y-2 text-xs">
                      <Badge variant="outline">{training.duration}</Badge>
                      <div className="text-muted-foreground">{training.audience}</div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
            
            <div className="text-center">
              <Button size="lg" className="btn-hero">
                Request Custom Training
              </Button>
            </div>
          </div>
        </section>

        {/* Past Presentations & Experience */}
        <section className="mb-20">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
            <div>
              <h2 className="text-3xl font-bold text-foreground mb-6">
                Speaking Experience
              </h2>
              <p className="text-lg text-muted-foreground mb-8 leading-relaxed">
                Dr. Liz Ani regularly presents at professional conferences, workshops, and training events, 
                sharing expertise in sensory processing therapy and traumatic brain injury rehabilitation.
              </p>
              
              <div className="space-y-6">
                {pastPresentations.map((presentation, index) => (
                  <div key={index} className="flex items-start gap-4 p-4 bg-secondary/30 rounded-lg">
                    <div className="w-10 h-10 bg-accent/10 rounded-lg flex items-center justify-center flex-shrink-0">
                      <Award className="w-5 h-5 text-accent" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-foreground">{presentation.title}</h3>
                      <div className="flex items-center gap-2 mt-2">
                        <Badge variant="outline" className="text-xs">{presentation.type}</Badge>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            
            <Card className="bg-gradient-to-br from-primary/10 to-accent/10">
              <CardContent className="p-8">
                <div className="text-center mb-6">
                  <div className="w-16 h-16 bg-accent rounded-full flex items-center justify-center mx-auto mb-4">
                    <Star className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-2xl font-bold text-foreground mb-2">
                    Book Dr. Liz Ani for Your Event
                  </h3>
                  <p className="text-muted-foreground">
                    Professional speaking and training services available for conferences, workshops, and organizational training.
                  </p>
                </div>
                
                <div className="space-y-4 mb-6">
                  <div className="flex items-center gap-3">
                    <CheckCircle className="w-5 h-5 text-accent" />
                    <span className="text-foreground">10+ years of clinical experience</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <CheckCircle className="w-5 h-5 text-accent" />
                    <span className="text-foreground">Evidence-based presentation content</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <CheckCircle className="w-5 h-5 text-accent" />
                    <span className="text-foreground">Interactive and engaging delivery</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <CheckCircle className="w-5 h-5 text-accent" />
                    <span className="text-foreground">Customizable to audience needs</span>
                  </div>
                </div>
                
                <Button className="w-full btn-accent">
                  Inquire About Speaking
                </Button>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* CTA Section */}
        <section className="text-center py-16 bg-gradient-to-r from-primary to-accent rounded-2xl text-white">
          <div className="max-w-3xl mx-auto px-8">
            <h2 className="text-3xl font-bold mb-4">
              Invest in Professional Development
            </h2>
            <p className="text-xl text-white/90 mb-8 leading-relaxed">
              Join hundreds of professionals who have enhanced their skills and knowledge through Dr. Ani's workshops and presentations.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button asChild size="lg" className="bg-white text-primary hover:bg-white/90 font-semibold">
                <a href="#upcoming">View Upcoming Events</a>
              </Button>
              <Button asChild size="lg" variant="outline" className="bg-transpreant border-white text-white hover:bg-white/10">
                <a href="/contact">Request Information</a>
              </Button>
            </div>
          </div>
        </section>
      </div>
    </div>
    
  );
};

export default PresentationsPage;