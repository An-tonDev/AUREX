const walletService=require('./wallet-service')


exports.addBalance=async (req,res)=>{
    try{
      const wallet= await walletService.addBalance(parseInt(req.params.id),req.body)
      res.status(200).json({status:'success',data:wallet})
    }catch(error){
        res.status(400).json({status:'error', message: error})
    }
}