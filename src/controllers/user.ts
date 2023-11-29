import { CreateUser } from "#/@types/user"
import nodemailer from 'nodemailer'
import User from "#/models/user"
import { RequestHandler } from "express"
import { GOOGLE_USER, GOOGLE_PASS } from "#/utils/variables"

export const create: RequestHandler  =  async (req: CreateUser, res) => {

    const { email, password, name } = req.body

    const user = await User.create({ name, email, password })

    //send verification email
    const transport = nodemailer.createTransport({
        service: 'gmail',
        auth: {
          user: GOOGLE_USER,
          pass: GOOGLE_PASS
        }
      });

      transport.sendMail({
        to: user.email,
        from: "auth@yapp.com",
        html: "<h1>123445</h1>"
      })

    res.status(201).json({ user })

}