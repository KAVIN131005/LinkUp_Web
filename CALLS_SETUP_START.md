# 🎥📱 LinkUp - Video & Audio Calls Setup

## ✅ Installation Complete

Both `socket.io` and `socket.io-client` packages are now installed!

## 🚀 Quick Start Guide

### **Step 1: Start the Backend Server**

Open a terminal and run:

```bash
cd k:\LinkUp-\backend
npm run dev
```

You should see:
```
✅ Server is running on port 5000
```

### **Step 2: Start the Frontend Development Server**

Open a **NEW** terminal and run:

```bash
cd k:\LinkUp-\frontend
npm run dev
```

You should see something like:
```
  ➜  Local:   http://localhost:5173/
```

### **Step 3: Test the Calls**

#### Test with Two Browser Tabs:

**Tab 1:**
- Open `http://localhost:5173` in Chrome/Firefox
- Login as **User A**
- Navigate to Chat with any friend
- Click "Call" button → "🎥 Video Call"

**Tab 2:**
- Open `http://localhost:5173` in a Private/Incognito window
- Login as **User B** (different user)
- Should see notification: **"📞 Incoming video call from User A"**
- Click **"Accept"** button
- ✅ Video call should connect!

---

## 📋 Architecture Overview

```
┌──────────────────────────────────────────┐
│           YOUR APPLICATION                │
└──────────────────────────────────────────┘
         ↓
┌──────────────────────────────────────────┐
│ SOCKET.IO (WebSocket Signaling)          │
│ - User online/offline                    │
│ - Call initiation                        │
│ - SDP Offer/Answer exchange              │
│ - ICE Candidates relay                   │
│ - Call Accept/Reject/End                 │
└──────────────────────────────────────────┘
         ↓
┌──────────────────────────────────────────┐
│ WEBRTC (P2P Media Streaming)             │
│ - Audio/Video streams                    │
│ - NAT traversal (STUN servers)           │
│ - End-to-end encrypted                   │
└──────────────────────────────────────────┘
```

---

## 🔧 Configuration Files Already Set Up

### **Backend** (`backend/src/server.js`)
✅ Socket.io server initialized on HTTP server
✅ CORS configured for localhost and production URLs
✅ User tracking (online/offline)
✅ Call signaling handlers
✅ WebRTC offer/answer/ICE candidate relay

### **Frontend** (`frontend/src/components/CallButton.jsx`)
✅ Socket.io client initialized
✅ Incoming call notifications
✅ Call initiation flow
✅ WebRTC peer connection setup

### **Video Call** (`frontend/src/components/VideoCallWindow.jsx`)
✅ Video stream capture
✅ Video display (local + remote)
✅ Mute/Camera controls
✅ Call duration tracking

### **Audio Call** (`frontend/src/components/AudioCallWindow.jsx`)
✅ Audio stream capture
✅ Mute controls
✅ Caller info display
✅ Call duration tracking

---

## 🐛 Troubleshooting

### Issue: "Failed to resolve import socket.io-client"
**Solution:** Packages are now installed, just restart dev server
```bash
# Stop the server: Ctrl+C
# Restart:
npm run dev
```

### Issue: Socket not connecting (console shows ❌)
**Solution:** Check if backend is running
```bash
# Terminal 1 - Backend running?
# Should show: ✅ Server is running on port 5000
```

### Issue: "No recipient online"
**Solution:** 
- Make sure both users are logged in
- Both should have Socket connections active
- Check console: `✅ Socket connected: socket_id`

### Issue: Call connects but no video/audio
**Solution:**
- Check browser camera/microphone permissions
- Open DevTools → Look for permission prompts
- Console should show: `✅ Camera and microphone access granted`

### Issue: One-way audio/video
**Solution:**
- Check WebRTC connection state
- Console should show events flowing:
  - `📡 Received offer`
  - `📡 Received answer`
  - `🧊 Adding ICE candidate`
  - `🟢 Connected`

---

## 📊 Real-Time Monitoring

To see what's happening:

1. **Open Browser DevTools** (F12)
2. **Go to Console tab**
3. You'll see logs like:
   ```javascript
   ✅ Socket connected: abc123xyz
   📞 Incoming call: User A
   📡 Received WebRTC offer
   🧊 Adding ICE candidate
   ✅ Camera and microphone access granted
   ```

---

## 🎯 Call Flow Sequence

```
USER A                              USER B
  │                                  │
  ├─ Clicks "Video Call"            │
  │                                  │
  ├─ Socket: "call_start"            │
  ├─────────────────────────────────►├─ Receives notification
  │                                  │
  │                                  ├─ Clicks "Accept"
  │                       ◄──────────┤
  │           Socket: "call_accept"  │
  │                                  │
  ├─ Creates WebRTC Offer           │
  │─ Sends via Socket.io             │
  ├─────────────────────────────────►├─ Sets remote description
  │                                  ├─ Creates Answer
  │                                  ├─ Sends back
  │          ◄──────────────────────┤
  │           Socket: "webrtc_answer"│
  │                                  │
  ├─ ICE Candidates ◄──────────────►├─ ICE Candidates
  │                                  │
  ├─ Video Feed ◄──────────────────►├─ Video Feed
  │                                  │
  ├───ƒ(Media Streaming)──────────►├───Video Playing
  │                                  │
  │  Mute/Camera Controls           │  Mute/Camera Controls
  │                                  │
  ├─ Clicks Hang Up                 │
  ├─────────────────────────────────►├─ Call Ends
  │
```

---

## ✨ Features Now Enabled

✅ **Video Calling**
- HD video (up to 720p)
- Real-time transmission
- Mute/unmute mic
- Camera on/off toggle
- Call duration tracking

✅ **Audio Calling**
- Crystal clear audio (Opus codec)
- Low latency
- Mute controls
- Caller info display

✅ **Real-Time Notifications**
- Incoming call alerts
- Caller name & type shown
- Accept/Reject buttons
- Auto-dismiss on action

✅ **Connection Management**
- Auto-reconnect on disconnect
- Graceful call termination
- Error handling & feedback
- Connection state monitoring

---

## 📱 Testing Checklist

- [ ] Backend running on port 5000
- [ ] Frontend running on localhost:5173
- [ ] Two users logged in (different browsers/tabs)
- [ ] User A initiates video call
- [ ] User B receives notification
- [ ] User B accepts call
- [ ] Video feeds appear
- [ ] Both can mute/unmute
- [ ] Both can toggle camera
- [ ] Call duration increases
- [ ] Hang up button ends call
- [ ] Both users back to chat

---

## 🎊 Success!

Once you see video/audio flowing between users, calls are working perfectly! 

**Next:** You can deploy to production using Vercel (frontend) and Render/Railway (backend).

Happy calling! 🎥📱
