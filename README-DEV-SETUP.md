# 🚀 Quick Start Guide

This guide explains how to start the entire Crypt-Payment application with a single command.

## Prerequisites

Before running the application, ensure you have:

- ✅ Node.js and npm installed
- ✅ Python 3.x installed
- ✅ Python virtual environment created in `backend/env/`
- ✅ All dependencies installed in each directory

## One-Command Startup

### Option 1: Shell Script (Mac/Linux) 🍎 🐧

Simply run:

```bash
./start-dev.sh
```

### Option 1B: Batch Script (Windows) 🪟

For Windows users, double-click or run:

```cmd
start-dev.bat
```

This will:
1. 🔗 Start the Hardhat local blockchain node
2. 📝 Deploy smart contracts to the local network
3. 🐍 Start the FastAPI backend server
4. 📱 Start the Expo frontend

All services run in the background with logs saved to `.dev-logs/` directory.

**To stop all services:** Press `CTRL+C` in the terminal running the script.

---

### Option 2: Using npm (Alternative)

```bash
npm run dev
```

This uses `concurrently` to run all services in parallel. Note: This doesn't include automatic contract deployment, but you can see all service outputs in one terminal with color-coded labels.

---

## Individual Commands (Manual Setup)

If you prefer to start services individually or need to debug:

### 1. Start Hardhat Node
```bash
npm run node
# or
npx hardhat node
```

### 2. Deploy Contracts (in a new terminal)
```bash
npm run deploy:localhost
# or
npx hardhat run scripts/deploy.js --network localhost
```

### 3. Start Backend (in a new terminal)
```bash
cd backend
source env/bin/activate
uvicorn app.main:app --host 0.0.0.0 --port 8000
```

### 4. Start Frontend (in a new terminal)
```bash
cd frontend
npx expo start
```

---

## Available npm Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start all services using concurrently |
| `npm start:all` | Start all services using the shell script |
| `npm run node` | Start Hardhat node only |
| `npm run compile` | Compile smart contracts |
| `npm run deploy:localhost` | Deploy contracts to localhost |
| `npm run dev:hardhat` | Start Hardhat node (for concurrently) |
| `npm run dev:backend` | Start backend server (for concurrently) |
| `npm run dev:frontend` | Start frontend (for concurrently) |

---

## Logs and Debugging

When using `./start-dev.sh`, all logs are saved to:

```
.dev-logs/
├── hardhat-node.log   # Blockchain node logs
├── deploy.log         # Contract deployment logs
├── backend.log        # Backend API logs
└── frontend.log       # Expo frontend logs
```

You can monitor logs in real-time:

```bash
tail -f .dev-logs/backend.log
```

---

## First-Time Setup

If someone is cloning the project for the first time:

### Mac/Linux:
```bash
# 1. Clone the repository
git clone <your-repo-url>
cd Crypt-Payment

# 2. Install root dependencies
npm install

# 3. Install frontend dependencies
cd frontend
npm install
cd ..

# 4. Set up Python backend
cd backend
python3 -m venv env
source env/bin/activate
pip install -r requirements.txt
cd ..

# 5. Make the startup script executable
chmod +x start-dev.sh

# 6. Start everything!
./start-dev.sh
```

### Windows:
```cmd
REM 1. Clone the repository
git clone <your-repo-url>
cd Crypt-Payment

REM 2. Install root dependencies
npm install

REM 3. Install frontend dependencies
cd frontend
npm install
cd ..

REM 4. Set up Python backend
cd backend
python -m venv venv
venv\Scripts\activate
pip install -r requirements.txt
cd ..

REM 5. Start everything!
start-dev.bat
```

---

## Troubleshooting

### Script not executable
```bash
chmod +x start-dev.sh
```

### Port already in use
If you see port errors, make sure no other services are running on:
- **8545** (Hardhat)
- **8000** (Backend)
- **19000-19002** (Expo)

### Python virtual environment not found
```bash
cd backend
python3 -m venv env
source env/bin/activate
pip install -r requirements.txt
```

### Concurrently not found
```bash
npm install
```

---

## Service URLs

Once started, access your services at:

- **Backend API**: http://localhost:8000
- **API Docs**: http://localhost:8000/docs
- **Hardhat Node**: http://localhost:8545
- **Expo DevTools**: Shown in terminal after `npx expo start`

---

Enjoy coding! 🎉
