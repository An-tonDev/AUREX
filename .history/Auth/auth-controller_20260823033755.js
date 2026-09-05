const prisma=require('../prisma/client')
const bcrypt=require('bcrypt')


const register=async(req,res)=>{
    const {email,password,phoneNumber} = req.body

    const existingUser= await prisma.user.findUnique({where:{email}})

    if(existingUser){
        return res.status(400).json({
            status:'fail',
            message:'user already exists'
        })
    }

    const salt=await bcrypt.genSalt(10)
    const passwordhash= await bcrypt.hash(password,salt)

    const newUser= await prisma.user.create({
        email,
        passwordhash,
        phoneNumber
    })
}