import React from 'react';
import RotatingCube from "../components/auctionPage/RotatingItem";
import img1 from "@public/img1.jpeg";
import BiddingSystem from "../components/auctionPage/BiddingSystem";
import AuctionDetails from "../components/auctionPage/AuctionDetails";
import AuctionCommentary from "../components/auctionPage/AuctionCommentary"
import LiveChat from '../components/auctionPage/LiveChat';

export default function Page() {
  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-[#20D5E0] via-[#00CAE8] to-[#1798FA] overflow-hidden">
      <div className="container mx-auto p-4 md:h-screen flex h-auto  flex-col">
        <div className="flex flex-col md:flex-row gap-4 flex-grow overflow-hidden">
          <div className="w-full md:w-1/2 flex flex-col md:space-y-0 space-y-14 justify-between gap-4 overflow-y-auto">
            <RotatingCube
              frontImage={img1}
              backImage={img1}
              leftImage={img1}
              rightImage={img1}
              topImage={img1}
              bottomImage={img1}
            />
            <AuctionDetails />
          </div> 
          <div className="w-full lg:w-1/2 flex flex-col gap-4 overflow-y-auto">
        
            <BiddingSystem />
             <AuctionCommentary />
             
            <LiveChat /> 
          </div> 
        </div>
      </div>
    </div>
  )
}
