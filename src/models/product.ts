import { Model, ObjectId, Schema, model, models } from "mongoose";

// Supondo que você tenha um arquivo separado para categorias de produtos
import { productCategories, productCategoryTypes } from "./product_category";

export interface ProductDocument {
    name: string;
    description: string;
    owner: ObjectId;
    price: number;
    images: {
        url: string;
        publicId: string;
    }[];
    categories: productCategoryTypes[];
    stock: number;
}


const ProductSchema = new Schema<ProductDocument>({
    name: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    owner: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    images: [{
        url: String,
        publicId: String,
        required: true
    }],
    categories: [{
        type: String,
        enum: productCategories
    }],
    stock: {
        type: Number,
        required: true
    }
}, {
    timestamps: true
});

