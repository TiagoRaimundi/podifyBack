//interface (typescript)

import { Model, ObjectId, Schema, model } from "mongoose"

interface emailVerificationTokenDocument {
    owner: ObjectId
    token: String
    createdAt: Date
}

//expire them after 1 hrs

const emailVerificationTokenSchema = new Schema<emailVerificationTokenDocument>(
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

export default model("emailVerificationToken", emailVerificationTokenSchema) as Model<emailVerificationTokenDocument>