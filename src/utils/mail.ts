import { generateTemplate } from "#/mail/template";
import emailVerificationToken from "#/models/emailVerificationToken";
import user from "#/models/user";
import { generateToken } from "./helpers";
import { GOOGLE_PASS, GOOGLE_USER, VERIFICATION_EMAIL } from "./variables";
import nodemailer from 'nodemailer'
import path from 'path'

const generateMailTransporter = () =>{
    const transport = nodemailer.createTransport({
        service: 'gmail',
        auth: {
          user: GOOGLE_USER,
          pass: GOOGLE_PASS
        }
      });

      return transport

}
//send verification email

interface Profile{
    name: string
    email: string
    userId: string

}


export const sendVerificationMail = async (token: string, profile: Profile) => {
    const transport = generateMailTransporter()
    
    const {name, email, userId} = profile
    await emailVerificationToken.create({
        owner: userId,
        token
    
    })
    
      const welcomeMessage = `Hi ${name}, welcome to Podify! There are so much thing that we dp
      for verified users. Use the given OTP to verify your email.`
    
      transport.sendMail({
        to: email,
        from: VERIFICATION_EMAIL,
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
}
