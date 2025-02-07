"use client"
import { useEffect, useState } from "react";

interface AuctionItemProps {
  id: number;
  name: string;
  currentBid: string;
  endTime: Date;
}

export function AuctionItem({
  id,
  name,
  currentBid,
  endTime,
}: AuctionItemProps) {
  const [timeLeft, setTimeLeft] = useState(calculateTimeLeft());

  function calculateTimeLeft() {
    const difference = +endTime - +new Date();
    if (difference > 0) {
      return {
        hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
        minutes: Math.floor((difference / 1000 / 60) % 60),
        seconds: Math.floor((difference / 1000) % 60),
      };
    }
    return { hours: 0, minutes: 0, seconds: 0 };
  }

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);

    return () => clearInterval(timer);
  }, [endTime]); // Added calculateTimeLeft to dependencies

  const { hours, minutes, seconds } = timeLeft;

  return (
    <div className="bg-white rounded-lg shadow p-4 flex items-center space-x-4 min-w-[300px]">
      <div className="flex-grow">
        <h3 className="font-semibold text-lg">{name}</h3>
        <p className="text-sm text-gray-600">Current Bid: {currentBid} ETH</p>
      </div>
      <div className="text-right">
        <p className="text-sm font-medium">Ends in:</p>
        <p className="text-xs font-mono">
          {hours.toString().padStart(2, "0")}:
          {minutes.toString().padStart(2, "0")}:
          {seconds.toString().padStart(2, "0")}
        </p>
      </div>
      <button className="bg-green-500 text-white px-4 py-2 rounded-full text-sm hover:bg-green-600 transition-colors duration-300">
        Join Now
      </button>
    </div>
  );
}
