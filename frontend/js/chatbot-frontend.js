/**
 * Angel Organics AI Chatbot
 * Frontend JavaScript with LangChain Backend Integration
 * Version 2.6
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
        
        console.log('✅ Chatbot initialized with action button support');
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
                if (event.error === 'not-allowed' || event.error === 'service-not-allowed') {
                    this.addMessage({
                        type: 'bot',
                        text: '🎤 Please allow microphone access in your browser to use voice input.',
                        timestamp: new Date()
                    });
                }
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
        if (!this.recognition) {
            this.addMessage({
                type: 'bot',
                text: '🎤 Voice input is not supported in this browser. Please try Chrome, or type your message.',
                timestamp: new Date()
            });
            return;
        }
        if (!this.isListening) {
            this.isListening = true;
            this.recognition.lang = this.language === 'hi' ? 'hi-IN' : 'en-US';
            try {
                this.recognition.start();
            } catch (err) {
                console.error('Could not start voice input:', err);
                this.isListening = false;
                return;
            }
            
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
    
    exportChat() {
        // Built from the messages in this browser, so it works even if the server is asleep
        const data = {
            business: 'Angel Organics',
            exported_at: new Date().toISOString(),
            session_id: this.sessionId,
            messages: this.messages
                .filter(m => !m.isHTML)
                .map(m => ({
                    from: m.type === 'user' ? 'Customer' : 'Angel Organics AI',
                    text: m.text,
                    time: new Date(m.timestamp).toISOString()
                }))
        };
        const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `angel-organics-chat-${Date.now()}.json`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        setTimeout(() => URL.revokeObjectURL(url), 1000);

        this.addMessage({
            type: 'bot',
            text: '✅ Chat history exported successfully!',
            timestamp: new Date()
        });
    }
    
    async exportChatAsPDF() {
        try {
            // Create professional PDF content
            const pdfContent = this.generatePDFContent();
            
            // Create a new window for printing
            const printWindow = window.open('', '_blank');
            if (!printWindow) {
                this.addMessage({
                    type: 'bot',
                    text: '⚠️ Please allow pop-ups for this site to download the chat as PDF.',
                    timestamp: new Date()
                });
                return;
            }
            printWindow.document.write(pdfContent);
            printWindow.document.close();
            
            // Give the new window a moment to render, then open the print dialog
            setTimeout(() => {
                printWindow.focus();
                printWindow.print();
            }, 300);
            
            this.addMessage({
                type: 'bot',
                text: '✅ Opening print dialog to save as PDF...',
                timestamp: new Date()
            });
        } catch (error) {
            console.error('Error generating PDF:', error);
            this.addMessage({
                type: 'bot',
                text: '❌ Error generating PDF. Please try again.',
                timestamp: new Date()
            });
        }
    }
    
    generatePDFContent() {
        const now = new Date();
        const dateStr = now.toLocaleDateString('en-IN', { 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric' 
        });
        const timeStr = now.toLocaleTimeString('en-IN');
        
        let messagesHTML = '';
        this.messages.filter(msg => !msg.isHTML).forEach((msg) => {
            const time = new Date(msg.timestamp).toLocaleTimeString('en-IN', {
                hour: '2-digit',
                minute: '2-digit'
            });
            
            const senderClass = msg.type === 'user' ? 'user-msg' : 'bot-msg';
            const senderLabel = msg.type === 'user' ? 'Customer' : 'Angel Organics AI';
            const icon = msg.type === 'user' ? '👤' : '🐄';
            
            messagesHTML += `
                <div class="chat-message ${senderClass}">
                    <div class="msg-header">
                        <span class="msg-icon">${icon}</span>
                        <span class="msg-sender">${senderLabel}</span>
                        <span class="msg-time">${time}</span>
                    </div>
                    <div class="msg-content">${this.escapeHtml(msg.text)}</div>
                </div>
            `;
        });
        
        return `
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <title>Angel Organics - Chat Conversation</title>
    <style>
        @page {
            size: A4;
            margin: 20mm;
        }
        
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }
        
        body {
            font-family: 'Arial', sans-serif;
            line-height: 1.6;
            color: #333;
            background: #fff;
        }
        
        .pdf-header {
            text-align: center;
            padding: 30px 0;
            border-bottom: 3px solid #28a745;
            margin-bottom: 30px;
        }
        
        .pdf-logo {
            font-size: 48px;
            margin-bottom: 10px;
        }
        
        .pdf-title {
            font-size: 28px;
            color: #28a745;
            font-weight: bold;
            margin-bottom: 5px;
        }
        
        .pdf-subtitle {
            font-size: 16px;
            color: #666;
            margin-bottom: 15px;
        }
        
        .pdf-meta {
            display: flex;
            justify-content: space-between;
            padding: 15px 20px;
            background: #f8f9fa;
            border-radius: 8px;
            margin-bottom: 30px;
        }
        
        .meta-item {
            font-size: 14px;
        }
        
        .meta-label {
            font-weight: bold;
            color: #666;
        }
        
        .meta-value {
            color: #333;
        }
        
        .chat-messages {
            padding: 0;
        }
        
        .chat-message {
            margin-bottom: 25px;
            page-break-inside: avoid;
        }
        
        .msg-header {
            display: flex;
            align-items: center;
            gap: 10px;
            margin-bottom: 8px;
        }
        
        .msg-icon {
            font-size: 20px;
        }
        
        .msg-sender {
            font-weight: bold;
            font-size: 14px;
        }
        
        .msg-time {
            font-size: 12px;
            color: #999;
            margin-left: auto;
        }
        
        .msg-content {
            padding: 15px;
            border-radius: 10px;
            font-size: 14px;
            line-height: 1.8;
            white-space: pre-wrap;
            word-wrap: break-word;
        }
        
        .user-msg .msg-sender {
            color: #2196F3;
        }
        
        .user-msg .msg-content {
            background: #E3F2FD;
            border-left: 4px solid #2196F3;
        }
        
        .bot-msg .msg-sender {
            color: #28a745;
        }
        
        .bot-msg .msg-content {
            background: #f0f8f0;
            border-left: 4px solid #28a745;
        }
        
        .pdf-footer {
            margin-top: 40px;
            padding-top: 20px;
            border-top: 2px solid #e0e0e0;
            text-align: center;
        }
        
        .contact-info {
            display: flex;
            justify-content: center;
            gap: 30px;
            flex-wrap: wrap;
            margin: 20px 0;
        }
        
        .contact-item {
            font-size: 13px;
        }
        
        .contact-icon {
            margin-right: 5px;
        }
        
        .footer-note {
            font-size: 12px;
            color: #666;
            margin-top: 15px;
        }
        
        @media print {
            body {
                print-color-adjust: exact;
                -webkit-print-color-adjust: exact;
            }
            
            .no-print {
                display: none;
            }
        }
    </style>
</head>
<body>
    <div class="pdf-header">
        <div class="pdf-logo">🐄</div>
        <div class="pdf-title">Angel Organics</div>
        <div class="pdf-subtitle">Premium Gir Cow Dairy Farm - Chat Conversation</div>
    </div>
    
    <div class="pdf-meta">
        <div class="meta-item">
            <span class="meta-label">Date:</span>
            <span class="meta-value">${dateStr}</span>
        </div>
        <div class="meta-item">
            <span class="meta-label">Time:</span>
            <span class="meta-value">${timeStr}</span>
        </div>
        <div class="meta-item">
            <span class="meta-label">Messages:</span>
            <span class="meta-value">${this.messages.filter(m => !m.isHTML).length}</span>
        </div>
        <div class="meta-item">
            <span class="meta-label">Session:</span>
            <span class="meta-value">${this.sessionId.substring(0, 20)}...</span>
        </div>
    </div>
    
    <div class="chat-messages">
        ${messagesHTML}
    </div>
    
    <div class="pdf-footer">
        <div class="contact-info">
            <div class="contact-item">
                <span class="contact-icon">📞</span>
                <strong>Phone:</strong> +91 8811013758
            </div>
            <div class="contact-item">
                <span class="contact-icon">📧</span>
                <strong>Email:</strong> drsunilkrai1975@gmail.com
            </div>
            <div class="contact-item">
                <span class="contact-icon">📍</span>
                <strong>Location:</strong> Ajmer, Rajasthan
            </div>
            <div class="contact-item">
                <span class="contact-icon">🌐</span>
                <strong>Instagram:</strong> @angelorganic_ajmer
            </div>
        </div>
        <div class="footer-note">
            This conversation was generated by Angel Organics AI Assistant<br>
            For fresh deliveries of premium A2 milk and organic products, contact us today!
        </div>
    </div>
</body>
</html>`;
    }
    
    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
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
                                <img src="../assets/images/chatbot-avatar.jpg" alt="Angel Organics cow" class="avatar-img">
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
                            <button class="chatbot-action-btn" id="exportPDF" title="Download as PDF">
                                <i class="fas fa-file-pdf"></i>
                            </button>
                            <button class="chatbot-action-btn" id="exportChat" title="Export Chat JSON">
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
        const exportPDFBtn = document.getElementById('exportPDF');
        
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
        
        if (exportPDFBtn) {
            exportPDFBtn.addEventListener('click', () => this.exportChatAsPDF());
        }
        
        document.getElementById('chatbotMessages').addEventListener('click', (e) => {
            const quick = e.target.closest('[data-quick-reply]');
            if (quick) return this.handleQuickReply(quick.dataset.quickReply);
            const order = e.target.closest('[data-order-product]');
            if (order) return this.quickOrder(order.dataset.orderProduct);
            const action = e.target.closest('.action-btn');
            if (action) return this.handleButtonClick(action.dataset.action, action.dataset.url, action.dataset.query);
        });
        
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
            text: `Namaste! 🙏 Welcome to Angel Organics!\n\nI'm your AI assistant with amazing features:\n\n🎤 Voice Input - Click mic to speak\n🔊 Voice Output - Toggle to hear responses\n🌐 Multi-language - Switch between English & Hindi\n📸 Product Gallery - View products with images\n📥 Export Chat - Download conversation\n\nHow can I help you today?`,
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
            'Farm Location 📍',
            'Product Gallery 📸'
        ];
        
        const messagesContainer = document.getElementById('chatbotMessages');
        const repliesHTML = `
            <div class="quick-replies">
                ${quickReplies.map(reply => 
                    `<button type="button" class="quick-reply-btn" data-quick-reply="${this.escapeHtml(reply)}">${this.escapeHtml(reply)}</button>`
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
        
        // Send as user message
        document.getElementById('chatbotInput').value = text;
        this.sendMessage();
    }
    
    showProductGallery() {
        const products = [
            {
                name: 'Fresh A2 Milk',
                price: '₹75/liter',
                image: '../assets/images/11.jpg',
                description: 'Pure Gir cow milk delivered within 6 hours'
            },
            {
                name: 'Golden A2 Ghee',
                price: '₹2500/kg · ₹1300/500g',
                image: '../assets/images/12.jpg',
                description: 'Traditional bilona method ghee'
            },
            {
                name: 'Fresh Butter',
                price: '₹1200/kg',
                image: '../assets/images/35.jpeg',
                description: 'Hand-churned, no preservatives'
            },
            {
                name: 'Probiotic Buttermilk',
                price: '₹30/liter',
                image: '../assets/images/36.avif',
                description: 'Aids digestion naturally'
            },
            {
                name: 'Thick Curd',
                price: '₹100/kg',
                image: '../assets/images/37.webp',
                description: 'Live cultures, protein-rich'
            }
        ];
        
        let galleryHTML = '<div class="chat-gallery">';
        products.forEach(product => {
            galleryHTML += `
                <div class="chat-gallery-card">
                    <img class="chat-gallery-photo" src="${product.image}" alt="${product.name}" loading="lazy">
                    <h4>${product.name}</h4>
                    <p class="chat-gallery-desc">${product.description}</p>
                    <p class="chat-gallery-price">${product.price}</p>
                    <button type="button" class="chat-gallery-btn" data-order-product="${product.name}">
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
            
            console.log('📥 Response from backend:', {
                hasAction: !!responseData.action,
                hasButtons: !!responseData.action?.buttons,
                buttonCount: responseData.action?.buttons?.length || 0
            });
            
            // Remove typing indicator
            this.hideTypingIndicator();
            
            // Add bot response with action data from backend
            this.addMessage({
                type: 'bot',
                text: responseData.response,
                voiceText: responseData.voice_response || responseData.response,
                timestamp: new Date(),
                actionData: responseData.action || null  // Action data comes from backend
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
            const controller = new AbortController();
            const timer = setTimeout(() => controller.abort(), 70000);
            const response = await fetch(this.apiEndpoint, {
                method: 'POST',
                signal: controller.signal,
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    message: message,
                    session_id: this.sessionId,
                    language: this.language
                })
            }).finally(() => clearTimeout(timer));
            
            // Handle rate limiting specifically
            if (response.status === 429) {
                const errorData = await response.json().catch(() => ({}));
                const retryAfter = errorData.retry_after || 10;
                
                return {
                    response: errorData.response || 
                        `⏳ High demand right now! Please wait ${retryAfter} seconds and try again.\n\nOr contact us:\n📱 WhatsApp: +91 8811013758`,
                    voice_response: "Please wait a moment and try again",
                    action: null,
                    isRateLimited: true
                };
            }
            
            if (!response.ok) {
                throw new Error('API request failed');
            }
            
            const data = await response.json();
            if (!data.response) {
                throw new Error('Empty response from server');
            }
            
            // Log sentiment for analytics
            if (data.sentiment) {
                console.log('Message sentiment:', data.sentiment);
            }
            
            // Return response, voice_response, and action data
            return {
                response: data.response,
                voice_response: data.voice_response || data.response, // Fallback to regular response
                action: data.action || null // Include action data from backend
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
        const has = (...words) => words.some(w => msg.includes(w));
        
        // Offline fallback - kept in sync with the prices and details on the website
        if (has('price', 'cost', 'rate', 'kitna', 'product', 'sell', 'milk', 'ghee', 'butter', 'curd', 'dahi', 'buttermilk', 'chaas')) {
            return `🥛 **Our Products & Prices:**\n\n• Fresh Gir Cow A2 Milk - ₹75 per liter\n• Golden A2 Ghee - ₹2500 per kg / ₹1300 for 500gm\n• Fresh Butter - ₹1200 per kg\n• Probiotic Buttermilk - ₹30 per liter\n• Thick Curd - ₹100 per kg\n\n🚚 FREE delivery on all orders\n🎉 5% bulk discount on orders above ₹2000\n\nUse the Bill Calculator on this page to see your total, or WhatsApp us: +91 8811013758`;
        }
        
        if (has('benefit', 'a2', 'health', 'digest')) {
            return `🌟 **A2 Milk Benefits:**\n\n✅ Superior digestibility - easy on the stomach\n✅ Immunity powerhouse\n✅ Stronger bones\n✅ Enhanced brain function\n✅ Muscle development\n✅ Heart health\n\nOur indigenous Gir cows naturally produce 100% A2 milk, with zero hormones, antibiotics, or artificial additives. 🐄`;
        }
        
        if (has('order', 'buy', 'deliver', 'delivery')) {
            return `📦 **How to Order:**\n\n1️⃣ Tap "Add to Bill" on any product, then "Send Bill to WhatsApp"\n2️⃣ Or WhatsApp us directly: +91 8811013758\n3️⃣ Or call: +91 8811013758\n\n🚚 FREE delivery on all orders\n🎉 5% bulk discount on orders above ₹2000\n\nMessage us to confirm delivery to your area. 🙏`;
        }
        
        if (has('location', 'address', 'where', 'visit', 'farm', 'map', 'time', 'hour', 'open')) {
            return `📍 **Visit Our Farm:**\n\nAngel Farm House\nArjunpura Jageer, Ajmer\nRajasthan 305203, India\n\n⏰ Daily: 6:00 AM - 8:00 PM\n📞 +91 8811013758\n🗺️ Directions: https://maps.app.goo.gl/293WBoybHLjSEcer7`;
        }
        
        if (has('contact', 'phone', 'call', 'whatsapp', 'email', 'instagram', 'owner')) {
            return `📞 **Contact Angel Organics:**\n\n👨‍🌾 Dr Sunil Rai\n📱 Phone/WhatsApp: +91 8811013758\n📧 Email: drsunilkrai1975@gmail.com\n📸 Instagram: @angelorganic_ajmer\n📍 Arjunpura Jageer, Ajmer, Rajasthan\n\nWe're here to serve you! 🙏`;
        }
        
        return `I'm here to help! Ask me about:\n\n🥛 Products & Prices\n🌟 A2 Milk Benefits\n📦 How to Order\n📍 Farm Location\n📞 Contact Details\n\nWhat would you like to know?`;
    }
    
    addMessage(message) {
        this.messages.push(message);
        const messagesContainer = document.getElementById('chatbotMessages');
        
        // Generate action buttons HTML if present
        let buttonsHTML = '';
        if (message.actionData && message.actionData.buttons) {
            console.log('✅ Creating buttons:', message.actionData.buttons.length, 'buttons');
            buttonsHTML = this.createActionButtons(message.actionData.buttons);
        } else {
            console.log('⚠️ No action data:', message.actionData);
        }
        
        const messageHTML = `
            <div class="message ${message.type}">
                <div class="message-avatar">
                    ${message.type === 'bot' ? '<img src="../assets/images/chatbot-avatar.jpg" alt="Angel Organics cow" class="avatar-img">' : '👤'}
                </div>
                <div class="message-content">
                    ${message.isHTML ? message.text : this.formatMessage(message.text)}
                    ${buttonsHTML}
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
        return this.escapeHtml(text || '')
            .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
            .replace(/(https?:\/\/[^\s<]+)/g, '<a href="$1" target="_blank" rel="noopener">$1</a>')
            .replace(/\n/g, '<br>');
    }
    
    formatTime(date) {
        return date.toLocaleTimeString('en-US', { 
            hour: '2-digit', 
            minute: '2-digit' 
        });
    }
    
    parseAgenticResponse(response) {
        // Extract JSON action data from response
        const jsonMatch = response.match(/\{[\s\S]*?"action"[\s\S]*?\}/);
        
        if (jsonMatch) {
            try {
                const actionData = JSON.parse(jsonMatch[0]);
                const cleanText = response.replace(jsonMatch[0], '').trim();
                console.log('✅ Parsed action:', actionData.action, '| Buttons:', actionData.buttons?.length);
                return { cleanText, actionData };
            } catch (e) {
                console.error('❌ Failed to parse action data:', e);
            }
        }
        
        return { cleanText: response, actionData: null };
    }
    
    showTypingIndicator() {
        this.isTyping = true;
        const messagesContainer = document.getElementById('chatbotMessages');
        
        const typingHTML = `
            <div class="message bot typing-message">
                <div class="message-avatar"><img src="../assets/images/chatbot-avatar.jpg" alt="Angel Organics cow" class="avatar-img"></div>
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
    
    handleAgenticActions(response) {
        try {
            // Check if response contains JSON with actions
            const jsonMatch = response.match(/\{[\s\S]*?"action"[\s\S]*?\}/);
            if (jsonMatch) {
                const actionData = JSON.parse(jsonMatch[0]);
                
                // Remove JSON from displayed response and add action buttons
                const cleanResponse = response.replace(jsonMatch[0], '').trim();
                
                // Create button HTML if buttons exist
                if (actionData.buttons && actionData.buttons.length > 0) {
                    const buttonsHTML = this.createActionButtons(actionData.buttons);
                    
                    // Add message with buttons
                    setTimeout(() => {
                        const messagesContainer = document.getElementById('chatbotMessages');
                        const lastMessage = messagesContainer.lastElementChild;
                        if (lastMessage) {
                            const contentDiv = lastMessage.querySelector('.message-content');
                            if (contentDiv && !contentDiv.querySelector('.action-buttons')) {
                                contentDiv.insertAdjacentHTML('afterbegin', `
                                    <div class="action-message">${actionData.message || ''}</div>
                                    ${buttonsHTML}
                                `);
                            }
                        }
                    }, 100);
                }
                
                // Handle automatic actions
                if (actionData.action === 'show_gallery') {
                    // Auto-scroll will be triggered by button click
                }
                
                if (actionData.action === 'show_location') {
                    // Auto-scroll will be triggered by button click
                }
            }
        } catch (e) {
            console.debug('No agentic actions in response', e);
        }
    }
    
    createActionButtons(buttons) {
        const buttonsHTML = buttons.map(btn => {
            const action = btn.action || 'default';
            const url = btn.url || '#';
            const text = btn.text || 'Click';
            const query = btn.query || btn.product || '';
            const esc = (v) => this.escapeHtml(String(v));
            
            return `<button type="button" class="action-btn" data-action="${esc(action)}" data-url="${esc(url)}" data-query="${esc(query)}">${esc(text)}</button>`;
        }).join('');
        
        return `<div class="action-buttons">${buttonsHTML}</div>`;
    }
    
    handleButtonClick(action, url, query) {
        console.log('Button clicked:', action, url, query);
        
        switch(action) {
            case 'scroll_to_gallery':
                const gallerySection = document.querySelector('.gallery-section') || 
                                     document.querySelector('[class*="gallery"]');
                if (gallerySection) {
                    gallerySection.scrollIntoView({ behavior: 'smooth', block: 'start' });
                    this.highlightSection(gallerySection);
                }
                break;
                
            case 'scroll_to_map':
                const mapSection = document.querySelector('#location') || 
                                  document.querySelector('.map-section') ||
                                  document.querySelector('iframe[src*="maps"]');
                if (mapSection) {
                    mapSection.scrollIntoView({ behavior: 'smooth', block: 'center' });
                    this.highlightSection(mapSection.closest('section') || mapSection);
                }
                break;
                
            case 'open_url':
            case 'open_whatsapp':
            case 'call':
            case 'whatsapp':
                if (url && url !== '#') {
                    if (url.startsWith('tel:')) {
                        window.location.href = url;
                    } else {
                        window.open(url, '_blank', 'noopener');
                    }
                }
                break;
                
            case 'product':
                if (query) {
                    document.getElementById('chatbotInput').value = `Tell me about ${query}`;
                    this.sendMessage();
                }
                break;
                
            case 'calculate': {
                const calculator = document.getElementById('calculator');
                if (calculator) {
                    calculator.scrollIntoView({ behavior: 'smooth', block: 'start' });
                } else {
                    document.getElementById('chatbotInput').value = 'How do I calculate the price?';
                    this.sendMessage();
                }
                break;
            }
            
            case 'show_contact': {
                const contact = document.getElementById('contact');
                if (contact) {
                    contact.scrollIntoView({ behavior: 'smooth', block: 'start' });
                    this.highlightSection(contact);
                }
                break;
            }
                
            case 'show_all_products':
                document.getElementById('chatbotInput').value = 'Show me all products';
                this.sendMessage();
                break;
                
            case 'order':
                document.getElementById('chatbotInput').value = query ? `I want to order ${query}` : 'I want to place an order';
                this.sendMessage();
                break;
                
            default:
                console.log('Unknown action:', action);
        }
    }
    
    highlightSection(element) {
        if (element) {
            element.style.transition = 'all 0.5s ease';
            element.style.backgroundColor = 'rgba(46, 125, 50, 0.15)';
            element.style.boxShadow = '0 0 20px rgba(46, 125, 50, 0.3)';
            setTimeout(() => {
                element.style.backgroundColor = '';
                element.style.boxShadow = '';
            }, 2000);
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
