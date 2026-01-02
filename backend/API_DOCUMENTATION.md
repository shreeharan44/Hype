# API Documentation - Shared Vault Payment System

Base URL: `http://localhost:8000`

## Authentication

Most endpoints require JWT authentication. Include the token in the Authorization header:
```
Authorization: Bearer <your_jwt_token>
```

---

## Admin Endpoints

### 1. Deploy Token Contract

**POST** `/admin/deploy-token`

Deploy a new ERC20 token contract.

**Request Body:**
```json
{
  "name": "HypeToken",
  "symbol": "HYPE",
  "supply": 1000000
}
```

**Response:**
```json
{
  "tokenAddress": "0x5FbDB2315678afecb367f032d93F642f64180aa3"
}
```

**cURL Example:**
```bash
curl -X POST http://localhost:8000/admin/deploy-token \
  -H "Content-Type: application/json" \
  -d '{"name":"HypeToken","symbol":"HYPE","supply":1000000}'
```

---

### 2. Deploy Shared Vault

**POST** `/admin/deploy-vault`

Deploy the shared TokenVault contract.

**Request Body:**
```json
{
  "token_address": "0x5FbDB2315678afecb367f032d93F642f64180aa3"
}
```

**Response:**
```json
{
  "vaultAddress": "0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512"
}
```

**cURL Example:**
```bash
curl -X POST http://localhost:8000/admin/deploy-vault \
  -H "Content-Type: application/json" \
  -d '{"token_address":"0x5FbDB2315678afecb367f032d93F642f64180aa3"}'
```

---

### 3. Approve User

**POST** `/admin/approve-user`

Approve a user to interact with the shared vault.

**Request Body:**
```json
{
  "user_username": "alice123"
}
```

**Response:**
```json
{
  "success": true,
  "tx": "0xabc123..."
}
```

**cURL Example:**
```bash
curl -X POST http://localhost:8000/admin/approve-user \
  -H "Content-Type: application/json" \
  -d '{"user_username":"alice123"}'
```

---

### 4. Revoke User

**POST** `/admin/revoke-user`

Revoke a user's vault access.

**Request Body:**
```json
{
  "user_username": "alice123"
}
```

**Response:**
```json
{
  "success": true,
  "tx": "0xdef456..."
}
```

---

### 5. Mint Tokens

**POST** `/admin/mint`

Mint tokens to a user's wallet.

**Request Body:**
```json
{
  "user_username": "alice123",
  "amount": 1000.0
}
```

**Response:**
```json
{
  "success": true,
  "tx": "0xghi789...",
  "amount": 1000.0
}
```

**cURL Example:**
```bash
curl -X POST http://localhost:8000/admin/mint \
  -H "Content-Type: application/json" \
  -d '{"user_username":"alice123","amount":1000.0}'
```

---

## Authentication Endpoints

### 6. Register User

**POST** `/auth/register`

Register a new user. Automatically creates a custodial wallet and funds it with ETH for gas.

**Request Body:**
```json
{
  "email": "alice@example.com",
  "username": "alice123",
  "password": "securePassword123"
}
```

**Response:**
```json
{
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "token_type": "bearer",
  "user_id": 1,
  "username": "alice123",
  "wallet_address": "0x1234567890abcdef..."
}
```

**cURL Example:**
```bash
curl -X POST http://localhost:8000/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"alice@example.com","username":"alice123","password":"securePassword123"}'
```

---

### 7. Login

**POST** `/auth/login`

Login and receive a JWT token.

**Request Body (Form Data):**
```
username=alice123
password=securePassword123
```

**Response:**
```json
{
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "token_type": "bearer",
  "user_id": 1,
  "username": "alice123",
  "wallet_address": "0x1234567890abcdef..."
}
```

**cURL Example:**
```bash
curl -X POST http://localhost:8000/auth/login \
  -H "Content-Type: application/x-www-form-urlencoded" \
  -d "username=alice123&password=securePassword123"
```

---

### 8. Get Current User

**GET** `/auth/me`

Get current authenticated user information.

**Headers:**
```
Authorization: Bearer <token>
```

**Response:**
```json
{
  "user_id": 1,
  "username": "alice123",
  "email": "alice@example.com",
  "wallet_address": "0x1234567890abcdef..."
}
```

**cURL Example:**
```bash
curl -X GET http://localhost:8000/auth/me \
  -H "Authorization: Bearer <your_token>"
```

---

## Payment Endpoints

### 9. Deposit to Vault

**POST** `/payment/deposit`

Deposit tokens from user's wallet to the shared vault.

**Headers:**
```
Authorization: Bearer <token>
```

**Request Body:**
```json
{
  "amount": 100.0,
  "currency": "USD"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Deposited 100.0 USD",
  "transaction_hash": "0xjkl012...",
  "balance": 100000000000000000000
}
```

**cURL Example:**
```bash
curl -X POST http://localhost:8000/payment/deposit \
  -H "Authorization: Bearer <your_token>" \
  -H "Content-Type: application/json" \
  -d '{"amount":100.0,"currency":"USD"}'
```

---

### 10. Withdraw from Vault

**POST** `/payment/withdraw`

Withdraw tokens from the shared vault to user's wallet.

**Headers:**
```
Authorization: Bearer <token>
```

**Request Body:**
```json
{
  "amount": 50.0,
  "currency": "USD"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Withdrew 50.0 USD",
  "transaction_hash": "0xmno345...",
  "balance": 50000000000000000000
}
```

**cURL Example:**
```bash
curl -X POST http://localhost:8000/payment/withdraw \
  -H "Authorization: Bearer <your_token>" \
  -H "Content-Type: application/json" \
  -d '{"amount":50.0,"currency":"USD"}'
```

---

### 11. Check Vault Balance

**GET** `/payment/balance`

Get current user's balance in the shared vault.

**Headers:**
```
Authorization: Bearer <token>
```

**Response:**
```json
{
  "balance": 100000000000000000000,
  "balance_usd": 100.0,
  "vault_address": "0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512"
}
```

**cURL Example:**
```bash
curl -X GET http://localhost:8000/payment/balance \
  -H "Authorization: Bearer <your_token>"
```

---

### 12. Send Tokens to Another User ⭐

**POST** `/payment/send`

Send tokens to another user using their username (peer-to-peer transfer).

**Headers:**
```
Authorization: Bearer <token>
```

**Request Body:**
```json
{
  "recipient_username": "bob123",
  "amount": 25.0
}
```

**Response:**
```json
{
  "success": true,
  "message": "Sent 25.0 tokens to bob123",
  "transaction_hash": "0xpqr678...",
  "recipient": "bob123",
  "recipient_wallet": "0x9876543210fedcba...",
  "balance": 75000000000000000000,
  "balance_usd": 75.0
}
```

**cURL Example:**
```bash
curl -X POST http://localhost:8000/payment/send \
  -H "Authorization: Bearer <your_token>" \
  -H "Content-Type: application/json" \
  -d '{"recipient_username":"bob123","amount":25.0}'
```

---

## PowerShell Examples

### Complete User Flow

```powershell
$baseUrl = "http://localhost:8000"

# 1. Register
$registerRes = Invoke-RestMethod -Uri "$baseUrl/auth/register" -Method Post `
  -Body (@{email="alice@test.com";username="alice123";password="pass123"} | ConvertTo-Json) `
  -ContentType "application/json"

$token = $registerRes.access_token

# 2. Check Balance
$balance = Invoke-RestMethod -Uri "$baseUrl/payment/balance" -Method Get `
  -Headers @{Authorization="Bearer $token"}

Write-Host "Balance: $($balance.balance_usd) USD"

# 3. Send to Another User
$sendRes = Invoke-RestMethod -Uri "$baseUrl/payment/send" -Method Post `
  -Body (@{recipient_username="bob123";amount=50.0} | ConvertTo-Json) `
  -ContentType "application/json" `
  -Headers @{Authorization="Bearer $token"}

Write-Host "Sent: $($sendRes.message)"
```

---

## Error Responses

All endpoints return standard HTTP error codes:

- `400 Bad Request`: Invalid input
- `401 Unauthorized`: Missing or invalid token
- `404 Not Found`: Resource not found
- `500 Internal Server Error`: Server error

**Error Response Format:**
```json
{
  "detail": "Error message here"
}
```

---

## Notes

- **Custodial Wallets**: The backend manages user private keys securely
- **Admin Signatures**: All vault operations are signed by the admin
- **Gas Fees**: New users are automatically funded with 0.1 ETH for gas
- **Wei Values**: Balance responses include both wei (raw) and USD (human-readable) formats
- **Transaction Logging**: All operations are logged in the database with SEND/RECEIVE types

---

## Interactive API Documentation

Visit `http://localhost:8000/docs` for interactive Swagger UI documentation where you can test all endpoints directly in your browser.
