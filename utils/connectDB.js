require('dotenv').config()
const mongoose = require('mongoose')

function connectDB(){
    try {
        console.log('connecting to db')
        mongoose.connect(process.env.dbLink,{
            useNewUrlParser:true,
            useUnifiedTopology:true})
        console.log('connected')
    } catch (error) {
        console.log(error)
    }
}

module.exports = connectDB