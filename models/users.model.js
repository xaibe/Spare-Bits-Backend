const mongoose = require('mongoose');
const mongoosePaginate = require('mongoose-paginate');
const Schema = mongoose.Schema;

const User = new Schema({
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
    
    Orderrecieved:[{//array of objects
        id:{type: Number,
            unique: true,
            sparse:true
        },
        orderbyemail: {type: String}, 
    confirm:{type:Boolean}
    }],

    myorder:[{//array of objects
        id:{    type: Number,
            unique: true,
            sparse:true
        },
        ordertoemail: {type: String}, 
        confirm:{type:Boolean}
    }],

    mnumber: {
        type: Number
    },

    address:{
        type: String
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

User.plugin(mongoosePaginate);

//User.methods.toJSON = function() {
  //  var obj = this.toObject();
    //delete obj.password;
    //return obj;
  // }
// User.index({'$**': 'text'});

module.exports = mongoose.model("User", User);