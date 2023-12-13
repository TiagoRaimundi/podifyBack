
import { create, generateForgetPasswordLink, grantValid, sendReVerificationToken, signIn, updatePassword, verifyEmail } from '#/controllers/user'
import { isValidPassResetToken, mustAuth } from '#/middleware/auth'
import { validate } from '#/middleware/validator'
import { CreateUserSchema, SignInValidationSchema, TokenAndIDValidation, updatePasswordSchema } from '#/utils/validationSchema'
import { Router } from 'express'
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

router.get('/is-auth', mustAuth, (req, res) => {
    res.json({
        profile: req.user,

    })
})
import formidable from 'formidable'
import path from 'path'
import fs from 'fs'


router.post('/update-profile', async (req, res) => {

    if(!req.headers['content-type']?.startsWith("multipart/form-data"))
        return res.status(422).json({error: "Only accepts form-data"})

    const dir = path.join(__dirname, "../public/profiles")

    try {
        await fs.readdirSync(dir)
        
    } catch (error) {
        await fs.mkdirSync(dir)
    }

    //handle the file upload
    const form = formidable({
        uploadDir: dir,
        filename(name, ext, part, form){
            return Date.now() + "_" + part.originalFilename
        },
    })
    form.parse(req, (err, fields, files) => {
       // console.log("fields: ", fields)
       // console.log("files: ", files)

        res.json({ uploaded: true})
    })
})




export default router