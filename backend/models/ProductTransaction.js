import mongoose from 'mongoose';

const productTransactionSchema = new mongoose.Schema({
    id: String,
    title: String,
    description: String,
    price: Number,
    category: String,
    dateOfSale: Date,
    sold: Boolean,
    image:String
});

const ProductTransaction = mongoose.model('ProductTransaction', productTransactionSchema);

export default ProductTransaction;