const mongoose = require('mongoose');
const mongoosePaginate = require('mongoose-paginate');
const { array } = require('../Config/uploadstore');
const Schema = mongoose.Schema;

const Store = new Schema({
    id: {
        type: Number,
        unique: true,
        sparse:true
    },
    
    name: {
        type: String
    },
    Phone:{
        type:String
    },
    Address1:{
        type:String
    },
    Address2:{
        type:String
    },
    Province:{
        type:String
    },
    City:{
        type:String
    },
    Zipcode:{
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
    email: {
        type: String,
        unique: true,
        sparse:true
       
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
    } 
   
});

Store.plugin(mongoosePaginate);

module.exports = mongoose.model("Store",Store);