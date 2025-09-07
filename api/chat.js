import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

// Simple functions for testing
function sum(num1, num2) {
    return num1 + num2;
}

function isPrime(num) {
    if (num <= 1) return false;
    if (num <= 3) return true;
    if (num % 2 === 0 || num % 3 === 0) return false;
    
    for (let i = 5; i * i <= num; i += 6) {
        if (num % i === 0 || num % (i + 2) === 0) return false;
    }
    return true;
}

async function getCryptoPrice(coin) {
    try {
        console.log('💰 Fetching crypto price for:', coin);
        const response = await fetch(`https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&ids=${coin}`);
        const data = await response.json();
        
        if (data && data.length > 0) {
            const coinData = data[0];
            return {
                name: coinData.name,
                symbol: coinData.symbol.toUpperCase(),
                price: coinData.current_price,
                change24h: coinData.price_change_percentage_24h
            };
        } else {
            return null;
        }
    } catch (error) {
        console.error('💰 Crypto API Error:', error);
        return null;
    }
}

// Simple keyword-based function detection
async function parseMessage(message) {
    const lowerMessage = message.toLowerCase();
    console.log('🔍 Processing message:', lowerMessage);
    
    // Check for crypto first (to avoid conflicts with "what is")
    if (lowerMessage.includes('bitcoin') || lowerMessage.includes('crypto') || lowerMessage.includes('price') ||
        lowerMessage.includes('ethereum') || lowerMessage.includes('btc') || lowerMessage.includes('eth')) {
        console.log('💰 Crypto keyword detected');
        
        // Map common coin names to their API IDs
        const coinMap = {
            'bitcoin': 'bitcoin',
            'btc': 'bitcoin',
            'ethereum': 'ethereum',
            'eth': 'ethereum',
            'dogecoin': 'dogecoin',
            'doge': 'dogecoin',
            'cardano': 'cardano',
            'ada': 'cardano',
            'polkadot': 'polkadot',
            'dot': 'polkadot'
        };
        
        // Try to detect which coin they're asking about
        let detectedCoin = null;
        for (const [key, value] of Object.entries(coinMap)) {
            if (lowerMessage.includes(key)) {
                detectedCoin = value;
                break;
            }
        }
        
        if (detectedCoin) {
            console.log('💰 Detected coin:', detectedCoin);
            try {
                const data = await getCryptoPrice(detectedCoin);
                if (data) {
                    const changeText = data.change24h > 0 ? `+${data.change24h.toFixed(2)}%` : `${data.change24h.toFixed(2)}%`;
                    return `💰 ${data.name} (${data.symbol}): $${data.price.toLocaleString()} (${changeText} 24h)`;
                } else {
                    return "Sorry, I couldn't fetch the price for that cryptocurrency.";
                }
            } catch (err) {
                console.error('💰 Error fetching crypto price:', err);
                return "Sorry, there was an error fetching the cryptocurrency price.";
            }
        } else {
            return "I can help with cryptocurrency prices! Try asking about specific coins like 'bitcoin price', 'ethereum price', or 'dogecoin price'.";
        }
    }
    
    // Check for prime number
    if (lowerMessage.includes('prime')) {
        console.log('🔢 Prime keyword detected');
        // Extract any number from the message
        const numberMatch = lowerMessage.match(/\d+/);
        if (numberMatch) {
            const num = parseInt(numberMatch[0]);
            console.log('🔢 Found number:', num);
            if (!isNaN(num)) {
                const result = isPrime(num);
                console.log('🔢 Prime result:', result);
                return `${num} is ${result ? 'a prime' : 'not a prime'} number.`;
            }
        }
    }
    
    // Math patterns - simplified (but more specific to avoid crypto conflicts)
    if ((lowerMessage.includes('sum') || lowerMessage.includes('add') || lowerMessage.includes('+') || 
        lowerMessage.includes('plus') || lowerMessage.includes('calculate') ||
        (lowerMessage.includes('what is') && /\d+.*\d+/.test(lowerMessage))) && 
        !lowerMessage.includes('price') && !lowerMessage.includes('crypto')) {
        console.log('➕ Math keyword detected');
        
        // Extract all numbers from the message
        const numbers = lowerMessage.match(/\d+/g);
        if (numbers && numbers.length >= 2) {
            const num1 = parseInt(numbers[0]);
            const num2 = parseInt(numbers[1]);
            console.log('➕ Found numbers:', num1, num2);
            
            if (!isNaN(num1) && !isNaN(num2)) {
                const result = sum(num1, num2);
                console.log('➕ Sum result:', result);
                return `The sum of ${num1} and ${num2} is ${result}.`;
            }
        }
    }
    
    // Default response
    return "Hello! I'm AgentVinod. I can help you with:\n- Math calculations (e.g., 'What is 25 + 5?')\n- Prime number checks (e.g., 'Is 17 prime?')\n- Cryptocurrency prices (e.g., 'bitcoin price', 'ethereum price')!";
}

// Vercel serverless function handler
export default async function handler(req, res) {
    // Set CORS headers
    res.setHeader('Access-Control-Allow-Credentials', true);
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
    res.setHeader('Access-Control-Allow-Headers', 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version');
    
    if (req.method === 'OPTIONS') {
        res.status(200).end();
        return;
    }
    
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }
    
    try {
        console.log('📨 Received chat request:', req.body.message);
        
        const { message, history } = req.body;
        
        if (!message) {
            return res.status(400).json({ error: 'Message is required' });
        }
        
        const responseText = await parseMessage(message);
        
        console.log('📤 Sending response:', responseText);
        
        const newHistory = [...(history || [])];
        newHistory.push(
            { role: 'user', parts: [{ text: message }] },
            { role: 'model', parts: [{ text: responseText }] }
        );
        
        res.json({ 
            text: responseText, 
            history: newHistory 
        });
        
    } catch (error) {
        console.error('🚨 API Error:', error);
        res.status(500).json({ error: 'Server error occurred' });
    }
}
