
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const axios = require('axios');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(bodyParser.json());

// Confirmed working from Postman
app.get('/api/models', async (req, res) => {
  try {
    const response = await axios.post("https://modelslab.com/api/v4/dreambooth/model_list", {
      key: "ON2hHwPjxtUnKl6rKj39SMj2A68AmxEroxv4COKNsSYSob993XyHnfZzuPTo"
    }, {
      headers: {
        "Content-Type": "application/json"
      }
    });

    res.json({ models: response.data.models || [] });
  } catch (error) {
    console.error("Model list fetch error:", error.message);
    res.status(500).json({ error: "Failed to fetch model list" });
  }
});

// Keep generate endpoint intact
app.post('/api/generate', async (req, res) => {
  const {
    prompt,
    negative_prompt = "",
    model = "sdxl",
    aspect_ratio = "portrait",
    steps = 30,
    cfg_scale = 7,
    samples = 1,
    upscale = ""
  } = req.body;

  try {
    const response = await axios.post("https://api.modelslab.com/v1/stable-diffusion/text-to-image", {
      prompt,
      negative_prompt,
      model,
      aspect_ratio,
      steps,
      cfg_scale,
      samples,
      upscale
    }, {
      headers: {
        "Authorization": `Bearer ON2hHwPjxtUnKl6rKj39SMj2A68AmxEroxv4COKNsSYSob993XyHnfZzuPTo`,
        "Content-Type": "application/json"
      }
    });

    res.json({ image: response.data?.images?.[0] });
  } catch (error) {
    console.error("Image generation error:", error.message);
    res.status(500).json({ error: "Failed to generate image" });
  }
});

app.listen(PORT, () => {
  console.log("✅ Postman-format backend running on port", PORT);
});
