import { Router } from "express";
import { addBookSchema } from "../validations/bookValidation";
import { addBookController, deleteBookByIdController, getAllBooksController, getBookByIdController, updateBookByIdController } from "../controllers/book.controller";
import { validate } from "../middleware/validate";
import { authenticateToken } from "../middleware/auth.middleware";

const router = Router()

router.use(authenticateToken)

router.get('', getAllBooksController)
router.get('/:id',getBookByIdController)
router.delete('/delete-book/:id',deleteBookByIdController)
router.post('/add-book', validate(addBookSchema),addBookController)
router.put('/update-book/:id',updateBookByIdController)

export default router