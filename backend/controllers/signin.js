const User=require('../database/user')
const UserSession=require('../database/usersession')
const bcrypt=require('bcryptjs')

const signin=(req,res,next)=>{
    const {body}=req;
    const{
        email,
        password
    }=body
    if (!email){
        return res.status(400).send({
            success: false,
            message: 'Error: Email cannot be blank.'
        })
    }
    if (!password){
        return res.status(400).send({
            success: false,
            message: 'Error: Password cannot be blank.'
        })
    }
    emailLower=email.toLowerCase();
    const prevUser=async ()=>{
            try{
                query=await User.find({email: emailLower});
                if (query.length===0){
                    return res.status(400).send({
                    success: false,
                    message: 'Error: Account Does not exsist'
                    })
                }
                const user=query[0]
                const valid=await user.validPassword(password)
                if (!valid){
                    return res.status(400).send({
                    success: false,
                    message: 'Error: Invalid Password'
                    })
                }
                const NewUserSession=new UserSession()
                NewUserSession.userId=user._id
                const savedUser= await NewUserSession.save()
                res.status(201).send({
                    success: true,
                    message: "Successful login",
                    token: savedUser._id,
                    firstName: user.firstName,
                    lastName: user.lastName
                })
            }catch(error){
                res.status(400).send({
                    sucess: false,
                    message: "Error: Server Error"
            })
        }
    }
    prevUser()
}

module.exports={signin}
