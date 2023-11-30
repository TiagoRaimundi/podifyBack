import { CreateUser } from "#/@types/user"
import nodemailer from 'nodemailer'
import User from "#/models/user"
import path from 'path'
import { RequestHandler } from "express"
import emailVerificationToken from "#/models/emailVerificationToken"
import { GOOGLE_USER, GOOGLE_PASS } from "#/utils/variables"
import { generateToken } from "#/utils/helpers"
import { generateTemplate } from "#/mail/template"

export const create: RequestHandler  =  async (req: CreateUser, res) => {

    const { email, password, name } = req.body
    
    const user = await User.create({ name, email, password })
    
    const token = generateToken()
    await emailVerificationToken.create({
        owner: user._id,
        token

    })

    //send verification email
    const transport = nodemailer.createTransport({
        service: 'gmail',
        auth: {
          user: GOOGLE_USER,
          pass: GOOGLE_PASS
        }
      });

      const welcomeMessage = `Hi ${name}, welcome to Podify! There are so much thing that we dp
      for verified users. Use the given OTP to verify your email.`

      transport.sendMail({
        to: user.email,
        from: "auth@yapp.com",
        subject: welcomeMessage,
        html: generateTemplate({
            title: "Welcome to Podify",
            message: welcomeMessage,
            logo:"cid:logo",
            banner: "cid:welcome",
            link: "#",
            btnTitle: token
        }),
        attachments: [
            {
                filename: "logo.png",
                path: path.join(__dirname, "../mail/logo.png"),
                cid: "logo"
            },
            {
                filename: "welcome.png",
                path: path.join(__dirname, "../mail/welcome.png"),
                cid: "welcome"
            }
        ]
      })

    res.status(201).json({ user })

}