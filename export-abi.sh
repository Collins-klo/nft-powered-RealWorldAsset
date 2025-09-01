#!/bin/bash

# Create abi folder inside root
mkdir -p /abi

echo "Exporting ABIs..."

# Export RWATokenization ABI
forge inspect RWATokenization abi > /abi/RWATokenization.json

echo "✅ ABIs exported to /abi/"
