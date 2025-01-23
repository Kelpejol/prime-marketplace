// SPDX-License-Identifier: MIT

pragma solidity 0.8.24;

interface IAuction {
    enum TokenType {
        ERC721,
        ERC1155
    }

    enum Status {
        UNSET,
        CREATED,
        STARTED,
        CLOSED,
        CANCELLED
    }


    error __AuctionLogic_UnauthorizedToCall();
    error __AuctionLogic_InvalidAssetContract(address _assetContract);
    error __AuctionLogic_InvalidAuctionCurrency(address _currency);
    error __Auction_InvalidAccessToCall(address sender);
    error __AuctionLogic_InvalidTime();
    error __AuctionLogic_BuyoutBidMustBeGreater();
    error __AuctionLogic_InvalidBidBuffer();
    error __AuctionLogic_InvalidBidAmount();
    error __Auction_InvalidBidTime();
    error __AuctionLogic_TransferFailed();
    error __AuctionLogic_InvalidAuctionState();
    error __AuctionLogic_InvalidDuration();
    error __AuctionLogic_NoBidYet();
    /**
     *  @notice The parameters a seller sets when creating an auction listing.
     *
     *  @param assetContract The address of the smart contract of the NFTs being auctioned.
     *  @param tokenId The tokenId of the NFTs being auctioned.
     *  @param quantity The quantity of NFTs being auctioned. This must be non-zero, and is expected to
     *                  be `1` for ERC-721 NFTs.
     *  @param currency The currency in which the bid must be made when bidding for the auctioned NFTs.
     *  @param minimumBidAmount The minimum bid amount for the auction.
     *  @param buyoutBidAmount The total bid amount for which the bidder can directly purchase the auctioned items and close the auction as a result.
     *  @param timeBufferInSeconds This is a buffer e.g. x seconds. If a new winning bid is made less than x seconds before expirationTimestamp, the
     *                             expirationTimestamp is increased by x seconds.
     *  @param bidBufferBps This is a buffer in basis points e.g. x%. To be considered as a new winning bid, a bid must be at least x% greater than
     *                      the current winning bid.
     *  @param startTimestamp The timestamp at and after which bids can be made to the auction
     *  @param endTimestamp The timestamp at and after which bids cannot be made to the auction.
     */
    struct AuctionParameters {
        address assetContract;
        uint256 tokenId;
        address currency;
        uint256 minimumBidAmount;
        uint256 buyoutBidAmount;
        uint64 bidBufferBps;
        uint64 startTimestamp;
        uint64 endTimestamp;
    }

     struct UpdateAuctionParameters {
        address currency;
        uint256 minimumBidAmount;
        uint256 buyoutBidAmount;
        uint64 bidBufferBps;
        uint64 startTimestamp;
        uint64 endTimestamp;
    }

    /**
     *  @notice The information stored for an auction.
     *
     *  @param auctionId The unique ID of the auction.
     *  @param auctionCreator The creator of the auction.
     *  @param assetContract The address of the smart contract of the NFTs being auctioned.
     *  @param tokenId The tokenId of the NFTs being auctioned.
     *  @param quantity The quantity of NFTs being auctioned. This must be non-zero, and is expected to
     *                  be `1` for ERC-721 NFTs.
     *  @param currency The currency in which the bid must be made when bidding for the auctioned NFTs.
     *  @param minimumBidAmount The minimum bid amount for the auction.
     *  @param buyoutBidAmount The total bid amount for which the bidder can directly purchase the auctioned items and close the auction as a result.
     *  @param timeBufferInSeconds This is a buffer e.g. x seconds. If a new winning bid is made less than x seconds before expirationTimestamp, the
     *                             expirationTimestamp is increased by x seconds.
     *  @param bidBufferBps This is a buffer in basis points e.g. x%. To be considered as a new winning bid, a bid must be at least x% greater than
     *                      the current winning bid.
     *  @param startTimestamp The timestamp at and after which bids can be made to the auction
     *  @param endTimestamp The timestamp at and after which bids cannot be made to the auction.
     *  @param status The status of the auction (created, completed, or cancelled).
     *  @param tokenType The type of NFTs auctioned (ERC-721 or ERC-1155)
     */
    struct Auction {
        uint256 auctionId;
        uint256 tokenId;
        uint256 minimumBidAmount;
        uint256 buyoutBidAmount;
        uint64 bidBufferBps;
        uint64 startTimestamp;
        uint64 endTimestamp;
        address auctionCreator;
        address assetContract;
        address currency;
        TokenType tokenType;
        Status status;
    }

    /**
     *  @notice The information stored for a bid made in an auction.
     *
     *  @param auctionId The unique ID of the auction.
     *  @param bidder The address of the bidder.
     *  @param bidAmount The total bid amount (in the currency specified by the auction).
     */
 

    struct HighestBid {
        address highestBidder;
        uint256 amount;
    }

    struct AuctionPayoutStatus {
        bool paidOutAuctionTokens;
        bool paidOutBidAmount;
    }

    /// @dev Emitted when a new auction is created.
    event NewAuction(
        address indexed auctionCreator,
        uint256 indexed auctionId,
        address indexed assetContract
    );

    /// @dev Emitted when a new bid is made in an auction.

    event NewBid(
        uint256 indexed auctionId,
        address indexed bidder,
        uint256 indexed bidAmount
    );

    event AuctionUpdated(uint256 indexed auctionId);

    /// @notice Emitted when a auction is cancelled.
    event CancelledAuction(address indexed auctionCreator, uint256 indexed auctionId);

    /// @dev Emitted when an auction is closed.
    event AuctionClosed(
        uint256 indexed auctionId,
        address indexed closer,
        uint256 indexed bidAmount
    );

    event AuctionPaidOut(
        address indexed recipient,
        uint256 indexed auctionId,
        uint256 indexed amount
    );

    event AuctionTokenPaidOut(
        address indexed recipient,
        uint256 indexed auctionId
    );

    /**
     *  @notice Put up NFTs (ERC721 or ERC1155) for an english auction.
     *
     *  @param _params The parameters of an auction a seller sets when creating an auction.
     *
     *  @return auctionId The unique integer ID of the auction.
     */
    function createAuction(AuctionParameters memory _params) external returns (uint256 auctionId);

    /**
     *  @notice Cancel an auction.
     *
     *  @param _auctionId The ID of the auction to cancel.
     */
    function cancelAuction(uint256 _auctionId) external;

    /**
     *  @notice Distribute the winning bid amount to the auction creator.
     *
     *  @param _auctionId The ID of an auction.
     */
    function collectAuctionPayout(uint256 _auctionId) external payable;

    /**
     *  @notice Distribute the auctioned NFTs to the winning bidder.
     *
     *  @param _auctionId The ID of an auction.
     */
    function collectAuctionTokens(uint256 _auctionId) external;


     function updateAuction(uint256 auctionId, UpdateAuctionParameters calldata _params) external;
    /**
     *  @notice Bid in an active auction.
     *
     *  @param _auctionId The ID of the auction to bid in.
     *  @param _bidAmount The bid amount in the currency specified by the auction.
     */
    function bidInAuction(uint256 _auctionId, uint256 _bidAmount) external payable;

    /**
     *  @notice Returns whether a given bid amount would make for a winning bid in an auction.
     *
     *  @param _auctionId The ID of an auction.
     *  @param _bidAmount The bid amount to check.
     */
    function isNewWinningBid(uint256 _auctionId, uint256 _bidAmount) external view returns (bool);

    /// @notice Returns the auction of the provided auction ID.
    function getAuction(uint256 _auctionId) external view returns (Auction memory auction);

    /// @notice Returns all non-cancelled auctions.
    function getAllAuctions() external view returns (Auction[] memory auctions);

    /// @notice Returns all active auctions.
    
    /// @notice Returns the winning bid of an active auction.
    function getWinningBid(
        uint256 _auctionId
    ) external view returns (address bidder, address currency, uint256 bidAmount);

    /// @notice Returns whether an auction is active.
    function isAuctionExpired(uint256 _auctionId) external view returns (bool);
}