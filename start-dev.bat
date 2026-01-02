@echo off
echo.
echo ==================================================
echo   Starting Crypt-Payment Development Environment
echo ==================================================
echo.

REM Create log directory if it doesn't exist
if not exist ".dev-logs" mkdir .dev-logs

echo [1/4] Starting Hardhat Node...
start "Hardhat Node" cmd /c "npx hardhat node > .dev-logs\hardhat-node.log 2>&1"

echo [2/4] Waiting for Hardhat node to initialize...
timeout /t 5 /nobreak > nul

echo [3/4] Deploying contracts to local network...
start "Deploy Contracts" cmd /c "npx hardhat run scripts/deploy.js --network localhost > .dev-logs\deploy.log 2>&1"
if %errorlevel% equ 0 (
    echo ✓ Contracts deployed successfully
) else (
    echo ! Contract deployment had issues. Check .dev-logs\deploy.log
)

echo [4/4] Starting Backend Server...
start "Backend Server" cmd /c "cd backend && ..\env\Scripts\activate && uvicorn app.main:app --host 0.0.0.0 --port 8000"

echo [5/5] Starting Frontend (Expo)...
echo.
echo ==================================================
echo   All services started!
echo   Hardhat & Backend are running in separate windows.
echo   Keep this window open for Expo QR Code.
echo ==================================================
echo.
echo 👉 Scan the QR code below with your mobile device
echo.

cd frontend && npx expo start
