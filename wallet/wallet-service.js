const { NotFoundError } = require('../utils/AppError')
const walletRepository=require('./wallet-repository')
const paystack=require('../utils/paystack')
const transactionService=require('../Transaction/transaction-service')
const userService=require('../User/user-service')


const addBalance=async(id,data,user)=>{

  //get wallet
const wallet= await getWallet(id)
//email
const email= await userService.getUserByEmail(user.email)
 // store payment reference
const paymentReference=`txn_${wallet.id}_${Date.now()}`

const paystackResponse= await paystack.post('/transaction/initialize',{
    email:email.email,
    amount: data.amount*100,
    reference: paymentReference,
    callback_url:'http://localhost:6500/public/success.html'
  })

   const transaction= transactionService.createTransaction({
    senderWalletId:`SYSTEM-${wallet.id}`,
    receiverWalletId:wallet.id,
    amount:data.amount*100,
    currency:'NGN',
    reference: paymentReference,
    type:'DEPOSIT'
  })
      
  return {paystackResponse,wallet}           
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

module.exports={addBalance,updateWallet,getWallet}