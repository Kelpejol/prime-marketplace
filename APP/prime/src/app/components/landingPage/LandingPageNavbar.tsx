'use client'

import Button from "../Button"
import ConnectWallet from "../ConnectWallet"
import Logo from "../Logo"
import useWindowScroll from "@/app/hooks/useWindowScroll"
import Link from 'next/link'


export default function LandingPageNavbar() {
  const height = useWindowScroll();

 

  return (
    <div
        className={`${
          height > 1
            ? "fixed top-0 left-0 right-0 bg-gray-400 bg-clip-padding backdrop-filter backdrop-blur-sm bg-opacity-40 border-b border-gray-100"
            : "fixed top-0 left-0 right-0 bg-transparent"
        } z-30 px-4 py-2 transition-all duration-300 ease-in-out`}
      >
      <div className="flex justify-between items-center">
        <div className="cursor-pointer">
          <Link href="/">
        <Logo />
        </Link>
        </div>

        <div className="flex gap-6 items-center">
          <ConnectWallet size="secondary" color="secondary"/>
          <Link href="/marketplace">
          <Button size='large' color='primary' actionLabel="Explore" />  
           </Link> 
        </div>
      </div>
    </div>
  );
}