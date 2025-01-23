import type { Metadata } from "next";
import NavBar from "@/app/components/navbar/NavBar";
import { Suspense } from "react";


export const metadata: Metadata = {
  title: "thirdweb SDK + Next starter",
  description:
    "Starter template for using thirdweb SDK with Next.js App router",
};

export default function Layout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
   
       <Suspense>  
      <header>
      <NavBar/>
     </header>
     { children}
     </Suspense>
  );
}
