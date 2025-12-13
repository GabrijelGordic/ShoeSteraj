# PostgreSQL Setup Guide for ShoeSteraj

## 🎯 Database Strategy

Your app now supports:
- **Development**: SQLite (what you're using now) ✅
- **Production**: PostgreSQL (automatic on Render/Railway) ✅

---

## Option 1: Render (RECOMMENDED - No Setup Required)

When you deploy to Render, it **automatically provides a free PostgreSQL database**.

**What happens:**
1. You deploy backend to Render
2. Render creates PostgreSQL database
3. Sets `DATABASE_URL` environment variable automatically
4. Your Django app just works! ✨

**That's it.** No additional setup needed.

---

## Option 2: Railway (Also Automatic)

Same as Render - Railway auto-provisions PostgreSQL.

---

## Option 3: Test Locally with PostgreSQL

If you want to test PostgreSQL locally before deploying:

### **On Ubuntu/Debian:**
```bash
# Install PostgreSQL
sudo apt update
sudo apt install postgresql postgresql-contrib

# Start PostgreSQL service
sudo systemctl start postgresql

# Create database
sudo -u postgres psql
```

In PostgreSQL prompt:
```sql
CREATE DATABASE shoesteraj;
CREATE USER shoesteraj_user WITH PASSWORD 'your_secure_password';
ALTER ROLE shoesteraj_user SET client_encoding TO 'utf8';
ALTER ROLE shoesteraj_user SET default_transaction_isolation TO 'read committed';
ALTER ROLE shoesteraj_user SET default_transaction_deferrable TO on;
ALTER ROLE shoesteraj_user SET timezone TO 'UTC';
GRANT ALL PRIVILEGES ON DATABASE shoesteraj TO shoesteraj_user;
\q
```

### **On macOS:**
```bash
# Install with Homebrew
brew install postgresql

# Start service
brew services start postgresql

# Create database
createdb shoesteraj
createuser shoesteraj_user
psql postgres
```

In PostgreSQL prompt:
```sql
ALTER USER shoesteraj_user WITH PASSWORD 'your_secure_password';
GRANT ALL PRIVILEGES ON DATABASE shoesteraj TO shoesteraj_user;
\q
```

### **On Windows:**
1. Download PostgreSQL installer from https://www.postgresql.org/download/windows/
2. Run installer, remember the password for `postgres` user
3. Use pgAdmin (included) to create database and user

---

## 🔧 Configure Django to Use PostgreSQL

### **Create `.env` file in backend folder:**

For Render/Railway (uses `DATABASE_URL`):
```env
DEBUG=False
DATABASE_URL=postgresql://user:password@host:5432/dbname
SECRET_KEY=your-secret-key
ALLOWED_HOSTS=yourdomain.com
CORS_ALLOWED_ORIGINS=https://yourdomain.com
```

For local testing:
```env
DEBUG=True
DB_ENGINE=django.db.backends.postgresql
DB_NAME=shoesteraj
DB_USER=shoesteraj_user
DB_PASSWORD=your_secure_password
DB_HOST=localhost
DB_PORT=5432
```

### **Install PostgreSQL Python driver:**
```bash
cd backend
pip install psycopg2-binary dj-database-url
```

---

## 🚀 Migrate Your Data

### **From SQLite to PostgreSQL (Local Testing):**

```bash
# Make sure new database is created
# Keep your SQLite db.sqlite3 as backup

# Dump data from SQLite
python manage.py dumpdata > dump.json

# Switch to PostgreSQL in .env
DEBUG=True
DB_NAME=shoesteraj
DB_USER=shoesteraj_user
DB_PASSWORD=your_password
DB_HOST=localhost
DB_PORT=5432

# Run migrations on new database
python manage.py migrate

# Load data from dump
python manage.py loaddata dump.json

# Test
python manage.py runserver
```

### **Production Deployment (Automatic):**

Render/Railway automatically:
1. Creates PostgreSQL database
2. Runs migrations (from Procfile: `python manage.py migrate`)
3. Collects static files
4. Starts app ✅

---

## ✅ Testing Your PostgreSQL Setup

```bash
# Connect to your local PostgreSQL
psql -U shoesteraj_user -d shoesteraj -h localhost

# Check Django can connect
python manage.py dbshell

# Run migrations
python manage.py migrate

# Create admin user
python manage.py createsuperuser

# Start server
python manage.py runserver
```

---

## 🔐 Production Security Best Practices

### **Never commit `.env` file!**
```bash
# Add to .gitignore
echo ".env" >> .gitignore
git add .gitignore
git commit -m "Add .env to gitignore"
```

### **Use strong passwords:**
- Min 20 characters
- Mix upper/lowercase, numbers, symbols
- Use a password manager

### **Backup your database regularly:**
```bash
# PostgreSQL backup
pg_dump -U username -h host -d dbname > backup.sql

# Restore from backup
psql -U username -h host -d dbname < backup.sql
```

### **Enable SSL for database connections:**
```python
# In Django settings for production
if not DEBUG:
    DATABASES['default']['OPTIONS'] = {
        'sslmode': 'require',
    }
```

---

## 📊 Database Comparison

| Aspect | SQLite | PostgreSQL |
|--------|--------|-----------|
| **Best For** | Development | Production |
| **Concurrency** | Poor | Excellent |
| **File Size Limit** | 2GB | Unlimited |
| **Data Types** | Limited | Extensive |
| **Full-text Search** | No | Yes |
| **JSON Support** | Basic | Full |
| **Transactions** | Basic | Full ACID |
| **Connection Pooling** | No | Yes |
| **Backups** | File copy | Hot backups |

---

## 🎯 Your Deployment Flow

```
Local Dev (SQLite)
    ↓
Test with PostgreSQL (optional)
    ↓
Push to GitHub
    ↓
Deploy to Render/Railway
    ↓
PostgreSQL auto-provisioned
    ↓
Migrations run automatically
    ↓
Live! 🚀
```

---

## 🚨 Common Issues

### **"psycopg2 not found" error**
```bash
pip install psycopg2-binary
# or
pip install psycopg2
```

### **"DATABASE_URL not set" in production**
- Check Render/Railway environment variables
- Verify DATABASE_URL is added to settings

### **"Connection refused"**
- PostgreSQL service not running
- Check host/port are correct
- Firewall blocking connection

### **"role does not exist"**
- Create user in PostgreSQL first
- Grant privileges to user

---

## Next Steps

1. **For development**: Keep using SQLite (nothing changes)
2. **For production**: Deploy to Render/Railway (PostgreSQL automatic)
3. **Before deploying**: Test locally if you want (optional)

Ready to deploy? Let me know! 🚀
