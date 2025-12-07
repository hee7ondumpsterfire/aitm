require('dotenv').config({ path: '.env.local' });
const { GoogleGenerativeAI } = require('@google/generative-ai');

const apiKey = process.env.GEMINI_API_KEY;
const genAI = new GoogleGenerativeAI(apiKey);

async function run() {
    try {
        console.log("Trying gemini-2.0-flash...");
        const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash' });
        const prompt = "Hello, are you working?";
        const result = await model.generateContent(prompt);
        const response = await result.response;
        const text = response.text();
        console.log("Success with gemini-2.0-flash:", text);
    } catch (error) {
        console.error('Error with gemini-2.0-flash:', error.message);
    }
}

run();
