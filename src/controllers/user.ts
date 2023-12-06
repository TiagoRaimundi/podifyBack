import { CreateUser, VerifyEmailRequest } from "#/@types/user"
import EmailVerificationToken from "#/models/emailVerificationToken"
import PasswordResetToken from "#/models/passwordResetToken"

import User from "#/models/user"
import { generateToken } from "#/utils/helpers"
import { sendForgetPasswordLink, sendVerificationMail } from "#/utils/mail"
import { CreateUserSchema } from "#/utils/validationSchema"
import { PASSWORD_RESET_LINK } from "#/utils/variables"
import crypto from 'crypto'
import { RequestHandler } from "express"
import { isValidObjectId } from "mongoose"


export const create: RequestHandler = async (req: CreateUser, res) => {

    const { email, password, name } = req.body

    const user = await User.create({ name, email, password })

    CreateUserSchema.validate({ email, password, name }).catch(error => {

    })
    // Send verification email
    const token = generateToken()

    await EmailVerificationToken.create({
        owner:user._id,
        token
    })


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

export const sendReVerificationToken: RequestHandler = async (req, res) => {
    const { userId } = req.body;

    if(!isValidObjectId(userId))return res.status(403).json({error: "Invalid request!"})
    const user = await User.findById(userId)
    if(!user) return res.status(403).json({error: "Invalid request!"})


    await EmailVerificationToken.findOneAndDelete({
        owner: userId
    })
     
    const token = generateToken()
    EmailVerificationToken.create({
        owner: userId,
        token
    })



    sendVerificationMail(token, {
        name: user?.name,
        email: user?.email,
        userId: user?._id.toString(),
       
    })

    res.json({message: "Please check you mail!"})

}

export const generateForgetPasswordLink: RequestHandler = async (req, res) => {
    const { email} = req.body;

    const user = await User.findOne({email})
    if(!user) return res.status(404).json({error: "Account not found!"})

    //generate the link
    //https://yourapp.com/reset-password?token=hfkshf4322hfjkds&userId=

    const token = crypto.randomBytes(36).toString('hex')

    await PasswordResetToken.findOneAndDelete({
        owner: user._id,
        

    })

    await PasswordResetToken.create({
        owner: user._id,
        token
    })

    const resetLink = `${PASSWORD_RESET_LINK}?token=${token}&userId=${user._id}` 

    sendForgetPasswordLink({email: user.email, link: resetLink})

    res.json({ message: "Check you registered mail" })

}

