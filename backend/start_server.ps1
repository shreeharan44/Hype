# PowerShell script to start the FastAPI server
Write-Host "Starting FastAPI server..." -ForegroundColor Green
cd backend
python -m uvicorn app.main:app --reload --host 0.0.0.0 --port 8000

