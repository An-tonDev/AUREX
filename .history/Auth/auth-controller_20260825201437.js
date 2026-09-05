const {prisma}=require('../prisma/client')
const bcrypt=require('bcrypt')
const catchAsync=require('../utils/catchAsync')
const generateToken=require('../utils/genrateToken')
const { ValidationError, ConflictError, 
AppError, unAuhtorizedError, 
ForbiddenError} = require('../utils/AppError')
const sessionService=require('./session/session-service')
const UAparser=require('ua-parser-js')



const getDeviceName=(req)=>{
    const parser= new UAparser(req.headers['User-agent'])

    const{browser, device,os} = parser.getResult()
        
    let deviceName

    if(device.model){
        deviceName= `${device.vendor}`? `${device.vendor} ${device.model}` : `${device.model}`
    }else if(device.type){
        deviceName= `${device.type} ${os.name}`
    }else if(browser){
        deviceName=`${browser.name} on ${os.name}`
    }

    return deviceName
}

const getIpAddress=(req)=>{
    return req.ip || req.connection.remoteAddress
}

const createSessionSendToken=(user,req,res,statusCode)=>{
                  
    const{accesstoken,refreshToken}=generateToken(user.id,res)


    const refreshTokenHash= await bcrypt.hash(refreshToken,10)

    const ipAddress=getIpAddress(req)

    const deviceName= getDeviceName(req)

       const newSession= await  sessionService.createSession({
             userId: newUser.id,
             refreshTokenHash,
             deviceName,
             ipAddress,
             expiresAt: Date.now() + 7*24*60*60*1000
})

    res.status(statusCode).json({
        status:'success',
        accesstoken
    })
}

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
        createSessionSendToken(newUser,req,res,201)

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

    createSessionSendToken(user,req,res,200)
})


const logout= catchAsync(async(req,res)=>{ 

     const {refreshToken}=req.cookies

    if(refreshToken){
          const hashRefreshToken= await bcrypt.hash(refreshToken,10)
           await sessionService.deleteSession(hashRefreshToken)
       }

     res.clearCookie('refreshToken')

     res.status(200).json({status:'success'})
})

const restrictTo=(...roles)=>{
     return(req,res,next)=>{
        if(!roles.includes(req.user.role)){
            return next(new ForbiddenError('you do not have permussion to access this route'))
        }
     }
}


module.exports={register,login,logout,restrictTo}