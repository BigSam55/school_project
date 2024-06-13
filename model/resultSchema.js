const mongoose = require("mongoose");
const {Schema} = mongoose;
const result = new Schema({
    studentName:{
    type:  String,
    require: true, 
    },
    maths:{
        type: Number,
        require:true

    },
    eng:{
        type: Number,
        require:true

    },
    chem:{
        type: Number,
        require:true

    },
    phy:{
        type: Number,
        require:true

    },
    bio:{
        type: Number,
        require:true

    },
    attendance:{
        type: Number,
        require:true

    },

    

    
})

module.exports = mongoose.model('newResult', result);