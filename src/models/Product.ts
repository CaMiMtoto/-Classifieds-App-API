import mongoose, {Schema} from "mongoose";

const ProductSchema: Schema = new Schema({
        name: {type: String, required: true},
        user: {type: Schema.Types.ObjectId, ref: 'User', required: true},
        category: {type: Schema.Types.ObjectId, ref: 'Category', required: true},
        shortDescription: {type: String, required: true},
        price: {type: Number, required: true},
        image: {type: String, required: true},
        manufacturingDate: {type: Date, required: true},
    }
);
export default mongoose.model('Product', ProductSchema);