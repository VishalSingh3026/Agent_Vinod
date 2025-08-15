# AI Agent Backend

This is the backend server for the AI Agent application.

## 🚀 Features

- **Google Gemini AI Integration** - Powered by Google's Gemini AI model
- **Function Calling** - Supports custom functions for calculations and data retrieval
- **RESTful API** - Clean API endpoints for frontend communication
- **Environment Variables** - Secure API key management

## 🛠️ Available Functions

### 1. Math Operations (`sum`)
- **Purpose**: Calculate the sum of two numbers
- **Example**: "What is 25 + 37?"

### 2. Prime Number Checker (`prime`) 
- **Purpose**: Check if a number is prime
- **Example**: "Is 17 prime?"

### 3. Cryptocurrency Prices (`getCryptoPrice`)
- **Purpose**: Get real-time cryptocurrency prices
- **Example**: "What's the price of bitcoin?"

## 📡 API Endpoints

### POST `/chat`
Send messages to the AI agent and receive responses.

**Request Body:**
```json
{
  "message": "What is 25 + 37?",
  "history": []
}
```

**Response:**
```json
{
  "text": "The sum of 25 and 37 is 62.",
  "history": [...]
}
```

## 🔧 How to Run

1. Make sure you have the `.env` file in the root directory with your `GEMINI_API_KEY`
2. Install dependencies: `npm install`
3. Start the server: `node backend/server.js`
4. Server will run on `http://localhost:3000`

## 🔒 Environment Variables

Create a `.env` file in the root directory:
```
GEMINI_API_KEY=your_gemini_api_key_here
```

## 📁 Project Structure

```
backend/
├── server.js          # Main server file
└── README.md          # This file
```
