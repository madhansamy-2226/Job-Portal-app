# 🚀 JobConnect Deployment Guide

Complete step-by-step instructions for deploying **JobConnect** to production hosting platforms.

---

## 🏗️ Deployment Overview Architecture

```
                       +-----------------------------+
                       |    Vercel / Netlify / CDN   |
                       |    (React Frontend SPA)     |
                       +--------------+--------------+
                                      |
                                      | HTTP API Requests
                                      v
                       +--------------+--------------+
                       |   Render / Railway / Heroku |
                       |   (Django REST Framework)   |
                       +--------------+--------------+
                                      |
                 +--------------------+--------------------+
                 |                                         |
                 v                                         v
+----------------+----------------+       +----------------+----------------+
|        Supabase PostgreSQL      |       |      Supabase Cloud Storage     |
|       (Production Database)     |       |       (Resume PDFs Bucket)      |
+---------------------------------+       +---------------------------------+
```

---

## 1. 🌐 Frontend Deployment (React + Vite)

### Option A: Deploy to Vercel (Recommended)
1. Push your repository to **GitHub** / **GitLab**.
2. Go to [Vercel Dashboard](https://vercel.com/new) and import the repository.
3. Set **Root Directory** to `frontend`.
4. Build Settings:
   - **Framework Preset**: `Vite`
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
5. Add Environment Variables in Vercel:
   ```env
   VITE_SUPABASE_URL=https://nrajyfgyxjfiqgxhcrul.supabase.co
   VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1...
   VITE_API_URL=https://your-backend-app.onrender.com/api
   ```
6. Click **Deploy**. Vercel will build and serve your app globally with SSL!

---

### Option B: Deploy to Netlify
1. Go to [Netlify Dashboard](https://app.netlify.com/) and click **Add new site** ➔ **Import an existing project**.
2. Select your repository and set base directory to `frontend`.
3. Build Settings:
   - **Build command**: `npm run build`
   - **Publish directory**: `frontend/dist`
4. Netlify will auto-detect `netlify.toml` for single-page application rewrites.

---

## 2. ⚙️ Backend Deployment (Django REST API)

### Option A: Deploy to Render.com (Using `render.yaml`)
1. Go to [Render Dashboard](https://dashboard.render.com/) and click **New** ➔ **Blueprint**.
2. Connect your repository. Render will automatically read `backend/render.yaml`.
3. Provide environment variables when prompted:
   - `SECRET_KEY`: (auto-generated)
   - `ALLOWED_HOSTS`: `.onrender.com`
   - `SUPABASE_URL`: `https://nrajyfgyxjfiqgxhcrul.supabase.co`
   - `SUPABASE_KEY`: `eyJhbGciOiJIUzI1...`
4. Click **Apply**. Render will automatically run `pip install`, `collectstatic`, `migrate`, and launch `gunicorn`!

---

### Option B: Deploy to Railway / Heroku
1. Create a new service on **Railway** / **Heroku** targeting the `backend/` directory.
2. The included `backend/Procfile` specifies the web execution command:
   ```
   web: gunicorn jobconnect.wsgi:application --log-file -
   ```
3. Set environment variables:
   ```env
   DJANGO_SETTINGS_MODULE=jobconnect.settings
   ALLOWED_HOSTS=*
   SUPABASE_URL=https://nrajyfgyxjfiqgxhcrul.supabase.co
   SUPABASE_KEY=eyJhbGciOiJIUzI1...
   ```

---

## 3. 🗄️ Database & Storage (Supabase Cloud)

- **Storage Bucket**: The `resumes` bucket is created in public mode on Supabase Cloud.
- **Database Connection**: PostgreSql database running on Supabase (`host: db.nrajyfgyxjfiqgxhcrul.supabase.co`).

---

## 📋 Post-Deployment Checklist
- [x] Tested production build with `npm run build` (Build code 0 clean exit).
- [x] Added `Procfile`, `render.yaml`, `vercel.json`, `netlify.toml` configuration files.
- [x] Configured WhiteNoise for static file compression (`WhiteNoiseMiddleware`).
- [x] Created `frontend/.env` and `backend/.env` with Supabase project keys.
