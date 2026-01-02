#!/bin/bash

# Angel Organics AI Chatbot Setup Script
# This script sets up the chatbot environment

echo "🤖 Angel Organics AI Chatbot Setup"
echo "=================================="
echo ""

# Check Python version
echo "Checking Python version..."
python3 --version

if [ $? -ne 0 ]; then
    echo "❌ Python 3 is not installed. Please install Python 3.8 or higher."
    exit 1
fi

# Create virtual environment
echo ""
echo "Creating virtual environment..."
python3 -m venv venv

if [ $? -ne 0 ]; then
    echo "❌ Failed to create virtual environment."
    exit 1
fi

# Activate virtual environment
echo "Activating virtual environment..."
source venv/bin/activate

# Upgrade pip
echo ""
echo "Upgrading pip..."
pip install --upgrade pip

# Install requirements
echo ""
echo "Installing dependencies..."
pip install -r requirements.txt

if [ $? -ne 0 ]; then
    echo "❌ Failed to install dependencies."
    exit 1
fi

# Check if .env exists
echo ""
if [ ! -f .env ]; then
    echo "Creating .env file from template..."
    cp .env.example .env
    echo "✅ .env file created!"
    echo ""
    echo "⚠️  IMPORTANT: Edit .env file and add your OpenAI API key!"
    echo "   Run: nano .env"
    echo "   Add your key: OPENAI_API_KEY=sk-your-key-here"
else
    echo "✅ .env file already exists."
fi

# Check if OpenAI key is set
if grep -q "your_openai_api_key_here" .env 2>/dev/null; then
    echo ""
    echo "⚠️  WARNING: OpenAI API key is not set in .env file!"
    echo "   Please edit .env and add your OpenAI API key."
    echo "   The chatbot will use fallback responses without the key."
fi

echo ""
echo "=================================="
echo "✅ Setup complete!"
echo ""
echo "Next steps:"
echo "1. Get OpenAI API key from: https://platform.openai.com/api-keys"
echo "2. Edit .env file: nano .env"
echo "3. Add your API key: OPENAI_API_KEY=sk-your-key-here"
echo "4. Start the server: python chatbot.py"
echo ""
echo "To activate virtual environment in future:"
echo "  source venv/bin/activate"
echo ""
echo "Happy chatting! 🤖🐄🥛"
