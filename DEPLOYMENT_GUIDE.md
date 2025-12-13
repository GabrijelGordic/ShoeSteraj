# ShoeSteraj Deployment Guide

## Quick Overview
Your app has two parts:
- **Backend**: Django REST API (Python)
- **Frontend**: React SPA (JavaScript)

Both need to be deployed separately to production.

---

## 🚀 Option 1: Deploy on Render (Recommended for Beginners)

### Step 1: Prepare Your Repository

```bash
cd /home/gabrijel/Documents/ShoeSteraj
git add .
git commit -m "Prepare for production deployment"
git push origin main
```

### Step 2: Deploy Backend to Render

1. Go to https://render.com and sign up (free tier available)
2. Click **New +** → **Web Service**
3. Connect your GitHub account and select your `ShoeSteraj` repository
4. Fill in the form:
   - **Name**: `shoesteraj-backend`
   - **Environment**: `Python 3`
   - **Build Command**: `pip install -r requirements.txt && python manage.py migrate && python manage.py collectstatic --no-input`
   - **Start Command**: `gunicorn config.wsgi:application`
5. Add Environment Variables (Settings tab):
   ```
   DEBUG=False
   SECRET_KEY=<generate-a-new-random-key-here>
   ALLOWED_HOSTS=<your-render-url>.onrender.com,yourdomain.com
   DATABASE_URL=<auto-provided-by-render>
   CORS_ALLOWED_ORIGINS=https://<your-frontend-url>,https://yourdomain.com
   EMAIL_HOST_USER=<your-gmail>
   EMAIL_HOST_PASSWORD=<your-app-password>
   ```
6. Click **Create Web Service**
7. Wait for deployment (5-10 minutes)
8. Copy your backend URL: `https://shoesteraj-backend.onrender.com`

### Step 3: Deploy Frontend to Render

1. In Render Dashboard, click **New +** → **Static Site**
2. Connect your GitHub
3. Fill in the form:
   - **Name**: `shoesteraj-frontend`
   - **Branch**: `main`
   - **Build Command**: `cd frontend && npm install && npm run build`
   - **Publish Directory**: `frontend/build`
4. Add Environment Variable:
   ```
   REACT_APP_API_URL=https://shoesteraj-backend.onrender.com
   ```
5. Click **Create Static Site**
6. Wait for deployment
7. Your app is live at: `https://shoesteraj-frontend.onrender.com`

---

## 🌐 Option 2: Deploy on Railway (Faster Alternative)

1. Go to https://railway.app and sign up
2. Create new project → Deploy from GitHub
3. Select your repository
4. Railway auto-detects Django and React
5. Add environment variables in project settings
6. Both backend and frontend deploy automatically

---

## 📱 Option 3: Deploy on DigitalOcean (More Control)

**More complex but better for long-term hosting**

1. Create a DigitalOcean droplet (Ubuntu 22.04, $5/month)
2. SSH into your server
3. Install dependencies:
   ```bash
   sudo apt update && sudo apt install python3-pip python3-venv nodejs npm postgresql nginx
   ```
4. Clone your repo and set up:
   ```bash
   git clone https://github.com/yourusername/ShoeSteraj.git
   cd ShoeSteraj/backend
   python3 -m venv venv
   source venv/bin/activate
   pip install -r requirements.txt
   python manage.py migrate
   python manage.py collectstatic --no-input
   ```
5. Configure Nginx as reverse proxy
6. Build and serve frontend with React
7. Configure SSL with Let's Encrypt

---

## 🔧 Pre-Deployment Checklist

Before deploying, ensure:

- [ ] `requirements.txt` exists in backend folder
- [ ] `.env.example` created with all required variables
- [ ] `DEBUG=False` in production
- [ ] Database configured (PostgreSQL recommended for production)
- [ ] `ALLOWED_HOSTS` includes your domain
- [ ] `CORS_ALLOWED_ORIGINS` includes frontend URL
- [ ] Frontend `.env` has correct `REACT_APP_API_URL`
- [ ] Secret key is changed from default
- [ ] All static files collected
- [ ] Media upload folder configured

---

## 🧪 Test Before Deployment

### Local Testing with Production Settings

```bash
# Backend
cd backend
export DEBUG=False
export SECRET_KEY="your-secret-key"
export ALLOWED_HOSTS="localhost"
python manage.py collectstatic --noinput
python manage.py runserver

# Frontend (in another terminal)
cd frontend
export REACT_APP_API_URL=http://localhost:8000
npm run build
npm install -g serve
serve -s build
```

---

## 🔑 Important Production Settings

### Backend (`config/settings.py`):
- ✅ `DEBUG=False`
- ✅ `ALLOWED_HOSTS` with your domain
- ✅ `SECURE_SSL_REDIRECT=True`
- ✅ PostgreSQL or other production database
- ✅ Proper `SECRET_KEY`

### Frontend (`.env`):
- ✅ `REACT_APP_API_URL=https://your-backend-domain.com`

### Database:
- ✅ Use PostgreSQL (not SQLite)
- ✅ Regular backups enabled
- ✅ Strong password

### Security:
- ✅ Enable HTTPS/SSL
- ✅ Email configured for password resets
- ✅ CORS properly restricted
- ✅ API rate limiting (optional but recommended)

---

## 📊 Post-Deployment Steps

1. **Set up monitoring**:
   - Render/Railway have built-in logs
   - Check for errors: `Settings` → `Logs`

2. **Test the live site**:
   - Visit your frontend URL
   - Try login/register
   - Create a shoe listing
   - View a listing detail

3. **Set up Google Search Console**:
   - Add your domain
   - Submit sitemap
   - Monitor indexing

4. **Configure custom domain** (optional):
   - In Render/Railway: Add Custom Domain
   - Update DNS records
   - Enable automatic SSL

---

## 🚨 Troubleshooting

### Backend won't start:
```bash
# Check logs in Render/Railway dashboard
# Look for: migration errors, missing packages, env var issues
```

### Frontend can't connect to backend:
- Check `REACT_APP_API_URL` in frontend `.env`
- Verify `CORS_ALLOWED_ORIGINS` in backend settings
- Check API is actually running (hit `/api/shoes/` in browser)

### Static files not showing:
- Run `python manage.py collectstatic`
- Configure `STATIC_ROOT` and `STATIC_URL`

### Database errors:
- Ensure PostgreSQL database is created
- Check `DATABASE_URL` env variable
- Run migrations: `python manage.py migrate`

---

## 📞 Need Help?

- **Render Docs**: https://render.com/docs
- **Django Docs**: https://docs.djangoproject.com/en/6.0/
- **React Docs**: https://react.dev/

---

## Next Steps

**Which platform would you like to deploy to?**
1. Render (easiest)
2. Railway (fastest)
3. DigitalOcean (most control)

Let me know and I'll walk you through the exact steps!
