
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
        "Authorization": `Bearer ${process.env.MODELSLAB_API_KEY}`,
        "Content-Type": "application/json"
      }
    });

    const imageUrl = response.data?.images?.[0];
    res.json({ image: imageUrl });

  } catch (error) {
    console.error("Generation error:", error.response?.data || error.message);
    res.status(500).json({ error: "Image generation failed" });
  }
});

app.listen(PORT, () => {
  console.log(`DreamFlux backend running on port ${PORT}`);
});
