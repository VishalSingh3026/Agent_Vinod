# AgentVinod 🤖

An intelligent AI assistant powered by Google Gemini AI with a beautiful web interface. AgentVinod can perform calculations, check prime numbers, fetch cryptocurrency prices, and much more!

## 🌟 Features

- **Smart AI Assistant**: Powered by Google Gemini 1.5 Flash
- **Function Calling**: Can perform calculations, check prime numbers, and fetch crypto prices
- **Beautiful Web Interface**: Modern, responsive design
- **Real-time Chat**: Interactive conversation with typing indicators
- **Secure**: API keys are safely stored in environment variables

## 🚀 Quick Deploy to Vercel

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/VishalSingh3026/Agent_Vinod)

## 📦 Manual Deployment Steps

### 1. Clone the Repository
```bash
git clone https://github.com/VishalSingh3026/Agent_Vinod.git
cd Agent_Vinod
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Set Up Environment Variables
- Copy `.env.example` to `.env`
- Add your Google Gemini API key:
```env
GEMINI_API_KEY=your_gemini_api_key_here
```

### 4. Deploy to Vercel

#### Option A: Using Vercel CLI
```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel

# Add environment variable
vercel env add GEMINI_API_KEY
```

#### Option B: Using Vercel Dashboard
1. Go to [vercel.com](https://vercel.com)
2. Import your GitHub repository
3. Add `GEMINI_API_KEY` in environment variables
4. Deploy!

## 🛠️ Local Development

```bash
# Start the development server
npm run dev

# Or start the CLI version
npm run cli
```

## 📁 Project Structure

```
Agent_Vinod/
├── api/
│   └── chat.js          # Vercel serverless function
├── backend/
│   └── server.js        # Express server for local development
├── frontend/
│   ├── index.html       # Main web interface
│   ├── script.js        # Frontend logic
│   └── style.css        # Styling
├── index.js             # CLI version
├── vercel.json          # Vercel configuration
└── package.json         # Dependencies
```

## 🔧 Available Functions

- **Sum**: Add two numbers together
- **Prime Check**: Check if a number is prime
- **Crypto Prices**: Get real-time cryptocurrency prices

## 🔒 Security

- API keys are stored securely in environment variables
- No sensitive data is exposed in the codebase
- CORS enabled for secure cross-origin requests

## 📝 License

MIT License - feel free to use this project for your own purposes!

## 👨‍💻 Created By

**Vishal Singh Chauhan**

---

Made with 💻 and powered by Google Gemini AI
