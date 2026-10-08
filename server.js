
import express from "express";
import OpenAI from "openai";

const app = express();
app.use(express.json());
app.use(express.static("public"));

app.get("/api/health", (req, res) => {
  res.json({ status: "AI Builder server is running" });
});

app.post("/api/build", async (req, res) => {
  try {
    if (!process.env.OPENAI_API_KEY) {
      return res.status(500).json({
        error: "The AI API key has not been configured yet."
      });
    }

    const client = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY
    });

    const prompt = String(req.body.prompt || "").slice(0, 4000);

    if (!prompt.trim()) {
      return res.status(400).json({ error: "Enter a build request." });
    }

    const response = await client.responses.create({
      model: "gpt-4.1-mini",
      instructions:
        "You are AI Builder Machine for Minecraft Bedrock. Turn the user's request into a clear Minecraft building plan. Include dimensions, materials, coordinates relative to a starting point, and redstone components if requested. Be honest if a mechanism needs testing. Return a readable plan, not claims that blocks have already been placed.",
      input: prompt
    });

    res.json({ plan: response.output_text });
  } catch (error) {
    console.error("Build request failed:", error.message);
    res.status(500).json({
      error: "The AI request failed. Check the server logs and API settings."
    });
  }
});

const port = process.env.PORT || 3000;
app.listen(port, "0.0.0.0", () => {
  console.log(`AI Builder server listening on port ${port}`);
});
