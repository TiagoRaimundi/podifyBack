import {Model, ObjectId, Schema, model, models} from "mongoose"
import { AudioDocument } from "./audio"
import { AudioValidationSchema } from "#/utils/validationSchema"

interface FavoriteDocument {
    owner: ObjectId
    items: ObjectId[]

}

const favoriteSchema = new Schema<FavoriteDocument>({
    owner: {
        type: Schema.Types.ObjectId,
        ref: "User"
    },
    items: [{type: Schema.Types.ObjectId, ref: "Audio"}]

}, {timestamps: true})

const Favorite = models.Favorite || model("Favorite", favoriteSchema)

export default Favorite as Model<FavoriteDocument>