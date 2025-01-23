// SPDX-License-Identifier: MIT
pragma solidity 0.8.24;
import {Test, console} from "forge-std/Test.sol";
import {Marketplace} from "../script/DeployMarketplace.s.sol";
import {MarketplaceRouter} from "../src/MarketplaceRouter.sol";
import {DirectListingsLogic} from "../src/extensions/directListings/DirectListingsLogic.sol";
import {IDirectListings} from "../src/extensions/directListings/IDirectListings.sol";
import {ERC721Mock} from "./mocks/ERC721Mock.sol";
import {ERC1155Mock} from "./mocks/ERC1155Mock.sol";
import {Strings} from "openzeppelin-contract/utils/Strings.sol";
import {IERC721} from "openzeppelin-contract/token/ERC721/ERC721.sol";
import {ERC20Mock} from "openzeppelin-contract/mocks/token/ERC20Mock.sol";
import {OfferLogic} from "../src/extensions/offer/OfferLogic.sol";
import {OfferStorage} from "../src/extensions/offer/OfferStorage.sol";
import {IOffer} from "../src/extensions/offer/IOffer.sol";
import {AuctionLogic} from "../src/extensions/auction/AuctionLogic.sol";
import {IAuction} from "../src/extensions/auction/IAuction.sol";

contract MarketplaceTest is Test {
    Marketplace marketplace;
    address payable market;
    ERC721Mock erc721Mock;
    ERC20Mock erc20Mock;
    ERC1155Mock erc1155Mock;

    address private constant NATIVE_TOKEN_ADDRESS = 0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE;

    uint256 private constant  DEFAULT_ETH_BALANCE = 100_000 ether;
    uint256 private constant DEFAULT_ERC20_BALANCE = 100_000e18;
    address manager;
    address pricefeed;

    
    function setUp() external {
        
        marketplace = new Marketplace();
        erc721Mock = new ERC721Mock();
        erc20Mock = new ERC20Mock();
        erc1155Mock = new ERC1155Mock();
        (market, manager, pricefeed) = marketplace.run();
        for (uint160 index = 1; index <= 100; index++) {
            erc721Mock.mint(address(index));
            erc20Mock.mint(address(index), DEFAULT_ERC20_BALANCE);
            erc1155Mock.mint(address(index), 1);
            vm.deal(address(index), DEFAULT_ETH_BALANCE);
        }
        vm.startPrank(manager);
        IDirectListings.ListingType  _advancedListingType = IDirectListings.ListingType.ADVANCED;
        MarketplaceRouter(market).setListingPlan(_advancedListingType, 30 days, 30);
        IDirectListings.ListingType  _proListingType = IDirectListings.ListingType.PRO;
        MarketplaceRouter(market).setListingPlan(_proListingType, 60 days, 60);
        MarketplaceRouter(market).setApprovedCurrency(address(erc20Mock), pricefeed);
        vm.stopPrank();
    }

    function testRouterVersion() external view {
        uint8 version = MarketplaceRouter(market).contractVersion();
        assertEq(version, 1);
    }

    function testCannotCallExtensionsWhenNotInitialized() external {
        vm.prank(address(1));
        vm.expectRevert();
        DirectListingsLogic(market).getListing(1);
    }

    function testOnlyExtensionManagerCanCallSetListingPlan() external {
        vm.prank(address(1));
        vm.expectRevert();
        MarketplaceRouter(market).setListingPlan(IDirectListings.ListingType.BASIC, 10 days,  10);
    }

        /*//////////////////////////////////////////////////////////////
                           DIRECTLISTINGS-TEST
    //////////////////////////////////////////////////////////////*/

    function testCreateListingWorks() public returns(uint256 id){
        IDirectListings.ListingParameters memory listingParameters = IDirectListings.ListingParameters({
        assetContract: address(erc721Mock),
        tokenId: 1,
        currency: NATIVE_TOKEN_ADDRESS,
        pricePerToken: 1e18,
        listingType: IDirectListings.ListingType.BASIC,
        reserved: false
        });

        address owner = erc721Mock.ownerOf(1);
        address isApproved = erc721Mock.getApproved(1);
        console.log("owner", owner);
        console.log("isApproved", isApproved);
        
         vm.startPrank(address(1));
         uint256 balance = address(1).balance;
         console.log("balance", balance);
         erc721Mock.approve(market, 1);
       id =  DirectListingsLogic(market).createListing{value: 28 ether}(listingParameters);
        vm.stopPrank();
        console.log("market", market.balance);
        console.log("this", address(this).balance);
        assert(market.balance == 28 ether);
    }
    function testCreateListingWorksWith1155() public returns(uint256 id){
        IDirectListings.ListingParameters memory listingParameters = IDirectListings.ListingParameters({
        assetContract: address(erc1155Mock),
        tokenId: 1,
        currency:  address(erc20Mock),
        pricePerToken: 1e18,
        listingType: IDirectListings.ListingType.BASIC,
        reserved: false
        });
          uint256 marketBalBefore = erc20Mock.balanceOf(market);
         vm.startPrank(address(1));
         uint256 balance = address(1).balance;
         console.log("balance", balance);
         erc1155Mock.setApprovalForAll(market, true);
       erc20Mock.approve(market, 28e18);
       id =  DirectListingsLogic(market).createListing(listingParameters);
        uint256 marketBalAfter = erc20Mock.balanceOf(market);
        vm.stopPrank();
        console.log("market", market.balance);
        console.log("this", address(this).balance);
        assertGt(marketBalAfter, marketBalBefore);
    }

    function testCreateListingWorksWithERC20() public returns(uint256 id){
        IDirectListings.ListingParameters memory listingParameters = IDirectListings.ListingParameters({
        assetContract: address(erc721Mock),
        tokenId: 1,
        currency: address(erc20Mock),
        pricePerToken: 1e18,
        listingType: IDirectListings.ListingType.BASIC,
        reserved: false
        });

        uint256 marketBalBefore = erc20Mock.balanceOf(market);
         vm.startPrank(address(1));
         uint256 balance = address(1).balance;
         console.log("balance", balance);
         erc721Mock.approve(market, 1);
         erc20Mock.approve(market, 28e18);
       id =  DirectListingsLogic(market).createListing(listingParameters);
        uint256 marketBalAfter = erc20Mock.balanceOf(market);

        vm.stopPrank();
        console.log("market", market.balance);
        console.log("this", address(this).balance);
        assertGt(marketBalAfter, marketBalBefore);
    }

    function testFuzzCreateListingWorks(uint256 caller, uint256 pricePerToken, uint256 listing, bool _reserved, uint256 _fee) external {
        caller = bound(caller, 1, 50);
        listing = bound(listing, 0, 2);
        _fee = bound(_fee, 28 ether, 100_000 ether);
        IDirectListings.ListingType[3] memory listingType = [IDirectListings.ListingType.BASIC, IDirectListings.ListingType.ADVANCED, IDirectListings.ListingType.PRO];

         IDirectListings.ListingParameters memory listingParameters = IDirectListings.ListingParameters({
        assetContract: address(erc721Mock),
        tokenId: caller,
        currency: NATIVE_TOKEN_ADDRESS,
        pricePerToken: pricePerToken,
        listingType: listingType[listing],
        reserved: _reserved
        });
     
      vm.startPrank(address(uint160(caller)));
      erc721Mock.approve(market, caller);
        DirectListingsLogic(market).createListing{value: 200 ether}(listingParameters);
        vm.stopPrank();
        assert(market.balance == 200 ether);
    }
    

    function testBuyFromListingWorks() external {
     uint256 listingId = testCreateListingWorks();
     uint256 previousAddress1Bal = address(1).balance;
     uint256 erc721Address2BalBefore = erc721Mock.balanceOf(address(2));
       vm.prank(address(2));
        DirectListingsLogic(market).buyFromListing{value: 1e18}(1, address(2));
        uint256 latestAddress1Bal = address(1).balance;
        uint256 erc721Address2BalLatest = erc721Mock.balanceOf(address(2));
        uint256 expectedAddress1bal = latestAddress1Bal - previousAddress1Bal;
        assertEq(expectedAddress1bal , 1e18);
        assertEq(erc721Address2BalBefore + 1, erc721Address2BalLatest);
    }
    function testBuyFromListingWorksWithERC20() external {
     uint256 listingId = testCreateListingWorksWithERC20();
     uint256 previousAddress1Bal = address(1).balance;
     uint256 erc721Address2BalBefore = erc721Mock.balanceOf(address(2));
       vm.startPrank(address(2));
       erc20Mock.approve(market, 28e18);
        DirectListingsLogic(market).buyFromListing(1, address(2));
        vm.stopPrank();
        uint256 latestAddress1Bal = address(1).balance;
        uint256 erc721Address2BalLatest = erc721Mock.balanceOf(address(2));

       
    }
    function testBuyFromListingWorksWith1155() external {
     uint256 listingId = testCreateListingWorksWith1155();
     uint256 previousAddress1Bal = address(1).balance;
     uint256 erc721Address2BalBefore = erc721Mock.balanceOf(address(2));
       vm.startPrank(address(2));
       erc20Mock.approve(market, 28e18);
        DirectListingsLogic(market).buyFromListing(1, address(2));
        vm.stopPrank();
        uint256 latestAddress1Bal = address(1).balance;
        uint256 erc721Address2BalLatest = erc721Mock.balanceOf(address(2));

       
    }

    function testFuzzBuyFromListingWorks(uint256 listingId, uint256 caller, uint256 fee) external {
        for (uint256 index = 51; index <= 100; index++) {
        IDirectListings.ListingParameters memory listingParameters = IDirectListings.ListingParameters({
        assetContract: address(erc721Mock),
        tokenId: index,
        currency: NATIVE_TOKEN_ADDRESS,
        pricePerToken: 1e18,
        listingType: IDirectListings.ListingType.BASIC,
        reserved: false
        });
          vm.startPrank(address(uint160(index))); 
         erc721Mock.approve(market, index);
       DirectListingsLogic(market).createListing{value: 28 ether}(listingParameters);
        vm.stopPrank();
       
        }
         caller = bound(caller, 1, 50);
         listingId = bound(listingId, 1, 50);
         fee = bound(fee, 1 ether, 100_000 ether);
          vm.prank(address(uint160(caller)));
        DirectListingsLogic(market).buyFromListing{value: fee}(listingId, address(uint160(caller)));
    }

    function testUpdateListingWorks() external {
      uint256 listingId = testCreateListingWorks();
          IDirectListings.UpdateListingParameters memory updateListingParameters =   IDirectListings.UpdateListingParameters({
         currency: NATIVE_TOKEN_ADDRESS,
         pricePerToken: 100e18
    });
    IDirectListings.Listing memory listing = DirectListingsLogic(market).getListing(listingId);
    uint256 priceBefore = listing.pricePerToken;
    console.log("priceBefore", priceBefore);
      vm.prank(address(1));
       DirectListingsLogic(market).updateListing(listingId, updateListingParameters);
        IDirectListings.Listing memory _listing = DirectListingsLogic(market).getListing(listingId);
       uint256 priceAfter = _listing.pricePerToken;
    console.log("priceAfter", priceAfter);
    assert(priceAfter == 100e18);
    }

    function testUpdateListingPlanWorks() external {
         uint256 listingId = testCreateListingWorks();
         IDirectListings.ListingType _proListingType = IDirectListings.ListingType.PRO;
         vm.prank(address(1));
         DirectListingsLogic(market).updatedListingPlan{value: 163 ether}(listingId, _proListingType);
    }

    function testCancelListingWorks() external {
      uint256 listingId = testCreateListingWorks();
       IDirectListings.ListingParameters memory listingParameters = IDirectListings.ListingParameters({
        assetContract: address(erc721Mock),
        tokenId: 2,
        currency: NATIVE_TOKEN_ADDRESS,
        pricePerToken: 100e18,
        listingType: IDirectListings.ListingType.ADVANCED,
        reserved: false
        });

        // address owner = erc721Mock.ownerOf(1);
        // address isApproved = erc721Mock.getApproved(1);
        // console.log("owner", owner);
        // console.log("isApproved", isApproved);
        
         vm.startPrank(address(2));
        //  uint256 balance = address(2).balance;
        //  console.log("balance", balance);
         erc721Mock.approve(market, 2);
      uint256 id =  DirectListingsLogic(market).createListing{value: 83 ether}(listingParameters);
        vm.stopPrank();
        vm.prank(address(1));
       DirectListingsLogic(market).cancelListing(listingId);
    }

    function testApproveBuyerForListingWorks() public returns(uint256 listingId){

          listingId = testCreateListingWorks();
         vm.prank(address(1));
         DirectListingsLogic(market).approveBuyerForListing(1, address(2));
         

        
    }

    function testRemoveApprovedBuyerForListingWorks() external {
        uint256 listingId = testApproveBuyerForListingWorks();
        vm.prank(address(1));
        DirectListingsLogic(market).removeApprovedBuyerForListing(listingId);
        IDirectListings.Listing memory _listing = DirectListingsLogic(market).getListing(listingId);
        bool reserved = _listing.reserved;
        assertEq(false, reserved);
    }

    function testCheckUpKeepAndPerformUpKeepWorks() external {
         uint256 listingId = testCreateListingWorks();
          IDirectListings.ListingParameters memory listingParameters = IDirectListings.ListingParameters({
        assetContract: address(erc721Mock),
        tokenId: 2,
        currency: NATIVE_TOKEN_ADDRESS,
        pricePerToken: 100e18,
        listingType: IDirectListings.ListingType.ADVANCED,
        reserved: false
        });

        // address owner = erc721Mock.ownerOf(1);
        // address isApproved = erc721Mock.getApproved(1);
        // console.log("owner", owner);
        // console.log("isApproved", isApproved);
        
         vm.startPrank(address(2));
        //  uint256 balance = address(2).balance;
        //  console.log("balance", balance);
         erc721Mock.approve(market, 2);
       DirectListingsLogic(market).createListing{value: 83 ether}(listingParameters);
        vm.stopPrank();
        IDirectListings.Listing[] memory _listings = DirectListingsLogic(market).getAllListings();
        console.log(_listings[0].tokenId);
        console.log(_listings[1].tokenId);

          IDirectListings.Listing memory _listing = DirectListingsLogic(market).getListing(listingId);
        uint256 endTimestamp = _listing.endTimestamp;
        vm.warp(endTimestamp);
        DirectListingsLogic(market).performUpkeep("");
        IDirectListings.Listing[] memory _listingArr = DirectListingsLogic(market).getAllListings();
        console.log(_listingArr[0].tokenId);
        assertEq(_listingArr.length, 1);


    }

        /*//////////////////////////////////////////////////////////////
                               OFFER-TEST
    //////////////////////////////////////////////////////////////*/

    function testMakeOfferWorks() public returns(uint256, uint256) {
     uint256 id = testCreateListingWorksWithERC20();
      IOffer.OfferParams memory offer = IOffer.OfferParams({
        totalPrice: 10e18,
        duration: 2 days
      });
      vm.startPrank(address(2));
      erc20Mock.approve(market, 10e18);
      uint256 offerId = OfferLogic(market).makeOffer(offer, id);
      vm.stopPrank();
      return (offerId, id);
    }

 function testCancelOfferWorks() external {
     (uint256 offerId, uint256 id) = testMakeOfferWorks();
      vm.startPrank(address(2));
     OfferLogic(market).cancelOffer(offerId, id);
     vm.stopPrank();
 }

 function testAcceptOfferWorks() external {
    (uint256 offerId, uint256 id) = testMakeOfferWorks();
    vm.startPrank(address(1));
    OfferLogic(market).acceptOffer(offerId, id);
         vm.stopPrank();

 }
    function testRejectOfferWorks() external {
    (uint256 offerId, uint256 id) = testMakeOfferWorks();
    vm.startPrank(address(1));
    OfferLogic(market).rejectOffer(offerId, id);
         vm.stopPrank();

 }

     /*//////////////////////////////////////////////////////////////
                              AUCTION-TEST
    //////////////////////////////////////////////////////////////*/

    function testCreateAuctionWorks() public  returns(uint256 auctionId){
      IAuction.AuctionParameters memory auction = IAuction.AuctionParameters({
         assetContract: address(erc721Mock),
         tokenId: 1,
         currency: NATIVE_TOKEN_ADDRESS,
         minimumBidAmount: 5 ether,
         buyoutBidAmount: 10 ether,
         bidBufferBps: 10,
         startTimestamp: uint64(block.timestamp),
         endTimestamp: uint64(block.timestamp) + 30 minutes
      });
      vm.startPrank(address(1));
       erc721Mock.approve(market, 1);
      auctionId = AuctionLogic(market).createAuction(auction);
       vm.stopPrank();
    }

    function testCancelAuctionWorks() external {
      uint256 auctionId = testCreateAuctionWorks();
            vm.startPrank(address(1));
       AuctionLogic(market).cancelAuction(auctionId);
              vm.stopPrank();

    }

    function testUpdateAuctionWorks() external {
     uint256 auctionId = testCreateAuctionWorks();
           IAuction.UpdateAuctionParameters memory updateAuction = IAuction.UpdateAuctionParameters({
         currency: address(erc20Mock),
         minimumBidAmount: 6 ether,
         buyoutBidAmount: 12 ether,
         bidBufferBps: 11,
         startTimestamp: uint64(block.timestamp),
         endTimestamp: uint64(block.timestamp) + 50 minutes
           });

            vm.startPrank(address(1));
        AuctionLogic(market).updateAuction(auctionId, updateAuction);
    }

    function testBidInAuctionWorks() public returns(uint256) {
           uint256 auctionId = testCreateAuctionWorks();
       
           vm.startPrank(address(2));
            AuctionLogic(market).bidInAuction{value: 5 ether}(auctionId, 5 ether);
            vm.stopPrank();
            uint256 addTwoBalBefore = address(2).balance;
           vm.startPrank(address(3));
            AuctionLogic(market).bidInAuction{value: 10 ether}(auctionId, 10 ether);
            vm.stopPrank();
            return auctionId;
             uint256 addTwoBalAfter = address(2).balance;
           assertEq(addTwoBalAfter - addTwoBalBefore, 5 ether);
  
    }

    function testCollectAuctionPayoutWorks() external {
      uint256 auctionId = testBidInAuctionWorks();
       uint256 addOneBalBefore = address(1).balance;
      vm.startPrank(address(1));
      AuctionLogic(market).collectAuctionPayout(auctionId);
           vm.stopPrank();
        uint256 addOneBalAfter = address(1).balance;

        assertGt(addOneBalAfter, addOneBalBefore);
    }
    function testCollectAuctionTokenWorks() external {
      uint256 auctionId = testBidInAuctionWorks();
      vm.startPrank(address(3));
      AuctionLogic(market).collectAuctionTokens(auctionId);
        vm.stopPrank();
             address owner = erc721Mock.ownerOf(1);

        assertEq(owner, address(3));
    }

      
}
