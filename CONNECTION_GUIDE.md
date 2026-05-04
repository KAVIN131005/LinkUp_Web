# 🌐 LinkUp Connection & Communication Flow Guide

**Date**: May 4, 2026  
**Status**: Production Deployment Completed

---

## 📋 TABLE OF CONTENTS

1. [How People Connect](#1-how-people-connect)
2. [Text Message Real-Time System](#2-text-message-real-time-system)
3. [Audio/Video Call System](#3-audiovideo-call-system)
4. [Responsive Design Implementation](#4-responsive-design-implementation)
5. [Troubleshooting](#5-troubleshooting)

---

## 1. HOW PEOPLE CONNECT

### Step-by-Step Connection Process

```
USER A                          SYSTEM                           USER B
  |                              |                                 |
  |-- Browse Home Page --------> Get Recommended Users            |
  |                          (MongoDB Query)                       |
  |                              |                                 |
  |-- Send Friend Request -----> FriendRequest Created            |
  |                          (Status: "pending")                   |
  |                              |                                 |
  |                              |<-- USER B Receives              |
  |                              |    Notification                 |
  |                              |                                 |
  |                         USER B Accepts                         |
  |                         Request                                |
  |                              |                                 |
  |<---- Notification -----<----|--- Added to Friends             |
  |       Friend Added                                             |
  |                                                                |
  |===== NOW CONNECTED ===================================|         |
  |                                                                |
  |-- Click "Message" Button -------> Navigate to /chat/{id}      |
  |                                                                |
  |-- Messages Displayed                Stream.io Real-time        |
  |-- Type & Send Messages <---------- connected channel          |
  |-- Receive Messages in Real-time                               |
  |                                                                |
  |-- Click "Call" Button ---------> Initiate Video/Audio         |
  |                                  1-on-1 Stream Call          |
```

### Connection Components

| Component | Technology | Purpose |
|-----------|-----------|---------|
| **Friend System** | MongoDB + REST API | Discover & connect users |
| **Real-time Messaging** | Stream.io Chat SDK | Send/receive text messages instantly |
| **Calls** | Stream.io Calling SDK | Audio & video communication |
| **Status Updates** | Stream.io User Status | Show online/offline indicators |

---

## 2. TEXT MESSAGE REAL-TIME SYSTEM

### How Real-Time Messaging Works

#### Frontend Flow

```jsx
// 1. User opens ChatPage
const ChatPage = () => {
  // Get Stream token from backend
  const { data: tokenData } = useQuery({
    queryFn: getStreamToken  // Backend generates JWT token
  });

  // Initialize Stream Chat Client
  useEffect(() => {
    const client = StreamChat.getInstance(STREAM_API_KEY);
    
    // Connect user with token
    await client.connectUser({
      id: authUser._id,
      name: authUser.fullName,
      image: authUser.profilePic
    }, tokenData.token);

    // Create 1-on-1 channel
    const channelId = [authUser._id, targetUserId].sort().join("-");
    const channel = client.channel("messaging", channelId, {
      members: [authUser._id, targetUserId]
    });
    
    // Watch for real-time updates
    await channel.watch();
    
    setChannel(channel);
  }, [tokenData]);
};
```

#### Message Sending Flow

```
User Types Message
    ↓
Clicks Send Button
    ↓
Stream Chat SDK Captures Message
    ↓
Sends via WebSocket to Stream.io servers
    ↓
Stream.io Validates & Stores
    ↓
Broadcasts to All Channel Members
    ↓
Recipient's Channel Receives Instantly
    ↓
UI Re-renders with New Message
    ↓
Sender Sees Message Delivered
```

#### Backend Stream Token Generation

```javascript
// ./backend/src/controllers/chat.controller.js
export async function getStreamToken(req, res) {
  try {
    const user = req.user;
    const token = client.createUserToken(user.id);
    
    res.status(200).json({ 
      token,
      userId: user.id,
      apiKey: process.env.STREAM_API_KEY
    });
  } catch (error) {
    res.status(500).json({ message: "Failed to generate token" });
  }
}
```

### Why Messages Might Not Be Sending

1. **Missing Token**: Stream token not being generated
   - Check: `await getStreamToken()` completes successfully
   
2. **Not Connected to Channel**: Channel not being watched
   - Check: `await channel.watch()` executes
   
3. **WebSocket Connection Issue**: Real-time connection failing
   - Check: Browser DevTools → Network → WS (WebSocket)
   
4. **Environment Variable Missing**: VITE_STREAM_API_KEY not set on Vercel
   - Check: Vercel Dashboard → Settings → Environment Variables

---

## 3. AUDIO/VIDEO CALL SYSTEM

### How Video Calls Work

#### Call Initiation Flow

```
User A Clicks "Call" Button
    ↓
Navigate to /call/{recipientId}
    ↓
CallPage Component Mounts
    ↓
Stream Call Client Initializes
    ↓
Generate Call Token
    ↓
Initiate Call to Recipient
    ↓
Recipient Receives Call Notification
    ↓
Recipient Accepts or Rejects
    ↓
WebRTC Connection Established
    ↓
Audio/Video Stream Transmits
    ↓
Both Users See Each Other
```

#### Stream Call Integration

```jsx
// ./frontend/src/pages/CallPage.jsx
import { StreamCall, StreamTheme, CallControls, ParticipantViewUI } from "@stream-io/video-react-sdk";
import { useCall, useCallStateHooks } from "@stream-io/video-react-sdk";

const CallPage = () => {
  const { id: recipientId } = useParams();
  
  // Initialize call client
  useEffect(() => {
    const initCall = async () => {
      const token = await getStreamToken();
      
      const client = new StreamVideoClient({
        apiKey: STREAM_API_KEY,
        user: { id: authUser._id },
        token: token
      });
      
      setClient(client);
    };
    
    initCall();
  }, [authUser]);

  return (
    <StreamTheme>
      <div className="w-full h-screen">
        <StreamCall call={call}>
          {/* Your video/audio UI */}
          <CallControls />
          <ParticipantViewUI />
        </StreamCall>
      </div>
    </StreamTheme>
  );
};
```

### Why Calls Might Not Work

1. **Call Client Not Initialized**
   - Fix: Ensure `getStreamToken()` is called before initiating call
   
2. **Recipient Not Online**
   - Fix: Verify both users' WebSocket connections are active
   
3. **Browser Permissions**
   - Fix: Check browser camera/microphone permissions
   
4. **CORS Issue**
   - Fix: Verify Vercel frontend URL is allowed in Render backend CORS
   
5. **Stream.io Credentials Missing**
   - Fix: Check `VITE_STREAM_API_KEY` is set on Vercel

---

## 4. RESPONSIVE DESIGN IMPLEMENTATION

### Current Responsive Breakpoints

```css
/* Tailwind CSS Breakpoints */
sm:  640px   (small phones)
md:  768px   (tablets)
lg:  1024px  (desktops)
xl:  1280px  (large screens)
2xl: 1536px  (extra large)
```

### Component Responsive Strategy

#### Example: Layout Component

```jsx
export const Layout = ({ children, showSidebar = true }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(window.innerWidth >= 1024);

  return (
    <div className="flex h-screen">
      {/* Sidebar - Hidden on small screens */}
      {showSidebar && (
        <aside className={`
          fixed md:relative
          w-full md:w-80
          h-screen
          ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}
          transition-transform duration-300
          md:translate-x-0
          z-50
        `}>
          {/* Sidebar content */}
        </aside>
      )}

      {/* Main content - Full width on mobile */}
      <main className="flex-1 w-full overflow-auto">
        {/* Mobile menu toggle */}
        {showSidebar && (
          <button 
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className="md:hidden p-4"
          >
            ☰ Menu
          </button>
        )}
        
        {children}
      </main>
    </div>
  );
};
```

### Mobile-First Responsive Features

| Component | Mobile | Tablet | Desktop |
|-----------|--------|--------|---------|
| **Sidebar** | Full-width overlay | Visible | Visible |
| **Chat Window** | Full width | Full width | Split layout |
| **Message Input** | Full width | Full width | Full width |
| **Buttons** | Stacked | Inline | Inline |
| **Font Size** | 14px | 16px | 16px |
| **Padding** | 8px | 16px | 24px |

### Key Responsive Utilities

```jsx
// Hide on mobile, show on larger screens
className="hidden md:block"

// Full width on mobile, fixed on larger
className="w-full md:w-80"

// Responsive grid
className="grid-cols-1 md:grid-cols-2 lg:grid-cols-3"

// Responsive padding
className="p-2 sm:p-4 md:p-6 lg:p-8"

// Responsive text
className="text-sm md:text-base lg:text-lg"
```

---

## 5. TROUBLESHOOTING

### Real-Time Messaging Not Working

#### Checklist

```
☐ Stream API Key set in Vercel .env
☐ Stream Token generated successfully
☐ Channel.watch() executed without errors
☐ WebSocket connection open (DevTools → Network)
☐ Both users in the same channel
☐ Message input field has onSubmit handler
```

#### Debug Steps

```javascript
// Open browser console and check:

// 1. Stream API Key loaded
console.log(import.meta.env.VITE_STREAM_API_KEY);  // Should not be empty

// 2. Token received
console.log("Token:", tokenData);  // Should have token object

// 3. Chat client connected
console.log("Chat client:", chatClient);  // Should be initialized

// 4. Channel watching
console.log("Channel:", channel);  // Should have channel object

// 5. Check for WebSocket
// DevTools → Network → Filter by "WS"
// Should see wss://... connections
```

### Calls Not Connecting

#### Checklist

```
☐ Camera/Microphone permissions granted
☐ Stream API Key configured
☐ Call token generated
☐ Recipient is online and in /friends page
☐ Both browsers allow camera access
☐ Network connection is stable
☐ Call URL is correct (/call/{recipientId})
```

#### Testing Calls Locally

```bash
# Terminal 1: Backend
cd backend
npm run dev

# Terminal 2: Frontend
cd frontend
npm run dev

# Browser: Open http://localhost:5173
# 1. Create two users
# 2. Send friend request
# 3. Accept request
# 4. Click Message
# 5. Click Call button
# 6. Should see call screen
```

### Website Not Responsive

#### Checklist

```
☐ Viewport meta tag present in index.html
☐ Tailwind CSS responsive classes used
☐ No hardcoded pixel widths
☐ Flex/Grid for layouts
☐ Mobile menu toggle implemented
☐ Touch-friendly button sizes (min 44px)
```

#### Test Responsiveness

```
1. Desktop: Chrome DevTools → Toggle Device Toolbar
2. Mobile: 375px width (iPhone SE)
3. Tablet: 768px width (iPad)
4. Desktop: 1024px+ width
5. Verify all layouts adapt properly
```

---

## 🔧 QUICK FIX CHECKLIST

For Production Issues:

- [ ] Verify Vercel environment variables set
- [ ] Verify Render environment variables set
- [ ] Check browser console for errors
- [ ] Check network tab for failed requests
- [ ] Restart frontend (Vercel redeploy)
- [ ] Restart backend (Render redeploy)
- [ ] Clear browser cache

---

## 📞 SUPPORT

**Live Links**:
- Frontend: https://link-up-web-xi.vercel.app
- Backend: https://linkup-web-8vjm.onrender.com
- Repository: https://github.com/KAVIN131005/LinkUp_Web

**For Issues**:
1. Check browser DevTools console for errors
2. Check Network tab for failed requests
3. Verify environment variables on deployment platforms
4. Review logs on Render dashboard
