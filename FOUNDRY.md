# Foundry Setup for NFT-Powered Real World Assets (WSL)

This project uses Foundry for smart contract development, testing, and deployment.

## Installation for WSL (Windows Subsystem for Linux)

### Method 1: Using the official installer (Recommended)
```bash
curl -L https://foundry.paradigm.xyz | bash
```

After installation, restart your terminal or run:
```bash
source ~/.bashrc
```

### Method 2: Using foundryup
```bash
curl -L https://foundry.paradigm.xyz | bash
foundryup
```

### Method 3: Manual installation
```bash
# Install Rust (if not already installed)
curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh
source ~/.cargo/env

# Install Foundry
curl -L https://foundry.paradigm.xyz | bash
source ~/.bashrc
foundryup
```

## Verify Installation
```bash
forge --version
cast --version
anvil --version
```

## Setup

1. **Initialize Foundry in your project:**
```bash
forge init --force
```

2. **Install dependencies:**
```bash
forge install
```

3. **Build contracts:**
```bash
forge build
```

4. **Run tests:**
```bash
forge test
```

## Available Scripts

- `npm run forge:build` - Build all contracts
- `npm run forge:test` - Run tests
- `npm run forge:test:verbose` - Run tests with verbose output
- `npm run forge:test:gas` - Run tests with gas reporting
- `npm run forge:deploy` - Deploy contracts
- `npm run anvil` - Start local Anvil blockchain

## Environment Variables

Create a `.env` file with:
```
PRIVATE_KEY=your_private_key_here
MAINNET_RPC_URL=your_mainnet_rpc_url
SEPOLIA_RPC_URL=your_sepolia_rpc_url
ETHERSCAN_API_KEY=your_etherscan_api_key
```

## Testing

Tests are located in the `test/` directory. Run them with:
```bash
forge test
```

For verbose output:
```bash
forge test -vvv
```

For gas reporting:
```bash
forge test --gas-report
```

## Deployment

1. Set your private key in `.env`
2. Run the deployment script:
```bash
forge script script/Deploy.s.sol --rpc-url <your_rpc_url> --broadcast
```

## Local Development

Start a local Anvil instance:
```bash
anvil
```

Fork mainnet for testing:
```bash
anvil --fork-url <your_mainnet_rpc_url>
```

## Contract Verification

After deployment, verify your contract:
```bash
forge verify-contract <contract_address> src/RWATokenization.sol --chain-id <chain_id>
```

## WSL-Specific Notes

- Make sure you're in the WSL environment when running Foundry commands
- If you encounter permission issues, you may need to run `chmod +x` on Foundry binaries
- For better performance, consider running your project from the WSL filesystem rather than mounted Windows drives
- Use `wsl.exe` from Windows PowerShell if you need to access WSL from Windows

## Troubleshooting

### Common WSL Issues:

1. **Permission denied errors:**
```bash
chmod +x ~/.foundry/bin/*
```

2. **Path not found:**
```bash
export PATH="$HOME/.foundry/bin:$PATH"
```

3. **Rust not found:**
```bash
curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh
source ~/.cargo/env
```
