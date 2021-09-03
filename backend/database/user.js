const mongoose=require('mongoose')
const bcrypt=require('bcryptjs')

const userSchema = mongoose.Schema({
    firstName: {
        type: String,
        default: ''
    },
    lastName: {
        type: String,
        default: ''
    },
    email: {
        type: String,
        default: ''
    },
    password: {
        type: String,
        default: ''
    }
})

userSchema.methods.getHash=function(password) {
   return bcrypt.hash(password, 10);
}


userSchema.methods.validPassword=function(password) {
    return bcrypt.compare(password, this.password)
}

module.exports=mongoose.model('User', userSchema)
