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
    groq_api_key=GROQ_API_KEY,
    model_name="llama-3.3-70b-versatile",  # Using Llama 3.3 70B
    temperature=0.7,
    max_tokens=2048
)

# Store for conversation histories
store = {}

def get_session_history(session_id: str) -> BaseChatMessageHistory:
    """Get or create chat history for a session"""
    if session_id not in store:
        store[session_id] = ChatMessageHistory()
    return store[session_id]

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

@app.route('/api/chat', methods=['POST'])
def chat():
    """Handle chat requests"""
    try:
        data = request.json
        message = data.get('message', '').strip()
        session_id = data.get('session_id', 'default_session')
        
        if not message:
            return jsonify({
                'success': False,
                'error': 'Message is required'
            }), 400
        
        logger.info(f"Received message: {message[:50]}... from session: {session_id}")
        
        # Get response from LangChain
        response = chain_with_history.invoke(
            {"input": message},
            config={"configurable": {"session_id": session_id}}
        )
        
        # Extract the content from the response
        response_text = response.content if hasattr(response, 'content') else str(response)
        
        logger.info(f"Generated response: {response_text[:100]}...")
        
        return jsonify({
            'success': True,
            'response': response_text,
            'session_id': session_id
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
