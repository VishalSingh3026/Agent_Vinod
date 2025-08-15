import { GoogleGenAI } from "@google/genai";
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load environment variables from .env file
dotenv.config({ path: path.join(__dirname, '../.env') });

const app = express();
const port = 3000;

app.use(express.json());
app.use(cors());

// Serve static files from frontend directory
app.use(express.static(path.join(__dirname, '../frontend')));

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
if (!GEMINI_API_KEY) {
    console.error("GEMINI_API_KEY not found in environment variables. Please check your .env file.");
    process.exit(1);
}
const ai = new GoogleGenAI({ apiKey: GEMINI_API_KEY });

// --- Your existing functions ---
function sum({ num1, num2 }) {
  return num1 + num2;
}

function prime({ num }) {
    if (num <= 1) return false;
    for (let i = 2; i < num; i++) {
        if (num % i === 0) return false;
    }
    return true;
}

async function getCryptoPrice({ coin }) {
    try {
        const response = await fetch(`https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&ids=${coin}`);
        const data = await response.json();
        return data;
    } catch (error) {
        return { error: "Could not fetch cryptocurrency price." };
    }
}

// --- Your existing tool declarations ---
const sumDeclaration = {
    name: "sum",
    description: "Get the sum of two numbers.",
    parameters: {
        type: 'OBJECT',
        properties: {
            num1: { type: 'NUMBER', description: 'It will be first number for addition ex:10' },
            num2: { type: 'NUMBER', description: 'It will be second number for addition ex:20' }
        },
        required: ['num1', 'num2']
    },
};

const primeDeclaration = {
    name: "prime",
    description: "Check if a number is prime.",
    parameters: {
        type: 'OBJECT',
        properties: {
            num: { type: 'NUMBER', description: 'It will be the number to find it is prime or not ex:7' },
        },
        required: ['num']
    },
};

const cryptoDeclaration = {
    name: "getCryptoPrice",
    description: "Get the current price of any cryptocurrency like bitcoin.",
    parameters: {
        type: 'OBJECT',
        properties: {
            coin: { type: 'STRING', description: 'It will be crypto Currency name like bitcoin' },
        },
        required: ['coin']
    },
};

const availableTools = {
    sum: sum,
    prime: prime,
    getCryptoPrice: getCryptoPrice
};

// --- Modified runAgent function ---
async function runAgent(userProblem, history) {
    history.push({
        role:'user',
        parts:[{text:userProblem}]
    });

    while(true){    
        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: history,
            config:{
                systemInstruction: `You are AgentVinod, an AI Agent. You have access of 3 available tools: sum, prime, and getCryptoPrice.
                You can use these tools to solve the user's problem. If you need to use a tool, call it with the required parameters.
                if ask general question answer directly if you don't need help from these tools.`,
                tools:[{
                    functionDeclarations:[sumDeclaration,primeDeclaration,cryptoDeclaration]
                }],
            },
        });

        if(response.functionCalls && response.functionCalls.length>0){
            const {name,args} = response.functionCalls[0];

            const funCall = availableTools[name];
            const result = await funCall(args);

            const functionResponsePart = {
                name:name,
                response: {
                    result:result,
                },
            };
            
            // model
            history.push({
                role: "model",
                parts: [
                    {
                        functionCall: response.functionCalls[0],
                    },
                ],
            });
            
            //result ko daalna hai histroy mai
            history.push({
                role: "user",
                parts: [
                    {
                        functionResponse: functionResponsePart,
                    },
                ],
            });
        } else {
            history.push({
                role: 'model',
                parts: [{ text: response.text }]
            });
            break;
        }
    }
    
    // Return for web API instead of console.log
    return { text: response.text, history: history };
}

// --- API Endpoint ---
app.post('/chat', async (req, res) => {
    try {
        const { message, history } = req.body;
        if (!message) {
            return res.status(400).json({ error: 'Message is required' });
        }
        const result = await runAgent(message, history || []);
        res.json(result);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'An error occurred while processing your request.' });
    }
});

// Serve the frontend
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '../frontend/index.html'));
});

app.listen(port, () => {
    console.log(`🚀 AgentVinod Server running on http://localhost:${port}`);
    console.log(`📁 Frontend served from: ${path.join(__dirname, '../frontend')}`);
    console.log(`🤖 Backend API available at: http://localhost:${port}/chat`);
});
