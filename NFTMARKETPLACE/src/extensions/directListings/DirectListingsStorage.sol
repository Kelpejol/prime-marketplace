// SPDX-License-Identifier: MIT
pragma solidity 0.8.24;

import {IDirectListings} from "./IDirectListings.sol";

library DirectListingsStorage {

    


    struct Data {
    uint256 ListingId;
    IDirectListings.BASIC Basic;
    IDirectListings.ADVANCED Advanced;
    IDirectListings.PRO Pro;
    mapping(uint256 listingId => int256 index) listingIdToIndex;
    IDirectListings.Listing[] listings;
    mapping(bytes32 buyerRole => address buyer) approvedBuyer;
    mapping(uint128 endTimeStamp => uint256[] listingId) endTimeToId;
    }
    

    /// @custom:storage-location erc7201:direct.listings.storage
    bytes32 public constant DIRECT_LISTINGS_STORAGE_POSITION = keccak256(
        abi.encode(uint256(keccak256("direct.listings.storage")) -1)) 
        &
        ~bytes32(uint256(0xff));
    


    

    function data() internal pure returns (Data storage _data) {
        bytes32 position = DIRECT_LISTINGS_STORAGE_POSITION;
        assembly {
            _data.slot := position
        }
        
    } 
}
