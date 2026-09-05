const prisma=require('../../prisma/client')

const createSession= async(data)=>{
   return await prisma.session.create({data})
}

const updateSession=async(id,data)=>{
   return await prisma.session.update({where:{id},data})
}

const deleteSession=async(id)=>{
    return await prisma.session.delete({where:{id}})
}

const getSession=async(id)=>{
    return await prisma.session.findUnique({where:{id}})
}