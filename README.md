# 🐄 Angel Organics - Premium Gir Cow Dairy Farm

A modern, professional website for Angel Organics, featuring an AI-powered chatbot to assist customers with product inquiries, orders, and farm information.

## 🌐 Live Website

**Frontend**: [https://angelgirorganics.onrender.com](https://angelgirorganics.onrender.com)  
**Backend API**: [https://angel-organics-backend.onrender.com](https://angel-organics-backend.onrender.com)

---

## ✨ Features

### 🎨 Professional Design
- Clean, modern interface with smooth animations
- Fully responsive design (mobile, tablet, desktop)
- Dark/light theme sections with gradient backgrounds
- Professional color scheme (green & gold accents)
- Optimized performance with minimal animations

### 🤖 AI Chatbot
- Powered by **Groq API** (Llama 3.3 70B model)
- Built with **LangChain** framework
- Real-time responses to customer queries
- Conversation history management
- Product information, pricing, and ordering assistance
- Farm location and contact details

### 📱 Key Sections
- **Hero Section**: Eye-catching introduction with CTA buttons
- **About Us**: Farm history and mission
- **Products**: A2 Milk, Ghee, Butter, Curd, Buttermilk
- **Benefits**: Health advantages of A2 milk
- **Gallery**: Farm and product images
- **Testimonials**: Customer reviews
- **Statistics**: Achievement counters with scroll animations
- **Contact Form**: WhatsApp integration
- **Location Map**: Embedded Google Maps

---

## 🛠️ Technology Stack

### Frontend
- **HTML5** - Semantic markup
- **CSS3** - Custom styling with gradients and animations
- **JavaScript (Vanilla)** - Interactive features
- **Bootstrap 5.3.0** - Responsive grid system
- **Font Awesome 6.4.0** - Icons
- **AOS 2.3.4** - Scroll animations
- **Google Fonts** - Poppins font family

### Backend
- **Python 3.13** - Backend runtime
- **Flask 3.0.0** - Web framework
- **Flask-CORS 4.0.0** - Cross-origin resource sharing
- **LangChain 0.3.7** - AI framework
- **LangChain-Groq 0.2.1** - Groq integration
- **Groq 0.13.0** - LLM API client
- **Gunicorn 23.0.0** - Production WSGI server

---

## 🚀 Deployment

### Hosting
- **Platform**: Render.com (Free tier)
- **Frontend**: Static Site deployment
- **Backend**: Web Service deployment
- **Auto-deploy**: Enabled on push to `main` branch

### Environment Variables (Backend)
```bash
GROQ_API_KEY=your_groq_api_key_here
```

---

## 📦 Local Development Setup

### Prerequisites
- Python 3.13+
- Git
- Virtual environment tool

### Installation

1. **Clone the repository**
```bash
git clone https://github.com/Susanta2102/angelgirorganics.git
cd angelgirorganics
```

2. **Set up Python virtual environment**
```bash
python3 -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
```

3. **Install dependencies**
```bash
pip install -r requirements.txt
```

4. **Create `.env` file**
```bash
cp .env.example .env
# Edit .env and add your GROQ_API_KEY
```

5. **Run the backend**
```bash
python chatbot-backend.py
```

6. **Run the frontend**
```bash
# In a new terminal
python3 -m http.server 8000
```

7. **Access the website**
- Frontend: http://localhost:8000/index.html
- Backend API: http://localhost:5000/api/health

---

## 📁 Project Structure

```
angelgirorganics/
├── index.html              # Main website file
├── professional-style.css  # Custom styling
├── chatbot-backend.py      # Flask backend API
├── chatbot-frontend.js     # Chatbot UI logic
├── chatbot.css            # Chatbot styling
├── api-config.js          # API endpoint configuration
├── requirements.txt       # Python dependencies
├── Procfile              # Render deployment config
├── render.yaml           # Render service configuration
├── .env.example          # Environment variables template
├── .gitignore            # Git ignore rules
├── README.md             # This file
├── *.jpg, *.png          # Product and farm images
└── setup scripts/        # Setup automation scripts
```

---

## 🔧 Configuration

### API Configuration
Edit `api-config.js` to switch between local and production:
```javascript
const API_CONFIG = {
    getApiUrl() {
        // Automatically detects localhost vs production
        const isLocal = window.location.hostname === 'localhost';
        return isLocal 
            ? 'http://localhost:5000' 
            : 'https://angel-organics-backend.onrender.com';
    }
};
```

### Chatbot Customization
Edit `chatbot-backend.py` to modify:
- System prompt and knowledge base
- LLM model (currently using `llama-3.3-70b-versatile`)
- Temperature and max tokens
- Response formatting

---

## 📊 API Endpoints

### Health Check
```
GET /api/health
Response: {"status": "healthy", "service": "Angel Organics Chatbot", ...}
```

### Chat
```
POST /api/chat
Body: {"message": "your question", "session_id": "unique_id"}
Response: {"response": "AI response", "session_id": "..."}
```

### Clear History
```
POST /api/clear-history
Body: {"session_id": "unique_id"}
Response: {"status": "success"}
```

---

## 🎯 Product Information

### Our Products
- **Fresh Gir Cow A2 Milk**: ₹75/liter
- **Golden A2 Ghee**: ₹2500/kg or ₹1300/500g
- **Fresh Butter**: ₹1200/kg
- **Probiotic Buttermilk**: ₹30/liter
- **Thick Curd**: ₹100/kg

### Contact
- **Phone**: +91 8811013758
- **Email**: angelgirorganics@gmail.com
- **Location**: Ajmer, Rajasthan, India

---

## 🤝 Contributing

This is a private commercial project. For inquiries, contact the owner.

---

## 📄 License

Copyright © 2025 Angel Organics. All rights reserved.

---

## 🙏 Acknowledgments

- **Groq** - For providing fast LLM inference
- **LangChain** - For the AI framework
- **Render** - For free hosting
- **Bootstrap** - For responsive design
- **Font Awesome** - For beautiful icons


---

## 🔄 Version History

### v1.0.0 (November 2025)
- ✅ Initial release
- ✅ Professional website design
- ✅ AI chatbot integration
- ✅ Deployed to production
- ✅ Full mobile responsiveness
- ✅ WhatsApp integration
- ✅ Google Maps integration

---

**Built with ❤️ for Angel Organics - Pure, Natural, Healthy**
