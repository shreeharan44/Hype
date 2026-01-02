# API Endpoints Documentation

## Authentication Endpoints

### POST `/auth/register`
Register a new user account.

**Request Body:**
```json
{
  "email": "user@example.com",
  "username": "johndoe",
  "password": "securepassword123"
}
```

**Response:**
```json
{
  "access_token": "eyJ0eXAiOiJKV1QiLCJhbGc...",
  "token_type": "bearer",
  "user_id": 1,
  "username": "johndoe",
  "wallet_address": null
}
```

### POST `/auth/login`
Login and get access token.

**Request Body (form-data):**
- `username`: string
- `password`: string

**Response:**
```json
{
  "access_token": "eyJ0eXAiOiJKV1QiLCJhbGc...",
  "token_type": "bearer",
  "user_id": 1,
  "username": "johndoe",
  "wallet_address": "0x..."
}
```

### GET `/auth/me`
Get current authenticated user information.

**Headers:**
- `Authorization: Bearer <token>`

**Response:**
```json
{
  "user_id": 1,
  "username": "johndoe",
  "email": "user@example.com",
  "wallet_address": "0x...",
  "vault_address": "0x...",
  "balance": 1000000000000000000,
  "created_at": "2024-01-01T00:00:00"
}
```

## Payment Endpoints

### POST `/payment/setup-wallet`
Set or update user's wallet address and create vault.

**Headers:**
- `Authorization: Bearer <token>`

**Request Body:**
```json
{
  "wallet_address": "0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb"
}
```

**Response:**
```json
{
  "success": true,
  "wallet_address": "0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb",
  "vault_address": "0x...",
  "message": "Wallet setup completed"
}
```

### POST `/payment/deposit`
Deposit fiat money and convert to tokens in vault.

**Headers:**
- `Authorization: Bearer <token>`

**Request Body:**
```json
{
  "amount": 100.0,
  "currency": "USD"
}
```

**Supported Currencies:** INR, AED, USD, EUR, GBP, CAD

**Response:**
```json
{
  "success": true,
  "message": "Deposited 100.0 USD (100.0 USDC)",
  "transaction_hash": "0x...",
  "balance": 100000000000000000000
}
```

### GET `/payment/balance`
Get user's current balance.

**Headers:**
- `Authorization: Bearer <token>`

**Response:**
```json
{
  "balance": 100000000000000000000,
  "balance_usd": 100.0,
  "vault_address": "0x..."
}
```

### POST `/payment/send`
Send money to another user.

**Headers:**
- `Authorization: Bearer <token>`

**Request Body:**
```json
{
  "recipient_username": "janedoe",
  "amount": 50.0,
  "currency": "USD"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Sent 50.0 USD to janedoe",
  "transaction_hash": "0x...",
  "balance": 50000000000000000000
}
```

### POST `/payment/withdraw`
Withdraw money from vault to user's wallet.

**Headers:**
- `Authorization: Bearer <token>`

**Query Parameters:**
- `amount`: float (required)
- `currency`: string (optional, default: "USD")

**Response:**
```json
{
  "success": true,
  "message": "Withdrew 50.0 USD",
  "transaction_hash": "0x...",
  "balance": 50000000000000000000
}
```

## Usage Example (Mobile App)

### 1. Register User
```javascript
const response = await fetch('http://localhost:8000/auth/register', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    email: 'user@example.com',
    username: 'johndoe',
    password: 'securepassword123'
  })
});
const { access_token } = await response.json();
```

### 2. Setup Wallet
```javascript
await fetch('http://localhost:8000/payment/setup-wallet', {
  method: 'POST',
  headers: {
    'Authorization': `Bearer ${access_token}`,
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    wallet_address: '0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb'
  })
});
```

### 3. Deposit Money
```javascript
await fetch('http://localhost:8000/payment/deposit', {
  method: 'POST',
  headers: {
    'Authorization': `Bearer ${access_token}`,
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    amount: 100.0,
    currency: 'USD'
  })
});
```

### 4. Send Money
```javascript
await fetch('http://localhost:8000/payment/send', {
  method: 'POST',
  headers: {
    'Authorization': `Bearer ${access_token}`,
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    recipient_username: 'janedoe',
    amount: 50.0,
    currency: 'USD'
  })
});
```

### 5. Check Balance
```javascript
const response = await fetch('http://localhost:8000/payment/balance', {
  headers: { 'Authorization': `Bearer ${access_token}` }
});
const { balance, balance_usd } = await response.json();
```

