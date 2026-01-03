#!/bin/bash

# Angel Organics Agentic Chatbot - Setup Script

echo "🤖 Setting up Angel Organics Agentic Chatbot Backend..."
echo "=================================================="

# Check if Python 3 is installed
if ! command -v python3 &> /dev/null; then
    echo "❌ Python 3 is not installed. Please install Python 3.8 or higher."
    exit 1
fi

echo "✅ Python 3 found: $(python3 --version)"

# Create virtual environment if it doesn't exist
if [ ! -d "venv" ]; then
    echo "📦 Creating virtual environment..."
    python3 -m venv venv
else
    echo "✅ Virtual environment already exists"
fi

# Activate virtual environment
echo "🔌 Activating virtual environment..."
source venv/bin/activate

# Upgrade pip
echo "⬆️  Upgrading pip..."
pip install --upgrade pip

# Install agentic requirements
echo "📥 Installing agentic chatbot dependencies..."
pip install -r requirements_agentic.txt

# Check if .env file exists
if [ ! -f "../config/.env" ] && [ ! -f ".env" ]; then
    echo ""
    echo "⚠️  WARNING: .env file not found!"
    echo "📝 Please create a .env file with your GROQ_API_KEY"
    echo ""
    echo "Example .env file:"
    echo "GROQ_API_KEY=your_groq_api_key_here"
    echo "FLASK_ENV=development"
    echo "PORT=5000"
    echo ""
else
    echo "✅ .env file found"
fi

echo ""
echo "=================================================="
echo "✅ Setup complete!"
echo ""
echo "🚀 To start the agentic chatbot:"
echo "   1. Activate venv: source venv/bin/activate"
echo "   2. Run: python agentic_chatbot.py"
echo ""
echo "📚 Features:"
echo "   - Multi-step reasoning with LangGraph"
echo "   - Autonomous tool use (products, location, orders)"
echo "   - Memory and context management"
echo "   - Proactive suggestions"
echo "=================================================="
