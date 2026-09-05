const userRepository=require('./user-repository')

const createUser=async (data) =>{
    const user= await userRepository.findUserByEmail(data.email)
    if(user){
        throw new Error('user already exists')
    }
    return await userRepository.createUser(data)
}


const getUser=async(id)=>{
    const user= await userRepository.findUserById(id)

    if(!user){
        throw new Error('user does not exist')
    }
    return user
}

const deleteUser= async (id)=>{
     getUser(id)
     return await userRepository.deleteUser(id)
}

const updateUser= async (id,data)=>{
    getUser(id)
    return await userRepository.updateUser(id,data)
}

const getAllUsers= async()=>{
    return await userRepository.getAllUsers()
}


module.exports={
    updateUser,createUser,deleteUser,getUser
}