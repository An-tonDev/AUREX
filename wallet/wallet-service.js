const { NotFoundError, AppError } = require('../utils/AppError')
const walletRepository=require('./wallet-repository')
const paystack=require('../utils/paystack')
const transactionService=require('../Transaction/transaction-service')
const userService=require('../User/user-service')
const bcrypt=require('bcrypt')

const addBalance=async(id,data,user)=>{

  //get wallet
const wallet= await getWallet(id)
 // store payment reference
const paymentReference=`txn_${wallet.id}_${Date.now()}`

const paystackResponse= await paystack.post('/transaction/initialize',{
    email:user.email,
    amount: data.amount*100,
    reference: paymentReference,
    callback_url:'http://localhost:6500/public/success.html'
  })

 await transactionService.createTransaction({
    senderWalletId:parseInt(process.env.SYSTEM_WALLET_ID),
    receiverWalletId:wallet.id,
    amount:data.amount*100,
    currency:'NGN',
    reference: paymentReference,
    type:'DEPOSIT'
  })
      
  return {paystackResponse,wallet}           
}

const withdrawFunds= async(id,data,user)=>{
   //get wallet, amd necccessary details, and then call paystack and do a new transaction
   const wallet= await getWallet(id)

   const paymentReference= `txn_${wallet.id}_${Date.now()}`

   if(wallet.pinHash !== data.pin){
      throw new AppError('incorrect pin',401)
   }

    if(data.amount > wallet.balance){
      throw new AppError('insufficient funds',400)
    }
  
    const paystackResponse= await paystack.post('/transaction/initialize',{
    email:user.email,
    amount:data.amount*100,
    reference: paymentReference,
    callback_url:'http://localhost:6500/public/success.html'
   })

   await transactionService.createTransaction({
    senderWalletId:wallet.id ,
    receiverWalletId:parseInt(process.env.SYSTEM_WALLET_ID),
    currency:'NGN',
    amount:data.amount,
    type:'WITHDRAWAL',
    reference:paymentReference
   }) 
    return{paystackResponse,wallet}
}

const getWallet=async (id)=>{
    const wallet= await walletRepository.getWallet(id)

    if(!wallet){
        throw new NotFoundError('wallet does not exist')
    }

    return wallet
}

const updateWallet=async(id,data)=>{

   const wallet= await getWallet(id)
    
  return await walletRepository.updateWallet(wallet.id,data)
    
}

module.exports={addBalance,updateWallet,getWallet,withdrawFunds}