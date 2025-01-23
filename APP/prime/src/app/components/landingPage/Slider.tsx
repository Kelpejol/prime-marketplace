"use client"
import React, { useState, useEffect, useRef, useCallback } from 'react';
import { ChevronLeft, ChevronRight, Pause, Play } from 'lucide-react';
import Image from "next/image"

interface SlideDataType {
  id: number;
  image: string;
  title: string;
  subtitle: string;
  description: string;
}

const SlideData: SlideDataType[] = [
  {
    id: 1,
    image: "/img5.jpeg",
    title: "Highlands",
    subtitle: "Scotland",
    description: "The mountains are calling"
  },
  {
    id: 2,
    image: "/img6.jpeg",
    title: "Machu Pichu",
    subtitle: "Peru",
    description: "Adventure is never far away"
  },
  {
    id: 3,
    image: "/img7.jpeg",
    title: "Chamonix",
    subtitle: "France",
    description: "Let your dreams come true"
  }
];

interface StyleWithTransform extends React.CSSProperties {
  transform: string;
}

const VoyageSlider: React.FC = () => {
  const [current, setCurrent] = useState<number>(0);
  const [isPlaying, setIsPlaying] = useState<boolean>(true);
  const [isHovered, setIsHovered] = useState<boolean>(false);
  const slideRefs = useRef<(HTMLDivElement | null)[]>([]);
  const slideInfoRefs = useRef<(HTMLDivElement | null)[]>([]);
  const autoPlayRef = useRef<NodeJS.Timeout | null>(null);

  const prev = (current - 1 + SlideData.length) % SlideData.length;
  const next = (current + 1) % SlideData.length;

  const handleNext = useCallback((): void => {
    setCurrent(prev => (prev + 1) % SlideData.length);
  }, []);

  const handlePrev = (): void => {
    setCurrent(prev => (prev - 1 + SlideData.length) % SlideData.length);
  };

  const togglePlayPause = (): void => {
    setIsPlaying(prev => !prev);
  };

  const setSlideRef = (index: number) => (el: HTMLDivElement | null): void => {
    slideRefs.current[index] = el;
  };

  const setSlideInfoRef = (index: number) => (el: HTMLDivElement | null): void => {
    slideInfoRefs.current[index] = el;
  };

  useEffect(() => {
    const handleMouseMove = (
      e: MouseEvent,
      slideInner: HTMLElement,
      infoInner: HTMLElement
    ): void => {
      const rect = slideInner.getBoundingClientRect();
      const offsetX = e.clientX - rect.left;
      const offsetY = e.clientY - rect.top;
      
      const ox = (offsetX - slideInner.clientWidth * 0.5) / (Math.PI * 3);
      const oy = -(offsetY - slideInner.clientHeight * 0.5) / (Math.PI * 4);
      
      (slideInner.style as StyleWithTransform).transform = `rotateX(${oy}deg) rotateY(${ox}deg)`;
      (infoInner.style as StyleWithTransform).transform = `rotateX(${oy}deg) rotateY(${ox}deg)`;
    };

    const handleMouseLeave = (
      slideInner: HTMLElement,
      infoInner: HTMLElement
    ): void => {
      (slideInner.style as StyleWithTransform).transform = 'rotateX(0deg) rotateY(0deg)';
      (infoInner.style as StyleWithTransform).transform = 'rotateX(0deg) rotateY(0deg)';
    };

    slideRefs.current.forEach((slide, index) => {
      if (slide && slideInfoRefs.current[index]) {
        const slideInner = slide.querySelector('.slide-inner') as HTMLElement;
        const infoInner = slideInfoRefs.current[index]?.querySelector('.info-inner') as HTMLElement;
        
        if (slideInner && infoInner) {
          const mouseMoveHandler = (e: MouseEvent) => handleMouseMove(e, slideInner, infoInner);
          const mouseLeaveHandler = () => handleMouseLeave(slideInner, infoInner);

          slide.addEventListener('mousemove', mouseMoveHandler);
          slide.addEventListener('mouseleave', mouseLeaveHandler);

          return () => {
            slide.removeEventListener('mousemove', mouseMoveHandler);
            slide.removeEventListener('mouseleave', mouseLeaveHandler);
          };
        }
      }
    });
  }, []);

  // Auto-scroll effect with proper cleanup
  useEffect(() => {
    if (isPlaying && !isHovered) {
      autoPlayRef.current = setInterval(() => {
        handleNext();
      }, 3000);
    }

    return () => {
      if (autoPlayRef.current) {
        clearInterval(autoPlayRef.current);
      }
    };
  }, [isPlaying, isHovered, handleNext]);

  return (
    <div 
       className="relative flex items-center w-full max-w-6xl perspective-1000 z-20"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <button 
        onClick={handlePrev}
        className="p-2 transition-opacity duration-800 hover:opacity-100 opacity-70 z-50"
        type="button"
      >
        <ChevronLeft className="w-10 h-10 text-white" />
      </button>

      <div className="relative grid place-items-center w-full h-full">
        {/* Play/Pause Button - Moved to top center */}
        <button
          onClick={togglePlayPause}
          className={`absolute top-4 left-1/2 -translate-x-1/2 p-2 transition-all duration-800 
            hover:opacity-100 hover:scale-110 z-[60] bg-black/20 backdrop-blur-sm rounded-full
            ${isPlaying ? 'opacity-70' : 'opacity-100'}
          `}
          type="button"
        >
          {isPlaying ? (
            <Pause className="w-6 h-6 text-white" />
          ) : (
            <Play className="w-6 h-6 text-white" />
          )}
        </button>

        {SlideData.map((slide, index) => (
          <React.Fragment key={slide.id}>
            <div
              ref={setSlideRef(index)}
              className={`absolute w-[300px] aspect-[2/3] transition-all duration-800 ease-in-out
                ${index === current ? 'scale-120 z-30 transform-none' : 'scale-100 z-10'}
                ${index === next ? 'translate-x-[107%] -rotate-y-45 skew-y-12' : ''}
                ${index === prev ? '-translate-x-[107%] rotate-y-45 -skew-y-12' : ''}
              `}
              style={{
                perspective: '1000px',
                transformStyle: 'preserve-3d'
              }}
            >
              <div className="slide-inner relative w-full h-full preserve-3d transition-transform duration-800 ease-in-out">
                <div className="relative w-full h-full overflow-hidden">
                  <Image 
                    src={slide.image} 
                    alt={slide.title}
                    className={`absolute w-full h-full object-cover top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 scale-125
                      ${index === current ? 'brightness-80' : 'brightness-50'}
                      transition-all duration-800 ease
                    `}
                    width={800}
                    height={1200}
                    quality={90}
                    priority={index === current}
                    sizes="(max-width: 768px) 100vw, 800px"
                    style={{
                      objectFit: 'cover',
                    }}
                  />
                </div>
              </div>
            </div>

            <div
              ref={setSlideInfoRef(index)}
              className={`absolute w-[300px] aspect-[2/3] z-50 transition-all duration-800 ease-in-out
                ${index === current ? 'opacity-100' : 'opacity-0'}
              `}
            >
              <div className="info-inner relative w-full h-full preserve-3d">
                <div className="absolute bottom-[15%] -left-[15%] z-[2]">
                  <div className={`font-bold text-4xl text-white uppercase tracking-wider whitespace-nowrap transition-all duration-800 ease-in-out
                    ${index === current ? 'translate-y-0 opacity-100 delay-250' : 'translate-y-full opacity-0'}
                  `}>
                    {slide.title}
                  </div>
                  <div className={`font-semibold text-2xl text-white uppercase tracking-wider ml-8 whitespace-nowrap transition-all duration-800 ease-in-out
                    ${index === current ? 'translate-y-0 opacity-100 delay-250' : 'translate-y-full opacity-0'}
                  `}>
                    {slide.subtitle}
                  </div>
                  <div className={`font-light text-sm text-white ml-4 transition-all duration-800 ease-in-out
                    ${index === current ? 'translate-y-0 opacity-100 delay-250' : 'translate-y-full opacity-0'}
                  `}>
                    {slide.description}
                  </div>
                </div>
              </div>
            </div>
          </React.Fragment>
        ))}

        {/* Progress indicator */}
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
          {SlideData.map((_, index) => (
            <div
              key={index}
              className={`w-2 h-2 rounded-full transition-all duration-500
                ${index === current ? 'bg-white scale-125' : 'bg-white/50'}
              `}
            />
          ))}
        </div>
      </div>

      <button 
        onClick={handleNext}
        className="p-2 transition-opacity duration-800 hover:opacity-100 opacity-70 z-50"
        type="button"
      >
        <ChevronRight className="w-10 h-10 text-white" />
      </button>
    </div>
  );
};

export default VoyageSlider;