# 🐄 Angel Organics - Premium Gir Cow Dairy Farm

<div align="center">

![Angel Organics Banner](https://img.shields.io/badge/Angel-Organics-green?style=for-the-badge&logo=leaf)
![AI Powered](https://img.shields.io/badge/AI-Powered-blue?style=for-the-badge&logo=robot)
![LangGraph](https://img.shields.io/badge/LangGraph-Agentic_AI-purple?style=for-the-badge)
![100% Organic](https://img.shields.io/badge/100%25-Organic-success?style=for-the-badge)

**Premium A2 Milk & Organic Dairy Products from Ajmer, Rajasthan**

**Powered by Advanced Agentic AI with LangGraph + Groq Llama-3.3-70B**

[🌐 Live Website](https://angelgirorganics.onrender.com) | [📱 Instagram](https://instagram.com/angelorganic_ajmer) | [📞 +91 8811013758](#contact)

</div>

---

## 📖 About Angel Organics

Angel Organics is a **premium Gir cow dairy farm** located in **Ajmer, Rajasthan**, dedicated to providing 100% organic, chemical-free dairy products. Under the expert supervision of **Dr. Sunil K Rai** (Veterinary Surgeon with 20+ years experience), we maintain a herd of **20 pure Gir cows**, producing **100 liters of fresh A2 milk daily** using traditional Vedic farming methods.

### 🌟 What Makes Us Special

- ✅ **Pure A2 Milk** - Easy to digest, rich in nutrients, lactose-friendly
- ✅ **100% Organic** - Zero chemicals, hormones, or preservatives
- ✅ **Traditional Methods** - Bilona ghee, hand-churned butter
- ✅ **Expert Care** - Supervised by Dr. Sunil K Rai (BVSc & AH)
- ✅ **Same-Day Delivery** - Fresh products delivered within 6 hours of milking
- ✅ **Ethical Farming** - Humane treatment, free-grazing cows
- ✅ **Farm Visits Welcome** - See our operations (7-9 AM best time)

---

## 🥛 Our Products

| Product | Price | Features |
|---------|-------|----------|
| **🥛 Fresh Gir Cow A2 Milk** | ₹75/liter | Delivered within 6 hours, pure & organic |
| **✨ Golden A2 Ghee** | ₹2,500/kg or ₹1,300/500g | Traditional bilona method, hand-churned |
| **🧈 Fresh Butter** | ₹1,200/kg | No preservatives, rich flavor |
| **🥛 Probiotic Buttermilk** | ₹30/liter | Aids digestion, summer coolant |
| **🍯 Thick Curd** | ₹100/kg | Live cultures, protein-rich |

### 🎁 Special Offers
- 🎯 **5% bulk discount** on orders ≥ ₹2,000
- 🚚 **FREE delivery** across Ajmer city
- ⏰ **Morning delivery** (7-10 AM) & **Evening delivery** (5-8 PM)
- 🎁 **First order special:** FREE 50g ghee sample + recipe booklet

---

## 🤖 Revolutionary Agentic AI Chatbot

Our website features a **state-of-the-art Agentic AI Chatbot** built with cutting-edge technology that can **autonomously reason, plan, and take actions** to help customers.

### 🧠 Technology Stack

#### **Backend (Agentic AI)**
- **🔗 LangGraph** - Advanced agentic workflow framework
- **🚀 Groq API** - Lightning-fast LLM inference (Llama-3.3-70B-Versatile)
- **🐍 Python + Flask** - RESTful API backend
- **💾 MemorySaver** - Persistent conversation memory across sessions
- **🛠️ Tool Binding** - 7 autonomous tools for intelligent actions

#### **Frontend**
- **⚡ Vanilla JavaScript** - Fast, lightweight, no frameworks
- **🎨 Modern CSS3** - Gradient effects, animations, glassmorphism
- **📱 Responsive Design** - Mobile-first, works on all devices
- **🗣️ Web Speech API** - Voice input/output support
- **🌐 Multi-language** - English/Hindi support

### ✨ Agentic AI Features

#### **🎯 Autonomous Intelligence**
The chatbot can **think, plan, and act** independently to solve customer needs:

1. **🧠 Reasoning & Planning**
   - Understands customer intent beyond keywords
   - Plans multi-step solutions autonomously
   - Adapts responses based on conversation context

2. **🛠️ 7 Autonomous Tools**
   - `get_product_info` - Detailed product information with pricing
   - `get_farm_location` - Interactive map with directions
   - `calculate_order_total` - Bill calculation with discounts
   - `get_health_benefits` - A2 milk health advantages
   - `create_whatsapp_order` - Direct WhatsApp order generation
   - `show_gallery` - Farm photos and product gallery
   - `show_all_products` - Complete product catalog

3. **💬 Conversational Memory**
   - Remembers entire conversation history
   - Understands context from previous messages
   - Provides personalized recommendations

4. **🎭 Intelligent Actions**
   - Automatically scrolls to relevant page sections
   - Opens interactive maps and galleries
   - Generates WhatsApp orders with formatted bills
   - Provides location sharing and directions

#### **🎤 Voice & Language**
- **Voice Input** - Speak your questions naturally
- **Voice Output** - Hear responses read aloud
- **Bilingual** - Switch between English (🇬🇧) and Hindi (🇮🇳)
- **Smart TTS** - Emoji-free speech for clarity

#### **📄 Export & Sharing**
- **PDF Export** - Download professional chat transcripts
- **JSON Export** - Save conversation data
- **Professional Layout** - Branded PDF with timestamps
- **Contact Info** - All details included in exports

#### **🎨 User Experience**
- **Real-time Typing** - See AI thinking
- **Action Buttons** - Quick access to common tasks
- **Smooth Animations** - Premium feel
- **Dark/Light Compatible** - Works in any theme

### 🔧 How the Agentic System Works

```
User Query → LangGraph Agent → Reasoning Engine
                 ↓
         Tool Selection & Execution
                 ↓
    [7 Specialized Tools Available]
                 ↓
         Action Synthesis → Response
                 ↓
    Frontend Receives Action Data
                 ↓
   Execute Action (scroll/open/share)
                 ↓
         Display to User
```

**Example Flow:**
1. User: "Show me your farm location"
2. Agent **reasons**: Need to share location
3. Agent **calls tool**: `get_farm_location()`
4. Tool **returns**: Map embed + buttons + directions
5. Agent **responds**: Conversationally with action data
6. Frontend **executes**: Opens interactive map, adds share buttons
7. User **sees**: Beautiful map with Get Directions button

---

## 🏗️ Project Structure

```
angelgirorganics/
├── 📁 backend/                    # Agentic AI Backend
│   ├── chatbot_backend.py         # Main LangGraph agent (ACTIVE)
│   ├── agentic_chatbot.py         # Development version
│   ├── chatbot.py                 # Legacy simple chatbot
│   ├── requirements.txt           # Python dependencies
│   ├── requirements_agentic.txt   # LangGraph-specific packages
│   ├── setup_agentic.sh           # Quick setup script
│   ├── Procfile                   # Render deployment config
│   └── .env                       # API keys (GROQ_API_KEY)
│
├── 📁 frontend/                   # Website Frontend
│   ├── index.html                 # Main website (4600+ lines)
│   ├── test-chatbot.html          # Chatbot testing page
│   ├── test-buttons.html          # Button testing page
│   │
│   ├── 📁 css/                    # Stylesheets
│   │   ├── style.css              # Main website styles
│   │   ├── chatbot.css            # Chatbot UI styles
│   │   ├── professional-style.css # Premium design system
│   │   └── premium-effects.css    # Advanced animations
│   │
│   └── 📁 js/                     # JavaScript
│       ├── script.js              # Website interactions
│       ├── chatbot-frontend.js    # Chatbot UI logic (v2.4)
│       ├── api-config.js          # API endpoint configuration
│       ├── enhance.js             # UI enhancements
│       └── premium-effects.js     # Advanced effects
│
├── 📁 config/                     # Configuration Files
│   ├── .env                       # Environment variables
│   └── render.yaml                # Render platform config
│
├── 📁 docs/                       # Documentation
│   ├── CHATBOT_FEATURES.md        # Chatbot capabilities
│   ├── DEPLOYMENT-GUIDE.md        # Deployment instructions
│   ├── CHATBOT-SETUP.md           # Setup guide
│   └── README_CHATBOT.md          # Chatbot documentation
│
├── 📁 scripts/                    # Utility Scripts
│   ├── setup-chatbot.sh           # Chatbot setup
│   ├── start-chatbot.sh           # Start backend server
│   ├── check-chatbot.sh           # Health check
│   └── qr.py                      # QR code generator
│
├── 📁 assets/                     # Media Assets
│   ├── 📁 images/                 # Product images
│   └── 📁 videos/                 # Farm videos
│
├── 📁 posters/                    # LaTeX Posters
│   ├── angel_organics_poster.tex
│   └── angel_organics_poster_hindi.tex
│
├── .python-version                # Python 3.11.9 (for Render)
├── runtime.txt                    # Python version specification
├── render.yaml                    # Render deployment config
├── requirements.txt               # Root dependencies
└── README.md                      # This file
```

---

## 🚀 Getting Started

### Prerequisites

- **Python 3.11+** (3.11.9 recommended for deployment)
- **Node.js** (optional, for development tools)
- **Groq API Key** ([Get free key](https://console.groq.com))

### 🔧 Local Development Setup

#### 1️⃣ Clone the Repository
```bash
git clone https://github.com/Susanta2102/angelgirorganics.git
cd angelgirorganics
```

#### 2️⃣ Backend Setup (Agentic AI)
```bash
cd backend

# Create virtual environment
python3 -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Create .env file
echo "GROQ_API_KEY=your_groq_api_key_here" > .env

# Start the backend server
python chatbot_backend.py
```

Server will start at `http://localhost:5000`

#### 3️⃣ Frontend Setup
```bash
cd ../frontend

# Open in browser (choose one method)
# Method 1: Python Simple Server
python3 -m http.server 8000

# Method 2: Node.js
npx http-server -p 8000

# Method 3: VS Code Live Server extension
# Right-click index.html → "Open with Live Server"
```

Website will open at `http://localhost:8000`

#### 4️⃣ Test the Chatbot
1. Open `http://localhost:8000`
2. Click the chatbot icon (💬) in bottom-right
3. Try: "Show me products", "Farm location", "Health benefits"

---

## 🌐 Deployment (Render Platform)

This project is deployed on **Render** with two separate services for optimal performance.

### 📋 Deployment Architecture

```
GitHub Repository (main branch)
         ↓
    ┌────┴────┐
    ↓         ↓
Backend     Frontend
Service     Service
    ↓         ↓
Python      Static
Flask       HTML/CSS/JS
    ↓         ↓
API         Website
(:5000)     (served)
```

### 🔧 Backend Service (Python)

**Service Name:** `angelorganics-backend`  
**Type:** Web Service  
**Runtime:** Python 3.11.9  
**Build Command:** `pip install -r requirements.txt`  
**Start Command:** `cd backend && gunicorn chatbot_backend:app --bind 0.0.0.0:$PORT --workers 2 --timeout 120`

**Environment Variables:**
```
GROQ_API_KEY=<your_groq_api_key>
```

**URL:** `https://angel-organics-backend.onrender.com`

### 🌐 Frontend Service (Static Site)

**Service Name:** `angelorganics-frontend`  
**Type:** Static Site  
**Publish Directory:** `frontend`  
**Build Command:** (none - static files)

**URL:** `https://angelgirorganics.onrender.com`

### 🚀 Deployment Steps

1. **Fork/Clone this repository**
2. **Get Groq API Key** from https://console.groq.com
3. **Create Backend Service on Render:**
   - Connect GitHub repo
   - Set Runtime: Python
   - Root Directory: Leave blank
   - Build Command: `pip install -r backend/requirements.txt`
   - Start Command: `cd backend && gunicorn chatbot_backend:app --bind 0.0.0.0:$PORT --workers 2 --timeout 120`
   - Add Environment Variable: `GROQ_API_KEY`
   
4. **Create Frontend Service on Render:**
   - Connect same GitHub repo
   - Set Type: Static Site
   - Publish Directory: `frontend`
   - Build Command: Leave empty
   
5. **Update Frontend API Config:**
   - Edit `frontend/js/api-config.js`
   - Set backend URL: `https://angel-organics-backend.onrender.com`

6. **Deploy!** 🎉

### 🔍 Monitoring & Debugging

Check backend logs:
```bash
# View real-time logs on Render dashboard
# Or use Render CLI:
render logs -t angelorganics-backend
```

Test API endpoint:
```bash
curl https://angel-organics-backend.onrender.com/api/health
```

---

## 📦 Key Dependencies

### Backend (Python)
```txt
flask==3.0.0              # Web framework
flask-cors==4.0.0         # CORS support
gunicorn==23.0.0          # Production server
langgraph==0.2.45         # Agentic AI framework
langchain==0.3.7          # LLM orchestration
langchain-groq==0.2.1     # Groq integration
langchain-core==0.3.21    # Core abstractions
groq==0.13.0              # Groq API client
pydantic==2.10.5          # Data validation
python-dotenv==1.0.0      # Environment variables
httpx==0.27.2             # Async HTTP client
```

### Frontend (JavaScript)
- **Vanilla JavaScript** - No frameworks, pure performance
- **Web Speech API** - Voice input/output
- **Fetch API** - HTTP requests to backend
- **CSS3** - Modern styling with gradients & animations

---

## 🎯 Features Showcase

### 1️⃣ Interactive Google Map
- **Location:** Angel Farm House, Arjunpura Jageer, Ajmer
- **Features:**
  - Full embedded Google Maps
  - Get Directions button
  - Share Location functionality
  - Copy location link
  - Visible on website homepage

### 2️⃣ Bill Calculator
- Add products with quantities
- Automatic 5% discount on ₹2000+
- FREE delivery included
- Export to PDF
- Send via WhatsApp

### 3️⃣ AI Chatbot Actions
```javascript
// Example: Show farm location
User: "show me location"
  ↓
Agent calls: get_farm_location()
  ↓
Returns: {
  action: "show_location",
  buttons: [
    { text: "🗺️ View on Map", action: "scroll_to_map" },
    { text: "📍 Get Directions", action: "open_directions" },
    { text: "📤 Share Location", action: "share_location" }
  ]
}
  ↓
Frontend: Scrolls to map section + adds interactive buttons
```

### 4️⃣ WhatsApp Integration
- Direct order placement
- Formatted order messages
- Bill details included
- One-click to WhatsApp

### 5️⃣ Product Gallery
- 37 high-quality images
- Farm photos
- Gir cow images
- Product showcases
- Lightbox view

---

## 🧪 Testing

### Backend API Tests
```bash
cd backend

# Test health endpoint
curl http://localhost:5000/api/health

# Test chat endpoint
curl -X POST http://localhost:5000/api/chat \
  -H "Content-Type: application/json" \
  -d '{"message": "show products", "session_id": "test123"}'
```

### Frontend Tests
1. Open `frontend/test-chatbot.html` for chatbot testing
2. Open `frontend/test-buttons.html` for action button testing
3. Use browser dev tools for debugging

### Chatbot Test Queries
Try these to test all features:
- ✅ "show me products"
- ✅ "farm location"
- ✅ "health benefits of a2 milk"
- ✅ "calculate bill for 2L milk and 500g ghee"
- ✅ "show photos"
- ✅ "how to order"
- ✅ "price list"

---

## 🤝 Contributing

We welcome contributions! Here's how:

1. **Fork the repository**
2. **Create a feature branch:** `git checkout -b feature/AmazingFeature`
3. **Commit changes:** `git commit -m 'Add AmazingFeature'`
4. **Push to branch:** `git push origin feature/AmazingFeature`
5. **Open Pull Request**

### Development Guidelines
- Follow existing code style
- Add comments for complex logic
- Test before submitting PR
- Update documentation if needed

---

## 📄 License

This project is **proprietary software** owned by Angel Organics.  
© 2024-2026 Angel Organics. All rights reserved.

---

## 📞 Contact & Support

### 🏢 Business Inquiries
- **Phone/WhatsApp:** +91 8811013758
- **Email:** drsunilkrai1975@gmail.com
- **Instagram:** [@angelorganic_ajmer](https://instagram.com/angelorganic_ajmer)

### 📍 Visit Our Farm
**Angel Farm House**  
Arjunpura Jageer, Ajmer  
Rajasthan 305203, India

**Best Visiting Time:** 7-9 AM (Milking time)  
**Directions:** [Google Maps](https://maps.app.goo.gl/293WBoybHLjSEcer7)

### 👨‍💻 Technical Support
For technical issues or chatbot queries:
- Open an issue on GitHub
- Contact via email with "[TECH]" in subject

---

## 🙏 Acknowledgments

- **Groq** - For blazing-fast LLM inference
- **LangChain & LangGraph** - For agentic AI framework
- **Render** - For reliable cloud hosting
- **Bootstrap** - For UI components
- **Font Awesome** - For beautiful icons

---

## 🎓 Learn More

### Documentation
- 📖 [Chatbot Features Guide](docs/CHATBOT_FEATURES.md)
- 🚀 [Deployment Guide](docs/DEPLOYMENT-GUIDE.md)
- ⚙️ [Setup Instructions](docs/CHATBOT-SETUP.md)
- 📚 [API Documentation](docs/README_CHATBOT.md)

### Related Technologies
- [LangGraph Documentation](https://langchain-ai.github.io/langgraph/)
- [Groq API](https://console.groq.com/docs)
- [LangChain Guide](https://python.langchain.com/docs/get_started/introduction)

---

<div align="center">

### ⭐ Star this repo if you found it helpful!

**Built with ❤️ by Angel Organics Team**

*Delivering Pure A2 Milk & Organic Products with AI-Powered Customer Experience*

[🏠 Visit Website](https://angelgirorganics.onrender.com) | [📱 Follow on Instagram](https://instagram.com/angelorganic_ajmer) | [📞 Call Us](tel:+918811013758)

---

**Made in India 🇮🇳 | Powered by Agentic AI 🤖 | 100% Organic 🌿**

</div>
│
├── 📁 assets/              # Media files
│   ├── 📁 images/          # Product & farm photos (37 images)
│   └── 📁 videos/          # Farm videos (2 videos)
│
├── 📁 config/              # Configuration files
│   ├── render.yaml         # Render deployment config
│   └── .env.example        # Environment template
│
├── 📁 docs/                # Documentation
├── 📁 scripts/             # Utility scripts
├── 📁 posters/             # LaTeX posters
└── 📁 tests/               # Test files
```

---

## 🚀 Quick Start

### Prerequisites

- Python 3.11+
- Node.js (optional, for serving frontend)
- Groq API Key ([Get one here](https://console.groq.com/keys))

### Local Development

1. **Clone the Repository**
   ```bash
   git clone https://github.com/Susanta2102/angelgirorganics.git
   cd angelgirorganics
   ```

2. **Setup Backend**
   ```bash
   cd backend
   python3 -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   pip install -r requirements.txt
   ```

3. **Configure Environment**
   ```bash
   cp ../config/.env.example .env
   # Edit .env and add your GROQ_API_KEY
   ```

4. **Start Backend Server**
   ```bash
   python3 chatbot-backend.py
   # Server runs on http://localhost:5000
   ```

5. **Open Frontend**
   ```bash
   cd ../frontend
   python3 -m http.server 8000
   # Visit http://localhost:8000
   ```

### 🌐 Deploy to Render

1. Push code to GitHub
2. Connect repository to Render
3. Add `GROQ_API_KEY` in Render dashboard (Environment Variables)
4. Deploy automatically!

---

## 🔧 Tech Stack

### Backend
- **Framework:** Flask 3.0.0
- **AI Model:** Groq Llama 3.3 70B Versatile
- **LangChain:** 0.3.7 (for conversational AI)
- **CORS:** Flask-CORS 4.0.0

### Frontend
- **HTML5** + **CSS3** + **Vanilla JavaScript**
- **Bootstrap 5.3** (UI framework)
- **Font Awesome 6.4** (icons)
- **AOS** (scroll animations)
- **Speech Recognition API** (voice input)
- **Speech Synthesis API** (voice output)

### Deployment
- **Backend:** Render (Python web service)
- **Frontend:** Render (static site)
- **Version Control:** Git + GitHub

---

## 📱 Contact & Social Media

<div align="center">

### 📞 Get in Touch

**Phone/WhatsApp:** [+91 8811013758](https://wa.me/918811013758)

**Email:** [drsunilkrai1975@gmail.com](mailto:drsunilkrai1975@gmail.com)

**Instagram:** [@angelorganic_ajmer](https://instagram.com/angelorganic_ajmer)

**Location:** Ajmer, Rajasthan, India 🇮🇳

</div>

---

## 🎯 Key Features

### Website Features
- 🎨 **Modern Responsive Design** - Works on all devices
- 🌙 **Dark Mode** - Easy on the eyes
- ⚡ **Fast Loading** - Optimized performance
- 🔍 **SEO Optimized** - Better search rankings
- 📸 **Photo Gallery** - 37+ farm & product images
- 🎥 **Video Content** - Farm tour videos
- 📱 **QR Codes** - Quick Instagram access

### AI Chatbot Capabilities
- Natural conversation in English & Hindi
- Product information & pricing
- Health benefits of A2 milk
- Order assistance & tracking
- Farm information & history
- Delivery details
- Custom product recommendations

---

## 🤝 Contributing

We welcome contributions! Here's how you can help:

1. **Fork** the repository
2. **Create** a feature branch (`git checkout -b feature/amazing-feature`)
3. **Commit** your changes (`git commit -m 'Add amazing feature'`)
4. **Push** to the branch (`git push origin feature/amazing-feature`)
5. **Open** a Pull Request

### Development Guidelines
- Follow existing code style
- Test thoroughly before submitting
- Update documentation as needed
- Keep commits clear and descriptive

---

## 📄 License

This project is licensed under the **MIT License** - see the [LICENSE](LICENSE) file for details.

---

## 🙏 Acknowledgments

- **Dr. Sunil K Rai** - Founder & Veterinary Expert
- **Susanta Baidya** - Full Stack AI Developer ([GitHub](https://github.com/Susanta2102) | [LinkedIn](https://www.linkedin.com/in/susanta-baidya-03436628a/))
- **Groq** - For providing the AI infrastructure
- **LangChain** - For conversational AI framework
- **Bootstrap** - For UI components
- **Font Awesome** - For beautiful icons

---

## 📊 Project Stats

![GitHub stars](https://img.shields.io/github/stars/Susanta2102/angelgirorganics?style=social)
![GitHub forks](https://img.shields.io/github/forks/Susanta2102/angelgirorganics?style=social)
![GitHub issues](https://img.shields.io/github/issues/Susanta2102/angelgirorganics)
![GitHub pull requests](https://img.shields.io/github/issues-pr/Susanta2102/angelgirorganics)

---

## 🔮 Future Roadmap

- [ ] Mobile app (Android & iOS)
- [ ] Online payment integration
- [ ] Subscription plans
- [ ] Product reviews & ratings
- [ ] Delivery tracking with GPS
- [ ] Recipe suggestions
- [ ] Nutritional calculator
- [ ] Loyalty rewards program

---

<div align="center">

**Made with ❤️ by [Susanta Baidya](https://github.com/Susanta2102) in Ajmer, Rajasthan**

**Pure Milk, Pure Love, Pure Life** 🐄🥛

---

[![Deploy to Render](https://img.shields.io/badge/Deploy-Render-46E3B7?style=for-the-badge&logo=render)](https://render.com)
[![Star on GitHub](https://img.shields.io/badge/Star-GitHub-yellow?style=for-the-badge&logo=github)](https://github.com/Susanta2102/angelgirorganics)

</div>
