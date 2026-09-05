const userService=require('./user-service')

exports.createUser= async (req,res)=>{
    try{
      const user= await userService.createUser(req.body)
      res.status(201).json({status:'success', user})
    }catch(err){
          res.status(400).json({status:'error',message:err.message})
    }
}

exports.getUser= async (req,res)=>{
    try{
      const user= await userService.getUser(parseInt(req.params.id))
      res.status(200).json({status:'success', user})
    }catch(err){
          res.status(400).json({status:'error',message:err.message})
    }
}
exports.getUsers= async (req,res)=>{
    try{
      const users= await userService.getAllUsers()
      res.status(200).json({status:'success', data:users})
    }catch(err){
          res.status(400).json({status:'error',message:err.message})
    }
}

exports.updateUser= async (req,res)=>{
    try{
      const user= await userService.updateUser(parseInt(req.params.id),req.body,req.user.id)
      res.status(200).json({status:'success', user})
    }catch(err){
          res.status(400).json({status:'error',message:err.message})
    }
}

exports.deleteUser=async (req,res)=>{
    try{
       const user= await userService.deleteUser(parseInt(req.params.id))
       res.status(204).json({status:'success',data:null})
    }catch(err){
           res.status(400).json({status:'error',message:err.message})
    }
}

