"use client"
import Marquee from "react-fast-marquee";
import { AuctionItem } from "./AuctionItem";

const auctions = [
  {
    id: 1,
    name: "Cosmic Voyage #42",
    currentBid: "0.5",
    endTime: new Date(Date.now() + 3600000),
  },
  {
    id: 2,
    name: "Digital Dreams #17",
    currentBid: "0.8",
    endTime: new Date(Date.now() + 7200000),
  },
  {
    id: 3,
    name: "Neon Nights #33",
    currentBid: "1.2",
    endTime: new Date(Date.now() + 5400000),
  },
  {
    id: 4,
    name: "Pixel Paradise #28",
    currentBid: "0.6",
    endTime: new Date(Date.now() + 9000000),
  },
  {
    id: 5,
    name: "Ethereal Echoes #55",
    currentBid: "2.0",
    endTime: new Date(Date.now() + 3600000),
  },
];

export function AuctionMarquee() {
  return (
    <div className="fixed bottom-0 left-0 right-0 bg-gradient-to-r z-[100] from-indigo-600 to-purple-600 p-4">
      <Marquee gradient={false} speed={40}>
        <div className="flex space-x-4">
          {auctions.map((auction) => (
            <AuctionItem key={auction.id} {...auction} />
          ))}
        </div>
      </Marquee>
    </div>
  );
}
