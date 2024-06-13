const mongoose = require("mongoose");
const {Schema} = mongoose;

const students = new Schema({
    Fullname:{
    type:String,
    require:true, 
    },
    
    Username:{
        type:String,
        require:true,
        unique:true,
        minlength:[5,'Username must be greater than 5 characters'] 
    },
    
    Password:{
    type:String,
    require:true,
    minlength:[5,'Password must be greater than 5 characters'] 
},

Email:{
    type:String,
    require: true,
    minlength:[5, "Email must be greater than 5 characters"]
    
},
Phone:{
    type:Number,
    require: true,
},
DOB:{
    type:String,
    require:true,
},
Instructor:{
    type:String,
    require: true,
},

Image:{
        data: Buffer,
        contentType: String,
    },

Role:{
    type: String,
    require: true, 
    },

Active:{
    type:Boolean,
    require: true, 
    },
    myresult:{
        type:  Array,
        default: '' 
        },
    
})

module.exports = mongoose.model('newStudent', students);


/////////////////////////////////////
