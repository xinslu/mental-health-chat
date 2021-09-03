const UserSession=require('../database/usersession')

const logout=(req,res,next)=>{
    const {token}=req.query
    logingout=async ()=>{
        try{
            var query= await UserSession.find({_id: token})
            if (query.length!=1){
                return res.status(500).send({
                    success: false,
                    message: 'Invalid Token'
                })
            }else{
                result= await UserSession.deleteOne(query[0])
                return res.status(200).send({
                    success: true,
                    message: 'Logged Out'
                })
            }
        }catch(error){
            return res.status(500).send({
                success: false,
                message: 'Error: Server Error'
            })
        }
    }
    logingout()
}

module.exports={logout}
