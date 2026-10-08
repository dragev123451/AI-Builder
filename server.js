
import express from "express";
import OpenAI from "openai";

const app = express();

app.use(express.json({ limit: "20kb" }));
app.use(express.static("public"));

app.get("/api/health", (req, res) => {
  res.json({
    status: "ok",
    service: "AI Builder Machine",
    tokenConfigured: Boolean(process.env.HF_TOKEN)
  });
});

app.post("/api/build", async (req, res) => {
  try {
    const token = process.env.HF_TOKEN;

    if (!token) {
      return res.status(500).json({
        error: "HF_TOKEN is missing in Render Environment."
      });
    }

    const prompt = String(req.body?.prompt || "").trim();

    if (!prompt) {
      return res.status(400).json({
        error: "Describe what you want to build."
      });
    }

    if (prompt.length > 3000) {
      return res.status(400).json({
        error: "Keep your request under 3000 characters."
      });
    }

    const client = new OpenAI({
      baseURL: "https://router.huggingface.co/v1",
      apiKey: token,
      timeout: 60000,
      maxRetries: 0
    });

    console.log("Sending request to Hugging Face...");

    const response = await client.chat.completions.create({
      model: "openai/gpt-oss-120b:cheapest",
      messages: [
        {
          role: "system",
          content: `You are AI Builder Machine, an expert in Minecraft Bedrock Edition.

Help users design builds, redstone machines, structures, command blocks,
and behavior/resource pack addons.

For each request:
- Explain what the build does.
- List required materials.
- Give numbered building instructions.
- Explain redstone connections and inputs/outputs.
- Explain dimensions and block placement.
- For addons, describe the necessary files and their contents.
- Use simple language suitable for a beginner on iPad.
- Be honest about Bedrock limitations.
- Never claim you placed blocks in Minecraft automatically.`
        },
        {
          role: "user",
          content: prompt
        }
      ],
      max_tokens: 1200
    });

    const answer = response.choices?.[0]?.message?.content;

    if (!answer) {
      throw new Error("Hugging Face returned an empty answer.");
    }

    console.log("AI response received successfully.");

    return res.json({ result: answer });
  } catch (error) {
    console.error("Hugging Face request failed:", {
      message: error.message,
      status: error.status,
      code: error.code,
      type: error.type,
      details: error.error
    });

    let message = error.message || "Unknown AI error.";

    if (error.status === 401) {
      message = "Authentication failed. Check your Hugging Face token and its Inference Providers permission.";
    } else if (error.status === 403) {
      message = "Access denied. Check token permissions and model access.";
    } else if (error.status === 429) {
      message = "Rate limit or free credits limit reached. Check your Hugging Face usage.";
    } else if (error.status === 404) {
      message = "Model or provider not found. The selected model may be unavailable.";
    } else if (error.status === 503) {
      message = "The model is temporarily unavailable. Try again later.";
    } else if (
      error.code === "ETIMEDOUT" ||
      error.code === "ECONNABORTED"
    ) {
      message = "Hugging Face timed out. Try again later.";
    }

    return res.status(500).json({ error: message });
  }
});

const port = process.env.PORT || 3000;

app.listen(port, "0.0.0.0", () => {
  console.log(`AI Builder Machine listening on port ${port}`);
});
