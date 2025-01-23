import {
  BuyerApprovedForListing as BuyerApprovedForListingEvent,
  BuyerRemovedForListing as BuyerRemovedForListingEvent,
  CancelledListing as CancelledListingEvent,
  CurrencyApprovedForListing as CurrencyApprovedForListingEvent,
  ListingPlanUpdated as ListingPlanUpdatedEvent,
  ListingUpdated as ListingUpdatedEvent,
  NewListingCreated as NewListingCreatedEvent,
  NewSale as NewSaleEvent,
  AcceptedOffer as AcceptedOfferEvent,
  CancelledOffer as CancelledOfferEvent,
  NewOffer as NewOfferEvent,
  RejectedOffer as RejectedOfferEvent,
  AuctionClosed as AuctionClosedEvent,
  AuctionPaidOut as AuctionPaidOutEvent,
  AuctionTokenPaidOut as AuctionTokenPaidOutEvent,
  AuctionUpdated as AuctionUpdatedEvent,
  CancelledAuction as CancelledAuctionEvent,
  NewAuction as NewAuctionEvent,
  NewBid as NewBidEvent,
  CurrencyRemoved as CurrencyRemovedEvent,
  CurrencySet as CurrencySetEvent,
  ExtensionAdded as ExtensionAddedEvent,
  ExtensionRemoved as ExtensionRemovedEvent,
  ExtensionReplaced as ExtensionReplacedEvent,
  FunctionDisabled as FunctionDisabledEvent,
  FunctionEnabled as FunctionEnabledEvent,
  Initialized as InitializedEvent,
  ListingPlanSet as ListingPlanSetEvent,
  RoleAdminChanged as RoleAdminChangedEvent,
  RoleGranted as RoleGrantedEvent,
  RoleRevoked as RoleRevokedEvent,
  RoyaltyEngineUpdated as RoyaltyEngineUpdatedEvent
} from "../generated/TWProxy/TWProxy"
import {
  BuyerApprovedForListing,
  BuyerRemovedForListing,
  CancelledListing,
  CurrencyApprovedForListing,
  ListingPlanUpdated,
  ListingUpdated,
  NewListingCreated,
  NewSale,
  AcceptedOffer,
  CancelledOffer,
  NewOffer,
  RejectedOffer,
  AuctionClosed,
  AuctionPaidOut,
  AuctionTokenPaidOut,
  AuctionUpdated,
  CancelledAuction,
  NewAuction,
  NewBid,
  CurrencyRemoved,
  CurrencySet,
  ExtensionAdded,
  ExtensionRemoved,
  ExtensionReplaced,
  FunctionDisabled,
  FunctionEnabled,
  Initialized,
  ListingPlanSet,
  RoleAdminChanged,
  RoleGranted,
  RoleRevoked,
  RoyaltyEngineUpdated
} from "../generated/schema"
import { Bytes } from "@graphprotocol/graph-ts"

export function handleBuyerApprovedForListing(
  event: BuyerApprovedForListingEvent
): void {
  let entity = new BuyerApprovedForListing(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  )
  entity.listingId = event.params.listingId
  entity.buyer = event.params.buyer

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()
}

export function handleBuyerRemovedForListing(
  event: BuyerRemovedForListingEvent
): void {
  let entity = new BuyerRemovedForListing(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  )
  entity.listingId = event.params.listingId

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()
}

export function handleCancelledListing(event: CancelledListingEvent): void {
  let entity = new CancelledListing(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  )
  entity.listingCreator = event.params.listingCreator
  entity.listingId = event.params.listingId

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()
}

export function handleCurrencyApprovedForListing(
  event: CurrencyApprovedForListingEvent
): void {
  let entity = new CurrencyApprovedForListing(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  )
  entity.listingId = event.params.listingId
  entity.currency = event.params.currency
  entity.pricePerToken = event.params.pricePerToken

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()
}

export function handleListingPlanUpdated(event: ListingPlanUpdatedEvent): void {
  let entity = new ListingPlanUpdated(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  )
  entity.endTime = event.params.endTime

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()
}

export function handleListingUpdated(event: ListingUpdatedEvent): void {
  let entity = new ListingUpdated(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  )
  entity.currency = event.params.currency
  entity.pricePerToken = event.params.pricePerToken

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()
}

export function handleNewListingCreated(event: NewListingCreatedEvent): void {
  let entity = new NewListingCreated(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  )
  entity.listingCreator = event.params.listingCreator
  entity.listingId = event.params.listingId
  entity.assetContract = event.params.assetContract
  entity.listing_listingId = event.params.listing.listingId
  entity.listing_tokenId = event.params.listing.tokenId
  entity.listing_pricePerToken = event.params.listing.pricePerToken
  entity.listing_startTimestamp = event.params.listing.startTimestamp
  entity.listing_endTimestamp = event.params.listing.endTimestamp
  entity.listing_listingCreator = event.params.listing.listingCreator
  entity.listing_assetContract = event.params.listing.assetContract
  entity.listing_currency = event.params.listing.currency
  entity.listing_tokenType = event.params.listing.tokenType
  entity.listing_listingType = event.params.listing.listingType
  entity.listing_status = event.params.listing.status
  entity.listing_reserved = event.params.listing.reserved

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()
}

export function handleNewSale(event: NewSaleEvent): void {
  let entity = new NewSale(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  )
  entity.listingCreator = event.params.listingCreator
  entity.listingId = event.params.listingId
  entity.assetContract = event.params.assetContract
  entity.tokenId = event.params.tokenId
  entity.buyer = event.params.buyer
  entity.totalPricePaid = event.params.totalPricePaid

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()
}

export function handleAcceptedOffer(event: AcceptedOfferEvent): void {
  let entity = new AcceptedOffer(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  )
  entity.offeror = event.params.offeror
  entity.totalPrice = event.params.totalPrice
  entity.listingId = event.params.listingId
  entity.offerId = event.params.offerId

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()
}

export function handleCancelledOffer(event: CancelledOfferEvent): void {
  let entity = new CancelledOffer(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  )
  entity.offeror = event.params.offeror
  entity.offerId = event.params.offerId
  entity.listingId = event.params.listingId

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()
}

export function handleNewOffer(event: NewOfferEvent): void {
  let entity = new NewOffer(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  )
  entity.totalPrice = event.params.totalPrice
  entity.expirationTime = event.params.expirationTime
  entity.listingId = event.params.listingId
  entity.sender = event.params.sender
  entity.offerId = event.params.offerId

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()
}

export function handleRejectedOffer(event: RejectedOfferEvent): void {
  let entity = new RejectedOffer(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  )
  entity.lister = event.params.lister
  entity.offerId = event.params.offerId
  entity.listingId = event.params.listingId

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()
}

export function handleAuctionClosed(event: AuctionClosedEvent): void {
  let entity = new AuctionClosed(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  )
  entity.auctionId = event.params.auctionId
  entity.closer = event.params.closer
  entity.bidAmount = event.params.bidAmount

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()
}

export function handleAuctionPaidOut(event: AuctionPaidOutEvent): void {
  let entity = new AuctionPaidOut(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  )
  entity.recipient = event.params.recipient
  entity.auctionId = event.params.auctionId
  entity.amount = event.params.amount

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()
}

export function handleAuctionTokenPaidOut(
  event: AuctionTokenPaidOutEvent
): void {
  let entity = new AuctionTokenPaidOut(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  )
  entity.recipient = event.params.recipient
  entity.auctionId = event.params.auctionId

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()
}

export function handleAuctionUpdated(event: AuctionUpdatedEvent): void {
  let entity = new AuctionUpdated(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  )
  entity.auctionId = event.params.auctionId

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()
}

export function handleCancelledAuction(event: CancelledAuctionEvent): void {
  let entity = new CancelledAuction(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  )
  entity.auctionCreator = event.params.auctionCreator
  entity.auctionId = event.params.auctionId

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()
}

export function handleNewAuction(event: NewAuctionEvent): void {
  let entity = new NewAuction(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  )
  entity.auctionCreator = event.params.auctionCreator
  entity.auctionId = event.params.auctionId
  entity.assetContract = event.params.assetContract

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()
}

export function handleNewBid(event: NewBidEvent): void {
  let entity = new NewBid(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  )
  entity.auctionId = event.params.auctionId
  entity.bidder = event.params.bidder
  entity.bidAmount = event.params.bidAmount

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()
}

export function handleCurrencyRemoved(event: CurrencyRemovedEvent): void {
  let entity = new CurrencyRemoved(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  )
  entity._currency = event.params._currency

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()
}

export function handleCurrencySet(event: CurrencySetEvent): void {
  let entity = new CurrencySet(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  )
  entity._currency = event.params._currency
  entity._priceFeed = event.params._priceFeed

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()
}

export function handleExtensionAdded(event: ExtensionAddedEvent): void {
  let entity = new ExtensionAdded(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  )
  // entity.name = event.params.name
  entity.implementation = event.params.implementation
  entity.extension_metadata_name = event.params.extension.metadata.name
  entity.extension_metadata_metadataURI =
    event.params.extension.metadata.metadataURI
  entity.extension_metadata_implementation =
    event.params.extension.metadata.implementation
  entity.extension_functions = changetype<Bytes[]>(
    event.params.extension.functions
  )

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()
}

export function handleExtensionRemoved(event: ExtensionRemovedEvent): void {
  let entity = new ExtensionRemoved(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  )
  // entity.name = event.params.name
  entity.extension_metadata_name = event.params.extension.metadata.name
  entity.extension_metadata_metadataURI =
    event.params.extension.metadata.metadataURI
  entity.extension_metadata_implementation =
    event.params.extension.metadata.implementation
  entity.extension_functions = changetype<Bytes[]>(
    event.params.extension.functions
  )

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()
}

export function handleExtensionReplaced(event: ExtensionReplacedEvent): void {
  let entity = new ExtensionReplaced(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  )
  // entity.name = event.params.name
  entity.implementation = event.params.implementation
  entity.extension_metadata_name = event.params.extension.metadata.name
  entity.extension_metadata_metadataURI =
    event.params.extension.metadata.metadataURI
  entity.extension_metadata_implementation =
    event.params.extension.metadata.implementation
  entity.extension_functions = changetype<Bytes[]>(
    event.params.extension.functions
  )

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()
}

export function handleFunctionDisabled(event: FunctionDisabledEvent): void {
  let entity = new FunctionDisabled(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  )
  // entity.name = event.params.name
  entity.functionSelector = event.params.functionSelector
  entity.extMetadata_name = event.params.extMetadata.name
  entity.extMetadata_metadataURI = event.params.extMetadata.metadataURI
  entity.extMetadata_implementation = event.params.extMetadata.implementation

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()
}

export function handleFunctionEnabled(event: FunctionEnabledEvent): void {
  let entity = new FunctionEnabled(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  )
  // entity.name = event.params.name
  entity.functionSelector = event.params.functionSelector
  entity.extFunction_functionSelector =
    event.params.extFunction.functionSelector
  entity.extFunction_functionSignature =
    event.params.extFunction.functionSignature
  entity.extMetadata_name = event.params.extMetadata.name
  entity.extMetadata_metadataURI = event.params.extMetadata.metadataURI
  entity.extMetadata_implementation = event.params.extMetadata.implementation

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()
}

export function handleInitialized(event: InitializedEvent): void {
  let entity = new Initialized(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  )
  entity.version = event.params.version

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()
}

export function handleListingPlanSet(event: ListingPlanSetEvent): void {
  let entity = new ListingPlanSet(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  )
  entity.duration = event.params.duration
  entity.price = event.params.price

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()
}

export function handleRoleAdminChanged(event: RoleAdminChangedEvent): void {
  let entity = new RoleAdminChanged(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  )
  entity.role = event.params.role
  entity.previousAdminRole = event.params.previousAdminRole
  entity.newAdminRole = event.params.newAdminRole

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()
}

export function handleRoleGranted(event: RoleGrantedEvent): void {
  let entity = new RoleGranted(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  )
  entity.role = event.params.role
  entity.account = event.params.account
  entity.sender = event.params.sender

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()
}

export function handleRoleRevoked(event: RoleRevokedEvent): void {
  let entity = new RoleRevoked(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  )
  entity.role = event.params.role
  entity.account = event.params.account
  entity.sender = event.params.sender

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()
}

export function handleRoyaltyEngineUpdated(
  event: RoyaltyEngineUpdatedEvent
): void {
  let entity = new RoyaltyEngineUpdated(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  )
  entity.previousAddress = event.params.previousAddress
  entity.newAddress = event.params.newAddress

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()
}
