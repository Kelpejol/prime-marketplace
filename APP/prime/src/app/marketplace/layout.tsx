import NavBar from "../components/navbar/NavBar";


export default function MarketplaceLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
     <NavBar/>
     {children}
     </>
  )
}