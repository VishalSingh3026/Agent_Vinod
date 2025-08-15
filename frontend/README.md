# AI Agent Frontend

This is the frontend interface for the AI Agent application - a beautiful, modern web interface for interacting with your AI assistant.

## 🎨 Features

- **Modern UI Design** - Beautiful gradients, animations, and responsive layout
- **Real-time Chat** - Interactive chat interface with message history
- **Capability Cards** - Quick access buttons for common AI functions
- **Animations & Effects** - Smooth transitions, particle effects, and loading indicators
- **Mobile Responsive** - Works perfectly on all device sizes

## 📁 Files

### `index.html`
The main HTML structure containing:
- Navigation header with AI branding
- Hero section with animated background
- Chat interface with message bubbles
- Capability cards for quick actions
- Status indicators and loading animations

### `style.css`
Complete styling including:
- Modern color schemes and gradients
- Smooth animations and transitions
- Responsive design for all screen sizes
- Chat bubble styling and layouts
- Navigation and hero section effects

### `script.js`
Frontend JavaScript functionality:
- Chat message handling and display
- HTTP requests to backend API
- Interactive animations and effects
- Capability card click handlers
- Particle effects and easter eggs

## 🎯 Capability Cards

The interface includes quick-access cards for:

1. **Math Operations** 🧮
   - Click to ask: "What is 25 + 37?"
   
2. **Prime Numbers** #️⃣
   - Click to ask: "Is 17 prime?"
   
3. **Crypto Prices** ₿
   - Click to ask: "What is the price of bitcoin?"
   
4. **General Chat** 💬
   - Click to ask: "Hello, how are you?"

## 🌟 Interactive Features

- **Smooth Scrolling** - Navigate between sections seamlessly
- **Typing Animations** - Watch the hero title type out character by character
- **Particle Effects** - Floating particles in the hero section
- **Status Indicator** - Real-time connection status in bottom right
- **Loading Animation** - Elegant typing dots when AI is thinking
- **Easter Egg** - Try the Konami code: ↑↑↓↓←→←→BA

## 📱 Responsive Design

The interface adapts to different screen sizes:
- **Desktop**: Full layout with sidebar capabilities panel
- **Tablet**: Stacked layout with adjusted spacing  
- **Mobile**: Single column with optimized touch targets

## 🎨 Design Elements

- **Fonts**: Google Fonts (Nova Square, Rubik)
- **Icons**: Font Awesome 6.0
- **Colors**: Modern gradient palettes
- **Animations**: CSS keyframes with smooth transitions

## 🔌 Backend Integration

The frontend communicates with the backend via:
- **Endpoint**: `http://localhost:3000/chat`
- **Method**: POST requests with JSON payload
- **Response**: Receives AI responses and conversation history
