const express = require("express");
const bodyParser = require("body-parser");
const fs = require("fs");
const path = require("path");
const port = 3000;

const app = express();

app.get("/", (req, res) => {
  res.send.json({
    message: "Hello World",
  });
});

app.listen(3000, () => {
  console.log(`Server is listening is ${port}...`);
});

app.use(bodyParser.json());

const OLLAMA_API_BASE = 'http://localhost:11434/api';

async function listModels() {
  try {
    const response = await axios.get(`${OLLAMA_API_BASE}/tags`);
    return response.data.models;
  } catch (error) {
    console.error('Error listing models:', error.message);
    return [];
  }
}

async function queryOllama(question, model = 'llama2') {
  const response = await axios.post(`${OLLAMA_API_BASE}/generate`, {
    model: model,
    prompt: question,
    stream: false
  });
  return response.data.response;
}

// Routes
app.get('/models', async (req, res) => {
  try {
    const models = await listModels();
    res.json({ models });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch models' });
  }
});

app.post('/query', async (req, res) => {
  const { question, model = 'llama2' } = req.body;
  
  if (!question) {
    return res.status(400).json({ error: 'Question is required' });
  }

  try {
    const models = await listModels();
    if (!models.includes(model)) {
      return res.status(404).json({ error: `Model "${model}" not found. Available models: ${models.join(', ')}` });
    }

    const answer = await queryOllama(question, model);
    res.json({ answer });
  } catch (error) {
    console.error('Error querying Ollama:', error.message);
    res.status(500).json({ error: 'Failed to query Ollama' });
  }
});

// Start the server
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});