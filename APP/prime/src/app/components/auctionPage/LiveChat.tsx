'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'

interface ChatMessage {
  id: number
  user: string
  message: string
}

export default function LiveChat() {
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [input, setInput] = useState('')

  const addMessage = (message: string) => {
    const newMessage = {
      id: Date.now(),
      user: `User${Math.floor(Math.random() * 1000)}`,
      message,
    }
    setMessages((prevMessages) => [...prevMessages, newMessage])
    setInput('')
  }

  useEffect(() => {
    const timer = setInterval(() => {
      addMessage(`Wow, this auction is heating up! 🔥`)
    }, 8000)
    return () => clearInterval(timer)
  }, [])

  return (
    <div className="bg-white bg-opacity-10 backdrop-blur-md rounded-lg p-4 flex flex-col h-[300px]">
      <h2 className="md:text-2xl text-base font-bold text-white mb-2">Live Chat</h2>
      <div className="flex-grow overflow-y-auto mb-4 space-y-2">
        {messages.map((msg) => (
          <motion.div
            key={msg.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="bg-white bg-opacity-20 rounded p-2"
          >
            <span className="font-bold text-purple-300">{msg.user}: </span>
            <span className="text-white">{msg.message}</span>
          </motion.div>
        ))}
      </div>
      <div className="flex space-x-2">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && addMessage(input)}
          className="flex-grow px-4 py-2 rounded-l-md focus:outline-none focus:ring-2 focus:ring-purple-500"
          placeholder="Join the conversation..."
        />
        <button
          onClick={() => addMessage(input)}
          className="bg-purple-600 text-white px-4 py-2 rounded-r-md hover:bg-purple-700 transition-colors"
        >
          Send
        </button>
      </div>
    </div>
  )
}

