```js
import express from "express";

const app = express();

app.use(express.json({ limit: "20kb" }));
app.use(express.static("public"));

const plans = [
  {
    name: "Secret Redstone Piston Door",
    keywords: [
      "secret redstone piston door",
      "secret piston door",
      "hidden piston door",
      "hidden redstone door",
      "secret entrance",
      "secret door",
      "piston door"
    ],
    materials: [
      "Sticky pistons",
      "Redstone dust",
      "Redstone repeaters",
      "A lever or button",
      "Solid building blocks matching your wall",
      "Building blocks for the hidden entrance"
    ],
    steps: [
      "Choose a flat wall where you want to hide the entrance.",
      "Plan a doorway that is 1 block wide and 2 blocks tall.",
      "Make a space behind or beside the wall for the piston mechanism.",
      "Position sticky pistons so they can move the matching wall blocks to open and close the entrance. Check their facing direction before placing them.",
      "Connect the pistons to a redstone circuit. Add repeaters if the signal needs timing or extra distance.",
      "Place a lever or button where you can reach it. For a hidden entrance, put the control behind a nearby block or in another concealed spot.",
      "Test the circuit with the wall still open. Make sure the pistons move the blocks completely out of the doorway when activated.",
      "Cover the entrance and wiring with matching wall blocks so the wall looks normal. Leave enough space for every piston and moving block.",
      "Test opening and closing the door several times before finishing the build."
    ],
    note:
      "This is a build plan, not a guaranteed block-by-block circuit. Exact piston positions and redstone wiring depend on the wall layout. Test the mechanism before covering it."
  },
  {
    name: "Basic Redstone Door",
    keywords: [
      "redstone door",
      "automatic door",
      "redstone entrance"
    ],
    materials: [
      "Building blocks",
      "Redstone dust",
      "A lever or button",
      "An iron door or piston mechanism"
    ],
    steps: [
      "Build a doorway in a safe location.",
      "Place an iron door or design a piston door in the opening.",
      "Place a lever or button beside the door.",
      "Connect the control to the door using redstone dust.",
      "Test the door and adjust the wiring if it does not activate.",
      "Hide the wiring with building blocks if desired."
    ],
    note:
      "The exact wiring depends on which type of door you choose."
  },
  {
    name: "Minecraft House",
    keywords: ["house", "starter base", "starter house", "build a home"],
    materials: [
      "Wood planks",
      "Logs",
      "Glass panes",
      "A door",
      "Stairs or slabs",
      "Torches",
      "A crafting table",
      "A bed"
    ],
    steps: [
      "Choose a flat building area.",
      "Mark out the house footprint with blocks.",
      "Build the walls and leave space for a door and windows.",
      "Add a roof using stairs or slabs.",
      "Install the door and windows.",
      "Place torches, a bed, and a crafting table inside.",
      "Add a path or small garden if you want."
    ],
    note: "Change the materials to match your preferred building style."
  },
  {
    name: "Automatic Wheat Farm",
    keywords: ["wheat farm", "automatic farm", "crop farm", "farming"],
    materials: [
      "Dirt or farmland",
      "Water bucket",
      "Wheat seeds",
      "A hoe",
      "Building blocks",
      "Optional fence"
    ],
    steps: [
      "Choose a flat area near your base.",
      "Prepare farmland using a hoe.",
      "Place water nearby to hydrate the farmland.",
      "Plant wheat seeds on the farmland.",
      "Make sure the crops have enough light.",
      "Wait for the wheat to grow, then harvest it.",
      "Replant the seeds to grow another crop."
    ],
    note:
      "This is a simple farm plan. It does not automatically harvest crops."
  },
  {
    name: "Piston Machine",
    keywords: ["piston machine", "piston", "redstone machine"],
    materials: [
      "Pistons or sticky pistons",
      "Redstone dust",
      "A lever or button",
      "Building blocks",
      "Optional redstone repeaters"
    ],
    steps: [
      "Decide what the machine should move.",
      "Place the piston facing the block or object it should move.",
      "Build a redstone path from the piston to a lever or button.",
      "Add repeaters if the signal needs adjusting.",
      "Activate the circuit and observe the piston.",
      "Correct the piston direction or wiring if necessary.",
      "Test the machine several times before decorating it."
    ],
    note:
      "A more complicated machine may need a custom circuit."
  }
];

function createPlan(prompt) {
  const text = String(prompt || "").trim().toLowerCase();

  if (!text) {
    return {
      result: "Please describe what you want to build in Minecraft Bedrock."
    };
  }

  const match = plans.find((plan) =>
    plan.keywords.some((keyword) => text.includes(keyword))
  );

  if (match) {
    return {
      name: match.name,
      materials: match.materials,
      steps: match.steps,
      note: match.note,
      result: [
        `BUILD PLAN: ${match.name}`,
        "",
        "MATERIALS:",
        ...match.materials.map((item) => `- ${item}`),
        "",
        "BUILDING STEPS:",
        ...match.steps.map((step, index) => `${index + 1}. ${step}`),
        "",
        `NOTE: ${match.note}`
      ].join("\n")
    };
  }

  return {
    name: "Build Idea",
    materials: [
      "Building blocks suited to your idea",
      "Any special blocks or items your design requires"
    ],
    steps: [
      `Your request: ${String(prompt).trim()}`,
      "Choose the location and size of your build.",
      "Gather the required blocks and items.",
      "Build a small prototype first.",
      "Test any redstone or moving parts before completing the build."
    ],
    note:
      "This offline version uses saved templates. It does not understand every request like a full AI model. Add a new template in server.js to support another specific build.",
    result: [
      "I don't have a saved template for that exact request yet.",
      "",
      `YOUR REQUEST: ${String(prompt).trim()}`,
      "",
      "STARTER STEPS:",
      "1. Choose the location and size of your build.",
      "2. Gather the blocks and items you need.",
      "3. Build a small prototype first.",
      "4. Test redstone or moving parts before finishing.",
      "",
      "Try asking for a secret redstone piston door, redstone door, house, wheat farm, or piston machine."
    ].join("\n")
  };
}

app.get("/health", (req, res) => {
  res.json({
    status: "ok",
    service: "AI Builder Machine",
    mode: "offline",
    apiRequired: false
  });
});

app.post("/api/build", (req, res) => {
  try {
    const prompt = req.body?.prompt;

    if (typeof prompt !== "string" || !prompt.trim()) {
      return res.status(400).json({
        error: "Type what you want to build first."
      });
    }

    if (prompt.length > 2000) {
      return res.status(400).json({
        error: "Please keep your build request under 2000 characters."
      });
    }

    return res.json(createPlan(prompt));
  } catch (error) {
    console.error("Build error:", error);

    return res.status(500).json({
      error: "Something went wrong while creating your build plan."
    });
  }
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, "0.0.0.0", () => {
  console.log(`AI Builder Machine is running on port ${PORT}`);
  console.log("Mode: offline templates; no AI API key required.");
});
```
