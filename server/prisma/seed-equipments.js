import fs from "fs";
import path from "path";
import axios from "axios";
import FormData from "form-data";

// ================= CONFIG =================
const API_URL = "http://localhost:3000/api/equipments";

// ⚠️ Use env in real projects
const TOKEN ="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhZG1pbklkIjoxLCJlbWFpbCI6InVtZXN0YWRpdHlhNzJAZ21haWwuY29tIiwiaWF0IjoxNzY5Nzc2NjM2LCJleHAiOjE3Njk3ODAyMzZ9.JGzqRpjHqfZ84QzKbSp9v0QskbHRnSo1M3N06kwlwxs";

// absolute path to equipment images
const IMG_BASE = path.resolve(
  "../client/src/assets/image1"
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

// ================= DATA =================

const equipments = [
  {
    name: "10 Ton OH Crane",
    details: "Overhead cranes with 10-ton capacity each for heavy material handling.",
    description:
      "Our facility houses overhead cranes with a 10-ton lifting capacity each, ensuring safe and efficient handling of heavy structural components during fabrication and assembly.",
    image: "ohcrane.webp",
  },
  {
    name: "Shot Blasting Booth",
    details: "State-of-the-art 10m × 5m blast booth for surface preparation.",
    description:
      "The 10m × 5m shot blasting booth is designed for superior surface cleaning, removing rust, scale, and other impurities, ensuring material readiness for further processing.",
    image: "shotblastbooth.webp",
  },
  {
    name: "Paint Booth",
    details: "Advanced 10m × 5m booth with bottom suction paper filter for smooth coating.",
    description:
      "Equipped with bottom suction and paper filter technology, the paint booth ensures flawless finishing, consistent coating quality, and a dust-free environment for industrial painting.",
    image: "paintbooth.webp",
  },
  {
    name: "Plasma Machine",
    details: "3m × 14m effective cutting machine with Hypertherm power source.",
    description:
      "Highly accurate cutting on large plates up to 14m in length, enabling complex profile cutting with high precision and efficiency.",
    image: "plasmacutting.webp",
  },
  {
    name: "Rolling Machine",
    details: "2.1m × 10mm thick capacity, 4-roll machine from Akyapak, Turkey.",
    description:
      "Capable of rolling steel plates up to 2.1m wide and 10mm thick for cylindrical and conical components.",
    image: "rollingmachine.webp",
  },
];

// ================= UPLOAD =================

async function uploadEquipment(equipment) {
  const imagePath = path.join(IMG_BASE, equipment.image);

  if (!fs.existsSync(imagePath)) {
    throw new Error(`Image not found: ${imagePath}`);
  }

  const form = new FormData();
  form.append("name", equipment.name);
  form.append("details", equipment.details);
  form.append("description", equipment.description);
  form.append("image", fs.createReadStream(imagePath)); // MUST match multer field

  const res = await api.post("/", form, {
    headers: form.getHeaders(),
  });

  return res.data;
}

// ================= RUN =================

(async () => {
  console.log("🚀 Seeding equipments...\n");

  for (const equipment of equipments) {
    try {
      console.log(`🏗️ Uploading: ${equipment.name}`);
      const data = await uploadEquipment(equipment);
      console.log("✅ Success:", data.id);
    } catch (err) {
      console.error("❌ Failed:", equipment.name);
      console.error(err.response?.data || err.message);
    }

    console.log("----------------------------------------\n");
  }

  console.log("🎉 Equipment seeding completed");
})();
