// SPDX-License-Identifier: MIT
pragma solidity 0.8.24;

import {IOffer, OfferStorage} from "./OfferStorage.sol";
import {DirectListingsStorage, IDirectListings} from "../directListings/DirectListingsStorage.sol";
import {ERC2771ContextConsumer} from "thirdweb-contract/extension/upgradeable/ERC2771ContextConsumer.sol";
import {IERC20, SafeERC20} from "openzeppelin-contract/token/ERC20/utils/SafeERC20.sol";
import {IERC721} from "openzeppelin-contract/token/ERC721/ERC721.sol";
import {IERC1155} from "openzeppelin-contract/token/ERC1155/ERC1155.sol";
import {RoyaltyPaymentsLogic} from "thirdweb-contract/extension/upgradeable/RoyaltyPayments.sol";
import {CurrencyTransferLib} from "thirdweb-contract/lib/CurrencyTransferLib.sol";
import {ReentrancyGuard} from "thirdweb-contract/extension/upgradeable/ReentrancyGuard.sol";





contract OfferLogic is ERC2771ContextConsumer, IOffer, ReentrancyGuard{

     using SafeERC20 for IERC20;

   address private constant NATIVE_TOKEN =
        0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE;   

        address private immutable nativeTokenWrapper;
    

    constructor(address _nativeTokenWrapper) {
       nativeTokenWrapper = _nativeTokenWrapper;
    }




     
    function makeOffer(OfferParams memory _params, uint256 _listingId) external payable returns (uint256 _id) {
         DirectListingsStorage.Data storage data = _getListingStorageData();
         address sender = _msgSender();
         int256 index = data.listingIdToIndex[_listingId];

          IDirectListings.Listing memory listing = data.listings[uint256(index)];
           if(_listingId <= 0 || _listingId > data.ListingId || listing.status != IDirectListings.Status.CREATED) {
            revert __Offer_InvalidListing();
        }
         _validateERC20AmountAndBalanceOrNativeTokenAmount(listing.currency, _params.totalPrice, sender);

          uint256  expirationTime;
          unchecked {
            expirationTime = uint128(block.timestamp) + _params.duration;
          }
          
       
       
        Offer memory offer = Offer({
         totalPrice: _params.totalPrice,
         expirationTimestamp:expirationTime,
         offeror: sender,
         listingId: _listingId,
         status: Status.CREATED
        });
      _id += 1;
     emit NewOffer( _params.totalPrice, expirationTime, _listingId, sender, _id);
     _getOfferStorageData().listingIdToOffer[_listingId][_id] = offer;
     _getOfferStorageData().listingIdToOfferCount[_listingId] = 1; 
    }

    function _validateERC20AmountAndBalanceOrNativeTokenAmount(address _currency, uint256 _tokenPrice,address _buyer) internal {
        if (_currency == NATIVE_TOKEN) {
         if(msg.value < _tokenPrice) {
            revert __Offer_InsufficientFunds(_tokenPrice);
         }
       } else {
        if(IERC20(_currency).balanceOf(_buyer) < _tokenPrice) {
        //                  ||
        //   IERC20(_currency).allowance(_buyer, address(this)) < _tokenPrice
            revert __Offer_InsufficientFunds(_tokenPrice);
        }
        IERC20(_currency).safeTransferFrom(_buyer, address(this), _tokenPrice);
        
       }
    }

    function cancelOffer(uint256 _offerId, uint256 _listingId) external payable {
      OfferStorage.Data storage data = _getOfferStorageData();
      DirectListingsStorage.Data storage _data = _getListingStorageData();
         address sender = _msgSender();
         int256 index = _data.listingIdToIndex[_listingId];
          IDirectListings.Listing memory listing = _data.listings[uint256(index)];
          if(_listingId <= 0 || _listingId  > _data.ListingId) {
            revert __Offer_InvalidListing();
        }
        Offer memory offer = data.listingIdToOffer[_listingId][_offerId];
        if(sender != offer.offeror || offer.status != Status.CREATED) {
            revert __Offer_UnauthorizedToCall();
        }
        emit CancelledOffer( sender,  _offerId, _listingId);

        CurrencyTransferLib.transferCurrencyWithWrapper(listing.currency, address(this), offer.offeror, offer.totalPrice, nativeTokenWrapper);
        data.listingIdToOffer[_listingId][_offerId].status = Status.CANCELLED;     
        
    }

    function rejectOffer(uint256 _offerId, uint256 _listingId) external payable {
      OfferStorage.Data storage data = _getOfferStorageData();
      DirectListingsStorage.Data storage _data = _getListingStorageData();
         address lister = _msgSender();
         int256 index = _data.listingIdToIndex[_listingId];
           IDirectListings.Listing memory listing = _data.listings[uint256(index)];
          if(_listingId <= 0 || _listingId  > _data.ListingId) {
            revert __Offer_InvalidListing();
        }
        Offer memory offer = data.listingIdToOffer[_listingId][_offerId];
        if(lister != listing.listingCreator || offer.status != Status.CREATED) {
            revert __Offer_UnauthorizedToCall();
        }
         emit RejectedOffer( lister,  _offerId, _listingId);

         CurrencyTransferLib.transferCurrencyWithWrapper(listing.currency, address(this), offer.offeror, offer.totalPrice, nativeTokenWrapper);

        data.listingIdToOffer[_listingId][_offerId].status = Status.CANCELLED;     
        
    }

    function acceptOffer(uint256 _offerId, uint256 _listingId) external payable nonReentrant {
         OfferStorage.Data storage data = _getOfferStorageData();
      DirectListingsStorage.Data storage _data = _getListingStorageData();
         address lister = _msgSender();

         int256 index = _data.listingIdToIndex[_listingId];
         IDirectListings.Listing memory listing = _data.listings[uint256(index)];
       if(_listingId <= 0 || _listingId  > _data.ListingId) {
            revert __Offer_InvalidListing();
        }
        Offer memory offer = data.listingIdToOffer[_listingId][_offerId];
         if(lister != listing.listingCreator || offer.status != Status.CREATED || listing.status != IDirectListings.Status.CREATED || offer.expirationTimestamp < block.timestamp) {
            revert __Offer_UnauthorizedToCall();
        }
       bool isMarketplaceApproved = _validateListerRequirements(listing.assetContract, listing.tokenType, listing.listingCreator, listing.tokenId);
       if(!isMarketplaceApproved) {
        revert __Offer_MarketplaceUnapproved();
       }
       emit AcceptedOffer(offer.offeror, offer.totalPrice, _listingId, _offerId);
       data.listingIdToOffer[_listingId][_offerId].status = Status.COMPLETED; 
       _data.listings[uint256(index)].status = IDirectListings.Status.SOLD;
        // _validateERC20AllowanceAndBalanceOrNativeTokenAmount(listing.currency, offer.totalPrice, offer.offeror);
        _payout(listing.currency, offer.totalPrice, address(this), lister, listing.assetContract, listing.tokenId);
        _transferListingToken(listing.tokenType, listing.tokenId, listing.listingCreator, listing.assetContract, offer.offeror);
    }

     function getOffer(uint256 _offerId, uint256 _listingId) external view returns (Offer memory) {
        OfferStorage.Data storage data = _getOfferStorageData();
         Offer memory offer = data.listingIdToOffer[_listingId][_offerId];
         return offer;

     }

     function getAllOffers(uint256 _listingId) external view returns (Offer[] memory ) {
         OfferStorage.Data storage data = _getOfferStorageData();
        uint256 count = data.listingIdToOfferCount[_listingId];
        Offer[] memory offers;
        for(uint256 i = 0; i < count; ++i) {
             Offer memory offer = data.listingIdToOffer[_listingId][i];
            if(offer.expirationTimestamp < block.timestamp && offer.status == Status.CREATED) {
                offers[i] = offer;
            }
        }
        return offers;
     }


     function _transferListingToken(IDirectListings.TokenType _tokenType,uint256 tokenId, address lister, address _assetContract, address _buyFor) internal {
        uint8 amount = 1;
       if(_tokenType == IDirectListings.TokenType.ERC721) {
        IERC721(_assetContract).safeTransferFrom(lister, _buyFor, tokenId, "");
       }
       else {
        IERC1155(_assetContract).safeTransferFrom(lister, _buyFor, tokenId, amount, "");
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
                revert __Offer_InsufficientFunds(_amountRemaining);
            }
            CurrencyTransferLib.transferCurrencyWithWrapper( _currency, _buyer, recipients[i], amounts[i], _nativeTokenWrapper);
            unchecked {
                _amountRemaining -= amounts[i];
            }
           }
        }
        CurrencyTransferLib.transferCurrencyWithWrapper(_currency, _buyer, lister, _amountRemaining, _nativeTokenWrapper);
    }

    function _validateListerRequirements(
        address _assetContract,
        IDirectListings.TokenType _tokenType,
        address _lister,
        uint256 _tokenId
    ) internal view returns (bool isValid) {
        address _market = address(this);
        if (_tokenType == IDirectListings.TokenType.ERC721) {
            bool ownToken = (IERC721(_assetContract).ownerOf(_tokenId) ==
                _lister);
            bool approvedMarket = (_market ==
                IERC721(_assetContract).getApproved(_tokenId));
           
            isValid = ownToken && approvedMarket;
             
            
        } else if (_tokenType == IDirectListings.TokenType.ERC1155) {
                uint256 _qtyOwned = (
                    IERC1155(_assetContract).balanceOf(_lister, _tokenId)
                );
                bool _validQty = (_qtyOwned >= 1);
                bool _approvedMarket = (
                    IERC1155(_assetContract).isApprovedForAll(_lister, _market)
                );

                isValid = _approvedMarket && _validQty;
                
            }
            return isValid;
        
    }

   

     function _getOfferStorageData()
        internal
        pure
        returns (OfferStorage.Data storage _data)
    {
        _data = OfferStorage.data();
    }

    function _getListingStorageData()
        internal
        pure
        returns (DirectListingsStorage.Data storage _data)
    {
        _data = DirectListingsStorage.data();
    }


}