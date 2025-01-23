// SPDX-License-Identifier: MIT
pragma solidity 0.8.24;

import {IOffer} from "./IOffer.sol";

library OfferStorage{



    struct Data {
    mapping(uint256 listingId => mapping(uint256 offerId => IOffer.Offer offer)) listingIdToOffer;
    mapping(uint256 listingId => uint256 offerCount) listingIdToOfferCount;
    }

      /// @custom:storage-location erc7201:offer.storage
    bytes32 public constant OFFER_STORAGE_POSITION = keccak256(
        abi.encode(uint256(keccak256("offer.storage")) -1)) 
        &
        ~bytes32(uint256(0xff));
    
     

    function data() internal pure returns (Data storage _data) {
        bytes32 position = OFFER_STORAGE_POSITION;
        assembly {
            _data.slot := position
        }
        
    } 
}