import express from 'express'
import 'dotenv/config'
import './db'
import path from 'path'

console.log(path.join(__dirname, "./mail/logo.png"))

import authRouter from './routers/auth'
import audioRouter from './routers/audio'

const app = express()


//register our middleware
app.use(express.json())
app.use(express.urlencoded({extended: false}))
app.use(express.static('src/public'))

app.use("/auth", authRouter)
app.use("/audio", audioRouter)

const PORT = process.env.PORT ||8989;

app.listen(PORT, () => {
    console.log('Port is listening on port ' + PORT)
})