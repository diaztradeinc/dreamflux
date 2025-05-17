
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const axios = require('axios');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(bodyParser.json());

app.post('/api/generate', async (req, res) => {
  const { prompt, model, aspect_ratio } = req.body;

  try {
    const response = await axios.post("https://api.modelslab.com/v1/stable-diffusion/text-to-image", {
      prompt,
      model: model || "sdxl",
      negative_prompt: "",
      samples: 1,
      steps: 30,
      aspect_ratio: aspect_ratio || "portrait"
    }, {
      headers: {
        "Authorization": `Bearer ${process.env.MODELSLAB_API_KEY}`,
        "Content-Type": "application/json"
      }
    });

    const imageUrl = response.data?.images?.[0];
    res.json({ image: imageUrl });

  } catch (error) {
    console.error("Modelslab Error:", error.response?.data || error.message);
    res.status(500).json({ error: "Image generation failed" });
  }
});

app.listen(PORT, () => {
  console.log(`DreamFlux backend running on port ${PORT}`);
});
