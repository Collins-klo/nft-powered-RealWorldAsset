# NFT-Powered Real World Assets (RWA) Platform

A decentralized platform for tokenizing and trading real-world assets like real estate and bonds using blockchain technology.

## Features

### For Users
- **Browse Assets**: View available real estate and bond investments
- **Buy Shares**: Purchase fractional ownership in real-world assets
- **Portfolio Management**: Track your investments and share ownership
- **Wallet Integration**: Connect with MetaMask or other Web3 wallets

### For Administrators
- **Asset Creation**: Create new real estate and bond assets
- **Fund Management**: Withdraw collected funds from assets
- **Asset Management**: Activate/deactivate assets and monitor performance
- **Owner Controls**: Full administrative control over the platform

## Technology Stack

- **Frontend**: Next.js 14, React, Tailwind CSS
- **Blockchain**: Ethereum, Solidity, Ethers.js
- **Smart Contract**: RWATokenization.sol (OpenZeppelin-based)
- **Wallet Integration**: RainbowKit, Wagmi
- **User Management**: Supabase (off-chain user data)

## Smart Contract Features

The `RWATokenization.sol` contract provides:

- **Asset Management**: Create and manage real estate and bond assets
- **Share Trading**: Buy and sell fractional shares of assets
- **Payment Processing**: Handle native ETH and ERC20 token payments
- **Access Control**: Owner-only administrative functions
- **Event Tracking**: Comprehensive event logging for transparency

## Setup Instructions

### 1. Prerequisites
- Node.js 18+ 
- npm or yarn
- MetaMask or other Web3 wallet
- Ethereum development environment (for contract deployment)

### 2. Installation
```bash
# Clone the repository
git clone <repository-url>
cd nft-powered-RealWorldAsset

# Install dependencies
npm install
# or
yarn install
```

### 3. Environment Configuration
Create a `.env.local` file in the root directory:

```env
# Contract address - replace with your deployed contract address
NEXT_PUBLIC_CONTRACT_ADDRESS=0x0000000000000000000000000000000000000000

# Optional: Supabase configuration for user management
# NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
# NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### 4. Contract Deployment
```bash
# Deploy the smart contract using Foundry
forge build
forge script script/Deploy.s.sol --rpc-url <your_rpc_url> --private-key <your_private_key> --broadcast

# Update the contract address in .env.local
```

### 5. Run the Application
```bash
# Development mode
npm run dev
# or
yarn dev

# Open http://localhost:3000 in your browser
```

## Project Structure

```
├── app/                    # Next.js app directory
│   ├── admin/             # Admin dashboard and functions
│   ├── bonds/             # Bond listing page
│   ├── estates/           # Real estate listing page
│   ├── profile/           # User profile and investments
│   └── bond-details/      # Individual bond detail pages
├── components/            # Reusable React components
├── constants/             # ABI and configuration
├── utils/                 # Utility functions and contract interactions
├── src/                   # Smart contract source code
└── abi/                   # Contract ABI files
```

## Usage

### For Users
1. Connect your wallet using the Connect Wallet button
2. Browse available assets on the Bonds or Estates pages
3. Click on an asset to view details and buy shares
4. View your investments in the Profile section

### For Administrators
1. Connect your wallet (must be the contract owner)
2. Access the Admin Dashboard
3. Create new assets using the Create Estate or Create Bond forms
4. Manage existing assets and withdraw funds as needed

## Security Features

- **Access Control**: Only contract owner can create assets and withdraw funds
- **Reentrancy Protection**: OpenZeppelin ReentrancyGuard implementation
- **Input Validation**: Comprehensive parameter validation
- **Event Logging**: All transactions are logged for transparency

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is licensed under the MIT License.

## Support

For support and questions, please open an issue in the repository.
