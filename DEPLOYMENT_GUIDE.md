# AUEZ Global Deployment Guide

## 🚀 Ready for Global Access

Your AUEZ system is now optimized for cloud deployment and can be accessed from any device, including iPhones, even when your laptop is closed.

## 🔐 Authentication System

### Role-Based Access Control
- **Admin Credentials**: `admin/admin` → Control Panel
- **Client Credentials**: `client/client` → Dashboard  
- **Demo Credentials**: `777/123` → Golden User (Legacy)

### Role Permissions
- **Admin**: Full control panel access, PC management, financial reports
- **Client**: Personal dashboard, balance management, session control

## 🛠️ Functional Features

### ✅ All Buttons Now Working
1. **Shop System**: Purchase headphones, drinks, and accessories
2. **Call Admin**: Real-time admin notifications
3. **Tariffs**: Multiple time packages available
4. **Balance Top-up**: Add funds to account
5. **Session Management**: Start/extend gaming sessions

### 🎮 Client Dashboard Features
- Real-time balance display
- Session timer with auto-lock
- Shop purchases (headphones, drinks)
- Balance top-up functionality
- Admin call button
- Multiple time packages

### 📊 Admin Control Panel Features
- PC status monitoring
- Financial reporting
- User management
- Shift management
- System settings

## 🌐 Cloud Deployment Ready

### Environment Variables Configured
```bash
PORT=3001
JWT_SECRET=your-secret-key
DB_PATH=./auez.db
NODE_ENV=development
HOST=0.0.0.0
CORS_ORIGIN=*
```

### Production Settings
Uncomment these in `.env` for production:
```bash
NODE_ENV=production
HOST=0.0.0.0
CORS_ORIGIN=https://yourdomain.com
API_BASE_URL=https://yourapi.com
FRONTEND_URL=https://yourdomain.com
```

## 🚀 Quick Start

### Local Development
1. Run `start-global.bat`
2. Opens backend on `http://localhost:3001`
3. Opens frontend on `http://localhost:5173`
4. Use credentials above to login

### Cloud Deployment Options

#### 1. Vercel (Frontend) + Railway/Render (Backend)
```bash
# Frontend (Vercel)
vercel --prod

# Backend (Railway/Render)
git push railway main
```

#### 2. Docker Deployment
```dockerfile
# Dockerfile already configured
docker build -t auez-global .
docker run -p 3001:3001 auez-global
```

#### 3. VPS Deployment
```bash
# Install dependencies
npm install

# Set production environment
export NODE_ENV=production
export PORT=3001
export HOST=0.0.0.0

# Start with PM2
pm2 start server-pro.js --name "auez-global"
```

## 📱 iPhone Access

Once deployed to cloud:
1. Access from any browser: `https://your-domain.com`
2. Works on Safari (iPhone)
3. Responsive design optimized
4. Touch-friendly interface

## 🔧 API Endpoints

### Authentication
- `POST /api/auth/login` - Role-based login
- `GET /api/admin/panel` - Admin access (protected)
- `GET /api/client/dashboard` - Client access (protected)

### Shop & Services
- `GET /api/shop/items` - Available items
- `POST /api/shop/purchase` - Purchase items
- `GET /api/tariffs` - Time packages
- `POST /api/balance/topup` - Add funds

### Admin Functions
- `POST /api/admin/call` - Call admin
- `GET /api/finance` - Financial data
- `GET /api/pcs` - PC status

## 🗄️ Database

### SQLite Database
- Location: `./auez.db` (configurable via `DB_PATH`)
- Tables: users, transactions, pc_statuses, club_settings
- Auto-initializes on first run

### Seed Data
- Admin user: `admin/admin`
- Client user: `client/client`  
- Demo user: `777/123` (77,777 ₸ balance)
- Sample PCs and transactions

## 🔒 Security Features

### JWT Authentication
- 24-hour token expiration
- Role-based access control
- Protected admin endpoints

### CORS Configuration
- Configurable origins
- Development allows all origins
- Production restricts to domain

## 📊 Monitoring

### Health Check
- `GET /api/heartbeat` - Server status
- Real-time server monitoring
- Auto-reconnection on client

### Logging
- Request/response logging
- Error tracking
- Transaction logging

## 🚨 Troubleshooting

### Common Issues
1. **Port conflicts**: Change `PORT` in `.env`
2. **Database errors**: Check `DB_PATH` permissions
3. **CORS issues**: Update `CORS_ORIGIN` in `.env`
4. **JWT errors**: Verify `JWT_SECRET` in `.env`

### Debug Mode
```bash
# Enable debug logging
DEBUG=auez:* npm start
```

## 🎯 Next Steps

1. **Deploy to cloud** (Vercel + Railway/Render)
2. **Configure domain** and SSL
3. **Test iPhone access**
4. **Monitor performance**
5. **Scale as needed**

---

**🌍 Your AUEZ system is now GLOBAL! Ready for worldwide access.**
