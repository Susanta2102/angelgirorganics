#!/bin/bash

echo "🔍 Checking Angel Organics Project Structure..."
echo ""

# Check backend
echo "📦 Backend:"
if [ -f "backend/chatbot-backend.py" ]; then
    echo "  ✅ chatbot-backend.py found"
else
    echo "  ❌ chatbot-backend.py NOT found"
fi

if [ -f "backend/requirements.txt" ]; then
    echo "  ✅ requirements.txt found"
else
    echo "  ❌ requirements.txt NOT found"
fi

if [ -f "backend/.env" ]; then
    echo "  ✅ .env found"
else
    echo "  ⚠️  .env NOT found (copy from config/.env)"
fi

# Check frontend
echo ""
echo "🎨 Frontend:"
if [ -f "frontend/index.html" ]; then
    echo "  ✅ index.html found"
else
    echo "  ❌ index.html NOT found"
fi

if [ -f "frontend/css/chatbot.css" ]; then
    echo "  ✅ CSS files in css/ folder"
else
    echo "  ❌ CSS files NOT in correct location"
fi

if [ -f "frontend/js/chatbot-frontend.js" ]; then
    echo "  ✅ JS files in js/ folder"
else
    echo "  ❌ JS files NOT in correct location"
fi

# Check config
echo ""
echo "⚙️  Configuration:"
if [ -f "config/render.yaml" ]; then
    echo "  ✅ render.yaml found"
else
    echo "  ❌ render.yaml NOT found"
fi

if [ -f "config/.env.example" ]; then
    echo "  ✅ .env.example found"
else
    echo "  ❌ .env.example NOT found"
fi

# Check assets
echo ""
echo "🖼️  Assets:"
if [ -d "assets/images" ]; then
    IMAGE_COUNT=$(ls -1 assets/images/*.{jpg,png,jpeg,avif,webp} 2>/dev/null | wc -l)
    echo "  ✅ Images folder: $IMAGE_COUNT files"
else
    echo "  ❌ Images folder NOT found"
fi

if [ -d "assets/videos" ]; then
    VIDEO_COUNT=$(ls -1 assets/videos/*.mp4 2>/dev/null | wc -l)
    echo "  ✅ Videos folder: $VIDEO_COUNT files"
else
    echo "  ❌ Videos folder NOT found"
fi

echo ""
echo "📊 Summary:"
echo "  Backend:  backend/"
echo "  Frontend: frontend/"
echo "  Assets:   assets/"
echo "  Config:   config/"
echo "  Scripts:  scripts/"
echo "  Docs:     docs/"
echo ""
echo "🚀 To run locally:"
echo "  1. cd backend"
echo "  2. source ../venv/bin/activate"
echo "  3. python3 chatbot-backend.py"
echo "  4. Open frontend/index.html in browser"
echo ""
