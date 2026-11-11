import { Router } from "express";
import { validate } from "../middleware/validate";
import { loginSchema, signupSchema } from "../validations/authValidation";
import { getUserByIdController, loginUserController, registerUserController } from "../controllers/user.controller";
import { authenticateToken } from "../middleware/auth.middleware";

const router = Router()

router.post('/signup', validate(signupSchema), registerUserController)
router.post('/login', validate(loginSchema), loginUserController)

// authenticated routes
router.use(authenticateToken)
router.get('/:id', getUserByIdController)

export default router;