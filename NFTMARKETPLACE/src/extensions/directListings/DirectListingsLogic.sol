// SPDX-License-Identifier: MIT
pragma solidity 0.8.24;

/// @author <6pillz>

/**
 *  The `DirectListings` extension smart contract lets you buy and sell NFTs (ERC-721 or ERC-1155) for a fixed price.
 */

import {IERC721} from "openzeppelin-contract/token/ERC721/ERC721.sol";
import {IERC1155} from "openzeppelin-contract/token/ERC1155/ERC1155.sol";
import {IERC165} from "openzeppelin-contract/interfaces/IERC165.sol";
import {IERC20, SafeERC20} from "openzeppelin-contract/token/ERC20/utils/SafeERC20.sol";
import {ERC20} from "openzeppelin-contract/token/ERC20/ERC20.sol";

import {Strings} from "openzeppelin-contract/utils/Strings.sol";


import {ERC2771ContextConsumer} from "thirdweb-contract/extension/upgradeable/ERC2771ContextConsumer.sol";
import {ReentrancyGuard} from "thirdweb-contract/extension/upgradeable/ReentrancyGuard.sol";
import {Permissions} from "thirdweb-contract/extension/upgradeable/PermissionsEnumerable.sol";
import {CurrencyTransferLib} from "thirdweb-contract/lib/CurrencyTransferLib.sol";
import {RoyaltyPaymentsLogic} from "thirdweb-contract/extension/upgradeable/RoyaltyPayments.sol";

import {IDirectListings, DirectListingsStorage} from "./DirectListingsStorage.sol";
import {ApprovedCurrencyLibStorage} from "../../chainlink/priceFeed/ApprovedCurrencyLibStorage.sol";
import {ApprovedCurrencyLib} from "../../chainlink/priceFeed/ApprovedCurrencyLib.sol";


contract DirectListingsLogic is
    ERC2771ContextConsumer,
    ReentrancyGuard,
    IDirectListings
{
     using SafeERC20 for IERC20;
     using Strings for uint256;

         /*//////////////////////////////////////////////////////////////
                         CONSTANTS / IMMUTABLES
    //////////////////////////////////////////////////////////////*/
   
    /// @dev Additional time buffer to start a listing
    uint128 private constant START_TIME_BUFFER = 1 minutes;
    /// @dev Address of the chain native token e.g eth, matic
    address private constant NATIVE_TOKEN =
        0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE;
    /// @dev Additional buffer for native token calculation to retain precision
    uint64 private constant MATIC_BUFFER = 1e18;
    /// @dev Address of the native token wrapper which wraps native token to erc20 token e.g weth
    address private immutable nativeTokenWrapper;
    /// @dev Only address with this role can create listings (i.e) to prevent users from interacting with contract when not initialized by the proxy
    bytes32 private constant LISTER_ROLE = keccak256("LISTER_ROLE");

        /*//////////////////////////////////////////////////////////////
                         MODIFIERS
    //////////////////////////////////////////////////////////////*/
    /// @dev Checks whether caller has lister role
    modifier onlyLister() {
        address _sender = _msgSender();
        bool isPermissionedToCall = Permissions(address(this))
            .hasRoleWithSwitch(LISTER_ROLE, _sender);
        if (!isPermissionedToCall) {
            revert __DirectListing_InvalidAccessToCall(_sender);
        }
        _;
    }


        /*//////////////////////////////////////////////////////////////
                         CONSTRUCTOR LOGIC
    //////////////////////////////////////////////////////////////*/

    constructor(address _nativeTokenWrapper) {
       nativeTokenWrapper = _nativeTokenWrapper;
    }

        /*//////////////////////////////////////////////////////////////
                           EXTERNAL FUNCTIONS
    //////////////////////////////////////////////////////////////*/
   
    /// @notice List NFTs (ERC721 or ERC1155) for sale at a fixed price on condition the user pays the platform fee with the provided approved currency
    function createListing(
        ListingParameters memory _params
    ) external payable onlyLister returns (uint256 _id) {
        address lister = _msgSender();
        TokenType _tokenType = _validateListing(_params, lister);
        (uint128 duration, uint256 price) = _getListingTypeInfo(
            _params.listingType
        );
       uint256 fee = _getPlatformFee(_params.currency, price);
       if(_params.currency == NATIVE_TOKEN) {
         if(fee > msg.value) {
         revert __DirectListing_TransferFailed();
        }
       }
       else {
         IERC20(_params.currency).safeTransferFrom(lister, address(this), fee);
       }

        
          _id = listingId();
        uint128 startTime;
        unchecked {
           startTime =  uint128(block.timestamp) + START_TIME_BUFFER;
            }
            uint128 endTime;
            unchecked {
                endTime = startTime + duration;
            }
        Listing memory listing = Listing({
             listingId: _id,
            listingCreator: lister,
            assetContract: _params.assetContract,
            tokenId: _params.tokenId,
            currency: _params.currency,
            pricePerToken: _params.pricePerToken,
            startTimestamp: startTime,
            endTimestamp: endTime,
            reserved: _params.reserved,
            tokenType: _tokenType,
            status: IDirectListings.Status.CREATED,
            listingType: _params.listingType
        });
      emit NewListingCreated(lister, _id, _params.assetContract, listing);
       _getListingStorageData().listings.push(listing);
       uint256 index = (_getListingStorageData().listings.length) - 1;
        _getListingStorageData().listingIdToIndex[_id] = int256(index);
         _getListingStorageData().endTimeToId[endTime].push(_id);
        
       }
    

    
   /// @notice Buy NFTs from a listing.
     
    function buyFromListing(
        uint256 _listingId,
        address _buyFor    
    ) external payable nonReentrant {
       address _buyer = _msgSender();
        DirectListingsStorage.Data storage data = _getListingStorageData();
        int256 index = data.listingIdToIndex[_listingId];
         Listing memory listing = _getListing(_listingId, data);
       _validateBuyerFromListing(_listingId, data, _buyFor, _buyer, listing);
       address _currency = listing.currency;
      _validateERC20AllowanceAndBalanceOrNativeTokenAmount(_currency,listing.pricePerToken, _buyer);
      data.listings[uint256(index)].status = Status.SOLD;
     emit NewSale(listing.listingCreator, _listingId, listing.assetContract, listing.tokenId, _buyer, listing.pricePerToken);
     _payout(_currency, listing.pricePerToken, _buyer, listing.listingCreator, listing.assetContract, listing.tokenId);
     _transferListingToken(listing.tokenType, listing.tokenId, listing.listingCreator, listing.assetContract, _buyFor);
    }


     /// @notice Update parameters of a listing of NFTs.
    function updateListing(
        uint256 _listingId,
        UpdateListingParameters memory _params
    ) external {
        address lister = _msgSender();
        DirectListingsStorage.Data storage data = _getListingStorageData();
         int256 index = data.listingIdToIndex[_listingId];
         Listing memory listing = _getListing(_listingId, data);
       if(listing.listingCreator != lister) {
        revert __DirectListing_NotAuthorizedToUpdate();
       }
       _validateListingCurrency(_params.currency);
       Listing memory updatedListing = Listing({
            listingId: _listingId,
            listingCreator: lister,
            assetContract: listing.assetContract,
            tokenId: listing.tokenId,
            currency: _params.currency,
            pricePerToken: _params.pricePerToken,
            startTimestamp:  listing.startTimestamp,
            endTimestamp: listing.endTimestamp,
            reserved: listing.reserved,
            tokenType: listing.tokenType,
            status: Status.CREATED,
            listingType: listing.listingType
        });
        emit ListingUpdated(_params.currency, _params.pricePerToken );
        _getListingStorageData().listings[uint256(index)] = updatedListing;
        
    }

      /// @notice Updates listing plan of a listing
     function updatedListingPlan(uint256 _listingId, ListingType _listingType) external payable {
         address lister = _msgSender();
       DirectListingsStorage.Data storage data = _getListingStorageData();
         int256 index = data.listingIdToIndex[_listingId];
         Listing memory listing = _getListing(_listingId, data);
       if(listing.listingCreator != lister) {
        revert __DirectListing_NotAuthorizedToUpdate();
       }
       (uint128 duration, uint256 price) = _getListingTypeInfo(
           _listingType
        );
       uint256 fee = _getPlatformFee(listing.currency, price);
      if(listing.currency == NATIVE_TOKEN) {
         if(fee > msg.value) {
         revert __DirectListing_TransferFailed();
        }
       }
       else {
         IERC20(listing.currency).safeTransferFrom(lister, address(this), fee);
       }

            uint128 endTime;
            unchecked {
                endTime = listing.endTimestamp + duration;
            }
             emit ListingPlanUpdated(endTime);
             delete _getListingStorageData().endTimeToId[listing.endTimestamp];
            _getListingStorageData().listings[uint256(index)].endTimestamp = endTime;
             _getListingStorageData().endTimeToId[endTime].push(_listingId);
       
    }
    
    /// @notice Cancel a listing.
    function cancelListing(uint256 _listingId) external onlyLister {
         address lister = _msgSender();
        DirectListingsStorage.Data storage data = _getListingStorageData();
         int256 index = data.listingIdToIndex[_listingId];
         
        Listing[] memory listingArr = data.listings;
         Listing memory listing = _getListing(_listingId, data);
        string memory listingIdStr = Strings.toString(_listingId);
       bytes32 buyerRole = keccak256(abi.encode(listingIdStr));
       uint256 length = listingArr.length;
       if(listing.listingCreator != lister || listing.status != Status.CREATED) {
        revert __DirectListing_NotAuthorizedToCancel();
       }
       emit CancelledListing(lister, _listingId);
       data.listings[uint256(index)].status = Status.CANCELLED;
      _removeApprovedBuyer(buyerRole, _listingId);
       uint256 newListingId = listingArr[uint256(index)].listingId;
       if(length == 1) {
        _getListingStorageData().listings.pop();
       } else {
        // swap listing with last listing and remove cancelled listing
       _getListingStorageData().listings[uint256(index)] =  listingArr[length - 1];
       _getListingStorageData().listings.pop();

       // update idToIndex mapping, pointing the last listing to the cancelled listing index
       _getListingStorageData().listingIdToIndex[newListingId] = index;
       _getListingStorageData().listingIdToIndex[_listingId] = -1;
       }

    }
   /// @notice Approve a buyer to buy from a listing.
    function approveBuyerForListing(
        uint256 _listingId,
        address _buyer
        
    ) external {
        address lister = _msgSender();
        DirectListingsStorage.Data storage data = _getListingStorageData();
         int256 index = data.listingIdToIndex[_listingId];
        Listing memory listing = _getListing(_listingId, data);
       if(listing.listingCreator != lister ) {
        revert __DirectListing_NotAuthorizedToApproveBuyerForListing();
       }
       string memory listingIdStr = Strings.toString(_listingId);
       bytes32 buyerRole = keccak256(abi.encode(listingIdStr));
       emit BuyerApprovedForListing(_listingId, _buyer);
      bool isAdded = _addApproveBuyer(buyerRole, _buyer, _listingId);
      if(!isAdded) {
        revert __DirectListing_CanOnlyApproveABuyer();
      }
       _getListingStorageData().listings[uint256(index)].reserved = true;
    }

    /// @notice Remove an approved buyer from a listing.
     function removeApprovedBuyerForListing(
        uint256 _listingId
    ) external {
        address lister = _msgSender();
        DirectListingsStorage.Data storage data = _getListingStorageData();
         int256 index = data.listingIdToIndex[_listingId];
         Listing memory listing = _getListing(_listingId, data);
       
       if(listing.listingCreator != lister) {
        revert __DirectListing_UnauthorizedToRemoveBuyerForListing();
       }
       string memory listingIdStr = Strings.toString(_listingId);
       bytes32 buyerRole = keccak256(abi.encode(listingIdStr));
       emit BuyerRemovedForListing(_listingId);
        bool isRemoved = _removeApprovedBuyer(buyerRole, _listingId);
      if(!isRemoved) {
        revert __DirectListing_CanOnlyRemoveApprovedBuyer();
      }
      _getListingStorageData().listings[uint256(index)].reserved = false;
    }

    ///@notice Chainlink function that performs an operation when upkeep is needed.

     function performUpkeep(bytes calldata /*performData*/) external {
        (bool upkeepNeeded, bytes memory  performData) = checkUpkeep("");
        DirectListingsStorage.Data storage data = _getListingStorageData();
        Listing[] memory listingArr = data.listings;

        if(upkeepNeeded) {
             if(listingArr.length == 1) {
               delete data.endTimeToId[uint128(block.timestamp)];
                data.listings.pop();
             }
           uint256[] memory _listingId = abi.decode(performData, (uint256[]));

           if(_listingId.length == 1) {
             delete data.endTimeToId[uint128(block.timestamp)];
             int256 index = data.listingIdToIndex[_listingId[0]];
             uint256 len = listingArr.length;
             uint256 _lastListingId = listingArr[len - 1].listingId;

             data.listings[uint256(index)] = (data.listings[len - 1]);
             data.listingIdToIndex[_lastListingId] = index;
             data.listingIdToIndex[_listingId[0]] = -1;
             data.listings.pop();
           } 
           else {
                delete data.endTimeToId[uint128(block.timestamp)];
             for (uint256 i = 0; i < _listingId.length; ++i) {        
             int256 index = data.listingIdToIndex[_listingId[i]];
             uint256 len = listingArr.length;
             uint256 _lastListingId = listingArr[len - 1].listingId;
             data.listings[uint256(index)] = (data.listings[len - 1]);
             data.listingIdToIndex[_lastListingId] = index;
             data.listingIdToIndex[_listingId[i]] = -1;
             data.listings.pop();
          
           }
          
      
           }
          
        
        }
      }

      ///@notice Returns an approved buyer for a listing

     function getApprovedBuyer(uint256 _listingId) external view returns(address buyer) {
         DirectListingsStorage.Data storage data = _getListingStorageData();
         int256 index = data.listingIdToIndex[_listingId];
        bool isReserved = _getListingStorageData().listings[uint256(index)].reserved;
        if(!isReserved) {
            buyer = address(0);
        }
        else {
        string memory listingIdStr = Strings.toString(_listingId);
        bytes32 buyerRole = keccak256(abi.encode(listingIdStr));
       buyer = data.approvedBuyer[buyerRole];
        }
    }
    

    function getListing(uint256 _listingId) external view returns(Listing memory) {
        DirectListingsStorage.Data storage data = _getListingStorageData();
       Listing memory listing = _getListing(_listingId, data);
       return listing;
    }

     function getAllListings() external view returns (Listing[] memory) {
         DirectListingsStorage.Data storage data =  _getListingStorageData();
         Listing[] memory listing = data.listings;
        //  if(listing.length == 0) {
        //     revert __DirectListing_ListingNotFound();
        //  }
         return listing;
    }

    /**
     *  @notice Returns all valid listings between the start and end Id (both inclusive) provided.
     *          A valid listing is where the listing creator still owns and has approved Marketplace
     *          to transfer the listed NFTs.
     */
    function getAllValidListings() external view returns (Listing[] memory ) {
         DirectListingsStorage.Data storage data =  _getListingStorageData();
         Listing[] memory listing = data.listings;
          if(listing.length == 0) {
            revert __DirectListing_ListingNotFound();
         }
         Listing[] memory validListings;
         for (uint256 i = 0; i < listing.length; ++i) {
            if(listing[i].status == Status.CREATED)
            validListings[i] = listing[i];
         }       
         return validListings;
    }

    ///@notice Returns duration and price for a listing type.

     function getListingType(ListingType _listingType) external view returns(uint128, uint256) {
      return _getListingTypeInfo(_listingType);
    }

     ///@notice Returns platform fee for a validated currency
     function getPlatformFee(address _currency, uint256 _price) external view returns (uint256 fee) {
        _validateListingCurrency(_currency);
     return _getPlatformFee(_currency, _price);
    }

           /*//////////////////////////////////////////////////////////////
                            PUBLIC FUNCTIONS
    //////////////////////////////////////////////////////////////*/

    ///@notice Chainlink function that checks and returns performData when upkeep is needed
    
        function checkUpkeep(
        bytes memory /*checkData*/
    ) public view returns (bool upkeepNeeded, bytes memory performData) {

       DirectListingsStorage.Data storage data = _getListingStorageData();
       
        if(data.endTimeToId[uint128(block.timestamp)].length > 0 ) {
            upkeepNeeded = true;
            performData = abi.encode(data.endTimeToId[uint128(block.timestamp)]);
        }
       
       return (upkeepNeeded, performData);

    }

         /*//////////////////////////////////////////////////////////////
                           INTERNAL FUNCTIONS
    //////////////////////////////////////////////////////////////*/


     function getIsApprovedCurrency(
        address _currency
    ) internal view returns (bool isApprovedCurrency) {
        isApprovedCurrency = _getApprovedCurrencyStorageData()
            .currencyToIsInserted[_currency];
    }

    function listingId() internal returns (uint256 _id) {
        _getListingStorageData().ListingId += 1;
        _id = _getListingStorageData().ListingId;
    }

    function _validateBuyerFromListing(
     uint256 _listingId, 
     DirectListingsStorage.Data storage data,
     address _buyFor,
     address _buyer,
     Listing memory listing) internal view {
          string memory listingIdStr = Strings.toString(_listingId);
       bytes32 buyerRole = keccak256(abi.encode(listingIdStr));
       bool isReserved = listing.reserved;
       address approvedBuyer = data.approvedBuyer[buyerRole];
       bool isMarketplaceStillApproved = _validateListerRequirements(
       listing.assetContract, 
       listing.tokenType, 
       listing.listingCreator,
       listing.tokenId
            );

        if(isReserved && (approvedBuyer != _buyer)) {
         revert __DirectListing_BuyerNotApproved();
       }
        bool invalidAddress = _buyFor == address(0) || listing.listingCreator == _buyer;
        bool invalidListingStatus = listing.status != Status.CREATED;
        bool invalidListing = !isMarketplaceStillApproved;

        
        bool invalidRequirements = invalidAddress || invalidListingStatus  || invalidListing;
        if(invalidRequirements) {
            revert __DirectListing_InvalidRequirementToCompleteASale(_buyFor, listing.status, isMarketplaceStillApproved);
        }

      
    
         
    }

    function _payout(address _currency, uint256 _tokenPrice, address _buyer, address lister, address assetContract,uint256 _tokenId) internal {
        address _nativeTokenWrapper = nativeTokenWrapper;
        uint256 _amountRemaining = _tokenPrice;
       (address payable[] memory recipients, uint256[] memory amounts) = RoyaltyPaymentsLogic(address(this))
       .getRoyalty(assetContract, _tokenId, _tokenPrice);
         
          uint256 recipientLength = recipients.length;
        if(recipientLength > 0) {

           for(uint256 i = 0; i < recipientLength; ++i) {          
            if(_amountRemaining < amounts[i]) {
                revert __DirectListing_InsufficientFunds(_amountRemaining);
            }
            CurrencyTransferLib.transferCurrencyWithWrapper( _currency, _buyer, recipients[i], amounts[i], _nativeTokenWrapper);
            unchecked {
                _amountRemaining -= amounts[i];
            }
           }
        }
        CurrencyTransferLib.transferCurrencyWithWrapper(_currency, _buyer, lister, _amountRemaining, _nativeTokenWrapper);
    }

    function _transferListingToken(TokenType _tokenType,uint256 tokenId, address lister, address _assetContract, address _buyFor) internal {
        uint8 amount = 1;
       if(_tokenType == TokenType.ERC721) {
        IERC721(_assetContract).safeTransferFrom(lister, _buyFor, tokenId, "");
       }
       else {
        IERC1155(_assetContract).safeTransferFrom(lister, _buyFor, tokenId, amount, "");
       }
    }


    function _validateERC20AllowanceAndBalanceOrNativeTokenAmount(address _currency, uint256 _tokenPrice,address _buyer) internal {
        if (_currency == NATIVE_TOKEN) {
         if(msg.value < _tokenPrice) {
            revert __DirectListing_InsufficientFunds(_tokenPrice);
         }
       } else {
        if(IERC20(_currency).balanceOf(_buyer) < _tokenPrice
                         ||
          IERC20(_currency).allowance(_buyer, address(this)) < _tokenPrice) {
            revert __DirectListing_InsufficientFunds(_tokenPrice);
        }
        
       }
    }
   
    

    function _validateListing(
        ListingParameters memory _params,
        address _lister
    ) internal view returns(TokenType _tokenType) {
         _tokenType = _validateAssetContract(_params.assetContract);
        bool _isListerValidated = _validateListerRequirements(
            _params.assetContract,
            _tokenType,
            _lister,
            _params.tokenId
            
        );
         (_params.currency);
        if (!_isListerValidated) {
            revert __DirectListing_InvalidListerRequirements(
                _params.assetContract,
                _tokenType,
                _params.tokenId
                
            );
        }
    }

    function _addApproveBuyer(bytes32 role, address account,uint256 _listingId) internal returns(bool) {
        DirectListingsStorage.Data storage data = _getListingStorageData();
         int256 index = data.listingIdToIndex[_listingId];
        if(account == address(0)) {
          revert __DirectListing_NotAValidAddress();
        }
         bool isApproved =  _getListingStorageData().listings[uint256(index)].reserved;
           if(!isApproved) {
          _getListingStorageData().approvedBuyer[role] = account;
             return true;
           }
      
        return false;
    }

     function _removeApprovedBuyer(bytes32 role, uint256 _listingId) internal returns(bool){
         DirectListingsStorage.Data storage data = _getListingStorageData();
         int256 index = data.listingIdToIndex[_listingId];
        bool isApproved = _getListingStorageData().listings[uint256(index)].reserved;
         if(isApproved) {
         delete _getListingStorageData().approvedBuyer[role];
        return true;
           }
         
        return false;
    }


    function _getListingTypeInfo(
        ListingType _listingType
    ) internal view returns (uint128, uint256) {
        uint128 _duration;
        uint256 _price;
        if (_listingType == ListingType.BASIC) {
            BASIC memory basic = _getListingStorageData().Basic;
            _duration = basic.duration;
            _price = basic.price;
        } else if (_listingType == ListingType.ADVANCED) {
            ADVANCED memory advanced = _getListingStorageData().Advanced;
            _duration = advanced.duration;
            _price = advanced.price;
            return (_duration, _price);
        } else {
            PRO memory pro = _getListingStorageData().Pro;
            _duration = pro.duration;
            _price = pro.price;
        }
        return (_duration, _price);
    }

   
    function _validateListingCurrency(address _currency) internal view {
        bool isApprovedCurrency = getIsApprovedCurrency(_currency);
        if (!isApprovedCurrency) {
            revert __DirectListing_InvalidListingCurrency(_currency);
        }
    }

    function _validateListerRequirements(
        address _assetContract,
        TokenType _tokenType,
        address _lister,
        uint256 _tokenId
    ) internal view returns (bool isValid) {
        address _market = address(this);
        if (_tokenType == TokenType.ERC721) {
            bool ownToken = (IERC721(_assetContract).ownerOf(_tokenId) ==
                _lister);
            bool approvedMarket = (_market ==
                IERC721(_assetContract).getApproved(_tokenId));
           
           return isValid = ownToken && approvedMarket;
             
            
        } else if (_tokenType == TokenType.ERC1155) {
                uint256 _qtyOwned = (
                    IERC1155(_assetContract).balanceOf(_lister, _tokenId)
                );
                bool _validQty = (_qtyOwned >= 1);
                bool _approvedMarket = (
                    IERC1155(_assetContract).isApprovedForAll(_lister, _market)
                );

               return isValid = _approvedMarket && _validQty;
                
            }
            
        
    }

    function _validateAssetContract(
        address _assetContract
    ) internal view returns (TokenType _tokenType) {
        if (
            IERC165(_assetContract).supportsInterface(type(IERC1155).interfaceId)
        ) {
            _tokenType = TokenType.ERC1155;
        } else if (
            IERC165(_assetContract).supportsInterface(type(IERC721).interfaceId)
        ) {
            _tokenType = TokenType.ERC721;
        } else {
            revert __DirectListing_InvalidAssetContract(_assetContract);
        }
    }


    function _getPlatformFee(address _currency, uint256 _price) internal view returns (uint256 fee) {
        (, int256 priceFeed, , , ) = ApprovedCurrencyLib.getCurrencyPriceInfo(
            _currency
        );
        uint256 currencyToUsd = uint256(priceFeed);
        uint8 decimal = ApprovedCurrencyLib.getCurrencyDecimals(_currency);
        if(_currency == NATIVE_TOKEN) {
         fee = (_price * (1*(10**decimal)) * MATIC_BUFFER) / currencyToUsd;
        }
        else {
           uint8 ERC20_BUFFER = ERC20(_currency).decimals();
           fee = (_price * (1*(10**decimal)) * (1*(10**ERC20_BUFFER))) / currencyToUsd;
        }
    }

   

   

    function _getListingStorageData()
        internal
        pure
        returns (DirectListingsStorage.Data storage _data)
    {
        _data = DirectListingsStorage.data();
    }

    function _getApprovedCurrencyStorageData()
        internal
        pure
        returns (ApprovedCurrencyLibStorage.Data storage _data)
    {
        _data = ApprovedCurrencyLibStorage.data();
    }

    

    

   
    /**
     *  @notice Returns a listing at the provided listing ID.
     *
     *  @param _listingId The ID of the listing to fetch.
     */
    function _getListing(
        uint256 _listingId,
        DirectListingsStorage.Data storage data
    ) internal view returns (Listing memory) {
         if(_listingId <= 0 || _listingId  > data.ListingId) {
            revert __DirectListing_InvalidId();
        }
        int256 index = data.listingIdToIndex[_listingId];
         Listing memory listing = data.listings[uint256(index)];
         return listing;
    }

    
 }


