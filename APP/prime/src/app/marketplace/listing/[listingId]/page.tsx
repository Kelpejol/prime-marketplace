import ListingDetails from "../ListingDetails";


interface IParams {
  listingId: string;
}


export default function page({ params }: { params: IParams }) {

  return(
      <div className="pt-12 min-h-screen">
        <ListingDetails listingId={params.listingId} />
      </div>
  )
   
}
