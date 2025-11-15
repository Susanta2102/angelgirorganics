# Angel Organics AI Chatbot

A sophisticated AI chatbot built with **LangChain** and **Generative AI** for Angel Organics A2 Milk business.

## 🚀 Features

- **LangChain Integration**: Powered by LangChain framework for intelligent conversations
- **OpenAI GPT Integration**: Uses GPT-3.5-turbo for natural language understanding
- **Conversation Memory**: Maintains context across conversations
- **Fallback System**: Rule-based responses when API is unavailable
- **Real-time Chat**: Instant responses with typing indicators
- **Mobile Responsive**: Works perfectly on all devices
- **Quick Replies**: Pre-defined quick action buttons
- **Session Management**: Tracks individual user conversations

## 📋 Prerequisites

- Python 3.8+
- Node.js (for frontend development)
- OpenAI API Key

## 🛠️ Installation

### 1. Clone/Navigate to Directory

```bash
cd /home/sushi/Downloads/testing
```

### 2. Install Python Dependencies

```bash
pip install -r requirements.txt
```

### 3. Set Up Environment Variables

```bash
# Copy the example env file
cp .env.example .env

# Edit .env and add your OpenAI API key
nano .env
```

Add your OpenAI API key:
```
OPENAI_API_KEY=sk-your-actual-openai-api-key-here
```

### 4. Get OpenAI API Key

1. Go to [OpenAI Platform](https://platform.openai.com/api-keys)
2. Sign up or log in
3. Create a new API key
4. Copy and paste it into your `.env` file

## 🚀 Running the Chatbot

### Start the Backend Server

```bash
python chatbot.py
```

The server will start on `http://localhost:5000`

### Add to Your Website

Add these lines to your `index.html` before the closing `</body>` tag:

```html
<!-- Chatbot CSS -->
<link rel="stylesheet" href="chatbot.css">

<!-- Chatbot JavaScript -->
<script src="chatbot-frontend.js"></script>
```

## 📁 Project Structure

```
testing/
├── chatbot.py                 # Backend server (Flask + LangChain)
├── chatbot-frontend.js        # Frontend JavaScript
├── chatbot.css               # Chatbot styling
├── requirements.txt          # Python dependencies
├── .env.example             # Environment variables template
├── .env                     # Your actual environment variables (create this)
└── README_CHATBOT.md        # This file
```

## 🎯 Usage

### For Users

1. Click the chatbot button (💬) in the bottom-right corner
2. Type your question or click a quick reply button
3. Get instant AI-powered responses about:
   - Products and pricing
   - A2 milk benefits
   - Order information
   - Delivery details
   - Contact information

### For Developers

#### Backend API Endpoints

**Chat Endpoint:**
```bash
POST http://localhost:5000/api/chat
Content-Type: application/json

{
  "message": "What products do you offer?",
  "session_id": "optional-session-id"
}
```

**Response:**
```json
{
  "response": "AI-generated response...",
  "session_id": "session_xxx",
  "timestamp": "2025-11-15T10:30:00"
}
```

**Get Chat History:**
```bash
GET http://localhost:5000/api/chat/history/<session_id>
```

**Clear Chat History:**
```bash
POST http://localhost:5000/api/chat/clear/<session_id>
```

**Health Check:**
```bash
GET http://localhost:5000/health
```

## 🧠 LangChain Features

### Conversation Chain
- Maintains context across multiple messages
- Uses conversation memory to understand follow-up questions
- Implements prompt templates for consistent responses

### Business Context
The chatbot is pre-trained with Angel Organics business information:
- Products and pricing
- A2 milk health benefits
- Delivery areas and timings
- Contact information
- Owner details (Dr. Sunil K Rai)

### Fallback System
If OpenAI API is unavailable, the chatbot automatically falls back to:
- Rule-based pattern matching
- Pre-defined response templates
- Still provides helpful information

## 🎨 Customization

### Modify Business Information

Edit `BUSINESS_CONTEXT` in `chatbot.py`:

```python
BUSINESS_CONTEXT = """
Your custom business information here...
"""
```

### Change AI Model

In `chatbot.py`, modify:

```python
self.llm = ChatOpenAI(
    model="gpt-4",  # Change to gpt-4 for better responses
    temperature=0.7,
    openai_api_key=self.api_key
)
```

### Customize Styling

Edit `chatbot.css` to change colors, fonts, and layout.

### Add Quick Replies

Edit `chatbot-frontend.js`:

```javascript
const quickReplies = [
    'Your Custom Reply 1',
    'Your Custom Reply 2',
    // Add more...
];
```

## 🔧 Configuration

### Environment Variables

```env
# OpenAI Configuration
OPENAI_API_KEY=your_key_here

# Flask Configuration
FLASK_ENV=development
FLASK_DEBUG=True

# Server Configuration
HOST=0.0.0.0
PORT=5000

# Chatbot Configuration
CHATBOT_MODEL=gpt-3.5-turbo
CHATBOT_TEMPERATURE=0.7
MAX_TOKENS=500
```

### Model Parameters

- **Temperature** (0.0-1.0): Controls randomness
  - Lower = more focused and deterministic
  - Higher = more creative and random
- **Max Tokens**: Maximum length of response

## 📱 Mobile Responsiveness

The chatbot automatically adjusts for mobile devices:
- Full-screen mode on small screens
- Touch-friendly buttons
- Optimized keyboard handling

## 🐛 Troubleshooting

### API Connection Issues

**Problem:** "Error connecting to API"
**Solution:** 
- Check if backend server is running
- Verify `.env` file has correct API key
- Check internet connection

### CORS Errors

**Problem:** "CORS policy blocked"
**Solution:**
- Backend includes Flask-CORS
- If still occurring, check firewall settings

### OpenAI API Errors

**Problem:** "API key invalid"
**Solution:**
- Verify API key in `.env` file
- Check OpenAI account has credits
- Ensure key has proper permissions

## 📊 Monitoring

The chatbot logs all activities:

```bash
# View backend logs
python chatbot.py

# Check browser console for frontend logs
# Open browser DevTools (F12) > Console
```

## 🚀 Production Deployment

### 1. Use Production-Grade Server

Replace Flask development server with Gunicorn:

```bash
pip install gunicorn
gunicorn -w 4 -b 0.0.0.0:5000 chatbot:app
```

### 2. Set Up Process Manager

Use PM2 or systemd to keep server running:

```bash
pm2 start chatbot.py --interpreter python3
```

### 3. Configure HTTPS

Use nginx as reverse proxy with SSL certificate.

### 4. Environment Variables

Set production environment variables:
```bash
FLASK_ENV=production
FLASK_DEBUG=False
```

## 💡 Tips

1. **Start Small**: Test with rule-based responses before enabling AI
2. **Monitor Usage**: Track API calls to manage OpenAI costs
3. **Update Context**: Keep business information current
4. **Test Thoroughly**: Try various questions to ensure good responses
5. **User Feedback**: Add feedback buttons to improve responses

## 📈 Future Enhancements

- [ ] Voice input/output
- [ ] Multi-language support
- [ ] Analytics dashboard
- [ ] Integration with CRM
- [ ] Automated order processing
- [ ] Image recognition for product queries
- [ ] Sentiment analysis

## 🤝 Support

For technical support:
- Check documentation
- Review code comments
- Test with sample queries

## 📄 License

This chatbot is proprietary software for Angel Organics.

## 👨‍💻 Developer Notes

Built with:
- **Backend**: Flask + LangChain + OpenAI
- **Frontend**: Vanilla JavaScript (no framework dependencies)
- **Styling**: Modern CSS with animations

---

**Note**: Remember to keep your OpenAI API key secure and never commit `.env` file to version control!

## 🎉 Quick Start Checklist

- [ ] Install Python dependencies
- [ ] Create `.env` file with OpenAI API key
- [ ] Start backend server
- [ ] Add chatbot files to website
- [ ] Test basic functionality
- [ ] Customize business information
- [ ] Deploy to production

Happy chatting! 🤖🐄🥛
