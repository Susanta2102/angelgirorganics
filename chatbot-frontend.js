/**
 * Angel Organics AI Chatbot
 * Frontend JavaScript with LangChain Backend Integration
 */

class AngelOrganicsChatbot {
    constructor() {
        this.isOpen = false;
        this.messages = [];
        this.sessionId = this.generateSessionId();
        // Use API_CONFIG if available, fallback to localhost
        this.apiEndpoint = window.API_CONFIG ? window.API_CONFIG.getChatUrl() : 'http://localhost:5000/api/chat';
        this.isTyping = false;
        
        this.init();
    }
    
    generateSessionId() {
        return 'session_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
    }
    
    init() {
        this.createChatbotUI();
        this.attachEventListeners();
        this.showWelcomeMessage();
    }
    
    createChatbotUI() {
        const chatbotHTML = `
            <div class="chatbot-widget">
                <button class="chatbot-toggle" id="chatbotToggle">
                    <i class="fas fa-comments"></i>
                </button>
                
                <div class="chatbot-container" id="chatbotContainer">
                    <div class="chatbot-header">
                        <div class="chatbot-header-info">
                            <div class="chatbot-avatar">
                                🐄
                            </div>
                            <div class="chatbot-title">
                                <h3>Angel Organics AI</h3>
                                <div class="chatbot-status">
                                    <span class="status-dot"></span>
                                    <span>Online</span>
                                </div>
                            </div>
                        </div>
                        <button class="chatbot-close" id="chatbotClose">
                            <i class="fas fa-times"></i>
                        </button>
                    </div>
                    
                    <div class="chatbot-messages" id="chatbotMessages">
                        <!-- Messages will be inserted here -->
                    </div>
                    
                    <div class="chatbot-input-area">
                        <input 
                            type="text" 
                            class="chatbot-input" 
                            id="chatbotInput" 
                            placeholder="Type your message..."
                            autocomplete="off"
                        />
                        <button class="chatbot-send-btn" id="chatbotSend">
                            <i class="fas fa-paper-plane"></i>
                        </button>
                    </div>
                </div>
            </div>
        `;
        
        document.body.insertAdjacentHTML('beforeend', chatbotHTML);
    }
    
    attachEventListeners() {
        const toggle = document.getElementById('chatbotToggle');
        const close = document.getElementById('chatbotClose');
        const sendBtn = document.getElementById('chatbotSend');
        const input = document.getElementById('chatbotInput');
        
        toggle.addEventListener('click', () => this.toggleChatbot());
        close.addEventListener('click', () => this.closeChatbot());
        sendBtn.addEventListener('click', () => this.sendMessage());
        
        input.addEventListener('keypress', (e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                this.sendMessage();
            }
        });
    }
    
    toggleChatbot() {
        this.isOpen = !this.isOpen;
        const container = document.getElementById('chatbotContainer');
        const toggle = document.getElementById('chatbotToggle');
        
        if (this.isOpen) {
            container.classList.add('active');
            toggle.classList.add('active');
            document.getElementById('chatbotInput').focus();
        } else {
            container.classList.remove('active');
            toggle.classList.remove('active');
        }
    }
    
    closeChatbot() {
        this.isOpen = false;
        document.getElementById('chatbotContainer').classList.remove('active');
        document.getElementById('chatbotToggle').classList.remove('active');
    }
    
    showWelcomeMessage() {
        const welcomeMsg = {
            type: 'bot',
            text: `Namaste! 🙏 Welcome to Angel Organics!\n\nI'm your AI assistant, here to help you with:\n\n🥛 Premium A2 Milk Products\n🌟 Health Benefits\n📦 Order Information\n🚚 Delivery Details\n\nHow can I help you today?`,
            timestamp: new Date()
        };
        
        this.addMessage(welcomeMsg);
        this.showQuickReplies();
    }
    
    showQuickReplies() {
        const quickReplies = [
            'View Products',
            'Check Prices',
            'A2 Milk Benefits',
            'Place Order',
            'Delivery Info'
        ];
        
        const messagesContainer = document.getElementById('chatbotMessages');
        const repliesHTML = `
            <div class="quick-replies">
                ${quickReplies.map(reply => 
                    `<button class="quick-reply-btn" onclick="angelChatbot.handleQuickReply('${reply}')">${reply}</button>`
                ).join('')}
            </div>
        `;
        
        messagesContainer.insertAdjacentHTML('beforeend', repliesHTML);
        this.scrollToBottom();
    }
    
    handleQuickReply(text) {
        // Remove quick replies
        const quickReplies = document.querySelector('.quick-replies');
        if (quickReplies) {
            quickReplies.remove();
        }
        
        // Send as user message
        document.getElementById('chatbotInput').value = text;
        this.sendMessage();
    }
    
    async sendMessage() {
        const input = document.getElementById('chatbotInput');
        const message = input.value.trim();
        
        if (!message || this.isTyping) return;
        
        // Add user message
        this.addMessage({
            type: 'user',
            text: message,
            timestamp: new Date()
        });
        
        // Clear input
        input.value = '';
        
        // Show typing indicator
        this.showTypingIndicator();
        
        try {
            // Send to backend API
            const response = await this.sendToAPI(message);
            
            // Remove typing indicator
            this.hideTypingIndicator();
            
            // Add bot response
            this.addMessage({
                type: 'bot',
                text: response,
                timestamp: new Date()
            });
            
        } catch (error) {
            console.error('Error sending message:', error);
            this.hideTypingIndicator();
            
            this.addMessage({
                type: 'bot',
                text: `I apologize, but I'm having trouble connecting right now. 😔\n\nPlease contact us directly:\n📱 WhatsApp: +91 8811013758\n📧 Email: drsunilkrai1975@gmail.com`,
                timestamp: new Date()
            });
        }
    }
    
    async sendToAPI(message) {
        try {
            const response = await fetch(this.apiEndpoint, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    message: message,
                    session_id: this.sessionId
                })
            });
            
            if (!response.ok) {
                throw new Error('API request failed');
            }
            
            const data = await response.json();
            return data.response;
            
        } catch (error) {
            console.error('API Error:', error);
            // Fallback to local responses if API is down
            return this.getLocalResponse(message);
        }
    }
    
    getLocalResponse(message) {
        const msg = message.toLowerCase();
        
        // Local fallback responses
        if (msg.includes('product') || msg.includes('what') || msg.includes('sell')) {
            return `🥛 **Our Products:**\n\n1. Fresh A2 Desi Cow Milk - ₹100-120/liter\n2. Organic Desi Ghee - ₹800-1000/kg\n3. Fresh Curd/Dahi - ₹80-100/500g\n4. Paneer - ₹300-400/kg\n\nAll 100% pure from Gir & Sahiwal cows! 🐄\n\nWant to order? Contact us on WhatsApp: +91 8811013758`;
        }
        
        if (msg.includes('price') || msg.includes('cost')) {
            return `💰 **Our Pricing:**\n\n• Fresh A2 Milk: ₹100-120/liter\n• Desi Ghee: ₹800-1000/kg\n• Fresh Curd: ₹80-100/500g\n• Paneer: ₹300-400/kg\n\n📱 For bulk orders: +91 8811013758`;
        }
        
        if (msg.includes('benefit') || msg.includes('a2') || msg.includes('health')) {
            return `🌟 **A2 Milk Benefits:**\n\n✅ Easier to digest\n✅ Only A2 beta-casein protein\n✅ Reduces inflammation\n✅ Boosts immunity\n✅ Better for lactose-sensitive\n✅ Rich in vitamins & minerals\n✅ No chemicals or preservatives\n\nSupervised by Dr. Sunil K Rai (Veterinary Surgeon)! 👨‍⚕️`;
        }
        
        if (msg.includes('order') || msg.includes('buy')) {
            return `📦 **Ready to Order?**\n\nContact us now:\n📱 WhatsApp: +91 8811013758\n📧 Email: drsunilkrai1975@gmail.com\n📸 Instagram: @angelgirorganics\n\n🚚 Daily delivery in Delhi NCR\n⏰ Morning delivery: 6-8 AM\n📦 Minimum order: 1 liter`;
        }
        
        if (msg.includes('delivery') || msg.includes('location')) {
            return `🚚 **Delivery Information:**\n\n📍 Service Areas: Delhi NCR\n• Delhi\n• Noida\n• Gurgaon\n• Ghaziabad\n• Faridabad\n\n⏰ Delivery Timings:\n• Morning: 6-8 AM (Daily)\n• Evening: On Request\n\n📦 Minimum order: 1 liter\n📱 Contact: +91 8811013758`;
        }
        
        if (msg.includes('contact') || msg.includes('phone')) {
            return `📞 **Contact Angel Organics:**\n\n👨‍⚕️ Dr. Sunil K Rai (Veterinary Surgeon)\n📱 Phone/WhatsApp: +91 8811013758\n📧 Email: drsunilkrai1975@gmail.com\n📸 Instagram: @angelgirorganics\n\nWe're here to serve you! 🙏`;
        }
        
        return `I'm here to help! Ask me about:\n\n🥛 Products & Prices\n🌟 A2 Milk Benefits\n📦 How to Order\n🚚 Delivery Information\n📞 Contact Details\n\nWhat would you like to know?`;
    }
    
    addMessage(message) {
        this.messages.push(message);
        const messagesContainer = document.getElementById('chatbotMessages');
        
        const messageHTML = `
            <div class="message ${message.type}">
                <div class="message-avatar">
                    ${message.type === 'bot' ? '🤖' : '👤'}
                </div>
                <div class="message-content">
                    ${this.formatMessage(message.text)}
                    <div class="message-time">${this.formatTime(message.timestamp)}</div>
                </div>
            </div>
        `;
        
        messagesContainer.insertAdjacentHTML('beforeend', messageHTML);
        this.scrollToBottom();
    }
    
    formatMessage(text) {
        // Convert markdown-style formatting to HTML
        let formatted = text
            .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
            .replace(/\n/g, '<br>');
        
        // Convert product listings to cards if present
        if (text.includes('₹') && (text.includes('liter') || text.includes('kg'))) {
            // This is a product listing, could enhance with cards
        }
        
        return formatted;
    }
    
    formatTime(date) {
        return date.toLocaleTimeString('en-US', { 
            hour: '2-digit', 
            minute: '2-digit' 
        });
    }
    
    showTypingIndicator() {
        this.isTyping = true;
        const messagesContainer = document.getElementById('chatbotMessages');
        
        const typingHTML = `
            <div class="message bot typing-message">
                <div class="message-avatar">🤖</div>
                <div class="typing-indicator">
                    <div class="typing-dot"></div>
                    <div class="typing-dot"></div>
                    <div class="typing-dot"></div>
                </div>
            </div>
        `;
        
        messagesContainer.insertAdjacentHTML('beforeend', typingHTML);
        this.scrollToBottom();
    }
    
    hideTypingIndicator() {
        this.isTyping = false;
        const typingMessage = document.querySelector('.typing-message');
        if (typingMessage) {
            typingMessage.remove();
        }
    }
    
    scrollToBottom() {
        const messagesContainer = document.getElementById('chatbotMessages');
        messagesContainer.scrollTop = messagesContainer.scrollHeight;
    }
}

// Initialize chatbot when DOM is ready
let angelChatbot;

document.addEventListener('DOMContentLoaded', function() {
    angelChatbot = new AngelOrganicsChatbot();
    console.log('🤖 Angel Organics AI Chatbot initialized!');
});
