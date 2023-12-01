import { CreateUser } from '#/@types/user'
import { create, verifyEmail } from '#/controllers/user'
import { validate } from '#/middleware/validator'
import { CreateUserSchema, EmailVerificationBody } from '#/utils/validationSchema'
import { Router } from 'express'

const router = Router()

router.post("/create", validate(CreateUserSchema), create)
router.post("/verify-email", validate(EmailVerificationBody), verifyEmail)

export default router