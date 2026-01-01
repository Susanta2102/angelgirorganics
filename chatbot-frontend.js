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
        this.language = 'en'; // Default language
        this.isListening = false;
        this.recognition = null;
        this.synthesis = window.speechSynthesis;
        this.voiceEnabled = false;
        
        this.init();
        this.initVoiceRecognition();
    }
    
    generateSessionId() {
        return 'session_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
    }
    
    initVoiceRecognition() {
        if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
            const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
            this.recognition = new SpeechRecognition();
            this.recognition.continuous = false;
            this.recognition.interimResults = false;
            this.recognition.lang = 'en-US';
            
            this.recognition.onresult = (event) => {
                const transcript = event.results[0][0].transcript;
                document.getElementById('chatbotInput').value = transcript;
                this.sendMessage();
            };
            
            this.recognition.onerror = (event) => {
                console.error('Speech recognition error:', event.error);
                this.stopListening();
            };
            
            this.recognition.onend = () => {
                this.stopListening();
            };
        }
    }
    
    toggleVoice() {
        this.voiceEnabled = !this.voiceEnabled;
        const voiceBtn = document.getElementById('voiceToggle');
        if (voiceBtn) {
            voiceBtn.innerHTML = this.voiceEnabled ? 
                '<i class="fas fa-volume-up"></i>' : 
                '<i class="fas fa-volume-mute"></i>';
            voiceBtn.style.background = this.voiceEnabled ? 
                'linear-gradient(135deg, #28a745, #20c997)' : 
                '#6c757d';
        }
    }
    
    startListening() {
        if (this.recognition && !this.isListening) {
            this.isListening = true;
            this.recognition.lang = this.language === 'hi' ? 'hi-IN' : 'en-US';
            this.recognition.start();
            
            const micBtn = document.getElementById('micButton');
            if (micBtn) {
                micBtn.classList.add('listening');
                micBtn.innerHTML = '<i class="fas fa-microphone-slash"></i>';
            }
        }
    }
    
    stopListening() {
        if (this.recognition && this.isListening) {
            this.isListening = false;
            this.recognition.stop();
            
            const micBtn = document.getElementById('micButton');
            if (micBtn) {
                micBtn.classList.remove('listening');
                micBtn.innerHTML = '<i class="fas fa-microphone"></i>';
            }
        }
    }
    
    speak(text) {
        if (this.voiceEnabled && this.synthesis) {
            // Cancel any ongoing speech
            this.synthesis.cancel();
            
            const utterance = new SpeechSynthesisUtterance(text);
            utterance.lang = this.language === 'hi' ? 'hi-IN' : 'en-US';
            utterance.rate = 0.9;
            utterance.pitch = 1;
            
            this.synthesis.speak(utterance);
        }
    }
    
    toggleLanguage() {
        this.language = this.language === 'en' ? 'hi' : 'en';
        const langBtn = document.getElementById('languageToggle');
        if (langBtn) {
            langBtn.textContent = this.language === 'en' ? '🇬🇧 EN' : '🇮🇳 HI';
        }
        
        // Update recognition language if available
        if (this.recognition) {
            this.recognition.lang = this.language === 'hi' ? 'hi-IN' : 'en-US';
        }
        
        // Show language change message
        this.addMessage({
            type: 'bot',
            text: this.language === 'en' ? 
                'Language switched to English 🇬🇧' : 
                'भाषा हिंदी में बदल गई 🇮🇳',
            timestamp: new Date()
        });
    }
    
    async exportChat() {
        try {
            const response = await fetch(this.apiEndpoint.replace('/chat', '/export-chat'), {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    session_id: this.sessionId
                })
            });
            
            const data = await response.json();
            
            if (data.success) {
                // Create downloadable file
                const blob = new Blob([JSON.stringify(data.messages, null, 2)], 
                    { type: 'application/json' });
                const url = URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = `angel-organics-chat-${Date.now()}.json`;
                document.body.appendChild(a);
                a.click();
                document.body.removeChild(a);
                URL.revokeObjectURL(url);
                
                this.addMessage({
                    type: 'bot',
                    text: '✅ Chat history exported successfully!',
                    timestamp: new Date()
                });
            }
        } catch (error) {
            console.error('Error exporting chat:', error);
        }
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
                        <div class="chatbot-actions">
                            <button class="chatbot-action-btn" id="languageToggle" title="Switch Language">
                                🇬🇧 EN
                            </button>
                            <button class="chatbot-action-btn" id="voiceToggle" title="Toggle Voice">
                                <i class="fas fa-volume-mute"></i>
                            </button>
                            <button class="chatbot-action-btn" id="exportChat" title="Export Chat">
                                <i class="fas fa-download"></i>
                            </button>
                            <button class="chatbot-close" id="chatbotClose">
                                <i class="fas fa-times"></i>
                            </button>
                        </div>
                    </div>
                    
                    <div class="chatbot-messages" id="chatbotMessages">
                        <!-- Messages will be inserted here -->
                    </div>
                    
                    <div class="chatbot-input-area">
                        <button class="mic-button" id="micButton" title="Voice Input">
                            <i class="fas fa-microphone"></i>
                        </button>
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
        const micBtn = document.getElementById('micButton');
        const langBtn = document.getElementById('languageToggle');
        const voiceBtn = document.getElementById('voiceToggle');
        const exportBtn = document.getElementById('exportChat');
        
        toggle.addEventListener('click', () => this.toggleChatbot());
        close.addEventListener('click', () => this.closeChatbot());
        sendBtn.addEventListener('click', () => this.sendMessage());
        
        if (micBtn) {
            micBtn.addEventListener('click', () => {
                if (this.isListening) {
                    this.stopListening();
                } else {
                    this.startListening();
                }
            });
        }
        
        if (langBtn) {
            langBtn.addEventListener('click', () => this.toggleLanguage());
        }
        
        if (voiceBtn) {
            voiceBtn.addEventListener('click', () => this.toggleVoice());
        }
        
        if (exportBtn) {
            exportBtn.addEventListener('click', () => this.exportChat());
        }
        
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
            text: `Namaste! 🙏 Welcome to Angel Organics!\n\nI'm your AI assistant with amazing features:\n\n🎤 Voice Input - Click mic to speak\n🔊 Voice Output - Toggle to hear responses\n🌐 Multi-language - Switch between English & Hindi\n📸 Product Gallery - View products with images\n📦 Order Tracking - Track your orders\n📥 Export Chat - Download conversation\n\nHow can I help you today?`,
            timestamp: new Date()
        };
        
        this.addMessage(welcomeMsg);
        this.showQuickReplies();
        
        // Speak welcome if voice enabled
        if (this.voiceEnabled) {
            this.speak(welcomeMsg.text);
        }
    }
    
    showQuickReplies() {
        const quickReplies = [
            'View Products 🥛',
            'Check Prices 💰',
            'A2 Benefits 🌟',
            'Place Order 📦',
            'Track Order 🔍',
            'Product Gallery 📸'
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
        
        // Handle special quick replies
        if (text.includes('Product Gallery')) {
            this.showProductGallery();
            return;
        }
        
        if (text.includes('Track Order')) {
            this.showOrderTracking();
            return;
        }
        
        // Send as user message
        document.getElementById('chatbotInput').value = text;
        this.sendMessage();
    }
    
    showProductGallery() {
        const products = [
            {
                name: 'Fresh A2 Milk',
                price: '₹75/liter',
                image: '🥛',
                description: 'Pure Gir cow milk delivered within 6 hours'
            },
            {
                name: 'Golden A2 Ghee',
                price: '₹2500/kg',
                image: '🧈',
                description: 'Traditional bilona method ghee'
            },
            {
                name: 'Fresh Butter',
                price: '₹1200/kg',
                image: '🧈',
                description: 'Hand-churned, no preservatives'
            },
            {
                name: 'Probiotic Buttermilk',
                price: '₹30/liter',
                image: '🥤',
                description: 'Aids digestion naturally'
            },
            {
                name: 'Thick Curd',
                price: '₹100/kg',
                image: '🥣',
                description: 'Live cultures, protein-rich'
            }
        ];
        
        let galleryHTML = '<div class="product-gallery">';
        products.forEach(product => {
            galleryHTML += `
                <div class="product-card">
                    <div class="product-icon">${product.image}</div>
                    <h4>${product.name}</h4>
                    <p class="product-desc">${product.description}</p>
                    <p class="product-price">${product.price}</p>
                    <button class="order-product-btn" onclick="angelChatbot.quickOrder('${product.name}')">
                        Order Now
                    </button>
                </div>
            `;
        });
        galleryHTML += '</div>';
        
        this.addMessage({
            type: 'bot',
            text: '📸 **Our Premium Products:**\n\n' + galleryHTML,
            timestamp: new Date(),
            isHTML: true
        });
    }
    
    showOrderTracking() {
        const trackingHTML = `
            <div class="order-tracking-form">
                <h4>🔍 Track Your Order</h4>
                <p>Enter your order ID (e.g., AO-12345678)</p>
                <div class="tracking-input-group">
                    <input type="text" id="orderIdInput" placeholder="AO-XXXXXXXX" />
                    <button onclick="angelChatbot.trackOrder()">Track</button>
                </div>
            </div>
        `;
        
        this.addMessage({
            type: 'bot',
            text: trackingHTML,
            timestamp: new Date(),
            isHTML: true
        });
    }
    
    async trackOrder() {
        const orderId = document.getElementById('orderIdInput').value.trim().toUpperCase();
        if (orderId) {
            document.getElementById('chatbotInput').value = `Track order ${orderId}`;
            this.sendMessage();
        }
    }
    
    quickOrder(productName) {
        document.getElementById('chatbotInput').value = `I want to order ${productName}`;
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
            const responseData = await this.sendToAPI(message);
            
            // Remove typing indicator
            this.hideTypingIndicator();
            
            // Add bot response
            this.addMessage({
                type: 'bot',
                text: responseData.response,
                voiceText: responseData.voice_response, // Clean text for voice
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
                    session_id: this.sessionId,
                    language: this.language
                })
            });
            
            if (!response.ok) {
                throw new Error('API request failed');
            }
            
            const data = await response.json();
            
            // Log sentiment for analytics
            if (data.sentiment) {
                console.log('Message sentiment:', data.sentiment);
            }
            
            // Return both response and voice_response
            return {
                response: data.response,
                voice_response: data.voice_response || data.response // Fallback to regular response
            };
            
        } catch (error) {
            console.error('API Error:', error);
            // Fallback to local responses if API is down
            const localResponse = this.getLocalResponse(message);
            return {
                response: localResponse,
                voice_response: this.removeEmojis(localResponse)
            };
        }
    }
    
    removeEmojis(text) {
        // Remove emojis for voice output
        return text.replace(/[\u{1F600}-\u{1F64F}\u{1F300}-\u{1F5FF}\u{1F680}-\u{1F6FF}\u{1F1E0}-\u{1F1FF}\u{2702}-\u{27B0}\u{24C2}-\u{1F251}\u{1F900}-\u{1F9FF}\u{1FA00}-\u{1FA6F}]/gu, '').trim();
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
                    ${message.isHTML ? message.text : this.formatMessage(message.text)}
                    <div class="message-time">${this.formatTime(message.timestamp)}</div>
                </div>
            </div>
        `;
        
        messagesContainer.insertAdjacentHTML('beforeend', messageHTML);
        this.scrollToBottom();
        
        // Speak bot messages if voice enabled - use voiceText if available
        if (message.type === 'bot' && this.voiceEnabled && !message.isHTML) {
            const textToSpeak = message.voiceText || this.removeEmojis(message.text);
            this.speak(textToSpeak);
        }
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
