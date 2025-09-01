#!/bin/bash

echo "🚀 Setting up Foundry for WSL..."

# Check if we're in WSL
if ! grep -qi microsoft /proc/version; then
    echo "⚠️  This script is designed for WSL. You may be in a different environment."
fi

# Install Foundry
echo "📦 Installing Foundry..."
curl -L https://foundry.paradigm.xyz | bash

# Reload shell configuration
echo "🔄 Reloading shell configuration..."
source ~/.bashrc

# Verify installation
echo "✅ Verifying installation..."
if command -v forge &> /dev/null; then
    echo "✅ Foundry installed successfully!"
    forge --version
else
    echo "❌ Foundry installation failed. Trying alternative method..."
    # Try alternative installation
    curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh -s -- -y
    source ~/.cargo/env
    curl -L https://foundry.paradigm.xyz | bash
    source ~/.bashrc
    foundryup
fi

# Initialize Foundry in the project
echo "🔧 Initializing Foundry in project..."
forge init --force

# Install dependencies
echo "📚 Installing dependencies..."
forge install

# Build contracts
echo "🔨 Building contracts..."
forge build

# Run tests
echo "🧪 Running tests..."
forge test

echo "🎉 Foundry setup complete!"
echo ""
echo "Available commands:"
echo "  forge build    - Build contracts"
echo "  forge test     - Run tests"
echo "  forge test -vvv - Run tests with verbose output"
echo "  anvil          - Start local blockchain"
echo "  cast           - Interact with contracts"
