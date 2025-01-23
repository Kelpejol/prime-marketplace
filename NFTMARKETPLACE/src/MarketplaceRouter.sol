// SPDX-License-Identifier: MIT

pragma solidity 0.8.24;

import {BaseRouter} from "thirdweb-dynamic/src/presets/BaseRouter.sol";

import {Initializable} from "thirdweb-contract/extension/upgradeable/Initializable.sol";
import {PermissionsEnumerable, PermissionsStorage, Permissions} from "thirdweb-contract/extension/upgradeable/PermissionsEnumerable.sol";
import {ERC2771ContextUpgradeable} from "thirdweb-contract/extension/upgradeable/ERC2771ContextUpgradeable.sol";
import {Multicall} from "thirdweb-contract/extension/Multicall.sol";
import {RoyaltyPaymentsLogic} from "thirdweb-contract/extension/upgradeable/RoyaltyPayments.sol";
import {ReentrancyGuardInit} from "thirdweb-contract/extension/upgradeable/init/ReentrancyGuardInit.sol";


import {ERC721Holder} from "openzeppelin-contract/token/ERC721/utils/ERC721Holder.sol";
import {ERC1155Holder} from "openzeppelin-contract/token/ERC1155/utils/ERC1155Holder.sol";
import {IERC165} from "openzeppelin-contract/interfaces/IERC165.sol";

import {IDirectListings, DirectListingsStorage} from "./extensions/directListings/DirectListingsStorage.sol";
import {ApprovedCurrencyLib} from "./chainlink/priceFeed/ApprovedCurrencyLib.sol";
import {ApprovedCurrencyLibStorage} from "./chainlink/priceFeed/ApprovedCurrencyLibStorage.sol";


contract MarketplaceRouter is
    IERC165,
    Initializable,
    BaseRouter,
    PermissionsEnumerable,
    RoyaltyPaymentsLogic,
    ERC2771ContextUpgradeable,
    Multicall,
    ERC721Holder,
    ERC1155Holder,
    ReentrancyGuardInit
{
    bytes32 private constant EXTENSION_MANAGER_ROLE =
        keccak256(bytes("EXTENSION_MANAGER_ROLE"));

    bytes32 private constant MODULE_TYPE = bytes32("MarketplaceProxy");

    uint8 private constant VERSION = 1;

    event ListingPlanSet(
        uint128 indexed duration,
        uint256 indexed price
    );

    error __Router_InvalidListingType(IDirectListings.ListingType listingType);
    error __Router_UnauthorizedToCall();

    modifier onlyExtensionManager() {
        bool hasRole = _hasRole(EXTENSION_MANAGER_ROLE, msg.sender);
        if (!hasRole) {
            revert __Router_UnauthorizedToCall();
        }
        _;
    }
    struct MarketplaceRouterParams {
        Extension[] _extensions;
        address royaltyEngineAddress;
    }

   
    constructor(MarketplaceRouterParams memory marketplaceRouterParams) 
    BaseRouter(marketplaceRouterParams._extensions) 
    RoyaltyPaymentsLogic(marketplaceRouterParams.royaltyEngineAddress){
        _disableInitializers();
    }

    function initialize(
        address _extensionManagerAddress,
        address[] memory _trustedForwarders,
        IDirectListings.ListingType _listingType,
        uint128 _duration,
        uint256 _price,
        address _currency,
        address _priceFeed
    ) external initializer {
        __BaseRouter_init();

        __ERC2771Context_init(_trustedForwarders);
        __ReentrancyGuard_init();

        //-- SET UP ROLES
        _setupRole(DEFAULT_ADMIN_ROLE, _extensionManagerAddress);
        _setupRole(EXTENSION_MANAGER_ROLE, _extensionManagerAddress);
        _setupRole(keccak256("LISTER_ROLE"), address(0));
        _setRoleAdmin(EXTENSION_MANAGER_ROLE, EXTENSION_MANAGER_ROLE);

        setListingPlan(_listingType, _duration, _price);
        setApprovedCurrency(_currency, _priceFeed);
    }

    receive() external payable {}

    function contractType() external pure returns (bytes32) {
        return MODULE_TYPE;
    }

    function contractVersion() external pure returns (uint8) {
        return VERSION;
    }

    function setListingPlan(
        IDirectListings.ListingType _listingType,
        uint128 _duration,
        uint256 _price
    ) public onlyExtensionManager {
        if (_listingType == IDirectListings.ListingType.BASIC) {
            IDirectListings.BASIC memory basic = IDirectListings.BASIC({
                duration: _duration,
                price: _price
            });
            _getListingStorageData().Basic = basic;
        } else if (_listingType == IDirectListings.ListingType.ADVANCED) {
            IDirectListings.ADVANCED memory advanced = IDirectListings
                .ADVANCED({duration: _duration, price: _price});
            _getListingStorageData().Advanced = advanced;
        } else if (_listingType == IDirectListings.ListingType.PRO) {
            IDirectListings.PRO memory pro = IDirectListings.PRO({
                duration: _duration,
                price: _price
            });
            _getListingStorageData().Pro = pro;
        } else {
            revert __Router_InvalidListingType(_listingType);
        }
        emit ListingPlanSet(_duration, _price);
    }

    function setApprovedCurrency(
        address currency,
        address priceFeed
    ) public onlyExtensionManager {
        ApprovedCurrencyLib._setApprovedCurrency(currency, priceFeed);
    }
    function removeApprovedCurrency(
        address currency
    ) public onlyExtensionManager {
        ApprovedCurrencyLib._removeApprovedCurrency(currency);
    }

    function getApprovedCurrency() public view returns(address[10] memory){
    address[10] memory _currency = ApprovedCurrencyLibStorage.data().currency;
    return _currency;
    }

    function supportsInterface(
        bytes4 interfaceId
    ) public view override(IERC165, ERC1155Holder) returns (bool) {
        return (interfaceId == type(ERC1155Holder).interfaceId ||
            interfaceId == type(ERC721Holder).interfaceId ||
            super.supportsInterface(interfaceId));
    }

//           function checkUpkeep(
//         bytes memory /*checkData*/
//     ) public view returns (bool upkeepNeeded, bytes memory performData) {

//  AuctionStorage.Data storage data =  _getAuctionStorageData();       
//         if(data.endTimeToId[uint128(block.timestamp)].length > 0 ) {
//             upkeepNeeded = true;
//             performData = abi.encode(data.endTimeToId[uint128(block.timestamp)]);
//         }    
//        return (upkeepNeeded, performData);
//     }

//      function performUpkeep(bytes calldata /*performData*/) external {
//         (bool upkeepNeeded, bytes memory  performData) = checkUpkeep("");
//  AuctionStorage.Data storage data =  _getAuctionStorageData();       
//         Auction[] memory auctionArr = data.auctions;

//         if(upkeepNeeded) {
//              if(auctionArr.length == 1) {
//                delete data.endTimeToId[uint128(block.timestamp)];
//                 data.auctions.pop();
//              }
//            uint256[] memory _auctionId = abi.decode(performData, (uint256[]));

//            if(_auctionId.length == 1) {
//              delete data.endTimeToId[uint128(block.timestamp)];
//              int256 index = data.auctionIdToIndex[_auctionId[0]];
//              uint256 len = auctionArr.length;
//              uint256 _lastAuctionId = auctionArr[len - 1].auctionId;

//              data.auctions[uint256(index)] = (data.auctions[len - 1]);
//              data.auctionIdToIndex[_lastAuctionId] = index;
//              data.auctionIdToIndex[_auctionId[0]] = -1;
//              data.auctions.pop();
//            } 
//            else {
//                 delete data.endTimeToId[uint128(block.timestamp)];
//              for (uint256 i = 0; i < _auctionId.length; ++i) {        
//              int256 index = data.auctionIdToIndex[_auctionId[i]];
//              uint256 len = auctionArr.length;
//              uint256 _lastAuctionId = auctionArr[len - 1].auctionId;
//              data.auctions[uint256(index)] = (data.auctions[len - 1]);
//              data.auctionIdToIndex[_lastAuctionId] = index;
//              data.auctionIdToIndex[_auctionId[i]] = -1;
//              data.auctions.pop();
          
//            }
//            }               
//         }
//       }

    function _hasRole(
        bytes32 _role,
        address _account
    ) internal view returns (bool) {
        PermissionsStorage.Data storage data = PermissionsStorage.data();
        return data._hasRole[_role][_account];
    }

    function _isAuthorizedCallToUpgrade()
        internal
        view
        override
        returns (bool)
    {
        return _hasRole(EXTENSION_MANAGER_ROLE, msg.sender);
    }

    function _getListingStorageData()
        internal
        pure
        returns (DirectListingsStorage.Data storage _data)
    {
        _data = DirectListingsStorage.data();
    }

     function getIsApprovedCurrency(
        address _currency
    ) external view returns (bool isApprovedCurrency) {
        isApprovedCurrency = _getApprovedCurrencyStorageData()
            .currencyToIsInserted[_currency];
    }

     function _getApprovedCurrencyStorageData()
        internal
        pure
        returns (ApprovedCurrencyLibStorage.Data storage _data)
    {
        _data = ApprovedCurrencyLibStorage.data();
    }



    function _msgSender()
        internal
        view
        override(ERC2771ContextUpgradeable, Permissions, Multicall)
        returns (address sender)
    {
        return ERC2771ContextUpgradeable._msgSender();
    }

    function _msgData()
        internal
        view
        override(ERC2771ContextUpgradeable, Permissions)
        returns (bytes calldata)
    {
        return ERC2771ContextUpgradeable._msgData();
    }

    function _canSetRoyaltyEngine() internal view override returns (bool) {
         return _hasRole(EXTENSION_MANAGER_ROLE, msg.sender);
    }
}
