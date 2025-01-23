// SPDX-License-Identifier: MIT
pragma solidity 0.8.24;


interface IOffer {
   

    enum Status {
        UNSET,
        CREATED,
        COMPLETED,
        CANCELLED
    }

    error __Offer_InvalidListing();
    error __Offer_InsufficientFunds(uint256 amount);
    error __Offer_UnauthorizedToCall();
    error __Offer_MarketplaceUnapproved();

    /**
     *  @param totalPrice The total offer amount for the NFTs.
     *  @param expirationTimestamp The timestamp at and after which the offer cannot be accepted.
     */
   struct OfferParams {
        uint256 totalPrice;
        uint128 duration;
    }

   
    struct Offer {
        uint256 totalPrice;
        uint256 expirationTimestamp;
        address offeror;
        uint256 listingId;
        Status status;
    }
     
    /// @dev Emitted when a new offer is created.
    event NewOffer(uint256 indexed totalPrice, uint256 indexed expirationTime, uint256 indexed listingId, address sender, uint256 offerId);

    /// @dev Emitted when an offer is cancelled.
    event CancelledOffer(address indexed offeror, uint256 indexed offerId, uint256 indexed listingId);
    
    event RejectedOffer(address indexed lister, uint256 indexed offerId, uint256 indexed listingId);

    /// @dev Emitted when an offer is accepted.
    event AcceptedOffer(
        address indexed offeror,
        uint256 indexed totalPrice,
        uint256 indexed listingId,
        uint256 offerId
    );

    /**
     *  @notice Make an offer for NFTs (ERC-721 or ERC-1155)
     *
     *  @param _params The parameters of an offer.
     *
     *  @return offerId The unique integer ID assigned to the offer.
     */
    function makeOffer(OfferParams memory _params, uint256 _listingId) external payable returns (uint256 offerId);

    /**
     *  @notice Cancel an offer.
     *
     *  @param _offerId The ID of the offer to cancel.
     */
    function cancelOffer(uint256 _offerId, uint256 _listingId) external payable ;

    /**
     *  @notice Accept an offer.
     *
     *  @param _offerId The ID of the offer to accept.
     */
    function acceptOffer(uint256 _offerId, uint256 _listingId) external payable;

    /// @notice Returns an offer for the given offer ID.
     function getOffer(uint256 _offerId, uint256 _listingId) external view returns (Offer memory);

     function rejectOffer(uint256 _offerId, uint256 _listingId) external payable;

    /// @notice Returns all active (i.e. non-expired or cancelled) offers.
    function getAllOffers(uint256 _listingId) external view returns (Offer[] memory);

}
