import express from "express";
import multer from "multer";
import path from "path";
import fs from "fs";

const router = express.Router();

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "images/");
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  },
});

const upload = multer({
  storage,
  limits: { fileSize: 2 * 1024 * 1024 },
});

router.post("/upload-images", upload.array("images", 6), (req, res) => {
  try {
    const urls = req.files.map(
      (file) => `http://localhost:3000/uploads/${file.filename}`
    );
    res.status(200).json({ imageUrls: urls });
  } catch (err) {
    res.status(500).json({ error: "Image upload failed" });
  }
});

export default router;
