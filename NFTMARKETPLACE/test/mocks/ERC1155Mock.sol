// SPDX-License-Identifier: MIT
pragma solidity 0.8.24;
import {ERC1155} from "openzeppelin-contract/token/ERC1155/ERC1155.sol";


contract ERC1155Mock is ERC1155 {
    uint256 private tokenId;
    constructor() ERC1155("ipfs://"){}

    function mint(address to, uint256 amount) external {
         tokenId += 1;
        _mint(to, tokenId, amount, "");
    }
}