import type { Metadata } from "next";
import { Inter} from "next/font/google";
import localFont from "next/font/local";

import "./globals.css";
import { ThirdwebProvider } from "thirdweb/react";
import LandingPageFooter from "./components/landingPage/LandingPageFooter";
import CreateNftModal from "./components/modals/CreateNftModal";
import CreateListingModal from "./components/modals/CreateListingModal";
import WalletToast from "./components/WalletToast";
import { Dialog } from "./components/modals/Dialog";
import BuyModal from "./components/modals/BuyModal";
import OfferModal from "./components/modals/OfferModal";
import { Suspense } from "react";
import CreateAuctionModal from "./components/modals/CreateAuctionModal";


// const inter = Inter({ subsets: ["latin"] });

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});


export const metadata: Metadata = {
  title: "thirdweb SDK + Next starter",
  description:
    "Starter template for using thirdweb SDK with Next.js App router",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body 
       className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
           <Suspense>
        <ThirdwebProvider>
          {children}
          <CreateNftModal/>
          <CreateListingModal/>
          <CreateAuctionModal/>
          <OfferModal/>
          <Dialog
          content="Who are you buying this art for ? if you 'Click yes'"
          hasButton
          />
          <BuyModal/>
           <WalletToast/>
          <LandingPageFooter/>
        </ThirdwebProvider>
        </Suspense>
      </body>
    </html>
  );
}
