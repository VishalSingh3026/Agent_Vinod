import { GoogleGenAI } from "@google/genai";
import readlineSync from 'readline-sync';
import dotenv from 'dotenv';

// Load environment variables from .env file
dotenv.config();

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
if (!GEMINI_API_KEY) {
    console.error("GEMINI_API_KEY not found in environment variables. Please check your .env file.");
    process.exit(1);
}
const ai = new GoogleGenAI({apiKey: GEMINI_API_KEY});

const History=[];

function sum({num1, num2}) {
  return num1 + num2;
}

function prime({num}){
    if (num <= 1) return false;
    for (let i = 2; i < num; i++) {
        if (num % i === 0) return false;
    }
    return true;
}

async function getCryptoPrice({coin}){
    const response = await fetch(`https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&ids=${coin}`);
    const data = await response.json();
    return data;
}

const sumDeclaration = {
    name: "sum",
    description: "Get the sum of two numbers.",
    parameters:{
        type: 'OBJECT',
        properties:{
            num1:{
                type: 'NUMBER',
                description:'It will be first number for addition ex:10'
            },
            num2:{
                type: 'NUMBER',
                description:'It will be second number for addition ex:20'
            }
        },
        required: ['num1', 'num2']
    },
   
};

const primeDeclaration = {
    name: "prime",
    description: "Check if a number is prime.",
    parameters:{
        type: 'OBJECT',
        properties:{
            num:{
                type: 'NUMBER',
                description:'It will be the number to find it is prime or not ex:7'
            },
        },
        required: ['num']
    },
   
};


const cryptoDeclaration = {
    name: "getCryptoPrice",
    description: "Get the current price of any cryptocurrency like bitcoin.",
    parameters:{
        type: 'OBJECT',
        properties:{
            coin:{
                type: 'STRING',
                description:'It will be crypto Currency name like bitcoin'
            },
        },
        required: ['coin']
    },
   
};

const availableTools = {
    sum: sum,
    prime: prime,
    getCryptoPrice: getCryptoPrice
};

async function runAgent(userProblem){

    History.push({
        role:'user',
        parts:[{text:userProblem}]
    });

while(true){    
 const response = await ai.models.generateContent({
    model: "gemini-2.5-flash",
    contents: History,
    config:{
        systemInstruction: `You are a AI Agent, You have access of 3 available tools: sum, prime, and getCryptoPrice.
        You can use these tools to solve the user's problem. If you need to use a tool, call it with the required parameters.
        if ask general question answer directly if you don't need help from these tools.`,
        tools:[{
            functionDeclarations:[sumDeclaration,primeDeclaration,cryptoDeclaration]
        }],
    },
   });

    if(response.functionCalls && response.functionCalls.length>0){
         const {name,args} = response.functionCalls[0];
        //  if(name=='sum'){
        //     sum(args)
        //  }
        //  else if(name=='prime'){
        //     prime(args)
        //  }
        //  else if(name=='getCryptoPrice'){
        //     getCryptoPrice(args)
        //  }

        const funCall = availableTools[name];
        const result = await funCall(args);

        const functionResponsePart = {
          name:name,
          response: {
            result:result,
          },
        };
        // model
        History.push({
          role: "model",
          parts: [
            {
              functionCall: response.functionCalls[0],
            },
          ],
        });
        //result ko daalna hai histroy mai
       History.push({
         role: "user",
         parts: [
           {
             functionResponse: functionResponsePart,
           },
         ],
       });
    }else {
    History.push({
        role: 'model',
        parts: [{ text: response.text }]
    });
    console.log(response.text);
    break;
}

 }
}

async function main(){
    const userProblem = readlineSync.question("Ask me anything-->");
    await runAgent(userProblem);
    main();
}
main();
    




