const axios = require('axios');

const apiKey = 'AIzaSyDvFyeHzlNOKv-Bq6JIlt5_LA4HaWQjm3o';
const url = `https://generativelanguage.googleapis.com/v1beta/models?key=${apiKey}`;

async function listModels() {
    try {
        const response = await axios.get(url);
        console.log('Available models:');
        response.data.models.forEach(model => {
            console.log(`- ${model.name} (${model.supportedGenerationMethods.join(', ')})`);
        });
    } catch (error) {
        console.error('Error listing models:', error.response ? error.response.data : error.message);
    }
}

listModels();
