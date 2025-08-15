// AI Agent Chat Functionality
class AIAgent {
    constructor() {
        this.chatMessages = document.getElementById('chatMessages');
        this.userInput = document.getElementById('userInput');
        this.sendButton = document.getElementById('sendButton');
        this.loadingAnimation = document.getElementById('loadingAnimation');
        this.statusIndicator = document.getElementById('statusIndicator');
        this.conversationHistory = [];
        
        this.initializeEventListeners();
        this.addWelcomeMessage();
        this.updateNavbarOnScroll();
    }

    initializeEventListeners() {
        // Send message on button click
        this.sendButton.addEventListener('click', () => this.handleSendMessage());
        
        // Send message on Enter key press
        this.userInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                this.handleSendMessage();
            }
        });

        // Smooth scrolling for navigation links
        document.querySelectorAll('#nav a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', function (e) {
                e.preventDefault();
                const target = document.querySelector(this.getAttribute('href'));
                if (target) {
                    target.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                }
            });
        });
    }

    addWelcomeMessage() {
        // Add some sample AI responses for demo
        setTimeout(() => {
            this.addAIMessage("I can help you with math calculations, check prime numbers, get cryptocurrency prices, and answer general questions. What would you like to try?");
        }, 1000);
    }

    updateNavbarOnScroll() {
        window.addEventListener('scroll', () => {
            const nav = document.getElementById('nav');
            if (window.scrollY > 50) {
                nav.style.height = '100px';
                nav.style.backgroundColor = '#D8EFD3';
            } else {
                nav.style.height = '150px';
                nav.style.backgroundColor = 'rgba(216, 239, 211, 0.95)';
            }
        });
    }

    async handleSendMessage() {
        const message = this.userInput.value.trim();
        if (message === '') return;

        // Add user message
        this.addUserMessage(message);
        
        // Clear input
        this.userInput.value = '';
        
        // Show loading animation
        this.showLoading();
        
        try {
            const response = await fetch('/api/chat', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    message: message,
                    history: this.conversationHistory
                }),
            });

            if (!response.ok) {
                throw new Error('Network response was not ok');
            }

            const data = await response.json();
            
            // Update conversation history with the new state from the server
            this.conversationHistory = data.history;

            this.hideLoading();
            this.addAIMessage(data.text);

        } catch (error) {
            console.error('Error:', error);
            this.hideLoading();
            this.addAIMessage('Sorry, something went wrong. Please make sure the server is running and try again.');
        }
    }

    addUserMessage(message) {
        const messageElement = document.createElement('div');
        messageElement.className = 'message user-message';
        messageElement.innerHTML = `
            <div class="message-avatar">
                <i class="fas fa-user"></i>
            </div>
            <div class="message-content">
                <p>${this.escapeHtml(message)}</p>
                <span class="message-time">${this.getCurrentTime()}</span>
            </div>
        `;
        
        this.chatMessages.appendChild(messageElement);
        this.scrollToBottom();
    }

    addAIMessage(message) {
        const messageElement = document.createElement('div');
        messageElement.className = 'message ai-message';
        messageElement.innerHTML = `
            <div class="message-avatar">
                <i class="fas fa-robot"></i>
            </div>
            <div class="message-content">
                <p>${message}</p>
                <span class="message-time">${this.getCurrentTime()}</span>
            </div>
        `;
        
        this.chatMessages.appendChild(messageElement);
        this.scrollToBottom();
    }

    showLoading() {
        this.loadingAnimation.style.display = 'flex';
        this.updateStatus('AgentVinod is thinking...', 'thinking');
    }

    hideLoading() {
        this.loadingAnimation.style.display = 'none';
        this.updateStatus('AgentVinod Online', 'online');
    }

    updateStatus(message, type) {
        const statusText = this.statusIndicator.querySelector('span');
        const statusDot = this.statusIndicator.querySelector('.status-dot');
        
        statusText.textContent = message;
        
        if (type === 'thinking') {
            statusDot.style.background = '#ffc107';
        } else {
            statusDot.style.background = '#28a745';
        }
    }

    scrollToBottom() {
        this.chatMessages.scrollTop = this.chatMessages.scrollHeight;
    }

    getCurrentTime() {
        const now = new Date();
        return now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    }

    escapeHtml(text) {
        const map = {
            '&': '&amp;',
            '<': '&lt;',
            '>': '&gt;',
            '"': '&quot;',
            "'": '&#039;'
        };
        return text.replace(/[&<>"']/g, function(m) { return map[m]; });
    }
}

// Global function for capability cards
function sendPredefinedMessage(message) {
    const userInput = document.getElementById('userInput');
    userInput.value = message;
    
    // Trigger the send message functionality
    const sendButton = document.getElementById('sendButton');
    sendButton.click();
}

// Smooth reveal animations
function revealElements() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -100px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);

    // Observe elements for animation
    document.querySelectorAll('.capability-card, .chat-container, .capabilities-panel').forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(20px)';
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(el);
    });
}

// Particle animation for hero section
function createParticles() {
    const hero = document.getElementById('page1');
    const particlesContainer = document.createElement('div');
    particlesContainer.className = 'particles-container';
    particlesContainer.style.cssText = `
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        overflow: hidden;
        pointer-events: none;
        z-index: 1;
    `;
    
    hero.appendChild(particlesContainer);
    
    // Create floating particles
    for (let i = 0; i < 50; i++) {
        createParticle(particlesContainer);
    }
}

function createParticle(container) {
    const particle = document.createElement('div');
    particle.style.cssText = `
        position: absolute;
        width: 4px;
        height: 4px;
        background: rgba(255, 255, 255, 0.6);
        border-radius: 50%;
        animation: float ${5 + Math.random() * 10}s linear infinite;
        left: ${Math.random() * 100}%;
        top: ${Math.random() * 100}%;
        animation-delay: ${Math.random() * 5}s;
    `;
    
    container.appendChild(particle);
}

// Add CSS for particle animation
const particleStyle = document.createElement('style');
particleStyle.textContent = `
    @keyframes float {
        0% {
            transform: translateY(100vh) rotate(0deg);
            opacity: 0;
        }
        10% {
            opacity: 1;
        }
        90% {
            opacity: 1;
        }
        100% {
            transform: translateY(-100px) rotate(360deg);
            opacity: 0;
        }
    }
`;
document.head.appendChild(particleStyle);

// Initialize everything when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    // Initialize AI Agent
    const aiAgent = new AIAgent();
    
    // Initialize animations
    revealElements();
    createParticles();
    
    // Add some interactive features
    document.querySelectorAll('.capability-card').forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-5px) scale(1.02)';
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0) scale(1)';
        });
    });

    // Add typing effect to hero text
    const heroTitle = document.querySelector('#page1 h1');
    const originalText = heroTitle.textContent;
    heroTitle.textContent = '';
    
    let i = 0;
    const typeWriter = () => {
        if (i < originalText.length) {
            heroTitle.textContent += originalText.charAt(i);
            i++;
            setTimeout(typeWriter, 100);
        }
    };
    
    setTimeout(typeWriter, 1000);
});

// Add some easter eggs and advanced features
let konami = [];
const konamiCode = [38, 38, 40, 40, 37, 39, 37, 39, 66, 65]; // Up Up Down Down Left Right Left Right B A

document.addEventListener('keydown', function(e) {
    konami.push(e.keyCode);
    if (konami.length > konamiCode.length) {
        konami.shift();
    }
    
    if (konami.toString() === konamiCode.toString()) {
        // Easter egg: Enable developer mode
        document.body.style.background = 'linear-gradient(45deg, #ff6b6b, #4ecdc4, #45b7d1, #96ceb4, #feca57)';
        document.body.style.backgroundSize = '400% 400%';
        document.body.style.animation = 'gradientShift 3s ease infinite';
        
        const aiAgent = window.aiAgent || new AIAgent();
        aiAgent.addAIMessage("🎉 Developer mode activated! You found the easter egg! I'm now running in enhanced mode with extra creativity!");
        
        setTimeout(() => {
            document.body.style.background = '';
            document.body.style.animation = '';
        }, 10000);
    }
});
