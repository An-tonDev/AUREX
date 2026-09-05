const userService=require('./user-service')

const createUser= async (req,res)=>{
    try{
      const user= await userService.createUser(req.body)
      res.status(201).json({status:'success', user})
    }catch(err){
          res.status(400).json({status:'error',err})
    }
}

const getUser= async (req,res)=>{
    try{
      const user= await userService.getUser(parseInt(req.params.id))
      res.status(201).json({status:'success', user})
    }catch(err){
          res.status(400).json({status:'error',err})
    }
}

const updateUser= async (req,res)=>{
    try{
      const user= await userService.updateUser(parseInt(req.params.id),req.body)
      res.status(201).json({status:'success', user})
    }catch(err){
          res.status(400).json({status:'error',message:err.message})
    }
}

const deleteUser=(req,res)=>{
    try{
       const user= await userService.deleteUser(parseInt(req.params.id))
       res.status(204).json({status:'success',data:null})
    }catch(err){
           res.status(400).json({status:'error',message:err.message})
    }
}