#!/bin/bash

# Quick verification script for Angel Organics Chatbot

echo "🐄 Angel Organics AI Chatbot - System Check"
echo "=========================================="
echo ""

# Check files
echo "📁 Checking required files..."
files=("chatbot-backend.py" "chatbot-frontend.js" "chatbot.css" ".env" "index.html")
all_present=true

for file in "${files[@]}"; do
    if [ -f "$file" ]; then
        echo "  ✅ $file"
    else
        echo "  ❌ $file MISSING"
        all_present=false
    fi
done

echo ""

# Check virtual environment
echo "🐍 Checking Python environment..."
if [ -d "venv" ]; then
    echo "  ✅ Virtual environment exists"
    if [ -f "venv/bin/python" ]; then
        echo "  ✅ Python executable found"
    fi
else
    echo "  ⚠️  Virtual environment not found (will be created on first run)"
fi

echo ""

# Check .env
echo "🔑 Checking API key..."
if [ -f ".env" ]; then
    if grep -q "GROQ_API_KEY=" ".env"; then
        echo "  ✅ Groq API key configured"
    else
        echo "  ❌ Groq API key not found in .env"
    fi
else
    echo "  ❌ .env file missing"
fi

echo ""

# Check ports
echo "🔌 Checking ports..."
if lsof -Pi :5000 -sTCP:LISTEN -t >/dev/null 2>&1; then
    echo "  ⚠️  Port 5000 is in use (backend may already be running)"
else
    echo "  ✅ Port 5000 available"
fi

if lsof -Pi :8000 -sTCP:LISTEN -t >/dev/null 2>&1; then
    echo "  ⚠️  Port 8000 is in use (frontend may already be running)"
else
    echo "  ✅ Port 8000 available"
fi

echo ""
echo "=========================================="

if [ "$all_present" = true ]; then
    echo "✅ All required files present!"
    echo ""
    echo "🚀 Ready to start! Run:"
    echo "   ./start-chatbot.sh"
    echo ""
    echo "📖 Or read the setup guide:"
    echo "   cat CHATBOT-SETUP.md"
else
    echo "⚠️  Some files are missing. Please check the errors above."
fi

echo "=========================================="
