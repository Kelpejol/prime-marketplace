import { newMockEvent } from "matchstick-as"
import { ethereum, BigInt, Address, Bytes } from "@graphprotocol/graph-ts"
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
} from "../generated/TWProxy/TWProxy"

export function createBuyerApprovedForListingEvent(
  listingId: BigInt,
  buyer: Address
): BuyerApprovedForListing {
  let buyerApprovedForListingEvent =
    changetype<BuyerApprovedForListing>(newMockEvent())

  buyerApprovedForListingEvent.parameters = new Array()

  buyerApprovedForListingEvent.parameters.push(
    new ethereum.EventParam(
      "listingId",
      ethereum.Value.fromUnsignedBigInt(listingId)
    )
  )
  buyerApprovedForListingEvent.parameters.push(
    new ethereum.EventParam("buyer", ethereum.Value.fromAddress(buyer))
  )

  return buyerApprovedForListingEvent
}

export function createBuyerRemovedForListingEvent(
  listingId: BigInt
): BuyerRemovedForListing {
  let buyerRemovedForListingEvent =
    changetype<BuyerRemovedForListing>(newMockEvent())

  buyerRemovedForListingEvent.parameters = new Array()

  buyerRemovedForListingEvent.parameters.push(
    new ethereum.EventParam(
      "listingId",
      ethereum.Value.fromUnsignedBigInt(listingId)
    )
  )

  return buyerRemovedForListingEvent
}

export function createCancelledListingEvent(
  listingCreator: Address,
  listingId: BigInt
): CancelledListing {
  let cancelledListingEvent = changetype<CancelledListing>(newMockEvent())

  cancelledListingEvent.parameters = new Array()

  cancelledListingEvent.parameters.push(
    new ethereum.EventParam(
      "listingCreator",
      ethereum.Value.fromAddress(listingCreator)
    )
  )
  cancelledListingEvent.parameters.push(
    new ethereum.EventParam(
      "listingId",
      ethereum.Value.fromUnsignedBigInt(listingId)
    )
  )

  return cancelledListingEvent
}

export function createCurrencyApprovedForListingEvent(
  listingId: BigInt,
  currency: Address,
  pricePerToken: BigInt
): CurrencyApprovedForListing {
  let currencyApprovedForListingEvent =
    changetype<CurrencyApprovedForListing>(newMockEvent())

  currencyApprovedForListingEvent.parameters = new Array()

  currencyApprovedForListingEvent.parameters.push(
    new ethereum.EventParam(
      "listingId",
      ethereum.Value.fromUnsignedBigInt(listingId)
    )
  )
  currencyApprovedForListingEvent.parameters.push(
    new ethereum.EventParam("currency", ethereum.Value.fromAddress(currency))
  )
  currencyApprovedForListingEvent.parameters.push(
    new ethereum.EventParam(
      "pricePerToken",
      ethereum.Value.fromUnsignedBigInt(pricePerToken)
    )
  )

  return currencyApprovedForListingEvent
}

export function createListingPlanUpdatedEvent(
  endTime: BigInt
): ListingPlanUpdated {
  let listingPlanUpdatedEvent = changetype<ListingPlanUpdated>(newMockEvent())

  listingPlanUpdatedEvent.parameters = new Array()

  listingPlanUpdatedEvent.parameters.push(
    new ethereum.EventParam(
      "endTime",
      ethereum.Value.fromUnsignedBigInt(endTime)
    )
  )

  return listingPlanUpdatedEvent
}

export function createListingUpdatedEvent(
  currency: Address,
  pricePerToken: BigInt
): ListingUpdated {
  let listingUpdatedEvent = changetype<ListingUpdated>(newMockEvent())

  listingUpdatedEvent.parameters = new Array()

  listingUpdatedEvent.parameters.push(
    new ethereum.EventParam("currency", ethereum.Value.fromAddress(currency))
  )
  listingUpdatedEvent.parameters.push(
    new ethereum.EventParam(
      "pricePerToken",
      ethereum.Value.fromUnsignedBigInt(pricePerToken)
    )
  )

  return listingUpdatedEvent
}

export function createNewListingCreatedEvent(
  listingCreator: Address,
  listingId: BigInt,
  assetContract: Address,
  listing: ethereum.Tuple
): NewListingCreated {
  let newListingCreatedEvent = changetype<NewListingCreated>(newMockEvent())

  newListingCreatedEvent.parameters = new Array()

  newListingCreatedEvent.parameters.push(
    new ethereum.EventParam(
      "listingCreator",
      ethereum.Value.fromAddress(listingCreator)
    )
  )
  newListingCreatedEvent.parameters.push(
    new ethereum.EventParam(
      "listingId",
      ethereum.Value.fromUnsignedBigInt(listingId)
    )
  )
  newListingCreatedEvent.parameters.push(
    new ethereum.EventParam(
      "assetContract",
      ethereum.Value.fromAddress(assetContract)
    )
  )
  newListingCreatedEvent.parameters.push(
    new ethereum.EventParam("listing", ethereum.Value.fromTuple(listing))
  )

  return newListingCreatedEvent
}

export function createNewSaleEvent(
  listingCreator: Address,
  listingId: BigInt,
  assetContract: Address,
  tokenId: BigInt,
  buyer: Address,
  totalPricePaid: BigInt
): NewSale {
  let newSaleEvent = changetype<NewSale>(newMockEvent())

  newSaleEvent.parameters = new Array()

  newSaleEvent.parameters.push(
    new ethereum.EventParam(
      "listingCreator",
      ethereum.Value.fromAddress(listingCreator)
    )
  )
  newSaleEvent.parameters.push(
    new ethereum.EventParam(
      "listingId",
      ethereum.Value.fromUnsignedBigInt(listingId)
    )
  )
  newSaleEvent.parameters.push(
    new ethereum.EventParam(
      "assetContract",
      ethereum.Value.fromAddress(assetContract)
    )
  )
  newSaleEvent.parameters.push(
    new ethereum.EventParam(
      "tokenId",
      ethereum.Value.fromUnsignedBigInt(tokenId)
    )
  )
  newSaleEvent.parameters.push(
    new ethereum.EventParam("buyer", ethereum.Value.fromAddress(buyer))
  )
  newSaleEvent.parameters.push(
    new ethereum.EventParam(
      "totalPricePaid",
      ethereum.Value.fromUnsignedBigInt(totalPricePaid)
    )
  )

  return newSaleEvent
}

export function createAcceptedOfferEvent(
  offeror: Address,
  totalPrice: BigInt,
  listingId: BigInt,
  offerId: BigInt
): AcceptedOffer {
  let acceptedOfferEvent = changetype<AcceptedOffer>(newMockEvent())

  acceptedOfferEvent.parameters = new Array()

  acceptedOfferEvent.parameters.push(
    new ethereum.EventParam("offeror", ethereum.Value.fromAddress(offeror))
  )
  acceptedOfferEvent.parameters.push(
    new ethereum.EventParam(
      "totalPrice",
      ethereum.Value.fromUnsignedBigInt(totalPrice)
    )
  )
  acceptedOfferEvent.parameters.push(
    new ethereum.EventParam(
      "listingId",
      ethereum.Value.fromUnsignedBigInt(listingId)
    )
  )
  acceptedOfferEvent.parameters.push(
    new ethereum.EventParam(
      "offerId",
      ethereum.Value.fromUnsignedBigInt(offerId)
    )
  )

  return acceptedOfferEvent
}

export function createCancelledOfferEvent(
  offeror: Address,
  offerId: BigInt,
  listingId: BigInt
): CancelledOffer {
  let cancelledOfferEvent = changetype<CancelledOffer>(newMockEvent())

  cancelledOfferEvent.parameters = new Array()

  cancelledOfferEvent.parameters.push(
    new ethereum.EventParam("offeror", ethereum.Value.fromAddress(offeror))
  )
  cancelledOfferEvent.parameters.push(
    new ethereum.EventParam(
      "offerId",
      ethereum.Value.fromUnsignedBigInt(offerId)
    )
  )
  cancelledOfferEvent.parameters.push(
    new ethereum.EventParam(
      "listingId",
      ethereum.Value.fromUnsignedBigInt(listingId)
    )
  )

  return cancelledOfferEvent
}

export function createNewOfferEvent(
  totalPrice: BigInt,
  expirationTime: BigInt,
  listingId: BigInt,
  sender: Address,
  offerId: BigInt
): NewOffer {
  let newOfferEvent = changetype<NewOffer>(newMockEvent())

  newOfferEvent.parameters = new Array()

  newOfferEvent.parameters.push(
    new ethereum.EventParam(
      "totalPrice",
      ethereum.Value.fromUnsignedBigInt(totalPrice)
    )
  )
  newOfferEvent.parameters.push(
    new ethereum.EventParam(
      "expirationTime",
      ethereum.Value.fromUnsignedBigInt(expirationTime)
    )
  )
  newOfferEvent.parameters.push(
    new ethereum.EventParam(
      "listingId",
      ethereum.Value.fromUnsignedBigInt(listingId)
    )
  )
  newOfferEvent.parameters.push(
    new ethereum.EventParam("sender", ethereum.Value.fromAddress(sender))
  )
  newOfferEvent.parameters.push(
    new ethereum.EventParam(
      "offerId",
      ethereum.Value.fromUnsignedBigInt(offerId)
    )
  )

  return newOfferEvent
}

export function createRejectedOfferEvent(
  lister: Address,
  offerId: BigInt,
  listingId: BigInt
): RejectedOffer {
  let rejectedOfferEvent = changetype<RejectedOffer>(newMockEvent())

  rejectedOfferEvent.parameters = new Array()

  rejectedOfferEvent.parameters.push(
    new ethereum.EventParam("lister", ethereum.Value.fromAddress(lister))
  )
  rejectedOfferEvent.parameters.push(
    new ethereum.EventParam(
      "offerId",
      ethereum.Value.fromUnsignedBigInt(offerId)
    )
  )
  rejectedOfferEvent.parameters.push(
    new ethereum.EventParam(
      "listingId",
      ethereum.Value.fromUnsignedBigInt(listingId)
    )
  )

  return rejectedOfferEvent
}

export function createAuctionClosedEvent(
  auctionId: BigInt,
  closer: Address,
  bidAmount: BigInt
): AuctionClosed {
  let auctionClosedEvent = changetype<AuctionClosed>(newMockEvent())

  auctionClosedEvent.parameters = new Array()

  auctionClosedEvent.parameters.push(
    new ethereum.EventParam(
      "auctionId",
      ethereum.Value.fromUnsignedBigInt(auctionId)
    )
  )
  auctionClosedEvent.parameters.push(
    new ethereum.EventParam("closer", ethereum.Value.fromAddress(closer))
  )
  auctionClosedEvent.parameters.push(
    new ethereum.EventParam(
      "bidAmount",
      ethereum.Value.fromUnsignedBigInt(bidAmount)
    )
  )

  return auctionClosedEvent
}

export function createAuctionPaidOutEvent(
  recipient: Address,
  auctionId: BigInt,
  amount: BigInt
): AuctionPaidOut {
  let auctionPaidOutEvent = changetype<AuctionPaidOut>(newMockEvent())

  auctionPaidOutEvent.parameters = new Array()

  auctionPaidOutEvent.parameters.push(
    new ethereum.EventParam("recipient", ethereum.Value.fromAddress(recipient))
  )
  auctionPaidOutEvent.parameters.push(
    new ethereum.EventParam(
      "auctionId",
      ethereum.Value.fromUnsignedBigInt(auctionId)
    )
  )
  auctionPaidOutEvent.parameters.push(
    new ethereum.EventParam("amount", ethereum.Value.fromUnsignedBigInt(amount))
  )

  return auctionPaidOutEvent
}

export function createAuctionTokenPaidOutEvent(
  recipient: Address,
  auctionId: BigInt
): AuctionTokenPaidOut {
  let auctionTokenPaidOutEvent = changetype<AuctionTokenPaidOut>(newMockEvent())

  auctionTokenPaidOutEvent.parameters = new Array()

  auctionTokenPaidOutEvent.parameters.push(
    new ethereum.EventParam("recipient", ethereum.Value.fromAddress(recipient))
  )
  auctionTokenPaidOutEvent.parameters.push(
    new ethereum.EventParam(
      "auctionId",
      ethereum.Value.fromUnsignedBigInt(auctionId)
    )
  )

  return auctionTokenPaidOutEvent
}

export function createAuctionUpdatedEvent(auctionId: BigInt): AuctionUpdated {
  let auctionUpdatedEvent = changetype<AuctionUpdated>(newMockEvent())

  auctionUpdatedEvent.parameters = new Array()

  auctionUpdatedEvent.parameters.push(
    new ethereum.EventParam(
      "auctionId",
      ethereum.Value.fromUnsignedBigInt(auctionId)
    )
  )

  return auctionUpdatedEvent
}

export function createCancelledAuctionEvent(
  auctionCreator: Address,
  auctionId: BigInt
): CancelledAuction {
  let cancelledAuctionEvent = changetype<CancelledAuction>(newMockEvent())

  cancelledAuctionEvent.parameters = new Array()

  cancelledAuctionEvent.parameters.push(
    new ethereum.EventParam(
      "auctionCreator",
      ethereum.Value.fromAddress(auctionCreator)
    )
  )
  cancelledAuctionEvent.parameters.push(
    new ethereum.EventParam(
      "auctionId",
      ethereum.Value.fromUnsignedBigInt(auctionId)
    )
  )

  return cancelledAuctionEvent
}

export function createNewAuctionEvent(
  auctionCreator: Address,
  auctionId: BigInt,
  assetContract: Address
): NewAuction {
  let newAuctionEvent = changetype<NewAuction>(newMockEvent())

  newAuctionEvent.parameters = new Array()

  newAuctionEvent.parameters.push(
    new ethereum.EventParam(
      "auctionCreator",
      ethereum.Value.fromAddress(auctionCreator)
    )
  )
  newAuctionEvent.parameters.push(
    new ethereum.EventParam(
      "auctionId",
      ethereum.Value.fromUnsignedBigInt(auctionId)
    )
  )
  newAuctionEvent.parameters.push(
    new ethereum.EventParam(
      "assetContract",
      ethereum.Value.fromAddress(assetContract)
    )
  )

  return newAuctionEvent
}

export function createNewBidEvent(
  auctionId: BigInt,
  bidder: Address,
  bidAmount: BigInt
): NewBid {
  let newBidEvent = changetype<NewBid>(newMockEvent())

  newBidEvent.parameters = new Array()

  newBidEvent.parameters.push(
    new ethereum.EventParam(
      "auctionId",
      ethereum.Value.fromUnsignedBigInt(auctionId)
    )
  )
  newBidEvent.parameters.push(
    new ethereum.EventParam("bidder", ethereum.Value.fromAddress(bidder))
  )
  newBidEvent.parameters.push(
    new ethereum.EventParam(
      "bidAmount",
      ethereum.Value.fromUnsignedBigInt(bidAmount)
    )
  )

  return newBidEvent
}

export function createCurrencyRemovedEvent(
  _currency: Address
): CurrencyRemoved {
  let currencyRemovedEvent = changetype<CurrencyRemoved>(newMockEvent())

  currencyRemovedEvent.parameters = new Array()

  currencyRemovedEvent.parameters.push(
    new ethereum.EventParam("_currency", ethereum.Value.fromAddress(_currency))
  )

  return currencyRemovedEvent
}

export function createCurrencySetEvent(
  _currency: Address,
  _priceFeed: Address
): CurrencySet {
  let currencySetEvent = changetype<CurrencySet>(newMockEvent())

  currencySetEvent.parameters = new Array()

  currencySetEvent.parameters.push(
    new ethereum.EventParam("_currency", ethereum.Value.fromAddress(_currency))
  )
  currencySetEvent.parameters.push(
    new ethereum.EventParam(
      "_priceFeed",
      ethereum.Value.fromAddress(_priceFeed)
    )
  )

  return currencySetEvent
}

export function createExtensionAddedEvent(
  name: string,
  implementation: Address,
  extension: ethereum.Tuple
): ExtensionAdded {
  let extensionAddedEvent = changetype<ExtensionAdded>(newMockEvent())

  extensionAddedEvent.parameters = new Array()

  extensionAddedEvent.parameters.push(
    new ethereum.EventParam("name", ethereum.Value.fromString(name))
  )
  extensionAddedEvent.parameters.push(
    new ethereum.EventParam(
      "implementation",
      ethereum.Value.fromAddress(implementation)
    )
  )
  extensionAddedEvent.parameters.push(
    new ethereum.EventParam("extension", ethereum.Value.fromTuple(extension))
  )

  return extensionAddedEvent
}

export function createExtensionRemovedEvent(
  name: string,
  extension: ethereum.Tuple
): ExtensionRemoved {
  let extensionRemovedEvent = changetype<ExtensionRemoved>(newMockEvent())

  extensionRemovedEvent.parameters = new Array()

  extensionRemovedEvent.parameters.push(
    new ethereum.EventParam("name", ethereum.Value.fromString(name))
  )
  extensionRemovedEvent.parameters.push(
    new ethereum.EventParam("extension", ethereum.Value.fromTuple(extension))
  )

  return extensionRemovedEvent
}

export function createExtensionReplacedEvent(
  name: string,
  implementation: Address,
  extension: ethereum.Tuple
): ExtensionReplaced {
  let extensionReplacedEvent = changetype<ExtensionReplaced>(newMockEvent())

  extensionReplacedEvent.parameters = new Array()

  extensionReplacedEvent.parameters.push(
    new ethereum.EventParam("name", ethereum.Value.fromString(name))
  )
  extensionReplacedEvent.parameters.push(
    new ethereum.EventParam(
      "implementation",
      ethereum.Value.fromAddress(implementation)
    )
  )
  extensionReplacedEvent.parameters.push(
    new ethereum.EventParam("extension", ethereum.Value.fromTuple(extension))
  )

  return extensionReplacedEvent
}

export function createFunctionDisabledEvent(
  name: string,
  functionSelector: Bytes,
  extMetadata: ethereum.Tuple
): FunctionDisabled {
  let functionDisabledEvent = changetype<FunctionDisabled>(newMockEvent())

  functionDisabledEvent.parameters = new Array()

  functionDisabledEvent.parameters.push(
    new ethereum.EventParam("name", ethereum.Value.fromString(name))
  )
  functionDisabledEvent.parameters.push(
    new ethereum.EventParam(
      "functionSelector",
      ethereum.Value.fromFixedBytes(functionSelector)
    )
  )
  functionDisabledEvent.parameters.push(
    new ethereum.EventParam(
      "extMetadata",
      ethereum.Value.fromTuple(extMetadata)
    )
  )

  return functionDisabledEvent
}

export function createFunctionEnabledEvent(
  name: string,
  functionSelector: Bytes,
  extFunction: ethereum.Tuple,
  extMetadata: ethereum.Tuple
): FunctionEnabled {
  let functionEnabledEvent = changetype<FunctionEnabled>(newMockEvent())

  functionEnabledEvent.parameters = new Array()

  functionEnabledEvent.parameters.push(
    new ethereum.EventParam("name", ethereum.Value.fromString(name))
  )
  functionEnabledEvent.parameters.push(
    new ethereum.EventParam(
      "functionSelector",
      ethereum.Value.fromFixedBytes(functionSelector)
    )
  )
  functionEnabledEvent.parameters.push(
    new ethereum.EventParam(
      "extFunction",
      ethereum.Value.fromTuple(extFunction)
    )
  )
  functionEnabledEvent.parameters.push(
    new ethereum.EventParam(
      "extMetadata",
      ethereum.Value.fromTuple(extMetadata)
    )
  )

  return functionEnabledEvent
}

export function createInitializedEvent(version: i32): Initialized {
  let initializedEvent = changetype<Initialized>(newMockEvent())

  initializedEvent.parameters = new Array()

  initializedEvent.parameters.push(
    new ethereum.EventParam(
      "version",
      ethereum.Value.fromUnsignedBigInt(BigInt.fromI32(version))
    )
  )

  return initializedEvent
}

export function createListingPlanSetEvent(
  duration: BigInt,
  price: BigInt
): ListingPlanSet {
  let listingPlanSetEvent = changetype<ListingPlanSet>(newMockEvent())

  listingPlanSetEvent.parameters = new Array()

  listingPlanSetEvent.parameters.push(
    new ethereum.EventParam(
      "duration",
      ethereum.Value.fromUnsignedBigInt(duration)
    )
  )
  listingPlanSetEvent.parameters.push(
    new ethereum.EventParam("price", ethereum.Value.fromUnsignedBigInt(price))
  )

  return listingPlanSetEvent
}

export function createRoleAdminChangedEvent(
  role: Bytes,
  previousAdminRole: Bytes,
  newAdminRole: Bytes
): RoleAdminChanged {
  let roleAdminChangedEvent = changetype<RoleAdminChanged>(newMockEvent())

  roleAdminChangedEvent.parameters = new Array()

  roleAdminChangedEvent.parameters.push(
    new ethereum.EventParam("role", ethereum.Value.fromFixedBytes(role))
  )
  roleAdminChangedEvent.parameters.push(
    new ethereum.EventParam(
      "previousAdminRole",
      ethereum.Value.fromFixedBytes(previousAdminRole)
    )
  )
  roleAdminChangedEvent.parameters.push(
    new ethereum.EventParam(
      "newAdminRole",
      ethereum.Value.fromFixedBytes(newAdminRole)
    )
  )

  return roleAdminChangedEvent
}

export function createRoleGrantedEvent(
  role: Bytes,
  account: Address,
  sender: Address
): RoleGranted {
  let roleGrantedEvent = changetype<RoleGranted>(newMockEvent())

  roleGrantedEvent.parameters = new Array()

  roleGrantedEvent.parameters.push(
    new ethereum.EventParam("role", ethereum.Value.fromFixedBytes(role))
  )
  roleGrantedEvent.parameters.push(
    new ethereum.EventParam("account", ethereum.Value.fromAddress(account))
  )
  roleGrantedEvent.parameters.push(
    new ethereum.EventParam("sender", ethereum.Value.fromAddress(sender))
  )

  return roleGrantedEvent
}

export function createRoleRevokedEvent(
  role: Bytes,
  account: Address,
  sender: Address
): RoleRevoked {
  let roleRevokedEvent = changetype<RoleRevoked>(newMockEvent())

  roleRevokedEvent.parameters = new Array()

  roleRevokedEvent.parameters.push(
    new ethereum.EventParam("role", ethereum.Value.fromFixedBytes(role))
  )
  roleRevokedEvent.parameters.push(
    new ethereum.EventParam("account", ethereum.Value.fromAddress(account))
  )
  roleRevokedEvent.parameters.push(
    new ethereum.EventParam("sender", ethereum.Value.fromAddress(sender))
  )

  return roleRevokedEvent
}

export function createRoyaltyEngineUpdatedEvent(
  previousAddress: Address,
  newAddress: Address
): RoyaltyEngineUpdated {
  let royaltyEngineUpdatedEvent =
    changetype<RoyaltyEngineUpdated>(newMockEvent())

  royaltyEngineUpdatedEvent.parameters = new Array()

  royaltyEngineUpdatedEvent.parameters.push(
    new ethereum.EventParam(
      "previousAddress",
      ethereum.Value.fromAddress(previousAddress)
    )
  )
  royaltyEngineUpdatedEvent.parameters.push(
    new ethereum.EventParam(
      "newAddress",
      ethereum.Value.fromAddress(newAddress)
    )
  )

  return royaltyEngineUpdatedEvent
}
