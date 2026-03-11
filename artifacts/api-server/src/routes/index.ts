import { Router, type IRouter } from "express";
import healthRouter from "./health.js";
import authRouter from "./auth.js";
import newsRouter from "./news.js";
import askRouter from "./ask.js";
import uploadRouter from "./upload.js";

const router: IRouter = Router();

router.use(healthRouter);
router.use(authRouter);
router.use(newsRouter);
router.use(askRouter);
router.use(uploadRouter);

export default router;
