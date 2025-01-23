"use client"
import React from 'react';
import Image, { StaticImageData } from 'next/image';

interface RotatingCubeProps {
  frontImage: string | StaticImageData;
  backImage: string | StaticImageData;
  leftImage: string | StaticImageData;
  rightImage: string | StaticImageData;
  topImage: string | StaticImageData;
  bottomImage: string | StaticImageData;
}

const RotatingCube: React.FC<RotatingCubeProps> = ({
  frontImage,
  backImage,
  leftImage,
  rightImage,
  topImage,
  bottomImage,
}) => {
  return (
    <div className="md:w-1/2 w-full">
      <div 
        className="w-[200px] h-[200px] mx-auto pt-[50px]"
        style={{ perspective: '800px' }}
      >
        <div 
          className="w-[200px] h-[200px] relative"
          style={{ 
            transformStyle: 'preserve-3d',
            animation: 'rotate 15s linear infinite',
          }}
        >
          {/* Front face */}
          <div 
            className="absolute w-[200px] h-[200px] bg-center bg-cover"
            style={{ transform: 'translateZ(100px)' }}
          >
            <Image src={frontImage} alt="Front face" layout="fill" objectFit="cover" />
          </div>

          {/* Back face */}
          <div 
            className="absolute w-[200px] h-[200px] bg-center bg-cover bg-[#101010]"
            style={{ transform: 'rotateY(180deg) translateZ(100px)' }}
          >
            <Image src={backImage} alt="Back face" layout="fill" objectFit="cover" />
          </div>

          {/* Left face */}
          <div 
            className="absolute w-[200px] h-[200px] bg-center bg-cover"
            style={{ 
              transform: 'rotateY(-90deg) translateX(-100px)',
              transformOrigin: 'left',
            }}
          >
            <Image src={leftImage} alt="Left face" layout="fill" objectFit="cover" />
          </div>

          {/* Right face */}
          <div 
            className="absolute w-[200px] h-[200px] bg-center bg-cover"
            style={{ 
              transform: 'rotateY(90deg) translateX(100px)',
              transformOrigin: 'right',
            }}
          >
            <Image src={rightImage} alt="Right face" layout="fill" objectFit="cover" />
          </div>

          {/* Top face */}
          <div 
            className="absolute w-[200px] h-[200px] bg-center bg-cover"
            style={{ 
              transform: 'rotateX(-90deg) translateY(-100px)',
              transformOrigin: 'top',
            }}
          >
            <Image src={topImage} alt="Top face" layout="fill" objectFit="cover" />
          </div>

          {/* Bottom face */}
          <div 
            className="absolute w-[200px] h-[200px] bg-center bg-cover"
            style={{ 
              transform: 'rotateX(90deg) translateY(100px)',
              transformOrigin: 'bottom',
            }}
          >
            <Image src={bottomImage} alt="Bottom face" layout="fill" objectFit="cover" />
          </div>

          {/* Shadow element */}
          <div 
            className="absolute w-[200px] h-[200px] "
            style={{ 
              background: 'rgba(0,0,0,0.5)',
              boxShadow: '0 0 50px 50px rgba(0,0,0,0.5)',
              transform: 'rotateX(90deg) translateZ(-250px) rotateY(180deg) translateX(0px)',
            }}
          />
        </div>
      </div>

      <style jsx global>{`
        @keyframes rotate {
          0% { transform: rotateY(0); }
          100% { transform: rotateY(360deg); }
        }
      `}</style>
    </div>
  );
};

export default RotatingCube;
