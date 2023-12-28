import { Schema, model } from "mongoose";
import mongoosePaginate from 'mongoose-paginate-v2'

const productSchema = new Schema({
    id: Number,
    nombre: String,
    precio: Number,
    img: String,
    category: Array,
    medidas: String
},{
    versionKey: false
});

productSchema.plugin(mongoosePaginate)

const productModel = model("products", productSchema);


export { productModel };

const cartSchema = new Schema({
    user: String,
    products: [{product:
        {
            type: Schema.Types.ObjectId,
            ref: "products"
        },
        qty: Number
    }]
},{
    versionKey: false
});

cartSchema.plugin(mongoosePaginate)

const cartModel = model("carts", cartSchema);

export { cartModel };