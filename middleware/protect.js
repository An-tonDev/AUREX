const { unAuhtorizedError, NotFoundError } = require("../utils/AppError")
const jwt=require('jsonwebtoken')
const UserService=require('../User/user-service')
const catchAsync=require('../utils/catchAsync')



const protect= catchAsync( async (req,res,next)=>{
 let token=null

 if(req.headers.authorization && req.headers.authorization.startsWith('bearer')){
     token= req.headers.authorization.split(' ')[1]
 }
 else if(req.cookies.jwt){
    token=req.cookies.jwt
 }

 if(!token){
    return next(new unAuhtorizedError('you do not have permission ot access this route'))
 }
 
    const decoded= jwt.verify(token, process.env.JWT_SECRET)

    if(!decoded){
        return next(new unAuhtorizedError('token has expired please log in again'))
    }

    const user= await UserService.getUser(decoded.id)

    if(!user){
           return next(new NotFoundError('user does not exist'))
    }

    req.user=user
    next()
})

  module.exports=protect