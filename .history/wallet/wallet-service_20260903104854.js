const { NotFoundError } = require('../utils/AppError')
const walletRepository=require('./wallet-repository')
const paystack=require('../utils/paystack')
const transactionService=require('../Transaction/transaction-service')
const userService=require('../User/user-service')


const addBalance=async(id,data,user)=>{

  //get wallet
const wallet= getWallet(id)
//email
const email=userService.getUserByEmail(user.email)
 // store payment reference
const paymentReference=`txn_${wallet.id}_${Date.now()}`

//intialize paystack with mail,amount in kobo,reference and a callbackurl

  const paystackResponse= await paystack.post('/transaction/initialize',{
    email:email,
    amount: data.amount*100,
    paymentReference: paymentReference,
    callbackUrl:'http://localhost:6500/public/success.html'
  })
      
  return {paystackResponse,wallet}
  //create webook controller where the update wallet is done after payment confirmed
            
}

const getWallet=async (id)=>{
    const wallet= await walletRepository.getWallet(id)

    if(!wallet){
        throw new NotFoundError('wallet does not exist')
    }

    return wallet
}

const updateWallet=async(id,data)=>{

    getWallet(id)

    await walletRepository.updateWallet(id,data)

}

module.exports={addBalance,updateWallet}