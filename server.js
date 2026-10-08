
import express from "express";

const app = express();

app.use(express.json({ limit: "20kb" }));
app.use(express.static("public"));

const plans = [
  {
    keywords: [
      "secret redstone piston door",
      "secret piston door",
      "hidden piston door",
      "hidden redstone door",
      "secret entrance",
      "secret door"
    ],
    title: "Secret Redstone Piston Door",
    materials: [
      "2 sticky pistons",
      "2 solid blocks matching your wall",
      "Redstone dust",
      "1 lever or hidden redstone input",
      "Building blocks for the wall",
      "Optional painting or decoration"
    ],
    steps: [
      "Choose a wall where you want a 1-block-wide, 2-block-high secret entrance.",
      "Leave a 1x2 opening for the doorway.",
      "Make a hidden 1-block-deep cavity immediately to one side of the doorway.",
      "Place 2 sticky pistons vertically, one above the other, facing toward the doorway from the side cavity.",
      "Place 2 matching solid blocks in front of the pistons so they can be pushed into the doorway when the pistons extend.",
      "Connect both pistons to the same redstone control. Route the wiring behind the wall and keep it out of sight.",
      "Add a hidden lever, button, or other redstone input in a nearby concealed location.",
      "Test the circuit: powering the pistons should push the blocks into the doorway and close it. Turning the power off should retract the blocks and reopen the entrance.",
      "Cover the wiring and piston cavity with wall blocks, leaving the moving blocks free to travel.",
      "Decorate the wall to hide the entrance. Make sure no decorative blocks obstruct the moving blocks."
    ],
    note: "This is a basic design concept. The exact piston positions and wiring depend on the wall layout. Test the mechanism before covering it."
  },
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
    keywords: ["redstone door", "automatic door"],
    title: "Basic Redstone Door",
    materials: [
      "2 iron doors",
      "4 stone buttons",
      "Building blocks"
    ],
    steps: [
      "Make a two-block-wide doorway.",
      "Place an iron door in each doorway space.",
      "Place buttons beside the doors.",
      "Test each button to confirm the doors open.",
      "Iron doors close when their redstone power turns off."
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
    keywords: ["piston", "piston machine"],
    title: "Piston Machine Starter",
    materials: [
      "Sticky pistons",
      "Redstone dust",
      "Lever",
      "Building blocks"
    ],
    steps: [
      "Choose a block you want a piston to move.",
      "Place a sticky piston facing that block.",
      "Put a lever on a nearby solid block.",
      "Connect the lever to the piston with redstone dust.",
      "Activate the lever and check that the piston moves.",
      "Check the piston direction and wiring if it does not work."
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
        "AI Builder Machine — Offline Mode\n\n" +
        "I don't have a matching template for that request yet.\n\n" +
        "Try one of these:\n" +
        "- Build a house\n" +
        "- Make a secret redstone piston door\n" +
        "- Make a redstone door\n" +
        "- Create a wheat farm\n" +
        "- Make a piston machine\n\n" +
        "No online AI API or paid credits are used."
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
      (plan.note ? "\n\nIMPORTANT\n" + plan.note : "") +
      "\n\nOffline mode: built-in template."
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
