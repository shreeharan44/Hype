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
start "Frontend Expo" cmd /c "cd frontend && npx expo start"

echo.
echo ==================================================
echo   All services started successfully!
echo ==================================================
echo.
echo Services running in separate windows:
echo   - Hardhat Node     (Port 8545)
echo   - Backend API      (http://localhost:8000)
echo   - Frontend Expo    (http://localhost:8081)
echo.
echo Logs available in .dev-logs\ directory
echo Close each service window to stop
echo ==================================================
echo.
pause
