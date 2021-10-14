const mongoose = require('mongoose');
const mongoosePaginate = require('mongoose-paginate');
const Schema = mongoose.Schema;

const Admin = new Schema({
    id: {
        type: Number,
        unique: true,
        sparse:true
    },
     name: {
        type: String
    },
     email: {
        type: String,
        unique: true,
        sparse:true

    },
    mnumber: {
        type: Number
    },
     password: {
        type: String
    },
    role: {
        type: String
    },
    
    avatar: {
        type: String
    },
    avatar_ext: {
        type: String
    },
    imageUrl: {
        type:String,
    },
    verifycode: {
        type: String,
        default: 0
    },
    is_deleted: {
        type: Number,
        default: 0
    }
});

Admin.plugin(mongoosePaginate);

module.exports = mongoose.model("Admin", Admin);