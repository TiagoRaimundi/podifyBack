import { CreateUser } from '#/@types/user'
import { create, generateForgetPasswordLink,  grantValid,  sendReVerificationToken, signIn, updatePassword, verifyEmail } from '#/controllers/user'
import { isValidPassResetToken } from '#/middleware/auth'
import { validate } from '#/middleware/validator'
import { CreateUserSchema, SignInValidationSchema, TokenAndIDValidation, updatePasswordSchema } from '#/utils/validationSchema'
import { JWT_SECRET } from '#/utils/variables'
import { Router } from 'express'
import { JwtPayload, verify } from 'jsonwebtoken'
import User from "#/models/user"
const router = Router()

router.post("/create", validate(CreateUserSchema), create)
router.post("/verify-email", validate(TokenAndIDValidation), verifyEmail)
router.post("/re-verify-email", sendReVerificationToken)
router.post("/forget-password", generateForgetPasswordLink)
router.post("/verify-pass-reset-token", validate(TokenAndIDValidation), isValidPassResetToken, grantValid)
router.post('/update-password', validate(updatePasswordSchema), isValidPassResetToken, updatePassword)
router.post('/sign-in',
 validate(SignInValidationSchema),
 signIn)

 router.get('/is-auth', async (req, res) => {
    const {authorization} = (req.headers)
    const token = authorization?.split("Bearer ")[1]
    if(!token) res.status(403).json({error: "Unauthorized request!" })

    const payload = verify(token, JWT_SECRET) as JwtPayload
    const id = payload.userId

    const user = await User.findById(id)
    if(!user) return res.status(403).json({error: "Unauthorized request!"})

    res.json({
        profile: { 
            id: user._id, 
            name: user.name, 
            email: user.email, 
            verified: user.verified, 
            avatar: user.avatar?.url, 
            followers: user.followers.length, 
            followings: user.followings.length 
        },
        token
    })
})


export default router