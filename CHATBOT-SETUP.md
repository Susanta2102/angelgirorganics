# 🐄 Angel Organics AI Chatbot - Quick Start Guide

## ✅ What's Been Set Up

Your AI-powered chatbot is ready! It uses:
- **Groq AI** (Llama 3.3 70B) - Lightning-fast responses
- **LangChain** - Smart conversation memory
- **Flask** - Robust backend API
- **Modern UI** - Beautiful, mobile-responsive design

## 🚀 Quick Start (One Command!)

```bash
./start-chatbot.sh
```

That's it! The script will:
1. ✅ Create virtual environment (if needed)
2. ✅ Install all dependencies
3. ✅ Start backend server (port 5000)
4. ✅ Start frontend server (port 8000)
5. ✅ Open your browser to the site

## 🔗 Access Your Site

**Main Website:**
```
http://localhost:8000/index.html
```

**Test Page (Recommended first!):**
```
http://localhost:8000/test-chatbot.html
```

**Backend API Health:**
```
http://localhost:5000/api/health
```

## 🧪 Testing the Chatbot

### Method 1: Test Page (Recommended)
1. Open `http://localhost:8000/test-chatbot.html`
2. Click "Test Backend Connection"
3. Click "Test Chatbot UI"
4. Click "Open Chatbot"

### Method 2: Main Site
1. Open `http://localhost:8000/index.html`
2. Look for robot icon (🤖) in bottom-right corner
3. Click it to open chat
4. Try these questions:
   - "What is A2 milk?"
   - "Show me your prices"
   - "Health benefits of Gir cow milk"
   - "How do I order?"

## 🛠️ Manual Setup (If Script Doesn't Work)

### Terminal 1 - Backend:
```bash
cd /home/sushi/Downloads/testing
python3 -m venv venv
source venv/bin/activate
pip install flask flask-cors langchain langchain-groq python-dotenv
python chatbot-backend.py
```

### Terminal 2 - Frontend:
```bash
cd /home/sushi/Downloads/testing
python3 -m http.server 8000
```

## 📁 Important Files

- `chatbot-backend.py` - Flask + LangChain + Groq backend
- `chatbot-frontend.js` - Smart chatbot UI with fallbacks
- `chatbot.css` - Beautiful, animated styles
- `test-chatbot.html` - Testing interface
- `start-chatbot.sh` - One-command startup
- `.env` - Your Groq API key (already configured)

## 🐛 Troubleshooting

### Chatbot button not visible?
1. Open browser console (F12)
2. Check for errors
3. Verify `chatbot-frontend.js` and `chatbot.css` are loaded
4. Try the test page: `http://localhost:8000/test-chatbot.html`

### Backend not responding?
```bash
# Check if backend is running
curl http://localhost:5000/api/health

# If not, restart:
cd /home/sushi/Downloads/testing
source venv/bin/activate
python chatbot-backend.py
```

### Port already in use?
```bash
# Kill processes on ports
sudo fuser -k 5000/tcp
sudo fuser -k 8000/tcp

# Then restart
./start-chatbot.sh
```

### CORS errors?
Make sure both servers are running and you're accessing via `localhost`, not `127.0.0.1`

## 🎯 Features

✅ **AI-Powered Responses** - Groq's Llama 3.3 70B model
✅ **Conversation Memory** - Remembers chat history
✅ **Smart Fallbacks** - Works even if backend is offline
✅ **Quick Replies** - One-click common questions
✅ **Typing Indicators** - Shows when AI is thinking
✅ **Mobile Responsive** - Works perfectly on phones
✅ **Beautiful UI** - Modern, animated design
✅ **Product Knowledge** - Knows all about A2 milk, prices, health benefits

## 💡 Customization

### Change API Key:
Edit `.env` file:
```bash
GROQ_API_KEY=your_new_key_here
```

### Modify Chatbot Knowledge:
Edit `chatbot-backend.py` - Look for `SYSTEM_PROMPT` variable

### Change Styling:
Edit `chatbot.css` - Customize colors, animations, sizes

## 🌟 Pro Tips

1. **Use Test Page First** - It helps diagnose issues
2. **Check Browser Console** - Press F12 to see logs
3. **Monitor Backend Logs** - See what AI is saying in terminal
4. **Try Quick Replies** - Fastest way to test features

## 📞 Need Help?

If something isn't working:
1. Try the test page: `http://localhost:8000/test-chatbot.html`
2. Check browser console (F12) for errors
3. Check backend terminal for error messages
4. Make sure both servers are running
5. Try restarting: Press Ctrl+C, then run `./start-chatbot.sh` again

## 🎉 Success Checklist

- [ ] Ran `./start-chatbot.sh`
- [ ] Both servers started without errors
- [ ] Opened test page successfully
- [ ] Backend connection test passed
- [ ] Chatbot UI test passed
- [ ] Chatbot opens and responds
- [ ] Can see robot icon on main site
- [ ] AI responses are relevant and helpful

---

**Made with 💚 for Angel Organics** 
Bringing pure A2 Gir cow milk with AI-powered customer service! 🐄🥛
