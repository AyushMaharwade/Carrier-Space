const axios = require('axios');

const OLLAMA_API_BASE = 'http://localhost:11434/api';

async function isOllamaRunning() {
  try {
    const response = await axios.get(`${OLLAMA_API_BASE}/tags`);
    console.log('Ollama is running. Available models:', response.data.models);
    return true;
  } catch (error) {
    console.error('Error checking Ollama status:', error.message);
    if (error.code === 'ECONNREFUSED') {
      console.error('Connection refused. Make sure Ollama is running on localhost:11434');
    }
    return false;
  }
}

async function queryOllama(question) {
  if (!(await isOllamaRunning())) {
    console.log('Please start Ollama before running this script.');
    return;
  }

  try {
    const response = await axios.post(`${OLLAMA_API_BASE}/generate`, {
      model: 'llama3.1',
      prompt: question,
      stream: false
    });

    if (response.data && response.data.response) {
      console.log('Ollama response:', response.data.response);
    } else {
      console.log('Unexpected response structure:', JSON.stringify(response.data, null, 2));
    }
  } catch (error) {
    console.error('Error querying Ollama:', error.message);
    if (error.response) {
      console.error('Response status:', error.response.status);
      console.error('Response data:', JSON.stringify(error.response.data, null, 2));
    } else if (error.request) {
      console.error('No response received. Request details:', error.request);
    }
    console.error('Full error object:', JSON.stringify(error, null, 2));
  }
}

// Example usage
const question = "What is the capital of india?";
queryOllama(question);