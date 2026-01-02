# Troubleshooting 400 Bad Request Error

## ✅ **Issue Resolved**

The 400 Bad Request error was caused by using `http://0.0.0.0:8000` as the BASE_URL.

### **Why `0.0.0.0` Doesn't Work for Clients**

- `0.0.0.0` is a **server binding address** that tells the server to listen on ALL network interfaces
- Clients **cannot connect** to `0.0.0.0` - it's not a valid destination address
- You must use a specific IP address or hostname

## 🔧 **Correct URLs by Platform**

### **iOS Simulator**
```typescript
const BASE_URL = 'http://localhost:8000';
```
✅ **Currently configured** (updated in api.ts)

### **Android Emulator**
```typescript
const BASE_URL = 'http://10.0.2.2:8000';
```
- `10.0.2.2` is a special address that Android Emulator uses to reach the host machine's localhost

### **Physical Device (iPhone/Android)**

1. Find your computer's IP address:
   ```bash
   # On Mac:
   ifconfig | grep "inet " | grep -v 127.0.0.1
   
   # You'll see something like: inet 192.168.1.100
   ```

2. Use that IP in your BASE_URL:
   ```typescript
   const BASE_URL = 'http://192.168.1.100:8000';
   ```

3. **Important**: Your phone and computer must be on the **same WiFi network**

## 🧪 **Testing the Fix**

### 1. Verify Backend is Accessible

```bash
# Test from terminal
curl http://localhost:8000/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","username":"testuser","password":"password123"}'
```

Expected: `200 OK` with JSON response containing `access_token`

### 2. Check Expo DevTools

When you run `npx expo start`, look at the URL it shows:
```
Metro waiting on exp://192.168.1.100:8081
```

The IP address shown (e.g., `192.168.1.100`) is what you should use if testing on a physical device.

### 3. Test Registration in App

1. Open your app
2. Navigate to Register screen
3. Fill in:
   - Username: `testuser`
   - Email: `test@example.com`
   - Password: `password123`
   - Confirm Password: `password123`
4. Tap "Create Account"

**Success**: Should navigate to Main screen
**Failure**: Check the error message and logs

## 🔍 **Debugging 400 Errors**

If you still get 400 errors:

### 1. Check Network Tab (React Native Debugger)

Enable network inspection to see the actual request:
```bash
# In Expo app, shake device or press Cmd+D (iOS) / Cmd+M (Android)
# Select "Debug Remote JS"
```

### 2. Check Request Body

The registration request should look like:
```json
{
  "email": "user@example.com",
  "username": "johndoe",
  "password": "securepassword123"
}
```

### 3. Check Backend Logs

Look at the uvicorn terminal output for error details.

### 4. Common 400 Causes

| Issue | Solution |
|-------|----------|
| Wrong Content-Type | Should be `application/json` for register |
| Missing required fields | All fields (email, username, password) required |
| Invalid email format | Must be valid email (x@y.z) |
| Username already exists | Try different username |
| Password too short | Backend may have minimum length requirement |

## 📱 **Platform-Specific Issues**

### **iOS Simulator**
- ✅ Use `http://localhost:8000`
- ⚠️ Make sure backend is running on localhost
- ⚠️ Check firewall settings

### **Android Emulator**
- ✅ Use `http://10.0.2.2:8000`
- ⚠️ Don't use `localhost` (won't work)
- ⚠️ Don't use `127.0.0.1` (won't work)

### **Physical Device**
- ✅ Use computer's network IP (e.g., `192.168.1.x`)
- ⚠️ Device must be on same WiFi as computer
- ⚠️ Computer firewall must allow connections on port 8000
- ⚠️ Don't use `localhost` or `127.0.0.1`

## 🔐 **Firewall Configuration**

If using a physical device and getting connection errors:

### **Mac**
```bash
# Allow incoming connections on port 8000
# System Preferences → Security & Privacy → Firewall → Firewall Options
# Add Python or your terminal app to allowed list
```

### **Windows**
```bash
# Allow incoming connections on port 8000
# Windows Defender Firewall → Advanced Settings → Inbound Rules
# New Rule → Port → TCP 8000 → Allow
```

## 📊 **Current Configuration**

**Backend**: Running on `0.0.0.0:8000` (listening on all interfaces) ✅
**Frontend**: Using `http://localhost:8000` (for iOS Simulator/local testing) ✅

## ✅ **Quick Checklist**

Before testing:
- [ ] Backend is running (`uvicorn app.main:app --host 0.0.0.0 --port 8000`)
- [ ] BASE_URL is correct for your platform
- [ ] Same network (if using physical device)
- [ ] Firewall allows connections (if using physical device)
- [ ] Expo app is running

## 🆘 **Still Having Issues?**

1. **Check which platform you're using:**
   ```bash
   # In Expo terminal, you'll see:
   # "› Press a │ open Android"
   # "› Press i │ open iOS simulator"
   ```

2. **Update BASE_URL accordingly** in `/frontend/src/services/api.ts`

3. **Restart Expo app** after changing BASE_URL:
   ```bash
   # Press 'r' in Expo terminal to reload
   ```

4. **Check backend is reachable:**
   ```bash
   # From terminal:
   curl http://localhost:8000/auth/register
   
   # Should NOT return connection refused
   ```

## 📝 **Example Success Response**

When registration works correctly:
```json
{
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "token_type": "bearer",
  "user_id": 1,
  "username": "testuser",
  "wallet_address": null
}
```

The app should then:
1. Store the token in AsyncStorage
2. Fetch user profile
3. Navigate to Main screen
4. Show user as logged in


## 🔐 **Fixing 401 Unauthorized Errors**

If you get `401 Unauthorized` immediately after login/register when fetching the profile:

### **The Cause**
The JWT library (`python-jose`) requires the `sub` (subject) claim to be a **string**. If the backend sends an integer, token validation fails.

### **The Fix (Applied)**
We updated the backend to convert user IDs to strings when creating tokens:

**In `backend/app/main.py`:**
```python
# Before
access_token = create_access_token(data={"sub": user.id})

# After (Fixed)
access_token = create_access_token(data={"sub": str(user.id)})
```

**In `backend/app/auth.py`:**
```python
# Before
user_id = payload.get("sub")

# After (Fixed)
user_id_str = payload.get("sub")
user_id = int(user_id_str)
```

### **Verification**
Run the verification script to confirm the fix:
```bash
cd backend
./verify_fix.sh
```

---

**Last Updated**: 2024-12-03  
**Status**: ✅ Fixed - Using `localhost:8000` instead of `0.0.0.0:8000`
**Status**: ✅ Fixed - JWT tokens now use string subjects

