const prisma=require('../prisma/client')


const getTransaction=async (id)=>{

    return await prisma.transaction.findUnique({where:{id}})

}

const createTransaction=async(data)=>{
    return await prisma.transaction.create({data})
}

const updateTransaction=async(id,data)=>{
    return await prisma.transaction.update({where:{id},data})
}

const deleteTransaction=async(id)=>{
    return await prisma.transaction.delete({where:{id}})
}

  module.exports={createTransaction,deleteTransaction,getTransaction,updateTransaction}
