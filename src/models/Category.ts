import mongoose from 'mongoose';

const CategorySchema = new mongoose.Schema({
    name: {type: String, required: true},
    user: {type: mongoose.Schema.Types.ObjectId, ref: 'User', required: false},
    description: {type: String, required: true}
});

export default mongoose.model('Category', CategorySchema);