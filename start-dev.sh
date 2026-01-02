#!/bin/bash

# Colors for output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo -e "${BLUE}🚀 Starting Crypt-Payment Development Environment...${NC}"
echo ""

# Create log directory if it doesn't exist
mkdir -p .dev-logs

# Function to cleanup background processes on exit
cleanup() {
    echo -e "\n${YELLOW}🛑 Stopping all services...${NC}"
    kill $(jobs -p) 2>/dev/null
    exit
}

# Trap CTRL+C and other termination signals
trap cleanup SIGINT SIGTERM

# Start Hardhat node in the background
echo -e "${GREEN}📦 Starting Hardhat Node...${NC}"
npx hardhat node > .dev-logs/hardhat-node.log 2>&1 &
HARDHAT_PID=$!

# Wait for Hardhat node to start (give it 5 seconds)
echo -e "${YELLOW}⏳ Waiting for Hardhat node to initialize...${NC}"
sleep 5

# Deploy contracts
echo -e "${GREEN}📝 Deploying contracts to local network...${NC}"
npx hardhat run scripts/deploy.js --network localhost > .dev-logs/deploy.log 2>&1
if [ $? -eq 0 ]; then
    echo -e "${GREEN}✅ Contracts deployed successfully${NC}"
else
    echo -e "${YELLOW}⚠️  Contract deployment had issues. Check .dev-logs/deploy.log${NC}"
fi

# Start backend server
echo -e "${GREEN}🐍 Starting Backend Server...${NC}"
cd backend
source env/bin/activate
uvicorn app.main:app --host 0.0.0.0 --port 8000 > ../.dev-logs/backend.log 2>&1 &
BACKEND_PID=$!
cd ..

# Wait a moment for backend to start
sleep 2

# Start frontend
echo -e "${GREEN}📱 Starting Frontend (Expo)...${NC}"
echo -e "${YELLOW}👉 Scan the QR code below with your mobile device${NC}"
cd frontend
npx expo start
cd ..

# Notes:
# Expo is running in the foreground now. 
# Script will exit when Expo is stopped (CTRL+C).
# Background processes (Hardhat, Backend) will be cleaned up by the trap.

echo ""
echo -e "${GREEN}✨ All services started successfully!${NC}"
echo ""
echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "${GREEN}📊 Service Status:${NC}"
echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "  🔗 Hardhat Node:    Running (PID: $HARDHAT_PID)"
echo -e "  🐍 Backend API:     http://localhost:8000"
echo -e "  📱 Frontend:       http://localhost:8081"
echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo ""
echo -e "${YELLOW}📋 Logs available in .dev-logs/ directory${NC}"
echo -e "${YELLOW}Press CTRL+C to stop all services${NC}"
echo ""
