# LinkUp - Complete Setup & Deployment Guide

> 🚀 **[LIVE DEMO](https://link-up-web-xi.vercel.app)** — Frontend on [Vercel](https://link-up-web-xi.vercel.app) | Backend on [Render](https://linkup-web-8vjm.onrender.com) | ✅ Production Ready

## 🎯 Quick Start Guide

### For Local Development (5-Minute Setup)

#### Step 1: Clone Repository
```bash
git clone https://github.com/KAVIN131005/LinkUp_Web.git
cd LinkUp
```

#### Step 2: Create Environment Files

**Backend `.env`**:
```bash
cd backend
cat > .env << EOF
PORT=5001
NODE_ENV=development
MONGO_URI=mongodb+srv://username:password@cluster0.xxxxx.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0
STREAM_API_KEY=your_api_key
STREAM_API_SECRET=your_api_secret
JWT_SECRET_KEY=your_jwt_secret
EOF
```

**Frontend `.env.local`**:
```bash
cd ../frontend
cat > .env.local << EOF
VITE_API_URL=http://localhost:5001/api
VITE_STREAM_API_KEY=your_api_key
EOF
```

#### Step 3: Install & Run
```bash
# Terminal 1 - Backend
cd backend
npm install
npm run dev

# Terminal 2 - Frontend
cd frontend
npm install
npm run dev
```

#### Step 4: Access Application
- Frontend: http://localhost:5173
- Backend: http://localhost:5001

---

## 📦 Prerequisites & Account Setup

### 1. MongoDB Atlas Setup (Cloud Database)

1. Visit [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Create free account
3. Create a new cluster
4. In "Database Access", create user with username and password
5. In "Network Access", add your IP or allow all (0.0.0.0/0) for development
6. Click "Connect" and copy connection string
7. Replace `<username>`, `<password>`, and `<appName>` in connection string
8. Keep the connection string safe for `.env`

**Example MONGO_URI**:
```
mongodb+srv://kumarkavin2005:Kavin%402005@cluster0.igl8eqz.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0
```

### 2. Stream Chat Setup (Real-time Messaging)

1. Visit [GetStream.io](https://getstream.io)
2. Sign up for free account
3. Create new Slack app
4. Go to "Dashboard" → "API Keys"
5. Copy your **API Key** and **API Secret**
6. Add to `.env` files as `STREAM_API_KEY` and `STREAM_API_SECRET`

**Example**:
```
STREAM_API_KEY=qzbg........
STREAM_API_SECRET=a3bwuk43d99quyz3gb58tusm58pz5gxbsbprmwr9vzqfn6r..................
```

### 3. Generate JWT Secret

```bash
# Using Node.js
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"

# Using OpenSSL
openssl rand -hex 32

# Using Python
python -c "import secrets; print(secrets.token_hex(32))"
```

Add generated string to `JWT_SECRET_KEY` in `.env`

---

## 🔧 Detailed Installation Guide

### For Windows Users

#### Prerequisites Installation

1. **Install Node.js** (v18+):
   - Download from [nodejs.org](https://nodejs.org)
   - Run installer and follow steps
   - Verify: `node --version` and `npm --version`

2. **Install Git**:
   - Download from [git-scm.com](https://git-scm.com)
   - Run installer

3. **Run the Project**:
   ```bash
   # Clone
   git clone <repo-url>
   cd LinkUp
   
   # Setup Backend
   cd backend
   npm install
   # Create .env file with MongoDB and Stream credentials
   npm run dev
   
   # In new CMD window
   cd frontend
   npm install
   # Create .env.local file
   npm run dev
   ```

### For macOS Users

```bash
# Install Homebrew if not installed
/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"

# Install Node.js
brew install node

# Clone and setup
git clone <repo-url>
cd LinkUp

# Backend
cd backend
npm install
nano .env  # Add MongoDB and Stream credentials
npm run dev

# Frontend (new terminal)
cd frontend
npm install
nano .env.local  # Add API URL
npm run dev
```

### For Linux Users

```bash
# Ubuntu/Debian
sudo apt update
sudo apt install nodejs npm git

# Clone and setup
git clone <repo-url>
cd LinkUp

# Backend
cd backend
npm install
nano .env  # Add credentials
npm run dev

# Frontend (new terminal)
cd frontend
npm install
nano .env.local
npm run dev
```

---

## 🐳 Docker Deployment

### Using Docker Compose (Easiest)

```bash
# Build and start all services
docker-compose up --build

# Services will run on:
# - Frontend: http://localhost:80
# - Backend: http://localhost:5001
```

### Manual Docker Build

#### Backend
```bash
cd backend
docker build -t linkup-backend .
docker run -p 5001:5001 --env-file .env linkup-backend
```

#### Frontend
```bash
cd frontend
docker build -t linkup-frontend .
docker run -p 80:3000 linkup-frontend
```

---

## ☁️ Cloud Deployment

### Deploy to Railway (Recommended)

#### Step 1: Prepare Code
```bash
git push origin main
```

#### Step 2: Deploy Backend
1. Go to [Railway.app](https://railway.app)
2. Click "New Project" → "Deploy from GitHub repo"
3. Select your repository
4. Choose `backend` folder as root directory
5. Add environment variables:
   - PORT=5001
   - NODE_ENV=production
   - MONGO_URI=**(from MongoDB Atlas)**
   - STREAM_API_KEY=**(from Stream)**
   - STREAM_API_SECRET=**(from Stream)**
   - JWT_SECRET_KEY=**(generated)**
6. Deploy
7. Copy the backend URL (e.g., `https://linkup-backend.up.railway.app`)

#### Step 3: Deploy Frontend
1. Go to [Vercel.com](https://vercel.com)
2. Click "New Project" → Import your GitHub repo
3. Configure:
   - Framework: Vite
   - Root Directory: `frontend`
   - Build Command: `npm run build`
   - Output Directory: `dist`
4. Add environment variables:
   - VITE_API_URL=https://linkup-backend.up.railway.app/api
   - VITE_STREAM_API_KEY=**(from Stream)**
5. Deploy
6. Get frontend URL

#### Step 4: Update CORS
In `backend/src/server.js`, update `allowedOrigins`:
```javascript
const allowedOrigins = [
  "http://localhost:5173",
  "http://localhost:5174",
  "https://your-vercel-frontend-url.vercel.app",
  "https://linkup-production.up.railway.app"
];
```

### Deploy to Heroku

```bash
# Install Heroku CLI
npm install -g heroku

# Login
heroku login

# Create apps
heroku create linkup-backend
heroku create linkup-backend-admin

# Set environment variables
heroku config:set NODE_ENV=production --app linkup-backend
heroku config:set MONGO_URI="your-mongo-uri" --app linkup-backend
heroku config:set STREAM_API_KEY="key" --app linkup-backend
heroku config:set STREAM_API_SECRET="secret" --app linkup-backend
heroku config:set JWT_SECRET_KEY="secret" --app linkup-backend

# Deploy
cd backend
git push heroku main
```

### Deploy to Render

1. Go to [Render.com](https://render.com)
2. Click "New +" → "Web Service"
3. Connect GitHub repository
4. Configure:
   - Name: linkup-backend
   - Environment: Node
   - Build Command: `npm install`
   - Start Command: `npm start`
   - Root Directory: backend
5. Add environment variables
6. Deploy

---

## 🔗 Environment Variables Reference

### Backend .env

```env
# Server Configuration
PORT=5001
NODE_ENV=development

# Database (MongoDB Atlas)
MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0

# Stream Chat (Real-time Messaging)
STREAM_API_KEY=your_stream_api_key
STREAM_API_SECRET=your_stream_api_secret

# JWT Authentication
JWT_SECRET_KEY=your_random_secret_key_32_characters_minimum
```

### Frontend .env.local

```env
# Backend API Endpoint
VITE_API_URL=http://localhost:5001/api

# Stream Chat API Key
VITE_STREAM_API_KEY=your_stream_api_key

# Optional: For production
# VITE_API_URL=https://your-production-backend.com/api
```

---

## ✅ Verification Checklist

### Backend Verification
- [ ] Node.js version: `node --version` (should be v18+)
- [ ] npm version: `npm --version` (should be v8+)
- [ ] MongoDB connection: Check console for "MongoDB Connected"
- [ ] Backend running: `http://localhost:5001` returns API
- [ ] API endpoints working:
  - [ ] `POST /api/auth/signup` - Can create user
  - [ ] `POST /api/auth/login` - Can login
  - [ ] `GET /api/auth/me` - Returns user (if authenticated)
  - [ ] `GET /api/users` - Returns users list

### Frontend Verification
- [ ] Frontend running: `http://localhost:5173` loads page
- [ ] Signup page loads: Can see signup form
- [ ] Can create account: Form accepts input and submits
- [ ] Can login: Login page works
- [ ] Chat interface loads: Main app renders
- [ ] Messages send: Can type and send in chat
- [ ] Real-time works: Messages appear instantly

### Database Verification
- [ ] MongoDB Atlas accessible: Can connect from app
- [ ] Users stored: Check in MongoDB collection `users`
- [ ] Messages stored: Check in Stream Chat dashboard

---

## 🚨 Common Issues & Solutions

### Issue 1: "EADDRINUSE: address already in use :::5001"
**Solution**:
```bash
# Windows
netstat -ano | findstr :5001
taskkill /PID <PID> /F

# macOS/Linux
lsof -i :5001
kill -9 <PID>
```

### Issue 2: "MongooseServerSelectionError"
**Solutions**:
- Verify MONGO_URI formatting
- Check MongoDB Atlas cluster status
- Whitelist your IP in Network Access
- Verify database username/password
- Check internet connection

### Issue 3: "CORS error in browser console"
**Solution**: 
- Update backend `server.js` allowedOrigins
- Ensure frontend URL is listed
- Restart backend server

### Issue 4: "Stream Chat token invalid"
**Solutions**:
- Verify STREAM_API_KEY and STREAM_API_SECRET
- Check keys are active in Stream dashboard
- Verify JWT_SECRET_KEY is set
- Clear browser cache and retry

### Issue 5: "Module not found"
**Solution**:
```bash
# Reinstall dependencies
rm -rf node_modules package-lock.json
npm install
```

### Issue 6: "Port 5173 already in use"
**Solution**:
```bash
# Change Vite port in vite.config.js
export default {
  server: {
    port: 3000  // Change to different port
  }
}
```

---

## 📊 Testing the Application

### 1. Test User Creation
1. Navigate to http://localhost:5173
2. Click "Sign Up"
3. Fill form with:
   - Full Name: Test User 1
   - Email: test1@example.com
   - Password: Password123
4. Click Sign Up
5. Should redirect to onboarding
6. Complete profile and submit
7. Should navigate to home page

### 2. Create Second User
Repeat steps 1-7 with:
- Full Name: Test User 2
- Email: test2@example.com
- Password: Password123

### 3. Test Friend System
1. Login as User 1
2. Go to Home page
3. Should see User 2 in "Recommended Users"
4. Click "Add Friend"
5. Login as User 2
6. Go to Notifications
7. Should see friend request from User 1
8. Accept request

### 4. Test Messaging
1. Both users should now see each other as friends
2. User 1 clicks on User 2 in chat list
3. Chat window opens
4. Type message: "Hello from User 1"
5. Click Send
6. Message appears in User 1's chat
7. User 2: Refresh page (message should persist)
8. Log in as User 2
9. Click on User 1
10. Should see message from User 1

### 5. Test Real-Time Messaging
1. Open two browser windows
2. Log User 1 in first window
3. Log User 2 in second window
4. User 1: Opens chat with User 2
5. User 2: Opens chat with User 1
6. User 1: Send message "Real-time test"
7. User 2: Message appears instantly without refresh

---

## 📝 Project Structure Verification

```
LinkUp/
├── backend/
│   ├── src/
│   │   ├── controllers/ ✅ (auth, chat, user)
│   │   ├── models/ ✅ (User, FriendRequest)
│   │   ├── routes/ ✅ (auth, chat, user)
│   │   ├── middleware/ ✅ (auth)
│   │   ├── lib/ ✅ (db, stream)
│   │   └── server.js ✅
│   ├── .env ✅
│   ├── package.json ✅
│   └── Dockerfile ✅
│
├── frontend/
│   ├── src/
│   │   ├── components/ ✅ (all 6+ components)
│   │   ├── pages/ ✅ (all 8 pages)
│   │   ├── hooks/ ✅ (5 custom hooks)
│   │   ├── lib/ ✅ (api, axios, utils)
│   │   └── store/ ✅ (theme)
│   ├── .env.local ✅
│   ├── package.json ✅
│   └── vite.config.js ✅
│
├── README.md ✅
├── FEATURES_CHECKLIST.md ✅
├── SETUP_GUIDE.md ✅
├── .gitignore ✅
└── docker-compose.yml ✅
```

---

## 🎓 Next Steps After Deployment

1. **Share Repository**: Push all code to GitHub
2. **Verify Deployment**: Test all features in production
3. **Monitor Performance**: Check logs and performance metrics
4. **Gather Feedback**: Share with users for testing
5. **Implement Updates**: Based on feedback
6. **Scale if Needed**: Upgrade databases/servers if required

---

## 📞 Support & Resources

- **Documentation**: See README.md for detailed docs
- **Troubleshooting**: See Common Issues section above
- **API Docs**: See Backend API section in README
- **Deployment**: See Cloud Deployment section above
- **Issues**: Check GitHub Issues
- **Contact**: hr@humbletree.io

---

**Setup Guide Version**: 1.0  
**Last Updated**: May 3, 2026  
**Status**: Complete and Ready for Use ✅
