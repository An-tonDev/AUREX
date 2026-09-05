const prisma=require('../prisma/client')


const getWallet=async (id)=>{

    return await prisma.wallet.findUnique({where:{id}})

}

const createWallet=async(data)=>{
    return await prisma.wallet.create({data})
}

const updateWallet=async(id,data)=>{
    return await prisma.wallet.update({where:{id},data})
}

const deleteWallet=async(id)=>{
    return await prisma.wallet.delete({where:{id}})
}

  module.exports={createWallet,deleteWallet,getWallet,updateWallet}
