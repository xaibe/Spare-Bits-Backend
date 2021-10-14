const mongoose = require('mongoose');
const mongoosePaginate = require('mongoose-paginate');
const { array } = require('../Config/upload');
const Schema = mongoose.Schema;

const Product = new Schema({
    id: {
        type: Number,
        unique: true,
        sparse:true
    },
    name: {
        type: String
    },
     price: {
        type: Number
    },
    stock:
    {
        type: Number
    },    
    Discount:{
        type:Number
    },
    Delivery_Charges:
    {
        type: Number
    },
    store_id:
    {
        type: String
    },
    store_name:
    {
        type:String
    },
    catageory:
    {
        type: String
    },
    subCatageory:
    {
        type: String
    },
     discription: {
        type: String
    },
    sellername: {
        type:String
    },
    email: {
        type: String
       
    },
    mainimage:{
        type:String
    },
    feedback:[{//array of objects
        name: {type: String}, 
        email: {type: String},
        feed:{type:String} 
    }],
    image_url: {
        type: [String]
    },
    is_deleted: {
        type: Boolean,
        default: false
    }
});

Product.plugin(mongoosePaginate);

module.exports = mongoose.model("Product", Product);