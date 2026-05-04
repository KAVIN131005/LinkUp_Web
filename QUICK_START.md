# ⚡ QUICK START - 5 MINUTE SETUP

## 🎯 Goal
Get video/audio calls working on your local machine RIGHT NOW

---

## ⏱️ STEP 1: Start Backend (30 seconds)

**Open Command Prompt/PowerShell:**

```bash
cd k:\LinkUp-\backend
npm run dev
```

**Wait for:**
```
✅ Server is running on port 5000
```

**DON'T CLOSE THIS TERMINAL!**

---

## ⏱️ STEP 2: Start Frontend (30 seconds)

**Open NEW Command Prompt/PowerShell:**

```bash
cd k:\LinkUp-\frontend
npm run dev
```

**Wait for:**
```
➜ Local: http://localhost:5173
```

**DON'T CLOSE THIS TERMINAL!**

---

## ⏱️ STEP 3: Open Two Browsers (1 minute)

### **Browser 1 - User A:**
1. Go to `http://localhost:5173`
2. Login with your test account
3. ✅ You're logged in as User A

### **Browser 2 - User B:**
1. Open `http://localhost:5173` again (or use Incognito window)
2. Login with DIFFERENT test account
3. ✅ You're logged in as User B

---

## ⏱️ STEP 4: Test Video Call (2 minutes)

### **In Browser 1 (User A):**
1. Go to Chat page
2. Start conversation with User B
3. Click **"Call"** button (top right) with 🎥 icon
4. Select **"🎥 Video Call"** from menu
5. ✅ You should see: **"✅ 🎥 video call initiated"** toast
6. Wait...

### **In Browser 2 (User B):**
1. **TOP RIGHT** should show notification:
   ```
   📞 Incoming video call from User A
   [Accept] [Reject]
   ```
2. Click **"Accept"**
3. ✅ Video window opens

### **Both Browsers:**
1. Should see two video feeds:
   - **Large**: Remote user's video
   - **Small (bottom-right)**: Your own video
2. ✅ Both should be LIVE & REAL-TIME
3. Call duration counter shows `00:00` counting up

---

## ⏱️ STEP 5: Test Controls (30 seconds)

### **Try These:**

**Mute Button (🔇):**
- Click once → Goes red → Your mic is OFF
- Click again → Goes gray → Your mic is ON

**Camera Button (📹):**
- Click once → Goes red → Your camera is OFF (frozen frame)
- Click again → Goes gray → Camera is ON (live feed)

**Hang Up Button (☎️):**
- Click red phone → Call ends for both users

---

## ⏱️ STEP 6: Test Audio Call (1 minute)

### **Repeat but select "📱 Audio Call"**
1. User A: Call → Audio Call
2. User B: Accept
3. ✅ See audio call UI with caller's avatar
4. Mute/Unmute works
5. Hang up ends call

---

## 📊 What You Should See

| Moment | What Happens |
|--------|-------------|
| User A clicks "Call" | Toast appears in Browser 1: ✅ call initiated |
| ~500ms later | Toast in Browser 2: 📞 Incoming call notification |
| User B clicks Accept | Call window opens in Browser 2 |
| ~2-5 seconds | Video feeds appear on both screens |
| Both live | Real-time video/audio flowing |
| Press Hang Up | Both windows close immediately |

---

## 🔍 Verify It's Working

### **In Browser Console (F12):**

You should see logs like:
```javascript
✅ Socket connected: abc123xyz
📞 Incoming call from User A
📡 Sending WebRTC offer
✅ Camera and microphone access granted
🟢 Connected
```

**If you see these = IT'S WORKING!** ✅

---

## ❌ If It Doesn't Work

### **Check 1: Backend Running?**
```bash
# Terminal 1 should show:
✅ Server is running on port 5000
```
❌ If not → Go back to Terminal 1, check for errors

### **Check 2: Frontend Running?**
```bash
# Terminal 2 should show:
➜ Local: http://localhost:5173
```
❌ If not → Go back to Terminal 2, check for errors

### **Check 3: Both Logged In?**
- Browser 1: Should show user name/profile
- Browser 2: Should show DIFFERENT user name
❌ If same user → Logout & login in Browser 2 with different account

### **Check 4: Permissions?**
When call window opens, browser asks:
- ✅ "Allow camera?" → Click ALLOW
- ✅ "Allow microphone?" → Click ALLOW

❌ If blocked → Check browser settings, allow camera/microphone for this site

### **Check 5: Console for Errors**
- Open F12 in both browsers
- Look for red error messages
- Search for "socket" or "webrtc" issues

---

## 🎯 Success Checklist

- [ ] Terminal 1: Backend running
- [ ] Terminal 2: Frontend running
- [ ] Browser 1: User A logged in
- [ ] Browser 2: User B logged in
- [ ] User A clicks Call → Video Call
- [ ] User B gets notification
- [ ] User B clicks Accept
- [ ] Both see video feeds
- [ ] Can hear each other
- [ ] Mute button works
- [ ] Camera button works
- [ ] Hang up ends call
- [ ] Can call again (redialing works)

---

## 🎊 When ALL checkmarks are DONE

**CONGRATULATIONS!** 🎉

Your video and audio call system is **FULLY WORKING!**

---

## 📞 Quick Test Commands

Keep these handy:

### **Stop Backend:**
```
Ctrl + C (in Terminal 1)
```

### **Restart Backend:**
```
npm run dev
```

### **Stop Frontend:**
```
Ctrl + C (in Terminal 2)
```

### **Restart Frontend:**
```
npm run dev
```

### **Clear Browser Cache:**
```
Ctrl + Shift + Delete (then Clear browsing data)
```

### **Open DevTools Console:**
```
F12 (or Right-click → Inspect → Console tab)
```

---

## 🚀 Next Steps After Testing

1. ✅ Test with 2+ different browser pairs
2. ✅ Test rapid accept/reject
3. ✅ Test switching between video & audio
4. ✅ Test during weak connection (throttle in DevTools)
5. ✅ Deploy to production (Vercel + Render)

---

## 💡 Pro Tips

1. **Use Incognito/Private Window** for second user (doesn't share cookies)
2. **Monitor Console** while calling to see real-time events
3. **Check Network Tab** (DevTools) to see WebSocket connection
4. **Test with Different Networks** (WiFi, mobile hotspot)
5. **Try Mobile Browsers** for mobile testing

---

## ⏰ Total Time Expected

- Backend start: 5 seconds
- Frontend start: 10 seconds
- Browser login: 20 seconds
- Call setup: 30 seconds
- **Total: ~2 minutes to first working call**

---

**Ready? LET'S GO!** 🚀📞

```bash
# Terminal 1
cd k:\LinkUp-\backend && npm run dev

# Terminal 2 (new terminal)
cd k:\LinkUp-\frontend && npm run dev

# Browsers
http://localhost:5173
```

**Enjoy your video calls!** 🎥📱
