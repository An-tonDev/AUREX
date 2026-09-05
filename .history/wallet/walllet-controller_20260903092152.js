const walletService=require('./wallet-service')
const catchAsync=require('../utils/catchAsync')

exports.addBalance= async(req,res,next)=>{
     try{
       const response=await walletService.addBalance(req.body,req.user)
       res.status(200).json({
        status:'success',
        data:{
          url: response.data.data.authorizationUrl
        }
       })
     }catch(error){
        res.status(400).json({
            status:'fail',
            message: error
        })
     }
     next()
}