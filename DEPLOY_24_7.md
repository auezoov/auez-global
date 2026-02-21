# AUEZ Global 24/7 Deployment Instructions

## Backend Deployment (Render)

1. Push your code to GitHub
2. Go to [render.com](https://render.com)
3. Sign up/login with GitHub
4. Click "New" → "Web Service"
5. Connect your GitHub repository
6. Configure:
   - **Name**: auez-backend
   - **Root Directory**: server
   - **Runtime**: Node
   - **Build Command**: npm install
   - **Start Command**: npm start
   - **Instance Type**: Free
7. Add Environment Variables:
   - `NODE_ENV`: production
   - `PORT`: 10000
   - `MONGODB_URI`: mongodb+srv://admin:183349@cluster0.xkfg5yg.mongodb.net/auezdb
8. Click "Create Web Service"

## Frontend Deployment (Vercel)

1. Go to [vercel.com](https://vercel.com)
2. Sign up/login with GitHub
3. Click "Add New" → "Project"
4. Import your GitHub repository
5. Configure:
   - **Framework Preset**: Vite
   - **Root Directory**: ./
   - **Build Command**: cd client && npm run build
   - **Output Directory**: client/dist
6. Add Environment Variables:
   - None needed (configured in vercel.json)
7. Click "Deploy"

## Post-Deployment Configuration

After both services are deployed:

1. **Get your Render backend URL** (e.g., https://auez-backend.onrender.com)
2. **Get your Vercel frontend URL** (e.g., https://auez-global.vercel.app)
3. **Test the application**:
   - Visit your Vercel URL
   - Check if API calls work
   - Test WebSocket connection

## Final URLs

- **Backend**: https://auez-backend.onrender.com
- **Frontend**: https://auez-global.vercel.app
- **API Health Check**: https://auez-backend.onrender.com/api/health

## Notes

- Backend will auto-sleep after 15 minutes of inactivity (free tier)
- First request may take up to 30 seconds to wake up
- Frontend is always available (static hosting)
- MongoDB Atlas database runs 24/7

## Troubleshooting

If API calls fail:
1. Check Render service status
2. Verify environment variables
3. Check CORS configuration
4. Test API health endpoint directly
