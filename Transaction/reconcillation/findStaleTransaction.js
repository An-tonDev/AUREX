const {prisma}=require('../../prisma/client')

const findStaleTransactions=async()=>{
    const cutoff= new Date(Date.now()-30*60*1000)

   return await prisma.transaction.findMany({
        where:{
            status:'PENDING',
            type:'DEPOSIT',
            createdAt:{lt:cutoff}
        }
    })
}


module.exports=findStaleTransactions