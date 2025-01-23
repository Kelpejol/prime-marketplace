// SPDX-License-Identifier: MIT

pragma solidity 0.8.24;

/// @author <6pillz>

/**
 *  The `DirectListings` extension smart contract lets you buy and sell NFTs (ERC-721 or ERC-1155) for a fixed price.
 */

interface IDirectListings {
    enum TokenType {
        ERC721,
        ERC1155
    }

    enum Status {
        UNSET,
        CREATED,
        SOLD,
        CANCELLED
    }

    enum ListingType {
        BASIC,
        ADVANCED,
        PRO
    }

    struct BASIC {
        uint128 duration;
        uint256 price;
    }
    struct ADVANCED {
        uint128 duration;
        uint256 price;
    }
    struct PRO {
        uint128 duration;
        uint256 price;
    }

   
       
   

    

    error __DirectListing_InvalidAssetContract(address _assetContract);
    error __DirectListing_InvalidListingDuration(uint128 _duration);
    error __DirectListing_InvalidEndTime(uint128 _endTime);
    error __DirectListing_NotAuthorizedToUpdate();
    error __DirectListing_InvalidListerRequirements(
        address _assetContract,
        TokenType _tokenType,
        uint256 _tokenId     
    );
    error __DirectListing_InvalidAccessToCall(address _sender);
    error __DirectListing_InvalidListingCurrency(address _currency);
    error __DirectListing_TransferFailed();
    error __DirectListing_NotAuthorizedToApproveBuyerForListing();
    error __DirectListing_NotAuthorizedToCancel();
    error __DirectListing_CanOnlyApproveABuyer();
    error __DirectListing_CanOnlyRemoveApprovedBuyer();
    error __DirectListing_UnauthorizedToRemoveBuyerForListing();
    error __DirectListing_CannotBuyWithThisCurrency();
    error __DirectListing_InsufficientFunds(uint256 _amount);
    error __DirectListing_NotAValidAddress();
    error __DirectListing_BuyerNotApproved();
   error __DirectListing_InvalidId();
    error __DirectListing_InvalidRequirementToCompleteASale(address _buyFor, Status _listingStatus, bool _isMarketApproved);
    error __DirectListing_ListingNotFound();

    /**
     *  @notice The parameters a seller sets when creating a listing.
     *
     *  @param assetContract The address of the smart contract of the NFTs being listed.
     *  @param tokenId The tokenId of the NFTs being listed.
     *  @param currency The currency in which the price must be paid when buying the listed NFTs.
     *  @param pricePerToken The price to pay per unit of NFTs listed.
     *  @param listingType The listing plan the user wishes either BASIC, ADVANCED or PRO
     *  @param reserved Whether the listing is reserved to be bought from a specific set of buyers.
     */
    struct ListingParameters {
        address assetContract;
        uint256 tokenId;
        address currency;
        uint256 pricePerToken;
        ListingType listingType;
        bool reserved;
    }
    struct UpdateListingParameters {
        address currency;
        uint256 pricePerToken;
    }

    /**
     *  @notice The information stored for a listing.
     *
     *  @param listingId The unique ID of the listing.
     *  @param listingCreator The creator of the listing.
     *  @param assetContract The address of the smart contract of the NFTs being listed.
     *  @param tokenId The tokenId of the NFTs being listed.
     *  @param quantity The quantity of NFTs being listed. This must be non-zero, and is expected to
     *                  be `1` for ERC-721 NFTs.
     *  @param currency The currency in which the price must be paid when buying the listed NFTs.
     *  @param pricePerToken The price to pay per unit of NFTs listed.
     *  @param startTimestamp The UNIX timestamp at and after which NFTs can be bought from the listing.
     *  @param endTimestamp The UNIX timestamp at and after which NFTs cannot be bought from the listing.
     *  @param reserved Whether the listing is reserved to be bought from a specific set of buyers.
     *  @param status The status of the listing (created, completed, or cancelled).
     *  @param tokenType The type of token listed (ERC-721 or ERC-1155)
     */
    struct Listing {
        uint256 listingId;
        uint256 tokenId;
        uint256 pricePerToken;
        uint128 startTimestamp;
        uint128 endTimestamp;
        address listingCreator;
        address assetContract;
        address currency;
        TokenType tokenType;
        ListingType listingType;
        Status status;
        bool reserved;
    }

    /// @notice Emitted when a new listing is created.
    event NewListingCreated(
        address indexed listingCreator,
        uint256 indexed listingId,
        address indexed assetContract,
        Listing listing
    );

    event ListingPlanUpdated(
        uint128 indexed endTime
    );

    /// @notice Emitted when a listing is updated.
    event ListingUpdated(
        address indexed currency,
        uint256 indexed pricePerToken
    );

    /// @notice Emitted when a listing is cancelled.
    event CancelledListing(address indexed listingCreator, uint256 indexed listingId);

    /// @notice Emitted when a buyer is approved to buy from a reserved listing.
    event BuyerApprovedForListing(uint256 indexed listingId, address indexed buyer);
    event BuyerRemovedForListing(uint256 indexed listingId);

    /// @notice Emitted when a currency is approved as a form of payment for the listing.
    event CurrencyApprovedForListing(uint256 indexed listingId, address indexed currency, uint256 pricePerToken);

    /// @notice Emitted when NFTs are bought from a listing.
    event NewSale(
        address indexed listingCreator,
        uint256 indexed listingId,
        address indexed assetContract,
        uint256 tokenId,
        address buyer,
        uint256 totalPricePaid
    );

    /**
     *
     *  @param _params The parameters of a listing a seller sets when creating a listing.
     *
     *  @return listingId The unique integer ID of the listing.
     */
    function createListing(ListingParameters memory _params) external payable returns (uint256 listingId);

    
     /**
     *  @param _listingId The ID of the listing to update.
     *  @param _buyFor The recipient of the NFTs being bought.
     */
    function buyFromListing(
        uint256 _listingId,
        address _buyFor
        
    ) external payable;


      /**
     *  @param _listingId The ID of the listing to update.
     *  @param _params The parameters of a listing a seller sets when updating a listing.
     */
     function updateListing(
        uint256 _listingId,
        UpdateListingParameters memory _params
    ) external;

     /**
     *  @param _listingId The ID of the listing to update.
     *  @param _listingType The listing plan the user wishes to update either BASIC, ADVANCED or PRO.
     */
    function updatedListingPlan(uint256 _listingId, ListingType _listingType) external payable;

    /**
     *
     *  @param _listingId The ID of the listing to cancel.
     */
    function cancelListing(uint256 _listingId) external;

    /**
     *
     *  @param _listingId The ID of the listing to approve a buyer.
     *  @param _buyer The address of the buyer to approve to buy from the listing.
     */
    
   function approveBuyerForListing(
        uint256 _listingId,
        address _buyer
        
    ) external;

    /**
     *
     *  @param _listingId The ID of the listing to remove an approved buyer.
     *
     */
     function removeApprovedBuyerForListing(
        uint256 _listingId
    ) external;

  function getApprovedBuyer(uint256 _listingId) external view returns(address buyer);

    /// @notice Returns all listings between the start and end Id (both inclusive) provided.
    function getAllListings() external view returns (Listing[] memory listings);

    /**
     *  @notice Returns all valid listings between the start and end Id (both inclusive) provided.
     *          A valid listing is where the listing creator still owns and has approved Marketplace
     *          to transfer the listed NFTs.
     */
    function getAllValidListings() external view returns (Listing[] memory);

    /**
     *  @notice Returns a listing at the provided listing ID.
     *
     *  @param _listingId The ID of the listing to fetch.
     */
    function getListing(uint256 _listingId) external view returns (Listing memory listing);
}