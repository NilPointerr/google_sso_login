#!/bin/bash

# Script to run both backend and frontend projects locally

# Colors for output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Function to cleanup on exit
cleanup() {
    echo -e "\n${YELLOW}Shutting down servers...${NC}"
    if [ ! -z "$BACKEND_PID" ]; then
        kill $BACKEND_PID 2>/dev/null
    fi
    if [ ! -z "$FRONTEND_PID" ]; then
        kill $FRONTEND_PID 2>/dev/null
    fi
    exit
}

# Trap Ctrl+C and call cleanup
trap cleanup INT TERM

# Get the directory where the script is located
SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
cd "$SCRIPT_DIR"

# Check if .env exists in backend
if [ ! -f "google-sso-backend/.env" ]; then
    echo -e "${YELLOW}Warning: google-sso-backend/.env not found.${NC}"
    echo -e "${YELLOW}Please copy sample.env to .env and update with your credentials.${NC}"
    echo ""
fi

# Check if node_modules exists in frontend
if [ ! -d "google-sso-frontend/node_modules" ]; then
    echo -e "${YELLOW}Frontend dependencies not found. Installing...${NC}"
    cd google-sso-frontend
    npm install
    cd ..
fi

# Determine Python command (prefer uv if available, then python3, then python)
if command -v uv &> /dev/null; then
    PYTHON_CMD="uv run"
    echo -e "${BLUE}Using uv for backend...${NC}"
    # Make sure dependencies are installed
    cd google-sso-backend
    uv sync > /dev/null 2>&1
    cd ..
elif command -v python3 &> /dev/null; then
    PYTHON_CMD="python3 -m"
    echo -e "${BLUE}Using python3 for backend...${NC}"
    echo -e "${YELLOW}Note: Make sure dependencies are installed with: pip install -e .${NC}"
elif command -v python &> /dev/null; then
    PYTHON_CMD="python -m"
    echo -e "${BLUE}Using python for backend...${NC}"
    echo -e "${YELLOW}Note: Make sure dependencies are installed with: pip install -e .${NC}"
else
    echo -e "${RED}Error: Python not found. Please install Python 3.12+${NC}"
    exit 1
fi

# Start Backend (FastAPI)
echo -e "${BLUE}Starting Backend (FastAPI) on http://localhost:8000...${NC}"
cd google-sso-backend
$PYTHON_CMD uvicorn main:app --reload --port 8000 > ../backend.log 2>&1 &
BACKEND_PID=$!
cd ..

# Wait a moment for backend to start
sleep 2

# Check if backend started successfully
if ! kill -0 $BACKEND_PID 2>/dev/null; then
    echo -e "${RED}Error: Backend failed to start. Check backend.log for details.${NC}"
    exit 1
fi

# Start Frontend (Next.js)
echo -e "${GREEN}Starting Frontend (Next.js) on http://localhost:3000...${NC}"
cd google-sso-frontend
npm run dev > ../frontend.log 2>&1 &
FRONTEND_PID=$!
cd ..

# Wait a moment for frontend to start
sleep 2

# Check if frontend started successfully
if ! kill -0 $FRONTEND_PID 2>/dev/null; then
    echo -e "${RED}Error: Frontend failed to start. Check frontend.log for details.${NC}"
    kill $BACKEND_PID 2>/dev/null
    exit 1
fi

echo -e "\n${GREEN}✓ Both servers are running!${NC}"
echo -e "${BLUE}Backend: http://localhost:8000${NC}"
echo -e "${GREEN}Frontend: http://localhost:3000${NC}"
echo -e "\n${YELLOW}Logs:${NC}"
echo -e "  Backend:  tail -f backend.log"
echo -e "  Frontend: tail -f frontend.log"
echo -e "\n${YELLOW}Press Ctrl+C to stop both servers${NC}\n"

# Wait for both processes
wait

