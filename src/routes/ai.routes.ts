import { Router } from "express";
import { authenticateToken } from "../middleware/auth.middleware";
import { handleAIChat } from "../controllers/ai.controller";

const router = Router()

router.use(authenticateToken)

router.post("/chat",handleAIChat)

export default router;