const {prisma}=require('../prisma/client')
const bcrypt=require('bcrypt')
const catchAsync=require('../utils/catchAsync')
const generateToken=require('../utils/genrateToken')
const { ValidationError, ConflictError, 
AppError, unAuhtorizedError } = require('../utils/AppError')


const register=catchAsync(async(req,res,next)=>{

    const {email,password,phoneNumber} = req.body

    if(!email || !password || !phoneNumber){
        return next(new ValidationError('email or phoneNumber or password are required'))
    }

    const existingUser= await prisma.user.findUnique({where:{email}})

    if(existingUser){
        return next(new ConflictError('user already exists'))
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
        return next(new AppError('failed to create new user',400))
    }

    const token=generateToken(newUser.id,res)

    res.status(201).json({
        status:'success',
        token
    })
})

const login = catchAsync(async(req,res,next)=>{
    const {email,password}=req.body

    if(!email || !password){
        return next(new ValidationError('email or password is required'))
    }

    const user= await prisma.user.findUnique({where:{email}})

    if(!user){
        return next(new unAuhtorizedError('incorrect username or password'))
    }

    const isCorrect= await bcrypt.compare(password,user.passwordHash)

    if(!isCorrect){
         return next(new unAuhtorizedError('incorrect username or password'))
    }

    const token=generateToken(user.id,res)

    res.status(200).json({
        status:'success',
        token
    })

})

const logout= (req,res)=>{ 

     res.clearCookie('refreshToken')
     res.status(200).json({status:'success'})
}


module.exports={register,login,logout}