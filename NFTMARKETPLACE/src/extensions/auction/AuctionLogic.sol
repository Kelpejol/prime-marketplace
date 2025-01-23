// SPDX-License-Identifier: MIT
pragma solidity 0.8.24;
import {IERC721} from "openzeppelin-contract/token/ERC721/ERC721.sol";
import {IERC1155} from "openzeppelin-contract/token/ERC1155/ERC1155.sol";
import {IERC165} from "openzeppelin-contract/interfaces/IERC165.sol";
import {IERC20, SafeERC20} from "openzeppelin-contract/token/ERC20/utils/SafeERC20.sol";
import {ERC20} from "openzeppelin-contract/token/ERC20/ERC20.sol";
import {ERC2771ContextConsumer} from "thirdweb-contract/extension/upgradeable/ERC2771ContextConsumer.sol";
import {Permissions} from "thirdweb-contract/extension/upgradeable/PermissionsEnumerable.sol";
import {ApprovedCurrencyLibStorage} from "../../chainlink/priceFeed/ApprovedCurrencyLibStorage.sol";
import {AuctionStorage, IAuction} from "./AuctionStorage.sol";
import {ReentrancyGuard} from "thirdweb-contract/extension/upgradeable/ReentrancyGuard.sol";
import {ApprovedCurrencyLib} from "../../chainlink/priceFeed/ApprovedCurrencyLib.sol";
import {CurrencyTransferLib} from "thirdweb-contract/lib/CurrencyTransferLib.sol";




contract AuctionLogic is IAuction, ERC2771ContextConsumer, ReentrancyGuard {
         using SafeERC20 for IERC20;

  
     address private constant NATIVE_TOKEN =
        0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE;
    uint64 private constant ETH_BUFFER = 1e18;
    uint8 private constant PERCENTAGE = 100;
    address private immutable nativeTokenWrapper;

    bytes32 private constant LISTER_ROLE = keccak256("LISTER_ROLE");
    uint64 private constant AUCTION_START_BUFFER = 30 minutes;
    uint64 private constant MAX_BID_BUFFER_BPS = 100;
    uint64 private constant END_TIME_BUFFER = 1 days;
    uint64 private constant ONE_HOUR_THIRTY_MINUTES  = 5400 seconds;

    constructor(address _nativeTokenWrapper) {
       nativeTokenWrapper = _nativeTokenWrapper;
    }

    modifier onlyCreator() {
        address _sender = _msgSender();
        bool isPermissionedToCall = Permissions(address(this))
            .hasRoleWithSwitch(LISTER_ROLE, _sender);
        if (!isPermissionedToCall) {
            revert __Auction_InvalidAccessToCall(_sender);
        }
        _;
    }


     function createAuction(AuctionParameters memory _params) external onlyCreator returns (uint256 auctionId) {
        address creator = _msgSender();
       TokenType _tokenType =  _validateAuction(_params, creator);
       if(block.timestamp + AUCTION_START_BUFFER < _params.startTimestamp || _params.endTimestamp <= _params.startTimestamp) {
        revert __AuctionLogic_InvalidTime();
       }
       
       if(_params.buyoutBidAmount < _params.minimumBidAmount) {
        revert __AuctionLogic_BuyoutBidMustBeGreater();
       }
       if(_params.bidBufferBps > MAX_BID_BUFFER_BPS) {
         revert __AuctionLogic_InvalidBidBuffer();
       }
       uint64 duration;
       unchecked {
        duration = _params.endTimestamp - _params.startTimestamp;
       }
       if(duration > ONE_HOUR_THIRTY_MINUTES) {
        revert __AuctionLogic_InvalidDuration();
       }
       auctionId = _getAuctionId();
       Auction memory auction = Auction({
         auctionId: auctionId,
         tokenId: _params.tokenId,
         minimumBidAmount: _params.minimumBidAmount,
         buyoutBidAmount: _params.buyoutBidAmount,
         bidBufferBps: _params.bidBufferBps,
         startTimestamp: _params.startTimestamp,
         endTimestamp: _params.endTimestamp,
         auctionCreator: creator,
         assetContract: _params.assetContract,
         currency: _params.currency,
         tokenType: _tokenType,
         status: Status.CREATED
       });
       uint128 endTime;
       unchecked {
        endTime = END_TIME_BUFFER + _params.endTimestamp;
       }
    emit NewAuction(creator, auctionId, _params.assetContract);
   AuctionStorage.Data storage data =  _getAuctionStorageData();
       data.auctions.push(auction);
        uint256 index = (data.auctions.length) - 1;
       data.auctionIdToIndex[auctionId] = int256(index);
       data.endTimeToId[endTime].push(auctionId);
     }



     function bidInAuction(uint256 auctionId, uint256 bidAmount) external nonReentrant payable{
        address sender = _msgSender();
        AuctionStorage.Data storage data =  _getAuctionStorageData();
       int256 index = data.auctionIdToIndex[auctionId];
       Auction memory auction = data.auctions[uint256(index)];
       HighestBid memory highestBid = data.auctionIdToHighestBid[auctionId];
       _validateBid(auctionId, bidAmount, auction, sender);
       
    CurrencyTransferLib.transferCurrencyWithWrapper(auction.currency, sender, address(this), bidAmount, nativeTokenWrapper);
       if(bidAmount >= auction.buyoutBidAmount) {
         CurrencyTransferLib.transferCurrencyWithWrapper(auction.currency, address(this), highestBid.highestBidder, highestBid.amount, nativeTokenWrapper);
          data.auctionIdToHighestBid[auctionId] = HighestBid({
        highestBidder: sender,
        amount: bidAmount
       });
        emit AuctionClosed( auctionId,sender, bidAmount);
        data.auctions[uint256(index)].status = Status.CLOSED;
       } else {
         if(highestBid.amount > 0) {
          CurrencyTransferLib.transferCurrencyWithWrapper(auction.currency, address(this), highestBid.highestBidder, highestBid.amount, nativeTokenWrapper);
       }
         emit NewBid( auctionId, sender, bidAmount);
       data.auctionIdToHighestBid[auctionId] = HighestBid({
        highestBidder: sender,
        amount: bidAmount
       });
         data.auctions[uint256(index)].status = Status.STARTED;

       }
      
     }

     function collectAuctionPayout(uint256 auctionId) external nonReentrant payable  {
        address sender = _msgSender();
        AuctionStorage.Data storage data =  _getAuctionStorageData();
       int256 index = data.auctionIdToIndex[auctionId];
        HighestBid memory highestBid = data.auctionIdToHighestBid[auctionId];
       Auction memory auction = data.auctions[uint256(index)];
       bool validStatus = auction.status == Status.CLOSED || auction.status == Status.STARTED;

       if((block.timestamp < auction.endTimestamp) && !validStatus) {
          revert __AuctionLogic_InvalidAuctionState();
       }
       if(sender != auction.auctionCreator) {
        revert __AuctionLogic_UnauthorizedToCall();
       }
       if(highestBid.amount == 0) {
        revert __AuctionLogic_NoBidYet();
       }
      emit AuctionPaidOut(sender, auctionId, highestBid.amount);
       CurrencyTransferLib.transferCurrencyWithWrapper(auction.currency, address(this), sender, highestBid.amount, nativeTokenWrapper);
     }

     function collectAuctionTokens(uint256 auctionId) external nonReentrant {
        address sender = _msgSender();
        AuctionStorage.Data storage data =  _getAuctionStorageData();
       int256 index = data.auctionIdToIndex[auctionId];
        HighestBid memory highestBid = data.auctionIdToHighestBid[auctionId];
       Auction memory auction = data.auctions[uint256(index)];
       bool validStatus = auction.status == Status.CLOSED || auction.status == Status.STARTED;

       if((block.timestamp < auction.endTimestamp) && !validStatus) {
          revert __AuctionLogic_InvalidAuctionState();
       }
       if(sender != highestBid.highestBidder) {
        revert __AuctionLogic_UnauthorizedToCall();
       }
       
      emit AuctionTokenPaidOut(sender, auctionId);
      _transferAuctionToken(auction.tokenType, auction.tokenId, address(this), auction.assetContract, sender);
     }

    

     function updateAuction(uint256 auctionId, UpdateAuctionParameters memory _params) external {
       address creator = _msgSender();
        AuctionStorage.Data storage data =  _getAuctionStorageData();
       int256 index = data.auctionIdToIndex[auctionId];
       Auction memory auction = data.auctions[uint256(index)];
       if(creator != auction.auctionCreator) {
        revert __AuctionLogic_UnauthorizedToCall();
       }
       if(auction.status != Status.CREATED || block.timestamp > auction.endTimestamp) {
         revert __AuctionLogic_InvalidAuctionState();
       }
        if(block.timestamp + AUCTION_START_BUFFER < _params.startTimestamp || _params.endTimestamp <= _params.startTimestamp) {
        revert __AuctionLogic_InvalidTime();
       }
       
       if(_params.buyoutBidAmount < _params.minimumBidAmount) {
        revert __AuctionLogic_BuyoutBidMustBeGreater();
       }
       if(_params.bidBufferBps > MAX_BID_BUFFER_BPS) {
         revert __AuctionLogic_InvalidBidBuffer();
       }
       uint64 duration;
       unchecked {
        duration = _params.endTimestamp - _params.startTimestamp;
       }
       if(duration > ONE_HOUR_THIRTY_MINUTES) {
        revert __AuctionLogic_InvalidDuration();
       }

        Auction memory _auction = Auction({
         auctionId: auctionId,
         tokenId: auction.tokenId,
         minimumBidAmount: _params.minimumBidAmount,
         buyoutBidAmount: _params.buyoutBidAmount,
         bidBufferBps: _params.bidBufferBps,
         startTimestamp: _params.startTimestamp,
         endTimestamp: _params.endTimestamp,
         auctionCreator: creator,
         assetContract: auction.assetContract,
         currency: _params.currency,
         tokenType: auction.tokenType,
         status: auction.status
       });
       emit AuctionUpdated(auctionId);
       data.auctions[uint256(index)] = _auction;
     }

     function getAuction(uint256 _auctionId) external view returns (Auction memory auction) {
        AuctionStorage.Data storage data =  _getAuctionStorageData();
       int256 index = data.auctionIdToIndex[_auctionId];
       auction = data.auctions[uint256(index)];
     }

      function getAllAuctions() external view returns (Auction[] memory auctions){
         AuctionStorage.Data storage data =  _getAuctionStorageData();
         auctions = data.auctions;
      }

      function getWinningBid(
        uint256 _auctionId
    ) external view returns (address bidder, address currency, uint256 bidAmount){
        AuctionStorage.Data storage data =  _getAuctionStorageData();
       int256 index = data.auctionIdToIndex[_auctionId];
        HighestBid memory highestBid = data.auctionIdToHighestBid[_auctionId];
        bidAmount = highestBid.amount;
        bidder = highestBid.highestBidder;
       Auction memory auction = data.auctions[uint256(index)];
       currency = auction.currency;
    }

        function isAuctionExpired(uint256 _auctionId) external view returns (bool){
        AuctionStorage.Data storage data =  _getAuctionStorageData();
       int256 index = data.auctionIdToIndex[_auctionId];
      Auction memory auction = data.auctions[uint256(index)];
       bool isExpired = block.timestamp >= auction.endTimestamp;
       return isExpired; 
        }



      function _transferAuctionToken(TokenType _tokenType,uint256 tokenId, address lister, address _assetContract, address _buyFor) internal {
        uint8 amount = 1;
       if(_tokenType == TokenType.ERC721) {
        IERC721(_assetContract).safeTransferFrom(lister, _buyFor, tokenId, "");
       }
       else {
        IERC1155(_assetContract).safeTransferFrom(lister, _buyFor, tokenId, amount, "");
       }
    }



     function _validateBid(uint256 _auctionId, uint256 _bidAmount, Auction memory _auction, address sender) internal  {

         bool validBidTime = block.timestamp >= _auction.startTimestamp && block.timestamp < _auction.endTimestamp;
       bool validStatus = _auction.status == Status.CREATED || _auction.status == Status.STARTED;
       if(!validBidTime || !validStatus) {
        revert __Auction_InvalidBidTime();
       }
         
        bool isWinningBid = isNewWinningBid(_auctionId, _bidAmount);
        if(!isWinningBid) {
            revert __AuctionLogic_InvalidBidAmount();
        }
      
    
      }

 function isNewWinningBid(uint256 auctionId, uint256 bidAmount) public view returns (bool isWinningBid){
  AuctionStorage.Data storage data =  _getAuctionStorageData();
       int256 index = data.auctionIdToIndex[auctionId];
       Auction memory auction = data.auctions[uint256(index)];
        uint256 highestBid = data.auctionIdToHighestBid[auctionId].amount;
        uint64 bidBuffer = auction.bidBufferBps;
       uint256 winningBidBuffer;
       if(highestBid == 0) {           
            isWinningBid = bidAmount >= auction.minimumBidAmount;
       } else {
        if(auction.currency == NATIVE_TOKEN) {
          
           winningBidBuffer =  (((bidBuffer * ETH_BUFFER) / PERCENTAGE) * highestBid) / ETH_BUFFER;
        } else {
           uint8 ERC20_BUFFER = ERC20(auction.currency).decimals();
           winningBidBuffer = (((bidBuffer * (1*(10**ERC20_BUFFER))) / PERCENTAGE) * highestBid) / (1*(10**ERC20_BUFFER));
        }
         isWinningBid = bidAmount >= (highestBid + winningBidBuffer)  ;
       }     
 }

      function cancelAuction(uint256 _auctionId) external {
        address creator = _msgSender();
      AuctionStorage.Data storage data =  _getAuctionStorageData();
       int256 index = data.auctionIdToIndex[_auctionId];
       Auction memory auction = data.auctions[uint256(index)];
       if(creator != auction.auctionCreator || auction.status != Status.CREATED) {
        revert __AuctionLogic_UnauthorizedToCall();
       }
        Auction[] memory auctionArr = data.auctions;
        uint256 length = auctionArr.length;
       data.auctions[uint256(index)].status = Status.CANCELLED;
        uint256 newAuctionId = auctionArr[uint256(index)].auctionId;

       data.auctions[uint256(index)] =  auctionArr[length - 1];
       data.auctions.pop();
       data.auctionIdToIndex[newAuctionId] = index;
       data.auctionIdToIndex[_auctionId] = -1;
      
      }

     function _getAuctionId() internal returns (uint256 _id) {
        _getAuctionStorageData().auctionId += 1;
        _id = _getAuctionStorageData().auctionId;
    }

       function _getAuctionStorageData()
        internal
        pure
        returns (AuctionStorage.Data storage _data)
    {
        _data = AuctionStorage.data();
    }

      function _validateAuction(
        AuctionParameters memory _params,
        address _creator
    ) internal  returns(TokenType _tokenType) {
         _tokenType = _validateAssetContract(_params.assetContract);
     _validateCreatorRequirements(
            _params.assetContract,
            _tokenType,
            _creator,
            _params.tokenId
            
        );
        _validateAuctionCurrency(_params.currency);
       
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
            revert __AuctionLogic_InvalidAssetContract(_assetContract);
        }
    }

     function _validateCreatorRequirements(
        address _assetContract,
        TokenType _tokenType,
        address _creator,
        uint256 _tokenId
    ) internal {
        address _market = address(this);
        if (_tokenType == TokenType.ERC721) {
            IERC721(_assetContract).safeTransferFrom(_creator, _market, _tokenId);  
        } else if (_tokenType == TokenType.ERC1155) {    
       IERC1155(_assetContract).safeTransferFrom(_creator,_market, _tokenId, 1, bytes(""));      
            }
        
    }

     function getIsApprovedCurrency(
        address _currency
    ) internal view returns (bool isCurrencyApproved) {
        isCurrencyApproved = _getApprovedCurrencyStorageData()
            .currencyToIsInserted[_currency];
    }
     function _getApprovedCurrencyStorageData()
        internal
        pure
        returns (ApprovedCurrencyLibStorage.Data storage _data)
    {
        _data = ApprovedCurrencyLibStorage.data();
    }


    function _validateAuctionCurrency(address _currency) internal view {
        bool isCurrencyApproved = getIsApprovedCurrency(_currency);
        if (!isCurrencyApproved) {
            revert __AuctionLogic_InvalidAuctionCurrency(_currency);
        }
    }
}