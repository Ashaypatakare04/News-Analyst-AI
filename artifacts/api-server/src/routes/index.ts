import { Router, type IRouter } from "express";
import healthRouter from "./health.js";
import newsRouter from "./news.js";
import askRouter from "./ask.js";
import uploadRouter from "./upload.js";

const router: IRouter = Router();

router.use(healthRouter);
router.use(newsRouter);
router.use(askRouter);
router.use(uploadRouter);

export default router;
