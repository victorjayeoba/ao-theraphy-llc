import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
// import logo from "/ani.jpg";
import logo from "/lizz.jpg";
import { 
  Award,
  GraduationCap, 
  Heart,
  Users,
  Star,
  Calendar,
  CheckCircle,
  ArrowRight,
  Target,
  Lightbulb,
  ChevronLeft,
  ChevronRight
} from "lucide-react";
import { Carousel } from "@/components/ui/carousel";
import { ImageGallery } from "@/components/ui/image-gallery";
import educationImg from "@/assets/sch_1.jpg"
import licenseImg from "@/assets/sch_2.jpg"
import certificateImg from "/nbcot.png"

interface GalleryItem {
  type: 'award' | 'speaking' | 'certificate' | 'recognition';
  title: string;
  date: string;
  image: string;
  description: string;
}

const galleryItems: GalleryItem[] = [
  {
    type: 'award',
    title: 'Omega Nu Lambda National Honor Society',
    date: 'September 20, 2023',
    image: '/omega-nu-lambda.jpg',
    description: 'Member of National Honor Society for Online Students, National University Phi Chapter'
  },
  {
    type: 'award',
    title: 'Marquis Who Achievement Award',
    date: '2023-2024',
    image: '/awards/marquis-award.jpg',
    description: 'Albert Nelson Marquis Lifetime Achievement Award for outstanding contributions to occupational therapy'
  },
  {
    type: 'certificate',
    title: 'University of Chicago Medicine CE Program',
    date: 'June 7-9, 2016',
    image: '/uchicago-ce.jpg',
    description: '22nd Annual Primary Care Orthopaedics Program - 23.25 contact hours awarded'
  },
  {
    type: 'award',
    title: 'NBCOT Certification',
    date: 'Current',
    image: '/awards/nbcot-cert.jpg',
    description: 'National Board Certification in Occupational Therapy'
  }
];

const AboutPage = () => {
  
  const credentials = [
    {
      img:educationImg,
      title: "PhD – Doctor of Philosophy in Educational Leadership",
      institution: "National University, San Diego, CA", // Update when details provided
      year: "2024",
      type: "Education",
      highlight: true // Added highlight flag
    },
    {
      img:licenseImg,
      title: "Masters of Occupational Therapy",
      institution: "Governors State University, IL",
      year: "05/2011",
      type: "Education"
    },
    // {
    //   title: "National Board for Certification in Occupational Therapy (NBCOT)",
    //   institution: "University of Chicago Medicine",
    //   year: "2014",
    //   type: "Education",
    //   highlight: true
    // },
    {
      img:certificateImg,
      title: "National Board for Certification in Occupational Therapy (NBCOT)",
      institution: "Pediatric Occupational Therapist specializing in sensory processing disorders and Traumatic Brain Injuries",
      year: "Current",
      type: "License"
    },
    // {
    //   title: "Sensory Integration Certified",
    //   institution: "Sensory Integration International",
    //   year: "2015",
    //   type: "Certification",
    //   highlight: true
    // },
    // {
    //   title: "Traumatic Brain Injury Specialist",
    //   institution: "Brain Injury Association of America",
    //   year: "2017",
    //   type: "Certification",
    //   highlight: true
    // }
  ];

  const experience = [
    {
      role: "Adjunct Professor / Fieldwork Coordinator / Lecturer",
      organization: "Lewis University",
      period: "Current",
      description: "Adjunct professor and fieldwork coordinator — lecturing and coordinating clinical fieldwork placements for occupational therapy students."
    },
    {
      role: "Founder & Lead Therapist",
      organization: "A&O Therapy LLC",
      period: "2020 - Present",
      description: "Established private practice specializing in sensory processing and traumatic brain injury therapy. Created comprehensive Student Mentorship Program partnering with local universities to provide clinical training opportunities for OT students. Serves as Clinical and School-based occupational therapist for multiple school districts and Rehabilitation Centers in Illinois."
    },
    {
      role: "Occupational Therapy Supervisor",
      organization: "Chicago Children's Rehabilitation Center",
      period: "2016 - 2020",
      description: "Led sensory integration program serving children with autism, ADHD, sensory processing disorders, mild to severe/complex medical/orthopedic issues, and developmental delays in rehabilitation settings."
    },
    {
      role: "Occupational Therapist",
      organization: "St. Charles School District",
      period: "(2016 - 2023)", 
      description: "Provided comprehensive occupational therapy services in educational settings and home modifications for students with parental consent."
    }
  ];

  const values = [
    {
      icon: Heart,
      title: "Compassionate Care",
      description: "Every individual deserves to be treated with dignity, respect, and genuine understanding of their unique journey."
    },
    {
      icon: Users,
      title: "Family Partnership", 
      description: "Families are the most important part of the therapy team. Success comes through collaboration and shared goals."
    },
    {
      icon: Target,
      title: "Evidence-Based Practice",
      description: "Treatment decisions are grounded in the latest research and proven therapeutic methods for optimal outcomes."
    },
    {
      icon: Lightbulb,
      title: "Celebrating Uniqueness",
      description: "Neurodiversity is a strength. Therapy should honor and support each person's individual way of experiencing the world."
    },
    {
      icon: Users,
      title: "Team Collaboration",
      description: "Team collaboration involving Occupational Therapists, Physical Therapists, and Speech Therapists to ensure utmost care for our patients is guaranteed to the fullest extent."
    }
  ];

  const achievements = [
    { number: "1000+", label: "Families Served" },
    { number: "10+", label: "Years Experience" },
    { number: "95%", label: "Client Satisfaction" },
    { number: "200+", label: "Professional Training" }
  ];

  // Update the awards array with new recognitions
  const awards = [
    {
      title: "Omega Nu Lambda National Honor Society Member",
      organization: "National University, Phi Chapter",
      year: "2023",
      highlight: true
    },
    { 
      title: "National Board Certification in Occupational Therapy",
      organization: "NBCOT",
      year: "Current",
      highlight: true
    },
    {
      title: "Albert Nelson Marquis Lifetime Achievement Award",
      organization: "Marquis Who's Who",
      year: "2023"
    },
    {
      title: "Who's Who Professional Certificate",
      organization: "Marquis Who's Who",
      year: "2023-2024"
    },
    {
      title: "University of Chicago Medicine Continuing Education",
      organization: "Primary Care Orthopaedics Program",
      year: "2016",
      details: "23.25 contact hours awarded"
    },
    {
      title: "Excellence in Occupational Therapy",
      organization: "Illinois Occupational Therapy Association",
      year: "2022"
    }
  ];

  // Add new memberships section
  const memberships = [
    {
      organization: "American Occupational Therapy Association",
      role: "Member",
      status: "Active"
    },
    {
      organization: "Illinois Occupational Therapy Association",
      role: "Member",
      status: "Active"
    },
    {
      organization: "Brain Injury Association of America",
      role: "Member",
      status: "Active"
    }
  ];

  return (

    <div className="min-h-screen py-8">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header Section */}
        <div className="text-center mb-16">
          <Badge className="bg-accent/10 text-accent mb-4">
            <Award className="w-3 h-3 mr-1" />
            Licensed Occupational Therapist
          </Badge>
          <h1 className="text-4xl lg:text-5xl font-bold text-foreground mb-6">
            A&O Therapy LLC
          </h1>
          {/* <p className="text-lg text-muted-foreground mb-2 font-medium">
            PhD – Doctor of Philosophy in Education | MOT, OTR/L
          </p> */}
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            Dedicated to empowering neurodiverse individuals and families through compassionate,
            evidence-based occupational therapy specializing in sensory processing and traumatic brain injury support.
          </p>
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto leading-relaxed mt-4">
            Team collaboration involving Occupational Therapists, Physical Therapists, and Speech Therapists to ensure utmost care for our patients is guaranteed to the fullest extent.
          </p>
        </div>

        {/* Hero Section with Photo and Stats */}
        <section className="mb-20">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Professional Logo */}
            <div className="animate-fade-in">
              <div className="rounded-2xl p-1 therapy-card shadow-xl overflow-hidden border border-white/10">
                <div className="bg-gradient-to-br from-white/5 to-white/0 rounded-2xl p-4 lg:p-5">
                  <div className="relative rounded-xl overflow-hidden mb-5 group">
                    <div className="absolute inset-0 bg-gradient-to-br from-accent/0 via-transparent to-accent/10 z-10 pointer-events-none"></div>
                    <img 
                      src={logo} 
                      alt="A&O Therapy LLC - Occupational Therapist & Consultant" 
                      className="w-full lg:h-[500px] object-cover object-top hover:scale-110 transition-transform duration-700"
                    />
                  </div>

                  <div className="text-center space-y-3">
                    <h2 className="text-2xl lg:text-3xl font-bold text-foreground">
                      Dr. Liz Ani, PhD
                    </h2>
                    <div className="flex justify-center mb-2">
                      <div className="inline-flex items-center gap-1 bg-accent/10 px-3 py-1 rounded-full">
                        <Award className="w-3 h-3 text-accent" />
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

            {/* Stats and Quick Info */}
            <div className="space-y-8 animate-slide-in lg:pl-4">
              <div>
                <h2 className="text-3xl font-bold text-foreground mb-2">
                  A Passion for Empowering Lives
                </h2>
                <div className="h-1 w-12 bg-accent rounded-full mb-4"></div>
                <p className="text-base text-muted-foreground leading-relaxed mb-4">
                  With <span className="font-semibold text-foreground">10+ years</span> of experience in occupational therapy, Dr. Ani has dedicated her career 
                  to supporting individuals with sensory processing challenges and traumatic brain injuries.
                </p>
                <p className="text-sm text-muted-foreground leading-relaxed italic mb-6">
                  Recipient of Top Professional Awards and Who's Who Top Professional Recognition for excellence in occupational therapy services.
                </p>
                <div className="grid grid-cols-2 gap-4">
                  {achievements.map((achievement, index) => (
                    <div key={index} className="p-4 bg-white/50 rounded-lg hover:bg-white/70 transition-colors duration-300 border border-white/10">
                      <div className="text-2xl font-bold text-accent">{achievement.number}</div>
                      {/* <div className="text-xs font-semibold text-muted-foreground mt-1ry">{achievement.number}</div> */}
                      <div className="text-sm text-muted-foreground">{achievement.label}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
          
        </section>
        

        {/* Personal Story */}
        <section className="mb-20 py-16" data-aos="fade-up">
          <div className="text-center mb-16">
            <h2 className="text-4xl lg:text-5xl font-bold text-foreground mb-4">My Journey Into Therapy</h2>
            <div className="flex justify-center mb-4">
              <div className="h-1 w-20 bg-accent rounded-full"></div>
            </div>
            <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
              The path that led me to establish A&O Therapy and my mission to empower neurodiverse communities
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Stage 1: The Beginning */}
            <div data-aos="fade-up" data-aos-delay="100" className="group">
              <div className="relative">
                <div className="absolute -top-8 left-0 right-0 flex justify-center">
                  <div className="w-16 h-16 rounded-full bg-gradient-to-br from-accent/20 to-accent/10 flex items-center justify-center border-4 border-white shadow-lg">
                    <span className="text-2xl font-bold text-accent">1</span>
                  </div>
                </div>
                <Card className="therapy-card hover:shadow-lg transition-all duration-300 mt-6 h-full">
                  <CardContent className="p-6 pt-8">
                    <h3 className="text-xl font-bold text-foreground mb-4 text-center">The Beginning</h3>
                    <p className="text-muted-foreground text-sm leading-relaxed">
                      My passion for occupational therapy began during my undergraduate studies when I volunteered at a local children's hospital. Witnessing the profound impact that skilled compassionate occupational therapy could have on every child's developmental milestones and their family's hope inspired me to pursue this calling.
                    </p>
                  </CardContent>
                </Card>
              </div>
            </div>

            {/* Stage 2: Learning & Growth */}
            <div data-aos="fade-up" data-aos-delay="200" className="group">
              <div className="relative">
                <div className="absolute -top-8 left-0 right-0 flex justify-center">
                  <div className="w-16 h-16 rounded-full bg-gradient-to-br from-accent/20 to-accent/10 flex items-center justify-center border-4 border-white shadow-lg">
                    <span className="text-2xl font-bold text-accent">2</span>
                  </div>
                </div>
                <Card className="therapy-card hover:shadow-lg transition-all duration-300 mt-6 h-full">
                  <CardContent className="p-6 pt-8">
                    <h3 className="text-xl font-bold text-foreground mb-4 text-center">Learning & Growth</h3>
                    <p className="text-muted-foreground text-sm leading-relaxed">
                      Throughout my career, I've had the privilege of working with incredible individuals and families facing various medical challenges. Each client has taught me something new about resilience, strength, and the importance of celebrating neurodiversity. All these experiences shaped my belief in building on each client's unique strengths.
                    </p>
                  </CardContent>
                </Card>
              </div>
            </div>

            {/* Stage 3: Creating A&O Therapy */}
            <div data-aos="fade-up" data-aos-delay="300" className="group">
              <div className="relative">
                <div className="absolute -top-8 left-0 right-0 flex justify-center">
                  <div className="w-16 h-16 rounded-full bg-gradient-to-br from-accent/20 to-accent/10 flex items-center justify-center border-4 border-white shadow-lg">
                    <span className="text-2xl font-bold text-accent">3</span>
                  </div>
                </div>
                <Card className="therapy-card hover:shadow-lg transition-all duration-300 mt-6 h-full">
                  <CardContent className="p-6 pt-8">
                    <h3 className="text-xl font-bold text-foreground mb-4 text-center">Creating A&O Therapy</h3>
                    <p className="text-muted-foreground text-sm leading-relaxed">
                      In 2020, I founded A&O Therapy LLC with a vision to provide individualized, client-centered and family-centered care that truly honors each individual's journey. My approach emphasizes effective collaboration, positive connections, evidence-based practices, and the fundamental belief that every individual has tremendous potential waiting to be unlocked.
                    </p>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </section>

        {/* Education & Credentials Section */}
        <section className="mb-20">
          <div className="mb-12 text-center" data-aos="fade-up">
            <h2 className="text-4xl lg:text-5xl font-bold text-foreground mb-4">
              Education & Credentials
            </h2>
            <div className="flex justify-center mb-4">
              <div className="h-1 w-20 bg-accent rounded-full"></div>
            </div>
            <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
              Advanced qualifications and educational achievements
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {credentials.map((credential, index) => (
              <div 
                key={index} 
                data-aos="fade-up" 
                data-aos-delay={`${index * 100}`}
                className="group"
              >
                <Card className="therapy-card hover:shadow-lg transition-all duration-300 border-l-4 border-accent/30 hover:border-accent/100 h-full">
                  <CardContent className="p-6">
                    <div className="flex flex-col gap-4">
                      {/* <div
                              className={`flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform duration-300 ${
                                credential.type === 'Education'
                                  ? ''
                                  : credential.type === 'License'
                                  ? ''
                                  : ''
                              }`}
                            >
                              {credential.type === 'Education' ? (
                                <img src={educationImg} alt="Education" className="w-full h-full object-contain" />
                              ) : credential.type === 'License' ? (
                                <img src={licenseImg} alt="License" className="w-full h-full object-contain" />
                              ) : (
                                <img src={certificateImg} alt="Certificate" className="w-full h-full object-contain" />
                              )}
                            </div> */}

                            <img src={credential.img} alt="" />
                      <div>
                        <h4 className="font-semibold text-foreground text-base mb-2">{credential.title}</h4>
                        <p className="text-muted-foreground text-sm mb-3">{credential.institution}</p>
                        <Badge className="bg-accent/10 text-accent hover:bg-accent/20 text-xs font-semibold">
                          {credential.year}
                        </Badge>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            ))}
          </div>
        </section>

        {/* Professional Experience Section */}
        <section className="mb-20">
          <div className="mb-12 text-center" data-aos="fade-up">
            <h2 className="text-4xl lg:text-5xl font-bold text-foreground mb-4">
              Professional Experience
            </h2>
            <div className="flex justify-center mb-4">
              <div className="h-1 w-20 bg-accent rounded-full"></div>
            </div>
            <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
              Career milestones and professional achievements
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {experience.map((job, index) => (
              <div 
                key={index}
                data-aos="fade-up" 
                data-aos-delay={`${index * 100}`}
                className="group"
              >
                <Card className="therapy-card hover:shadow-lg transition-all duration-300 border-l-4 border-primary/30 hover:border-primary/100 h-full">
                  <CardContent className="p-6">
                    <div>
                      <h4 className="font-bold text-foreground text-lg group-hover:text-accent transition-colors mb-2">{job.role}</h4>
                      <p className="text-accent font-semibold text-base mb-2">{job.organization}</p>
                      <Badge variant="outline" className="text-xs font-medium text-muted-foreground mb-4">
                        {job.period}
                      </Badge>
                      <p className="text-muted-foreground leading-relaxed text-sm">{job.description}</p>
                    </div>
                  </CardContent>
                </Card>
              </div>
            ))}
          </div>
        </section>

        {/* Values & Approach */}
        <section className="mb-20">
          <div className="text-center mb-12" data-aos="fade-up">
            <h2 className="text-3xl font-bold text-foreground mb-4">
              A&O Therapy Values & Approach
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              These core values guide every interaction and treatment decision, ensuring that 
              each individual receives care that honors their unique journey and potential.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((value, index) => (
              <Card key={index} className="therapy-card text-center" data-aos="fade-up" data-aos-delay={`${index * 100}`}>
                <CardContent className="pt-6">
                  <div className="w-16 h-16 bg-accent/10 rounded-full flex items-center justify-center mx-auto mb-4">
                    <value.icon className="w-8 h-8 text-accent" />
                  </div>
                  <h3 className="font-semibold text-foreground mb-3">{value.title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">{value.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* Mission Statement */}
        <section className="mb-20 py-16 bg-gradient-to-r from-primary to-accent rounded-2xl text-white text-center">
          <div className="max-w-4xl mx-auto px-8">
            <div className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-6">
              <Star className="w-10 h-10 text-white" />
            </div>
            <h2 className="text-3xl font-bold mb-6">Mission Statement</h2>
            <p className="text-xl text-white/95 leading-relaxed">
              "Our mission is to empower neurodiverse individuals and their families by providing compassionate, holistic, evidence-based client-centered occupational therapy services that celebrate uniqueness, build on strengths, and create pathways to meaningful participation in daily life. Every person deserves to thrive in their own authentic way."
            </p>
          </div>
        </section>

        {/* Personal Touch */}
        <section className="mb-20 overflow-hidden" data-aos="fade-up">
          <div className="mb-16 text-center">
            <h2 className="text-4xl lg:text-5xl font-bold text-foreground mb-4">
              Beyond the Clinic
            </h2>
            <div className="flex justify-center mb-4">
              <div className="h-1 w-20 bg-accent rounded-full"></div>
            </div>
            <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
              A glimpse into the person behind the professional — driven by passion, purpose, and personal experience
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Left Side - Personal Story */}
            <div data-aos="fade-right" className="space-y-6">
              <div className="space-y-4">
                <p className="text-lg text-muted-foreground leading-relaxed">
                  When I'm not working with clients, you can find me exploring nature trails with my family, 
                  reading the latest research in neuroscience, or volunteering at local autism support groups. 
                  I believe in <span className="font-semibold text-foreground">continuous learning</span> and staying connected to the community I serve.
                </p>
                
                <p className="text-lg text-muted-foreground leading-relaxed">
                  My own journey as a parent to neurodivergent children has deepened my understanding of the challenges families face. This personal experience has reinforced my commitment to providing support that extends beyond traditional therapy sessions—creating a compassionate, holistic approach to care.
                </p>
              </div>

              <div className="bg-gradient-to-r from-accent/10 to-accent/5 rounded-2xl p-6 border border-accent/20">
                <div className="flex items-start gap-3">
                  <Heart className="w-6 h-6 text-accent flex-shrink-0 mt-1" />
                  <div>
                    <h3 className="font-bold text-foreground mb-2">Core Philosophy</h3>
                    <p className="text-muted-foreground text-sm leading-relaxed">
                      Every client brings their own strengths and story. My role is to honor that uniqueness while providing evidence-based care grounded in compassion and respect.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Side - Personal Highlights */}
            <div data-aos="fade-left">
              <div className="inline-flex items-center gap-2 bg-accent/10 text-accent px-4 py-2 rounded-full mb-8">
                <Star className="w-4 h-4" />
                <span className="text-sm font-semibold">Personal Highlights</span>
              </div>

              <div className="space-y-4">
                <div className="group bg-white/50 rounded-2xl p-6 border border-white/10 hover:shadow-lg transition-all duration-300 hover:border-accent/30" data-aos="fade-up" data-aos-delay="100">
                  <div className="flex items-start gap-4">
                    <div className="flex items-center justify-center h-12 w-12 rounded-lg bg-accent/10 group-hover:bg-accent group-hover:text-white transition-all duration-300 flex-shrink-0">
                      <Heart className="w-6 h-6 text-accent group-hover:text-white" />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-semibold text-foreground mb-1">Devoted Parent</h4>
                      <p className="text-muted-foreground text-sm">Proud mother to three wonderful neurodivergent children</p>
                    </div>
                  </div>
                </div>

                <div className="group bg-white/50 rounded-2xl p-6 border border-white/10 hover:shadow-lg transition-all duration-300 hover:border-accent/30" data-aos="fade-up" data-aos-delay="200">
                  <div className="flex items-start gap-4">
                    <div className="flex items-center justify-center h-12 w-12 rounded-lg bg-accent/10 group-hover:bg-accent group-hover:text-white transition-all duration-300 flex-shrink-0">
                      <Users className="w-6 h-6 text-accent group-hover:text-white" />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-semibold text-foreground mb-1">Community Advocate</h4>
                      <p className="text-muted-foreground text-sm">Active autism support group volunteer and community leader</p>
                    </div>
                  </div>
                </div>

                <div className="group bg-white/50 rounded-2xl p-6 border border-white/10 hover:shadow-lg transition-all duration-300 hover:border-accent/30" data-aos="fade-up" data-aos-delay="300">
                  <div className="flex items-start gap-4">
                    <div className="flex items-center justify-center h-12 w-12 rounded-lg bg-accent/10 group-hover:bg-accent group-hover:text-white transition-all duration-300 flex-shrink-0">
                      <Lightbulb className="w-6 h-6 text-accent group-hover:text-white" />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-semibold text-foreground mb-1">Lifelong Learner</h4>
                      <p className="text-muted-foreground text-sm">Continuing education enthusiast staying current with latest research</p>
                    </div>
                  </div>
                </div>

                <div className="group bg-white/50 rounded-2xl p-6 border border-white/10 hover:shadow-lg transition-all duration-300 hover:border-accent/30" data-aos="fade-up" data-aos-delay="400">
                  <div className="flex items-start gap-4">
                    <div className="flex items-center justify-center h-12 w-12 rounded-lg bg-accent/10 group-hover:bg-accent group-hover:text-white transition-all duration-300 flex-shrink-0">
                      <Target className="w-6 h-6 text-accent group-hover:text-white" />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-semibold text-foreground mb-1">Nature Enthusiast</h4>
                      <p className="text-muted-foreground text-sm">Passionate about nature, mindfulness, and holistic wellness</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>


        {/* CTA Section */}
        <section className="text-center mb-10 py-16 bg-gradient-to-r from-primary to-accent rounded-2xl text-white">
          <div className="max-w-3xl mx-auto px-8">
            <h2 className="text-3xl font-bold mb-4">
              A&O Therapy would be honored to serve you and be part of your therapeutic journey.

            </h2>
            <p className="text-xl text-white/90 mb-8 leading-relaxed">
             We are honored to begin this therapeutic journey with you. Let's work together to celebrate your unique strengths and achieve meaningful goals.


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



        {/* CTA Section */}
        {/* <section className="text-center py-16">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-3xl font-bold text-foreground mb-4">
              A&O Therapy would be honored to serve you and be part of your therapeutic journey.
            </h2>
            <p className="text-lg text-muted-foreground mb-8 leading-relaxed">
              We are honored to begin this therapeutic journey with you. Let's work together to celebrate your unique strengths and achieve meaningful goals.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button asChild size="lg" className="btn-hero">
                <a href="/consultation">
                  Schedule Consultation
                  <ArrowRight className="w-5 h-5 ml-2" />
                </a>
              </Button>
              <Button asChild size="lg" variant="outline">
                <a href="/services">Learn About Services</a>
              </Button>
            </div>
          </div>
        </section> */}
      </div>
    </div>

  );
};

export default AboutPage;