const jwt= require('jsonwebtoken')

const generateToken=(userId,req,res)=>{
     
    const token= jwt.sign({_id:userId},process.env.JWT_SECRET,
        {expiresIn: process.env.JWT_EXPIRES})
    
    res.cookie('jwt',token,{
        httpOnly:true,
        sameSite:'strict',
        headers:{'Content-Type':'application/json'},
        maxAge: 60*60*24*5*1000
    })
     
    return token
      
    
}