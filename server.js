
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
        error: "HF_TOKEN is missing. Add it in Render Environment."
      });
    }

    const prompt = String(req.body?.prompt || "").trim();

    if (!prompt) {
      return res.status(400).json({
        error: "Please describe what you want to build."
      });
    }

    if (prompt.length > 3000) {
      return res.status(400).json({
        error: "Your request is too long. Use fewer than 3000 characters."
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

Help users create Minecraft builds, redstone machines, structures,
command block systems, and behavior/resource pack addons.

For every request:
1. Explain what the build does.
2. List the required materials.
3. Give numbered building instructions.
4. Explain redstone connections and inputs/outputs.
5. Explain dimensions and block placement where relevant.
6. For addons, provide the needed files and explain where they go.
7. Be honest about Bedrock limitations.
8. Never claim you placed blocks in Minecraft or tested a build.
9. Use simple language suitable for an iPad user.`
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
      message = "Authentication failed. Check your HF_TOKEN in Render and make sure it has Inference Providers permission.";
    } else if (error.status === 403) {
      message = "Access denied. Check your Hugging Face token permissions and model access.";
    } else if (error.status === 429) {
      message = "Hugging Face rate limit or credits limit reached. Check your free usage allowance.";
    } else if (error.status === 404) {
      message = "The selected model or provider was not found. Check Hugging Face model availability.";
    } else if (error.status === 503) {
      message = "The model or provider is temporarily unavailable. Try again later.";
    } else if (error.code === "ETIMEDOUT" || error.code === "ECONNABORTED") {
      message = "Hugging Face timed out. Try again later.";
    }

    return res.status(500).json({ error: message });
  }
});

const port = process.env.PORT || 3000;

app.listen(port, "0.0.0.0", () => {
  console.log(`AI Builder Machine listening on port ${port}`);
});
