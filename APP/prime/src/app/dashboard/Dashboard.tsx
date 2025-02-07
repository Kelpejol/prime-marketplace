"use client"
import MyAuctions from "./MyAuctions";
import MyOffers from "./MyOffers";
import MyListings from "./MyListings";
import {useSearchParams} from "next/navigation";



export default function Dashboard() {
  const searchParams = useSearchParams();
  const view = searchParams.get("view");

    switch(view?.toLowerCase()) {
      case "auctions":
        return <MyAuctions />
        case "listings":
          return <MyListings />
          case "offers":
            return <MyOffers />
      default:
        return <MyListings />
    }
  
 
}