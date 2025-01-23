// import MyAuctions from "./MyAuctions";
// import MyOffers from "./MyOffers";
import MyListings from "./MyListings";



export default function Dashboard() {
  return (
    <div className="flex flex-col space-y-4">
      {/* <MyAuctions /> */}
      <MyListings />
      {/* <MyOffers /> */}
    </div>
  );
}