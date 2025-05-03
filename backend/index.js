import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import path from "path";
import { fileURLToPath } from "url";
import cors from "cors";
import userRouter from "./routes/user-route.js";
import authRouter from "./routes/auth-route.js";
import listingRouter from "./routes/listing-route.js";
import dashboardRoutes from "./routes/dashboard-route.js";
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config();

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("Mongo DB Connected");
  })
  .catch((err) => {
    console.log("Mongo DB Connection Error", err);
  });

const app = express();
app.use(express.json());
app.use(cookieParser());
app.use("/images", express.static(path.join(__dirname, "images")));
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);

app.listen(3000, () => {
  console.log("Server is running on port 3000!!!");
});

// import ImageDetails from "./models/upload-image.js";
// const Images = mongoose.model(ImageDetails, ImageDetailsSchema);

app.use("/api/user", userRouter);
app.use("/api/auth", authRouter);
app.use("/api/listing", listingRouter);
app.use("/uploads", express.static("uploads"));
app.use("/api", dashboardRoutes);

import multer from "multer";
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(__dirname, "images"));
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now();
    cb(null, uniqueSuffix + file.originalname);
  },
});

const upload = multer({ storage: storage });

app.post("/upload-image", upload.single("image"), async (req, res) => {
  console.log(req.body);
  const imageName = req.file.filename;
  try {
    await ImageDetails.create({ image: imageName });
    res.json({ status: "ok" });
  } catch (error) {
    res.json({ status: error });
  }
});

app.get("/get-image", async (req, res) => {
  try {
    const allImages = await ImageDetails.find();
    res.json({ status: "ok", data: allImages });
  } catch (error) {
    res.json({ status: error });
  }
});

app.use((err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  const message = err.message || "Internal Server Error";
  return res.status(statusCode).json({
    success: false,
    statusCode,
    message,
  });
});
