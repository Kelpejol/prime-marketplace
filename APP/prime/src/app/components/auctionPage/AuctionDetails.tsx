'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { ChevronDown, ChevronUp } from 'lucide-react'



export default function AuctionDetails() {
  const [isExpanded, setIsExpanded] = useState(false)

  return (
    <div className="bg-white bg-opacity-10 backdrop-blur-md rounded-lg p-4 mt-[20px] md:mt-[0px] md:h-[300px] h-[100px] overflow-y-auto">
      <h2 className="md:text-2xl text-base font-bold text-white mb-2">Auction Details</h2>
      <motion.div
        initial={{ height: 0 }}
        animate={{ height: isExpanded ? 'auto' : '150px' }}
        transition={{ duration: 0.3 }}
        className="overflow-hidden"
      >
        <p className="text-white mb-2">
          This exquisite piece of art, Nebula Dreams, is a masterpiece created by the renowned artist Alexandra Cosmos. 
          Painted in 2023, this acrylic on canvas artwork measures 48x36 inches and captures the ethereal beauty of distant galaxies.
        </p>
        <p className="text-white mb-2">
          The swirling colors and intricate details transport viewers to the far reaches of the universe, evoking a sense of wonder and contemplation.
          This piece is part of Cosmos celebrated Celestial Visions series and has been featured in multiple international galleries.
        </p>
        <p className="text-white">
          The auction winner will receive a certificate of authenticity, a personal note from the artist, and free worldwide shipping in a custom-made, climate-controlled crate.
        </p>
      </motion.div>
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="mt-2 flex items-center text-white hover:text-purple-300 transition-colors"
      >
        {isExpanded ? (
          <>
            <ChevronUp className="mr-2" />
            Show Less
          </>
        ) : (
          <>
            <ChevronDown className="mr-2" />
            Show More
          </>
        )}
      </button>
    </div>
  )
}

