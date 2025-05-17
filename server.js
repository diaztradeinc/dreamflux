
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const axios = require('axios');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(bodyParser.json());

app.get('/api/models', async (req, res) => {
  try {
    const response = await axios.post("https://modelslab.com/api/v4/dreambooth/model_list", {}, {
      headers: {
        "Authorization": `Bearer ${process.env.MODELSLAB_API_KEY}`,
        "Content-Type": "application/json"
      }
    });

    res.json({ models: response.data });
  } catch (error) {
    console.error("Model list error:", error.response?.data || error.message);
    res.status(500).json({ error: "Failed to fetch model list" });
  }
});

app.listen(PORT, () => {
  console.log(`DreamFlux backend running on port ${PORT}`);
});
