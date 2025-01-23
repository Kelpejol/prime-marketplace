import {
  assert,
  describe,
  test,
  clearStore,
  beforeAll,
  afterAll
} from "matchstick-as/assembly/index"
import { BigInt, Address, Bytes } from "@graphprotocol/graph-ts"
import { BuyerApprovedForListing } from "../generated/schema"
import { BuyerApprovedForListing as BuyerApprovedForListingEvent } from "../generated/TWProxy/TWProxy"
import { handleBuyerApprovedForListing } from "../src/tw-proxy"
import { createBuyerApprovedForListingEvent } from "./tw-proxy-utils"

// Tests structure (matchstick-as >=0.5.0)
// https://thegraph.com/docs/en/developer/matchstick/#tests-structure-0-5-0

describe("Describe entity assertions", () => {
  beforeAll(() => {
    let listingId = BigInt.fromI32(234)
    let buyer = Address.fromString("0x0000000000000000000000000000000000000001")
    let newBuyerApprovedForListingEvent = createBuyerApprovedForListingEvent(
      listingId,
      buyer
    )
    handleBuyerApprovedForListing(newBuyerApprovedForListingEvent)
  })

  afterAll(() => {
    clearStore()
  })

  // For more test scenarios, see:
  // https://thegraph.com/docs/en/developer/matchstick/#write-a-unit-test

  test("BuyerApprovedForListing created and stored", () => {
    assert.entityCount("BuyerApprovedForListing", 1)

    // 0xa16081f360e3847006db660bae1c6d1b2e17ec2a is the default address used in newMockEvent() function
    assert.fieldEquals(
      "BuyerApprovedForListing",
      "0xa16081f360e3847006db660bae1c6d1b2e17ec2a-1",
      "listingId",
      "234"
    )
    assert.fieldEquals(
      "BuyerApprovedForListing",
      "0xa16081f360e3847006db660bae1c6d1b2e17ec2a-1",
      "buyer",
      "0x0000000000000000000000000000000000000001"
    )

    // More assert options:
    // https://thegraph.com/docs/en/developer/matchstick/#asserts
  })
})
