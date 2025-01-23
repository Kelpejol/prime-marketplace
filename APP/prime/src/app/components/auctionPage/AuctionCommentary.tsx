'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

const commentaries = [
  "Ladies and gentlemen, the bidding is heating up!",
  "We have a new high bid! Can anyone top it?",
  "The tension in the room is palpable as we approach the final minutes.",
  "This is a once-in-a-lifetime opportunity, don't let it slip away!",
  "I've never seen such enthusiasm for a piece in all my years as an auctioneer.",
  "Remember, this masterpiece comes with a certificate of authenticity.",
  "The artist herself is watching this auction with great interest!",
  "We're seeing bids coming in from all over the world for this stunning piece.",
  "This could be a record-breaking sale, folks!",
  "The craftsmanship and attention to detail in this work are truly remarkable.",
]

export default function AuctionCommentary() {
  const [commentary, setCommentary] = useState('')

  useEffect(() => {
    const timer = setInterval(() => {
      setCommentary(commentaries[Math.floor(Math.random() * commentaries.length)])
    }, 6000)
    return () => clearInterval(timer)
  }, [])

  return (
    <div className="bg-white bg-opacity-10 backdrop-blur-md rounded-lg p-4 md:h-[150px] h-[100px] flex flex-col justify-center">
      <h2 className="md:text-2xl text-base font-bold text-white mb-2">Auction Commentary</h2>
      <div className="flex-grow flex items-center justify-center">
        <AnimatePresence mode="wait">
          <motion.p
            key={commentary}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.5 }}
            className="text-white text-center text-lg italic"
          >
            {commentary}
          </motion.p>
        </AnimatePresence>
      </div>
    </div>
  )
}

