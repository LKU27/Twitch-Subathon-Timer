# 🚀 Vercel Deployment Checklist

## ✅ Pre-Deployment Checklist

### 1. Code Preparation
- [ ] All files are saved and committed to Git
- [ ] No local `.env` files are committed (they're in `.gitignore`)
- [ ] All dependencies are properly listed in `package.json` files

### 2. GitHub Repository
- [ ] Code is pushed to GitHub repository
- [ ] Repository is public (or you have Vercel Pro for private repos)

### 3. Vercel Account
- [ ] Vercel account created at [vercel.com](https://vercel.com)
- [ ] GitHub account connected to Vercel

## 🚀 Deployment Steps

### Step 1: Push to GitHub
```bash
# If you haven't already, initialize git and push to GitHub
git init
git add .
git commit -m "Initial commit - Subathon Timer with Vercel KV"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO_NAME.git
git push -u origin main
```

### Step 2: Deploy to Vercel
1. Go to [vercel.com](https://vercel.com) and sign in
2. Click **"New Project"**
3. Import your GitHub repository
4. Configure the project:
   - **Framework Preset**: Other
   - **Root Directory**: `./` (default)
   - **Build Command**: `npm run build`
   - **Output Directory**: `client/dist`

### Step 3: Add Vercel KV Database
1. In your Vercel project dashboard, go to **Storage** tab
2. Click **"Create Database"** → **"KV"**
3. Name: `subathon-timer-kv`
4. Region: Choose closest to your users
5. Click **"Create"**

### Step 4: Set Environment Variables
1. Go to **Settings** → **Environment Variables**
2. Add these variables:
   ```
   NODE_ENV = production
   JWT_SECRET = your-very-secure-production-jwt-secret
   ```
3. Click **"Save"**

### Step 5: Deploy
1. Click **"Deploy"**
2. Wait for build to complete (2-3 minutes)
3. Your app will be live at `https://your-project-name.vercel.app`

## 🧪 Testing Your Deployment

### Test Checklist
- [ ] App loads at your Vercel URL
- [ ] Can create a new account
- [ ] Can login with existing account
- [ ] Timer starts and runs
- [ ] Timer persists after page refresh
- [ ] OBS URL works: `https://your-app.vercel.app/obs`

### Common Issues & Solutions

**Build Fails:**
- Check that all dependencies are in `package.json`
- Ensure build command is correct

**App Won't Load:**
- Check environment variables are set
- Verify Vercel KV is connected

**Authentication Issues:**
- Verify JWT_SECRET is set
- Check that KV database is created

## 📞 Need Help?

If you encounter issues:
1. Check Vercel deployment logs
2. Verify all environment variables
3. Ensure Vercel KV is properly connected
4. Check that your GitHub repo is up to date

## 🎉 Success!

Once deployed, your Subathon Timer will be:
- ✅ Live on the internet
- ✅ Persistent user accounts
- ✅ Persistent timer states
- ✅ Ready for OBS integration
- ✅ Accessible worldwide

**Your app URL**: `https://your-project-name.vercel.app`
**OBS URL**: `https://your-project-name.vercel.app/obs`
