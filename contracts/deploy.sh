#!/bin/bash

# YieldMaker Contract Deployment Script for Celo Alfajores
# This script deploys all necessary contracts to Celo Alfajores testnet

set -e  # Exit on error

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Network Configuration
NETWORK="Celo Alfajores Testnet"
CHAIN_ID=44787
RPC_URL="${CELO_ALFAJORES_RPC:-https://alfajores-forno.celo-testnet.org}"
EXPLORER_URL="https://alfajores.celoscan.io"

# Contract addresses
# cUSD on Celo Alfajores
CUSD_ADDRESS="${CUSD_ALFAJORES:-0x874069Fa1Eb16D44d622F2e0Ca25eeA172369bC1}"

echo -e "${BLUE}╔════════════════════════════════════════════════════════╗${NC}"
echo -e "${BLUE}║         YieldMaker Deployment Script                   ║${NC}"
echo -e "${BLUE}║         Network: ${NETWORK}                  ║${NC}"
echo -e "${BLUE}╚════════════════════════════════════════════════════════╝${NC}\n"

# Check prerequisites
echo -e "${YELLOW}Checking prerequisites...${NC}"

# Check if .env file exists
if [ ! -f ".env" ]; then
    echo -e "${RED}Error: .env file not found${NC}"
    echo "Please create a .env file with:"
    echo "PRIVATE_KEY=your_private_key_here"
    echo "HASHED_SCOPE=your_hashed_scope_here"
    echo "CELO_ALFAJORES_RPC=https://alfajores-forno.celo-testnet.org"
    exit 1
fi

# Source environment variables
source .env

# Check required environment variables
if [ -z "$PRIVATE_KEY" ]; then
    echo -e "${RED}Error: PRIVATE_KEY not set in .env${NC}"
    exit 1
fi

if [ -z "$HASHED_SCOPE" ]; then
    echo -e "${YELLOW}Warning: HASHED_SCOPE not set in .env${NC}"
    echo "You need to run: cd .. && npm run calculate-scope"
    read -p "Continue anyway? (y/n) " -n 1 -r
    echo
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        exit 1
    fi
fi

# Get deployer address
DEPLOYER=$(cast wallet address $PRIVATE_KEY 2>/dev/null || echo "Unable to determine")
echo -e "${GREEN}✓${NC} Deployer address: ${DEPLOYER}"

# Check balance
if [ "$DEPLOYER" != "Unable to determine" ]; then
    BALANCE=$(cast balance $DEPLOYER --rpc-url $RPC_URL 2>/dev/null || echo "0")
    BALANCE_ETH=$(echo "scale=4; $BALANCE / 1000000000000000000" | bc 2>/dev/null || echo "0")
    echo -e "${GREEN}✓${NC} Balance: ${BALANCE_ETH} CELO"

    # Check minimum balance
    MIN_BALANCE="100000000000000000" # 0.1 CELO
    if [ "$BALANCE" -lt "$MIN_BALANCE" ]; then
        echo -e "${RED}Error: Insufficient balance (need at least 0.1 CELO)${NC}"
        echo "Get testnet CELO from: https://faucet.celo.org"
        exit 1
    fi
fi

# Check chain ID
ACTUAL_CHAIN_ID=$(cast chain-id --rpc-url $RPC_URL 2>/dev/null || echo "0")
if [ "$ACTUAL_CHAIN_ID" != "$CHAIN_ID" ]; then
    echo -e "${RED}Error: Wrong network!${NC}"
    echo "Expected Chain ID: $CHAIN_ID"
    echo "Actual Chain ID: $ACTUAL_CHAIN_ID"
    exit 1
fi
echo -e "${GREEN}✓${NC} Connected to correct network (Chain ID: $CHAIN_ID)"

echo -e "\n${BLUE}═══════════════════════════════════════════════════════${NC}"
echo -e "${BLUE}Starting deployment...${NC}"
echo -e "${BLUE}═══════════════════════════════════════════════════════${NC}\n"

# Deployment log file
LOG_FILE="deployment-$(date +%Y%m%d-%H%M%S).log"
echo "Deployment started at $(date)" > $LOG_FILE
echo "Network: $NETWORK" >> $LOG_FILE
echo "Chain ID: $CHAIN_ID" >> $LOG_FILE
echo "Deployer: $DEPLOYER" >> $LOG_FILE
echo "---" >> $LOG_FILE

# Function to deploy a contract
deploy_contract() {
    local script_name=$1
    local contract_name=$2

    echo -e "\n${YELLOW}[1/3] Deploying ${contract_name}...${NC}"

    forge script script/${script_name}.s.sol \
        --rpc-url $RPC_URL \
        --broadcast \
        -vvv \
        2>&1 | tee -a $LOG_FILE

    if [ $? -eq 0 ]; then
        echo -e "${GREEN}✓ ${contract_name} deployed successfully${NC}"
        return 0
    else
        echo -e "${RED}✗ ${contract_name} deployment failed${NC}"
        return 1
    fi
}

# Step 1: Deploy SelfVerificationRegistry
echo -e "\n${BLUE}═══════════════════════════════════════════════════════${NC}"
echo -e "${BLUE}Step 1: Deploy SelfVerificationRegistry${NC}"
echo -e "${BLUE}═══════════════════════════════════════════════════════${NC}"

if deploy_contract "DeploySelfVerificationRegistryFixed" "SelfVerificationRegistry"; then
    # Extract deployed address from logs
    REGISTRY_ADDRESS=$(grep "SelfVerificationRegistry:" $LOG_FILE | tail -1 | awk '{print $NF}')
    echo -e "${GREEN}Registry Address: ${REGISTRY_ADDRESS}${NC}"
    echo "REGISTRY_ADDRESS=$REGISTRY_ADDRESS" >> deployment.env
else
    echo -e "${RED}Failed to deploy SelfVerificationRegistry. Exiting.${NC}"
    exit 1
fi

# Step 2: Deploy YieldmakerVault with SimpleHoldStrategy
echo -e "\n${BLUE}═══════════════════════════════════════════════════════${NC}"
echo -e "${BLUE}Step 2: Deploy YieldmakerVault + SimpleHoldStrategy${NC}"
echo -e "${BLUE}═══════════════════════════════════════════════════════${NC}"

echo -e "${GREEN}✓${NC} Using cUSD on Alfajores: ${CUSD_ADDRESS}"

if [ "$VAULT_SKIPPED" != "true" ]; then
    if deploy_contract "DeployYieldmakerVaultV2" "YieldmakerVault"; then
        # Extract deployed addresses
        VAULT_ADDRESS=$(grep "YieldmakerVault deployed to:" $LOG_FILE | tail -1 | awk '{print $NF}')
        STRATEGY_ADDRESS=$(grep "SimpleHoldStrategy deployed to:" $LOG_FILE | tail -1 | awk '{print $NF}')
        echo -e "${GREEN}Vault Address: ${VAULT_ADDRESS}${NC}"
        echo -e "${GREEN}Strategy Address: ${STRATEGY_ADDRESS}${NC}"
        echo "VAULT_ADDRESS=$VAULT_ADDRESS" >> deployment.env
        echo "STRATEGY_ADDRESS=$STRATEGY_ADDRESS" >> deployment.env
    else
        echo -e "${YELLOW}Vault deployment failed, but continuing...${NC}"
    fi
fi

# Step 3: Connect Registry to Vault (if vault deployed)
if [ ! -z "$VAULT_ADDRESS" ] && [ ! -z "$REGISTRY_ADDRESS" ]; then
    echo -e "\n${BLUE}═══════════════════════════════════════════════════════${NC}"
    echo -e "${BLUE}Step 3: Connect Registry to Vault${NC}"
    echo -e "${BLUE}═══════════════════════════════════════════════════════${NC}"

    echo -e "${YELLOW}Setting verification registry in vault...${NC}"
    cast send $VAULT_ADDRESS \
        "setVerificationRegistry(address)" $REGISTRY_ADDRESS \
        --rpc-url $RPC_URL \
        --private-key $PRIVATE_KEY \
        2>&1 | tee -a $LOG_FILE

    if [ $? -eq 0 ]; then
        echo -e "${GREEN}✓ Registry connected to vault${NC}"
    else
        echo -e "${YELLOW}Warning: Failed to connect registry to vault${NC}"
    fi
fi

# Final Summary
echo -e "\n${BLUE}╔════════════════════════════════════════════════════════╗${NC}"
echo -e "${BLUE}║         DEPLOYMENT COMPLETE                            ║${NC}"
echo -e "${BLUE}╚════════════════════════════════════════════════════════╝${NC}\n"

echo -e "${GREEN}Deployed Contracts:${NC}"
echo -e "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

if [ ! -z "$REGISTRY_ADDRESS" ]; then
    echo -e "${GREEN}✓${NC} SelfVerificationRegistry:"
    echo -e "  ${REGISTRY_ADDRESS}"
    echo -e "  ${EXPLORER_URL}/address/${REGISTRY_ADDRESS}\n"
fi

if [ ! -z "$VAULT_ADDRESS" ]; then
    echo -e "${GREEN}✓${NC} YieldmakerVault:"
    echo -e "  ${VAULT_ADDRESS}"
    echo -e "  ${EXPLORER_URL}/address/${VAULT_ADDRESS}\n"
fi

if [ ! -z "$STRATEGY_ADDRESS" ]; then
    echo -e "${GREEN}✓${NC} SimpleHoldStrategy:"
    echo -e "  ${STRATEGY_ADDRESS}"
    echo -e "  ${EXPLORER_URL}/address/${STRATEGY_ADDRESS}\n"
fi

echo -e "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n"

# Save to deployment.env
echo -e "${BLUE}Deployment addresses saved to: deployment.env${NC}"
echo -e "${BLUE}Deployment log saved to: $LOG_FILE${NC}\n"

# Next steps
echo -e "${YELLOW}Next Steps:${NC}"
echo -e "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo -e "1. Update frontend contract addresses:"
echo -e "   ${BLUE}frontend/src/contracts/addresses/index.ts${NC}\n"

echo -e "2. Update frontend environment variables:"
echo -e "   ${BLUE}frontend/.env.local${NC}"
if [ ! -z "$REGISTRY_ADDRESS" ]; then
    echo -e "   NEXT_PUBLIC_YIELDMAKER_CONTRACT_ADDRESS_44787=${VAULT_ADDRESS:-TBD}"
fi
echo ""

echo -e "3. Test the application:"
echo -e "   ${BLUE}cd ../frontend && npm run dev${NC}\n"

echo -e "4. Verify contracts on block explorer:"
echo -e "   ${BLUE}${EXPLORER_URL}${NC}\n"

echo -e "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n"

echo -e "${GREEN}Deployment script completed successfully!${NC}"
echo -e "${GREEN}All addresses saved to deployment.env${NC}\n"
