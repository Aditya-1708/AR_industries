import fs from "fs";
import path from "path";
import axios from "axios";
import FormData from "form-data";

// ================= CONFIG =================
const API_URL = "http://localhost:3000/api/products";

// ⚠️ Paste your real token here (or use env)
const TOKEN =
  "";

// Absolute path to images (Windows-safe)
const IMG_BASE = path.resolve(
  "../client/src/assets/images"
);

// =========================================

// Axios instance
const api = axios.create({
  baseURL: API_URL,
  headers: {
    Cookie: `token=${TOKEN}`,
  },
  maxBodyLength: Infinity,
});

// Product list
const products = [
  {
    name: "Coal Washing Jig - Mining Equipment",
    img: "cool-washing.webp",
    description:
      "High-efficiency coal washing jig engineered for mineral processing plants, improving coal quality through precise gravity separation and reduced ash content.",
  },
  {
    name: "Distribution Piping - Hydro Power Project",
    img: "distribution-piping-hydro-project.webp",
    description:
      "Precision-fabricated distribution piping systems designed to handle high-pressure water flow in hydroelectric power projects.",
  },
  {
    name: "Bin Frame 4x6 - Batching Plant",
    img: "bin-frame-4x6.webp",
    description:
      "Heavy-duty structural bin frame manufactured for concrete batching plants, ensuring superior load-bearing strength and dimensional accuracy.",
  },
  {
    name: "Bin Frames - Concrete Batching Plant",
    img: "Bin-frames-batching-plant.webp",
    description:
      "Industrial-grade bin frames fabricated for aggregate storage in batching plants, offering long service life and high structural stability.",
  },
  {
    name: "Aggregates and Stone Crusher Components",
    img: "Aggregates-stone-crushers.webp",
    description:
      "Robust fabricated components for stone crushers and aggregate processing plants, designed for continuous operation in harsh mining environments.",
  },
  {
    name: "Rake Mechanism - Thickener Equipment",
    img: "Rake-mechanism-mining-equipment.webp",
    description:
      "Precision-engineered rake mechanisms used in mining thickeners, ensuring efficient sludge movement and sediment discharge.",
  },
  {
    name: "Draft Tube - Hydro Power Project",
    img: "Hydro-project-draft-tube.webp",
    description:
      "Custom-fabricated draft tubes engineered for hydroelectric plants to optimize water discharge and turbine efficiency.",
  },
  {
    name: "Feed Box - Mining Feed Well",
    img: "Feed-box-for-feed-well-mining-equipment.webp",
    description:
      "Heavy-duty feed boxes designed for uniform slurry distribution in mining feed wells and thickener systems.",
  },
  {
    name: "Thickener Feed Well - Iron Ore Mining",
    img: "Iron-ore-thickner-feed-well-mining-equipment.webp",
    description:
      "Engineered feed wells for iron ore thickeners, enabling controlled slurry entry and enhanced settling performance.",
  },
  {
    name: "Bridge Structure - Thickener",
    img: "Bridge-for-thickner.webp",
    description:
      "Structural steel bridges manufactured for mining thickeners, providing stable support for drive mechanisms and maintenance access.",
  },
];

// ================= RUN =================

async function uploadProduct(product) {
  const imagePath = path.join(IMG_BASE, product.img);

  if (!fs.existsSync(imagePath)) {
    throw new Error(`Image not found: ${imagePath}`);
  }

  const form = new FormData();
  form.append("name", product.name);
  form.append("description", product.description);
  form.append("img", fs.createReadStream(imagePath));

  const res = await api.post("/", form, {
    headers: form.getHeaders(),
  });

  return res.data;
}

(async () => {
  console.log("🚀 Seeding products...\n");

  for (const product of products) {
    try {
      console.log(`📦 Uploading: ${product.name}`);
      const data = await uploadProduct(product);
      console.log("✅ Success:", data);
    } catch (err) {
      console.error("❌ Failed:", product.name);
      console.error(err.response?.data || err.message);
    }

    console.log("----------------------------------------\n");
  }

  console.log("🎉 Done");
})();
