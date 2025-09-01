// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

/// @notice Minimal imports from OpenZeppelin. Ensure OpenZeppelin contracts are available in your project.

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

contract RWATokenization is Ownable, ReentrancyGuard {
    enum AssetType { RealEstate, Bond }

    struct Asset {
        uint256 id;
        AssetType assetType;
        string assetTitle;
        string assetDescription;
        uint256 valuation;
        uint256 deadline;
        uint256 amountCollected;
        string image;
        uint256 totalShares;
        uint256 sharesSold;
        uint256 sharePrice;
        address paymentToken;
        bool active;
    }

    // Asset storage
    Asset[] private assets;
    mapping(uint256 => address[]) public assetContributors;
    mapping(uint256 => mapping(address => uint256)) public sharesBoughtBy;
    mapping(uint256 => mapping(address => bool)) private hasContributed;

    // Events
    event AssetAdded(uint256 indexed assetId, AssetType assetType, string title, address indexed addedBy);
    event SharesPurchased(uint256 indexed assetId, address indexed buyer, uint256 shares, uint256 amountPaid, address paymentToken);
    event FundsWithdrawn(uint256 indexed assetId, address indexed to, uint256 amount, address paymentToken);
    event AssetUpdated(uint256 indexed assetId, bool active);

    /// @notice Constructor passes deployer as initial owner (required in OZ v5)
    constructor() Ownable(msg.sender) {}

    /* ========== ADMIN FUNCTIONS (onlyOwner) ========== */

    function addAsset(
        AssetType _assetType,
        string calldata _title,
        string calldata _description,
        uint256 _valuation,
        uint256 _deadline,
        string calldata _image,
        uint256 _totalShares,
        uint256 _sharePrice,
        address _paymentToken
    ) external onlyOwner returns (uint256) {
        require(_totalShares > 0, "totalShares>0");
        require(_sharePrice > 0, "sharePrice>0");

        uint256 assetId = assets.length;
        assets.push(Asset({
            id: assetId,
            assetType: _assetType,
            assetTitle: _title,
            assetDescription: _description,
            valuation: _valuation,
            deadline: _deadline,
            amountCollected: 0,
            image: _image,
            totalShares: _totalShares,
            sharesSold: 0,
            sharePrice: _sharePrice,
            paymentToken: _paymentToken,
            active: true
        }));

        emit AssetAdded(assetId, _assetType, _title, msg.sender);
        return assetId;
    }

    function setAssetActive(uint256 assetId, bool active) external onlyOwner {
        require(assetId < assets.length, "assetNotFound");
        assets[assetId].active = active;
        emit AssetUpdated(assetId, active);
    }

    /* ========== PURCHASE FUNCTIONS ========== */

    function buyShares(uint256 assetId, uint256 shares) external payable nonReentrant {
        require(assetId < assets.length, "assetNotFound");
        require(shares > 0, "shares>0");
        Asset storage a = assets[assetId];
        require(a.active, "assetNotActive");
        if (a.deadline != 0) {
            require(block.timestamp <= a.deadline, "deadlinePassed");
        }
        require(a.sharesSold + shares <= a.totalShares, "notEnoughShares");

        uint256 totalPrice = shares * a.sharePrice;

        if (a.paymentToken == address(0)) {
            require(msg.value == totalPrice, "incorrect native amt");
        } else {
            require(msg.value == 0, "dont send native for ERC20");
            IERC20 token = IERC20(a.paymentToken);
            bool ok = token.transferFrom(msg.sender, address(this), totalPrice);
            require(ok, "erc20 transfer failed");
        }

        a.sharesSold += shares;
        a.amountCollected += totalPrice;

        if (!hasContributed[assetId][msg.sender]) {
            assetContributors[assetId].push(msg.sender);
            hasContributed[assetId][msg.sender] = true;
        }
        sharesBoughtBy[assetId][msg.sender] += shares;

        emit SharesPurchased(assetId, msg.sender, shares, totalPrice, a.paymentToken);
    }

    /* ========== OWNER WITHDRAWALS ========== */

    function withdrawFunds(uint256 assetId, address payable to) external onlyOwner nonReentrant {
        require(assetId < assets.length, "assetNotFound");
        require(to != address(0), "invalidReceiver");
        Asset storage a = assets[assetId];
        uint256 amount = a.amountCollected;
        require(amount > 0, "noFunds");

        a.amountCollected = 0;

        if (a.paymentToken == address(0)) {
            (bool sent, ) = to.call{value: amount}("");
            require(sent, "native transfer failed");
        } else {
            IERC20 token = IERC20(a.paymentToken);
            bool ok = token.transfer(to, amount);
            require(ok, "erc20 transfer failed");
        }
        emit FundsWithdrawn(assetId, to, amount, a.paymentToken);
    }

    /* ========== VIEW HELPERS ========== */

    function getAssetCount() external view returns (uint256) {
        return assets.length;
    }

    function getAsset(uint256 assetId) external view returns (Asset memory) {
        require(assetId < assets.length, "assetNotFound");
        return assets[assetId];
    }

    function getContributors(uint256 assetId) external view returns (address[] memory) {
        require(assetId < assets.length, "assetNotFound");
        return assetContributors[assetId];
    }

    function getBuyerShares(uint256 assetId, address buyer) external view returns (uint256) {
        require(assetId < assets.length, "assetNotFound");
        return sharesBoughtBy[assetId][buyer];
    }

    /* ========== FALLBACKS ========== */
    receive() external payable {}
}
