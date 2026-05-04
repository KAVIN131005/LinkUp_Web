# 📤 GIT PUSH & DEPLOYMENT COMMANDS

**Quick Copy-Paste Commands for Deployment**

---

## 🔗 STEP 1: CONNECT TO GITHUB

### First Time Setup (Run Once)

```powershell
cd k:\LinkUp-

# Initialize git (if not already done)
git init

# Add all files
git add .

# Initial commit
git commit -m "Initial commit: LinkUp WhatsApp Web Clone with 9 features"

# Add remote
git remote add origin https://github.com/YOUR_USERNAME/linkup.git

# Rename branch to main
git branch -M main

# Push to GitHub
git push -u origin main
```

**Replace `YOUR_USERNAME` with your actual GitHub username**

---

## 🚀 STEP 2: DEPLOY FRONTEND (VERCEL)

### Option A: Automatic (Recommended)

1. Go to https://vercel.com/dashboard
2. Click "Add New..." → "Project"
3. Select your GitHub repository `linkup`
4. Vercel auto-configures from `vercel.json`
5. Add Environment Variables:
   - `VITE_API_URL` = `https://linkup-backend.onrender.com/api`
   - `VITE_STREAM_API_KEY` = Your Stream API Key
6. Click "Deploy"

**Live URL**: `https://linkup-xxxxx.vercel.app`

### Option B: Manual Command

```bash
# Install Vercel CLI
npm install -g vercel

# Deploy
vercel --prod

# Follow prompts and select your project
```

---

## 🔧 STEP 3: DEPLOY BACKEND (RENDER)

### Step-by-Step Instructions

1. Go to https://dashboard.render.com
2. Click "New+" → "Web Service"
3. Select "Deploy from repository"
4. Authorize GitHub and select `linkup` repo
5. Fill in:
   - **Name**: `linkup-backend`
   - **Root Directory**: `backend`
   - **Runtime**: `Node`
   - **Build Command**: `npm install`
   - **Start Command**: `node src/server.js`

6. Add Environment Variables:
   ```
   NODE_ENV = production
   PORT = 5001
   MONGO_URI = mongodb+srv://username:password@cluster...
   STREAM_API_KEY = your_stream_api_key
   STREAM_API_SECRET = your_stream_api_secret
   JWT_SECRET_KEY = your_jwt_secret_key
   ```

7. Click "Create Web Service"

**Live URL**: `https://linkup-backend.onrender.com`

---

## 📤 STEP 4: PUSH FUTURE UPDATES

Every time you make changes:

```powershell
cd k:\LinkUp-

# Check what changed
git status

# Add all changes
git add .

# Commit with message
git commit -m "Your descriptive message here"

# Push to GitHub
git push origin main
```

**Automatic Deployment:**
- Vercel redeploys frontend (~2-3 min)
- Render redeploys backend (~2-3 min)

---

## 🧪 STEP 5: TEST YOUR DEPLOYMENT

### Frontend Test
```
Open: https://linkup-xxxxx.vercel.app
Expected: Login page loads ✅
```

### Backend Test
```powershell
# Using PowerShell (Windows)
Invoke-WebRequest -Uri "https://linkup-backend.onrender.com/api/auth/me" -Headers @{"Authorization"="Bearer test"}

# Using curl (any OS)
curl https://linkup-backend.onrender.com/api/auth/me

Expected: 401 error (because no valid token) ✅
This means backend is running!
```

### Full Integration Test
1. Open frontend URL
2. Signup with test account
3. Login with same account
4. Check console (F12) for no errors
5. Test chat features

---

## ⚙️ ENVIRONMENT VARIABLES NEEDED

### For Render Backend

Get these values first:

**1. MongoDB URI**
- Go to https://www.mongodb.com/cloud/atlas
- Create account → Create project → Create cluster
- Click "Connect" → "Connect your application"
- Copy connection string
- Format: `mongodb+srv://username:password@cluster.mongodb.net/linkup`

**2. Stream.io Keys**
- Go to https://getstream.io
- Create account → Dashboard
- Copy API Key and API Secret

**3. JWT Secret**
- Create a strong random string (example):
  ```
  your-super-secret-jwt-key-change-this-12345
  ```

### For Vercel Frontend

**1. Backend API URL**
```
https://linkup-backend.onrender.com/api
```

**2. Stream API Key** (same as above)

---

## 🎯 QUICK SUMMARY

```powershell
# 1. First time only
git init
git add .
git commit -m "Initial commit"
git remote add origin https://github.com/YOUR_USERNAME/linkup.git
git push -u origin main

# 2. Every time you update
git add .
git commit -m "Your message"
git push origin main

# 3. Then deploy manually on Vercel & Render (or wait for auto-deploy)
```

---

## 🔗 DIRECT LINKS

- **GitHub**: https://github.com/YOUR_USERNAME/linkup
- **Vercel Dashboard**: https://vercel.com/dashboard
- **Render Dashboard**: https://dashboard.render.com
- **MongoDB Atlas**: https://www.mongodb.com/cloud/atlas
- **Stream.io**: https://getstream.io/

---

## ❓ TROUBLESHOOTING

### Git Push Fails: "authentication failed"

```powershell
# Use GitHub token instead of password (since 2021)
# Go to: https://github.com/settings/tokens
# Create token → Copy it
# Use token as password when git asks

# Or use SSH:
git remote set-url origin git@github.com:YOUR_USERNAME/linkup.git
```

### Vercel Build Fails

- Check `vercel.json` is correct
- Check frontend `package.json` has build script
- Check all dependencies installed locally first

### Render Service Won't Start

- Check backend `package.json` has start script
- Check environment variables are all set
- Check MongoDB URI is correct
- View logs on Render dashboard

### Frontend Can't Connect to Backend

- Check `VITE_API_URL` includes `/api` at end
- Add `/api` to the URL if missing
- Verify backend is running (test API endpoint)
- Check CORS is enabled in backend

---

## 📊 ESTIMATED TIMES

| Step | Time | Auto |
|------|------|------|
| Git push | 1 min | - |
| Vercel deploy | 3-5 min | ✅ Yes |
| Render deploy | 5-10 min | ✅ Yes |
| **Total** | **10-15 min** | **Automatic** |

---

**Ready to Deploy?** Start with Step 1! 🚀
