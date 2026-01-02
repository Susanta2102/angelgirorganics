# 🚀 Deploy Angel Organics Website to Render (Free)

## ✅ Prerequisites
- GitHub account
- Groq API key (from https://console.groq.com)
- Your code pushed to GitHub repo: Susanta2102/angelgirorganics

---

## 📦 Step 1: Push Code to GitHub

```bash
cd /home/sushi/Downloads/testing

# Initialize git (if not already done)
git init
git add .
git commit -m "Prepare for deployment"

# Push to your existing repo
git push origin main
```

---

## 🌐 Step 2: Deploy Backend (Python Chatbot)

### 2.1 Create Render Account
1. Go to https://render.com
2. Click **"Get Started for Free"**
3. Sign up with your GitHub account

### 2.2 Create Web Service for Backend
1. Click **"New +"** → **"Web Service"**
2. Connect your GitHub repo: `Susanta2102/angelgirorganics`
3. Configure:
   - **Name:** `angelorganics-backend`
   - **Region:** Singapore (closest to India)
   - **Branch:** `main`
   - **Root Directory:** Leave empty
   - **Runtime:** `Python 3`
   - **Build Command:** `pip install -r requirements.txt`
   - **Start Command:** `gunicorn chatbot-backend:app`
   - **Instance Type:** `Free`

4. **Add Environment Variable:**
   - Click **"Advanced"** → **"Add Environment Variable"**
   - Key: `GROQ_API_KEY`
   - Value: [Your Groq API key]
   - Click **"Add"**

5. Click **"Create Web Service"**

6. **Wait 3-5 minutes** for deployment
7. Copy your backend URL (e.g., `https://angelorganics-backend.onrender.com`)

---

## 🎨 Step 3: Deploy Frontend (Website)

### 3.1 Create Static Site
1. Click **"New +"** → **"Static Site"**
2. Connect same GitHub repo: `Susanta2102/angelgirorganics`
3. Configure:
   - **Name:** `angelorganics-frontend`
   - **Branch:** `main`
   - **Root Directory:** Leave empty
   - **Build Command:** Leave empty (or `echo "No build"`)
   - **Publish Directory:** `.` (current directory)

4. Click **"Create Static Site"**

5. **Wait 2-3 minutes** for deployment
6. Your site will be live at: `https://angelorganics-frontend.onrender.com`

---

## 🔗 Step 4: Update Chatbot to Use Backend URL

Your chatbot frontend needs to point to the backend URL.

**Find this in your HTML/JS files and update:**

```javascript
// OLD (local)
const API_URL = 'http://localhost:5000';

// NEW (deployed backend)
const API_URL = 'https://angelorganics-backend.onrender.com';
```

Then push the change:
```bash
git add .
git commit -m "Update backend URL for production"
git push origin main
```

Render will auto-deploy the update!

---

## ✅ Step 5: Test Your Deployed Site

1. Open: `https://angelorganics-frontend.onrender.com`
2. Test the chatbot - ask: "What is A2 milk?"
3. Verify it responds correctly

---

## 🎯 Important Notes

### Free Tier Limitations:
- Backend **sleeps after 15 minutes** of inactivity
- First request after sleep takes **30-50 seconds** (cold start)
- 750 free hours/month (enough for most sites)

### Custom Domain (Optional):
1. Go to your Static Site settings
2. Click **"Custom Domain"**
3. Add: `angelorganics.com` (or your domain)
4. Update DNS records as instructed

---

## 🐛 Troubleshooting

### Backend not responding?
- Check Render logs: Dashboard → Service → Logs
- Verify `GROQ_API_KEY` is set correctly
- Wait 30s after first request (cold start)

### Frontend shows old version?
- Hard refresh: `Ctrl + Shift + F5`
- Check Render deploy logs
- Verify GitHub push was successful

### CORS errors?
- Check `flask-cors` is installed
- Verify backend URL is correct in frontend code

---

## 📞 Your Live URLs

After deployment, you'll have:

- **Website:** `https://angelorganics-frontend.onrender.com`
- **Backend API:** `https://angelorganics-backend.onrender.com/api/health`
- **GitHub Repo:** `https://github.com/Susanta2102/angelgirorganics`

---

## 🎉 Done!

Your website with working chatbot is now live and free forever!

**Share your site:**
- Website URL
- WhatsApp
- Instagram bio
- Google Business Profile

---

Need help? Check:
- Render Docs: https://render.com/docs
- Render Community: https://community.render.com
