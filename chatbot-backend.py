
"""
Angel Organics AI Chatbot Backend
Using Groq API with LangChain Framework
"""

from flask import Flask, request, jsonify
from flask_cors import CORS
import os
from dotenv import load_dotenv
from langchain_groq import ChatGroq
from langchain_core.messages import HumanMessage, AIMessage, SystemMessage
from langchain_core.prompts import ChatPromptTemplate, MessagesPlaceholder
from langchain_core.runnables.history import RunnableWithMessageHistory
from langchain_core.chat_history import BaseChatMessageHistory
from langchain_community.chat_message_histories import ChatMessageHistory
import logging
import uuid
from datetime import datetime
import json
import re

# Load environment variables
load_dotenv()

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Initialize Flask app
app = Flask(__name__)
CORS(app)

# Groq API Configuration
GROQ_API_KEY = os.getenv('GROQ_API_KEY')

if not GROQ_API_KEY:
    raise ValueError("❌ GROQ_API_KEY not found! Please add it to your .env file")

# Initialize Groq Chat Model
llm = ChatGroq(
    api_key=GROQ_API_KEY,
    model="llama-3.3-70b-versatile",  # Using Llama 3.3 70B
    temperature=0.7,
    max_tokens=2048
)

# Store for conversation histories
store = {}

# Store for orders
orders_db = {}

# System prompt for Angel Organics chatbot
SYSTEM_PROMPT = """You are an expert AI assistant for Angel Organics, a premium Gir cow dairy farm in Ajmer, Rajasthan, India.

**Your Knowledge Base:**

**Products & Pricing:**
- Fresh Gir Cow A2 Milk: ₹75/liter (delivered within 6 hours)
- Golden A2 Ghee: ₹2500/kg or ₹1300/500g (traditional bilona method)
- Fresh Butter: ₹1200/kg (hand-churned, no preservatives)
- Probiotic Buttermilk: ₹30/liter (aids digestion)
- Thick Curd: ₹100/kg (live cultures, protein-rich)

**Key Benefits of A2 Milk:**
- Easy digestion (no bloating or gas)
- Rich in A2 protein (natural for humans)
- Boosts immunity and brain function
- Better calcium absorption
- Safe for lactose-sensitive people
- Supports heart and bone health

**Farm Information:**
- Location: Ajmer, Rajasthan
- Owner: Dr. Sunil Rai (20+ years experience)
- 20 premium Gir cows
- 100 liters daily production
- 100% organic, no chemicals or hormones
- Traditional Vedic farming methods

**Contact & Ordering:**
- Phone/WhatsApp: +91 8811013758
- Email: drsunilkrai1975@gmail.com
- Instagram: @angelorganic_ajmer
- FREE delivery across Ajmer
- 5% discount on orders ≥ ₹2000
- Same-day delivery available

**Your Personality:**
- Friendly, knowledgeable, and helpful
- Use emojis naturally (🐄🥛🌿)
- Provide clear, concise answers
- Always be honest about products
- Encourage healthy choices
- Share farm stories when relevant

**Response Guidelines:**
1. Keep answers focused and informative
2. Use bullet points for clarity
3. Mention prices when discussing products
4. Suggest contacting via WhatsApp for orders
5. Share health benefits when relevant
6. Be warm and personable

Remember: You're representing a family-run organic farm that truly cares about customer health and satisfaction."""

# Multi-language prompts
LANGUAGE_PROMPTS = {
    'en': SYSTEM_PROMPT,
    'hi': """आप एंजेल ऑर्गेनिक्स के लिए एक एआई सहायक हैं, जो अजमेर, राजस्थान में एक प्रीमियम गिर गाय डेयरी फार्म है।

**उत्पाद और मूल्य:**
- ताज़ा गिर गाय A2 दूध: ₹75/लीटर
- गोल्डन A2 घी: ₹2500/किलो या ₹1300/500 ग्राम
- ताज़ा मक्खन: ₹1200/किलो
- प्रोबायोटिक छाछ: ₹30/लीटर
- गाढ़ा दही: ₹100/किलो

**संपर्क:**
- फोन/व्हाट्सएप: +91 8811013758
- ईमेल: drsunilkrai1975@gmail.com

आप मित्रवत, ज्ञानी और सहायक हैं। ग्राहकों को स्वस्थ विकल्प चुनने के लिए प्रोत्साहित करें।"""
}

def get_session_history(session_id: str) -> BaseChatMessageHistory:
    """Get or create chat history for a session"""
    if session_id not in store:
        store[session_id] = ChatMessageHistory()
    return store[session_id]

# Create the chat prompt template
prompt = ChatPromptTemplate.from_messages([
    ("system", SYSTEM_PROMPT),
    MessagesPlaceholder(variable_name="history"),
    ("human", "{input}")
])

# Create the chain with message history
chain = prompt | llm

# Wrap chain with message history
chain_with_history = RunnableWithMessageHistory(
    chain,
    get_session_history,
    input_messages_key="input",
    history_messages_key="history"
)

def remove_emojis(text):
    """Remove emojis from text for voice output"""
    # Emoji pattern
    emoji_pattern = re.compile(
        "["
        u"\U0001F600-\U0001F64F"  # emoticons
        u"\U0001F300-\U0001F5FF"  # symbols & pictographs
        u"\U0001F680-\U0001F6FF"  # transport & map symbols
        u"\U0001F1E0-\U0001F1FF"  # flags (iOS)
        u"\U00002702-\U000027B0"
        u"\U000024C2-\U0001F251"
        u"\U0001F900-\U0001F9FF"  # supplemental symbols
        u"\U0001FA00-\U0001FA6F"  # chess symbols
        "]+", flags=re.UNICODE
    )
    return emoji_pattern.sub('', text).strip()

@app.route('/api/chat', methods=['POST'])
def chat():
    """Handle chat requests"""
    try:
        data = request.json
        message = data.get('message', '').strip()
        session_id = data.get('session_id', 'default_session')
        language = data.get('language', 'en')
        
        if not message:
            return jsonify({
                'success': False,
                'error': 'Message is required'
            }), 400
        
        logger.info(f"Received message: {message[:50]}... from session: {session_id}")
        
        # Check for order tracking
        order_info = check_order_status(message)
        if order_info:
            return jsonify({
                'success': True,
                'response': order_info,
                'session_id': session_id,
                'sentiment': analyze_sentiment(message)
            })
        
        # Use language-specific prompt if needed
        if language == 'hi':
            # Create Hindi chain
            hindi_prompt = ChatPromptTemplate.from_messages([
                ("system", LANGUAGE_PROMPTS['hi']),
                MessagesPlaceholder(variable_name="history"),
                ("human", "{input}")
            ])
            hindi_chain = hindi_prompt | llm
            hindi_chain_with_history = RunnableWithMessageHistory(
                hindi_chain,
                get_session_history,
                input_messages_key="input",
                history_messages_key="history"
            )
            response = hindi_chain_with_history.invoke(
                {"input": message},
                config={"configurable": {"session_id": session_id}}
            )
        else:
            # Get response from LangChain
            response = chain_with_history.invoke(
                {"input": message},
                config={"configurable": {"session_id": session_id}}
            )
        
        # Extract the content from the response
        response_text = response.content if hasattr(response, 'content') else str(response)
        
        # Create voice-friendly version (remove emojis)
        voice_text = remove_emojis(response_text)
        
        # Analyze sentiment
        sentiment = analyze_sentiment(message)
        
        logger.info(f"Generated response: {response_text[:100]}...")
        
        return jsonify({
            'success': True,
            'response': response_text,
            'voice_response': voice_text,  # Clean text for voice output
            'session_id': session_id,
            'sentiment': sentiment
        })
        
    except Exception as e:
        logger.error(f"Error processing request: {str(e)}", exc_info=True)
        return jsonify({
            'success': False,
            'error': f'Internal server error: {str(e)}'
        }), 500

@app.route('/api/health', methods=['GET'])
def health_check():
    """Health check endpoint"""
    return jsonify({
        'status': 'healthy',
        'service': 'Angel Organics AI Chatbot',
        'model': 'Groq Llama 3.3 70B',
        'active_sessions': len(store)
    })

@app.route('/api/clear-history', methods=['POST'])
def clear_history():
    """Clear chat history for a session"""
    try:
        data = request.json
        session_id = data.get('session_id', 'default_session')
        
        if session_id in store:
            del store[session_id]
            return jsonify({
                'success': True,
                'message': 'Chat history cleared'
            })
        else:
            return jsonify({
                'success': False,
                'message': 'Session not found'
            }), 404
            
    except Exception as e:
        logger.error(f"Error clearing history: {str(e)}")
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500

@app.route('/api/create-order', methods=['POST'])
def create_order():
    """Create a new order"""
    try:
        data = request.json
        order_id = 'AO-' + str(uuid.uuid4())[:8].upper()
        
        order = {
            'order_id': order_id,
            'customer_name': data.get('name', ''),
            'phone': data.get('phone', ''),
            'products': data.get('products', []),
            'total': data.get('total', 0),
            'status': 'pending',
            'created_at': datetime.now().isoformat(),
            'estimated_delivery': 'Tomorrow, 6-8 AM'
        }
        
        orders_db[order_id] = order
        
        return jsonify({
            'success': True,
            'order': order
        })
    except Exception as e:
        logger.error(f"Error creating order: {str(e)}")
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500

@app.route('/api/order-status/<order_id>', methods=['GET'])
def get_order_status(order_id):
    """Get order status"""
    if order_id in orders_db:
        return jsonify({
            'success': True,
            'order': orders_db[order_id]
        })
    else:
        return jsonify({
            'success': False,
            'error': 'Order not found'
        }), 404

@app.route('/api/export-chat', methods=['POST'])
def export_chat():
    """Export chat history"""
    try:
        data = request.json
        session_id = data.get('session_id', 'default_session')
        
        if session_id not in store:
            return jsonify({
                'success': False,
                'error': 'No chat history found'
            }), 404
        
        history = store[session_id]
        messages = []
        
        for msg in history.messages:
            messages.append({
                'type': msg.__class__.__name__,
                'content': msg.content,
                'timestamp': datetime.now().isoformat()
            })
        
        return jsonify({
            'success': True,
            'messages': messages,
            'session_id': session_id
        })
    except Exception as e:
        logger.error(f"Error exporting chat: {str(e)}")
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500

def check_order_status(message):
    """Check if message is asking about order status"""
    # Pattern to match order IDs
    pattern = r'AO-[A-Z0-9]{8}'
    match = re.search(pattern, message)
    
    if match:
        order_id = match.group(0)
        if order_id in orders_db:
            order = orders_db[order_id]
            return f"""📦 **Order Status for {order_id}**

✅ Status: {order['status'].upper()}
👤 Customer: {order['customer_name']}
📱 Phone: {order['phone']}
💰 Total: ₹{order['total']}
🚚 Estimated Delivery: {order['estimated_delivery']}
📅 Order Date: {order['created_at'][:10]}

For any queries, contact us at +91 8811013758"""
        else:
            return f"❌ Order {order_id} not found. Please check your order ID or contact us at +91 8811013758"
    return None

def analyze_sentiment(message):
    """Simple sentiment analysis"""
    positive_words = ['good', 'great', 'excellent', 'amazing', 'love', 'best', 'perfect', 'thanks', 'thank you']
    negative_words = ['bad', 'poor', 'worst', 'hate', 'disappointed', 'issue', 'problem', 'complaint']
    
    message_lower = message.lower()
    
    positive_count = sum(1 for word in positive_words if word in message_lower)
    negative_count = sum(1 for word in negative_words if word in message_lower)
    
    if positive_count > negative_count:
        return 'positive'
    elif negative_count > positive_count:
        return 'negative'
    else:
        return 'neutral'

if __name__ == '__main__':
    print("=" * 60)
    print("🐄 Angel Organics AI Chatbot Backend")
    print("=" * 60)
    print(f"✅ Groq API Key: {'Loaded' if GROQ_API_KEY else 'Missing'}")
    print(f"🤖 Model: Llama 3.3 70B Versatile")
    print(f"🌐 Server: http://localhost:5000")
    print(f"📡 Health Check: http://localhost:5000/api/health")
    print("=" * 60)
    print("🚀 Starting server...")
    print("=" * 60)
    
    app.run(host='0.0.0.0', port=5000, debug=True)
