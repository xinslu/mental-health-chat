const mongoose=require('mongoose');

const userSessionSchema=new mongoose.Schema({
    userId: {
        type: String,
        defualt: -1
    },
    timeStamp:{
        type: Date,
        default: Date.now()
    }
});

module.exports =mongoose.model('UserSession',userSessionSchema)
