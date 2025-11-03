#!/bin/bash

# YieldMaker Interactive Deployment Script
# Choose between Alfajores Testnet or Celo Mainnet

set -e  # Exit on error
set -o pipefail  # Fail on pipeline errors

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
CYAN='\033[0;36m'
NC='\033[0m' # No Color

echo -e "${BLUE}╔════════════════════════════════════════════════════════╗${NC}"
echo -e "${BLUE}║       YieldMaker Interactive Deployment Script         ║${NC}"
echo -e "${BLUE}╚════════════════════════════════════════════════════════╝${NC}\n"

# Prompt for network selection
echo -e "${CYAN}Select deployment network:${NC}"
echo -e "${GREEN}1)${NC} Celo Alfajores Testnet (Chain ID: 44787)"
echo -e "${GREEN}2)${NC} Celo Mainnet (Chain ID: 42220)"
echo ""
read -p "Enter your choice (1 or 2): " network_choice

case $network_choice in
    1)
        NETWORK="Celo Alfajores Testnet"
        CHAIN_ID=44787
        RPC_URL="${CELO_ALFAJORES_RPC:-https://alfajores-forno.celo-testnet.org}"
        EXPLORER_URL="https://alfajores.celoscan.io"
        CUSD_ADDRESS="${CUSD_ALFAJORES:-0x874069Fa1Eb16D44d622F2e0Ca25eeA172369bC1}"
        SELF_HUB_ADDRESS="0x68c931C9a534D37aa78094877F46fE46a49F1A51"
        DEPLOYMENT_SCRIPT="DeploySelfVerificationRegistryFixed"
        VAULT_SCRIPT="DeployYieldmakerVaultV2"
        ENV_SUFFIX="44787"
        ;;
    2)
        NETWORK="Celo Mainnet"
        CHAIN_ID=42220
        RPC_URL="${CELO_MAINNET_RPC:-https://forno.celo.org}"
        EXPLORER_URL="https://celoscan.io"
        CUSD_ADDRESS="${CUSD_MAINNET:-0x765DE816845861e75A25fCA122bb6898B8B1282a}"
        SELF_HUB_ADDRESS="0xe57F4773bd9c9d8b6Cd70431117d353298B9f5BF"
        DEPLOYMENT_SCRIPT="DeploySelfVerificationRegistryMainnet"
        VAULT_SCRIPT="DeployYieldmakerVaultV2Mainnet"
        ENV_SUFFIX="42220"

        echo -e "\n${YELLOW}⚠️  WARNING: You are deploying to MAINNET!${NC}"
        echo -e "${YELLOW}   This will use real funds and deploy to production.${NC}"
        read -p "Are you sure you want to continue? (yes/no): " confirm
        if [[ $confirm != "yes" ]]; then
            echo -e "${RED}Deployment cancelled.${NC}"
            exit 0
        fi
        ;;
    *)
        echo -e "${RED}Invalid choice. Exiting.${NC}"
        exit 1
        ;;
esac

echo -e "\n${BLUE}═══════════════════════════════════════════════════════${NC}"
echo -e "${BLUE}Network: ${NETWORK}${NC}"
echo -e "${BLUE}Chain ID: ${CHAIN_ID}${NC}"
echo -e "${BLUE}RPC URL: ${RPC_URL}${NC}"
echo -e "${BLUE}Self Hub: ${SELF_HUB_ADDRESS}${NC}"
echo -e "${BLUE}═══════════════════════════════════════════════════════${NC}\n"

# Check prerequisites
echo -e "${YELLOW}Checking prerequisites...${NC}"

# Check if .env file exists
if [ ! -f ".env" ]; then
    echo -e "${RED}Error: .env file not found${NC}"
    echo "Please create a .env file with:"
    echo "PRIVATE_KEY=your_private_key_here"
    echo "HASHED_SCOPE=your_hashed_scope_here"
    exit 1
fi

# Preserve selected network variables, then source .env for secrets only
SELECTED_CHAIN_ID="$CHAIN_ID"
SELECTED_RPC_URL="$RPC_URL"
source .env
# Restore selection to prevent .env from overriding network choice
CHAIN_ID="$SELECTED_CHAIN_ID"
RPC_URL="$SELECTED_RPC_URL"

# Check required environment variables
if [ -z "$PRIVATE_KEY" ]; then
    echo -e "${RED}Error: PRIVATE_KEY not set in .env${NC}"
    exit 1
fi

if [ -z "$HASHED_SCOPE" ]; then
    echo -e "${YELLOW}Warning: HASHED_SCOPE not set in .env${NC}"
    echo "Run: cd .. && npm run calculate-scope"
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
    if [ $CHAIN_ID -eq 42220 ]; then
        MIN_BALANCE="1000000000000000000" # 1 CELO for mainnet
        MIN_DISPLAY="1"
    else
        MIN_BALANCE="100000000000000000" # 0.1 CELO for testnet
        MIN_DISPLAY="0.1"
    fi

    if [ "$BALANCE" -lt "$MIN_BALANCE" ]; then
        echo -e "${RED}Error: Insufficient balance (need at least ${MIN_DISPLAY} CELO)${NC}"
        if [ $CHAIN_ID -eq 44787 ]; then
            echo "Get testnet CELO from: https://faucet.celo.org"
        fi
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

    echo -e "\n${YELLOW}Deploying ${contract_name}...${NC}"

    forge script script/${script_name}.s.sol \
        --rpc-url $RPC_URL \
        --broadcast \
        -vvv \
        2>&1 | tee -a $LOG_FILE

    exitcode=${PIPESTATUS[0]}
    if [ $exitcode -eq 0 ]; then
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

if deploy_contract "$DEPLOYMENT_SCRIPT" "SelfVerificationRegistry"; then
    REGISTRY_ADDRESS=$(grep "SelfVerificationRegistry:" $LOG_FILE | tail -1 | awk '{print $NF}')
    echo -e "${GREEN}Registry Address: ${REGISTRY_ADDRESS}${NC}"
    echo "REGISTRY_ADDRESS_${ENV_SUFFIX}=$REGISTRY_ADDRESS" >> deployment.env
else
    echo -e "${RED}Failed to deploy SelfVerificationRegistry. Exiting.${NC}"
    exit 1
fi

# Step 2: Deploy YieldmakerVault
echo -e "\n${BLUE}═══════════════════════════════════════════════════════${NC}"
echo -e "${BLUE}Step 2: Deploy YieldmakerVault + SimpleHoldStrategy${NC}"
echo -e "${BLUE}═══════════════════════════════════════════════════════${NC}"

echo -e "${GREEN}✓${NC} Using cUSD: ${CUSD_ADDRESS}"

if deploy_contract "$VAULT_SCRIPT" "YieldmakerVault"; then
    VAULT_ADDRESS=$(grep "YieldmakerVault deployed to:" $LOG_FILE | tail -1 | awk '{print $NF}')
    STRATEGY_ADDRESS=$(grep "SimpleHoldStrategy deployed to:" $LOG_FILE | tail -1 | awk '{print $NF}')
    echo -e "${GREEN}Vault Address: ${VAULT_ADDRESS}${NC}"
    echo -e "${GREEN}Strategy Address: ${STRATEGY_ADDRESS}${NC}"
    echo "VAULT_ADDRESS_${ENV_SUFFIX}=$VAULT_ADDRESS" >> deployment.env
    echo "STRATEGY_ADDRESS_${ENV_SUFFIX}=$STRATEGY_ADDRESS" >> deployment.env
fi

# Step 3: Connect Registry to Vault
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

echo -e "${GREEN}Deployed Contracts on ${NETWORK}:${NC}"
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

echo -e "${BLUE}Deployment addresses saved to: deployment.env${NC}"
echo -e "${BLUE}Deployment log saved to: $LOG_FILE${NC}\n"

echo -e "${YELLOW}Next Steps:${NC}"
echo -e "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo -e "1. Update frontend .env.local:"
echo -e "   ${BLUE}NEXT_PUBLIC_YIELDMAKER_CONTRACT_ADDRESS_${ENV_SUFFIX}=${VAULT_ADDRESS}${NC}\n"

echo -e "2. Update frontend contract addresses in:"
echo -e "   ${BLUE}frontend/src/contracts/addresses/index.ts${NC}\n"

echo -e "3. Test the application:"
echo -e "   ${BLUE}cd ../frontend && npm run dev${NC}\n"

echo -e "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n"

echo -e "${GREEN}Deployment script completed successfully!${NC}\n"
