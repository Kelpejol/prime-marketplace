//SPDX-License-Identifier: MIT
pragma solidity 0.8.24;
import {ERC721NFT} from "./ERC721NFT.sol";

contract NFTGenerator {



    function createNft(string memory name, string memory symbol, string memory _tokenUri) external returns(address){
     ERC721NFT erc721Nft  = new ERC721NFT(name, symbol, _tokenUri);
     return address(erc721Nft);
    }

}