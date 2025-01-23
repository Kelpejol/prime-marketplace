// SPDX-License-Identifier: MIT
pragma solidity 0.8.24;


library OracleStorage {

    struct Info {
        uint256 id;
        
    }

    struct Data { 
    mapping(uint128 endTimeStamp => uint256[] auctionId) endTimeToId;
    }





  /// @custom:storage-location erc7201:oracle.storage
    bytes32 public constant ORACLE_STORAGE_POSITION = keccak256(
        abi.encode(uint256(keccak256("oracle.storage")) -1)) 
        &
        ~bytes32(uint256(0xff));
    


    

    function data() internal pure returns (Data storage _data) {
        bytes32 position = ORACLE_STORAGE_POSITION;
        assembly {
            _data.slot := position
        }
        
    } 
}
