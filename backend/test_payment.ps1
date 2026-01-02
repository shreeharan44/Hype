# Test User-to-User Payment Script

$baseUrl = "http://localhost:8000"

function Invoke-Post($endpoint, $body, $token = $null) {
    $json = $body | ConvertTo-Json -Depth 10
    $headers = @{ "Content-Type" = "application/json" }
    if ($token) {
        $headers["Authorization"] = "Bearer $token"
    }
    try {
        $response = Invoke-RestMethod -Uri "$baseUrl$endpoint" -Method Post -Body $json -Headers $headers
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

Write-Host "`n=== User-to-User Payment Test ===" -ForegroundColor Cyan

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

# 3. Register User A (Alice)
Write-Host "`n--- 3. Registering User A (Alice) ---" -ForegroundColor Cyan
$rand1 = Get-Random
$userA = Invoke-Post "/auth/register" @{
    email = "alice$rand1@example.com"
    username = "alice$rand1"
    password = "password123"
}
if ($userA) { 
    Write-Host "Alice Registered: $($userA.username)" -ForegroundColor Green 
    Write-Host "Wallet: $($userA.wallet_address)" -ForegroundColor Green
    $tokenA = $userA.access_token.Trim()
}

# 4. Register User B (Bob)
Write-Host "`n--- 4. Registering User B (Bob) ---" -ForegroundColor Cyan
$rand2 = Get-Random
$userB = Invoke-Post "/auth/register" @{
    email = "bob$rand2@example.com"
    username = "bob$rand2"
    password = "password123"
}
if ($userB) { 
    Write-Host "Bob Registered: $($userB.username)" -ForegroundColor Green 
    Write-Host "Wallet: $($userB.wallet_address)" -ForegroundColor Green
    $tokenB = $userB.access_token.Trim()
}

# 5. Approve Both Users
Write-Host "`n--- 5. Approving Users ---" -ForegroundColor Cyan
$approveA = Invoke-Post "/admin/approve-user" @{ user_username = $userA.username }
$approveB = Invoke-Post "/admin/approve-user" @{ user_username = $userB.username }
if ($approveA) { Write-Host "Alice Approved" -ForegroundColor Green }
if ($approveB) { Write-Host "Bob Approved" -ForegroundColor Green }

# 6. Mint Tokens to Alice
Write-Host "`n--- 6. Minting 1000 Tokens to Alice ---" -ForegroundColor Cyan
$mintRes = Invoke-Post "/admin/mint" @{
    user_username = $userA.username
    amount = 1000.0
}
if ($mintRes) { Write-Host "Minted: $($mintRes.tx)" -ForegroundColor Green }

# 7. Alice Deposits 500 Tokens
Write-Host "`n--- 7. Alice Deposits 500 Tokens ---" -ForegroundColor Cyan
try {
    $json = @{ amount = 500.0; currency = "USD" } | ConvertTo-Json
    $depositRes = Invoke-RestMethod -Uri "$baseUrl/payment/deposit" -Method Post -Body $json -ContentType "application/json" -Headers @{ Authorization = "Bearer $tokenA" }
    Write-Host "Deposited: $($depositRes.message)" -ForegroundColor Green
    Write-Host "Balance: $($depositRes.balance / 1e18) tokens" -ForegroundColor Green
} catch {
    Write-Host "Deposit Failed: $_" -ForegroundColor Red
}

# 8. Check Alice's Balance
Write-Host "`n--- 8. Checking Alice's Balance ---" -ForegroundColor Cyan
$balanceA1 = Invoke-Get "/payment/balance" $tokenA
if ($balanceA1) { Write-Host "Alice Balance: $($balanceA1.balance_usd) tokens" -ForegroundColor Green }

# 9. Check Bob's Balance (should be 0)
Write-Host "`n--- 9. Checking Bob's Balance ---" -ForegroundColor Cyan
$balanceB1 = Invoke-Get "/payment/balance" $tokenB
if ($balanceB1) { Write-Host "Bob Balance: $($balanceB1.balance_usd) tokens" -ForegroundColor Green }

# 10. Alice Sends 200 Tokens to Bob
Write-Host "`n--- 10. Alice Sends 200 Tokens to Bob ---" -ForegroundColor Cyan
try {
    $json = @{ recipient_username = $userB.username; amount = 200.0 } | ConvertTo-Json
    $sendRes = Invoke-RestMethod -Uri "$baseUrl/payment/send" -Method Post -Body $json -ContentType "application/json" -Headers @{ Authorization = "Bearer $tokenA" }
    Write-Host "Sent: $($sendRes.message)" -ForegroundColor Green
    Write-Host "Tx: $($sendRes.transaction_hash)" -ForegroundColor Green
    Write-Host "Alice New Balance: $($sendRes.new_balance_usd) tokens" -ForegroundColor Green
} catch {
    Write-Host "Send Failed: $_" -ForegroundColor Red
    if ($_.Exception.Response) {
        $reader = New-Object System.IO.StreamReader($_.Exception.Response.GetResponseStream())
        Write-Host $reader.ReadToEnd() -ForegroundColor Red
    }
}

# 11. Check Alice's Balance Again
Write-Host "`n--- 11. Checking Alice's Balance After Send ---" -ForegroundColor Cyan
$balanceA2 = Invoke-Get "/payment/balance" $tokenA
if ($balanceA2) { Write-Host "Alice Balance: $($balanceA2.balance_usd) tokens (should be 300)" -ForegroundColor Green }

# 12. Check Bob's Balance Again
Write-Host "`n--- 12. Checking Bob's Balance After Receive ---" -ForegroundColor Cyan
$balanceB2 = Invoke-Get "/payment/balance" $tokenB
if ($balanceB2) { Write-Host "Bob Balance: $($balanceB2.balance_usd) tokens (should be 200)" -ForegroundColor Green }

# 13. Bob Sends 50 Tokens Back to Alice
Write-Host "`n--- 13. Bob Sends 50 Tokens Back to Alice ---" -ForegroundColor Cyan
try {
    $json = @{ recipient_username = $userA.username; amount = 50.0 } | ConvertTo-Json
    $sendRes2 = Invoke-RestMethod -Uri "$baseUrl/payment/send" -Method Post -Body $json -ContentType "application/json" -Headers @{ Authorization = "Bearer $tokenB" }
    Write-Host "Sent: $($sendRes2.message)" -ForegroundColor Green
    Write-Host "Tx: $($sendRes2.transaction_hash)" -ForegroundColor Green
} catch {
    Write-Host "Send Failed: $_" -ForegroundColor Red
}

# 14. Final Balances
Write-Host "`n--- 14. Final Balances ---" -ForegroundColor Cyan
$finalA = Invoke-Get "/payment/balance" $tokenA
$finalB = Invoke-Get "/payment/balance" $tokenB
if ($finalA) { Write-Host "Alice Final Balance: $($finalA.balance_usd) tokens (should be 350)" -ForegroundColor Green }
if ($finalB) { Write-Host "Bob Final Balance: $($finalB.balance_usd) tokens (should be 150)" -ForegroundColor Green }

Write-Host "`n=== Test Complete ===" -ForegroundColor Cyan
