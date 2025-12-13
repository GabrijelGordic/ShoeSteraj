# Deployment Checklist

## Backend Preparation ✅
- [ ] `requirements.txt` created with all packages
- [ ] `Procfile` created for platform detection
- [ ] `runtime.txt` created with Python version
- [ ] `config/settings.py` updated to use environment variables
- [ ] `.env.example` created with template
- [ ] `SECRET_KEY` generated and stored securely
- [ ] `DEBUG=False` for production
- [ ] `ALLOWED_HOSTS` configured
- [ ] `CORS_ALLOWED_ORIGINS` includes frontend domain
- [ ] PostgreSQL connection string ready
- [ ] Static files collection tested

## Frontend Preparation ✅
- [ ] `package.json` verified with all dependencies
- [ ] `.env.example` created
- [ ] `REACT_APP_API_URL` points to backend
- [ ] Build test: `npm run build` succeeds
- [ ] No console errors in development
- [ ] All SEO meta tags configured

## Database ✅
- [ ] PostgreSQL database created (or managed by platform)
- [ ] Migrations ready: `python manage.py migrate`
- [ ] Admin account created
- [ ] Media folder configured

## Security ✅
- [ ] Email credentials in environment variables (not hardcoded)
- [ ] Secret key changed from default
- [ ] HTTPS enabled
- [ ] CSRF protection enabled
- [ ] XSS filter enabled

## Testing Before Deploy ✅
- [ ] Backend runs locally with production settings
- [ ] Frontend builds and runs locally
- [ ] API connection works
- [ ] User authentication works
- [ ] Image uploads work
- [ ] Database migrations run successfully

## Choose Platform ⬇️
- [ ] Render (recommended for beginners)
- [ ] Railway
- [ ] DigitalOcean
- [ ] Other: _________

## Deploy Backend ⬇️
- [ ] Connect GitHub repository
- [ ] Set environment variables
- [ ] Configure build/start commands
- [ ] Deploy and test API endpoints

## Deploy Frontend ⬇️
- [ ] Update `REACT_APP_API_URL` with backend URL
- [ ] Deploy static site
- [ ] Test frontend in browser

## Post-Deploy ⬇️
- [ ] Verify both frontend and backend are running
- [ ] Test user login/registration
- [ ] Test shoe listing creation
- [ ] Test image uploads
- [ ] Check Google Search Console indexing
- [ ] Monitor error logs

## Custom Domain (Optional) ⬇️
- [ ] Purchase domain name
- [ ] Update DNS records
- [ ] Enable SSL certificate
- [ ] Test HTTPS connection

---

## Quick Command Reference

```bash
# Generate production-safe secret key
python3 -c 'from django.core.management.utils import get_random_secret_key; print(get_random_secret_key())'

# Test local production setup
DEBUG=False python manage.py collectstatic --noinput
DEBUG=False python manage.py runserver

# Build frontend for production
npm run build

# Check requirements
pip freeze > requirements.txt
```
