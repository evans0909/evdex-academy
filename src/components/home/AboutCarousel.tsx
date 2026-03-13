// src/components/home/AboutCarousel.tsx
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight, Pause, Play } from "lucide-react";

interface CarouselImage {
  url: string;
  alt: string;
  focusPoint?: string;
}

// 10 image placeholders - replace URLs with your actual images
const images: CarouselImage[] = [
  {
    url: "/images/image1.jpg",
    alt: "Students learning together at EvDeX Academy",
    focusPoint: "50% 30%" // Focus on heads
  },
  {
    url: "/images/image2.jpg",
    alt: "Coding workshop with peer programming",
    focusPoint: "center"
  },
  {
    url: "/images/image3.3.jpg",
    alt: "Students collaborating on a project",
    focusPoint: "50% 40%"
  },
  {
    url: "/images/image4.4.jpg",
    alt: "Tech community meetup",
    focusPoint: "50% 20%" // Focus on faces
  },
  {
    url: "/images/PXL_20251004_160351164.MP.jpg",
    alt: "Instructor helping students",
    focusPoint: "30% 40%"
  },
  {
    url: "/images/student2.jpg",
    alt: "Group coding session",
    focusPoint: "center"
  },
  {
    url: "/images/student5.jpg",
    alt: "Students presenting their work",
    focusPoint: "50% 35%"
  },
  {
    url: "/images/image9.jpg",
    alt: "Diverse group of tech learners",
    focusPoint: "50% 25%" // Focus on faces
  },
  {
    url: "/images/instructor1.jpg",
    alt: "Evening coding class",
    focusPoint: "center"
  },
  {
    url: "/images/instructor6.jpg",
    alt: "EvDeX Academy graduation ceremony",
    focusPoint: "50% 30%"
  }
];

export const AboutCarousel = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  // Auto-slide every 4 seconds
  useEffect(() => {
    if (isPaused) return;
    
    const timer = setInterval(() => {
      nextSlide();
    }, 4000);

    return () => clearInterval(timer);
  }, [currentIndex, isPaused]);

  const nextSlide = () => {
    setDirection(1);
    setCurrentIndex((prev) => (prev + 1) % images.length);
  };

  const prevSlide = () => {
    setDirection(-1);
    setCurrentIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  const goToSlide = (index: number) => {
    setDirection(index > currentIndex ? 1 : -1);
    setCurrentIndex(index);
  };

  const slideVariants = {
    enter: (direction: number) => ({
      x: direction > 0 ? 1000 : -1000,
      opacity: 0,
      scale: 0.8
    }),
    center: {
      zIndex: 1,
      x: 0,
      opacity: 1,
      scale: 1
    },
    exit: (direction: number) => ({
      zIndex: 0,
      x: direction < 0 ? 1000 : -1000,
      opacity: 0,
      scale: 0.8
    })
  };

  return (
    <div className="relative w-full h-[400px] md:h-[500px] rounded-2xl overflow-hidden shadow-2xl group">
      {/* Main Image */}
      <AnimatePresence initial={false} custom={direction} mode="wait">
        <motion.img
          key={currentIndex}
          src={images[currentIndex].url}
          alt={images[currentIndex].alt}
          custom={direction}
          variants={slideVariants}
          initial="enter"
          animate="center"
          exit="exit"
          transition={{
            x: { type: "spring", stiffness: 300, damping: 30 },
            opacity: { duration: 0.4 },
            scale: { duration: 0.4 }
          }}
          className="absolute w-full h-full"
          style={{ 
            objectFit: 'cover',
            objectPosition: images[currentIndex].focusPoint || 'center'
          }}
          onError={(e) => {
            // Fallback if image doesn't exist
            e.currentTarget.src = "https://via.placeholder.com/800x600?text=Image+Coming+Soon";
          }}
        />
      </AnimatePresence>

      {/* Overlay gradient for better text visibility */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-black/30 pointer-events-none" />

      {/* Image Counter */}
      <div className="absolute top-4 right-4 bg-black/50 backdrop-blur-sm text-white px-3 py-1 rounded-full text-sm z-10 border border-white/20">
        {currentIndex + 1} / {images.length}
      </div>

      {/* Play/Pause Button */}
      <button
        onClick={() => setIsPaused(!isPaused)}
        className="absolute top-4 left-4 bg-black/50 hover:bg-black/70 backdrop-blur-sm text-white p-2 rounded-full transition-all z-10 border border-white/20"
        title={isPaused ? "Play slideshow" : "Pause slideshow"}
      >
        {isPaused ? <Play className="w-4 h-4" /> : <Pause className="w-4 h-4" />}
      </button>

      {/* Navigation Arrows - Show on hover */}
      <button
        onClick={prevSlide}
        className="absolute left-4 top-1/2 -translate-y-1/2 bg-black/30 hover:bg-black/50 backdrop-blur-sm text-white p-3 rounded-full transition-all opacity-0 group-hover:opacity-100 z-10 border border-white/20 hover:scale-110"
        title="Previous image"
      >
        <ChevronLeft className="w-5 h-5" />
      </button>
      <button
        onClick={nextSlide}
        className="absolute right-4 top-1/2 -translate-y-1/2 bg-black/30 hover:bg-black/50 backdrop-blur-sm text-white p-3 rounded-full transition-all opacity-0 group-hover:opacity-100 z-10 border border-white/20 hover:scale-110"
        title="Next image"
      >
        <ChevronRight className="w-5 h-5" />
      </button>

      {/* Dots Indicator */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 z-10">
        {images.map((_, index) => (
          <button
            key={index}
            onClick={() => goToSlide(index)}
            className={`transition-all ${
              index === currentIndex
                ? "w-8 h-2 bg-white"
                : "w-2 h-2 bg-white/50 hover:bg-white/80"
            } rounded-full`}
            title={`Go to image ${index + 1}`}
          />
        ))}
      </div>

      {/* Progress Bar */}
      {!isPaused && (
        <div className="absolute bottom-0 left-0 w-full h-1 bg-white/20 z-10">
          <motion.div
            key={currentIndex}
            initial={{ width: "0%" }}
            animate={{ width: "100%" }}
            transition={{ duration: 4, ease: "linear" }}
            className="h-full bg-gradient-to-r from-secondary to-accent"
          />
        </div>
      )}

      {/* Image Title (optional) */}
      <div className="absolute bottom-12 left-4 right-4 text-white z-10 opacity-0 group-hover:opacity-100 transition-opacity">
        <p className="text-sm font-medium bg-black/50 backdrop-blur-sm inline-block px-3 py-1 rounded-full">
          {images[currentIndex].alt}
        </p>
      </div>
    </div>
  );
};