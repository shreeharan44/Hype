# Test Backend Script

$baseUrl = "http://localhost:8000"

function Invoke-Post($endpoint, $body) {
    $json = $body | ConvertTo-Json -Depth 10
    try {
        $response = Invoke-RestMethod -Uri "$baseUrl$endpoint" -Method Post -Body $json -ContentType "application/json"
        return $response
    } catch {
        Write-Host "Error calling $endpoint" -ForegroundColor Red
        Write-Host $_.Exception.Message -ForegroundColor Red
        if ($_.Exception.Response) {
            $reader = New-Object System.IO.StreamReader($_.Exception.Response.GetResponseStream())
            Write-Host $reader.ReadToEnd() -ForegroundColor Red
        }
        return $null
    }
}

function Invoke-Get($endpoint, $token) {
    try {
        $headers = @{ Authorization = "Bearer $token" }
        $response = Invoke-RestMethod -Uri "$baseUrl$endpoint" -Method Get -Headers $headers
        return $response
    } catch {
        Write-Host "Error calling $endpoint" -ForegroundColor Red
        Write-Host $_.Exception.Message -ForegroundColor Red
        return $null
    }
}

# 1. Deploy Token
Write-Host "`n--- 1. Deploying Token ---" -ForegroundColor Cyan
$tokenRes = Invoke-Post "/admin/deploy-token" @{
    name = "HypeToken"
    symbol = "HYPE"
    supply = 1000000
}
if ($tokenRes) { Write-Host "Token Deployed: $($tokenRes.tokenAddress)" -ForegroundColor Green }

# 2. Deploy Vault
Write-Host "`n--- 2. Deploying Vault ---" -ForegroundColor Cyan
$vaultRes = Invoke-Post "/admin/deploy-vault" @{
    token_address = $tokenRes.tokenAddress
}
if ($vaultRes) { Write-Host "Vault Deployed: $($vaultRes.vaultAddress)" -ForegroundColor Green }

# 3. Register User
Write-Host "`n--- 3. Registering User ---" -ForegroundColor Cyan
$rand = Get-Random
$userRes = Invoke-Post "/auth/register" @{
    email = "user$rand@example.com"
    username = "user$rand"
    password = "password123"
}
if ($userRes) { 
    Write-Host "User Registered: $($userRes.username) (ID: $($userRes.user_id))" -ForegroundColor Green 
    Write-Host "Wallet: $($userRes.wallet_address)" -ForegroundColor Green
    $userRes | ConvertTo-Json -Depth 5 | Write-Host
    $token = $userRes.access_token.Trim()
    Write-Host "Token: $token" -ForegroundColor Yellow
} else {
    Write-Host "Registration Failed!" -ForegroundColor Red
    exit
}

# 4. Approve User
Write-Host "`n--- 4. Approving User ---" -ForegroundColor Cyan
$approveRes = Invoke-Post "/admin/approve-user" @{
    user_username = $userRes.username
}
if ($approveRes) { Write-Host "User Approved: $($approveRes.tx)" -ForegroundColor Green }

# 5. Mint Tokens to User
Write-Host "`n--- 5. Minting Tokens to User ---" -ForegroundColor Cyan
$mintRes = Invoke-Post "/admin/mint" @{
    user_username = $userRes.username
    amount = 1000.0
}
if ($mintRes) { Write-Host "Minted 1000 Tokens: $($mintRes.tx)" -ForegroundColor Green }

# 6. Deposit
Write-Host "`n--- 6. Depositing 100 USD ---" -ForegroundColor Cyan
try {
    $json = @{ amount = 100.0; currency = "USD" } | ConvertTo-Json
    $depositRes = Invoke-RestMethod -Uri "$baseUrl/payment/deposit" -Method Post -Body $json -ContentType "application/json" -Headers @{ Authorization = "Bearer $token" }
    Write-Host "Deposited: $($depositRes.message)" -ForegroundColor Green
    Write-Host "Tx: $($depositRes.transaction_hash)" -ForegroundColor Green
    Write-Host "Balance: $($depositRes.balance)" -ForegroundColor Green
} catch {
    Write-Host "Deposit Failed: $_" -ForegroundColor Red
    if ($_.Exception.Response) {
        $reader = New-Object System.IO.StreamReader($_.Exception.Response.GetResponseStream())
        Write-Host $reader.ReadToEnd() -ForegroundColor Red
    }
}

# 7. Get Balance
Write-Host "`n--- 7. Checking Balance ---" -ForegroundColor Cyan
$balRes = Invoke-Get "/payment/balance" $token
if ($balRes) { Write-Host "Balance: $($balRes.balance_usd) USD" -ForegroundColor Green }

# 8. Withdraw
Write-Host "`n--- 8. Withdrawing 50 USD ---" -ForegroundColor Cyan
try {
    $json = @{ amount = 50.0; currency = "USD" } | ConvertTo-Json
    $withdrawRes = Invoke-RestMethod -Uri "$baseUrl/payment/withdraw" -Method Post -Body $json -ContentType "application/json" -Headers @{ Authorization = "Bearer $token" }
    Write-Host "Withdrawn: $($withdrawRes.message)" -ForegroundColor Green
    Write-Host "Tx: $($withdrawRes.transaction_hash)" -ForegroundColor Green
    Write-Host "Balance: $($withdrawRes.balance)" -ForegroundColor Green
} catch {
    Write-Host "Withdraw Failed: $_" -ForegroundColor Red
}

Write-Host "`n--- Test Complete ---" -ForegroundColor Cyan
