import { Router } from "express";
import { authenticateToken } from "../middleware/auth.middleware";
import { validate } from "../middleware/validate";
import { handleAIChat, handleBookDescription } from "../controllers/ai.controller";
import { bookDescriptionSchema } from "../validations/aiValidation";

const router = Router()

router.use(authenticateToken)

router.post("/chat",handleAIChat)
router.post("/generate-book-description",validate(bookDescriptionSchema), handleBookDescription)

export default router;
