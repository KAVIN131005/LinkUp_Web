# 🎥📱 Complete Video & Audio Call System - Setup & Testing Guide

## ✅ All Issues Fixed & Ready to Deploy

### **What Was Installed:**
- ✅ `socket.io-client@4.8.3` (Frontend WebSocket client)
- ✅ `socket.io@4.8.3` (Backend WebSocket server)

---

## 🚀 PART 1: LOCAL TESTING (Development)

### **Terminal Window 1 - Start Backend:**

```bash
cd k:\LinkUp-\backend
npm run dev
```

**Expected Output:**
```
✅ Server is running on port 5000
✅ MongoDB connected
```

### **Terminal Window 2 - Start Frontend:**

```bash
cd k:\LinkUp-\frontend
npm run dev
```

**Expected Output:**
```
➜  Local:   http://localhost:5173/
```

---

## 🧪 PART 2: TESTING THE CALLS

### **Test Setup - Two Browser Tabs/Windows:**

#### **Step 1: Login as User A**
- Open `http://localhost:5173` in Browser 1
- Click "Login"
- Enter your test credentials
- ✅ You should be logged in

#### **Step 2: Login as User B**
- Open `http://localhost:5173` in Browser 2 (Private/Incognito Window)
- Use different user credentials
- ✅ You should be logged in with User B

#### **Step 3: Navigate to Chat**
- In Browser 1 (User A): Go to Friends page → Find User B → Click "Message"
- You should see the chat interface
- ✅ Look at top right - You should see: **"Call" button with 🎥 icon**

---

## 📞 TEST 1: Receive Incoming Video Call

### **User A (Caller) Actions:**
1. In Browser 1, click the **"Call"** button (top right of chat)
2. Select **"🎥 Video Call"** from dropdown menu
3. You should see toast: **"✅ 🎥 video call initiated"**
4. Wait for connection...

### **User B (Recipient) Actions:**
1. In Browser 2, Top-right corner should show notification:
   ```
   📞 Incoming video call from User A
   [Accept] [Reject]
   ```
2. Click **"Accept"** button
3. Should see: **"🟢 Connected"** status

### **Call Active:**
1. Both browsers show **video windows** with:
   - ✅ Your own video (small square, bottom-right)
   - ✅ Remote video (large, main area)
   - ✅ Call duration timer: `00:00` counting up
   - ✅ Controls at bottom: **Mute | Camera Toggle | Hang Up**

### **Test Audio:**
1. Speak into your microphone in Browser 1
2. Sound should come through speakers of Browser 2
3. Vice versa

### **Test Controls:**
1. Click **🔇 (Mute)** button → audio stops
2. Click **📹 (Camera)** button → your video freezes
3. Click again to toggle back on

### **End Call:**
1. Click **☎️ Hang Up** button (red)
2. Both windows should close
3. Back to chat interface

---

## 📞 TEST 2: Reject Video Call

### **User A Actions:**
1. Click "Call" → "🎥 Video Call"

### **User B Actions:**
1. Receives notification
2. Click **"Reject"** button
3. Notification closes

### **User A Sees:**
- Toast message: **"❌ Call was rejected"**
- Call window closes

---

## 📞 TEST 3: Audio Call

### **Same as Video Call but:**
1. User A clicks "Call" → **"📱 Audio Call"**
2. User B accepts
3. See audio call interface with caller's avatar
4. Click mute/unmute button
5. Hang up

---

## 🔍 PART 3: BROWSER CONSOLE DEBUGGING

Open Browser DevTools (F12) → Console tab to see real-time logs:

### **When Connecting:**
```
✅ Socket connected: abc123xyz
```

### **User A Initiating Call:**
```
Initiating video call to user_b_id...
📞 Starting call...
Sending call signal...
📡 Sending WebRTC offer...
```

### **User B Receiving Call:**
```
📞 Incoming call: {"callType":"video","callerName":"User A"}
📡 Received WebRTC offer
📡 Received WebRTC answer
🧊 Adding ICE candidate
🧊 Adding ICE candidate
✅ Camera and microphone access granted
```

### **Connected (Both Sides):**
```
🟢 Connected
Call duration: 1s / 2s / 3s...
```

### **Call Ended:**
```
📵 Call ended
```

---

## 🎯 PART 4: CHECKING WEBSOCKET CONNECTION

Open DevTools → Network tab → Filter for "WS" (WebSocket):

**You should see:**
```
wss://localhost:5000/socket.io/?EIO=4&transport=websocket
    Status: 101 Switching Protocols
    Message: "2probe" → "3probe" → "5" (heartbeat)
```

This means WebSocket is connected and communicating! ✅

---

## 🐛 TROUBLESHOOTING

### **Problem 1: Import Error "socket.io-client" not found**
✅ **Solution:** Already fixed! Packages are installed.
- Restart both dev servers
- Clear node_modules cache: `npm cache clean --force`

### **Problem 2: "❌ Socket disconnected" in console**
✅ **Solutions:**
- Check Backend is running: Terminal should show `✅ Server is running on port 5000`
- Check SOCKET_URL in CallButton.jsx matches your backend URL
- For localhost: Should be `http://localhost:5000`

### **Problem 3: Call doesn't reach recipient**
✅ **Check:**
- Both users logged in? ✅ Check both browsers
- Both have Socket connections? ✅ Check console for `✅ Socket connected`
- Are they in same chat? ✅ One should be messaging the other

### **Problem 4: "No recipient online" toast**
✅ **Causes:**
- Recipient's Socket.io connection dropped
- Recipient's user ID doesn't match
- Backend not tracking users properly

**Debug:**
```javascript
// In browser console:
localStorage.getItem('user') // Should show user ID
```

### **Problem 5: Black screen / No video showing**
✅ **Solutions:**
1. **Check Camera Permissions:**
   - Browser should ask permission
   - Allow camera access when prompted
   - Check browser settings: Allow this site camera/microphone

2. **Check Console for Errors:**
   ```
   ❌ NotAllowedError: Permission denied
   ❌ NotFoundError: Requested device not found
   ```

3. **Check Camera in Other Apps:**
   - Make sure camera isn't used by Zoom/Teams/other app
   - Close other apps using camera

### **Problem 6: One-way audio/video (can hear but not see)**
✅ **Check:**
- WebRTC connection state in console
- ICE candidates are being exchanged
- Both streams added to peer connection

**Debug Command:**
```javascript
// In console during active call
const pc = window.peerConnection; // access from component
pc.connectionState // Should be "connected"
pc.iceConnectionState // Should be "connected"
```

### **Problem 7: Pixelated/Laggy Video**
✅ **Solutions:**
- Check internet connection speed
- Reduce video resolution (already set to 720p max)
- Close other bandwidth-heavy apps
- Try audio call instead to reduce bandwidth

---

## 📊 PART 5: EXPECTED PERFORMANCE

| Metric | Expected |
|--------|----------|
| Connection Time | 1-3 seconds |
| Video Start | 2-5 seconds |
| Audio Start | 1-2 seconds |
| Latency | < 300ms |
| Video Quality | 720p (1280x720) |
| Frame Rate | 30fps |
| Audio Codec | Opus (adaptive) |
| Video Codec | VP8/VP9 |

---

## 🔐 PART 6: SECURITY FEATURES

✅ **Encryption:**
- All media encrypted end-to-end using DTLS-SRTP
- No media stored on server
- Direct P2P (no recording possible)

✅ **Authentication:**
- JWT tokens for user verification
- Only authenticated users can initiate calls
- Socket.io validates user on every action

✅ **Access Control:**
- Only connected users can exchange media
- Recipients must explicitly accept calls
- Any user can reject/end calls anytime

---

## 📱 PART 7: MOBILE TESTING

**Works on:**
- ✅ Android Chrome
- ✅ iOS Safari (iOS 13+)
- ✅ Desktop Chrome/Firefox/Edge/Safari

**Note:** Mobile may require HTTPS and camera/microphone permissions

---

## 🌐 PART 8: PRODUCTION DEPLOYMENT

### **Before Deploying:**

1. **Update Environment Variables:**

**Backend (.env on Render/Railway):**
```
PORT=5000
MONGO_URI=your_production_mongo_uri
STREAM_API_KEY=your_stream_key
STREAM_API_SECRET=your_stream_secret
NODE_ENV=production
```

**Frontend (.env on Vercel):**
```
VITE_API_URL=https://your-backend-domain.com/api
VITE_STREAM_API_KEY=your_stream_key
```

2. **Update Socket URL in Frontend:**

In `CallButton.jsx`, update:
```javascript
const SOCKET_URL = import.meta.env.VITE_API_URL?.replace("/api", "") || "http://localhost:5000";

// Should become:
// https://your-backend-domain.com (without /api)
```

3. **Enable HTTPS:**
- Production requires HTTPS for WebRTC (browsers require secure context)
- Both Vercel and Render provide HTTPS automatically

4. **Configure CORS in Backend:**

Update `server.js` allowedOrigins:
```javascript
const allowedOrigins = [
  "https://your-frontend-domain.vercel.app",
  "https://your-backend-domain.com",
  "http://localhost:5173", // Keep for local testing
];
```

---

## ✨ FINAL CHECKLIST

- [ ] Terminal 1: Backend running (`npm run dev`)
- [ ] Terminal 2: Frontend running (`npm run dev`)
- [ ] Browser 1: User A logged in
- [ ] Browser 2: User B logged in
- [ ] Both in chat with each other
- [ ] User A clicks Call → Video Call
- [ ] User B receives notification
- [ ] User B clicks Accept
- [ ] Video feeds appear on both sides
- [ ] Audio works both directions
- [ ] Mute/camera toggles work
- [ ] Call duration counting
- [ ] Hang up ends call properly
- [ ] Console shows no errors

---

## 🎉 Success Indicators

When everything works:
1. ✅ Real-time notifications appear instantly
2. ✅ Video/audio flows within 2-5 seconds
3. ✅ No console errors
4. ✅ Both sides can see/hear each other
5. ✅ Can end call and redialing works
6. ✅ Connection stable for 10+ minutes

---

## 📞 Testing Different Scenarios

### **Scenario 1: Back-to-Back Calls**
- End first call
- Immediately start second call
- ✅ Should work smoothly

### **Scenario 2: Switch Between Audio & Video**
- During video call, end and start audio
- ✅ Components should swap

### **Scenario 3: Network Disconnect**
- Disable internet mid-call
- ✅ Should show "Connection failed"
- Re-enable internet
- ✅ May need to rediag

### **Scenario 4: Rapid Accept/Reject**
- Call recipient 5 times
- Accept once, reject 4 times
- ✅ Each should work independently

---

## 🚀 Next Steps

1. ✅ Test locally with above scenarios
2. ✅ Fix any issues (check troubleshooting)
3. ✅ Deploy to production
4. ✅ Test with real users
5. ✅ Monitor server logs for issues

---

## 📞 Support Features

Your system now has:
- ✅ Video calls (1-to-1)
- ✅ Audio calls (1-to-1)
- ✅ Real-time notifications
- ✅ Call history tracking
- ✅ User online/offline status
- ✅ NAT traversal (works behind firewalls)
- ✅ Error recovery
- ✅ Graceful connection handling

---

**Ready to make calls!** 🎉

Start both servers and test! 📱🎥
