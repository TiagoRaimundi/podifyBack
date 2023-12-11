import { generateTemplate } from "#/mail/template";
import emailVerificationToken from "#/models/emailVerificationToken";
import user from "#/models/user";
import { generateToken } from "./helpers";
import { GOOGLE_PASS, GOOGLE_USER, SIGN_IN_URL, VERIFICATION_EMAIL } from "./variables";
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

interface Options {
    email: string
    link: string
}

export const sendForgetPasswordLink = async (options: Options) => {
    const transport = generateMailTransporter()
    
    const { email, link} = options

    
      const message = "We just received a request that you forgot your password. No problem you can use the link below and create brand new password."
      transport.sendMail({

        to: email,
        from: VERIFICATION_EMAIL,
        subject: "Reset Password Link",
        html: generateTemplate({
            title: "Forget Password",
            message,
            logo:"cid:logo",
            banner: "cid:forget_password",
            link, 
            btnTitle: "Reset Password",
        }),
        attachments: [
            {
                filename: "logo.png",
                path: path.join(__dirname, "../mail/logo.png"),
                cid: "logo"
            },
            {
                filename: "forget_password.png",
                path: path.join(__dirname, "../mail/welcome.png"),
                cid: "forget_password"
            }
        ]
      })
}

export const  sendPassResetSuccessEmail = async (name: string, email: string) => {
    const transport = generateMailTransporter()
    
    
      const message = "We just received a request that you forgot your password. No problem you can use the link below and create brand new password."
      transport.sendMail({

        to: email,
        from: VERIFICATION_EMAIL,
        subject: "Password Reset Successfully",
        html: generateTemplate({
            title: "Password Reset Successfully",
            message,
            logo:"cid:logo",
            banner: "cid:forget_password",
            link: SIGN_IN_URL, 
            btnTitle: "login",
        }),
        attachments: [
            {
                filename: "logo.png",
                path: path.join(__dirname, "../mail/logo.png"),
                cid: "logo"
            },
            {
                filename: "forget_password.png",
                path: path.join(__dirname, "../mail/welcome.png"),
                cid: "forget_password"
            }
        ]
      })
}
