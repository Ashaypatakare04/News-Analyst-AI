import { Router, type IRouter } from "express";
import multer from "multer";
import { analyzeUploadedArticle } from "../services/ai.js";

const router: IRouter = Router();

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 20 * 1024 * 1024 },
  fileFilter: (_req, file, cb) => {
    if (file.mimetype.startsWith("image/")) {
      cb(null, true);
    } else {
      cb(new Error("Only image files are allowed"));
    }
  },
});

router.post("/upload", upload.single("image"), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "No image file provided" });
    }

    const base64 = req.file.buffer.toString("base64");
    const result = await analyzeUploadedArticle(base64, req.file.mimetype);
    res.json(result);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to process uploaded image" });
  }
});

export default router;
