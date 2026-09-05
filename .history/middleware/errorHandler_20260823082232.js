module.exports=(err,req,res,next)=>{
    err.statusCode= this.statusCode || 500
    err.status=this.status || 'fail'

    res.status(statusCode).json({
        status:'fail',
        message: err.message
    })
}