import { toggleFavorite } from "#/controllers/favorite";
import { isVerified, mustAuth } from "#/middleware/auth";
import { Router } from "express";

const router = Router()





//"/favorite?audioId=djcujreoj"

router.post('/', mustAuth, isVerified, toggleFavorite)

export default router