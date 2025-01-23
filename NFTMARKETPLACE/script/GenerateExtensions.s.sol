// SPDX-License-Identifier: MIT
pragma solidity 0.8.24;
import {Script} from "forge-std/Script.sol";

import {IExtension} from "thirdweb-dynamic/src/interface/IExtension.sol";
import {DirectListingsLogic} from "../src/extensions/directListings/DirectListingsLogic.sol";
import {OfferLogic} from "../src/extensions/offer/OfferLogic.sol";
import {AuctionLogic} from "../src/extensions/auction/AuctionLogic.sol";
import {ChainConfig} from "./config/ChainConfig.s.sol";

contract GenerateExtensions is Script {
    DirectListingsLogic directListingsLogic;
    address wmatic;
    uint256 deployerKey;
    OfferLogic offerLogic;
    AuctionLogic auctionLogic;

    function run() external returns(IExtension.Extension[] memory) {
        ChainConfig config = new ChainConfig();
        ( , wmatic, deployerKey, ) = config.activeNetworkConfig();
        vm.startBroadcast(deployerKey);
        directListingsLogic = new DirectListingsLogic(address(wmatic));
        offerLogic = new OfferLogic(address(wmatic));
        auctionLogic = new AuctionLogic(address(wmatic));
        vm.stopBroadcast(); 
        return generateExt();
    }

    function generateDirectListingLogicExtension() internal view returns(IExtension.Extension memory) {
        IExtension.ExtensionMetadata memory directListingExtensionMetadata = IExtension.ExtensionMetadata({
            name: "DirectListingsLogic",  // Changed to more unique name
            metadataURI: "ipfs://DirectListingsLogic",  // Added unique URI
            implementation: address(directListingsLogic)
        });

        // Function signatures must exactly match the contract
        string[15] memory funcSig = [
            "approveBuyerForListing(uint256,address)",
            "removeApprovedBuyerForListing(uint256)",
            "getListingType(uint8)",
            "getPlatformFee(address,uint256)",
            "getAllListings()",
            "getAllValidListings()",
            "getListing(uint256)",
            "updatedListingPlan(uint256,uint8)",
            "updateListing(uint256,(address,uint256))",
            "performUpkeep(bytes)",
            "checkUpkeep(bytes)",
            "createListing((address,uint256,address,uint256,uint8,bool))",
            "cancelListing(uint256)",
            "buyFromListing(uint256,address)",
            "getApprovedBuyer(uint256)"

        ];

        IExtension.ExtensionFunction[] memory functions = new IExtension.ExtensionFunction[](funcSig.length);
        for(uint256 i = 0; i < funcSig.length; ++i) {
            functions[i] = IExtension.ExtensionFunction({
                functionSelector: bytes4(keccak256(bytes(funcSig[i]))),
                functionSignature: funcSig[i]
            });
        }

        return IExtension.Extension({
            metadata: directListingExtensionMetadata,
            functions: functions
        });
    }

    function generateOfferLogicExtension() internal view returns(IExtension.Extension memory) {
        IExtension.ExtensionMetadata memory offerExtensionMetadata = IExtension.ExtensionMetadata({
            name: "OfferLogic",  // Changed to more unique name
            metadataURI: "ipfs://OfferLogic",  // Added unique URI
            implementation: address(offerLogic)
        });

        string[6] memory funcSig = [
            "cancelOffer(uint256,uint256)", 
            "makeOffer((uint256,uint128),uint256)", 
            "acceptOffer(uint256,uint256)",
            "getOffer(uint256,uint256)",
            "rejectOffer(uint256,uint256)",
            "getAllOffers(uint256)"
        ];

        IExtension.ExtensionFunction[] memory functions = new IExtension.ExtensionFunction[](funcSig.length);
        for(uint256 i = 0; i < funcSig.length; ++i) {
            functions[i] = IExtension.ExtensionFunction({
                functionSelector: bytes4(keccak256(bytes(funcSig[i]))),
                functionSignature: funcSig[i]
            });
        }

        return IExtension.Extension({
            metadata: offerExtensionMetadata,
            functions: functions
        });
    }

    function generateAuctionLogicExtension() internal view returns(IExtension.Extension memory) {
        IExtension.ExtensionMetadata memory auctionExtensionMetadata = IExtension.ExtensionMetadata({
            name: "AuctionLogic",  // Changed to more unique name
            metadataURI: "ipfs://AuctionLogic",  // Added unique URI
            implementation: address(auctionLogic)
        });

        string[11] memory funcSig = [
            "createAuction((address,uint256,address,uint256,uint256,uint64,uint64,uint64))",
            "cancelAuction(uint256)",
            "collectAuctionPayout(uint256)",
            "collectAuctionTokens(uint256)",
            "updateAuction(uint256,(address,uint256,uint256,uint64,uint64,uint64))",
            "bidInAuction(uint256,uint256)",
            "isNewWinningBid(uint256,uint256)",
            "getAuction(uint256)",
            "getAllAuctions()",
            "getWinningBid(uint256)",
            "isAuctionExpired(uint256)"
            
        ];

        IExtension.ExtensionFunction[] memory functions = new IExtension.ExtensionFunction[](funcSig.length);
        for(uint256 i = 0; i < funcSig.length; ++i) {
            functions[i] = IExtension.ExtensionFunction({
                functionSelector: bytes4(keccak256(bytes(funcSig[i]))),
                functionSignature: funcSig[i]
            });
        }

        return IExtension.Extension({
            metadata: auctionExtensionMetadata,
            functions: functions
        });
    }

    function generateExt() internal returns(IExtension.Extension[] memory) {
        IExtension.Extension[] memory extensionArr = new IExtension.Extension[](3);
        // extensionArr[0] = generateDirectListingLogicExtension();
        extensionArr[0] = generateOfferLogicExtension();
        extensionArr[1] = generateAuctionLogicExtension();
        extensionArr[2] = generateDirectListingLogicExtension();
        return extensionArr;
    }
}