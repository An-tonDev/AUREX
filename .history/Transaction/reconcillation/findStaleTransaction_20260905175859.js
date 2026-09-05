const prisma=require('../../utils/paystack')

const findStaleTransactions=async()=>{
    const cutoff= new Date(Date.now()-10*60*60*1000)

    await prisma.transaction.findMany({
        where:{
            status:'PENDING',
            type:'DEPOSIT',
            createdAt:{lt:cutoff}
        }
    })
}


module.exports=findStaleTransactions