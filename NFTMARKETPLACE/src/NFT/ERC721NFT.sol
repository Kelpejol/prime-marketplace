// SPDX-License-Identifier: MIT
pragma solidity 0.8.24;

import {ERC721} from "openzeppelin-contract/token/ERC721/ERC721.sol";
import {ERC721URIStorage} from "openzeppelin-contract/token/ERC721/extensions/ERC721URIStorage.sol";
import {Ownable} from "openzeppelin-contract/access/Ownable.sol";

contract ERC721NFT is ERC721, Ownable, ERC721URIStorage{

    uint256 private s_tokenId;

    constructor(string memory name, string memory symbol, string memory _tokenUri) ERC721(name, symbol) Ownable(msg.sender){
       mint(_tokenUri);
    }
  
  function mint(string memory _tokenUri) public onlyOwner{
    s_tokenId++;
  _setTokenURI(s_tokenId, _tokenUri);
  _mint(msg.sender, s_tokenId);
  }

   function supportsInterface(bytes4 interfaceId) public view virtual override(ERC721, ERC721URIStorage) returns (bool) {
        return interfaceId == type(ERC721).interfaceId || 
        interfaceId == type(ERC721URIStorage).interfaceId ||
        super.supportsInterface(interfaceId);
    }

    function tokenURI(uint256 _tokenId) public  view virtual override(ERC721, ERC721URIStorage) returns (string memory) {
    return super.tokenURI(_tokenId);
    }

    
}