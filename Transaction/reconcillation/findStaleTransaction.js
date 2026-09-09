const {prisma}=require('../../prisma/client')

const findStaleTransactions=async()=>{
    const cutoff= new Date(Date.now()-30*60*60*1000)

    await prisma.transaction.findMany({
        where:{
            status:'PENDING',
            type:'DEPOSIT',
            createdAt:{lt:cutoff}
        }
    })
}


module.exports=findStaleTransactions