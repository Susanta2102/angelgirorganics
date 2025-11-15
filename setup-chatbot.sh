#!/bin/bash

# Angel Organics AI Chatbot Setup Script
echo "🐄 Angel Organics AI Chatbot Setup"
echo "=================================="
echo ""

# Check Python version
echo "📌 Checking Python version..."
python3 --version

# Create virtual environment
echo ""
echo "📦 Creating virtual environment..."
python3 -m venv venv

# Activate virtual environment
echo ""
echo "🔄 Activating virtual environment..."
source venv/bin/activate

# Upgrade pip
echo ""
echo "⬆️  Upgrading pip..."
pip install --upgrade pip

# Install requirements
echo ""
echo "📥 Installing required packages..."
pip install -r requirements.txt

# Create .env file
echo ""
echo "🔐 Creating .env file..."
echo "⚠️  IMPORTANT: Add your Groq API key to .env file!"
cat > .env << EOL
# Groq API Configuration
GROQ_API_KEY=your_groq_api_key_here

# Flask Configuration
FLASK_APP=chatbot-backend.py
FLASK_ENV=development
FLASK_DEBUG=1

# Server Configuration
HOST=0.0.0.0
PORT=5000
EOL

echo ""
echo "⚠️  NEXT STEP: Edit .env file and add your Groq API key"
echo "   Get your key from: https://console.groq.com/keys"

echo ""
echo "✅ Setup complete!"
echo ""
echo "🚀 To start the chatbot backend:"
echo "   1. Activate virtual environment: source venv/bin/activate"
echo "   2. Run the server: python chatbot-backend.py"
echo ""
echo "🌐 Then open index.html in your browser"
echo ""
echo "📞 Contact: +91 8811013758"
