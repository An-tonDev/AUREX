const jwt= require('jsonwebtoken')

const generateToken=(userId,res)=>{
     
    const token= jwt.sign({_id:userId},process.env.JWT_SECRET,
        {expiresIn: process.env.JWT_EXPIRES})
    
    res.cookie('jwt',token,{
        httpOnly:true,
        sameSite:'strict',
        maxAge: 60*60*24*5*1000
    })
     
    return token
      
}

module.exports=generateToken