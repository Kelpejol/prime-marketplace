"use client"
import React, { useEffect, useRef } from 'react';
import Slider from './Slider';
import ArtQuote from './ArtQuote';

const GradientBackground = () => {
  const interBubbleRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    let curX = 0;
    let curY = 0;
    let tgX = 0;
    let tgY = 0;

    const move = () => {
      curX += (tgX - curX) / 20;
      curY += (tgY - curY) / 20;
      
      if (interBubbleRef.current) {
        interBubbleRef.current.style.transform = `translate(${Math.round(curX)}px, ${Math.round(curY)}px)`;
      }
      requestAnimationFrame(move);
    };

    const handleMouseMove = (event: MouseEvent) => {
      tgX = event.clientX;
      tgY = event.clientY;
    };

    window.addEventListener('mousemove', handleMouseMove);
    move();

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);

  return (
    <section className="min-h-[980px] bg-[#080A0F] relative overflow-hidden">
      {/* Content Container */}
      <div className="relative h-full w-full">
        {/* Main Card */}
        <div className="absolute w-full top-[260px] z-10">     
          <Slider/>
        </div>
        
        {/* Profile Card Container */}
        <div className="absolute top-[580px] right-8 z-20 2xl:top-[220px]">
          <div className="max-h-[550px] overflow-y-auto overflow-x-hidden scrollbar-hide">
            <ArtQuote/>
          </div>
        </div>
      </div>

      {/* Background Gradients */}
      <div className="absolute inset-0">
        {/* Background noise */}
        <div className="absolute inset-0 opacity-30 mix-blend-soft-light">
          <svg className="w-full h-full" viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
            <filter id="bgNoise">
              <feTurbulence type="fractalNoise" baseFrequency="0.6" stitchTiles="stitch"/>
            </filter>
            <rect width="100%" height="100%" filter="url(#bgNoise)"/>
          </svg>
        </div>

        {/* Gradient blobs */}
        <div className="absolute w-full h-full filter blur-[40px]">
          {/* Gradient 1 - Blue */}
          <div className="absolute w-4/5 h-4/5 top-[10%] left-[10%] rounded-full bg-gradient-to-r from-blue-500 to-transparent opacity-80 mix-blend-hard-light animate-[moveVertical_30s_ease_infinite]"/>
          
          {/* Gradient 2 - Purple */}
          <div className="absolute w-4/5 h-4/5 top-[10%] left-[10%] rounded-full bg-gradient-to-r from-purple-500 to-transparent opacity-80 mix-blend-hard-light animate-[moveInCircle_20s_reverse_infinite]"/>
          
          {/* Gradient 3 - Indigo */}
          <div className="absolute w-4/5 h-4/5 top-[30%] left-[-20%] rounded-full bg-gradient-to-r from-indigo-500 to-transparent opacity-80 mix-blend-hard-light animate-[moveInCircle_40s_linear_infinite]"/>
          
          {/* Gradient 4 - Light Blue */}
          <div className="absolute w-4/5 h-4/5 top-[10%] left-[10%] rounded-full bg-gradient-to-r from-sky-500 to-transparent opacity-70 mix-blend-hard-light animate-[moveHorizontal_40s_ease_infinite]"/>
          
          {/* Gradient 5 - Dark Purple */}
          <div className="absolute w-[160%] h-[160%] top-[-30%] left-[-30%] rounded-full bg-gradient-to-r from-purple-900 to-transparent opacity-100 mix-blend-hard-light animate-[moveInCircle_20s_ease_infinite]"/>
          
          {/* Interactive gradient that follows mouse */}
          <div 
            ref={interBubbleRef}
            className="absolute w-full h-full top-[-50%] left-[-50%] rounded-full bg-gradient-to-r from-violet-500 to-transparent opacity-70 mix-blend-hard-light"
          />
        </div>
      </div>
    </section>
  );
};

export default GradientBackground;