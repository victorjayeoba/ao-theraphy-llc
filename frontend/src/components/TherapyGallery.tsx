import { useState } from "react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { ChevronLeft, ChevronRight, X } from "lucide-react";

// Import gallery images
import therapyPlay1 from "@/assets/gallery/therapy-play-1.jpg";
import therapyBall from "@/assets/gallery/therapy-ball.jpg";
import therapyRoom from "@/assets/gallery/therapy-room.jpg";
import buildingBlocks from "@/assets/gallery/building-blocks.jpg";
import legoWorkshop from "@/assets/gallery/lego-workshop.jpg";
import groupDiscussion from "@/assets/gallery/group-discussion.jpg";
import otConference from "@/assets/gallery/ot-conference.jpg";
import patientCare from "@/assets/gallery/patient-care.jpg";
import classroomSession from "@/assets/gallery/student1.jpeg";
import researchPoster from "@/assets/gallery/research-poster.jpg";
import learningSession from "@/assets/gallery/classroom-session.png";
import conferencePresentation from "/ani.jpg";
import honorSocietyCertificate from "/omega-nu-lambda.jpg";
import student2 from "@/assets/gallery/student2.png";
import student3 from "@/assets/gallery/student3.jpg";
import student4 from "@/assets/gallery/student4.jpg";

const galleryImages = [
  {
    src: therapyPlay1,
    alt: "Children engaged in therapeutic play activities",
    title: "Therapeutic Play",
  },
  {
    src: therapyBall,
    alt: "Child with therapy ball during sensory session",
    title: "Sensory Integration",
  },
  {
    src: therapyRoom,
    alt: "Therapy room with sensory and motor equipment",
    title: "Therapy Environment",
  },
  {
    src: buildingBlocks,
    alt: "Fine motor skills development with building blocks",
    title: "Fine Motor Skills",
  },
  {
    src: legoWorkshop,
    alt: "LEGO robotics and therapy workshop",
    title: "STEM Therapy",
  },
  {
    src: groupDiscussion,
    alt: "Group therapy discussion session",
    title: "Group Sessions",
  },
  {
    src: otConference,
    alt: "Dr. Ani educating younger learners about Occupational Therapy duties",
    title: "Professional Development",
  },
  {
    src: patientCare,
    alt: "Dr. Ani providing patient care and rehabilitation",
    title: "Patient Care",
  },
  {
    src: classroomSession,
    alt: "Classroom therapy session with children",
    title: "School-Based Therapy",
  },
  {
    src: researchPoster,
    alt: "Dr. Ani presenting research at National University",
    title: "Research & Education",
  },
  {
    src: learningSession,
    alt: "Dr. Ani with the LewisU graduate FW students at the Charitable Preschool",
    title: "Charitable Preschool",
  },
  {
    src: conferencePresentation,
    alt: "Dr. Ani presenting her professional work at an academic conference",
    title: "Conference Presentation",
  },
  {
    src: honorSocietyCertificate,
    alt: "Omega Nu Lambda National Honor Society recognition certificate",
    title: "Academic Recognition",
  },
  {
    src: student2,
    alt: "Student practicing balance on a balance beam",
    title: "Gross Motor Skills",
  },
  {
    src: student3,
    alt: "Student completed military base construction project",
    title: "STEM Project",
  },
  {
    src: student4,
    alt: "Building Fine Motor and Visual Motor skills through innovative techniques",
    title: "Therapy session",
  },
];

const TherapyGallery = () => {
  const [selectedImage, setSelectedImage] = useState<number | null>(null);

  const openImage = (index: number) => {
    setSelectedImage(index);
  };

  const closeImage = () => {
    setSelectedImage(null);
  };

  const nextImage = () => {
    if (selectedImage !== null) {
      setSelectedImage((selectedImage + 1) % galleryImages.length);
    }
  };

  const prevImage = () => {
    if (selectedImage !== null) {
      setSelectedImage(
        (selectedImage - 1 + galleryImages.length) % galleryImages.length
      );
    }
  };

  return (
    <section className="pt-20 pb-[38rem] mb-12 bg-secondary/30 relative overflow-hidden">
      {/* Topographic Pattern Background */}
      <div 
        className="absolute inset-0 opacity-10"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='100' height='100' viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M0 50 Q25 30 50 50 T100 50' stroke='%23002B5C' fill='none' stroke-width='0.5'/%3E%3Cpath d='M0 60 Q25 40 50 60 T100 60' stroke='%23002B5C' fill='none' stroke-width='0.5'/%3E%3Cpath d='M0 70 Q25 50 50 70 T100 70' stroke='%23002B5C' fill='none' stroke-width='0.5'/%3E%3Cpath d='M0 40 Q25 20 50 40 T100 40' stroke='%23002B5C' fill='none' stroke-width='0.5'/%3E%3Cpath d='M0 30 Q25 10 50 30 T100 30' stroke='%23002B5C' fill='none' stroke-width='0.5'/%3E%3C/svg%3E")`,
          backgroundSize: '200px 200px',
        }}
      />
      
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <div className="text-center mb-16" data-aos="fade-up">
          <h2 className="text-3xl lg:text-4xl font-bold text-foreground mb-4">
            Our Therapy in Action
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Explore moments from our therapy sessions, workshops, and community
            engagement activities.
          </p>
        </div>

        {/* Collage Style Gallery - Full Coverage Dense Layout */}
        <div className="relative w-full h-[750px] md:h-[1000px] lg:h-[1650px]">
          {/* Row 1 - Top images */}
          <div 
            className="absolute left-0 top-0 w-[33%] h-[48%] z-10 p-1"
            data-aos="fade-right"
            data-aos-delay="100"
          >
            <div 
              className="group relative overflow-hidden rounded-lg shadow-xl cursor-pointer h-full"
              onClick={() => openImage(0)}
            >
              <img
                src={galleryImages[0].src}
                alt={galleryImages[0].alt}
                className="w-full h-full object-cover transition-all duration-300 group-hover:scale-105"
              />
            </div>
          </div>

          <div 
            className="absolute left-[33%] top-0 w-[34%] h-[32%] z-10 p-1"
            data-aos="fade-down"
            data-aos-delay="150"
          >
            <div 
              className="group relative overflow-hidden rounded-lg shadow-xl cursor-pointer h-full"
              onClick={() => openImage(1)}
            >
              <img
                src={galleryImages[1].src}
                alt={galleryImages[1].alt}
                className="w-full h-full object-cover transition-all duration-300 group-hover:scale-105"
              />
            </div>
          </div>

          <div 
            className="absolute right-0 top-0 w-[33%] h-[50%] z-10 p-1"
            data-aos="fade-left"
            data-aos-delay="100"
          >
            <div 
              className="group relative overflow-hidden rounded-lg shadow-xl cursor-pointer h-full"
              onClick={() => openImage(2)}
            >
              <img
                src={galleryImages[2].src}
                alt={galleryImages[2].alt}
                className="w-full h-full object-cover transition-all duration-300 group-hover:scale-105"
              />
            </div>
          </div>

          {/* Row 2 - Middle images */}
          <div 
            className="absolute left-0 top-[48%] w-[25%] h-[35%] z-20 p-1"
            data-aos="fade-up"
            data-aos-delay="200"
          >
            <div 
              className="group relative overflow-hidden rounded-lg shadow-xl cursor-pointer h-full"
              onClick={() => openImage(3)}
            >
              <img
                src={galleryImages[3].src}
                alt={galleryImages[3].alt}
                className="w-full h-full object-cover transition-all duration-300 group-hover:scale-105"
              />
            </div>
          </div>

          <div 
            className="absolute left-[25%] top-[32%] w-[26%] h-[38%] z-20 p-1"
            data-aos="zoom-in"
            data-aos-delay="250"
          >
            <div 
              className="group relative overflow-hidden rounded-lg shadow-xl cursor-pointer h-full"
              onClick={() => openImage(4)}
            >
              <img
                src={galleryImages[4].src}
                alt={galleryImages[4].alt}
                className="w-full h-full object-cover transition-all duration-300 group-hover:scale-105"
              />
            </div>
          </div>

          <div 
            className="absolute left-[51%] top-[32%] w-[25%] h-[38%] z-20 p-1"
            data-aos="fade-up"
            data-aos-delay="200"
          >
            <div 
              className="group relative overflow-hidden rounded-lg shadow-xl cursor-pointer h-full"
              onClick={() => openImage(5)}
            >
              <img
                src={galleryImages[5].src}
                alt={galleryImages[5].alt}
                className="w-full h-full object-cover transition-all duration-300 group-hover:scale-105"
              />
            </div>
          </div>

          <div 
            className="absolute right-0 top-[50%] w-[24%] h-[33%] z-20 p-1"
            data-aos="fade-left"
            data-aos-delay="250"
          >
            <div 
              className="group relative overflow-hidden rounded-lg shadow-xl cursor-pointer h-full"
              onClick={() => openImage(6)}
            >
              <img
                src={galleryImages[6].src}
                alt={galleryImages[6].alt}
                className="w-full h-full object-cover transition-all duration-300 group-hover:scale-105"
              />
            </div>
          </div>

          {/* Row 3 - Bottom images */}
          <div 
            className="absolute left-0 top-[70%] w-[33%] h-[34%] z-30 p-1"
            data-aos="fade-up"
            data-aos-delay="300"
          >
            <div 
              className="group relative overflow-hidden rounded-lg shadow-xl cursor-pointer h-full"
              onClick={() => openImage(7)}
            >
              <img
                src={galleryImages[7].src}
                alt={galleryImages[7].alt}
                className="w-full h-full object-cover transition-all duration-300 group-hover:scale-105"
              />
            </div>
          </div>

          <div 
            className="absolute left-[30%] top-[68%] w-[40%] h-[35%] z-30 p-1"
            data-aos="zoom-in"
            data-aos-delay="350"
          >
            <div 
              className="group relative overflow-hidden rounded-lg shadow-xl cursor-pointer h-full"
              onClick={() => openImage(8)}
            >
              <img
                src={galleryImages[8].src}
                alt={galleryImages[8].alt}
                className="w-full h-full object-cover object-top transition-all duration-300 group-hover:scale-105"
              />
            </div>
          </div>

          <div 
            className="absolute right-0 top-[70%] w-[33%] h-[34%] z-30 p-1"
            data-aos="fade-up"
            data-aos-delay="300"
          >
            <div 
              className="group relative overflow-hidden rounded-lg shadow-xl cursor-pointer h-full"
              onClick={() => openImage(9)}
            >
              <img
                src={galleryImages[9].src}
                alt={galleryImages[9].alt}
                className="w-full h-full object-cover object-top transition-all duration-300 group-hover:scale-105"
              />
            </div>
          </div>

          {/* Row 4 - Extended gallery images */}
          <div
            className="absolute left-0 top-[100%] w-[32%] h-[24%] z-40 p-1"
            data-aos="fade-right"
            data-aos-delay="400"
          >
            <div
              className="group relative overflow-hidden rounded-lg shadow-xl cursor-pointer h-full"
              onClick={() => openImage(13)}
            >
              <img
                src={galleryImages[13].src}
                alt={galleryImages[13].alt}
                className="w-full h-full object-cover transition-all duration-300 group-hover:scale-105"
              />
            </div>
          </div>

          <div
            className="absolute left-[32%] top-[102%] w-[36%] h-[28%] z-40 p-1"
            data-aos="zoom-in"
            data-aos-delay="450"
          >
            <div
              className="group relative overflow-hidden rounded-lg shadow-xl cursor-pointer h-full"
              onClick={() => openImage(14)}
            >
              <img
                src={galleryImages[14].src}
                alt={galleryImages[14].alt}
                className="w-full h-full object-cover object-top transition-all duration-300 group-hover:scale-105"
              />
            </div>
          </div>

          <div
            className="absolute right-0 top-[100%] w-[32%] h-[24%] z-40 p-1"
            data-aos="fade-left"
            data-aos-delay="400"
          >
            <div
              className="group relative overflow-hidden rounded-lg shadow-xl cursor-pointer h-full"
              onClick={() => openImage(15)}
            >
              <img
                src={galleryImages[15].src}
                alt={galleryImages[15].alt}
                className="w-full h-full object-cover transition-all duration-300 group-hover:scale-105"
              />
            </div>
          </div>
        </div>

        {/* Lightbox Dialog */}
        <Dialog open={selectedImage !== null} onOpenChange={closeImage}>
          <DialogContent className="max-w-5xl p-0 bg-black/95 border-none">
            {selectedImage !== null && (
              <div className="relative flex items-center justify-center min-h-[60vh]">
                {/* Close button */}
                <button
                  onClick={closeImage}
                  className="absolute top-4 right-4 z-10 text-white/80 hover:text-white transition-colors"
                >
                  <X className="w-8 h-8" />
                </button>

                {/* Previous button */}
                <button
                  onClick={prevImage}
                  className="absolute left-4 top-1/2 -translate-y-1/2 z-10 text-white/80 hover:text-white transition-colors bg-black/30 rounded-full p-2"
                >
                  <ChevronLeft className="w-8 h-8" />
                </button>

                {/* Image */}
                <img
                  src={galleryImages[selectedImage].src}
                  alt={galleryImages[selectedImage].alt}
                  className="max-h-[80vh] max-w-full object-contain"
                />

                {/* Next button */}
                <button
                  onClick={nextImage}
                  className="absolute right-4 top-1/2 -translate-y-1/2 z-10 text-white/80 hover:text-white transition-colors bg-black/30 rounded-full p-2"
                >
                  <ChevronRight className="w-8 h-8" />
                </button>

                {/* Caption */}
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-6">
                  <h3 className="text-white font-semibold text-lg">
                    {galleryImages[selectedImage].title}
                  </h3>
                  <p className="text-white/70 text-sm">
                    {galleryImages[selectedImage].alt}
                  </p>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </section>
  );
};

export default TherapyGallery;
