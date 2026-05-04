# 🐛 Troubleshooting Guide - LinkUp Real-Time Communication

**Date**: May 4, 2026  
**Version**: Production with Responsive Design Update

---

## 📋 QUICK DIAGNOSTIC

### Feature Not Working? Use This Flow

```
Issue → Check Environment → Check Network → Check Browser → Check Code
  ↓         ↓                  ↓                ↓              ↓
Check logs  Env vars set?     DevTools open   Permissions    Console errors
Monitor     API reachable?    Network tab     Cache cleared  TypeErrors
Dashboard   Token generated?  WebSocket WS    Reload page    Log messages
```

---

## 🔴 ISSUE 1: TEXT MESSAGES NOT SENDING

### Symptoms
- Type message → Click send → Nothing happens
- Messages don't appear on screen
- No error message shown

### Step-by-Step Fix

#### 1. Check Backend is Running
```bash
# Open terminal and check
curl https://linkup-web-8vjm.onrender.com

# Should return 404 Not Found (NOT connection error)
```

#### 2. Check Vercel Environment Variables
1. Go to: https://vercel.com/dashboard/projects
2. Select `LinkUp_Web` project  
3. Settings → Environment Variables
4. Verify these exist:
   - ✓ `VITE_API_URL` = `https://linkup-web-8vjm.onrender.com/api`
   - ✓ `VITE_STREAM_API_KEY` = `qzbgw32s7rmk`

#### 3. Force Vercel Redeploy (Fresh Build)
```
1. Go to Vercel Dashboard → LinkUp_Web → Deployments
2. Click 3 dots on latest deployment
3. Select "Redeploy"
4. Wait 2-3 minutes for new build
```

#### 4. Check Browser Console
Open your app: https://link-up-web-xi.vercel.app

Then press: `F12` → Console tab

Look for these messages:
```javascript
// GOOD - Should see:
✓ "Stream API Key loaded: qzbgw32s7rmk"
✓ "Token: {token: '...'}"
✓ "Chat client connected"
✓ "Channel watching..."

// BAD - Would see:
✗ "TypeError: Cannot read property 'post' of undefined"
✗ "Failed to fetch token"
✗ "WebSocket disconnected"
```

#### 5. Test Locally (Best for Debugging)
```bash
# Terminal 1 - Backend
cd k:\LinkUp-\backend
npm run dev
# Should show: Server running on port 5001

# Terminal 2 - Frontend
cd k:\LinkUp-\frontend
npm run dev
# Should show: Local: http://localhost:5173

# Browser: http://localhost:5173
# 1. Login
# 2. Send friend request to another user
# 3. Accept request
# 4. Open chat
# 5. Send message
# 6. Should appear immediately
```

### Debug Code
Add to browser console and check output:

```javascript
// Check API URL
import.meta.env.VITE_API_URL
// Result should be: https://linkup-web-8vjm.onrender.com/api

// Check Stream Key
import.meta.env.VITE_STREAM_API_KEY
// Result should be: qzbgw32s7rmk

// Check if chat connected
window.chatClient
// Result should NOT be undefined

// Check channel
window.channel
// Result should have 'id' and 'watch' method
```

---

## 🟠 ISSUE 2: AUDIO/VIDEO CALLS NOT WORKING

### Symptoms
- Click "Call" button → Nothing happens
- Can't see call screen
- Microphone/camera not detected
- Call doesn't connect to recipient

### Step-by-Step Fix

#### 1. Browser Permissions
```
Chrome/Edge:
1. 🔒 Lock icon (left of URL bar)
2. Site Permissions
3. Camera: Allow
4. Microphone: Allow
5. Refresh page
```

#### 2. Check Call Page URL
When clicking call, URL should change to: `https://link-up-web-xi.vercel.app/call/{recipientId}`

If it doesn't:
- Check browser console for errors
- Verify recipient ID is being passed

#### 3. Verify Call Token Generation
Open console and run:
```javascript
// This should work without errors
const response = await fetch('https://linkup-web-8vjm.onrender.com/api/chat/token', {
  method: 'GET',
  credentials: 'include',
  headers: { 'Content-Type': 'application/json' }
});

const data = await response.json();
console.log("Token:", data.token ? "✓ Received" : "✗ Missing");
```

#### 4. Test Locally with Two Browsers
```
1. Open Firefox: http://localhost:5173
2. Open Chrome: http://localhost:5173

Firefox: Login as User A
Chrome: Login as User B

Firefox → Send friend request to User B
Chrome → Accept request

Firefox → Click on User B Message button
Chrome → Click on User A Message button

Firefox → Click Call button
Chrome → Should receive call popup
```

#### 5. Network Requirements
- ✓ Good internet connection
- ✓ Both users online
- ✓ WebSocket enabled (check DevTools → Network → filter "WS")
- ✓ No firewall blocking port 443

### Common Call Issues

| Error | Cause | Fix |
|-------|-------|-----|
| "Recipient offline" | Recipient not in friends page | Ask them to go to Home page |
| "No permissions" | Browser blocking camera | Allow in browser settings |
| "Connection timeout" | Network issue | Check internet speed |
| "Call not found" | Recipient not ready | Recipient refresh and try receiving call |

---

## 🟡 ISSUE 3: WEBSITE NOT RESPONSIVE / BROKEN ON MOBILE

### Symptoms
- Layout broken on phone
- Buttons overlapping
- Text too small/large
- Sidebar not visible on mobile

### Step-by-Step Fix

#### 1. Test on Different Devices
```
Chrome DevTools:
1. F12 → Toggle device toolbar (Ctrl+Shift+M)
2. Select device:
   - iPhone SE (375px)
   - iPad (768px)
   - Desktop (1024px+)
3. Test each page:
   - Home page
   - Friends page
   - Notifications page
   - Chat page
   - Calls page
```

#### 2. Mobile Navigation
On mobile (< 1024px):
- ☰ Hamburger menu should appear (top-left)
- Click ☰ to open sidebar
- Click X to close sidebar
- Clicking a link should auto-close sidebar

If not working:
```
1. Force redeploy on Vercel
2. Clear browser cache (Ctrl+Shift+Delete)
3. Hard refresh (Ctrl+Shift+R)
```

#### 3. Check Layout Issues
```
Mobile Issues to Check:
☐ Text readable (16px+)
☐ Buttons clickable (44px+ touch targets)
☐ No horizontal scroll
☐ Images load properly
☐ Forms work on mobile keyboard
☐ Spacing/padding appropriate
```

#### 4. Vercel Recent Update
Latest Responsive Design Update (fba6756):
- Made Layout responsive with mobile menu
- Sidebar slides on mobile, visible on desktop
- Navbar optimized for all screen sizes
- Need to redeploy for changes to take effect

```bash
# To manually redeploy:
cd frontend
npm run build
vercel --prod
```

---

## 🔵 ISSUE 4: FRIEND CONNECTION NOT WORKING

### Symptoms
- Can't see recommended users
- Can't send friend request
- Friend request doesn't appear
- Notifications not received

### Step-by-Step Fix

#### 1. Verify Users Exist
Two separate accounts needed:
```
User A:
- Signup at: https://link-up-web-xi.vercel.app/signup
- Fill profile (onboarding)
- Verify email (if prompted)

User B:
- Same process in different browser/private window
- Use different email
```

#### 2. Check Friend Request Flow
```
User A (Browser 1):
1. Go to Home page
2. Should see User B in "Recommended Users"
3. Click "Send Friend Request" button
4. Should say "Request Sent ✓"

User B (Browser 2):
1. Go to Notifications page
2. Should see User A in "Friend Requests"
3. Click "Accept" button
4. Should say "New Friend"

User A (Browser 1):
1. Go to Friends page
2. Should see User B in friends list
3. Click "Message" button
4. Should go to chat page
```

#### 3. Debug Connection Issues
```javascript
// Open Browser 1 console
// Check Friend list loaded
// Go Home page → Open console

// Should see friend IDs logged
console.log("Recommended users API working");

// Try manual API call
const res = await fetch('https://linkup-web-8vjm.onrender.com/api/users', {
  credentials: 'include'
});
console.log("Recommended users:", await res.json());
```

#### 4. Backend Connection Check
```bash
# From terminal
# Connection test to MongoDB
curl -X GET "https://linkup-web-8vjm.onrender.com/api/users/friends" \
  -H "Cookie: jwt=YOUR_JWT_TOKEN_HERE" \
  -H "Content-Type: application/json"

# Should return friend list (even if empty [])
# NOT 401 Unauthorized
```

---

## 🟣 ISSUE 5: LOGIN FAILS / 401 UNAUTHORIZED

### Symptoms
- Can't login
- 401 error in console
- "Unauthorized" message
- JWT token missing

### Step-by-Step Fix

#### 1. Backend CORS Check
```javascript
// Go to backend server.js
// Check CORS config has credent ials: true

// Should be:
app.use(cors({
  origin: 'https://link-up-web-xi.vercel.app',
  credentials: true
}));
```

#### 2. Cookie Not Setting
```javascript
// In browser console after login
// Check if JWT cookie exists
document.cookie
// Should show: jwt=eyJhbGc...

// If empty, cookies not being set
// Fix: Check backend cookie settings
```

#### 3. Clear All Auth Data
```
1. DevTools → Application tab
2. Storage:
   - Clear Cookies (domain: *.vercel.app)
   - Clear Local Storage
   - Clear Session Storage
3. Hard refresh (Ctrl+Shift+R)
4. Try login again
```

#### 4. Test Login Locally
```bash
# Terminal
cd backend
npm run dev

# Browser: http://localhost:5173/login
# Try signing up and logging in
# Check if JWT cookie sets properly
```

---

## 🟢 MANUAL HEALTH CHECK

### Backend Health Test
```bash
# Check backend running
curl -I https://linkup-web-8vjm.onrender.com
# Should return: 404 Not Found (NOT Connection Error)

# Check MongoDB
curl -X GET https://linkup-web-8vjm.onrender.com/api/users/friends
# Should return: 401 (if not logged in) or [] (if logged in)
# NOT 500 Internal Server Error
```

### Frontend Health Test
```
1. Open https://link-up-web-xi.vercel.app
2. Should load without JS errors
3. DevTools → Console should be clean
4. DevTools → Network should have successful requests
5. Try signup → should work
6. Login page loads
```

### Stream.io Health Test
```javascript
// In browser console on chat page
// If Stream.io connected, should see:
document.title
// Should show: "Chat" (not error)

// Check Stream token
console.log("Token exists:", !!window.chatClient)
// Should be: true
```

---

## 📞 WHEN EVERYTHING IS BROKEN

### Nuclear Option: Full Reset

#### Step 1: Clear Everything Locally
```bash
cd k:\LinkUp-\frontend
npm cache clean --force
rm -r node_modules package-lock.json
npm install
npm run build
```

#### Step 2: Redeploy Everything
```bash
# Option 1: Via Vercel Dashboard
1. Go Vercel → Deployments
2. Click "..." → "Redeploy"
3. Wait 3 minutes

# Option 2: Via Git Push
cd k:\LinkUp-
git status
git add .
git commit -m "trigger: Force redeploy all services"
git push origin main
# Vercel auto-redeploys
```

#### Step 3: Render Backend Redeploy
1. Go to https://dashboard.render.com
2. Select linkup-web service
3. Click "Manual Deploy" → "Deploy latest commit"
4. Wait for green checkmark

#### Step 4: Test Everything
```
1. Clear browser cache
2. Hard refresh (Ctrl+Shift+R)
3. Try fresh login
4. Send message
5. Make call
```

---

## 🔧 VERCEL REDEPLOY (For Latest Responsive Design)

The latest update (May 4, 2026) includes:
- Mobile hamburger menu
- Responsive navbar
- Mobile-optimized sidebar

**Force redeploy to get these changes:**

```
1. https://vercel.com/dashboard/projects
2. Select LinkUp_Web
3. Deployments tab
4. Click latest deployment "..."
5. Select "Redeploy"
6. Confirm
7. Wait 2-3 minutes
8. Hard refresh: Ctrl+Shift+R
```

---

## 📊 DEBUGGING WITH BROWSER TOOLS

### Chrome DevTools Quick Reference

#### 1. Network Tab
- F12 → Network
- Reload page
- Look for failed requests (red)
- Should see: POST /login, GET /friends, WebSocket connections

#### 2. Console Tab
- F12 → Console
- Look for red errors
- Check "Stream API Key loaded"
- Run tests from guide above

#### 3. Application Tab
- F12 → Application
- Check Cookies has `jwt` token after login
- Check Local Storage for auth state

#### 4. Performance Tab
- F12 → Performance
- Record user actions
- Check for slow operations
- Identify bottlenecks

---

## 📋 FINAL CHECKLIST

Before declaring fixed:

```
[ ] Text messages send and receive in real-time
[ ] Recipient sees messages instantly
[ ] Audio call button shows
[ ] Video call button shows
[ ] Can hear/see on video call
[ ] Website responsive on mobile (375px)
[ ] Website responsive on tablet (768px)
[ ] Website responsive on desktop (1024px+)
[ ] Mobile hamburger menu works
[ ] Friends can connect via friend requests
[ ] Notifications appear when requests received
[ ] User status shows online/offline
[ ] Emoji reactions work
[ ] Message search works
[ ] Message pinning works
[ ] Theme selector works
[ ] Dark mode works
[ ] Logout works
[ ] Login works
```

---

## 🎯 CONTACT & RESOURCES

**Live Application**:
- Frontend: https://link-up-web-xi.vercel.app
- Backend: https://linkup-web-8vjm.onrender.com
- Repository: https://github.com/KAVIN131005/LinkUp_Web

**Documentation**:
- [CONNECTION_GUIDE.md](./CONNECTION_GUIDE.md) - How systems work
- [SETUP_GUIDE.md](./SETUP_GUIDE.md) - Local development setup
- [DEPLOYMENT_GUIDE.md](./DEPLOYMENT_GUIDE.md) - Production deployment
- [README.md](./README.md) - Complete project overview

**For Stream.io Issues**:
- Documentation: https://getstream.io/documentation/
- Support: https://support.getstream.io
