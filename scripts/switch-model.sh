#!/bin/bash

# Script to switch Groq models and avoid rate limits

echo "🔧 Groq Model Switcher for Angel Organics Chatbot"
echo "=================================================="
echo ""
echo "Current model: llama-3.3-70b-versatile (⚠️ Low rate limits)"
echo ""
echo "Available models:"
echo "1) llama-3.1-8b-instant (⚡ FASTEST - 30,000 TPM - RECOMMENDED)"
echo "2) mixtral-8x7b-32768 (⚡ FAST - 5,000 TPM)"
echo "3) llama-3.3-70b-versatile (🐌 SLOW - 14,400 TPM - Current)"
echo "4) llama3-70b-8192 (Medium - 6,000 TPM)"
echo ""
read -p "Choose a model (1-4): " choice

case $choice in
    1)
        MODEL="llama-3.1-8b-instant"
        echo "✅ Switching to llama-3.1-8b-instant (Best for chatbots!)"
        ;;
    2)
        MODEL="mixtral-8x7b-32768"
        echo "✅ Switching to mixtral-8x7b-32768"
        ;;
    3)
        MODEL="llama-3.3-70b-versatile"
        echo "⚠️ Keeping llama-3.3-70b-versatile (slowest)"
        ;;
    4)
        MODEL="llama3-70b-8192"
        echo "✅ Switching to llama3-70b-8192"
        ;;
    *)
        echo "❌ Invalid choice"
        exit 1
        ;;
esac

echo ""
echo "Updating backend/chatbot_backend.py..."

# Navigate to backend directory
cd "$(dirname "$0")/../backend" || exit 1

# Create backup
cp chatbot_backend.py chatbot_backend.py.backup
echo "📁 Backup created: chatbot_backend.py.backup"

# Update the model in the file
if [[ "$OSTYPE" == "darwin"* ]]; then
    # macOS
    sed -i '' "s/model=\".*\"/model=\"$MODEL\"/" chatbot_backend.py
else
    # Linux
    sed -i "s/model=\".*\"/model=\"$MODEL\"/" chatbot_backend.py
fi

echo "✅ Model updated to: $MODEL"
echo ""
echo "🔄 Please restart your chatbot backend:"
echo "   cd backend"
echo "   python chatbot_backend.py"
echo ""
echo "Rate limit info:"
case $choice in
    1) echo "   ⚡ 30,000 tokens/min - You should have NO rate limit issues!" ;;
    2) echo "   ⚡ 5,000 tokens/min - Much better than before" ;;
    3) echo "   🐌 14,400 tokens/min - Still has rate limit issues" ;;
    4) echo "   📊 6,000 tokens/min - Moderate improvement" ;;
esac
