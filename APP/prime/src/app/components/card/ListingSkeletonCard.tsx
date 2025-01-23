"use client"

import { useMemo } from "react"

 const SkeletonListingDetails = () => {
  const rotationStyle = useMemo(() => ({
    backgroundImage: `linear-gradient(132deg, #5ddcff, #3c67e3 43%, #4e00c2)`,
  }), []);

  return (
    <div className="flex flex-col space-y-10 w-full mb-8 items-center">
      <div className="relative w-[90%] h-[35vh] md:h-[50vh] lg:h-[80vh] aspect-[3/4] group">
        {/* Animated border gradient */}
        <div 
          className="absolute inset-[-1%] z-[-1] rounded-lg opacity-100 duration-200"
          style={rotationStyle}
        />
        
        {/* Blur effect */}
        <div
          className="absolute top-1/6 inset-x-0 w-full h-full mx-auto scale-80 opacity-100 duration-500 blur-xl"
          style={{
            ...rotationStyle,
            zIndex: -1,
          }}
        />

        {/* Main card content */}
        <div className="flex flex-row justify-between h-full bg-gray-800 rounded-lg overflow-hidden">
          <div className="md:w-[45%] w-[40%] h-full flex items-center justify-center">
            <div className="relative md:w-[80%] w-[90%] md:h-[70%] h-[80%] bg-gray-700 animate-pulse"> 
            </div>
          </div>

          <div className="md:w-[55%] w-[60%] h-full flex items-center lg:pl-24">
            <div className="flex flex-col space-y-2 md:space-y-6 w-full">
              <div className="flex space-x-2 items-center">
                <div className="bg-gray-600 w-3 h-3 rounded-full animate-pulse"></div>
                <div className="bg-gray-600 h-4 w-16 rounded animate-pulse"></div>
              </div>
              <div className="bg-gray-600 h-6 w-3/4 rounded animate-pulse"></div>
              <div className="bg-gray-600 h-4 w-full rounded animate-pulse"></div>
              <div className="bg-gray-600 h-4 w-1/2 rounded animate-pulse"></div>
              <div className="flex lg:space-x-3 space-x-1">
                <div className="bg-gray-600 h-10 w-24 rounded animate-pulse"></div>
                <div className="bg-gray-600 h-10 w-24 rounded animate-pulse"></div>
              </div>
              <div className="flex items-center space-x-2">
                <div className="bg-gray-600 h-4 w-4 rounded animate-pulse"></div>
                <div className="bg-gray-600 h-4 w-20 rounded animate-pulse"></div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="lg:h-[100vh] h-[90%] flex justify-center w-full items-center">
        <div className='lg:border-gray-400 lg:border-2 lg:h-[80vh] h-[90%] w-[90%] rounded-lg'>
          <div className='lg:flex w-full h-[90%] justify-evenly space-y-6 lg:space-y-1 items-center'>
            <div className="lg:w-[30%] w-full border-gray-400 border-2 h-[30vh] lg:h-[80%] rounded-lg p-2">
              <div className='w-full border-gray-400 border-b-2 text-center md:text-base text-sm lg:text-lg font-bold'>
                <div className="bg-gray-600 h-6 w-1/2 mx-auto rounded animate-pulse"></div>
              </div>
              <div className="w-full h-full flex-col items-stretch space-y-4 mt-4">
                <div className='w-full h-[25%] border-gray-400 border-b-2'>
                  <div className="bg-gray-600 h-4 w-3/4 rounded animate-pulse"></div>
                </div>
                <div className='w-full h-[25%] border-gray-400 border-b-2'>
                  <div className="bg-gray-600 h-4 w-1/2 rounded animate-pulse"></div>
                </div>
                <div className='w-full h-[25%] border-gray-400 border-b-2'>
                  <div className="bg-gray-600 h-4 w-2/3 rounded animate-pulse"></div>
                </div>
                <div className='w-full h-[25%]'>
                  <div className="bg-gray-600 h-4 w-1/3 rounded animate-pulse"></div>
                </div>
              </div>
            </div>

            <div className="lg:w-[50%] w-full border-gray-400 border-2 h-[40vh] lg:h-[80%] rounded-lg break-words overflow-y-auto p-2">
              <div className='w-full border-gray-400 border-b-2 capitalize text-center md:text-base text-sm lg:text-lg font-bold'>
                <div className="bg-gray-600 h-6 w-1/2 mx-auto rounded animate-pulse"></div>
              </div>
              <div className="space-y-2 mt-4">
                <div className="bg-gray-600 h-4 w-full rounded animate-pulse"></div>
                <div className="bg-gray-600 h-4 w-5/6 rounded animate-pulse"></div>
                <div className="bg-gray-600 h-4 w-4/5 rounded animate-pulse"></div>
                <div className="bg-gray-600 h-4 w-full rounded animate-pulse"></div>
                <div className="bg-gray-600 h-4 w-3/4 rounded animate-pulse"></div>
              </div>
            </div>
          </div>
        </div>    
      </div>
    </div>
  ) 
}

export default SkeletonListingDetails;



