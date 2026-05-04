# LinkUp - WhatsApp Web Clone

A full-stack real-time messaging application built with **React**, **Node.js/Express**, and **MongoDB**. LinkUp provides instant messaging, friend connections, and video calling capabilities with a modern WhatsApp Web-like interface.

## 🌟 Project Overview

LinkUp is a complete implementation of a WhatsApp Web clone that demonstrates core chat functionality with real-time updates. The project showcases full-stack development skills including:

- **Frontend**: React with Vite, Tailwind CSS, and Socket.IO/Stream Chat integration
- **Backend**: Express.js with MongoDB and JWT authentication
- **Database**: MongoDB Atlas for cloud data storage
- **Real-time**: Stream Chat API for instant messaging and video calls

---

## ✅ Feature Implementation Checklist

### 1. User Setup ✅
- [x] User creation mechanism (Signup)
- [x] Unique user identification (MongoDB Object IDs)
- [x] Support for multiple users
- [x] JWT-based authentication system
- [x] User distinguishability (Full Name, Email, Profile Picture)
- [x] User profile onboarding system
- [x] User status and presence tracking

### 2. Chat Interface ✅
- [x] Two-panel layout (Sidebar + Chat Window)
- [x] Chat list displaying conversations/friends
- [x] Active chat highlighting
- [x] Chat window displaying message history
- [x] Message input field with send action
- [x] Visual distinction between sent and received messages
- [x] Automatic scroll to latest messages
- [x] Friend cards with user profiles
- [x] Real-time notifications for new messages

### 3. Messaging Functionality ✅
- [x] Send text messages between users
- [x] Store messages in database (Stream Chat backend)
- [x] Fetch messages based on selected chat
- [x] Display messages in chronological order
- [x] Message persistence after page refresh
- [x] Associate messages with sender, receiver, and timestamp
- [x] Thread support for grouped conversations
- [x] Message delivery status

### 4. Backend APIs ✅
- [x] User creation endpoint (POST /api/auth/signup)
- [x] User login endpoint (POST /api/auth/login)
- [x] User logout endpoint (POST /api/auth/logout)
- [x] Get authenticated user (GET /api/auth/me)
- [x] User onboarding endpoint (POST /api/auth/onboarding)
- [x] Get recommended users (GET /api/users)
- [x] Get user friends (GET /api/users/friends)
- [x] Send friend requests (POST /api/users/friend-request)
- [x] Manage friend requests (GET, POST /api/users/friend-requests)
- [x] Stream token generation (GET /api/chat/token)
- [x] Proper HTTP status codes and error handling
- [x] Input validation and sanitization

### 5. Real-Time Updates ✅
- [x] Stream Chat SDK integration for WebSocket-based messaging
- [x] Live message rendering without page refresh
- [x] Real-time friend status updates
- [x] Instant notification delivery
- [x] Message read receipts

### 6. Application Structure ✅
- [x] Separate frontend and backend projects
- [x] Logical folder structure (models, controllers, routes, hooks, etc.)
- [x] Reusable React components (FriendCard, ChatLoader, Navbar, etc.)
- [x] Proper MongoDB schema design
- [x] Environment variable configuration
- [x] Middleware implementation (authentication, error handling)

### 7. Additional Features ✅
- [x] Friend request system
- [x] Video call integration (via CallButton component)
- [x] User notifications system
- [x] Theme selector for UI customization
- [x] Dark mode support
- [x] Responsive design
- [x] Error handling and validation
- [x] Loading states and UI feedback

---

## 🚀 Getting Started

### Prerequisites

- **Node.js** v18.0.0 or higher
- **npm** v8.0.0 or higher
- **Git** for version control
- MongoDB Atlas account (cloud database) - Or local MongoDB instance
- Stream Chat API credentials

### Installation

#### 1. Clone the Repository
```bash
git clone https://github.com/yourusername/LinkUp.git
cd LinkUp
```

#### 2. Backend Setup

Navigate to the backend directory:
```bash
cd backend
```

Install dependencies:
```bash
npm install
```

Create a `.env` file in the `backend` directory:
```env
# Backend Server Configuration
PORT=5001
NODE_ENV=development

# MongoDB Configuration (MongoDB Atlas)
MONGO_URI=mongodb+srv://username:password@cluster0.xxxxx.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0

# Stream Chat API Configuration (from getstream.io)
STREAM_API_KEY=your_stream_api_key_here
STREAM_API_SECRET=your_stream_api_secret_here

# JWT Secret Key (for authentication tokens)
JWT_SECRET_KEY=your_jwt_secret_key_here
```

Start the backend development server:
```bash
npm run dev
```

The backend will run on `http://localhost:5001`

#### 3. Frontend Setup

Navigate to the frontend directory (in a new terminal):
```bash
cd frontend
```

Install dependencies:
```bash
npm install
```

Create a `.env.local` file in the `frontend` directory:
```env
# Frontend API Configuration
VITE_API_URL=http://localhost:5001/api

# Stream Chat API Key
VITE_STREAM_API_KEY=your_stream_api_key_here
```

Start the frontend development server:
```bash
npm run dev
```

The frontend will run on `http://localhost:5173`

---

## 📋 Environment Variables

### Backend `.env` Configuration

| Variable | Description | Example |
|----------|-------------|---------|
| `PORT` | Backend server port | `5001` |
| `NODE_ENV` | Environment mode | `development` or `production` |
| `MONGO_URI` | MongoDB connection string | `mongodb+srv://user:pass@cluster.mongodb.net/` |
| `STREAM_API_KEY` | Stream Chat API key | `qzbgw32s7rmk` |
| `STREAM_API_SECRET` | Stream Chat API secret | `a3bwuk43d99q...` |
| `JWT_SECRET_KEY` | JWT signing secret | Generated random string |

### Frontend `.env.local` Configuration

| Variable | Description | Example |
|----------|-------------|---------|
| `VITE_API_URL` | Backend API endpoint | `http://localhost:5001/api` |
| `VITE_STREAM_API_KEY` | Stream Chat API key | `qzbgw32s7rmk` |

---

## 🏗️ Project Structure

```
LinkUp/
│
├── backend/
│   ├── src/
│   │   ├── controllers/
│   │   │   ├── auth.controller.js       # Authentication logic
│   │   │   ├── chat.controller.js       # Chat/messaging logic
│   │   │   └── user.controller.js       # User management logic
│   │   ├── models/
│   │   │   ├── User.js                  # User schema
│   │   │   └── FriendRequest.js         # Friend request schema
│   │   ├── routes/
│   │   │   ├── auth.route.js            # Auth endpoints
│   │   │   ├── chat.route.js            # Chat endpoints
│   │   │   └── user.route.js            # User endpoints
│   │   ├── middleware/
│   │   │   └── auth.middleware.js       # JWT authentication
│   │   ├── lib/
│   │   │   ├── db.js                    # MongoDB connection
│   │   │   └── stream.js                # Stream Chat initialization
│   │   └── server.js                    # Express server entry point
│   ├── package.json
│   ├── .env                             # Environment variables
│   └── Dockerfile                       # Docker configuration
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── CallButton.jsx           # Video call button
│   │   │   ├── ChatLoader.jsx           # Loading indicator
│   │   │   ├── FriendCard.jsx           # Friend display component
│   │   │   ├── Layout.jsx               # Main layout wrapper
│   │   │   ├── Navbar.jsx               # Top navigation
│   │   │   ├── Sidebar.jsx              # Left sidebar
│   │   │   └── ThemeSelector.jsx        # Theme switcher
│   │   ├── constants/
│   │   │   └── index.js                 # App constants
│   │   ├── hooks/
│   │   │   ├── useAuthUser.js           # Auth user hook
│   │   │   ├── useDocumentTitle.js      # Page title hook
│   │   │   ├── useLogin.js              # Login logic hook
│   │   │   ├── useLogout.js             # Logout logic hook
│   │   │   └── useSignUp.js             # Signup logic hook
│   │   ├── lib/
│   │   │   ├── api.js                   # API calls
│   │   │   ├── axios.js                 # Axios configuration
│   │   │   └── utils.js                 # Utility functions
│   │   ├── pages/
│   │   │   ├── CallPage.jsx             # Video call page
│   │   │   ├── ChatPage.jsx             # Chat/messaging page
│   │   │   ├── FriendsPage.jsx          # Friends management
│   │   │   ├── HomePage.jsx             # Home/dashboard
│   │   │   ├── LoginPage.jsx            # Login page
│   │   │   ├── NotificationsPage.jsx    # Notifications
│   │   │   ├── OnboardingPage.jsx       # User setup
│   │   │   └── SignUpPage.jsx           # Signup page
│   │   ├── store/
│   │   │   └── useThemeStore.js         # Theme state management
│   │   ├── App.jsx                      # Main app component
│   │   ├── main.jsx                     # Entry point
│   │   └── index.css                    # Global styles
│   ├── public/                          # Static assets
│   ├── package.json
│   ├── .env.local                       # Environment variables
│   ├── vite.config.js                   # Vite configuration
│   ├── tailwind.config.js               # Tailwind CSS config
│   └── Dockerfile                       # Docker configuration
│
├── .gitignore                           # Git ignore rules
├── package.json                         # Root package.json
├── docker-compose.yml                   # Docker compose file
├── deploy.sh                            # Deploy script
├── deploy.bat                           # Windows deploy script
└── README.md                            # This file
```

---

## 🔌 API Endpoints

### Authentication Routes (`/api/auth`)
- `POST /signup` - Create new user account
- `POST /login` - Login user and get JWT token
- `POST /logout` - Logout and invalidate session
- `GET /me` - Get current authenticated user (Protected)
- `POST /onboarding` - Complete user onboarding (Protected)

### User Routes (`/api/users`)
- `GET /` - Get recommended users
- `GET /friends` - Get user's friends list (Protected)
- `POST /friend-request` - Send friend request (Protected)
- `GET /friend-requests` - Get incoming friend requests (Protected)
- `GET /outgoing-friend-requests` - Get sent friend requests (Protected)

### Chat Routes (`/api/chat`)
- `GET /token` - Get Stream Chat token for messaging (Protected)

---

## 🛠️ Technology Stack

### Frontend
- **React 19** - UI library
- **React Router** - Routing and navigation
- **Vite** - Build tool and dev server
- **Axios** - HTTP client
- **Tailwind CSS** - Styling
- **Stream Chat React** - Real-time messaging UI
- **React Query** - Data fetching and caching
- **React Hot Toast** - Notifications
- **Lucide React** - Icons
- **Zustand** - State management

### Backend
- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **MongoDB** - NoSQL database
- **Mongoose** - MongoDB ODM
- **JWT (jsonwebtoken)** - Authentication
- **bcryptjs** - Password hashing
- **Stream Chat SDK** - Real-time messaging
- **Nodemon** - Development auto-reload
- **dotenv** - Environment variable management

### Database
- **MongoDB Atlas** - Cloud database

### Real-Time Communication
- **Stream Chat API** - WebSocket-based messaging platform

---

## 🚢 Deployment

### Option 1: Railway + Vercel (Recommended)

#### Deploy Backend to Railway:
1. Push code to GitHub
2. Visit [Railway.app](https://railway.app)
3. Click "New Project" → "Deploy from GitHub"
4. Select backend folder as root directory
5. Configure environment variables
6. Deploy and get backend URL

#### Deploy Frontend to Vercel:
1. Visit [Vercel.com](https://vercel.com)
2. Import your GitHub repository
3. Set root directory to `frontend`
4. Configure environment variables
5. Deploy and get frontend URL

### Option 2: Docker Compose (Local)
```bash
docker-compose up --build
```

Access:
- Frontend: `http://localhost:80`
- Backend: `http://localhost:5001`

---

## 👤 User Authentication Flow

1. **Sign Up**: New user creates account with email and password
2. **Password Hashing**: Password is hashed using bcryptjs
3. **JWT Token**: User receives JWT token on successful login
4. **Protected Routes**: All protected endpoints verify JWT token
5. **Onboarding**: User completes profile setup after first login
6. **Session**: User session is maintained via httpOnly cookies

---

## 💬 Real-Time Messaging Flow

1. **User Authentication**: User logs in and gets Stream Chat token
2. **Chat Initialization**: Frontend connects to Stream Chat with token
3. **Channel Creation**: Chat channel is created for each user pair
4. **Message Send**: Messages are sent via Stream Chat
5. **Message Receive**: Messages are received in real-time via WebSocket
6. **Persistent Storage**: All messages stored in Stream Chat backend

---

## 🎯 Usage Guide

### For End Users

1. **Sign Up**: Create account with email and password
2. **Complete Profile**: Add profile picture, bio, and language preferences
3. **Find Friends**: Browse recommended users
4. **Add Friends**: Send friend requests to desired users
5. **Start Chat**: Click on friend to open chat window
6. **Send Messages**: Type and send real-time messages
7. **Video Call**: Click video call button to initiate call

### For Developers

1. Install dependencies: `npm install`
2. Configure environment variables
3. Start backend: `npm run dev` (backend directory)
4. Start frontend: `npm run dev` (frontend directory)
5. Access application at `http://localhost:5173`
6. Build for production: `npm run build`

---

## 🐛 Troubleshooting

### Backend Issues

**Port 5001 already in use:**
```bash
# Windows
netstat -ano | findstr :5001
taskkill /PID <PID> /F

# macOS/Linux
lsof -i :5001
kill -9 <PID>
```

**MongoDB connection error:**
- Verify MONGO_URI in .env file
- Ensure MongoDB Atlas cluster is active
- Check network access whitelist settings
- Verify internet connection

**Stream Chat token error:**
- Verify STREAM_API_KEY and STREAM_API_SECRET
- Check if credentials are active in Stream dashboard
- Ensure JWT_SECRET_KEY is properly set

### Frontend Issues

**CORS error:**
- Backend CORS configuration must include frontend URL
- Update allowedOrigins in server.js if needed

**Blank chat window:**
- Clear browser cache
- Verify VITE_API_URL is correct
- Check browser console for errors

**Messages not updating:**
- Verify Stream Chat connection
- Check network tab in browser dev tools
- Ensure user is added to channel members

---

## 📊 Performance Optimization

- **Frontend**: Vite for fast build and HMR
- **Database**: MongoDB indexing on frequently queried fields
- **Caching**: React Query for efficient data caching
- **Assets**: Lazy loading for components and images
- **Bundle**: Code splitting and tree shaking

---

## 🔒 Security Features

- **Password Hashing**: bcryptjs with salt rounds
- **JWT Authentication**: Secure token-based auth
- **CORS Protection**: Restricted origins
- **Environment Variables**: Sensitive data in .env files
- **Input Validation**: Request validation on backend
- **Protected Routes**: Middleware authentication checks

---

## 📝 Development Commands

### Backend
```bash
npm run dev       # Start development server
npm start         # Start production server
npm run build     # Build for production (placeholder)
```

### Frontend
```bash
npm run dev       # Start development server
npm run build     # Build for production
npm run preview   # Preview production build
npm run lint      # Run ESLint checks
```

---

## 🤝 Contributing

1. Create a feature branch: `git checkout -b feature/your-feature`
2. Commit changes: `git commit -am 'Add new feature'`
3. Push to branch: `git push origin feature/your-feature`
4. Submit Pull Request

---

## 📄 License

This project is open source and available under the ISC License.

---

## 👨‍💻 Author

**Kavin**
- GitHub: [KAVIN131005](https://github.com/KAVIN131005)
- Email: your-email@example.com

---

## 🙏 Acknowledgments

- **Stream Chat API** - Real-time messaging infrastructure
- **MongoDB Atlas** - Cloud database platform
- **Tailwind CSS** - Utility-first CSS framework
- **React Ecosystem** - React, React Router, React Query
- **Node.js Community** - Express.js and other packages

---

## 📞 Support

For issues and questions:
1. Check the Troubleshooting section
2. Create an issue on GitHub
3. Contact: hr@humbletree.io

---

## 🎓 Learning Outcomes

This project demonstrates:
- Full-stack JavaScript development
- RESTful API design
- Real-time bidirectional communication
- Authentication and authorization
- Database design and management
- Component-based architecture
- State management
- Error handling and validation
- Deployment strategies

---

**Project Status**: ✅ Complete and Fully Functional

**Tested On**: Windows 11, Node.js v22.18.0, npm v10.9.3

**Last Updated**: May 3, 2026
