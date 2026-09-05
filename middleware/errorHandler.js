module.exports=(err,req,res,next)=>{
    err.statusCode= this.statusCode || 500
    err.status=this.status || 'fail'

    //DEVELOPMENT

    if(process.env.NODE_ENV==='development'){
        res.status(err.statusCode).json({
            status: err.status || 'fail',
            message: err.message,
            error: err,
            stack: err.stack
        })
    }

    //2025 Prisma not found

    if(this.code === 'P2025'){
        res.status(404).json({
            status:'fail',
            message: 'resource not found'
        })
    }

    //2002 duplication error Prisma

    if(this.code === 'P2002'){
        res.status(409).json({
            status:'fail',
            message:`${err.meta?.target} already exists`
        })
    }

    //prisma not null error
    
    if(this.code === 'P2011'){
        res.status(400).json({
            status:'fail',
            message: `${err.meta?.target} cannot be null`
        })
    }

    //prisma foreign field does not exist

    if(this.code === 'P2003'){
        res.status(400).json({
            status:'fail',
            message: 'field you are trying to reference does not exist'
        })
    }

    //JWTEXPIREDERROR

    if(this.name === 'TokenExpiredError'){
        res.status(401).json({
            status:'fail',
            message:'session has expired, log in'
        })
    }

    //JWT INVALID
    if(this.name === 'JsonWebTokenError'){
        res.status(401).json({
            status:'fail',
            message:'invalid token, log in again'
        })
    }
   
    res.status(err.statusCode).json({
        status:'fail',
        message: err.message
    })
}