//interface (typescript)
import { Model, ObjectId, Schema, model } from "mongoose"
import {hash, compare } from 'bcrypt'

interface emailVerificationTokenDocument {
    owner: ObjectId
    token: string
    createdAt: Date
}

interface Methods{
    compareToken(token: string): Promise<boolean>
}
//expire them after 1 hrs

const emailVerificationTokenSchema = new Schema<emailVerificationTokenDocument, {}, Methods>(
    {
        owner:{
            type: Schema.Types.ObjectId,
            required: true,
            ref: "User"
        },
        token: {
            type: String,
            required: true
        },
        createdAt: {
            type: Date,
            expires: 3600, // 
            default: Date.now()
        }

    }
)
emailVerificationTokenSchema.pre("save", async function(next){
    if(this.isModified('token')){
        this.token = await hash(this.token, 10)

    }
    next()
})

emailVerificationTokenSchema.methods.compareToken = async function (token){
    const result = await compare(token, this.token)
    return result

}
    

    

export default model("emailVerificationToken", emailVerificationTokenSchema) as Model<emailVerificationTokenDocument, {}, Methods>