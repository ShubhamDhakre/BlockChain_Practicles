#!/bin/bash
# Blockchain Environment Setup Script
# Installs core development tools for Ethereum & Smart Contract Development

echo "=========================================================="
echo "    Setting up Blockchain Development Environment"
echo "=========================================================="

echo "[1/4] Checking Node.js and NPM..."
node -v
npm -v

echo "[2/4] Installing Truffle globally..."
npm install -g truffle --loglevel=error

echo "[3/4] Installing Ganache CLI globally..."
npm install -g ganache --loglevel=error

echo "[4/4] Installing local development dependencies (Hardhat)..."
npm install --save-dev hardhat

echo "=========================================================="
echo "    Setup completed successfully!"
echo "=========================================================="
