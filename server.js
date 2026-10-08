
import express from "express";
import OpenAI from "openai";

const app = express();

app.use(express.json({ limit: "20kb" }));
app.use(express.static("public"));

app.get("/api/health", (req, res) => {
  res.json({ status: "ok", service: "AI Builder Machine" });
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
        error: "Describe what you want to build."
      });
    }

    if (prompt.length > 3000) {
      return res.status(400).json({
        error: "Please keep your request under 3000 characters."
      });
    }

    const client = new OpenAI({
      baseURL: "https://router.huggingface.co/v1",
      apiKey: token
    });

    const result = await client.chat.completions.create({
      model: "openai/gpt-oss-120b:cheapest",
      messages: [
        {
          role: "system",
          content: `You are AI Builder Machine, an expert in Minecraft Bedrock Edition,
redstone, structures, command blocks, and addons.

Help the user build whatever they describe.
Give a materials list and numbered, practical building instructions.
For redstone, explain every connection and input/output.
For large structures, explain dimensions and layers.
For addon requests, explain the required behavior-pack and resource-pack files.
Never claim that you placed blocks in the game or tested a build.
Explain Bedrock limitations honestly.
Use simple language suitable for a beginner on iPad.`
        },
        {
          role: "user",
          content: prompt
        }
      ],
      max_tokens: 1200
    });

    res.json({
      result: result.choices[0]?.message?.content ||
        "The AI returned an empty response."
    });
  } catch (error) {
    console.error("Hugging Face error:", error);

    res.status(500).json({
      error: "AI request failed. Check your Hugging Face token, available credits, and Render logs."
    });
  }
});

const port = process.env.PORT || 3000;

app.listen(port, "0.0.0.0", () => {
  console.log(`AI Builder Machine running on port ${port}`);
});
