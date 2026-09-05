const prisma=require('../../prisma/client')

const createSession= async(data)=>{
   return await prisma.session.create({data})
}

const updateSession=async(id,data)=>{
   return await prisma.session.update({where:{id},data:data})
}

const deleteSession=async(id)=>{
    return await prisma.session.delete({where:{id}})
}

const getSessionByRefreshToken=async(refreshTokenHash)=>{
    return await prisma.session.findFirst({where:{refreshTokenHash}})
}

module.exports={updateSession,getSessionByRefreshToken,createSession,deleteSession}