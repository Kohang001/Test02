// ===============================
// 📦 api/server.js (Vercel Ready)
// ===============================

import express from "express";
import cors from "cors";
import multer from "multer";
import fetch from "node-fetch";

// ✅ ตั้งค่า multer ให้เก็บไฟล์ในหน่วยความจำ
const storageSlip = multer.memoryStorage();
const uploadSlip = multer({ storage: storageSlip });

const app = express();
app.use(cors());
app.use(express.json());

// ✅ ดึง URL ของ Google Apps Script จาก environment variable
const GOOGLE_SCRIPT_URL = process.env.GOOGLE_SCRIPT_URL;

// ✅ ฟังก์ชันส่งข้อมูลไป Google Sheets + Drive
async function sendToGoogleSheets(orderData) {
  try {
    const res = await fetch(GOOGLE_SCRIPT_URL, {
      method: "POST",
      body: JSON.stringify(orderData),
      headers: { "Content-Type": "application/json" },
    });
    const result = await res.text();
    console.log("✅ บันทึกลง Google Sheets/Drive สำเร็จ:", result);
  } catch (err) {
    console.error("❌ ส่งข้อมูลไป Google Sheets/Drive ไม่สำเร็จ:", err.message);
  }
}

// ✅ ฟังก์ชันสร้างข้อมูลตอบกลับ
function buildResponse(shop, req, file) {
  const base64Image = file.buffer.toString("base64");

  const orderData = {
    shop: req.body.shop || shop,
    name: req.body.name,
    room: req.body.room,
    contact: req.body.contact,
    total: req.body.total,
    items: req.body.items,
    filename: file.originalname,
    mimeType: file.mimetype,
    image: base64Image,
  };

  console.log(`📦 ข้อมูลจาก ${shop}:`, orderData);

  // ✅ ส่งข้อมูล + รูปไป Google Sheets/Drive
  sendToGoogleSheets(orderData);

  const readableTime = new Date().toLocaleString("th-TH", { timeZone: "Asia/Bangkok" });

  return {
    message: `✅ เซิร์ฟเวอร์ได้รับออเดอร์ ${shop} และบันทึกสลิปแล้ว!`,
    shop: orderData.shop,
    uploadedAt: readableTime,
  };
}

// ===============================
// ✅ เส้นทางแต่ละร้าน
// ===============================
app.post("/api/shop1/send", uploadSlip.single("slip"), (req, res) => {
  if (!req.file) return res.status(400).json({ message: "❌ ไม่พบไฟล์สลิป" });
  res.json(buildResponse("shop1", req, req.file));
});

app.post("/api/shop2/send", uploadSlip.single("slip"), (req, res) => {
  if (!req.file) return res.status(400).json({ message: "❌ ไม่พบไฟล์สลิป" });
  res.json(buildResponse("shop2", req, req.file));
});

app.post("/api/shop3/send", uploadSlip.single("slip"), (req, res) => {
  if (!req.file) return res.status(400).json({ message: "❌ ไม่พบไฟล์สลิป" });
  res.json(buildResponse("shop3", req, req.file));
});

// ===============================
// ✅ Export handler (สำคัญมากสำหรับ Vercel)
// ===============================
export default app;
