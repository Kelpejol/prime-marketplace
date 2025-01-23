'use client'

import { useState, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

interface Bid {
  id: number
  amount: number
  bidder: string
}

export default function BiddingSystem() {
  const [bids, setBids] = useState<Bid[]>([])
  const [currentBid, setCurrentBid] = useState(1000)
  const [bidAmount, setBidAmount] = useState('')
  const [timeLeft, setTimeLeft] = useState(3600) // 1 hour in seconds

  const addBid = useCallback(() => {
    const newBid = {
      id: Date.now(),
      amount: Number(bidAmount) || currentBid + 100,
      bidder: `Bidder${Math.floor(Math.random() * 1000)}`,
    }
    setBids([newBid]) // Only keep the latest bid
    setCurrentBid(newBid.amount)
    setBidAmount('')

    // Play bid sound
    const audio = new Audio('.mp3')
    audio.play()
  }, [bidAmount, currentBid])

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prevTime) => (prevTime > 0 ? prevTime - 1 : 0))
    }, 1000)

    return () => clearInterval(timer)
  }, [])

  useEffect(() => {
    const bidTimer = setInterval(() => {
      addBid()
    }, 5000)
    return () => clearInterval(bidTimer)
  }, [addBid])

  const formatTime = (time: number) => {
    const hours = Math.floor(time / 3600)
    const minutes = Math.floor((time % 3600) / 60)
    const seconds = time % 60
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`
  }

  return (
    <div className="bg-white bg-opacity-10 backdrop-blur-md rounded-lg p-4 flex flex-col md:h-[300px] h-[200px]">
      <h2 className=" text-base md:text-xl font-bold text-white mb-2">Bidding</h2>
      <div className="flex-grow overflow-hidden">
        <p className="md:text-base text-sm text-white mb-2">Current Bid: ${currentBid}</p>
        <p className="md:text-base text-sm text-white mb-4">Time Left: {formatTime(timeLeft)}</p>
        <div className="flex space-x-2 mb-2">
          <input
            type="number"
            value={bidAmount}
            onChange={(e) => setBidAmount(e.target.value)}
            className="flex-grow px-4 py-2 rounded-l-md focus:outline-none focus:ring-2 focus:ring-purple-500"
            placeholder="Enter your bid"
          />
          <button
            onClick={addBid}
            className="bg-purple-600 text-white px-4 py-2 rounded-r-md hover:bg-purple-700 transition-colors"
          >
            Bid
          </button>
        </div>
        <div className="relative md:h-20 h-10 overflow-hidden">
          <AnimatePresence>
            {bids.map((bid) => (
              <motion.div
                key={bid.id}
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -50 }}
                transition={{ duration: 0.3 }}
                className="absolute bottom-0 left-0 right-0 bg-white bg-opacity-20 backdrop-blur-md rounded-md p-2 mb-2"
              >
                <p className="text-white text-sm">
                  <span className="font-bold">{bid.bidder}</span> bid ${bid.amount}
                </p>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </div>
    </div>
  )
}
