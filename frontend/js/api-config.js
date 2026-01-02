// Angel Organics API Configuration
// Automatically detects if running locally or in production

const API_CONFIG = {
    // Use environment-based API URL
    getApiUrl() {
        // Check if running locally
        const isLocal = window.location.hostname === 'localhost' || 
                       window.location.hostname === '127.0.0.1' ||
                       window.location.hostname === '';
        
        if (isLocal) {
            return 'http://localhost:5000';
        } else {
            // Your Render backend URL
            return 'https://angel-organics-backend.onrender.com';
        }
    },
    
    endpoints: {
        chat: '/api/chat',
        health: '/api/health',
        clearHistory: '/api/clear-history'
    },
    
    // Get full endpoint URL
    getChatUrl() {
        return this.getApiUrl() + this.endpoints.chat;
    },
    
    getHealthUrl() {
        return this.getApiUrl() + this.endpoints.health;
    },
    
    getClearHistoryUrl() {
        return this.getApiUrl() + this.endpoints.clearHistory;
    }
};

// Make it globally available
window.API_CONFIG = API_CONFIG;

console.log('🌐 API Configuration loaded:', API_CONFIG.getApiUrl());
