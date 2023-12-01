import { CreateUser, VerifyEmailRequest } from "#/@types/user"
import EmailVerificationToken from "#/models/emailVerificationToken"

import User from "#/models/user"
import { generateToken } from "#/utils/helpers"
import { sendVerificationMail } from "#/utils/mail"
import { CreateUserSchema } from "#/utils/validationSchema"

import { RequestHandler } from "express"


export const create: RequestHandler = async (req: CreateUser, res) => {

    const { email, password, name } = req.body

    const user = await User.create({ name, email, password })

    CreateUserSchema.validate({ email, password, name }).catch(error => {

    })
    // Send verification email
    const token = generateToken()
    sendVerificationMail(token, { name, email, userId: user._id.toString() })

    res.status(201).json({ user: { id: user._id, name, email } })
}

export const verifyEmail: RequestHandler = async (req: VerifyEmailRequest, res) => {
    const { token, userId } = req.body;

    const verificationToken = await EmailVerificationToken.findOne({
        owner: userId
    })

    if (!verificationToken) return res.status(403).json({ error: "Invalid token!" })

    const matched = await verificationToken.compareToken(token)
    if (!matched) return res.status(403).json({ error: "Invalid token!" })

    await User.findByIdAndUpdate(userId, {
        verified: true
    })
    await EmailVerificationToken.findByIdAndDelete(verificationToken._id)

    res.json({messge: "Your email is verified"})
}