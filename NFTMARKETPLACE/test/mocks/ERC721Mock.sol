// SPDX-License-Identifier: MIT
pragma solidity 0.8.24; 

import {ERC721} from "openzeppelin-contract/token/ERC721/ERC721.sol";


contract ERC721Mock is ERC721 {

    uint256 private tokenId;

    constructor() ERC721("AZUKI", "AZK") {

    }

    function mint(address _to) external {
        tokenId += 1;
       _safeMint(_to, tokenId);
    }

}