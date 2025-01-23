import { getContract } from "thirdweb";
import { anvil } from "thirdweb/chains";
import { chain, contractAddress } from "./constant";
import { client } from "../client";


export const nftContract = (contractAddress: string) => {
  return getContract({
    address: contractAddress,
    chain,
    client,
  })
}


export const contract = getContract({
  address: contractAddress,
  chain,
  client,
  abi: [
    {
      "type": "constructor",
      "inputs": [
        {
          "name": "_nativeTokenWrapper",
          "type": "address",
          "internalType": "address"
        }
      ],
      "stateMutability": "nonpayable"
    },
    {
      "type": "function",
      "name": "_msgData",
      "inputs": [],
      "outputs": [{ "name": "", "type": "bytes", "internalType": "bytes" }],
      "stateMutability": "view"
    },
    {
      "type": "function",
      "name": "_msgSender",
      "inputs": [],
      "outputs": [
        { "name": "sender", "type": "address", "internalType": "address" }
      ],
      "stateMutability": "view"
    },
    {
      "type": "function",
      "name": "approveBuyerForListing",
      "inputs": [
        { "name": "_listingId", "type": "uint256", "internalType": "uint256" },
        { "name": "_buyer", "type": "address", "internalType": "address" }
      ],
      "outputs": [],
      "stateMutability": "nonpayable"
    },
    {
      "type": "function",
      "name": "buyFromListing",
      "inputs": [
        { "name": "_listingId", "type": "uint256", "internalType": "uint256" },
        { "name": "_buyFor", "type": "address", "internalType": "address" }
      ],
      "outputs": [],
      "stateMutability": "payable"
    },
    {
      "type": "function",
      "name": "cancelListing",
      "inputs": [
        { "name": "_listingId", "type": "uint256", "internalType": "uint256" }
      ],
      "outputs": [],
      "stateMutability": "nonpayable"
    },
    {
      "type": "function",
      "name": "checkUpkeep",
      "inputs": [{ "name": "", "type": "bytes", "internalType": "bytes" }],
      "outputs": [
        { "name": "upkeepNeeded", "type": "bool", "internalType": "bool" },
        { "name": "performData", "type": "bytes", "internalType": "bytes" }
      ],
      "stateMutability": "view"
    },
    {
      "type": "function",
      "name": "createListing",
      "inputs": [
        {
          "name": "_params",
          "type": "tuple",
          "internalType": "struct IDirectListings.ListingParameters",
          "components": [
            {
              "name": "assetContract",
              "type": "address",
              "internalType": "address"
            },
            { "name": "tokenId", "type": "uint256", "internalType": "uint256" },
            {
              "name": "currency",
              "type": "address",
              "internalType": "address"
            },
            {
              "name": "pricePerToken",
              "type": "uint256",
              "internalType": "uint256"
            },
            {
              "name": "listingType",
              "type": "uint8",
              "internalType": "enum IDirectListings.ListingType"
            },
            { "name": "reserved", "type": "bool", "internalType": "bool" }
          ]
        }
      ],
      "outputs": [
        { "name": "_id", "type": "uint256", "internalType": "uint256" }
      ],
      "stateMutability": "payable"
    },
    {
      "type": "function",
      "name": "getAllListings",
      "inputs": [],
      "outputs": [
        {
          "name": "",
          "type": "tuple[]",
          "internalType": "struct IDirectListings.Listing[]",
          "components": [
            {
              "name": "listingId",
              "type": "uint256",
              "internalType": "uint256"
            },
            { "name": "tokenId", "type": "uint256", "internalType": "uint256" },
            {
              "name": "pricePerToken",
              "type": "uint256",
              "internalType": "uint256"
            },
            {
              "name": "startTimestamp",
              "type": "uint128",
              "internalType": "uint128"
            },
            {
              "name": "endTimestamp",
              "type": "uint128",
              "internalType": "uint128"
            },
            {
              "name": "listingCreator",
              "type": "address",
              "internalType": "address"
            },
            {
              "name": "assetContract",
              "type": "address",
              "internalType": "address"
            },
            {
              "name": "currency",
              "type": "address",
              "internalType": "address"
            },
            {
              "name": "tokenType",
              "type": "uint8",
              "internalType": "enum IDirectListings.TokenType"
            },
            {
              "name": "listingType",
              "type": "uint8",
              "internalType": "enum IDirectListings.ListingType"
            },
            {
              "name": "status",
              "type": "uint8",
              "internalType": "enum IDirectListings.Status"
            },
            { "name": "reserved", "type": "bool", "internalType": "bool" }
          ]
        }
      ],
      "stateMutability": "view"
    },
    {
      "type": "function",
      "name": "getAllValidListings",
      "inputs": [],
      "outputs": [
        {
          "name": "",
          "type": "tuple[]",
          "internalType": "struct IDirectListings.Listing[]",
          "components": [
            {
              "name": "listingId",
              "type": "uint256",
              "internalType": "uint256"
            },
            { "name": "tokenId", "type": "uint256", "internalType": "uint256" },
            {
              "name": "pricePerToken",
              "type": "uint256",
              "internalType": "uint256"
            },
            {
              "name": "startTimestamp",
              "type": "uint128",
              "internalType": "uint128"
            },
            {
              "name": "endTimestamp",
              "type": "uint128",
              "internalType": "uint128"
            },
            {
              "name": "listingCreator",
              "type": "address",
              "internalType": "address"
            },
            {
              "name": "assetContract",
              "type": "address",
              "internalType": "address"
            },
            {
              "name": "currency",
              "type": "address",
              "internalType": "address"
            },
            {
              "name": "tokenType",
              "type": "uint8",
              "internalType": "enum IDirectListings.TokenType"
            },
            {
              "name": "listingType",
              "type": "uint8",
              "internalType": "enum IDirectListings.ListingType"
            },
            {
              "name": "status",
              "type": "uint8",
              "internalType": "enum IDirectListings.Status"
            },
            { "name": "reserved", "type": "bool", "internalType": "bool" }
          ]
        }
      ],
      "stateMutability": "view"
    },
    {
      "type": "function",
      "name": "getApprovedBuyer",
      "inputs": [
        { "name": "_listingId", "type": "uint256", "internalType": "uint256" }
      ],
      "outputs": [
        { "name": "buyer", "type": "address", "internalType": "address" }
      ],
      "stateMutability": "view"
    },
    {
      "type": "function",
      "name": "getListing",
      "inputs": [
        { "name": "_listingId", "type": "uint256", "internalType": "uint256" }
      ],
      "outputs": [
        {
          "name": "",
          "type": "tuple",
          "internalType": "struct IDirectListings.Listing",
          "components": [
            {
              "name": "listingId",
              "type": "uint256",
              "internalType": "uint256"
            },
            { "name": "tokenId", "type": "uint256", "internalType": "uint256" },
            {
              "name": "pricePerToken",
              "type": "uint256",
              "internalType": "uint256"
            },
            {
              "name": "startTimestamp",
              "type": "uint128",
              "internalType": "uint128"
            },
            {
              "name": "endTimestamp",
              "type": "uint128",
              "internalType": "uint128"
            },
            {
              "name": "listingCreator",
              "type": "address",
              "internalType": "address"
            },
            {
              "name": "assetContract",
              "type": "address",
              "internalType": "address"
            },
            {
              "name": "currency",
              "type": "address",
              "internalType": "address"
            },
            {
              "name": "tokenType",
              "type": "uint8",
              "internalType": "enum IDirectListings.TokenType"
            },
            {
              "name": "listingType",
              "type": "uint8",
              "internalType": "enum IDirectListings.ListingType"
            },
            {
              "name": "status",
              "type": "uint8",
              "internalType": "enum IDirectListings.Status"
            },
            { "name": "reserved", "type": "bool", "internalType": "bool" }
          ]
        }
      ],
      "stateMutability": "view"
    },
    {
      "type": "function",
      "name": "getListingType",
      "inputs": [
        {
          "name": "_listingType",
          "type": "uint8",
          "internalType": "enum IDirectListings.ListingType"
        }
      ],
      "outputs": [
        { "name": "", "type": "uint128", "internalType": "uint128" },
        { "name": "", "type": "uint256", "internalType": "uint256" }
      ],
      "stateMutability": "view"
    },
    {
      "type": "function",
      "name": "getPlatformFee",
      "inputs": [
        { "name": "_currency", "type": "address", "internalType": "address" },
        { "name": "_price", "type": "uint256", "internalType": "uint256" }
      ],
      "outputs": [
        { "name": "fee", "type": "uint256", "internalType": "uint256" }
      ],
      "stateMutability": "view"
    },
    {
      "type": "function",
      "name": "performUpkeep",
      "inputs": [{ "name": "", "type": "bytes", "internalType": "bytes" }],
      "outputs": [],
      "stateMutability": "nonpayable"
    },
    {
      "type": "function",
      "name": "removeApprovedBuyerForListing",
      "inputs": [
        { "name": "_listingId", "type": "uint256", "internalType": "uint256" }
      ],
      "outputs": [],
      "stateMutability": "nonpayable"
    },
    {
      "type": "function",
      "name": "updateListing",
      "inputs": [
        { "name": "_listingId", "type": "uint256", "internalType": "uint256" },
        {
          "name": "_params",
          "type": "tuple",
          "internalType": "struct IDirectListings.UpdateListingParameters",
          "components": [
            {
              "name": "currency",
              "type": "address",
              "internalType": "address"
            },
            {
              "name": "pricePerToken",
              "type": "uint256",
              "internalType": "uint256"
            }
          ]
        }
      ],
      "outputs": [],
      "stateMutability": "nonpayable"
    },
    {
      "type": "function",
      "name": "updatedListingPlan",
      "inputs": [
        { "name": "_listingId", "type": "uint256", "internalType": "uint256" },
        {
          "name": "_listingType",
          "type": "uint8",
          "internalType": "enum IDirectListings.ListingType"
        }
      ],
      "outputs": [],
      "stateMutability": "payable"
    },
    {
      "type": "event",
      "name": "BuyerApprovedForListing",
      "inputs": [
        {
          "name": "listingId",
          "type": "uint256",
          "indexed": true,
          "internalType": "uint256"
        },
        {
          "name": "buyer",
          "type": "address",
          "indexed": true,
          "internalType": "address"
        }
      ],
      "anonymous": false
    },
    {
      "type": "event",
      "name": "BuyerRemovedForListing",
      "inputs": [
        {
          "name": "listingId",
          "type": "uint256",
          "indexed": true,
          "internalType": "uint256"
        }
      ],
      "anonymous": false
    },
    {
      "type": "event",
      "name": "CancelledListing",
      "inputs": [
        {
          "name": "listingCreator",
          "type": "address",
          "indexed": true,
          "internalType": "address"
        },
        {
          "name": "listingId",
          "type": "uint256",
          "indexed": true,
          "internalType": "uint256"
        }
      ],
      "anonymous": false
    },
    {
      "type": "event",
      "name": "CurrencyApprovedForListing",
      "inputs": [
        {
          "name": "listingId",
          "type": "uint256",
          "indexed": true,
          "internalType": "uint256"
        },
        {
          "name": "currency",
          "type": "address",
          "indexed": true,
          "internalType": "address"
        },
        {
          "name": "pricePerToken",
          "type": "uint256",
          "indexed": false,
          "internalType": "uint256"
        }
      ],
      "anonymous": false
    },
    {
      "type": "event",
      "name": "ListingPlanUpdated",
      "inputs": [
        {
          "name": "endTime",
          "type": "uint128",
          "indexed": true,
          "internalType": "uint128"
        }
      ],
      "anonymous": false
    },
    {
      "type": "event",
      "name": "ListingUpdated",
      "inputs": [
        {
          "name": "currency",
          "type": "address",
          "indexed": true,
          "internalType": "address"
        },
        {
          "name": "pricePerToken",
          "type": "uint256",
          "indexed": true,
          "internalType": "uint256"
        }
      ],
      "anonymous": false
    },
    {
      "type": "event",
      "name": "NewListingCreated",
      "inputs": [
        {
          "name": "listingCreator",
          "type": "address",
          "indexed": true,
          "internalType": "address"
        },
        {
          "name": "listingId",
          "type": "uint256",
          "indexed": true,
          "internalType": "uint256"
        },
        {
          "name": "assetContract",
          "type": "address",
          "indexed": true,
          "internalType": "address"
        },
        {
          "name": "listing",
          "type": "tuple",
          "indexed": false,
          "internalType": "struct IDirectListings.Listing",
          "components": [
            {
              "name": "listingId",
              "type": "uint256",
              "internalType": "uint256"
            },
            { "name": "tokenId", "type": "uint256", "internalType": "uint256" },
            {
              "name": "pricePerToken",
              "type": "uint256",
              "internalType": "uint256"
            },
            {
              "name": "startTimestamp",
              "type": "uint128",
              "internalType": "uint128"
            },
            {
              "name": "endTimestamp",
              "type": "uint128",
              "internalType": "uint128"
            },
            {
              "name": "listingCreator",
              "type": "address",
              "internalType": "address"
            },
            {
              "name": "assetContract",
              "type": "address",
              "internalType": "address"
            },
            {
              "name": "currency",
              "type": "address",
              "internalType": "address"
            },
            {
              "name": "tokenType",
              "type": "uint8",
              "internalType": "enum IDirectListings.TokenType"
            },
            {
              "name": "listingType",
              "type": "uint8",
              "internalType": "enum IDirectListings.ListingType"
            },
            {
              "name": "status",
              "type": "uint8",
              "internalType": "enum IDirectListings.Status"
            },
            { "name": "reserved", "type": "bool", "internalType": "bool" }
          ]
        }
      ],
      "anonymous": false
    },
    {
      "type": "event",
      "name": "NewSale",
      "inputs": [
        {
          "name": "listingCreator",
          "type": "address",
          "indexed": true,
          "internalType": "address"
        },
        {
          "name": "listingId",
          "type": "uint256",
          "indexed": true,
          "internalType": "uint256"
        },
        {
          "name": "assetContract",
          "type": "address",
          "indexed": true,
          "internalType": "address"
        },
        {
          "name": "tokenId",
          "type": "uint256",
          "indexed": false,
          "internalType": "uint256"
        },
        {
          "name": "buyer",
          "type": "address",
          "indexed": false,
          "internalType": "address"
        },
        {
          "name": "totalPricePaid",
          "type": "uint256",
          "indexed": false,
          "internalType": "uint256"
        }
      ],
      "anonymous": false
    },
    {
      "type": "error",
      "name": "CurrencyTransferLibMismatchedValue",
      "inputs": [
        { "name": "expected", "type": "uint256", "internalType": "uint256" },
        { "name": "actual", "type": "uint256", "internalType": "uint256" }
      ]
    },
    {
      "type": "error",
      "name": "SafeERC20FailedOperation",
      "inputs": [
        { "name": "token", "type": "address", "internalType": "address" }
      ]
    },
    {
      "type": "error",
      "name": "__DirectListing_BuyerNotApproved",
      "inputs": []
    },
    {
      "type": "error",
      "name": "__DirectListing_CanOnlyApproveABuyer",
      "inputs": []
    },
    {
      "type": "error",
      "name": "__DirectListing_CanOnlyRemoveApprovedBuyer",
      "inputs": []
    },
    {
      "type": "error",
      "name": "__DirectListing_CannotBuyWithThisCurrency",
      "inputs": []
    },
    {
      "type": "error",
      "name": "__DirectListing_InsufficientFunds",
      "inputs": [
        { "name": "_amount", "type": "uint256", "internalType": "uint256" }
      ]
    },
    {
      "type": "error",
      "name": "__DirectListing_InvalidAccessToCall",
      "inputs": [
        { "name": "_sender", "type": "address", "internalType": "address" }
      ]
    },
    {
      "type": "error",
      "name": "__DirectListing_InvalidAssetContract",
      "inputs": [
        {
          "name": "_assetContract",
          "type": "address",
          "internalType": "address"
        }
      ]
    },
    {
      "type": "error",
      "name": "__DirectListing_InvalidEndTime",
      "inputs": [
        { "name": "_endTime", "type": "uint128", "internalType": "uint128" }
      ]
    },
    { "type": "error", "name": "__DirectListing_InvalidId", "inputs": [] },
    {
      "type": "error",
      "name": "__DirectListing_InvalidListerRequirements",
      "inputs": [
        {
          "name": "_assetContract",
          "type": "address",
          "internalType": "address"
        },
        {
          "name": "_tokenType",
          "type": "uint8",
          "internalType": "enum IDirectListings.TokenType"
        },
        { "name": "_tokenId", "type": "uint256", "internalType": "uint256" }
      ]
    },
    {
      "type": "error",
      "name": "__DirectListing_InvalidListingCurrency",
      "inputs": [
        { "name": "_currency", "type": "address", "internalType": "address" }
      ]
    },
    {
      "type": "error",
      "name": "__DirectListing_InvalidListingDuration",
      "inputs": [
        { "name": "_duration", "type": "uint128", "internalType": "uint128" }
      ]
    },
    {
      "type": "error",
      "name": "__DirectListing_InvalidRequirementToCompleteASale",
      "inputs": [
        { "name": "_buyFor", "type": "address", "internalType": "address" },
        {
          "name": "_listingStatus",
          "type": "uint8",
          "internalType": "enum IDirectListings.Status"
        },
        { "name": "_isMarketApproved", "type": "bool", "internalType": "bool" }
      ]
    },
    {
      "type": "error",
      "name": "__DirectListing_ListingNotFound",
      "inputs": []
    },
    {
      "type": "error",
      "name": "__DirectListing_NotAValidAddress",
      "inputs": []
    },
    {
      "type": "error",
      "name": "__DirectListing_NotAuthorizedToApproveBuyerForListing",
      "inputs": []
    },
    {
      "type": "error",
      "name": "__DirectListing_NotAuthorizedToCancel",
      "inputs": []
    },
    {
      "type": "error",
      "name": "__DirectListing_NotAuthorizedToUpdate",
      "inputs": []
    },
    { "type": "error", "name": "__DirectListing_TransferFailed", "inputs": [] },
    {
      "type": "error",
      "name": "__DirectListing_UnauthorizedToRemoveBuyerForListing",
      "inputs": []
    },
    {
      "type": "constructor",
      "inputs": [
        {
          "name": "_nativeTokenWrapper",
          "type": "address",
          "internalType": "address"
        }
      ],
      "stateMutability": "nonpayable"
    },
    {
      "type": "function",
      "name": "_msgData",
      "inputs": [],
      "outputs": [{ "name": "", "type": "bytes", "internalType": "bytes" }],
      "stateMutability": "view"
    },
    {
      "type": "function",
      "name": "_msgSender",
      "inputs": [],
      "outputs": [
        { "name": "sender", "type": "address", "internalType": "address" }
      ],
      "stateMutability": "view"
    },
    {
      "type": "function",
      "name": "acceptOffer",
      "inputs": [
        { "name": "_offerId", "type": "uint256", "internalType": "uint256" },
        { "name": "_listingId", "type": "uint256", "internalType": "uint256" }
      ],
      "outputs": [],
      "stateMutability": "payable"
    },
    {
      "type": "function",
      "name": "cancelOffer",
      "inputs": [
        { "name": "_offerId", "type": "uint256", "internalType": "uint256" },
        { "name": "_listingId", "type": "uint256", "internalType": "uint256" }
      ],
      "outputs": [],
      "stateMutability": "nonpayable"
    },
    {
      "type": "function",
      "name": "getAllOffers",
      "inputs": [
        { "name": "_listingId", "type": "uint256", "internalType": "uint256" }
      ],
      "outputs": [
        {
          "name": "",
          "type": "tuple[]",
          "internalType": "struct IOffer.Offer[]",
          "components": [
            {
              "name": "totalPrice",
              "type": "uint256",
              "internalType": "uint256"
            },
            {
              "name": "expirationTimestamp",
              "type": "uint256",
              "internalType": "uint256"
            },
            { "name": "offeror", "type": "address", "internalType": "address" },
            {
              "name": "listingId",
              "type": "uint256",
              "internalType": "uint256"
            },
            {
              "name": "status",
              "type": "uint8",
              "internalType": "enum IOffer.Status"
            }
          ]
        }
      ],
      "stateMutability": "view"
    },
    {
      "type": "function",
      "name": "getOffer",
      "inputs": [
        { "name": "_offerId", "type": "uint256", "internalType": "uint256" },
        { "name": "_listingId", "type": "uint256", "internalType": "uint256" }
      ],
      "outputs": [
        {
          "name": "",
          "type": "tuple",
          "internalType": "struct IOffer.Offer",
          "components": [
            {
              "name": "totalPrice",
              "type": "uint256",
              "internalType": "uint256"
            },
            {
              "name": "expirationTimestamp",
              "type": "uint256",
              "internalType": "uint256"
            },
            { "name": "offeror", "type": "address", "internalType": "address" },
            {
              "name": "listingId",
              "type": "uint256",
              "internalType": "uint256"
            },
            {
              "name": "status",
              "type": "uint8",
              "internalType": "enum IOffer.Status"
            }
          ]
        }
      ],
      "stateMutability": "view"
    },
    {
      "type": "function",
      "name": "makeOffer",
      "inputs": [
        {
          "name": "_params",
          "type": "tuple",
          "internalType": "struct IOffer.OfferParams",
          "components": [
            {
              "name": "totalPrice",
              "type": "uint256",
              "internalType": "uint256"
            },
            { "name": "duration", "type": "uint128", "internalType": "uint128" }
          ]
        },
        { "name": "_listingId", "type": "uint256", "internalType": "uint256" }
      ],
      "outputs": [
        { "name": "_id", "type": "uint256", "internalType": "uint256" }
      ],
      "stateMutability": "nonpayable"
    },
    {
      "type": "function",
      "name": "rejectOffer",
      "inputs": [
        { "name": "_offerId", "type": "uint256", "internalType": "uint256" },
        { "name": "_listingId", "type": "uint256", "internalType": "uint256" }
      ],
      "outputs": [],
      "stateMutability": "nonpayable"
    },
    {
      "type": "event",
      "name": "AcceptedOffer",
      "inputs": [
        {
          "name": "offeror",
          "type": "address",
          "indexed": true,
          "internalType": "address"
        },
        {
          "name": "totalPrice",
          "type": "uint256",
          "indexed": true,
          "internalType": "uint256"
        },
        {
          "name": "listingId",
          "type": "uint256",
          "indexed": true,
          "internalType": "uint256"
        },
        {
          "name": "offerId",
          "type": "uint256",
          "indexed": false,
          "internalType": "uint256"
        }
      ],
      "anonymous": false
    },
    {
      "type": "event",
      "name": "CancelledOffer",
      "inputs": [
        {
          "name": "offeror",
          "type": "address",
          "indexed": true,
          "internalType": "address"
        },
        {
          "name": "offerId",
          "type": "uint256",
          "indexed": true,
          "internalType": "uint256"
        },
        {
          "name": "listingId",
          "type": "uint256",
          "indexed": true,
          "internalType": "uint256"
        }
      ],
      "anonymous": false
    },
    {
      "type": "event",
      "name": "NewOffer",
      "inputs": [
        {
          "name": "totalPrice",
          "type": "uint256",
          "indexed": true,
          "internalType": "uint256"
        },
        {
          "name": "expirationTime",
          "type": "uint256",
          "indexed": true,
          "internalType": "uint256"
        },
        {
          "name": "listingId",
          "type": "uint256",
          "indexed": true,
          "internalType": "uint256"
        },
        {
          "name": "sender",
          "type": "address",
          "indexed": false,
          "internalType": "address"
        },
        {
          "name": "offerId",
          "type": "uint256",
          "indexed": false,
          "internalType": "uint256"
        }
      ],
      "anonymous": false
    },
    {
      "type": "event",
      "name": "RejectedOffer",
      "inputs": [
        {
          "name": "lister",
          "type": "address",
          "indexed": true,
          "internalType": "address"
        },
        {
          "name": "offerId",
          "type": "uint256",
          "indexed": true,
          "internalType": "uint256"
        },
        {
          "name": "listingId",
          "type": "uint256",
          "indexed": true,
          "internalType": "uint256"
        }
      ],
      "anonymous": false
    },
    {
      "type": "error",
      "name": "CurrencyTransferLibMismatchedValue",
      "inputs": [
        { "name": "expected", "type": "uint256", "internalType": "uint256" },
        { "name": "actual", "type": "uint256", "internalType": "uint256" }
      ]
    },
    {
      "type": "error",
      "name": "__Offer_InsufficientFunds",
      "inputs": [
        { "name": "amount", "type": "uint256", "internalType": "uint256" }
      ]
    },
    { "type": "error", "name": "__Offer_InvalidListing", "inputs": [] },
    { "type": "error", "name": "__Offer_MarketplaceUnapproved", "inputs": [] },
    { "type": "error", "name": "__Offer_UnauthorizedToCall", "inputs": [] },
    
    {
      "type": "constructor",
      "inputs": [
        {
          "name": "_nativeTokenWrapper",
          "type": "address",
          "internalType": "address"
        }
      ],
      "stateMutability": "nonpayable"
    },
    {
      "type": "function",
      "name": "_msgData",
      "inputs": [],
      "outputs": [{ "name": "", "type": "bytes", "internalType": "bytes" }],
      "stateMutability": "view"
    },
    {
      "type": "function",
      "name": "_msgSender",
      "inputs": [],
      "outputs": [
        { "name": "sender", "type": "address", "internalType": "address" }
      ],
      "stateMutability": "view"
    },
    {
      "type": "function",
      "name": "bidInAuction",
      "inputs": [
        { "name": "auctionId", "type": "uint256", "internalType": "uint256" },
        { "name": "bidAmount", "type": "uint256", "internalType": "uint256" }
      ],
      "outputs": [],
      "stateMutability": "payable"
    },
    {
      "type": "function",
      "name": "cancelAuction",
      "inputs": [
        { "name": "_auctionId", "type": "uint256", "internalType": "uint256" }
      ],
      "outputs": [],
      "stateMutability": "nonpayable"
    },
    {
      "type": "function",
      "name": "collectAuctionPayout",
      "inputs": [
        { "name": "auctionId", "type": "uint256", "internalType": "uint256" }
      ],
      "outputs": [],
      "stateMutability": "payable"
    },
    {
      "type": "function",
      "name": "collectAuctionTokens",
      "inputs": [
        { "name": "auctionId", "type": "uint256", "internalType": "uint256" }
      ],
      "outputs": [],
      "stateMutability": "nonpayable"
    },
    {
      "type": "function",
      "name": "createAuction",
      "inputs": [
        {
          "name": "_params",
          "type": "tuple",
          "internalType": "struct IAuction.AuctionParameters",
          "components": [
            {
              "name": "assetContract",
              "type": "address",
              "internalType": "address"
            },
            { "name": "tokenId", "type": "uint256", "internalType": "uint256" },
            {
              "name": "currency",
              "type": "address",
              "internalType": "address"
            },
            {
              "name": "minimumBidAmount",
              "type": "uint256",
              "internalType": "uint256"
            },
            {
              "name": "buyoutBidAmount",
              "type": "uint256",
              "internalType": "uint256"
            },
            {
              "name": "bidBufferBps",
              "type": "uint64",
              "internalType": "uint64"
            },
            {
              "name": "startTimestamp",
              "type": "uint64",
              "internalType": "uint64"
            },
            {
              "name": "endTimestamp",
              "type": "uint64",
              "internalType": "uint64"
            }
          ]
        }
      ],
      "outputs": [
        { "name": "auctionId", "type": "uint256", "internalType": "uint256" }
      ],
      "stateMutability": "nonpayable"
    },
    {
      "type": "function",
      "name": "getAllAuctions",
      "inputs": [],
      "outputs": [
        {
          "name": "auctions",
          "type": "tuple[]",
          "internalType": "struct IAuction.Auction[]",
          "components": [
            {
              "name": "auctionId",
              "type": "uint256",
              "internalType": "uint256"
            },
            { "name": "tokenId", "type": "uint256", "internalType": "uint256" },
            {
              "name": "minimumBidAmount",
              "type": "uint256",
              "internalType": "uint256"
            },
            {
              "name": "buyoutBidAmount",
              "type": "uint256",
              "internalType": "uint256"
            },
            {
              "name": "bidBufferBps",
              "type": "uint64",
              "internalType": "uint64"
            },
            {
              "name": "startTimestamp",
              "type": "uint64",
              "internalType": "uint64"
            },
            {
              "name": "endTimestamp",
              "type": "uint64",
              "internalType": "uint64"
            },
            {
              "name": "auctionCreator",
              "type": "address",
              "internalType": "address"
            },
            {
              "name": "assetContract",
              "type": "address",
              "internalType": "address"
            },
            {
              "name": "currency",
              "type": "address",
              "internalType": "address"
            },
            {
              "name": "tokenType",
              "type": "uint8",
              "internalType": "enum IAuction.TokenType"
            },
            {
              "name": "status",
              "type": "uint8",
              "internalType": "enum IAuction.Status"
            }
          ]
        }
      ],
      "stateMutability": "view"
    },
    {
      "type": "function",
      "name": "getAuction",
      "inputs": [
        { "name": "_auctionId", "type": "uint256", "internalType": "uint256" }
      ],
      "outputs": [
        {
          "name": "auction",
          "type": "tuple",
          "internalType": "struct IAuction.Auction",
          "components": [
            {
              "name": "auctionId",
              "type": "uint256",
              "internalType": "uint256"
            },
            { "name": "tokenId", "type": "uint256", "internalType": "uint256" },
            {
              "name": "minimumBidAmount",
              "type": "uint256",
              "internalType": "uint256"
            },
            {
              "name": "buyoutBidAmount",
              "type": "uint256",
              "internalType": "uint256"
            },
            {
              "name": "bidBufferBps",
              "type": "uint64",
              "internalType": "uint64"
            },
            {
              "name": "startTimestamp",
              "type": "uint64",
              "internalType": "uint64"
            },
            {
              "name": "endTimestamp",
              "type": "uint64",
              "internalType": "uint64"
            },
            {
              "name": "auctionCreator",
              "type": "address",
              "internalType": "address"
            },
            {
              "name": "assetContract",
              "type": "address",
              "internalType": "address"
            },
            {
              "name": "currency",
              "type": "address",
              "internalType": "address"
            },
            {
              "name": "tokenType",
              "type": "uint8",
              "internalType": "enum IAuction.TokenType"
            },
            {
              "name": "status",
              "type": "uint8",
              "internalType": "enum IAuction.Status"
            }
          ]
        }
      ],
      "stateMutability": "view"
    },
    {
      "type": "function",
      "name": "getWinningBid",
      "inputs": [
        { "name": "_auctionId", "type": "uint256", "internalType": "uint256" }
      ],
      "outputs": [
        { "name": "bidder", "type": "address", "internalType": "address" },
        { "name": "currency", "type": "address", "internalType": "address" },
        { "name": "bidAmount", "type": "uint256", "internalType": "uint256" }
      ],
      "stateMutability": "view"
    },
    {
      "type": "function",
      "name": "isAuctionExpired",
      "inputs": [
        { "name": "_auctionId", "type": "uint256", "internalType": "uint256" }
      ],
      "outputs": [{ "name": "", "type": "bool", "internalType": "bool" }],
      "stateMutability": "view"
    },
    {
      "type": "function",
      "name": "isNewWinningBid",
      "inputs": [
        { "name": "auctionId", "type": "uint256", "internalType": "uint256" },
        { "name": "bidAmount", "type": "uint256", "internalType": "uint256" }
      ],
      "outputs": [
        { "name": "isWinningBid", "type": "bool", "internalType": "bool" }
      ],
      "stateMutability": "view"
    },
    {
      "type": "function",
      "name": "updateAuction",
      "inputs": [
        { "name": "auctionId", "type": "uint256", "internalType": "uint256" },
        {
          "name": "_params",
          "type": "tuple",
          "internalType": "struct IAuction.UpdateAuctionParameters",
          "components": [
            {
              "name": "currency",
              "type": "address",
              "internalType": "address"
            },
            {
              "name": "minimumBidAmount",
              "type": "uint256",
              "internalType": "uint256"
            },
            {
              "name": "buyoutBidAmount",
              "type": "uint256",
              "internalType": "uint256"
            },
            {
              "name": "bidBufferBps",
              "type": "uint64",
              "internalType": "uint64"
            },
            {
              "name": "startTimestamp",
              "type": "uint64",
              "internalType": "uint64"
            },
            {
              "name": "endTimestamp",
              "type": "uint64",
              "internalType": "uint64"
            }
          ]
        }
      ],
      "outputs": [],
      "stateMutability": "nonpayable"
    },
    {
      "type": "event",
      "name": "AuctionClosed",
      "inputs": [
        {
          "name": "auctionId",
          "type": "uint256",
          "indexed": true,
          "internalType": "uint256"
        },
        {
          "name": "closer",
          "type": "address",
          "indexed": true,
          "internalType": "address"
        },
        {
          "name": "bidAmount",
          "type": "uint256",
          "indexed": true,
          "internalType": "uint256"
        }
      ],
      "anonymous": false
    },
    {
      "type": "event",
      "name": "AuctionPaidOut",
      "inputs": [
        {
          "name": "recipient",
          "type": "address",
          "indexed": true,
          "internalType": "address"
        },
        {
          "name": "auctionId",
          "type": "uint256",
          "indexed": true,
          "internalType": "uint256"
        },
        {
          "name": "amount",
          "type": "uint256",
          "indexed": true,
          "internalType": "uint256"
        }
      ],
      "anonymous": false
    },
    {
      "type": "event",
      "name": "AuctionTokenPaidOut",
      "inputs": [
        {
          "name": "recipient",
          "type": "address",
          "indexed": true,
          "internalType": "address"
        },
        {
          "name": "auctionId",
          "type": "uint256",
          "indexed": true,
          "internalType": "uint256"
        }
      ],
      "anonymous": false
    },
    {
      "type": "event",
      "name": "AuctionUpdated",
      "inputs": [
        {
          "name": "auctionId",
          "type": "uint256",
          "indexed": true,
          "internalType": "uint256"
        }
      ],
      "anonymous": false
    },
    {
      "type": "event",
      "name": "CancelledAuction",
      "inputs": [
        {
          "name": "auctionCreator",
          "type": "address",
          "indexed": true,
          "internalType": "address"
        },
        {
          "name": "auctionId",
          "type": "uint256",
          "indexed": true,
          "internalType": "uint256"
        }
      ],
      "anonymous": false
    },
    {
      "type": "event",
      "name": "NewAuction",
      "inputs": [
        {
          "name": "auctionCreator",
          "type": "address",
          "indexed": true,
          "internalType": "address"
        },
        {
          "name": "auctionId",
          "type": "uint256",
          "indexed": true,
          "internalType": "uint256"
        },
        {
          "name": "assetContract",
          "type": "address",
          "indexed": true,
          "internalType": "address"
        }
      ],
      "anonymous": false
    },
    {
      "type": "event",
      "name": "NewBid",
      "inputs": [
        {
          "name": "auctionId",
          "type": "uint256",
          "indexed": true,
          "internalType": "uint256"
        },
        {
          "name": "bidder",
          "type": "address",
          "indexed": true,
          "internalType": "address"
        },
        {
          "name": "bidAmount",
          "type": "uint256",
          "indexed": true,
          "internalType": "uint256"
        }
      ],
      "anonymous": false
    },
    {
      "type": "error",
      "name": "CurrencyTransferLibMismatchedValue",
      "inputs": [
        { "name": "expected", "type": "uint256", "internalType": "uint256" },
        { "name": "actual", "type": "uint256", "internalType": "uint256" }
      ]
    },
    {
      "type": "error",
      "name": "__AuctionLogic_BuyoutBidMustBeGreater",
      "inputs": []
    },
    {
      "type": "error",
      "name": "__AuctionLogic_InvalidAssetContract",
      "inputs": [
        {
          "name": "_assetContract",
          "type": "address",
          "internalType": "address"
        }
      ]
    },
    {
      "type": "error",
      "name": "__AuctionLogic_InvalidAuctionCurrency",
      "inputs": [
        { "name": "_currency", "type": "address", "internalType": "address" }
      ]
    },
    {
      "type": "error",
      "name": "__AuctionLogic_InvalidAuctionState",
      "inputs": []
    },
    {
      "type": "error",
      "name": "__AuctionLogic_InvalidBidAmount",
      "inputs": []
    },
    {
      "type": "error",
      "name": "__AuctionLogic_InvalidBidBuffer",
      "inputs": []
    },
    { "type": "error", "name": "__AuctionLogic_InvalidDuration", "inputs": [] },
    { "type": "error", "name": "__AuctionLogic_InvalidTime", "inputs": [] },
    { "type": "error", "name": "__AuctionLogic_NoBidYet", "inputs": [] },
    { "type": "error", "name": "__AuctionLogic_TransferFailed", "inputs": [] },
    {
      "type": "error",
      "name": "__AuctionLogic_UnauthorizedToCall",
      "inputs": []
    },
    {
      "type": "error",
      "name": "__Auction_InvalidAccessToCall",
      "inputs": [
        { "name": "sender", "type": "address", "internalType": "address" }
      ]
    },
    { "type": "error", "name": "__Auction_InvalidBidTime", "inputs": [] },
    
    {
      "type": "constructor",
      "inputs": [
        {
          "name": "marketplaceRouterParams",
          "type": "tuple",
          "internalType": "struct MarketplaceRouter.MarketplaceRouterParams",
          "components": [
            {
              "name": "_extensions",
              "type": "tuple[]",
              "internalType": "struct IExtension.Extension[]",
              "components": [
                {
                  "name": "metadata",
                  "type": "tuple",
                  "internalType": "struct IExtension.ExtensionMetadata",
                  "components": [
                    {
                      "name": "name",
                      "type": "string",
                      "internalType": "string"
                    },
                    {
                      "name": "metadataURI",
                      "type": "string",
                      "internalType": "string"
                    },
                    {
                      "name": "implementation",
                      "type": "address",
                      "internalType": "address"
                    }
                  ]
                },
                {
                  "name": "functions",
                  "type": "tuple[]",
                  "internalType": "struct IExtension.ExtensionFunction[]",
                  "components": [
                    {
                      "name": "functionSelector",
                      "type": "bytes4",
                      "internalType": "bytes4"
                    },
                    {
                      "name": "functionSignature",
                      "type": "string",
                      "internalType": "string"
                    }
                  ]
                }
              ]
            },
            {
              "name": "royaltyEngineAddress",
              "type": "address",
              "internalType": "address"
            }
          ]
        }
      ],
      "stateMutability": "nonpayable"
    },
    { "type": "fallback", "stateMutability": "payable" },
    { "type": "receive", "stateMutability": "payable" },
    {
      "type": "function",
      "name": "DEFAULT_ADMIN_ROLE",
      "inputs": [],
      "outputs": [{ "name": "", "type": "bytes32", "internalType": "bytes32" }],
      "stateMutability": "view"
    },
    {
      "type": "function",
      "name": "_disableFunctionInExtension",
      "inputs": [
        {
          "name": "_extensionName",
          "type": "string",
          "internalType": "string"
        },
        {
          "name": "_functionSelector",
          "type": "bytes4",
          "internalType": "bytes4"
        }
      ],
      "outputs": [],
      "stateMutability": "nonpayable"
    },
    {
      "type": "function",
      "name": "addExtension",
      "inputs": [
        {
          "name": "_extension",
          "type": "tuple",
          "internalType": "struct IExtension.Extension",
          "components": [
            {
              "name": "metadata",
              "type": "tuple",
              "internalType": "struct IExtension.ExtensionMetadata",
              "components": [
                { "name": "name", "type": "string", "internalType": "string" },
                {
                  "name": "metadataURI",
                  "type": "string",
                  "internalType": "string"
                },
                {
                  "name": "implementation",
                  "type": "address",
                  "internalType": "address"
                }
              ]
            },
            {
              "name": "functions",
              "type": "tuple[]",
              "internalType": "struct IExtension.ExtensionFunction[]",
              "components": [
                {
                  "name": "functionSelector",
                  "type": "bytes4",
                  "internalType": "bytes4"
                },
                {
                  "name": "functionSignature",
                  "type": "string",
                  "internalType": "string"
                }
              ]
            }
          ]
        }
      ],
      "outputs": [],
      "stateMutability": "nonpayable"
    },
    {
      "type": "function",
      "name": "contractType",
      "inputs": [],
      "outputs": [{ "name": "", "type": "bytes32", "internalType": "bytes32" }],
      "stateMutability": "pure"
    },
    {
      "type": "function",
      "name": "contractVersion",
      "inputs": [],
      "outputs": [{ "name": "", "type": "uint8", "internalType": "uint8" }],
      "stateMutability": "pure"
    },
    {
      "type": "function",
      "name": "defaultExtensions",
      "inputs": [],
      "outputs": [{ "name": "", "type": "address", "internalType": "address" }],
      "stateMutability": "view"
    },
    {
      "type": "function",
      "name": "disableFunctionInExtension",
      "inputs": [
        {
          "name": "_extensionName",
          "type": "string",
          "internalType": "string"
        },
        {
          "name": "_functionSelector",
          "type": "bytes4",
          "internalType": "bytes4"
        }
      ],
      "outputs": [],
      "stateMutability": "nonpayable"
    },
    {
      "type": "function",
      "name": "enableFunctionInExtension",
      "inputs": [
        {
          "name": "_extensionName",
          "type": "string",
          "internalType": "string"
        },
        {
          "name": "_function",
          "type": "tuple",
          "internalType": "struct IExtension.ExtensionFunction",
          "components": [
            {
              "name": "functionSelector",
              "type": "bytes4",
              "internalType": "bytes4"
            },
            {
              "name": "functionSignature",
              "type": "string",
              "internalType": "string"
            }
          ]
        }
      ],
      "outputs": [],
      "stateMutability": "nonpayable"
    },
    {
      "type": "function",
      "name": "getAllExtensions",
      "inputs": [],
      "outputs": [
        {
          "name": "allExtensions",
          "type": "tuple[]",
          "internalType": "struct IExtension.Extension[]",
          "components": [
            {
              "name": "metadata",
              "type": "tuple",
              "internalType": "struct IExtension.ExtensionMetadata",
              "components": [
                { "name": "name", "type": "string", "internalType": "string" },
                {
                  "name": "metadataURI",
                  "type": "string",
                  "internalType": "string"
                },
                {
                  "name": "implementation",
                  "type": "address",
                  "internalType": "address"
                }
              ]
            },
            {
              "name": "functions",
              "type": "tuple[]",
              "internalType": "struct IExtension.ExtensionFunction[]",
              "components": [
                {
                  "name": "functionSelector",
                  "type": "bytes4",
                  "internalType": "bytes4"
                },
                {
                  "name": "functionSignature",
                  "type": "string",
                  "internalType": "string"
                }
              ]
            }
          ]
        }
      ],
      "stateMutability": "view"
    },
    {
      "type": "function",
      "name": "getApprovedCurrency",
      "inputs": [],
      "outputs": [
        { "name": "", "type": "address[10]", "internalType": "address[10]" }
      ],
      "stateMutability": "view"
    },
    {
      "type": "function",
      "name": "getExtension",
      "inputs": [
        { "name": "extensionName", "type": "string", "internalType": "string" }
      ],
      "outputs": [
        {
          "name": "",
          "type": "tuple",
          "internalType": "struct IExtension.Extension",
          "components": [
            {
              "name": "metadata",
              "type": "tuple",
              "internalType": "struct IExtension.ExtensionMetadata",
              "components": [
                { "name": "name", "type": "string", "internalType": "string" },
                {
                  "name": "metadataURI",
                  "type": "string",
                  "internalType": "string"
                },
                {
                  "name": "implementation",
                  "type": "address",
                  "internalType": "address"
                }
              ]
            },
            {
              "name": "functions",
              "type": "tuple[]",
              "internalType": "struct IExtension.ExtensionFunction[]",
              "components": [
                {
                  "name": "functionSelector",
                  "type": "bytes4",
                  "internalType": "bytes4"
                },
                {
                  "name": "functionSignature",
                  "type": "string",
                  "internalType": "string"
                }
              ]
            }
          ]
        }
      ],
      "stateMutability": "view"
    },
    {
      "type": "function",
      "name": "getImplementationForFunction",
      "inputs": [
        {
          "name": "_functionSelector",
          "type": "bytes4",
          "internalType": "bytes4"
        }
      ],
      "outputs": [{ "name": "", "type": "address", "internalType": "address" }],
      "stateMutability": "view"
    },
    {
      "type": "function",
      "name": "getIsApprovedCurrency",
      "inputs": [
        { "name": "_currency", "type": "address", "internalType": "address" }
      ],
      "outputs": [
        { "name": "isApprovedCurrency", "type": "bool", "internalType": "bool" }
      ],
      "stateMutability": "view"
    },
    {
      "type": "function",
      "name": "getMetadataForFunction",
      "inputs": [
        {
          "name": "functionSelector",
          "type": "bytes4",
          "internalType": "bytes4"
        }
      ],
      "outputs": [
        {
          "name": "",
          "type": "tuple",
          "internalType": "struct IExtension.ExtensionMetadata",
          "components": [
            { "name": "name", "type": "string", "internalType": "string" },
            {
              "name": "metadataURI",
              "type": "string",
              "internalType": "string"
            },
            {
              "name": "implementation",
              "type": "address",
              "internalType": "address"
            }
          ]
        }
      ],
      "stateMutability": "view"
    },
    {
      "type": "function",
      "name": "getRoleAdmin",
      "inputs": [
        { "name": "role", "type": "bytes32", "internalType": "bytes32" }
      ],
      "outputs": [{ "name": "", "type": "bytes32", "internalType": "bytes32" }],
      "stateMutability": "view"
    },
    {
      "type": "function",
      "name": "getRoleMember",
      "inputs": [
        { "name": "role", "type": "bytes32", "internalType": "bytes32" },
        { "name": "index", "type": "uint256", "internalType": "uint256" }
      ],
      "outputs": [
        { "name": "member", "type": "address", "internalType": "address" }
      ],
      "stateMutability": "view"
    },
    {
      "type": "function",
      "name": "getRoleMemberCount",
      "inputs": [
        { "name": "role", "type": "bytes32", "internalType": "bytes32" }
      ],
      "outputs": [
        { "name": "count", "type": "uint256", "internalType": "uint256" }
      ],
      "stateMutability": "view"
    },
    {
      "type": "function",
      "name": "getRoyalty",
      "inputs": [
        {
          "name": "tokenAddress",
          "type": "address",
          "internalType": "address"
        },
        { "name": "tokenId", "type": "uint256", "internalType": "uint256" },
        { "name": "value", "type": "uint256", "internalType": "uint256" }
      ],
      "outputs": [
        {
          "name": "recipients",
          "type": "address[]",
          "internalType": "address payable[]"
        },
        { "name": "amounts", "type": "uint256[]", "internalType": "uint256[]" }
      ],
      "stateMutability": "nonpayable"
    },
    {
      "type": "function",
      "name": "getRoyaltyEngineAddress",
      "inputs": [],
      "outputs": [
        {
          "name": "royaltyEngineAddress",
          "type": "address",
          "internalType": "address"
        }
      ],
      "stateMutability": "view"
    },
    {
      "type": "function",
      "name": "grantRole",
      "inputs": [
        { "name": "role", "type": "bytes32", "internalType": "bytes32" },
        { "name": "account", "type": "address", "internalType": "address" }
      ],
      "outputs": [],
      "stateMutability": "nonpayable"
    },
    {
      "type": "function",
      "name": "hasRole",
      "inputs": [
        { "name": "role", "type": "bytes32", "internalType": "bytes32" },
        { "name": "account", "type": "address", "internalType": "address" }
      ],
      "outputs": [{ "name": "", "type": "bool", "internalType": "bool" }],
      "stateMutability": "view"
    },
    {
      "type": "function",
      "name": "hasRoleWithSwitch",
      "inputs": [
        { "name": "role", "type": "bytes32", "internalType": "bytes32" },
        { "name": "account", "type": "address", "internalType": "address" }
      ],
      "outputs": [{ "name": "", "type": "bool", "internalType": "bool" }],
      "stateMutability": "view"
    },
    {
      "type": "function",
      "name": "initialize",
      "inputs": [
        {
          "name": "_extensionManagerAddress",
          "type": "address",
          "internalType": "address"
        },
        {
          "name": "_trustedForwarders",
          "type": "address[]",
          "internalType": "address[]"
        },
        {
          "name": "_listingType",
          "type": "uint8",
          "internalType": "enum IDirectListings.ListingType"
        },
        { "name": "_duration", "type": "uint128", "internalType": "uint128" },
        { "name": "_price", "type": "uint256", "internalType": "uint256" },
        { "name": "_currency", "type": "address", "internalType": "address" },
        { "name": "_priceFeed", "type": "address", "internalType": "address" }
      ],
      "outputs": [],
      "stateMutability": "nonpayable"
    },
    {
      "type": "function",
      "name": "isTrustedForwarder",
      "inputs": [
        { "name": "forwarder", "type": "address", "internalType": "address" }
      ],
      "outputs": [{ "name": "", "type": "bool", "internalType": "bool" }],
      "stateMutability": "view"
    },
    {
      "type": "function",
      "name": "multicall",
      "inputs": [
        { "name": "data", "type": "bytes[]", "internalType": "bytes[]" }
      ],
      "outputs": [
        { "name": "results", "type": "bytes[]", "internalType": "bytes[]" }
      ],
      "stateMutability": "nonpayable"
    },
    {
      "type": "function",
      "name": "onERC1155BatchReceived",
      "inputs": [
        { "name": "", "type": "address", "internalType": "address" },
        { "name": "", "type": "address", "internalType": "address" },
        { "name": "", "type": "uint256[]", "internalType": "uint256[]" },
        { "name": "", "type": "uint256[]", "internalType": "uint256[]" },
        { "name": "", "type": "bytes", "internalType": "bytes" }
      ],
      "outputs": [{ "name": "", "type": "bytes4", "internalType": "bytes4" }],
      "stateMutability": "nonpayable"
    },
    {
      "type": "function",
      "name": "onERC1155Received",
      "inputs": [
        { "name": "", "type": "address", "internalType": "address" },
        { "name": "", "type": "address", "internalType": "address" },
        { "name": "", "type": "uint256", "internalType": "uint256" },
        { "name": "", "type": "uint256", "internalType": "uint256" },
        { "name": "", "type": "bytes", "internalType": "bytes" }
      ],
      "outputs": [{ "name": "", "type": "bytes4", "internalType": "bytes4" }],
      "stateMutability": "nonpayable"
    },
    {
      "type": "function",
      "name": "onERC721Received",
      "inputs": [
        { "name": "", "type": "address", "internalType": "address" },
        { "name": "", "type": "address", "internalType": "address" },
        { "name": "", "type": "uint256", "internalType": "uint256" },
        { "name": "", "type": "bytes", "internalType": "bytes" }
      ],
      "outputs": [{ "name": "", "type": "bytes4", "internalType": "bytes4" }],
      "stateMutability": "nonpayable"
    },
    {
      "type": "function",
      "name": "removeApprovedCurrency",
      "inputs": [
        { "name": "currency", "type": "address", "internalType": "address" }
      ],
      "outputs": [],
      "stateMutability": "nonpayable"
    },
    {
      "type": "function",
      "name": "removeExtension",
      "inputs": [
        { "name": "_extensionName", "type": "string", "internalType": "string" }
      ],
      "outputs": [],
      "stateMutability": "nonpayable"
    },
    {
      "type": "function",
      "name": "renounceRole",
      "inputs": [
        { "name": "role", "type": "bytes32", "internalType": "bytes32" },
        { "name": "account", "type": "address", "internalType": "address" }
      ],
      "outputs": [],
      "stateMutability": "nonpayable"
    },
    {
      "type": "function",
      "name": "replaceExtension",
      "inputs": [
        {
          "name": "_extension",
          "type": "tuple",
          "internalType": "struct IExtension.Extension",
          "components": [
            {
              "name": "metadata",
              "type": "tuple",
              "internalType": "struct IExtension.ExtensionMetadata",
              "components": [
                { "name": "name", "type": "string", "internalType": "string" },
                {
                  "name": "metadataURI",
                  "type": "string",
                  "internalType": "string"
                },
                {
                  "name": "implementation",
                  "type": "address",
                  "internalType": "address"
                }
              ]
            },
            {
              "name": "functions",
              "type": "tuple[]",
              "internalType": "struct IExtension.ExtensionFunction[]",
              "components": [
                {
                  "name": "functionSelector",
                  "type": "bytes4",
                  "internalType": "bytes4"
                },
                {
                  "name": "functionSignature",
                  "type": "string",
                  "internalType": "string"
                }
              ]
            }
          ]
        }
      ],
      "outputs": [],
      "stateMutability": "nonpayable"
    },
    {
      "type": "function",
      "name": "revokeRole",
      "inputs": [
        { "name": "role", "type": "bytes32", "internalType": "bytes32" },
        { "name": "account", "type": "address", "internalType": "address" }
      ],
      "outputs": [],
      "stateMutability": "nonpayable"
    },
    {
      "type": "function",
      "name": "setApprovedCurrency",
      "inputs": [
        { "name": "currency", "type": "address", "internalType": "address" },
        { "name": "priceFeed", "type": "address", "internalType": "address" }
      ],
      "outputs": [],
      "stateMutability": "nonpayable"
    },
    {
      "type": "function",
      "name": "setListingPlan",
      "inputs": [
        {
          "name": "_listingType",
          "type": "uint8",
          "internalType": "enum IDirectListings.ListingType"
        },
        { "name": "_duration", "type": "uint128", "internalType": "uint128" },
        { "name": "_price", "type": "uint256", "internalType": "uint256" }
      ],
      "outputs": [],
      "stateMutability": "nonpayable"
    },
    {
      "type": "function",
      "name": "setRoyaltyEngine",
      "inputs": [
        {
          "name": "_royaltyEngineAddress",
          "type": "address",
          "internalType": "address"
        }
      ],
      "outputs": [],
      "stateMutability": "nonpayable"
    },
    {
      "type": "function",
      "name": "supportsInterface",
      "inputs": [
        { "name": "interfaceId", "type": "bytes4", "internalType": "bytes4" }
      ],
      "outputs": [{ "name": "", "type": "bool", "internalType": "bool" }],
      "stateMutability": "view"
    },
    {
      "type": "event",
      "name": "CurrencyRemoved",
      "inputs": [
        {
          "name": "_currency",
          "type": "address",
          "indexed": true,
          "internalType": "address"
        }
      ],
      "anonymous": false
    },
    {
      "type": "event",
      "name": "CurrencySet",
      "inputs": [
        {
          "name": "_currency",
          "type": "address",
          "indexed": true,
          "internalType": "address"
        },
        {
          "name": "_priceFeed",
          "type": "address",
          "indexed": true,
          "internalType": "address"
        }
      ],
      "anonymous": false
    },
    {
      "type": "event",
      "name": "ExtensionAdded",
      "inputs": [
        {
          "name": "name",
          "type": "string",
          "indexed": true,
          "internalType": "string"
        },
        {
          "name": "implementation",
          "type": "address",
          "indexed": true,
          "internalType": "address"
        },
        {
          "name": "extension",
          "type": "tuple",
          "indexed": false,
          "internalType": "struct IExtension.Extension",
          "components": [
            {
              "name": "metadata",
              "type": "tuple",
              "internalType": "struct IExtension.ExtensionMetadata",
              "components": [
                { "name": "name", "type": "string", "internalType": "string" },
                {
                  "name": "metadataURI",
                  "type": "string",
                  "internalType": "string"
                },
                {
                  "name": "implementation",
                  "type": "address",
                  "internalType": "address"
                }
              ]
            },
            {
              "name": "functions",
              "type": "tuple[]",
              "internalType": "struct IExtension.ExtensionFunction[]",
              "components": [
                {
                  "name": "functionSelector",
                  "type": "bytes4",
                  "internalType": "bytes4"
                },
                {
                  "name": "functionSignature",
                  "type": "string",
                  "internalType": "string"
                }
              ]
            }
          ]
        }
      ],
      "anonymous": false
    },
    {
      "type": "event",
      "name": "ExtensionRemoved",
      "inputs": [
        {
          "name": "name",
          "type": "string",
          "indexed": true,
          "internalType": "string"
        },
        {
          "name": "extension",
          "type": "tuple",
          "indexed": false,
          "internalType": "struct IExtension.Extension",
          "components": [
            {
              "name": "metadata",
              "type": "tuple",
              "internalType": "struct IExtension.ExtensionMetadata",
              "components": [
                { "name": "name", "type": "string", "internalType": "string" },
                {
                  "name": "metadataURI",
                  "type": "string",
                  "internalType": "string"
                },
                {
                  "name": "implementation",
                  "type": "address",
                  "internalType": "address"
                }
              ]
            },
            {
              "name": "functions",
              "type": "tuple[]",
              "internalType": "struct IExtension.ExtensionFunction[]",
              "components": [
                {
                  "name": "functionSelector",
                  "type": "bytes4",
                  "internalType": "bytes4"
                },
                {
                  "name": "functionSignature",
                  "type": "string",
                  "internalType": "string"
                }
              ]
            }
          ]
        }
      ],
      "anonymous": false
    },
    {
      "type": "event",
      "name": "ExtensionReplaced",
      "inputs": [
        {
          "name": "name",
          "type": "string",
          "indexed": true,
          "internalType": "string"
        },
        {
          "name": "implementation",
          "type": "address",
          "indexed": true,
          "internalType": "address"
        },
        {
          "name": "extension",
          "type": "tuple",
          "indexed": false,
          "internalType": "struct IExtension.Extension",
          "components": [
            {
              "name": "metadata",
              "type": "tuple",
              "internalType": "struct IExtension.ExtensionMetadata",
              "components": [
                { "name": "name", "type": "string", "internalType": "string" },
                {
                  "name": "metadataURI",
                  "type": "string",
                  "internalType": "string"
                },
                {
                  "name": "implementation",
                  "type": "address",
                  "internalType": "address"
                }
              ]
            },
            {
              "name": "functions",
              "type": "tuple[]",
              "internalType": "struct IExtension.ExtensionFunction[]",
              "components": [
                {
                  "name": "functionSelector",
                  "type": "bytes4",
                  "internalType": "bytes4"
                },
                {
                  "name": "functionSignature",
                  "type": "string",
                  "internalType": "string"
                }
              ]
            }
          ]
        }
      ],
      "anonymous": false
    },
    {
      "type": "event",
      "name": "FunctionDisabled",
      "inputs": [
        {
          "name": "name",
          "type": "string",
          "indexed": true,
          "internalType": "string"
        },
        {
          "name": "functionSelector",
          "type": "bytes4",
          "indexed": true,
          "internalType": "bytes4"
        },
        {
          "name": "extMetadata",
          "type": "tuple",
          "indexed": false,
          "internalType": "struct IExtension.ExtensionMetadata",
          "components": [
            { "name": "name", "type": "string", "internalType": "string" },
            {
              "name": "metadataURI",
              "type": "string",
              "internalType": "string"
            },
            {
              "name": "implementation",
              "type": "address",
              "internalType": "address"
            }
          ]
        }
      ],
      "anonymous": false
    },
    {
      "type": "event",
      "name": "FunctionEnabled",
      "inputs": [
        {
          "name": "name",
          "type": "string",
          "indexed": true,
          "internalType": "string"
        },
        {
          "name": "functionSelector",
          "type": "bytes4",
          "indexed": true,
          "internalType": "bytes4"
        },
        {
          "name": "extFunction",
          "type": "tuple",
          "indexed": false,
          "internalType": "struct IExtension.ExtensionFunction",
          "components": [
            {
              "name": "functionSelector",
              "type": "bytes4",
              "internalType": "bytes4"
            },
            {
              "name": "functionSignature",
              "type": "string",
              "internalType": "string"
            }
          ]
        },
        {
          "name": "extMetadata",
          "type": "tuple",
          "indexed": false,
          "internalType": "struct IExtension.ExtensionMetadata",
          "components": [
            { "name": "name", "type": "string", "internalType": "string" },
            {
              "name": "metadataURI",
              "type": "string",
              "internalType": "string"
            },
            {
              "name": "implementation",
              "type": "address",
              "internalType": "address"
            }
          ]
        }
      ],
      "anonymous": false
    },
    {
      "type": "event",
      "name": "Initialized",
      "inputs": [
        {
          "name": "version",
          "type": "uint8",
          "indexed": false,
          "internalType": "uint8"
        }
      ],
      "anonymous": false
    },
    {
      "type": "event",
      "name": "ListingPlanSet",
      "inputs": [
        {
          "name": "duration",
          "type": "uint128",
          "indexed": true,
          "internalType": "uint128"
        },
        {
          "name": "price",
          "type": "uint256",
          "indexed": true,
          "internalType": "uint256"
        }
      ],
      "anonymous": false
    },
    {
      "type": "event",
      "name": "RoleAdminChanged",
      "inputs": [
        {
          "name": "role",
          "type": "bytes32",
          "indexed": true,
          "internalType": "bytes32"
        },
        {
          "name": "previousAdminRole",
          "type": "bytes32",
          "indexed": true,
          "internalType": "bytes32"
        },
        {
          "name": "newAdminRole",
          "type": "bytes32",
          "indexed": true,
          "internalType": "bytes32"
        }
      ],
      "anonymous": false
    },
    {
      "type": "event",
      "name": "RoleGranted",
      "inputs": [
        {
          "name": "role",
          "type": "bytes32",
          "indexed": true,
          "internalType": "bytes32"
        },
        {
          "name": "account",
          "type": "address",
          "indexed": true,
          "internalType": "address"
        },
        {
          "name": "sender",
          "type": "address",
          "indexed": true,
          "internalType": "address"
        }
      ],
      "anonymous": false
    },
    {
      "type": "event",
      "name": "RoleRevoked",
      "inputs": [
        {
          "name": "role",
          "type": "bytes32",
          "indexed": true,
          "internalType": "bytes32"
        },
        {
          "name": "account",
          "type": "address",
          "indexed": true,
          "internalType": "address"
        },
        {
          "name": "sender",
          "type": "address",
          "indexed": true,
          "internalType": "address"
        }
      ],
      "anonymous": false
    },
    {
      "type": "event",
      "name": "RoyaltyEngineUpdated",
      "inputs": [
        {
          "name": "previousAddress",
          "type": "address",
          "indexed": true,
          "internalType": "address"
        },
        {
          "name": "newAddress",
          "type": "address",
          "indexed": true,
          "internalType": "address"
        }
      ],
      "anonymous": false
    },
    {
      "type": "error",
      "name": "InvalidCodeAtRange",
      "inputs": [
        { "name": "_size", "type": "uint256", "internalType": "uint256" },
        { "name": "_start", "type": "uint256", "internalType": "uint256" },
        { "name": "_end", "type": "uint256", "internalType": "uint256" }
      ]
    },
    { "type": "error", "name": "WriteError", "inputs": [] },
    {
      "type": "error",
      "name": "__ApprovedCurrency_CurrencyNotApproved",
      "inputs": [
        { "name": "_currency", "type": "address", "internalType": "address" }
      ]
    },
    {
      "type": "error",
      "name": "__Router_InvalidListingType",
      "inputs": [
        {
          "name": "listingType",
          "type": "uint8",
          "internalType": "enum IDirectListings.ListingType"
        }
      ]
    },
    { "type": "error", "name": "__Router_UnauthorizedToCall", "inputs": [] }
  

  ]
  
});