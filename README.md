# 🏢💰 TokenizedAssets: Blockchain-Based Asset Tokenization Platform 🏦🔗

TokenizedAssets is a revolutionary DeFi platform that democratizes access to real estate and bond investments through blockchain technology. By tokenizing these traditionally high-barrier assets, we enable fractional ownership, increased liquidity, and transparent management of investment portfolios.

## 🌟 Features

- **Dual Asset Types** 🏗️💼
  - **REITs (Real Estate Investment Trusts)**: Invest in property portfolios with monthly rental income
  - **Bonds**: Fixed-income securities with predetermined maturity periods and interest rates

- **Fractional Ownership** 🧩
  - Invest with any amount within your budget
  - Receive NFTs representing your exact ownership percentage
  - Participate in investments previously accessible only to high-net-worth individuals

- **Transparent Returns** 📊
  - Automatic distribution of income proportional to ownership stake
  - Real-time tracking of contributions and expected returns
  - Complete visibility into all investment activities

- **Blockchain Security** 🔒
  - All transactions and ownership records secured on Hedera blockchain
  - Smart contract-enforced compliance with investment terms
  - Immutable record of all asset activities and distributions

## 🚀 How It Works

1. **Asset Creation**
   - Asset originators create REITs or Bonds by specifying details like target amount, description, and return parameters
   - For REITs: Set monthly rent estimates and upload property images (up to 3)
   - For Bonds: Define maturity period, interest rate (valuation percentage), and upload certificate image

2. **Investment Process**
   - Contributors transfer USDT to participate in available investment opportunities
   - Smart contract mints NFTs representing exact ownership percentage
   - Investment period remains open until funding target is reached or deadline passes

3. **Return Distribution**
   - Asset owners distribute payments through the smart contract
   - Returns automatically allocated to all contributors based on their ownership percentage
   - For Bonds: Returns calculated based on predefined interest rates and contribution amounts

4. **Portfolio Management**
   - Investors can view all their assets and contributions in one place
   - Track expected returns and payment history
   - Manage investment NFTs representing ownership stakes

## 💻 Technical Architecture

The platform is built on the Hedera blockchain using Solidity smart contracts with the following components:

- **ERC721 Token Standard**: For creating unique NFTs representing ownership stakes
- **OpenZeppelin Libraries**: Ensuring security and standard compliance
- **USDT Integration**: For stable currency transactions and distributions
- **On-Chain Metadata**: Complete investment details embedded in token URIs

### Smart Contracts

The core contract `TokenizedAssets.sol` handles:
- Asset creation and management
- Contribution processing
- NFT minting with ownership metadata
- Return calculation and distribution
- Portfolio tracking and reporting

## 🔍 Deployed Contracts

### Hedera testnet tx hash

0xc387503ca11ca7ca0552aa73b1c2ee34c5aef6076f82510379d3bd9e979c4c31
0x01dd795de42b20de054a4903442f3febb175ff191a9b7d4ed7b7429abf7d2dd4
0x41c445193afe8666ca5890a2e050b85c977e4690fcbbffa7b6443fe1f956251e
0xcbe067fafc68b5f6908af1d713b2a28e0702720b33248a63fcbd6ab701b1e684


## 🛠️ Development Setup

```bash
# Clone the repository
git clone https://github.com/yourusername/tokenized-assets.git
cd tokenized-assets

# Install dependencies
npm install

# Compile contracts
npx hardhat compile

# Run tests
npx hardhat test

# Deploy (local)
npx hardhat run scripts/deploy.js
```

## 📚 API Reference

### Asset Creation

```javascript
// Create a REIT
function createREIT(
    address _owner,
    string memory _companyName,
    string memory _description,
    uint256 _amount,
    uint256 _monthlyRentEstimate,
    uint256 _deadline,
    string[] memory _images
) external returns (uint256)

// Create a Bond
function createBond(
    address _owner,
    string memory _bondName,
    string memory _description,
    uint256 _amount,
    uint256 _period,
    uint256 _valuationPercentage,
    uint256 _deadline,
    string memory _image
) external returns (uint256)
```

### Investment Functions

```javascript
// Contribute to an asset
function contribute(uint256 _assetId, uint256 _amount) external

// Calculate bond return
function calculateBondReturn(uint256 _assetId, address _contributor) public view returns (uint256)

// Distribute payments
function distributePayments(uint256 _assetId, uint256 _amount) external
```

### Query Functions

```javascript
// Get asset details
function getAssetDetails(uint256 _assetId) external view

// Get contributors list
function getContributors(uint256 _assetId) external view returns (address[] memory)

// Get contributor's assets
function getContributorAssets(address _contributor) external view returns (uint256[] memory)
```

## 🔐 Security Considerations

- All contracts undergo rigorous auditing before deployment
- Administrative functions limited to asset creators and platform administrators
- Contribution limits ensure proper diversification
- Deadline enforcement prevents indefinite fundraising
- Proportional distribution guarantees fair returns


