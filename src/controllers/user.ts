import { CreateUser } from "#/@types/user"

import User from "#/models/user"
import { generateToken } from "#/utils/helpers"
import { sendVerificationMail } from "#/utils/mail"

import { RequestHandler } from "express"


export const create: RequestHandler  =  async (req: CreateUser, res) => {

    const { email, password, name } = req.body
    
    const user = await User.create({ name, email, password })
    
    // Send verification email
    const token = generateToken()
    sendVerificationMail(token, {name, email, userId:user._id.toString()})

    res.status(201).json({ user: {id: user._id, name, email} })
}