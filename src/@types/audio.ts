import { AudioDocument } from "#/models/audio";
import { ObjectId } from "mongoose";

export type PopulateFavList = AudioDocument<{_id: ObjectId, name: string}>