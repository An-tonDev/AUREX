const {prisma}=require('../prisma/client')
const bcrypt=require('bcrypt')
const catchAsync=require('../utils/catchAsync')
const generateToken=require('../utils/genrateToken')


const register=catchAsync(async(req,res)=>{
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
        data:{
            email,
            passwordHash: passwordhash,
            phoneNumber
    }})

    if(!newUser){
        return console.log('failed to create new user')
    }

    const token=generateToken(newUser.id,res)

    res.status(201).json({
        status:'success',
        token
    })
})

const login = catchAsync(async(req,res,next)=>{
    const {email,password}=req.body

    if(!email || password){
        return console.log("email and password is required")
    }

    const user= await prisma.user.findUnique({where:{email}})

    if(!user){
        return console.log('incorrect username or password')
    }

    const isCorrect= await bcrypt.compare(password,user.passwordHash)

    if(!isCorrect){
        return console.log('inccorect username or password')
    }

    const token=generateToken(user.id,res)

    res.status(200).json({
        status:'success',
        token
    })

})

const logout= (req,res)=>{
        

     res.clearCookie('token')

     res.status(200).json({status:'success'})
}


module.exports={register,login,logout}