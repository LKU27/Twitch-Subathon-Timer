# 🚀 Deployment Guide - Subathon Timer

This guide will help you deploy the Subathon Timer application to Vercel.

## 📋 Prerequisites

1. **Node.js** (v16 or higher)
2. **Git** installed
3. **Vercel account** (free at [vercel.com](https://vercel.com))
4. **GitHub account** (to connect with Vercel)

## 🔧 Local Setup

### 1. Install Dependencies

```bash
# Install root dependencies
npm install

# Install server dependencies
cd server
npm install

# Install client dependencies
cd ../client
npm install
```

### 2. Environment Setup

Create a `.env` file in the `server` folder:

```env
PORT=5000
NODE_ENV=development
JWT_SECRET=your-super-secret-jwt-key-for-development-only
```

### 3. Run Locally

```bash
# From the root directory
npm run dev
```

The application will be available at:
- Frontend: http://localhost:3000
- Backend API: http://localhost:5000

## 🌐 Vercel Deployment

### 1. Prepare for Deployment

1. **Push to GitHub**: Make sure your code is pushed to a GitHub repository
2. **Environment Variables**: Note down your JWT_SECRET for production

### 2. Deploy to Vercel

1. **Go to Vercel**: Visit [vercel.com](https://vercel.com) and sign in
2. **Import Project**: Click "New Project" and import your GitHub repository
3. **Configure Build Settings**:
   - **Framework Preset**: Other
   - **Root Directory**: `./` (leave as default)
   - **Build Command**: `npm run build`
   - **Output Directory**: `client/dist`

### 3. Add Vercel KV Database

1. In your Vercel project dashboard, go to **Storage** tab
2. Click **Create Database** → **KV**
3. Name your database (e.g., `subathon-timer-kv`)
4. Choose a region close to your users
5. Click **Create**

### 4. Set Environment Variables

In your Vercel project dashboard:

1. Go to **Settings** → **Environment Variables**
2. Add the following variables:

```
NODE_ENV = production
JWT_SECRET = your-very-secure-production-jwt-secret-key
```

**Important**: 
- Use a strong, unique JWT_SECRET for production!
- Vercel KV credentials are automatically provided by Vercel

### 5. Deploy

1. Click **Deploy**
2. Wait for the build to complete
3. Your app will be available at `https://your-project-name.vercel.app`

## 🔒 Security Considerations

### Production JWT Secret

Generate a secure JWT secret for production:

```bash
# Using Node.js
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"

# Or use an online generator
# https://generate-secret.vercel.app/32
```

### Environment Variables

- ✅ **DO**: Use strong, unique secrets in production
- ❌ **DON'T**: Use the same secret as development
- ❌ **DON'T**: Commit `.env` files to version control

## 📁 Project Structure

```
twitch-subathon-timer/
├── client/                 # React frontend
│   ├── src/
│   │   ├── components/     # React components
│   │   ├── context/        # React contexts
│   │   └── ...
│   ├── package.json
│   └── vercel.json        # Vercel config for client
├── server/                # Node.js backend
│   ├── index.js           # Main server file
│   ├── package.json
│   └── .env               # Environment variables (local only)
├── vercel.json            # Main Vercel configuration
├── package.json           # Root package.json
└── README.md
```

## 🛠️ Vercel Configuration

The project includes optimized Vercel configurations:

### Root `vercel.json`
- Handles API routes (`/api/*`) → Server
- Handles static files → Client build
- Sets production environment

### Client `vercel.json`
- Optimized for Vite builds
- Sets correct output directory

## 🧪 Testing Deployment

After deployment, test these features:

1. **User Registration**: Create a new account
2. **User Login**: Sign in with existing account
3. **Timer Functionality**: Start, pause, resume, stop timer
4. **OBS Integration**: Test the `/obs` route
5. **Persistence**: Timer state should persist across sessions

## 🔧 Troubleshooting

### Common Issues

1. **Build Fails**: Check that all dependencies are installed
2. **API Not Working**: Verify environment variables are set
3. **CORS Errors**: Check that the frontend URL is in the CORS whitelist
4. **Authentication Issues**: Verify JWT_SECRET is set correctly

### Debug Commands

```bash
# Check if server is running
curl https://your-app.vercel.app/api/health

# Check build logs in Vercel dashboard
# Go to your project → Functions → View Function Logs
```

## 📞 Support

If you encounter issues:

1. Check the Vercel deployment logs
2. Verify all environment variables are set
3. Ensure your GitHub repository is up to date
4. Check that all dependencies are properly installed

## 🎉 Success!

Once deployed, your Subathon Timer will be:
- ✅ Accessible worldwide
- ✅ Automatically scaled
- ✅ Secure with JWT authentication
- ✅ Ready for OBS integration
- ✅ Persistent across sessions

**Your app URL**: `https://your-project-name.vercel.app`
**OBS URL**: `https://your-project-name.vercel.app/obs`
