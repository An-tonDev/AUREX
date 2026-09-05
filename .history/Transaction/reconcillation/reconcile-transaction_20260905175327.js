const { NotFoundError } = require('../../utils/AppError')
const paystack=require('../../utils/paystack')
const walletService=require('../../wallet/wallet-service')
const prisma=require('../../prisma/client')
const transactionService=require('../../Transaction/transaction-service')

const reconcileTransaction=async(transaction)=>{

    const response= await paystack.get(`/transaction/verify/${transaction.reference}`)
    const payStackStatus= response.data.data.status
    const amount=transaction.amount

    if(payStackStatus === 'Success'){

        const walletId= transaction.receiverWalletId

        const wallet= await walletService.getWallet(walletId)
        
         if(!wallet){
            return next (new NotFoundError('wallet not found'))
         }
         
         await prisma.$transaction([
             prisma.transaction.update({
                    where:{id:transaction.id},
                    data:{status:'SUCCESS'}
                 }),
             prisma.wallet.update({
                    where:{id:walletId},
                    data:{balance:wallet.balance +amount }
                 }),
              prisma.ledgerEntry.createMany({
                data:[
                {
                transactionId: transaction.id,
                  walletId: transaction.senderWalletId,
                  type:'DEBIT',
                  currency:'NGN',
                  amount: amount
                },
                {
                  transactionId: transaction.id,
                  walletId: transaction.receiverWalletId,
                  type:'CREDIT',
                  currency:'NGN',
                  amount:amount
                }
              ]
           })
         ])
         console.log(`${transaction.reference} has been successfully completed`)
    }else if(payStackStatus === 'failed' || payStackStatus ==='abandoned'){
        await transactionService.updateTransaction(transaction.id,{status:'FAILED'})
        console.log(` reconciled ${transaction.reference} but it was failed`)
    }else{
          console.log(`${transaction.reference} is pending on paystack side`)
    }

}

module.exports=reconcileTransaction