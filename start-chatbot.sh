#!/bin/bash

# Angel Organics AI Chatbot Startup Script
# This script starts both backend and frontend servers

echo "============================================================"
echo "🐄 Angel Organics AI Chatbot - Startup Script"
echo "============================================================"
echo ""

# Change to script directory
cd "$(dirname "$0")"

# Check if virtual environment exists
if [ ! -d "venv" ]; then
    echo "⚠️  Virtual environment not found!"
    echo "📦 Creating virtual environment..."
    python3 -m venv venv
    
    if [ $? -ne 0 ]; then
        echo "❌ Failed to create virtual environment"
        echo "   Install it with: sudo apt install python3-venv"
        exit 1
    fi
    
    echo "✅ Virtual environment created"
fi

# Activate virtual environment
echo "🔧 Activating virtual environment..."
source venv/bin/activate

# Check if dependencies are installed
if ! python -c "import flask" 2>/dev/null; then
    echo "📥 Installing dependencies..."
    pip install flask flask-cors langchain langchain-groq python-dotenv
    
    if [ $? -ne 0 ]; then
        echo "❌ Failed to install dependencies"
        exit 1
    fi
    
    echo "✅ Dependencies installed"
fi

# Check if .env file exists
if [ ! -f ".env" ]; then
    echo "❌ .env file not found!"
    echo "� Please create .env file with your Groq API key"
    echo "   Example: GROQ_API_KEY=your_key_here"
    echo "   Get key from: https://console.groq.com/keys"
    exit 1
fi

# Check if backend file exists
if [ ! -f "chatbot-backend.py" ]; then
    echo "❌ chatbot-backend.py not found!"
    exit 1
fi

echo ""
echo "============================================================"
echo "🚀 Starting servers..."
echo "============================================================"
echo ""

# Start backend in background
echo "🔧 Starting backend server (Flask + LangChain + Groq)..."
python chatbot-backend.py &
BACKEND_PID=$!

# Wait for backend to start
echo "⏳ Waiting for backend to initialize..."
sleep 3

# Check if backend is running
if ! ps -p $BACKEND_PID > /dev/null 2>&1; then
    echo "❌ Backend failed to start"
    exit 1
fi

echo "✅ Backend running (PID: $BACKEND_PID)"
echo ""

# Start frontend
echo "🌐 Starting frontend server (HTTP Server)..."
echo ""
echo "============================================================"
echo "✅ Servers are running!"
echo "============================================================"
echo ""
echo "🔗 Access your website:"
echo "   Main Site: http://localhost:8000/index.html"
echo "   Test Page: http://localhost:8000/test-chatbot.html"
echo ""
echo "🤖 Backend API:"
echo "   Health: http://localhost:5000/api/health"
echo "   Chat: http://localhost:5000/api/chat"
echo ""
echo "============================================================"
echo "📝 Tips:"
echo "   - Click the robot icon in bottom-right to open chatbot"
echo "   - Visit test page to verify everything works"
echo "   - Press Ctrl+C to stop all servers"
echo "============================================================"
echo ""

# Cleanup function
cleanup() {
    echo ""
    echo "🛑 Stopping servers..."
    kill $BACKEND_PID 2>/dev/null
    echo "✅ Servers stopped"
    exit 0
}

# Trap Ctrl+C
trap cleanup INT TERM

# Start frontend server
python3 -m http.server 8000
