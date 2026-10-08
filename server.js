
import express from "express";

const app = express();

app.use(express.json({ limit: "20kb" }));
app.use(express.static("public"));

const plans = [
  {
    keywords: ["house", "home", "starter base"],
    title: "Simple Minecraft House",
    materials: [
      "Oak planks",
      "Oak logs",
      "Glass panes",
      "Oak door",
      "Torches",
      "Stairs and slabs"
    ],
    steps: [
      "Choose a flat area and mark a 5x5 floor.",
      "Build the floor using oak planks.",
      "Place logs at the four corners, four blocks high.",
      "Connect the corners with planks to make the walls.",
      "Leave an opening for the door and spaces for windows.",
      "Add glass panes and the door.",
      "Build a sloped roof with stairs and slabs.",
      "Place torches inside and outside."
    ]
  },
  {
    keywords: ["redstone door", "automatic door", "secret door"],
    title: "Basic Redstone Door",
    materials: [
      "2 iron doors",
      "4 stone buttons",
      "Redstone dust",
      "Building blocks"
    ],
    steps: [
      "Make a two-block-wide doorway.",
      "Place one iron door in each doorway space.",
      "Place a stone button on the wall outside.",
      "Place another button on the inside wall.",
      "For a simple button-operated door, position each button beside its door so it powers the door directly.",
      "Test each button. Iron doors close automatically after their short powered opening."
    ]
  },
  {
    keywords: ["farm", "wheat farm", "crop farm"],
    title: "Basic Wheat Farm",
    materials: [
      "Dirt",
      "Water bucket",
      "Wheat seeds",
      "Hoe",
      "Torches"
    ],
    steps: [
      "Make a 9x9 dirt plot.",
      "Dig one block in the centre and fill it with water.",
      "Use a hoe on the dirt to create farmland.",
      "Plant wheat seeds on the farmland.",
      "Place torches nearby for light.",
      "Wait for the wheat to mature, then harvest it."
    ]
  },
  {
    keywords: ["piston", "piston door", "redstone machine"],
    title: "Piston Machine Starter",
    materials: [
      "Sticky pistons",
      "Redstone dust",
      "Lever",
      "Building blocks"
    ],
    steps: [
      "Choose the block you want the piston to move.",
      "Place a sticky piston facing that block.",
      "Put a lever on a nearby solid block.",
      "Connect the lever to the piston with redstone dust.",
      "Activate the lever and check that the piston moves.",
      "If it does not work, check the piston direction and the redstone connection."
    ]
  }
];

function createPlan(prompt) {
  const text = prompt.toLowerCase();

  const plan = plans.find(item =>
    item.keywords.some(keyword => text.includes(keyword))
  );

  if (!plan) {
    return {
      result:
        "AI Builder Machine (offline mode)\n\n" +
        "I don't have a built-in template for that request yet.\n\n" +
        "Try asking for a house, redstone door, wheat farm, or piston machine.\n\n" +
        "No API key or paid AI service is used."
    };
  }

  return {
    result:
      plan.title + "\n\n" +
      "MATERIALS\n" +
      plan.materials.map(item => "- " + item).join("\n") +
      "\n\nBUILD STEPS\n" +
      plan.steps.map((item, index) =>
        (index + 1) + ". " + item
      ).join("\n") +
      "\n\nOffline mode: this plan was generated from a built-in template."
  };
}

app.get("/api/health", (req, res) => {
  res.json({
    status: "ok",
    service: "AI Builder Machine",
    mode: "offline",
    apiRequired: false
  });
});

app.post("/api/build", (req, res) => {
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

  res.json(createPlan(prompt));
});

const port = process.env.PORT || 3000;

app.listen(port, "0.0.0.0", () => {
  console.log("AI Builder Machine running in offline-template mode.");
});
