import { Router, type IRouter } from "express";
import { AskQuestionBody } from "@workspace/api-zod";
import { askWithRAG } from "../services/ai.js";

const router: IRouter = Router();

router.post("/ask", async (req, res) => {
  try {
    const parsed = AskQuestionBody.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({ error: "Invalid request body" });
    }

    const { question, conversationHistory = [] } = parsed.data;
    const result = await askWithRAG(question, conversationHistory as { role: string; content: string }[]);
    res.json(result);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to process question" });
  }
});

export default router;
