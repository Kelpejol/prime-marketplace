import React from 'react'
import Listings from './Listings'
import { AuctionMarquee } from '../components/AuctionMarquee'

export default function page() {
  return (
    
      <div className="">
     
      <section className='min-h-screen bg-[#212534]'>   
        <Listings/>
         <AuctionMarquee />
      </section>
      </div>
  )
}
