const UserSession=require('../database/usersession')
const User=require('../database/user')

const verify=(req,res,next)=>{
    const {token}=req.query
    verification=async ()=>{
        try{
            var query= await UserSession.find({_id: token})
            if (query.length!=1){
                return res.status(500).send({
                    success: false,
                    message: 'Invalid Token'
                })}else{
                    const query2=await User.find({email: emailLower});
                    const user=query2[0]
                    return res.status(200).send({
                    success: true,
                    message: 'Verified Token',
                    firstName: user.firstName,
                    lastName: user.lastName,
                    userName: user.userName
                    })
                }
        }catch(error){
            return res.status(500).send({
                success: false,
                message: 'Error: Server Error'
            })
        }
    }
    verification()
}

module.exports={verify}
