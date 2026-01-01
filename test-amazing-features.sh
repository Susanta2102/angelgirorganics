#!/bin/bash

# Angel Organics Chatbot - Quick Test Script
# Tests all new amazing features

echo "🚀 Testing Angel Organics AI Chatbot Features"
echo "=============================================="
echo ""

# Check if backend is running
echo "📡 Checking backend connection..."
response=$(curl -s http://localhost:5000/api/health)

if [ $? -eq 0 ]; then
    echo "✅ Backend is running!"
    echo "$response" | python3 -m json.tool
else
    echo "❌ Backend not running. Starting backend..."
    echo ""
    echo "Please run in another terminal:"
    echo "  cd /home/sushi/Downloads/angelgirorganics"
    echo "  python3 chatbot-backend.py"
    exit 1
fi

echo ""
echo "🧪 Testing Features:"
echo ""

# Test 1: Multi-language support
echo "1️⃣ Testing Multi-language Support..."
curl -s -X POST http://localhost:5000/api/chat \
  -H "Content-Type: application/json" \
  -d '{"message": "Hello", "session_id": "test123", "language": "en"}' \
  | python3 -m json.tool

echo ""

# Test 2: Hindi language
echo "2️⃣ Testing Hindi Language..."
curl -s -X POST http://localhost:5000/api/chat \
  -H "Content-Type: application/json" \
  -d '{"message": "नमस्ते", "session_id": "test123", "language": "hi"}' \
  | python3 -m json.tool

echo ""

# Test 3: Create test order
echo "3️⃣ Testing Order Creation..."
curl -s -X POST http://localhost:5000/api/create-order \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test Customer",
    "phone": "+91 9999999999",
    "products": ["A2 Milk - 2L", "Ghee - 500g"],
    "total": 1450
  }' \
  | python3 -m json.tool > /tmp/order_response.json

ORDER_ID=$(cat /tmp/order_response.json | python3 -c "import sys, json; print(json.load(sys.stdin)['order']['order_id'])" 2>/dev/null)

if [ ! -z "$ORDER_ID" ]; then
    echo "✅ Order created: $ORDER_ID"
    echo ""
    
    # Test 4: Track order
    echo "4️⃣ Testing Order Tracking..."
    curl -s -X GET http://localhost:5000/api/order-status/$ORDER_ID \
      | python3 -m json.tool
else
    echo "⚠️  Could not extract order ID"
fi

echo ""

# Test 5: Sentiment analysis
echo "5️⃣ Testing Sentiment Analysis (Positive)..."
curl -s -X POST http://localhost:5000/api/chat \
  -H "Content-Type: application/json" \
  -d '{"message": "Your products are amazing and I love the quality!", "session_id": "test456"}' \
  | python3 -c "import sys, json; data=json.load(sys.stdin); print(f\"Sentiment: {data.get('sentiment', 'N/A')}\")"

echo ""

echo "6️⃣ Testing Sentiment Analysis (Negative)..."
curl -s -X POST http://localhost:5000/api/chat \
  -H "Content-Type: application/json" \
  -d '{"message": "I am disappointed with the delivery", "session_id": "test789"}' \
  | python3 -c "import sys, json; data=json.load(sys.stdin); print(f\"Sentiment: {data.get('sentiment', 'N/A')}\")"

echo ""

# Test 6: Chat export
echo "7️⃣ Testing Chat Export..."
curl -s -X POST http://localhost:5000/api/export-chat \
  -H "Content-Type: application/json" \
  -d '{"session_id": "test123"}' \
  | python3 -m json.tool

echo ""
echo "=============================================="
echo "✅ All API tests completed!"
echo ""
echo "🌐 Next Steps:"
echo "1. Open index.html in a browser"
echo "2. Click the chatbot icon"
echo "3. Try these features:"
echo "   - 🎤 Click microphone to speak"
echo "   - 🌐 Toggle language (EN/HI)"
echo "   - 📸 Click 'Product Gallery'"
echo "   - 🔍 Click 'Track Order' and enter: $ORDER_ID"
echo "   - 📥 Click download icon to export chat"
echo "   - 🔊 Toggle voice output"
echo ""
echo "🎉 Happy Testing!"
