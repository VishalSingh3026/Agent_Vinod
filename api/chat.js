import { GoogleGenAI } from "@google/genai";

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
if (!GEMINI_API_KEY) {
    console.error("GEMINI_API_KEY not found in environment variables.");
}
const ai = new GoogleGenAI({ apiKey: GEMINI_API_KEY });

// --- Your existing functions ---
async function sum(a, b) {
    const result = a + b;
    console.log(`[SUM] Calculating: ${a} + ${b} = ${result}`);
    return result;
}

async function isPrime(num) {
    console.log(`[PRIME] Checking if ${num} is prime...`);
    if (num <= 1) return false;
    if (num <= 3) return true;
    if (num % 2 === 0 || num % 3 === 0) return false;
    
    for (let i = 5; i * i <= num; i += 6) {
        if (num % i === 0 || num % (i + 2) === 0) return false;
    }
    return true;
}

async function getCryptoPrice(symbol) {
    console.log(`[CRYPTO] Fetching price for ${symbol}...`);
    try {
        const response = await fetch(`https://api.coinbase.com/v2/exchange-rates?currency=${symbol.toUpperCase()}`);
        const data = await response.json();
        
        if (data && data.data && data.data.rates && data.data.rates.USD) {
            const price = parseFloat(data.data.rates.USD);
            console.log(`[CRYPTO] ${symbol.toUpperCase()} price: $${price}`);
            return price;
        } else {
            throw new Error('Price data not available');
        }
    } catch (error) {
        console.error(`[CRYPTO] Error fetching price for ${symbol}:`, error.message);
        throw new Error(`Unable to fetch price for ${symbol}. Please check if the symbol is correct.`);
    }
}

// Function calling configuration
const functions = [
    {
        name: "sum",
        description: "Add two numbers together",
        parameters: {
            type: "object",
            properties: {
                a: { type: "number", description: "First number" },
                b: { type: "number", description: "Second number" }
            },
            required: ["a", "b"]
        }
    },
    {
        name: "isPrime",
        description: "Check if a number is prime",
        parameters: {
            type: "object",
            properties: {
                num: { type: "number", description: "Number to check for primality" }
            },
            required: ["num"]
        }
    },
    {
        name: "getCryptoPrice",
        description: "Get the current price of a cryptocurrency in USD",
        parameters: {
            type: "object",
            properties: {
                symbol: { type: "string", description: "Cryptocurrency symbol (e.g., BTC, ETH, ADA)" }
            },
            required: ["symbol"]
        }
    }
];

const availableFunctions = { sum, isPrime, getCryptoPrice };

async function runAgent(userMessage, conversationHistory = []) {
    try {
        console.log(`[AGENT] Processing message: "${userMessage}"`);
        
        const model = ai.getGenerativeModel({ 
            model: "gemini-1.5-flash",
            tools: [{ functionDeclarations: functions }]
        });

        const messages = [
            ...conversationHistory,
            { role: "user", parts: [{ text: userMessage }] }
        ];

        console.log(`[AGENT] Starting chat with ${messages.length} messages in history`);
        const chat = model.startChat({
            history: conversationHistory,
            generationConfig: {
                maxOutputTokens: 1000,
                temperature: 0.7,
            },
        });

        const result = await chat.sendMessage(userMessage);
        const response = result.response;
        
        console.log(`[AGENT] Response received. Function calls: ${response.functionCalls()?.length || 0}`);

        if (response.functionCalls() && response.functionCalls().length > 0) {
            const functionCalls = response.functionCalls();
            const functionResults = [];

            for (const call of functionCalls) {
                const { name, args } = call;
                console.log(`[FUNCTION] Calling ${name} with args:`, args);
                
                if (availableFunctions[name]) {
                    try {
                        const functionResult = await availableFunctions[name](...Object.values(args));
                        functionResults.push({
                            name,
                            content: { result: functionResult }
                        });
                        console.log(`[FUNCTION] ${name} returned:`, functionResult);
                    } catch (error) {
                        console.error(`[FUNCTION] Error in ${name}:`, error.message);
                        functionResults.push({
                            name,
                            content: { error: error.message }
                        });
                    }
                } else {
                    console.error(`[FUNCTION] Unknown function: ${name}`);
                    functionResults.push({
                        name,
                        content: { error: `Unknown function: ${name}` }
                    });
                }
            }

            const followUpResult = await chat.sendMessage(functionResults);
            const finalResponse = followUpResult.response.text();
            
            console.log(`[AGENT] Final response generated`);
            return {
                message: finalResponse,
                history: await chat.getHistory()
            };
        } else {
            const responseText = response.text();
            console.log(`[AGENT] Direct response generated`);
            return {
                message: responseText,
                history: await chat.getHistory()
            };
        }

    } catch (error) {
        console.error('[AGENT] Error:', error);
        return {
            message: "I'm sorry, I encountered an error while processing your request. Please try again.",
            history: conversationHistory,
            error: error.message
        };
    }
}

export default async function handler(req, res) {
    // Enable CORS
    res.setHeader('Access-Control-Allow-Credentials', true);
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
    res.setHeader(
        'Access-Control-Allow-Headers',
        'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
    );

    if (req.method === 'OPTIONS') {
        res.status(200).end();
        return;
    }

    if (req.method !== 'POST') {
        res.status(405).json({ error: 'Method not allowed' });
        return;
    }

    try {
        const { message, history } = req.body;
        
        if (!message) {
            res.status(400).json({ error: 'Message is required' });
            return;
        }

        console.log(`[API] Received message: "${message}"`);
        const result = await runAgent(message, history || []);
        res.json(result);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'An error occurred while processing your request.' });
    }
}
