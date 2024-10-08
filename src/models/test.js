const mongoose = require('mongoose')

const testSchma = new mongoose.Schema({
    
 
    name:{
        type:String,
        required:true,
        trim:true
    },
    dob:{
        type:Date,
        required:true,
        trim:true
    },
    country:{
        type:String,
        required:true,
        trim:true
    },
    score:{
        type:Number,
        required:true,
        trim:true
    },
    event:{
        type:String,
        default:"100m",
    },
    avatar:{
        type:String
    }

})

const MensRanking = new mongoose.model("MensRanking", testSchma)

module.exports = MensRanking;