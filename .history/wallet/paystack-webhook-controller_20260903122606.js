const paystack=require('../utils/paystack')
const walletService=require('../wallet/wallet-service')
const crypto=require('crypto')

exports.paystackWebhook=async(req,res)=>{
    const hash= crypto.createHmac('sha512',process.env.PAYSTACK_SECRET_KEY)
    .update(JSON.stringify(req.body)).digest('hex')

    if(hash !== req.headers['x-paystack-signature']){
        return res.status(401).send('invalid signature')
    }

    const event=req.body

    if(event.event == 'success'){

        const amount= event.data.amount/100
        const reference= event.data.reference
           
      const walletId=reference.split('_')[1]

      const wallet= await walletService.getWallet(walletId)
        
      const walletbal=wallet.balance
         walletbal= walletbal + amount

      await walletService.updateWallet(walletId,{balance:walletbal})

        wallet.save()

        //create a transaction[not done this coz i feel there is a problem with the database itself regarding
        //the sender wallet and receiverwallet compulsory field coz it only works with transfer]
        //for this deposit now it does not work, even withdrawal, even airtime]
    }

}