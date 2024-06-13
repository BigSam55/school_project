const mongoose = require("mongoose");
const {Schema} = mongoose;
const teacher = new Schema({
    fullname:{
    type:  String,
    require: true, 
    },

    username:{
        type: String,
        require: true,
        unique: true,
        minlength:[5,'Username must be greater than 5 characters'] 
    },
    
    password:{
    type: String,
    require: true,
    minlength:[5,'Password must be greater than 5 characters'] 
},

email:{
    type:String,
    require: true,
},
phone:{
    type: Number,
    require: true,
},

image:{
        data: Buffer,
        contentType: String,
    },
    
    role:{
    type:  String,
    require: true, 
    },
students:{
    type:  Array,
    default: '' 
    },
    
})

module.exports = mongoose.model('newTeacher', teacher);