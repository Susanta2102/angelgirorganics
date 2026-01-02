# ✅ Deployment Checklist for Angel Organics

## Before Deployment

- [ ] Get Groq API Key from https://console.groq.com/keys
- [ ] Push all code to GitHub repo
- [ ] Test chatbot works locally (run `python3 chatbot-backend.py`)

## Render Deployment Steps

### 1️⃣ Deploy Backend (5 minutes)
- [ ] Go to https://render.com → Sign up with GitHub
- [ ] Click "New +" → "Web Service"
- [ ] Select repo: `Susanta2102/angelgirorganics`
- [ ] Configure:
  - Name: `angelorganics-backend`
  - Runtime: `Python 3`
  - Build: `pip install -r requirements.txt`
  - Start: `gunicorn chatbot-backend:app`
  - Plan: `Free`
- [ ] Add Environment Variable:
  - Key: `GROQ_API_KEY`
  - Value: [Your actual Groq API key]
- [ ] Click "Create Web Service"
- [ ] **Wait 3-5 minutes** for deployment
- [ ] Copy backend URL (e.g., `https://angelorganics-backend.onrender.com`)
- [ ] Test: Open `https://your-backend.onrender.com/api/health`

### 2️⃣ Update Frontend Config (2 minutes)
- [ ] Open `api-config.js` in your editor
- [ ] Find line: `return 'https://angelorganics-backend.onrender.com';`
- [ ] Replace with YOUR actual backend URL from step 1
- [ ] Save and commit:
  ```bash
  git add api-config.js
  git commit -m "Update backend URL for production"
  git push origin main
  ```

### 3️⃣ Deploy Frontend (3 minutes)
- [ ] In Render, click "New +" → "Static Site"
- [ ] Select same repo: `Susanta2102/angelgirorganics`
- [ ] Configure:
  - Name: `angelorganics-frontend`
  - Build: Leave empty
  - Publish: `.` (just a dot)
- [ ] Click "Create Static Site"
- [ ] **Wait 2-3 minutes** for deployment
- [ ] Copy frontend URL

### 4️⃣ Test Everything (2 minutes)
- [ ] Open your frontend URL
- [ ] Check if website loads correctly
- [ ] Click chatbot icon (bottom right)
- [ ] Send test message: "What is A2 milk?"
- [ ] **First message takes 30-50 seconds** (cold start - normal!)
- [ ] Next messages should be instant

## 🎉 You're Live!

Your URLs:
- **Website:** `https://angelorganics-frontend.onrender.com`
- **Backend API:** `https://angelorganics-backend.onrender.com`

Share your website:
- WhatsApp status
- Instagram bio: @angelorganic_ajmer
- Google Business Profile
- Facebook page

---

## ⚠️ Important Notes

**Free Tier Behavior:**
- Backend sleeps after 15 min of no activity
- First request after sleep = 30-50 second wait (normal!)
- After wake up = instant responses
- 750 free hours/month (plenty for small business)

**If chatbot doesn't work:**
1. Check backend logs in Render dashboard
2. Verify GROQ_API_KEY is set
3. Wait 30-60 seconds for cold start
4. Check browser console (F12) for errors

---

## 📈 Upgrade Later (Optional)

When your business grows:
- Upgrade to Render paid plan ($7/month) - no cold starts
- Add custom domain (e.g., angelorganics.com)
- Enable auto-scaling for high traffic

---

Need help? Read: `DEPLOYMENT-GUIDE.md`
