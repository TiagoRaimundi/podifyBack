import { CreateUser } from '#/@types/user'
import User from '#/models/user'
import { Router } from 'express'

const router = Router()

router.post(
    "/create",
    (req, res, next) => {

        const { email, password, name } = req.body
        if (!name.trim()) return res.json({ error: "Name is missing!" })
        if (name.length < 3) return res.json({ error: 'Invalid name!' })

        next()

    },
    async (req: CreateUser, res) => {
        const { email, password, name } = req.body
        //const newUser = new User ({email, password, name})
        //newUser.save()
        const user = await User.create({ name, email, password })
        res.json({ user })

    })

export default router