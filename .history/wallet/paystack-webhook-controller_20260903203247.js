const paystack=require('../utils/paystack')
const walletService=require('../wallet/wallet-service')
const crypto=require('crypto')
const transactionService=require('../Transaction/transaction-service')

exports.paystackWebhook=async(req,res)=>{

    const hash= crypto.createHmac('sha512',process.env.PAYSTACK_SECRET_KEY)
    .update(req.rawBody).digest('hex')

    if(hash !== req.headers['x-paystack-signature']){
        return res.status(401).send('invalid signature')
    }

    const event=req.body

    if(event.event == 'success'){

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
        
      let walletbal=wallet.balance
         walletbal= walletbal + amount

     const wallet= await walletService.updateWallet(walletId,{balance:walletbal})
            
       transaction.status='SUCCESS'

    }

    const transaction=await transactionService.getTransactionByReference(event.data.reference)
    transaction.status='FAILED'
      


}