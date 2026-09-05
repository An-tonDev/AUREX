const paystack=require('../utils/paystack')
const walletService=require('../wallet/wallet-service')
const crypto=require('crypto')
const transactionService=require('../Transaction/transaction-service')
const prisma=require('../prisma/client')

exports.paystackWebhook=async(req,res)=>{

    const hash= crypto.createHmac('sha512',process.env.PAYSTACK_SECRET_KEY)
    .update(req.rawBody).digest('hex')

    if(hash !== req.headers['x-paystack-signature']){
        return res.status(401).send('invalid signature')
    }

    const event=req.body

    if(event.event == 'charge.success'){
     await handleSuccessfulEvent(event)
    }else if(event.event == 'charge.failed'){
      handleFailedEvent(event)
    }

      const handleSuccessfulEvent=async(event)=>{ 

      const amount= event.data.amount
      const reference= event.data.reference
      
      const transaction= await transactionService.getTransactionByReference(reference)

     if(!transaction){
        console.log('transaction with this reference does not exist')
       return res.sendStatus(200)
     }

     const walletId=parseInt(reference.split('_')[1])

     const wallet= await walletService.getWallet(walletId)

      if(!wallet){
        console.log('wallet witht his id does not exist')
        return res.sendStatus(200)
      }
           //transactional postgres..begin..commit
      await prisma.$transactional([
              prisma.transaction.update({
                where:{
                  id:transaction.id,
                  status:'SUCCESS'
                }
              }),
              prisma.wallet.update({
                where:{
                 id:walletId,
                  balance: wallet.balance + amount
                }
              }),
              prisma.ledgerEntry.createMany({
                data:[
                  {
                  transactionId: transaction.id,
                  walletId: transaction.senderWalletId,
                  type:'DEBIT',
                  currency:'NGN',
                  amount:transaction.amount
                },
                {
                  transactionId: transaction.id,
                  walletId: transaction.receiverWalletId,
                  type:'CREDIT',
                  currency:'NGN',
                  amount:transaction.amount
                }
                ]
              })
      ])
    }
    const handleFailedEvent=async(event)=>{
    const transaction=await transactionService.getTransactionByReference(event.data.reference)
    transaction.status='FAILED'
    return res.sendStatus(200)
      }
}