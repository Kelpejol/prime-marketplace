'use client'

import React from 'react'

const SkeletonCard = () => {
  return (
    <div className="flex flex-col items-center">
      <div className="relative w-full aspect-[3/4] max-w-xs">
        <div className="absolute inset-0 rounded-lg bg-gradient-to-r from-gray-200 to-gray-300 animate-pulse" />
        <div className="relative h-full overflow-hidden rounded-sm md:rounded-md bg-gray-800">
          <div className="relative w-full h-[85%] bg-gray-700 animate-pulse" />
          <div className="flex flex-col justify-center items-start h-[15%] px-3 py-3">
            <div className="flex justify-between items-center w-full">
              <div className="h-4 w-1/2 bg-gray-600 rounded animate-pulse" />
              <div className="h-4 w-1/4 bg-gray-600 rounded animate-pulse" />
            </div>
            <div className="h-4 w-1/3 bg-gray-600 rounded mt-2 animate-pulse" />
          </div>
        </div>
      </div>
    </div>
  )
}

const SkeletonCardContainer = () => {
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 md:gap-x-8 gap-x-4 gap-y-14 py-8">
      {[...Array(8)].map((_, index) => (
        <SkeletonCard key={index} />
      ))}
    </div>
  )
}

export default SkeletonCardContainer

