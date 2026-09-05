const jwt= require('jsonwebtoken')

const generateToken=(userId,res)=>{
     
    const accesstoken= jwt.sign({_id:userId},process.env.JWT_SECRET,
        {expiresIn: process.env.JWT_EXPIRES})
        
    const refreshToken=jwt.sign({_id:userId},process.env.REFRESH_SECRET,
        {expiresIn: process.env.REFRESH_TOKEN_EXPIRES})
    
    res.cookie('refreshToken',refreshToken,{
        httpOnly:true,
        sameSite:'strict',
        maxAge: 60*60*24*5*1000
    })
     
    return {
        accesstoken,
        refreshToken 
    }
      
}


module.exports=generateToken