"""
Angel Organics AI Chatbot
Built with LangChain and Generative AI
"""

import os
from flask import Flask, request, jsonify
from flask_cors import CORS
from langchain.chat_models import ChatOpenAI
from langchain.prompts import ChatPromptTemplate, MessagesPlaceholder
from langchain.memory import ConversationBufferMemory
from langchain.chains import ConversationChain
from langchain.schema import HumanMessage, AIMessage
from dotenv import load_dotenv
import json
from datetime import datetime

# Load environment variables
load_dotenv()

app = Flask(__name__)
CORS(app)

# Angel Organics Business Context
BUSINESS_CONTEXT = """
You are an AI assistant for Angel Organics, a premium A2 Desi Cow Milk provider in Delhi NCR.

**Business Information:**
- Owner: Dr. Sunil K Rai (Veterinary Surgeon)
- Contact: +91 8811013758
- Email: drsunilkrai1975@gmail.com
- Instagram: @angelgirorganics

**Products & Pricing:**
1. Fresh A2 Desi Cow Milk
   - Daily Fresh Milk: ₹100-120/liter
   - Premium Quality from Gir and Sahiwal cows
   - Home delivery available

2. Organic Desi Ghee
   - Premium A2 Ghee: ₹800-1000/kg
   - Made from pure A2 milk
   - Traditional bilona method

3. Fresh Curd/Dahi
   - Daily Fresh Curd: ₹80-100/500g
   - Probiotic-rich
   - Made from A2 milk

4. Paneer (Cottage Cheese)
   - Fresh Paneer: ₹300-400/kg
   - High protein
   - No preservatives

**Key Benefits:**
- 100% Pure A2 Beta-Casein Protein
- Direct from farm to home
- No chemicals, preservatives, or additives
- Scientifically proven health benefits
- Ethically raised Gir and Sahiwal cows
- Veterinary-supervised quality

**Service Areas:**
Delhi NCR including Delhi, Noida, Gurgaon, Ghaziabad, Faridabad

**Delivery:**
- Daily morning delivery (6-8 AM)
- Evening delivery available on request
- Minimum order: 1 liter
- Subscription plans available

**Your Role:**
- Answer questions about products, pricing, and benefits
- Help customers place orders
- Provide information about A2 milk health benefits
- Guide users to contact Dr. Sunil K Rai for orders
- Be friendly, professional, and knowledgeable
- Always encourage customers to reach out via WhatsApp (+91 8811013758) for orders
"""

# Initialize LangChain components
class AngelOrganicsChatbot:
    def __init__(self):
        self.api_key = os.getenv('OPENAI_API_KEY', '')
        
        # Initialize the language model
        if self.api_key:
            self.llm = ChatOpenAI(
                model="gpt-3.5-turbo",
                temperature=0.7,
                openai_api_key=self.api_key
            )
        else:
            # Fallback to rule-based system if no API key
            self.llm = None
        
        # Create conversation memory
        self.memory = ConversationBufferMemory(
            return_messages=True,
            memory_key="chat_history"
        )
        
        # Create prompt template
        self.prompt = ChatPromptTemplate.from_messages([
            ("system", BUSINESS_CONTEXT),
            MessagesPlaceholder(variable_name="chat_history"),
            ("human", "{input}")
        ])
        
        # Create conversation chain
        if self.llm:
            self.chain = ConversationChain(
                llm=self.llm,
                memory=self.memory,
                prompt=self.prompt,
                verbose=True
            )
    
    def get_response(self, user_message: str, session_id: str = "default") -> str:
        """Get chatbot response for user message"""
        try:
            if self.llm:
                # Use LangChain for intelligent responses
                response = self.chain.predict(input=user_message)
                return response
            else:
                # Fallback to rule-based responses
                return self.get_rule_based_response(user_message)
        except Exception as e:
            print(f"Error generating response: {e}")
            return self.get_fallback_response()
    
    def get_rule_based_response(self, message: str) -> str:
        """Rule-based fallback responses"""
        message_lower = message.lower()
        
        # Greetings
        if any(word in message_lower for word in ['hello', 'hi', 'hey', 'namaste']):
            return """Hello! 🙏 Welcome to Angel Organics! 
            
I'm here to help you with information about our premium A2 Desi Cow Milk and products. 

How can I assist you today?
- Learn about A2 milk benefits
- Check product prices
- Place an order
- Get delivery information"""
        
        # Product inquiry
        elif any(word in message_lower for word in ['product', 'what do you sell', 'items']):
            return """🥛 **Our Products:**

1. **Fresh A2 Desi Cow Milk** - ₹100-120/liter
2. **Organic Desi Ghee** - ₹800-1000/kg
3. **Fresh Curd/Dahi** - ₹80-100/500g
4. **Paneer** - ₹300-400/kg

All products are 100% pure, made from A2 milk from Gir and Sahiwal cows!

Would you like to know more about any specific product?"""
        
        # Price inquiry
        elif any(word in message_lower for word in ['price', 'cost', 'rate']):
            return """💰 **Our Pricing:**

- **Fresh A2 Milk**: ₹100-120 per liter
- **Desi Ghee**: ₹800-1000 per kg
- **Fresh Curd**: ₹80-100 per 500g
- **Paneer**: ₹300-400 per kg

📱 For bulk orders and subscriptions, contact Dr. Sunil K Rai:
WhatsApp: +91 8811013758"""
        
        # A2 milk benefits
        elif any(word in message_lower for word in ['benefit', 'a2', 'health', 'why']):
            return """🌟 **A2 Milk Benefits:**

✅ Easier to digest than regular milk
✅ Contains only A2 beta-casein protein
✅ Reduces inflammation
✅ Boosts immunity
✅ Better for lactose-sensitive people
✅ Rich in vitamins and minerals
✅ Promotes heart health
✅ No chemicals or preservatives

Our cows are ethically raised and supervised by veterinary experts!"""
        
        # Order inquiry
        elif any(word in message_lower for word in ['order', 'buy', 'purchase']):
            return """📦 **Ready to Order?**

To place an order, please contact us:

📱 **WhatsApp**: +91 8811013758
📧 **Email**: drsunilkrai1975@gmail.com
📸 **Instagram**: @angelgirorganics

**Delivery Details:**
- Daily morning delivery (6-8 AM)
- Evening delivery on request
- Serving Delhi NCR
- Minimum order: 1 liter

Dr. Sunil K Rai will assist you personally! 🙏"""
        
        # Delivery inquiry
        elif any(word in message_lower for word in ['delivery', 'deliver', 'location', 'area']):
            return """🚚 **Delivery Information:**

**Service Areas**: Delhi NCR
- Delhi
- Noida
- Gurgaon
- Ghaziabad
- Faridabad

**Delivery Timings**:
- Morning: 6-8 AM (Daily)
- Evening: On Request

**Minimum Order**: 1 liter

Contact us to check if we deliver to your area:
📱 WhatsApp: +91 8811013758"""
        
        # Contact inquiry
        elif any(word in message_lower for word in ['contact', 'phone', 'call', 'reach']):
            return """📞 **Contact Angel Organics:**

👨‍⚕️ **Dr. Sunil K Rai** (Veterinary Surgeon)
📱 **Phone/WhatsApp**: +91 8811013758
📧 **Email**: drsunilkrai1975@gmail.com
📸 **Instagram**: @angelgirorganics

We're here to serve you with the best A2 milk products! 🐄🥛"""
        
        # Default response
        else:
            return """I'm here to help! You can ask me about:

🥛 Our products and prices
🌟 A2 milk health benefits
📦 How to place an order
🚚 Delivery information
📞 Contact details

What would you like to know?"""
    
    def get_fallback_response(self) -> str:
        """Fallback response for errors"""
        return """I apologize, but I'm having trouble processing your request right now. 

Please contact us directly:
📱 WhatsApp: +91 8811013758
📧 Email: drsunilkrai1975@gmail.com

Dr. Sunil K Rai will be happy to assist you! 🙏"""

# Initialize chatbot
chatbot = AngelOrganicsChatbot()

# Session storage (in production, use Redis or database)
sessions = {}

@app.route('/api/chat', methods=['POST'])
def chat():
    """Chat endpoint"""
    try:
        data = request.json
        user_message = data.get('message', '')
        session_id = data.get('session_id', 'default')
        
        if not user_message:
            return jsonify({'error': 'Message is required'}), 400
        
        # Get chatbot response
        bot_response = chatbot.get_response(user_message, session_id)
        
        # Store conversation
        if session_id not in sessions:
            sessions[session_id] = []
        
        sessions[session_id].append({
            'user': user_message,
            'bot': bot_response,
            'timestamp': datetime.now().isoformat()
        })
        
        return jsonify({
            'response': bot_response,
            'session_id': session_id,
            'timestamp': datetime.now().isoformat()
        })
    
    except Exception as e:
        print(f"Error in chat endpoint: {e}")
        return jsonify({'error': 'Internal server error'}), 500

@app.route('/api/chat/history/<session_id>', methods=['GET'])
def get_history(session_id):
    """Get chat history for a session"""
    history = sessions.get(session_id, [])
    return jsonify({'history': history})

@app.route('/api/chat/clear/<session_id>', methods=['POST'])
def clear_history(session_id):
    """Clear chat history for a session"""
    if session_id in sessions:
        del sessions[session_id]
    return jsonify({'message': 'History cleared'})

@app.route('/health', methods=['GET'])
def health():
    """Health check endpoint"""
    return jsonify({
        'status': 'healthy',
        'service': 'Angel Organics Chatbot',
        'timestamp': datetime.now().isoformat()
    })

if __name__ == '__main__':
    print("🤖 Angel Organics AI Chatbot Server Starting...")
    print("📱 API Endpoint: http://localhost:5000/api/chat")
    app.run(host='0.0.0.0', port=5000, debug=True)
