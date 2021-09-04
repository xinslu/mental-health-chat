const User=require('../database/user')
const bcrypt=require('bcryptjs')

const registerUser=(req,res,next)=>{
    const {body}=req;
    const {firstName,
        lastName,
        email,
        userName,
        password}=body;
    console.log(req.body)
        if (!firstName){
            return res.status(400).send({
                success: false,
                message: 'Error: First Name cannot be blank.'
            })
        }
        if (!lastName){
           return res.status(400).send({
                success: false,
                message: 'Error: Last Name cannot be blank.'
            })
        }
        if (!userName){
           return res.status(400).send({
                success: false,
                message: 'Error: User Name cannot be blank.'
            })
        }
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
        const assignUser= async ()=>{
            try{
                query=await User.find({email: emailLower});
                if (query.length>0){
                    return res.status(400).send({
                    success: false,
                    message: 'Error: Account already exsist with this email'
                    })
                }
                const newUser= new User();
                newUser.password=await newUser.getHash(password)
                newUser.email=emailLower;
                newUser.firstName=firstName;
                newUser.lastName=lastName;
                newUser.userName=userName;
                const savedUser= await newUser.save()
                return res.status(201).send({
                    success: true,
                    message: "Registered"
                })
            }catch(error){
                return res.status(500).send({
                    success: false,
                    message: "Error: Server Error"
                })
            }
        }
        assignUser()

    }

module.exports={registerUser}
