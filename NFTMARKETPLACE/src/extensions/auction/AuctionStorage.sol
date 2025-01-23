
// SPDX-License-Identifier: MIT
pragma solidity 0.8.24;
import {IAuction} from "./IAuction.sol";


library AuctionStorage {

    struct Data {
    uint256 auctionId;
    mapping(uint256 auctionId => int256 index) auctionIdToIndex;
    IAuction.Auction[] auctions;
    mapping(uint128 endTimeStamp => uint256[] auctionId) endTimeToId;
    mapping(uint256 auctionId => IAuction.HighestBid highestBid) auctionIdToHighestBid;

    }





  /// @custom:storage-location erc7201:auction.storage
    bytes32 public constant AUCTION_STORAGE_POSITION = keccak256(
        abi.encode(uint256(keccak256("auction.storage")) -1)) 
        &
        ~bytes32(uint256(0xff));
    


    

    function data() internal pure returns (Data storage _data) {
        bytes32 position = AUCTION_STORAGE_POSITION;
        assembly {
            _data.slot := position
        }
        
    } 
}
