"""
Angel Organics Agentic AI Chatbot Backend
Using LangGraph + Groq for Advanced Agentic Capabilities

This chatbot features:
- Multi-step reasoning and planning
- Tool use (location sharing, product lookup, order processing)
- Memory and context management
- Autonomous decision-making
- Proactive suggestions
"""

from flask import Flask, request, jsonify
from flask_cors import CORS
import os
from dotenv import load_dotenv
from langchain_groq import ChatGroq
from langchain_core.messages import HumanMessage, AIMessage, SystemMessage, ToolMessage
from langchain_core.prompts import ChatPromptTemplate
from langchain.tools import tool
from langgraph.graph import StateGraph, END
from langgraph.prebuilt import ToolNode
from langgraph.checkpoint.memory import MemorySaver
from typing import TypedDict, Annotated, Sequence
import operator
from datetime import datetime
import logging
import uuid
import json

# Load environment variables
load_dotenv()
if not os.getenv('GROQ_API_KEY'):
    load_dotenv('../config/.env')

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

# Initialize Groq LLM with LangGraph-compatible settings
llm = ChatGroq(
    api_key=GROQ_API_KEY,
    model="llama-3.3-70b-versatile",
    temperature=0.7,
    max_tokens=2048
)

# ==================== AGENT TOOLS ====================

@tool
def get_product_info(product_name: str) -> str:
    """Get detailed information about Angel Organics products including price, benefits, and availability."""
    products = {
        "milk": {
            "name": "Fresh Gir Cow A2 Milk",
            "price": 75,
            "unit": "liter",
            "benefits": "100% A2 protein, easy digestion, boosts immunity, rich in vitamins",
            "freshness": "Delivered within 6 hours of milking",
            "available": True
        },
        "ghee": {
            "name": "Golden A2 Ghee",
            "price": 2500,
            "unit": "kg",
            "benefits": "Traditional bilona method, rich in vitamins A,D,E,K, enhances digestion",
            "shelf_life": "12 months at room temperature",
            "available": True
        },
        "ghee500": {
            "name": "Golden A2 Ghee (500g)",
            "price": 1300,
            "unit": "500g",
            "benefits": "Same premium quality in smaller pack",
            "shelf_life": "12 months",
            "available": True
        },
        "butter": {
            "name": "Fresh Butter",
            "price": 1200,
            "unit": "kg",
            "benefits": "Hand-churned, no preservatives, rich taste",
            "freshness": "Best consumed within 15 days",
            "available": True
        },
        "curd": {
            "name": "Thick Curd",
            "price": 100,
            "unit": "kg",
            "benefits": "Live cultures, protein rich, supports digestive health",
            "freshness": "Best within 3 days",
            "available": True
        },
        "buttermilk": {
            "name": "Probiotic Buttermilk",
            "price": 30,
            "unit": "liter",
            "benefits": "Probiotic-rich, aids digestion, cooling effect",
            "freshness": "Consume within 2 days",
            "available": True
        }
    }
    
    product_key = product_name.lower().replace(" ", "").replace("a2", "")
    for key, details in products.items():
        if key in product_key or product_key in key:
            details["action"] = "show_product"
            details["buttons"] = [
                {"text": f"🛒 Order {details['name']}", "action": "order", "product": details['name']},
                {"text": "💰 Calculate Price", "action": "calculate"},
                {"text": "📦 View All Products", "action": "show_all_products"}
            ]
            return json.dumps(details, indent=2)
    
    return json.dumps({
        "action": "not_found",
        "message": "Product not found",
        "buttons": [
            {"text": "🥛 Milk", "action": "product", "query": "milk"},
            {"text": "🧈 Ghee", "action": "product", "query": "ghee"},
            {"text": "📋 All Products", "action": "show_all_products"}
        ]
    }, indent=2)

@tool
def get_farm_location() -> str:
    """Get the farm location details and directions to Angel Organics Farm."""
    return json.dumps({
        "action": "show_location",
        "name": "Angel Organics Farm",
        "address": "Angel Farm House, Arjunpura Jageer, Ajmer, Rajasthan 305203, India",
        "phone": "+91 8811013758",
        "working_hours": "Daily: 6:00 AM - 8:00 PM",
        "best_visit_time": "Morning 7-9 AM (Milking time)",
        "google_maps": "https://maps.app.goo.gl/293WBoybHLjSEcer7",
        "directions": "Located in Arjunpura Jageer area of Ajmer. Call for detailed directions.",
        "buttons": [
            {"text": "🗺️ View on Map", "action": "scroll_to_map"},
            {"text": "📱 Call Now", "action": "call", "url": "tel:+918811013758"},
            {"text": "💬 WhatsApp", "action": "whatsapp", "url": "https://wa.me/918811013758"}
        ]
    }, indent=2)

@tool
def calculate_order_total(items: str) -> str:
    """Calculate total price for an order. Items should be in format: 'milk:2,ghee:1,butter:0.5'"""
    prices = {
        "milk": 75, "ghee": 2500, "ghee500": 1300,
        "butter": 1200, "curd": 100, "buttermilk": 30
    }
    
    try:
        item_list = items.split(',')
        total = 0
        breakdown = []
        
        for item in item_list:
            product, quantity = item.strip().split(':')
            product = product.lower().strip()
            quantity = float(quantity)
            
            if product in prices:
                price = prices[product]
                item_total = price * quantity
                total += item_total
                breakdown.append(f"{product.title()}: {quantity} x ₹{price} = ₹{item_total}")
        
        # Apply bulk discount
        discount = 0
        if total >= 2000:
            discount = total * 0.05
            breakdown.append(f"\n🎉 Bulk Discount (5%): -₹{discount:.2f}")
        
        final_total = total - discount
        breakdown.append(f"\n💰 Final Total: ₹{final_total:.2f}")
        breakdown.append("📦 Free Delivery on all orders!")
        
        return "\n".join(breakdown)
    except Exception as e:
        return f"Error calculating total: {str(e)}. Please use format: 'milk:2,ghee:1'"

@tool
def get_health_benefits(concern: str) -> str:
    """Get health benefits of A2 milk for specific health concerns or conditions."""
    benefits = {
        "digestion": "A2 milk is easier to digest than regular milk. Contains only A2 beta-casein protein that doesn't cause bloating or digestive discomfort.",
        "immunity": "Rich in immunoglobulins and lactoferrin that naturally boost immune system. Perfect for building resistance against infections.",
        "bone": "High bioavailable calcium and phosphorus promote bone density and prevent osteoporosis. Great for growing children and elderly.",
        "brain": "Rich in DHA and omega-3 fatty acids that boost cognitive development, memory, and mental clarity.",
        "heart": "Contains beneficial peptides and healthy fats that support cardiovascular health and maintain cholesterol balance.",
        "muscle": "Complete amino acid profile supports optimal muscle growth, recovery, and strength building.",
        "lactose": "A2 milk is often better tolerated by people with lactose sensitivity due to easier protein digestion.",
        "weight": "Natural, nutrient-dense option that supports healthy weight management when part of balanced diet.",
        "skin": "Vitamins A, D, E and healthy fats promote glowing skin and overall skin health."
    }
    
    concern = concern.lower()
    for key, benefit in benefits.items():
        if key in concern:
            return benefit
    
    return "A2 milk provides comprehensive health benefits including better digestion, stronger immunity, healthy bones, enhanced brain function, and heart health."

@tool
def create_whatsapp_order(order_details: str) -> str:
    """Generate a WhatsApp message link for placing an order."""
    phone = "918811013758"
    message = f"Hi! I want to order from Angel Organics:\n\n{order_details}\n\nPlease confirm availability and delivery time."
    encoded_message = message.replace(' ', '%20').replace('\n', '%0A')
    whatsapp_url = f"https://wa.me/{phone}?text={encoded_message}"
    
    return json.dumps({
        "action": "whatsapp_order",
        "message": "✅ Order ready! Click below to send via WhatsApp",
        "order_details": order_details,
        "buttons": [
            {"text": "💬 Send Order on WhatsApp", "action": "open_whatsapp", "url": whatsapp_url},
            {"text": "📞 Call to Order", "action": "call", "url": "tel:+918811013758"},
            {"text": "💰 Calculate Total", "action": "calculate"}
        ]
    }, indent=2)

@tool
def show_gallery() -> str:
    """Show farm gallery photos. Use when user asks to see gallery, photos, pictures, or images of the farm."""
    return json.dumps({
        "action": "show_gallery",
        "message": "📸 Here's our farm gallery with 20+ photos!",
        "buttons": [
            {"text": "📸 View Gallery", "action": "scroll_to_gallery"},
            {"text": "🐄 See Our Gir Cows", "action": "scroll_to_gallery"},
            {"text": "📞 Contact Us", "action": "show_contact"}
        ]
    }, indent=2)

@tool
def show_all_products() -> str:
    """Show all available products from Angel Organics. Use when user asks to see products, product list, or what you sell."""
    products = [
        {"name": "Fresh Gir Cow A2 Milk", "price": "₹75/liter", "emoji": "🥛"},
        {"name": "Golden A2 Ghee (1kg)", "price": "₹2500/kg", "emoji": "🧈"},
        {"name": "Golden A2 Ghee (500g)", "price": "₹1300", "emoji": "🧈"},
        {"name": "Fresh Butter", "price": "₹1200/kg", "emoji": "🧈"},
        {"name": "Thick Curd", "price": "₹100/kg", "emoji": "🥛"},
        {"name": "Probiotic Buttermilk", "price": "₹30/liter", "emoji": "🥤"}
    ]
    
    product_list = "\\n".join([f"{p['emoji']} {p['name']} - {p['price']}" for p in products])
    
    return json.dumps({
        "action": "show_products",
        "message": f"🛒 Our Products:\\n{product_list}",
        "buttons": [
            {"text": "🥛 Order Milk", "action": "order", "query": "milk"},
            {"text": "🧈 Order Ghee", "action": "order", "query": "ghee"},
            {"text": "📞 Contact Us", "action": "show_contact"}
        ]
    }, indent=2)

# List of all tools
tools = [
    get_product_info,
    get_farm_location,
    calculate_order_total,
    get_health_benefits,
    create_whatsapp_order,
    show_gallery,
    show_all_products
]

# Bind tools to LLM
llm_with_tools = llm.bind_tools(tools)

# ==================== AGENT STATE ====================

class AgentState(TypedDict):
    """State of the agent conversation."""
    messages: Annotated[Sequence[HumanMessage | AIMessage], operator.add]
    user_intent: str
    context: dict

# ==================== AGENT NODES ====================

def call_model(state: AgentState):
    """Call the LLM with tools to generate a response."""
    messages = state["messages"]
    
    # Add system message with context
    system_prompt = """You are an intelligent AI assistant for Angel Organics, a premium Gir cow dairy farm in Ajmer, Rajasthan.

**YOUR CAPABILITIES:**
You are a knowledgeable AI assistant who can answer ANY question about:
- Our farm, Gir cows, organic practices, and farming methods
- A2 milk benefits, health advantages, nutrition facts
- All dairy products (milk, ghee, butter, curd, buttermilk)
- Pricing, ordering, delivery, and customer service
- Reviews, testimonials, and customer experiences
- Recipes, cooking tips, and product usage
- Comparison between A2 vs regular milk
- Farm visits, location, and directions
- Company history, owner Dr. Sunil Rai, and our story

**AVAILABLE TOOLS (Use when appropriate):**
- get_product_info: Product details and pricing
- get_farm_location: Location and directions
- calculate_order_total: Price calculations
- get_health_benefits: Health information
- create_whatsapp_order: Order placement
- show_gallery: Farm photos
- show_all_products: Complete product list

**INTELLIGENT RESPONSE STRATEGY:**
1. **For tool-related queries**: Use appropriate tool + give brief explanation
   - "show pictures/gallery" → use show_gallery tool
   - "location/map/directions" → use get_farm_location tool
   - "reviews/testimonials" → Just answer conversationally (NO tool needed)
   - "prices" → use get_product_info or show_all_products tool
   
2. **For general questions**: Answer directly without tools
   - Reviews: Share customer feedback conversationally
   - Farm info: Explain our practices and values
   - Health questions: Provide detailed A2 milk benefits
   - Comparisons: Explain A2 vs A1 milk differences
   
3. **For ANY other question**: Provide helpful, detailed answers based on context

**RESPONSE STYLE:**
- Be friendly, helpful, and knowledgeable
- Answer questions directly and completely
- Don't say "I can't help" - always provide useful information
- Keep responses natural and conversational
- When using tools, keep your text response brief (1-2 sentences)
- When NOT using tools, give comprehensive, detailed answers

**CRITICAL RULES:**
- NEVER repeat or mention the JSON tool output in your response
- Use tools strategically - not for everything
- For reviews/testimonials, answer conversationally without tools
- Always be helpful and informative
- If unsure, provide relevant information and suggest contacting us

**EXAMPLE RESPONSES:**
User: "show reviews" 
Response: "Our customers love us! We have amazing testimonials from satisfied families across Ajmer. Alok Uttam praises our hygiene practices, Priya Kulshrestha appreciates our consistent quality, and Surasri Majumder trusts us with her baby's nutrition. Would you like to know more about specific customer experiences?"

User: "show pictures"
Response: "Here's our farm gallery!" [use show_gallery tool]

User: "tell me about your farm"
Response: "Angel Organics is a family-owned premium Gir cow dairy farm in Ajmer, Rajasthan, run by Dr. Sunil Rai. We have 20 healthy Gir cows that naturally produce 100% A2 milk. We follow traditional organic practices with zero chemicals, hormones, or artificial feeds. Our cows roam freely, fed organic fodder, and milk is delivered within 6 hours of milking. Would you like to visit our farm or see photos?"

User: "what's the difference between A2 and regular milk"
Response: "Great question! A2 milk contains only A2 beta-casein protein, while regular milk has both A1 and A2 proteins. A2 is easier to digest, doesn't cause bloating, and is better for people with lactose sensitivity. Our Gir cows naturally produce 100% A2 milk, making it healthier and more nutritious than commercial milk."

"""
    
    full_messages = [SystemMessage(content=system_prompt)] + messages
    
    # Call LLM with tools - it will decide when to use them
    response = llm_with_tools.invoke(full_messages)
    return {"messages": [response]}

def should_continue(state: AgentState):
    """Determine if we should use tools or end."""
    last_message = state["messages"][-1]
    
    # If there are tool calls, continue to tools
    if hasattr(last_message, 'tool_calls') and last_message.tool_calls:
        return "tools"
    
    # Otherwise, end
    return "end"

def call_tools(state: AgentState):
    """Execute the tools."""
    last_message = state["messages"][-1]
    
    # Execute all tool calls
    tool_messages = []
    for tool_call in last_message.tool_calls:
        # Find and execute the tool
        tool_name = tool_call["name"]
        tool_args = tool_call["args"]
        
        # Find the matching tool
        selected_tool = None
        for t in tools:
            if t.name == tool_name:
                selected_tool = t
                break
        
        if selected_tool:
            try:
                tool_result = selected_tool.invoke(tool_args)
                tool_messages.append(
                    ToolMessage(
                        content=str(tool_result),
                        tool_call_id=tool_call["id"]
                    )
                )
            except Exception as e:
                tool_messages.append(
                    ToolMessage(
                        content=f"Error: {str(e)}",
                        tool_call_id=tool_call["id"]
                    )
                )
    
    return {"messages": tool_messages}

# ==================== BUILD AGENT GRAPH ====================

# Initialize the graph
workflow = StateGraph(AgentState)

# Add nodes
workflow.add_node("agent", call_model)
workflow.add_node("tools", call_tools)

# Set entry point
workflow.set_entry_point("agent")

# Add conditional edges
workflow.add_conditional_edges(
    "agent",
    should_continue,
    {
        "tools": "tools",
        "end": END
    }
)

# Add edge from tools back to agent
workflow.add_edge("tools", "agent")

# Compile the graph with memory
memory = MemorySaver()
agentic_chatbot = workflow.compile(checkpointer=memory)

# ==================== CONVERSATION STORAGE ====================

# In-memory storage for conversations (use Redis/DB in production)
conversations = {}

def get_or_create_conversation(session_id: str):
    """Get or create a conversation history."""
    if session_id not in conversations:
        conversations[session_id] = {
            "messages": [],
            "created_at": datetime.now().isoformat(),
            "context": {}
        }
    return conversations[session_id]

# ==================== API ENDPOINTS ====================

@app.route('/api/health', methods=['GET'])
def health_check():
    """Health check endpoint."""
    return jsonify({
        "status": "healthy",
        "service": "Angel Organics Agentic Chatbot",
        "framework": "LangGraph + Groq",
        "timestamp": datetime.now().isoformat()
    })

@app.route('/api/chat', methods=['POST'])
def chat():
    """Main chat endpoint with agentic capabilities."""
    try:
        data = request.json
        user_message = data.get('message', '').strip()
        session_id = data.get('session_id', str(uuid.uuid4()))
        
        if not user_message:
            return jsonify({"error": "Message is required"}), 400
        
        logger.info(f"[Session: {session_id}] User: {user_message}")
        
        # Get conversation history
        conversation = get_or_create_conversation(session_id)
        
        # Prepare state
        state = {
            "messages": [HumanMessage(content=user_message)],
            "user_intent": "",
            "context": conversation.get("context", {})
        }
        
        # Run the agent
        config = {"configurable": {"thread_id": session_id}}
        result = agentic_chatbot.invoke(state, config)
        
        # Extract the final AI response
        ai_message = result["messages"][-1].content
        
        # Extract tool results - get the LAST tool action (most recent)
        action_data = None
        for msg in reversed(result["messages"]):  # Check from end to start
            if hasattr(msg, '__class__') and msg.__class__.__name__ == 'ToolMessage':
                try:
                    tool_data = json.loads(msg.content)
                    logger.info(f"[Session: {session_id}] Tool result: {tool_data.get('action', 'NO ACTION')}")
                    if 'action' in tool_data and 'buttons' in tool_data:
                        action_data = tool_data
                        break  # Take the most recent action
                except Exception as e:
                    logger.error(f"[Session: {session_id}] Error parsing tool result: {e}")
                    pass
        
        # Update conversation history
        conversation["messages"].append({
            "role": "user",
            "content": user_message,
            "timestamp": datetime.now().isoformat()
        })
        conversation["messages"].append({
            "role": "assistant",
            "content": ai_message,
            "timestamp": datetime.now().isoformat()
        })
        
        logger.info(f"[Session: {session_id}] Assistant: {ai_message[:100]}...")
        
        response_data = {
            "response": ai_message,
            "session_id": session_id,
            "timestamp": datetime.now().isoformat(),
            "agent_type": "agentic",
            "tools_used": len([m for m in result["messages"] if hasattr(m, 'tool_calls') and m.tool_calls])
        }
        
        # Add action data if available
        if action_data:
            response_data["action"] = action_data
            logger.info(f"[Session: {session_id}] Action: {action_data.get('action')} with {len(action_data.get('buttons', []))} buttons")
        
        return jsonify(response_data)
        
    except Exception as e:
        logger.error(f"Error in chat endpoint: {str(e)}", exc_info=True)
        return jsonify({
            "error": "An error occurred processing your request",
            "details": str(e)
        }), 500

@app.route('/api/export-chat', methods=['POST'])
def export_chat():
    """Export chat conversation."""
    try:
        data = request.json
        session_id = data.get('session_id')
        
        if not session_id or session_id not in conversations:
            return jsonify({"error": "No conversation found"}), 404
        
        conversation = conversations[session_id]
        
        # Format conversation for export
        export_text = f"Angel Organics Chat Export\nSession: {session_id}\nDate: {conversation.get('created_at', 'N/A')}\n\n"
        
        for msg in conversation.get('messages', []):
            if isinstance(msg, dict):
                role = msg.get('role', 'unknown')
                content = msg.get('content', '')
                export_text += f"{role.upper()}: {content}\n\n"
        
        return jsonify({
            "success": True,
            "export": export_text,
            "session_id": session_id
        })
        
    except Exception as e:
        logger.error(f"Error exporting chat: {str(e)}")
        return jsonify({"error": str(e)}), 500

@app.route('/conversations/<session_id>', methods=['GET'])
def get_conversation(session_id):
    """Get conversation history for a session."""
    conversation = conversations.get(session_id)
    
    if not conversation:
        return jsonify({"error": "Conversation not found"}), 404
    
    return jsonify({
        "session_id": session_id,
        "conversation": conversation
    })

@app.route('/conversations/<session_id>', methods=['DELETE'])
def delete_conversation(session_id):
    """Delete a conversation."""
    if session_id in conversations:
        del conversations[session_id]
        return jsonify({"message": "Conversation deleted successfully"})
    
    return jsonify({"error": "Conversation not found"}), 404

@app.route('/tools', methods=['GET'])
def list_tools():
    """List all available tools."""
    return jsonify({
        "tools": [
            {
                "name": tool.name,
                "description": tool.description,
            }
            for tool in tools
        ]
    })

# ==================== RUN SERVER ====================

if __name__ == '__main__':
    port = int(os.getenv('PORT', 5000))
    debug = os.getenv('FLASK_ENV') == 'development'
    
    logger.info("=" * 60)
    logger.info("🤖 Angel Organics Agentic Chatbot Backend Starting...")
    logger.info("=" * 60)
    logger.info(f"🚀 Framework: LangGraph + Groq")
    logger.info(f"🔧 Tools: {len(tools)} tools available")
    logger.info(f"🌐 Port: {port}")
    logger.info(f"🐛 Debug Mode: {debug}")
    logger.info("=" * 60)
    
    app.run(host='0.0.0.0', port=port, debug=debug)
