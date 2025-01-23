// SPDX-License-Identifier: MIT
pragma solidity 0.8.24;

import {Script} from "forge-std/Script.sol";
import {MockV3Aggregator} from "chainlink-contract/contracts/src/v0.8/tests/MockV3Aggregator.sol";
import {WMATIC} from "../../test/mocks/WMATICMock.sol";

contract ChainConfig is Script {
    Network public activeNetworkConfig;

    uint8 constant private DECIMALS = 8;
    int256 constant private ANSWER = 37e6;
   
    uint256 private constant DEFAULT_ANVIL_KEY =
        0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80;
    uint256 private DEPLOYER_KEY = vm.envUint("PRIVATE_KEY");

    constructor() {
        if (block.chainid == 80002) {
            activeNetworkConfig = getPolygonAmoyConfig();
        }
        activeNetworkConfig = getOrCreateAnvilConfig();
    }
       
    struct Network {
        address pricefeed;
        address WMATIC;
        uint256 deployerKey;
        address manager;
    }
       

   
    function getPolygonAmoyConfig() internal returns (Network memory) {
        vm.startBroadcast(DEPLOYER_KEY);
         WMATIC wmatic = new WMATIC();
         vm.stopBroadcast();

        Network memory polygonAmoyconfig = Network({
            pricefeed: 0x001382149eBa3441043c1c66972b4772963f5D43, 
            WMATIC: address(wmatic),
            deployerKey: DEPLOYER_KEY,
            manager: 0xBF2492901e51fd2f8D25B91CdBba538624b228B4
        });
        return polygonAmoyconfig;
    }

    function getOrCreateAnvilConfig() internal returns (Network memory) {
        if (activeNetworkConfig.pricefeed != address(0)) {
            return activeNetworkConfig;
        }

       vm.startBroadcast(DEFAULT_ANVIL_KEY);
        MockV3Aggregator priceFeed = new MockV3Aggregator(DECIMALS, ANSWER);    
         WMATIC wmatic = new WMATIC();  
        vm.stopBroadcast();
        Network memory anvilConfig = Network({    
            pricefeed: address(priceFeed),
             WMATIC: address(wmatic),
             deployerKey: DEFAULT_ANVIL_KEY,
             manager: 0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266
        });
        return anvilConfig;
    }

    

   
}
