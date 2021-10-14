const mongoose = require('mongoose');
const mongoosePaginate = require('mongoose-paginate');
const Schema = mongoose.Schema;

const Contact = new Schema({
    roomid: {
        type: String,
        required: true,
        unique: true,
    },
    user_id: {
        type: Schema.Types.ObjectId,
        required: true
    },
    user_name: {
        type: String,
        required: true
    },
    user_imageUrl: {
        type:String,
    },
    contacteduser_imageUrl: {
        type:String,
    },
    contacteduser_name: {
        type: String,
        required: true
    },
    contacted_userid:{
        type: Schema.Types.ObjectId,
        required: true
    },
    user_messages:[{//array of objects
        type: new mongoose.Schema(
            {
                message: String,
            
        
            },
            { timestamps: true }
         
        )
    }
    
],

contacteduser_messages:[{//array of objects
    type: new mongoose.Schema(
        {
            message: String,
        
    
        },
        { timestamps: true }
     
    )
}

],
        


   },
     { 
         timestamps:true  //inserts createdat and updatedat
        }
    
     
     
);

Contact.plugin(mongoosePaginate);

module.exports = mongoose.model("Contact", Contact);