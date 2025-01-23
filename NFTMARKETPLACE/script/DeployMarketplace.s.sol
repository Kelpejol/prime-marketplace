// SPDX-License-Identifier: MIT
pragma solidity 0.8.24;

import {Script} from "forge-std/Script.sol";
import {GenerateExtensions} from "./GenerateExtensions.s.sol";
import {MarketplaceRouter} from "../src/MarketplaceRouter.sol";
import {IExtension} from "thirdweb-dynamic/src/interface/IExtension.sol";
import {IDirectListings} from "../src/extensions/directListings/IDirectListings.sol";
import { TWProxy } from "thirdweb-contract/infra/TWProxy.sol";
import {ChainConfig} from "./config/ChainConfig.s.sol";



contract Marketplace is Script {

    address public marketplace;
    address manager;
    address private constant NATIVE_TOKEN = 0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE;
    address pricefeed;
    uint256 deployerKey;
    
    function run() external returns(address payable, address, address){

        GenerateExtensions generateExtensions = new GenerateExtensions();
        IExtension.Extension[] memory extensions = generateExtensions.run();
        MarketplaceRouter.MarketplaceRouterParams memory _params = MarketplaceRouter.MarketplaceRouterParams({
            _extensions: extensions,
            royaltyEngineAddress: address(0)
        });
         ChainConfig config = new ChainConfig();
         (pricefeed, , deployerKey, manager) = config.activeNetworkConfig();
         vm.startBroadcast(deployerKey);

        address proxy = address(new TWProxy(address(new MarketplaceRouter(_params)), abi.encodeCall(
                    MarketplaceRouter.initialize,
                    (manager, new address[](0), IDirectListings.ListingType.BASIC , 30 days,  20, NATIVE_TOKEN,  pricefeed)
                )
            )
        );
        
         MarketplaceRouter(payable(proxy)).setListingPlan(IDirectListings.ListingType.ADVANCED, 60 days, 30);
         MarketplaceRouter(payable(proxy)).setListingPlan(IDirectListings.ListingType.PRO, 90 days, 60);

        vm.stopBroadcast();
        return (payable(proxy), manager, pricefeed);
    }
}
