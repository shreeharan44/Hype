# Authentication Integration Guide

## Overview
This document describes the authentication integration between the React Native frontend and the FastAPI backend.

## Backend Configuration
- **Backend URL**: `http://0.0.0.0:8000`
- **API Base Path**: `/auth`

### Device-Specific URLs
The frontend API service is configured for different environments:
- **Android Emulator**: `http://10.0.2.2:8000` (currently configured)
- **iOS Simulator**: `http://localhost:8000`
- **Physical Device**: Use your computer's IP address (e.g., `http://192.168.1.x:8000`)

To change the URL, edit `/src/services/api.ts` and update the `BASE_URL` constant.

## Authentication Endpoints

### 1. Register (POST `/auth/register`)
Creates a new user account.

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

### 2. Login (POST `/auth/login`)
Authenticates a user and returns an access token.

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

### 3. Get Profile (GET `/auth/me`)
Retrieves the current authenticated user's information.

**Headers:**
```
Authorization: Bearer <access_token>
```

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

## Frontend Implementation

### File Structure
```
frontend/src/
├── context/
│   ├── AuthContext.tsx       # Authentication state management
│   └── index.ts              # Context exports
├── services/
│   └── api.ts                # API client with axios
├── types/
│   ├── auth.ts               # TypeScript interfaces
│   └── index.ts              # Type exports
└── screens/
    ├── LoginScreen.tsx       # Login page (updated)
    ├── RegisterScreen.tsx    # Registration page (updated)
    └── ProfileScreen.tsx     # User profile page (updated)
```

### Key Components

#### 1. AuthContext (`/src/context/AuthContext.tsx`)
Provides global authentication state and functions:
- `user`: Current user object or null
- `isLoading`: Loading state during auth operations
- `isAuthenticated`: Boolean indicating if user is logged in
- `login(credentials)`: Login function
- `register(userData)`: Registration function
- `logout()`: Logout function
- `refreshUser()`: Refresh user profile data

#### 2. API Service (`/src/services/api.ts`)
Handles all HTTP requests with:
- Automatic token injection via request interceptor
- Token cleanup on 401 responses via response interceptor
- Form-data encoding for login endpoint
- TypeScript type safety

#### 3. Type Definitions (`/src/types/auth.ts`)
TypeScript interfaces matching backend responses:
- `User`: Full user profile
- `LoginResponse`: Login endpoint response
- `RegisterResponse`: Registration endpoint response
- `LoginRequest`: Login request payload
- `RegisterRequest`: Registration request payload

## Usage Examples

### Using Auth in a Screen

```typescript
import { useAuth } from '../context/AuthContext';

export const MyScreen = () => {
  const { user, isAuthenticated, logout } = useAuth();

  if (!isAuthenticated) {
    return <Text>Please login</Text>;
  }

  return (
    <View>
      <Text>Welcome, {user.username}!</Text>
      <Text>Email: {user.email}</Text>
      {user.wallet_address && (
        <Text>Wallet: {user.wallet_address}</Text>
      )}
      <Button title="Logout" onPress={logout} />
    </View>
  );
};
```

### Making Authenticated API Calls

```typescript
import api from '../services/api';

// The token is automatically added to all requests
const fetchData = async () => {
  try {
    const response = await api.get('/some-endpoint');
    return response.data;
  } catch (error) {
    console.error('API Error:', error);
  }
};
```

## Updated Screens

### LoginScreen
- Changed from email to username field (backend requirement)
- Integrated with AuthContext
- Added error handling with Alert
- Automatic navigation on successful login

### RegisterScreen
- Added username field (separate from email)
- Integrated with AuthContext
- Added validation (all fields required, password length, password match)
- Added error handling with Alert
- Automatic navigation on successful registration

### ProfileScreen
- Displays real user data from AuthContext
- Shows username, email, wallet address, balance
- Formats blockchain balance from wei to ETH
- Implemented logout functionality with confirmation dialog
- Added loading state while fetching user data
- Auto-refresh user data when screen is focused

## Token Storage

Access tokens are stored using `@react-native-async-storage/async-storage`:
- Tokens are automatically saved on login/register
- Tokens are automatically loaded on app startup
- Tokens are automatically included in API requests
- Tokens are removed on logout or 401 errors

## Error Handling

The implementation includes comprehensive error handling:

1. **API Errors**: Caught and displayed to users via Alert
2. **Network Errors**: Axios handles connection issues
3. **401 Errors**: Automatically clear invalid tokens
4. **Validation Errors**: Client-side validation before API calls

## Testing the Integration

### 1. Start the Backend
```bash
cd backend
uvicorn app.main:app --host 0.0.0.0 --port 8000
```

### 2. Start the Frontend
```bash
cd frontend
npx expo start
```

### 3. Test Registration
1. Open the app
2. Navigate to Register screen
3. Fill in:
   - Username: testuser
   - Email: test@example.com
   - Password: password123
   - Confirm Password: password123
4. Tap "Create Account"
5. Should navigate to Main screen on success

### 4. Test Login
1. Navigate to Login screen
2. Fill in:
   - Username: testuser
   - Password: password123
3. Tap "Login"
4. Should navigate to Main screen on success

### 5. Test Profile
1. Navigate to Profile tab
2. Should display:
   - Your username
   - Your email
   - Wallet address (if available)
   - Balance (if > 0)
3. Test logout button

### 6. Test Token Persistence
1. Close the app completely
2. Reopen the app
3. Should remain logged in (token persisted)

## Common Issues & Solutions

### Issue: "Network Error" or connection refused
**Solution**: Update the `BASE_URL` in `/src/services/api.ts` to match your environment:
- Android Emulator: `http://10.0.2.2:8000`
- iOS Simulator: `http://localhost:8000`
- Physical Device: Use your computer's local IP

### Issue: CORS errors
**Solution**: Ensure backend CORS settings allow requests from your frontend origin.

### Issue: Token not persisting
**Solution**: Check AsyncStorage permissions and ensure it's properly installed.

### Issue: 401 Unauthorized after some time
**Solution**: Tokens may have expired. Implement token refresh logic or increase token expiration time on backend.

## Security Considerations

1. **HTTPS**: Use HTTPS in production
2. **Token Storage**: Tokens are stored in AsyncStorage (consider using secure storage for production)
3. **Password Validation**: Implement strong password requirements
4. **Rate Limiting**: Backend should implement rate limiting
5. **Input Sanitization**: Both frontend and backend should validate/sanitize inputs

## Next Steps

Consider implementing:
1. **Token Refresh**: Automatic token refresh before expiration
2. **Biometric Auth**: Face ID / Touch ID for easier login
3. **Password Reset**: Forgot password functionality
4. **Email Verification**: Verify email addresses
5. **2FA**: Two-factor authentication
6. **Session Management**: View and manage active sessions
7. **Social Login**: OAuth integration (Google, Apple, etc.)

## API Response Examples

### Successful Login
```json
{
  "access_token": "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9...",
  "token_type": "bearer",
  "user_id": 1,
  "username": "testuser",
  "wallet_address": "0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb"
}
```

### Error Response
```json
{
  "detail": "Incorrect username or password"
}
```

### User Profile Response
```json
{
  "user_id": 1,
  "username": "testuser",
  "email": "test@example.com",
  "wallet_address": "0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb",
  "vault_address": "0x8626f6940E2eb28930eFb4CeF49B2d1F2C9C1199",
  "balance": 5000000000000000000,
  "created_at": "2024-12-03T10:00:00"
}
```

## Support

For issues or questions:
1. Check the backend API documentation: `/backend/API_ENDPOINTS.md`
2. Review console logs for detailed error messages
3. Verify backend is running and accessible
4. Check network connectivity
