const prisma=require('../prisma/client')

const createUser=async (data)=>{
    return await prisma.user.create({data})
}

const deleteUser=async (id)=>{
    return await prisma.user.delete({where: {id}})
}
const updateUser=async (id,data)=>{
    return await prisma.user.update({where: {id}, data})
}
const findUserById=async (id)=>{
    return await prisma.user.findById({where:{id}})
}
const findUserByEmail=async (email)=>{
    return await prisma.user.findUnique({where:{email}})
}
const findAllUsers=async ()=>{
    return await prisma.user.findMany()
}

module.exports={
    findAllUsers,findUserByEmail,findUserById,deleteUser,createUser,updateUser
}